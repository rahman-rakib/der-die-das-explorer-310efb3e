export type Article = "der" | "die" | "das";

export interface Word {
  article: Article;
  word: string;
  english: string;
  emoji?: string;
}

export interface SuffixException {
  ironclad?: boolean;
  mnemonic?: string;
  illustration?: string[];
  words?: Word[];
  note?: string;
  noteTone?: Article;
}

export interface SuffixEntry {
  suffix: string;
  example: Word;
  examples?: Word[];
  exceptions?: SuffixException;
}

export interface RuleGroup {
  article: Article;
  title: string;
  emoji: string;
  words: Word[];
  suffixes?: SuffixEntry[];
  note?: string;
  exceptions?: string;
  image?: string;
}

const w = (article: Article, word: string, english: string, emoji?: string): Word => ({
  article, word, english, emoji,
});

export const RULES: RuleGroup[] = [
  // DER
  {
    article: "der", title: "male humans & animals", emoji: "🧔",
    note: "Words referring to male humans and male animals are masculine.",
    words: [w("der","Mann","man","🧔"), w("der","Vater","father","👨"), w("der","König","king","👑"), w("der","Hahn","rooster","🐓"), w("der","Stier","bull","🐂"), w("der","Löwe","lion","🦁"), w("der","Riese","giant","👹")],
  },
  {
    article: "der", title: "professions, occupations & roles", emoji: "👨‍💼",
    note: "Professions, occupations, roles, and many function titles are grammatically masculine by default.",
    words: [
      w("der","Arzt","doctor","👨‍⚕️"), w("der","Pilot","pilot","✈️"), w("der","Ingenieur","engineer","⚙️"),
      w("der","Professor","professor","🎓"), w("der","Politiker","politician","🏛️"),
    ],
  },
  {
    article: "der", title: "days, months & seasons", emoji: "📅",
    note: "Days of the week, months of the year, and seasons are all masculine.",
    words: [w("der","Montag","Monday","📅"), w("der","April","April","🌸"), w("der","Sommer","summer","☀️"), w("der","Winter","winter","❄️"), w("der","Freitag","Friday","🗓")],
  },
  {
    article: "der", title: "parts of the day", emoji: "🌅",
    note: "Parts of the day are masculine.",
    exceptions: "die Nacht",
    words: [w("der","Morgen","morning","🌅"), w("der","Vormittag","late morning","🌄"), w("der","Mittag","noon/midday","☀️"), w("der","Nachmittag","afternoon","🌇"), w("der","Abend","evening","🌆")],
  },
  {
    article: "der", title: "weather & natural forces", emoji: "🌧",
    note: "Weather phenomena and natural forces are typically masculine.",
    words: [w("der","Regen","rain","🌧"), w("der","Wind","wind","💨"), w("der","Schnee","snow","⛄"), w("der","Blitz","lightning","⚡"), w("der","Donner","thunder","🌩")],
  },
  {
    article: "der", title: "compass directions", emoji: "🧭",
    note: "The four compass directions are masculine.",
    words: [w("der","Norden","north","🧭"), w("der","Süden","south"), w("der","Osten","east"), w("der","Westen","west")],
  },
  {
    article: "der", title: "mountains & peaks", emoji: "🏔️",
    note: "Mountains and mountain peaks are usually masculine.",
    exceptions: "die Zugspitze, die Marmolada",
    words: [w("der","Everest","Everest","🏔️"), w("der","Kilimandscharo","Kilimanjaro","🏔️"), w("der","Mont Blanc","Mont Blanc","🏔️")],
  },
  {
    article: "der", title: "non-european rivers", emoji: "🌏",
    note: "Rivers outside Europe are generally masculine.",
    exceptions: "die Wolga, die Lena, die Jangtsekiang",
    words: [w("der","Amazonas","Amazon","🌏"), w("der","Mississippi","Mississippi","🌏"), w("der","Nil","Nile","🌏"), w("der","Ganges","Ganges","🌏")],
  },
  {
    article: "der", title: "wine-based drinks & spirits", emoji: "🍷",
    note: "Wines and strong spirits are masculine.",
    exceptions: "die Weinschorle, die Bowle, die Margarita",
    words: [w("der","Wein","wine","🍷"), w("der","Sekt","sparkling wine","🥂"), w("der","Champagner","champagne","🍾"), w("der","Whisky","whiskey","🥃"), w("der","Wodka","vodka","🍸")],
  },
  {
    article: "der", title: "car brands", emoji: "🚗",
    note: "Car brands are masculine (think: der Wagen — the car).",
    words: [w("der","BMW","BMW","🚗"), w("der","Mercedes","Mercedes"), w("der","Porsche","Porsche"), w("der","VW","Volkswagen")],
  },
  {
    article: "der", title: "electronic devices & appliances", emoji: "🔌",
    note: "Most electronic devices and appliances are masculine.",
    exceptions: "das Handy (mobile phone), das Tablet, das Radio; die Lampe (lamp), die Waschmaschine (washing machine)",
    words: [
      w("der","Computer","computer","💻"), w("der","Monitor","monitor","🖥️"),
      w("der","Fernseher","TV","📺"), w("der","Laptop","laptop","💻"), w("der","Kühlschrank","fridge","❄️"),
      w("der","Herd","stove","🔥"), w("der","Toaster","toaster","🍞"), w("der","Föhn","hair dryer","💨"),
    ],
  },

  {
    article: "der", title: "agent nouns from verbs (-er)", emoji: "🔧",
    note: "Agent nouns formed from verbs with the -er suffix (the person/thing that does the action) are masculine.",
    words: [
      w("der","Lehrer","teacher","👨‍🏫"), w("der","Fahrer","driver","🚗"),
      w("der","Bäcker","baker","🥖"), w("der","Fischer","fisherman","🎣"),
      w("der","Sänger","singer","🎤"), w("der","Drucker","printer","🖨️"),
      w("der","Staubsauger","vacuum cleaner","🧹"),
    ],
  },
  {
    article: "der", title: "real nouns ending in -en", emoji: "🌿",
    note: "If it's a real noun (not a verb turned into a noun) ending in -en → very likely DER. (Verb-derived -en nouns like das Essen are DAS — see the das tab.)",
    words: [
      w("der","Garten","garden","🌿"), w("der","Ofen","oven","🔥"), w("der","Boden","floor/ground","🪵"),
      w("der","Laden","shop","🏪"), w("der","Kuchen","cake","🍰"), w("der","Knochen","bone","🦴"), w("der","Drachen","dragon","🐉"),
    ],
  },

  {
    article: "der", title: "word endings → der", emoji: "🔤",
    words: [],
    suffixes: [
      {
        suffix: "-er", example: w("der","Lehrer","teacher"),
        examples: [w("der","Lehrer","teacher"), w("der","Vater","father"), w("der","Bruder","brother"), w("der","Fahrer","driver"), w("der","Schüler","pupil")],
        exceptions: {
          mnemonic: "Mother, daughter, sister, butter, ladder, feather, number, wall, tax — the women and household items of the -er family are mostly DIE. And rooms and things around the house are DAS.",
          illustration: ["👩","👩‍👧","🧈","🪜","🪶","🔢","🧱","🕹️","🪟"],
          words: [
            w("die","Mutter","mother"), w("die","Tochter","daughter"), w("die","Schwester","sister"),
            w("die","Butter","butter"), w("die","Leiter","ladder/manager"), w("die","Schulter","shoulder"),
            w("die","Feder","feather/pen"), w("die","Steuer","tax/steering wheel"), w("die","Wimper","eyelash"), w("die","Nummer","number"),
            w("die","Mauer","wall"),
            w("das","Fenster","window"), w("das","Wasser","water"), w("das","Zimmer","room"), w("das","Wetter","weather"),
            w("das","Messer","knife"), w("das","Theater","theater"), w("das","Lager","storage/camp"), w("das","Muster","pattern"), w("das","Pflaster","plaster/bandage"),
          ],
        },
      },
      { suffix: "-ling", example: w("der","Lehrling","apprentice"), exceptions: { ironclad: true } },
      { suffix: "-ismus", example: w("der","Tourismus","tourism"), exceptions: { ironclad: true } },
      { suffix: "-ist", example: w("der","Pianist","pianist"), exceptions: { ironclad: true } },
      { suffix: "-ant", example: w("der","Elefant","elephant") },
      { suffix: "-ent", example: w("der","Student","student") },
  {
        suffix: "-or", example: w("der","Doktor","doctor"),
        examples: [w("der","Doktor","doctor"), w("der","Motor","motor"), w("der","Faktor","factor"), w("der","Reaktor","reactor")],
        exceptions: {
          mnemonic: "When -or is stressed (dok-TOR, mo-TOR) → DER. A handful of short or borrowed -or words go DAS.",
          illustration: ["🔬","🚪","🧪","🎨"],
          words: [w("das","Labor","lab"), w("das","Dekor","decor"), w("das","Chlor","chlorine"), w("das","Tor","gate")],
          note: "der Tor means 'fool' — das Tor means 'gate'. Same spelling, different article AND meaning!",
          noteTone: "das",
        },
      },
      { suffix: "-ig", example: w("der","Honig","honey") },
      { suffix: "-ich", example: w("der","Teppich","carpet") },
    ],
  },

  // DIE
  {
    article: "die", title: "female humans & animals", emoji: "👩",
    note: "Words referring to female humans and female animals are feminine.",
    words: [w("die","Frau","woman","👩"), w("die","Mutter","mother","👩‍🦰"), w("die","Tochter","daughter","👧"), w("die","Ärztin","doctor (f)","👩‍⚕️"), w("die","Friseuse","hairdresser (f)","💇‍♀️"), w("die","Henne","hen","🐔"), w("die","Kuh","cow","🐄")],
  },
  {
    article: "die", title: "flowers, trees & plants", emoji: "🌹",
    note: "Most flowers, trees, and plants are feminine.",
    exceptions: "🌳 der Jasmin, der Ahorn, der Bambus, der Kaktus — 🌼 das Veilchen, das Gänseblümchen, das Schneeglöckchen",
    words: [w("die","Rose","rose","🌹"), w("die","Eiche","oak","🌳"), w("die","Orchidee","orchid","🌸"), w("die","Iris","iris","🪻"), w("die","Distel","thistle","🌵")],
  },
  {
    article: "die", title: "fruits & berries", emoji: "🍓",
    note: "Most fruits and berries are feminine.",
    exceptions: "der Apfel, der Pfirsich, das Obst",
    words: [w("die","Banane","banana","🍌"), w("die","Kirsche","cherry","🍒"), w("die","Traube","grape","🍇"), w("die","Birne","pear","🍐"), w("die","Erdbeere","strawberry","🍓"), w("die","Zitrone","lemon","🍋"), w("die","Pflaume","plum","🟣")],
  },
  {
    article: "die", title: "european rivers", emoji: "🌊",
    note: "Most European rivers are feminine.",
    exceptions: "der Rhein, der Main, der Neckar, der Inn",
    words: [w("die","Donau","Danube","🌊"), w("die","Elbe","Elbe","🌊"), w("die","Oder","Oder","🌊"), w("die","Havel","Havel","🌊")],
  },
  {
    article: "die", title: "numbers used as nouns", emoji: "🔢",
    note: "Cardinal numbers used as nouns (the digit itself) are feminine.",
    words: [w("die","Eins","one","1️⃣"), w("die","Zwei","two","2️⃣"), w("die","Million","million","🔢"), w("die","Milliarde","billion")],
  },
  {
    article: "die", title: "clock units & time measurement", emoji: "⏰",
    note: "Units of time on a clock — hour, minute, second — are mostly feminine.",
    words: [
      w("die","Stunde","hour","⏰"), w("die","Minute","minute","🕐"), w("die","Sekunde","second","⏱️"),
      w("die","Uhr","clock/watch","🕰️"),
    ],
  },
  {
    article: "die", title: "ships & vessels", emoji: "🚢",
    note: "Ships and vessels are always feminine, even when named after men.",
    words: [
      w("die","Titanic","Titanic (RMS Titanic)","🚢"), w("die","Bismarck","German battleship"), w("die","Queen Mary 2","ocean liner"),
    ],
  },
  {
    article: "die", title: "aircraft & airlines", emoji: "✈️",
    note: "Aircraft and airline names are feminine.",
    exceptions: "der Airbus (from der Bus), der Jumbo, das Flugzeug (from das zeug)",
    words: [
      w("die","Boeing","Boeing","✈️"), w("die","Concorde","Concorde","✈️"), w("die","Airbus A380","Airbus A380","✈️"),
      w("die","Lufthansa","Lufthansa","✈️"), w("die","Air France","Air France","✈️"),
    ],
  },
  {
    article: "die", title: "motorcycle brands", emoji: "🏍️",
    note: "Motorcycle brands are feminine — even BMW when it's a motorbike!",
    words: [
      w("die","Harley-Davidson","Harley-Davidson","🏍️"), w("die","Yamaha","Yamaha"), w("die","BMW","BMW (motorcycle)"),
    ],
  },
  {
    article: "die", title: "mixed drinks", emoji: "🍹",
    note: "Mixed and cocktail-style drinks tend to be feminine, breaking the masculine rule for wines and spirits.",
    words: [w("die","Weinschorle","wine spritzer","🍹"), w("die","Bowle","punch/bowl","🍹"), w("die","Margarita","margarita","🍹")],
  },
  {
    article: "die", title: "plural nouns — always die!", emoji: "👥",
    note: "In the plural, ALL nouns use the definite article die, regardless of their singular gender.",
    words: [
      w("die","Männer","plural of der Mann → the men","👨"), w("die","Frauen","plural of die Frau → the women","👩"),
      w("die","Kinder","plural of das Kind → the children","🧒"), w("die","Tische","plural of der Tisch → the tables","🪑"),
      w("die","Lehrer","plural of der Lehrer → the teachers","🎓"), w("die","Autos","plural of das Auto → the cars","🚗"),
    ],
  },
  {
    article: "die", title: "word endings → die", emoji: "🔤",
    words: [],
    suffixes: [
      {
        suffix: "-e", example: w("die","Lampe","lamp"),
        examples: [w("die","Lampe","lamp"), w("die","Straße","street"), w("die","Sonne","sun"), w("die","Blume","flower"), w("die","Liebe","love")],
        exceptions: {
          mnemonic: "Weak masculine nouns — men and male creatures who end in -e — stay DER. They're called 'weak' because they add -n in every case except nominative.",
          illustration: ["🦁","🐒","🐰","🧑‍🤝‍🧑","👨"],
          words: [
            w("der","Junge","boy"), w("der","Riese","giant"), w("der","Löwe","lion"), w("der","Affe","monkey"),
            w("der","Hase","hare"), w("der","Käse","cheese"), w("der","Neffe","nephew"), w("der","Zeuge","witness"),
            w("der","Kollege","colleague"), w("der","Experte","expert"), w("der","Sklave","slave"),
            w("der","Name","name"), w("der","Gedanke","thought"), w("der","Glaube","belief"), w("der","Wille","will"),
            w("das","Ende","end"), w("das","Auge","eye"), w("das","Erbe","inheritance"), w("das","Interesse","interest"), w("das","Image","image"), w("das","Finale","finale"),
          ],
          note: "Tip: if it's a living male creature or a 'noble abstract idea', and it ends in -e, guess DER.",
          noteTone: "der",
        },
      },
      {
        suffix: "-t", example: w("die","Zeit","time"),
        examples: [w("die","Zeit","time"), w("die","Fahrt","trip"), w("die","Kraft","force"), w("die","Nacht","night"), w("die","Stadt","city"), w("die","Welt","world"), w("die","Haut","skin"), w("die","Wut","rage"), w("die","Flut","flood"), w("die","Kunst","art"), w("die","Lust","desire"), w("die","Last","load"), w("die","Brust","chest")],
        exceptions: {
          mnemonic: "A ghost (Geist), a god (Gott), a place (Ort), a juice (Saft) and a tree (Ast) — five rebels that are DER.",
          illustration: ["👻","🙏","🗺️","🧃","🌲"],
          words: [
            w("der","Arzt","doctor"), w("der","Geist","ghost/spirit"), w("der","Gott","god"), w("der","Ort","place"),
            w("der","Saft","juice"), w("der","Ast","branch"), w("der","Frost","frost"), w("der","Rest","rest"), w("der","Test","test"), w("der","Wust","clutter"),
            w("das","Boot","boat"), w("das","Brot","bread"), w("das","Brett","board"), w("das","Blatt","leaf/page"),
            w("das","Bett","bed"), w("das","Heft","notebook"), w("das","Licht","light"), w("das","Recht","right/law"),
            w("das","Wort","word"), w("das","Gift","poison"), w("das","Gut","estate"), w("das","Obst","fruit"),
          ],
          note: "Memory hook for DAS -t words: 'In bed (Bett) with bread (Brot) and a notebook (Heft) under the light (Licht) — all neuter!'",
          noteTone: "das",
        },
      },
      { suffix: "-heit", example: w("die","Freiheit","freedom"), exceptions: { ironclad: true } },
      { suffix: "-keit", example: w("die","Möglichkeit","possibility"), exceptions: { ironclad: true } },
      { suffix: "-schaft", example: w("die","Freundschaft","friendship"), exceptions: { ironclad: true } },
      { suffix: "-ung", example: w("die","Zeitung","newspaper"), exceptions: { ironclad: true } },
      { suffix: "-tion", example: w("die","Nation","nation"), exceptions: { ironclad: true } },
      { suffix: "-tät", example: w("die","Qualität","quality"), exceptions: { ironclad: true } },
      { suffix: "-ik", example: w("die","Musik","music") },
      { suffix: "-ie", example: w("die","Energie","energy") },
      { suffix: "-enz", example: w("die","Konferenz","conference"), exceptions: { ironclad: true } },
      { suffix: "-anz", example: w("die","Toleranz","tolerance"), exceptions: { ironclad: true } },
      { suffix: "-ur", example: w("die","Natur","nature") },
      { suffix: "-in", example: w("die","Lehrerin","teacher (f)") },
      { suffix: "-ion", example: w("die","Religion","religion"), exceptions: { ironclad: true } },
    ],
  },

  // DAS
  {
    article: "das", title: "diminutives — always!", emoji: "🐣",
    note: "Diminuaive words ending in -chen or -lein is ALWAYS das, even for a girl or woman.",
    words: [w("das","Mädchen","girl","👧"), w("das","Köpfchen","little head","🧠"), w("das","Häuschen","little house","🏡"), w("das","Fräulein","Miss","🎀"), w("das","Büchlein","little book","📖")],
  },
  {
    article: "das", title: "young animals & children", emoji: "👶",
    note: "Young animals and the general words for child or baby are neuter.",
    words: [w("das","Baby","baby","👶"), w("das","Kind","child","🧒"), w("das","Lamm","lamb","🐑"), w("das","Küken","chick","🐥"), w("das","Kalb","calf","🐮")],
  },
  {
    article: "das", title: "metals, chemical elements & compounds", emoji: "⚗️",
    note: "Metals, chemical elements and compounds are neuter.",
    exceptions: "der Sauerstoff",
    words: [w("das","Gold","gold","🥇"), w("das","Eisen","iron","⛓"), w("das","Neon","neon","💡"), w("das","Benzin","petrol/gasoline","⛽"), w("das","Insulin","insulin","💉")],
  },
  {
    article: "das", title: "languages & letters", emoji: "🌍",
    note: "Names of languages and individual letters of the alphabet are neuter.",
    words: [w("das","Deutsch","German","🇩🇪"), w("das","Englisch","English","🇬🇧"), w("das","A","letter A","🅰️"), w("das","B","letter B","🅱️")],
  },
  {
    article: "das", title: "colours", emoji: "🎨",
    note: "Colour names used as nouns (the colour itself) are neuter.",
    words: [w("das","Rot","red","🔴"), w("das","Gelb","yellow","🟡"), w("das","Blau","blue","🔵")],
  },
  {
    article: "das", title: "beer & beer variants", emoji: "🍺",
    note: "Beer and its variants are neuter.",
    words: [w("das","Bier","beer","🍺"), w("das","Pils","pilsner","🍺"), w("das","Lager","lager","🍺"), w("das","Ale","ale","🍺"), w("das","Radler","shandy/radler","🍺")],
  },
  {
    article: "das", title: "fractions", emoji: "📐",
    note: "Most fractions are neuter.",
    exceptions: "die Hälfte (half)",
    words: [
      w("das","Drittel","third (⅓)","📐"), w("das","Viertel","quarter (¼)","📏"),
    ],
  },
  {
    article: "das", title: "cities, countries & continents", emoji: "🗺️",
    note: "Most cities, countries, and continents are neuter.",
    exceptions: "die Schweiz, die Türkei, die USA (pl); der Iran, der Irak, der Sudan",
    words: [w("das","Berlin","Berlin","🗺️"), w("das","Deutschland","Germany","🇩🇪"), w("das","Italien","Italy","🇮🇹"), w("das","Europa","Europe","🇪🇺")],
  },
  {
    article: "das", title: "year, age & long time periods", emoji: "🗓️",
    note: "Year and its multiples, and 'age' as a measurement of time, are neuter.",
    exceptions: "die Dekade (decade), die Epoche (epoch), die Ära (era)",
    words: [
      w("das","Jahr","year","📅"), w("das","Jahrzehnt","decade","🔟"), w("das","Jahrtausend","millennium","💎"),
      w("das","Zeitalter","age/era","🏛️"), w("das","Mittelalter","Middle Ages","⚔️"),
    ],
  },
  {
    article: "das", title: "non-agent -er nouns", emoji: "🪟",
    note: "Not all -er nouns are agents (people who do the action). When -er is part of the root word — not a verb-derived agent suffix — the noun is usually DAS.",
    exceptions: "die Butter, die Leiter",
    words: [
      w("das","Messer","knife","🔪"), w("das","Fenster","window","🪟"), w("das","Wasser","water","💧"),
      w("das","Klavier","piano","🎹"), w("das","Zimmer","room","🚪"), w("das","Wetter","weather","🌤"),
      w("das","Theater","theater","🎭"), w("das","Lager","storage/camp","🏕"), w("das","Muster","pattern","🔲"),
      w("das","Pflaster","plaster/bandage","🩹"),
    ],
  },
  {
    article: "das", title: "infinitives used as nouns", emoji: "🏃",
    note: "Any verb infinitive (ending in -en) used as a noun is ALWAYS das. Real -en nouns (not from verbs) like der Garten are DER — see the der tab.",
    words: [w("das","Laufen","running","🏃"), w("das","Essen","eating/food","🍽"), w("das","Schlafen","sleeping","😴"), w("das","Singen","singing","🎤"), w("das","Lachen","laughter","😂"), w("das","Schreiben","writing","✍️")],
  },
  {
    article: "das", title: "nouns from adjectives (substantivized)", emoji: "✨",
    note: "When an adjective is turned into a noun to mean 'the [adjective] thing/concept', it is always neuter.",
    words: [
      w("das","Gute","the good (goodness)","✨"), w("das","Böse","the evil (evilness)","😈"), w("das","Schöne","the beautiful (beauty)","🌸"),
      w("das","Neue","the new (what is new)","🆕"), w("das","Alte","the old (old things)","🏛️"),
    ],
  },

  {
    article: "das", title: "word endings → das", emoji: "🔤",
    words: [],
    suffixes: [
      {
        suffix: "-chen", example: w("das","Mädchen","girl"),
        exceptions: { ironclad: true, note: "das Mädchen and das Fräulein are DAS even though they refer to girls/women!", noteTone: "das" },
      },
      {
        suffix: "-lein", example: w("das","Fräulein","Miss"),
        exceptions: { ironclad: true, note: "Always DAS — grammar overrules biology." },
      },
      { suffix: "-um", example: w("das","Museum","museum") },
      { suffix: "-ium", example: w("das","Aquarium","aquarium"), exceptions: { ironclad: true } },
      { suffix: "-ment", example: w("das","Argument","argument") },
      { suffix: "-tum", example: w("das","Wachstum","growth"), exceptions: { mnemonic: "Almost always DAS — but two famous DER rebels.", illustration: ["💰","💎"], words: [w("der","Reichtum","wealth"), w("der","Irrtum","error")] } },
      { suffix: "-ma", example: w("das","Thema","topic") },
      { suffix: "-o", example: w("das","Auto","car") },
      { suffix: "-nis", example: w("das","Ergebnis","result"), exceptions: { mnemonic: "Mostly DAS, but a few feminine -nis nouns sneak in.", illustration: ["💚","🚧"], words: [w("die","Erlaubnis","permission"), w("die","Kenntnis","knowledge"), w("die","Finsternis","darkness")] } },

    ],
  },
];

import { MEMORY_SCENES, type MemoryScene } from "./scenes";
export { MEMORY_SCENES, type MemoryScene };

// Practice pool — flat list of words across all categories
export const SUFFIX_EXCEPTION_WORDS: Word[] = (() => {
  const seen = new Set<string>();
  const all: Word[] = [];
  RULES.forEach(r => r.suffixes?.forEach(s => {
    s.exceptions?.words?.forEach(x => {
      const k = x.article + ":" + x.word;
      if (seen.has(k)) return;
      seen.add(k);
      all.push(x);
    });
  }));
  return all;
})();

// Practice vocabulary now comes from the leveled, CEFR-classified list (A1–A2 /
// B1–B2) generated by the Python pipeline. PRACTICE_WORDS is the union of both
// levels (used by Progress lookups); PracticeView drills the selected level.
export {
  PRACTICE_WORDS,
  PRACTICE_WORDS_A1A2,
  PRACTICE_WORDS_B1B2,
} from "./practiceWords";

export interface FillSentence {
  before: string;
  word: Word;
  after: string;
}

export const FILL_SENTENCES: FillSentence[] = [
  { before: "", word: w("der","Hund","dog","🐕"), after: " ist groß." },
  { before: "", word: w("die","Katze","cat","🐈"), after: " schläft." },
  { before: "", word: w("das","Kind","child","🧒"), after: " spielt im Garten." },
  { before: "", word: w("der","Mann","man","🧔"), after: " liest die Zeitung." },
  { before: "", word: w("die","Frau","woman","👩"), after: " trinkt Kaffee." },
  { before: "", word: w("das","Auto","car","🚙"), after: " ist rot." },
  { before: "", word: w("der","Lehrer","teacher","👨‍🏫"), after: " erklärt es gut." },
  { before: "", word: w("die","Sonne","sun","☀️"), after: " scheint hell." },
  { before: "", word: w("das","Mädchen","girl","👧"), after: " lacht laut." },
  { before: "", word: w("der","Apfel","apple","🍎"), after: " schmeckt süß." },
  { before: "", word: w("die","Blume","flower","🌸"), after: " blüht im Frühling." },
  { before: "", word: w("das","Buch","book","📖"), after: " liegt auf dem Tisch." },
  { before: "", word: w("der","Zug","train","🚆"), after: " fährt schnell." },
  { before: "", word: w("die","Lampe","lamp","💡"), after: " ist neu." },
  { before: "", word: w("das","Haus","house","🏠"), after: " hat einen Garten." },
];

export const ARTICLE_META: Record<Article, { color: string; soft: string; fg: string; icon: string; label: string }> = {
  der: { color: "der", soft: "der-soft", fg: "der-foreground", icon: "♂", label: "masculine" },
  die: { color: "die", soft: "die-soft", fg: "die-foreground", icon: "♀", label: "feminine" },
  das: { color: "das", soft: "das-soft", fg: "das-foreground", icon: "✦", label: "neuter" },
};
