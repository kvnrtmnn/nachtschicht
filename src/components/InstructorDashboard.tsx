import React, { useState } from 'react';
import {
  Users,
  Play,
  Pause,
  AlertTriangle,
  CloudFog,
  CloudRain,
  Moon,
  Sparkles,
  Sliders,
  ShieldAlert,
  X,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface InstructorDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerIncident: (type: 'alarm' | 'fence_breach' | 'flee' | 'aggressive' | 'cam_offline') => void;
  onChangeWeather: (weather: 'clear' | 'fog' | 'rain') => void;
  currentLevel: number;
  onSetLevel: (lvl: number) => void;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  isOpen,
  onClose,
  onTriggerIncident,
  onChangeWeather,
  currentLevel,
  onSetLevel
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'anwaerter' | 'standard' | 'pruefung'>('standard');
  const [selectedWeather, setSelectedWeather] = useState<'clear' | 'fog' | 'rain'>('clear');
  const [lastAction, setLastAction] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleIncident = (type: 'alarm' | 'fence_breach' | 'flee' | 'aggressive' | 'cam_offline', label: string) => {
    sounds.playRadioSquelch();
    onTriggerIncident(type);
    setLastAction(`Ereignis "${label}" erfolgreich ausgelöst.`);
    setTimeout(() => setLastAction(null), 4000);
  };

  const handleWeather = (weather: 'clear' | 'fog' | 'rain', label: string) => {
    setSelectedWeather(weather);
    onChangeWeather(weather);
    setLastAction(`Wetter/Sichtverhältnisse auf "${label}" gesetzt.`);
    setTimeout(() => setLastAction(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm select-none">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[90vh] rounded-3xl bg-slate-900 border-2 border-purple-700/80 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-slate-950 px-6 py-4 border-b border-purple-900/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 border border-purple-500/50 text-purple-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-purple-400">
                  DOZENTEN-STEUERPULT // LEHRGANGSLEITUNG
                </span>
                <span className="rounded bg-purple-950 px-1.5 py-0.5 text-[10px] font-mono text-purple-300 border border-purple-800">
                  INSTRUCTOR CONTROL
                </span>
              </div>
              <h2 className="text-base font-bold text-white">Simulationseingriffe & Unterrichtsauswertung</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Schließen"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 text-xs text-slate-200">
          {/* Action Notification */}
          {lastAction && (
            <div className="rounded-xl bg-purple-950/70 p-3 border border-purple-600/80 flex items-center gap-2 text-purple-200 font-mono text-xs">
              <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0" />
              <span>{lastAction}</span>
            </div>
          )}

          {/* Quick Level Jumping */}
          <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 flex flex-col gap-2">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
              SZENARIO-STUFE DIREKT ANSTEUERN
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => {
                    onSetLevel(lvl);
                    setLastAction(`Szenario auf Level ${lvl} gesetzt.`);
                  }}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                    currentLevel === lvl
                      ? 'bg-purple-600 border-purple-400 text-white font-bold shadow'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="font-mono text-xs font-bold">Level {lvl}</span>
                  <span className="text-[10px] text-slate-400 line-clamp-1">
                    {lvl === 1 ? 'Antritt' : lvl === 2 ? 'Zaun' : lvl === 3 ? 'Container' : lvl === 4 ? 'EMA Halle' : lvl === 5 ? 'Konfrontation' : 'Polizei'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Incident Triggers */}
          <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 flex flex-col gap-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
              VORFALL-INJEKTIONEN IM UNTERRICHT (MANUELL AUSLÖSEN)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <button
                onClick={() => handleIncident('alarm', 'EMA Lagerhalle 3 Sirene')}
                className="flex items-start gap-2.5 rounded-xl bg-slate-900 p-3 text-left border border-slate-800 hover:border-red-500 hover:bg-red-950/30 transition-all"
              >
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">EMA-Alarm auslösen</span>
                  <span className="text-[11px] text-slate-400">PIR & Türkontakt Lager 3 aktivieren</span>
                </div>
              </button>

              <button
                onClick={() => handleIncident('fence_breach', 'Zaundurchbruch Sektor C')}
                className="flex items-start gap-2.5 rounded-xl bg-slate-900 p-3 text-left border border-slate-800 hover:border-amber-500 hover:bg-amber-950/30 transition-all"
              >
                <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Täter am Außenzaun</span>
                  <span className="text-[11px] text-slate-400">Kamera 7 Überklettern simulieren</span>
                </div>
              </button>

              <button
                onClick={() => handleIncident('flee', 'Täter Fluchtversuch')}
                className="flex items-start gap-2.5 rounded-xl bg-slate-900 p-3 text-left border border-slate-800 hover:border-cyan-500 hover:bg-cyan-950/30 transition-all"
              >
                <Play className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Täter flüchtet</span>
                  <span className="text-[11px] text-slate-400">Prüft Festnahmebefugnis § 127 StPO</span>
                </div>
              </button>

              <button
                onClick={() => handleIncident('aggressive', 'Aggressive Gegenwehr')}
                className="flex items-start gap-2.5 rounded-xl bg-slate-900 p-3 text-left border border-slate-800 hover:border-red-500 hover:bg-red-950/30 transition-all"
              >
                <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Aggression provozieren</span>
                  <span className="text-[11px] text-slate-400">Prüft Notwehr § 32 & Deeskalation</span>
                </div>
              </button>

              <button
                onClick={() => handleIncident('cam_offline', 'Kamera 7 Störung')}
                className="flex items-start gap-2.5 rounded-xl bg-slate-900 p-3 text-left border border-slate-800 hover:border-slate-500 hover:bg-slate-800 transition-all"
              >
                <Sliders className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Kamera 7 Störung</span>
                  <span className="text-[11px] text-slate-400">Prüft Reaktion bei Sensorausfall</span>
                </div>
              </button>
            </div>
          </div>

          {/* Atmosphere & Weather Controls */}
          <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 flex flex-col gap-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
              WETTER- & UMGEBUNGSBEDINGUNGEN
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleWeather('clear', 'Klare Nacht')}
                className={`flex items-center justify-center gap-2 rounded-xl p-3 border font-medium transition-all ${
                  selectedWeather === 'clear' ? 'bg-blue-900/60 border-blue-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Moon className="h-4 w-4 text-blue-300" />
                <span>Klare Nacht (Mond)</span>
              </button>

              <button
                onClick={() => handleWeather('fog', 'Dichter Nebel')}
                className={`flex items-center justify-center gap-2 rounded-xl p-3 border font-medium transition-all ${
                  selectedWeather === 'fog' ? 'bg-slate-800 border-slate-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <CloudFog className="h-4 w-4 text-slate-300" />
                <span>Dichter Nebel (Sicht &lt; 15m)</span>
              </button>

              <button
                onClick={() => handleWeather('rain', 'Starkregen')}
                className={`flex items-center justify-center gap-2 rounded-xl p-3 border font-medium transition-all ${
                  selectedWeather === 'rain' ? 'bg-indigo-950 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <CloudRain className="h-4 w-4 text-indigo-300" />
                <span>Regennacht (Rutschgefahr UVV)</span>
              </button>
            </div>
          </div>

          {/* Classroom Discussion Topics for Trainees */}
          <div className="rounded-2xl bg-slate-950 p-4 border border-purple-900/60 flex flex-col gap-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-purple-400 uppercase">
              <HelpCircle className="h-4 w-4" />
              <span>DIDAKTISCHE DISKUSSIONSPUNKTE FÜR DIE UNTERRICHTSGRUPPE</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-300 leading-relaxed">
              <li><strong>Frage 1:</strong> Warum darf der Sicherheitsmitarbeiter bei Alarm an Lagerhalle 3 nicht unüberlegt allein in das Gebäude eindringen? (DGUV V23 § 8 Eigensicherung vs. Sachwertschutz).</li>
              <li><strong>Frage 2:</strong> Welche tatsächlichen Merkmale begründen die vorläufige Festnahme nach § 127 Abs. 1 StPO im Level 5 (Betroffen auf frischer Tat mit Diebesgut, Fluchtversuch)?</li>
              <li><strong>Frage 3:</strong> Warum stellt eine zwangsweise Durchsuchung von Kleidung durch Sicherheitsdienstmitarbeiter eine rechtswidrige Körperverletzung/Freiheitsberaubung dar?</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
