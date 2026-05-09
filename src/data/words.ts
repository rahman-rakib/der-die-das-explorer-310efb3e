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
}

const w = (article: Article, word: string, english: string, emoji?: string): Word => ({
  article, word, english, emoji,
});

export const RULES: RuleGroup[] = [
  // DER
  {
    article: "der", title: "Male people & animals", emoji: "🧔",
    words: [w("der","Mann","man","🧔"), w("der","Stier","bull","🐂"), w("der","Arzt","doctor","👨‍⚕️"), w("der","Vater","father","👨"), w("der","Hahn","rooster","🐓")],
  },
  {
    article: "der", title: "Days, months & seasons", emoji: "📅",
    words: [w("der","Montag","Monday","📅"), w("der","April","April","🌸"), w("der","Sommer","summer","☀️"), w("der","Winter","winter","❄️"), w("der","Freitag","Friday","🗓")],
  },
  {
    article: "der", title: "Weather & nature forces", emoji: "🌧",
    words: [w("der","Regen","rain","🌧"), w("der","Wind","wind","💨"), w("der","Schnee","snow","⛄"), w("der","Blitz","lightning","⚡"), w("der","Donner","thunder","🌩")],
  },
  {
    article: "der", title: "Compass directions", emoji: "🧭",
    words: [w("der","Norden","north","🧭"), w("der","Süden","south"), w("der","Osten","east"), w("der","Westen","west")],
  },
  {
    article: "der", title: "Car brands", emoji: "🚗",
    words: [w("der","BMW","BMW","🚗"), w("der","Mercedes","Mercedes"), w("der","Porsche","Porsche"), w("der","VW","Volkswagen")],
  },
  {
    article: "der", title: "Word endings → DER", emoji: "🔤",
    words: [],
    suffixes: [
      { suffix: "-er", example: w("der","Lehrer","teacher") },
      { suffix: "-ling", example: w("der","Lehrling","apprentice") },
      { suffix: "-ismus", example: w("der","Tourismus","tourism") },
      { suffix: "-ist", example: w("der","Pianist","pianist") },
      { suffix: "-ant", example: w("der","Elefant","elephant") },
      { suffix: "-ent", example: w("der","Student","student") },
      { suffix: "-or", example: w("der","Doktor","doctor") },
      { suffix: "-ig", example: w("der","Honig","honey") },
      { suffix: "-ich", example: w("der","Teppich","carpet") },
    ],
  },

  // DIE
  {
    article: "die", title: "Female people & animals", emoji: "👩",
    words: [w("die","Frau","woman","👩"), w("die","Kuh","cow","🐄"), w("die","Ärztin","doctor (f)","👩‍⚕️"), w("die","Mutter","mother","👩‍🦰"), w("die","Henne","hen","🐔")],
  },
  {
    article: "die", title: "Most flowers, trees & plants", emoji: "🌹",
    words: [w("die","Rose","rose","🌹"), w("die","Eiche","oak","🌳"), w("die","Tulpe","tulip","🌷"), w("die","Birke","birch","🌲"), w("die","Sonnenblume","sunflower","🌻")],
  },
  {
    article: "die", title: "Numbers used as nouns", emoji: "🔢",
    words: [w("die","Eins","one","1️⃣"), w("die","Zwei","two","2️⃣"), w("die","Million","million","🔢"), w("die","Milliarde","billion")],
  },
  {
    article: "die", title: "Word endings → DIE", emoji: "🔤",
    words: [],
    suffixes: [
      { suffix: "-e", example: w("die","Lampe","lamp") },
      { suffix: "-heit", example: w("die","Freiheit","freedom") },
      { suffix: "-keit", example: w("die","Möglichkeit","possibility") },
      { suffix: "-schaft", example: w("die","Freundschaft","friendship") },
      { suffix: "-ung", example: w("die","Zeitung","newspaper") },
      { suffix: "-tion", example: w("die","Nation","nation") },
      { suffix: "-tät", example: w("die","Qualität","quality") },
      { suffix: "-ik", example: w("die","Musik","music") },
      { suffix: "-ie", example: w("die","Energie","energy") },
      { suffix: "-enz", example: w("die","Konferenz","conference") },
      { suffix: "-anz", example: w("die","Toleranz","tolerance") },
      { suffix: "-ur", example: w("die","Natur","nature") },
      { suffix: "-in", example: w("die","Lehrerin","teacher (f)") },
      { suffix: "-ion", example: w("die","Religion","religion") },
    ],
  },

  // DAS
  {
    article: "das", title: "Diminutives — always!", emoji: "🐣",
    note: "Any word ending in -chen or -lein is ALWAYS das, even for a girl or woman.",
    words: [w("das","Küken","chick","🐣"), w("das","Häuschen","little house","🏡"), w("das","Mädchen","girl","👧"), w("das","Fräulein","Miss","🎀"), w("das","Büchlein","little book","📖")],
  },
  {
    article: "das", title: "Young animals & children", emoji: "👶",
    words: [w("das","Baby","baby","👶"), w("das","Kind","child","🧒"), w("das","Lamm","lamb","🐑"), w("das","Küken","chick","🐥"), w("das","Kalb","calf","🐮")],
  },
  {
    article: "das", title: "Metals & chemical elements", emoji: "⚗️",
    words: [w("das","Gold","gold","🥇"), w("das","Silber","silver","🥈"), w("das","Eisen","iron","⛓"), w("das","Kupfer","copper","🟠")],
  },
  {
    article: "das", title: "Languages & letters", emoji: "🌍",
    words: [w("das","Deutsch","German","🇩🇪"), w("das","Englisch","English","🇬🇧"), w("das","A","letter A","🅰️"), w("das","B","letter B","🅱️")],
  },
  {
    article: "das", title: "Infinitives used as nouns", emoji: "🏃",
    words: [w("das","Laufen","running","🏃"), w("das","Essen","eating/food","🍽"), w("das","Schlafen","sleeping","😴"), w("das","Singen","singing","🎤")],
  },
  {
    article: "das", title: "Word endings → DAS", emoji: "🔤",
    words: [],
    suffixes: [
      { suffix: "-chen", example: w("das","Mädchen","girl") },
      { suffix: "-lein", example: w("das","Fräulein","Miss") },
      { suffix: "-um", example: w("das","Museum","museum") },
      { suffix: "-ium", example: w("das","Aquarium","aquarium") },
      { suffix: "-ment", example: w("das","Argument","argument") },
      { suffix: "-tum", example: w("das","Wachstum","growth") },
      { suffix: "-ma", example: w("das","Thema","topic") },
      { suffix: "-o", example: w("das","Auto","car") },
      { suffix: "-nis", example: w("das","Ergebnis","result") },
    ],
  },
];

export interface Scene {
  title: string;
  illustration: string[];
  mnemonic: string;
  words: Word[];
  note?: string;
  tone: Article;
}

export const SCENES: Scene[] = [
  {
    title: "The Coffee Shop", tone: "das",
    illustration: ["☕","🥐","📰","💻","🎵"],
    mnemonic: "In the coffee shop, everything feels neutral and cozy.",
    words: [w("das","Café","café"), w("das","Restaurant","restaurant"), w("das","Hotel","hotel"), w("das","Büro","office"), w("das","Radio","radio"), w("das","Kino","cinema"), w("das","Sofa","sofa")],
    note: "Borrowed words ending in -o, -é, -eau → usually DAS.",
  },
  {
    title: "The Mighty River", tone: "der",
    illustration: ["🌊","🗺️","⚓","🏔️","🌍"],
    mnemonic: "Most rivers carve their own path — they're masculine!",
    words: [w("der","Rhein","Rhine"), w("der","Main","Main"), w("der","Nil","Nile"), w("der","Amazonas","Amazon"), w("der","Mississippi","Mississippi")],
    note: "Exception: rivers ending in -e or -a are usually DIE — die Donau, die Elbe, die Mosel, die Themse.",
  },
  {
    title: "The Science Lab", tone: "das",
    illustration: ["⚗️","🔬","💎","⚡","🧪"],
    mnemonic: "In the lab, all elements are neutral — das is the scientist's article.",
    words: [w("das","Gold","gold"), w("das","Silber","silver"), w("das","Eisen","iron"), w("das","Kupfer","copper"), w("das","Blei","lead"), w("das","Uran","uranium"), w("das","Helium","helium"), w("das","Sauerstoff","oxygen")],
    note: "Exception: der Stahl (steel), der Rost (rust) — they behave differently.",
  },
  {
    title: "The Tiny World", tone: "das",
    illustration: ["🔍","🐭","🏠","🌸","👧"],
    mnemonic: "Everything tiny and cute becomes neutral — das makes it adorable!",
    words: [w("das","Mädchen","girl"), w("das","Fräulein","Miss"), w("das","Häuschen","little house"), w("das","Büchlein","little book"), w("das","Städtchen","little town"), w("das","Tierchen","little animal")],
    note: "⚠️ Even female people become DAS with -chen/-lein — grammar overrules biology.",
  },
  {
    title: "The Fruit Basket", tone: "die",
    illustration: ["🍎","🍌","🍊","🍇","🥝"],
    mnemonic: "Most fruits are sweet and feminine — die rules the basket.",
    words: [w("die","Banane","banana"), w("die","Orange","orange"), w("die","Traube","grape"), w("die","Kirsche","cherry"), w("die","Pflaume","plum"), w("der","Apfel","apple"), w("der","Pfirsich","peach"), w("der","Mais","corn"), w("das","Obst","fruit (general)")],
  },
  {
    title: "The Fashion Show", tone: "die",
    illustration: ["👗","👠","👒","🧣","🎀"],
    mnemonic: "Fashion is feminine — die runs the runway.",
    words: [w("die","Bluse","blouse"), w("die","Hose","trousers"), w("die","Jacke","jacket"), w("die","Mütze","cap"), w("die","Tasche","bag"), w("der","Rock","skirt"), w("der","Schuh","shoe"), w("der","Gürtel","belt"), w("der","Mantel","coat"), w("der","Hut","hat"), w("das","Hemd","shirt"), w("das","Kleid","dress"), w("das","T-Shirt","T-shirt")],
  },
  {
    title: "The Body Map", tone: "der",
    illustration: ["🧠","❤️","👁️","🦷","🦴"],
    mnemonic: "The body has all three genders — learn it like a map!",
    words: [
      w("der","Arm","arm"), w("der","Bauch","belly"), w("der","Finger","finger"), w("der","Hals","neck"), w("der","Kopf","head"), w("der","Mund","mouth"), w("der","Rücken","back"),
      w("die","Hand","hand"), w("die","Nase","nose"), w("die","Schulter","shoulder"), w("die","Stirn","forehead"), w("die","Zunge","tongue"), w("die","Brust","chest"), w("die","Lippe","lip"),
      w("das","Auge","eye"), w("das","Bein","leg"), w("das","Gesicht","face"), w("das","Herz","heart"), w("das","Knie","knee"), w("das","Ohr","ear"),
    ],
  },
  {
    title: "The Zoo of Exceptions", tone: "die",
    illustration: ["🐬","🦋","🦈","🐊","🐆"],
    mnemonic: "At the zoo, some animals ignore the rules — meet the rebels!",
    words: [
      w("das","Pferd","horse (neuter despite size)"),
      w("das","Kamel","camel"),
      w("das","Nashorn","rhino"),
      w("der","Delphin","dolphin (masc despite -in)"),
      w("die","Maus","mouse (fem despite tiny)"),
      w("die","Schlange","snake"),
      w("der","Hai","shark"),
    ],
  },
];

// Practice pool — flat list of words across all categories
export const PRACTICE_WORDS: Word[] = (() => {
  const seen = new Set<string>();
  const all: Word[] = [];
  const push = (x: Word) => {
    const k = x.article + ":" + x.word;
    if (seen.has(k)) return;
    seen.add(k);
    all.push(x);
  };
  RULES.forEach(r => {
    r.words.forEach(push);
    r.suffixes?.forEach(s => push(s.example));
  });
  SCENES.forEach(s => s.words.forEach(push));
  return all;
})();

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
