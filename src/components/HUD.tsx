import React from 'react';
import { Camera, Radio, Shield, AlertTriangle, CheckCircle, Volume2, VolumeX, Eye } from 'lucide-react';
import { CameraViewMode, Checkpoint } from '../types';
import { sounds } from '../utils/audio';

interface HUDProps {
  currentLevel: number;
  viewMode: CameraViewMode;
  isAlarmActive: boolean;
  isFlashlightOn: boolean;
  checkpoints: Checkpoint[];
  latestRadioMessage: { sender: string; text: string; time: string } | null;
  score: {
    safety: number;
    legal: number;
    observation: number;
    communication: number;
    documentation: number;
  };
  onOpenCctv: () => void;
  onOpenTablet: () => void;
  onOpenExam: () => void;
  onOpenInstructor: () => void;
  onToggleViewMode: () => void;
  onToggleFlashlight: () => void;
}

const LEVEL_NAMES: { [key: number]: { title: string; desc: string; time: string } } = {
  1: { title: 'Level 1: Dienstantritt', desc: 'Ausrüstung & Kontrollpunkte prüfen (UVV / BewachV)', time: '21:45' },
  2: { title: 'Level 2: Außenzaun Sektor C', desc: 'Verdächtige Personen auf Kamera 7 sichten', time: '22:17' },
  3: { title: 'Level 3: Täter auf Gelände', desc: 'Containerbereich beobachten & Eigensicherung wahren', time: '22:25' },
  4: { title: 'Level 4: Alarm Lagerhalle 3', desc: 'EMA-Alarm verifizieren & Polizei verständigen', time: '22:31' },
  5: { title: 'Level 5: Konfrontation', desc: 'Täter mit Diebesgut ansprechen (§ 127 StPO)', time: '22:38' },
  6: { title: 'Level 6: Polizei & Wachbericht', desc: 'Streife einweisen & Bericht einreichen', time: '22:46' },
};

export const HUD: React.FC<HUDProps> = ({
  currentLevel,
  viewMode,
  isAlarmActive,
  isFlashlightOn,
  checkpoints,
  latestRadioMessage,
  score,
  onOpenCctv,
  onOpenTablet,
  onToggleViewMode,
  onToggleFlashlight
}) => {
  const [muted, setMuted] = React.useState(sounds.getMuted());
  const currentLvlInfo = LEVEL_NAMES[currentLevel] || LEVEL_NAMES[1];
  const scannedCount = checkpoints.filter(c => c.scanned).length;

  const totalScore = score.safety + score.legal + score.observation + score.communication + score.documentation;

  const handleMuteToggle = () => {
    const next = sounds.toggleMute();
    setMuted(next);
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between p-3 select-none">
      {/* Top Header Bar */}
      <div className="flex items-start justify-between gap-3">
        {/* Left: App & Mission Badge */}
        <div className="flex flex-col gap-1.5">
          <div className="pointer-events-auto flex items-center gap-2 rounded-lg bg-slate-950/85 px-3 py-2 text-slate-100 shadow-lg border border-slate-700/60 backdrop-blur-none">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white font-bold text-sm shadow">
              34a
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-wide text-xs uppercase text-blue-400">Security Academy</span>
                <span className="text-[10px] rounded bg-slate-800 px-1.5 py-0.5 text-slate-400 border border-slate-700">IHK-Simulator</span>
              </div>
              <h1 className="text-sm font-semibold text-white leading-tight">Industriepark Nord • Nachtschicht</h1>
            </div>
          </div>

          {/* Latest Radio Transmission Notification */}
          {latestRadioMessage && (
            <div className="pointer-events-auto max-w-md w-full rounded-xl bg-slate-950/90 p-3 text-slate-200 border border-blue-500/50 shadow-xl">
              <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Radio className="h-3.5 w-3.5 text-blue-400" />
                  <span className="font-mono text-[11px] font-bold text-blue-300">FUNKSPRUCH // {latestRadioMessage.sender}</span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">{latestRadioMessage.time} Uhr</span>
              </div>
              <p className="text-xs text-slate-200 leading-snug">{latestRadioMessage.text}</p>
            </div>
          )}
        </div>

        {/* Center: Active Alarm Warning Banner */}
        {isAlarmActive && (
          <div className="pointer-events-auto flex items-center gap-2 rounded-lg bg-red-950/90 px-4 py-2 text-red-200 border border-red-600/80 shadow-xl animate-none">
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
            <div>
              <div className="font-bold text-xs uppercase tracking-wider text-red-300">EMA-ALARM AKTIV</div>
              <div className="text-[11px] text-red-200">Unbefugtes Eindringen registriert • Meldergruppe verifiziert</div>
            </div>
          </div>
        )}

        {/* Right: Quick Status & Audio toggle */}
        <div className="flex flex-col items-end gap-1.5">
          <div className="pointer-events-auto flex items-center gap-2 rounded-lg bg-slate-950/85 px-3 py-1.5 text-slate-200 border border-slate-700/60 shadow">
            {/* Scanned checkpoints count */}
            <div className="flex items-center gap-1.5 text-xs pr-2 border-r border-slate-700">
              <CheckCircle className={`h-3.5 w-3.5 ${scannedCount > 0 ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span className="text-slate-400 font-mono text-[11px]">KP:</span>
              <span className="font-bold text-slate-100">{scannedCount}/{checkpoints.length}</span>
            </div>

            {/* Score points */}
            <div className="flex items-center gap-1 text-xs pr-2 border-r border-slate-700">
              <Shield className="h-3.5 w-3.5 text-blue-400" />
              <span className="font-bold text-blue-300">{totalScore} Pkt</span>
            </div>

            {/* Mute button */}
            <button
              onClick={handleMuteToggle}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={muted ? 'Ton einschalten' : 'Ton stummschalten'}
              aria-label="Ton umschalten"
            >
              {muted ? <VolumeX className="h-4 w-4 text-red-400" /> : <Volume2 className="h-4 w-4 text-slate-300" />}
            </button>
          </div>

          {/* Quick Shortcuts Hint */}
          <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-400 bg-slate-950/70 px-2.5 py-1 rounded border border-slate-800">
            <span>[W,A,S,D] Bewegen</span>
            <span>•</span>
            <span>[Shift] Sprint</span>
            <span>•</span>
            <span>[T] Lampe</span>
            <span>•</span>
            <span>[E] Interagieren</span>
          </div>
        </div>
      </div>


      {/* Crosshair / Center hint for interaction */}
      <div className="self-center flex flex-col items-center justify-center opacity-40">
        <div className="h-1.5 w-1.5 rounded-full bg-white shadow"></div>
      </div>

      {/* Empty space at bottom to leave room for collapsible bottom dock */}
      <div className="h-16"></div>
    </div>
  );
};
