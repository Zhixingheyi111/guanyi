/**
 * 朱砂印章（"观"字篆刻）
 *
 * 设计要点：
 * - 方形朱砂底 + 反白汉字
 * - 略微旋转（-3°），打破几何完美，像盖印时自然的倾斜
 * - 边缘略微不规则，模拟印泥痕迹
 * - 使用 Noto Serif SC 或系统宋体（fallback），粗重字形更像印章
 */
export default function Seal({
  size = 44,
  character = '观',
  rotation = -3,
  style,
  className,
}) {
  return (
    <svg
      viewBox="0 0 60 60"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block', flexShrink: 0, ...style }}
      aria-label={`${character}字印`}
    >
      <defs>
        {/* 印泥不均匀的滤镜：给底色加一些扰动 */}
        <filter id="ink-bleed" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="0.8" />
        </filter>
      </defs>

      <g transform={`rotate(${rotation} 30 30)`}>
        {/* 印章底：朱砂色方形，略带圆角 */}
        <rect
          x="4"
          y="4"
          width="52"
          height="52"
          rx="1.5"
          fill="var(--vermilion)"
          filter="url(#ink-bleed)"
        />
        {/* 内边框，古印章常见的双层框 */}
        <rect
          x="7.5"
          y="7.5"
          width="45"
          height="45"
          rx="0.5"
          fill="none"
          stroke="var(--paper)"
          strokeWidth="0.8"
          opacity="0.75"
        />
        {/* "观"字：反白（用底色 paper 填充） */}
        <text
          x="30"
          y="30"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="30"
          fontFamily="var(--font-serif)"
          fontWeight="700"
          fill="var(--paper)"
          style={{ userSelect: 'none' }}
        >
          {character}
        </text>
      </g>
    </svg>
  );
}
