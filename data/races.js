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
    traits: ["Extra language"],
  },
  {
    id: "hill-dwarf",
    name: "Hill Dwarf",
    abilityIncreases: {
      Constitution: 2,
      Wisdom: 1,
    },
    traits: ["Darkvision", "Dwarven Resilience", "Dwarven Toughness"],
  },
  {
    id: "wood-elf",
    name: "Wood Elf",
    abilityIncreases: {
      Dexterity: 2,
      Wisdom: 1,
    },
    traits: ["Darkvision", "Keen Senses", "Fleet of Foot"],
  },
  {
    id: "lightfoot-halfling",
    name: "Lightfoot Halfling",
    abilityIncreases: {
      Dexterity: 2,
      Charisma: 1,
    },
    traits: ["Lucky", "Brave", "Naturally Stealthy"],
  },
  {
    id: "half-orc",
    name: "Half-Orc",
    abilityIncreases: {
      Strength: 2,
      Constitution: 1,
    },
    traits: ["Darkvision", "Relentless Endurance", "Savage Attacks"],
  },
];
