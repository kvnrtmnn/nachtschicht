import React, { useState } from 'react';
import {
  Camera,
  Flashlight,
  Radio,
  Tablet,
  Video,
  FileText,
  GraduationCap,
  Users,
  ChevronDown,
  ChevronUp,
  MapPin,
  Compass
} from 'lucide-react';
import { CameraViewMode } from '../types';

interface BottomDockProps {
  viewMode: CameraViewMode;
  isFlashlightOn: boolean;
  onToggleViewMode: () => void;
  onToggleFlashlight: () => void;
  onRadioCall: () => void;
  onScanCheckpoint: () => void;
  onOpenCctv: () => void;
  onOpenTablet: () => void;
  onOpenWachbericht: () => void;
  onOpenExam: () => void;
  onOpenInstructor: () => void;
  onOpenScenarios: () => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  viewMode,
  isFlashlightOn,
  onToggleViewMode,
  onToggleFlashlight,
  onRadioCall,
  onScanCheckpoint,
  onOpenCctv,
  onOpenTablet,
  onOpenWachbericht,
  onOpenExam,
  onOpenInstructor,
  onOpenScenarios
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 z-30 transition-transform duration-300 ease-out select-none ${
        collapsed ? 'translate-y-[calc(100%-28px)]' : 'translate-y-0'
      }`}
      style={{
        bottom: '16px',
        maxWidth: 'min(980px, 96vw)',
        width: 'max-content'
      }}
    >
      {/* Collapse / Expand Toggle Tab */}
      <div className="flex justify-center -mb-px">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-1.5 rounded-t-lg bg-slate-900/95 px-3 py-1 text-[11px] font-medium text-slate-300 border-t border-x border-slate-700 hover:text-white hover:bg-slate-800 transition-colors shadow-md"
          title="Leiste ein- oder ausblenden (H)"
          aria-label={collapsed ? 'Leiste einblenden' : 'Leiste ausblenden'}
        >
          {collapsed ? (
            <>
              <ChevronUp className="h-3.5 w-3.5 text-blue-400" />
              <span>▴ Steuerung einblenden</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              <span>▾ Kinomodus (Ausblenden)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Unified Bottom Dock */}
      <div className="flex items-center overflow-x-auto max-w-[96vw] gap-1.5 rounded-2xl bg-slate-950/95 p-2 text-slate-200 border border-slate-700/70 shadow-2xl backdrop-blur-none scrollbar-none">
        {/* Tactical Controls Group */}
        <div className="flex items-center shrink-0 gap-1 pr-2 border-r border-slate-800">
          {/* Camera View Switcher */}
          <button
            onClick={onToggleViewMode}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all ${
              viewMode === 'third-person'
                ? 'bg-blue-600/80 text-white shadow'
                : viewMode === 'first-person'
                ? 'bg-indigo-600/80 text-white shadow'
                : 'bg-emerald-600/80 text-white shadow'
            }`}
            title="Kamera wechseln (Taste V)"
          >
            <Camera className="h-4 w-4" />
            <span className="font-mono text-[11px]">
              {viewMode === 'third-person' ? '3rd Person' : viewMode === 'first-person' ? '1st Person' : 'CCTV'}
            </span>
          </button>

          {/* Flashlight Button */}
          <button
            onClick={onToggleFlashlight}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all ${
              isFlashlightOn
                ? 'bg-amber-500/90 text-slate-950 font-bold shadow'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
            title="Taschenlampe (Taste T)"
          >
            <Flashlight className="h-4 w-4" />
            <span className="text-[11px] font-mono">Lampe</span>
          </button>

          {/* Radio Dispatch Call */}
          <button
            onClick={onRadioCall}
            className="flex items-center gap-1.5 rounded-xl bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
            title="Funkspruch an Leitstelle (Taste R)"
          >
            <Radio className="h-4 w-4 text-blue-400" />
            <span className="text-[11px] font-mono">Funk [R]</span>
          </button>

          {/* Scan Checkpoint */}
          <button
            onClick={onScanCheckpoint}
            className="flex items-center gap-1.5 rounded-xl bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-emerald-950 hover:text-emerald-300 hover:border-emerald-600 border border-transparent transition-all"
            title="Kontrollpunkt scannen (Taste E)"
          >
            <MapPin className="h-4 w-4 text-emerald-400" />
            <span className="text-[11px] font-mono">Scannen [E]</span>
          </button>
        </div>

        {/* Security Tech & Tools Group */}
        <div className="flex items-center shrink-0 gap-1 pr-2 border-r border-slate-800">
          {/* CCTV Terminal */}
          <button
            onClick={onOpenCctv}
            className="flex items-center gap-1.5 rounded-xl bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-950/80 hover:text-cyan-200 border border-cyan-800/40 transition-all"
            title="CCTV Videoüberwachungs-Wand"
          >
            <Video className="h-4 w-4 text-cyan-400" />
            <span className="text-[11px]">CCTV Leitstelle</span>
          </button>

          {/* Dienst-Tablet */}
          <button
            onClick={onOpenTablet}
            className="flex items-center gap-1.5 rounded-xl bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-indigo-300 hover:bg-indigo-950/80 hover:text-indigo-200 border border-indigo-800/40 transition-all"
            title="Dienst-Tablet: Dienstanweisung, Aufträge & 34a Lexikon (Taste Tab)"
          >
            <Tablet className="h-4 w-4 text-indigo-400" />
            <span className="text-[11px]">Tablet [Tab]</span>
          </button>

          {/* Wachbericht */}
          <button
            onClick={onOpenWachbericht}
            className="flex items-center gap-1.5 rounded-xl bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-950/80 hover:text-amber-200 border border-amber-800/40 transition-all"
            title="Digitalen Wachbericht erfassen"
          >
            <FileText className="h-4 w-4 text-amber-400" />
            <span className="text-[11px]">Wachbericht</span>
          </button>
        </div>

        {/* Academy & Instructor Group */}
        <div className="flex items-center shrink-0 gap-1">
          {/* IHK Exam Preparation */}
          <button
            onClick={onOpenExam}
            className="flex items-center gap-1.5 rounded-xl bg-blue-900/60 px-2.5 py-1.5 text-xs font-semibold text-blue-200 hover:bg-blue-800 hover:text-white border border-blue-700/50 transition-all"
            title="IHK-Sachkundeprüfung nach § 34a GewO trainieren"
          >
            <GraduationCap className="h-4 w-4 text-blue-300" />
            <span className="text-[11px]">IHK Prüfung</span>
          </button>

          {/* 15 Scenarios */}
          <button
            onClick={onOpenScenarios}
            className="flex items-center gap-1.5 rounded-xl bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
            title="15 praxisnahe Sicherheitsszenarien auswählen"
          >
            <Compass className="h-4 w-4 text-amber-400" />
            <span className="text-[11px]">15 Szenarien</span>
          </button>

          {/* Dozenten-Dashboard */}
          <button
            onClick={onOpenInstructor}
            className="flex items-center gap-1.5 rounded-xl bg-purple-950/70 px-2.5 py-1.5 text-xs font-semibold text-purple-200 hover:bg-purple-900 hover:text-white border border-purple-700/50 transition-all"
            title="Dozenten-Dashboard für Unterricht und Übungssteuerung"
          >
            <Users className="h-4 w-4 text-purple-300" />
            <span className="text-[11px]">Dozent</span>
          </button>
        </div>
      </div>
    </div>
  );
};
