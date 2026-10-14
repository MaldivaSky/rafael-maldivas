# ------------------------------------------------------------------
#  Leva o banco de leads do site para a Oracle - um comando so.
#
#    powershell -ExecutionPolicy Bypass -File scripts\oracle\deploy-leads.ps1 `
#      -Server ubuntu@<ip-da-vm> -Key <caminho-da-chave-ssh>
#
#  Repositorio publico: host e chave NUNCA ficam versionados aqui.
#
#  1. envia schema + setup para a VM e executa (idempotente)
#  2. grava ORACLE_LEADS_URL / ORACLE_LEADS_JWT_SECRET em
#     .env.oracle-leads.local (ignorado pelo git; o segredo nao aparece na tela)
#  3. importa os leads do Notion (sem duplicar)
#  4. grava as variaveis na Vercel (producao) e pede o redeploy
#     - se a CLI da Vercel nao estiver logada, mostra o que falta
# ------------------------------------------------------------------
param(
  [Parameter(Mandatory = $true)][string]$Server,
  [Parameter(Mandatory = $true)][string]$Key,
  [string]$VercelScope = "maldivastech",
  [string]$VercelProject = "maldivas-tech-solutions",
  [switch]$SkipVercel
)
$ErrorActionPreference = "Stop"
$Root = (Resolve-Path "$PSScriptRoot\..\..").Path
$Here = $PSScriptRoot
$Ssh = @("-i", $Key, "-o", "BatchMode=yes", "-o", "ConnectTimeout=20", "-o", "StrictHostKeyChecking=accept-new")

function Step($t) { Write-Host "`n==> $t" -ForegroundColor Cyan }

Step "1/4 Enviando scripts para $Server"
& ssh @Ssh $Server "mkdir -p ~/maldivas-leads-src"
if ($LASTEXITCODE -ne 0) { throw "SSH falhou (chave/host)." }
& scp @Ssh "$Here\leads-schema.sql" "$Here\setup-leads.sh" "${Server}:~/maldivas-leads-src/"
if ($LASTEXITCODE -ne 0) { throw "SCP falhou." }

Step "Configurando banco, PostgREST, Caddy e backup na VM"
$out = & ssh @Ssh $Server "sed -i 's/\r$//' ~/maldivas-leads-src/setup-leads.sh && bash ~/maldivas-leads-src/setup-leads.sh"
if ($LASTEXITCODE -ne 0) { throw "setup-leads.sh falhou na VM (veja as linhas [leads] acima)." }
$url = ($out | Where-Object { $_ -like "ORACLE_LEADS_URL=*" } | Select-Object -Last 1) -replace "^ORACLE_LEADS_URL=", ""
$secret = ($out | Where-Object { $_ -like "ORACLE_LEADS_JWT_SECRET=*" } | Select-Object -Last 1) -replace "^ORACLE_LEADS_JWT_SECRET=", ""
if (-not $url -or -not $secret) { throw "A VM nao devolveu URL/segredo." }

Step "2/4 Gravando .env.oracle-leads.local"
$envFile = Join-Path $Root ".env.oracle-leads.local"
Set-Content -Path $envFile -Encoding ascii -Value @("ORACLE_LEADS_URL=$url", "ORACLE_LEADS_JWT_SECRET=$secret")
Write-Host "   URL: $url (segredo gravado no arquivo, nao exibido)"

Step "3/4 Importando leads do Notion"
$envArgs = @("--env", $envFile)
# .env.local do checkout principal (worktrees nao tem o seu proprio)
$mainRoot = Split-Path -Parent (git -C $Root rev-parse --path-format=absolute --git-common-dir)
foreach ($c in @((Join-Path $Root ".env.local"), (Join-Path $mainRoot ".env.local"))) {
  if (Test-Path $c) { $envArgs += @("--env", $c) }
}
& node "$Here\import-notion-leads.mjs" @envArgs
if ($LASTEXITCODE -ne 0) { Write-Warning "Importacao incompleta (NOTION_TOKEN/NOTION_DATABASE_ID ausentes?). Rode de novo depois; nao duplica." }

if ($SkipVercel) { Write-Host "`nPronto (Vercel pulada)."; exit 0 }

Step "4/4 Variaveis na Vercel ($VercelScope/$VercelProject, production)"
$link = Join-Path $env:TEMP "maldivas-vercel-link"
New-Item -ItemType Directory -Force $link | Out-Null
& npx --yes vercel@latest link --yes --project $VercelProject --scope $VercelScope --cwd $link | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Warning "CLI da Vercel sem login. Rode 'npx vercel login' e execute este script de novo,"
  Write-Warning "ou cadastre em Settings > Environment Variables (Production):"
  Write-Warning "  ORACLE_LEADS_URL = $url"
  Write-Warning "  ORACLE_LEADS_JWT_SECRET = (conteudo de .env.oracle-leads.local)"
  exit 1
}
foreach ($pair in @(@("ORACLE_LEADS_URL", $url), @("ORACLE_LEADS_JWT_SECRET", $secret))) {
  & npx --yes vercel@latest env rm $pair[0] production --yes --scope $VercelScope --cwd $link 2>$null | Out-Null
  $pair[1] | & npx --yes vercel@latest env add $pair[0] production --scope $VercelScope --cwd $link | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "Falha ao gravar $($pair[0]) na Vercel." }
}
Write-Host "   variaveis gravadas"
& npx --yes vercel@latest redeploy "https://www.maldivastech.dev" --target production --scope $VercelScope --cwd $link
if ($LASTEXITCODE -ne 0) { Write-Warning "Redeploy automatico falhou: clique em Redeploy no painel da Vercel." }

Write-Host "`nPronto. Leads novos vao para a Oracle; o Notion fica como reserva." -ForegroundColor Green
