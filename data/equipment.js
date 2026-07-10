window.DND_DATA = window.DND_DATA || {};

DND_DATA.equipmentItems = {
  club: { id: "club", name: "Club", type: "weapon", category: "simple weapon", damage: "1d4", damageType: "bludgeoning", properties: ["light"] },
  dagger: { id: "dagger", name: "Dagger", type: "weapon", category: "simple weapon", damage: "1d4", damageType: "piercing", properties: ["finesse", "light", "thrown"], range: "20/60" },
  greatclub: { id: "greatclub", name: "Greatclub", type: "weapon", category: "simple weapon", damage: "1d8", damageType: "bludgeoning", properties: ["two-handed"] },
  handaxe: { id: "handaxe", name: "Handaxe", type: "weapon", category: "simple weapon", damage: "1d6", damageType: "slashing", properties: ["light", "thrown"], range: "20/60" },
  javelin: { id: "javelin", name: "Javelin", type: "weapon", category: "simple weapon", damage: "1d6", damageType: "piercing", properties: ["thrown"], range: "30/120" },
  lightHammer: { id: "lightHammer", name: "Light hammer", type: "weapon", category: "simple weapon", damage: "1d4", damageType: "bludgeoning", properties: ["light", "thrown"], range: "20/60" },
  mace: { id: "mace", name: "Mace", type: "weapon", category: "simple weapon", damage: "1d6", damageType: "bludgeoning", properties: [] },
  quarterstaff: { id: "quarterstaff", name: "Quarterstaff", type: "weapon", category: "simple weapon", damage: "1d6", damageType: "bludgeoning", properties: ["versatile 1d8"] },
  sickle: { id: "sickle", name: "Sickle", type: "weapon", category: "simple weapon", damage: "1d4", damageType: "slashing", properties: ["light"] },
  spear: { id: "spear", name: "Spear", type: "weapon", category: "simple weapon", damage: "1d6", damageType: "piercing", properties: ["thrown", "versatile 1d8"], range: "20/60" },
  lightCrossbow: { id: "lightCrossbow", name: "Light crossbow", type: "weapon", category: "simple weapon", damage: "1d8", damageType: "piercing", properties: ["ranged", "two-handed"], range: "80/320" },
  shortbow: { id: "shortbow", name: "Shortbow", type: "weapon", category: "simple weapon", damage: "1d6", damageType: "piercing", properties: ["ranged", "two-handed"], range: "80/320" },
  sling: { id: "sling", name: "Sling", type: "weapon", category: "simple weapon", damage: "1d4", damageType: "bludgeoning", properties: ["ranged"], range: "30/120" },
  dart: { id: "dart", name: "Dart", type: "weapon", category: "simple weapon", damage: "1d4", damageType: "piercing", properties: ["finesse", "thrown"], range: "20/60" },
  battleaxe: { id: "battleaxe", name: "Battleaxe", type: "weapon", category: "martial weapon", melee: true, damage: "1d8", damageType: "slashing", properties: ["versatile 1d10"] },
  greataxe: { id: "greataxe", name: "Greataxe", type: "weapon", category: "martial weapon", melee: true, damage: "1d12", damageType: "slashing", properties: ["heavy", "two-handed"] },
  greatsword: { id: "greatsword", name: "Greatsword", type: "weapon", category: "martial weapon", melee: true, damage: "2d6", damageType: "slashing", properties: ["heavy", "two-handed"] },
  longsword: { id: "longsword", name: "Longsword", type: "weapon", category: "martial weapon", melee: true, damage: "1d8", damageType: "slashing", properties: ["versatile 1d10"] },
  maul: { id: "maul", name: "Maul", type: "weapon", category: "martial weapon", melee: true, damage: "2d6", damageType: "bludgeoning", properties: ["heavy", "two-handed"] },
  rapier: { id: "rapier", name: "Rapier", type: "weapon", category: "martial weapon", melee: true, damage: "1d8", damageType: "piercing", properties: ["finesse"] },
  scimitar: { id: "scimitar", name: "Scimitar", type: "weapon", category: "martial weapon", melee: true, damage: "1d6", damageType: "slashing", properties: ["finesse", "light"] },
  shortsword: { id: "shortsword", name: "Shortsword", type: "weapon", category: "martial weapon", melee: true, damage: "1d6", damageType: "piercing", properties: ["finesse", "light"] },
  warhammer: { id: "warhammer", name: "Warhammer", type: "weapon", category: "martial weapon", melee: true, damage: "1d8", damageType: "bludgeoning", properties: ["versatile 1d10"] },
  longbow: { id: "longbow", name: "Longbow", type: "weapon", category: "martial weapon", damage: "1d8", damageType: "piercing", properties: ["ranged", "two-handed"], range: "150/600" },
  chainMail: { id: "chainMail", name: "Chain mail", type: "armor", category: "heavy armor", armorClass: { base: 16, dex: false } },
  leatherArmor: { id: "leatherArmor", name: "Leather armor", type: "armor", category: "light armor", armorClass: { base: 11, dex: true } },
  scaleMail: { id: "scaleMail", name: "Scale mail", type: "armor", category: "medium armor", armorClass: { base: 14, dex: true, dexMax: 2 } },
  shield: { id: "shield", name: "Shield", type: "shield", armorClass: { bonus: 2 } },
  woodenShield: { id: "woodenShield", name: "Wooden shield", type: "shield", armorClass: { bonus: 2 }, detail: "Wooden shield - +2 AC" },
  arrows20: { id: "arrows20", name: "20 arrows", type: "ammunition" },
  bolts20: { id: "bolts20", name: "20 bolts", type: "ammunition" },
  darts10: { id: "darts10", name: "10 darts", type: "ammunition", detail: "10 darts - each 1d4 piercing, finesse, thrown" },
  javelins4: { id: "javelins4", name: "4 javelins", type: "weapon", category: "simple weapon", detail: "4 javelins - each 1d6 piercing, thrown" },
  javelins5: { id: "javelins5", name: "5 javelins", type: "weapon", category: "simple weapon", detail: "5 javelins - each 1d6 piercing, thrown" },
  handaxes2: { id: "handaxes2", name: "Two handaxes", type: "weapon", category: "simple weapon", detail: "Two handaxes - each 1d6 slashing, light, thrown" },
  daggers2: { id: "daggers2", name: "Two daggers", type: "weapon", category: "simple weapon", detail: "Two daggers - each 1d4 piercing, finesse, light, thrown" },
  shortswords2: { id: "shortswords2", name: "Two shortswords", type: "weapon", category: "martial weapon", detail: "Two shortswords - each 1d6 piercing, finesse, light" },
  componentPouch: { id: "componentPouch", name: "Component pouch", type: "other", detail: "Component pouch - material components used to cast spells" },
  arcaneFocus: { id: "arcaneFocus", name: "Arcane focus", type: "other", detail: "Arcane focus - an item used by arcane spellcasters as a spellcasting focus" },
  spellbook: { id: "spellbook", name: "Spellbook", type: "other", detail: "Spellbook - the book where a wizard records spells" },
  holySymbol: { id: "holySymbol", name: "Holy symbol", type: "other", detail: "Holy symbol - a sacred emblem used by divine characters" },
  sprigMistletoe: { id: "sprigMistletoe", name: "Sprig of mistletoe", type: "other", detail: "Sprig of mistletoe - Druidic Focus, used to cast Druid spells that require material components" },
  totem: { id: "totem", name: "Totem", type: "other", detail: "Totem - Druidic Focus, used to cast Druid spells that require material components" },
  woodenStaffFocus: { id: "woodenStaffFocus", name: "Wooden staff", type: "other", detail: "Wooden staff - Druidic Focus, used to cast Druid spells that require material components" },
  yewWand: { id: "yewWand", name: "Yew wand", type: "other", detail: "Yew wand - Druidic Focus, used to cast Druid spells that require material components" },
  herbalismKit: {
    id: "herbalismKit",
    name: "Herbalism Kit",
    type: "tool",
    contents: ["pouches for herbs", "clippers", "mortar and pestle", "vials"],
  },
  thievesTools: {
    id: "thievesTools",
    name: "Thieves' tools",
    type: "tool",
    contents: ["small file", "lock picks", "small mirror on a metal handle", "narrow-bladed scissors", "pliers"],
  },
  burglarsPack: {
    id: "burglarsPack",
    name: "Burglar's Pack",
    type: "pack",
    contents: ["backpack", "bag of 1,000 ball bearings", "10 feet of string", "bell", "5 candles", "crowbar", "hammer", "10 pitons", "hooded lantern", "2 flasks of oil", "5 days of rations", "tinderbox", "waterskin", "50 feet of hempen rope"],
  },
  dungeoneersPack: {
    id: "dungeoneersPack",
    name: "Dungeoneer's Pack",
    type: "pack",
    contents: ["backpack", "crowbar", "hammer", "10 pitons", "10 torches", "tinderbox", "10 days of rations", "waterskin", "50 feet of hempen rope"],
  },
  explorersPack: {
    id: "explorersPack",
    name: "Explorer's Pack",
    type: "pack",
    contents: ["backpack", "bedroll", "mess kit", "tinderbox", "10 torches", "10 days of rations", "waterskin", "50 feet of hempen rope"],
  },
  scholarsPack: {
    id: "scholarsPack",
    name: "Scholar's Pack",
    type: "pack",
    contents: ["backpack", "book of lore", "bottle of ink", "ink pen", "10 sheets of parchment", "little bag of sand", "small knife"],
  },
  priestsPack: {
    id: "priestsPack",
    name: "Priest's Pack",
    type: "pack",
    contents: ["backpack", "blanket", "10 candles", "tinderbox", "alms box", "2 blocks of incense", "censer", "vestments", "2 days of rations", "waterskin"],
  },
};

DND_DATA.simpleWeaponIds = [
  "club",
  "dagger",
  "greatclub",
  "handaxe",
  "javelin",
  "lightHammer",
  "mace",
  "quarterstaff",
  "sickle",
  "spear",
  "lightCrossbow",
  "shortbow",
  "sling",
  "dart",
];

DND_DATA.simpleMeleeWeaponIds = [
  "club",
  "dagger",
  "greatclub",
  "handaxe",
  "javelin",
  "lightHammer",
  "mace",
  "quarterstaff",
  "sickle",
  "spear",
];

DND_DATA.druidSimpleWeaponIds = [
  "club",
  "dagger",
  "dart",
  "javelin",
  "mace",
  "quarterstaff",
  "sickle",
  "sling",
  "spear",
];

DND_DATA.druidSimpleMeleeWeaponIds = [
  "club",
  "dagger",
  "javelin",
  "mace",
  "quarterstaff",
  "sickle",
  "spear",
];

DND_DATA.martialWeaponIds = [
  "battleaxe",
  "greataxe",
  "greatsword",
  "longsword",
  "maul",
  "rapier",
  "scimitar",
  "shortsword",
  "warhammer",
  "longbow",
];

DND_DATA.startingEquipment = {
  fighter: {
    choices: [
      {
        id: "armor",
        title: "Armor Package",
        options: [
          { id: "chain-mail", name: "Heavy armor package", items: ["chainMail"], details: ["Chain mail - AC 16, no Dexterity bonus"] },
          { id: "leather-longbow", name: "Light armor package", items: ["leatherArmor", "longbow", "arrows20"], details: ["Leather armor - AC 11 + Dex modifier", "Longbow - 1d8 piercing, ranged, two-handed", "20 arrows"] },
        ],
      },
      {
        id: "mainWeapons",
        title: "Main weapons",
        options: [
          { id: "weapon-shield", name: "One martial weapon and a shield", items: ["shield"], helper: "Choose this option to pick one martial weapon.", includes: ["Shield (+2 AC)"], dropdowns: [{ id: "martialWeapon", label: "Martial weapon", list: "martial" }] },
          { id: "two-weapons", name: "Two martial weapons", helper: "Choose this option to pick two martial weapons.", dropdowns: [{ id: "martialWeaponOne", label: "First martial weapon", list: "martial" }, { id: "martialWeaponTwo", label: "Second martial weapon", list: "martial" }] },
        ],
      },
      {
        id: "secondaryWeapons",
        title: "Secondary weapons",
        options: [
          { id: "crossbow", name: "Light crossbow and 20 bolts", items: ["lightCrossbow", "bolts20"], details: ["Light crossbow - 1d8 piercing, ranged, two-handed", "20 bolts"] },
          { id: "handaxes", name: "Two handaxes", items: ["handaxes2"], details: ["Two handaxes - each 1d6 slashing, light, thrown"] },
        ],
      },
      {
        id: "pack",
        title: "Pack",
        options: [
          { id: "dungeoneers-pack", name: "Dungeoneer's Pack", items: ["dungeoneersPack"] },
          { id: "explorers-pack", name: "Explorer's Pack", items: ["explorersPack"] },
        ],
      },
    ],
    fixed: [],
  },
  barbarian: {
    choices: [
      {
        id: "mainWeapon",
        title: "Main weapon",
        options: [
          { id: "greataxe", name: "Greataxe", items: ["greataxe"] },
          { id: "martial-melee", name: "Any martial melee weapon", dropdowns: [{ id: "martialMeleeWeapon", label: "Martial melee weapon", list: "martialMelee" }] },
        ],
      },
      {
        id: "secondaryWeapon",
        title: "Secondary weapon",
        options: [
          { id: "handaxes", name: "Two handaxes", items: ["handaxes2"], details: ["Two handaxes - each 1d6 slashing, light, thrown"] },
          { id: "simple-weapon", name: "Any simple weapon", dropdowns: [{ id: "simpleWeapon", label: "Simple weapon", list: "simple" }] },
        ],
      },
    ],
    fixed: ["explorersPack", "javelins4"],
  },
  rogue: {
    choices: [
      {
        id: "mainWeapon",
        title: "Main weapon",
        options: [
          { id: "rapier", name: "Rapier", items: ["rapier"] },
          { id: "shortsword", name: "Shortsword", items: ["shortsword"] },
        ],
      },
      {
        id: "secondaryWeapon",
        title: "Secondary weapon",
        options: [
          { id: "shortbow", name: "Shortbow and 20 arrows", items: ["shortbow", "arrows20"] },
          { id: "shortsword", name: "Shortsword", items: ["shortsword"] },
        ],
      },
      {
        id: "pack",
        title: "Pack",
        options: [
          { id: "burglars-pack", name: "Burglar's Pack", items: ["burglarsPack"] },
          { id: "dungeoneers-pack", name: "Dungeoneer's Pack", items: ["dungeoneersPack"] },
          { id: "explorers-pack", name: "Explorer's Pack", items: ["explorersPack"] },
        ],
      },
    ],
    fixed: ["leatherArmor", "daggers2", "thievesTools"],
  },
  monk: {
    choices: [
      {
        id: "weapon",
        title: "Weapon",
        options: [
          { id: "shortsword", name: "Shortsword", items: ["shortsword"] },
          { id: "simple-weapon", name: "Any simple weapon", dropdowns: [{ id: "simpleWeapon", label: "Simple weapon", list: "simple" }] },
        ],
      },
      {
        id: "pack",
        title: "Pack",
        options: [
          { id: "dungeoneers-pack", name: "Dungeoneer's Pack", items: ["dungeoneersPack"] },
          { id: "explorers-pack", name: "Explorer's Pack", items: ["explorersPack"] },
        ],
      },
    ],
    fixed: ["darts10"],
  },
  cleric: {
    choices: [
      {
        id: "mainWeapon",
        title: "Main weapon",
        options: [
          { id: "mace", name: "Mace", items: ["mace"] },
          { id: "warhammer", name: "Warhammer", items: ["warhammer"], requiresProficiency: "Martial Weapons", details: ["Warhammer - 1d8 bludgeoning, versatile 1d10"] },
        ],
      },
      {
        id: "armor",
        title: "Armor",
        options: [
          { id: "scale-mail", name: "Scale mail", items: ["scaleMail"], details: ["Scale mail - AC 14 + Dex modifier (max 2)"] },
          { id: "leather-armor", name: "Leather armor", items: ["leatherArmor"], details: ["Leather armor - AC 11 + Dex modifier"] },
          { id: "chain-mail", name: "Chain mail", items: ["chainMail"], requiresProficiency: "Heavy Armor", details: ["Chain mail - AC 16, no Dexterity bonus"] },
        ],
      },
      {
        id: "secondaryWeapon",
        title: "Secondary weapon",
        options: [
          { id: "crossbow", name: "Light crossbow and 20 bolts", items: ["lightCrossbow", "bolts20"], details: ["Light crossbow - 1d8 piercing, ranged, two-handed", "20 bolts"] },
          { id: "simple-weapon", name: "Any simple weapon", dropdowns: [{ id: "simpleWeapon", label: "Simple weapon", list: "simple" }] },
        ],
      },
      {
        id: "pack",
        title: "Pack",
        options: [
          { id: "priests-pack", name: "Priest's Pack", items: ["priestsPack"] },
          { id: "explorers-pack", name: "Explorer's Pack", items: ["explorersPack"] },
        ],
      },
    ],
    fixed: ["shield", "holySymbol"],
  },
  druid: {
    choices: [
      {
        id: "shieldOrWeapon",
        title: "Shield or weapon",
        options: [
          { id: "wooden-shield", name: "Wooden shield", items: ["woodenShield"], details: ["Wooden shield - +2 AC"] },
          { id: "simple-weapon", name: "Any simple weapon", dropdowns: [{ id: "druidSimpleWeapon", label: "Simple weapon", list: "druidSimple" }] },
        ],
      },
      {
        id: "mainWeapon",
        title: "Main weapon",
        options: [
          { id: "scimitar", name: "Scimitar", items: ["scimitar"], details: ["Scimitar - 1d6 slashing, finesse, light"] },
          { id: "simple-melee-weapon", name: "Any simple melee weapon", dropdowns: [{ id: "druidSimpleMeleeWeapon", label: "Simple melee weapon", list: "druidSimpleMelee" }] },
        ],
      },
      {
        id: "druidicFocus",
        title: "Druidic Focus",
        description: "Choose what your Druid uses as a spellcasting focus. A Druidic Focus helps you cast Druid spells that require material components.",
        options: [
          { id: "sprig-mistletoe", name: "Sprig of mistletoe", items: ["sprigMistletoe"], details: ["Druidic Focus - used to cast Druid spells that require material components."] },
          { id: "totem", name: "Totem", items: ["totem"], details: ["Druidic Focus - used to cast Druid spells that require material components."] },
          { id: "wooden-staff", name: "Wooden staff", items: ["woodenStaffFocus"], details: ["Druidic Focus - used to cast Druid spells that require material components."] },
          { id: "yew-wand", name: "Yew wand", items: ["yewWand"], details: ["Druidic Focus - used to cast Druid spells that require material components."] },
        ],
      },
    ],
    fixed: ["leatherArmor", "explorersPack"],
  },
  paladin: {
    choices: [
      {
        id: "mainWeapons",
        title: "Main weapons",
        options: [
          { id: "weapon-shield", name: "One martial weapon and a shield", items: ["shield"], helper: "Choose this option to pick one martial weapon.", includes: ["Shield (+2 AC)"], dropdowns: [{ id: "martialWeapon", label: "Martial weapon", list: "martial" }] },
          { id: "two-weapons", name: "Two martial weapons", helper: "Choose this option to pick two martial weapons.", dropdowns: [{ id: "martialWeaponOne", label: "First martial weapon", list: "martial" }, { id: "martialWeaponTwo", label: "Second martial weapon", list: "martial" }] },
        ],
      },
      {
        id: "secondaryWeapons",
        title: "Secondary weapons",
        options: [
          { id: "javelins", name: "Five javelins", items: ["javelins5"], details: ["Five javelins - each 1d6 piercing, thrown"] },
          { id: "simple-melee", name: "Any simple melee weapon", dropdowns: [{ id: "simpleMeleeWeapon", label: "Simple melee weapon", list: "simpleMelee" }] },
        ],
      },
      {
        id: "pack",
        title: "Pack",
        options: [
          { id: "priests-pack", name: "Priest's Pack", items: ["priestsPack"] },
          { id: "explorers-pack", name: "Explorer's Pack", items: ["explorersPack"] },
        ],
      },
    ],
    fixed: ["chainMail", "holySymbol"],
  },
  ranger: {
    choices: [
      {
        id: "armor",
        title: "Armor",
        options: [
          { id: "scale-mail", name: "Scale mail", items: ["scaleMail"], details: ["Scale mail - AC 14 + Dex modifier (max 2)"] },
          { id: "leather-armor", name: "Leather armor", items: ["leatherArmor"], details: ["Leather armor - AC 11 + Dex modifier"] },
        ],
      },
      {
        id: "mainWeapons",
        title: "Main weapons",
        options: [
          { id: "shortswords", name: "Two shortswords", items: ["shortswords2"], details: ["Two shortswords - each 1d6 piercing, finesse, light"] },
          { id: "two-simple-melee", name: "Two simple melee weapons", helper: "Choose this option to pick two simple melee weapons.", dropdowns: [{ id: "simpleMeleeWeaponOne", label: "First simple melee weapon", list: "simpleMelee" }, { id: "simpleMeleeWeaponTwo", label: "Second simple melee weapon", list: "simpleMelee" }] },
        ],
      },
      {
        id: "pack",
        title: "Pack",
        options: [
          { id: "dungeoneers-pack", name: "Dungeoneer's Pack", items: ["dungeoneersPack"] },
          { id: "explorers-pack", name: "Explorer's Pack", items: ["explorersPack"] },
        ],
      },
    ],
    fixed: ["longbow", "arrows20"],
  },
  wizard: {
    choices: [
      {
        id: "weapon",
        title: "Weapon",
        options: [
          { id: "quarterstaff", name: "Quarterstaff", items: ["quarterstaff"], details: ["Quarterstaff - 1d6 bludgeoning, versatile 1d8"] },
          { id: "dagger", name: "Dagger", items: ["dagger"], details: ["Dagger - 1d4 piercing, finesse, light, thrown"] },
        ],
      },
      {
        id: "spellcastingFocus",
        title: "Spellcasting focus",
        options: [
          { id: "component-pouch", name: "Component pouch", items: ["componentPouch"], details: ["Component pouch - material components used to cast spells"] },
          { id: "arcane-focus", name: "Arcane focus", items: ["arcaneFocus"], details: ["Arcane focus - an item used by arcane spellcasters as a spellcasting focus"] },
        ],
      },
      {
        id: "pack",
        title: "Pack",
        options: [
          { id: "scholars-pack", name: "Scholar's Pack", items: ["scholarsPack"] },
          { id: "explorers-pack", name: "Explorer's Pack", items: ["explorersPack"] },
        ],
      },
    ],
    fixed: ["spellbook"],
  },
};

DND_DATA.startingWealth = {
  barbarian: { dice: 2, die: 4, multiplier: 10, label: "2d4 x 10 gp" },
  bard: { dice: 5, die: 4, multiplier: 10, label: "5d4 x 10 gp" },
  cleric: { dice: 5, die: 4, multiplier: 10, label: "5d4 x 10 gp" },
  druid: { dice: 2, die: 4, multiplier: 10, label: "2d4 x 10 gp" },
  fighter: { dice: 5, die: 4, multiplier: 10, label: "5d4 x 10 gp" },
  monk: { dice: 5, die: 4, multiplier: 1, label: "5d4 gp" },
  paladin: { dice: 5, die: 4, multiplier: 10, label: "5d4 x 10 gp" },
  ranger: { dice: 5, die: 4, multiplier: 10, label: "5d4 x 10 gp" },
  rogue: { dice: 4, die: 4, multiplier: 10, label: "4d4 x 10 gp" },
  sorcerer: { dice: 3, die: 4, multiplier: 10, label: "3d4 x 10 gp" },
  warlock: { dice: 4, die: 4, multiplier: 10, label: "4d4 x 10 gp" },
  wizard: { dice: 4, die: 4, multiplier: 10, label: "4d4 x 10 gp" },
};

DND_DATA.rollStartingWealth = function rollStartingWealth(classId) {
  const formula = DND_DATA.startingWealth[classId];
  if (!formula) return { formula: "No class formula", rolls: [], subtotal: 0, multiplier: 1, totalGp: 0 };
  const rolls = Array.from({ length: formula.dice }, () => Math.floor(Math.random() * formula.die) + 1);
  const subtotal = rolls.reduce((sum, roll) => sum + roll, 0);
  return {
    formula: formula.label,
    rolls,
    subtotal,
    multiplier: formula.multiplier,
    totalGp: subtotal * formula.multiplier,
  };
};

DND_DATA.getEquipmentItem = function getEquipmentItem(itemId) {
  return DND_DATA.equipmentItems[itemId] || null;
};

DND_DATA.getWeaponOptions = function getWeaponOptions(list) {
  if (list === "druidSimple") {
    return DND_DATA.druidSimpleWeaponIds.map((id) => DND_DATA.getEquipmentItem(id));
  }
  if (list === "druidSimpleMelee") {
    return DND_DATA.druidSimpleMeleeWeaponIds.map((id) => DND_DATA.getEquipmentItem(id));
  }
  if (list === "martialMelee") {
    return DND_DATA.martialWeaponIds.map((id) => DND_DATA.getEquipmentItem(id)).filter((item) => item && item.melee);
  }
  if (list === "simpleMelee") {
    return DND_DATA.simpleMeleeWeaponIds.map((id) => DND_DATA.getEquipmentItem(id));
  }
  if (list === "martial") return DND_DATA.martialWeaponIds.map((id) => DND_DATA.getEquipmentItem(id));
  return DND_DATA.simpleWeaponIds.map((id) => DND_DATA.getEquipmentItem(id));
};

DND_DATA.createRandomEquipmentSelections = function createRandomEquipmentSelections(classId, context = {}) {
  const definition = DND_DATA.startingEquipment[classId];
  const selections = { classId, method: "take-equipment", choices: {}, rolledGold: null, startingGoldRerollCount: 0 };
  if (!definition) return selections;
  const domainProficiencies = classId === "cleric" && DND_DATA.clericDomainMechanics && context.domainId
    ? (DND_DATA.clericDomainMechanics[context.domainId].proficiencies || []).map((proficiency) => proficiency.toLowerCase())
    : [];

  definition.choices.forEach((group) => {
    const availableOptions = group.options.filter((option) => !option.requiresProficiency || domainProficiencies.includes(option.requiresProficiency.toLowerCase()));
    const option = DND_DATA.randomChoice(availableOptions.length ? availableOptions : group.options);
    const selectedChoice = { optionId: option.id };
    (option.dropdowns || []).forEach((dropdown) => {
      selectedChoice[dropdown.id] = DND_DATA.randomChoice(DND_DATA.getWeaponOptions(dropdown.list)).id;
    });
    selections.choices[group.id] = selectedChoice;
  });

  return selections;
};
