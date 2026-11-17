import { Bird, Character, Pipe } from '../types/game';

export interface RenderContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  dpr: number;
  scrollOffset: number;
  bird: Bird;
  character: Character;
  pipes: Pipe[];
  age: number;
  particles: Particle[];
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
}

export class CanvasRenderer {
  private blinkTimer = 0;
  private isBlinking = false;

  public render(data: RenderContext): void {
    const { ctx, width, height, dpr, scrollOffset, bird, character, pipes, age, particles } = data;

    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. Draw Background: Cyber Park Skyline & Atmosphere
    this.drawBackground(ctx, width, height, scrollOffset, age);

    // 2. Draw Pipes / Company Gates
    this.drawPipes(ctx, pipes, height);

    // 3. Draw Particles (flying papers/sparks)
    this.drawParticles(ctx, particles);

    // 4. Draw Floor & Ceiling Borders
    this.drawBorders(ctx, width, height, scrollOffset);

    // 5. Draw Procedural Candidate Avatar
    this.drawCandidate(ctx, bird, character);

    ctx.restore();
  }

  private drawBackground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    scroll: number,
    age: number
  ): void {
    // Dynamic sky shift from morning corporate fresh (22) to late night crunch / dusk (60)
    const careerProgress = Math.min(1, Math.max(0, (age - 22) / 38));
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    if (careerProgress < 0.5) {
      // Daytime corporate grey/blue
      skyGrad.addColorStop(0, '#e2e8f0');
      skyGrad.addColorStop(0.7, '#cbd5e1');
      skyGrad.addColorStop(1, '#94a3b8');
    } else {
      // Evening/night overtime crunch
      skyGrad.addColorStop(0, '#1e293b');
      skyGrad.addColorStop(0.7, '#0f172a');
      skyGrad.addColorStop(1, '#1e1b4b');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Far Layer: Pune / Cyber City High-Rise Tech Towers (Parallax factor 0.15)
    ctx.fillStyle = careerProgress < 0.5 ? 'rgba(148, 163, 184, 0.45)' : 'rgba(30, 41, 59, 0.65)';
    const towerWidth = 60;
    const towerSpacing = 85;
    const baseOffsetFar = (scroll * 0.15) % towerSpacing;

    for (let x = -towerSpacing; x < width + towerSpacing; x += towerSpacing) {
      const screenX = x - baseOffsetFar;
      const towerHeight = 160 + ((Math.sin(x * 99) * 0.5 + 0.5) * 110);
      const towerY = height - 50 - towerHeight;
      ctx.fillRect(screenX, towerY, towerWidth, towerHeight);

      // Lit windows
      ctx.fillStyle = careerProgress < 0.5 ? 'rgba(255, 255, 255, 0.7)' : 'rgba(250, 204, 21, 0.45)';
      for (let wy = towerY + 12; wy < height - 60; wy += 22) {
        for (let wx = screenX + 8; wx < screenX + towerWidth - 8; wx += 14) {
          if ((wx * 13 + wy * 7) % 3 !== 0) {
            ctx.fillRect(wx, wy, 8, 10);
          }
        }
      }
      ctx.fillStyle = careerProgress < 0.5 ? 'rgba(148, 163, 184, 0.45)' : 'rgba(30, 41, 59, 0.65)';
    }

    // Mid Layer: Tech Park Glass Facades & Antennas (Parallax factor 0.35)
    const midSpacing = 110;
    const baseOffsetMid = (scroll * 0.35) % midSpacing;
    ctx.fillStyle = careerProgress < 0.5 ? 'rgba(100, 116, 139, 0.35)' : 'rgba(15, 23, 42, 0.8)';
    for (let x = -midSpacing; x < width + midSpacing; x += midSpacing) {
      const screenX = x - baseOffsetMid;
      const bHeight = 120 + ((Math.cos(x * 47) * 0.5 + 0.5) * 80);
      const bY = height - 50 - bHeight;
      ctx.fillRect(screenX, bY, 75, bHeight);

      // Rooftop antenna tower with red caution light
      ctx.fillRect(screenX + 35, bY - 20, 4, 20);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(screenX + 37, bY - 20, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = careerProgress < 0.5 ? 'rgba(100, 116, 139, 0.35)' : 'rgba(15, 23, 42, 0.8)';
    }

    // Foreground Office Cubicle Wall Silhouette / Floor Skirting
    ctx.fillStyle = 'rgba(15, 23, 42, 0.12)';
    ctx.fillRect(0, height - 70, width, 20);
  }

  private drawBorders(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    scroll: number
  ): void {
    // Top ceiling: False office ceiling tiles
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, 0, width, 12);
    ctx.fillStyle = '#475569';
    ctx.fillRect(0, 10, width, 2);

    // Ceiling lights
    const lightSpacing = 90;
    const lightOffset = (scroll * 0.5) % lightSpacing;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let x = -lightSpacing; x < width + lightSpacing; x += lightSpacing) {
      ctx.fillRect(x - lightOffset, 2, 45, 6);
    }

    // Bottom Floor: Corporate carpet with caution hazard tape
    const floorHeight = 44;
    const floorY = height - floorHeight;

    // Carpet
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, floorY, width, floorHeight);

    // Hazard caution tape along the top of floor
    const stripeWidth = 18;
    const stripeOffset = (scroll * 1.0) % (stripeWidth * 2);
    ctx.fillStyle = '#f59e0b'; // Amber caution
    ctx.fillRect(0, floorY, width, 6);

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, floorY, width, 6);
    ctx.clip();
    ctx.fillStyle = '#0f172a';
    for (let x = -stripeWidth * 2; x < width + stripeWidth * 2; x += stripeWidth * 2) {
      ctx.beginPath();
      ctx.moveTo(x - stripeOffset, floorY + 6);
      ctx.lineTo(x - stripeOffset + stripeWidth, floorY);
      ctx.lineTo(x - stripeOffset + stripeWidth * 1.5, floorY);
      ctx.lineTo(x - stripeOffset + stripeWidth * 0.5, floorY + 6);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // Floor baseboard trim
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, floorY + 6, width, 2);
  }

  private drawPipes(
    ctx: CanvasRenderingContext2D,
    pipes: Pipe[],
    canvasHeight: number
  ): void {
    for (const pipe of pipes) {
      const { x, top, bottom, width, company } = pipe;
      const isFaang = company.tier === 'FAANG';

      // 1. Top Pipe Body (down to y = top)
      this.drawPipeSection(ctx, x, 0, width, top, company.color, true, isFaang);

      // 2. Bottom Pipe Body (from y = bottom to floor)
      const bottomHeight = canvasHeight - bottom;
      this.drawPipeSection(ctx, x, bottom, width, bottomHeight, company.color, false, isFaang);

      // 3. Corporate Nameplate Plaque mounted in the center gap or along the pipe
      this.drawCompanyPlaque(ctx, x, top, bottom, width, company);
    }
  }

  private drawPipeSection(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    brandColor: string,
    isTop: boolean,
    isFaang: boolean
  ): void {
    if (h <= 0) return;

    // Main column gradient (metallic corporate pillar)
    const grad = ctx.createLinearGradient(x, 0, x + w, 0);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(0.2, '#334155');
    grad.addColorStop(0.5, '#475569');
    grad.addColorStop(0.8, '#334155');
    grad.addColorStop(1, '#0f172a');

    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);

    // Beveled accent lines
    ctx.fillStyle = brandColor;
    ctx.fillRect(x + 4, y, 3, h);
    if (isFaang) {
      ctx.fillStyle = '#fbbf24'; // Gold FAANG trim
      ctx.fillRect(x + w - 7, y, 3, h);
    }

    // Pipe Cap (the lip facing the gap)
    const capHeight = 22;
    const capOverhang = 5;
    const capX = x - capOverhang;
    const capW = w + capOverhang * 2;
    const capY = isTop ? y + h - capHeight : y;

    const capGrad = ctx.createLinearGradient(capX, 0, capX + capW, 0);
    capGrad.addColorStop(0, '#0f172a');
    capGrad.addColorStop(0.3, '#334155');
    capGrad.addColorStop(0.6, '#475569');
    capGrad.addColorStop(1, '#0f172a');

    ctx.fillStyle = capGrad;
    ctx.beginPath();
    ctx.roundRect(capX, capY, capW, capHeight, 3);
    ctx.fill();

    // Cap border
    ctx.strokeStyle = isFaang ? '#fbbf24' : '#64748b';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  private drawCompanyPlaque(
    ctx: CanvasRenderingContext2D,
    x: number,
    top: number,
    bottom: number,
    pipeWidth: number,
    company: import('../types/game').Company
  ): void {
    // Draw plaque attached to the bottom pipe cap or upper pipe
    const plaqueW = 100;
    const plaqueH = 34;
    const plaqueX = x + (pipeWidth - plaqueW) / 2;
    const plaqueY = bottom + 16;

    // Plaque background card
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = company.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(plaqueX, plaqueY, plaqueW, plaqueH, 4);
    ctx.fill();
    ctx.stroke();

    // Small mounting bolts
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(plaqueX + 5, plaqueY + 5, 1.5, 0, Math.PI * 2);
    ctx.arc(plaqueX + plaqueW - 5, plaqueY + 5, 1.5, 0, Math.PI * 2);
    ctx.arc(plaqueX + 5, plaqueY + plaqueH - 5, 1.5, 0, Math.PI * 2);
    ctx.arc(plaqueX + plaqueW - 5, plaqueY + plaqueH - 5, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Tier badge strip
    ctx.fillStyle = company.badgeBg;
    ctx.beginPath();
    ctx.roundRect(plaqueX + 6, plaqueY + 5, 34, 11, 2);
    ctx.fill();

    ctx.fillStyle = company.badgeText;
    ctx.font = 'bold 8px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(company.tier, plaqueX + 23, plaqueY + 10.5);

    // Company Name
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(company.name, plaqueX + 44, plaqueY + 11);

    // Satirical LPA prompt
    ctx.fillStyle = '#64748b';
    ctx.font = '8px system-ui, sans-serif';
    ctx.fillText(`GATE ${company.tier === 'FAANG' ? '★ FAANG' : 'HIRE'}`, plaqueX + 8, plaqueY + 25);
  }

  private drawCandidate(
    ctx: CanvasRenderingContext2D,
    bird: Bird,
    character: Character
  ): void {
    const { x, y, rotation, alive, retired } = bird;
    const r = bird.radius;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    // Manage occasional eye blink
    this.blinkTimer++;
    if (this.blinkTimer > 160) {
      this.isBlinking = true;
      if (this.blinkTimer > 172) {
        this.isBlinking = false;
        this.blinkTimer = 0;
      }
    }

    // 1. Corporate Suit Body (bottom hemisphere)
    ctx.fillStyle = '#1e293b'; // Navy corporate blazer
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI);
    ctx.fill();

    // 2. White Collar
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-9, 0);
    ctx.lineTo(0, 8);
    ctx.lineTo(9, 0);
    ctx.closePath();
    ctx.fill();

    // 3. Corporate Red/Indigo Tie
    ctx.fillStyle = character === 'boy' ? '#e11d48' : '#6366f1';
    ctx.beginPath();
    ctx.moveTo(-3, 4);
    ctx.lineTo(3, 4);
    ctx.lineTo(4.5, 16);
    ctx.lineTo(0, 19);
    ctx.lineTo(-4.5, 16);
    ctx.closePath();
    ctx.fill();

    // 4. Head (top circle)
    ctx.fillStyle = '#fcd34d'; // Warm stylized skin tone
    ctx.beginPath();
    ctx.arc(0, -5, r - 3, 0, Math.PI * 2);
    ctx.fill();

    // 5. Hair Style
    if (character === 'boy') {
      // Short professional side-part hair
      ctx.fillStyle = '#1f2937';
      ctx.beginPath();
      ctx.arc(0, -9, r - 2.5, Math.PI * 0.9, Math.PI * 2.1);
      ctx.lineTo(r - 5, -5);
      ctx.lineTo(-r + 5, -5);
      ctx.closePath();
      ctx.fill();
    } else {
      // Girl hairstyle: polished corporate bob/part
      ctx.fillStyle = '#374151';
      ctx.beginPath();
      ctx.arc(0, -8, r - 1.5, Math.PI * 0.8, Math.PI * 2.2);
      ctx.lineTo(r - 1, 4);
      ctx.lineTo(r - 5, 4);
      ctx.lineTo(r - 5, -3);
      ctx.lineTo(-r + 5, -3);
      ctx.lineTo(-r + 5, 4);
      ctx.lineTo(-r + 1, 4);
      ctx.closePath();
      ctx.fill();
    }

    // 6. Eyes (or Glasses)
    if (!alive || retired) {
      // Knocked out / retired: 'X' eyes
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      // Left eye X
      ctx.beginPath();
      ctx.moveTo(-7, -7); ctx.lineTo(-3, -3);
      ctx.moveTo(-3, -7); ctx.lineTo(-7, -3);
      ctx.stroke();
      // Right eye X
      ctx.beginPath();
      ctx.moveTo(3, -7); ctx.lineTo(7, -3);
      ctx.moveTo(7, -7); ctx.lineTo(3, -3);
      ctx.stroke();
    } else if (this.isBlinking) {
      // Closed line
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-8, -5); ctx.lineTo(-2, -5);
      ctx.moveTo(2, -5); ctx.lineTo(8, -5);
      ctx.stroke();
    } else {
      // Awake eyes
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(-5, -5, 2.5, 0, Math.PI * 2);
      ctx.arc(5, -5, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // White eye glint
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-4, -6, 1, 0, Math.PI * 2);
      ctx.arc(6, -6, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Spectacles frame (standard IT engineer signature)
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(-9, -9, 8, 8, 2);
    ctx.roundRect(1, -9, 8, 8, 2);
    ctx.moveTo(-1, -5);
    ctx.lineTo(1, -5);
    ctx.stroke();

    // 7. Determined / Stressed mouth
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (!alive) {
      // Frown
      ctx.arc(0, 4, 3, Math.PI * 1.1, Math.PI * 1.9);
    } else {
      // Determined smirk
      ctx.moveTo(-3, 3);
      ctx.lineTo(3, 2);
    }
    ctx.stroke();

    // 8. ID Card Lanyard hanging from neck
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-2, 10, 4, 6);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-4, 14, 8, 5);

    ctx.restore();
  }

  private drawParticles(
    ctx: CanvasRenderingContext2D,
    particles: Particle[]
  ): void {
    for (const p of particles) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      // Small fluttering paper rectangle
      ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.7);
      ctx.restore();
    }
    ctx.globalAlpha = 1.0;
  }
}
