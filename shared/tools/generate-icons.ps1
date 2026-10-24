# =============================================================================
# generate-icons.ps1
# -----------------------------------------------------------------------------
# Vẽ logo "LAL" (Lịch Âm Lịch) ra các file icon PNG/ICO cho website:
#   apps/web/src/app/favicon.ico        16, 32, 48 px (tab trình duyệt, Google)
#   apps/web/src/app/apple-icon.png     180 px (iPhone "Thêm vào màn hình chính")
#   apps/web/public/icons/icon-192.png, icon-512.png   (manifest / PWA)
#   apps/web/public/icons/icon-maskable-512.png        (Android, nền tràn viền)
#   apps/web/src/app/opengraph-image.png 1200x630 (ảnh hiện khi chia sẻ link Facebook/Zalo)
# Bản SVG (src/app/icon.svg, src/components/logo.tsx) vẽ tay cùng màu, cùng tỉ lệ.
#
# Muốn đổi màu / chữ: sửa các biến bên dưới rồi chạy (từ thư mục gốc repo):
#   powershell -ExecutionPolicy Bypass -File shared/tools/generate-icons.ps1
# =============================================================================

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$BG = [Drawing.ColorTranslator]::FromHtml('#8A1C1C')     # đỏ sẫm
$GOLD = [Drawing.ColorTranslator]::FromHtml('#E3B04B')   # viền vàng đồng
$FG = [Drawing.Color]::White
$TEXT = 'LAL'
$FONT = 'Segoe UI'

$root = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$app = Join-Path $root 'apps\web\src\app'
$icons = Join-Path $root 'apps\web\public\icons'
New-Item -ItemType Directory -Force $icons | Out-Null

function New-RoundedRect([float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
  $p = New-Object Drawing.Drawing2D.GraphicsPath
  $d = $r * 2
  $p.AddArc($x, $y, $d, $d, 180, 90); $p.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $p.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90); $p.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $p.CloseFigure(); return $p
}

# Vẽ chữ căn giữa chính xác trong vùng (x, y, w, h), chiều rộng chữ = widthRatio * w
function Draw-CenteredText($g, [string]$text, [float]$x, [float]$y, [float]$w, [float]$h, [float]$widthRatio, $color, [Drawing.FontStyle]$style = [Drawing.FontStyle]::Bold) {
  $path = New-Object Drawing.Drawing2D.GraphicsPath
  $path.AddString($text, (New-Object Drawing.FontFamily $FONT), [int]$style, 100, (New-Object Drawing.PointF 0, 0), [Drawing.StringFormat]::GenericTypographic)
  $b = $path.GetBounds()
  $scale = [Math]::Min(($w * $widthRatio) / $b.Width, ($h * 0.62) / $b.Height)
  $m = New-Object Drawing.Drawing2D.Matrix
  $m.Translate($x + ($w - $b.Width * $scale) / 2 - $b.X * $scale, $y + ($h - $b.Height * $scale) / 2 - $b.Y * $scale)
  $m.Scale($scale, $scale)
  $path.Transform($m)
  $g.FillPath((New-Object Drawing.SolidBrush $color), $path)
}

function New-Canvas([int]$w, [int]$h) {
  $bmp = New-Object Drawing.Bitmap $w, $h
  $g = [Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'; $g.PixelOffsetMode = 'HighQuality'; $g.InterpolationMode = 'HighQualityBicubic'
  $g.Clear([Drawing.Color]::Transparent)
  return @($bmp, $g)
}

# Logo vuông bo góc. maskable = nền tràn viền, chữ nhỏ lại để nằm trong vùng an toàn của Android
function New-Logo([int]$size, [bool]$maskable = $false) {
  $bmp, $g = New-Canvas $size $size
  if ($maskable) {
    $g.Clear($BG)
    Draw-CenteredText $g $TEXT 0 0 $size $size 0.5 $FG
  } else {
    $r = $size * 0.22
    $g.FillPath((New-Object Drawing.SolidBrush $BG), (New-RoundedRect 0 0 $size $size $r))
    if ($size -ge 64) {
      # Viền vàng mảnh bên trong (bỏ ở kích thước nhỏ vì sẽ nhòe)
      $inset = $size * 0.07; $pen = New-Object Drawing.Pen $GOLD, ([float]($size * 0.022))
      $g.DrawPath($pen, (New-RoundedRect $inset $inset ($size - 2 * $inset) ($size - 2 * $inset) ($r * 0.7)))
    }
    Draw-CenteredText $g $TEXT 0 0 $size $size ($(if ($size -lt 64) { 0.86 } else { 0.68 })) $FG
  }
  $g.Dispose(); return $bmp
}

function Save-Png($bmp, [string]$path) { $bmp.Save($path, [Drawing.Imaging.ImageFormat]::Png); Write-Host "  $path" }

function Get-PngBytes($bmp) { $ms = New-Object IO.MemoryStream; $bmp.Save($ms, [Drawing.Imaging.ImageFormat]::Png); return , $ms.ToArray() }

# ICO chứa nhiều ảnh PNG (định dạng được mọi trình duyệt hiện đại hỗ trợ)
function Save-Ico([int[]]$sizes, [string]$path) {
  $images = foreach ($s in $sizes) { , (Get-PngBytes (New-Logo $s)) }
  $fs = [IO.File]::Create($path); $w = New-Object IO.BinaryWriter $fs
  $w.Write([uint16]0); $w.Write([uint16]1); $w.Write([uint16]$sizes.Count)
  $offset = 6 + 16 * $sizes.Count
  for ($i = 0; $i -lt $sizes.Count; $i++) {
    $s = $sizes[$i]; $len = $images[$i].Length
    $w.Write([byte]($s % 256)); $w.Write([byte]($s % 256)); $w.Write([byte]0); $w.Write([byte]0)
    $w.Write([uint16]1); $w.Write([uint16]32); $w.Write([uint32]$len); $w.Write([uint32]$offset)
    $offset += $len
  }
  foreach ($img in $images) { $w.Write($img) }
  $w.Close(); Write-Host "  $path"
}

# Ảnh chia sẻ mạng xã hội 1200x630: logo bên trái, tên + mô tả bên phải
function Save-OgImage([string]$path) {
  $bmp, $g = New-Canvas 1200 630
  $g.Clear([Drawing.ColorTranslator]::FromHtml('#FDF8F1'))
  $g.FillRectangle((New-Object Drawing.SolidBrush $BG), 0, 590, 1200, 40)
  $logo = New-Logo 300
  $g.DrawImage($logo, 90, 150, 300, 300)
  $g.TextRenderingHint = 'AntiAlias'
  $title = New-Object Drawing.Font $FONT, 64, ([Drawing.FontStyle]::Bold), ([Drawing.GraphicsUnit]::Pixel)
  $sub = New-Object Drawing.Font $FONT, 34, ([Drawing.FontStyle]::Regular), ([Drawing.GraphicsUnit]::Pixel)
  $g.DrawString('Lịch Âm Lịch', $title, (New-Object Drawing.SolidBrush $BG), 440, 200)
  $g.DrawString("Xem lịch âm, ngày tốt xấu,`ngiờ hoàng đạo hôm nay", $sub, (New-Object Drawing.SolidBrush ([Drawing.ColorTranslator]::FromHtml('#2B1D16'))), 444, 300)
  $g.Dispose(); Save-Png $bmp $path
}

Write-Host 'Đang tạo icon...'
Save-Ico @(16, 32, 48) (Join-Path $app 'favicon.ico')
Save-Png (New-Logo 180) (Join-Path $app 'apple-icon.png')
Save-Png (New-Logo 192) (Join-Path $icons 'icon-192.png')
Save-Png (New-Logo 512) (Join-Path $icons 'icon-512.png')
Save-Png (New-Logo 512 $true) (Join-Path $icons 'icon-maskable-512.png')
Save-OgImage (Join-Path $app 'opengraph-image.png')

# Biểu tượng app Android (Flutter): mipmap theo mật độ màn hình
$androidRes = Join-Path $root 'apps\mobile\android\app\src\main\res'
if (Test-Path $androidRes) {
  $mipmaps = [ordered]@{ 'mipmap-mdpi' = 48; 'mipmap-hdpi' = 72; 'mipmap-xhdpi' = 96; 'mipmap-xxhdpi' = 144; 'mipmap-xxxhdpi' = 192 }
  foreach ($dir in $mipmaps.Keys) {
    New-Item -ItemType Directory -Force (Join-Path $androidRes $dir) | Out-Null
    Save-Png (New-Logo $mipmaps[$dir]) (Join-Path $androidRes "$dir\ic_launcher.png")
  }
}
Write-Host 'Xong.' -ForegroundColor Green
