const wizardSteps = [
  { key: "class", title: "Pick Your Class", progress: "Step 1 of 5 - Class" },
  { key: "race", title: "Pick Your Race", progress: "Step 2 of 5 - Race" },
  { key: "background", title: "Pick Your Background", progress: "Step 3 of 5 - Background" },
  { key: "classFeature", title: "Choose Your Level 1 Class Feature", progress: "Step 4 of 5 - Level 1 Class Feature" },
  { key: "abilities", title: "Assign Your Ability Scores", progress: "Step 5 of 5 - Ability Scores" },
];

const stepGuidance = {
  class: `Your class is your character's main job in the party. It determines how you are trained to handle danger, the weapons and armor you can use, your starting equipment, and the abilities you bring into combat.

When choosing a class, think about:
- How you want to fight or help the group
- Whether you prefer armor, weapons, speed, or special techniques
- What role sounds most fun to play at the table

You will make more choices later, but your class is the foundation for how your character works.`,
  classFeature: "Some classes make an important choice at level 1. This choice helps define how your character plays and is separate from a subclass, which may come later.",
  race: "Your race gives your character traits that can affect ability scores, movement, senses, and other special abilities. Choose the option that best fits the character you want to play.",
  background: "Your background explains what your character did before adventuring. It provides skills, tools or languages, starting equipment, and a roleplaying hook.",
};

const ABILITY_METHODS = {
  standard: "standard-array",
  rolled: "rolled",
  pointBuy: "point-buy",
};

const views = {
  home: document.querySelector("#homeView"),
  randomize: document.querySelector("#randomizeView"),
  build: document.querySelector("#buildView"),
  preview: document.querySelector("#previewView"),
};

const homeButton = document.querySelector("#homeButton");
const buildButton = document.querySelector("#buildButton");
const randomizeButton = document.querySelector("#randomizeButton");
const rollCharacterButton = document.querySelector("#rollCharacterButton");
const standardCharacterButton = document.querySelector("#standardCharacterButton");
const randomizeBackButton = document.querySelector("#randomizeBackButton");
const editRandomButton = document.querySelector("#editRandomButton");
const wizardStep = document.querySelector("#wizardStep");
const livePreview = document.querySelector("#livePreview");
const randomPreview = document.querySelector("#randomPreview");

function emptyAbilityScores(value = "") {
  return DND_DATA.abilities.reduce((scores, ability) => {
    scores[ability] = value;
    return scores;
  }, {});
}

function createBlankCharacter() {
  return {
    name: "",
    level: 1,
    rulesVersion: "2014 PHB starter",
    abilityScoreMethod: ABILITY_METHODS.standard,
    classId: "",
    raceId: "",
    backgroundId: "",
    classFeatures: { fightingStyle: "" },
    skillProficiencies: {},
    classSkillProficiencies: {},
    expertise: {},
    savingThrowProficiencies: {},
    savingThrowExpertise: {},
    baseAbilities: emptyAbilityScores(),
    abilities: emptyAbilityScores(),
    equipment: [],
    notes: "Stage 1 wizard character",
  };
}

function createAbilityState(character = null) {
  const state = {
    standard: { assignments: emptyAbilityScores() },
    rolled: { results: [], assignments: emptyAbilityScores() },
    pointBuy: { scores: emptyAbilityScores(8), touched: emptyAbilityScores(false), finalized: false },
  };

  if (!character) return state;

  if (character.abilityScoreMethod === ABILITY_METHODS.rolled) {
    state.rolled.results = (character.rolledScores || []).map((roll) => ({ ...roll }));
    DND_DATA.abilities.forEach((ability) => {
      state.rolled.assignments[ability] = character.rolledAssignments ? character.rolledAssignments[ability] || "" : "";
    });
    return state;
  }

  if (character.abilityScoreMethod === ABILITY_METHODS.pointBuy) {
    DND_DATA.abilities.forEach((ability) => {
      const score = character.baseAbilities[ability];
      state.pointBuy.scores[ability] = score === "" || score === undefined ? 8 : Number(score);
      state.pointBuy.touched[ability] = score !== "" && score !== undefined;
    });
    state.pointBuy.finalized = DND_DATA.abilities.every((ability) => state.pointBuy.touched[ability]);
    return state;
  }

  DND_DATA.abilities.forEach((ability) => {
    state.standard.assignments[ability] = character.baseAbilities[ability] || "";
  });
  return state;
}

const appState = {
  wizardStepIndex: 0,
  character: createBlankCharacter(),
  abilityMethod: ABILITY_METHODS.standard,
  abilityState: createAbilityState(),
};

function getById(collection, id) {
  return collection.find((item) => item.id === id);
}

function showView(viewName) {
  Object.values(views).forEach((view) => view.classList.add("hidden"));
  views[viewName].classList.remove("hidden");

}

function abilityModifier(score) {
  if (score === "") return "";
  const modifier = Math.floor((score - 10) / 2);
  return modifier === 0 ? "" : modifier > 0 ? `+${modifier}` : String(modifier);
}

function abilityModifierValue(score) {
  const safeScore = score === "" || score === undefined || score === null ? 10 : score;
  return Math.floor((safeScore - 10) / 2);
}

function formatSignedModifier(value) {
  return value === 0 ? "" : value > 0 ? `+${value}` : String(value);
}

function hasAssignedAbilityScore(character, ability) {
  return character.baseAbilities[ability] !== "" && character.baseAbilities[ability] !== undefined;
}

function getRaceAbilityBonuses(race) {
  return race ? race.abilityIncreases || {} : {};
}

function getRaceAbilityBonus(race, ability) {
  return getRaceAbilityBonuses(race)[ability] || 0;
}

function formatRaceAbilityBonus(bonus) {
  return bonus > 0 ? `+${bonus} (Racial Bonus)` : `${bonus} (Racial Bonus)`;
}

function raceAbilityMarker(bonus) {
  return bonus > 0 ? "*".repeat(bonus) : "";
}

function formatRacialAdjustedScoreOption(score, racialBonus) {
  const marker = raceAbilityMarker(racialBonus);
  return racialBonus ? `${score} &rarr; ${Number(score) + racialBonus}${marker}` : `${score}`;
}

function scoreAssignmentLegend() {
  return `<p class="score-assignment-legend">* = +1 racial bonus; ** = +2 racial bonus. Scores after &rarr; include racial bonuses.</p>`;
}
function shouldShowUnassignedRacialBonus(character) {
  return character.abilityScoreMethod !== ABILITY_METHODS.pointBuy;
}

function renderAbilityScoresTable(character, race) {
  return `
    <h3>Ability Scores</h3>
    <table class="ability-table">
      <thead><tr><th>Ability</th><th>Score</th><th>Modifier</th></tr></thead>
      <tbody>
        ${DND_DATA.abilities.map((ability) => {
          const score = character.abilities[ability];
          const hasAssignedScore = hasAssignedAbilityScore(character, ability);
          const racialBonus = getRaceAbilityBonus(race, ability);
          const scoreDisplay = hasAssignedScore
            ? `${score}`
            : racialBonus && shouldShowUnassignedRacialBonus(character)
              ? formatRaceAbilityBonus(racialBonus)
              : "";

          return `<tr><td>${ability}${raceAbilityMarker(racialBonus)}</td><td>${scoreDisplay}</td><td>${hasAssignedScore ? abilityModifier(score) : ""}</td></tr>`;
        }).join("")}
      </tbody>
    </table>
    <div class="table-note racial-bonus-legend">Racial Ability Score Bonus: Number of * indicates bonus points to that ability.</div>
  `;
}

function getClassFeatureChoice(character) {
  return DND_DATA.classFeatureChoices[character.classId] || null;
}

function getSelectedFightingStyle(character) {
  const selectedId = character.classFeatures.fightingStyle;
  return DND_DATA.classFeatureChoices.fighter.options.find((option) => option.id === selectedId);
}

function getArmorInfo(equipment) {
  if (equipment.includes("Chain mail")) return { name: "Chain mail", baseAc: 16, usesDex: false, isArmor: true };
  if (equipment.includes("Leather armor")) return { name: "Leather armor", baseAc: 11, usesDex: true, isArmor: true };
  return { name: "None", baseAc: 10, usesDex: true, isArmor: false };
}

function calculateArmorClass(character) {
  const armor = getArmorInfo(character.equipment);
  const shieldBonus = character.equipment.includes("Shield") ? 2 : 0;
  const defenseBonus = character.classFeatures.fightingStyle === "defense" && armor.isArmor ? 1 : 0;
  const dexBonus = armor.usesDex ? abilityModifierValue(character.abilities.Dexterity) : 0;
  return { total: armor.baseAc + dexBonus + shieldBonus + defenseBonus, defenseBonus };
}

function getProficiencyBonus(character) {
  return character.level >= 1 ? 2 : 0;
}

function normalizeSkillSource(source, defaultLevel = 1) {
  if (!source) return {};
  if (Array.isArray(source)) {
    return source.reduce((levels, skillName) => {
      levels[skillName] = defaultLevel;
      return levels;
    }, {});
  }
  return { ...source };
}

function mergeSkillLevels(target, source, defaultLevel = 1) {
  Object.entries(normalizeSkillSource(source, defaultLevel)).forEach(([skillName, level]) => {
    target[skillName] = Math.max(target[skillName] || 0, Number(level) || defaultLevel);
  });
}

function getSkillProficiencyLevels(character, race, background) {
  const levels = {};
  mergeSkillLevels(levels, background ? background.skills : []);
  mergeSkillLevels(levels, race ? race.skills : []);
  mergeSkillLevels(levels, race ? race.skillProficiencies : {});
  mergeSkillLevels(levels, character.classSkillProficiencies || {});
  mergeSkillLevels(levels, character.skillProficiencies || {});
  mergeSkillLevels(levels, character.expertise || {}, 2);
  return levels;
}

function getSavingThrowProficiencyLevels(character, characterClass) {
  const levels = {};
  mergeSkillLevels(levels, characterClass ? characterClass.savingThrowProficiencies : []);
  mergeSkillLevels(levels, character.savingThrowProficiencies || {});
  mergeSkillLevels(levels, character.savingThrowExpertise || {}, 2);
  return levels;
}

function proficiencyMark(level) {
  if (level >= 2) return "&#10003;&#10003;";
  if (level === 1) return "&#10003;";
  return "";
}

function renderSavingThrowsTable(character, characterClass) {
  const proficiencyBonus = getProficiencyBonus(character);
  const savingThrowLevels = getSavingThrowProficiencyLevels(character, characterClass);
  return `
    <h3>Saving Throws</h3>
    <table class="preview-table saving-throws-table">
      <thead><tr><th>Proficiency</th><th>Ability</th><th>Modifier</th></tr></thead>
      <tbody>
        ${DND_DATA.abilities.map((ability) => {
          const level = savingThrowLevels[ability] || 0;
          const hasAssignedScore = hasAssignedAbilityScore(character, ability);
          const modifier = (hasAssignedScore ? abilityModifierValue(character.abilities[ability]) : 0) + proficiencyBonus * level;
          return `<tr><td>${proficiencyMark(level)}</td><td>${ability}</td><td>${level || hasAssignedScore ? formatSignedModifier(modifier) : ""}</td></tr>`;
        }).join("")}
      </tbody>
    </table>`;
}

function renderSkillsTable(character, race, background) {
  const proficiencyBonus = getProficiencyBonus(character);
  const skillLevels = getSkillProficiencyLevels(character, race, background);
  return `
    <h3>Skills</h3>
    <table class="preview-table skills-table">
      <thead><tr><th>Proficiency</th><th>Skill</th><th>Modifier</th><th>Base Ability</th></tr></thead>
      <tbody>
        ${DND_DATA.skills.map((skill) => {
          const level = skillLevels[skill.name] || 0;
          const hasAssignedScore = hasAssignedAbilityScore(character, skill.ability);
          const modifier = (hasAssignedScore ? abilityModifierValue(character.abilities[skill.ability]) : 0) + proficiencyBonus * level;
          return `<tr><td>${proficiencyMark(level)}</td><td>${skill.name}</td><td>${level || hasAssignedScore ? formatSignedModifier(modifier) : ""}</td><td>${DND_DATA.abilityShortLabels[skill.ability]}</td></tr>`;
        }).join("")}
      </tbody>
    </table>`;
}
function getRollById(id) {
  return appState.abilityState.rolled.results.find((roll) => roll.id === id);
}

function syncAbilityScoresFromState() {
  const baseAbilities = emptyAbilityScores();

  if (appState.abilityMethod === ABILITY_METHODS.standard) {
    DND_DATA.abilities.forEach((ability) => {
      baseAbilities[ability] = appState.abilityState.standard.assignments[ability] || "";
    });
  }

  if (appState.abilityMethod === ABILITY_METHODS.rolled) {
    DND_DATA.abilities.forEach((ability) => {
      const roll = getRollById(appState.abilityState.rolled.assignments[ability]);
      baseAbilities[ability] = roll ? roll.total : "";
    });
  }

  if (appState.abilityMethod === ABILITY_METHODS.pointBuy) {
    DND_DATA.abilities.forEach((ability) => {
      const isReady = appState.abilityState.pointBuy.touched[ability] || appState.abilityState.pointBuy.finalized;
      baseAbilities[ability] = isReady ? appState.abilityState.pointBuy.scores[ability] : "";
    });
  }

  appState.character.abilityScoreMethod = appState.abilityMethod;
  appState.character.baseAbilities = baseAbilities;
  recomputeCharacter();
}

function recomputeCharacter() {
  appState.character.equipment = appState.character.classId ? DND_DATA.getStarterEquipment(appState.character.classId) : [];
  appState.character.abilities = DND_DATA.applyRaceIncreases(appState.character.baseAbilities, appState.character.raceId);
  if (appState.character.classId !== "fighter") appState.character.classFeatures.fightingStyle = "";
}

function renderPreview(container, character) {
  const characterClass = getById(DND_DATA.classes, character.classId);
  const race = getById(DND_DATA.races, character.raceId);
  const background = getById(DND_DATA.backgrounds, character.backgroundId);
  const fightingStyle = getSelectedFightingStyle(character);
  const armorClass = calculateArmorClass(character);

  container.innerHTML = `
    <div class="sheet-grid">
      <div class="sheet-item"><span class="sheet-label">Name</span>${character.name || "Unnamed Hero"}</div>
      <div class="sheet-item"><span class="sheet-label">Level</span>${character.level}</div>
      <div class="sheet-item"><span class="sheet-label">Class</span>${characterClass ? characterClass.name : "Not selected"}</div>
      <div class="sheet-item"><span class="sheet-label">Race</span>${race ? race.name : "Not selected"}</div>
      <div class="sheet-item"><span class="sheet-label">Background</span>${background ? background.name : "Not selected"}</div>
      <div class="sheet-item"><span class="sheet-label">Hit Die</span>${characterClass ? `d${characterClass.hitDie}` : "Not selected"}</div>
      <div class="sheet-item"><span class="sheet-label">Armor Class</span>${armorClass.total}${armorClass.defenseBonus ? " (Defense +1)" : ""}</div>
      <div class="sheet-item"><span class="sheet-label">Level 1 Feature</span>${fightingStyle ? `Fighting Style: ${fightingStyle.name}` : "Not selected"}</div>
    </div>
    ${renderAbilityScoresTable(character, race)}
    ${renderSavingThrowsTable(character, characterClass)}
    ${renderSkillsTable(character, race, background)}
    <h3>Starter Equipment</h3>
    <ul class="plain-list">${character.equipment.length ? character.equipment.map((item) => `<li>${item}</li>`).join("") : "<li>Choose a class first.</li>"}</ul>`;
}

function optionCard(option, selectedId, type, detail = "", extraClass = "") {
  const isSelected = selectedId === option.id;
  return `<button class="option-card ${extraClass} ${isSelected ? "selected" : ""}" type="button" data-option-type="${type}" data-option-id="${option.id}" aria-pressed="${isSelected}"><strong>${option.name}</strong>${detail ? `<span>${detail}</span>` : ""}</button>`;
}

function guidancePanel(text) {
  return `<div class="guidance-panel">${text}</div>`;
}

function defaultClassGuidancePanel() {
  return `<div class="class-info-panel"><p>Your class is your character's main job in the party. It determines how you are trained to handle danger, the weapons and armor you can use, your starting equipment, and the abilities you bring into combat.</p><p>When choosing a class, think about:</p><p class="guidance-bullet">- How you want to fight or help the group</p><p class="guidance-bullet">- Whether you prefer armor, weapons, speed, or special techniques</p><p class="guidance-bullet">- What role sounds most fun to play at the table</p><p>You will make more choices later, but your class is the foundation for how your character works.</p></div>`;
}

function classInfoPanel(characterClass) {
  if (!characterClass) return defaultClassGuidancePanel();
  return `<div class="class-info-panel selected"><p>${characterClass.detail}</p><div class="proficiency-block"><h3>Proficiencies</h3><div class="proficiency-list">${Object.entries(characterClass.proficiencyDetails).map(([label, value]) => `<p><strong>${label}:</strong> ${value}</p>`).join("")}</div></div></div>`;
}

function renderClassStep(step) {
  const selectedClass = getById(DND_DATA.classes, appState.character.classId);
  wizardStep.innerHTML = `<p class="progress-text">${step.progress}</p><h2>${step.title}</h2>${classInfoPanel(selectedClass)}<div class="option-grid">${DND_DATA.classes.map((option) => optionCard(option, appState.character.classId, "class", option.cardDescription, "class-option-card")).join("")}</div><div class="wizard-actions"><button class="secondary-button" type="button" data-action="randomize-current">Randomize</button><button class="primary-button" type="button" data-action="continue" ${appState.character.classId ? "" : "disabled"}>Continue</button></div>`;
}

function renderChoiceStep(step, options, selectedId, type, detailForOption) {
  wizardStep.innerHTML = `<p class="progress-text">${step.progress}</p><h2>${step.title}</h2>${guidancePanel(stepGuidance[step.key])}<div class="option-grid">${options.map((option) => optionCard(option, selectedId, type, detailForOption(option))).join("")}</div><div class="wizard-actions">${appState.wizardStepIndex > 0 ? '<button class="secondary-button" type="button" data-action="back">Back</button>' : ""}<button class="secondary-button" type="button" data-action="randomize-current">Randomize</button><button class="primary-button" type="button" data-action="continue" ${selectedId ? "" : "disabled"}>Continue</button></div>`;
}

function renderClassFeatureStep(step) {
  const choice = getClassFeatureChoice(appState.character);
  if (!choice) {
    appState.wizardStepIndex = getNextStepIndex();
    renderWizard();
    return;
  }
  const selectedId = appState.character.classFeatures[choice.id];
  wizardStep.innerHTML = `<p class="progress-text">${step.progress}</p><h2>${step.title}</h2>${guidancePanel(stepGuidance.classFeature)}<h3>${choice.title}</h3><div class="option-grid">${choice.options.map((option) => optionCard(option, selectedId, choice.id)).join("")}</div><div class="wizard-actions"><button class="secondary-button" type="button" data-action="back">Back</button><button class="secondary-button" type="button" data-action="randomize-current">Randomize</button><button class="primary-button" type="button" data-action="continue" ${selectedId ? "" : "disabled"}>Continue</button></div>`;
}

function getUsedStandardScores(exceptAbility = "") {
  return DND_DATA.abilities.filter((ability) => ability !== exceptAbility).map((ability) => Number(appState.abilityState.standard.assignments[ability])).filter(Boolean);
}

function getUsedRollIds(exceptAbility = "") {
  return DND_DATA.abilities.filter((ability) => ability !== exceptAbility).map((ability) => appState.abilityState.rolled.assignments[ability]).filter(Boolean);
}

function formatRaceBonusSummary(race) {
  if (!race) return "Not selected";
  const bonuses = getRaceAbilityBonuses(race);
  const entries = Object.entries(bonuses).filter(([, bonus]) => bonus !== 0);

  if (!entries.length) return race.name;
  if (entries.length === DND_DATA.abilities.length && entries.every(([, bonus]) => bonus === 1)) {
    return `${race.name} (+1 to all ability scores)`;
  }

  return `${race.name} (${entries.map(([ability, bonus]) => `${bonus > 0 ? "+" : ""}${bonus} ${ability}`).join(", ")})`;
}

function getSelectedClassFeatureName(character) {
  const choice = getClassFeatureChoice(character);
  if (!choice) return "";
  const selectedId = character.classFeatures[choice.id];
  const selectedOption = choice.options.find((option) => option.id === selectedId);
  return selectedOption ? selectedOption.name : "Not selected";
}

function summarizeStarterEquipment(equipment = []) {
  return equipment.length ? equipment.join(", ") : "Not selected";
}

function armorNoteIfChainMail(equipment = []) {
  return equipment.includes("Chain mail") ? ["Chain mail does not add Dexterity to your Armor Class."] : [];
}

function getSimpleAbilityGuidance(character) {
  const equipment = character.equipment || [];
  const fightingStyle = character.classFeatures ? character.classFeatures.fightingStyle : "";

  if (character.classId === "fighter") {
    if (fightingStyle === "archery") {
      return {
        primary: "Dexterity",
        secondary: "Constitution",
        notes: ["Ranged weapon attacks benefit from Dexterity.", ...armorNoteIfChainMail(equipment)],
      };
    }

    if (fightingStyle === "dueling") {
      return {
        primary: "Strength or Dexterity &mdash; choose one",
        secondary: "Constitution",
        notes: [
          "Your current starter equipment may use Strength for attacks.",
          "Dexterity becomes useful with finesse weapons.",
          ...armorNoteIfChainMail(equipment),
        ],
      };
    }

    if (fightingStyle === "two-weapon-fighting") {
      return {
        primary: "Strength or Dexterity &mdash; choose one",
        secondary: "Constitution",
        notes: ["Weapon choice determines whether Strength or Dexterity is more useful."],
      };
    }

    return {
      primary: "Strength",
      secondary: "Constitution",
      notes: ["great-weapon-fighting", "defense", "protection"].includes(fightingStyle)
        ? armorNoteIfChainMail(equipment)
        : [],
    };
  }

  if (character.classId === "barbarian") {
    return {
      primary: "Strength",
      secondary: "Constitution and Dexterity",
      notes: ["Unarmored Defense uses Dexterity and Constitution."],
    };
  }

  if (character.classId === "rogue") {
    return {
      primary: "Dexterity",
      secondary: "Constitution",
      notes: ["Leather armor gains Armor Class from Dexterity.", "Finesse and ranged weapon choices can use Dexterity when applicable."],
    };
  }

  if (character.classId === "monk") {
    return {
      primary: "Dexterity",
      secondary: "Wisdom and Constitution",
      notes: ["Monk Unarmored Defense uses Dexterity and Wisdom.", "Martial Arts can use Dexterity for unarmed strikes and Monk weapons."],
    };
  }

  return null;
}

function renderAbilityScoreGuidancePanel() {
  const characterClass = getById(DND_DATA.classes, appState.character.classId);
  const race = getById(DND_DATA.races, appState.character.raceId);
  const featureName = getSelectedClassFeatureName(appState.character);
  const choice = getClassFeatureChoice(appState.character);
  const guidance = getSimpleAbilityGuidance(appState.character);

  return `
    <section class="ability-score-guidance-panel" aria-label="Ability Score Guidance">
      <h3>Ability Score Guidance</h3>
      <div class="guidance-section">
        <span class="guidance-section-label">Selected Build</span>
        <p><strong>Class:</strong> ${characterClass ? characterClass.name : "Not selected"}</p>
        ${choice ? `<p><strong>Level 1 Class Feature:</strong> ${featureName}</p>` : ""}
        <p><strong>Race:</strong> ${formatRaceBonusSummary(race)}</p>
        <p><strong>Starter Equipment:</strong> ${summarizeStarterEquipment(appState.character.equipment)}</p>
      </div>
      ${guidance ? `<div class="guidance-section"><span class="guidance-section-label">Recommended Priorities</span><p><strong>Primary:</strong> ${guidance.primary}</p><p><strong>Secondary:</strong> ${guidance.secondary}</p></div>` : ""}
      ${guidance && guidance.notes.length ? `<div class="guidance-section"><span class="guidance-section-label">Equipment Impact</span>${guidance.notes.map((note) => `<p>${note}</p>`).join("")}</div>` : ""}
    </section>
  `;
}
function methodSelector() {
  const options = [
    { id: ABILITY_METHODS.standard, label: "Standard Array" },
    { id: ABILITY_METHODS.rolled, label: "Roll 4d6, Drop Lowest" },
    { id: ABILITY_METHODS.pointBuy, label: "Point Buy" },
  ];
  return `<div class="method-selector" aria-label="Ability score method">${options.map((option) => `<button class="method-button ${appState.abilityMethod === option.id ? "selected" : ""}" type="button" data-score-method="${option.id}" aria-pressed="${appState.abilityMethod === option.id}">${option.label}</button>`).join("")}</div>`;
}

function standardArrayControls() {
  const race = getById(DND_DATA.races, appState.character.raceId);
  const usedScores = getUsedStandardScores();
  const availableScores = DND_DATA.standardArray.filter((score) => !usedScores.includes(score));
  return `<div class="available-scores">Available scores: ${availableScores.length ? availableScores.map((score) => `<span class="score-pill">${score}</span>`).join("") : '<span class="score-pill">None</span>'}</div><div class="ability-controls score-assignment-grid standard-array-grid">${DND_DATA.abilities.map((ability) => {
    const selectedScore = appState.abilityState.standard.assignments[ability];
    const blockedScores = getUsedStandardScores(ability);
    const racialBonus = getRaceAbilityBonus(race, ability);
    return `<label>${ability}${raceAbilityMarker(racialBonus)}<select data-ability-method="${ABILITY_METHODS.standard}" data-ability="${ability}"><option value="">Choose score</option>${DND_DATA.standardArray.map((score) => `<option value="${score}" ${Number(selectedScore) === score ? "selected" : ""} ${blockedScores.includes(score) ? "disabled" : ""}>${formatRacialAdjustedScoreOption(score, racialBonus)}</option>`).join("")}</select></label>`;
  }).join("")}</div>${scoreAssignmentLegend()}<button class="secondary-button" type="button" data-action="randomize-abilities">Randomize Ability Scores</button>`;
}

function rolledScoreControls() {
  const race = getById(DND_DATA.races, appState.character.raceId);
  const rolled = appState.abilityState.rolled;
  const hasRolledScores = rolled.results.length === 6;
  const rollSlots = hasRolledScores
    ? rolled.results
    : Array.from({ length: 6 }, (_, index) => ({ id: `empty-roll-${index + 1}`, dice: [], total: "" }));

  return `<div class="roll-results" aria-label="Rolled ability scores">${rollSlots.map((roll, index) => `<div class="roll-result ${hasRolledScores ? "" : "empty"}"><strong>${hasRolledScores ? `Roll ${index + 1}: ${roll.total}` : ""}</strong><span>${hasRolledScores ? `${roll.dice.join(", ")} -> ${roll.total}` : ""}</span></div>`).join("")}</div><div class="ability-controls score-assignment-grid rolled-assignment-grid">${DND_DATA.abilities.map((ability) => {
    const selectedRollId = rolled.assignments[ability];
    const blockedRollIds = getUsedRollIds(ability);
    const racialBonus = getRaceAbilityBonus(race, ability);
    return `<label>${ability}${raceAbilityMarker(racialBonus)}<select data-ability-method="${ABILITY_METHODS.rolled}" data-ability="${ability}" ${hasRolledScores ? "" : "disabled"}><option value="">Choose rolled score</option>${rolled.results.map((roll, index) => `<option value="${roll.id}" ${selectedRollId === roll.id ? "selected" : ""} ${blockedRollIds.includes(roll.id) ? "disabled" : ""}>${formatRacialAdjustedScoreOption(roll.total, racialBonus)} (Roll ${index + 1})</option>`).join("")}</select></label>`;
  }).join("")}</div>${scoreAssignmentLegend()}${hasRolledScores ? "" : '<button class="secondary-button" type="button" data-action="roll-scores">Roll Six Scores</button>'}${hasRolledScores ? '<button class="secondary-button" type="button" data-action="randomly-assign-rolled">Randomly Assign Scores</button>' : ""}`;
}

function getPointBuySpent() {
  return DND_DATA.abilities.reduce((total, ability) => total + DND_DATA.pointBuyCosts[appState.abilityState.pointBuy.scores[ability]], 0);
}

function getPointBuyRemaining() {
  return DND_DATA.pointBuyTotal - getPointBuySpent();
}

function formatPointBuyModifier(score) {
  const modifier = Math.floor((score - 10) / 2);
  return modifier >= 0 ? `+${modifier}` : String(modifier);
}

function pointChangeLabel(value, isAvailable) {
  if (!isAvailable) return "—";
  return value > 0 ? `+${value}` : String(value);
}

function pointBuyControls() {
  const remaining = getPointBuyRemaining();
  const race = getById(DND_DATA.races, appState.character.raceId);

  return `<div class="point-buy-summary">Points Remaining: ${remaining} / ${DND_DATA.pointBuyTotal}</div><div class="point-buy-grid">${DND_DATA.abilities.map((ability) => {
    const baseScore = appState.abilityState.pointBuy.scores[ability];
    const currentCost = DND_DATA.pointBuyCosts[baseScore];
    const previousCost = DND_DATA.pointBuyCosts[baseScore - 1];
    const nextCost = DND_DATA.pointBuyCosts[baseScore + 1];
    const decreaseRefund = previousCost === undefined ? 0 : currentCost - previousCost;
    const increaseCost = nextCost === undefined ? Infinity : nextCost - currentCost;
    const canIncrease = baseScore < DND_DATA.pointBuyMax && remaining >= increaseCost;
    const canDecrease = baseScore > DND_DATA.pointBuyMin;
    const racialBonus = getRaceAbilityBonus(race, ability);
    const displayedScore = baseScore + racialBonus;
    const minusLabel = pointChangeLabel(decreaseRefund, canDecrease);
    const plusLabel = pointChangeLabel(-increaseCost, canIncrease);

    return `<div class="point-buy-card"><strong class="point-buy-score-line">${ability} Score: ${displayedScore}${raceAbilityMarker(racialBonus)}</strong><span class="point-buy-modifier">Modifier: ${formatPointBuyModifier(displayedScore)}</span><div class="point-buy-actions"><div class="point-buy-action"><button class="secondary-button" type="button" data-point-buy="decrease" data-ability="${ability}" ${canDecrease ? "" : "disabled"}>-</button><span class="point-change-label ${canDecrease ? "" : "unavailable"}">${minusLabel}</span></div><div class="point-buy-action"><button class="secondary-button" type="button" data-point-buy="increase" data-ability="${ability}" ${canIncrease ? "" : "disabled"}>+</button><span class="point-change-label ${canIncrease ? "" : "unavailable"}">${plusLabel}</span></div></div></div>`;
  }).join("")}</div><p class="point-buy-legend">Scores shown include racial bonuses. Point Buy costs use base scores. * = +1 racial bonus; ** = +2 racial bonus.</p>`;
}

function renderAbilityStep(step) {
  const controls = appState.abilityMethod === ABILITY_METHODS.rolled ? rolledScoreControls() : appState.abilityMethod === ABILITY_METHODS.pointBuy ? pointBuyControls() : standardArrayControls();
  wizardStep.innerHTML = `<p class="progress-text">${step.progress}</p><h2>${step.title}</h2>${renderAbilityScoreGuidancePanel()}${methodSelector()}<div class="method-content">${controls}</div><div class="wizard-actions"><button class="secondary-button" type="button" data-action="back">Back</button><button class="primary-button" type="button" data-action="finish" ${hasValidAbilityAssignments() ? "" : "disabled"}>Finish Character</button></div>`;
}
function renderWizard() {
  const step = wizardSteps[appState.wizardStepIndex];
  views.build.classList.toggle("ability-step-active", step.key === "abilities");
  syncAbilityScoresFromState();
  renderPreview(livePreview, appState.character);
  if (step.key === "class") renderClassStep(step);
  if (step.key === "race") renderChoiceStep(step, DND_DATA.races, appState.character.raceId, "race", (item) => item.traits.slice(0, 2).join(", "));
  if (step.key === "background") renderChoiceStep(step, DND_DATA.backgrounds, appState.character.backgroundId, "background", (item) => item.skills.join(", "));
  if (step.key === "classFeature") renderClassFeatureStep(step);
  if (step.key === "abilities") renderAbilityStep(step);
}

function startBuild(character = createBlankCharacter(), stepIndex = 0) {
  appState.character = character;
  appState.abilityMethod = character.abilityScoreMethod || ABILITY_METHODS.standard;
  appState.abilityState = createAbilityState(character);
  appState.wizardStepIndex = stepIndex;
  renderWizard();
  showView("build");
}

function previewRandomizedCharacter(character) {
  appState.character = character;
  appState.abilityMethod = character.abilityScoreMethod || ABILITY_METHODS.standard;
  appState.abilityState = createAbilityState(character);
  recomputeCharacter();
  renderPreview(randomPreview, appState.character);
  showView("preview");
}

function randomChoiceExcept(items, currentId) {
  const otherItems = items.filter((item) => item.id !== currentId);
  return DND_DATA.randomChoice(otherItems.length ? otherItems : items);
}

function getNextStepIndex() {
  const currentKey = wizardSteps[appState.wizardStepIndex].key;
  if (currentKey === "background" && !getClassFeatureChoice(appState.character)) return wizardSteps.findIndex((step) => step.key === "abilities");
  return appState.wizardStepIndex + 1;
}

function getPreviousStepIndex() {
  const currentKey = wizardSteps[appState.wizardStepIndex].key;
  if (currentKey === "abilities" && !getClassFeatureChoice(appState.character)) return wizardSteps.findIndex((step) => step.key === "background");
  return appState.wizardStepIndex - 1;
}

function randomizeCurrentStep() {
  const step = wizardSteps[appState.wizardStepIndex];
  if (step.key === "class") appState.character.classId = randomChoiceExcept(DND_DATA.classes, appState.character.classId).id;
  if (step.key === "race") appState.character.raceId = randomChoiceExcept(DND_DATA.races, appState.character.raceId).id;
  if (step.key === "background") appState.character.backgroundId = randomChoiceExcept(DND_DATA.backgrounds, appState.character.backgroundId).id;
  if (step.key === "classFeature") {
    const choice = getClassFeatureChoice(appState.character);
    appState.character.classFeatures[choice.id] = randomChoiceExcept(choice.options, appState.character.classFeatures[choice.id]).id;
  }
  renderWizard();
}

function randomizeAbilityScores() {
  const scores = [...DND_DATA.standardArray].sort(() => Math.random() - 0.5);
  DND_DATA.abilities.forEach((ability, index) => {
    appState.abilityState.standard.assignments[ability] = scores[index];
  });
  renderWizard();
}

function rollSixScores() {
  appState.abilityState.rolled.results = DND_DATA.rollSixAbilityScores();
  appState.abilityState.rolled.assignments = emptyAbilityScores();
  renderWizard();
}

function randomlyAssignRolledScores() {
  if (appState.abilityState.rolled.results.length !== 6) return;
  appState.abilityState.rolled.assignments = DND_DATA.randomlyAssignRolls(appState.abilityState.rolled.results);
  renderWizard();
}

function adjustPointBuyScore(ability, direction) {
  const pointBuy = appState.abilityState.pointBuy;
  const score = pointBuy.scores[ability];
  const nextScore = direction === "increase" ? score + 1 : score - 1;
  if (nextScore < DND_DATA.pointBuyMin || nextScore > DND_DATA.pointBuyMax) return;
  const costDifference = DND_DATA.pointBuyCosts[nextScore] - DND_DATA.pointBuyCosts[score];
  if (direction === "increase" && getPointBuyRemaining() < costDifference) return;
  pointBuy.scores[ability] = nextScore;
  pointBuy.touched[ability] = true;
  pointBuy.finalized = false;
  renderWizard();
}

function hasValidAbilityAssignments() {
  if (appState.abilityMethod === ABILITY_METHODS.standard) {
    const scores = DND_DATA.abilities.map((ability) => Number(appState.abilityState.standard.assignments[ability]));
    return scores.every((score) => DND_DATA.standardArray.includes(score)) && new Set(scores).size === DND_DATA.standardArray.length;
  }
  if (appState.abilityMethod === ABILITY_METHODS.rolled) {
    const rollIds = appState.abilityState.rolled.results.map((roll) => roll.id);
    const assignedIds = DND_DATA.abilities.map((ability) => appState.abilityState.rolled.assignments[ability]);
    return appState.abilityState.rolled.results.length === 6 && assignedIds.every((id) => rollIds.includes(id)) && new Set(assignedIds).size === DND_DATA.abilities.length;
  }
  if (appState.abilityMethod === ABILITY_METHODS.pointBuy) return getPointBuyRemaining() === 0;
  return false;
}

function finishCharacter() {
  if (!hasValidAbilityAssignments()) return;
  if (appState.abilityMethod === ABILITY_METHODS.pointBuy) appState.abilityState.pointBuy.finalized = true;
  syncAbilityScoresFromState();
  renderPreview(randomPreview, appState.character);
  showView("preview");
}

wizardStep.addEventListener("click", (event) => {
  const optionButton = event.target.closest("[data-option-id]");
  const methodButton = event.target.closest("[data-score-method]");
  const pointBuyButton = event.target.closest("[data-point-buy]");
  const actionButton = event.target.closest("[data-action]");

  if (optionButton) {
    const optionType = optionButton.dataset.optionType;
    const optionId = optionButton.dataset.optionId;
    if (optionType === "class") appState.character.classId = appState.character.classId === optionId ? "" : optionId;
    if (optionType === "race") appState.character.raceId = appState.character.raceId === optionId ? "" : optionId;
    if (optionType === "background") appState.character.backgroundId = appState.character.backgroundId === optionId ? "" : optionId;
    if (optionType === "fightingStyle") appState.character.classFeatures.fightingStyle = appState.character.classFeatures.fightingStyle === optionId ? "" : optionId;
    renderWizard();
    return;
  }

  if (methodButton) {
    appState.abilityMethod = methodButton.dataset.scoreMethod;
    renderWizard();
    return;
  }

  if (pointBuyButton) {
    adjustPointBuyScore(pointBuyButton.dataset.ability, pointBuyButton.dataset.pointBuy);
    return;
  }

  if (!actionButton) return;
  const action = actionButton.dataset.action;
  if (action === "back") {
    appState.wizardStepIndex = getPreviousStepIndex();
    renderWizard();
  }
  if (action === "continue") {
    appState.wizardStepIndex = getNextStepIndex();
    renderWizard();
  }
  if (action === "randomize-current") randomizeCurrentStep();
  if (action === "randomize-abilities") randomizeAbilityScores();
  if (action === "roll-scores") rollSixScores();
  if (action === "randomly-assign-rolled") randomlyAssignRolledScores();
  if (action === "finish") finishCharacter();
});

wizardStep.addEventListener("change", (event) => {
  if (!event.target.matches("[data-ability]")) return;
  const method = event.target.dataset.abilityMethod;
  const ability = event.target.dataset.ability;
  if (method === ABILITY_METHODS.standard) appState.abilityState.standard.assignments[ability] = event.target.value ? Number(event.target.value) : "";
  if (method === ABILITY_METHODS.rolled) appState.abilityState.rolled.assignments[ability] = event.target.value;
  renderWizard();
});

homeButton.addEventListener("click", () => showView("home"));
buildButton.addEventListener("click", () => startBuild());
randomizeButton.addEventListener("click", () => showView("randomize"));
randomizeBackButton.addEventListener("click", () => showView("home"));
rollCharacterButton.addEventListener("click", () => previewRandomizedCharacter(DND_DATA.randomizeRolledCharacter()));
standardCharacterButton.addEventListener("click", () => previewRandomizedCharacter(DND_DATA.randomizeStandardArrayCharacter()));
editRandomButton.addEventListener("click", () => startBuild(appState.character));

syncAbilityScoresFromState();
renderPreview(livePreview, appState.character);











