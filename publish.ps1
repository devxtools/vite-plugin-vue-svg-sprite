$ErrorActionPreference = "Stop"
Write-Host "Building all packages..."
npm run build
Write-Host "Publish..."

$npmrcPath = "./.npmrc"
if (-Not (Test-Path $npmrcPath)) {
  Write-Host ".npmrc file not found"
  Write-Host "Please log in to npm manually."
  npm login
}

$npmrcContent = Get-Content $npmrcPath
if ($npmrcContent -notmatch "//registry.npmjs.org/:_authToken") {
  Write-Host "Auth token not found in .npmrc"
  Write-Host "Please log in to npm manually."
  npm login
}

Push-Location -Path "./"
try {
  npm publish --access public
} catch {
  Write-Host "Failed to publish vite-plugin-vue-svg-sprite"
}
Pop-Location
Write-Host "All packages have been published successfully!"

