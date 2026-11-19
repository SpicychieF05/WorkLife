/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useEffect, useRef, useState, useCallback } from 'react';
import { BestScores, CareerDomain, CareerRecord, Character, CorporateEvent, FlightState, GameMode, Track } from './types/game';
import { GameEngine } from './game/physics';
import { DEFAULT_CAREER_DOMAIN, isValidCareerDomain } from './game/domains';
import { CanvasRenderer } from './game/canvasRenderer';
import { sound } from './game/sound';
import { StartScreen } from './components/StartScreen';
import { HUD } from './components/HUD';

const ExitScreen = lazy(() => import('./components/ExitScreen').then((m) => ({ default: m.ExitScreen })));
const RetirementScreen = lazy(() => import('./components/RetirementScreen').then((m) => ({ default: m.RetirementScreen })));
const PauseScreen = lazy(() => import('./components/PauseScreen').then((m) => ({ default: m.PauseScreen })));
const RelievingLetterModal = lazy(() => import('./components/RelievingLetterModal').then((m) => ({ default: m.RelievingLetterModal })));
const CareerLogbookModal = lazy(() => import('./components/CareerLogbookModal').then((m) => ({ default: m.CareerLogbookModal })));

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const rendererRef = useRef<CanvasRenderer>(new CanvasRenderer());
  const animationFrameRef = useRef<number | null>(null);

  // Persistent Settings
  const [character, setCharacter] = useState<Character>(() => {
    return (localStorage.getItem('worklife:character') as Character) || 'girl';
  });

  const [candidateName, setCandidateName] = useState<string>(() => {
    return localStorage.getItem('worklife:candidate_name') || 'Ananya Sen';
  });

  const [track, setTrack] = useState<Track>(() => {
    return (localStorage.getItem('worklife:level') as Track) || 'associate';
  });

  const [domain, setDomain] = useState<CareerDomain>(() => {
    const saved = localStorage.getItem('worklife:domain');
    return isValidCareerDomain(saved) ? saved : DEFAULT_CAREER_DOMAIN;
  });

  const [bestScores, setBestScores] = useState<BestScores>(() => {
    try {
      const raw = localStorage.getItem('worklife:best');
      return raw ? JSON.parse(raw) : { fresher: 0, associate: 0, expert: 0 };
    } catch {
      return { fresher: 0, associate: 0, expert: 0 };
    }
  });

  const [history, setHistory] = useState<CareerRecord[]>(() => {
    try {
      const raw = localStorage.getItem('worklife:history');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(sound.enabled);
  const [gameMode, setGameMode] = useState<GameMode>('IDLE');
  const [flightState, setFlightState] = useState<FlightState>(() => {
    const tempEngine = new GameEngine(character, track, candidateName, domain);
    return tempEngine.flight;
  });
  const [activeEvent, setActiveEvent] = useState<CorporateEvent | null>(null);

  // Modal Dialogs
  const [showRelieving, setShowRelieving] = useState(false);
  const [showLogbook, setShowLogbook] = useState(false);

  // 5-second restart lockout when Exit Interview Record appears
  const exitLockUntilRef = useRef<number>(0);
  const [exitRestartCooldownSec, setExitRestartCooldownSec] = useState<number>(0);

  useEffect(() => {
    if (gameMode !== 'EXIT') {
      exitLockUntilRef.current = 0;
      setExitRestartCooldownSec(0);
      return;
    }

    const tick = () => {
      const remainingMs = exitLockUntilRef.current - performance.now();
      if (remainingMs <= 0) {
        setExitRestartCooldownSec(0);
      } else {
        setExitRestartCooldownSec(Math.ceil(remainingMs / 1000));
      }
    };

    tick();
    const intervalId = window.setInterval(tick, 100);
    return () => window.clearInterval(intervalId);
  }, [gameMode]);

  // Update localStorage when character or track changes
  const handleSelectCharacter = (c: Character) => {
    setCharacter(c);
    localStorage.setItem('worklife:character', c);
    let updatedName = candidateName;
    if (candidateName === 'Rahul Mukherjee' || candidateName === 'Ananya Sen' || !candidateName.trim()) {
      updatedName = c === 'boy' ? 'Rahul Mukherjee' : 'Ananya Sen';
      setCandidateName(updatedName);
      localStorage.setItem('worklife:candidate_name', updatedName);
    }
    if (gameMode === 'IDLE') {
      const engine = new GameEngine(c, track, updatedName, domain);
      engineRef.current = engine;
      setFlightState(engine.flight);
    }
  };

  const handleChangeCandidateName = (name: string) => {
    setCandidateName(name);
    localStorage.setItem('worklife:candidate_name', name);
    if (gameMode === 'IDLE' && engineRef.current) {
      engineRef.current.flight.candidateName = name;
      setFlightState({ ...engineRef.current.flight });
    }
  };

  const handleSelectTrack = (t: Track) => {
    setTrack(t);
    localStorage.setItem('worklife:level', t);
    if (gameMode === 'IDLE') {
      const engine = new GameEngine(character, t, candidateName, domain);
      engineRef.current = engine;
      setFlightState(engine.flight);
    }
  };

  const handleSelectDomain = (d: CareerDomain) => {
    setDomain(d);
    localStorage.setItem('worklife:domain', d);
    if (gameMode === 'IDLE') {
      const engine = new GameEngine(character, track, candidateName, d);
      engineRef.current = engine;
      setFlightState(engine.flight);
    }
  };

  const handleToggleSound = () => {
    const next = sound.toggleMute();
    setSoundEnabled(next);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Record Run Results to Persistent Storage
  const recordCareerEnd = useCallback((finalFlight: FlightState) => {
    // 1. Update Best Scores
    const currentBest = bestScores[finalFlight.track] || 0;
    if (finalFlight.score > currentBest) {
      const updatedBests = { ...bestScores, [finalFlight.track]: finalFlight.score };
      setBestScores(updatedBests);
      localStorage.setItem('worklife:best', JSON.stringify(updatedBests));
    }

    // 2. Add to Historical Career Logbook (keep top 10 recent)
    const newRecord: CareerRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      character: finalFlight.character,
      candidateName: finalFlight.candidateName || candidateName,
      track: finalFlight.track,
      domain: finalFlight.domain,
      exitAge: finalFlight.age,
      companiesCleared: finalFlight.score,
      finalLPA: finalFlight.packageLPA,
      finalRole: finalFlight.targetRole,
      cause: finalFlight.cause || 'floor',
      companyName: finalFlight.crashedCompany?.name || finalFlight.currentCompany.name
    };

    setHistory((prev) => {
      const nextHistory = [newRecord, ...prev].slice(0, 10);
      localStorage.setItem('worklife:history', JSON.stringify(nextHistory));
      return nextHistory;
    });
  }, [bestScores, candidateName]);

  // Start Career Run
  const handleStartGame = useCallback(() => {
    if (gameMode === 'EXIT' && performance.now() < exitLockUntilRef.current) {
      return;
    }
    sound.unlock();
    const canvas = canvasRef.current;
    const resolvedName = candidateName.trim() || (character === 'boy' ? 'Rahul Mukherjee' : 'Ananya Sen');
    const engine = new GameEngine(character, track, resolvedName, domain);
    if (canvas) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      engine.setDimensions(canvas.width / dpr, canvas.height / dpr);
    }
    engine.start();
    engineRef.current = engine;
    exitLockUntilRef.current = 0;
    setExitRestartCooldownSec(0);
    setFlightState(engine.flight);
    setActiveEvent(null);
    setGameMode('PLAYING');
    setShowRelieving(false);
  }, [gameMode, character, track, candidateName, domain]);

  // Pause & Resume
  const handlePause = useCallback(() => {
    if (gameMode === 'PLAYING') {
      engineRef.current?.pause();
      setGameMode('PAUSED');
    }
  }, [gameMode]);

  const handleResume = useCallback(() => {
    if (gameMode === 'PAUSED') {
      engineRef.current?.resume();
      setGameMode('PLAYING');
    }
  }, [gameMode]);

  // Canvas Action / Jump Trigger (unified Pointer Event avoids touch+click double-flap)
  const handleCanvasPointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    if (gameMode === 'EXIT') return;
    if (gameMode === 'PLAYING') {
      engineRef.current?.flap();
    } else if (gameMode === 'IDLE') {
      handleStartGame();
    }
  }, [gameMode, handleStartGame]);

  // Keyboard Shortcuts (Space, Up Arrow, Esc, P, M, F)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere if an input is focused or modal open
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (showRelieving || showLogbook) return;
        if (gameMode === 'PLAYING') {
          engineRef.current?.flap();
        } else if (gameMode === 'IDLE') {
          if (!e.repeat) handleStartGame();
        } else if (gameMode === 'EXIT') {
          if (e.repeat || performance.now() < exitLockUntilRef.current) return;
          handleStartGame();
        } else if (gameMode === 'RETIRED') {
          if (!e.repeat) handleStartGame();
        }
      } else if (e.code === 'Escape' || e.code === 'KeyP') {
        e.preventDefault();
        if (gameMode === 'PLAYING') {
          handlePause();
        } else if (gameMode === 'PAUSED') {
          handleResume();
        }
      } else if (e.code === 'KeyM') {
        handleToggleSound();
      } else if (e.code === 'KeyF') {
        handleToggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameMode, showRelieving, showLogbook, handleStartGame, handlePause, handleResume]);

  // Auto-pause when window loses focus / tab changes during flight (PRD spec)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && gameMode === 'PLAYING') {
        handlePause();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleVisibility);
    };
  }, [gameMode, handlePause]);

  // Canvas Resize Handler (supports window, orientation, visualViewport & container resize)
  useEffect(() => {
    const updateCanvasSize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width <= 0 || height <= 0) return;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      if (engineRef.current) {
        engineRef.current.setDimensions(width, height);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    window.addEventListener('orientationchange', updateCanvasSize);
    window.visualViewport?.addEventListener('resize', updateCanvasSize);

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      observer = new ResizeObserver(updateCanvasSize);
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('orientationchange', updateCanvasSize);
      window.visualViewport?.removeEventListener('resize', updateCanvasSize);
      observer?.disconnect();
    };
  }, []);

  // Main 60 FPS Render & Physics Loop
  useEffect(() => {
    let lastSync = 0;

    const loop = (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animationFrameRef.current = requestAnimationFrame(loop);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      // Initialize engine if not yet created
      if (!engineRef.current) {
        engineRef.current = new GameEngine(character, track, candidateName, domain);
        engineRef.current.setDimensions(width, height);
      }

      const engine = engineRef.current;

      // Update Physics when playing
      if (gameMode === 'PLAYING') {
        const status = engine.update(timestamp);

        // Sync React HUD state every ~100ms
        if (timestamp - lastSync > 90) {
          lastSync = timestamp;
          setFlightState({ ...engine.flight });
          setActiveEvent(engine.activeEvent);
        }

        if (status === 'EXIT') {
          sound.stopBed();
          exitLockUntilRef.current = performance.now() + 5000;
          setExitRestartCooldownSec(5);
          setFlightState({ ...engine.flight });
          setGameMode('EXIT');
          recordCareerEnd(engine.flight);
        } else if (status === 'RETIRED') {
          sound.stopBed();
          setFlightState({ ...engine.flight });
          setGameMode('RETIRED');
          recordCareerEnd(engine.flight);
        }
      }

      // Clear & Render Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      rendererRef.current.render({
        ctx,
        width,
        height,
        dpr,
        scrollOffset: engine.scrollOffset,
        bird: engine.bird,
        character,
        pipes: engine.pipes,
        age: engine.flight.age,
        particles: engine.particles,
        warmup:
          gameMode === 'PLAYING'
            ? {
                controlTaken: engine.controlTaken,
                hoverRemainingMs: engine.hoverRemainingMs,
                runwayIntroAlpha: engine.runwayIntroAlpha
              }
            : undefined
      });

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameMode, character, track, recordCareerEnd]);

  return (
    <main
      ref={containerRef}
      className="relative w-full h-dvh overflow-hidden bg-[#eef0f5] select-none font-sans"
    >
      {/* 2D Canvas Stage */}
      <canvas
        ref={canvasRef}
        onPointerDown={handleCanvasPointerDown}
        className="absolute inset-0 block cursor-pointer z-10 touch-none"
      />

      {/* Screen Overlays */}
      {gameMode === 'IDLE' && (
        <StartScreen
          character={character}
          candidateName={candidateName}
          track={track}
          domain={domain}
          bestScores={bestScores}
          soundEnabled={soundEnabled}
          onSelectCharacter={handleSelectCharacter}
          onChangeCandidateName={handleChangeCandidateName}
          onSelectTrack={handleSelectTrack}
          onSelectDomain={handleSelectDomain}
          onStart={handleStartGame}
          onToggleSound={handleToggleSound}
          onToggleFullscreen={handleToggleFullscreen}
          onOpenLogbook={() => setShowLogbook(true)}
        />
      )}

      {(gameMode === 'PLAYING' || gameMode === 'PAUSED') && (
        <HUD
          flight={flightState}
          activeEvent={activeEvent}
          soundEnabled={soundEnabled}
          onPause={handlePause}
          onToggleSound={handleToggleSound}
        />
      )}

      <Suspense fallback={null}>
        {gameMode === 'PAUSED' && (
          <PauseScreen onResume={handleResume} />
        )}

        {gameMode === 'EXIT' && (
          <ExitScreen
            flight={flightState}
            bestScore={bestScores[track] || 0}
            restartCooldownSec={exitRestartCooldownSec}
            onRestart={handleStartGame}
            onChangeTrack={() => setGameMode('IDLE')}
            onViewRelievingSlip={() => setShowRelieving(true)}
          />
        )}

        {gameMode === 'RETIRED' && (
          <RetirementScreen
            flight={flightState}
            onRestart={handleStartGame}
            onChangeTrack={() => setGameMode('IDLE')}
            onViewRelievingSlip={() => setShowRelieving(true)}
          />
        )}

        {/* Official Relieving & Settlement Slip Modal */}
        {showRelieving && (
          <RelievingLetterModal
            flight={flightState}
            onClose={() => setShowRelieving(false)}
          />
        )}

        {/* Historical Career Logbook Modal */}
        {showLogbook && (
          <CareerLogbookModal
            bestScores={bestScores}
            history={history}
            onClearHistory={() => {
              setHistory([]);
              localStorage.removeItem('worklife:history');
            }}
            onClose={() => setShowLogbook(false)}
          />
        )}
      </Suspense>
    </main>
  );
}
