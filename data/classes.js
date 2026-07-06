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
      Tools: "Thieves’ tools",
      "Saving Throws": "Dexterity, Intelligence",
    },
    hitDie: 8,
    savingThrowProficiencies: ["Dexterity", "Intelligence"],
    primaryAbilities: ["Dexterity", "Constitution", "Intelligence", "Charisma", "Wisdom", "Strength"],
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
      Tools: "One artisan’s tool or musical instrument",
      "Saving Throws": "Strength, Dexterity",
    },
    hitDie: 8,
    savingThrowProficiencies: ["Strength", "Dexterity"],
    primaryAbilities: ["Dexterity", "Wisdom", "Constitution", "Strength", "Intelligence", "Charisma"],
    proficiencies: ["Simple weapons", "Shortswords"],
    features: ["Unarmored Defense", "Martial Arts"],
  },
];

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
