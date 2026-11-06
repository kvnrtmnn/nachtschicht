import React, { useState } from 'react';
import { AlertOctagon, CheckCircle2, XCircle, ArrowRight, BookOpen, ShieldCheck, Scale } from 'lucide-react';
import { DecisionEvent, DecisionOption } from '../types';
import { sounds } from '../utils/audio';

interface DecisionModalProps {
  event: DecisionEvent | null;
  isOpen: boolean;
  onSelectOption: (option: DecisionOption) => void;
  onProceedNext: () => void;
}

export const DecisionModal: React.FC<DecisionModalProps> = ({
  event,
  isOpen,
  onSelectOption,
  onProceedNext
}) => {
  const [selectedOpt, setSelectedOpt] = useState<DecisionOption | null>(null);

  if (!isOpen || !event) return null;

  const handleChoose = (opt: DecisionOption) => {
    setSelectedOpt(opt);
    if (opt.isCorrect) {
      sounds.playSuccessChime();
    } else {
      sounds.playRadioSquelch();
    }
    onSelectOption(opt);
  };

  const handleProceed = () => {
    setSelectedOpt(null);
    onProceedNext();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm select-none">
      <div className="relative flex flex-col w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 bg-slate-950 px-6 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-400">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
                EINSATZENTSCHEIDUNG • LEVEL {event.level}
              </span>
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
                {event.location}
              </span>
            </div>
            <h2 className="text-base font-bold text-white leading-snug">{event.title}</h2>
          </div>
        </div>

        {/* Situation Description */}
        <div className="p-6 flex flex-col gap-4">
          <div className="rounded-xl bg-slate-950/70 p-4 border border-slate-800">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wide mb-1">
              LAGEBEURTEILUNG ({event.subtitle})
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">{event.situation}</p>
          </div>

          {/* If an option has not been chosen yet, show choices */}
          {!selectedOpt ? (
            <div className="flex flex-col gap-2.5">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                WIE HANDELN SIE RECHTLICH UND TAKTISCH RICHTIG?
              </div>

              {event.options.map((opt, idx) => (
                <button
                  key={opt.id}
                  onClick={() => handleChoose(opt)}
                  className="group flex items-start gap-3 rounded-xl bg-slate-800/80 p-3.5 text-left text-xs font-medium text-slate-200 border border-slate-700/80 hover:bg-slate-700/80 hover:border-blue-500/80 transition-all shadow-sm"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-700 text-xs font-bold text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed pt-0.5">{opt.text}</span>
                </button>
              ))}
            </div>
          ) : (
            /* Once chosen, show legal debriefing & evaluation */
            <div className="flex flex-col gap-4">
              <div
                className={`rounded-xl p-4 border flex items-start gap-3 ${
                  selectedOpt.isCorrect
                    ? 'bg-emerald-950/60 border-emerald-600/70 text-emerald-200'
                    : 'bg-red-950/60 border-red-600/70 text-red-200'
                }`}
              >
                {selectedOpt.isCorrect ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-400 shrink-0 mt-0.5" />
                )}
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-bold">
                    {selectedOpt.isCorrect ? 'Fachlich & rechtlich korrekt gehandelt!' : 'Rechtsfehler oder taktische Fehleinschätzung!'}
                  </div>
                  <div className="text-xs leading-relaxed">{selectedOpt.feedback}</div>
                </div>
              </div>

              {/* Legal basis box */}
              <div className="rounded-xl bg-slate-950 p-4 border border-blue-900/60 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400 uppercase">
                  <BookOpen className="h-4 w-4" />
                  <span>Maßgebliche Rechtsgrundlage: {selectedOpt.legalBasis}</span>
                </div>
                <div className="text-xs text-slate-300">
                  Die Bewertung in der IHK-Sachkundeprüfung (§ 34a GewO) stützt sich primär auf die Einhaltung der gesetzlichen Grenzen, Verhältnismäßigkeit sowie der DGUV Vorschrift 23 (Eigensicherung).
                </div>
              </div>

              {/* Score changes pill */}
              <div className="flex items-center justify-between text-xs font-mono bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400">Punkteanpassung:</span>
                <div className="flex items-center gap-3">
                  <span className={selectedOpt.scoreDelta.safety >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    Eigenschutz: {selectedOpt.scoreDelta.safety >= 0 ? '+' : ''}{selectedOpt.scoreDelta.safety}
                  </span>
                  <span className={selectedOpt.scoreDelta.legal >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    Recht: {selectedOpt.scoreDelta.legal >= 0 ? '+' : ''}{selectedOpt.scoreDelta.legal}
                  </span>
                  <span className={selectedOpt.scoreDelta.communication >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    Kommunikation: {selectedOpt.scoreDelta.communication >= 0 ? '+' : ''}{selectedOpt.scoreDelta.communication}
                  </span>
                </div>
              </div>

              {/* Proceed button */}
              <button
                onClick={handleProceed}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm py-3 transition-colors shadow-lg"
              >
                <span>Einsatz fortführen</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
