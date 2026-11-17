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

  private canvasWidth: number = 800;
  private canvasHeight: number = 600;
  private nextPipeId: number = 1;
  private nextPipeSpawnX: number = 420;

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

  public setDimensions(w: number, h: number): void {
    this.canvasWidth = w;
    this.canvasHeight = h;
    if (this.bird.y === 280 && h > 0) {
      this.bird.y = h * 0.45;
    }
  }

  public start(): void {
    this.startTime = performance.now();
    this.pausedElapsed = 0;
    this.nextPipeSpawnX = this.canvasWidth + 120; // First pipe placed far enough for initial flap
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
      this.pausedElapsed += (performance.now() - this.pauseTimestamp);
      this.pauseTimestamp = 0;
      sound.startBed();
    }
  }

  public flap(): void {
    if (!this.bird.alive || this.bird.retired) return;

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

  public update(): 'RUNNING' | 'EXIT' | 'RETIRED' {
    if (this.flight.cause) {
      return this.flight.cause === 'clock' ? 'RETIRED' : 'EXIT';
    }

    // 1. Calculate Elapsed Wall-Clock Time & Age
    const now = performance.now();
    const effectiveNow = this.pauseTimestamp > 0 ? this.pauseTimestamp : now;
    const elapsedMs = Math.max(0, effectiveNow - this.startTime - this.pausedElapsed);
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
    this.scrollOffset += currentSpeed;

    // 4. Update Bird Physics
    const gravity = 0.38;
    this.bird.vy += gravity;
    if (this.bird.vy > 9.5) this.bird.vy = 9.5;
    this.bird.y += this.bird.vy;

    // Smooth rotation based on vertical velocity
    const targetRot = Math.max(-0.45, Math.min(0.65, this.bird.vy * 0.08));
    this.bird.rotation += (targetRot - this.bird.rotation) * 0.2;

    // 5. Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vRot;
      p.life--;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // 6. Spawn Pipes according to Pacing
    this.spawnPipesIfNeeded(currentSpeed);

    // 7. Move & Check Pipes
    const floorY = this.canvasHeight - 44;
    const ceilingY = 12;

    // Collision tolerance
    const tolerance = 4;
    const br = this.bird.radius - tolerance;

    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const pipe = this.pipes[i];
      pipe.x -= currentSpeed;

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
    this.checkCorporateEvents();

    return 'RUNNING';
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

  private spawnPipesIfNeeded(speed: number): void {
    const spacing = this.getSpacingForAge(this.flight.age);
    const gap = this.getGapForAge(this.flight.age);
    const pipeWidth = 72;

    const lastPipe = this.pipes[this.pipes.length - 1];
    const rightEdge = lastPipe ? lastPipe.x : this.canvasWidth;

    if (!lastPipe || (this.canvasWidth + 60 - rightEdge) >= spacing) {
      const ring = Math.floor(this.flight.score / 15);
      const company = getCompanyForProgression(this.flight.score, this.flight.age, ring);

      // Safe lane calculation
      const minTopHeight = 60;
      const maxTopHeight = this.canvasHeight - 44 - gap - 60;
      const topHeight = minTopHeight + Math.random() * (maxTopHeight - minTopHeight);
      const bottomY = topHeight + gap;

      this.pipes.push({
        id: this.nextPipeId++,
        x: this.canvasWidth + 20,
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

  private checkCorporateEvents(): void {
    if (this.activeEvent) {
      this.eventTimer--;
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
        this.eventTimer = 220; // Visible for ~3.5 seconds
        break;
      }
    }
  }
}
