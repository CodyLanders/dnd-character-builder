window.DND_DATA = window.DND_DATA || {};

DND_DATA.createCharacter = function createCharacter(overrides = {}) {
  const classId = overrides.classId || "fighter";
  const raceId = overrides.raceId || "human";
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
    backgroundId,
    classFeatures: overrides.classFeatures || {
      fightingStyle: "",
    },
    skillProficiencies: overrides.skillProficiencies || {},
    classSkillProficiencies: overrides.classSkillProficiencies || {},
    expertise: overrides.expertise || {},
    savingThrowProficiencies: overrides.savingThrowProficiencies || {},
    savingThrowExpertise: overrides.savingThrowExpertise || {},
    baseAbilities,
    abilities: DND_DATA.applyRaceIncreases(baseAbilities, raceId),
    equipment: DND_DATA.getStarterEquipment(classId),
    rolledScores: overrides.rolledScores || [],
    rolledAssignments: overrides.rolledAssignments || {},
    notes: "Stage 1 temporary character model",
  };
};

DND_DATA.applyRaceIncreases = function applyRaceIncreases(baseAbilities, raceId) {
  const race = DND_DATA.races.find((item) => item.id === raceId);
  const increases = race ? race.abilityIncreases : {};

  return DND_DATA.abilities.reduce((scores, ability) => {
    const baseScore = baseAbilities[ability];
    scores[ability] = baseScore === "" || baseScore === undefined ? "" : baseScore + (increases[ability] || 0);
    return scores;
  }, {});
};


