import React, { useState } from 'react';
import { Video, Eye, AlertCircle, X, ShieldAlert, CheckCircle2, RotateCw } from 'lucide-react';
import { sounds } from '../utils/audio';

interface CCTVTerminalProps {
  currentLevel: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectCamera: (camId: number) => void;
  activeCamId: number;
}

interface CameraFeed {
  id: number;
  name: string;
  sector: string;
  status: 'ONLINE' | 'MOTION' | 'ALARM' | 'OFFLINE';
  description: string;
  targetInfo: string;
}

export const CCTVTerminal: React.FC<CCTVTerminalProps> = ({
  currentLevel,
  isOpen,
  onClose,
  onSelectCamera,
  activeCamId
}) => {
  const [selectedFeed, setSelectedFeed] = useState<number>(7);
  const [irMode, setIrMode] = useState<boolean>(true);

  if (!isOpen) return null;

  const feeds: CameraFeed[] = [
    {
      id: 1,
      name: 'CAM 01 // WERKSTOR SÜD',
      sector: 'Sektor A • Pforte & Zufahrt',
      status: currentLevel === 6 ? 'MOTION' : 'ONLINE',
      description: 'Schrankenanlage und Zufahrtsstraße. Kennzeichenerfassung aktiv.',
      targetInfo: currentLevel === 6 ? 'Streifenwagen der Polizei trifft am Werkstor ein!' : 'Schranke geschlossen. Keine Vorkommnisse.'
    },
    {
      id: 4,
      name: 'CAM 04 // LAGERHALLE 3 NOTAUSGANG',
      sector: 'Sektor B • Hochwertlager Ostwand',
      status: currentLevel >= 4 ? 'ALARM' : 'ONLINE',
      description: 'Fluchttür mit EMA-Magnetkontakt und PIR-Außenmelder.',
      targetInfo: currentLevel >= 4 ? 'VERDÄCHTIGE PERSON AN TÜR! Hebelwerkzeug festgestellt!' : 'Tür verriegelt, Plombierung intakt.'
    },
    {
      id: 7,
      name: 'CAM 07 // AUSSENZAUN SEKTOR C',
      sector: 'Sektor C • Perimeterschutz Nord-Ost',
      status: currentLevel >= 2 ? 'ALARM' : 'ONLINE',
      description: 'Maschendrahtzaun mit S-Draht-Krone. Wärmebild-Detektor.',
      targetInfo: currentLevel >= 2 ? 'ALARM: 3 PERSONEN AM ZAUN! Überklettern und Maschendurchtrennung!' : 'Zaunlinie frei. Normale Kontrollintervalle.'
    },
    {
      id: 9,
      name: 'CAM 09 // LKW-LADEZONE & CONTAINER',
      sector: 'Sektor D • Containerdepot West',
      status: currentLevel === 3 ? 'MOTION' : 'ONLINE',
      description: 'Speditionsgassen und Hochcontainerreihen.',
      targetInfo: currentLevel === 3 ? 'BEWEGUNG ZWISCHEN BLOCKED CONTAINERN! Zwei Schatten ducken sich weg.' : 'Stellplätze ordnungsgemäß abgestellt.'
    }
  ];

  const currentFeed = feeds.find(f => f.id === selectedFeed) || feeds[0];

  const handleSwitch3DCamera = (camId: number) => {
    sounds.playRadioSquelch();
    onSelectCamera(camId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm select-none">
      <div className="relative flex flex-col w-full max-w-5xl rounded-2xl bg-slate-950 border border-cyan-800/80 shadow-2xl overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-cyan-900/60 bg-slate-900/90 px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-cyan-950 border border-cyan-700 text-cyan-400">
              <Video className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">
                  LEITSTELLEN-VIDEOÜBERWACHUNG (CCTV)
                </span>
                <span className="rounded bg-emerald-950 px-1.5 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-800">
                  SYSTEM ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-400">Industriepark Nord • 4-Kanal Multisensor-Matrix • VdS 2366</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIrMode(!irMode)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-mono font-medium border transition-colors ${
                irMode ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>IR-Restlichtverstärker: {irMode ? 'AN' : 'AUS'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Schließen"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-5 bg-slate-950">
          {/* Main Large Monitor Screen */}
          <div className="lg:col-span-2 flex flex-col gap-2">
            <div
              className={`relative aspect-video w-full rounded-xl border-2 overflow-hidden flex flex-col justify-between p-4 ${
                irMode ? 'border-emerald-700/80 bg-[#05140b]' : 'border-slate-700 bg-slate-900'
              }`}
            >
              {/* Scanlines Effect */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] opacity-40"></div>

              {/* Screen Header OSD */}
              <div className="relative z-10 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${currentFeed.status === 'ALARM' ? 'bg-red-500' : 'bg-emerald-400'}`}></span>
                  <span className={`font-bold ${irMode ? 'text-emerald-300' : 'text-slate-100'}`}>{currentFeed.name}</span>
                </div>
                <div className={`${irMode ? 'text-emerald-400' : 'text-slate-400'}`}>
                  REC ● 22:17:44 [LIVE]
                </div>
              </div>

              {/* Tactical Center Reticle & Target Box */}
              <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                {currentFeed.status === 'ALARM' ? (
                  <div className="flex flex-col items-center p-3 rounded-lg bg-red-950/80 border border-red-500/80 text-red-200">
                    <ShieldAlert className="h-8 w-8 text-red-400 mb-1" />
                    <span className="font-mono text-sm font-bold tracking-wider text-red-300">
                      KI-VORKOMMNIS-DETEKTION: ZIEL ERFASST
                    </span>
                    <span className="text-xs text-red-200 text-center max-w-sm mt-1">
                      {currentFeed.targetInfo}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center opacity-40">
                    <div className="h-16 w-16 border border-emerald-500/60 rounded-full flex items-center justify-center">
                      <div className="h-1 w-1 bg-emerald-400"></div>
                    </div>
                    <span className="font-mono text-[11px] text-emerald-400/80 mt-2">SEKTOR GESICHERT</span>
                  </div>
                )}
              </div>

              {/* Screen Footer OSD & Switch Action */}
              <div className="relative z-10 flex items-center justify-between text-xs font-mono pt-2 border-t border-emerald-900/40">
                <span className={irMode ? 'text-emerald-400/80' : 'text-slate-400'}>
                  {currentFeed.sector}
                </span>

                <button
                  onClick={() => handleSwitch3DCamera(currentFeed.id)}
                  className="flex items-center gap-1.5 rounded bg-cyan-600 px-3 py-1 font-sans text-xs font-bold text-white hover:bg-cyan-500 transition-colors shadow"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Als 3D-Kamera einnehmen</span>
                </button>
              </div>
            </div>

            {/* Quick Context Tip */}
            <div className="rounded-lg bg-slate-900/70 p-3 text-xs text-slate-300 border border-slate-800">
              <span className="font-bold text-cyan-300">§ 34a Sachkunde-Hinweis zur Videoüberwachung:</span> Videoaufzeichnungen auf privaten Betriebsgeländen unterliegen der DSGVO / BDSG. Bei Alarmauslösung ist die visuelle Verifikation (Fernbeobachtung) vor dem körperlichen Einschreiten stets geboten, um Eigensicherung und Rechtsgüterabwägung sicherzustellen.
            </div>
          </div>

          {/* Camera Selection List & Controls */}
          <div className="flex flex-col gap-2.5">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
              VERFÜGBARE VIDEOKANÄLE
            </h3>

            <div className="flex flex-col gap-2 overflow-y-auto max-h-[380px] pr-1">
              {feeds.map(feed => {
                const isSelected = feed.id === selectedFeed;
                return (
                  <div
                    key={feed.id}
                    onClick={() => setSelectedFeed(feed.id)}
                    className={`flex flex-col gap-1 rounded-xl p-3 cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold">{feed.name}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                          feed.status === 'ALARM'
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : feed.status === 'MOTION'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}
                      >
                        {feed.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400">{feed.sector}</div>
                    <div className="text-[11px] text-slate-300 line-clamp-1">{feed.description}</div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => handleSwitch3DCamera(selectedFeed)}
              className="mt-auto w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs py-2.5 transition-colors shadow-lg"
            >
              <RotateCw className="h-4 w-4" />
              <span>Ausgewählten Blickwinkel in 3D ansehen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
