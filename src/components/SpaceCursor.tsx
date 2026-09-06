import React, { useEffect, useRef, useState } from 'react';

export type CursorStyle = 'azure-fluid' | 'solar-gold' | 'aurora-emerald' | 'quantum-violet';

export interface CursorTheme {
  id: CursorStyle;
  name: string;
  category: string;
  primary: string;
  highlight: string;
  deep: string;
  shadowColor: string;
  stroke: (alpha: number) => string;
}

export const CURSOR_THEMES: Record<CursorStyle, CursorTheme> = {
  'azure-fluid': {
    id: 'azure-fluid',
    name: 'Aerospace Azure Cyan',
    category: 'Orbital Telemetry',
    primary: '#0284c7',
    highlight: '#38bdf8',
    deep: '#0369a1',
    shadowColor: 'rgba(14, 165, 233, 0.45)',
    stroke: (a) => `rgba(2, 132, 199, ${a})`
  },
  'solar-gold': {
    id: 'solar-gold',
    name: 'Solar Array Amber',
    category: 'Photovoltaic Array',
    primary: '#d97706',
    highlight: '#fbbf24',
    deep: '#b45309',
    shadowColor: 'rgba(245, 158, 11, 0.45)',
    stroke: (a) => `rgba(217, 119, 6, ${a})`
  },
  'aurora-emerald': {
    id: 'aurora-emerald',
    name: 'Aurora Polar Emerald',
    category: 'Geomagnetic Plasma',
    primary: '#059669',
    highlight: '#34d399',
    deep: '#047857',
    shadowColor: 'rgba(16, 185, 129, 0.45)',
    stroke: (a) => `rgba(5, 150, 105, ${a})`
  },
  'quantum-violet': {
    id: 'quantum-violet',
    name: 'Deep Space Violet',
    category: 'Cosmic Stellar',
    primary: '#6366f1',
    highlight: '#a5b4fc',
    deep: '#4338ca',
    shadowColor: 'rgba(99, 102, 241, 0.45)',
    stroke: (a) => `rgba(99, 102, 241, ${a})`
  }
};

interface TrailNode {
  x: number;
  y: number;
  time: number;
  speed: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export const SpaceCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const prevMousePos = useRef({ x: -100, y: -100 });
  const trail = useRef<TrailNode[]>([]);
  const ripples = useRef<Ripple[]>([]);
  const isHovered = useRef(false);
  const isImageHovered = useRef(false);
  const isMouseDown = useRef(false);
  const isVisible = useRef(false);
  const ringScale = useRef(1);
  const animationFrameId = useRef<number | null>(null);

  // Active cursor style with ref for high-frequency RAF loop
  const [, setRerenderTrigger] = useState(0);
  const activeCursorRef = useRef<CursorStyle>('azure-fluid');

  useEffect(() => {
    const saved = localStorage.getItem('satquery_cursor_style') as CursorStyle;
    if (saved && CURSOR_THEMES[saved]) {
      activeCursorRef.current = saved;
      setRerenderTrigger(n => n + 1);
    }

    const handleCursorChange = () => {
      const updated = localStorage.getItem('satquery_cursor_style') as CursorStyle;
      if (updated && CURSOR_THEMES[updated]) {
        activeCursorRef.current = updated;
        setRerenderTrigger(n => n + 1);
      }
    };

    window.addEventListener('satquery_cursor_changed', handleCursorChange);
    return () => window.removeEventListener('satquery_cursor_changed', handleCursorChange);
  }, []);

  useEffect(() => {
    // Disable on touch devices or if prefers-reduced-motion
    if (
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const onMouseMove = (e: MouseEvent) => {
      isVisible.current = true;
      const currX = e.clientX;
      const currY = e.clientY;
      const prevX = mousePos.current.x;
      const prevY = mousePos.current.y;

      const dx = currX - prevX;
      const dy = currY - prevY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      prevMousePos.current = { x: prevX, y: prevY };
      mousePos.current = { x: currX, y: currY };

      // Add to kinetic 3D trail
      trail.current.unshift({
        x: currX,
        y: currY,
        time: performance.now(),
        speed: Math.min(speed, 40)
      });

      // Cap trail length for sleek minimal responsiveness
      if (trail.current.length > 18) {
        trail.current.pop();
      }

      // Detect hover on interactive UI elements
      const target = e.target as HTMLElement | null;
      if (target) {
        isHovered.current = !!target.closest('button, a, input, select, textarea, [role="button"], label');
        isImageHovered.current = !!target.closest(
          '#satellite-viewer-container, .satellite-raster-image, [data-radar="true"], canvas, svg'
        );
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown.current = true;
      // Single-color 3D ripple
      ripples.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 4,
        maxRadius: 32,
        alpha: 0.8
      });
    };

    const onMouseUp = () => {
      isMouseDown.current = false;
    };

    const onMouseLeave = () => {
      isVisible.current = false;
      trail.current = [];
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = performance.now();
      const maxAge = 320; // 320ms lifetime: fast, responsive, minimal

      // 1. Filter out expired trail nodes
      trail.current = trail.current.filter(node => now - node.time < maxAge);

      const currentTheme = CURSOR_THEMES[activeCursorRef.current] || CURSOR_THEMES['azure-fluid'];

      if (isVisible.current) {
        const points = trail.current;

        // 2. Draw 3D Shaded Kinetic Ribbon
        if (points.length > 2) {
          // Pass A: Soft dark shadow underneath for crisp contrast on pure white cards
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length - 1; i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
          }
          ctx.strokeStyle = 'rgba(15, 23, 42, 0.18)';
          ctx.lineWidth = 5;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();

          // Pass B: Smooth single-color fluid ribbon
          for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const p2 = points[i + 1];
            const ageRatio = (now - p1.time) / maxAge;
            const progress = 1 - ageRatio; // 1 at cursor, 0 at tail
            const width = Math.max(1.2, progress * 4.5);

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = currentTheme.stroke(progress * 0.75);
            ctx.lineWidth = width;
            ctx.lineCap = 'round';
            ctx.stroke();
          }

          // 3. Render 3D Floating Kinetic Beads along the trail
          for (let i = 0; i < points.length; i += 2) {
            const p = points[i];
            const ageRatio = (now - p.time) / maxAge;
            const progress = Math.max(0, 1 - ageRatio);
            const radius = Math.max(1.2, progress * 4.5);
            const alpha = progress;

            ctx.save();

            // 3.1 Drop shadow for guaranteed crispness on white background
            ctx.beginPath();
            ctx.arc(p.x, p.y + 0.8, radius + 0.6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(15, 23, 42, ${alpha * 0.25})`;
            ctx.fill();

            // 3.2 3D Spherical Radial Gradient Body
            const gradient = ctx.createRadialGradient(
              p.x - radius * 0.35,
              p.y - radius * 0.35,
              radius * 0.1,
              p.x,
              p.y,
              radius
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.95})`);
            gradient.addColorStop(0.3, currentTheme.highlight);
            gradient.addColorStop(0.8, currentTheme.primary);
            gradient.addColorStop(1, currentTheme.deep);

            ctx.beginPath();
            ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.shadowBlur = 4;
            ctx.shadowColor = currentTheme.shadowColor;
            ctx.fill();

            ctx.restore();
          }
        }

        // 4. Render Active Expandable Ripples (Click effect)
        for (let i = 0; i < ripples.current.length; i++) {
          const r = ripples.current[i];
          r.radius += (r.maxRadius - r.radius) * 0.12;
          r.alpha *= 0.88;

          ctx.save();
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.strokeStyle = currentTheme.stroke(r.alpha);
          ctx.lineWidth = 1.8;
          ctx.stroke();
          ctx.restore();
        }
        ripples.current = ripples.current.filter(r => r.alpha > 0.04);

        // 5. Render Main 3D Minimal Reticle Cursor at (x, y)
        const { x, y } = mousePos.current;
        const targetScale = isMouseDown.current
          ? 0.8
          : isImageHovered.current
          ? 1.45
          : isHovered.current
          ? 1.3
          : 1.0;

        // Smooth spring easing for cursor ring
        ringScale.current += (targetScale - ringScale.current) * 0.2;

        ctx.save();
        ctx.translate(x, y);

        const currentScale = ringScale.current;
        const baseRingRadius = 10 * currentScale;

        // 5.1 Subtle dark contour ring (ensures 100% visibility on white cards)
        ctx.beginPath();
        ctx.arc(0, 0, baseRingRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.35)';
        ctx.lineWidth = 2.4;
        ctx.stroke();

        // 5.2 Glowing Themed Ring
        ctx.beginPath();
        ctx.arc(0, 0, baseRingRadius, 0, Math.PI * 2);
        ctx.strokeStyle = currentTheme.primary;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 6;
        ctx.shadowColor = currentTheme.shadowColor;
        ctx.stroke();

        // 5.3 If hovering satellite raster, render 4 tiny sleek alignment ticks
        if (isImageHovered.current) {
          ctx.strokeStyle = currentTheme.primary;
          ctx.lineWidth = 1.5;
          const tickDist = baseRingRadius + 3;
          ctx.beginPath();
          ctx.moveTo(0, -tickDist);
          ctx.lineTo(0, -tickDist - 3);
          ctx.moveTo(0, tickDist);
          ctx.lineTo(0, tickDist + 3);
          ctx.moveTo(-tickDist, 0);
          ctx.lineTo(-tickDist - 3, 0);
          ctx.moveTo(tickDist, 0);
          ctx.lineTo(tickDist + 3, 0);
          ctx.stroke();
        }

        // 5.4 Central 3D Sphere Bead
        const coreRadius = isMouseDown.current ? 2.5 : 3.2;
        ctx.beginPath();
        ctx.arc(0, 0.6, coreRadius + 0.6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
        ctx.fill();

        // 3D Spherical Core
        const coreGrad = ctx.createRadialGradient(
          -coreRadius * 0.3,
          -coreRadius * 0.3,
          coreRadius * 0.1,
          0,
          0,
          coreRadius
        );
        coreGrad.addColorStop(0, '#ffffff');
        coreGrad.addColorStop(0.35, currentTheme.highlight);
        coreGrad.addColorStop(0.85, currentTheme.primary);
        coreGrad.addColorStop(1, currentTheme.deep);

        ctx.beginPath();
        ctx.arc(0, 0, coreRadius, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();

        ctx.restore();
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    />
  );
};
