window.DND_DATA = window.DND_DATA || {};

DND_DATA.randomChoice = function randomChoice(items) {
  return items[Math.floor(Math.random() * items.length)];
};

DND_DATA.assignStandardArray = function assignStandardArray(classId) {
  const characterClass = DND_DATA.classes.find((item) => item.id === classId);
  const priority = characterClass ? characterClass.primaryAbilities : DND_DATA.abilities;

  return priority.reduce((scores, ability, index) => {
    scores[ability] = DND_DATA.standardArray[index];
    return scores;
  }, {});
};

DND_DATA.randomizeCharacter = function randomizeCharacter() {
  const characterClass = DND_DATA.randomChoice(DND_DATA.classes);
  const race = DND_DATA.randomChoice(DND_DATA.races);
  const background = DND_DATA.randomChoice(DND_DATA.backgrounds);
  const baseAbilities = DND_DATA.assignStandardArray(characterClass.id);
  const classFeatures = {
    fightingStyle: "",
  };

  if (characterClass.id === "fighter") {
    classFeatures.fightingStyle = DND_DATA.randomChoice(DND_DATA.classFeatureChoices.fighter.options).id;
  }

  return DND_DATA.createCharacter({
    name: "Random Starter",
    classId: characterClass.id,
    raceId: race.id,
    backgroundId: background.id,
    classFeatures,
    baseAbilities,
  });
};
