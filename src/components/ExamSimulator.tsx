import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ArrowRight,
  BookOpen,
  X,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { EXAM_QUESTIONS } from '../data/curriculum';
import { sounds } from '../utils/audio';

interface ExamSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExamSimulator: React.FC<ExamSimulatorProps> = ({ isOpen, onClose }) => {
  const [examType, setExamType] = useState<'written' | 'oral'>('written');
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedChoices, setSelectedChoices] = useState<number[]>([]);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // Oral exam state
  const [oralStage, setOralStage] = useState<number>(0);
  const [oralSelected, setOralSelected] = useState<number | null>(null);

  if (!isOpen) return null;

  const currentQ = EXAM_QUESTIONS[currentQIndex];

  const handleToggleChoice = (idx: number) => {
    if (isAnswerSubmitted) return;
    if (selectedChoices.includes(idx)) {
      setSelectedChoices(selectedChoices.filter(i => i !== idx));
    } else {
      // Max 2 selections per IHK rule
      if (selectedChoices.length < 2) {
        setSelectedChoices([...selectedChoices, idx]);
      }
    }
  };

  const handleSubmitAnswer = () => {
    setIsAnswerSubmitted(true);
    // Compare selectedChoices with currentQ.correctIndices
    const isCorrect =
      selectedChoices.length === currentQ.correctIndices.length &&
      selectedChoices.every(c => currentQ.correctIndices.includes(c));

    if (isCorrect) {
      sounds.playSuccessChime();
      setScore(s => s + 1);
    } else {
      sounds.playRadioSquelch();
    }
  };

  const handleNextQuestion = () => {
    setIsAnswerSubmitted(false);
    setSelectedChoices([]);
    if (currentQIndex < EXAM_QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // Finished
      sounds.playSuccessChime();
    }
  };

  // Oral exam case questions
  const ORAL_CASES = [
    {
      examiner: 'Prüfer: "Herr Kollege, Sie bestreifen nachts ein umfriedetes Werksgelände. Ein Unbekannter klettert vor Ihren Augen über den Zaun. Welche Befugnisse haben Sie in dieser Sekunde konkret als privater Sicherheitsmitarbeiter?"',
      options: [
        {
          text: 'Ich habe das Hausrecht des Auftraggebers, darf den Hausfriedensbruch (§ 123 StGB) rügen, ein Hausverbot aussprechen und den Täter nach § 127 Abs. 1 StPO vorläufig festnehmen, sofern Fluchtgefahr besteht.',
          correct: true,
          feedback: 'Mustergültige Antwort! Sie trennen sauber zwischen abgeleitetem Hausrecht (§ 903 BGB) und der strafprozessualen Festnahme (§ 127 StPO).'
        },
        {
          text: 'Ich habe polizeiliche Eingriffsbefugnisse, darf ihn sofort handschellen, durchsuchen und verhören.',
          correct: false,
          feedback: 'Schwerer Fehler! Sie besitzen als privater Wachdienst keinerlei polizeiliche Hoheitsrechte. Eine Durchsuchung wäre rechtswidrig.'
        },
        {
          text: 'Ich darf gar nichts tun, sondern muss mich abwenden, da privater Sicherheitsdienst nur beobachten darf.',
          correct: false,
          feedback: 'Falsch! Der Wachvertrag überträgt Ihnen die Ausübung des Hausrechts (§ 859 BGB, § 903 BGB) sowie die Wahrnehmung von Jedermannsrechten.'
        }
      ]
    },
    {
      examiner: 'Prüfer: "Gut. Der Täter flieht und lässt eine Tasche mit teuren Werkzeugen fallen. Dürfen Sie die Tasche an sich nehmen und dem Täter nachlaufen?"',
      options: [
        {
          text: 'Ja, nach § 859 Abs. 2 BGB (Besitzkehr) darf eine bewegliche Sache dem Täter auf frischer Tat wieder abgenommen werden. Eigensicherung beachten!',
          correct: true,
          feedback: 'Exzellent! § 859 Abs. 2 BGB erlaubt die sofortige Wiedererlangung des Besitzes auf frischer Tat.'
        },
        {
          text: 'Nein, Fundstücke müssen 6 Monate lang am Tatort liegen bleiben.',
          correct: false,
          feedback: 'Falsch! Es handelt sich um Diebesgut, nicht um eine herrenlose Fundsache.'
        }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm select-none">
      <div className="relative flex flex-col w-full max-w-3xl max-h-[90vh] rounded-3xl bg-slate-900 border-2 border-blue-600/80 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-slate-950 px-6 py-4 border-b border-blue-900/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 border border-blue-500/50 text-blue-400">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-blue-400">
                  IHK-SACHKUNDEPRÜFUNG § 34a GEWO
                </span>
                <span className="rounded bg-blue-950 px-1.5 py-0.5 text-[10px] font-mono text-blue-300 border border-blue-800">
                  OFFIZIELLE STANDARDS
                </span>
              </div>
              <h2 className="text-base font-bold text-white">Prüfungssimulator & Falltraining</h2>
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

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 gap-3 pt-2">
          <button
            onClick={() => setExamType('written')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              examType === 'written' ? 'border-blue-500 text-blue-300 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Schriftliche Prüfung (Multiple-Choice)</span>
          </button>

          <button
            onClick={() => setExamType('oral')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              examType === 'oral' ? 'border-blue-500 text-blue-300 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Mündliche Fallprüfung (Einsatzgespräch)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 text-xs text-slate-200">
          {examType === 'written' ? (
            <div className="flex flex-col gap-4">
              {/* Question Meta */}
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-blue-950/80 px-2.5 py-1 font-mono text-[11px] font-bold text-blue-300 border border-blue-800">
                  SACHGEBIET: {currentQ.category}
                </span>
                <span className="font-mono text-xs text-slate-400">
                  Frage {currentQIndex + 1} von {EXAM_QUESTIONS.length} • Punkte: {score}
                </span>
              </div>

              {/* Question Text */}
              <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800">
                <p className="text-sm font-semibold text-white leading-relaxed">{currentQ.question}</p>
                <span className="text-[11px] text-amber-400 block mt-2">
                  (Hinweis: Maximal {currentQ.correctIndices.length} {currentQ.correctIndices.length === 1 ? 'Antwort ist' : 'Antworten sind'} zutreffend)
                </span>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedChoices.includes(idx);
                  const isCorrect = currentQ.correctIndices.includes(idx);

                  let itemStyle = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700/80';
                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      itemStyle = 'bg-emerald-950/80 border-emerald-600 text-emerald-200';
                    } else if (isSelected && !isCorrect) {
                      itemStyle = 'bg-red-950/80 border-red-600 text-red-200';
                    } else {
                      itemStyle = 'opacity-50 border-slate-800 bg-slate-950';
                    }
                  } else if (isSelected) {
                    itemStyle = 'bg-blue-900/60 border-blue-500 text-white shadow';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleToggleChoice(idx)}
                      disabled={isAnswerSubmitted}
                      className={`flex items-start gap-3 rounded-xl p-3 text-left text-xs border transition-all ${itemStyle}`}
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-900 text-xs font-mono font-bold mt-0.5 border border-slate-700">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback and legal explanation */}
              {isAnswerSubmitted && (
                <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400 uppercase">
                      IHK-MUSTERLÖSUNG & RECHTSGRUNDLAGE: {currentQ.paragraph}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedChoices.length === 0}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 transition-colors shadow-lg"
                  >
                    <span>Antwort prüfen</span>
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 transition-colors shadow-lg"
                  >
                    <span>Nächste Prüfungsfrage</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* ORAL EXAM CASE */
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl bg-slate-950 p-4 border border-indigo-900/70 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-700">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                    IHK-PRÜFUNGSAUSSCHUSS // MÜNDLICHES FACHGESPRÄCH
                  </span>
                  <p className="text-sm text-slate-100 italic leading-relaxed font-serif">
                    {ORAL_CASES[oralStage]?.examiner || 'Prüfung abgeschlossen.'}
                  </p>
                </div>
              </div>

              {ORAL_CASES[oralStage] && (
                <div className="flex flex-col gap-2.5">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                    WIE ANTWORTEN SIE DEM PRÜFER?
                  </span>

                  {ORAL_CASES[oralStage].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setOralSelected(i);
                        if (opt.correct) sounds.playSuccessChime();
                        else sounds.playRadioSquelch();
                      }}
                      className={`flex flex-col items-start gap-1 rounded-xl p-3.5 text-left border transition-all ${
                        oralSelected === i
                          ? opt.correct
                            ? 'bg-emerald-950/70 border-emerald-600 text-emerald-200'
                            : 'bg-red-950/70 border-red-600 text-red-200'
                          : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700'
                      }`}
                    >
                      <span className="text-xs font-medium leading-relaxed">{opt.text}</span>
                      {oralSelected === i && (
                        <span className="text-[11px] font-mono mt-1 pt-1 border-t border-slate-700 w-full block">
                          <strong>Bewertung:</strong> {opt.feedback}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {oralSelected !== null && oralStage < ORAL_CASES.length - 1 && (
                <button
                  onClick={() => {
                    setOralStage(oralStage + 1);
                    setOralSelected(null);
                  }}
                  className="self-end flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 transition-colors shadow"
                >
                  <span>Nächste Prüferfrage</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
