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
  const classFeatureChoice = DND_DATA.classFeatureChoices[characterClass.id];
  const featureGroups = classFeatureChoice
    ? (Array.isArray(classFeatureChoice.groups) ? classFeatureChoice.groups : [classFeatureChoice])
    : [];

  featureGroups.forEach((group) => {
    const option = DND_DATA.randomChoice(group.options);
    classFeatures[group.id] = option.id;
    if (group.humanoidChoices && option.id === "humanoids") {
      const humanoids = DND_DATA.shuffle(group.humanoidChoices.options).slice(0, group.humanoidChoices.fields.length);
      group.humanoidChoices.fields.forEach((field, index) => {
        classFeatures[field.id] = humanoids[index];
      });
    }
    if (group.dragonAncestorChoices && option.id === "draconic-bloodline") {
      classFeatures[group.dragonAncestorChoices.field.id] = DND_DATA.randomChoice(group.dragonAncestorChoices.options).id;
    }
  });

  const raceSelection = DND_DATA.randomRaceSelection ? DND_DATA.randomRaceSelection() : { race: DND_DATA.randomChoice(DND_DATA.races), subrace: null, effectiveRace: null };
  return {
    characterClass,
    race: raceSelection.race,
    subrace: raceSelection.subrace,
    effectiveRace: raceSelection.effectiveRace || raceSelection.race,
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

DND_DATA.randomDomainSkillProficiencies = function randomDomainSkillProficiencies(characterClass, race, background, classSkillProficiencies, classFeatures) {
  const domain = characterClass.id === "cleric" && DND_DATA.clericDomainMechanics
    ? DND_DATA.clericDomainMechanics[classFeatures.divineDomain]
    : null;
  const choice = domain ? domain.skillChoices : null;
  if (!choice) return {};
  const unavailableSkills = new Set([
    ...((race && race.skills) || []),
    ...Object.keys((race && race.skillProficiencies) || {}),
    ...((background && background.skills) || []),
    ...Object.keys(classSkillProficiencies || {}),
  ]);
  const availableSkills = DND_DATA.shuffle(choice.options.filter((skillName) => !unavailableSkills.has(skillName)));
  return availableSkills.slice(0, choice.choose).reduce((proficiencies, skillName) => {
    proficiencies[skillName] = choice.expertise ? 2 : 1;
    return proficiencies;
  }, {});
};

DND_DATA.randomFinishingTouchesForCharacter = function randomFinishingTouchesForCharacter(characterClass, race, background, classFeatures) {
  const finishingTouches = { choices: {}, alignment: {}, personality: {}, trinket: {} };
  if (race && race.languageChoices) {
    const blockedLanguages = new Set([
      ...((race && race.languages) || []),
      ...((background && background.languages) || []),
    ].map((language) => language.toLowerCase()));
    const languageOptions = DND_DATA.shuffle([
      ...DND_DATA.languages.standard,
      ...DND_DATA.languages.exotic,
    ].filter((language) => !blockedLanguages.has(language.toLowerCase())));
    languageOptions.slice(0, race.languageChoices.choose || 0).forEach((language, index) => {
      finishingTouches.choices[`race-language-${index + 1}`] = language;
    });
  }
  (race && race.toolChoices ? race.toolChoices : []).forEach((toolChoice) => {
    const options = DND_DATA.shuffle(toolChoice.options || DND_DATA.toolOptions[toolChoice.category] || []);
    options.slice(0, toolChoice.choose || 0).forEach((tool, index) => {
      finishingTouches.choices[`${toolChoice.id}-${index + 1}`] = tool;
    });
  });
  if (characterClass.id === "bard") {
    DND_DATA.shuffle(DND_DATA.toolOptions.musical).slice(0, 3).forEach((instrument, index) => {
      finishingTouches.choices[`bard-instrument-${index + 1}`] = instrument;
    });
  }
  const domain = characterClass.id === "cleric" && DND_DATA.clericDomainMechanics
    ? DND_DATA.clericDomainMechanics[classFeatures.divineDomain]
    : null;
  if (domain && domain.languageChoices) {
    const blockedLanguages = new Set([
      ...((race && race.languages) || []),
      ...((background && background.languages) || []),
    ].map((language) => language.toLowerCase()));
    const languageOptions = DND_DATA.shuffle([
      ...DND_DATA.languages.standard,
      ...DND_DATA.languages.exotic,
    ].filter((language) => !blockedLanguages.has(language.toLowerCase())));
    languageOptions.slice(0, domain.languageChoices.choose).forEach((language, index) => {
      finishingTouches.choices[`knowledge-language-${index + 1}`] = language;
    });
  }
  return finishingTouches;
};

function randomEquipmentSelections(classId, equipmentMethod, context = {}) {
  if (equipmentMethod === "rolled-starting-gold") {
    return {
      classId,
      method: "rolled-starting-gold",
      choices: {},
      rolledGold: DND_DATA.rollStartingWealth(classId),
      startingGoldRerollCount: 0,
    };
  }
  return DND_DATA.createRandomEquipmentSelections(classId, context);
}

DND_DATA.randomizeStandardArrayCharacter = function randomizeStandardArrayCharacter(options = {}) {
  const choices = DND_DATA.createRandomStarterChoices();
  const baseAbilities = DND_DATA.assignStandardArray(choices.characterClass.id);
  const abilities = DND_DATA.applyRaceIncreases(baseAbilities, choices.race.id, choices.subrace ? choices.subrace.id : "");
  const equipmentMethod = options.equipmentMethod || "take-equipment";
  const classSkillProficiencies = DND_DATA.randomClassSkillProficiencies(choices.characterClass, choices.effectiveRace, choices.background);
  const domainSkillProficiencies = DND_DATA.randomDomainSkillProficiencies(choices.characterClass, choices.effectiveRace, choices.background, classSkillProficiencies, choices.classFeatures);
  const finishingTouches = DND_DATA.randomFinishingTouchesForCharacter(choices.characterClass, choices.effectiveRace, choices.background, choices.classFeatures);

  const character = DND_DATA.createCharacter({
    name: "Random Starter",
    abilityScoreMethod: "standard-array",
    classId: choices.characterClass.id,
    raceId: choices.race.id,
    subraceId: choices.subrace ? choices.subrace.id : "",
    raceChoices: { dragonbornAncestry: choices.ancestry ? choices.ancestry.id : "" },
    backgroundId: choices.background.id,
    classFeatures: choices.classFeatures,
    classSkillProficiencies,
    domainSkillProficiencies,
    baseAbilities,
    equipmentSelections: randomEquipmentSelections(choices.characterClass.id, equipmentMethod, { domainId: choices.classFeatures.divineDomain }),
    spellcasting: DND_DATA.randomSpellSelectionForClass(choices.characterClass.id, { abilities, domainId: choices.classFeatures.divineDomain, patronId: choices.classFeatures.otherworldlyPatron }),
    finishingTouches,
  });
  if (choices.effectiveRace && choices.effectiveRace.racialCantripChoice) {
    const choice = choices.effectiveRace.racialCantripChoice;
    const options = DND_DATA.shuffle(DND_DATA.getSpellsForClassLevel(choice.classId, choice.level));
    character.spellcasting.racialCantrip = options.slice(0, choice.choose).map((spell) => spell.id);
  }
  return character;
};

DND_DATA.randomizeRolledCharacter = function randomizeRolledCharacter(options = {}) {
  const choices = DND_DATA.createRandomStarterChoices();
  const rolledScores = DND_DATA.rollSixAbilityScores();
  const rolledAssignments = DND_DATA.randomlyAssignRolls(rolledScores);
  const equipmentMethod = options.equipmentMethod || "take-equipment";
  const baseAbilities = DND_DATA.abilities.reduce((scores, ability) => {
    const roll = rolledScores.find((item) => item.id === rolledAssignments[ability]);
    scores[ability] = roll.total;
    return scores;
  }, {});
  const abilities = DND_DATA.applyRaceIncreases(baseAbilities, choices.race.id, choices.subrace ? choices.subrace.id : "");
  const classSkillProficiencies = DND_DATA.randomClassSkillProficiencies(choices.characterClass, choices.effectiveRace, choices.background);
  const domainSkillProficiencies = DND_DATA.randomDomainSkillProficiencies(choices.characterClass, choices.effectiveRace, choices.background, classSkillProficiencies, choices.classFeatures);
  const finishingTouches = DND_DATA.randomFinishingTouchesForCharacter(choices.characterClass, choices.effectiveRace, choices.background, choices.classFeatures);

  const character = DND_DATA.createCharacter({
    name: "Random Starter",
    abilityScoreMethod: "rolled",
    classId: choices.characterClass.id,
    raceId: choices.race.id,
    subraceId: choices.subrace ? choices.subrace.id : "",
    raceChoices: { dragonbornAncestry: choices.ancestry ? choices.ancestry.id : "" },
    backgroundId: choices.background.id,
    classFeatures: choices.classFeatures,
    classSkillProficiencies,
    domainSkillProficiencies,
    baseAbilities,
    equipmentSelections: randomEquipmentSelections(choices.characterClass.id, equipmentMethod, { domainId: choices.classFeatures.divineDomain }),
    spellcasting: DND_DATA.randomSpellSelectionForClass(choices.characterClass.id, { abilities, domainId: choices.classFeatures.divineDomain, patronId: choices.classFeatures.otherworldlyPatron }),
    finishingTouches,
    rolledScores,
    rolledAssignments,
  });
  if (choices.effectiveRace && choices.effectiveRace.racialCantripChoice) {
    const choice = choices.effectiveRace.racialCantripChoice;
    const options = DND_DATA.shuffle(DND_DATA.getSpellsForClassLevel(choice.classId, choice.level));
    character.spellcasting.racialCantrip = options.slice(0, choice.choose).map((spell) => spell.id);
  }
  return character;
};

DND_DATA.randomizeCharacter = DND_DATA.randomizeStandardArrayCharacter;
