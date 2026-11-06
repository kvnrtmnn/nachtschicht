import React, { useState } from 'react';
import {
  Tablet,
  CheckSquare,
  FileText,
  BookMarked,
  Map,
  X,
  CheckCircle2,
  Circle,
  AlertTriangle,
  PhoneCall,
  Shield,
  MapPin
} from 'lucide-react';
import { Checkpoint } from '../types';

interface TabletModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkpoints: Checkpoint[];
  currentLevel: number;
  playerPos: { x: number; z: number };
}

export const TabletModal: React.FC<TabletModalProps> = ({
  isOpen,
  onClose,
  checkpoints,
  currentLevel,
  playerPos
}) => {
  const [activeTab, setActiveTab] = useState<'auftrag' | 'anweisung' | 'lexikon' | 'karte'>('auftrag');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm select-none">
      {/* Tablet Frame */}
      <div className="relative flex flex-col w-full max-w-4xl h-[620px] rounded-3xl bg-slate-900 border-4 border-slate-700 shadow-2xl overflow-hidden">
        {/* Tablet Top Bezel */}
        <div className="flex items-center justify-between bg-slate-950 px-6 py-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-900/60 text-indigo-400 border border-indigo-700/50">
              <Tablet className="h-4 w-4" />
            </div>
            <div>
              <span className="font-mono text-xs font-bold text-indigo-300">SEC-PAD 34a • DIENST-TABLET</span>
              <span className="ml-2 text-[10px] text-slate-400">Firmware v4.8 • Hanse Logistik Security</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span>AKKU: 94%</span>
            <span>LTE: VERBUNDEN</span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Tablet schließen"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tablet Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('auftrag')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-medium border-b-2 transition-all ${
              activeTab === 'auftrag'
                ? 'border-indigo-500 text-indigo-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="h-4 w-4" />
            <span>Dienstauftrag & KP</span>
          </button>

          <button
            onClick={() => setActiveTab('anweisung')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-medium border-b-2 transition-all ${
              activeTab === 'anweisung'
                ? 'border-indigo-500 text-indigo-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Dienstanweisung</span>
          </button>

          <button
            onClick={() => setActiveTab('lexikon')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-medium border-b-2 transition-all ${
              activeTab === 'lexikon'
                ? 'border-indigo-500 text-indigo-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookMarked className="h-4 w-4" />
            <span>§ 34a Rechtslexikon</span>
          </button>

          <button
            onClick={() => setActiveTab('karte')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-medium border-b-2 transition-all ${
              activeTab === 'karte'
                ? 'border-indigo-500 text-indigo-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Map className="h-4 w-4" />
            <span>Geländekarte</span>
          </button>
        </div>

        {/* Tablet Content View */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900 text-slate-200">
          {/* TAB 1: Dienstauftrag & Checkpoints */}
          {activeTab === 'auftrag' && (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
                <div className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider mb-1">
                  AKTUELLES EINSATZZIEL (STUFE {currentLevel}/6)
                </div>
                <h3 className="text-base font-bold text-white mb-1">Nachtrevierdienst Industriepark Nord</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Bestreifung des Außengeländes, Sichtprüfung der Zaunanlagen Sektor C, Überprüfung der Notausgangstüren an Lagerhalle 3 und Erfassung aller elektronischen Wächterkontrollpunkte mittels RFID-Scanner.
                </p>
              </div>

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">
                WÄCHTERKONTROLLSYSTEM (WKS) - STREIFENGANG
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {checkpoints.map(cp => (
                  <div
                    key={cp.id}
                    className={`flex items-start gap-3 rounded-xl p-3.5 border transition-all ${
                      cp.scanned
                        ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300'
                    }`}
                  >
                    {cp.scanned ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
                    )}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">{cp.name}</span>
                        <span
                          className={`rounded px-1.5 py-0.2 font-mono text-[10px] ${
                            cp.scanned ? 'bg-emerald-900 text-emerald-300' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {cp.scanned ? 'ERFASST' : 'OFFEN'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 mt-0.5">{cp.locationName}</span>
                      <p className="text-[11px] text-slate-300 mt-1 leading-snug">{cp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Dienstanweisung & Meldewege */}
          {activeTab === 'anweisung' && (
            <div className="flex flex-col gap-4 text-xs">
              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
                <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase font-mono mb-2">
                  <Shield className="h-4 w-4" />
                  <span>Allgemeine Dienstanweisung (ADA) & Objektdienstanweisung (ODA)</span>
                </div>
                <div className="space-y-2 text-slate-300 leading-relaxed">
                  <p>
                    <strong>1. Dienstpflichten:</strong> Der Sicherheitsmitarbeiter hat seinen Dienst pünktlich, nüchtern und in vollständiger Dienstkleidung anzutreten. Der Dienstausweis nach § 18 BewachV ist stets mitzuführen.
                  </p>
                  <p>
                    <strong>2. Eigensicherung (DGUV V23):</strong> Eigenschutz geht immer vor Sachwertschutz! Bei unklaren Lagen, Einbruchsalarmen oder Überzahl von verdächtigen Personen ist sofort die Sicherheitsleitstelle zu verständigen. Alleinarbeit ohne Notfallkommunikation ist untersagt.
                  </p>
                  <p>
                    <strong>3. Grenzen der Befugnisse:</strong> Private Sicherheitskräfte besitzen keine Polizeirechte. Festnahmen stützen sich ausschließlich auf das Jedermannsrecht (§ 127 Abs. 1 StPO). Eine Durchsuchung von Personen gegen deren Willen ist rechtswidrig!
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-950 p-4 border border-blue-900/60">
                <div className="flex items-center gap-2 text-blue-400 font-bold uppercase font-mono mb-2">
                  <PhoneCall className="h-4 w-4" />
                  <span>Notfall- und Meldewege</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
                  <div className="rounded-lg bg-slate-900 p-3 border border-slate-800">
                    <span className="font-bold text-white block mb-1">Sicherheitsleitstelle (NSL 24/7)</span>
                    <span className="font-mono text-cyan-400">Funkkanal 4 • Kurzwahl: *100</span>
                    <p className="text-[11px] text-slate-400 mt-1">Ständige Rückfallebene, Annahme von Statusmeldungen und Einleitung von Interventionen.</p>
                  </div>
                  <div className="rounded-lg bg-slate-900 p-3 border border-slate-800">
                    <span className="font-bold text-white block mb-1">Polizei Notruf</span>
                    <span className="font-mono text-amber-400">Notruf 110 (Nur bei Straftaten / Gefahr)</span>
                    <p className="text-[11px] text-slate-400 mt-1">Bei bestätigtem Einbruch, Gewaltanwendung oder bewaffneten Tätern unverzüglich alarmieren.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Rechtsgrundlagen-Lexikon */}
          {activeTab === 'lexikon' && (
            <div className="flex flex-col gap-3 text-xs">
              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800">
                <h4 className="font-bold text-indigo-300 mb-1">§ 127 Abs. 1 StPO – Vorläufige Festnahme</h4>
                <p className="text-slate-300 leading-relaxed">
                  Wird jemand auf frischer Tat betroffen oder verfolgt, so ist, wenn er der Flucht verdächtig ist oder seine Identität nicht sofort festgestellt werden kann, jedermann befugt, ihn auch ohne richterliche Anordnung vorläufig festzunehmen. <em>Wichtig:</em> Auf Verhältnismäßigkeit achten! Unverzügliche Übergabe an die Polizei.
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800">
                <h4 className="font-bold text-indigo-300 mb-1">§ 32 StGB / § 227 BGB – Notwehr & Nothilfe</h4>
                <p className="text-slate-300 leading-relaxed">
                  Notwehr ist die Verteidigung, die erforderlich ist, um einen gegenwärtigen rechtswidrigen Angriff von sich oder einem anderen abzuwenden. Bei Nothilfe wird ein Dritter verteidigt. <em>Grenzen:</em> Kein Notwehrexzess (§ 33 StGB), keine Rache bei beendetem Angriff.
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800">
                <h4 className="font-bold text-indigo-300 mb-1">§ 859 BGB – Selbsthilfe des Besitzers (Besitzkehr & Besitzwehr)</h4>
                <p className="text-slate-300 leading-relaxed">
                  Der Besitzer darf sich verbotener Eigenmacht (§ 858 BGB) mit Gewalt erwehren. Wird eine bewegliche Sache auf frischer Tat entwendet, darf der Besitzer sie dem Täter sofort wieder abnehmen (Besitzkehr).
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800">
                <h4 className="font-bold text-indigo-300 mb-1">§ 18 BewachV & DGUV Vorschrift 23</h4>
                <p className="text-slate-300 leading-relaxed">
                  Mitführen des Dienstausweises, Namens- oder Kennzeichnungsschildpflicht bei Kontrollgängen im öffentlichen Verkehrsraum oder Einlasskontrollen. DGUV V23 verlangt Funktionsprüfung von Funkgeräten und Taschenlampen vor Beginn jedes Kontrollgangs.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Geländekarte */}
          {activeTab === 'karte' && (
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="relative w-full max-w-lg aspect-square rounded-2xl bg-slate-950 border-2 border-slate-700 p-4 overflow-hidden">
                {/* Grid Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-40"></div>

                {/* Warehouse 1 */}
                <div className="absolute left-6 top-8 w-28 h-32 rounded bg-slate-800 border border-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-300 text-center">
                  Lagerhalle 1<br />(Logistik)
                </div>

                {/* Warehouse 2 */}
                <div className="absolute left-6 bottom-16 w-28 h-20 rounded bg-slate-800 border border-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-300 text-center">
                  Lagerhalle 2<br />(Elektronik)
                </div>

                {/* Warehouse 3 (Burglary Target) */}
                <div className="absolute right-8 top-28 w-32 h-36 rounded bg-slate-800 border-2 border-amber-600/70 flex items-center justify-center text-[10px] font-bold text-amber-300 text-center">
                  Lagerhalle 3<br />(Hochwertgüter)
                </div>

                {/* Guardhouse / Leitstelle */}
                <div className="absolute left-24 bottom-6 w-16 h-12 rounded bg-blue-950 border border-blue-600 flex items-center justify-center text-[9px] font-bold text-blue-300 text-center">
                  Pforte / Leitstelle
                </div>

                {/* Damaged Fence Section C */}
                <div className="absolute right-12 top-6 flex items-center gap-1 text-[9px] font-mono font-bold text-red-400 bg-red-950/80 px-1.5 py-0.5 rounded border border-red-700">
                  <AlertTriangle className="h-3 w-3 text-red-400" />
                  <span>Sektor C Zaunloch</span>
                </div>

                {/* Real-time Player Position Pin */}
                {/* Map bounds approx -50 to 50 maps to 0% to 100% */}
                <div
                  className="absolute z-20 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                  style={{
                    left: `${((playerPos.x + 50) / 100) * 100}%`,
                    top: `${((playerPos.z + 50) / 100) * 100}%`
                  }}
                >
                  <div className="h-3.5 w-3.5 rounded-full bg-blue-500 border-2 border-white shadow-lg"></div>
                  <span className="text-[9px] font-mono font-bold text-white bg-blue-950 px-1 rounded shadow mt-0.5">
                    SIE
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Aktuelle GPS-Position: X: {playerPos.x.toFixed(1)} m | Z: {playerPos.z.toFixed(1)} m
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
