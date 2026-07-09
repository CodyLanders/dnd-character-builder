const wizardSteps = [
  { key: "class", title: "Pick Your Class", progress: "Step 1 of 9 - Class" },
  { key: "race", title: "Pick Your Race", progress: "Step 2 of 9 - Race" },
  { key: "background", title: "Pick Your Background", progress: "Step 3 of 9 - Background" },
  { key: "classFeature", title: "Choose Your Level 1 Class Choice", progress: "Step 4 of 9 - Level 1 Class Choice" },
  { key: "equipment", title: "Choose Your Starting Equipment", progress: "Step 5 of 9 - Starting Equipment" },
  { key: "abilities", title: "Assign Your Ability Scores", progress: "Step 6 of 9 - Ability Scores" },
  { key: "skills", title: "Choose Skills & Proficiencies", progress: "Step 7 of 9 - Skills & Proficiencies" },
  { key: "spellSelection", title: "Choose Wizard Spells", progress: "Step 8 of 9 - Spell Selection" },
  { key: "finishing", title: "Finishing Touches", progress: "Step 9 of 9 - Finishing Touches" },
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
  equipment: "Choose the starting equipment granted by your class. Background equipment is added automatically.",
  skills: "Choose the skill proficiencies granted by your class. Skills from your race and background are already included and cannot be chosen again.",
  spellSelection: "Choose the cantrips and level 1 spells written in your wizard's spellbook. Prepared spell selection will come later.",
  finishing: "Choose any remaining languages, tools, and character details before finishing.",
};

const ABILITY_METHODS = {
  standard: "standard-array",
  rolled: "rolled",
  pointBuy: "point-buy",
};

const EQUIPMENT_METHODS = {
  take: "take-equipment",
  gold: "rolled-starting-gold",
};

const AUTOSAVE_KEY = "dnd-character-builder-save";

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
const randomEquipmentPrompt = document.querySelector("#randomEquipmentPrompt");
const randomEquipmentBackButton = document.querySelector("#randomEquipmentBackButton");
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
    equipmentSelections: { classId: "", method: EQUIPMENT_METHODS.take, choices: {}, rolledGold: null, startingGoldRerollCount: 0 },
    equipment: [],
    spellcasting: { cantrips: [], spellbookSpells: [] },
    abilityScoreRerollCount: 0,
    finishingTouches: { choices: {}, alignment: {}, personality: {}, trinket: {} },
    notes: "Stage 1 wizard character",
  };
}

function createAbilityState(character = null) {
  const state = {
    standard: { assignments: emptyAbilityScores() },
    rolled: { results: [], assignments: emptyAbilityScores(), rerollCount: 0 },
    pointBuy: { scores: emptyAbilityScores(8), touched: emptyAbilityScores(false), finalized: false },
  };

  if (!character) return state;

  if (character.abilityScoreMethod === ABILITY_METHODS.rolled) {
    state.rolled.results = (character.rolledScores || []).map((roll) => ({ ...roll }));
    state.rolled.rerollCount = Number.isInteger(character.abilityScoreRerollCount) ? character.abilityScoreRerollCount : 0;
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
  pendingRandomAbilityMethod: "",
  openFinishingPicker: "",
  confirmBlankName: false,
};

function normalizeAbilityMap(source, fallbackValue = "") {
  return DND_DATA.abilities.reduce((scores, ability) => {
    scores[ability] = source && source[ability] !== undefined ? source[ability] : fallbackValue;
    return scores;
  }, {});
}

function normalizeCharacter(savedCharacter = {}) {
  const blank = createBlankCharacter();
  const savedEquipment = savedCharacter.equipmentSelections || {};
  const equipmentMethod = Object.values(EQUIPMENT_METHODS).includes(savedEquipment.method) ? savedEquipment.method : EQUIPMENT_METHODS.take;
  return {
    ...blank,
    ...savedCharacter,
    classFeatures: { ...blank.classFeatures, ...(savedCharacter.classFeatures || {}) },
    skillProficiencies: { ...blank.skillProficiencies, ...(savedCharacter.skillProficiencies || {}) },
    classSkillProficiencies: { ...blank.classSkillProficiencies, ...(savedCharacter.classSkillProficiencies || {}) },
    expertise: { ...blank.expertise, ...(savedCharacter.expertise || {}) },
    savingThrowProficiencies: { ...blank.savingThrowProficiencies, ...(savedCharacter.savingThrowProficiencies || {}) },
    savingThrowExpertise: { ...blank.savingThrowExpertise, ...(savedCharacter.savingThrowExpertise || {}) },
    baseAbilities: normalizeAbilityMap(savedCharacter.baseAbilities),
    abilities: normalizeAbilityMap(savedCharacter.abilities),
    equipmentSelections: {
      classId: savedEquipment.classId || savedCharacter.classId || "",
      method: equipmentMethod,
      choices: savedEquipment.choices || {},
      rolledGold: savedEquipment.rolledGold || null,
      startingGoldRerollCount: Number.isInteger(savedEquipment.startingGoldRerollCount) ? savedEquipment.startingGoldRerollCount : 0,
    },
    equipment: Array.isArray(savedCharacter.equipment) ? savedCharacter.equipment : [],
    spellcasting: {
      cantrips: Array.isArray(savedCharacter.spellcasting && savedCharacter.spellcasting.cantrips) ? savedCharacter.spellcasting.cantrips : [],
      spellbookSpells: Array.isArray(savedCharacter.spellcasting && savedCharacter.spellcasting.spellbookSpells) ? savedCharacter.spellcasting.spellbookSpells : [],
    },
    abilityScoreRerollCount: Number.isInteger(savedCharacter.abilityScoreRerollCount) ? savedCharacter.abilityScoreRerollCount : 0,
    finishingTouches: {
      choices: { ...((savedCharacter.finishingTouches && savedCharacter.finishingTouches.choices) || {}) },
      alignment: { ...((savedCharacter.finishingTouches && savedCharacter.finishingTouches.alignment) || {}) },
      personality: { ...((savedCharacter.finishingTouches && savedCharacter.finishingTouches.personality) || {}) },
      trinket: { ...((savedCharacter.finishingTouches && savedCharacter.finishingTouches.trinket) || {}) },
    },
  };
}

function normalizeAbilityState(savedAbilityState = {}) {
  const blank = createAbilityState();
  return {
    standard: {
      assignments: normalizeAbilityMap(savedAbilityState.standard && savedAbilityState.standard.assignments),
    },
    rolled: {
      results: Array.isArray(savedAbilityState.rolled && savedAbilityState.rolled.results)
        ? savedAbilityState.rolled.results.map((roll) => ({ ...roll }))
        : blank.rolled.results,
      assignments: normalizeAbilityMap(savedAbilityState.rolled && savedAbilityState.rolled.assignments),
      rerollCount: Number.isInteger(savedAbilityState.rolled && savedAbilityState.rolled.rerollCount) ? savedAbilityState.rolled.rerollCount : 0,
    },
    pointBuy: {
      scores: normalizeAbilityMap(savedAbilityState.pointBuy && savedAbilityState.pointBuy.scores, 8),
      touched: normalizeAbilityMap(savedAbilityState.pointBuy && savedAbilityState.pointBuy.touched, false),
      finalized: Boolean(savedAbilityState.pointBuy && savedAbilityState.pointBuy.finalized),
    },
  };
}

function getActiveViewName() {
  return Object.entries(views).find(([, view]) => !view.classList.contains("hidden"))?.[0] || "home";
}

function hasMeaningfulProgress() {
  const character = appState.character;
  const equipmentChoices = character.equipmentSelections && character.equipmentSelections.choices
    ? Object.keys(character.equipmentSelections.choices).length
    : 0;
  const rolledStartingGold = character.equipmentSelections && character.equipmentSelections.method === EQUIPMENT_METHODS.gold;
  const classFeatureChoices = Object.values(character.classFeatures || {}).some(Boolean);
  const standardAssignments = Object.values(appState.abilityState.standard.assignments || {}).some((value) => value !== "");
  const rolledScores = appState.abilityState.rolled.results.length > 0;
  const rolledAssignments = Object.values(appState.abilityState.rolled.assignments || {}).some(Boolean);
  const pointBuyTouched = Object.values(appState.abilityState.pointBuy.touched || {}).some(Boolean);
  const finishingTouches = character.finishingTouches || {};
  const finishingChoices = Object.values(finishingTouches.choices || {}).some(Boolean);
  const alignmentChoice = finishingTouches.alignment && (finishingTouches.alignment.selected || finishingTouches.alignment.skipped);
  const personalityChoices = Object.values(finishingTouches.personality || {}).some((entry) => entry && (entry.selected || entry.custom || entry.skipped));
  const trinketChoice = finishingTouches.trinket && finishingTouches.trinket.id;
  const spellcasting = character.spellcasting || {};
  const spellChoices = [...(spellcasting.cantrips || []), ...(spellcasting.spellbookSpells || [])].some(Boolean);

  return Boolean(
    character.classId
    || character.raceId
    || character.backgroundId
    || classFeatureChoices
    || equipmentChoices
    || rolledStartingGold
    || standardAssignments
    || rolledScores
    || rolledAssignments
    || pointBuyTouched
    || appState.abilityState.pointBuy.finalized
    || spellChoices
    || finishingChoices
    || alignmentChoice
    || personalityChoices
    || trinketChoice
  );
}

function saveProgress() {
  if (!hasMeaningfulProgress()) {
    clearSavedProgress();
    return;
  }
  try {
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({
      version: 1,
      savedAt: new Date().toISOString(),
      currentView: getActiveViewName(),
      wizardStepIndex: appState.wizardStepIndex,
      character: appState.character,
      abilityMethod: appState.abilityMethod,
      abilityState: appState.abilityState,
    }));
  } catch (error) {
    console.warn("Unable to autosave character progress.", error);
  }
}

function clearSavedProgress() {
  try {
    localStorage.removeItem(AUTOSAVE_KEY);
  } catch (error) {
    console.warn("Unable to clear saved character progress.", error);
  }
}

function loadSavedProgress() {
  try {
    const rawSave = localStorage.getItem(AUTOSAVE_KEY);
    return rawSave ? JSON.parse(rawSave) : null;
  } catch (error) {
    console.warn("Unable to restore saved character progress.", error);
    clearSavedProgress();
    return null;
  }
}

function restoreSavedProgress() {
  const saved = loadSavedProgress();
  if (!saved || !saved.character) return false;
  appState.character = normalizeCharacter(saved.character);
  appState.abilityMethod = Object.values(ABILITY_METHODS).includes(saved.abilityMethod)
    ? saved.abilityMethod
    : appState.character.abilityScoreMethod || ABILITY_METHODS.standard;
  appState.abilityState = normalizeAbilityState(saved.abilityState);
  appState.wizardStepIndex = Number.isInteger(saved.wizardStepIndex)
    ? Math.min(Math.max(saved.wizardStepIndex, 0), wizardSteps.length - 1)
    : 0;
  return true;
}

function getById(collection, id) {
  return collection.find((item) => item.id === id);
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function showView(viewName) {
  Object.values(views).forEach((view) => view.classList.add("hidden"));
  views[viewName].classList.remove("hidden");
  scrollToCurrentViewTop();
}

function showRandomAbilityPrompt() {
  appState.pendingRandomAbilityMethod = "";
  document.querySelector(".random-ability-options")?.classList.remove("hidden");
  randomEquipmentPrompt?.classList.add("hidden");
}

function showRandomEquipmentPrompt(abilityMethod) {
  appState.pendingRandomAbilityMethod = abilityMethod;
  document.querySelector(".random-ability-options")?.classList.add("hidden");
  randomEquipmentPrompt?.classList.remove("hidden");
  scrollWindowToTop();
}

function generateRandomCharacter(equipmentMethod) {
  const options = { equipmentMethod };
  const character = appState.pendingRandomAbilityMethod === ABILITY_METHODS.rolled
    ? DND_DATA.randomizeRolledCharacter(options)
    : DND_DATA.randomizeStandardArrayCharacter(options);
  showRandomAbilityPrompt();
  previewRandomizedCharacter(character);
}

function scrollWindowToTop() {
  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  });
}

function scrollToCurrentViewTop() {
  scrollWindowToTop();
}

function scrollBuilderStepToTop() {
  scrollWindowToTop();
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
  const rerollNote = character.abilityScoreMethod === ABILITY_METHODS.rolled
    ? `<p class="ability-reroll-note">Reroll Attempts: ${character.abilityScoreRerollCount || 0}</p>`
    : "";
  return `
    <h3>Ability Scores</h3>
    ${rerollNote}
    <table class="ability-table">
      <thead><tr><th>Ability</th><th>Score</th><th>Mod</th></tr></thead>
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

function getClassFeatureChoiceGroups(character) {
  const choice = getClassFeatureChoice(character);
  if (!choice) return [];
  return Array.isArray(choice.groups) ? choice.groups : [choice];
}

function getSelectedFightingStyle(character) {
  const selectedId = character.classFeatures.fightingStyle;
  return DND_DATA.classFeatureChoices.fighter.options.find((option) => option.id === selectedId);
}

function resetClassFeatureSelections(character) {
  character.classFeatures = { fightingStyle: "" };
}

function getSelectedClassFeatureOption(character, group) {
  const selectedId = character.classFeatures[group.id];
  return group.options.find((option) => option.id === selectedId) || null;
}

function hasCompleteClassFeatureGroup(character, group) {
  const selectedOption = getSelectedClassFeatureOption(character, group);
  if (!selectedOption) return false;
  if (group.humanoidChoices && selectedOption.id === "humanoids") {
    const selectedHumanoids = group.humanoidChoices.fields.map((field) => character.classFeatures[field.id]).filter(Boolean);
    return selectedHumanoids.length === group.humanoidChoices.fields.length && new Set(selectedHumanoids).size === selectedHumanoids.length;
  }
  return true;
}

function hasCompleteClassFeatureChoices(character) {
  return getClassFeatureChoiceGroups(character).every((group) => hasCompleteClassFeatureGroup(character, group));
}

function getEquipmentDefinition(classId) {
  return DND_DATA.startingEquipment[classId] || null;
}

function getEquipmentSelections(character) {
  if (!character.equipmentSelections || character.equipmentSelections.classId !== character.classId) {
    character.equipmentSelections = { classId: character.classId, method: EQUIPMENT_METHODS.take, choices: {}, rolledGold: null, startingGoldRerollCount: 0 };
  }
  if (!Object.values(EQUIPMENT_METHODS).includes(character.equipmentSelections.method)) character.equipmentSelections.method = EQUIPMENT_METHODS.take;
  if (!character.equipmentSelections.choices) character.equipmentSelections.choices = {};
  if (!Number.isInteger(character.equipmentSelections.startingGoldRerollCount)) character.equipmentSelections.startingGoldRerollCount = 0;
  return character.equipmentSelections;
}

function resetEquipmentSelections(character) {
  character.equipmentSelections = { classId: character.classId, method: EQUIPMENT_METHODS.take, choices: {}, rolledGold: null, startingGoldRerollCount: 0 };
}

function getEquipmentMethod(character) {
  return getEquipmentSelections(character).method;
}

function usesRolledStartingGold(character) {
  return getEquipmentMethod(character) === EQUIPMENT_METHODS.gold;
}

function ensureRolledStartingGold(character) {
  const selections = getEquipmentSelections(character);
  if (!selections.rolledGold) selections.rolledGold = DND_DATA.rollStartingWealth(character.classId);
  return selections.rolledGold;
}

function rerollStartingGold(character) {
  const selections = getEquipmentSelections(character);
  selections.rolledGold = DND_DATA.rollStartingWealth(character.classId);
  selections.startingGoldRerollCount += 1;
}

function getSelectedEquipmentOption(group, selections) {
  const selected = selections.choices[group.id];
  if (!selected) return null;
  return group.options.find((option) => option.id === selected.optionId) || null;
}

function formatEquipmentItem(item) {
  if (!item) return "";
  if (item.detail) return item.detail;
  if (item.type === "weapon" && item.damage) {
    const details = [item.damageType, ...(item.properties || [])].filter(Boolean).join(", ");
    return `${item.name} &mdash; ${item.damage}${details ? ` ${details}` : ""}`;
  }
  if (item.type === "shield") return `${item.name} (+2 AC)`;
  return item.name;
}

function getDropdownItems(option, selectedChoice = {}) {
  return (option.dropdowns || []).map((dropdown) => DND_DATA.getEquipmentItem(selectedChoice[dropdown.id])).filter(Boolean);
}

function getOptionItems(option, selectedChoice = {}) {
  const fixedItems = (option.items || []).map((itemId) => DND_DATA.getEquipmentItem(itemId)).filter(Boolean);
  return [...fixedItems, ...getDropdownItems(option, selectedChoice)];
}

function getClassEquipmentItems(character, requireComplete = false) {
  if (usesRolledStartingGold(character)) return [];
  const definition = getEquipmentDefinition(character.classId);
  if (!definition) return [];
  const selections = getEquipmentSelections(character);
  const fixedItems = (definition.fixed || []).map((itemId) => DND_DATA.getEquipmentItem(itemId)).filter(Boolean);
  const selectedItems = [];

  definition.choices.forEach((group) => {
    const selectedChoice = selections.choices[group.id] || {};
    const option = getSelectedEquipmentOption(group, selections);
    if (!option) return;
    selectedItems.push(...getOptionItems(option, selectedChoice));
  });

  if (requireComplete && !hasCompleteEquipmentSelections(character)) return [];
  return [...selectedItems, ...fixedItems];
}

function getBackgroundEquipmentItems(character) {
  if (usesRolledStartingGold(character)) return [];
  const background = getById(DND_DATA.backgrounds, character.backgroundId);
  return background ? background.equipment || [] : [];
}

function getAllEquipmentItems(character) {
  return [...getClassEquipmentItems(character), ...getBackgroundEquipmentItems(character)];
}

function hasCompleteEquipmentSelections(character) {
  if (usesRolledStartingGold(character)) return true;
  const definition = getEquipmentDefinition(character.classId);
  if (!definition) return false;
  const selections = getEquipmentSelections(character);

  return definition.choices.every((group) => {
    const selectedChoice = selections.choices[group.id];
    if (!selectedChoice || !selectedChoice.optionId) return false;
    const option = group.options.find((item) => item.id === selectedChoice.optionId);
    if (!option) return false;
    return (option.dropdowns || []).every((dropdown) => selectedChoice[dropdown.id]);
  });
}

function getArmorInfo(equipmentItems) {
  const armor = equipmentItems.find((item) => item && item.type === "armor" && item.armorClass);
  if (armor) return { name: armor.name, baseAc: armor.armorClass.base, usesDex: armor.armorClass.dex, dexMax: armor.armorClass.dexMax, isArmor: true };
  return { name: "None", baseAc: 10, usesDex: true, isArmor: false };
}

function calculateArmorClass(character) {
  const equipmentItems = getClassEquipmentItems(character);
  const armor = getArmorInfo(equipmentItems);
  const shieldBonus = equipmentItems.some((item) => item && item.type === "shield") ? 2 : 0;
  const defenseBonus = character.classFeatures.fightingStyle === "defense" && armor.isArmor ? 1 : 0;
  const rawDexBonus = armor.usesDex ? abilityModifierValue(character.abilities.Dexterity) : 0;
  const dexBonus = Number.isInteger(armor.dexMax) ? Math.min(rawDexBonus, armor.dexMax) : rawDexBonus;
  const conBonus = character.classId === "barbarian" && !armor.isArmor ? abilityModifierValue(character.abilities.Constitution) : 0;
  const wisBonus = character.classId === "monk" && !armor.isArmor ? abilityModifierValue(character.abilities.Wisdom) : 0;
  return { total: armor.baseAc + dexBonus + conBonus + wisBonus + shieldBonus + defenseBonus, defenseBonus };
}

function calculateInitiative(character) {
  const dexModifier = abilityModifierValue(character.abilities.Dexterity);
  return dexModifier >= 0 ? `+${dexModifier}` : String(dexModifier);
}

function formatSpeed(race) {
  return race && race.speed ? `${race.speed} ft.` : "Not selected";
}

function getProficiencyBonus(character) {
  return character.level >= 1 ? 2 : 0;
}

function getLevelOneSpellcasting(character, characterClass = null) {
  const classId = characterClass ? characterClass.id : character.classId;
  const metadata = characterClass && characterClass.spellcasting
    ? characterClass.spellcasting
    : DND_DATA.levelOneSpellcasting[classId];
  return metadata || { hasLevelOneSpellcasting: false };
}

function hasLevelOneSpellcasting(character, characterClass = null) {
  return Boolean(getLevelOneSpellcasting(character, characterClass).hasLevelOneSpellcasting);
}

function getSpellcastingAbility(character, characterClass = null) {
  return getLevelOneSpellcasting(character, characterClass).ability || "";
}

function getSpellcastingCantripCount(character, characterClass = null) {
  return getLevelOneSpellcasting(character, characterClass).cantripsKnown || 0;
}

function getLevelOneSpellSlotCount(character, characterClass = null) {
  return getLevelOneSpellcasting(character, characterClass).levelOneSpellSlots || 0;
}

function getSpellcastingMagicType(character, characterClass = null) {
  return getLevelOneSpellcasting(character, characterClass).magicType || "";
}

function supportsSpellSelection(character, characterClass = null) {
  const classId = characterClass ? characterClass.id : character.classId;
  return hasLevelOneSpellcasting(character, characterClass) && DND_DATA.supportedSpellSelectionClasses.includes(classId);
}

function getSpellcastingSelections(character) {
  if (!character.spellcasting) character.spellcasting = { cantrips: [], spellbookSpells: [] };
  if (!Array.isArray(character.spellcasting.cantrips)) character.spellcasting.cantrips = [];
  if (!Array.isArray(character.spellcasting.spellbookSpells)) character.spellcasting.spellbookSpells = [];
  return character.spellcasting;
}

function resetSpellSelections(character) {
  character.spellcasting = { cantrips: [], spellbookSpells: [] };
}

function getSpellSelectionRule(character) {
  return DND_DATA.spellSelectionRules[character.classId] || { cantrips: 0, spellbookSpells: 0 };
}

function getSelectedSpellIds(character, selectionType) {
  return getSpellcastingSelections(character)[selectionType] || [];
}

function getSpellOptionsForSelection(character, selectionType) {
  const level = selectionType === "cantrips" ? 0 : 1;
  return DND_DATA.getSpellsForClassLevel(character.classId, level);
}

function hasCompleteSpellSelection(character) {
  const characterClass = getById(DND_DATA.classes, character.classId);
  if (!supportsSpellSelection(character, characterClass)) return true;
  const rules = getSpellSelectionRule(character);
  const selections = getSpellcastingSelections(character);
  return selections.cantrips.length === rules.cantrips && selections.spellbookSpells.length === rules.spellbookSpells;
}

function spellSelectionValidationMessage(character) {
  const rules = getSpellSelectionRule(character);
  const selections = getSpellcastingSelections(character);
  const missingCantrips = Math.max(rules.cantrips - selections.cantrips.length, 0);
  const missingSpells = Math.max(rules.spellbookSpells - selections.spellbookSpells.length, 0);
  const messages = [];
  if (missingCantrips) messages.push(`${missingCantrips} more ${missingCantrips === 1 ? "cantrip" : "cantrips"}`);
  if (missingSpells) messages.push(`${missingSpells} more spellbook ${missingSpells === 1 ? "spell" : "spells"}`);
  return messages.length ? `Choose ${messages.join(" and ")}.` : "";
}

function setRandomSpellSelections(character) {
  character.spellcasting = DND_DATA.randomSpellSelectionForClass(character.classId);
}

function toggleSpellSelection(character, selectionType, spellId) {
  const rules = getSpellSelectionRule(character);
  const limit = rules[selectionType] || 0;
  const selections = getSpellcastingSelections(character);
  const current = selections[selectionType] || [];
  if (current.includes(spellId)) {
    selections[selectionType] = current.filter((id) => id !== spellId);
    return;
  }
  if (current.length >= limit) return;
  const validIds = new Set(getSpellOptionsForSelection(character, selectionType).map((spell) => spell.id));
  if (validIds.has(spellId)) selections[selectionType] = [...current, spellId];
}

function formatSpellAttackBonus(value) {
  return value >= 0 ? `+${value}` : String(value);
}

function calculateSpellSaveDc(character, characterClass = null) {
  const ability = getSpellcastingAbility(character, characterClass);
  if (!ability || !hasAssignedAbilityScore(character, ability)) return "";
  return 8 + getProficiencyBonus(character) + abilityModifierValue(character.abilities[ability]);
}

function calculateSpellAttackBonus(character, characterClass = null) {
  const ability = getSpellcastingAbility(character, characterClass);
  if (!ability || !hasAssignedAbilityScore(character, ability)) return "";
  return formatSpellAttackBonus(getProficiencyBonus(character) + abilityModifierValue(character.abilities[ability]));
}

function calculateHitPoints(character, characterClass) {
  if (!characterClass) return "Not selected";
  if (!hasAssignedAbilityScore(character, "Constitution")) return "Assign Constitution";
  return characterClass.hitDie + abilityModifierValue(character.abilities.Constitution);
}

function formatHitDice(character, characterClass) {
  if (!characterClass) return "Not selected";
  return `${character.level || 1}d${characterClass.hitDie}`;
}

function calculatePassivePerception(character, race, background) {
  if (!hasAssignedAbilityScore(character, "Wisdom")) return "Assign Wisdom";
  const skillLevels = getSkillProficiencyLevels(character, race, background);
  return 10 + abilityModifierValue(character.abilities.Wisdom) + getProficiencyBonus(character) * (skillLevels.Perception || 0);
}

function formatSenses(race) {
  if (!race) return "Not selected";
  if (race.senses && race.senses.length) return race.senses.join(", ");
  return (race.traits || []).includes("Darkvision") ? "Darkvision 60 ft." : "Normal vision";
}

function getStartingGoldGp(character) {
  if (usesRolledStartingGold(character)) return 0;
  const background = getById(DND_DATA.backgrounds, character.backgroundId);
  const startingGold = background ? Number(background.startingGoldGp) : 0;
  return Number.isFinite(startingGold) && startingGold > 0 ? startingGold : 0;
}

function getRolledStartingGoldGp(character) {
  if (!usesRolledStartingGold(character)) return 0;
  const rolledGold = ensureRolledStartingGold(character);
  return Number.isFinite(Number(rolledGold.totalGp)) ? Number(rolledGold.totalGp) : 0;
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
      <thead><tr><th>Prof</th><th>Ability</th><th>Mod</th></tr></thead>
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
      <thead><tr><th>Prof</th><th>Skill</th><th>Mod</th><th>Ability</th></tr></thead>
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

function resetSkillSelections(character) {
  character.classSkillProficiencies = {};
}

function getClassSkillChoice(character) {
  const characterClass = getById(DND_DATA.classes, character.classId);
  return characterClass ? characterClass.skillChoices || { choose: 0, options: [] } : { choose: 0, options: [] };
}

function getSelectedClassSkillNames(character) {
  const allowedSkills = new Set(getClassSkillChoice(character).options);
  return Object.entries(character.classSkillProficiencies || {})
    .filter(([skillName, level]) => allowedSkills.has(skillName) && Number(level) > 0)
    .map(([skillName]) => skillName);
}

function getGrantedSkillSources(skillName, race, background) {
  const sources = [];
  const raceSkills = [...(race ? race.skills || [] : []), ...Object.keys(normalizeSkillSource(race ? race.skillProficiencies : {}))];
  const backgroundSkills = background ? background.skills || [] : [];
  if (backgroundSkills.includes(skillName)) sources.push("Background");
  if (raceSkills.includes(skillName)) sources.push("Race");
  return sources;
}

function getSkillBonus(character, skill, proficiencyLevel = 0) {
  return abilityModifierValue(character.abilities[skill.ability]) + getProficiencyBonus(character) * proficiencyLevel;
}

function formatSkillModifier(value) {
  return value >= 0 ? `+${value}` : String(value);
}

function getSkillTags(character, skill, isAlreadyProficient) {
  const characterClass = getById(DND_DATA.classes, character.classId);
  const classFitSkills = {
    fighter: ["Athletics", "Perception", "Intimidation", "Acrobatics"],
    barbarian: ["Athletics", "Perception", "Survival", "Intimidation"],
    rogue: ["Stealth", "Sleight of Hand", "Perception", "Investigation", "Deception"],
    monk: ["Acrobatics", "Stealth", "Insight", "Athletics"],
    paladin: ["Athletics", "Persuasion", "Insight", "Religion"],
    ranger: ["Perception", "Survival", "Stealth", "Nature"],
  };
  const tags = [];
  if (isAlreadyProficient) tags.push("Already Proficient");
  if (characterClass && (classFitSkills[characterClass.id] || []).includes(skill.name)) tags.push("Class Fit");
  return tags;
}

function hasCompleteSkillSelections(character) {
  const choice = getClassSkillChoice(character);
  return getSelectedClassSkillNames(character).length === choice.choose;
}

function setRandomClassSkillSelections(character) {
  const choice = getClassSkillChoice(character);
  const race = getById(DND_DATA.races, character.raceId);
  const background = getById(DND_DATA.backgrounds, character.backgroundId);
  const availableSkills = DND_DATA.shuffle(choice.options.filter((skillName) => !getGrantedSkillSources(skillName, race, background).length));
  character.classSkillProficiencies = {};
  availableSkills.slice(0, choice.choose).forEach((skillName) => {
    character.classSkillProficiencies[skillName] = 1;
  });
}

function renderSkillCard(skillName, race, background, options = {}) {
  const skill = DND_DATA.skills.find((item) => item.name === skillName);
  if (!skill) return "";
  const selectedSkills = getSelectedClassSkillNames(appState.character);
  const isSelected = selectedSkills.includes(skillName);
  const grantedSources = getGrantedSkillSources(skillName, race, background);
  const isAlreadyProficient = grantedSources.length > 0;
  const currentLevel = isAlreadyProficient || isSelected ? 1 : 0;
  const totalBonus = getSkillBonus(appState.character, skill, currentLevel);
  const choice = getClassSkillChoice(appState.character);
  const isAtLimit = selectedSkills.length >= choice.choose && !isSelected;
  const disabled = isAlreadyProficient || isAtLimit || options.informational;
  const note = isAlreadyProficient ? `Already proficient from ${grantedSources.join(" and ")}` : "";
  const tags = getSkillTags(appState.character, skill, isAlreadyProficient);
  const classFitTag = !isAlreadyProficient && tags.includes("Class Fit") ? '<span class="skill-inline-tag">Class Fit</span>' : "";
  const secondaryTags = tags.filter((tag) => tag !== "Class Fit");

  return `
    <button class="skill-choice-card ${isSelected ? "selected" : ""} ${isAlreadyProficient ? "already-proficient" : ""}" type="button" data-skill-choice="${skillName}" ${disabled ? "disabled" : ""} aria-pressed="${isSelected}">
      <span class="skill-choice-main">
        <strong>${skill.name}</strong>
        <span class="skill-choice-spacer">${classFitTag}</span>
        <span class="skill-modifier">${DND_DATA.abilityShortLabels[skill.ability]}: ${formatSkillModifier(totalBonus)}</span>
      </span>
      ${note ? `<span class="skill-choice-note">${note}</span>` : ""}
      ${secondaryTags.length ? `<span class="skill-tags">${secondaryTags.map((tag) => `<span>${tag}</span>`).join("")}</span>` : ""}
    </button>
  `;
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
    appState.character.rolledScores = appState.abilityState.rolled.results.map((roll) => ({ ...roll }));
    appState.character.rolledAssignments = { ...appState.abilityState.rolled.assignments };
    appState.character.abilityScoreRerollCount = appState.abilityState.rolled.rerollCount;
  }

  if (appState.abilityMethod === ABILITY_METHODS.pointBuy) {
    DND_DATA.abilities.forEach((ability) => {
      const isReady = appState.abilityState.pointBuy.touched[ability] || appState.abilityState.pointBuy.finalized;
      baseAbilities[ability] = isReady ? appState.abilityState.pointBuy.scores[ability] : "";
    });
  }

  appState.character.abilityScoreMethod = appState.abilityMethod;
  if (appState.abilityMethod !== ABILITY_METHODS.rolled) {
    appState.character.rolledScores = [];
    appState.character.rolledAssignments = {};
    appState.character.abilityScoreRerollCount = 0;
  }
  appState.character.baseAbilities = baseAbilities;
  recomputeCharacter();
}

function recomputeCharacter() {
  appState.character.abilities = DND_DATA.applyRaceIncreases(appState.character.baseAbilities, appState.character.raceId);
  if (appState.character.classId !== "fighter") appState.character.classFeatures.fightingStyle = "";
  getEquipmentSelections(appState.character);
  appState.character.equipment = getAllEquipmentItems(appState.character).map((item) => typeof item === "string" ? item : item.name);
}

function renderEquipmentList(items, emptyText, useFacts = true) {
  if (!items.length) return `<ul class="plain-list"><li>${emptyText}</li></ul>`;
  return `<ul class="plain-list">${items.map((item) => `<li>${typeof item === "string" ? item : useFacts ? formatEquipmentItem(item) : item.name}</li>`).join("")}</ul>`;
}

function getPreviewEquipmentItems(character) {
  const classItems = hasCompleteEquipmentSelections(character) ? getClassEquipmentItems(character) : [];
  return [...classItems, ...getBackgroundEquipmentItems(character)];
}

function hasPreviewItem(items, itemId) {
  return items.some((item) => typeof item !== "string" && item.id === itemId);
}

function hasWeaponProperty(item, property) {
  return item.properties && item.properties.some((itemProperty) => itemProperty.startsWith(property));
}

function getVersatileDamage(item) {
  const versatileProperty = (item.properties || []).find((property) => property.startsWith("versatile "));
  return versatileProperty ? versatileProperty.replace("versatile ", "") : "";
}

function getWeaponAbilityInfo(character, item) {
  const strengthModifier = abilityModifierValue(character.abilities.Strength);
  const dexterityModifier = abilityModifierValue(character.abilities.Dexterity);
  if (hasWeaponProperty(item, "finesse")) {
    return strengthModifier > dexterityModifier
      ? { ability: "Strength", modifier: strengthModifier, isFinesse: true }
      : { ability: "Dexterity", modifier: dexterityModifier, isFinesse: true };
  }
  if (hasWeaponProperty(item, "ranged")) return { ability: "Dexterity", modifier: dexterityModifier, isFinesse: false };
  return { ability: "Strength", modifier: strengthModifier, isFinesse: false };
}

function formatAttackBonus(value) {
  return value >= 0 ? `+${value}` : String(value);
}

function getFightingStyle(character) {
  return character.classId === "fighter" && character.classFeatures ? character.classFeatures.fightingStyle : "";
}

function isRangedWeapon(item) {
  return hasWeaponProperty(item, "ranged");
}

function isMeleeWeapon(item) {
  return item.melee || (!isRangedWeapon(item) && item.type === "weapon");
}

function fighterHasMainWeaponAndShield(character) {
  return character.equipmentSelections
    && character.equipmentSelections.choices
    && character.equipmentSelections.choices.mainWeapons
    && character.equipmentSelections.choices.mainWeapons.optionId === "weapon-shield";
}

function shouldApplyArchery(character, item) {
  return getFightingStyle(character) === "archery" && isRangedWeapon(item);
}

function shouldApplyDueling(character, item, rowType) {
  return getFightingStyle(character) === "dueling"
    && rowType === "main"
    && fighterHasMainWeaponAndShield(character)
    && isMeleeWeapon(item)
    && !isRangedWeapon(item)
    && !hasWeaponProperty(item, "two-handed");
}

function shouldApplyGreatWeaponFighting(character, item, rowType) {
  return getFightingStyle(character) === "great-weapon-fighting"
    && isMeleeWeapon(item)
    && !isRangedWeapon(item)
    && (rowType === "versatile" || hasWeaponProperty(item, "two-handed"));
}

function getWeaponAttackBonus(character, item) {
  const styleBonus = shouldApplyArchery(character, item) ? 2 : 0;
  return formatAttackBonus(getWeaponAbilityInfo(character, item).modifier + getProficiencyBonus(character) + styleBonus);
}

function formatDamage(damage, modifier, bonus = 0, includeModifier = true) {
  const totalModifier = (includeModifier ? modifier : 0) + bonus;
  if (totalModifier === 0) return damage;
  return `${damage} ${totalModifier > 0 ? "+" : "-"} ${Math.abs(totalModifier)}`;
}

function formatDamageType(damageType) {
  return damageType ? damageType.charAt(0).toUpperCase() + damageType.slice(1) : "";
}

function getWeaponUse(item, isVersatileRow = false) {
  if (isVersatileRow) return "Versatile use";
  const uses = [];
  if (hasWeaponProperty(item, "two-handed")) uses.push("Two-handed");
  else uses.push("One-handed");
  if (hasWeaponProperty(item, "finesse")) uses.push("finesse");
  if (hasWeaponProperty(item, "ranged")) uses.push("ranged");
  if (hasWeaponProperty(item, "light")) uses.push("light");
  if (hasWeaponProperty(item, "thrown")) uses.push("thrown");
  if (getVersatileDamage(item)) uses.push("versatile");
  return uses.join(", ");
}

function getWeaponDescription(character, item, options = {}) {
  const notes = [];
  const isRanged = hasWeaponProperty(item, "ranged");
  const isThrown = hasWeaponProperty(item, "thrown");
  if (isRanged) notes.push(item.range ? `Ranged weapon, range ${item.range} ft.` : "Ranged weapon.");
  else if (isThrown) notes.push(item.range ? `Melee or thrown weapon, range ${item.range} ft.` : "Melee or thrown weapon.");
  else notes.push("Melee weapon.");

  if (hasWeaponProperty(item, "finesse")) notes.push("Finesse uses your better modifier: Strength or Dexterity.");
  else if (isRanged) notes.push("Uses Dexterity.");
  else notes.push("Usually uses Strength.");

  if (hasWeaponProperty(item, "two-handed")) notes.push("Requires two hands.");
  if (hasWeaponProperty(item, "light")) notes.push("Light weapons are useful for two-weapon fighting.");
  if (getVersatileDamage(item)) notes.push("Can be used one-handed or two-handed for higher damage.");
  if (shouldApplyArchery(character, item)) notes.push("Includes +2 from Archery Fighting Style.");
  if (options.dueling) notes.push("Includes +2 damage from Dueling when used one-handed with no second weapon.");
  if (options.greatWeaponFighting) notes.push("Great Weapon Fighting lets you reroll 1s and 2s on weapon damage dice when using this weapon two-handed.");
  return notes.join(" ");
}

function twoWeaponFightingDescription(character, label, singularName) {
  const fightingStyleNote = getFightingStyle(character) === "two-weapon-fighting"
    ? " Two-Weapon Fighting lets the bonus-action attack add your ability modifier to damage."
    : " The second attack usually does not add your ability modifier to damage.";
  return `${label}: Can hold one in each hand. After attacking with one ${singularName.toLowerCase()}, you can use your bonus action to attack with the other.${fightingStyleNote}`;
}

function formatWeaponProperties(item) {
  return (item.properties || [])
    .map((property) => property.startsWith("versatile ") ? "versatile" : property)
    .map((property) => property.charAt(0).toUpperCase() + property.slice(1))
    .join(", ") || "None";
}

function getWeaponReachRange(item) {
  if (hasWeaponProperty(item, "ranged")) return item.range ? `Range: ${item.range} ft.` : "Range: Ranged";
  if (hasWeaponProperty(item, "thrown")) return item.range ? `Reach/Range: Melee, 5 ft.; thrown ${item.range} ft.` : "Reach/Range: Melee, 5 ft.; thrown";
  if (hasWeaponProperty(item, "reach")) return "Reach/Range: Melee, 10 ft.";
  return "Reach/Range: Melee, 5 ft.";
}

function getWeaponHands(item, isPaired = false) {
  if (isPaired) return "Hands: One in each hand";
  if (hasWeaponProperty(item, "two-handed")) return "Hands: Two-handed";
  if (getVersatileDamage(item)) return "Hands: One-handed or two-handed";
  return "Hands: One-handed";
}

function getWeaponRole(item, label, options = {}) {
  if (options.role) return options.role;
  if (options.isPaired) return "Secondary / off-hand option";
  if (label.includes("Javelin") || label.includes("Dart")) return "Backup / thrown weapon";
  if (isRangedWeapon(item)) return label.includes("crossbow") ? "Secondary ranged weapon" : "Ranged weapon";
  if (hasWeaponProperty(item, "thrown")) return "Thrown weapon";
  return "Main weapon";
}

function getWeaponRoleRank(role) {
  if (role === "Main weapon") return 1;
  if (role === "Ranged weapon") return 2;
  if (role === "Secondary ranged weapon" || role === "Secondary / off-hand option") return 3;
  if (role === "Backup / thrown weapon" || role === "Thrown weapon") return 4;
  return 5;
}

function getWeaponNotes(character, item, options = {}) {
  if (options.isPaired) return [twoWeaponFightingDescription(character, options.label, options.singularName)];
  const notes = [];
  const isRanged = hasWeaponProperty(item, "ranged");
  const isThrown = hasWeaponProperty(item, "thrown");
  if (isRanged) notes.push("Uses Dexterity.");
  else if (hasWeaponProperty(item, "finesse")) notes.push("Finesse uses your better modifier: Strength or Dexterity.");
  else notes.push("Usually uses Strength.");
  if (hasWeaponProperty(item, "two-handed")) notes.push("Requires two hands to use.");
  if (hasWeaponProperty(item, "light")) notes.push("Light weapons are useful for two-weapon fighting.");
  if (getVersatileDamage(item)) notes.push("Can be used one-handed, or two-handed for higher damage.");
  if (isThrown && !isRanged) notes.push("Can be used in melee or thrown.");
  if (shouldApplyArchery(character, item)) notes.push("Includes +2 attack bonus from Archery Fighting Style.");
  if (options.dueling) notes.push("Includes +2 damage from Dueling when used one-handed with no second weapon.");
  if (options.greatWeaponFighting) notes.push("Great Weapon Fighting lets you reroll 1s and 2s on weapon damage dice when using this weapon two-handed.");
  return notes;
}

function createWeaponCardEntry(character, item, label = item.name, descriptionOverride = "", options = {}) {
  const attackBonus = getWeaponAttackBonus(character, item);
  const abilityInfo = getWeaponAbilityInfo(character, item);
  const duelingBonus = shouldApplyDueling(character, item, "main") && !options.isPaired ? 2 : 0;
  const mainDamage = formatDamage(item.damage, abilityInfo.modifier, duelingBonus);
  const offhandDamage = formatDamage(item.damage, abilityInfo.modifier, 0, getFightingStyle(character) === "two-weapon-fighting");
  const versatileDamage = getVersatileDamage(item);
  const role = getWeaponRole(item, label, options);
  const details = [];
  if (options.isPaired) {
    details.push(`Main attack damage: ${mainDamage}`);
    details.push(`Off-hand attack damage: ${offhandDamage}`);
  }
  if (versatileDamage) {
    details.push(`One-handed damage: ${mainDamage}`);
    details.push(`Two-handed damage: ${formatDamage(versatileDamage, abilityInfo.modifier)} (if other hand is free)`);
  }
  if (options.ammunition) details.push(`Ammunition: ${options.ammunition}`);
  details.push(getWeaponReachRange(item));
  details.push(getWeaponHands(item, Boolean(options.isPaired)));
  details.push(`Ability: ${abilityInfo.ability}`);
  details.push(`Properties: ${formatWeaponProperties(item)}`);

  return {
    weapon: label,
    role,
    roleRank: getWeaponRoleRank(role),
    attackBonus,
    damage: mainDamage,
    type: formatDamageType(item.damageType),
    details,
    notes: descriptionOverride
      ? [descriptionOverride.replace(`${label}: `, "")]
      : getWeaponNotes(character, item, {
        ...options,
        label,
        dueling: duelingBonus > 0,
        greatWeaponFighting: shouldApplyGreatWeaponFighting(character, item, versatileDamage ? "versatile" : "main"),
      }),
  };
}

function categorizedWeaponEntries(items, character) {
  const entries = [];
  const consumed = new Set();
  const combinedWeapons = [
    { weaponId: "shortbow", ammoId: "arrows20", label: "Shortbow + 20 arrows", ammunition: "20 arrows" },
    { weaponId: "longbow", ammoId: "arrows20", label: "Longbow + 20 arrows", ammunition: "20 arrows" },
    { weaponId: "lightCrossbow", ammoId: "bolts20", label: "Light crossbow + 20 bolts", ammunition: "20 bolts" },
  ];
  const quantityWeapons = {
    daggers2: { sourceId: "dagger", label: "Dagger x2", isPaired: true, singularName: "dagger" },
    handaxes2: { sourceId: "handaxe", label: "Handaxe x2", isPaired: true, singularName: "handaxe" },
    javelins4: { sourceId: "javelin", label: "Javelin x4", role: "Backup / thrown weapon" },
    javelins5: { sourceId: "javelin", label: "Javelin x5", role: "Backup / thrown weapon" },
    darts10: { sourceId: "dart", label: "Dart x10", role: "Backup / thrown weapon" },
    shortswords2: { sourceId: "shortsword", label: "Shortsword x2", isPaired: true, singularName: "shortsword" },
  };

  combinedWeapons.forEach(({ weaponId, ammoId, label, ammunition }) => {
    const weapon = items.find((item) => typeof item !== "string" && item.id === weaponId);
    if (!weapon || !hasPreviewItem(items, ammoId)) return;
    consumed.add(weaponId);
    consumed.add(ammoId);
    entries.push(createWeaponCardEntry(character, weapon, label, "", { ammunition }));
  });

  items.forEach((item) => {
    if (typeof item === "string" || consumed.has(item.id)) return;
    if (quantityWeapons[item.id]) {
      const quantityWeapon = quantityWeapons[item.id];
      const sourceWeapon = DND_DATA.getEquipmentItem(quantityWeapon.sourceId);
      consumed.add(item.id);
      if (sourceWeapon) {
        const description = quantityWeapon.isPaired ? twoWeaponFightingDescription(character, quantityWeapon.label, quantityWeapon.singularName) : "";
        entries.push(createWeaponCardEntry(character, sourceWeapon, quantityWeapon.label, description, { isPaired: Boolean(quantityWeapon.isPaired), singularName: quantityWeapon.singularName, role: quantityWeapon.role }));
      }
      return;
    }
    if (item.type === "weapon" && item.damage) entries.push(createWeaponCardEntry(character, item));
  });

  return entries.sort((first, second) => first.roleRank - second.roleRank);
}

function getArmorDefenseNote(armor, hasShield, hasDefenseStyle, hasProtectionStyle, character) {
  if (!armor.isArmor && character.classId === "monk") return "Current AC uses Monk Unarmored Defense.";
  if (!armor.isArmor && character.classId === "barbarian") return "Current AC uses Barbarian Unarmored Defense.";
  if (armor.name === "Chain mail" && hasShield && hasDefenseStyle) return "Current AC includes chain mail, shield, and Defense Fighting Style.";
  if (armor.name === "Chain mail" && hasShield) return "Current AC includes chain mail and shield.";
  if (armor.name === "Chain mail" && hasDefenseStyle) return "Current AC includes chain mail and Defense Fighting Style.";
  if (armor.name === "Chain mail") return "Current AC includes chain mail.";
  if (armor.name === "Leather armor" && hasShield && hasDefenseStyle) return "Current AC uses leather armor, Dexterity, shield, and Defense Fighting Style.";
  if (armor.name === "Leather armor" && hasShield) return "Current AC uses leather armor, Dexterity, and shield.";
  if (armor.name === "Leather armor" && hasDefenseStyle) return "Current AC uses leather armor, Dexterity, and Defense Fighting Style.";
  if (armor.name === "Leather armor") return "Current AC uses leather armor and Dexterity.";
  if (hasProtectionStyle) return "Protection helps defend nearby allies while you use a shield.";
  return "";
}

function armorDefenseEntries(items, character) {
  const equipmentItems = items.filter((item) => typeof item !== "string");
  const armor = getArmorInfo(equipmentItems);
  const hasShield = equipmentItems.some((item) => item.type === "shield");
  const hasDefenseStyle = getFightingStyle(character) === "defense" && armor.isArmor;
  const hasProtectionStyle = getFightingStyle(character) === "protection" && hasShield;
  const entries = equipmentItems.filter((item) => item.type === "armor" || item.type === "shield").map((item) => {
    if (item.id === "chainMail") return "Chain mail &mdash; AC 16, no Dexterity bonus";
    if (item.id === "leatherArmor") return "Leather armor &mdash; AC 11 + Dex modifier";
    if (item.id === "scaleMail") return "Scale mail &mdash; AC 14 + Dex modifier (max 2)";
    if (item.id === "shield") return "Shield &mdash; +2 AC";
    return item.name;
  });
  if (!armor.isArmor && character.classId === "monk") entries.push("Unarmored Defense &mdash; AC 10 + Dex modifier + Wis modifier");
  if (!armor.isArmor && character.classId === "barbarian") entries.push("Unarmored Defense &mdash; AC 10 + Dex modifier + Con modifier");
  if (hasDefenseStyle) entries.push("Fighting Style: Defense &mdash; +1 AC while wearing armor");
  if (hasProtectionStyle) entries.push("Fighting Style: Protection &mdash; while using a shield, you can help protect a nearby ally");
  return { entries, note: getArmorDefenseNote(armor, hasShield, hasDefenseStyle, hasProtectionStyle, character) };
}

function toolEntries(items) {
  return items.filter((item) => typeof item !== "string" && item.type === "tool").map((item) => ({ text: item.name, children: item.contents || [] }));
}

function isAdventuringGearString(item) {
  return /pack|backpack|bag|ball bearings|string|bell|candle|crowbar|hammer|piton|lantern|oil|ration|tinderbox|waterskin|rope|staff|trap|clothes|clothing|map|knife|token|shovel|pot|pouch|dice|cards/i.test(item);
}

function adventuringGearEntries(items) {
  const entries = [];
  items.forEach((item) => {
    if (typeof item === "string") {
      if (isAdventuringGearString(item)) entries.push({ text: item });
      return;
    }
    if (item.type === "pack") entries.push({ text: item.name, children: item.contents || [] });
  });
  return entries;
}

function otherEquipmentEntries(items) {
  return items
    .filter((item) => {
      if (typeof item === "string") return !isAdventuringGearString(item);
      return item.type === "other";
    })
    .map((item) => ({ text: typeof item === "string" ? item : formatEquipmentItem(item) }));
}

function renderPreviewCategory(title, entries) {
  if (!entries.length) return "";
  return `<h3>${title}</h3><ul class="plain-list categorized-equipment-list">${entries.map((entry) => {
    const normalizedEntry = typeof entry === "string" ? { text: entry } : entry;
    const children = normalizedEntry.children && normalizedEntry.children.length
      ? `<ul class="nested-equipment-list">${normalizedEntry.children.map((child) => `<li>${child}</li>`).join("")}</ul>`
      : "";
    return `<li>${normalizedEntry.text}${children}</li>`;
  }).join("")}</ul>`;
}

function uniqueTextEntries(values, emptyText = "None") {
  const seen = new Set();
  const entries = [];
  values.forEach((value) => {
    const text = String(value || "").trim();
    if (!text || seen.has(text.toLowerCase())) return;
    seen.add(text.toLowerCase());
    entries.push({ text });
  });
  return entries.length ? entries : [{ text: emptyText }];
}

function splitProficiencyText(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function isChoicePlaceholder(value) {
  return /^one\b/i.test(String(value || "").trim());
}

function selectedFinishingChoices(character) {
  const selections = getFinishingTouches(character).choices;
  return getFinishingChoices(character)
    .map((choice) => ({ ...choice, value: selections[choice.id] || "" }))
    .filter((choice) => choice.value);
}

function languageEntries(character, race, background) {
  const languages = [
    ...(race ? race.languages || [] : []),
    ...(background ? background.languages || [] : []),
    ...selectedFinishingChoices(character)
      .filter((choice) => choice.category === "language")
      .map((choice) => choice.value),
  ];
  return uniqueTextEntries(languages);
}

function toolProficiencyEntries(character, characterClass, race, background) {
  const tools = [
    ...(race ? race.tools || [] : []),
    ...(background ? background.tools || [] : []).filter((tool) => !isChoicePlaceholder(tool)),
    ...splitProficiencyText(characterClass && characterClass.proficiencyDetails ? characterClass.proficiencyDetails.Tools : "")
      .filter((tool) => tool !== "None" && !isChoicePlaceholder(tool)),
    ...selectedFinishingChoices(character)
      .filter((choice) => choice.category !== "language")
      .map((choice) => choice.value),
  ];
  return uniqueTextEntries(tools);
}

function proficiencyEntries(characterClass, race, label) {
  const proficiencies = [
    ...splitProficiencyText(characterClass && characterClass.proficiencyDetails ? characterClass.proficiencyDetails[label] : ""),
    ...splitProficiencyText(race && race.proficiencyDetails ? race.proficiencyDetails[label] : ""),
  ].filter((item) => item !== "None");
  return uniqueTextEntries(proficiencies);
}

function renderKnownProficienciesPreview(character, characterClass, race, background) {
  return [
    renderPreviewCategory("Languages", languageEntries(character, race, background)),
    renderPreviewCategory("Tool Proficiencies", toolProficiencyEntries(character, characterClass, race, background)),
    renderPreviewCategory("Armor Proficiencies", proficiencyEntries(characterClass, race, "Armor")),
    renderPreviewCategory("Weapon Proficiencies", proficiencyEntries(characterClass, race, "Weapons")),
  ].join("");
}

function renderClassFeaturesPreview(characterClass) {
  if (!characterClass || !characterClass.features || !characterClass.features.length) return "";
  return renderPreviewCategory("Class Features", characterClass.features.map((feature) => ({ text: feature })));
}

function formatLevelOneSpellSlots(count) {
  return `${count} level 1 ${count === 1 ? "slot" : "slots"}`;
}

function getSelectedSpells(character, selectionType) {
  return getSelectedSpellIds(character, selectionType)
    .map((spellId) => DND_DATA.getSpellById(spellId))
    .filter(Boolean);
}

function renderSpellFactBoxes(spell) {
  return `
    <span><strong>Level</strong>${formatSpellLevel(spell)}</span>
    <span><strong>School</strong>${spell.school}</span>
    <span><strong>Range</strong>${spell.range}</span>
    <span><strong>Casting Time</strong>${spell.castingTime}</span>
  `;
}

function renderSpellDetailContent(spell) {
  return `
    <span><strong>Components:</strong> ${spell.components}</span>
    ${spell.material ? `<span><strong>Material:</strong> ${spell.material}</span>` : ""}
    <span><strong>Duration:</strong> ${spell.duration}</span>
    ${spell.concentration ? "<span><strong>Concentration:</strong> Yes</span>" : ""}
    ${spell.ritual ? "<span><strong>Ritual:</strong> Yes</span>" : ""}
    <span><strong>Summary:</strong> ${spell.summary}</span>
  `;
}

function renderSpellDisplayCard(spell) {
  return `
    <details class="spell-display-card">
      <summary>
        <span class="spell-card-main">
          <span class="spell-card-heading">
            <strong>${spell.name}</strong>
            <span>${formatSpellLevel(spell)} - ${spell.school}</span>
          </span>
          <span class="spell-card-facts">
            ${renderSpellFactBoxes(spell)}
          </span>
          <span class="spell-detail-label">Open details</span>
        </span>
      </summary>
      <span class="spell-card-details">
        ${renderSpellDetailContent(spell)}
      </span>
    </details>
  `;
}

function renderSelectedSpellList(title, spells) {
  if (!spells.length) return "";
  return `
    <section class="spell-display-section">
      <h3>${title}</h3>
      <div class="spell-card-list">
        ${spells.map(renderSpellDisplayCard).join("")}
      </div>
    </section>
  `;
}

function getWizardPreparedSpellCount(character) {
  if (!hasAssignedAbilityScore(character, "Intelligence")) return "";
  return Math.max(1, abilityModifierValue(character.abilities.Intelligence) + 1);
}

function renderPreparedSpellNote(character, characterClass) {
  if (!supportsSpellSelection(character, characterClass) || character.classId !== "wizard") return "";
  const preparedCount = getWizardPreparedSpellCount(character);
  const text = preparedCount === ""
    ? "Prepared Spells: Assign Intelligence to calculate how many spells you can prepare from your spellbook."
    : `Prepared Spells: You can prepare ${preparedCount} ${preparedCount === 1 ? "spell" : "spells"} from your spellbook.`;
  return `<p class="spell-selection-note">${text}</p>`;
}

function renderSpellcastingPreview(character, characterClass) {
  if (!hasLevelOneSpellcasting(character, characterClass)) return "";
  const spellcasting = getLevelOneSpellcasting(character, characterClass);
  const ability = getSpellcastingAbility(character, characterClass);
  const saveDc = calculateSpellSaveDc(character, characterClass);
  const attackBonus = calculateSpellAttackBonus(character, characterClass);
  const slotLabel = getSpellcastingMagicType(character, characterClass) === "pact" ? "Pact Magic Slots" : "Spell Slots";
  const slotCount = getLevelOneSpellSlotCount(character, characterClass);
  const cantripSpells = getSelectedSpells(character, "cantrips");
  const spellbookSpells = getSelectedSpells(character, "spellbookSpells");
  const hasSpellSelection = supportsSpellSelection(character, characterClass);

  return `
    <h3>Spellcasting</h3>
    <div class="sheet-grid spellcasting-grid">
      <div class="sheet-item"><span class="sheet-label">Spellcasting Ability</span>${ability || "Not selected"}</div>
      <div class="sheet-item"><span class="sheet-label">Spell Save DC</span>${saveDc === "" ? `Assign ${ability}` : saveDc}</div>
      <div class="sheet-item"><span class="sheet-label">Spell Attack Bonus</span>${attackBonus === "" ? `Assign ${ability}` : attackBonus}</div>
      <div class="sheet-item"><span class="sheet-label">${slotLabel}</span>${formatLevelOneSpellSlots(slotCount)}</div>
      <div class="sheet-item"><span class="sheet-label">Cantrips</span>${hasSpellSelection ? `${cantripSpells.length} selected` : getSpellcastingCantripCount(character, characterClass)}</div>
      <div class="sheet-item"><span class="sheet-label">${hasSpellSelection ? "Spellbook" : "Spell Selection"}</span>${hasSpellSelection ? `${spellbookSpells.length} spells selected` : spellcasting.selectionRule || "Handled in a later spell-selection phase"}</div>
    </div>
    ${renderSelectedSpellList("Cantrips", cantripSpells)}
    ${renderSelectedSpellList("Spellbook Spells", spellbookSpells)}
    ${renderPreparedSpellNote(character, characterClass)}
  `;
}

function getFinishingTouches(character) {
  if (!character.finishingTouches) character.finishingTouches = { choices: {}, alignment: {}, personality: {}, trinket: {} };
  if (!character.finishingTouches.choices) character.finishingTouches.choices = {};
  if (!character.finishingTouches.alignment) character.finishingTouches.alignment = {};
  if (!character.finishingTouches.personality) character.finishingTouches.personality = {};
  if (!character.finishingTouches.trinket) character.finishingTouches.trinket = {};
  return character.finishingTouches;
}

function resetFinishingTouches(character) {
  character.finishingTouches = { choices: {}, alignment: {}, personality: {}, trinket: {} };
}

function getSelectedTrinket(character) {
  const trinketId = getFinishingTouches(character).trinket.id;
  return trinketId ? DND_DATA.getTrinketById(trinketId) : null;
}

function setRandomTrinket(character) {
  const trinket = DND_DATA.randomChoice(DND_DATA.trinkets);
  getFinishingTouches(character).trinket = { id: trinket.id, source: "rolled" };
}

function clearTrinket(character) {
  getFinishingTouches(character).trinket = {};
}

function finishingChoice(id, label, category, helper, extra = {}) {
  return { id, label, category, helper, ...extra };
}

function getFinishingChoices(character) {
  const race = getById(DND_DATA.races, character.raceId);
  const background = getById(DND_DATA.backgrounds, character.backgroundId);
  const characterClass = getById(DND_DATA.classes, character.classId);
  const choices = [];

  if (race && race.languageChoices) {
    Array.from({ length: race.languageChoices.choose || 0 }, (_, index) => {
      choices.push(finishingChoice(
        `race-language-${index + 1}`,
        "Choose 1 language",
        "language",
        "Pick a language your character can speak, read, and write.",
        { note: "Ask your DM before choosing an exotic language." },
      ));
    });
  }

  const classToolDetail = characterClass && characterClass.proficiencyDetails ? characterClass.proficiencyDetails.Tools || "" : "";
  if (classToolDetail.toLowerCase().includes("one artisan") && classToolDetail.toLowerCase().includes("musical instrument")) {
    choices.push(finishingChoice("class-tool-1", "Choose 1 tool or instrument", "artisanOrMusical", "Tool proficiencies help with checks involving specialized equipment."));
  }

  (background ? background.tools || [] : []).forEach((tool, index) => {
    const normalizedTool = tool.toLowerCase();
    if (normalizedTool.includes("one gaming set")) choices.push(finishingChoice(`background-tool-${index}`, "Choose 1 gaming set", "gaming", "Tool proficiencies help with checks involving specialized equipment."));
    if (normalizedTool.includes("one musical instrument")) choices.push(finishingChoice(`background-tool-${index}`, "Choose 1 musical instrument", "musical", "Tool proficiencies help with checks involving specialized equipment."));
    if (normalizedTool.includes("one artisan")) choices.push(finishingChoice(`background-tool-${index}`, "Choose 1 artisan's tool", "artisan", "Tool proficiencies help with checks involving specialized equipment."));
    if (normalizedTool.includes("vehicles") && normalizedTool.includes("land or water")) choices.push(finishingChoice(`background-tool-${index}`, "Choose vehicles: land or water", "vehicles", "Tool proficiencies help with checks involving specialized equipment."));
    if (normalizedTool.includes("one other tool")) choices.push(finishingChoice(`background-tool-${index}`, "Choose 1 tool", "other", "Tool proficiencies help with checks involving specialized equipment."));
  });

  return choices;
}

function getChoiceOptions(choice) {
  if (choice.category === "language") {
    return [
      ...DND_DATA.languages.standard.map((name) => ({ value: name, label: name })),
      ...DND_DATA.languages.exotic.map((name) => ({ value: name, label: `${name} (exotic)` })),
    ];
  }
  return (DND_DATA.toolOptions[choice.category] || []).map((name) => ({ value: name, label: name }));
}

function hasCompleteFinishingTouches(character) {
  const selections = getFinishingTouches(character).choices;
  return getFinishingChoices(character).every((choice) => selections[choice.id]);
}

function randomizeFinishingChoice(character, choiceId) {
  const choice = getFinishingChoices(character).find((item) => item.id === choiceId);
  if (!choice) return;
  const options = getChoiceOptions(choice);
  if (!options.length) return;
  getFinishingTouches(character).choices[choiceId] = DND_DATA.randomChoice(options).value;
}

function randomizeAlignment(character) {
  getFinishingTouches(character).alignment = { selected: DND_DATA.randomChoice(DND_DATA.alignments), skipped: false };
}

function randomizePersonalityField(character, field) {
  const background = getById(DND_DATA.backgrounds, character.backgroundId);
  const options = background && background.personality ? background.personality[field] || [] : [];
  if (!options.length) return;
  getFinishingTouches(character).personality[field] = { selected: DND_DATA.randomChoice(options), custom: "", skipped: false };
}

function randomizeFinishingTouches(character) {
  getFinishingChoices(character).forEach((choice) => randomizeFinishingChoice(character, choice.id));
  randomizeAlignment(character);
  ["trait", "ideal", "bond", "flaw"].forEach((field) => randomizePersonalityField(character, field));
}

function getPersonalityValue(character, field) {
  const entry = getFinishingTouches(character).personality[field] || {};
  return (entry.custom || entry.selected || "").trim();
}

function getAlignmentValue(character) {
  return (getFinishingTouches(character).alignment.selected || "").trim();
}

function finishingChoiceEntries(character) {
  const selections = getFinishingTouches(character).choices;
  return getFinishingChoices(character)
    .map((choice) => selections[choice.id])
    .filter(Boolean)
    .map((value) => ({ text: value }));
}

function personalityEntries(character) {
  const labels = { trait: "Personality Trait", ideal: "Ideal", bond: "Bond", flaw: "Flaw" };
  return [
    { text: `Alignment: ${getAlignmentValue(character)}` },
    ...Object.entries(labels).map(([field, label]) => ({ text: `${label}: ${getPersonalityValue(character, field)}` })),
  ];
}

function renderFinishingTouchesPreview(character) {
  const trinket = getSelectedTrinket(character);
  return [
    renderPreviewCategory("Background Details", personalityEntries(character)),
    trinket ? renderPreviewCategory("Optional Trinket", [{ text: `#${trinket.roll} - ${trinket.description}` }]) : "",
  ].join("");
}

function renderRolledStartingGoldPreview(character) {
  if (!usesRolledStartingGold(character)) return "";
  return `
    <div class="equipment-warning-panel">
      <p>You rolled starting gold instead of taking class/background equipment. Choose equipment manually from the Player's Handbook equipment list.</p>
      <p>Weapon, armor, AC, and equipment summaries may be incomplete because equipment was chosen outside this builder.</p>
    </div>
  `;
}

function renderArmorDefenseCategory(armorDefense) {
  if (!armorDefense.entries.length) return "";
  return `${renderPreviewCategory("Armor & Defense", armorDefense.entries)}${armorDefense.note ? `<p class="equipment-note">${armorDefense.note}</p>` : ""}`;
}

function renderWeaponCards(entries) {
  if (!entries.length) return "";
  return `
    <h3>Weapons</h3>
    <p class="weapon-card-note">Weapon attacks include proficiency. Damage includes the relevant ability modifier when applicable.</p>
    <div class="weapon-card-list">
      ${entries.map((entry) => `
        <details class="weapon-card">
          <summary class="weapon-card-summary">
            <span class="weapon-card-heading">
              <strong>${entry.weapon}</strong>
              <span>${entry.role}</span>
            </span>
            <span class="weapon-card-stats" aria-label="${entry.weapon} attack summary">
              <span class="weapon-stat"><span>Atk Bonus</span><strong>${entry.attackBonus}</strong></span>
              <span class="weapon-stat"><span>Damage</span><strong>${entry.damage}</strong></span>
              <span class="weapon-stat"><span>Type</span><strong>${entry.type}</strong></span>
            </span>
          </summary>
          <div class="weapon-card-details">
            <span class="guidance-section-label">Details</span>
            <ul>${entry.details.map((detail) => `<li>${detail}</li>`).join("")}</ul>
            ${entry.notes.length ? `<span class="guidance-section-label">Notes</span><ul>${entry.notes.map((note) => `<li>${note}</li>`).join("")}</ul>` : ""}
          </div>
        </details>
      `).join("")}
    </div>
  `;
}

function renderPreviewEquipment(character) {
  if (usesRolledStartingGold(character)) {
    return `<h3>Equipment</h3>${renderRolledStartingGoldPreview(character)}${renderEquipmentList([], "Manual equipment was chosen outside this builder.")}`;
  }
  const items = getPreviewEquipmentItems(character);
  if (!items.length) {
    return `<h3>Equipment</h3>${renderEquipmentList([], character.classId ? "Choose starting equipment." : "Choose a class first.")}`;
  }

  return [
    renderWeaponCards(categorizedWeaponEntries(items, character)),
    renderArmorDefenseCategory(armorDefenseEntries(items, character)),
    renderPreviewCategory("Tools", toolEntries(items)),
    renderPreviewCategory("Adventuring Gear", adventuringGearEntries(items)),
    renderPreviewCategory("Other Equipment", otherEquipmentEntries(items)),
  ].join("");
}

function renderPreview(container, character) {
  const characterClass = getById(DND_DATA.classes, character.classId);
  const race = getById(DND_DATA.races, character.raceId);
  const background = getById(DND_DATA.backgrounds, character.backgroundId);
  const armorClass = calculateArmorClass(character);

  container.innerHTML = `
    <div class="sheet-grid">
      <div class="sheet-item"><span class="sheet-label">Name</span>${character.name || ""}</div>
      <div class="sheet-item"><span class="sheet-label">Level</span>${character.level}</div>
      <div class="sheet-item"><span class="sheet-label">Class</span>${characterClass ? characterClass.name : "Not selected"}</div>
      <div class="sheet-item"><span class="sheet-label">Race</span>${race ? race.name : "Not selected"}</div>
      <div class="sheet-item"><span class="sheet-label">Background</span>${background ? background.name : "Not selected"}</div>
      <div class="sheet-item"><span class="sheet-label">Hit Points</span>${calculateHitPoints(character, characterClass)}</div>
      <div class="sheet-item"><span class="sheet-label">Hit Dice</span>${formatHitDice(character, characterClass)}</div>
      <div class="sheet-item"><span class="sheet-label">Proficiency Bonus</span>${formatSignedModifier(getProficiencyBonus(character))}</div>
      <div class="sheet-item"><span class="sheet-label">Armor Class</span>${armorClass.total}${armorClass.defenseBonus ? " (Defense +1)" : ""}</div>
      <div class="sheet-item"><span class="sheet-label">Initiative</span>${calculateInitiative(character)}</div>
      <div class="sheet-item"><span class="sheet-label">Speed</span>${formatSpeed(race)}</div>
      <div class="sheet-item"><span class="sheet-label">Passive Perception</span>${calculatePassivePerception(character, race, background)}</div>
      <div class="sheet-item"><span class="sheet-label">Senses</span>${formatSenses(race)}</div>
      <div class="sheet-item"><span class="sheet-label">Starting Gold</span>${usesRolledStartingGold(character) ? getRolledStartingGoldGp(character) : getStartingGoldGp(character)} gp${usesRolledStartingGold(character) ? `<span class="sheet-subnote">Reroll Attempts: ${getEquipmentSelections(character).startingGoldRerollCount}</span>` : ""}</div>
      ${renderClassChoicePreviewItems(character)}
    </div>
    ${renderAbilityScoresTable(character, race)}
    ${renderSavingThrowsTable(character, characterClass)}
    ${renderSkillsTable(character, race, background)}
    ${renderSpellcastingPreview(character, characterClass)}
    ${renderClassFeaturesPreview(characterClass)}
    ${renderKnownProficienciesPreview(character, characterClass, race, background)}
    ${renderFinishingTouchesPreview(character)}
    ${renderPreviewEquipment(character)}`;
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
  return `<div class="class-info-panel selected"><p>${characterClass.detail}</p><p><strong>Hit Die:</strong> d${characterClass.hitDie}</p><div class="proficiency-block"><h3>Proficiencies</h3><div class="proficiency-list">${Object.entries(characterClass.proficiencyDetails).map(([label, value]) => `<p><strong>${label}:</strong> ${value}</p>`).join("")}</div></div></div>`;
}

function renderClassStep(step) {
  const selectedClass = getById(DND_DATA.classes, appState.character.classId);
  wizardStep.innerHTML = `<p class="progress-text">${step.progress}</p><h2>${step.title}</h2>${classInfoPanel(selectedClass)}<div class="option-grid">${DND_DATA.classes.map((option) => optionCard(option, appState.character.classId, "class", `${option.cardDescription}. Hit Die: d${option.hitDie}`, "class-option-card")).join("")}</div><div class="wizard-actions"><button class="secondary-button" type="button" data-action="randomize-current">Randomize</button><button class="primary-button" type="button" data-action="continue" ${appState.character.classId ? "" : "disabled"}>Continue</button></div>`;
}

function renderChoiceStep(step, options, selectedId, type, detailForOption) {
  wizardStep.innerHTML = `<p class="progress-text">${step.progress}</p><h2>${step.title}</h2>${guidancePanel(stepGuidance[step.key])}<div class="option-grid">${options.map((option) => optionCard(option, selectedId, type, detailForOption(option))).join("")}</div><div class="wizard-actions">${appState.wizardStepIndex > 0 ? '<button class="secondary-button" type="button" data-action="back">Back</button>' : ""}<button class="secondary-button" type="button" data-action="randomize-current">Randomize</button><button class="primary-button" type="button" data-action="continue" ${selectedId ? "" : "disabled"}>Continue</button></div>`;
}

function renderClassFeatureStep(step) {
  const groups = getClassFeatureChoiceGroups(appState.character);
  if (!groups.length) {
    appState.wizardStepIndex = getNextStepIndex();
    renderWizard();
    return;
  }
  wizardStep.innerHTML = `
    <p class="progress-text">${step.progress}</p>
    <h2>${step.title}</h2>
    ${guidancePanel(stepGuidance.classFeature)}
    ${groups.map((group) => renderClassFeatureGroup(group)).join("")}
    <div class="wizard-actions"><button class="secondary-button" type="button" data-action="back">Back</button><button class="secondary-button" type="button" data-action="randomize-current">Randomize</button><button class="primary-button" type="button" data-action="continue" ${hasCompleteClassFeatureChoices(appState.character) ? "" : "disabled"}>Continue</button></div>
  `;
}

function renderClassFeatureGroup(group) {
  const selectedId = appState.character.classFeatures[group.id] || "";
  const selectedOption = group.options.find((option) => option.id === selectedId);
  const needsHumanoids = group.humanoidChoices && selectedOption && selectedOption.id === "humanoids";
  return `
    <section class="equipment-choice-group">
      <div class="equipment-group-header"><h3>${group.title}</h3><span>Choose 1</span></div>
      ${group.description ? `<p class="equipment-note">${group.description}</p>` : ""}
      <div class="option-grid">${group.options.map((option) => optionCard(option, selectedId, group.id)).join("")}</div>
      ${needsHumanoids ? renderHumanoidEnemyPickers(group) : ""}
      ${!hasCompleteClassFeatureGroup(appState.character, group) ? `<p class="finishing-validation">${classFeatureValidationMessage(group)}</p>` : ""}
    </section>
  `;
}

function renderHumanoidEnemyPickers(group) {
  const selectedValues = group.humanoidChoices.fields.map((field) => appState.character.classFeatures[field.id] || "");
  return `
    <div class="equipment-dropdowns humanoid-enemy-pickers">
      ${group.humanoidChoices.fields.map((field, index) => {
        const selectedValue = appState.character.classFeatures[field.id] || "";
        const blockedValues = selectedValues.filter((value, valueIndex) => value && valueIndex !== index);
        return `<label class="equipment-select-label">${field.label}<select data-class-feature-extra="${field.id}"><option value="">Choose ${field.label.toLowerCase()}</option>${group.humanoidChoices.options.map((option) => `<option value="${option}" ${selectedValue === option ? "selected" : ""} ${blockedValues.includes(option) ? "disabled" : ""}>${option}</option>`).join("")}</select></label>`;
      }).join("")}
    </div>
  `;
}

function classFeatureValidationMessage(group) {
  const selectedOption = getSelectedClassFeatureOption(appState.character, group);
  if (group.humanoidChoices && selectedOption && selectedOption.id === "humanoids") return "Choose two different humanoid races before continuing.";
  return `Choose ${group.title} before continuing.`;
}

function renderPackDetails(items) {
  const pack = items.find((item) => item.type === "pack");
  return pack ? `<p class="pack-detail">${pack.contents.join(", ")}</p>` : "";
}

function renderWeaponSelect(groupId, dropdown, selectedValue = "") {
  const options = DND_DATA.getWeaponOptions(dropdown.list);
  return `<label class="equipment-select-label">${dropdown.label}<select data-equipment-group-id="${groupId}" data-equipment-dropdown="${dropdown.id}"><option value="">Choose ${dropdown.label.toLowerCase()}</option>${options.map((item) => `<option value="${item.id}" ${selectedValue === item.id ? "selected" : ""}>${formatEquipmentItem(item)}</option>`).join("")}</select></label>`;
}

function renderEquipmentOption(group, option, selectedChoice = {}) {
  const isSelected = selectedChoice.optionId === option.id;
  const optionItems = getOptionItems(option, selectedChoice);
  const packDetails = renderPackDetails((option.items || []).map((itemId) => DND_DATA.getEquipmentItem(itemId)).filter(Boolean));
  const detailLines = option.details || optionItems.map((item) => item.detail || (item.type === "weapon" && item.damage ? formatEquipmentItem(item) : "")).filter(Boolean);
  const includesLine = isSelected && option.includes && option.includes.length ? `<p class="equipment-includes">Includes: ${option.includes.join(", ")}</p>` : "";
  return `
    <div class="equipment-option ${isSelected ? "selected" : ""}" data-equipment-group="${group.id}" data-equipment-option="${option.id}">
      <button class="equipment-choice-button" type="button" data-equipment-group="${group.id}" data-equipment-option="${option.id}" aria-pressed="${isSelected}">
        <span class="equipment-radio" aria-hidden="true"></span>
        <span class="equipment-choice-copy">
          <strong>${option.name}</strong>
          ${option.helper && !isSelected ? `<span>${option.helper}</span>` : ""}
          ${detailLines.length ? detailLines.map((line) => `<span>${line}</span>`).join("") : ""}
        </span>
      </button>
      ${includesLine}
      ${isSelected && option.dropdowns ? `<div class="equipment-dropdowns">${option.dropdowns.map((dropdown) => renderWeaponSelect(group.id, dropdown, selectedChoice[dropdown.id])).join("")}</div>` : ""}
      ${packDetails}
    </div>
  `;
}

function renderEquipmentGroup(group, selections) {
  const selectedChoice = selections.choices[group.id] || {};
  return `<section class="equipment-choice-group"><div class="equipment-group-header"><h3>${group.title}</h3><span>Choose 1</span></div><div class="equipment-options">${group.options.map((option) => renderEquipmentOption(group, option, selectedChoice)).join("")}</div></section>`;
}

function renderEquipmentMethodSelector(character) {
  const method = getEquipmentMethod(character);
  const methods = [
    {
      id: EQUIPMENT_METHODS.take,
      title: "Take Starting Equipment",
      tag: "Recommended",
      text: "Use class equipment choices plus automatic background equipment and background gold.",
    },
    {
      id: EQUIPMENT_METHODS.gold,
      title: "Roll Starting Gold",
      tag: "Advanced",
      text: "Roll class-based starting wealth and choose equipment manually from the Player's Handbook.",
    },
  ];
  return `
    <section class="equipment-section">
      <h3>Equipment Method</h3>
      <div class="equipment-method-grid">
        ${methods.map((item) => `
          <button class="equipment-method-card ${method === item.id ? "selected" : ""}" type="button" data-equipment-method="${item.id}" aria-pressed="${method === item.id}">
            <span class="equipment-method-indicator" aria-hidden="true"></span>
            <span>
              <strong>${item.title}</strong>
              <em>${item.tag}</em>
              <span>${item.text}</span>
            </span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function renderRolledStartingGoldPanel(character) {
  const rolledGold = ensureRolledStartingGold(character);
  const selections = getEquipmentSelections(character);
  const rollText = rolledGold.rolls.length ? rolledGold.rolls.join(", ") : "None";
  const multiplierText = rolledGold.multiplier === 1 ? "" : ` x ${rolledGold.multiplier}`;
  return `
    <section class="equipment-section rolled-gold-panel">
      <h3>Rolled Starting Gold</h3>
      <p class="reroll-attempt-note">Reroll Attempts: ${selections.startingGoldRerollCount}</p>
      <div class="sheet-grid">
        <div class="sheet-item"><span class="sheet-label">Formula</span>${rolledGold.formula}</div>
        <div class="sheet-item"><span class="sheet-label">Rolls</span>${rollText}${multiplierText}</div>
        <div class="sheet-item"><span class="sheet-label">Starting Gold</span>${rolledGold.totalGp} gp</div>
      </div>
      <p class="equipment-note">Advanced alternate path: choose and buy equipment manually from the Player's Handbook equipment list.</p>
      <p class="equipment-note">Weapon, armor, AC, and equipment summaries may be incomplete because this builder does not know what gear you bought.</p>
      <button class="secondary-button assignment-button" type="button" data-action="reroll-starting-gold">Reroll Starting Gold</button>
    </section>
  `;
}

function renderEquipmentStep(step) {
  const definition = getEquipmentDefinition(appState.character.classId);
  const selections = getEquipmentSelections(appState.character);
  const useRolledGold = usesRolledStartingGold(appState.character);
  const fixedItems = definition ? (definition.fixed || []).map((itemId) => DND_DATA.getEquipmentItem(itemId)).filter(Boolean) : [];
  const backgroundItems = getBackgroundEquipmentItems(appState.character);
  const selectedClass = getById(DND_DATA.classes, appState.character.classId);

  wizardStep.innerHTML = `
    <p class="progress-text">${step.progress}</p>
    <h2>${step.title}</h2>
    ${guidancePanel(stepGuidance.equipment)}
    ${renderEquipmentMethodSelector(appState.character)}
    ${useRolledGold ? renderRolledStartingGoldPanel(appState.character) : ""}
    ${useRolledGold ? "" : `
    <section class="equipment-notes">
      <h3>Weapon Property Notes</h3>
      <p><strong>Finesse:</strong> can use Strength or Dexterity.</p>
      <p><strong>Light:</strong> useful for two-weapon fighting.</p>
      <p><strong>Ranged:</strong> usually uses Dexterity.</p>
      <p><strong>Two-handed:</strong> requires two hands.</p>
      <p><strong>Versatile:</strong> can be used one-handed, or two-handed for the larger damage die.</p>
    </section>
    <section class="equipment-section">
      <h3>Class Equipment Choices${selectedClass ? `: ${selectedClass.name}` : ""}</h3>
      ${definition ? definition.choices.map((group) => renderEquipmentGroup(group, selections)).join("") : "<p>Choose one of the supported classes first.</p>"}
    </section>
    <section class="equipment-section">
      <h3>Automatically Granted Class Equipment</h3>
      ${renderEquipmentList(fixedItems, "No fixed class equipment.")}
    </section>
    <section class="equipment-section">
      <h3>Background Equipment</h3>
      ${renderEquipmentList(backgroundItems, appState.character.backgroundId ? "No background equipment listed." : "Choose a background first.")}
    </section>
    `}
    <div class="wizard-actions"><button class="secondary-button" type="button" data-action="back">Back</button><button class="secondary-button" type="button" data-action="randomize-current">Randomize</button><button class="primary-button" type="button" data-action="continue" ${hasCompleteEquipmentSelections(appState.character) ? "" : "disabled"}>Continue</button></div>
  `;
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
  const summaries = selectedClassFeatureSummaries(character);
  return summaries.length ? summaries.join("; ") : "Not selected";
}

function selectedClassFeatureSummaries(character) {
  return getSelectedClassFeatureChoiceEntries(character).map((entry) => `${entry.label}: ${entry.value}`);
}

function getSelectedClassFeatureChoiceEntries(character) {
  return getClassFeatureChoiceGroups(character)
    .map((group) => {
      const selectedOption = getSelectedClassFeatureOption(character, group);
      if (!selectedOption || !hasCompleteClassFeatureGroup(character, group)) return null;
      const label = group.previewLabel || group.title;
      if (group.humanoidChoices && selectedOption.id === "humanoids") {
        const humanoids = group.humanoidChoices.fields.map((field) => character.classFeatures[field.id]).filter(Boolean);
        return {
          label,
          value: humanoids.length === group.humanoidChoices.fields.length
            ? `Humanoids &mdash; ${humanoids.join(" and ")}`
            : "Humanoids",
        };
      }
      return { label, value: selectedOption.name };
    })
    .filter(Boolean);
}

function renderClassChoicePreviewItems(character) {
  return getSelectedClassFeatureChoiceEntries(character)
    .map((entry, index) => `
      <div class="sheet-item class-choice-sheet-item">
        <span class="sheet-label">${index + 1}. Class Choice</span>
        <span class="class-choice-preview-body">
          <strong>${entry.label}:</strong>
          <span>${entry.value}</span>
        </span>
      </div>
    `)
    .join("");
}

function summarizeStarterEquipment(character) {
  if (!hasCompleteEquipmentSelections(character)) return "Choose starting equipment.";
  const names = getClassEquipmentItems(character).map((item) => item.name);
  return names.length ? names.join(", ") : "Not selected";
}

function equipmentHasItem(character, itemId) {
  return getClassEquipmentItems(character).some((item) => item.id === itemId);
}

function equipmentHasProperty(character, property) {
  return getClassEquipmentItems(character).some((item) => item.properties && item.properties.some((itemProperty) => itemProperty.startsWith(property)));
}

function getEquipmentImpactNotes(character) {
  const notes = [];
  if (equipmentHasItem(character, "chainMail")) notes.push("Chain mail gives fixed AC and does not add Dexterity.");
  if (equipmentHasItem(character, "leatherArmor")) notes.push("Leather armor adds your Dexterity modifier to AC.");
  if (equipmentHasItem(character, "shield")) notes.push("Your shield adds +2 AC.");
  if (equipmentHasProperty(character, "finesse")) notes.push("Finesse weapons can use Strength or Dexterity.");
  if (equipmentHasProperty(character, "ranged")) notes.push("Ranged weapons usually use Dexterity.");
  return notes;
}

function getSimpleAbilityGuidance(character) {
  const fightingStyle = character.classFeatures ? character.classFeatures.fightingStyle : "";
  const equipmentNotes = getEquipmentImpactNotes(character);

  if (character.classId === "fighter") {
    if (fightingStyle === "archery") {
      return {
        primary: "Dexterity",
        secondary: "Constitution",
        notes: equipmentNotes,
      };
    }

    if (fightingStyle === "dueling") {
      return {
        primary: "Strength or Dexterity &mdash; choose one",
        secondary: "Constitution",
        notes: equipmentNotes,
      };
    }

    if (fightingStyle === "two-weapon-fighting") {
      return {
        primary: "Strength or Dexterity &mdash; choose one",
        secondary: "Constitution",
        notes: equipmentNotes,
      };
    }

    return {
      primary: "Strength",
      secondary: "Constitution",
      notes: equipmentNotes,
    };
  }

  if (character.classId === "barbarian") {
    return {
      primary: "Strength",
      secondary: "Constitution and Dexterity",
      notes: ["Unarmored Defense uses Dexterity and Constitution.", ...equipmentNotes],
    };
  }

  if (character.classId === "rogue") {
    return {
      primary: "Dexterity",
      secondary: "Constitution",
      notes: equipmentNotes,
    };
  }

  if (character.classId === "monk") {
    return {
      primary: "Dexterity",
      secondary: "Wisdom and Constitution",
      notes: ["Monk Unarmored Defense uses Dexterity and Wisdom.", ...equipmentNotes],
    };
  }

  if (character.classId === "paladin") {
    return {
      primary: "Strength",
      secondary: "Charisma and Constitution",
      notes: equipmentNotes,
    };
  }

  if (character.classId === "ranger") {
    return {
      primary: "Dexterity",
      secondary: "Wisdom and Constitution",
      notes: equipmentNotes,
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
        ${choice ? `<p><strong>Level 1 Class Choice:</strong> ${featureName}</p>` : ""}
        <p><strong>Race:</strong> ${formatRaceBonusSummary(race)}</p>
        <p><strong>Starter Equipment:</strong> ${summarizeStarterEquipment(appState.character)}</p>
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
    return `<label>${ability}${raceAbilityMarker(racialBonus)}<select data-ability-method="${ABILITY_METHODS.standard}" data-ability="${ability}"><option value="">Score</option>${DND_DATA.standardArray.map((score) => `<option value="${score}" ${Number(selectedScore) === score ? "selected" : ""} ${blockedScores.includes(score) ? "disabled" : ""}>${formatRacialAdjustedScoreOption(score, racialBonus)}</option>`).join("")}</select></label>`;
  }).join("")}</div>${scoreAssignmentLegend()}<button class="secondary-button assignment-button" type="button" data-action="randomize-abilities">Random Assign</button>`;
}

function rolledScoreControls() {
  const race = getById(DND_DATA.races, appState.character.raceId);
  const rolled = appState.abilityState.rolled;
  const hasRolledScores = rolled.results.length === 6;
  const rollSlots = hasRolledScores
    ? rolled.results
    : Array.from({ length: 6 }, (_, index) => ({ id: `empty-roll-${index + 1}`, dice: [], total: "" }));

  return `<div class="roll-results" aria-label="Rolled ability scores">${rollSlots.map((roll, index) => `<div class="roll-result ${hasRolledScores ? "" : "empty"}"><strong>${hasRolledScores ? `Roll ${index + 1}: ${roll.total}` : ""}</strong><span>${hasRolledScores ? `${roll.dice.join(", ")} -> ${roll.total}` : ""}</span></div>`).join("")}</div>${hasRolledScores ? `<p class="table-note">Reroll Attempts: ${rolled.rerollCount}</p>` : ""}<div class="ability-controls score-assignment-grid rolled-assignment-grid">${DND_DATA.abilities.map((ability) => {
    const selectedRollId = rolled.assignments[ability];
    const blockedRollIds = getUsedRollIds(ability);
    const racialBonus = getRaceAbilityBonus(race, ability);
    return `<label>${ability}${raceAbilityMarker(racialBonus)}<select data-ability-method="${ABILITY_METHODS.rolled}" data-ability="${ability}" ${hasRolledScores ? "" : "disabled"}><option value="">Score</option>${rolled.results.map((roll, index) => `<option value="${roll.id}" ${selectedRollId === roll.id ? "selected" : ""} ${blockedRollIds.includes(roll.id) ? "disabled" : ""}>${formatRacialAdjustedScoreOption(roll.total, racialBonus)} (Roll ${index + 1})</option>`).join("")}</select></label>`;
  }).join("")}</div>${scoreAssignmentLegend()}${hasRolledScores ? "" : '<button class="secondary-button assignment-button" type="button" data-action="roll-scores">Roll Six Scores</button>'}${hasRolledScores ? '<div class="assignment-actions"><button class="secondary-button assignment-button" type="button" data-action="randomly-assign-rolled">Random Assign</button><button class="secondary-button assignment-button" type="button" data-action="reroll-stats">Reroll Stats</button></div>' : ""}`;
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

function renderInlinePicker({ id, label, value, placeholder, options, helper = "", note = "", actionType, skipped = false }) {
  const isOpen = appState.openFinishingPicker === id;
  const selectedOption = options.find((option) => option.value === value);
  const displayValue = skipped ? "Skipped for now" : selectedOption ? selectedOption.label : placeholder;
  return `
    <div class="inline-picker ${isOpen ? "open" : ""}">
      <span class="inline-picker-label">${label}</span>
      ${helper ? `<p>${helper}</p>` : ""}
      <button class="inline-picker-trigger" type="button" data-picker-toggle="${id}" aria-expanded="${isOpen}">
        <span>${displayValue}</span>
      </button>
      ${isOpen ? `<div class="inline-picker-options">${options.map((option) => `<button type="button" data-picker-option="${id}" data-picker-action="${actionType}" data-picker-value="${option.value}">${option.label}</button>`).join("")}</div>` : ""}
      ${note || ""}
    </div>
  `;
}

function renderFinishingChoiceCard(choice) {
  const selectedValue = getFinishingTouches(appState.character).choices[choice.id] || "";
  const options = getChoiceOptions(choice);
  const placeholder = {
    language: "Choose a language",
    gaming: "Choose a gaming set",
    musical: "Choose a musical instrument",
    artisan: "Choose an artisan's tool",
    artisanOrMusical: "Choose a tool or instrument",
    vehicles: "Choose a vehicle proficiency",
    other: "Choose a tool",
  }[choice.category] || "Choose an option";
  const validation = selectedValue ? "" : `<p class="finishing-validation">${placeholder} before finishing.</p>`;
  const note = `${choice.note ? `<p>${choice.note}</p>` : ""}${validation}`;
  return `
    <section class="finishing-card">
      ${renderInlinePicker({
        id: `choice:${choice.id}`,
        label: choice.label,
        value: selectedValue,
        placeholder,
        options,
        helper: choice.helper,
        note,
        actionType: "finishing-choice",
      })}
      <div class="personality-actions">
        <button class="secondary-button" type="button" data-random-finishing-choice="${choice.id}">Randomize</button>
      </div>
    </section>
  `;
}

function renderPersonalityField(field, label, options = []) {
  const entry = getFinishingTouches(appState.character).personality[field] || {};
  const placeholders = {
    trait: "Choose a personality trait",
    ideal: "Choose an ideal",
    bond: "Choose a bond",
    flaw: "Choose a flaw",
  };
  return `
    <section class="finishing-card personality-card">
      ${renderInlinePicker({
        id: `personality:${field}`,
        label,
        value: entry.selected || "",
        placeholder: placeholders[field],
        options: options.map((option) => ({ value: option, label: option })),
        actionType: "personality-select",
        skipped: Boolean(entry.skipped),
      })}
      ${entry.skipped ? '<p>This will be left blank on your sheet.</p>' : ""}
      <div class="personality-actions">
        <button class="secondary-button" type="button" data-random-personality="${field}">Randomize</button>
        <button class="secondary-button" type="button" data-skip-personality="${field}">Skip this for now</button>
      </div>
      <label class="custom-personality-label">Custom text
        <textarea data-personality-custom="${field}" rows="2" placeholder="Optional custom ${label.toLowerCase()}">${escapeHtml(entry.custom || "")}</textarea>
      </label>
    </section>
  `;
}

function renderAlignmentField() {
  const entry = getFinishingTouches(appState.character).alignment || {};
  return `
    <section class="finishing-card personality-card">
      ${renderInlinePicker({
        id: "alignment",
        label: "Alignment",
        value: entry.selected || "",
        placeholder: "Choose an alignment",
        options: DND_DATA.alignments.map((alignment) => ({ value: alignment, label: alignment })),
        helper: "Alignment is a roleplay guide for your character's general outlook.",
        actionType: "alignment-select",
        skipped: Boolean(entry.skipped),
      })}
      ${entry.skipped ? '<p>This will be left blank on your sheet.</p>' : ""}
      <div class="personality-actions">
        <button class="secondary-button" type="button" data-random-alignment>Randomize</button>
        <button class="secondary-button" type="button" data-skip-alignment>Skip this for now</button>
      </div>
    </section>
  `;
}

function renderTrinketSection() {
  const trinketEntry = getFinishingTouches(appState.character).trinket || {};
  const selectedTrinket = getSelectedTrinket(appState.character);
  const options = DND_DATA.trinkets.map((trinket) => ({ value: trinket.id, label: `#${trinket.roll} - ${trinket.description}` }));
  return `
    <section class="finishing-section">
      <div class="finishing-section-header">
        <h3>Optional Trinket</h3>
        <p>Optional rule. Ask your DM before using a rolled or chosen trinket.</p>
      </div>
      <section class="finishing-card trinket-card">
        ${renderInlinePicker({
          id: "trinket",
          label: "Choose Trinket",
          value: trinketEntry.id || "",
          placeholder: "Choose a trinket",
          options,
          helper: selectedTrinket ? `Selected: #${selectedTrinket.roll} - ${selectedTrinket.description}` : "",
          actionType: "trinket-select",
        })}
        <div class="personality-actions">
          <button class="secondary-button" type="button" data-roll-trinket>Roll Random Trinket</button>
          ${selectedTrinket ? '<button class="secondary-button" type="button" data-clear-trinket>Clear Trinket</button>' : ""}
        </div>
      </section>
    </section>
  `;
}

function renderFinishingStep(step) {
  const background = getById(DND_DATA.backgrounds, appState.character.backgroundId);
  const choices = getFinishingChoices(appState.character);
  const canFinish = hasValidAbilityAssignments()
    && hasCompleteSkillSelections(appState.character)
    && hasCompleteSpellSelection(appState.character)
    && hasCompleteFinishingTouches(appState.character);
  const personality = background ? background.personality || {} : {};
  const shouldConfirmBlankName = canFinish && appState.confirmBlankName && !appState.character.name.trim();
  const blankNameConfirmation = shouldConfirmBlankName
    ? `
      <section class="blank-name-confirmation" aria-live="polite">
        <strong>Finish without a character name?</strong>
        <p>You can leave the name blank, but your final sheet will not show a character name.</p>
        <div class="blank-name-actions">
          <button class="secondary-button" type="button" data-action="focus-character-name">Go Back</button>
          <button class="primary-button" type="button" data-action="finish-without-name">Finish Without Name</button>
        </div>
      </section>
    `
    : "";

  wizardStep.innerHTML = `
    <p class="progress-text">${step.progress}</p>
    <h2>${step.title}</h2>
    ${guidancePanel(stepGuidance.finishing)}
    ${blankNameConfirmation}
    <section class="finishing-card">
      <label>Character Name
        <input type="text" data-character-name value="${escapeHtml(appState.character.name || "")}" placeholder="Enter character name" />
      </label>
      <p>You can name your character now or leave it blank.</p>
    </section>
    <section class="finishing-section">
      <h3>Remaining Choices</h3>
      ${choices.length ? choices.map((choice) => renderFinishingChoiceCard(choice)).join("") : '<div class="finishing-empty">No required choices left. You can add optional background details or continue.</div>'}
    </section>
    <section class="finishing-section">
      <div class="finishing-section-header">
        <h3>Optional character details</h3>
        <p>These help roleplay your character, but you can skip them for now.</p>
      </div>
      <div class="personality-grid">
        ${renderAlignmentField()}
        ${renderPersonalityField("trait", "Personality Trait", personality.trait || [])}
        ${renderPersonalityField("ideal", "Ideal", personality.ideal || [])}
        ${renderPersonalityField("bond", "Bond", personality.bond || [])}
        ${renderPersonalityField("flaw", "Flaw", personality.flaw || [])}
      </div>
    </section>
    ${renderTrinketSection()}
    <div class="wizard-actions"><button class="secondary-button" type="button" data-action="back">Back</button><button class="secondary-button" type="button" data-randomize-finishing>Randomize</button><button class="primary-button" type="button" data-action="finish" ${canFinish ? "" : "disabled"}>Finish</button></div>
  `;
}

function renderAbilityStep(step) {
  const controls = appState.abilityMethod === ABILITY_METHODS.rolled ? rolledScoreControls() : appState.abilityMethod === ABILITY_METHODS.pointBuy ? pointBuyControls() : standardArrayControls();
  wizardStep.innerHTML = `<p class="progress-text">${step.progress}</p><h2>${step.title}</h2>${renderAbilityScoreGuidancePanel()}${methodSelector()}<div class="method-content">${controls}</div><div class="wizard-actions"><button class="secondary-button" type="button" data-action="back">Back</button><button class="primary-button" type="button" data-action="continue" ${hasValidAbilityAssignments() ? "" : "disabled"}>Continue</button></div>`;
}

function renderSkillsStep(step) {
  const characterClass = getById(DND_DATA.classes, appState.character.classId);
  const race = getById(DND_DATA.races, appState.character.raceId);
  const background = getById(DND_DATA.backgrounds, appState.character.backgroundId);
  const choice = getClassSkillChoice(appState.character);
  const selectedCount = getSelectedClassSkillNames(appState.character).length;
  const canFinish = hasValidAbilityAssignments() && hasCompleteSkillSelections(appState.character);
  const progressText = choice.choose ? `${selectedCount} of ${choice.choose} selected` : "No class skill choices required";
  const skillGroups = choice.options.reduce((groups, skillName) => {
    if (getGrantedSkillSources(skillName, race, background).length) groups.alreadyProficient.push(skillName);
    else groups.selectable.push(skillName);
    return groups;
  }, { selectable: [], alreadyProficient: [] });
  const helperText = choice.choose && selectedCount === choice.choose
    ? "Unselect one to choose a different skill."
    : choice.choose
      ? `Choose ${choice.choose} class skills.`
      : progressText;

  wizardStep.innerHTML = `
    <p class="progress-text">${step.progress}</p>
    <h2>${step.title}</h2>
    ${guidancePanel(stepGuidance.skills)}
    <section class="skill-choice-summary">
      <h3>${characterClass ? characterClass.name : "Class"} Skills</h3>
      <p>Selected: ${choice.choose ? `${selectedCount} / ${choice.choose}` : "0 / 0"}</p>
      <p class="skill-choice-helper">${helperText}</p>
    </section>
    <section class="skill-choice-section">
      <h3>Class Skill Choices</h3>
    <div class="skill-choice-grid">
        ${skillGroups.selectable.length ? skillGroups.selectable.map((skillName) => renderSkillCard(skillName, race, background)).join("") : "<p>No selectable class skills available.</p>"}
    </div>
    </section>
    ${skillGroups.alreadyProficient.length ? `
      <section class="skill-choice-section already-proficient-section">
        <h3>Already Proficient</h3>
        <div class="skill-choice-grid">
          ${skillGroups.alreadyProficient.map((skillName) => renderSkillCard(skillName, race, background, { informational: true })).join("")}
        </div>
      </section>
    ` : ""}
    <div class="wizard-actions"><button class="secondary-button" type="button" data-action="back">Back</button><button class="secondary-button" type="button" data-action="randomize-current" ${choice.choose ? "" : "disabled"}>Randomize</button><button class="primary-button" type="button" data-action="continue" ${canFinish ? "" : "disabled"}>Continue</button></div>
  `;
}

function formatSpellLevel(spell) {
  return spell.level === 0 ? "Cantrip" : `Level ${spell.level}`;
}

function renderSpellSelectionCard(spell, selectionType, selectedIds, limit) {
  const isSelected = selectedIds.includes(spell.id);
  const isAtLimit = selectedIds.length >= limit && !isSelected;
  return `
    <article class="spell-choice-card ${isSelected ? "selected" : ""} ${isAtLimit ? "disabled" : ""}">
      <button class="spell-select-button" type="button" data-spell-selection="${selectionType}" data-spell-id="${spell.id}" ${isAtLimit ? "disabled" : ""} aria-pressed="${isSelected}">
        <span class="spell-card-main">
          <span class="spell-card-heading">
            <strong>${spell.name}</strong>
            <span>${formatSpellLevel(spell)} - ${spell.school}</span>
          </span>
          <span class="spell-card-facts">
            ${renderSpellFactBoxes(spell)}
          </span>
        </span>
      </button>
      <details class="spell-card-detail-toggle">
        <summary>Open details</summary>
        <span class="spell-card-details">
          ${renderSpellDetailContent(spell)}
        </span>
      </details>
    </article>
  `;
}

function renderSpellSelectionSection(title, helper, selectionType, spells, selectedIds, limit) {
  return `
    <section class="spell-selection-section">
      <div class="spell-selection-header">
        <h3>${title}</h3>
        <span>${selectedIds.length} / ${limit} selected</span>
      </div>
      <p>${helper}</p>
      <div class="spell-choice-grid">
        ${spells.map((spell) => renderSpellSelectionCard(spell, selectionType, selectedIds, limit)).join("")}
      </div>
    </section>
  `;
}

function renderSpellSelectionStep(step) {
  const rules = getSpellSelectionRule(appState.character);
  const selections = getSpellcastingSelections(appState.character);
  const cantrips = getSpellOptionsForSelection(appState.character, "cantrips");
  const spellbookSpells = getSpellOptionsForSelection(appState.character, "spellbookSpells");
  const canContinue = hasCompleteSpellSelection(appState.character);
  const validationMessage = canContinue ? "" : spellSelectionValidationMessage(appState.character);

  wizardStep.innerHTML = `
    <p class="progress-text">${step.progress}</p>
    <h2>${step.title}</h2>
    ${guidancePanel(stepGuidance.spellSelection)}
    ${validationMessage ? `<p class="spell-selection-validation">${validationMessage}</p>` : ""}
    ${renderSpellSelectionSection("Wizard Cantrips", `Choose ${rules.cantrips} cantrips.`, "cantrips", cantrips, selections.cantrips, rules.cantrips)}
    ${renderSpellSelectionSection("Spellbook Spells", `Choose ${rules.spellbookSpells} level 1 spells for your spellbook.`, "spellbookSpells", spellbookSpells, selections.spellbookSpells, rules.spellbookSpells)}
    <div class="wizard-actions"><button class="secondary-button" type="button" data-action="back">Back</button><button class="secondary-button" type="button" data-action="randomize-current">Randomize</button><button class="primary-button" type="button" data-action="continue" ${canContinue ? "" : "disabled"}>Continue</button></div>
  `;
}
function renderWizard() {
  const step = wizardSteps[appState.wizardStepIndex];
  views.build.classList.toggle("ability-step-active", step.key === "abilities");
  views.build.classList.toggle("finishing-step-active", step.key === "finishing");
  syncAbilityScoresFromState();
  renderPreview(livePreview, appState.character);
  if (step.key === "class") renderClassStep(step);
  if (step.key === "race") renderChoiceStep(step, DND_DATA.races, appState.character.raceId, "race", (item) => item.traits.slice(0, 2).join(", "));
  if (step.key === "background") renderChoiceStep(step, DND_DATA.backgrounds, appState.character.backgroundId, "background", (item) => item.skills.join(", "));
  if (step.key === "classFeature") renderClassFeatureStep(step);
  if (step.key === "equipment") renderEquipmentStep(step);
  if (step.key === "abilities") renderAbilityStep(step);
  if (step.key === "skills") renderSkillsStep(step);
  if (step.key === "spellSelection") renderSpellSelectionStep(step);
  if (step.key === "finishing") renderFinishingStep(step);
  saveProgress();
}

function startBuild(character = createBlankCharacter(), stepIndex = 0) {
  appState.character = character;
  appState.abilityMethod = character.abilityScoreMethod || ABILITY_METHODS.standard;
  appState.abilityState = createAbilityState(character);
  appState.wizardStepIndex = stepIndex;
  appState.confirmBlankName = false;
  renderWizard();
  showView("build");
}

function goToWizardStep(stepIndex) {
  appState.wizardStepIndex = stepIndex;
  renderWizard();
  scrollBuilderStepToTop();
}

function restartCharacterCreation() {
  if (!window.confirm("Start over? This will clear your current character.")) return;
  clearSavedProgress();
  appState.character = createBlankCharacter();
  appState.abilityMethod = ABILITY_METHODS.standard;
  appState.abilityState = createAbilityState();
  appState.wizardStepIndex = 0;
  appState.openFinishingPicker = "";
  appState.confirmBlankName = false;
  syncAbilityScoresFromState();
  renderPreview(livePreview, appState.character);
  showView("home");
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

function randomClassFeatureSelection(character, group) {
  const option = DND_DATA.randomChoice(group.options);
  character.classFeatures[group.id] = option.id;
  if (group.humanoidChoices) {
    group.humanoidChoices.fields.forEach((field) => {
      delete character.classFeatures[field.id];
    });
    if (option.id === "humanoids") {
      const humanoids = DND_DATA.shuffle(group.humanoidChoices.options).slice(0, group.humanoidChoices.fields.length);
      group.humanoidChoices.fields.forEach((field, index) => {
        character.classFeatures[field.id] = humanoids[index];
      });
    }
  }
}

function getNextStepIndex() {
  for (let index = appState.wizardStepIndex + 1; index < wizardSteps.length; index += 1) {
    if (isWizardStepAvailable(wizardSteps[index])) return index;
  }
  return appState.wizardStepIndex;
}

function getPreviousStepIndex() {
  for (let index = appState.wizardStepIndex - 1; index >= 0; index -= 1) {
    if (isWizardStepAvailable(wizardSteps[index])) return index;
  }
  return appState.wizardStepIndex;
}

function isWizardStepAvailable(step) {
  if (step.key === "classFeature") return Boolean(getClassFeatureChoice(appState.character));
  if (step.key === "spellSelection") return supportsSpellSelection(appState.character);
  return true;
}

function randomizeEquipmentSelections(character) {
  if (usesRolledStartingGold(character)) {
    rerollStartingGold(character);
    return;
  }
  const definition = getEquipmentDefinition(character.classId);
  if (!definition) return;
  const selections = getEquipmentSelections(character);
  selections.method = EQUIPMENT_METHODS.take;
  selections.choices = {};

  definition.choices.forEach((group) => {
    const option = DND_DATA.randomChoice(group.options);
    const selectedChoice = { optionId: option.id };
    (option.dropdowns || []).forEach((dropdown) => {
      selectedChoice[dropdown.id] = DND_DATA.randomChoice(DND_DATA.getWeaponOptions(dropdown.list)).id;
    });
    selections.choices[group.id] = selectedChoice;
  });

}

function randomizeCurrentStep() {
  const step = wizardSteps[appState.wizardStepIndex];
  if (step.key === "class") {
    appState.character.classId = randomChoiceExcept(DND_DATA.classes, appState.character.classId).id;
    resetClassFeatureSelections(appState.character);
    resetEquipmentSelections(appState.character);
    resetSkillSelections(appState.character);
    resetSpellSelections(appState.character);
    resetFinishingTouches(appState.character);
  }
  if (step.key === "race") {
    appState.character.raceId = randomChoiceExcept(DND_DATA.races, appState.character.raceId).id;
    resetSkillSelections(appState.character);
    resetFinishingTouches(appState.character);
  }
  if (step.key === "background") {
    appState.character.backgroundId = randomChoiceExcept(DND_DATA.backgrounds, appState.character.backgroundId).id;
    resetSkillSelections(appState.character);
    resetFinishingTouches(appState.character);
  }
  if (step.key === "classFeature") {
    getClassFeatureChoiceGroups(appState.character).forEach((group) => randomClassFeatureSelection(appState.character, group));
    resetSkillSelections(appState.character);
  }
  if (step.key === "equipment") randomizeEquipmentSelections(appState.character);
  if (step.key === "skills") setRandomClassSkillSelections(appState.character);
  if (step.key === "spellSelection") setRandomSpellSelections(appState.character);
  renderWizard();
}

function randomizeAbilityScores() {
  resetSkillSelections(appState.character);
  const scores = [...DND_DATA.standardArray].sort(() => Math.random() - 0.5);
  DND_DATA.abilities.forEach((ability, index) => {
    appState.abilityState.standard.assignments[ability] = scores[index];
  });
  renderWizard();
}

function rollSixScores() {
  resetSkillSelections(appState.character);
  appState.abilityState.rolled.results = DND_DATA.rollSixAbilityScores();
  appState.abilityState.rolled.assignments = emptyAbilityScores();
  appState.abilityState.rolled.rerollCount = 0;
  renderWizard();
}

function rerollRolledAbilityScores() {
  resetSkillSelections(appState.character);
  appState.abilityState.rolled.results = DND_DATA.rollSixAbilityScores();
  appState.abilityState.rolled.assignments = emptyAbilityScores();
  appState.abilityState.rolled.rerollCount += 1;
  renderWizard();
}

function randomlyAssignRolledScores() {
  if (appState.abilityState.rolled.results.length !== 6) return;
  resetSkillSelections(appState.character);
  appState.abilityState.rolled.assignments = DND_DATA.randomlyAssignRolls(appState.abilityState.rolled.results);
  renderWizard();
}

function adjustPointBuyScore(ability, direction) {
  resetSkillSelections(appState.character);
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

function finishCharacter({ allowBlankName = false } = {}) {
  if (!hasValidAbilityAssignments() || !hasCompleteSkillSelections(appState.character) || !hasCompleteSpellSelection(appState.character) || !hasCompleteFinishingTouches(appState.character)) return;
  if (!allowBlankName && !appState.character.name.trim()) {
    appState.confirmBlankName = true;
    renderWizard();
    scrollWindowToTop();
    return;
  }
  appState.confirmBlankName = false;
  if (appState.abilityMethod === ABILITY_METHODS.pointBuy) appState.abilityState.pointBuy.finalized = true;
  syncAbilityScoresFromState();
  renderPreview(randomPreview, appState.character);
  showView("preview");
  saveProgress();
}

wizardStep.addEventListener("click", (event) => {
  const optionButton = event.target.closest("[data-option-id]");
  const methodButton = event.target.closest("[data-score-method]");
  const pointBuyButton = event.target.closest("[data-point-buy]");
  const equipmentMethodButton = event.target.closest("[data-equipment-method]");
  const equipmentChoiceButton = event.target.closest("[data-equipment-group]");
  const skillChoiceButton = event.target.closest("[data-skill-choice]");
  const spellChoiceButton = event.target.closest("[data-spell-selection]");
  const pickerToggleButton = event.target.closest("[data-picker-toggle]");
  const pickerOptionButton = event.target.closest("[data-picker-option]");
  const randomFinishingButton = event.target.closest("[data-randomize-finishing]");
  const randomFinishingChoiceButton = event.target.closest("[data-random-finishing-choice]");
  const randomAlignmentButton = event.target.closest("[data-random-alignment]");
  const skipAlignmentButton = event.target.closest("[data-skip-alignment]");
  const randomPersonalityButton = event.target.closest("[data-random-personality]");
  const skipPersonalityButton = event.target.closest("[data-skip-personality]");
  const rollTrinketButton = event.target.closest("[data-roll-trinket]");
  const clearTrinketButton = event.target.closest("[data-clear-trinket]");
  const actionButton = event.target.closest("[data-action]");

  if (randomFinishingButton) {
    randomizeFinishingTouches(appState.character);
    appState.openFinishingPicker = "";
    appState.confirmBlankName = false;
    renderWizard();
    return;
  }

  if (randomFinishingChoiceButton) {
    randomizeFinishingChoice(appState.character, randomFinishingChoiceButton.dataset.randomFinishingChoice);
    appState.openFinishingPicker = "";
    renderWizard();
    return;
  }

  if (randomAlignmentButton) {
    randomizeAlignment(appState.character);
    appState.openFinishingPicker = "";
    renderWizard();
    return;
  }

  if (skipAlignmentButton) {
    getFinishingTouches(appState.character).alignment = { selected: "", skipped: true };
    appState.openFinishingPicker = "";
    renderWizard();
    return;
  }

  if (pickerToggleButton) {
    const pickerId = pickerToggleButton.dataset.pickerToggle;
    appState.openFinishingPicker = appState.openFinishingPicker === pickerId ? "" : pickerId;
    renderWizard();
    return;
  }

  if (pickerOptionButton) {
    const pickerId = pickerOptionButton.dataset.pickerOption;
    const value = pickerOptionButton.dataset.pickerValue;
    const action = pickerOptionButton.dataset.pickerAction;
    if (action === "finishing-choice") {
      const choiceId = pickerId.replace("choice:", "");
      getFinishingTouches(appState.character).choices[choiceId] = value;
    }
    if (action === "personality-select") {
      const field = pickerId.replace("personality:", "");
      getFinishingTouches(appState.character).personality[field] = { selected: value, custom: "", skipped: false };
    }
    if (action === "alignment-select") {
      getFinishingTouches(appState.character).alignment = { selected: value, skipped: false };
    }
    if (action === "trinket-select") {
      getFinishingTouches(appState.character).trinket = { id: value, source: "chosen" };
    }
    appState.openFinishingPicker = "";
    renderWizard();
    return;
  }

  if (skipPersonalityButton) {
    const field = skipPersonalityButton.dataset.skipPersonality;
    getFinishingTouches(appState.character).personality[field] = { selected: "", custom: "", skipped: true };
    appState.openFinishingPicker = "";
    renderWizard();
    return;
  }

  if (randomPersonalityButton) {
    const field = randomPersonalityButton.dataset.randomPersonality;
    const background = getById(DND_DATA.backgrounds, appState.character.backgroundId);
    const options = background && background.personality ? background.personality[field] || [] : [];
    if (!options.length) return;
    getFinishingTouches(appState.character).personality[field] = { selected: DND_DATA.randomChoice(options), custom: "", skipped: false };
    appState.openFinishingPicker = "";
    renderWizard();
    return;
  }

  if (rollTrinketButton) {
    setRandomTrinket(appState.character);
    appState.openFinishingPicker = "";
    renderWizard();
    return;
  }

  if (clearTrinketButton) {
    clearTrinket(appState.character);
    appState.openFinishingPicker = "";
    renderWizard();
    return;
  }

  if (skillChoiceButton) {
    const skillName = skillChoiceButton.dataset.skillChoice;
    const selectedSkills = getSelectedClassSkillNames(appState.character);
    if (selectedSkills.includes(skillName)) {
      delete appState.character.classSkillProficiencies[skillName];
    } else {
      const choice = getClassSkillChoice(appState.character);
      if (selectedSkills.length >= choice.choose) return;
      appState.character.classSkillProficiencies[skillName] = 1;
    }
    renderWizard();
    return;
  }

  if (spellChoiceButton) {
    toggleSpellSelection(appState.character, spellChoiceButton.dataset.spellSelection, spellChoiceButton.dataset.spellId);
    renderWizard();
    return;
  }

  if (equipmentMethodButton) {
    const selections = getEquipmentSelections(appState.character);
    selections.method = equipmentMethodButton.dataset.equipmentMethod;
    if (selections.method === EQUIPMENT_METHODS.gold) ensureRolledStartingGold(appState.character);
    renderWizard();
    return;
  }

  if (equipmentChoiceButton) {
    if (event.target.closest("select")) return;
    const groupId = equipmentChoiceButton.dataset.equipmentGroup;
    const optionId = equipmentChoiceButton.dataset.equipmentOption;
    const selections = getEquipmentSelections(appState.character);
    if (!groupId || !optionId) return;
    if (selections.choices[groupId] && selections.choices[groupId].optionId === optionId) return;
    selections.choices[groupId] = { optionId };
    renderWizard();
    return;
  }

  if (optionButton) {
    const optionType = optionButton.dataset.optionType;
    const optionId = optionButton.dataset.optionId;
    if (optionType === "class") {
      appState.character.classId = appState.character.classId === optionId ? "" : optionId;
      resetClassFeatureSelections(appState.character);
      resetEquipmentSelections(appState.character);
      resetSkillSelections(appState.character);
      resetSpellSelections(appState.character);
      resetFinishingTouches(appState.character);
    }
    if (optionType === "race") {
      appState.character.raceId = appState.character.raceId === optionId ? "" : optionId;
      resetSkillSelections(appState.character);
      resetFinishingTouches(appState.character);
    }
    if (optionType === "background") {
      appState.character.backgroundId = appState.character.backgroundId === optionId ? "" : optionId;
      resetSkillSelections(appState.character);
      resetFinishingTouches(appState.character);
    }
    if (optionType === "fightingStyle") {
      appState.character.classFeatures.fightingStyle = appState.character.classFeatures.fightingStyle === optionId ? "" : optionId;
      resetSkillSelections(appState.character);
    }
    const featureGroup = getClassFeatureChoiceGroups(appState.character).find((group) => group.id === optionType);
    if (featureGroup && optionType !== "fightingStyle") {
      appState.character.classFeatures[featureGroup.id] = appState.character.classFeatures[featureGroup.id] === optionId ? "" : optionId;
      if (featureGroup.humanoidChoices) {
        featureGroup.humanoidChoices.fields.forEach((field) => {
          delete appState.character.classFeatures[field.id];
        });
      }
      resetSkillSelections(appState.character);
    }
    renderWizard();
    return;
  }

  if (methodButton) {
    resetSkillSelections(appState.character);
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
    appState.confirmBlankName = false;
    goToWizardStep(getPreviousStepIndex());
    return;
  }
  if (action === "continue") {
    appState.confirmBlankName = false;
    goToWizardStep(getNextStepIndex());
    return;
  }
  if (action === "focus-character-name") {
    appState.confirmBlankName = false;
    renderWizard();
    requestAnimationFrame(() => wizardStep.querySelector("[data-character-name]")?.focus());
    return;
  }
  if (action === "finish-without-name") {
    finishCharacter({ allowBlankName: true });
    return;
  }
  if (action === "randomize-current") randomizeCurrentStep();
  if (action === "randomize-abilities") randomizeAbilityScores();
  if (action === "roll-scores") rollSixScores();
  if (action === "reroll-stats") rerollRolledAbilityScores();
  if (action === "reroll-starting-gold") {
    rerollStartingGold(appState.character);
    renderWizard();
  }
  if (action === "randomly-assign-rolled") randomlyAssignRolledScores();
  if (action === "finish") finishCharacter();
});

wizardStep.addEventListener("change", (event) => {
  if (event.target.matches("[data-class-feature-extra]")) {
    const fieldId = event.target.dataset.classFeatureExtra;
    appState.character.classFeatures[fieldId] = event.target.value;
    resetSkillSelections(appState.character);
    renderWizard();
    return;
  }

  if (event.target.matches("[data-equipment-dropdown]")) {
    const groupId = event.target.dataset.equipmentGroupId;
    const dropdownId = event.target.dataset.equipmentDropdown;
    const selections = getEquipmentSelections(appState.character);
    if (groupId && selections.choices[groupId]) selections.choices[groupId][dropdownId] = event.target.value;
    renderWizard();
    return;
  }

  if (!event.target.matches("[data-ability]")) return;
  const method = event.target.dataset.abilityMethod;
  const ability = event.target.dataset.ability;
  if (method === ABILITY_METHODS.standard) appState.abilityState.standard.assignments[ability] = event.target.value ? Number(event.target.value) : "";
  if (method === ABILITY_METHODS.rolled) appState.abilityState.rolled.assignments[ability] = event.target.value;
  resetSkillSelections(appState.character);
  renderWizard();
});

wizardStep.addEventListener("input", (event) => {
  if (event.target.matches("[data-character-name]")) {
    appState.character.name = event.target.value;
    appState.confirmBlankName = false;
    wizardStep.querySelector(".blank-name-confirmation")?.remove();
    saveProgress();
    renderPreview(livePreview, appState.character);
    return;
  }

  if (event.target.matches("[data-personality-custom]")) {
    const field = event.target.dataset.personalityCustom;
    const entry = getFinishingTouches(appState.character).personality[field] || {};
    getFinishingTouches(appState.character).personality[field] = { ...entry, custom: event.target.value, skipped: false };
    saveProgress();
    renderPreview(livePreview, appState.character);
  }
});

homeButton.addEventListener("click", restartCharacterCreation);
buildButton.addEventListener("click", () => startBuild());
randomizeButton.addEventListener("click", () => {
  showRandomAbilityPrompt();
  showView("randomize");
});
randomizeBackButton.addEventListener("click", () => {
  showRandomAbilityPrompt();
  showView("home");
});
randomEquipmentBackButton.addEventListener("click", showRandomAbilityPrompt);
rollCharacterButton.addEventListener("click", () => showRandomEquipmentPrompt(ABILITY_METHODS.rolled));
standardCharacterButton.addEventListener("click", () => showRandomEquipmentPrompt(ABILITY_METHODS.standard));
randomEquipmentPrompt.addEventListener("click", (event) => {
  const methodButton = event.target.closest("[data-random-equipment-method]");
  if (!methodButton) return;
  generateRandomCharacter(methodButton.dataset.randomEquipmentMethod);
});
editRandomButton.addEventListener("click", () => startBuild(appState.character));

function initializeApp() {
  if (restoreSavedProgress()) {
    renderWizard();
    showView("build");
    saveProgress();
    return;
  }

  syncAbilityScoresFromState();
  renderPreview(livePreview, appState.character);
}

initializeApp();











