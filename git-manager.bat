@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

echo ==========================================
echo    🚀 GESTIONNAIRE GIT - MONITORING ÉNERGIE
echo ==========================================
echo.

:: Vérifier si on est dans un repository Git
if not exist ".git" (
    echo ❌ ERREUR: Ce dossier n'est pas un repository Git!
    echo Veuillez vous assurer d'être dans le bon dossier.
    pause
    exit /b 1
)

:: Menu principal
:menu
cls
echo ==========================================
echo    🚀 GESTIONNAIRE GIT - MONITORING ÉNERGIE
echo ==========================================
echo.
echo Choisissez une action:
echo.
echo [1] 📤 Push rapide (add + commit + push)
echo [2] 📊 Voir le statut Git
echo [3] 📋 Voir l'historique des commits
echo [4] 🔄 Pull depuis GitHub
echo [5] 🌿 Changer de branche
echo [6] 🔧 Configuration Git (première fois)
echo [7] ❌ Quitter
echo.
set /p choice="Votre choix (1-7): "

if "%choice%"=="1" goto push_rapide
if "%choice%"=="2" goto voir_statut
if "%choice%"=="3" goto voir_historique
if "%choice%"=="4" goto pull_github
if "%choice%"=="5" goto changer_branche
if "%choice%"=="6" goto config_git
if "%choice%"=="7" goto quitter
goto menu

:push_rapide
cls
echo ==========================================
echo    📤 PUSH RAPIDE VERS GITHUB
echo ==========================================
echo.

:: Vérifier s'il y a des modifications
git diff --quiet --exit-code
if %errorlevel% equ 0 (
    git diff --cached --quiet --exit-code
    if !errorlevel! equ 0 (
        echo ℹ️  Aucune modification détectée.
        echo.
        pause
        goto menu
    )
)

:: Afficher le statut
echo [1/5] 📋 Vérification du statut...
git status --short
echo.

:: Ajouter tous les fichiers
echo [2/5] ➕ Ajout des fichiers...
git add .
echo ✅ Tous les fichiers ont été ajoutés!
echo.

:: Message de commit
set /p commit_message="[3/5] 💬 Message de commit (Entrée = message auto): "
if "%commit_message%"=="" (
    for /f "tokens=2 delims= " %%i in ('date /t') do set current_date=%%i
    for /f "tokens=1 delims= " %%i in ('time /t') do set current_time=%%i
    set commit_message=Mise à jour du !current_date! à !current_time!
)

:: Commit
echo [4/5] 💾 Création du commit...
git commit -m "%commit_message%"
if %errorlevel% neq 0 (
    echo ❌ Erreur lors du commit!
    pause
    goto menu
)
echo ✅ Commit créé avec succès!
echo.

:: Push
for /f "tokens=*" %%i in ('git branch --show-current') do set current_branch=%%i
echo [5/5] 🚀 Push vers GitHub (branche: %current_branch%)...

:: Vérifier si c'est le premier push
git rev-parse --verify origin/%current_branch% >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔄 Premier push de la branche - configuration upstream...
    git push -u origin %current_branch%
) else (
    git push origin %current_branch%
)

if %errorlevel% equ 0 (
    echo.
    echo ✅ ================================
    echo    SUCCÈS! 🎉
    echo ================================
    echo 📤 Code poussé vers GitHub
    echo 🌐 https://github.com/Christophe72/demo-intensite
    echo 🌿 Branche: %current_branch%
    echo 💬 Message: %commit_message%
    echo.
) else (
    echo.
    echo ❌ ================================
    echo    ERREUR lors du push
    echo ================================
    echo.
    echo 🔍 Solutions possibles:
    echo   • Vérifiez votre connexion internet
    echo   • Si premier push : git push -u origin main
    echo   • Exécutez l'option [4] pour pull d'abord
    echo   • Vérifiez vos identifiants GitHub
    echo   • Pour authentification : utilisez un token GitHub
    echo.
)
pause
goto menu

:voir_statut
cls
echo ==========================================
echo    📊 STATUT GIT
echo ==========================================
echo.
git status
echo.
echo 📋 Résumé:
git status --short
echo.
pause
goto menu

:voir_historique
cls
echo ==========================================
echo    📋 HISTORIQUE DES COMMITS
echo ==========================================
echo.
git log --oneline -10
echo.
echo (Affichage des 10 derniers commits)
echo.
pause
goto menu

:pull_github
cls
echo ==========================================
echo    🔄 PULL DEPUIS GITHUB
echo ==========================================
echo.
for /f "tokens=*" %%i in ('git branch --show-current') do set current_branch=%%i
echo 📥 Récupération depuis GitHub (branche: %current_branch%)...
git pull origin %current_branch%

if %errorlevel% equ 0 (
    echo ✅ Pull réussi!
) else (
    echo ❌ Erreur lors du pull!
)
echo.
pause
goto menu

:changer_branche
cls
echo ==========================================
echo    🌿 CHANGER DE BRANCHE
echo ==========================================
echo.
echo Branches disponibles:
git branch -a
echo.
set /p nouvelle_branche="Nom de la branche (ou 'retour' pour annuler): "
if "%nouvelle_branche%"=="retour" goto menu

git checkout %nouvelle_branche%
if %errorlevel% equ 0 (
    echo ✅ Changement vers la branche '%nouvelle_branche%' réussi!
) else (
    echo ❌ Erreur lors du changement de branche!
)
echo.
pause
goto menu

:config_git
cls
echo ==========================================
echo    🔧 CONFIGURATION GIT
echo ==========================================
echo.
echo Configuration actuelle:
git config --global user.name
git config --global user.email
echo.
echo Voulez-vous configurer Git ? (o/n)
set /p config_choice=""
if /i "%config_choice%"=="o" (
    set /p username="Nom d'utilisateur GitHub: "
    set /p email="Email GitHub: "
    git config --global user.name "!username!"
    git config --global user.email "!email!"
    echo ✅ Configuration mise à jour!
    echo.
    echo 💡 Pour l'authentification, utilisez un token GitHub:
    echo    Settings → Developer settings → Personal access tokens
)
echo.
pause
goto menu

:quitter
cls
echo ==========================================
echo    👋 AU REVOIR!
echo ==========================================
echo.
echo Merci d'avoir utilisé le gestionnaire Git!
echo Votre application de monitoring énergétique est à jour.
echo.
echo 🌐 Repository: https://github.com/Christophe72/demo-intensite
echo 🔋 Application: Monitoring IoT avec Next.js
echo.
pause
exit /b 0
