import React, { useEffect } from 'react';
import { Award, CheckCircle2, AlertTriangle, BookOpen, RotateCcw, ArrowRight, ShieldCheck, Scale, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MissionEvaluation } from '../types';

interface MissionSummaryModalProps {
  isOpen: boolean;
  evaluation: MissionEvaluation | null;
  onRestart: () => void;
  onOpenExam: () => void;
}

export const MissionSummaryModal: React.FC<MissionSummaryModalProps> = ({
  isOpen,
  evaluation,
  onRestart,
  onOpenExam
}) => {
  useEffect(() => {
    if (isOpen && evaluation?.passed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }
  }, [isOpen, evaluation]);

  if (!isOpen || !evaluation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm select-none">
      <div className="relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-slate-950 px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
              evaluation.passed
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                : 'bg-red-500/20 border-red-500/50 text-red-400'
            }`}>
              <Award className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-blue-400">
                  IHK-AUSWERTUNG & EINSATZZERTIFIKAT
                </span>
                <span className={`rounded px-2 py-0.5 text-xs font-bold font-mono ${
                  evaluation.passed ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'
                }`}>
                  {evaluation.passed ? 'BESTANDEN' : 'NICHT BESTANDEN'}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">Nachtschicht im Industriepark Nord</h2>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black font-mono text-white leading-none">
              {evaluation.totalScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
            <span className="text-[11px] font-semibold text-blue-300 block mt-1">{evaluation.rank}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 text-xs">
          {/* Critical Error Alert if failed */}
          {evaluation.criticalErrors.length > 0 && (
            <div className="rounded-xl bg-red-950/60 p-4 border border-red-700/80 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-red-300 font-bold uppercase font-mono">
                <AlertTriangle className="h-4 w-4" />
                <span>Schwerer Rechtsverstoß / Gefährdung festgestellt</span>
              </div>
              {evaluation.criticalErrors.map((err, idx) => (
                <p key={idx} className="text-red-200 leading-relaxed font-sans">{err}</p>
              ))}
            </div>
          )}

          {/* 5 Scoring Categories Bars */}
          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 flex flex-col gap-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
              KOMPETENZBEWERTUNG NACH SACHGEBIETEN
            </h3>

            {/* Safety */}
            <div>
              <div className="flex justify-between font-mono text-xs text-slate-300 mb-1">
                <span>Eigenschutz & DGUV V23 (Max 30)</span>
                <span className="font-bold text-blue-400">{evaluation.safetyScore} / 30 Pkt</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${(evaluation.safetyScore / 30) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Legal */}
            <div>
              <div className="flex justify-between font-mono text-xs text-slate-300 mb-1">
                <span>Rechtlich korrektes Handeln (StPO/StGB/BGB - Max 25)</span>
                <span className="font-bold text-indigo-400">{evaluation.legalScore} / 25 Pkt</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${(evaluation.legalScore / 25) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Observation */}
            <div>
              <div className="flex justify-between font-mono text-xs text-slate-300 mb-1">
                <span>Beobachtung & Meldertechnik (CCTV/EMA - Max 20)</span>
                <span className="font-bold text-cyan-400">{evaluation.observationScore} / 20 Pkt</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                  style={{ width: `${(evaluation.observationScore / 20) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Communication */}
            <div>
              <div className="flex justify-between font-mono text-xs text-slate-300 mb-1">
                <span>Kommunikation & Deeskalation (Max 15)</span>
                <span className="font-bold text-amber-400">{evaluation.communicationScore} / 15 Pkt</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${(evaluation.communicationScore / 15) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Documentation */}
            <div>
              <div className="flex justify-between font-mono text-xs text-slate-300 mb-1">
                <span>Dokumentation & Wachbericht (Max 10)</span>
                <span className="font-bold text-emerald-400">{evaluation.documentationScore} / 10 Pkt</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${(evaluation.documentationScore / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Commendations */}
          {evaluation.commendations.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                POSITIVE EINSATZMERKMALE
              </span>
              {evaluation.commendations.map((c, idx) => (
                <div key={idx} className="flex items-center gap-2 rounded-lg bg-emerald-950/30 p-2.5 border border-emerald-900/40 text-emerald-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          )}

          {/* Intelligent Learning Remediation Module */}
          {evaluation.learningTips.length > 0 && (
            <div className="flex flex-col gap-2 rounded-xl bg-slate-950 p-4 border border-blue-900/60">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-blue-400">
                <BookOpen className="h-4 w-4" />
                <span>INTELLIGENTER LERNMODUS: FACHLICHE VERTIEFUNG</span>
              </div>
              {evaluation.learningTips.map((tip, idx) => (
                <div key={idx} className="rounded-lg bg-slate-900/80 p-3 border border-slate-800 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{tip.topic}</span>
                    <span className="font-mono text-[11px] font-bold text-amber-400">{tip.paragraph}</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">{tip.advice}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between bg-slate-950 px-6 py-4 border-t border-slate-800">
          <button
            onClick={onRestart}
            className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs px-4 py-2.5 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Nachtschicht wiederholen</span>
          </button>

          <button
            onClick={onOpenExam}
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 transition-colors shadow-lg"
          >
            <span>Zur IHK-Prüfungssimulation</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
