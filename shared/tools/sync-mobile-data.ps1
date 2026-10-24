# =============================================================================
# sync-mobile-data.ps1
# -----------------------------------------------------------------------------
# Copy nội dung dùng chung (shared/data/*.json) sang app Flutter (apps/mobile/assets/data).
# Flutter chỉ đọc được asset nằm trong thư mục của app, nên cần bước copy này.
# CHẠY LẠI mỗi khi sửa file trong shared/data (ngày lễ, giải nghĩa...):
#   powershell -ExecutionPolicy Bypass -File shared/tools/sync-mobile-data.ps1
# =============================================================================

$ErrorActionPreference = 'Stop'
$src = Join-Path $PSScriptRoot '..\data'
$dst = Join-Path $PSScriptRoot '..\..\apps\mobile\assets\data'
New-Item -ItemType Directory -Force $dst | Out-Null
Get-ChildItem $src -Filter *.json | ForEach-Object {
  Copy-Item $_.FullName (Join-Path $dst $_.Name) -Force
  Write-Host "  $($_.Name)"
}
Write-Host 'Đã đồng bộ shared/data -> apps/mobile/assets/data' -ForegroundColor Green
