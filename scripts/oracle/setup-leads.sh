#!/usr/bin/env bash
# ------------------------------------------------------------------
#  Banco de leads do maldivastech.dev na VM Oracle (roda NA VM).
#
#  Idempotente: rodar de novo atualiza schema/serviço sem perder dados
#  nem trocar segredos. Isolado do MercadinhoSys: banco, papéis e
#  container próprios; só compartilha o PostgreSQL e o Caddy.
#
#  1. banco maldivas_site + schema/papéis (leads-schema.sql)
#  2. PostgREST (container maldivas-leads, 64 MB) na rede do compose
#  3. Caddy: maldivas-leads.<ip>.sslip.io -> HTTPS automático
#     (valida antes de recarregar; se falhar, restaura o Caddyfile)
#  4. backup diário (pg_dump, 14 dias) via cron
#
#  Saída: linhas ORACLE_LEADS_URL= e ORACLE_LEADS_JWT_SECRET= para o
#  deploy-leads.ps1 gravar no .env local e na Vercel.
# ------------------------------------------------------------------
set -euo pipefail
umask 077

HERE="$(cd "$(dirname "$0")" && pwd)"
APP=/home/ubuntu/mercadinhosys/infra/oracle
STATE=/home/ubuntu/maldivas-leads
DOCKER="sudo docker"
DB=maldivas_site
SERVICE=maldivas-leads
IMAGE=postgrest/postgrest:v12.2.3

log() { echo "[leads] $*" >&2; }
trap 'log "ERRO na linha $LINENO: $BASH_COMMAND"' ERR

mkdir -p "$STATE"

# ---------- segredos (gerados uma vez, reaproveitados depois) ----------
if [ ! -f "$STATE/secrets.env" ]; then
  log "gerando segredos"
  {
    echo "AUTH_PASSWORD=$(openssl rand -hex 24)"
    echo "JWT_SECRET=$(openssl rand -hex 32)"
  } > "$STATE/secrets.env"
fi
# shellcheck disable=SC1091
. "$STATE/secrets.env"

# senha do superusuário do compose (para psql via TCP; funciona com o
# banco local e com o encaminhador do modo db-split)
DB_PASSWORD="$(grep -E '^DB_PASSWORD=' "$APP/.env.demo" | head -1 | cut -d= -f2- | tr -d '"'"'")"
[ -n "$DB_PASSWORD" ] || { log "DB_PASSWORD não encontrado em $APP/.env.demo"; exit 1; }

# ---------- containers do compose ----------
PG="$($DOCKER ps --filter label=com.docker.compose.service=postgres --format '{{.Names}}' | head -1)"
CADDY="$($DOCKER ps --filter label=com.docker.compose.service=caddy --format '{{.Names}}' | head -1)"
[ -n "$PG" ] && [ -n "$CADDY" ] || { log "postgres/caddy do compose não estão rodando"; exit 1; }
NET="$($DOCKER inspect -f '{{range $k, $v := .NetworkSettings.Networks}}{{$k}}{{"\n"}}{{end}}' "$PG" | head -1)"
CADDY_NET="$($DOCKER inspect -f '{{range $k, $v := .NetworkSettings.Networks}}{{$k}}{{"\n"}}{{end}}' "$CADDY" | head -1)"
log "postgres=$PG caddy=$CADDY rede=$NET"

psql_su() { $DOCKER exec -i -e PGPASSWORD="$DB_PASSWORD" "$PG" psql -v ON_ERROR_STOP=1 -qAt -h 127.0.0.1 -U mercadinho_user "$@"; }

# ---------- 1. banco + schema ----------
if [ "$(psql_su -d mercadinhosys -c "SELECT 1 FROM pg_database WHERE datname = '$DB'")" != "1" ]; then
  log "criando banco $DB"
  psql_su -d mercadinhosys -c "CREATE DATABASE $DB"
fi
psql_su -d "$DB" -c "REVOKE ALL ON DATABASE $DB FROM PUBLIC"
log "aplicando schema"
psql_su -d "$DB" < "$HERE/leads-schema.sql"
psql_su -d "$DB" -c "ALTER ROLE maldivas_authenticator PASSWORD '$AUTH_PASSWORD'; GRANT CONNECT ON DATABASE $DB TO maldivas_authenticator;"

# ---------- 2. PostgREST ----------
{
  echo "PGRST_DB_URI=postgres://maldivas_authenticator:$AUTH_PASSWORD@postgres:5432/$DB"
  echo "PGRST_DB_SCHEMAS=site"
  echo "PGRST_DB_ANON_ROLE=site_anon"
  echo "PGRST_JWT_SECRET=$JWT_SECRET"
  echo "PGRST_DB_POOL=3"
  echo "PGRST_DB_MAX_ROWS=1000"
  echo "PGRST_OPENAPI_MODE=disabled"
  echo "PGRST_SERVER_PORT=3000"
  echo "PGRST_LOG_LEVEL=warn"
} > "$STATE/postgrest.env"

log "subindo $SERVICE ($IMAGE)"
$DOCKER pull -q "$IMAGE" >/dev/null
$DOCKER rm -f "$SERVICE" >/dev/null 2>&1 || true
$DOCKER run -d --name "$SERVICE" --restart unless-stopped \
  --network "$NET" --memory 64m --memory-swap 96m \
  --log-opt max-size=5m --log-opt max-file=2 \
  --env-file "$STATE/postgrest.env" "$IMAGE" >/dev/null
if [ "$CADDY_NET" != "$NET" ]; then $DOCKER network connect "$CADDY_NET" "$SERVICE"; fi

# espera o PostgREST responder (qualquer status HTTP serve: ele está de pé)
for _ in $(seq 1 30); do
  $DOCKER exec "$CADDY" wget -S -q -O /dev/null "http://$SERVICE:3000/leads" 2>&1 | grep -q "HTTP/" && break
  sleep 1
done

# ---------- 3. Caddy ----------
CADDYFILE="$($DOCKER inspect -f '{{range .Mounts}}{{if eq .Destination "/etc/caddy/Caddyfile"}}{{.Source}}{{end}}{{end}}' "$CADDY")"
HOST_SUFFIX="$(grep -oE '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+\.sslip\.io' "$CADDYFILE" | head -1)"
[ -n "$HOST_SUFFIX" ] || HOST_SUFFIX="$(curl -s https://ifconfig.me).sslip.io"
HOST="$SERVICE.$HOST_SUFFIX"

if ! grep -q "^$HOST" "$CADDYFILE"; then
  log "registrando $HOST no Caddy"
  cp "$CADDYFILE" "$STATE/Caddyfile.antes-$(date -u +%Y%m%dT%H%M%SZ)"
  BACKUP="$(ls -t "$STATE"/Caddyfile.antes-* | head -1)"
  # >> preserva o inode do arquivo montado (bind mount de arquivo único)
  cat >> "$CADDYFILE" <<EOF

# leads do maldivastech.dev (PostgREST) — scripts/oracle/setup-leads.sh
$HOST {
    encode gzip
    header -Server
    reverse_proxy $SERVICE:3000
}
EOF
  if ! $DOCKER exec "$CADDY" caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null 2>&1 \
     || ! $DOCKER exec "$CADDY" caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null 2>&1; then
    log "Caddy recusou a config; restaurando"
    cat "$BACKUP" > "$CADDYFILE"
    $DOCKER exec "$CADDY" caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null 2>&1 || true
    exit 1
  fi
fi

# ---------- 4. backup diário ----------
cat > "$STATE/backup.sh" <<EOF
#!/usr/bin/env bash
set -euo pipefail
umask 077
mkdir -p $STATE/backups
out=$STATE/backups/$DB-\$(date -u +%Y%m%dT%H%M%SZ).dump
sudo docker exec -e PGPASSWORD='$DB_PASSWORD' \$(sudo docker ps --filter label=com.docker.compose.service=postgres --format '{{.Names}}' | head -1) \\
  pg_dump -h 127.0.0.1 -U mercadinho_user -d $DB --format=custom > "\$out.partial"
test -s "\$out.partial" && mv "\$out.partial" "\$out"
find $STATE/backups -name '$DB-*.dump' -mtime +14 -delete
EOF
chmod 700 "$STATE/backup.sh"
# usuário sem crontab: "crontab -l" e o grep saem com 1 — esperado, não é erro
{ crontab -l 2>/dev/null | grep -v "$STATE/backup.sh" || true
  echo "30 3 * * * $STATE/backup.sh >> $STATE/backup.log 2>&1"; } | crontab -
"$STATE/backup.sh"
log "backup ok: $(ls -t "$STATE"/backups | head -1)"

# ---------- verificação ponta a ponta ----------
URL="https://$HOST"
for _ in $(seq 1 30); do
  code="$(curl -s -o /dev/null -w '%{http_code}' "$URL/leads" || true)"
  [ "$code" = "401" ] || [ "$code" = "403" ] && break
  sleep 2
done
log "sem token -> HTTP $code (esperado 401/403: banco fechado para anônimos)"
[ "$code" = "401" ] || [ "$code" = "403" ] || { log "HTTPS ainda não respondeu como esperado"; exit 1; }

echo "ORACLE_LEADS_URL=$URL"
echo "ORACLE_LEADS_JWT_SECRET=$JWT_SECRET"
