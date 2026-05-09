import type { Article, Word } from "./words";

export interface MemoryScene {
  id: string;
  tone: Article;
  title: string;
  image: string; // public path, e.g. /scenes/das-1-dach.png
  narrativeDe: string;
  narrativeEn: string;
  words: Word[];
  note?: string;
}

const w = (article: Article, word: string, english: string): Word => ({ article, word, english });

export const MEMORY_SCENES: MemoryScene[] = [
  // ---------- DAS ----------
  {
    id: "das-rooftop",
    tone: "das",
    title: "Auf dem Dach",
    image: "/scenes/das-1-dach.png",
    narrativeDe:
      "Ein Kind und ein Mädchen sitzen auf dem Dach. Wasser fließt aus dem Auge des Kindes. Das Kind hält ein Messer in der Hand. Blut tropft aus der Hand des Mädchens.",
    narrativeEn:
      "A child and a girl sit on the roof. Water flows from the child's eye. The child holds a knife in its hand. Blood drips from the girl's hand.",
    words: [
      w("das", "Dach", "roof"),
      w("das", "Kind", "child"),
      w("das", "Mädchen", "girl"),
      w("das", "Wasser", "water"),
      w("das", "Messer", "knife"),
      w("das", "Blut", "blood"),
    ],
  },
  {
    id: "das-ghost-horse",
    tone: "das",
    title: "Das Geisterpferd",
    image: "/scenes/das-2-pferd.png",
    narrativeDe:
      "Ein Gespenst reitet auf einem Pferd durch das Licht. Das Gesicht des Pferdes ist vor Angst erstarrt. Es trägt ein schweres Gewicht in einem Huf und schwingt ein Schwert im anderen. Ein Netz aus Spinnweben hängt darüber.",
    narrativeEn:
      "A ghost rides on a horse through the light. The face of the horse is frozen in fear. It carries a heavy weight in one hoof and swings a sword in the other. A net of cobwebs hangs over it.",
    words: [
      w("das", "Pferd", "horse"),
      w("das", "Gespenst", "ghost"),
      w("das", "Gesicht", "face"),
      w("das", "Licht", "light"),
      w("das", "Gewicht", "weight"),
      w("das", "Schwert", "sword"),
      w("das", "Netz", "net"),
    ],
  },
  {
    id: "das-farmyard",
    tone: "das",
    title: "Der Bauernhof",
    image: "/scenes/das-3-bauernhof.png",
    narrativeDe:
      "Alle jungen Tiere stehen zusammen auf der Wiese. Ein Schaf, ein Schwein, ein Huhn, ein Kalb, ein Küken und ein Reh schauen in den Himmel. Kein Tier weiß, welches Geschlecht es hat.",
    narrativeEn:
      "All the young animals stand together in the meadow. A sheep, a pig, a chicken, a calf, a chick and a deer look at the sky. No animal knows what gender it has.",
    words: [
      w("das", "Schaf", "sheep"),
      w("das", "Schwein", "pig"),
      w("das", "Huhn", "chicken"),
      w("das", "Kalb", "calf"),
      w("das", "Küken", "chick"),
      w("das", "Reh", "fawn"),
      w("das", "Tier", "animal"),
    ],
    note: "Junge Tiere → fast immer DAS",
  },
  {
    id: "das-midnight-kitchen",
    tone: "das",
    title: "Die Mitternachtsküche",
    image: "/scenes/das-4-kueche.png",
    narrativeDe:
      "Um Mitternacht bricht ein Feuer in der Küche aus. Ein Brot fliegt durch die Luft. Ein Ei explodiert. Fleisch brutzelt von allein. Salz regnet von der Decke und Öl fließt über den Boden.",
    narrativeEn:
      "At midnight a fire breaks out in the kitchen. A bread flies through the air. An egg explodes. Meat sizzles by itself. Salt rains from the ceiling and oil flows over the floor.",
    words: [
      w("das", "Brot", "bread"),
      w("das", "Ei", "egg"),
      w("das", "Fleisch", "meat"),
      w("das", "Salz", "salt"),
      w("das", "Öl", "oil"),
      w("das", "Feuer", "fire"),
    ],
  },
  {
    id: "das-poisoned-gift",
    tone: "das",
    title: "Das vergiftete Geschenk",
    image: "/scenes/das-5-geschenk.png",
    narrativeDe:
      "Ein schön verpacktes Geschenk liegt im Gerichtssaal. Darin ist Gift. Ein Richter liest das Gesetz. Ein Arzt verschreibt ein Medikament. Ein Zeuge unterschreibt ein Dokument. Alles sieht harmlos aus — nichts ist harmlos.",
    narrativeEn:
      "A beautifully wrapped gift lies in the courtroom. Inside is poison. A judge reads the law. A doctor prescribes a medicine. A witness signs a document. Everything looks harmless — nothing is harmless.",
    words: [
      w("das", "Geschenk", "gift"),
      w("das", "Gift", "poison"),
      w("das", "Recht", "law/right"),
      w("das", "Gesetz", "law"),
      w("das", "Medikament", "medicine"),
      w("das", "Dokument", "document"),
    ],
    note: "⚠️ das Gift = poison (nicht 'gift'!)",
  },

  // ---------- DER ----------
  {
    id: "der-jungle-dream",
    tone: "der",
    title: "Der Dschungeltraum",
    image: "/scenes/der-1-dschungel.png",
    narrativeDe:
      "Ein Riese stampft durch den Dschungel. Ein Löwe knabbert an einem großen Käse. Ein Affe schnappt sich einen Hasen und springt in die Bäume. Alle träumen — oder vielleicht SIND sie der Traum.",
    narrativeEn:
      "A giant stomps through the jungle. A lion nibbles on a big cheese. A monkey grabs a hare and jumps into the trees. Everyone dreams — or perhaps they ARE the dream.",
    words: [
      w("der", "Riese", "giant"),
      w("der", "Löwe", "lion"),
      w("der", "Käse", "cheese"),
      w("der", "Affe", "monkey"),
      w("der", "Hase", "hare"),
      w("der", "Traum", "dream"),
    ],
    note: "Alle enden auf -e, aber sind DER (schwache Maskulina)",
  },
  {
    id: "der-stormy-wanderer",
    tone: "der",
    title: "Der stürmische Wanderer",
    image: "/scenes/der-2-wanderer.png",
    narrativeDe:
      "Unter dem Mond geht ein Mann durch den Sturm. Er fühlt einen großen Schmerz. Er hört den lauten Lärm. Er hat Hunger und Durst. Aber er hat auch viel Mut und geht weiter.",
    narrativeEn:
      "Under the moon a man walks through the storm. He feels a great pain. He hears the loud noise. He has hunger and thirst. But he also has much courage and walks on.",
    words: [
      w("der", "Mond", "moon"),
      w("der", "Schmerz", "pain"),
      w("der", "Lärm", "noise"),
      w("der", "Hunger", "hunger"),
      w("der", "Durst", "thirst"),
      w("der", "Mut", "courage"),
    ],
  },
  {
    id: "der-strange-cafe",
    tone: "der",
    title: "Das seltsame Café",
    image: "/scenes/der-3-cafe.png",
    narrativeDe:
      "In einem seltsamen Café sitzt ein Stein auf einem Stuhl. Ein Schlüssel hängt an der Wand. Ein Preis steht an der Tafel. Ein Beutel mit Geld liegt auf dem Boden. Der Kellner ist ein riesiger Löffel. Niemand findet das seltsam.",
    narrativeEn:
      "In a strange café a stone sits on a chair. A key hangs on the wall. A price stands on the board. A bag of money lies on the floor. The waiter is a giant spoon. Nobody finds this strange.",
    words: [
      w("der", "Stein", "stone"),
      w("der", "Stuhl", "chair"),
      w("der", "Schlüssel", "key"),
      w("der", "Preis", "price"),
      w("der", "Beutel", "bag"),
      w("der", "Löffel", "spoon"),
    ],
  },
  {
    id: "der-angry-weather",
    tone: "der",
    title: "Das wütende Wetter",
    image: "/scenes/der-4-wetter.png",
    narrativeDe:
      "Der Regen prasselt nieder. Der Wind heult durch die Bäume. Der Donner erschüttert den Boden. Der Blitz schlägt in den See. Der Hagel fällt auf die Dächer. Der Nebel zieht über die Felder.",
    narrativeEn:
      "The rain pours down. The wind howls through the trees. The thunder shakes the ground. The lightning strikes the lake. The hail falls on the roofs. The fog drifts over the fields.",
    words: [
      w("der", "Regen", "rain"),
      w("der", "Wind", "wind"),
      w("der", "Donner", "thunder"),
      w("der", "Blitz", "lightning"),
      w("der", "Hagel", "hail"),
      w("der", "Nebel", "fog"),
      w("der", "Sturm", "storm"),
    ],
    note: "Wetterkräfte → fast immer DER",
  },

  // ---------- DIE ----------
  {
    id: "die-invisible-powers",
    tone: "die",
    title: "Die unsichtbaren Mächte",
    image: "/scenes/die-1-maechte.png",
    narrativeDe:
      "In der Nacht füllen unsichtbare Mächte die Luft. Die Zeit zieht in eine Richtung. Die Kraft zieht in eine andere. Die Welt dreht sich. Die Schuld flüstert leise. Alle sind weiblich, alle sind unsichtbar.",
    narrativeEn:
      "In the night invisible powers fill the air. Time pulls in one direction. Strength pulls in another. The world turns. Guilt whispers softly. All are feminine, all are invisible.",
    words: [
      w("die", "Nacht", "night"),
      w("die", "Luft", "air"),
      w("die", "Zeit", "time"),
      w("die", "Kraft", "strength"),
      w("die", "Welt", "world"),
      w("die", "Schuld", "guilt"),
      w("die", "Macht", "power"),
    ],
  },
  {
    id: "die-kitchen-rebellion",
    tone: "die",
    title: "Die Küchenrebellion",
    image: "/scenes/die-2-kueche.png",
    narrativeDe:
      "Eine Mutter, ihre Tochter und ihre Schwester machen eine Rebellion in der Küche. Sie gießen Milch auf den Boden und werfen Butter an die Decke. Alle enden auf -er, aber alle sind DIE.",
    narrativeEn:
      "A mother, her daughter and her sister make a rebellion in the kitchen. They pour milk on the floor and throw butter at the ceiling. All end in -er, but all are DIE.",
    words: [
      w("die", "Mutter", "mother"),
      w("die", "Tochter", "daughter"),
      w("die", "Schwester", "sister"),
      w("die", "Milch", "milk"),
      w("die", "Butter", "butter"),
    ],
    note: "Diese -er Wörter brechen die DER-Regel",
  },
  {
    id: "die-body-alarm",
    tone: "die",
    title: "Der Körperalarm",
    image: "/scenes/die-3-koerper.png",
    narrativeDe:
      "Eine Hand schlägt gegen eine Wand. Eine Nase riecht etwas Schlimmes. Eine Zunge schmeckt Gefahr. Eine Schulter spannt sich an. Eine Rippe schmerzt. Der ganze Körper schlägt Alarm.",
    narrativeEn:
      "A hand strikes against a wall. A nose smells something bad. A tongue tastes danger. A shoulder tenses. A rib hurts. The whole body sounds the alarm.",
    words: [
      w("die", "Hand", "hand"),
      w("die", "Wand", "wall"),
      w("die", "Nase", "nose"),
      w("die", "Zunge", "tongue"),
      w("die", "Schulter", "shoulder"),
      w("die", "Rippe", "rib"),
      w("die", "Stirn", "forehead"),
    ],
  },
  {
    id: "die-clockwork-city",
    tone: "die",
    title: "Die Uhrwerkstadt",
    image: "/scenes/die-4-uhrenstadt.png",
    narrativeDe:
      "In einer Stadt aus Uhren ist jede Tür ein Zifferblatt. Jede Scheibe tickt. Die Treppe geht nach oben. Eine Zahl blinkt an jeder Wand. Die ganze Stadt läuft nach der Uhr.",
    narrativeEn:
      "In a city of clocks every door is a clock face. Every windowpane ticks. The staircase goes upward. A number blinks on every wall. The whole city runs by the clock.",
    words: [
      w("die", "Uhr", "clock"),
      w("die", "Tür", "door"),
      w("die", "Scheibe", "pane/disc"),
      w("die", "Treppe", "stairs"),
      w("die", "Zahl", "number"),
      w("die", "Stadt", "city"),
      w("die", "Wahl", "choice/election"),
    ],
  },
];
