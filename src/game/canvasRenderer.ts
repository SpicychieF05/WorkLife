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

    // Manage occasional eye blink while alive
    this.blinkTimer++;
    if (this.blinkTimer > 160) {
      this.isBlinking = true;
      if (this.blinkTimer > 172) {
        this.isBlinking = false;
        this.blinkTimer = 0;
      }
    }

    if (character === 'boy') {
      this.drawMaleCandidate(ctx, r, alive, retired);
    } else {
      this.drawFemaleCandidate(ctx, r, alive, retired);
    }

    ctx.restore();
  }

  private drawMaleCandidate(
    ctx: CanvasRenderingContext2D,
    r: number,
    alive: boolean,
    retired: boolean
  ): void {
    // Exact favicon.svg / StartScreen Rahul M. vector character scaled to hitbox
    const s = (r / 20) * 0.108;
    ctx.save();
    ctx.translate(-256 * s, -264 * s);
    ctx.scale(s, s);

    // 1. Corporate Suit / Blazer Shoulders with smoothly curved hem
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(76, 470);
    ctx.bezierCurveTo(76, 366, 144, 328, 256, 328);
    ctx.bezierCurveTo(368, 328, 436, 366, 436, 470);
    ctx.quadraticCurveTo(256, 516, 76, 470);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 2. White Shirt Collar V
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(184, 332);
    ctx.lineTo(256, 422);
    ctx.lineTo(328, 332);
    ctx.lineTo(292, 318);
    ctx.lineTo(256, 318);
    ctx.lineTo(220, 318);
    ctx.closePath();
    ctx.fill();

    // 3. Corporate Indigo Tie & Knot
    ctx.fillStyle = '#6366f1';
    ctx.beginPath();
    ctx.moveTo(236, 374);
    ctx.lineTo(276, 374);
    ctx.lineTo(290, 468);
    ctx.lineTo(256, 496);
    ctx.lineTo(222, 468);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#4f46e5';
    ctx.beginPath();
    ctx.moveTo(232, 344);
    ctx.lineTo(280, 344);
    ctx.lineTo(272, 380);
    ctx.lineTo(240, 380);
    ctx.closePath();
    ctx.fill();

    // 4. ID Lanyard Accent
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.roundRect(342, 346, 16, 58, 4);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(328, 398, 44, 32, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#6366f1';
    ctx.beginPath();
    ctx.roundRect(336, 408, 28, 6, 2);
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.roundRect(336, 418, 18, 4, 2);
    ctx.fill();

    // 5. Candidate Head
    ctx.fillStyle = '#fcd34d';
    ctx.beginPath();
    ctx.arc(256, 212, 122, 0, Math.PI * 2);
    ctx.fill();

    // 6. Side-Parted Professional Hair
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.moveTo(134, 202);
    ctx.bezierCurveTo(134, 114, 192, 78, 262, 78);
    ctx.bezierCurveTo(334, 78, 378, 122, 378, 202);
    ctx.bezierCurveTo(360, 170, 332, 156, 290, 154);
    ctx.bezierCurveTo(242, 152, 204, 170, 176, 190);
    ctx.bezierCurveTo(158, 196, 144, 202, 134, 202);
    ctx.closePath();
    ctx.fill();

    // 7. Spectacles Lenses & Frames
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.roundRect(156, 176, 84, 72, 18);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.roundRect(272, 176, 84, 72, 18);
    ctx.fill();
    ctx.stroke();

    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(240, 210);
    ctx.lineTo(272, 210);
    ctx.stroke();

    // 8. Eyes (Awake / Blinking / Knocked-out)
    if (!alive || retired) {
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(182, 196); ctx.lineTo(214, 228);
      ctx.moveTo(214, 196); ctx.lineTo(182, 228);
      ctx.moveTo(298, 196); ctx.lineTo(330, 228);
      ctx.moveTo(330, 196); ctx.lineTo(298, 228);
      ctx.stroke();
    } else if (this.isBlinking) {
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(178, 212); ctx.lineTo(218, 212);
      ctx.moveTo(294, 212); ctx.lineTo(334, 212);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(198, 212, 17, 0, Math.PI * 2);
      ctx.arc(314, 212, 17, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(204, 205, 6, 0, Math.PI * 2);
      ctx.arc(320, 205, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // 9. Determined Corporate Smirk (or Frown on exit)
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (!alive) {
      ctx.arc(256, 294, 24, Math.PI * 1.15, Math.PI * 1.85);
    } else {
      ctx.moveTo(232, 284);
      ctx.quadraticCurveTo(258, 290, 282, 276);
    }
    ctx.stroke();

    ctx.restore();
  }

  private drawFemaleCandidate(
    ctx: CanvasRenderingContext2D,
    r: number,
    alive: boolean,
    retired: boolean
  ): void {
    // Exact StartScreen Ananya S. vector character scaled to hitbox
    const s = (r / 20) * 0.9;
    ctx.save();
    ctx.translate(0, 3 * s);
    ctx.scale(s, s);

    // 1. Streaming Flowing Hair & Ponytail Silhouette Behind Head/Shoulders
    ctx.fillStyle = '#1e1b2e';
    ctx.beginPath();
    ctx.moveTo(-14, -31);
    ctx.bezierCurveTo(-32, -29, -39, -14, -40, 4);
    ctx.bezierCurveTo(-34, 7, -28, 3, -25, -4);
    ctx.bezierCurveTo(-26, 9, -26, 20, -18, 23);
    ctx.lineTo(-14, 2);
    ctx.lineTo(15, 2);
    ctx.lineTo(19, 20);
    ctx.bezierCurveTo(25, 18, 27, 8, 24, -10);
    ctx.bezierCurveTo(22, -27, 9, -34, -4, -34);
    ctx.closePath();
    ctx.fill();

    // Hair Wave Highlight
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.65)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-21, -22);
    ctx.bezierCurveTo(-31, -17, -34, -7, -34, 1);
    ctx.stroke();

    // 2. Blazer Torso + V-Neck White Blouse + Teal Collar
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(0, 2, 22.5, 0, Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(-10, 2);
    ctx.lineTo(0, 18);
    ctx.lineTo(10, 2);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#0d9488';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(-8, 3.5);
    ctx.quadraticCurveTo(0, 11, 8, 3.5);
    ctx.stroke();

    // 3. ID Lanyard
    ctx.fillStyle = '#0d9488';
    ctx.fillRect(-2.5, 13, 5, 7);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(-5, 18, 10, 6, 1);
    ctx.fill();

    // 4. Gold Stud Earrings
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(-18.5, -3.5, 2.6, 0, Math.PI * 2);
    ctx.arc(18.5, -3.5, 2.6, 0, Math.PI * 2);
    ctx.fill();

    // 5. Oval Head
    ctx.fillStyle = '#fde68a';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(0, -7, 17, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 6. Full Crown Hair & Side-Swept Bangs
    ctx.fillStyle = '#1e1b2e';
    ctx.beginPath();
    ctx.moveTo(-19, -8);
    ctx.bezierCurveTo(-21, -27, -10, -34, 1, -34);
    ctx.bezierCurveTo(12, -34, 21, -26, 19, -8);
    ctx.bezierCurveTo(16, -14, 10, -18.5, 4, -18.5);
    ctx.bezierCurveTo(-2, -18.5, -9, -14, -19, -8);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#312b49';
    ctx.beginPath();
    ctx.moveTo(-17, -12);
    ctx.bezierCurveTo(-10, -20, -2, -22, 6, -21);
    ctx.bezierCurveTo(12, -20, 16, -17, 18, -13);
    ctx.bezierCurveTo(14, -24, 6, -28, -1, -28);
    ctx.bezierCurveTo(-9, -28, -15, -22, -17, -12);
    ctx.closePath();
    ctx.fill();

    // 7. Arched Eyebrows
    ctx.strokeStyle = '#1e1b2e';
    ctx.lineWidth = 1.7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-11.5, -12.5);
    ctx.quadraticCurveTo(-7, -15, -3, -13);
    ctx.moveTo(3, -13);
    ctx.quadraticCurveTo(7, -15, 11.5, -12.5);
    ctx.stroke();

    // 8. Bindi & Rosy Cheeks
    ctx.fillStyle = '#be123c';
    ctx.beginPath();
    ctx.arc(0, -14, 1.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(251, 113, 133, 0.45)';
    ctx.beginPath();
    ctx.ellipse(-11, -2, 2.8, 1.6, 0, 0, Math.PI * 2);
    ctx.ellipse(11, -2, 2.8, 1.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // 9. Expressive Eyes (Awake / Blinking / Knocked-out)
    if (!alive || retired) {
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-9.5, -9.5); ctx.lineTo(-4.5, -4.5);
      ctx.moveTo(-4.5, -9.5); ctx.lineTo(-9.5, -4.5);
      ctx.moveTo(4.5, -9.5); ctx.lineTo(9.5, -4.5);
      ctx.moveTo(9.5, -9.5); ctx.lineTo(4.5, -4.5);
      ctx.stroke();
    } else if (this.isBlinking) {
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-11, -7); ctx.lineTo(-3, -7);
      ctx.moveTo(3, -7); ctx.lineTo(11, -7);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-7, -7, 4.1, 3.5, 0, 0, Math.PI * 2);
      ctx.ellipse(7, -7, 4.1, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(-6.6, -7, 2.4, 0, Math.PI * 2);
      ctx.arc(7.4, -7, 2.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-5.7, -8, 0.95, 0, Math.PI * 2);
      ctx.arc(8.3, -8, 0.95, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-11.8, -8.8);
      ctx.quadraticCurveTo(-7, -11.5, -2.6, -8.4);
      ctx.moveTo(2.6, -8.4);
      ctx.quadraticCurveTo(7, -11.5, 11.8, -8.8);
      ctx.stroke();
    }

    // 10. Sleek Rounded Spectacles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.strokeStyle = '#5b21b6';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(-7, -7, 6.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(7, -7, 6.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-0.7, -7.5);
    ctx.lineTo(0.7, -7.5);
    ctx.stroke();

    // 11. Warm Smile (or Frown on exit)
    ctx.strokeStyle = '#be123c';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (!alive) {
      ctx.arc(0, 5.5, 3.6, Math.PI * 1.15, Math.PI * 1.85);
    } else {
      ctx.moveTo(-4.5, 2);
      ctx.quadraticCurveTo(0, 5.5, 4.5, 2);
    }
    ctx.stroke();

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
