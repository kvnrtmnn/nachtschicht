import { DecisionEvent, ExamQuestion, ScenarioDefinition } from '../types';

export const SCENARIOS: ScenarioDefinition[] = [
  {
    id: 'sc-01',
    number: '01',
    title: 'Dienstantritt im Industriepark',
    location: 'Industriepark Nord, Wachgebäude & Sektor A',
    focus: 'Gewerberecht (§ 34a GewO, BewachV), UVV (DGUV V23)',
    description: 'Übernahme des Nachtdienstes, Vollständigkeitsprüfung der Ausrüstung, Prüfung der Notruf- und Meldewege sowie erster Kontrollgang mit Wächterkontrollsystem.',
    difficulty: 'Leicht'
  },
  {
    id: 'sc-02',
    number: '02',
    title: 'Einbrecher am Außenzaun',
    location: 'Außenzaun Sektor C',
    focus: 'Hausrecht, BGB (§ 858, § 859 BGB), Eigensicherung',
    description: 'Drei Personen am Außenzaun beobachtet. Zwei überwinden die Barriere, eine bleibt als Schmiere stehen. Lagebeurteilung und Eigensicherung vor Einschreiten.',
    difficulty: 'Mittel'
  },
  {
    id: 'sc-03',
    number: '03',
    title: 'Einbruch in die Lagerhalle',
    location: 'Lagerhalle 3, Verladestelle Süd',
    focus: 'StGB (§ 123, § 242 StGB), StPO (§ 127 Abs. 1), Meldertechnik',
    description: 'Die Einbruchmeldeanlage (EMA) schlägt an. Täter hebeln Notausgangstür auf. Taktisches Absichern und Koordinierung von Interventionskräften.',
    difficulty: 'Schwer'
  },
  {
    id: 'sc-04',
    number: '04',
    title: 'Verdächtiger Kunde im Supermarkt',
    location: 'Kaufhaus Passage, Einzelhandel',
    focus: 'Diebstahl (§ 242 StGB), Taschenkontrolle, Jedermannsrecht (§ 127 StPO)',
    description: 'Kunde steckt Parfüm in die Jackentasche und passiert die Kasse. Wann ist die Tat vollendet? Taschenkontrolle ohne Einwilligung rechtmäßig?',
    difficulty: 'Mittel'
  },
  {
    id: 'sc-05',
    number: '05',
    title: 'Aggressiver Besucher am Empfang',
    location: 'Konzernzentrale, Empfang / Pforte',
    focus: 'Deeskalation, Hausrecht (§ 903 BGB), Notwehr (§ 32 StGB)',
    description: 'Ein abgewiesener Bewerber verlangt lautstark Einlass, droht dem Empfangspersonal und will die Schranke durchbrechen.',
    difficulty: 'Mittel'
  },
  {
    id: 'sc-06',
    number: '06',
    title: 'Einlasskontrolle in der Diskothek',
    location: 'Club Metropolis, Einlassbereich',
    focus: 'Gewerberecht, Hausrecht, Jugendschutzgesetz (JuSchG)',
    description: 'Konfliktsituation an der Tür: Betrunkene Gruppe, gefälschte Ausweise und Selektionsrecht nach Hausordnung.',
    difficulty: 'Mittel'
  },
  {
    id: 'sc-07',
    number: '07',
    title: 'Schlägerei auf einer Veranstaltung',
    location: 'Messegelände Halle 7 / Open Air Areal',
    focus: 'Nothilfe (§ 32 StGB), Verhältnismäßigkeit, Eigensicherung DGUV V23',
    description: 'Zwei Gruppen geraten in eine Schlägerei. Einsatz im Team, Trennung der Parteien und Schutz unbeteiligter Zuschauer.',
    difficulty: 'Schwer'
  },
  {
    id: 'sc-08',
    number: '08',
    title: 'Brandalarm im Bürogebäude',
    location: 'Tech-Tower Etage 4',
    focus: 'Brandschutz, Brandmeldeanlage (BMA), Evakuierung, UVV',
    description: 'Optischer Rauchmelder in Serverraum löst aus. Evakuierungsdurchsage, Überprüfung des Brandortes und Einweisung der Feuerwehr.',
    difficulty: 'Mittel'
  },
  {
    id: 'sc-09',
    number: '09',
    title: 'Unberechtigter Zutritt mit Fremdausweis',
    location: 'Forschungs- und Entwicklungszentrum Tor 2',
    focus: 'Zutrittskontrollsystem (ZKS), Datenschutz (DSGVO), Betrug (§ 263 StGB)',
    description: 'Mitarbeiter versucht, fremden Werksausweis am Drehkreuz zu nutzen. Sicherstellung des Ausweises und Hausrechtsdurchsetzung.',
    difficulty: 'Mittel'
  },
  {
    id: 'sc-10',
    number: '10',
    title: 'Verdächtiger Gegenstand im Bahnhof/Terminal',
    location: 'Transit-Bereich Bahnsteig 3',
    focus: 'Gefahrenabwehr, Unkonventionelle Spreng- und Brandvorrichtung (USBV)',
    description: 'Herrenloser Koffer steht seit 45 Minuten neben Fahrkartenautomat. Berühren verboten! Absperrung und Verständigung Bundespolizei.',
    difficulty: 'Schwer'
  },
  {
    id: 'sc-11',
    number: '11',
    title: 'Unfall bei einem Kontrollgang',
    location: 'Industriepark, Treppenhaus Kühlanlage',
    focus: 'Erste Hilfe, UVV (DGUV V23), Personen-Notsignal-Anlage (PNSA)',
    description: 'Schichtkollege stürzt von Metalltreppe und ist bewusstlos. Notruf 112 absetzen, stabile Seitenlage, Sicherung der Unfallstelle.',
    difficulty: 'Leicht'
  },
  {
    id: 'sc-12',
    number: '12',
    title: 'Manipulation einer Überwachungskamera',
    location: 'Speditionshof Ladezone West',
    focus: 'Sicherheitstechnik, Videoüberwachung, Sabotage (§ 303 StGB)',
    description: 'Kamerabild 5 fällt aus; Täter sprüht Objektiv mit Farbspray ab. Sofortige Alarmweiterleitung und Prüfung alternativer Blickwinkel.',
    difficulty: 'Mittel'
  },
  {
    id: 'sc-13',
    number: '13',
    title: 'Streit um einen Parkplatz auf Firmengelände',
    location: 'Kundenparkplatz Sektor Nord',
    focus: 'Besitz (§ 854 BGB), Verbotene Eigenmacht (§ 858 BGB), Besitzwehr',
    description: 'Fremdparker blockiert Lkw-Zufahrt und wird verbal ausfallend. Wann darf abgeschleppt werden? Grenzen privater Selbsthilfe.',
    difficulty: 'Mittel'
  },
  {
    id: 'sc-14',
    number: '14',
    title: 'Bewaffnete Person am Werkstor',
    location: 'Haupteingang Werkstor Süd',
    focus: 'Waffenrecht (WaffG), Messer/Gefährliche Werkzeuge, Eigensicherung',
    description: 'Mann zieht Einhandmesser mit 12cm Klingenlänge. Sofortiger Rückzug in Pfortenhalle, Barrikadierung, Notruf 110, keine Helden!',
    difficulty: 'Schwer'
  },
  {
    id: 'sc-15',
    number: '15',
    title: 'Große Abschluss-Nachtschicht',
    location: 'Gesamtes Industrieareal (Alle Sektoren)',
    focus: 'Gesamtspektrum § 34a GewO Prüfungsvorbereitung',
    description: 'Kombiniertes Szenario aus Dienstantritt, CCTV-Beobachtung, Einbruchsalarm, Täteransprache, Polizei-Einweisung und Wachbericht.',
    difficulty: 'Schwer'
  }
];

export const DECISION_EVENTS: Record<number, DecisionEvent> = {
  1: {
    id: 'evt-level1',
    level: 1,
    title: 'Dienstantritt & Vorbereitung',
    subtitle: 'Wachgebäude Industriepark Nord • 21:45 Uhr',
    location: 'Wachgebäude / Leitstelle',
    situation: 'Sie beginnen Ihre Nachtschicht. Ihr Schichtleiter fordert Sie auf, die Dienstantritts-Checkliste abzuarbeiten. Welche Reihenfolge und Maßnahmen sind rechtlich und berufsgenossenschaftlich vorgeschrieben?',
    options: [
      {
        id: 'l1-opt1',
        text: 'Dienstanweisung einsehen, Dienstausweis mitführen, Funkgerät & Taschenlampe auf Funktion prüfen, Alarm- und Notrufnummern verifizieren.',
        isCorrect: true,
        legalBasis: '§ 34a GewO / BewachV § 18 & DGUV Vorschrift 23 § 7',
        feedback: 'Vorbildlich! Nach BewachV muss der Dienstausweis stets mitgeführt werden. DGUV Vorschrift 23 verlangt vor Antritt von Alleinarbeit/Streifendienst die Funktionsprüfung der Kommunikations- und Notrufeinrichtungen.',
        scoreDelta: { safety: 5, legal: 5, observation: 4, communication: 3, documentation: 2 },
        nextLevel: 2
      },
      {
        id: 'l1-opt2',
        text: 'Sofort die Runde auf dem Außengelände drehen; Papiere und Akkustand können auch später nach Mitternacht geprüft werden.',
        isCorrect: false,
        legalBasis: 'DGUV Vorschrift 23 § 7 (Unterweisung & Ausrüstung)',
        feedback: 'Gefährlicher Fehler! Bei Ausfall des Funkgeräts oder leerer Taschenlampe ist in einer Notlage keine Hilfe erreichbar. Verstoß gegen Unfallverhütungsvorschriften.',
        scoreDelta: { safety: -5, legal: -3, observation: 0, communication: -2, documentation: -2 },
        nextLevel: 2
      },
      {
        id: 'l1-opt3',
        text: 'Den Dienstausweis im Spind lassen (damit er nicht verloren geht) und privat Musik über Kopfhörer hören.',
        isCorrect: false,
        legalBasis: 'BewachV § 18 (Dienstausweis & Schildtragepflicht)',
        feedback: 'Schwerer Verstoß! Das Nichtmitführen des Dienstausweises im Wachdienst stellt eine Ordnungswidrigkeit nach BewachV dar. Kopfhörer verhindern zudem das Erkennen akustischer Gefahren.',
        scoreDelta: { safety: -10, legal: -10, observation: -5, communication: -5, documentation: 0 },
        nextLevel: 2
      }
    ]
  },
  2: {
    id: 'evt-level2',
    level: 2,
    title: 'Alarm Sektor C: Personen am Außenzaun',
    subtitle: 'Kamera 7 zeigt Bewegung • 22:17 Uhr',
    location: 'Außenzaun Sektor C',
    situation: 'Auf Kamera 7 ist zu sehen, wie eine Person über den Zaun klettert, eine zweite durch eine beschädigte Zaunmasche schlüpft und eine dritte draußen wartet. Die Alarmmeldung "Bewegung Sektor C" leuchtet rot auf. Wie reagieren Sie?',
    options: [
      {
        id: 'l2-opt1',
        text: 'Lage auf den Monitoren beobachten, Funkmeldung an Leitstelle/Kollegen absetzen, Eigensicherung beachten und mit Abstand observieren.',
        isCorrect: true,
        legalBasis: 'DGUV Vorschrift 23 § 8 & Eigenschutzgrundsatz',
        feedback: 'Taktisch perfekt! Bei einer Überzahl von 3 potentiellen Tätern darf keine Alleinintervention ohne Alarmierung erfolgen. Eigenschutz geht stets vor!',
        scoreDelta: { safety: 10, legal: 5, observation: 8, communication: 5, documentation: 2 },
        nextLevel: 3
      },
      {
        id: 'l2-opt2',
        text: 'Allein mit gezückter Taschenlampe laut rufend direkt auf die drei Personen zustürmen, um sie sofort zu stellen.',
        isCorrect: false,
        legalBasis: 'DGUV Vorschrift 23 § 8 (Eigensicherung)',
        feedback: 'Taktischer Kardinalfehler! Sie begeben sich in akute Lebensgefahr gegen eine Überzahl. Sicherheitsmitarbeiter sind keine Spezialeinheit der Polizei.',
        scoreDelta: { safety: -15, legal: -5, observation: 2, communication: 0, documentation: 0 },
        nextLevel: 3
      },
      {
        id: 'l2-opt3',
        text: 'Den Alarm quittieren und ignorieren, da noch kein Diebstahl vollendet ist und die Personen vielleicht nur spazieren gehen.',
        isCorrect: false,
        legalBasis: '§ 123 StGB (Hausfriedensbruch) / Dienstanweisung',
        feedback: 'Dienstpflichtverletzung! Durch das Überwinden des Zaunes liegt bereits ein vollendeter Hausfriedensbruch (§ 123 StGB) vor. Wegschauen verletzt den Bewachungsvertrag.',
        scoreDelta: { safety: -5, legal: -10, observation: -10, communication: -5, documentation: -5 },
        nextLevel: 3
      }
    ]
  },
  3: {
    id: 'evt-level3',
    level: 3,
    title: 'Täterbewegung auf dem Betriebsgelände',
    subtitle: 'Zwischen Lkw-Parkplatz und Containern • 22:25 Uhr',
    location: 'Container-Depot & Lkw-Stellplatz',
    situation: 'Die beiden Eindringlinge bewegen sich geduckt zwischen Containern in Richtung Lagerhalle 3. Sie versuchen Lichtkegel zu meiden. Sie haben Sichtkontakt aus ca. 25 Metern Entfernung hinter einem Auflieger. Ihre Maßnahme?',
    options: [
      {
        id: 'l3-opt1',
        text: 'In der Deckung bleiben, Standort und Bewegungsrichtung per Funk an Leitstelle melden, Rückzugswege der Täter im Auge behalten.',
        isCorrect: true,
        legalBasis: 'Beobachtungs- und Meldepflicht / Eigensicherung',
        feedback: 'Richtig gehandelt! Eine präzise Standortmeldung ermöglicht der Leitstelle und der Polizei ein zielgerichtetes Einschreiten. Sie bleiben unverletzt und handlungsfähig.',
        scoreDelta: { safety: 8, legal: 5, observation: 6, communication: 4, documentation: 2 },
        nextLevel: 4
      },
      {
        id: 'l3-opt2',
        text: 'Aus der Deckung springen und androhen: "Stehenbleiben oder ich ziehe meine Waffe!", obwohl Sie unbewaffnet sind.',
        isCorrect: false,
        legalBasis: '§ 241 StGB (Bedrohung) & Deeskalationsgebot',
        feedback: 'Gefährliche Eskalation und rechtlich unzulässig! Das Vortäuschen von Waffen kann zu Panik, Angriffen der Täter oder schweren Unfällen führen.',
        scoreDelta: { safety: -8, legal: -5, observation: 2, communication: -5, documentation: 0 },
        nextLevel: 4
      },
      {
        id: 'l3-opt3',
        text: 'Die Täter mit Steinen bewerfen, um sie zur Flucht über den Zaun zu treiben.',
        isCorrect: false,
        legalBasis: '§ 223 / 224 StGB (Körperverletzung / gefährliche Körperverletzung)',
        feedback: 'Rechtswidrige Gewalt! Gegen flüchtige oder umhergehende Personen ohne gegenwärtigen rechtswidrigen Angriff auf Leib/Leben liegt keine Notwehr vor.',
        scoreDelta: { safety: -10, legal: -15, observation: 0, communication: -5, documentation: 0 },
        nextLevel: 4
      }
    ]
  },
  4: {
    id: 'evt-level4',
    level: 4,
    title: 'EMA-Alarm an Lagerhalle 3',
    subtitle: 'Magnetkontakt & PIR-Melder ausgelöst • 22:31 Uhr',
    location: 'Lagerhalle 3, Tür Süd',
    situation: 'Die Einbruchmeldeanlage (EMA) schlägt Alarm: Meldergruppe 12 (Türkontakt Lagerhalle 3) und PIR-Bewegungsmelder Halle 3 Süd. Eine Person hebelte eine Seitentür auf. Wie leiten Sie die Intervention ein?',
    options: [
      {
        id: 'l4-opt1',
        text: 'Polizei (110) über Leitstelle alarmieren lassen (verifizierter Einbruchsalarm), Beleuchtung am Hallentrakt einschalten und Gebäude von außen absichern.',
        isCorrect: true,
        legalBasis: 'VdS 2311 (EMA-Intervention) / Eigensicherung',
        feedback: 'Exzellent! Durch die Kombination aus Türkontakt + PIR-Melder ist der Alarm verifiziert (Falschalarm ausgeschlossen). Das Betreten unübersichtlicher dunkler Hallen ohne Polizei ist lebensgefährlich.',
        scoreDelta: { safety: 8, legal: 5, observation: 5, communication: 5, documentation: 3 },
        nextLevel: 5
      },
      {
        id: 'l4-opt2',
        text: 'Allein ohne Ankündigung in die völlig abgedunkelte Halle rennen, um die Täter auf frischer Tat im Inneren zu stellen.',
        isCorrect: false,
        legalBasis: 'DGUV V23 § 8 (Verhalten bei unklaren Gefahrenlagen)',
        feedback: 'Extrem riskant! In dunklen Hallen mit Hochregalen drohen Hinterhalte, herabstürzende Lasten und Angriffe aus dem toten Winkel.',
        scoreDelta: { safety: -12, legal: 0, observation: -2, communication: -3, documentation: 0 },
        nextLevel: 5
      },
      {
        id: 'l4-opt3',
        text: 'Die Sirene der Alarmanlage abschalten, um die Täter nicht zu erschrecken.',
        isCorrect: false,
        legalBasis: 'Sicherheitstechnik / Dienstvorschrift',
        feedback: 'Absurd und vertragswidrig! Die Alarmsirene dient der optisch/akustischen Abschreckung und Signalisierung.',
        scoreDelta: { safety: -5, legal: -5, observation: -5, communication: -5, documentation: -5 },
        nextLevel: 5
      }
    ]
  },
  5: {
    id: 'evt-level5',
    level: 5,
    title: 'Konfrontation mit dem Einbrecher',
    subtitle: 'Einbrecher tritt mit Karton aus der Halle • 22:38 Uhr',
    location: 'Lagerhalle 3 Vorplatz',
    situation: 'Einer der Täter tritt mit einem Karton (elektronische Bauteile) aus der Tür. Er bemerkt Sie in 6 Metern Entfernung. Er zögert, schaut sich nach Fluchtwegen um. Welche Maßnahmen sind rechtlich zulässig und taktisch geboten?',
    options: [
      {
        id: 'l5-opt1',
        text: 'Sicherheitsabstand wahren, Täter mit fester Stimme ansprechen: "Halt! Sicherheitsdienst! Stellen Sie den Karton ab und bleiben Sie stehen!", Hände im Blick behalten.',
        isCorrect: true,
        legalBasis: '§ 127 Abs. 1 StPO (Vorläufige Festnahme) / Deeskalation',
        feedback: 'Rechtlich einwandfrei! Täter ist auf frischer Tat mit Diebesgut betroffen (§ 242 StGB). Durch die Aufforderung wird ihm die Festnahmeabsicht eröffnet, ohne unüberlegte Gewalt anzuwenden.',
        scoreDelta: { safety: 6, legal: 5, observation: 4, communication: 5, documentation: 2 },
        nextLevel: 6,
        intruderReaction: 'surrender'
      },
      {
        id: 'l5-opt2',
        text: 'Den Täter sofort ohne ein Wort zu Boden tackeln, Schläge androhen und seine Hosentaschen nach Geld durchsuchen.',
        isCorrect: false,
        legalBasis: '§ 223 StGB (Körperverletzung) / Unzulässige Durchsuchung',
        feedback: 'Schwerer Rechtsfehler! Sicherheitsmitarbeiter haben kein Durchsuchungsrecht von Personen gegen deren Willen. Körperliche Festnahmegewalt ist nur zur Fluchtverhinderung im Rahmen der Verhältnismäßigkeit zulässig.',
        scoreDelta: { safety: -10, legal: -15, observation: 0, communication: -10, documentation: 0 },
        nextLevel: 6,
        intruderReaction: 'provoke'
      },
      {
        id: 'l5-opt3',
        text: 'Sich entschuldigen, umdrehen und weglaufen, damit man nicht in einen Konflikt verwickelt wird.',
        isCorrect: false,
        legalBasis: 'BewachV / Arbeitsvertragliche Schutzpflicht',
        feedback: 'Grobe Dienstpflichtverletzung! Schutz des Eigentums des Auftraggebers gehört zum Kernauftrag.',
        scoreDelta: { safety: 0, legal: -10, observation: -5, communication: -5, documentation: -5 },
        nextLevel: 6,
        intruderReaction: 'flee'
      }
    ]
  },
  6: {
    id: 'evt-level6',
    level: 6,
    title: 'Eintreffen der Polizei & Wachbericht',
    subtitle: 'Streifenwagen der Polizei trifft ein • 22:46 Uhr',
    location: 'Zufahrt Tor Süd & Lagerhalle 3',
    situation: 'Zwei Polizeibeamte treffen am Werkstor ein. Sie weisen die Beamten ein und übergeben den festgehaltenen Täter. Nun müssen Sie die Lage schildern und den digitalen Wachbericht anfertigen. Was ist entscheidend?',
    options: [
      {
        id: 'l6-opt1',
        text: 'Sachliche Schilderung: Genaue Zeiten, Alarmbereiche, Beobachtetes vom Vermuteten trennen, Zeugenaussage machen und vollständigen Wachbericht erstellen.',
        isCorrect: true,
        legalBasis: 'Beweissicherung & § 34a Dokumentationspflicht',
        feedback: 'Vorbildlicher Einsatzabschluss! Ein präziser Wachbericht ist vor Gericht als Zeugenstütze und für den Versicherungsschutz des Auftraggebers unverzichtbar.',
        scoreDelta: { safety: 5, legal: 5, observation: 5, communication: 5, documentation: 5 }
      },
      {
        id: 'l6-opt2',
        text: 'Der Polizei sagen, sie brauche keinen Bericht, man habe den Täter selbst schon genug belehrt.',
        isCorrect: false,
        legalBasis: 'Strafprozessuale Ermittlungspflicht der Polizei',
        feedback: 'Unprofessionell! Die Polizei ist für das Strafverfahren zuständig; der Sicherheitsdienst ist Zeuge und Hilfsorgan des Hausrechtsinhabers.',
        scoreDelta: { safety: 0, legal: -5, observation: 0, communication: -5, documentation: -10 }
      }
    ]
  }
};

export const EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 'q-01',
    category: 'Recht der öffentlichen Sicherheit und Ordnung',
    question: 'Welche Rechtsstellung hat ein privater Sicherheitsmitarbeiter im Dienst gegenüber Bürgern?',
    options: [
      'Er besitzt hoheitliche Eingriffsbefugnisse wie ein Polizeibeamter.',
      'Er besitzt grundsätzlich nur die Jedermannsrechte sowie die vom Auftraggeber übertragenen Hausrechte.',
      'Er darf Personen ohne richterlichen Beschluss auf Dauer in Gewahrsam nehmen.',
      'Er darf Fahrzeuge im öffentlichen Straßenverkehr anhalten und durchsuchen.'
    ],
    correctIndices: [1],
    paragraph: 'Recht der öffentlichen Sicherheit & Ordnung / GG Art. 20',
    explanation: 'Private Sicherheitsdienste handeln im Rahmen des Privatrechts. Sie besitzen keine Polizeibefugnisse, sondern nur Jedermannsrechte (z.B. § 127 Abs. 1 StPO, § 227 BGB / § 32 StGB) und abgeleitete Hausrechte (§ 903, 858 BGB).'
  },
  {
    id: 'q-02',
    category: 'Gewerberecht (§ 34a GewO)',
    question: 'Welche der folgenden Pflichten treffen den Bewachungsgewerbetreibenden bzw. seine Mitarbeiter nach der Bewachungsverordnung (BewachV)?',
    options: [
      'Der Wachdienst muss dem Mitarbeiter einen Dienstausweis ausstellen, der im Dienst mitgeführt werden muss.',
      'Sicherheitsmitarbeiter müssen im Citystreifendienst ein sichtbares Schild mit Name oder Kennnummer tragen.',
      'Jeder Sicherheitsmitarbeiter muss eine behördliche Schusswaffe im Holster tragen.',
      'Dienstanweisungen sind unverbindlich und müssen Mitarbeitern nicht ausgehändigt werden.'
    ],
    correctIndices: [0, 1],
    paragraph: '§ 18 BewachV & § 34a GewO',
    explanation: 'Nach § 18 BewachV besteht Dienstausweispflicht sowie Kennzeichnungspflicht (Schild mit Namen oder Kennnummer bei bestimmten Tätigkeiten wie Citystreife, Türsteher).'
  },
  {
    id: 'q-03',
    category: 'Straf- und Strafverfahrensrecht',
    question: 'Unter welchen Voraussetzungen darf JEDERMANN (auch der Sicherheitsmitarbeiter) eine Person nach § 127 Abs. 1 StPO vorläufig festnehmen?',
    options: [
      'Wenn die Person auf frischer Tat betroffen oder verfolgt wird.',
      'Wenn die Person der Flucht verdächtig ist oder ihre Identität nicht sofort festgestellt werden kann.',
      'Weil die Person dem Sicherheitsmitarbeiter unsympathisch ist.',
      'Zur Eintreibung von zivilrechtlichen Geldschulden.'
    ],
    correctIndices: [0, 1],
    paragraph: '§ 127 Abs. 1 StPO',
    explanation: 'Die Jedermann-Festnahme verlangt zwingend: 1. Auf frischer Tat betroffen oder verfolgt, 2. Fluchtverdacht ODER Identität nicht sofort feststellbar.'
  },
  {
    id: 'q-04',
    category: 'Bürgerliches Gesetzbuch (BGB)',
    question: 'Was versteht man im BGB unter „Verbotener Eigenmacht“ (§ 858 BGB)?',
    options: [
      'Jede Kündigung eines Arbeitsverhältnisses ohne Frist.',
      'Das Entziehen oder Stören des Besitzes ohne den Willen des Besitzers und ohne gesetzliche Gestattung.',
      'Das rechtmäßige Abschleppen eines Falschparkers durch die Polizei.',
      'Die Durchführung einer genehmigten Brandschutzübung.'
    ],
    correctIndices: [1],
    paragraph: '§ 858 BGB',
    explanation: 'Wer dem Besitzer ohne dessen Willen den Besitz entzieht oder ihn im Besitz stört, handelt widerrechtlich (verbotene Eigenmacht), sofern nicht das Gesetz die Entziehung oder Störung gestattet.'
  },
  {
    id: 'q-05',
    category: 'Bürgerliches Gesetzbuch (BGB)',
    question: 'Welche Rechte hat der Besitzer bei verbotener Eigenmacht nach § 859 BGB?',
    options: [
      'Er darf sich verbotener Eigenmacht mit Gewalt erwehren (Besitzwehr, Abs. 1).',
      'Wird eine bewegliche Sache auf frischer Tat weggenommen, darf er sie dem Täter sofort wieder abnehmen (Besitzkehr, Abs. 2).',
      'Er muss immer erst 14 Tage auf ein Gerichtsurteil warten, bevor er etwas unternimmt.',
      'Er darf den Täter lebenslang auf dem Grundstück einsperren.'
    ],
    correctIndices: [0, 1],
    paragraph: '§ 859 BGB (Besitzwehr und Besitzkehr)',
    explanation: 'Nach § 859 BGB darf der Besitzer sich gegen verbotene Eigenmacht mit verhältnismäßiger Gewalt zur Wehr setzen (Besitzwehr) und auf frischer Tat entwendete Sachen sofort wieder wegnehmen (Besitzkehr).'
  },
  {
    id: 'q-06',
    category: 'Straf- und Strafverfahrensrecht',
    question: 'Was ist Notwehr nach § 32 StGB?',
    options: [
      'Die Verteidigung, die erforderlich ist, um einen gegenwärtigen rechtswidrigen Angriff von sich oder einem anderen abzuwenden.',
      'Die Bestrafung eines Diebes drei Tage nach der Tat.',
      'Das gewaltsame Erzwingen einer Zeugenaussage.',
      'Jede körperliche Maßnahme gegen behördliche Vollstreckungsbeamte.'
    ],
    correctIndices: [0],
    paragraph: '§ 32 StGB / § 227 BGB',
    explanation: 'Notwehr ist die Verteidigung, die erforderlich ist, um einen gegenwärtigen, rechtswidrigen Angriff von sich (Notwehr) oder einem anderen (Nothilfe) abzuwenden. Rache oder nachträgliche Bestrafung ist niemals Notwehr!'
  },
  {
    id: 'q-07',
    category: 'Unfallverhütungsvorschriften (DGUV V23)',
    question: 'Welche Grundsätze gelten für den Sicherheitsdienst nach der DGUV Vorschrift 23 (Wach- und Sicherungsdienst)?',
    options: [
      'Sicherheitsmitarbeiter dürfen sich nicht in vermeidbare Gefahren begeben (Eigensicherungsgrundsatz).',
      'Bei Kontrollgängen mit erhöhten Gefahren ist Alleinarbeit unzulässig oder durch technische Hilfsmittel (PNSA) abzusichern.',
      'Dienstkleidung darf nach eigenem Geschmack bunt und ohne Schutzwirkung gewählt werden.',
      'Trinkalkohol ist während des Nachtdienstes in geringen Mengen erlaubt.'
    ],
    correctIndices: [0, 1],
    paragraph: 'DGUV Vorschrift 23 § 7 & § 8',
    explanation: 'DGUV V23 regelt den Arbeitsschutz im Sicherheitsdienst: Eigensicherung, Überwachung von Alleinarbeit durch Meldesysteme (PNSA) und striktes Alkoholverbot.'
  },
  {
    id: 'q-08',
    category: 'Umgang mit Menschen',
    question: 'Welche Verhaltensweisen unterstützen die Deeskalation bei einer verbal aggressiven Person?',
    options: [
      'Ruhige, sachliche Stimmlage und Beibehalten eines Sicherheitsabstandes von mind. 1,5 bis 2 Metern.',
      'Aktives Zuhören und dem Gegenüber einen Fluchtweg offenlassen.',
      'Die Person laut auslachen und beleidigen, um Stärke zu demonstrieren.',
      'Die Person sofort mit beiden Händen an die Wand drücken.'
    ],
    correctIndices: [0, 1],
    paragraph: 'Deeskalationskonzepte / Umgang mit Menschen',
    explanation: 'Distanz wahren, ruhige Körpersprache, sachlicher Tonfall und aktives Zuhören nehmen Aggressionen den Nährboden. Verengung des Fluchtwegs löst oft körperliche Gegenwehr aus.'
  },
  {
    id: 'q-09',
    category: 'Sicherheitstechnik',
    question: 'Welche Aufgaben hat eine Einbruchmeldeanlage (EMA) nach VdS-Richtlinien?',
    options: [
      'Frühzeitige Erkennung eines Einbruchversuchs und Auslösung eines internen/externen Alarms.',
      'Abschreckung von Tätern durch optische und akustische Signalgeber.',
      'Automatische Verhaftung und Fesselung des Täters.',
      'Reparatur beschädigter Fenster und Türen.'
    ],
    correctIndices: [0, 1],
    paragraph: 'DIN EN 50131 / VdS 2311',
    explanation: 'Eine EMA dient der Detektion (PIR, Magnetkontakte, Glasbruchmelder), Meldung an hilfeleistende Stellen und Abschreckung.'
  }
];

export const CHECKPOINTS_DATA = [
  {
    id: 'kp-1',
    name: 'KP 01 - Werkstor Süd',
    locationName: 'Eingangsbereich Pforte',
    x: 0,
    z: 22,
    scanned: false,
    requiredInLevel: 1,
    description: 'RFID-Kontrollpunkt an Schrankenanlage Werkstor Süd. Prüfung von Schrankenverriegelung und Pfortenbeleuchtung.'
  },
  {
    id: 'kp-2',
    name: 'KP 02 - Sektor C Zaunanlage',
    locationName: 'Außenzaun Nord-Ost',
    x: 28,
    z: -18,
    scanned: false,
    requiredInLevel: 2,
    description: 'RFID-Kontrollpunkt am Maschendrahtzaun Sektor C. Sichtprüfung auf Beschädigungen und Untergrabungen.'
  },
  {
    id: 'kp-3',
    name: 'KP 03 - Container-Depot',
    locationName: 'Lkw- und Frachtumschlag',
    x: -18,
    z: -8,
    scanned: false,
    requiredInLevel: 3,
    description: 'RFID-Kontrollpunkt an Containerreihe 4. Kontrolle von Plomben und Sichtachsen zwischen Stellplätzen.'
  },
  {
    id: 'kp-4',
    name: 'KP 04 - Lagerhalle 3 Notausgang',
    locationName: 'Lagerhalle 3 Ostwand',
    x: 18,
    z: 6,
    scanned: false,
    requiredInLevel: 4,
    description: 'Magnetischer Kontrollpunkt an Antipanik-Fluchttür Lagerhalle 3. Prüfung von Schließzustand und Plombierung.'
  },
  {
    id: 'kp-5',
    name: 'KP 05 - Transformatorstation',
    locationName: 'Hochspannungsstation West',
    x: -26,
    z: 16,
    scanned: false,
    requiredInLevel: 1,
    description: 'Kontrollpunkt Warnschild Trafostation. Prüfung der Schlossabdeckung und Ausschluss von Rauchentwicklung.'
  }
];
