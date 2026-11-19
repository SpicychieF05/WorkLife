import { Bird, CareerDomain, Character, CorporateEvent, FlightState, Pipe, Track } from '../types/game';
import { getCompanyForProgression } from './companies';
import { DEFAULT_CAREER_DOMAIN, getRoleTitleForProgression } from './domains';
import { sound } from './sound';
import { CORPORATE_EVENTS } from './events';
import { Particle } from './canvasRenderer';

export class GameEngine {
  public bird: Bird;
  public pipes: Pipe[] = [];
  public particles: Particle[] = [];
  public scrollOffset: number = 0;
  public startTime: number = 0;
  public pausedElapsed: number = 0;
  private pauseTimestamp: number = 0;
  public flight: FlightState;

  public activeEvent: CorporateEvent | null = null;
  public eventTimer: number = 0;
  private triggeredEventIds: Set<string> = new Set();

  private static readonly HOVER_DURATION_MS = 5000;
  private static readonly MIN_FIRST_PIPE_DISTANCE_FROM_BIRD = 792; // ~5.5s at 2.4px/frame * 60fps

  private canvasWidth: number = 800;
  private canvasHeight: number = 600;
  private nextPipeId: number = 1;

  public controlTaken: boolean = false;
  public hoverRemainingMs: number = GameEngine.HOVER_DURATION_MS;
  public runwayIntroAlpha: number = 0;

  private hoverStartTime: number = 0;
  private careerStartTime: number = 0;
  private hoverPausedElapsed: number = 0;
  private careerPausedElapsed: number = 0;
  private lastFrameTime: number = 0;
  private hoverAnchorY: number = 280;

  // Track initial base packages (LPA)
  private readonly trackBaseLPA: Record<Track, number> = {
    fresher: 3.6,
    associate: 8.5,
    expert: 24.0
  };

  constructor(
    character: Character,
    track: Track,
    candidateName: string = '',
    domain: CareerDomain = DEFAULT_CAREER_DOMAIN
  ) {
    this.bird = {
      x: 140,
      y: 280,
      vy: 0,
      radius: 20,
      rotation: 0,
      alive: true,
      retired: false
    };

    const firstCompany = getCompanyForProgression(0, 22, 0);
    const resolvedName = candidateName || (character === 'boy' ? 'Rahul Mukherjee' : 'Ananya Sen');

    this.flight = {
      character,
      candidateName: resolvedName,
      track,
      domain,
      age: 22.0,
      elapsedSeconds: 0,
      score: 0,
      packageLPA: this.trackBaseLPA[track],
      currentCompany: firstCompany,
      targetRole: getRoleTitleForProgression(domain, track, 22.0),
      cause: null
    };
  }

  private getBirdXForWidth(w: number): number {
    // Desktop (>= 584px wide) keeps exact original bird.x = 140
    if (w <= 0) return 140;
    return Math.round(Math.max(58, Math.min(140, w * 0.24)));
  }

  public setDimensions(w: number, h: number): void {
    this.canvasWidth = w;
    this.canvasHeight = h;
    this.bird.x = this.getBirdXForWidth(w);
    if (h > 0) {
      const floorY = Math.max(200, h - 44);
      this.hoverAnchorY = Math.min(floorY - this.bird.radius - 12, h * 0.45);
      if (this.bird.y === 280 || !this.startTime || !this.controlTaken) {
        this.bird.y = this.hoverAnchorY;
      } else {
        this.bird.y = Math.max(12 + this.bird.radius, Math.min(floorY - this.bird.radius, this.bird.y));
      }
    }
  }

  public start(): void {
    const now = performance.now();
    this.startTime = now;
    this.hoverStartTime = now;
    this.careerStartTime = 0;
    this.pausedElapsed = 0;
    this.hoverPausedElapsed = 0;
    this.careerPausedElapsed = 0;
    this.pauseTimestamp = 0;
    this.lastFrameTime = 0;

    this.controlTaken = false;
    this.hoverRemainingMs = GameEngine.HOVER_DURATION_MS;
    this.runwayIntroAlpha = 1;

    this.bird.x = this.getBirdXForWidth(this.canvasWidth);
    const floorY = Math.max(200, this.canvasHeight - 44);
    this.hoverAnchorY = Math.min(floorY - this.bird.radius - 12, this.canvasHeight * 0.45);
    this.bird.y = this.hoverAnchorY;
    this.bird.vy = 0;
    this.bird.rotation = 0;

    this.pipes = [];
    this.particles = [];
    this.triggeredEventIds.clear();
    this.activeEvent = null;
    sound.startBed();
  }

  public pause(): void {
    this.pauseTimestamp = performance.now();
    sound.stopBed();
  }

  public resume(): void {
    if (this.pauseTimestamp > 0) {
      const now = performance.now();
      const delta = now - this.pauseTimestamp;
      this.pausedElapsed += delta;
      if (!this.controlTaken) {
        this.hoverPausedElapsed += delta;
      } else {
        this.careerPausedElapsed += delta;
      }
      this.pauseTimestamp = 0;
      this.lastFrameTime = 0;
      sound.startBed();
    }
  }

  private activateControl(now: number): void {
    this.controlTaken = true;
    this.hoverRemainingMs = 0;
    this.careerStartTime = now;
    this.careerPausedElapsed = 0;
    this.bird.vy = 0;
  }

  public flap(): void {
    if (!this.bird.alive || this.bird.retired) return;

    if (!this.controlTaken) {
      this.activateControl(performance.now());
    }

    this.bird.vy = -7.4;
    sound.playFlap();

    // Spawn tiny paper fluttering particles on flap
    for (let i = 0; i < 4; i++) {
      this.particles.push({
        x: this.bird.x - 12 + (Math.random() * 8),
        y: this.bird.y + 10 + (Math.random() * 6),
        vx: -2 - Math.random() * 2,
        vy: 1 + Math.random() * 2,
        life: 35,
        maxLife: 35,
        size: 7 + Math.random() * 5,
        color: Math.random() > 0.5 ? '#ffffff' : '#cbd5e1',
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.2
      });
    }
  }

  public update(frameTimestamp: number = performance.now()): 'RUNNING' | 'EXIT' | 'RETIRED' {
    if (this.flight.cause) {
      return this.flight.cause === 'clock' ? 'RETIRED' : 'EXIT';
    }

    const now = performance.now();

    // Vsync-locked delta-time anchored to 60 FPS with 60Hz jitter snap for silky jump motion
    let dtMs = 16.6667;
    if (this.lastFrameTime > 0) {
      const rawDtMs = frameTimestamp - this.lastFrameTime;
      if (rawDtMs >= 14.5 && rawDtMs <= 18.8) {
        dtMs = 16.6667;
      } else {
        dtMs = Math.max(4, Math.min(50, rawDtMs));
      }
    }
    this.lastFrameTime = frameTimestamp;
    const dtScale = dtMs / (1000 / 60);
    const rotBlend = 1 - Math.pow(1 - 0.2, dtScale);

    // 0. 5-Second Hover Grace Period before gravity engages (unless player takes control earlier)
    if (!this.controlTaken) {
      const hoverElapsedMs = Math.max(0, now - this.hoverStartTime - this.hoverPausedElapsed);
      this.hoverRemainingMs = Math.max(0, GameEngine.HOVER_DURATION_MS - hoverElapsedMs);

      if (this.hoverRemainingMs > 0) {
        this.scrollOffset += 2.4 * dtScale;
        this.bird.y = this.hoverAnchorY + Math.sin(hoverElapsedMs * 0.0055) * 8;
        this.bird.vy = 0;
        this.bird.rotation += (0 - this.bird.rotation) * rotBlend;
        this.updateParticles(dtScale);
        return 'RUNNING';
      }

      // 5 seconds elapsed without input -> release control and let gravity pull the candidate down
      this.activateControl(now);
    }

    // 1. Calculate Elapsed Career Wall-Clock Time & Age (begins once control is active)
    const elapsedMs = Math.max(0, now - this.careerStartTime - this.careerPausedElapsed);
    const elapsedSec = elapsedMs / 1000;
    this.flight.elapsedSeconds = elapsedSec;

    // Career clock: 22.0 to 60.0 over exactly 75.0s
    const progress = Math.min(1.0, elapsedSec / 75.0);
    this.flight.age = 22.0 + (progress * 38.0);

    // Dynamic Role Advancement based on age
    this.updateRoleTitle();

    // 2. Check Retirement Threshold (Age 60 / 75 seconds)
    if (progress >= 1.0 && !this.bird.retired) {
      this.bird.retired = true;
      this.flight.cause = 'clock';
      sound.playRetire();
      return 'RETIRED';
    }

    // 3. Dynamic Speed & Pacing based on age
    const currentSpeed = this.getSpeedForAge(this.flight.age);
    this.scrollOffset += currentSpeed * dtScale;

    // 4. Update Bird Physics (original smooth flap arc & velocity tilt)
    const gravity = 0.38;
    this.bird.vy += gravity * dtScale;
    if (this.bird.vy > 9.5) this.bird.vy = 9.5;
    this.bird.y += this.bird.vy * dtScale;

    // Smooth rotation based on vertical velocity
    const targetRot = Math.max(-0.45, Math.min(0.65, this.bird.vy * 0.08));
    this.bird.rotation += (targetRot - this.bird.rotation) * rotBlend;

    // 5. Update Particles
    this.updateParticles(dtScale);

    // 6. Spawn Pipes according to Pacing
    this.spawnPipesIfNeeded();

    // Fade out open-runway warm-up cue smoothly as the first gate enters view
    if (this.flight.score === 0 && this.pipes.length === 1) {
      const firstPipeX = this.pipes[0].x;
      const fadeStart = this.canvasWidth + 140;
      const fadeEnd = this.canvasWidth - 40;
      if (firstPipeX >= fadeStart) {
        this.runwayIntroAlpha = 1;
      } else if (firstPipeX <= fadeEnd) {
        this.runwayIntroAlpha = 0;
      } else {
        this.runwayIntroAlpha = (firstPipeX - fadeEnd) / Math.max(1, fadeStart - fadeEnd);
      }
    } else {
      this.runwayIntroAlpha = 0;
    }

    // 7. Move & Check Pipes
    const floorY = this.canvasHeight - 44;
    const ceilingY = 12;

    // Collision tolerance
    const tolerance = 4;
    const br = this.bird.radius - tolerance;

    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const pipe = this.pipes[i];
      pipe.x -= currentSpeed * dtScale;

      // Pipe passed / cleared?
      if (!pipe.cleared && (pipe.x + pipe.width) < (this.bird.x - this.bird.radius)) {
        pipe.cleared = true;
        this.flight.score += 1;
        this.flight.currentCompany = pipe.company;
        this.flight.packageLPA += pipe.company.lpaBonus;
        sound.playClear(pipe.company.tier);
      }

      // Check Collision with Pipe
      if (this.bird.alive && !this.bird.retired) {
        const inHorizontalLane = (this.bird.x + br > pipe.x) && (this.bird.x - br < pipe.x + pipe.width);
        if (inHorizontalLane) {
          const hitTop = (this.bird.y - br < pipe.top);
          const hitBottom = (this.bird.y + br > pipe.bottom);
          if (hitTop || hitBottom) {
            this.bird.alive = false;
            this.flight.cause = 'pipe';
            this.flight.crashedCompany = pipe.company;
            sound.playThump();
            sound.playExit();
            return 'EXIT';
          }
        }
      }

      // Remove offscreen pipes
      if (pipe.x + pipe.width < -120) {
        this.pipes.splice(i, 1);
      }
    }

    // 8. Floor & Ceiling Burnout Checks
    if (this.bird.alive && !this.bird.retired) {
      if (this.bird.y + this.bird.radius >= floorY) {
        this.bird.alive = false;
        this.flight.cause = 'floor';
        sound.playThump();
        sound.playExit();
        return 'EXIT';
      }
      if (this.bird.y - this.bird.radius <= ceilingY) {
        this.bird.alive = false;
        this.flight.cause = 'ceiling';
        sound.playThump();
        sound.playExit();
        return 'EXIT';
      }
    }

    // 9. Check Mid-Career Corporate Events
    this.checkCorporateEvents(dtScale);

    return 'RUNNING';
  }

  private updateParticles(dtScale: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dtScale;
      p.y += p.vy * dtScale;
      p.rotation += p.vRot * dtScale;
      p.life -= dtScale;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  private getSpeedForAge(age: number): number {
    if (age < 31) return 2.4;
    if (age < 41) return 2.8;
    if (age < 51) return 3.2;
    return 3.65;
  }

  private getGapForAge(age: number): number {
    if (age < 31) return 170;
    if (age < 41) return 158;
    if (age < 51) return 146;
    return 138;
  }

  private getSpacingForAge(age: number): number {
    if (age < 31) return 270;
    if (age < 41) return 245;
    if (age < 51) return 225;
    return 205;
  }

  private spawnPipesIfNeeded(): void {
    const baseSpacing = this.getSpacingForAge(this.flight.age);
    const baseGap = this.getGapForAge(this.flight.age);

    // Preserve exact desktop spacing/gap; adapt safely only on narrow/short screens
    const spacing =
      this.canvasWidth > 0 && this.canvasWidth < 480
        ? Math.max(195, Math.min(baseSpacing, this.canvasWidth * 0.62))
        : baseSpacing;

    const floorY = Math.max(200, this.canvasHeight - 44);
    const ceilingY = 12;
    const playableH = Math.max(150, floorY - ceilingY);
    const margin = playableH >= 380 ? 60 : Math.max(22, Math.floor(playableH * 0.1));
    const maxAllowedGap = Math.max(106, playableH - margin * 2 - 20);
    const gap = Math.min(baseGap, maxAllowedGap);

    const pipeWidth = this.canvasWidth > 0 && this.canvasWidth < 400 ? 62 : 72;

    const lastPipe = this.pipes[this.pipes.length - 1];
    const isFirstPipe = !lastPipe;

    if (isFirstPipe || (this.canvasWidth + 60 - lastPipe.x) >= spacing) {
      const ring = Math.floor(this.flight.score / 15);
      const company = getCompanyForProgression(this.flight.score, this.flight.age, ring);

      // Safe lane calculation
      const minTopHeight = ceilingY + margin;
      const maxTopHeight = Math.max(minTopHeight, floorY - gap - margin);
      const topHeight = minTopHeight + Math.random() * (maxTopHeight - minTopHeight);
      const bottomY = topHeight + gap;

      // Guarantee ~5.5s open-sky runway on smartphones while preserving desktop (e.g. 1440px) unchanged
      const spawnX = isFirstPipe
        ? Math.max(this.canvasWidth + 20, this.bird.x + GameEngine.MIN_FIRST_PIPE_DISTANCE_FROM_BIRD)
        : this.canvasWidth + 20;

      this.pipes.push({
        id: this.nextPipeId++,
        x: spawnX,
        top: topHeight,
        bottom: bottomY,
        width: pipeWidth,
        gap,
        cleared: false,
        company
      });
    }
  }

  private updateRoleTitle(): void {
    this.flight.targetRole = getRoleTitleForProgression(
      this.flight.domain,
      this.flight.track,
      this.flight.age
    );
  }

  private checkCorporateEvents(dtScale: number): void {
    if (this.activeEvent) {
      this.eventTimer -= dtScale;
      if (this.eventTimer <= 0) {
        this.activeEvent = null;
      }
      return;
    }

    for (const evt of CORPORATE_EVENTS) {
      if (!this.triggeredEventIds.has(evt.id) &&
          this.flight.age >= evt.triggerAgeMin &&
          this.flight.age <= evt.triggerAgeMax) {
        this.triggeredEventIds.add(evt.id);
        this.activeEvent = evt;
        this.eventTimer = 220; // Visible for ~3.5 seconds at 60fps
        break;
      }
    }
  }
}
