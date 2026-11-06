export type GameMode = 'campaign' | 'freeroam' | 'scenarios' | 'exam' | 'instructor';

export type MissionLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type CameraViewMode = 'third-person' | 'first-person' | 'cctv';

export type Rank = 
  | 'Sicherheitsanwärter'
  | 'Nachwuchs-Sicherheitsmitarbeiter'
  | 'Sicherheitsmitarbeiter'
  | 'Erfahrene Einsatzkraft'
  | 'Sicherheitsprofi';

export interface Checkpoint {
  id: string;
  name: string;
  locationName: string;
  x: number;
  z: number;
  scanned: boolean;
  requiredInLevel: number;
  description: string;
}

export type IntruderState = 'waiting' | 'climbing' | 'sneaking' | 'hiding' | 'tampering' | 'confronted' | 'fleeing' | 'subdued';

export interface Intruder {
  id: string;
  name: string;
  x: number;
  z: number;
  targetX: number;
  targetZ: number;
  state: IntruderState;
  hasStolenGoods: boolean;
  cooperativeLevel: 'cooperative' | 'timid' | 'aggressive';
  spotted: boolean;
}

export interface DecisionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  legalBasis: string; // e.g. "§ 127 Abs. 1 StPO", "DGUV Vorschrift 23", "§ 859 BGB"
  feedback: string;
  scoreDelta: {
    safety: number;     // max 30
    legal: number;      // max 25
    observation: number;// max 20
    communication: number; // max 15
    documentation: number; // max 10
  };
  triggerAlarm?: boolean;
  nextLevel?: MissionLevel;
  intruderReaction?: 'flee' | 'surrender' | 'provoke';
}

export interface DecisionEvent {
  id: string;
  level: MissionLevel;
  title: string;
  subtitle: string;
  situation: string;
  location: string;
  options: DecisionOption[];
}

export interface WachberichtData {
  uhrzeit: string;
  alarmort: string;
  beteiligtePersonen: string;
  beobachtungen: string;
  massnahmen: string;
  verstaendigteStellen: string;
  besondereVorkommnisse: string;
}

export interface MissionEvaluation {
  safetyScore: number;       // out of 30
  legalScore: number;        // out of 25
  observationScore: number;  // out of 20
  communicationScore: number;// out of 15
  documentationScore: number;// out of 10
  totalScore: number;        // out of 100
  passed: boolean;
  rank: Rank;
  criticalErrors: string[];
  commendations: string[];
  learningTips: {
    topic: string;
    paragraph: string;
    advice: string;
  }[];
}

export interface ExamQuestion {
  id: string;
  category: 
    | 'Recht der öffentlichen Sicherheit und Ordnung'
    | 'Gewerberecht (§ 34a GewO)'
    | 'Datenschutz (DSGVO)'
    | 'Bürgerliches Gesetzbuch (BGB)'
    | 'Straf- und Strafverfahrensrecht'
    | 'Umgang mit Menschen'
    | 'Unfallverhütungsvorschriften (DGUV V23)'
    | 'Umgang mit Waffen'
    | 'Sicherheitstechnik';
  question: string;
  options: string[];
  correctIndices: number[]; // 1 or 2 correct answers (IHK rule)
  explanation: string;
  paragraph: string;
}

export interface ScenarioDefinition {
  id: string;
  number: string;
  title: string;
  location: string;
  focus: string;
  description: string;
  difficulty: 'Leicht' | 'Mittel' | 'Schwer';
}
