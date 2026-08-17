"use client";

import { useState } from "react";

// Admin dashboard için hafif, bağımlılıksız custom SVG grafikleri.
// Marka renkleriyle çizilir ve fare/klavye etkileşimlerini destekler.

type Segment = { label: string; value: number; color: string };

/** Görev durumu / ödeme yöntemi gibi parça-bütün dağılımları için halka grafik. */
export function Donut({ segments, size = 150, thickness = 18, children }: { segments: Segment[]; size?: number; thickness?: number; children?: React.ReactNode }) {
  const [active, setActive] = useState<number | null>(null);
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;
  const radius = (size - thickness - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const lengths = segments.map((segment) => (segment.value / total) * circumference);
  const arcs = segments.map((segment, index) => ({
    ...segment,
    index,
    length: lengths[index],
    offset: lengths.slice(0, index).reduce((sum, value) => sum + value, 0),
  }));
  const renderedArcs = active === null ? arcs : [...arcs.filter((arc) => arc.index !== active), arcs[active]];
  const activeSegment = active === null ? null : segments[active];
  const activePercent = activeSegment ? (activeSegment.value / total) * 100 : 0;

  return (
    <div className="donut interactive-donut" style={{ width: size, height: size }} onMouseLeave={() => setActive(null)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-hidden="true">
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle className="donut-track" cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#eef2f4" strokeWidth={thickness} />
          {renderedArcs.map((arc) => (
            <circle key={arc.label} className={active === arc.index ? "active" : active !== null ? "dimmed" : ""} cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={arc.color} strokeWidth={thickness} strokeDasharray={`${arc.length} ${circumference - arc.length}`} strokeDashoffset={-arc.offset} tabIndex={0} aria-label={`${arc.label}: ${arc.value}`} onMouseEnter={() => setActive(arc.index)} onFocus={() => setActive(arc.index)} onBlur={() => setActive(null)} />
          ))}
        </g>
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

/** Zaman serisi (ciro) için dolgu + çizgi alan grafiği. Genişliği kapsayıcıya göre esner. */
export function AreaChart({ values, labels, color = "#1775a9", height = 190, valueFormatter }: { values: number[]; labels?: string[]; color?: string; height?: number; valueFormatter?: (value:number) => string }) {
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
  const line = points.reduce((path, [x, y], index) => {
    if (index === 0) return `M${x.toFixed(1)},${y.toFixed(1)}`;
    const [previousX, previousY] = points[index - 1];
    const controlX = (previousX + x) / 2;
    return `${path} C${controlX.toFixed(1)},${previousY.toFixed(1)} ${controlX.toFixed(1)},${y.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
  }, "");
  const area = `${line} L${width - plotRight},${height - padY} L${plotLeft},${height - padY} Z`;

  return (
    <div className="interactive-area-chart" onMouseLeave={() => setActive(null)}>
    <div className="area-y-axis" aria-hidden="true">
      {ticks.map((tick) => <span key={tick} style={{ top: `${(yFor(tick) / height) * 100}%` }}>{tick.toLocaleString("tr-TR")} TL</span>)}
    </div>
    <svg className="area-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label="Ciro trendi">
      <defs>
        <linearGradient id="admin-rev-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.22" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((tick) => {
        const y = yFor(tick);
        return <line key={tick} x1={plotLeft} x2={width - plotRight} y1={y} y2={y} stroke="#e7eef2" strokeWidth="1" strokeDasharray="4 5" />;
      })}
      <path d={area} fill="url(#admin-rev-fill)" />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      {active !== null && <line className="area-active-guide" x1={points[active][0]} x2={points[active][0]} y1={points[active][1]} y2={height - padY} stroke="#7f95a7" strokeWidth="1" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />}
      {points.map(([x], index) => <rect key={index} x={Math.max(plotLeft,x-step/2)} y="0" width={Math.max(step,16)} height={height} fill="transparent" tabIndex={0} aria-label={`${labels?.[index] ?? `${index + 1}. dönem`}: ${valueFormatter ? valueFormatter(values[index]) : values[index]}`} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onBlur={() => setActive(null)} />)}
    </svg>
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
  const width = 920;
  const height = 260;
  const left = 42;
  const bottom = 34;
  const plotHeight = height - bottom - 14;
  const max = Math.max(...values, 1);
  const slot = (width - left) / values.length;
  const barWidth = Math.min(42, slot * .56);
  return <div className="interactive-bar-chart" onMouseLeave={() => setActive(null)}><svg className="bar-chart-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Aylık sipariş sayısı grafiği">
    {[0, .25, .5, .75, 1].map(step => { const y = 14 + plotHeight * (1 - step); return <g key={step}><line x1={left} x2={width} y1={y} y2={y} stroke="#e7eef2" strokeDasharray="4 5" /><text x={left - 10} y={y + 4} textAnchor="end">{Math.round(max * step)}</text></g>; })}
    {values.map((value, index) => { const h = (value / max) * (plotHeight - 8); const x = left + slot * index + (slot - barWidth) / 2; return <g key={`${labels[index]}-${index}`} tabIndex={0} aria-label={`${labels[index]}: ${value} sipariş`} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onBlur={() => setActive(null)}><rect className={active === index ? "active" : ""} x={x} y={14 + plotHeight - h} width={barWidth} height={h} rx="6" fill="#2783b3" /><text x={x + barWidth / 2} y={height - 8} textAnchor="middle">{labels[index]}</text></g>; })}
  </svg>{active !== null && <div className={`chart-tooltip bar-tooltip ${active < 2 ? "edge-start" : active > values.length - 3 ? "edge-end" : ""}`} style={{left:`${((active+.5)/values.length)*100}%`}}><b>{labels[active]}</b><span><i />Sipariş <strong>{values[active].toLocaleString("tr-TR")}</strong></span></div>}</div>;
}

export function RadialProgress({ value, size = 190, children }: { value: number; size?: number; children: React.ReactNode }) {
  const radius = (size - 22) / 2;
  const circumference = 2 * Math.PI * radius;
  return <div className="radial-progress" style={{width:size,height:size}} role="img" aria-label={`Zamanında teslim: yüzde ${value.toLocaleString("tr-TR")}`}><svg viewBox={`0 0 ${size} ${size}`} aria-hidden="true"><g transform={`rotate(-90 ${size/2} ${size/2})`}><circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#edf2f4" strokeWidth="18" /><circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#1775a9" strokeWidth="18" strokeLinecap="round" strokeDasharray={`${circumference * value / 100} ${circumference}`} /></g></svg><div>{children}</div></div>;
}

export function HorizontalBars({ rows }: { rows: {label:string; values:number[]}[] }) {
  const [active, setActive] = useState<{row:number;series:number} | null>(null);
  const max = Math.max(...rows.flatMap(row => row.values), 1);
  return <div className="horizontal-bars" onMouseLeave={() => setActive(null)}>{rows.map((row,rowIndex) => <div className="horizontal-bar-row" key={row.label}><span>{row.label}</span><div><i className={active?.row === rowIndex && active.series === 0 ? "active" : ""} tabIndex={0} aria-label={`${row.label}, toplam sipariş: ${row.values[0]}`} onMouseEnter={() => setActive({row:rowIndex,series:0})} onFocus={() => setActive({row:rowIndex,series:0})} onBlur={() => setActive(null)} style={{width:`${(row.values[0]/max)*100}%`}}><b>{row.values[0]}</b></i><i className={active?.row === rowIndex && active.series === 1 ? "active" : ""} tabIndex={0} aria-label={`${row.label}, teslim edilen: ${row.values[1]}`} onMouseEnter={() => setActive({row:rowIndex,series:1})} onFocus={() => setActive({row:rowIndex,series:1})} onBlur={() => setActive(null)} style={{width:`${(row.values[1]/max)*100}%`}}><b>{row.values[1]}</b></i></div>{active?.row === rowIndex && <div className="chart-tooltip horizontal-tooltip"><b>{row.label}</b><span><i className={active.series === 1 ? "delivered" : ""} />{active.series === 0 ? "Toplam sipariş" : "Teslim edilen"}<strong>{row.values[active.series].toLocaleString("tr-TR")}</strong></span></div>}</div>)}</div>;
}
