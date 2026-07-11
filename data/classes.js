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
    id: "cleric",
    name: "Cleric",
    cardDescription: "Divine spellcaster and healer",
    detail:
      "A Cleric draws divine magic from a deity, faith, cosmic force, or philosophy. At level 1, you cast spells with Wisdom and choose a Divine Domain that shapes the kind of sacred power you serve.",
    proficiencyDetails: {
      Armor: "Light armor, medium armor, shields",
      Weapons: "Simple weapons",
      Tools: "None",
      "Saving Throws": "Wisdom, Charisma",
    },
    hitDie: 8,
    savingThrowProficiencies: ["Wisdom", "Charisma"],
    skillChoices: {
      choose: 2,
      options: ["History", "Insight", "Medicine", "Persuasion", "Religion"],
    },
    primaryAbilities: ["Wisdom", "Constitution", "Strength", "Dexterity", "Charisma", "Intelligence"],
    proficiencies: ["Light armor", "Medium armor", "Shields", "Simple weapons"],
    features: ["Spellcasting", "Divine Domain"],
  },
  {
    id: "bard",
    name: "Bard",
    cardDescription: "Charismatic performer and support caster",
    detail:
      "A Bard uses magic, talent, and quick thinking to support allies and solve problems. At level 1, you cast spells with Charisma and can inspire allies with Bardic Inspiration.",
    proficiencyDetails: {
      Armor: "Light armor",
      Weapons: "Simple weapons, hand crossbows, longswords, rapiers, shortswords",
      Tools: "Three musical instruments",
      "Saving Throws": "Dexterity, Charisma",
    },
    hitDie: 8,
    savingThrowProficiencies: ["Dexterity", "Charisma"],
    skillChoices: {
      choose: 3,
      options: ["Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception", "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival"],
    },
    primaryAbilities: ["Charisma", "Dexterity", "Constitution", "Wisdom", "Intelligence", "Strength"],
    proficiencies: ["Light armor", "Simple weapons", "Hand crossbows", "Longswords", "Rapiers", "Shortswords"],
    features: [
      "Spellcasting",
      "Bardic Inspiration - You can inspire another creature with a d6. They can add it to one ability check, attack roll, or saving throw. You can use this a number of times equal to your Charisma modifier, and regain uses after a long rest.",
    ],
  },
  {
    id: "sorcerer",
    name: "Sorcerer",
    cardDescription: "Charismatic innate spellcaster",
    detail:
      "A Sorcerer casts magic through innate power rather than study or devotion. At level 1, you use Charisma for spellcasting and choose a Sorcerous Origin that explains where your magic comes from.",
    proficiencyDetails: {
      Armor: "None",
      Weapons: "Daggers, darts, slings, quarterstaffs, light crossbows",
      Tools: "None",
      "Saving Throws": "Constitution, Charisma",
    },
    hitDie: 6,
    savingThrowProficiencies: ["Constitution", "Charisma"],
    skillChoices: {
      choose: 2,
      options: ["Arcana", "Deception", "Insight", "Intimidation", "Persuasion", "Religion"],
    },
    primaryAbilities: ["Charisma", "Constitution", "Dexterity", "Wisdom", "Intelligence", "Strength"],
    proficiencies: ["Daggers", "Darts", "Slings", "Quarterstaffs", "Light crossbows"],
    features: ["Spellcasting", "Sorcerous Origin"],
  },
  {
    id: "druid",
    name: "Druid",
    cardDescription: "Nature-focused prepared spellcaster",
    detail:
      "A Druid draws magic from nature and primal forces. At level 1, you know Druidic and prepare spells with Wisdom.",
    proficiencyDetails: {
      Armor: "Light armor, medium armor, shields",
      Weapons: "Clubs, daggers, darts, javelins, maces, quarterstaffs, scimitars, sickles, slings, spears",
      Tools: "Herbalism Kit",
      "Saving Throws": "Intelligence, Wisdom",
    },
    proficiencyNotes: ["Druids will not wear armor or use shields made of metal."],
    hitDie: 8,
    savingThrowProficiencies: ["Intelligence", "Wisdom"],
    skillChoices: {
      choose: 2,
      options: ["Arcana", "Animal Handling", "Insight", "Medicine", "Nature", "Perception", "Religion", "Survival"],
    },
    primaryAbilities: ["Wisdom", "Dexterity", "Constitution", "Intelligence", "Charisma", "Strength"],
    proficiencies: ["Light armor", "Medium armor", "Shields", "Clubs", "Daggers", "Darts", "Javelins", "Maces", "Quarterstaffs", "Scimitars", "Sickles", "Slings", "Spears"],
    features: [
      "Druidic - You know Druidic, the secret language of druids. You can speak it and use it to leave hidden messages.",
      "Spellcasting",
    ],
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
    selectionRule: "3 cantrips, 6 spellbook spells, and prepared spells from your spellbook",
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
  cleric: {
    groups: [
      {
        id: "divineDomain",
        title: "Divine Domain",
        previewLabel: "Divine Domain",
        description: "Choose the divine focus that shapes your cleric's level 1 features and future magic.",
        options: [
          { id: "knowledge", name: "Knowledge", description: "You serve a divine source of learning, truth, and understanding." },
          { id: "life", name: "Life", description: "You focus on healing, protection, and preserving life." },
          { id: "light", name: "Light", description: "You draw on divine light, fire, truth, and warding power." },
          { id: "nature", name: "Nature", description: "You serve a divine force tied to animals, plants, and the natural world." },
          { id: "tempest", name: "Tempest", description: "You channel divine power through storms, thunder, lightning, and battle." },
          { id: "trickery", name: "Trickery", description: "You follow a divine force of deception, misdirection, and cleverness." },
          { id: "war", name: "War", description: "You serve a divine force of battle, courage, weapons, and victory." },
        ],
      },
    ],
  },
  sorcerer: {
    groups: [
      {
        id: "sorcerousOrigin",
        title: "Sorcerous Origin",
        previewLabel: "Sorcerous Origin",
        description: "Choose the source of your Sorcerer's innate magic.",
        options: [
          { id: "draconic-bloodline", name: "Draconic Bloodline", description: "Your magic is tied to draconic ancestry, giving you a tougher body and a dragon ancestor choice." },
          { id: "wild-magic", name: "Wild Magic", description: "Your magic is unpredictable, creating dramatic surges and moments of chaotic luck." },
        ],
        dragonAncestorChoices: {
          field: { id: "dragonAncestor", label: "Dragon Ancestor" },
          options: [
            { id: "black", name: "Black", damageType: "Acid" },
            { id: "blue", name: "Blue", damageType: "Lightning" },
            { id: "brass", name: "Brass", damageType: "Fire" },
            { id: "bronze", name: "Bronze", damageType: "Lightning" },
            { id: "copper", name: "Copper", damageType: "Acid" },
            { id: "gold", name: "Gold", damageType: "Fire" },
            { id: "green", name: "Green", damageType: "Poison" },
            { id: "red", name: "Red", damageType: "Fire" },
            { id: "silver", name: "Silver", damageType: "Cold" },
            { id: "white", name: "White", damageType: "Cold" },
          ],
          note: "Your dragon ancestor's damage type matters for later Draconic features, but has little mechanical impact at level 1.",
        },
      },
    ],
  },
};

DND_DATA.clericDomainMechanics = {
  knowledge: {
    proficiencies: [],
    skillChoices: { choose: 2, options: ["Arcana", "History", "Nature", "Religion"], expertise: true, label: "Knowledge Domain Bonus Skills" },
    languageChoices: { choose: 2, label: "Knowledge Domain Bonus Language" },
    features: [
      { name: "Blessings of Knowledge", description: "You learn two languages and gain proficiency in two knowledge skills. Your proficiency bonus is doubled for checks using those selected skills." },
    ],
  },
  life: {
    proficiencies: ["Heavy Armor"],
    features: [
      { name: "Disciple of Life", description: "Your healing spells restore extra hit points equal to 2 + the spell's level." },
    ],
  },
  light: {
    proficiencies: [],
    bonusCantrips: ["light"],
    features: [
      { name: "Bonus Cantrip", description: "You know the Light cantrip automatically. It does not count against your Cleric cantrips." },
      { name: "Warding Flare", description: "When a creature you can see attacks you, you can use your reaction to impose disadvantage a limited number of times per day." },
    ],
  },
  nature: {
    proficiencies: ["Heavy Armor"],
    skillChoices: { choose: 1, options: ["Animal Handling", "Nature", "Survival"], label: "Nature Domain Bonus Skill" },
    bonusCantripChoice: { id: "natureBonusCantrip", choose: 1, classId: "druid", level: 0, label: "Nature Domain Bonus Cantrip" },
    features: [
      { name: "Acolyte of Nature", description: "You learn one Druid cantrip and gain one nature-related skill proficiency." },
      { name: "Bonus Proficiency", description: "You gain Heavy Armor proficiency." },
    ],
  },
  tempest: {
    proficiencies: ["Martial Weapons", "Heavy Armor"],
    features: [
      { name: "Bonus Proficiencies", description: "You gain Martial Weapons and Heavy Armor proficiency." },
      { name: "Wrath of the Storm", description: "When a nearby creature hits you, you can use your reaction to deal thunder or lightning damage a limited number of times per day." },
    ],
  },
  trickery: {
    proficiencies: [],
    features: [
      { name: "Blessing of the Trickster", description: "You can give one creature advantage on Dexterity (Stealth) checks for 1 hour." },
    ],
  },
  war: {
    proficiencies: ["Martial Weapons", "Heavy Armor"],
    features: [
      { name: "Bonus Proficiencies", description: "You gain Martial Weapons and Heavy Armor proficiency." },
      { name: "War Priest", description: "When you take the Attack action, you can make one weapon attack as a bonus action a limited number of times per day." },
    ],
  },
};
