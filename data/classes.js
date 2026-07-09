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
    id: "paladin",
    name: "Paladin",
    cardDescription: "Armored holy warrior",
    detail:
      "A Paladin is a durable warrior sworn to a sacred cause. At level 1, Divine Sense helps you notice powerful supernatural presences, and Lay on Hands gives you a small pool of healing power.",
    proficiencyDetails: {
      Armor: "All armor, shields",
      Weapons: "Simple weapons, martial weapons",
      Tools: "None",
      "Saving Throws": "Wisdom, Charisma",
    },
    hitDie: 10,
    savingThrowProficiencies: ["Wisdom", "Charisma"],
    skillChoices: {
      choose: 2,
      options: ["Athletics", "Insight", "Intimidation", "Medicine", "Persuasion", "Religion"],
    },
    primaryAbilities: ["Strength", "Charisma", "Constitution", "Wisdom", "Dexterity", "Intelligence"],
    proficiencies: ["Light armor", "Medium armor", "Heavy armor", "Shields", "Simple weapons", "Martial weapons"],
    features: [
      "Divine Sense - You can sense strong celestial, fiend, or undead presence nearby a limited number of times per day.",
      "Lay on Hands - You have a pool of healing power equal to 5 hit points at level 1. You can use it to heal a creature you touch.",
    ],
  },
  {
    id: "ranger",
    name: "Ranger",
    cardDescription: "Wilderness scout and hunter",
    detail:
      "A Ranger is a skilled explorer and hunter who thrives beyond settled lands. At level 1, Favored Enemy helps with a chosen type of foe, and Natural Explorer supports travel and survival in a chosen terrain.",
    proficiencyDetails: {
      Armor: "Light armor, medium armor, shields",
      Weapons: "Simple weapons, martial weapons",
      Tools: "None",
      "Saving Throws": "Strength, Dexterity",
    },
    hitDie: 10,
    savingThrowProficiencies: ["Strength", "Dexterity"],
    skillChoices: {
      choose: 3,
      options: ["Animal Handling", "Athletics", "Insight", "Investigation", "Nature", "Perception", "Stealth", "Survival"],
    },
    primaryAbilities: ["Dexterity", "Wisdom", "Constitution", "Strength", "Intelligence", "Charisma"],
    proficiencies: ["Light armor", "Medium armor", "Shields", "Simple weapons", "Martial weapons"],
    features: [
      "Favored Enemy - You have experience tracking, recalling information about, and understanding a chosen type of enemy.",
      "Natural Explorer - You are especially skilled at traveling, navigating, and surviving in a chosen type of terrain.",
    ],
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
  ranger: {
    groups: [
      {
        id: "favoredEnemy",
        title: "Favored Enemy",
        previewLabel: "Favored Enemy",
        description: "Choose one kind of enemy your ranger has studied and learned to track.",
        options: [
          { id: "aberrations", name: "Aberrations" },
          { id: "beasts", name: "Beasts" },
          { id: "celestials", name: "Celestials" },
          { id: "constructs", name: "Constructs" },
          { id: "dragons", name: "Dragons" },
          { id: "elementals", name: "Elementals" },
          { id: "fey", name: "Fey" },
          { id: "fiends", name: "Fiends" },
          { id: "giants", name: "Giants" },
          { id: "monstrosities", name: "Monstrosities" },
          { id: "oozes", name: "Oozes" },
          { id: "plants", name: "Plants" },
          { id: "undead", name: "Undead" },
          { id: "humanoids", name: "Humanoids" },
        ],
        humanoidChoices: {
          fields: [
            { id: "favoredEnemyHumanoidOne", label: "First humanoid race" },
            { id: "favoredEnemyHumanoidTwo", label: "Second humanoid race" },
          ],
          options: ["Bugbears", "Bullywugs", "Dwarves", "Elves", "Gnolls", "Gnomes", "Goblins", "Grimlocks", "Halflings", "Hobgoblins", "Humans", "Kobolds", "Lizardfolk", "Merfolk", "Orcs", "Sahuagin", "Troglodytes"],
        },
      },
      {
        id: "naturalExplorer",
        title: "Natural Explorer",
        previewLabel: "Natural Explorer",
        description: "Choose one type of terrain where your ranger is especially skilled at travel and survival.",
        options: [
          { id: "arctic", name: "Arctic" },
          { id: "coast", name: "Coast" },
          { id: "desert", name: "Desert" },
          { id: "forest", name: "Forest" },
          { id: "grassland", name: "Grassland" },
          { id: "mountain", name: "Mountain" },
          { id: "swamp", name: "Swamp" },
          { id: "underdark", name: "Underdark" },
        ],
      },
    ],
  },
};
