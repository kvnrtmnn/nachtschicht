import React, { useState } from 'react';
import { FileText, Send, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';
import { WachberichtData } from '../types';
import { evaluateWachbericht } from '../utils/rules';
import { sounds } from '../utils/audio';

interface WachberichtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (data: WachberichtData, evalResult: { score: number; errors: string[]; commendations: string[] }) => void;
}

export const WachberichtModal: React.FC<WachberichtModalProps> = ({
  isOpen,
  onClose,
  onSubmitReport
}) => {
  const [formData, setFormData] = useState<WachberichtData>({
    uhrzeit: '22:17 - 22:46 Uhr',
    alarmort: 'Industriepark Nord, Außenzaun Sektor C & Lagerhalle 3 Tür Ost',
    beteiligtePersonen: 'Zwei männliche Täter dunkel gekleidet mit Kapuzenpullovern, eine dritte Person wartend am Außenzaun.',
    beobachtungen: 'Kamera 7 zeigte Übersteigen des Außenzaunes. Einbruchmeldeanlage Lagerhalle 3 schlug an. Ein Täter trat mit einem Karton aus der Fluchttür.',
    massnahmen: 'Sicherheitsleitstelle verständigt, Eigensicherung gewahrt, Fluchtwege beobachtet, Täter vor Lagerhalle angesprochen und bis Eintreffen der Polizei festgehalten.',
    verstaendigteStellen: 'Sicherheitsleitstelle (NSL) & Polizei Funkstreife Notruf 110',
    besondereVorkommnisse: 'Keine Personen verletzt. Straftatbestand: § 123 StGB (Hausfriedensbruch) und § 242 StGB (Diebstahl).'
  });

  const [validationResult, setValidationResult] = useState<{ score: number; errors: string[]; commendations: string[] } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = evaluateWachbericht(formData);
    setValidationResult(result);
    sounds.playSuccessChime();
    onSubmitReport(formData, result);
  };

  const handleFillStandard = () => {
    setFormData({
      uhrzeit: '22:17 - 22:46 Uhr',
      alarmort: 'Industriepark Nord, Außenzaun Sektor C & Lagerhalle 3 Tür Ost',
      beteiligtePersonen: 'Zwei männliche Täter dunkel gekleidet mit Kapuzenpullovern, eine dritte Person wartend am Außenzaun.',
      beobachtungen: 'Kamera 7 zeigte Übersteigen des Außenzaunes. Einbruchmeldeanlage Lagerhalle 3 schlug an. Ein Täter trat mit einem Karton aus der Fluchttür.',
      massnahmen: 'Sicherheitsleitstelle verständigt, Eigensicherung gewahrt, Fluchtwege beobachtet, Täter vor Lagerhalle angesprochen und bis Eintreffen der Polizei festgehalten.',
      verstaendigteStellen: 'Sicherheitsleitstelle (NSL) & Polizei Funkstreife Notruf 110',
      besondereVorkommnisse: 'Keine Personen verletzt. Straftatbestand: § 123 StGB (Hausfriedensbruch) und § 242 StGB (Diebstahl).'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm select-none">
      <div className="relative flex flex-col w-full max-w-3xl max-h-[90vh] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
                  DIGITALER WACHBERICHT // VORKOMMNISPROTOKOLL
                </span>
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
                  § 34a GEWO / BEWACHV
                </span>
              </div>
              <h2 className="text-base font-bold text-white">Ereignisbericht Nachtschicht Industriepark</h2>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 text-xs">
          <div className="rounded-lg bg-amber-950/30 p-3 border border-amber-800/40 text-amber-200 text-xs">
            <strong>Wichtig für die IHK-Bewertung:</strong> Trennen Sie eigene Wahrnehmungen strikt von Vermutungen oder Gerüchten. Benennen Sie konkrete Zeiten, Orte und beteiligte Personen sachlich.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Zeitpunkt / Zeitspanne des Vorfalls</label>
              <input
                type="text"
                value={formData.uhrzeit}
                onChange={e => setFormData({ ...formData, uhrzeit: e.target.value })}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2 text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                placeholder="z.B. 22:17 - 22:46 Uhr"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Alarmort & betroffener Sektor</label>
              <input
                type="text"
                value={formData.alarmort}
                onChange={e => setFormData({ ...formData, alarmort: e.target.value })}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2 text-white text-xs focus:border-amber-500 focus:outline-none"
                placeholder="z.B. Sektor C Außenzaun, Lagerhalle 3"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Beteiligte Personen & Täterbeschreibung</label>
            <input
              type="text"
              value={formData.beteiligtePersonen}
              onChange={e => setFormData({ ...formData, beteiligtePersonen: e.target.value })}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2 text-white text-xs focus:border-amber-500 focus:outline-none"
              placeholder="Größe, Kleidung, Besondere Merkmale, Anzahl der Personen"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Eigene Beobachtungen (Tatsachenfeststellung)</label>
            <textarea
              rows={3}
              value={formData.beobachtungen}
              onChange={e => setFormData({ ...formData, beobachtungen: e.target.value })}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2 text-white text-xs focus:border-amber-500 focus:outline-none"
              placeholder="Was wurde tatsächlich mit den eigenen Sinnen oder Kameras wahrgenommen? (Keine Vermutungen!)"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Durchgeführte Sofortmaßnahmen & Eigensicherung</label>
            <textarea
              rows={2}
              value={formData.massnahmen}
              onChange={e => setFormData({ ...formData, massnahmen: e.target.value })}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2 text-white text-xs focus:border-amber-500 focus:outline-none"
              placeholder="z.B. Leitstelle informiert, Abstand gehalten, Täter angesprochen..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Verständigte Stellen & Einsatzkräfte</label>
              <input
                type="text"
                value={formData.verstaendigteStellen}
                onChange={e => setFormData({ ...formData, verstaendigteStellen: e.target.value })}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2 text-white text-xs focus:border-amber-500 focus:outline-none"
                placeholder="Polizei 110, Leitstelle, Einsatzleiter"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Besondere Vorkommnisse / Verletzungen</label>
              <input
                type="text"
                value={formData.besondereVorkommnisse}
                onChange={e => setFormData({ ...formData, besondereVorkommnisse: e.target.value })}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2 text-white text-xs focus:border-amber-500 focus:outline-none"
                placeholder="Sachschäden, Verletzungen, sichergestellte Gegenstände"
              />
            </div>
          </div>

          {/* Validation Feedback if submitted */}
          {validationResult && (
            <div className="rounded-xl bg-slate-950 p-4 border border-slate-700 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">Auswertung des Wachberichts:</span>
                <span className="font-mono text-emerald-400 font-bold">{validationResult.score} / 10 Punkte</span>
              </div>
              {validationResult.commendations.map((c, i) => (
                <div key={i} className="flex items-center gap-1.5 text-emerald-400 text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>{c}</span>
                </div>
              ))}
              {validationResult.errors.map((err, i) => (
                <div key={i} className="flex items-center gap-1.5 text-red-400 text-xs">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{err}</span>
                </div>
              ))}
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={handleFillStandard}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Muster-Protokoll einfügen</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-5 py-2.5 transition-colors shadow-lg"
            >
              <Send className="h-4 w-4" />
              <span>Wachbericht einreichen & bewerten</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
