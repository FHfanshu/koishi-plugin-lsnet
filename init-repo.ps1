# Koishi LSNet Plugin - Repository Initialization Script
# 姝よ剼鏈府鍔╁垵濮嬪寲 Git 浠撳簱骞舵洿鏂伴厤缃?
param(
    [Parameter(Mandatory = $true)]
    [string]$GitHubUsername,

    [Parameter(Mandatory = $true)]
    [string]$AuthorName
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Koishi LSNet Plugin - Repository Initialization" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (Test-Path ".git") {
    Write-Host "Notice: current directory already contains a Git repository." -ForegroundColor Yellow
    $continue = Read-Host "Continue and modify the existing repository? (y/n)"
    if ($continue -ne 'y') {
        exit
    }
} else {
    Write-Host "Initializing new Git repository..." -ForegroundColor Green
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: git init failed" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Updating configuration files..." -ForegroundColor Green

# Update package.json
$packageJsonPath = "package.json"
if (Test-Path $packageJsonPath) {
    try {
        $packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
        $packageJson.author = $AuthorName
        $packageJson.repository = @{ type = 'git'; url = "git+https://github.com/$GitHubUsername/koishi-plugin-lsnet.git" }
        $packageJson.bugs = @{ url = "https://github.com/$GitHubUsername/koishi-plugin-lsnet/issues" }
        $packageJson.homepage = "https://github.com/$GitHubUsername/koishi-plugin-lsnet#readme"
        $packageJson | ConvertTo-Json -Depth 10 | Set-Content $packageJsonPath -Encoding UTF8
        Write-Host "Updated package.json" -ForegroundColor Green
    } catch {
        Write-Host "Warning: failed to update package.json - $_" -ForegroundColor Yellow
    }
} else {
    Write-Host "package.json not found, skipping." -ForegroundColor Yellow
}

# Update README.md links
$readmePath = "README.md"
if (Test-Path $readmePath) {
    try {
        $readme = Get-Content $readmePath -Raw
        $readme = $readme -replace 'yourusername', $GitHubUsername
        Set-Content $readmePath $readme -Encoding UTF8
        Write-Host "Updated README.md" -ForegroundColor Green
    } catch {
        Write-Host "Warning: failed to update README.md - $_" -ForegroundColor Yellow
    }
} else {
    Write-Host "README.md not found, skipping." -ForegroundColor Yellow
}

# Update PUBLISH.md (if exists) - perform safe replacements
$publishPath = "PUBLISH.md"
if (Test-Path $publishPath) {
    try {
        $publish = Get-Content $publishPath -Raw
        # Replace common placeholder keys if present - adjust as needed
        $publish = $publish -replace 'yourusername', $GitHubUsername
        $publish = $publish -replace 'yourname', $AuthorName
        Set-Content $publishPath $publish -Encoding UTF8
        Write-Host "Updated PUBLISH.md" -ForegroundColor Green
    } catch {
        Write-Host "Warning: failed to update PUBLISH.md - $_" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Staging files to Git..." -ForegroundColor Green
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: git add failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Creating initial commit..." -ForegroundColor Green
git commit -m "Initial commit: koishi-plugin-lsnet v1.0.0" | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: git commit failed (maybe nothing to commit)" -ForegroundColor Yellow
    # Do not fail hard if commit fails due to no changes
}

Write-Host ""
Write-Host "Setting default branch to 'main'..." -ForegroundColor Green
git branch -M main 2>$null

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Initialization complete" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Create a repository on GitHub: https://github.com/new" -ForegroundColor White
Write-Host "   Suggested repo name: koishi-plugin-lsnet" -ForegroundColor White
Write-Host ""
Write-Host "2. Add remote and push:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/$GitHubUsername/koishi-plugin-lsnet.git" -ForegroundColor Cyan
Write-Host "   git push -u origin main" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Test locally (example folder):" -ForegroundColor White
Write-Host "   cd example" -ForegroundColor Cyan
Write-Host "   npm install" -ForegroundColor Cyan
Write-Host "   npm start" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Publish to npm (if applicable):" -ForegroundColor White
Write-Host "   npm login" -ForegroundColor Cyan
Write-Host "   npm publish" -ForegroundColor Cyan
Write-Host ""
Write-Host "Remember to review PUBLISH.md and CHECKLIST.md for release details." -ForegroundColor Yellow
