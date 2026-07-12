window.DND_DATA = window.DND_DATA || {};

DND_DATA.races = [
  {
    id: "human",
    name: "Human",
    abilityIncreases: {
      Strength: 1,
      Dexterity: 1,
      Constitution: 1,
      Intelligence: 1,
      Wisdom: 1,
      Charisma: 1,
    },
    size: "Medium",
    speed: 30,
    languages: ["Common"],
    languageChoices: { choose: 1 },
    traits: ["Extra language", "Versatile"],
    traitDetails: [
      "Ability Score Increase - Your ability scores each increase by 1.",
      "Extra Language - You can speak, read, and write one extra language of your choice.",
    ],
  },
  {
    id: "dwarf",
    name: "Dwarf",
    abilityIncreases: { Constitution: 2 },
    size: "Medium",
    speed: 25,
    senses: ["Darkvision 60 ft."],
    languages: ["Common", "Dwarvish"],
    resistances: ["Poison"],
    proficiencyDetails: {
      Weapons: "Battleaxe, handaxe, light hammer, warhammer",
      Armor: "",
    },
    traits: ["Darkvision", "Dwarven Resilience", "Dwarven Combat Training", "Stonecunning"],
    traitDetails: [
      "Darkvision - You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.",
      "Dwarven Resilience - You have advantage on saving throws against poison and resistance to poison damage.",
      "Dwarven Combat Training - You are proficient with the battleaxe, handaxe, light hammer, and warhammer.",
      "Tool Proficiency - Choose smith's tools, brewer's supplies, or mason's tools.",
      "Stonecunning - You are especially knowledgeable about the origin of stonework.",
      "Dwarven Speed - Your speed is not reduced by wearing heavy armor.",
    ],
    toolChoices: [{ id: "dwarf-artisan-tool", choose: 1, category: "artisan", options: ["Smith's tools", "Brewer's supplies", "Mason's tools"] }],
  },
  {
    id: "elf",
    name: "Elf",
    abilityIncreases: { Dexterity: 2 },
    size: "Medium",
    speed: 30,
    senses: ["Darkvision 60 ft."],
    languages: ["Common", "Elvish"],
    skills: ["Perception"],
    traits: ["Darkvision", "Keen Senses", "Fey Ancestry", "Trance"],
    traitDetails: [
      "Darkvision - You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.",
      "Keen Senses - You are proficient in Perception.",
      "Fey Ancestry - You have advantage on saving throws against being charmed, and magic cannot put you to sleep.",
      "Trance - You meditate deeply instead of sleeping and finish a long rest in 4 hours.",
    ],
  },
  {
    id: "halfling",
    name: "Halfling",
    abilityIncreases: { Dexterity: 2 },
    size: "Small",
    speed: 25,
    languages: ["Common", "Halfling"],
    traits: ["Lucky", "Brave", "Halfling Nimbleness"],
    traitDetails: [
      "Lucky - When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.",
      "Brave - You have advantage on saving throws against being frightened.",
      "Halfling Nimbleness - You can move through the space of any creature larger than you.",
    ],
  },
  {
    id: "half-orc",
    name: "Half-Orc",
    abilityIncreases: {
      Strength: 2,
      Constitution: 1,
    },
    size: "Medium",
    speed: 30,
    senses: ["Darkvision 60 ft."],
    languages: ["Common", "Orc"],
    skills: ["Intimidation"],
    traits: ["Darkvision", "Relentless Endurance", "Savage Attacks"],
    traitDetails: [
      "Darkvision - You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.",
      "Relentless Endurance - When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead once per long rest.",
      "Savage Attacks - When you score a critical hit with a melee weapon attack, you can roll one extra weapon damage die.",
    ],
  },
  {
    id: "gnome",
    name: "Gnome",
    abilityIncreases: { Intelligence: 2 },
    size: "Small",
    speed: 25,
    senses: ["Darkvision 60 ft."],
    languages: ["Common", "Gnomish"],
    traits: ["Darkvision", "Gnome Cunning"],
    traitDetails: [
      "Darkvision - You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.",
      "Gnome Cunning - You have advantage on Intelligence, Wisdom, and Charisma saving throws against magic.",
    ],
  },
  {
    id: "dragonborn",
    name: "Dragonborn",
    abilityIncreases: { Strength: 2, Charisma: 1 },
    size: "Medium",
    speed: 30,
    languages: ["Common", "Draconic"],
    traits: ["Draconic Ancestry", "Breath Weapon", "Damage Resistance"],
    traitDetails: [
      "Draconic Ancestry - Choose a dragon ancestor. Your ancestry determines your breath weapon and damage resistance.",
      "Breath Weapon - As an action, exhale destructive energy. At level 1 it deals 2d6 damage, with a save for half damage, once per short or long rest.",
      "Damage Resistance - You have resistance to the damage type associated with your draconic ancestry.",
    ],
    ancestryChoice: { id: "dragonbornAncestry", label: "Draconic Ancestry" },
  },
  {
    id: "tiefling",
    name: "Tiefling",
    abilityIncreases: { Charisma: 2, Intelligence: 1 },
    size: "Medium",
    speed: 30,
    senses: ["Darkvision 60 ft."],
    languages: ["Common", "Infernal"],
    resistances: ["Fire"],
    traits: ["Darkvision", "Hellish Resistance", "Infernal Legacy"],
    traitDetails: [
      "Darkvision - You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.",
      "Hellish Resistance - You have resistance to fire damage.",
      "Infernal Legacy - You know Thaumaturgy. Charisma is your spellcasting ability for it. Later Tiefling spells are not included because this builder supports level 1 only.",
    ],
    racialCantrips: [{ id: "thaumaturgy", label: "Tiefling racial cantrip", ability: "Charisma" }],
  },
];

DND_DATA.subraces = {
  dwarf: [
    {
      id: "hill-dwarf",
      raceId: "dwarf",
      name: "Hill Dwarf",
      abilityIncreases: { Wisdom: 1 },
      traits: ["Dwarven Toughness"],
      traitSummary: "Wisdom +1, extra hit points.",
      traitDetails: [
        "Ability Score Increase - Your Wisdom score increases by 1.",
        "Dwarven Toughness - Your hit point maximum increases by 1 at level 1.",
      ],
      hpBonus: 1,
    },
    {
      id: "mountain-dwarf",
      raceId: "dwarf",
      name: "Mountain Dwarf",
      abilityIncreases: { Strength: 2 },
      traits: ["Dwarven Armor Training"],
      traitSummary: "Strength +2, light and medium armor proficiency.",
      traitDetails: [
        "Ability Score Increase - Your Strength score increases by 2.",
        "Dwarven Armor Training - You are proficient with light and medium armor.",
      ],
      proficiencyDetails: { Armor: "Light armor, medium armor" },
    },
  ],
  elf: [
    {
      id: "high-elf",
      raceId: "elf",
      name: "High Elf",
      abilityIncreases: { Intelligence: 1 },
      traits: ["Elf Weapon Training", "Wizard Cantrip", "Extra Language"],
      traitSummary: "Intelligence +1, elf weapons, one Wizard cantrip, one extra language.",
      traitDetails: [
        "Ability Score Increase - Your Intelligence score increases by 1.",
        "Elf Weapon Training - You are proficient with the longsword, shortsword, shortbow, and longbow.",
        "Cantrip - You know one Wizard cantrip of your choice. Intelligence is your spellcasting ability for it.",
        "Extra Language - You can speak, read, and write one additional language of your choice.",
      ],
      proficiencyDetails: { Weapons: "Longsword, shortsword, shortbow, longbow" },
      languageChoices: { choose: 1 },
      racialCantripChoice: { id: "racialCantrip", label: "High Elf racial cantrip", classId: "wizard", level: 0, choose: 1, ability: "Intelligence" },
    },
    {
      id: "wood-elf",
      raceId: "elf",
      name: "Wood Elf",
      abilityIncreases: { Wisdom: 1 },
      speed: 35,
      traits: ["Elf Weapon Training", "Fleet of Foot", "Mask of the Wild"],
      traitSummary: "Wisdom +1, speed 35 ft., elf weapons, Mask of the Wild.",
      traitDetails: [
        "Ability Score Increase - Your Wisdom score increases by 1.",
        "Elf Weapon Training - You are proficient with the longsword, shortsword, shortbow, and longbow.",
        "Fleet of Foot - Your walking speed increases to 35 feet.",
        "Mask of the Wild - You can attempt to hide when lightly obscured by natural phenomena.",
      ],
      proficiencyDetails: { Weapons: "Longsword, shortsword, shortbow, longbow" },
    },
    {
      id: "drow",
      raceId: "elf",
      name: "Drow",
      abilityIncreases: { Charisma: 1 },
      senses: ["Darkvision 120 ft."],
      traits: ["Superior Darkvision", "Sunlight Sensitivity", "Drow Magic", "Drow Weapon Training"],
      traitSummary: "Charisma +1, superior darkvision, Dancing Lights, drow weapons.",
      traitDetails: [
        "Ability Score Increase - Your Charisma score increases by 1.",
        "Superior Darkvision - Your darkvision has a range of 120 feet.",
        "Sunlight Sensitivity - Bright sunlight makes some attacks and sight-based Perception checks harder.",
        "Drow Magic - You know Dancing Lights. Charisma is your spellcasting ability for it.",
        "Drow Weapon Training - You are proficient with rapiers, shortswords, and hand crossbows.",
      ],
      proficiencyDetails: { Weapons: "Rapier, shortsword, hand crossbow" },
      racialCantrips: [{ id: "dancing-lights", label: "Drow racial cantrip", ability: "Charisma" }],
    },
  ],
  halfling: [
    {
      id: "lightfoot-halfling",
      raceId: "halfling",
      name: "Lightfoot Halfling",
      abilityIncreases: { Charisma: 1 },
      traits: ["Naturally Stealthy"],
      traitSummary: "Charisma +1, Naturally Stealthy.",
      traitDetails: [
        "Ability Score Increase - Your Charisma score increases by 1.",
        "Naturally Stealthy - You can attempt to hide even when obscured only by a creature at least one size larger than you.",
      ],
    },
    {
      id: "stout-halfling",
      raceId: "halfling",
      name: "Stout Halfling",
      abilityIncreases: { Constitution: 1 },
      resistances: ["Poison"],
      traits: ["Stout Resilience"],
      traitSummary: "Constitution +1, poison resilience.",
      traitDetails: [
        "Ability Score Increase - Your Constitution score increases by 1.",
        "Stout Resilience - You have advantage on saving throws against poison and resistance to poison damage.",
      ],
    },
  ],
  gnome: [
    {
      id: "forest-gnome",
      raceId: "gnome",
      name: "Forest Gnome",
      abilityIncreases: { Dexterity: 1 },
      traits: ["Natural Illusionist", "Speak with Small Beasts"],
      traitSummary: "Dexterity +1, Minor Illusion, Speak with Small Beasts.",
      traitDetails: [
        "Ability Score Increase - Your Dexterity score increases by 1.",
        "Natural Illusionist - You know Minor Illusion. Intelligence is your spellcasting ability for it.",
        "Speak with Small Beasts - Through sounds and gestures, you can communicate simple ideas with Small or smaller beasts.",
      ],
      racialCantrips: [{ id: "minor-illusion", label: "Forest Gnome racial cantrip", ability: "Intelligence" }],
    },
    {
      id: "rock-gnome",
      raceId: "gnome",
      name: "Rock Gnome",
      abilityIncreases: { Constitution: 1 },
      tools: ["Tinker's tools"],
      traits: ["Artificer's Lore", "Tinker"],
      traitSummary: "Constitution +1, Artificer's Lore, tinker's tools.",
      traitDetails: [
        "Ability Score Increase - Your Constitution score increases by 1.",
        "Artificer's Lore - Add twice your proficiency bonus to History checks about magic items, alchemical objects, or technological devices.",
        "Tinker - You are proficient with tinker's tools. With 1 hour, 10 gp of materials, and your tools, you can make a Tiny clockwork toy, fire starter, or music box. The device lasts 24 hours unless dismantled, and you can have up to three active at a time.",
      ],
    },
  ],
};

DND_DATA.dragonbornAncestries = [
  { id: "black", name: "Black", damageType: "Acid", area: "5 by 30-foot line", saveAbility: "Dexterity" },
  { id: "blue", name: "Blue", damageType: "Lightning", area: "5 by 30-foot line", saveAbility: "Dexterity" },
  { id: "brass", name: "Brass", damageType: "Fire", area: "5 by 30-foot line", saveAbility: "Dexterity" },
  { id: "bronze", name: "Bronze", damageType: "Lightning", area: "5 by 30-foot line", saveAbility: "Dexterity" },
  { id: "copper", name: "Copper", damageType: "Acid", area: "5 by 30-foot line", saveAbility: "Dexterity" },
  { id: "gold", name: "Gold", damageType: "Fire", area: "15-foot cone", saveAbility: "Dexterity" },
  { id: "green", name: "Green", damageType: "Poison", area: "15-foot cone", saveAbility: "Constitution" },
  { id: "red", name: "Red", damageType: "Fire", area: "15-foot cone", saveAbility: "Dexterity" },
  { id: "silver", name: "Silver", damageType: "Cold", area: "15-foot cone", saveAbility: "Constitution" },
  { id: "white", name: "White", damageType: "Cold", area: "15-foot cone", saveAbility: "Constitution" },
];

DND_DATA.getDragonbornAncestryById = function getDragonbornAncestryById(ancestryId) {
  return DND_DATA.dragonbornAncestries.find((ancestry) => ancestry.id === ancestryId) || null;
};

DND_DATA.legacyRaceMap = {
  "hill-dwarf": { raceId: "dwarf", subraceId: "hill-dwarf" },
  "wood-elf": { raceId: "elf", subraceId: "wood-elf" },
  "lightfoot-halfling": { raceId: "halfling", subraceId: "lightfoot-halfling" },
};

DND_DATA.getSubracesForRace = function getSubracesForRace(raceId) {
  return DND_DATA.subraces[raceId] || [];
};

DND_DATA.getSubraceById = function getSubraceById(subraceId) {
  return Object.values(DND_DATA.subraces).flat().find((subrace) => subrace.id === subraceId) || null;
};

DND_DATA.resolveRaceSelection = function resolveRaceSelection(raceId, subraceId = "") {
  const legacy = DND_DATA.legacyRaceMap[raceId];
  if (legacy) return legacy;
  const subrace = DND_DATA.getSubraceById(subraceId);
  if (subrace && subrace.raceId === raceId) return { raceId, subraceId };
  return { raceId, subraceId: "" };
};

function mergeAbilityIncreases(base = {}, extra = {}) {
  return DND_DATA.abilities.reduce((increases, ability) => {
    const total = (base[ability] || 0) + (extra[ability] || 0);
    if (total) increases[ability] = total;
    return increases;
  }, {});
}

function mergeProficiencyDetails(base = {}, extra = {}) {
  const labels = new Set([...Object.keys(base), ...Object.keys(extra)]);
  return [...labels].reduce((details, label) => {
    details[label] = [base[label], extra[label]].filter(Boolean).join(", ");
    return details;
  }, {});
}

DND_DATA.getEffectiveRace = function getEffectiveRace(raceId, subraceId = "") {
  const resolved = DND_DATA.resolveRaceSelection(raceId, subraceId);
  const race = DND_DATA.races.find((item) => item.id === resolved.raceId) || null;
  if (!race) return null;
  const subrace = DND_DATA.getSubraceById(resolved.subraceId);
  if (!subrace) return { ...race, baseRaceId: race.id, subraceId: "" };
  return {
    ...race,
    ...subrace,
    id: subrace.id,
    baseRaceId: race.id,
    subraceId: subrace.id,
    name: subrace.name,
    abilityIncreases: mergeAbilityIncreases(race.abilityIncreases, subrace.abilityIncreases),
    speed: subrace.speed || race.speed,
    size: subrace.size || race.size,
    senses: subrace.senses || race.senses || [],
    languages: [...(race.languages || []), ...(subrace.languages || [])],
    languageChoices: subrace.languageChoices || race.languageChoices,
    toolChoices: [...(race.toolChoices || []), ...(subrace.toolChoices || [])],
    skills: [...(race.skills || []), ...(subrace.skills || [])],
    skillProficiencies: { ...(race.skillProficiencies || {}), ...(subrace.skillProficiencies || {}) },
    proficiencyDetails: mergeProficiencyDetails(race.proficiencyDetails, subrace.proficiencyDetails),
    traits: [...(race.traits || []), ...(subrace.traits || [])],
    traitDetails: [...(race.traitDetails || []), ...(subrace.traitDetails || [])],
    racialCantrips: [...(race.racialCantrips || []), ...(subrace.racialCantrips || [])],
    racialCantripChoice: subrace.racialCantripChoice || race.racialCantripChoice,
    resistances: [...(race.resistances || []), ...(subrace.resistances || [])],
    hpBonus: (race.hpBonus || 0) + (subrace.hpBonus || 0),
  };
};

DND_DATA.randomRaceSelection = function randomRaceSelection(excludeRaceId = "") {
  const races = DND_DATA.races.filter((race) => race.id !== excludeRaceId);
  const race = DND_DATA.randomChoice(races.length ? races : DND_DATA.races);
  const subraces = DND_DATA.getSubracesForRace(race.id);
  const subrace = subraces.length ? DND_DATA.randomChoice(subraces) : null;
  const ancestry = race.id === "dragonborn" ? DND_DATA.randomChoice(DND_DATA.dragonbornAncestries) : null;
  return {
    race,
    subrace,
    ancestry,
    effectiveRace: DND_DATA.getEffectiveRace(race.id, subrace ? subrace.id : ""),
  };
};
