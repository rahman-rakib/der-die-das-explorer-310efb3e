import type { Article, Word } from "./words";

export interface MemoryScene {
  id: string;
  tone: Article;
  title: string;
  image: string; // public path, e.g. /scenes/das-1-dach.webp
  narrativeDe: string;
  narrativeEn: string;
  words: Word[];
  note?: string;
}

const w = (article: Article, word: string, english: string): Word => ({ article, word, english });

export const MEMORY_SCENES: MemoryScene[] = [
  {
    id: "das-rooftop",
    tone: "das",
    title: "Frühstück auf dem Dach",
    image: "/scenes/das-1-dach.webp",
    narrativeDe:
      "Ein Kind und ein Mädchen frühstücken auf dem Dach. Ein umgekipptes Glas liegt da, und Wasser ist daraus über das Dach verschüttet. Vor ihnen liegen ein Messer, ein frisches Brot, ein Ei, rohes Fleisch mit etwas Blut, Salz und Öl. Das lange Haar des Mädchens verdeckt ihr Gesicht. Das Kind hat große Augen und große Ohren.",
    narrativeEn:
      "A child and a girl have breakfast on the roof. A tipped-over glass lies there, and water has spilled from it across the roof. In front of them lie a knife, a fresh loaf of bread, an egg, raw meat with a little blood, salt and oil. The girl's long hair hides her face. The child has big eyes and big ears.",
    words: [
      w("das", "Dach", "roof"),
      w("das", "Kind", "child"),
      w("das", "Mädchen", "girl"),
      w("das", "Glas", "glass"),
      w("das", "Wasser", "water"),
      w("das", "Messer", "knife"),
      w("das", "Brot", "bread"),
      w("das", "Ei", "egg"),
      w("das", "Fleisch", "meat"),
      w("das", "Blut", "blood"),
      w("das", "Salz", "salt"),
      w("das", "Öl", "oil"),
      w("das", "Haar", "hair"),
      w("das", "Gesicht", "face"),
      w("das", "Auge", "eye"),
      w("das", "Ohr", "ear"),
    ],
  },
  {
    id: "das-ghost-horse",
    tone: "das",
    title: "Das Geisterpferd",
    image: "/scenes/das-2-pferd.webp",
    narrativeDe:
      "Ein Gespenst reitet auf einem Pferd durch das Licht. Das Gesicht des Pferdes ist erstarrt. Es trägt ein schweres Gewicht und schwingt ein Schwert. Ein Netz aus Spinnweben hängt darüber.",
    narrativeEn:
      "A ghost rides on a horse through the light. The face of the horse is frozen. It carries a heavy weight and swings a sword. A net of cobwebs hangs over it.",
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
    image: "/scenes/das-3-bauernhof.webp",
    narrativeDe:
      "Alle jungen Tiere stehen zusammen auf dem Feld. Ein Schaf, ein Schwein, ein Huhn, ein Kalb, ein Küken und ein Reh schauen nach oben. Kein Tier weiß, welches Geschlecht es hat.",
    narrativeEn:
      "All the young animals stand together in the field. A sheep, a pig, a chicken, a calf, a chick and a deer look upward. No animal knows what gender it has.",
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
    id: "das-poisoned-gift",
    tone: "das",
    title: "Das überraschende Geschenk",
    image: "/scenes/das-5-geschenk.webp",
    narrativeDe:
      "Ein Kind packt ein schön verpacktes Geschenk aus. Heraus kommt ein grünes, blubberndes Glas Gift — im Deutschen ist ein 'Gift' eben kein Geschenk! Daneben liegen ein Gesetz, ein Medikament und ein Dokument.",
    narrativeEn:
      "A child happily unwraps a beautifully wrapped present. Out of the box comes a green, bubbling glass jar. Beside it lie a law book, a medicine and a document on a table.",
    words: [
      w("das", "Geschenk", "gift"),
      w("das", "Gift", "poison"),
      w("das", "Recht", "law/right"),
      w("das", "Gesetz", "law"),
      w("das", "Medikament", "medicine"),
      w("das", "Dokument", "document"),
      w("das", "Kind", "child"),
    ],
    note: "⚠️ das Gift = poison (nicht 'gift'!)",
  },
  {
    id: "der-stormy-wanderer",
    tone: "der",
    title: "Der stürmische Wanderer",
    image: "/scenes/der-2-wanderer.webp",
    narrativeDe:
      "Unter dem Mond geht ein Mann durch den Sturm. Er fühlt einen großen Schmerz. Er hört den lauten Lärm. Er hat Hunger und Durst. Aber er hat auch viel Mut und geht weiter — als wäre alles nur ein Traum.",
    narrativeEn:
      "Under the moon a man walks through the storm. He feels a great pain. He hears the loud noise. He has hunger and thirst. But he also has much courage and walks on — as if it were all only a dream.",
    words: [
      w("der", "Mond", "moon"),
      w("der", "Schmerz", "pain"),
      w("der", "Lärm", "noise"),
      w("der", "Hunger", "hunger"),
      w("der", "Durst", "thirst"),
      w("der", "Mut", "courage"),
      w("der", "Traum", "dream"),
    ],
  },
  {
    id: "der-strange-cafe",
    tone: "der",
    title: "Das seltsame Café",
    image: "/scenes/der-3-cafe.webp",
    narrativeDe:
      "An einem seltsamen Ort sitzt ein Stein auf einem Stuhl. Ein Schlüssel hängt an einem Haken. Ein Preis steht auf einem Zettel. Ein Beutel voller Taler liegt auf dem Boden. Der Kellner ist ein riesiger Löffel. Niemand findet das seltsam.",
    narrativeEn:
      "In a strange place a stone sits on a chair. A key hangs on a hook. A price stands on a slip of paper. A bag full of coins lies on the floor. The waiter is a giant spoon. Nobody finds this strange.",
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
    id: "die-invisible-powers",
    tone: "die",
    title: "Die unsichtbaren Mächte",
    image: "/scenes/die-1-maechte.webp",
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
    title: "Die Küchenleiter",
    image: "/scenes/die-2-kueche.webp",
    narrativeDe:
      "In der Küche reicht eine Leiter von der Decke bis zur Wand. Daneben stehen Butter, Schüsseln und Flaschen voller Milch. Die Mutter, die Tochter und die Schwester schauen sie an.",
    narrativeEn:
      "In the kitchen a ladder reaches from the ceiling to the wall. Beside it stand packets of butter, bowls and bottles full of milk. The mother, the daughter and the sister look at them.",
    words: [
      w("die", "Mutter", "mother"),
      w("die", "Tochter", "daughter"),
      w("die", "Schwester", "sister"),
      w("die", "Butter", "butter"),
      w("die", "Milch", "milk"),
      w("die", "Leiter", "ladder"),
      w("die", "Flasche", "bottle"),
      w("die", "Schüssel", "bowl"),
      w("die", "Küche", "kitchen"),
      w("die", "Wand", "wall"),
      w("die", "Decke", "ceiling"),
    ],
    note: "Mutter, Tochter, Schwester, Butter und Leiter enden auf -er — aber alle sind DIE",
  },
  {
    id: "die-body-alarm",
    tone: "die",
    title: "Die Falten der Frau",
    image: "/scenes/die-3-koerper.webp",
    narrativeDe:
      "Eine Frau legt eine Hand auf die Schulter und die andere Hand auf die Brust. Auf der Haut ihrer Stirn und ihrer Wange liegen viele Falten.",
    narrativeEn:
      "A woman lays one hand on her shoulder and her other hand on her chest. On the skin of her forehead and her cheek lie many wrinkles.",
    words: [
      w("die", "Hand", "hand"),
      w("die", "Brust", "chest"),
      w("die", "Stirn", "forehead"),
      w("die", "Haut", "skin"),
      w("die", "Schulter", "shoulder"),
      w("die", "Falte", "wrinkle"),
      w("die", "Wange", "cheek"),
      w("die", "Frau", "woman"),
    ],
    note: "Harte Fälle: DIE ohne -e-Endung (Hand, Brust, Stirn, Haut) — die -e-Körperteile wie Nase/Lippe sind einfach",
  },
  {
    id: "die-clockwork-city",
    tone: "die",
    title: "Die Uhrwerkstadt",
    image: "/scenes/die-4-uhrenstadt.webp",
    narrativeDe:
      "In einer Stadt aus Uhren ist jede Tür eine große Uhr. Jede Scheibe tickt. Die Treppe geht nach oben. Eine Zahl blinkt an jeder Wand. Die ganze Stadt läuft nach der Uhr.",
    narrativeEn:
      "In a city of clocks every door is a big clock. Every pane ticks. The staircase goes upward. A number blinks on every wall. The whole city runs by the clock.",
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
  {
    id: "das-coffee-shop",
    tone: "das",
    title: "Das gemütliche Café",
    image: "/scenes/das-6-coffeeshop.webp",
    narrativeDe:
      "In einem gemütlichen Café sitzt ein Kind. Ein warmes Feuer brennt und macht alles gemütlich. Das Radio spielt leise, während jemand aus dem Büro auf einem weichen Sofa einschläft. Durch das Fenster sieht man das Kino und ein ruhiges Hotel. Das Restaurant nebenan duftet warm.",
    narrativeEn:
      "In a cosy café a child sits. A warm fire burns in the fireplace and makes everything snug. The radio plays softly while someone from the office falls asleep on a soft sofa. Through the window you see the cinema and a quiet hotel. The restaurant next door smells warm.",
    words: [
      w("das", "Kind", "child"),
      w("das", "Café", "café"),
      w("das", "Feuer", "fire"),
      w("das", "Restaurant", "restaurant"),
      w("das", "Hotel", "hotel"),
      w("das", "Büro", "office"),
      w("das", "Radio", "radio"),
      w("das", "Kino", "cinema"),
      w("das", "Sofa", "sofa"),
    ],
    note: "Lehnwörter auf -o, -é, -eau → meist DAS",
  },
  {
    id: "das-fortune",
    tone: "das",
    title: "Das große Los",
    image: "/scenes/das-7-glueck.webp",
    narrativeDe:
      "Ein Kind sitzt beim Spiel. Über ihm schwebt das Glück wie ein leuchtendes Kleeblatt, daneben lauert das Pech. Vor ihm stapelt sich das Geld. Das Kind zieht das große Los — und dann geschieht ein kleines Wunder.",
    narrativeEn:
      "A child sits at play. Above it luck floats like a glowing four-leaf clover, beside it bad luck lurks. In front of it the money piles up. The child draws the winning ticket — and then a small miracle happens.",
    words: [
      w("das", "Kind", "child"),
      w("das", "Glück", "luck/happiness"),
      w("das", "Pech", "bad luck"),
      w("das", "Geld", "money"),
      w("das", "Los", "lot (lottery ticket)"),
      w("das", "Wunder", "miracle"),
    ],
    note: "Wörter rund um Glück und Spiel sind oft DAS",
  },
  {
    id: "der-landscape",
    tone: "der",
    title: "Die Bergwanderung",
    image: "/scenes/der-5-landschaft.webp",
    narrativeDe:
      "Ein Mann wandert den schmalen Weg den Hügel hinauf. Links rauscht ein Bach, rechts beginnt der dunkle Wald. Weit hinten ragt der Berg steil empor, und unten glänzt der Fluss.",
    narrativeEn:
      "A man hikes up the narrow path to the hill. On the left a stream rushes, on the right the dark forest begins. Far behind, the mountain rises steeply, and below the river glistens.",
    words: [
      w("der", "Mann", "man"),
      w("der", "Weg", "path/way"),
      w("der", "Hügel", "hill"),
      w("der", "Bach", "stream"),
      w("der", "Wald", "forest"),
      w("der", "Berg", "mountain"),
      w("der", "Fluss", "river"),
    ],
    note: "Landschaftsformen — Weg, Berg, Wald, Fluss → meist DER",
  },
  {
    id: "das-seaside",
    tone: "das",
    title: "Das Fischerdorf am Meer",
    image: "/scenes/das-8-dorf.webp",
    narrativeDe:
      "Am Ufer liegt ein kleines Dorf mit einem weißen Haus. Hoch oben thront ein altes Schloss. Unten am Wasser schaukelt ein hölzernes Boot, während ein großes Schiff aufs Meer hinausfährt.",
    narrativeEn:
      "On the shore lies a small village with a white house. High above sits an old castle. Down by the water a wooden boat rocks while a big ship sails out to sea.",
    words: [
      w("das", "Haus", "house"),
      w("das", "Dorf", "village"),
      w("das", "Schloss", "castle"),
      w("das", "Boot", "boat"),
      w("das", "Schiff", "ship"),
      w("das", "Meer", "sea"),
    ],
    note: "das Meer endet auf -er, ist aber DAS (kein Täter-Wort)",
  },
  {
    id: "die-italian-villa",
    tone: "die",
    title: "Omas italienische Villa",
    image: "/scenes/die-5-villa.webp",
    narrativeDe:
      "Die Oma führt ihre Firma von einer alten Villa in einer sonnigen Stadt. Dann backt die Mama dort eine riesige Pizza, und eine Kamera filmt alles. Alles hier endet auf -a — und alles ist die.",
    narrativeEn:
      "Grandma runs her company from an old villa in a sunny town. Then mum bakes a huge pizza there, and a camera films everything. Everything here ends in -a — and all of it is die.",
    words: [
      w("die", "Oma", "grandma"),
      w("die", "Mama", "mum"),
      w("die", "Villa", "villa"),
      w("die", "Firma", "company"),
      w("die", "Pizza", "pizza"),
      w("die", "Kamera", "camera"),
    ],
    note: "Wörter auf -a sind meist DIE (Achtung: -ma sieht nach DAS aus, z.B. das Thema)",
  },
  {
    id: "das-collectives",
    tone: "das",
    title: "Das Gemälde im Gebäude",
    image: "/scenes/das-9-gebaeude.webp",
    narrativeDe:
      "Ein Kind steht allein in einem riesigen Gebäude. Oben hängt ein großes Gemälde von frischem Gemüse und goldenem Getreide. Draußen erstreckt sich das weite Gelände. Alles endet auf -e und sieht nach die aus — doch alles ist das.",
    narrativeEn:
      "A child stands alone in a huge building. Above hangs a large painting of fresh vegetables and golden grain. Outside stretches the wide grounds. Everything ends in -e and looks like die — but all of it is das.",
    words: [
      w("das", "Kind", "child"),
      w("das", "Gebäude", "building"),
      w("das", "Gemälde", "painting"),
      w("das", "Gemüse", "vegetables"),
      w("das", "Getreide", "grain"),
      w("das", "Gelände", "grounds/terrain"),
    ],
    note: "ge-…-e Sammelwörter enden auf -e, sind aber DAS (Gebäude, Gemälde, Gemüse)",
  },
  {
    id: "der-forest-rescue",
    tone: "der",
    title: "Die Rettung im Wald",
    image: "/scenes/der-7-tiere.webp",
    narrativeDe:
      "Ein Löwe packt den Riesen am Fuß. Ein Elefant schlingt seinen Rüssel um ihn. Gemeinsam wollen sie den Affen, den Hasen, den Papagei, den Raben und den Spatz retten, die der Riese aus dem Wald forträgt. Der Rabe klemmt dabei den Käse in seinem Schnabel. Doch die Gefangenen sitzen in den Armen des Riesen. Der Bart des Riesen ist zu einem Zopf geflochten, und ein Nagel hält den Zopf zusammen. Am Gürtel hängen viele Schlüssel. Hoch am Himmel leuchtet der Mond.",
    narrativeEn:
      "A lion clamps onto the giant's foot. An elephant wraps its trunk around him. Together they try to save the monkey, the hare, the parrot, the raven and the sparrow, which the giant is carrying off from the forest. The raven clamps a piece of cheese in its beak. But the little animals sit in the giant's arms. The giant's beard is braided into a plait, and a nail holds the braid together like a hairpin. From his belt hang many keys. High in the sky the moon glows.",
    words: [
      w("der", "Löwe", "lion"),
      w("der", "Elefant", "elephant"),
      w("der", "Rüssel", "trunk"),
      w("der", "Affe", "monkey"),
      w("der", "Hase", "hare/rabbit"),
      w("der", "Papagei", "parrot"),
      w("der", "Rabe", "raven"),
      w("der", "Spatz", "sparrow"),
      w("der", "Riese", "giant"),
      w("der", "Käse", "cheese"),
      w("der", "Nagel", "nail"),
      w("der", "Schlüssel", "key"),
      w("der", "Gürtel", "belt"),
      w("der", "Bart", "beard"),
      w("der", "Zopf", "braid"),
    ],
    note: "Diese Wörter sind DER — auf -e (Löwe, Affe, Rabe, Riese, Käse), -ei (Papagei) und -el (Nagel, Schlüssel)",
  },
  {
    id: "die-animal-tower",
    tone: "die",
    title: "An der Ampel",
    image: "/scenes/die-6-ampel.webp",
    narrativeDe:
      "An der Ampel wartet eine Kuh. Eine Gans sitzt auf der Kuh, und eine Maus sitzt auf der Gans. Hoch oben fliegt eine Amsel mit einer Gabel. Neben der Kuh liegt eine Kugel, gespickt mit vielen Nadeln, und die Sonne scheint.",
    narrativeEn:
      "At the traffic light a cow waits. A goose sits on the cow, and a mouse sits on the goose. High above a blackbird flies with a fork. Beside the cow lies a ball studded with many needles, and the sun shines.",
    words: [
      w("die", "Ampel", "traffic light"),
      w("die", "Kuh", "cow"),
      w("die", "Gans", "goose"),
      w("die", "Maus", "mouse"),
      w("die", "Amsel", "blackbird"),
      w("die", "Gabel", "fork"),
      w("die", "Kugel", "ball/sphere"),
      w("die", "Nadel", "needle"),
    ],
    note: "Diese Tiere sind DIE — und Gabel, Kugel, Nadel zeigen: nicht jedes -el ist DER (vgl. der Nagel!)",
  },
  {
    id: "das-bodyparts",
    tone: "das",
    title: "Das tapfere Herz",
    image: "/scenes/das-10-koerper.webp",
    narrativeDe:
      "Ein Kind rennt zum Ziel. Da gibt das Bein nach, und das Knie knickt ein. Doch das Herz hämmert wild weiter, und das Gehirn glüht. Nass und zitternd reckt das Kind das Kinn nach vorn — und gewinnt.",
    narrativeEn:
      "A child sprints toward the finish line. Suddenly the leg gives way and the knee buckles. But the heart hammers on wildly and the brain glows. Wet and trembling, the child thrusts its chin forward — and wins.",
    words: [
      w("das", "Herz", "heart"),
      w("das", "Gehirn", "brain"),
      w("das", "Bein", "leg"),
      w("das", "Knie", "knee"),
      w("das", "Kinn", "chin"),
    ],
    note: "Körperteile haben keine Regel — diese sind DAS",
  },
  {
    id: "der-bodyparts",
    tone: "der",
    title: "Der Körper von oben",
    image: "/scenes/der-6-koerper.webp",
    narrativeDe:
      "Oben sitzt der Kopf. Darunter der Hals, dann der breite Rücken. Der Bauch wölbt sich vor, der Arm hängt herab, und der Finger zeigt nach vorn.",
    narrativeEn:
      "At the top sits the head. Below it the neck, then the broad back. The belly bulges out, the arm hangs down, and the finger points forward.",
    words: [
      w("der", "Kopf", "head"),
      w("der", "Hals", "neck"),
      w("der", "Rücken", "back"),
      w("der", "Bauch", "belly"),
      w("der", "Arm", "arm"),
      w("der", "Finger", "finger"),
    ],
    note: "Körperteile haben keine Regel — diese sind DER",
  },
  {
    id: "das-zoo",
    tone: "das",
    title: "Die Tiere im Gehege",
    image: "/scenes/das-11-zoo.webp",
    narrativeDe:
      "Im Gehege steht das Pferd neben dem Kamel. Ein Lama spuckt. Ein Zebra trabt vorbei, ein Pony wiehert. Hinter dem Gitter liegt das Krokodil und reißt sein Maul weit auf. Das Nashorn senkt sein Horn.",
    narrativeEn:
      "In the enclosure the horse stands next to the camel. A llama spits. A zebra trots past, a pony neighs. Behind the bars lies the crocodile, opening its jaws wide. The rhino lowers its horn.",
    words: [
      w("das", "Pferd", "horse"),
      w("das", "Kamel", "camel"),
      w("das", "Lama", "llama"),
      w("das", "Zebra", "zebra"),
      w("das", "Pony", "pony"),
      w("das", "Krokodil", "crocodile"),
      w("das", "Nashorn", "rhino"),
      w("das", "Maul", "jaws/mouth"),
    ],
    note: "Viele exotische Tiere sind DAS",
  },
  {
    id: "der-exotic-zoo",
    tone: "der",
    title: "Der Zoo der Exoten",
    image: "/scenes/der-8-exoten.webp",
    narrativeDe:
      "Im Zoo brüllt der Tiger. Ein Gorilla trommelt, ein Leopard schleicht. Am Teich watet der Flamingo neben dem Pinguin. Der Pfau stolziert, der Strauß rennt davon, und im Teich springt der Delfin.",
    narrativeEn:
      "In the zoo the tiger roars. A gorilla drums, a leopard prowls. At the pond the flamingo wades next to the penguin. The peacock struts, the ostrich runs off, and in the pond the dolphin leaps.",
    words: [
      w("der", "Tiger", "tiger"),
      w("der", "Gorilla", "gorilla"),
      w("der", "Leopard", "leopard"),
      w("der", "Flamingo", "flamingo"),
      w("der", "Pinguin", "penguin"),
      w("der", "Pfau", "peacock"),
      w("der", "Strauß", "ostrich"),
      w("der", "Delfin", "dolphin"),
    ],
    note: "Exotische Tiere sind oft DER — auch die -in-Fallen (Pinguin, Delfin sehen nach DIE aus)",
  },
];
