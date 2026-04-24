/**
 * 先天八卦图（伏羲八卦）
 *
 * 方位顺时针：乾（南/上）→ 巽 → 坎（西/右）→ 艮 → 坤（北/下）→ 震 → 离（东/左）→ 兑
 * 每卦 3 爻：index 0 = 初爻（靠圆心），index 2 = 上爻（靠外）
 *
 * 用法：
 *   <Bagua size={400} variant="watermark" />  // 背景水印，巨大低透明度，可慢转
 *   <Bagua size={180} variant="button"    />  // 圆形按钮，正常透明度
 */

// 先天八卦 (初爻, 中爻, 上爻)，1=阳，0=阴
const TRIGRAMS = [
  { pattern: [1, 1, 1], name: '乾' }, // 0°   上
  { pattern: [0, 1, 1], name: '巽' }, // 45°  右上
  { pattern: [0, 1, 0], name: '坎' }, // 90°  右
  { pattern: [0, 0, 1], name: '艮' }, // 135° 右下
  { pattern: [0, 0, 0], name: '坤' }, // 180° 下
  { pattern: [1, 0, 0], name: '震' }, // 225° 左下
  { pattern: [1, 0, 1], name: '离' }, // 270° 左
  { pattern: [1, 1, 0], name: '兑' }, // 315° 左上
];

// 一条爻（阳实/阴断），绘制于 viewBox 坐标中（viewBox 为 200×200）
function Yao({ cy, isYang, strokeWidth = 2.4 }) {
  // cy：此爻在"顶部位置"的 y 坐标，后续会被整体 rotate 到目标方位
  const common = {
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round',
  };
  if (isYang) {
    return <line x1="85" y1={cy} x2="115" y2={cy} {...common} />;
  }
  // 阴爻：左右两段，中间留白
  return (
    <>
      <line x1="85" y1={cy} x2="96" y2={cy} {...common} />
      <line x1="104" y1={cy} x2="115" y2={cy} {...common} />
    </>
  );
}

// 单个卦（三爻一组），位于顶部；由外层 transform 旋转到目标方位
function Trigram({ pattern, angle, strokeWidth }) {
  // 三爻从内到外：index 0 = 初爻（靠中心 = y 大）；index 2 = 上爻（靠外 = y 小）
  return (
    <g transform={`rotate(${angle} 100 100)`}>
      {pattern.map((isYang, i) => {
        const y = 40 - i * 7; // 初爻 y=40，中爻 y=33，上爻 y=26
        return <Yao key={i} cy={y} isYang={Boolean(isYang)} strokeWidth={strokeWidth} />;
      })}
    </g>
  );
}

// 中心太极（阴阳鱼）
function Taiji({ r = 20 }) {
  // 以 (100,100) 为中心，采用标准太极构造：
  // 大圆分阴阳两半，阴中有阳、阳中有阴（小圆点）
  const cx = 100;
  const cy = 100;
  const half = r / 2;
  return (
    <g>
      {/* 阳面（上半 + 右下内半圆）：填墨色 */}
      <path
        d={`
          M ${cx} ${cy - r}
          A ${r} ${r} 0 0 1 ${cx} ${cy + r}
          A ${half} ${half} 0 0 1 ${cx} ${cy}
          A ${half} ${half} 0 0 0 ${cx} ${cy - r}
          Z
        `}
        fill="currentColor"
      />
      {/* 阴面留白，仅画外轮廓 */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth="0.8" />
      {/* 两个小眼 */}
      <circle cx={cx} cy={cy - half} r={r / 8} fill="var(--paper)" />
      <circle cx={cx} cy={cy + half} r={r / 8} fill="currentColor" />
    </g>
  );
}

export default function Bagua({
  size = 200,
  variant = 'button', // 'button' | 'watermark'
  className,
  style,
  rotate = 0,
}) {
  const isWatermark = variant === 'watermark';
  const strokeWidth = isWatermark ? 1.6 : 2.6;
  const outerR = 94;
  const innerR = 54;
  const taijiR = isWatermark ? 22 : 18;

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        display: 'block',
        color: isWatermark ? 'var(--ink)' : 'var(--ink)',
        ...style,
      }}
      aria-hidden="true"
    >
      <g transform={`rotate(${rotate} 100 100)`}>
        {/* 外环 */}
        <circle cx="100" cy="100" r={outerR} fill="none" stroke="currentColor" strokeWidth={isWatermark ? 0.6 : 1} opacity="0.6" />
        {/* 内环 */}
        <circle cx="100" cy="100" r={innerR} fill="none" stroke="currentColor" strokeWidth={isWatermark ? 0.4 : 0.7} opacity="0.35" />

        {/* 八个卦 */}
        {TRIGRAMS.map((t, i) => (
          <Trigram key={t.name} pattern={t.pattern} angle={i * 45} strokeWidth={strokeWidth} />
        ))}

        {/* 中心太极 */}
        <Taiji r={taijiR} />
      </g>
    </svg>
  );
}
