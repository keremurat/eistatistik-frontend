// Admin dashboard için hafif, bağımlılıksız custom SVG grafikleri.
// Marka renkleriyle çizilir; interaktif değil (v1). Etkileşim gerekirse ileride genişletilebilir.

type Segment = { label: string; value: number; color: string };

/** Görev durumu / ödeme yöntemi gibi parça-bütün dağılımları için halka grafik. */
export function Donut({ segments, size = 150, thickness = 18, children }: { segments: Segment[]; size?: number; thickness?: number; children?: React.ReactNode }) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const lengths = segments.map((segment) => (segment.value / total) * circumference);
  const arcs = segments.map((segment, index) => ({
    ...segment,
    length: lengths[index],
    offset: lengths.slice(0, index).reduce((sum, value) => sum + value, 0),
  }));

  return (
    <div className="donut" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-hidden="true">
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#eef2f4" strokeWidth={thickness} />
          {arcs.map((arc) => (
            <circle key={arc.label} cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={arc.color} strokeWidth={thickness} strokeDasharray={`${arc.length} ${circumference - arc.length}`} strokeDashoffset={-arc.offset} />
          ))}
        </g>
      </svg>
      {children && <div className="donut-center">{children}</div>}
    </div>
  );
}

/** Zaman serisi (ciro) için dolgu + çizgi alan grafiği. Genişliği kapsayıcıya göre esner. */
export function AreaChart({ values, color = "#1775a9", height = 190 }: { values: number[]; color?: string; height?: number }) {
  const width = 640;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const padY = 14;
  const step = width / (values.length - 1 || 1);
  const yFor = (value: number) => padY + (1 - (value - min) / range) * (height - padY * 2);
  const points = values.map((value, index) => [index * step, yFor(value)] as const);
  const line = points.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;

  return (
    <svg className="area-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label="Ciro trendi">
      <defs>
        <linearGradient id="admin-rev-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.22" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((fraction) => <line key={fraction} x1="0" x2={width} y1={height * fraction} y2={height * fraction} stroke="#eef2f4" strokeWidth="1" />)}
      <path d={area} fill="url(#admin-rev-fill)" />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** KPI kartlarının altında küçük trend çizgisi. */
export function Sparkline({ values, color = "#1775a9", width = 150, height = 46 }: { values: number[]; color?: string; width?: number; height?: number }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1 || 1);
  const yFor = (value: number) => 3 + (1 - (value - min) / range) * (height - 6);
  const line = values.map((value, index) => `${index === 0 ? "M" : "L"}${(index * step).toFixed(1)},${yFor(value).toFixed(1)}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;

  return (
    <svg className="sparkline" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="admin-spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.18" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#admin-spark-fill)" />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
