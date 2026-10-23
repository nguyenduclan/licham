# =============================================================================
# generate-test-cases.ps1
# -----------------------------------------------------------------------------
# Sinh file shared/test_cases.json dùng chung cho cả lich_core (Dart) và
# lich-core (TypeScript).
#
# Đây là BẢN CÀI ĐẶT THỨ BA của thuật toán Hồ Ngọc Đức, viết bằng PowerShell
# (có sẵn trên mọi máy Windows, không cần cài gì). Nhờ vậy test case không
# được sinh ra từ chính code đang bị kiểm tra.
#
# Trước khi ghi file, script đối chiếu với các mốc đã biết chắc chắn
# (ngày Tết, tháng nhuận). Sai bất kỳ mốc nào -> dừng, không ghi file.
#
# Chạy (từ thư mục gốc repo):
#   powershell -ExecutionPolicy Bypass -File shared/tools/generate-test-cases.ps1
# =============================================================================

$ErrorActionPreference = 'Stop'
$PI = [Math]::PI
$TZ = 7.0   # Múi giờ Việt Nam (UTC+7)

$CAN = @('Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý')
$CHI = @('Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi')
$TIET_KHI = @('Xuân phân','Thanh minh','Cốc vũ','Lập hạ','Tiểu mãn','Mang chủng',
  'Hạ chí','Tiểu thử','Đại thử','Lập thu','Xử thử','Bạch lộ',
  'Thu phân','Hàn lộ','Sương giáng','Lập đông','Tiểu tuyết','Đại tuyết',
  'Đông chí','Tiểu hàn','Đại hàn','Lập xuân','Vũ thủy','Kinh trập')
# Ngũ hành theo vòng tương sinh: a sinh (a+1)%5, a khắc (a+2)%5
$NGU_HANH = @('Kim','Thủy','Mộc','Hỏa','Thổ')
# 30 nạp âm theo thứ tự lục thập hoa giáp (mỗi nạp âm ứng 2 can chi liên tiếp)
$NAP_AM = @('Hải Trung Kim','Lư Trung Hỏa','Đại Lâm Mộc','Lộ Bàng Thổ','Kiếm Phong Kim',
  'Sơn Đầu Hỏa','Giản Hạ Thủy','Thành Đầu Thổ','Bạch Lạp Kim','Dương Liễu Mộc',
  'Tuyền Trung Thủy','Ốc Thượng Thổ','Tích Lịch Hỏa','Tùng Bách Mộc','Trường Lưu Thủy',
  'Sa Trung Kim','Sơn Hạ Hỏa','Bình Địa Mộc','Bích Thượng Thổ','Kim Bạch Kim',
  'Phú Đăng Hỏa','Thiên Hà Thủy','Đại Dịch Thổ','Thoa Xuyến Kim','Tang Đố Mộc',
  'Đại Khê Thủy','Sa Trung Thổ','Thiên Thượng Hỏa','Thạch Lựu Mộc','Đại Hải Thủy')
# 12 thần trực ngày; hoàng đạo = các chỉ số trong $HOANG_DAO_THAN
$THAN = @('Thanh Long','Minh Đường','Thiên Hình','Chu Tước','Kim Quỹ','Kim Đường',
  'Bạch Hổ','Ngọc Đường','Thiên Lao','Huyền Vũ','Tư Mệnh','Câu Trận')
$HOANG_DAO_THAN = @(0, 1, 4, 5, 7, 10)
# Giờ hoàng đạo theo chi của ngày (chi % 6); ký tự '1' ở vị trí i = giờ chi i tốt
$GIO_HD = @('110100101100','001101001011','110011010010','101100110100','001011001101','010010110011')

function Flr([double]$x) { return [long][Math]::Floor($x) }

# ---- Ngày Julius <-> dương lịch ---------------------------------------------
function JdFromDate([long]$dd, [long]$mm, [long]$yy) {
  $a = Flr ((14 - $mm) / 12)
  $y = $yy + 4800 - $a
  $m = $mm + 12 * $a - 3
  $jd = $dd + (Flr ((153 * $m + 2) / 5)) + 365 * $y + (Flr ($y / 4)) - (Flr ($y / 100)) + (Flr ($y / 400)) - 32045
  if ($jd -lt 2299161) {
    $jd = $dd + (Flr ((153 * $m + 2) / 5)) + 365 * $y + (Flr ($y / 4)) - 32083
  }
  return [long]$jd
}

function JdToDate([long]$jd) {
  if ($jd -gt 2299160) {
    $a = $jd + 32044
    $b = Flr ((4 * $a + 3) / 146097)
    $c = $a - (Flr (($b * 146097) / 4))
  } else {
    $b = 0
    $c = $jd + 32082
  }
  $d = Flr ((4 * $c + 3) / 1461)
  $e = $c - (Flr ((1461 * $d) / 4))
  $m = Flr ((5 * $e + 2) / 153)
  $day = $e - (Flr ((153 * $m + 2) / 5)) + 1
  $month = $m + 3 - 12 * (Flr ($m / 10))
  $year = $b * 100 + $d - 4800 + (Flr ($m / 10))
  return @([int]$day, [int]$month, [int]$year)
}

# ---- Thiên văn: sóc (trăng mới) và kinh độ mặt trời ------------------------
function NewMoon([long]$k) {
  $T = $k / 1236.85
  $T2 = $T * $T
  $T3 = $T2 * $T
  $dr = $PI / 180
  $Jd1 = 2415020.75933 + 29.53058868 * $k + 0.0001178 * $T2 - 0.000000155 * $T3
  $Jd1 = $Jd1 + 0.00033 * [Math]::Sin((166.56 + 132.87 * $T - 0.009173 * $T2) * $dr)
  $M = 359.2242 + 29.10535608 * $k - 0.0000333 * $T2 - 0.00000347 * $T3
  $Mpr = 306.0253 + 385.81691806 * $k + 0.0107306 * $T2 + 0.00001236 * $T3
  $F = 21.2964 + 390.67050646 * $k - 0.0016528 * $T2 - 0.00000239 * $T3
  $C1 = (0.1734 - 0.000393 * $T) * [Math]::Sin($M * $dr) + 0.0021 * [Math]::Sin(2 * $dr * $M)
  $C1 = $C1 - 0.4068 * [Math]::Sin($Mpr * $dr) + 0.0161 * [Math]::Sin($dr * 2 * $Mpr)
  $C1 = $C1 - 0.0004 * [Math]::Sin($dr * 3 * $Mpr)
  $C1 = $C1 + 0.0104 * [Math]::Sin($dr * 2 * $F) - 0.0051 * [Math]::Sin($dr * ($M + $Mpr))
  $C1 = $C1 - 0.0074 * [Math]::Sin($dr * ($M - $Mpr)) + 0.0004 * [Math]::Sin($dr * (2 * $F + $M))
  $C1 = $C1 - 0.0004 * [Math]::Sin($dr * (2 * $F - $M)) - 0.0006 * [Math]::Sin($dr * (2 * $F + $Mpr))
  $C1 = $C1 + 0.0010 * [Math]::Sin($dr * (2 * $F - $Mpr)) + 0.0005 * [Math]::Sin($dr * (2 * $Mpr + $M))
  if ($T -lt -11) {
    $deltat = 0.001 + 0.000839 * $T + 0.0002261 * $T2 - 0.00000845 * $T3 - 0.000000081 * $T * $T3
  } else {
    $deltat = -0.000278 + 0.000265 * $T + 0.000262 * $T2
  }
  return $Jd1 + $C1 - $deltat
}

function NewMoonDay([long]$k) { return Flr ((NewMoon $k) + 0.5 + $TZ / 24) }

function SunLongitudeRad([double]$jdn) {
  $T = ($jdn - 2451545.0) / 36525
  $T2 = $T * $T
  $dr = $PI / 180
  $M = 357.52910 + 35999.05030 * $T - 0.0001559 * $T2 - 0.00000048 * $T * $T2
  $L0 = 280.46645 + 36000.76983 * $T + 0.0003032 * $T2
  $DL = (1.914600 - 0.004817 * $T - 0.000014 * $T2) * [Math]::Sin($dr * $M)
  $DL = $DL + (0.019993 - 0.000101 * $T) * [Math]::Sin($dr * 2 * $M) + 0.000290 * [Math]::Sin($dr * 3 * $M)
  $L = ($L0 + $DL) * $dr
  return $L - $PI * 2 * (Flr ($L / ($PI * 2)))
}

# Cung trung khí (0..11) tại đầu ngày dayNumber (giờ địa phương)
function SunSector12([long]$dayNumber) {
  return Flr ((SunLongitudeRad ($dayNumber - 0.5 - $TZ / 24)) / $PI * 6)
}

# ---- Âm lịch -----------------------------------------------------------------
function LunarMonth11([long]$yy) {
  $off = (JdFromDate 31 12 $yy) - 2415021
  $k = Flr ($off / 29.530588853)
  $nm = NewMoonDay $k
  if ((SunSector12 $nm) -ge 9) { $nm = NewMoonDay ($k - 1) }
  return $nm
}

function LeapMonthOffset([long]$a11) {
  $k = Flr (($a11 - 2415021.076998695) / 29.530588853 + 0.5)
  $i = 1
  $arc = SunSector12 (NewMoonDay ($k + $i))
  do {
    $last = $arc
    $i++
    $arc = SunSector12 (NewMoonDay ($k + $i))
  } while ($arc -ne $last -and $i -lt 14)
  return $i - 1
}

function Solar2Lunar([long]$dd, [long]$mm, [long]$yy) {
  $dayNumber = JdFromDate $dd $mm $yy
  $k = Flr (($dayNumber - 2415021.076998695) / 29.530588853)
  $monthStart = NewMoonDay ($k + 1)
  if ($monthStart -gt $dayNumber) { $monthStart = NewMoonDay $k }
  $a11 = LunarMonth11 $yy
  $b11 = $a11
  if ($a11 -ge $monthStart) {
    $lunarYear = $yy
    $a11 = LunarMonth11 ($yy - 1)
  } else {
    $lunarYear = $yy + 1
    $b11 = LunarMonth11 ($yy + 1)
  }
  $lunarDay = $dayNumber - $monthStart + 1
  $diff = Flr (($monthStart - $a11) / 29)
  $leap = $false
  $lunarMonth = $diff + 11
  if ($b11 - $a11 -gt 365) {
    $leapOff = LeapMonthOffset $a11
    if ($diff -ge $leapOff) {
      $lunarMonth = $diff + 10
      if ($diff -eq $leapOff) { $leap = $true }
    }
  }
  if ($lunarMonth -gt 12) { $lunarMonth -= 12 }
  if ($lunarMonth -ge 11 -and $diff -lt 4) { $lunarYear -= 1 }
  return @{ day = [int]$lunarDay; month = [int]$lunarMonth; year = [int]$lunarYear; leap = $leap; jd = $dayNumber }
}

function Lunar2Solar([long]$lDay, [long]$lMonth, [long]$lYear, [bool]$lLeap) {
  if ($lMonth -lt 11) {
    $a11 = LunarMonth11 ($lYear - 1); $b11 = LunarMonth11 $lYear
  } else {
    $a11 = LunarMonth11 $lYear; $b11 = LunarMonth11 ($lYear + 1)
  }
  $k = Flr (0.5 + ($a11 - 2415021.076998695) / 29.530588853)
  $off = $lMonth - 11
  if ($off -lt 0) { $off += 12 }
  if ($b11 - $a11 -gt 365) {
    $leapOff = LeapMonthOffset $a11
    $leapMonth = $leapOff + 10
    if ($leapMonth -gt 12) { $leapMonth -= 12 }
    if ($lLeap -and $lMonth -ne $leapMonth) { return $null }
    if ($lLeap -or $off -ge $leapOff) { $off += 1 }
  } elseif ($lLeap) { return $null }
  $monthStart = NewMoonDay ($k + $off)
  return JdToDate ($monthStart + $lDay - 1)
}

# Tháng nhuận của năm âm lịch (0 = không nhuận)
function LeapMonthOfYear([long]$lYear) {
  $a = LunarMonth11 ($lYear - 1); $b = LunarMonth11 $lYear
  if ($b - $a -gt 365) {
    $lm = (LeapMonthOffset $a) + 10; if ($lm -gt 12) { $lm -= 12 }
    if ($lm -le 10) { return $lm }
  }
  $a = $b; $b = LunarMonth11 ($lYear + 1)
  if ($b - $a -gt 365) {
    $lm = (LeapMonthOffset $a) + 10; if ($lm -gt 12) { $lm -= 12 }
    if ($lm -ge 11) { return $lm }
  }
  return 0
}

# ---- Can chi, tiết khí, giờ hoàng đạo ---------------------------------------
function CanChiDay([long]$jd) { return "$($CAN[($jd + 9) % 10]) $($CHI[($jd + 1) % 12])" }
function CanChiMonth([long]$m, [long]$y) { return "$($CAN[($y * 12 + $m + 3) % 10]) $($CHI[($m + 1) % 12])" }
function CanChiYear([long]$y) { return "$($CAN[($y + 6) % 10]) $($CHI[($y + 8) % 12])" }
function TietKhiIndex([long]$jd) { return Flr ((SunLongitudeRad ($jd + 1 - 0.5 - $TZ / 24)) / $PI * 12) }
function GioHoangDao([long]$jd) {
  $pattern = $GIO_HD[(($jd + 1) % 12) % 6]
  $r = @(); for ($i = 0; $i -lt 12; $i++) { if ($pattern[$i] -eq '1') { $r += $i } }
  return $r
}

# ---- Nạp âm, thần ngày (hoàng/hắc đạo), tuổi xung ---------------------------
function NapAmIndex([long]$canIdx, [long]$chiIdx) { return Flr (((((6 * $canIdx - 5 * $chiIdx) % 60) + 60) % 60) / 2) }
function NapAmHanh([long]$napAmIdx) { return [array]::IndexOf($NGU_HANH, $NAP_AM[$napAmIdx].Split(' ')[-1]) }
function DayNapAmIndex([long]$jd) { return NapAmIndex (($jd + 9) % 10) (($jd + 1) % 12) }
# Thanh Long khởi tại: tháng 1,7 -> Tý; 2,8 -> Dần; 3,9 -> Thìn; 4,10 -> Ngọ; 5,11 -> Thân; 6,12 -> Tuất
function ThanIndex([long]$jd, [long]$lunarMonth) {
  $start = (($lunarMonth - 1) % 6) * 2
  return ((($jd + 1) % 12) - $start + 12) % 12
}
# Tuổi xung ngày: chi xung với chi ngày VÀ nạp âm khắc (hoặc bị khắc bởi) nạp âm ngày
function TuoiXung([long]$jd) {
  $dayHanh = NapAmHanh (DayNapAmIndex $jd)
  $xungChi = ((($jd + 1) % 12) + 6) % 12
  $r = @()
  for ($c = $xungChi % 2; $c -lt 10; $c += 2) {
    $h = NapAmHanh (NapAmIndex $c $xungChi)
    if ((($dayHanh + 2) % 5 -eq $h) -or (($h + 2) % 5 -eq $dayHanh)) { $r += "$($CAN[$c]) $($CHI[$xungChi])" }
  }
  return $r
}

# ---- Trực, Nhị thập bát tú, ngày kỵ ------------------------------------------
$TRUC = @('Kiến','Trừ','Mãn','Bình','Định','Chấp','Phá','Nguy','Thành','Thu','Khai','Bế')
$TU = @('Giác','Cang','Đê','Phòng','Tâm','Vĩ','Cơ','Đẩu','Ngưu','Nữ','Hư','Nguy','Thất','Bích',
  'Khuê','Lâu','Vị','Mão','Tất','Chủy','Sâm','Tỉnh','Quỷ','Liễu','Tinh','Trương','Dực','Chẩn')
function TrucIndex([long]$jd) {
  $monthChi = (2 + (Flr (((((TietKhiIndex $jd) - 21 + 24) % 24)) / 2))) % 12
  return ((($jd + 1) % 12) - $monthChi + 12) % 12
}
function TuIndex([long]$jd) { return ($jd + 11) % 28 }
$DUONG_CONG = @{ 1 = @(13); 2 = @(11); 3 = @(9); 4 = @(7); 5 = @(5); 6 = @(3); 7 = @(8, 29); 8 = @(27); 9 = @(25); 10 = @(23); 11 = @(21); 12 = @(19) }
function NgayKy([long]$jd, $l) {
  $s = JdToDate ($jd + 1); $next = Solar2Lunar $s[0] $s[1] $s[2]
  $r = @()
  if (@(5, 14, 23) -contains $l.day) { $r += 'nguyetKy' }
  if ($next.day -eq 1) { $r += 'nguyetTan' }
  if (@(3, 7, 13, 18, 22, 27) -contains $l.day) { $r += 'tamNuong' }
  if (-not $l.leap -and $DUONG_CONG[$l.month] -contains $l.day) { $r += 'duongCongKy' }
  return $r
}

# ---- Lục Diệu, Lý Thuần Phong, hướng xuất hành ------------------------------
$LUC_DIEU = @('Đại An','Lưu Liên','Tốc Hỷ','Xích Khẩu','Tiểu Cát','Không Vong')
function LucDieuIndex([long]$m, [long]$d) { return ($m + $d - 1) % 6 }
function GioLTP([long]$m, [long]$d) { $s = LucDieuIndex $m $d; return @(0..5 | ForEach-Object { ($s + $_) % 6 }) }
$HY = @('Đông Bắc','Tây Bắc','Tây Nam','Chính Nam','Đông Nam','Đông Bắc','Tây Bắc','Tây Nam','Chính Nam','Đông Nam')
$TAI = @('Đông Nam','Đông Nam','Chính Đông','Chính Đông','Chính Nam','Chính Nam','Tây Nam','Tây Nam','Chính Tây','Tây Bắc')
$HAC_HUONG = @('Đông Bắc','Chính Đông','Đông Nam','Chính Nam','Tây Nam','Chính Tây','Tây Bắc','Chính Bắc')
$HAC_SO_NGAY = @(6, 5, 6, 5, 6, 5, 6, 5)
function HacThan([long]$jd) {
  $off = ((($jd + 49) % 60) - 45 + 60) % 60
  for ($i = 0; $i -lt 8; $i++) { if ($off -lt $HAC_SO_NGAY[$i]) { return $HAC_HUONG[$i] }; $off -= $HAC_SO_NGAY[$i] }
  return $null
}

# ---- Quan hệ địa chi, Tam Sát, đánh giá tuổi ---------------------------------
function PairKey([long]$a, [long]$b) { if ($a -lt $b) { return $a * 12 + $b } else { return $b * 12 + $a } }
$HINH = @(@(2,5),@(5,8),@(2,8),@(1,10),@(7,10),@(1,7),@(0,3),@(4,4),@(6,6),@(9,9),@(11,11)) | ForEach-Object { PairKey $_[0] $_[1] }
$PHA = @(@(0,9),@(1,4),@(2,11),@(3,6),@(5,8),@(7,10)) | ForEach-Object { PairKey $_[0] $_[1] }
function TamSat([long]$dayChi) {
  if ($dayChi % 3 -ne 1) { return @() }
  $s = ($dayChi + 1) % 12; return @($s, (($s + 4) % 12), (($s + 8) % 12))
}
$FACTOR_SCORE = @{ hoangDao = 1; hacDao = -1; tamHop = 2; lucHop = 2; tuoiXung = -3; lucXung = -2; tuongHinh = -1
  tuongHai = -1; tuongPha = -1; tamSat = -2; ngaySinhMenh = 2; dongHanh = 1; ngayKhacMenh = -2; menhKhacNgay = -1 }
function DanhGiaTuoi($birth, [long]$jd) {
  $y = (Solar2Lunar $birth[0] $birth[1] $birth[2]).year
  # Lưu ý: biến PowerShell không phân biệt hoa thường -> KHÔNG đặt tên $can/$chi (sẽ đè mảng $CAN/$CHI)
  $bCan = ($y + 6) % 10; $bChi = ($y + 8) % 12
  $s = JdToDate $jd; $l = Solar2Lunar $s[0] $s[1] $s[2]
  $dc = ($jd + 1) % 12
  $mh = NapAmHanh (NapAmIndex $bCan $bChi); $nh = NapAmHanh (DayNapAmIndex $jd)
  $tuoi = "$($CAN[$bCan]) $($CHI[$bChi])"
  $f = @()
  if ($HOANG_DAO_THAN -contains (ThanIndex $jd $l.month)) { $f += 'hoangDao' } else { $f += 'hacDao' }
  if ($bChi -ne $dc -and ($bChi % 4) -eq ($dc % 4)) { $f += 'tamHop' }
  if ((($bChi + $dc) % 12) -eq 1) { $f += 'lucHop' }
  if (@(TuoiXung $jd) -contains $tuoi) { $f += 'tuoiXung' } elseif ((($bChi - $dc + 12) % 12) -eq 6) { $f += 'lucXung' }
  if ($HINH -contains (PairKey $bChi $dc)) { $f += 'tuongHinh' }
  if ((($bChi + $dc) % 12) -eq 7) { $f += 'tuongHai' }
  if ($PHA -contains (PairKey $bChi $dc)) { $f += 'tuongPha' }
  if (@(TamSat $dc) -contains $bChi) { $f += 'tamSat' }
  if ((($nh + 1) % 5) -eq $mh) { $f += 'ngaySinhMenh' } elseif ($nh -eq $mh) { $f += 'dongHanh' }
  elseif ((($nh + 2) % 5) -eq $mh) { $f += 'ngayKhacMenh' } elseif ((($mh + 2) % 5) -eq $nh) { $f += 'menhKhacNgay' }
  $score = 0; foreach ($x in $f) { $score += $FACTOR_SCORE[$x] }
  $verdict = if ($score -ge 2) { 'tot' } elseif ($score -le -2) { 'xau' } else { 'binhThuong' }
  return [ordered]@{ birthLunarYear = [int]$y; canChiTuoi = $tuoi; menh = $NAP_AM[(NapAmIndex $bCan $bChi)]; factors = $f; score = $score; verdict = $verdict }
}

# ---- Sinh test case ----------------------------------------------------------
$cases = New-Object System.Collections.ArrayList
$seen = @{}

function Add-Case([long]$jd, [string]$category, [string]$note) {
  if ($seen.ContainsKey($jd)) { return }
  $seen[$jd] = $true
  $s = JdToDate $jd
  $l = Solar2Lunar $s[0] $s[1] $s[2]
  # Kiểm tra chiều ngược lại (âm -> dương) ngay khi sinh
  $back = Lunar2Solar $l.day $l.month $l.year $l.leap
  if ($null -eq $back -or $back[0] -ne $s[0] -or $back[1] -ne $s[1] -or $back[2] -ne $s[2]) {
    throw "Round-trip sai tại $($s -join '/')"
  }
  [void]$cases.Add([ordered]@{
    category = $category; note = $note
    solar = ('{0:D4}-{1:D2}-{2:D2}' -f $s[2], $s[1], $s[0])
    jd = $jd
    lunar = @{ day = $l.day; month = $l.month; year = $l.year; leap = $l.leap }
    canChi = @{ day = (CanChiDay $jd); month = (CanChiMonth $l.month $l.year); year = (CanChiYear $l.year) }
    tietKhi = $TIET_KHI[(TietKhiIndex $jd)]
    gioHoangDao = (GioHoangDao $jd)
    napAm = $NAP_AM[(DayNapAmIndex $jd)]
    thanNgay = $THAN[(ThanIndex $jd $l.month)]
    hoangDao = $HOANG_DAO_THAN -contains (ThanIndex $jd $l.month)
    tuoiXung = @(TuoiXung $jd)
    truc = $TRUC[(TrucIndex $jd)]
    nhiThapBatTu = $TU[(TuIndex $jd)]
    ngayKy = @(NgayKy $jd $l)
    lucDieu = $LUC_DIEU[(LucDieuIndex $l.month $l.day)]
    gioLyThuanPhong = @(GioLTP $l.month $l.day)
    hyThan = $HY[($jd + 9) % 10]
    taiThan = $TAI[($jd + 9) % 10]
    hacThan = (HacThan $jd)
    tamSat = @(TamSat (($jd + 1) % 12))
  })
}

Write-Host 'Đang tính bảng tháng nhuận 1900-2100...'
$leapMonths = [ordered]@{}
for ($y = 1900; $y -le 2100; $y++) {
  $lm = LeapMonthOfYear $y
  if ($lm -ne 0) { $leapMonths["$y"] = $lm }
}

Write-Host 'Đang sinh test case...'
$tetJd = @{}
for ($y = 1900; $y -le 2100; $y++) {
  $s = Lunar2Solar 1 1 $y $false
  $tetJd[$y] = JdFromDate $s[0] $s[1] $s[2]
  Add-Case $tetJd[$y] 'tet' "Tết $(CanChiYear $y)"
}
foreach ($key in $leapMonths.Keys) {
  $y = [int]$key; $m = $leapMonths[$key]
  $s = Lunar2Solar 1 $m $y $true
  Add-Case (JdFromDate $s[0] $s[1] $s[2]) 'leap-month-start' "Mùng 1 tháng $m nhuận năm $y"
}
for ($y = 1905; $y -le 2100; $y += 5) {
  Add-Case ($tetJd[$y] - 1) 'year-end' "Ngày cuối năm âm lịch $($y - 1)"
}
for ($y = 1900; $y -le 2100; $y += 10) {
  for ($m = 1; $m -le 12; $m++) { Add-Case (JdFromDate 1 $m $y) 'month-sample' '' }
}
$special = @(
  @(1, 1, 1900, 'Ngày đầu tiên của khoảng hỗ trợ'), @(28, 2, 1900, '1900 không phải năm nhuận dương lịch'),
  @(1, 3, 1900, ''), @(29, 2, 2000, 'Năm nhuận dương lịch chia hết cho 400'), @(29, 2, 2024, ''),
  @(20, 2, 1985, 'Tết Trung Quốc 1985 (Việt Nam đã sang tháng 2 âm)'), @(30, 1, 1968, 'Tết Trung Quốc 1968'),
  @(18, 2, 2007, 'Tết Trung Quốc 2007'), @(21, 10, 2026, ''), @(31, 12, 2100, 'Ngày cuối của khoảng hỗ trợ'),
  @(22, 10, 2026, 'Đối chiếu xemlicham'), @(25, 10, 2026, 'Đối chiếu xemlicham'), @(3, 11, 2026, 'Đối chiếu xemlicham'),
  @(15, 6, 2025, 'Đối chiếu xemlicham'), @(8, 3, 2024, 'Đối chiếu xemlicham')
)
foreach ($sp in $special) { Add-Case (JdFromDate $sp[0] $sp[1] $sp[2]) 'special' $sp[3] }

# Đánh giá tuổi: các ngày 'special' + đầu mỗi tháng năm 2020, 2026, mỗi ngày xét với 6 ngày sinh
# (có người sinh trước Tết để kiểm tra năm âm lịch: 20/1/1975 -> Giáp Dần, 1/2/2000 -> Kỷ Mão)
$births = @(@(15, 3, 1960), @(20, 1, 1975), @(8, 8, 1988), @(1, 12, 1995), @(1, 2, 2000), @(30, 6, 2010))
$tuoiDays = @($cases | Where-Object { $_.category -eq 'special' -or ($_.category -eq 'month-sample' -and ($_.solar -like '2020-*' -or $_.solar -like '2026-*')) })
$tuoiCases = New-Object System.Collections.ArrayList
foreach ($d in $tuoiDays) {
  foreach ($b in $births) {
    $r = DanhGiaTuoi $b $d.jd
    $entry = [ordered]@{ solar = $d.solar; birth = ('{0:D4}-{1:D2}-{2:D2}' -f $b[2], $b[1], $b[0]) }
    foreach ($k in $r.Keys) { $entry[$k] = $r[$k] }
    $entry.factors = @($r.factors)
    [void]$tuoiCases.Add($entry)
  }
}

# ---- Đối chiếu mốc đã biết (nguồn: lịch Việt Nam đã công bố) ---------------
$knownTet = @{
  1900 = '1900-01-31'; 1968 = '1968-01-29'; 1975 = '1975-02-11'; 1985 = '1985-01-21'
  1990 = '1990-01-27'; 1995 = '1995-01-31'; 2000 = '2000-02-05'; 2001 = '2001-01-24'
  2002 = '2002-02-12'; 2003 = '2003-02-01'; 2004 = '2004-01-22'; 2005 = '2005-02-09'
  2006 = '2006-01-29'; 2007 = '2007-02-17'; 2008 = '2008-02-07'; 2009 = '2009-01-26'
  2010 = '2010-02-14'; 2011 = '2011-02-03'; 2012 = '2012-01-23'; 2013 = '2013-02-10'
  2014 = '2014-01-31'; 2015 = '2015-02-19'; 2016 = '2016-02-08'; 2017 = '2017-01-28'
  2018 = '2018-02-16'; 2019 = '2019-02-05'; 2020 = '2020-01-25'; 2021 = '2021-02-12'
  2022 = '2022-02-01'; 2023 = '2023-01-22'; 2024 = '2024-02-10'; 2025 = '2025-01-29'
  2026 = '2026-02-17'; 2027 = '2027-02-06'; 2028 = '2028-01-26'; 2029 = '2029-02-13'
  2030 = '2030-02-02'  # Sóc 23:09 giờ VN ngày 2/2 (đã là 3/2 giờ Bắc Kinh -> Tết Trung Quốc 3/2)
}
# 1985: VN nhuận tháng 2 (Trung Quốc nhuận tháng 10/1984) -> Tết VN 1985 sớm hơn TQ 1 tháng
$knownLeap = @{ 1985 = 2; 2033 = 11; 2001 = 4; 2004 = 2; 2006 = 7; 2009 = 5; 2012 = 4; 2014 = 9; 2017 = 6; 2020 = 4; 2023 = 2; 2025 = 6; 2028 = 5 }

$errors = @()
foreach ($y in $knownTet.Keys) {
  $s = JdToDate $tetJd[$y]
  $got = '{0:D4}-{1:D2}-{2:D2}' -f $s[2], $s[1], $s[0]
  if ($got -ne $knownTet[$y]) { $errors += "Tết $y : tính ra $got, đúng là $($knownTet[$y])" }
}
foreach ($y in $knownLeap.Keys) {
  $got = $leapMonths["$y"]
  if ($got -ne $knownLeap[$y]) { $errors += "Nhuận $y : tính ra '$got', đúng là $($knownLeap[$y])" }
}
# Ví dụ đối chiếu 21/10/2026 (Mậu Thìn, 12/9 Bính Ngọ) từ các trang xem ngày
$ex = $cases | Where-Object { $_.solar -eq '2026-10-21' }
if ($ex.napAm -ne 'Đại Lâm Mộc') { $errors += "Nạp âm 21/10/2026: $($ex.napAm)" }
if ($ex.thanNgay -ne 'Thanh Long' -or -not $ex.hoangDao) { $errors += "Thần ngày 21/10/2026: $($ex.thanNgay)" }
if (($ex.tuoiXung -join ',') -ne 'Bính Tuất,Canh Tuất') { $errors += "Tuổi xung 21/10/2026: $($ex.tuoiXung -join ',')" }
# 8 ngày đối chiếu với xemlicham.com (trực, sao, Lục Diệu, Hỷ/Tài/Hạc thần, Tam Sát, ngày kỵ)
$almanac = @(
  @('2026-10-21', 'Phá', 'Cơ', 'Tốc Hỷ', 'Đông Nam', 'Chính Nam', 'Chính Nam', '5,9,1', ''),
  @('2026-10-22', 'Nguy', 'Đẩu', 'Xích Khẩu', 'Đông Bắc', 'Chính Nam', 'Chính Nam', '', 'tamNuong'),
  @('2026-10-25', 'Khai', 'Hư', 'Đại An', 'Chính Nam', 'Chính Tây', 'Tây Nam', '', ''),
  @('2026-11-03', 'Nguy', 'Chủy', 'Xích Khẩu', 'Tây Nam', 'Tây Nam', 'Chính Tây', '', 'duongCongKy'),
  @('2025-01-29', 'Thu', 'Sâm', 'Lưu Liên', 'Đông Nam', 'Chính Nam', '', '11,3,7', ''),
  @('2025-06-15', 'Thu', 'Mão', 'Đại An', 'Tây Bắc', 'Đông Nam', 'Chính Đông', '', ''),
  @('2024-03-08', 'Định', 'Cang', 'Tiểu Cát', 'Tây Nam', 'Tây Nam', 'Tây Nam', '8,0,4', ''),
  @('2026-02-17', 'Thành', 'Thất', 'Lưu Liên', 'Chính Nam', 'Chính Tây', 'Đông Nam', '11,3,7', '')
)
foreach ($a in $almanac) {
  $c = $cases | Where-Object { $_.solar -eq $a[0] }
  $got = @($c.truc, $c.nhiThapBatTu, $c.lucDieu, $c.hyThan, $c.taiThan, "$($c.hacThan)", ($c.tamSat -join ','), ($c.ngayKy -join ','))
  $want = $a[1..8]
  for ($i = 0; $i -lt 8; $i++) { if ($got[$i] -ne $want[$i]) { $errors += "$($a[0]) mục $i : tính ra '$($got[$i])', đúng là '$($want[$i])'" } }
}
if ($errors.Count -gt 0) { $errors | ForEach-Object { Write-Host $_ -ForegroundColor Red }; throw 'Sai mốc đối chiếu, không ghi file.' }
Write-Host "Đối chiếu OK: $($knownTet.Count) mốc Tết, $($knownLeap.Count) mốc tháng nhuận." -ForegroundColor Green

# ---- Ghi JSON (mỗi case một dòng cho dễ đọc / dễ diff) ----------------------
$lines = foreach ($c in $cases) { '    ' + (ConvertTo-Json $c -Compress -Depth 5) }
$tuoiLines = foreach ($c in $tuoiCases) { '    ' + (ConvertTo-Json $c -Compress -Depth 5) }
$leapJson = ($leapMonths.Keys | ForEach-Object { "`"$_`": $($leapMonths[$_])" }) -join ', '
$json = @"
{
  "description": "Bộ test dùng chung cho lich_core (Dart) và lich-core (TypeScript). Sinh bởi shared/tools/generate-test-cases.ps1 - KHÔNG sửa tay.",
  "timeZone": 7,
  "range": { "from": "1900-01-01", "to": "2100-12-31" },
  "notes": {
    "tietKhi": "Tiết khí đang có hiệu lực tại cuối ngày (24:00 giờ VN).",
    "gioHoangDao": "Danh sách chỉ số chi (0 = Tý ... 11 = Hợi) của các giờ hoàng đạo.",
    "leapMonths": "Năm âm lịch -> tháng nhuận. Năm không có trong bảng = không nhuận."
  },
  "leapMonths": { $leapJson },
  "cases": [
$($lines -join ",`n")
  ],
  "tuoiCases": [
$($tuoiLines -join ",`n")
  ]
}
"@
# ConvertTo-Json của PowerShell 5.1 escape ký tự đặc biệt thành \uXXXX -> giải mã lại cho dễ đọc
$json = [regex]::Replace($json, '\\u([0-9a-fA-F]{4})', { param($m) [string][char][Convert]::ToInt32($m.Groups[1].Value, 16) })

$outPath = Join-Path $PSScriptRoot '..\test_cases.json'
[IO.File]::WriteAllText([IO.Path]::GetFullPath($outPath), $json, (New-Object Text.UTF8Encoding $false))
Write-Host "Đã ghi $($cases.Count) test case, $($leapMonths.Count) năm nhuận -> shared/test_cases.json" -ForegroundColor Green
