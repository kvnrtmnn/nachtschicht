import React, { useState } from 'react';
import { Compass, Play, Shield, X, CheckCircle, Search } from 'lucide-react';
import { SCENARIOS } from '../data/curriculum';
import { ScenarioDefinition } from '../types';

interface ScenarioSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenario: ScenarioDefinition) => void;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  isOpen,
  onClose,
  onSelectScenario
}) => {
  const [search, setSearch] = useState('');
  const [filterDiff, setFilterDiff] = useState<'All' | 'Leicht' | 'Mittel' | 'Schwer'>('All');

  if (!isOpen) return null;

  const filtered = SCENARIOS.filter(sc => {
    const matchesSearch =
      sc.title.toLowerCase().includes(search.toLowerCase()) ||
      sc.focus.toLowerCase().includes(search.toLowerCase()) ||
      sc.location.toLowerCase().includes(search.toLowerCase());
    const matchesDiff = filterDiff === 'All' || sc.difficulty === filterDiff;
    return matchesSearch && matchesDiff;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm select-none">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[90vh] rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-slate-950 px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-400">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
                  AUSBILDUNGSWELT // 15 EINSATZSZENARIEN
                </span>
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
                  § 34a GEWO CURRICULUM
                </span>
              </div>
              <h2 className="text-base font-bold text-white">Szenario- & Missionsauswahl</h2>
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

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/50 px-6 py-3 border-b border-slate-800">
          {/* Search box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Szenario, Rechtsbegriff oder Ort suchen..."
              className="w-full rounded-xl bg-slate-950 border border-slate-700 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Difficulty filter pills */}
          <div className="flex items-center gap-1.5 text-xs">
            {(['All', 'Leicht', 'Mittel', 'Schwer'] as const).map(d => (
              <button
                key={d}
                onClick={() => setFilterDiff(d)}
                className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                  filterDiff === d
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {d === 'All' ? 'Alle Grade' : d}
              </button>
            ))}
          </div>
        </div>

        {/* Scenario Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          {filtered.map(sc => (
            <div
              key={sc.id}
              className="group flex flex-col justify-between rounded-2xl bg-slate-950/70 p-4 border border-slate-800 hover:border-amber-500/60 transition-all shadow-sm"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-400">
                    MISSION {sc.number}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                      sc.difficulty === 'Leicht'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : sc.difficulty === 'Mittel'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : 'bg-red-950 text-red-300 border border-red-800'
                    }`}
                  >
                    {sc.difficulty}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  {sc.title}
                </h3>
                <span className="text-[11px] text-slate-400">{sc.location}</span>

                <div className="rounded-lg bg-slate-900 p-2 text-[11px] text-slate-300 border border-slate-800/80 mt-1">
                  <strong className="text-amber-400/90 font-mono">Schwerpunkt:</strong> {sc.focus}
                </div>

                <p className="text-slate-300 text-xs leading-relaxed mt-1">{sc.description}</p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-900 flex justify-end">
                <button
                  onClick={() => {
                    onSelectScenario(sc);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs px-3.5 py-1.5 transition-colors shadow"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>Szenario starten</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
