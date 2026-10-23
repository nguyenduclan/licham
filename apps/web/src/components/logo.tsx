// Logo "LAL" (Lịch Âm Lịch): hình vuông bo góc, nền đỏ sẫm, chữ trắng.
// Cùng thiết kế với icon do shared/tools/generate-icons.ps1 tạo ra. Đổi màu thì sửa cả hai nơi.
export function Logo({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Logo Lịch Âm Lịch"
      className={className}
    >
      <rect width="64" height="64" rx="14" fill="#8A1C1C" />
      {size >= 48 && (
        <rect x="4.5" y="4.5" width="55" height="55" rx="10" fill="none" stroke="#E3B04B" strokeWidth="1.5" />
      )}
      <text
        x="32"
        y="33"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-be-vietnam-pro), Arial, sans-serif"
        fontWeight="700"
        fontSize="24"
        fill="#fff"
      >
        LAL
      </text>
    </svg>
  );
}
