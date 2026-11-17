/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { BestScores, CareerRecord, Character, CorporateEvent, FlightState, GameMode, Track } from './types/game';
import { GameEngine } from './game/physics';
import { CanvasRenderer } from './game/canvasRenderer';
import { sound } from './game/sound';
import { StartScreen } from './components/StartScreen';
import { HUD } from './components/HUD';
import { ExitScreen } from './components/ExitScreen';
import { RetirementScreen } from './components/RetirementScreen';
import { PauseScreen } from './components/PauseScreen';
import { RelievingLetterModal } from './components/RelievingLetterModal';
import { CareerLogbookModal } from './components/CareerLogbookModal';

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
    const tempEngine = new GameEngine(character, track, candidateName);
    return tempEngine.flight;
  });
  const [activeEvent, setActiveEvent] = useState<CorporateEvent | null>(null);

  // Modal Dialogs
  const [showRelieving, setShowRelieving] = useState(false);
  const [showLogbook, setShowLogbook] = useState(false);

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
      const engine = new GameEngine(c, track, updatedName);
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
      const engine = new GameEngine(character, t, candidateName);
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
    sound.unlock();
    const canvas = canvasRef.current;
    const resolvedName = candidateName.trim() || (character === 'boy' ? 'Rahul Mukherjee' : 'Ananya Sen');
    const engine = new GameEngine(character, track, resolvedName);
    if (canvas) {
      engine.setDimensions(canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
    }
    engine.start();
    engineRef.current = engine;
    setFlightState(engine.flight);
    setActiveEvent(null);
    setGameMode('PLAYING');
    setShowRelieving(false);
  }, [character, track, candidateName]);

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

  // Canvas Action / Jump Trigger
  const handleCanvasInteraction = useCallback(() => {
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
        if (gameMode === 'PLAYING') {
          engineRef.current?.flap();
        } else if (gameMode === 'IDLE') {
          handleStartGame();
        } else if (gameMode === 'EXIT' || gameMode === 'RETIRED') {
          handleStartGame();
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
  }, [gameMode, handleStartGame, handlePause, handleResume]);

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

  // Canvas Resize Handler
  useEffect(() => {
    const updateCanvasSize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const dpr = window.devicePixelRatio || 1;
      const width = container.clientWidth;
      const height = container.clientHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      if (engineRef.current) {
        engineRef.current.setDimensions(width, height);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
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

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      // Initialize engine if not yet created
      if (!engineRef.current) {
        engineRef.current = new GameEngine(character, track);
        engineRef.current.setDimensions(width, height);
      }

      const engine = engineRef.current;

      // Update Physics when playing
      if (gameMode === 'PLAYING') {
        const status = engine.update();

        // Sync React HUD state every ~100ms
        if (timestamp - lastSync > 90) {
          lastSync = timestamp;
          setFlightState({ ...engine.flight });
          setActiveEvent(engine.activeEvent);
        }

        if (status === 'EXIT') {
          sound.stopBed();
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
        particles: engine.particles
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
      className="relative w-screen h-screen overflow-hidden bg-[#eef0f5] select-none font-sans"
    >
      {/* 2D Canvas Stage */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasInteraction}
        onTouchStart={handleCanvasInteraction}
        className="absolute inset-0 block cursor-pointer z-10"
      />

      {/* Screen Overlays */}
      {gameMode === 'IDLE' && (
        <StartScreen
          character={character}
          candidateName={candidateName}
          track={track}
          bestScores={bestScores}
          soundEnabled={soundEnabled}
          onSelectCharacter={handleSelectCharacter}
          onChangeCandidateName={handleChangeCandidateName}
          onSelectTrack={handleSelectTrack}
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

      {gameMode === 'PAUSED' && (
        <PauseScreen onResume={handleResume} />
      )}

      {gameMode === 'EXIT' && (
        <ExitScreen
          flight={flightState}
          bestScore={bestScores[track] || 0}
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
    </main>
  );
}
