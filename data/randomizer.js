window.DND_DATA = window.DND_DATA || {};

DND_DATA.randomChoice = function randomChoice(items) {
  return items[Math.floor(Math.random() * items.length)];
};

DND_DATA.shuffle = function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
};

DND_DATA.assignStandardArray = function assignStandardArray(classId) {
  const characterClass = DND_DATA.classes.find((item) => item.id === classId);
  const priority = characterClass ? characterClass.primaryAbilities : DND_DATA.abilities;

  return priority.reduce((scores, ability, index) => {
    scores[ability] = DND_DATA.standardArray[index];
    return scores;
  }, {});
};

DND_DATA.rollAbilityScore = function rollAbilityScore(id) {
  const dice = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
  const dropped = Math.min(...dice);
  const total = dice.reduce((sum, die) => sum + die, 0) - dropped;

  return { id, dice, dropped, total };
};

DND_DATA.rollSixAbilityScores = function rollSixAbilityScores() {
  return Array.from({ length: 6 }, (_, index) => DND_DATA.rollAbilityScore(`roll-${index + 1}`));
};

DND_DATA.randomlyAssignRolls = function randomlyAssignRolls(rolls) {
  const shuffledRolls = DND_DATA.shuffle(rolls);

  return DND_DATA.abilities.reduce((assignments, ability, index) => {
    assignments[ability] = shuffledRolls[index].id;
    return assignments;
  }, {});
};

DND_DATA.createRandomStarterChoices = function createRandomStarterChoices() {
  const characterClass = DND_DATA.randomChoice(DND_DATA.classes);
  const classFeatures = { fightingStyle: "" };

  if (characterClass.id === "fighter") {
    classFeatures.fightingStyle = DND_DATA.randomChoice(DND_DATA.classFeatureChoices.fighter.options).id;
  }

  return {
    characterClass,
    race: DND_DATA.randomChoice(DND_DATA.races),
    background: DND_DATA.randomChoice(DND_DATA.backgrounds),
    classFeatures,
  };
};

DND_DATA.randomClassSkillProficiencies = function randomClassSkillProficiencies(characterClass, race, background) {
  const skillChoices = characterClass.skillChoices || { choose: 0, options: [] };
  const grantedSkills = new Set([
    ...((race && race.skills) || []),
    ...Object.keys((race && race.skillProficiencies) || {}),
    ...((background && background.skills) || []),
  ]);
  const availableSkills = DND_DATA.shuffle(skillChoices.options.filter((skillName) => !grantedSkills.has(skillName)));
  return availableSkills.slice(0, skillChoices.choose).reduce((proficiencies, skillName) => {
    proficiencies[skillName] = 1;
    return proficiencies;
  }, {});
};

DND_DATA.randomizeStandardArrayCharacter = function randomizeStandardArrayCharacter() {
  const choices = DND_DATA.createRandomStarterChoices();
  const baseAbilities = DND_DATA.assignStandardArray(choices.characterClass.id);

  return DND_DATA.createCharacter({
    name: "Random Starter",
    abilityScoreMethod: "standard-array",
    classId: choices.characterClass.id,
    raceId: choices.race.id,
    backgroundId: choices.background.id,
    classFeatures: choices.classFeatures,
    classSkillProficiencies: DND_DATA.randomClassSkillProficiencies(choices.characterClass, choices.race, choices.background),
    baseAbilities,
    spellcasting: DND_DATA.randomSpellSelectionForClass(choices.characterClass.id),
  });
};

DND_DATA.randomizeRolledCharacter = function randomizeRolledCharacter() {
  const choices = DND_DATA.createRandomStarterChoices();
  const rolledScores = DND_DATA.rollSixAbilityScores();
  const rolledAssignments = DND_DATA.randomlyAssignRolls(rolledScores);
  const baseAbilities = DND_DATA.abilities.reduce((scores, ability) => {
    const roll = rolledScores.find((item) => item.id === rolledAssignments[ability]);
    scores[ability] = roll.total;
    return scores;
  }, {});

  return DND_DATA.createCharacter({
    name: "Random Starter",
    abilityScoreMethod: "rolled",
    classId: choices.characterClass.id,
    raceId: choices.race.id,
    backgroundId: choices.background.id,
    classFeatures: choices.classFeatures,
    classSkillProficiencies: DND_DATA.randomClassSkillProficiencies(choices.characterClass, choices.race, choices.background),
    baseAbilities,
    spellcasting: DND_DATA.randomSpellSelectionForClass(choices.characterClass.id),
    rolledScores,
    rolledAssignments,
  });
};

DND_DATA.randomizeCharacter = DND_DATA.randomizeStandardArrayCharacter;
