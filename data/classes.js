window.DND_DATA = window.DND_DATA || {};

DND_DATA.classes = [
  {
    id: "fighter",
    name: "Fighter",
    cardDescription: "Flexible weapon expert",
    detail:
      "A Fighter is a trained weapon user who can fight in several ways: hold the front line with a shield, use a heavy weapon, or attack from range with a bow. You choose a Fighting Style at level 1 and gain Second Wind to recover health in a tough fight.",
    proficiencyDetails: {
      Armor: "All armor, shields",
      Weapons: "Simple weapons, martial weapons",
      Tools: "None",
      "Saving Throws": "Strength, Constitution",
    },
    hitDie: 10,
    savingThrowProficiencies: ["Strength", "Constitution"],
    skillChoices: {
      choose: 2,
      options: ["Acrobatics", "Animal Handling", "Athletics", "History", "Insight", "Intimidation", "Perception", "Survival"],
    },
    primaryAbilities: ["Strength", "Constitution", "Dexterity", "Wisdom", "Charisma", "Intelligence"],
    proficiencies: ["Light armor", "Medium armor", "Heavy armor", "Shields", "Simple weapons", "Martial weapons"],
    features: ["Fighting Style", "Second Wind"],
  },
  {
    id: "barbarian",
    name: "Barbarian",
    cardDescription: "Tough front-line bruiser",
    detail:
      "A Barbarian is a powerful frontline warrior who relies on raw strength and toughness. At level 1, Rage helps you deal more melee damage and withstand attacks, while Unarmored Defense can protect you without wearing armor.",
    proficiencyDetails: {
      Armor: "Light armor, medium armor, shields",
      Weapons: "Simple weapons, martial weapons",
      Tools: "None",
      "Saving Throws": "Strength, Constitution",
    },
    hitDie: 12,
    savingThrowProficiencies: ["Strength", "Constitution"],
    skillChoices: {
      choose: 2,
      options: ["Animal Handling", "Athletics", "Intimidation", "Nature", "Perception", "Survival"],
    },
    primaryAbilities: ["Strength", "Constitution", "Dexterity", "Wisdom", "Charisma", "Intelligence"],
    proficiencies: ["Light armor", "Medium armor", "Shields", "Simple weapons", "Martial weapons"],
    features: ["Rage", "Unarmored Defense"],
  },
  {
    id: "rogue",
    name: "Rogue",
    cardDescription: "Agile tactical striker",
    detail:
      "A Rogue is a nimble, tactical character who relies on skill, stealth, and precise attacks. At level 1, Sneak Attack adds extra damage when you find an opening, and Expertise makes you especially good at a few key skills.",
    proficiencyDetails: {
      Armor: "Light armor",
      Weapons: "Simple weapons, hand crossbows, longswords, rapiers, shortswords",
      Tools: "Thieves' tools",
      "Saving Throws": "Dexterity, Intelligence",
    },
    hitDie: 8,
    savingThrowProficiencies: ["Dexterity", "Intelligence"],
    skillChoices: {
      choose: 4,
      options: ["Acrobatics", "Athletics", "Deception", "Insight", "Intimidation", "Investigation", "Perception", "Performance", "Persuasion", "Sleight of Hand", "Stealth"],
    },
    primaryAbilities: ["Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma", "Strength"],
    proficiencies: ["Light armor", "Simple weapons", "Hand crossbows", "Longswords", "Rapiers", "Shortswords"],
    features: ["Expertise", "Sneak Attack", "Thieves' Cant"],
  },
  {
    id: "monk",
    name: "Monk",
    cardDescription: "Fast unarmed skirmisher",
    detail:
      "A Monk is a quick, disciplined martial artist who fights with speed, movement, and unarmed strikes. At level 1, Martial Arts strengthens your unarmed attacks, and Unarmored Defense lets you fight effectively without armor.",
    proficiencyDetails: {
      Armor: "None",
      Weapons: "Simple weapons, shortswords",
      Tools: "One artisan's tool or musical instrument",
      "Saving Throws": "Strength, Dexterity",
    },
    hitDie: 8,
    savingThrowProficiencies: ["Strength", "Dexterity"],
    skillChoices: {
      choose: 2,
      options: ["Acrobatics", "Athletics", "History", "Insight", "Religion", "Stealth"],
    },
    primaryAbilities: ["Dexterity", "Wisdom", "Constitution", "Strength", "Charisma", "Intelligence"],
    proficiencies: ["Simple weapons", "Shortswords"],
    features: ["Unarmored Defense", "Martial Arts"],
  },
  {
    id: "wizard",
    name: "Wizard",
    cardDescription: "Studied arcane spellcaster",
    detail:
      "A Wizard studies magic through books, careful practice, and prepared spells. At level 1, you use Intelligence for spellcasting and keep your spells in a spellbook.",
    proficiencyDetails: {
      Armor: "None",
      Weapons: "Daggers, darts, slings, quarterstaffs, light crossbows",
      Tools: "None",
      "Saving Throws": "Intelligence, Wisdom",
    },
    hitDie: 6,
    savingThrowProficiencies: ["Intelligence", "Wisdom"],
    skillChoices: {
      choose: 2,
      options: ["Arcana", "History", "Insight", "Investigation", "Medicine", "Religion"],
    },
    primaryAbilities: ["Intelligence", "Constitution", "Dexterity", "Wisdom", "Charisma", "Strength"],
    proficiencies: ["Daggers", "Darts", "Slings", "Quarterstaffs", "Light crossbows"],
    features: ["Arcane Recovery - Once per day after a short rest, you can recover some expended spell slots. At level 1, this lets you recover one level 1 spell slot."],
  },
];

DND_DATA.levelOneSpellcasting = {
  bard: {
    hasLevelOneSpellcasting: true,
    ability: "Charisma",
    cantripsKnown: 2,
    levelOneSpellSlots: 2,
    castingType: "known",
    magicType: "spellcasting",
    selectionRule: "4 known level 1 spells",
  },
  cleric: {
    hasLevelOneSpellcasting: true,
    ability: "Wisdom",
    cantripsKnown: 3,
    levelOneSpellSlots: 2,
    castingType: "prepared",
    magicType: "spellcasting",
    selectionRule: "Prepared spells will be calculated in a later spell-selection phase",
  },
  druid: {
    hasLevelOneSpellcasting: true,
    ability: "Wisdom",
    cantripsKnown: 2,
    levelOneSpellSlots: 2,
    castingType: "prepared",
    magicType: "spellcasting",
    selectionRule: "Prepared spells will be calculated in a later spell-selection phase",
  },
  sorcerer: {
    hasLevelOneSpellcasting: true,
    ability: "Charisma",
    cantripsKnown: 4,
    levelOneSpellSlots: 2,
    castingType: "known",
    magicType: "spellcasting",
    selectionRule: "2 known level 1 spells",
  },
  warlock: {
    hasLevelOneSpellcasting: true,
    ability: "Charisma",
    cantripsKnown: 2,
    levelOneSpellSlots: 1,
    castingType: "known",
    magicType: "pact",
    selectionRule: "2 known level 1 spells",
  },
  wizard: {
    hasLevelOneSpellcasting: true,
    ability: "Intelligence",
    cantripsKnown: 3,
    levelOneSpellSlots: 2,
    castingType: "spellbook",
    magicType: "spellcasting",
    selectionRule: "Spellbook and prepared spells will be handled in a later spell-selection phase",
  },
  barbarian: { hasLevelOneSpellcasting: false },
  fighter: { hasLevelOneSpellcasting: false },
  monk: { hasLevelOneSpellcasting: false },
  paladin: { hasLevelOneSpellcasting: false },
  ranger: { hasLevelOneSpellcasting: false },
  rogue: { hasLevelOneSpellcasting: false },
};

DND_DATA.classes.forEach((characterClass) => {
  characterClass.spellcasting = DND_DATA.levelOneSpellcasting[characterClass.id] || { hasLevelOneSpellcasting: false };
});

DND_DATA.classFeatureChoices = {
  fighter: {
    id: "fightingStyle",
    title: "Choose Your Fighting Style",
    previewLabel: "Fighting Style",
    options: [
      { id: "archery", name: "Archery" },
      { id: "defense", name: "Defense" },
      { id: "dueling", name: "Dueling" },
      { id: "great-weapon-fighting", name: "Great Weapon Fighting" },
      { id: "protection", name: "Protection" },
      { id: "two-weapon-fighting", name: "Two-Weapon Fighting" },
    ],
  },
};
