@echo off
chcp 65001 >nul
title Publicar portfolio - Maldivas Tech Solutions

echo.
echo  ============================================================
echo    MALDIVAS TECH SOLUTIONS
echo    Publicar o portfolio novo no GitHub + Vercel
echo  ============================================================
echo.
echo    Repositorio : github.com/MaldivaSky/rafael-maldivas
echo    Site        : rafael-paiva-dev.vercel.app
echo.
echo    O Vercel ja esta conectado nesse repositorio.
echo    Depois do push ele publica sozinho em 1-2 minutos.
echo.
echo  ------------------------------------------------------------
pause

cd /d "%~dp0"

if not exist "app\page.tsx" (
  echo.
  echo  [ERRO] Este arquivo precisa estar DENTRO da pasta rafael-maldivas-main
  echo         Nao encontrei app\page.tsx aqui.
  echo.
  pause
  exit /b 1
)

if exist ".git\index.lock" del /f /q ".git\index.lock" >nul 2>&1

echo.
echo  [1/7] Preparando repositorio local...
if not exist ".git" git init -q
git branch -M main >nul 2>&1
git config user.name  "Rafael Maldivas"
git config user.email "rafaelmaldivas@gmail.com"

echo  [2/7] Apontando para o repositorio remoto...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/MaldivaSky/rafael-maldivas.git

echo  [3/7] Baixando o historico existente (4 commits)...
git fetch origin main
if errorlevel 1 goto :erro_rede

echo  [4/7] Adotando o historico sem apagar seus arquivos novos...
git reset --soft origin/main
if errorlevel 1 goto :erro

echo  [5/7] Preparando os arquivos alterados...
git add -A

echo  [6/7] Criando o commit...
git commit -m "feat: reposicionamento Maldivas Tech Solutions - site bilingue PT/EN, case studies por produto, dados da empresa (CNPJ) e JSON-LD"
if errorlevel 1 (
  echo         Nada mudou em relacao ao que ja esta no GitHub.
  echo         Nao ha o que publicar.
  echo.
  pause
  exit /b 0
)

echo  [7/7] Enviando para o GitHub...
git push origin main
if errorlevel 1 goto :erro_push

echo.
echo  ============================================================
echo    PUBLICADO.
echo.
echo    Codigo    : https://github.com/MaldivaSky/rafael-maldivas
echo    Deploy    : https://vercel.com/dashboard  (acompanhe o build)
echo    Site novo : https://rafael-paiva-dev.vercel.app
echo.
echo    O Vercel detecta o push e publica em 1-2 minutos.
echo  ============================================================
echo.
pause
start "" "https://rafael-paiva-dev.vercel.app"
exit /b 0

:erro_rede
echo.
echo  [ERRO] Nao consegui alcancar o GitHub.
echo         Verifique a internet, ou se o Git pediu login.
echo.
pause
exit /b 1

:erro_push
echo.
echo  [ERRO NO PUSH]
echo.
echo  Se pediu usuario e senha: o GitHub nao aceita mais senha comum.
echo  Voce precisa de um Personal Access Token:
echo    1. https://github.com/settings/tokens
echo    2. "Generate new token (classic)"
echo    3. Marque o escopo  repo
echo    4. Copie o token e cole no lugar da senha
echo.
echo  Alternativa mais simples: instale o GitHub CLI e rode
echo    winget install GitHub.cli
echo    gh auth login
echo  e execute este arquivo de novo.
echo.
pause
exit /b 1

:erro
echo.
echo  [ERRO] Falhou acima. Tire print da mensagem e me mande.
echo.
pause
exit /b 1
