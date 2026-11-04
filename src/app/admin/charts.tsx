"use client";

import { useState } from "react";

// Admin dashboard için hafif, bağımlılıksız custom SVG grafikleri.
// Marka renkleriyle çizilir ve fare/klavye etkileşimlerini destekler.

type Segment = { label: string; value: number; color: string };

/** Parça-bütün dağılımı. Dilimler birbirine bitişik, dolu bir halka oluşturur. */
export function Donut({ segments, size = 150, thickness = 18, children }: { segments: Segment[]; size?: number; thickness?: number; children?: React.ReactNode }) {
  const [active, setActive] = useState<number | null>(null);
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const outer = size / 2 - 6;
  const inner = Math.max(outer - thickness, 8);
  let cursor = -Math.PI / 2;
  const slices = segments.map((segment, index) => {
    const span = (segment.value / total) * Math.PI * 2;
    const start = cursor;
    cursor += span;
    return { ...segment, index, start, end: cursor };
  });
  const activeSegment = active === null ? null : segments[active];
  const activePercent = activeSegment ? (activeSegment.value / total) * 100 : 0;

  return (
    <div className="donut interactive-donut" style={{ width: size, height: size }} onMouseLeave={() => setActive(null)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-hidden="true">
        <circle className="donut-track" cx={cx} cy={cy} r={(outer + inner) / 2} fill="none" stroke="#f1f2f4" strokeWidth={outer - inner} />
        {slices.map((slice) => slice.value > 0 && (
          <path
            key={slice.label}
            className={active === slice.index ? "active" : active !== null ? "dimmed" : ""}
            d={ringSlice(cx, cy, active === slice.index ? outer + 3 : outer, inner, slice.start, slice.end)}
            fill={slice.color}
            stroke="#fff"
            strokeWidth="1.5"
            tabIndex={0}
            aria-label={`${slice.label}: ${slice.value}`}
            onMouseEnter={() => setActive(slice.index)}
            onFocus={() => setActive(slice.index)}
            onBlur={() => setActive(null)}
          />
        ))}
      </svg>
      <div className={`donut-center${activeSegment ? " hovered" : ""}`} aria-live="polite">
        {activeSegment ? <>
          <small style={{ color: activeSegment.color }}>{activeSegment.label}</small>
          <strong>{activeSegment.value.toLocaleString("tr-TR")}</strong>
          <em>%{activePercent.toLocaleString("tr-TR", { maximumFractionDigits: 1 })}</em>
        </> : children}
      </div>
    </div>
  );
}

function ringSlice(cx: number, cy: number, outer: number, inner: number, start: number, end: number) {
  const span = end - start;
  if (span >= Math.PI * 2 - 0.001) {
    return `M ${cx + outer} ${cy} A ${outer} ${outer} 0 1 1 ${cx - outer} ${cy} A ${outer} ${outer} 0 1 1 ${cx + outer} ${cy} M ${cx + inner} ${cy} A ${inner} ${inner} 0 1 0 ${cx - inner} ${cy} A ${inner} ${inner} 0 1 0 ${cx + inner} ${cy} Z`;
  }
  const point = (radius: number, angle: number) => [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
  const [x1, y1] = point(outer, start);
  const [x2, y2] = point(outer, end);
  const [x3, y3] = point(inner, end);
  const [x4, y4] = point(inner, start);
  const large = span > Math.PI ? 1 : 0;
  return `M ${x1} ${y1} A ${outer} ${outer} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${inner} ${inner} 0 ${large} 0 ${x4} ${y4} Z`;
}

/** Zaman serisi (ciro) için dolgu + çizgi alan grafiği. Genişliği kapsayıcıya göre esner. */
export function AreaChart({ values, labels, color = "#4472C4", height = 190, valueFormatter }: { values: number[]; labels?: string[]; color?: string; height?: number; valueFormatter?: (value:number) => string }) {
  const [active, setActive] = useState<number | null>(null);
  const width = 700;
  const plotLeft = 0;
  const plotRight = 0;
  const max = Math.max(...values, 0);
  const roughStep = max / 4;
  const magnitude = roughStep > 0 ? 10 ** Math.floor(Math.log10(roughStep)) : 1;
  const normalizedStep = roughStep / magnitude;
  const niceFactor = normalizedStep <= 1 ? 1 : normalizedStep <= 2 ? 2 : normalizedStep <= 5 ? 5 : 10;
  const tickStep = max > 0 ? niceFactor * magnitude : 0;
  const chartMax = tickStep * 4 || 1;
  const padY = 14;
  const plotWidth = width - plotLeft - plotRight;
  const step = plotWidth / (values.length - 1 || 1);
  const yFor = (value: number) => padY + (1 - value / chartMax) * (height - padY * 2);
  const points = values.map((value, index) => [plotLeft + index * step, yFor(value)] as const);
  const ticks = max > 0 ? Array.from({ length: 5 }, (_, index) => tickStep * index) : [0];
  const line = points.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const baseline = height - padY;

  return (
    <div className="interactive-area-chart" onMouseLeave={() => setActive(null)}>
    <div className="area-y-axis" aria-hidden="true">
      {ticks.map((tick) => <span key={tick} style={{ top: `${(yFor(tick) / height) * 100}%` }}>{tick.toLocaleString("tr-TR")} TL</span>)}
    </div>
    <div className="area-plot">
    <svg className="area-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label="Ciro trendi">
      {ticks.map((tick) => {
        const y = yFor(tick);
        return <line key={tick} x1={plotLeft} x2={width - plotRight} y1={y} y2={y} stroke="#e5e7eb" strokeWidth="0.5" />;
      })}
      <line x1={plotLeft} x2={width - plotRight} y1={baseline} y2={baseline} stroke="#000" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="miter" vectorEffect="non-scaling-stroke" />
      {active !== null && <line className="area-active-guide" x1={points[active][0]} x2={points[active][0]} y1={padY} y2={baseline} stroke="#132b46" strokeWidth="1" strokeOpacity="0.35" vectorEffect="non-scaling-stroke" />}
      {points.map(([x], index) => <rect key={index} x={Math.max(plotLeft, x - step / 2)} y="0" width={Math.max(step, 16)} height={height} fill="transparent" tabIndex={0} aria-label={`${labels?.[index] ?? `${index + 1}. dönem`}: ${valueFormatter ? valueFormatter(values[index]) : values[index]}`} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onBlur={() => setActive(null)} />)}
    </svg>
    {points.map(([x, y], index) => <span key={index} className={`plot-point${active === index ? " active" : ""}`} style={{ left: `${(x / width) * 100}%`, top: `${(y / height) * 100}%`, background: color }} />)}
    </div>
    {active !== null && <div className={`chart-tooltip area-tooltip ${active < 2 ? "edge-start" : active > values.length - 3 ? "edge-end" : ""}`} style={{left:`calc(82px + ${(active / (values.length - 1 || 1)) * 100}% - ${(active / (values.length - 1 || 1)) * 88}px)`}}><b>{labels?.[active] ?? `${active + 1}. dönem`}</b><span><i style={{background:color}} />Gelir <strong>{valueFormatter ? valueFormatter(values[active]) : values[active].toLocaleString("tr-TR")}</strong></span></div>}
    </div>
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

export function BarChart({ values, labels }: { values: number[]; labels: string[] }) {
  const [active, setActive] = useState<number | null>(null);
  const width = 640;
  const height = 280;
  const left = 46;
  const right = 8;
  const top = 12;
  const bottom = 32;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const rawMax = Math.max(...values, 0);
  const chartMax = niceCeiling(rawMax);
  const slot = plotWidth / Math.max(values.length, 1);
  const barWidth = slot * 0.9;
  const yFor = (value: number) => top + (1 - value / chartMax) * plotHeight;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((step) => chartMax * step);
  return <div className="interactive-bar-chart" onMouseLeave={() => setActive(null)}><svg className="bar-chart-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Aylık sipariş sayısı grafiği">
    {ticks.map((tick) => { const y = yFor(tick); return <g key={tick}><line x1={left} x2={width - right} y1={y} y2={y} stroke={tick === 0 ? "#000" : "#e5e7eb"} strokeWidth={tick === 0 ? 1 : 0.5} /><text x={left - 8} y={y + 4} textAnchor="end">{Math.round(tick).toLocaleString("tr-TR")}</text></g>; })}
    {values.map((value, index) => { const h = (value / chartMax) * plotHeight; const x = left + slot * index + (slot - barWidth) / 2; const y = top + plotHeight - h; return <g key={`${labels[index]}-${index}`} tabIndex={0} aria-label={`${labels[index]}: ${value} sipariş`} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onBlur={() => setActive(null)}><rect className={active === index ? "active" : ""} x={x} y={y} width={barWidth} height={Math.max(h, value > 0 ? 1 : 0)} fill="#4472C4" fillOpacity={active === index ? 1 : 0.8} /><text x={x + barWidth / 2} y={height - 10} textAnchor="middle">{labels[index]}</text></g>; })}
  </svg>{active !== null && <div className={`chart-tooltip bar-tooltip ${active < 2 ? "edge-start" : active > values.length - 3 ? "edge-end" : ""}`} style={{left:`${((active + .5) / values.length) * 100}%`}}><b>{labels[active]}</b><span><i />Sipariş <strong>{values[active].toLocaleString("tr-TR")}</strong></span></div>}</div>;
}

function niceCeiling(max: number) {
  if (max <= 0) return 4;
  const exponent = 10 ** Math.floor(Math.log10(max));
  const fraction = max / exponent;
  const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 2.5 ? 2.5 : fraction <= 5 ? 5 : 10;
  return nice * exponent;
}

export function RadialProgress({ value, size = 190, children }: { value: number; size?: number; children: React.ReactNode }) {
  const radius = (size - 22) / 2;
  const circumference = 2 * Math.PI * radius;
  return <div className="radial-progress" style={{width:size,height:size}} role="img" aria-label={`Zamanında teslim: yüzde ${value.toLocaleString("tr-TR")}`}><svg viewBox={`0 0 ${size} ${size}`} aria-hidden="true"><g transform={`rotate(-90 ${size/2} ${size/2})`}><circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#f1f2f4" strokeWidth="16" /><circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#1775a9" strokeWidth="16" strokeLinecap="round" strokeDasharray={`${circumference * Math.min(value, 100) / 100} ${circumference}`} /></g></svg><div>{children}</div></div>;
}

export function HorizontalBars({ rows, seriesLabels = ["Toplam sipariş", "Teslim edilen"] }: { rows: {label:string; values:number[]}[]; seriesLabels?: [string, string] }) {
  const [active, setActive] = useState<{row:number;series:number} | null>(null);
  const max = Math.max(...rows.flatMap(row => row.values), 1);
  return <div className="horizontal-bars" onMouseLeave={() => setActive(null)}>{rows.map((row,rowIndex) => <div className="horizontal-bar-row" key={row.label}><span>{row.label}</span><div><i className={active?.row === rowIndex && active.series === 0 ? "active" : ""} tabIndex={0} aria-label={`${row.label}, ${seriesLabels[0]}: ${row.values[0]}`} onMouseEnter={() => setActive({row:rowIndex,series:0})} onFocus={() => setActive({row:rowIndex,series:0})} onBlur={() => setActive(null)} style={{width:`${(row.values[0]/max)*100}%`}} />{row.values[1] != null && <i className={active?.row === rowIndex && active.series === 1 ? "active" : ""} tabIndex={0} aria-label={`${row.label}, ${seriesLabels[1]}: ${row.values[1]}`} onMouseEnter={() => setActive({row:rowIndex,series:1})} onFocus={() => setActive({row:rowIndex,series:1})} onBlur={() => setActive(null)} style={{width:`${((row.values[1] ?? 0)/max)*100}%`}} />}</div><div className="hbar-values"><b>{row.values[0].toLocaleString("tr-TR")}</b>{row.values[1] != null && <b className="delivered">{row.values[1].toLocaleString("tr-TR")}</b>}</div>{active?.row === rowIndex && <div className="chart-tooltip horizontal-tooltip"><b>{row.label}</b><span><i className={active.series === 1 ? "delivered" : ""} />{seriesLabels[active.series] ?? seriesLabels[0]}<strong>{row.values[active.series].toLocaleString("tr-TR")}</strong></span></div>}</div>)}</div>;
}
