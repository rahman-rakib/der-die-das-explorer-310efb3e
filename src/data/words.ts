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
      {
        suffix: "-er", example: w("der","Lehrer","teacher"),
        examples: [w("der","Lehrer","teacher"), w("der","Vater","father"), w("der","Bruder","brother"), w("der","Fahrer","driver"), w("der","Schüler","pupil")],
        exceptions: {
          mnemonic: "Mother, daughter, sister, butter, ladder — the women of the -er family are all DIE. And rooms and things around the house are DAS.",
          illustration: ["👩","👩‍👧","🧈","🪜","🪟"],
          words: [
            w("die","Mutter","mother"), w("die","Tochter","daughter"), w("die","Schwester","sister"),
            w("die","Butter","butter"), w("die","Leiter","ladder"), w("die","Schulter","shoulder"),
            w("die","Feder","feather/pen"), w("die","Steuer","tax/steering wheel"), w("die","Wimper","eyelash"), w("die","Nummer","number"),
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
      {
        suffix: "-en (real nouns)", example: w("das","Essen","eating/food"),
        examples: [w("das","Essen","food"), w("das","Leben","life"), w("das","Schreiben","writing"), w("das","Lachen","laughter"), w("das","Laufen","running")],
        exceptions: {
          mnemonic: "Rain (Regen), car (Wagen), harbour (Hafen), garden (Garten), oven (Ofen) — the men of the house are all DER.",
          illustration: ["🌧️","🚗","⚓","🌿","🔥"],
          words: [
            w("der","Regen","rain"), w("der","Wagen","car/cart"), w("der","Hafen","harbour"), w("der","Boden","floor/ground"),
            w("der","Ofen","oven"), w("der","Garten","garden"), w("der","Faden","thread"), w("der","Laden","shop"),
            w("der","Samen","seed"), w("der","Kuchen","cake"), w("der","Haken","hook"),
          ],
          note: "If it's a real noun (not a verb turned into a noun) ending in -en → very likely DER.",
          noteTone: "der",
        },
      },
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

export interface MemoryScene {
  id: string;
  tone: Article;
  title: string;
  illustration: string[];
  description: string; // German nouns wrapped as **Wort**
  words: Word[];
  note?: string;
}

export const MEMORY_SCENES: MemoryScene[] = [
  // ---- DAS ----
  {
    id: "das-rooftop", tone: "das", title: "The Rooftop",
    illustration: ["🏠","🧒","👧","🔪","💧","🩸"],
    description: "A **Kind** and a small **Mädchen** sit on a **Dach**. **Wasser** streams from the child's eye. The child clutches a **Messer** and **Blut** drips from the girl's hand.",
    words: [w("das","Dach","roof"), w("das","Kind","child"), w("das","Mädchen","girl"), w("das","Wasser","water"), w("das","Messer","knife"), w("das","Blut","blood")],
  },
  {
    id: "das-ghost-horse", tone: "das", title: "The Ghost Horse",
    illustration: ["🐴","👻","😱","⚖️","💡","🗡️","🕸️"],
    description: "A **Gespenst** rides a **Pferd** through the **Licht**. The horse's **Gesicht** is frozen in terror. It carries a heavy **Gewicht** in one hoof and swings a **Schwert** in the other, tangled in a **Netz** of cobwebs.",
    words: [w("das","Pferd","horse"), w("das","Gespenst","ghost"), w("das","Gesicht","face"), w("das","Licht","light"), w("das","Gewicht","weight"), w("das","Schwert","sword"), w("das","Netz","net")],
  },
  {
    id: "das-farmyard", tone: "das", title: "The Farmyard",
    illustration: ["🐑","🐖","🐔","🐄","🐣","🦌"],
    description: "All the young animals gathered in one field — a **Schaf**, a **Schwein**, a **Huhn**, a **Kalb**, a **Küken** and a **Reh** — all staring blankly at the sky. None of them knows what gender they are.",
    words: [w("das","Schaf","sheep"), w("das","Schwein","pig"), w("das","Huhn","chicken"), w("das","Kalb","calf"), w("das","Küken","chick"), w("das","Reh","fawn"), w("das","Tier","animal")],
    note: "Young animals and animals in general → strongly tend to DAS",
  },
  {
    id: "das-midnight-kitchen", tone: "das", title: "The Midnight Kitchen",
    illustration: ["🍞","🥚","🥩","🧂","🛢️","🔥"],
    description: "At midnight, a **Feuer** erupts in the kitchen. **Brot** flies off the shelf, an **Ei** explodes, **Fleisch** sizzles on its own, **Salz** rains from the ceiling and **Öl** pours across the floor.",
    words: [w("das","Brot","bread"), w("das","Ei","egg"), w("das","Fleisch","meat"), w("das","Salz","salt"), w("das","Öl","oil"), w("das","Feuer","fire")],
  },
  {
    id: "das-poisoned-gift", tone: "das", title: "The Poisoned Gift",
    illustration: ["🎁","☠️","⚖️","📜","💊","🏛️"],
    description: "A beautifully wrapped **Geschenk** sits in a courtroom. Inside is **Gift**. A judge reads the **Recht**, a doctor prescribes **Medikament** and a witness signs a **Dokument**. Everything looks innocent — nothing is.",
    words: [w("das","Geschenk","gift"), w("das","Gift","poison"), w("das","Recht","law/right"), w("das","Medikament","medicine"), w("das","Dokument","document"), w("das","Gesetz","law")],
    note: "⚠️ das Gift = poison (not 'gift'!) — the most dangerous false friend in German",
  },

  // ---- DER ----
  {
    id: "der-jungle-dream", tone: "der", title: "The Jungle Dream",
    illustration: ["🦁","🧀","🐒","🐰","🧟‍♂️","🌿"],
    description: "A **Riese** stomps through the jungle. A **Löwe** gnaws on a wheel of **Käse**. An **Affe** snatches a **Hase** and runs into the trees. Everyone is dreaming — or perhaps they ARE the **Traum**.",
    words: [w("der","Riese","giant"), w("der","Löwe","lion"), w("der","Käse","cheese"), w("der","Affe","monkey"), w("der","Hase","hare"), w("der","Traum","dream")],
    note: "All end in -e but are DER — the classic weak masculine noun trap",
  },
  {
    id: "der-stormy-wanderer", tone: "der", title: "The Stormy Wanderer",
    illustration: ["🌕","😣","📢","🍽️","💧","😤"],
    description: "Under a full **Mond**, a man writhes in **Schmerz**. He hears deafening **Lärm** from the storm. He is desperately starving with **Hunger** and **Durst**. Yet somehow he marches on with **Mut**.",
    words: [w("der","Mond","moon"), w("der","Schmerz","pain"), w("der","Lärm","noise"), w("der","Hunger","hunger"), w("der","Durst","thirst"), w("der","Mut","courage")],
    note: "Abstract feelings of suffering → often DER",
  },
  {
    id: "der-strange-cafe", tone: "der", title: "The Strange Café",
    illustration: ["☕","🧱","🔑","💰","🚪","🪑"],
    description: "In a strange café, a **Stein** sits in a chair. A **Schlüssel** hangs on the wall. A **Preis** is written on a chalkboard and a **Beutel** of money rests on the floor. The waiter is a giant **Löffel**. No one finds this odd.",
    words: [w("der","Stein","stone"), w("der","Schlüssel","key"), w("der","Preis","price"), w("der","Beutel","bag"), w("der","Löffel","spoon"), w("der","Stuhl","chair")],
  },
  {
    id: "der-angry-weather", tone: "der", title: "The Angry Weather",
    illustration: ["🌧️","🌬️","⛈️","⚡","🌪️","🌊"],
    description: "**Regen** lashes down. **Wind** howls. **Donner** shakes the ground. **Blitz** strikes a **Tümpel**. A massive **Hagel** storm begins. **Nebel** rolls in and the **Sturm** rages — all of it is DER.",
    words: [w("der","Regen","rain"), w("der","Wind","wind"), w("der","Donner","thunder"), w("der","Blitz","lightning"), w("der","Hagel","hail"), w("der","Nebel","fog"), w("der","Sturm","storm")],
    note: "Weather forces → almost always DER",
  },

  // ---- DIE ----
  {
    id: "die-invisible-powers", tone: "die", title: "The Invisible Powers",
    illustration: ["⏳","💪","🌬️","🌍","🌑","😰"],
    description: "At **Nacht**, invisible forces fill the **Luft**. **Zeit** pulls in one direction. **Kraft** pulls in another. The **Welt** spins. **Schuld** whispers. **Pflicht** calls. All are female, all are unseen.",
    words: [w("die","Zeit","time"), w("die","Kraft","strength"), w("die","Luft","air"), w("die","Welt","world"), w("die","Nacht","night"), w("die","Schuld","guilt"), w("die","Pflicht","duty")],
    note: "Abstract forces of the universe → strongly DIE",
  },
  {
    id: "die-kitchen-rebellion", tone: "die", title: "The Kitchen Rebellion",
    illustration: ["🧈","🥛","👩","👩‍👧","👩‍👩‍👧"],
    description: "A **Mutter**, her **Tochter** and **Schwester** stage a kitchen rebellion. They pour **Milch** on the floor and throw **Butter** at the ceiling. All end in -er — but all are DIE.",
    words: [w("die","Mutter","mother"), w("die","Tochter","daughter"), w("die","Schwester","sister"), w("die","Milch","milk"), w("die","Butter","butter")],
    note: "These -er words break the DER rule — learn them as a family",
  },
  {
    id: "die-body-alarm", tone: "die", title: "The Body Alarm",
    illustration: ["🤚","👃","👅","💪","🦴","🫀"],
    description: "A **Hand** slaps a **Wand**. A **Nase** smells something wrong. A **Zunge** tastes danger. A **Schulter** tenses. A **Rippe** aches. Even the **Stirn** sweats — the whole body is screaming.",
    words: [w("die","Hand","hand"), w("die","Wand","wall"), w("die","Nase","nose"), w("die","Zunge","tongue"), w("die","Schulter","shoulder"), w("die","Rippe","rib"), w("die","Stirn","forehead")],
  },
  {
    id: "die-clockwork-city", tone: "die", title: "The Clockwork City",
    illustration: ["🕰️","🚪","🪟","🛗","🌆","🔢"],
    description: "In a **Stadt** built from clocks, every **Tür** is a clock face. Every **Scheibe** ticks. The **Treppe** goes up, a **Zahl** flashes on every wall, and the **Wahl** of where to go is endless — all running on the great **Uhr**.",
    words: [w("die","Uhr","clock"), w("die","Tür","door"), w("die","Zahl","number"), w("die","Wahl","choice/election"), w("die","Scheibe","pane/disc"), w("die","Treppe","stairs"), w("die","Stadt","city")],
  },
];

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
    r.suffixes?.forEach(s => {
      push(s.example);
      s.examples?.forEach(push);
      s.exceptions?.words?.forEach(push);
    });
  });
  SCENES.forEach(s => s.words.forEach(push));
  MEMORY_SCENES.forEach(s => s.words.forEach(push));
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
