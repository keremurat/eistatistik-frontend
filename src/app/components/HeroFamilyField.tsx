"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  radius: number;
  driftX: number;
  driftY: number;
  phase: number;
  color: "blue" | "green";
};

const COLORS = {
  blue: [22, 125, 174],
  green: [79, 157, 104],
} as const;

function createParticles(width: number, height: number): Particle[] {
  const count = Math.max(16, Math.min(28, Math.round(width / 72)));
  return Array.from({ length: count }, (_, index) => {
    const column = (index * 47) % count;
    return {
      x: ((column + 0.5) / count) * width,
      y: (((index * 83) % count) + 0.5) / count * height,
      radius: 1.2 + (index % 4) * 0.45,
      driftX: 3.5 + (index % 5) * 1.1,
      driftY: 2.5 + (index % 4) * 0.9,
      phase: index * 0.73,
      color: index % 4 === 0 ? "green" : "blue",
    };
  });
}

function trailY(x: number, width: number, height: number, index: number, time: number) {
  const progress = x / Math.max(width, 1);
  const fieldProgress = Math.max(0, Math.min(1, progress));
  const middle = 6;
  const spread = 0.2 + Math.sin(fieldProgress * Math.PI) * 0.8;
  const center = height * 0.49 + (index - middle) * height * 0.047 * spread;
  const envelope = Math.sin(fieldProgress * Math.PI) ** 2.4;
  const primary = Math.sin(progress * Math.PI * (2.35 + index * 0.075) + time * (0.2 + index * 0.008) + index * 0.52);
  const secondary = Math.cos(progress * Math.PI * 5.2 - time * 0.14 + index * 0.37);
  return center + (primary * height * 0.043 + secondary * height * 0.012) * envelope;
}

function smoothstep(edgeStart: number, edgeEnd: number, value: number) {
  const progress = Math.max(0, Math.min(1, (value - edgeStart) / (edgeEnd - edgeStart)));
  return progress * progress * (3 - 2 * progress);
}

export function HeroFamilyField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let frame = 0;
    let particles: Particle[] = [];
    let pointerX = 0;
    let pointerY = 0;
    let pointerTargetX = 0;
    let pointerTargetY = 0;
    const startedAt = performance.now();

    const handlePointerMove = (event: PointerEvent) => {
      if (reducedMotion) return;
      const bounds = container.getBoundingClientRect();
      const nextX = ((event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5) * 2;
      const nextY = ((event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5) * 2;
      pointerTargetX = Number.isFinite(nextX) ? nextX : 0;
      pointerTargetY = Number.isFinite(nextY) ? nextY : 0;
    };

    const handlePointerLeave = () => {
      pointerTargetX = 0;
      pointerTargetY = 0;
    };

    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(height * ratio));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = createParticles(width, height);
    };

    const draw = (now: number) => {
      if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
        if (!reducedMotion) frame = window.requestAnimationFrame(draw);
        return;
      }
      const time = reducedMotion ? 0 : (now - startedAt) / 1000;
      const fiberReveal = reducedMotion ? 1 : smoothstep(0.08, 1.6, time);
      const nodeTime = reducedMotion ? 0 : Math.max(0, time - 1.48);
      const nodeIntro = reducedMotion ? 1 : smoothstep(0, 0.42, nodeTime);
      pointerX += (pointerTargetX - pointerX) * 0.035;
      pointerY += (pointerTargetY - pointerY) * 0.035;
      context.clearRect(0, 0, width, height);

      const washX = width * (0.7 + pointerX * 0.025);
      const washY = height * (0.46 + pointerY * 0.025);
      const wash = context.createRadialGradient(washX, washY, 0, washX, washY, width * 0.58);
      wash.addColorStop(0, "rgba(65, 177, 214, 0.2)");
      wash.addColorStop(0.34, "rgba(23, 117, 169, 0.095)");
      wash.addColorStop(0.66, "rgba(79, 157, 104, 0.035)");
      wash.addColorStop(1, "rgba(23, 117, 169, 0)");
      context.fillStyle = wash;
      context.fillRect(0, 0, width, height);

      const halo = context.createRadialGradient(width * 0.83, height * 0.24, 0, width * 0.83, height * 0.24, height * 0.52);
      halo.addColorStop(0, "rgba(255,255,255,0.38)");
      halo.addColorStop(0.42, "rgba(126,203,229,0.09)");
      halo.addColorStop(1, "rgba(126,203,229,0)");
      context.fillStyle = halo;
      context.fillRect(0, 0, width, height);

      for (let trail = 0; trail < 13; trail += 1) {
        const color = trail % 6 === 2 || trail % 6 === 5 ? COLORS.green : COLORS.blue;
        const path = new Path2D();
        const parallaxX = pointerX * (3 + trail * 0.25);
        const parallaxY = pointerY * (2 + Math.abs(trail - 6) * 0.3);
        const pathStart = width * -0.04;
        const pathLength = width * 1.12;
        for (let step = 0; step <= 108; step += 1) {
          const x = pathStart + (step / 108) * pathLength + parallaxX;
          const y = trailY(x, width, height, trail, time) + parallaxY;
          if (step === 0) path.moveTo(x, y);
          else path.lineTo(x, y);
        }

        context.save();
        context.beginPath();
        context.rect(0, 0, width * fiberReveal, height);
        context.clip();

        context.strokeStyle = `rgba(${color.join(",")},${trail % 3 === 0 ? 0.12 : 0.075})`;
        context.lineWidth = trail % 3 === 0 ? 8 : 5.5;
        context.shadowColor = `rgba(${color.join(",")},0.42)`;
        context.shadowBlur = 19;
        context.stroke(path);

        const lineGradient = context.createLinearGradient(0, 0, width, 0);
        lineGradient.addColorStop(0, `rgba(${color.join(",")},0.08)`);
        lineGradient.addColorStop(0.2, `rgba(${color.join(",")},0.27)`);
        lineGradient.addColorStop(0.62, `rgba(${color.join(",")},${trail % 3 === 0 ? 0.58 : 0.42})`);
        lineGradient.addColorStop(0.96, `rgba(${color.join(",")},0.36)`);
        lineGradient.addColorStop(1, `rgba(${color.join(",")},0.3)`);
        context.strokeStyle = lineGradient;
        context.lineWidth = trail % 4 === 0 ? 1.8 : 1.15;
        context.shadowBlur = 0;
        context.stroke(path);
        context.restore();

        for (let pulse = 0; pulse < 2; pulse += 1) {
          if (nodeIntro <= 0) continue;
          const nodeProgress = reducedMotion
            ? 0.54 + pulse * 0.18
            : (nodeTime * (0.032 + trail * 0.0008) + trail * 0.071 + pulse * 0.48) % 1;
          const nodeX = nodeProgress * width + parallaxX;
          const nodeY = trailY(nodeX, width, height, trail, time) + parallaxY;
          if (!Number.isFinite(nodeX) || !Number.isFinite(nodeY)) continue;

          const exitOpacity = 1 - smoothstep(0.955, 0.999, nodeProgress);
          context.save();
          context.globalAlpha = exitOpacity * nodeIntro;

          const tailLength = width * 0.038;
          const tail = context.createLinearGradient(nodeX - tailLength, nodeY, nodeX, nodeY);
          tail.addColorStop(0, `rgba(${color.join(",")},0)`);
          tail.addColorStop(0.62, `rgba(${color.join(",")},0.16)`);
          tail.addColorStop(1, `rgba(${color.join(",")},0.7)`);
          context.beginPath();
          for (let tailStep = 0; tailStep <= 12; tailStep += 1) {
            const tailX = nodeX - tailLength + (tailStep / 12) * tailLength;
            const tailY = trailY(tailX, width, height, trail, time) + parallaxY;
            if (tailStep === 0) context.moveTo(tailX, tailY);
            else context.lineTo(tailX, tailY);
          }
          context.strokeStyle = tail;
          context.lineWidth = 1.35;
          context.stroke();

          const glow = context.createRadialGradient(nodeX, nodeY, 0, nodeX, nodeY, 10);
          glow.addColorStop(0, `rgba(${color.join(",")},0.46)`);
          glow.addColorStop(0.32, `rgba(${color.join(",")},0.2)`);
          glow.addColorStop(1, `rgba(${color.join(",")},0)`);
          context.fillStyle = glow;
          context.beginPath();
          context.arc(nodeX, nodeY, 10, 0, Math.PI * 2);
          context.fill();

          const tangentY = trailY(nodeX + 3, width, height, trail, time) - trailY(nodeX - 3, width, height, trail, time);
          context.translate(nodeX, nodeY);
          context.rotate(Math.atan2(tangentY, 6));
          context.beginPath();
          context.moveTo(-4.5, 0);
          context.lineTo(4.5, 0);
          context.strokeStyle = `rgba(${color.join(",")},0.95)`;
          context.lineWidth = 2.4;
          context.lineCap = "round";
          context.stroke();
          context.beginPath();
          context.arc(2.8, 0, 1.25, 0, Math.PI * 2);
          context.fillStyle = "rgba(255,255,255,0.96)";
          context.fill();
          context.restore();
        }
      }

      const positions = particles.map((particle) => ({
        ...particle,
        px: (particle.x + Math.sin(nodeTime * 0.16 + particle.phase) * particle.driftX + pointerX * 10 + width) % width,
        py: (particle.y + Math.cos(nodeTime * 0.13 + particle.phase) * particle.driftY + pointerY * 7 + height) % height,
      }));

      context.save();
      context.globalAlpha = nodeIntro;
      for (let first = 0; first < positions.length; first += 1) {
        for (let second = first + 1; second < positions.length; second += 1) {
          const dx = positions[first].px - positions[second].px;
          const dy = positions[first].py - positions[second].py;
          const distance = Math.hypot(dx, dy);
          if (distance > 145) continue;
          context.strokeStyle = `rgba(23,117,169,${(1 - distance / 145) * 0.11})`;
          context.lineWidth = 0.6;
          context.beginPath();
          context.moveTo(positions[first].px, positions[first].py);
          context.lineTo(positions[second].px, positions[second].py);
          context.stroke();
        }
      }

      positions.forEach((particle) => {
        const color = COLORS[particle.color];
        const dotGlow = context.createRadialGradient(particle.px, particle.py, 0, particle.px, particle.py, particle.radius * 4.5);
        dotGlow.addColorStop(0, `rgba(${color.join(",")},${particle.color === "green" ? 0.72 : 0.58})`);
        dotGlow.addColorStop(0.28, `rgba(${color.join(",")},0.22)`);
        dotGlow.addColorStop(1, `rgba(${color.join(",")},0)`);
        context.fillStyle = dotGlow;
        context.beginPath();
        context.arc(particle.px, particle.py, particle.radius * 4.5, 0, Math.PI * 2);
        context.fill();
      });
      context.restore();

      if (!reducedMotion) frame = window.requestAnimationFrame(draw);
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reducedMotion) draw(performance.now());
    });
    resizeObserver.observe(container);
    container.addEventListener("pointermove", handlePointerMove, { passive: true });
    container.addEventListener("pointerleave", handlePointerLeave);
    resize();
    draw(performance.now());

    return () => {
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className="landing-hero-family-field" aria-hidden="true" />;
}
