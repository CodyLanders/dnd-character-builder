window.DND_DATA = window.DND_DATA || {};

DND_DATA.createCharacter = function createCharacter(overrides = {}) {
  const classId = overrides.classId || "fighter";
  const resolvedRace = DND_DATA.resolveRaceSelection
    ? DND_DATA.resolveRaceSelection(overrides.raceId || "human", overrides.subraceId || "")
    : { raceId: overrides.raceId || "human", subraceId: overrides.subraceId || "" };
  const raceId = resolvedRace.raceId;
  const subraceId = resolvedRace.subraceId;
  const backgroundId = overrides.backgroundId || "soldier";
  const baseAbilities = overrides.baseAbilities || {
    Strength: 15,
    Dexterity: 14,
    Constitution: 13,
    Intelligence: 12,
    Wisdom: 10,
    Charisma: 8,
  };

  return {
    name: overrides.name || "",
    level: 1,
    rulesVersion: "2014 PHB starter",
    abilityScoreMethod: overrides.abilityScoreMethod || "standard-array",
    classId,
    raceId,
    subraceId,
    raceChoices: overrides.raceChoices || { dragonbornAncestry: "" },
    backgroundId,
    classFeatures: overrides.classFeatures || {
      fightingStyle: "",
    },
    skillProficiencies: overrides.skillProficiencies || {},
    classSkillProficiencies: overrides.classSkillProficiencies || {},
    domainSkillProficiencies: overrides.domainSkillProficiencies || {},
    expertise: overrides.expertise || {},
    savingThrowProficiencies: overrides.savingThrowProficiencies || {},
    savingThrowExpertise: overrides.savingThrowExpertise || {},
    baseAbilities,
    abilities: DND_DATA.applyRaceIncreases(baseAbilities, raceId, subraceId),
    equipmentSelections: overrides.equipmentSelections || DND_DATA.createRandomEquipmentSelections(classId),
    equipment: [],
    spellcasting: {
      cantrips: (overrides.spellcasting && overrides.spellcasting.cantrips) || [],
      spellbookSpells: (overrides.spellcasting && overrides.spellcasting.spellbookSpells) || [],
      preparedSpells: (overrides.spellcasting && overrides.spellcasting.preparedSpells) || [],
      natureBonusCantrip: (overrides.spellcasting && overrides.spellcasting.natureBonusCantrip) || [],
      racialCantrip: (overrides.spellcasting && overrides.spellcasting.racialCantrip) || [],
    },
    abilityScoreRerollCount: overrides.abilityScoreRerollCount || 0,
    finishingTouches: overrides.finishingTouches || { choices: {}, alignment: {}, personality: {}, trinket: {} },
    rolledScores: overrides.rolledScores || [],
    rolledAssignments: overrides.rolledAssignments || {},
    notes: "Stage 1 temporary character model",
  };
};

DND_DATA.applyRaceIncreases = function applyRaceIncreases(baseAbilities, raceId, subraceId = "") {
  const race = DND_DATA.getEffectiveRace
    ? DND_DATA.getEffectiveRace(raceId, subraceId)
    : DND_DATA.races.find((item) => item.id === raceId);
  const increases = race ? race.abilityIncreases : {};

  return DND_DATA.abilities.reduce((scores, ability) => {
    const baseScore = baseAbilities[ability];
    scores[ability] = baseScore === "" || baseScore === undefined ? "" : baseScore + (increases[ability] || 0);
    return scores;
  }, {});
};


