"use client";
import { useEffect, useRef } from "react";

type EffectType = 'nodes' | 'stream' | 'pulse';

export default function CardGraphics({ type }: { type: EffectType }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let w = canvas.width = parent.offsetWidth;
    let h = canvas.height = parent.offsetHeight;
    
    const resizeObserver = new ResizeObserver(() => {
      w = canvas.width = parent.offsetWidth;
      h = canvas.height = parent.offsetHeight;
    });
    resizeObserver.observe(parent);

    let mouse = { x: w / 2, y: h / 2, targetX: w / 2, targetY: h / 2 };
    let isHovering = false;
    let time = 0;
    
    const onMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      isHovering = true;
    };
    
    const onMouseLeave = () => {
      isHovering = false;
    };
    
    parent.addEventListener('mousemove', onMouseMove);
    parent.addEventListener('mouseleave', onMouseLeave);

    // Initial state based on type
    let particles: any[] = [];
    if (type === 'nodes') {
      for (let i = 0; i < 40; i++) {
        particles.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2,
          radius: Math.random() * 3 + 2
        });
      }
    } else if (type === 'pulse') {
      for (let i = 0; i < 150; i++) {
        particles.push({
          x: 0, y: 0, z: Math.random() * w, 
          pz: Math.random() * w
        });
      }
    }

    const render = () => {
      // Clear with a very slight fade for trail effects, or just clear completely
      ctx.clearRect(0, 0, w, h);
      time += 0.02;
      
      if (isHovering) {
        mouse.x += (mouse.targetX - mouse.x) * 0.15;
        mouse.y += (mouse.targetY - mouse.y) * 0.15;
      } else {
        mouse.x += (w / 2 - mouse.x) * 0.02;
        mouse.y += (h / 2 - mouse.y) * 0.02;
      }

      // Add a vibrant ambient glow at the mouse cursor for all effects
      ctx.globalCompositeOperation = 'screen';
      const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 400);
      glow.addColorStop(0, 'rgba(45, 212, 191, 0.4)');
      glow.addColorStop(1, 'rgba(45, 212, 191, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      if (type === 'nodes') {
        // Vibrant Neural Mesh
        ctx.fillStyle = '#2DD4BF';
        ctx.strokeStyle = '#2DD4BF';
        
        for (let i = 0; i < particles.length; i++) {
          let p = particles[i];
          
          // Mouse attraction
          if (isHovering) {
            let dx = mouse.x - p.x;
            let dy = mouse.y - p.y;
            let dist = Math.hypot(dx, dy);
            if (dist < 200) {
              p.vx += (dx / dist) * 0.05;
              p.vy += (dy / dist) * 0.05;
            }
          }
          
          // Friction & Velocity
          p.vx *= 0.99;
          p.vy *= 0.99;
          p.x += p.vx;
          p.y += p.vy;
          
          // Bounce off edges
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
          
          // Draw Glowing Nodes
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          
          // Laser Connections
          for (let j = i + 1; j < particles.length; j++) {
            let p2 = particles[j];
            let dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 120) {
              ctx.globalAlpha = (1 - dist / 120) * 0.8;
              ctx.lineWidth = (1 - dist / 120) * 3; // Thicker lines when closer
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
          ctx.globalAlpha = 1;
        }
      } 
      else if (type === 'stream') {
        // Quantum Waveform - Multiple intersecting bright sine waves
        ctx.lineWidth = 3;
        
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          // Mix of cyan and blue lines
          ctx.strokeStyle = i % 2 === 0 ? 'rgba(45, 212, 191, 0.8)' : 'rgba(59, 130, 246, 0.6)';
          
          for (let x = 0; x <= w; x += 10) {
            // Interactive amplitude based on mouse distance
            let distToMouseX = Math.abs(x - mouse.x);
            let interactiveAmp = Math.max(0, 200 - distToMouseX) * 0.3;
            
            const baseAmp = 30 + (i * 15);
            const y = (h / 2) + Math.sin(x * 0.01 + time * (1 + i * 0.2)) * (baseAmp + interactiveAmp);
            
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      } 
      else if (type === 'pulse') {
        // Hyperdrive / Starfield Warp
        const centerX = mouse.x;
        const centerY = mouse.y;
        
        ctx.fillStyle = '#2DD4BF';
        
        for (let i = 0; i < particles.length; i++) {
          let p = particles[i];
          p.z -= 5 + (isHovering ? 10 : 0); // Speed up when hovering
          
          if (p.z <= 0) {
            p.x = (Math.random() - 0.5) * w * 2;
            p.y = (Math.random() - 0.5) * h * 2;
            p.z = w;
            p.pz = w;
          }
          
          let k = 300 / p.z;
          let px = centerX + p.x * k;
          let py = centerY + p.y * k;
          
          let pk = 300 / p.pz;
          let ppx = centerX + p.x * pk;
          let ppy = centerY + p.y * pk;
          
          p.pz = p.z; // update previous z
          
          ctx.beginPath();
          ctx.moveTo(ppx, ppy);
          ctx.lineTo(px, py);
          ctx.lineWidth = (1 - p.z / w) * 4; // Thicker as they get closer
          ctx.strokeStyle = `rgba(45, 212, 191, ${1 - p.z / w})`;
          ctx.stroke();
        }
      }

      ctx.globalCompositeOperation = 'source-over';
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      parent.removeEventListener('mousemove', onMouseMove);
      parent.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [type]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'absolute', 
        top: 0, left: 0, 
        width: '100%', height: '100%', 
        pointerEvents: 'none', 
        borderRadius: 'var(--radius)', 
        zIndex: 0,
        opacity: 1 // Full opacity for maximum impact
      }}
    />
  );
}
