/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { CameraViewMode, Checkpoint, DecisionEvent, DecisionOption, MissionEvaluation, ScenarioDefinition, WachberichtData } from './types';
import { SimulationEngine } from './game/simulation-engine';
import { DECISION_EVENTS } from './data/curriculum';
import { buildFinalEvaluation } from './utils/rules';
import { HUD } from './components/HUD';
import { BottomDock } from './components/BottomDock';
import { CCTVTerminal } from './components/CCTVTerminal';
import { DecisionModal } from './components/DecisionModal';
import { TabletModal } from './components/TabletModal';
import { WachberichtModal } from './components/WachberichtModal';
import { MissionSummaryModal } from './components/MissionSummaryModal';
import { InstructorDashboard } from './components/InstructorDashboard';
import { ExamSimulator } from './components/ExamSimulator';
import { ScenarioSelector } from './components/ScenarioSelector';
import { MobileControls } from './components/MobileControls';
import { sounds } from './utils/audio';
import { Shield, Play, GraduationCap, Users, Compass, BookOpen } from 'lucide-react';

export default function App() {
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<SimulationEngine | null>(null);

  // Game state
  const [hasStarted, setHasStarted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('autostart') === '1';
    }
    return false;
  });

  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [viewMode, setViewMode] = useState<CameraViewMode>('third-person');
  const [isFlashlightOn, setIsFlashlightOn] = useState<boolean>(true);
  const [isAlarmActive, setIsAlarmActive] = useState<boolean>(false);
  const [activeCamId, setActiveCamId] = useState<number>(7);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [playerPos, setPlayerPos] = useState<{ x: number; z: number }>({ x: 0, z: 18 });

  // Score state
  const [scores, setScores] = useState({
    safety: 15,
    legal: 12,
    observation: 10,
    communication: 8,
    documentation: 5
  });
  const [criticalErrors, setCriticalErrors] = useState<string[]>([]);

  // Radio logs
  const [latestRadioMessage, setLatestRadioMessage] = useState<{ sender: string; text: string; time: string } | null>({
    sender: 'SCHICHTLEITER',
    text: 'Willkommen zur Nachtschicht im Industriepark Nord! Bitte Ausrüstung prüfen und ersten Kontrollgang antreten.',
    time: '21:45'
  });

  // Modal open states
  const [isCctvOpen, setIsCctvOpen] = useState(false);
  const [isTabletOpen, setIsTabletOpen] = useState(false);
  const [isWachberichtOpen, setIsWachberichtOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isInstructorOpen, setIsInstructorOpen] = useState(false);
  const [isExamOpen, setIsExamOpen] = useState(false);
  const [isScenariosOpen, setIsScenariosOpen] = useState(false);

  // Active decision event
  const [currentDecision, setCurrentDecision] = useState<DecisionEvent | null>(null);
  const [evaluation, setEvaluation] = useState<MissionEvaluation | null>(null);

  // Callbacks ref to maintain stable engine lifecycle
  const callbacksRef = useRef({
    onLevelChange: (lvl: number) => {
      setCurrentLevel(lvl);
    },
    onCheckpointScanned: (cp: Checkpoint) => {
      setCheckpoints(prev => prev.map(c => c.id === cp.id ? { ...c, scanned: true } : c));
      setScores(s => ({ ...s, observation: Math.min(20, s.observation + 2) }));
    },
    onTriggerDecision: (lvl: number) => {
      const evt = DECISION_EVENTS[lvl];
      if (evt) {
        setCurrentDecision(evt);
      }
    },
    onAlarmStateChange: (active: boolean) => {
      setIsAlarmActive(active);
    },
    onRadioMessage: (msg: { sender: string; text: string; time: string }) => {
      setLatestRadioMessage(msg);
    }
  });

  // Initialize Three.js simulation once mounted
  useEffect(() => {
    if (!canvasMountRef.current) return;

    const engine = new SimulationEngine(canvasMountRef.current, {
      onLevelChange: lvl => callbacksRef.current.onLevelChange(lvl),
      onCheckpointScanned: cp => callbacksRef.current.onCheckpointScanned(cp),
      onTriggerDecision: lvl => callbacksRef.current.onTriggerDecision(lvl),
      onAlarmStateChange: active => callbacksRef.current.onAlarmStateChange(active),
      onRadioMessage: msg => callbacksRef.current.onRadioMessage(msg)
    });

    engineRef.current = engine;
    (window as unknown as { __ENGINE__: unknown }).__ENGINE__ = engine;
    setCheckpoints(engine.checkpoints);

    const handleResize = () => {
      if (canvasMountRef.current && engineRef.current) {
        engineRef.current.handleResize(
          canvasMountRef.current.clientWidth,
          canvasMountRef.current.clientHeight
        );
      }
    };

    window.addEventListener('resize', handleResize);

    // Track player position for tablet map
    const interval = setInterval(() => {
      if (engineRef.current) {
        setPlayerPos({
          x: engineRef.current.playerPos.x,
          z: engineRef.current.playerPos.z
        });
      }
    }, 200);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  // Keyboard shortcut for Tablet (Tab), CCTV (C), Map (M)
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        setIsTabletOpen(prev => !prev);
      } else if (e.code === 'KeyC') {
        setIsCctvOpen(prev => !prev);
      } else if (e.code === 'KeyM') {
        setIsTabletOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, []);

  // Actions
  const handleToggleViewMode = () => {
    if (!engineRef.current) return;
    const nextMode = engineRef.current.toggleViewMode();
    setViewMode(nextMode);
  };

  const handleToggleFlashlight = () => {
    if (!engineRef.current) return;
    const state = engineRef.current.toggleFlashlight();
    setIsFlashlightOn(state);
  };

  const handleRadioCall = () => {
    sounds.playRadioSquelch();
    const msg = {
      sender: 'STREIFE 1',
      text: `Streife 1 meldet Status zu Level ${currentLevel}: Bereich gesichert, Kontrollgänge laufen planmäßig.`,
      time: currentLevel === 1 ? '21:55' : '22:20'
    };
    setLatestRadioMessage(msg);
  };

  const handleScanCheckpoint = () => {
    if (!engineRef.current) return;
    const res = engineRef.current.interact();
    if (res.type === 'checkpoint') {
      sounds.playSuccessChime();
    } else if (res.type === 'intruder') {
      setCurrentDecision(DECISION_EVENTS[currentLevel]);
    }
  };

  const handleSelectCctvCamera = (camId: number) => {
    if (!engineRef.current) return;
    setActiveCamId(camId);
    engineRef.current.setCctvCamera(camId);
    setViewMode('cctv');
  };

  // Decision Handling
  const handleDecisionOptionChosen = (option: DecisionOption) => {
    setScores(prev => ({
      safety: prev.safety + option.scoreDelta.safety,
      legal: prev.legal + option.scoreDelta.legal,
      observation: prev.observation + option.scoreDelta.observation,
      communication: prev.communication + option.scoreDelta.communication,
      documentation: prev.documentation + option.scoreDelta.documentation
    }));

    if (!option.isCorrect && option.scoreDelta.legal <= -10) {
      setCriticalErrors(prev => [...prev, `${option.legalBasis}: ${option.feedback}`]);
    }
  };

  const handleProceedAfterDecision = () => {
    if (!currentDecision) return;
    const nextLvl = (currentDecision.level + 1);
    setCurrentDecision(null);

    if (nextLvl <= 6) {
      setCurrentLevel(nextLvl);
      if (engineRef.current) {
        engineRef.current.setLevel(nextLvl);
      }

      if (nextLvl === 6) {
        // Open Wachbericht form in Level 6
        setTimeout(() => {
          setIsWachberichtOpen(true);
        }, 1200);
      }
    } else {
      // Completed all levels -> Show final summary!
      handleCompleteMission();
    }
  };

  const handleWachberichtSubmit = (
    data: WachberichtData,
    evalResult: { score: number; errors: string[]; commendations: string[] }
  ) => {
    setScores(prev => ({ ...prev, documentation: evalResult.score }));
    setIsWachberichtOpen(false);

    // Build comprehensive evaluation
    const finalEval = buildFinalEvaluation({
      safety: scores.safety,
      legal: scores.legal,
      observation: scores.observation,
      communication: scores.communication,
      documentation: evalResult.score
    }, criticalErrors);

    setEvaluation(finalEval);
    setIsSummaryOpen(true);
  };

  const handleCompleteMission = () => {
    const finalEval = buildFinalEvaluation(scores, criticalErrors);
    setEvaluation(finalEval);
    setIsSummaryOpen(true);
  };

  const handleRestartMission = () => {
    setIsSummaryOpen(false);
    setCurrentLevel(1);
    setScores({ safety: 15, legal: 12, observation: 10, communication: 8, documentation: 5 });
    setCriticalErrors([]);
    if (engineRef.current) {
      engineRef.current.setLevel(1);
      engineRef.current.playerPos.set(-10, 0, 32);
      engineRef.current.playerRotY = Math.PI;
    }
  };

  const handleInstructorIncident = (type: string) => {
    if (!engineRef.current) return;
    if (type === 'alarm') {
      engineRef.current.triggerAlarm(true);
    } else if (type === 'fence_breach') {
      engineRef.current.setLevel(2);
      setCurrentLevel(2);
      setCurrentDecision(DECISION_EVENTS[2]);
    } else if (type === 'flee') {
      engineRef.current.intruders[0].data.state = 'fleeing';
      engineRef.current.intruders[0].data.targetX = 40;
      engineRef.current.intruders[0].data.targetZ = -45;
    } else if (type === 'aggressive') {
      engineRef.current.intruders[0].data.state = 'confronted';
      engineRef.current.intruders[0].data.cooperativeLevel = 'aggressive';
      setCurrentDecision(DECISION_EVENTS[5]);
    }
  };

  const handleInstructorWeather = (weather: 'clear' | 'fog' | 'rain') => {
    if (!engineRef.current) return;
    if (weather === 'clear') {
      engineRef.current.scene.fog = new THREE.FogExp2(0x0a1120, 0.016);
    } else if (weather === 'fog') {
      engineRef.current.scene.fog = new THREE.FogExp2(0x1e293b, 0.055);
    } else if (weather === 'rain') {
      engineRef.current.scene.fog = new THREE.FogExp2(0x0f172a, 0.035);
    }
  };

  const handleSelectScenario = (scenario: ScenarioDefinition) => {
    // Switch to selected scenario
    sounds.playRadioSquelch();
    setLatestRadioMessage({
      sender: 'LEHRGANGSLEITUNG',
      text: `Szenario "${scenario.title}" gestartet. Schwerpunkt: ${scenario.focus}.`,
      time: '22:00'
    });
    setCurrentLevel(1);
    if (engineRef.current) {
      engineRef.current.setLevel(1);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none text-slate-100">
      {/* 3D WebGL Canvas Isolated Mount */}
      <div
        ref={canvasMountRef}
        data-testid="three-canvas-container"
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0"
      />

      {/* Title / Start Splash Overlay if not yet started */}
      {!hasStarted && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4">
          <div className="relative flex flex-col items-center max-w-xl text-center rounded-3xl bg-slate-900/95 border-2 border-slate-700 p-8 shadow-2xl">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white font-bold text-2xl shadow-xl mb-4">
              34a
            </div>

            <span className="font-mono text-xs font-bold tracking-widest text-blue-400 uppercase mb-1">
              SECURITY ACADEMY 34a
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Der 3D-Sicherheitsdienst-Simulator
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              Lernen durch Erleben, Entscheiden und Handeln. Bereiten Sie sich praxisnah auf die <strong>IHK-Sachkundeprüfung nach § 34a GewO</strong> vor – mit begehbarem 3D-Industriepark, Video-Leitstelle, KI-Tätern und echten Rechtsentscheidungen.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-6">
              <button
                onClick={() => setHasStarted(true)}
                className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3.5 px-4 shadow-lg transition-all"
              >
                <Play className="h-5 w-5 fill-white" />
                <span>Nachtschicht starten</span>
              </button>

              <button
                onClick={() => {
                  setHasStarted(true);
                  setIsExamOpen(true);
                }}
                className="flex items-center justify-center gap-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm py-3.5 px-4 border border-slate-700 transition-all"
              >
                <GraduationCap className="h-5 w-5 text-blue-400" />
                <span>IHK Prüfungstraining</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
              <button
                onClick={() => {
                  setHasStarted(true);
                  setIsInstructorOpen(true);
                }}
                className="hover:text-purple-400 transition-colors flex items-center gap-1"
              >
                <Users className="h-3.5 w-3.5" />
                <span>Dozenten-Dashboard</span>
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  setHasStarted(true);
                  setIsScenariosOpen(true);
                }}
                className="hover:text-amber-400 transition-colors flex items-center gap-1"
              >
                <Compass className="h-3.5 w-3.5" />
                <span>15 Einsatzszenarien</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-Game Heads-Up Display (HUD) */}
      <HUD
        currentLevel={currentLevel}
        viewMode={viewMode}
        isAlarmActive={isAlarmActive}
        isFlashlightOn={isFlashlightOn}
        checkpoints={checkpoints}
        latestRadioMessage={latestRadioMessage}
        score={scores}
        onOpenCctv={() => setIsCctvOpen(true)}
        onOpenTablet={() => setIsTabletOpen(true)}
        onOpenExam={() => setIsExamOpen(true)}
        onOpenInstructor={() => setIsInstructorOpen(true)}
        onToggleViewMode={handleToggleViewMode}
        onToggleFlashlight={handleToggleFlashlight}
      />

      {/* Collapsible Unified Bottom Control Dock */}
      <BottomDock
        viewMode={viewMode}
        isFlashlightOn={isFlashlightOn}
        onToggleViewMode={handleToggleViewMode}
        onToggleFlashlight={handleToggleFlashlight}
        onRadioCall={handleRadioCall}
        onScanCheckpoint={handleScanCheckpoint}
        onOpenCctv={() => setIsCctvOpen(true)}
        onOpenTablet={() => setIsTabletOpen(true)}
        onOpenWachbericht={() => setIsWachberichtOpen(true)}
        onOpenExam={() => setIsExamOpen(true)}
        onOpenInstructor={() => setIsInstructorOpen(true)}
        onOpenScenarios={() => setIsScenariosOpen(true)}
      />

      {/* Virtual Joystick for Mobile/Tablet Screens */}
      <MobileControls
        onTouchMove={input => {
          if (engineRef.current) {
            engineRef.current.touchMove = input;
          }
        }}
        onToggleFlashlight={handleToggleFlashlight}
        onRadio={handleRadioCall}
        onInteract={handleScanCheckpoint}
        isFlashlightOn={isFlashlightOn}
      />

      {/* Modals & Overlays */}
      <CCTVTerminal
        currentLevel={currentLevel}
        isOpen={isCctvOpen}
        onClose={() => setIsCctvOpen(false)}
        onSelectCamera={handleSelectCctvCamera}
        activeCamId={activeCamId}
      />

      <DecisionModal
        event={currentDecision}
        isOpen={!!currentDecision}
        onSelectOption={handleDecisionOptionChosen}
        onProceedNext={handleProceedAfterDecision}
      />

      <TabletModal
        isOpen={isTabletOpen}
        onClose={() => setIsTabletOpen(false)}
        checkpoints={checkpoints}
        currentLevel={currentLevel}
        playerPos={playerPos}
      />

      <WachberichtModal
        isOpen={isWachberichtOpen}
        onClose={() => setIsWachberichtOpen(false)}
        onSubmitReport={handleWachberichtSubmit}
      />

      <MissionSummaryModal
        isOpen={isSummaryOpen}
        evaluation={evaluation}
        onRestart={handleRestartMission}
        onOpenExam={() => {
          setIsSummaryOpen(false);
          setIsExamOpen(true);
        }}
      />

      <InstructorDashboard
        isOpen={isInstructorOpen}
        onClose={() => setIsInstructorOpen(false)}
        onTriggerIncident={handleInstructorIncident}
        onChangeWeather={handleInstructorWeather}
        currentLevel={currentLevel}
        onSetLevel={lvl => {
          setCurrentLevel(lvl);
          if (engineRef.current) {
            engineRef.current.setLevel(lvl);
          }
        }}
      />

      <ExamSimulator
        isOpen={isExamOpen}
        onClose={() => setIsExamOpen(false)}
      />

      <ScenarioSelector
        isOpen={isScenariosOpen}
        onClose={() => setIsScenariosOpen(false)}
        onSelectScenario={handleSelectScenario}
      />
    </div>
  );
}
