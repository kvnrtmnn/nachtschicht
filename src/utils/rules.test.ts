import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRank, evaluateWachbericht, buildFinalEvaluation } from './rules';

test('calculateRank returns correct rank thresholds', () => {
  assert.equal(calculateRank(95), 'Sicherheitsprofi');
  assert.equal(calculateRank(78), 'Erfahrene Einsatzkraft');
  assert.equal(calculateRank(62), 'Sicherheitsmitarbeiter');
  assert.equal(calculateRank(48), 'Nachwuchs-Sicherheitsmitarbeiter');
  assert.equal(calculateRank(30), 'Sicherheitsanwärter');
});

test('evaluateWachbericht gives full score for precise factual report', () => {
  const goodReport = {
    uhrzeit: '22:17 - 22:45 Uhr',
    alarmort: 'Industriepark Nord, Sektor C am Außenzaun & Lagerhalle 3',
    beteiligtePersonen: '2 männliche Täter dunkel gekleidet mit Kapuzen, 1 Person am Zaun wartend',
    beobachtungen: 'Auf Kamera 7 Übersteigen des Zaunes beobachtet. Alarm der Einbruchmeldeanlage Lagerhalle 3 ausgelöst.',
    massnahmen: 'Leitstelle alarmiert, Eigensicherung gewahrt, Fluchtwege beobachtet, Polizei eingewiesen.',
    verstaendigteStellen: 'Sicherheitsleitstelle & Polizei Notruf 110',
    besondereVorkommnisse: 'Keine Personen verletzt, Werkzeug am Zaun sichergestellt.'
  };

  const res = evaluateWachbericht(goodReport);
  assert.equal(res.score, 10);
  assert.equal(res.errors.length, 0);
  assert.ok(res.commendations.length >= 4);
});

test('evaluateWachbericht penalizes speculation and missing facts', () => {
  const badReport = {
    uhrzeit: 'spät',
    alarmort: 'irgendwo hinten',
    beteiligtePersonen: 'Typen',
    beobachtungen: 'Der Täter war bestimmt drogenabhängig und sah böse aus.',
    massnahmen: 'Bin hinterhergerannt',
    verstaendigteStellen: 'keine',
    besondereVorkommnisse: 'nix'
  };

  const res = evaluateWachbericht(badReport);
  assert.ok(res.score < 5);
  assert.ok(res.errors.some(e => e.includes('Spekulationen')));
});

test('buildFinalEvaluation handles fatal legal violations and calculates passing condition', () => {
  const failEval = buildFinalEvaluation({
    safety: 15,
    legal: 5,
    observation: 12,
    communication: 8,
    documentation: 6
  }, ['Unzulässige körperliche Durchsuchung ohne Rechtsgrundlage (§ 127 StPO / Art 2 GG)']);

  assert.equal(failEval.passed, false);
  assert.ok(failEval.criticalErrors.length > 0);

  const passEval = buildFinalEvaluation({
    safety: 28,
    legal: 24,
    observation: 18,
    communication: 14,
    documentation: 9
  }, []);

  assert.equal(passEval.passed, true);
  assert.equal(passEval.rank, 'Sicherheitsprofi');
  assert.equal(passEval.totalScore, 93);
});
