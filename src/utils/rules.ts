import { MissionEvaluation, Rank, WachberichtData } from '../types';

export function calculateRank(score: number): Rank {
  if (score >= 90) return 'Sicherheitsprofi';
  if (score >= 75) return 'Erfahrene Einsatzkraft';
  if (score >= 60) return 'Sicherheitsmitarbeiter';
  if (score >= 45) return 'Nachwuchs-Sicherheitsmitarbeiter';
  return 'Sicherheitsanwärter';
}

export function evaluateWachbericht(report: WachberichtData): { score: number; errors: string[]; commendations: string[] } {
  let score = 0;
  const errors: string[] = [];
  const commendations: string[] = [];

  // Check 1: Time precision
  if (report.uhrzeit && report.uhrzeit.length >= 4) {
    score += 2;
    commendations.push('Exakte Uhrzeitangaben dokumentiert.');
  } else {
    errors.push('Uhrzeitangabe ungenau oder unvollständig.');
  }

  // Check 2: Alarmort & Sektor
  if (report.alarmort.toLowerCase().includes('sektor c') || report.alarmort.toLowerCase().includes('lagerhalle 3') || report.alarmort.toLowerCase().includes('zaun')) {
    score += 2;
    commendations.push('Tatort/Alarmort präzise bezeichnet.');
  } else {
    errors.push('Ortsangabe zu ungenau (Sektor oder Halle fehlt).');
  }

  // Check 3: Beteiligte Personen
  if (report.beteiligtePersonen.length >= 10) {
    score += 2;
    commendations.push('Personenbeschreibungen detailliert erfasst.');
  } else {
    errors.push('Täter-/Personenbeschreibungen fehlen oder sind zu kurz.');
  }

  // Check 4: Separation of fact vs conjecture in observations
  const obs = report.beobachtungen.toLowerCase();
  const containsConjecture = obs.includes('wollte sicher') || obs.includes('war bestimmt') || obs.includes('sah böse aus');
  if (obs.length >= 15 && !containsConjecture) {
    score += 2;
    commendations.push('Tatsachenfeststellung vorbildlich von Vermutungen getrennt (§ 34a Standard).');
  } else if (containsConjecture) {
    errors.push('Wachbericht enthält unzulässige Spekulationen/Mutmaßungen statt reiner Tatsachen.');
  } else {
    errors.push('Eigene Beobachtungen nicht ausreichend beschrieben.');
  }

  // Check 5: Interventionsstellen & Maßnahmen
  if (report.verstaendigteStellen.toLowerCase().includes('polizei') || report.verstaendigteStellen.toLowerCase().includes('leitstelle')) {
    score += 2;
    commendations.push('Meldewege und verständigte Behörden ordnungsgemäß aufgeführt.');
  } else {
    errors.push('Verständigung der Leitstelle oder Polizei nicht vermerkt.');
  }

  return { score: Math.min(10, score), errors, commendations };
}

export function buildFinalEvaluation(scores: {
  safety: number;
  legal: number;
  observation: number;
  communication: number;
  documentation: number;
}, criticalViolations: string[]): MissionEvaluation {
  const safetyScore = Math.max(0, Math.min(30, scores.safety));
  const legalScore = Math.max(0, Math.min(25, scores.legal));
  const observationScore = Math.max(0, Math.min(20, scores.observation));
  const communicationScore = Math.max(0, Math.min(15, scores.communication));
  const documentationScore = Math.max(0, Math.min(10, scores.documentation));

  const totalScore = safetyScore + legalScore + observationScore + communicationScore + documentationScore;
  const hasFatalViolation = criticalViolations.length > 0;
  const passed = !hasFatalViolation && totalScore >= 50;

  const commendations: string[] = [];
  if (safetyScore >= 25) commendations.push('Hervorragende Eigensicherung nach DGUV Vorschrift 23.');
  if (legalScore >= 20) commendations.push('Präzise rechtliche Einordnung von Jedermannsrechten.');
  if (observationScore >= 16) commendations.push('Aufmerksame Nutzung der CCTV- und Meldetechnik.');
  if (communicationScore >= 12) commendations.push('Deeskalierende und professionelle Ansprache.');

  const learningTips = [];
  if (legalScore < 18 || hasFatalViolation) {
    learningTips.push({
      topic: 'Rechtsgrundlage der vorläufigen Festnahme',
      paragraph: '§ 127 Abs. 1 StPO',
      advice: 'Private Sicherheitskräfte haben keine Polizeibefugnisse. Eine Festnahme ist nur zulässig auf frischer Tat betroffen/verfolgt, wenn Fluchtgefahr besteht oder Identität nicht sofort feststellbar ist.'
    });
  }
  if (safetyScore < 20) {
    learningTips.push({
      topic: 'Eigensicherung und Unfallverhütung',
      paragraph: 'DGUV Vorschrift 23 § 7 & § 8',
      advice: 'Niemals leichtsinnig alleine in ungesicherte Lagen laufen. Eigenschutz geht stets vor Sachwertschutz!'
    });
  }
  if (communicationScore < 10) {
    learningTips.push({
      topic: 'Deeskalation und Kommunikation',
      paragraph: 'Umgang mit Menschen / 3-Stufen-Modell',
      advice: 'Distanz wahren (Sicherheitsabstand mind. 2m), sachlicher Tonfall, Blickkontakt halten und Fluchtweg des Gegenübers nicht versperren.'
    });
  }

  return {
    safetyScore,
    legalScore,
    observationScore,
    communicationScore,
    documentationScore,
    totalScore,
    passed,
    rank: calculateRank(totalScore),
    criticalErrors: criticalViolations,
    commendations,
    learningTips
  };
}
