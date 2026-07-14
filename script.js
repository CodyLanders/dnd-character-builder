const wizardSteps = [
  { key: "class", title: "Pick Your Class", progress: "Step 1 of 8 - Class" },
  { key: "race", title: "Pick Your Race", progress: "Step 2 of 8 - Race" },
  { key: "background", title: "Pick Your Background", progress: "Step 3 of 8 - Background" },
  { key: "equipment", title: "Choose Your Starting Equipment", progress: "Step 4 of 8 - Starting Equipment" },
  { key: "abilities", title: "Assign Your Ability Scores", progress: "Step 5 of 8 - Ability Scores" },
  { key: "skills", title: "Choose Skills & Proficiencies", progress: "Step 6 of 8 - Skills & Proficiencies" },
  { key: "spellSelection", title: "Choose Spells", progress: "Step 7 of 8 - Spell Selection" },
  { key: "finishing", title: "Finishing Touches", progress: "Step 8 of 8 - Finishing Touches" },
];

const stepGuidance = {
  class: `Your class is your character's main job in the party. It determines how you are trained to handle danger, the weapons and armor you can use, your starting equipment, and the abilities you bring into combat.

When choosing a class, think about:
- How you want to fight or help the group
- Whether you prefer armor, weapons, speed, or special techniques
- What role sounds most fun to play at the table

You will make more choices later, but your class is the foundation for how your character works.`,
  race: "Your race gives your character traits that can affect ability scores, movement, senses, and other special abilities. Choose the option that best fits the character you want to play.",
  background: "Your background explains what your character did before adventuring. It provides skills, tools or languages, starting equipment, and a roleplaying hook.",
  equipment: "Choose the starting equipment granted by your class. Background equipment is added automatically.",
  skills: "Choose the skill proficiencies granted by your class. Skills from your race and background are already included and cannot be chosen again.",
  spellSelection: "Choose the level 1 spells your class grants now. Some classes also receive automatic spells from a feature such as a Divine Domain.",
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

const MOBILE_BREAKPOINT_QUERY = "(max-width: 760px)";
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
const generateRandomButton = document.querySelector("#generateRandomButton");
const randomizeRestartButton = document.querySelector("#randomizeRestartButton");
const editRandomButton = document.querySelector("#editRandomButton");
const completedRestartButton = document.querySelector("#completedRestartButton");
const wizardStep = document.querySelector("#wizardStep");
const livePreview = document.querySelector("#livePreview");
const randomPreview = document.querySelector("#randomPreview");
const resetStepButton = document.querySelector("#resetStepButton");

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
    subraceId: "",
    raceChoices: { dragonbornAncestry: "", halfElfAbilities: [], halfElfSkills: [] },
    backgroundId: "",
    backgroundChoices: { backgroundId: "", version: "", choices: {}, skillReplacements: {}, toolReplacements: {}, details: {} },
    classFeatures: { fightingStyle: "" },
    skillProficiencies: {},
    classSkillProficiencies: {},
    domainSkillProficiencies: {},
    expertise: {},
    savingThrowProficiencies: {},
    savingThrowExpertise: {},
    baseAbilities: emptyAbilityScores(),
    abilities: emptyAbilityScores(),
    equipmentSelections: { classId: "", method: EQUIPMENT_METHODS.take, choices: {}, rolledGold: null, startingGoldRerollCount: 0 },
    equipment: [],
    spellcasting: { cantrips: [], spellbookSpells: [], preparedSpells: [], natureBonusCantrip: [], racialCantrip: [] },
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
  randomSetup: { abilityMethod: "standard-array", equipmentMethod: EQUIPMENT_METHODS.take },
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
  const savedBackgroundChoices = savedCharacter.backgroundChoices || {};
  const savedBackground = getById(DND_DATA.backgrounds, savedCharacter.backgroundId || "");
  const migratedBackgroundVersion = savedBackgroundChoices.version || (savedBackground && savedBackground.variants ? "standard" : "");
  const resolvedRace = DND_DATA.resolveRaceSelection
    ? DND_DATA.resolveRaceSelection(savedCharacter.raceId || "", savedCharacter.subraceId || "")
    : { raceId: savedCharacter.raceId || "", subraceId: savedCharacter.subraceId || "" };
  return {
    ...blank,
    ...savedCharacter,
    raceId: resolvedRace.raceId,
    subraceId: resolvedRace.subraceId,
    raceChoices: {
      ...blank.raceChoices,
      ...(savedCharacter.raceChoices || {}),
      halfElfAbilities: Array.isArray(savedCharacter.raceChoices && savedCharacter.raceChoices.halfElfAbilities) ? savedCharacter.raceChoices.halfElfAbilities : [],
      halfElfSkills: Array.isArray(savedCharacter.raceChoices && savedCharacter.raceChoices.halfElfSkills) ? savedCharacter.raceChoices.halfElfSkills : [],
    },
    backgroundChoices: {
      backgroundId: savedBackgroundChoices.backgroundId === savedCharacter.backgroundId ? savedCharacter.backgroundId : "",
      version: migratedBackgroundVersion,
      choices: { ...((savedBackgroundChoices && savedBackgroundChoices.choices) || {}) },
      skillReplacements: { ...((savedBackgroundChoices && savedBackgroundChoices.skillReplacements) || {}) },
      toolReplacements: { ...((savedBackgroundChoices && savedBackgroundChoices.toolReplacements) || {}) },
      details: { ...((savedBackgroundChoices && savedBackgroundChoices.details) || {}) },
    },
    classFeatures: { ...blank.classFeatures, ...(savedCharacter.classFeatures || {}) },
    skillProficiencies: { ...blank.skillProficiencies, ...(savedCharacter.skillProficiencies || {}) },
    classSkillProficiencies: { ...blank.classSkillProficiencies, ...(savedCharacter.classSkillProficiencies || {}) },
    domainSkillProficiencies: { ...blank.domainSkillProficiencies, ...(savedCharacter.domainSkillProficiencies || {}) },
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
      preparedSpells: Array.isArray(savedCharacter.spellcasting && savedCharacter.spellcasting.preparedSpells) ? savedCharacter.spellcasting.preparedSpells : [],
      natureBonusCantrip: Array.isArray(savedCharacter.spellcasting && savedCharacter.spellcasting.natureBonusCantrip) ? savedCharacter.spellcasting.natureBonusCantrip : [],
      racialCantrip: Array.isArray(savedCharacter.spellcasting && savedCharacter.spellcasting.racialCantrip) ? savedCharacter.spellcasting.racialCantrip : [],
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
  const spellChoices = [...(spellcasting.cantrips || []), ...(spellcasting.spellbookSpells || []), ...(spellcasting.preparedSpells || []), ...(spellcasting.natureBonusCantrip || []), ...(spellcasting.racialCantrip || [])].some(Boolean);
  const raceChoiceProgress = Object.values(character.raceChoices || {}).some((value) => Array.isArray(value) ? value.length > 0 : Boolean(value));

  return Boolean(
    character.classId
    || character.raceId
    || character.subraceId
    || raceChoiceProgress
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
      version: 2,
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

function normalizeSavedWizardStepIndex(saved) {
  if (!Number.isInteger(saved.wizardStepIndex)) return 0;
  if (Number(saved.version) < 2) {
    if (saved.wizardStepIndex === 3) return 0;
    if (saved.wizardStepIndex > 3) return Math.min(saved.wizardStepIndex - 1, wizardSteps.length - 1);
  }
  return Math.min(Math.max(saved.wizardStepIndex, 0), wizardSteps.length - 1);
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
  appState.wizardStepIndex = normalizeSavedWizardStepIndex(saved);
  return true;
}

function getById(collection, id) {
  return collection.find((item) => item.id === id);
}

function getSelectedBaseRace(character) {
  return getById(DND_DATA.races, character.raceId);
}

function getSelectedRace(character) {
  return DND_DATA.getEffectiveRace
    ? DND_DATA.getEffectiveRace(character.raceId, character.subraceId)
    : getById(DND_DATA.races, character.raceId);
}

function getSubracesForSelectedRace(character) {
  return DND_DATA.getSubracesForRace ? DND_DATA.getSubracesForRace(character.raceId) : [];
}

function raceRequiresSubrace(character) {
  return getSubracesForSelectedRace(character).length > 0;
}

function getSelectedDragonbornAncestry(character) {
  if (character.raceId !== "dragonborn") return null;
  return DND_DATA.getDragonbornAncestryById ? DND_DATA.getDragonbornAncestryById((character.raceChoices || {}).dragonbornAncestry) : null;
}

function raceRequiresAncestry(character) {
  return character.raceId === "dragonborn";
}

function hasCompleteRaceSelection(character) {
  return Boolean(character.raceId
    && (!raceRequiresSubrace(character) || character.subraceId)
    && (!raceRequiresAncestry(character) || getSelectedDragonbornAncestry(character)));
}

function resetRaceDependentState(character) {
  character.subraceId = "";
  character.raceChoices = { dragonbornAncestry: "", halfElfAbilities: [], halfElfSkills: [] };
  resetSkillSelections(character);
  resetSpellSelections(character);
  resetFinishingRequiredChoices(character);
}

function getBackgroundChoices(character = appState.character) {
  if (!character.backgroundChoices || character.backgroundChoices.backgroundId !== character.backgroundId) {
    character.backgroundChoices = { backgroundId: character.backgroundId || "", version: "", choices: {}, skillReplacements: {}, toolReplacements: {}, details: {} };
  }
  if (character.backgroundChoices.version === undefined) character.backgroundChoices.version = "";
  if (!character.backgroundChoices.choices) character.backgroundChoices.choices = {};
  if (!character.backgroundChoices.skillReplacements) character.backgroundChoices.skillReplacements = {};
  if (!character.backgroundChoices.toolReplacements) character.backgroundChoices.toolReplacements = {};
  if (!character.backgroundChoices.details) character.backgroundChoices.details = {};
  return character.backgroundChoices;
}

function resetBackgroundChoices(character) {
  character.backgroundChoices = { backgroundId: character.backgroundId || "", version: "", choices: {}, skillReplacements: {}, toolReplacements: {}, details: {} };
}

function backgroundHasVersions(background) {
  return Boolean(background && Array.isArray(background.variants) && background.variants.length);
}

function getBackgroundVersion(character = appState.character) {
  return getBackgroundChoices(character).version || "";
}

function setBackgroundVersion(character, versionId) {
  getBackgroundChoices(character).version = versionId || "";
}

function getBackgroundVersionOptions(background) {
  return backgroundHasVersions(background) ? background.variants : [];
}

function getSelectedBackgroundVersion(background, character = appState.character) {
  const versionId = getBackgroundVersion(character);
  return getBackgroundVersionOptions(background).find((version) => version.id === versionId) || null;
}

function mergeChoiceGroupsForVersion(background, version) {
  const removeIds = new Set((version && version.removeChoiceIds) || []);
  const overrides = (version && version.choiceOverrides) || {};
  const inherited = backgroundChoiceGroups(background)
    .filter((choice) => !removeIds.has(choice.id))
    .map((choice) => ({ ...choice, ...(overrides[choice.id] || {}) }));
  return [...inherited, ...((version && version.addChoiceGroups) || [])];
}

function getActiveBackground(character = appState.character) {
  const background = getById(DND_DATA.backgrounds, character.backgroundId);
  if (!background) return null;
  const version = getSelectedBackgroundVersion(background, character);
  if (!version || version.id === "standard") {
    return { ...background, baseName: background.name, versionId: version ? "standard" : "", versionLabel: "" };
  }
  return {
    ...background,
    ...version,
    id: background.id,
    baseName: background.name,
    name: version.name || background.name,
    versionId: version.id,
    versionLabel: version.variantLabel || "",
    skills: version.skills || background.skills || [],
    tools: Object.prototype.hasOwnProperty.call(version, "tools") ? version.tools : background.tools || [],
    languages: Object.prototype.hasOwnProperty.call(version, "languages") ? version.languages : background.languages || [],
    equipment: Object.prototype.hasOwnProperty.call(version, "equipment") ? version.equipment : background.equipment || [],
    equipmentItems: Object.prototype.hasOwnProperty.call(version, "equipmentItems") ? version.equipmentItems : background.equipmentItems || [],
    choiceGroups: mergeChoiceGroupsForVersion(background, version),
    optionalDetails: version.replaceOptionalDetails ? version.optionalDetails || [] : [...(background.optionalDetails || []), ...(version.optionalDetails || [])],
    fixedChoices: version.fixedChoices || [],
    feature: version.feature || background.feature,
    personality: background.personality,
    startingGoldGp: Number.isFinite(Number(version.startingGoldGp)) ? Number(version.startingGoldGp) : background.startingGoldGp,
  };
}

function backgroundVersionIsRequired(character = appState.character) {
  const background = getById(DND_DATA.backgrounds, character.backgroundId);
  return backgroundHasVersions(background) && !getBackgroundVersion(character);
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function showView(viewName, options = {}) {
  Object.values(views).forEach((view) => view.classList.add("hidden"));
  views[viewName].classList.remove("hidden");
  document.querySelector(".app-shell")?.classList.toggle("completed-view-active", viewName === "preview");
  updateUtilityBarState();
  if (options.scroll !== false) scrollToCurrentViewTop();
}

function renderRandomSetupSelections() {
  views.randomize.querySelectorAll("[data-random-ability-method]").forEach((button) => {
    const isSelected = button.dataset.randomAbilityMethod === appState.randomSetup.abilityMethod;
    button.classList.toggle("selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
  views.randomize.querySelectorAll("[data-random-equipment-method]").forEach((button) => {
    const isSelected = button.dataset.randomEquipmentMethod === appState.randomSetup.equipmentMethod;
    button.classList.toggle("selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
}

function optimizeRolledCharacterAbilities(character) {
  const sortedRolls = [...(character.rolledScores || [])].sort((a, b) => b.total - a.total);
  const preferredScores = DND_DATA.assignStandardArray(character.classId || "");
  const abilityOrder = DND_DATA.abilities
    .map((ability) => ({ ability, priority: preferredScores[ability] || 0 }))
    .sort((a, b) => b.priority - a.priority)
    .map((entry) => entry.ability);
  const assignments = emptyAbilityScores();
  abilityOrder.forEach((ability, index) => {
    assignments[ability] = sortedRolls[index] ? sortedRolls[index].id : "";
  });
  character.rolledAssignments = assignments;
  character.baseAbilities = DND_DATA.abilities.reduce((scores, ability) => {
    const roll = sortedRolls.find((item) => item.id === assignments[ability]);
    scores[ability] = roll ? roll.total : "";
    return scores;
  }, {});
  character.abilities = DND_DATA.applyRaceIncreases(character.baseAbilities, character.raceId, character.subraceId, character.raceChoices);
  character.spellcasting = DND_DATA.randomSpellSelectionForClass(character.classId, {
    abilities: character.abilities,
    domainId: character.classFeatures.divineDomain,
    patronId: character.classFeatures.otherworldlyPatron,
  });
  const race = getSelectedRace(character);
  if (race && race.racialCantripChoice) {
    const choice = race.racialCantripChoice;
    const options = DND_DATA.shuffle(DND_DATA.getSpellsForClassLevel(choice.classId, choice.level));
    character.spellcasting.racialCantrip = options.slice(0, choice.choose).map((spell) => spell.id);
  }
}

function generateRandomCharacter() {
  const options = { equipmentMethod: appState.randomSetup.equipmentMethod };
  const character = appState.randomSetup.abilityMethod === "standard-array"
    ? DND_DATA.randomizeStandardArrayCharacter(options)
    : DND_DATA.randomizeRolledCharacter(options);
  if (appState.randomSetup.abilityMethod === "rolled-optimized") optimizeRolledCharacterAbilities(character);
  previewRandomizedCharacter(character);
}

function scrollWindowToTop() {
  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  });
}

function isMobileViewport() {
  return window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches;
}

function isDesktopViewport() {
  return !isMobileViewport();
}

function preferredScrollBehavior() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

function desktopHeaderOffset() {
  const header = document.querySelector(".app-header");
  if (!header || getComputedStyle(header).position !== "sticky") return 0;
  return Math.ceil(header.getBoundingClientRect().height);
}

function targetTopOffset() {
  return isDesktopViewport() ? desktopHeaderOffset() + 20 : stickyUtilityOffset();
}

function completedHeadingOffset() {
  return targetTopOffset();
}

function animateWindowScrollTo(targetTop, duration = 450) {
  const safeTargetTop = Math.max(targetTop, 0);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo({ top: safeTargetTop, left: 0, behavior: "auto" });
    return;
  }
  const startTop = window.scrollY;
  const distance = safeTargetTop - startTop;
  const startTime = performance.now();
  const easeInOut = (progress) => progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - ((-2 * progress + 2) ** 3) / 2;

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    window.scrollTo({ top: startTop + distance * easeInOut(progress), left: 0, behavior: "auto" });
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function navigateToCompletedSheet() {
  showView("preview", { scroll: false });
  afterLayoutFrames(() => {
    const heading = document.querySelector("#previewTitle");
    const targetTop = heading
      ? window.scrollY + heading.getBoundingClientRect().top - completedHeadingOffset()
      : 0;
    animateWindowScrollTo(targetTop, 450);
  }, 3);
}

function stickyUtilityOffset() {
  const utilityRow = document.querySelector(".utility-action-row");
  if (!utilityRow) return 12;
  return Math.ceil(utilityRow.getBoundingClientRect().height) + 10;
}

function scrollElementBelowUtilityBar(element, behavior = preferredScrollBehavior()) {
  if (!element) return;
  const targetTop = window.scrollY + element.getBoundingClientRect().top - targetTopOffset();
  window.scrollTo({ top: Math.max(targetTop, 0), left: 0, behavior });
}

function scrollSelectorBelowUtilityBar(selector, behavior = preferredScrollBehavior()) {
  scrollElementBelowUtilityBar(wizardStep.querySelector(selector), behavior);
}

function scrollToCurrentViewTop() {
  scrollWindowToTop();
}

function scrollBuilderStepToTop() {
  afterRender(() => {
    scrollElementBelowUtilityBar(wizardStep, "auto");
  });
}

function desktopActionBarOffset() {
  const actionBar = [...document.querySelectorAll(".wizard-actions")]
    .find((bar) => bar.getClientRects().length && getComputedStyle(bar).visibility !== "hidden");
  if (!actionBar || getComputedStyle(actionBar).position !== "fixed") return 24;
  return Math.ceil(actionBar.getBoundingClientRect().height) + 20;
}

function isElementComfortablyVisible(element, mode = "required") {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  const topLimit = desktopHeaderOffset() + 24;
  const bottomLimit = window.innerHeight - desktopActionBarOffset();
  if (mode === "details") {
    return rect.top >= topLimit && rect.bottom <= bottomLimit - 12;
  }
  return rect.top >= topLimit && rect.top <= bottomLimit - 120;
}

function afterRender(callback) {
  requestAnimationFrame(() => requestAnimationFrame(callback));
}

function afterLayoutFrames(callback, frames = 3) {
  if (frames <= 0) {
    callback();
    return;
  }
  requestAnimationFrame(() => afterLayoutFrames(callback, frames - 1));
}

function scrollDesktopElementIntoView(element, mode = "required") {
  if (!isDesktopViewport() || !element) return;
  if (isElementComfortablyVisible(element, mode)) return;
  const rect = element.getBoundingClientRect();
  const targetTop = mode === "details"
    ? window.scrollY + rect.bottom - (window.innerHeight - desktopActionBarOffset() - 20)
    : window.scrollY + rect.top - (window.innerHeight * 0.28);
  window.scrollTo({ top: Math.max(targetTop, 0), left: 0, behavior: preferredScrollBehavior() });
}

function scrollDesktopRequiredChoiceIntoView(selector) {
  if (!isDesktopViewport() || !selector) return;
  afterRender(() => {
    const element = wizardStep.querySelector(selector);
    scrollDesktopElementIntoView(element, "required");
  });
}

function scrollDesktopDetailsIntoView(selector) {
  if (!isDesktopViewport() || !selector) return;
  afterRender(() => {
    const element = wizardStep.querySelector(selector);
    scrollDesktopElementIntoView(element, "details");
  });
}

function scrollToClassStepTargetOnDesktop() {
  if (!isDesktopViewport()) return;
  if (!hasCompleteClassFeatureChoices(appState.character)) {
    scrollDesktopRequiredChoiceIntoView(getClassStepScrollTargetSelector(appState.character));
    return;
  }
  scrollDesktopDetailsIntoView("[data-selected-class-details]");
}

function scrollToRaceStepTargetOnDesktop() {
  if (!isDesktopViewport()) return;
  if (!hasCompleteRaceSelection(appState.character)) {
    scrollDesktopRequiredChoiceIntoView("[data-required-race-choice]");
    return;
  }
  scrollDesktopDetailsIntoView("[data-selected-race-details]");
}

function scrollToRequiredRaceChoiceOnMobile() {
  if (!isMobileViewport()) return;
  requestAnimationFrame(() => {
    scrollSelectorBelowUtilityBar("[data-required-race-choice]");
  });
}

function scrollToSelectedRaceDetailsOnMobile() {
  if (!isMobileViewport()) return;
  requestAnimationFrame(() => {
    scrollSelectorBelowUtilityBar("[data-selected-race-details]");
  });
}

function scrollToRaceStepTargetOnMobile() {
  if (!isMobileViewport()) return;
  requestAnimationFrame(() => {
    const selector = hasCompleteRaceSelection(appState.character) ? "[data-selected-race-details]" : "[data-required-race-choice]";
    scrollSelectorBelowUtilityBar(selector);
  });
}

function scrollToSelectedBackgroundDetailsOnMobile() {
  if (!isMobileViewport()) return;
  requestAnimationFrame(() => {
    scrollSelectorBelowUtilityBar("[data-selected-background-details]");
  });
}

function scrollToRequiredBackgroundChoicesOnMobile() {
  if (!isMobileViewport()) return;
  requestAnimationFrame(() => {
    scrollSelectorBelowUtilityBar("[data-required-background-choices]");
  });
}

function scrollToBackgroundVersionOnMobile() {
  if (!isMobileViewport()) return;
  requestAnimationFrame(() => {
    scrollSelectorBelowUtilityBar("[data-background-version-section]");
  });
}

function scrollToSelectedBackgroundDescriptionOnMobile() {
  if (!isMobileViewport()) return;
  requestAnimationFrame(() => {
    scrollSelectorBelowUtilityBar("[data-selected-background-description]");
  });
}

function scrollToBackgroundStepTargetOnMobile() {
  if (!isMobileViewport()) return;
  requestAnimationFrame(() => {
    const rawBackground = getById(DND_DATA.backgrounds, appState.character.backgroundId);
    const selector = backgroundHasVersions(rawBackground) && backgroundVersionIsRequired(appState.character)
      ? "[data-background-version-section]"
      : hasCompleteBackgroundChoices(appState.character)
        ? "[data-selected-background-description]"
        : "[data-required-background-choices]";
    scrollSelectorBelowUtilityBar(selector);
  });
}

function scrollToBackgroundStepTargetOnDesktop() {
  if (!isDesktopViewport()) return;
  const rawBackground = getById(DND_DATA.backgrounds, appState.character.backgroundId);
  if (backgroundHasVersions(rawBackground) && backgroundVersionIsRequired(appState.character)) {
    scrollDesktopRequiredChoiceIntoView("[data-background-version-section]");
    return;
  }
  if (!hasCompleteBackgroundChoices(appState.character)) {
    scrollDesktopRequiredChoiceIntoView("[data-required-background-choices]");
    return;
  }
  scrollDesktopDetailsIntoView("[data-selected-background-description]");
}

function scrollToFinishingStepTargetOnMobile() {
  if (!isMobileViewport()) return;
  requestAnimationFrame(() => {
    scrollSelectorBelowUtilityBar("[data-incomplete-finishing-choice]");
  });
}

function scrollToClassStepTargetOnMobile(selector) {
  if (!isMobileViewport() || !selector) return;
  requestAnimationFrame(() => {
    scrollSelectorBelowUtilityBar(selector);
  });
}

function scrollToCurrentStepDetailsOnMobile() {
  if (!isMobileViewport()) return;
  const step = wizardSteps[appState.wizardStepIndex];
  const selectors = {
    class: "[data-selected-class-details]",
    race: "[data-selected-race-details]",
    background: "[data-selected-background-description]",
  };
  const selector = step ? selectors[step.key] : "";
  if (!selector) return;
  requestAnimationFrame(() => {
    scrollSelectorBelowUtilityBar(selector);
  });
}

function resetStepButtonHtml() {
  return `
    <button class="secondary-button desktop-action-only desktop-reset-button" type="button" data-action="reset-step" ${hasResettableCurrentStepChoices() ? "" : "disabled"}>Reset Step</button>
    <button class="secondary-button desktop-action-only desktop-restart-button" type="button" data-action="restart-builder">Restart Builder</button>
  `;
}

function updateUtilityBarState() {
  const isHomeView = !views.home.classList.contains("hidden");
  const isBuildView = !views.build.classList.contains("hidden");
  const hasResettableChoices = hasResettableCurrentStepChoices();
  if (homeButton) homeButton.disabled = isHomeView;
  if (resetStepButton) resetStepButton.disabled = !isBuildView || !hasResettableChoices;
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

function getHalfElfAbilityChoices(character = appState.character) {
  return Array.isArray(character.raceChoices && character.raceChoices.halfElfAbilities)
    ? character.raceChoices.halfElfAbilities.filter((ability) => DND_DATA.abilities.includes(ability) && ability !== "Charisma")
    : [];
}

function getHalfElfSkillChoices(character = appState.character) {
  return Array.isArray(character.raceChoices && character.raceChoices.halfElfSkills)
    ? character.raceChoices.halfElfSkills.filter((skillName) => DND_DATA.skills.some((skill) => skill.name === skillName))
    : [];
}

function isHalfElf(character = appState.character) {
  return character.raceId === "half-elf";
}

function getRaceAbilityBonus(race, ability, character = appState.character) {
  const baseBonus = getRaceAbilityBonuses(race)[ability] || 0;
  const flexibleBonus = isHalfElf(character) && hasValidBaseAbilityAssignments() && getHalfElfAbilityChoices(character).includes(ability) ? 1 : 0;
  return baseBonus + flexibleBonus;
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

function hasValidBaseAbilityAssignments() {
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

function hasCompleteHalfElfAbilityChoices(character = appState.character) {
  if (!isHalfElf(character)) return true;
  return getHalfElfAbilityChoices(character).length === 2;
}

function renderHalfElfAbilityChoices() {
  if (!isHalfElf(appState.character)) return "";
  const hasCompleteBaseScores = hasValidBaseAbilityAssignments();
  const selectedAbilities = getHalfElfAbilityChoices(appState.character);
  return `
    <section class="half-elf-ability-section">
      <h3>Choose Two Half-Elf Ability Score Increases</h3>
      <p>Choose two different abilities. Charisma already receives +2 from Half-Elf. Each selected ability increases by 1.</p>
      ${hasCompleteBaseScores ? "" : '<p class="half-elf-ability-note">Assign all six base ability scores before choosing these increases.</p>'}
      <div class="half-elf-ability-grid">
        ${DND_DATA.abilities.filter((ability) => ability !== "Charisma").map((ability) => {
          const baseScore = appState.character.baseAbilities[ability];
          const isSelected = selectedAbilities.includes(ability);
          const isAtLimit = selectedAbilities.length >= 2 && !isSelected;
          const resultText = hasCompleteBaseScores ? `${baseScore} &rarr; ${Number(baseScore) + 1}` : "Available after base scores";
          return `
            <button class="half-elf-ability-card ${isSelected ? "selected" : ""}" type="button" data-half-elf-ability="${ability}" ${!hasCompleteBaseScores || isAtLimit ? "disabled" : ""} aria-pressed="${isSelected}">
              <strong>${ability}</strong>
              <span>${resultText}</span>
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function shouldShowUnassignedRacialBonus(character) {
  return character.abilityScoreMethod !== ABILITY_METHODS.pointBuy;
}

function renderAbilityScoresTable(character, race) {
  const rerollNote = character.abilityScoreMethod === ABILITY_METHODS.rolled
    ? `<p class="ability-reroll-note">Reroll Attempts: ${character.abilityScoreRerollCount || 0}</p>`
    : "";
  return `
    <section class="preview-section dense-preview-section ability-scores-section">
      <h3>Ability Scores</h3>
      ${rerollNote}
      <table class="ability-table">
        <thead><tr><th>Ability</th><th>Score</th><th>Mod</th></tr></thead>
        <tbody>
          ${DND_DATA.abilities.map((ability) => {
            const score = character.abilities[ability];
            const hasAssignedScore = hasAssignedAbilityScore(character, ability);
            const racialBonus = getRaceAbilityBonus(race, ability, character);
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
    </section>
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

function getSelectedClericDomainId(character) {
  return character.classId === "cleric" && character.classFeatures ? character.classFeatures.divineDomain || "" : "";
}

function getSelectedSorcerousOriginId(character) {
  return character.classId === "sorcerer" && character.classFeatures ? character.classFeatures.sorcerousOrigin || "" : "";
}

function isDraconicSorcerer(character) {
  return getSelectedSorcerousOriginId(character) === "draconic-bloodline";
}

function getDragonAncestor(character) {
  const group = DND_DATA.classFeatureChoices.sorcerer && DND_DATA.classFeatureChoices.sorcerer.groups[0];
  const choices = group && group.dragonAncestorChoices;
  if (!choices || !character.classFeatures) return null;
  return choices.options.find((option) => option.id === character.classFeatures.dragonAncestor) || null;
}

function getSelectedWarlockPatronId(character) {
  return character.classId === "warlock" && character.classFeatures ? character.classFeatures.otherworldlyPatron || "" : "";
}

function getSelectedWarlockPatron(character) {
  const patronId = getSelectedWarlockPatronId(character);
  const group = DND_DATA.classFeatureChoices.warlock && DND_DATA.classFeatureChoices.warlock.groups[0];
  return group ? group.options.find((option) => option.id === patronId) || null : null;
}

function getSelectedClericDomain(character) {
  const domainId = getSelectedClericDomainId(character);
  const domainGroup = DND_DATA.classFeatureChoices.cleric && DND_DATA.classFeatureChoices.cleric.groups[0];
  const option = domainGroup ? domainGroup.options.find((item) => item.id === domainId) : null;
  const mechanics = DND_DATA.clericDomainMechanics ? DND_DATA.clericDomainMechanics[domainId] : null;
  return option ? { ...option, mechanics: mechanics || {} } : null;
}

function getClericDomainProficiencies(character) {
  const domain = getSelectedClericDomain(character);
  return domain && domain.mechanics.proficiencies ? domain.mechanics.proficiencies : [];
}

function hasCharacterProficiency(character, proficiency) {
  const characterClass = getById(DND_DATA.classes, character.classId);
  const race = getSelectedRace(character);
  const staticProficiencies = characterClass ? [
    ...(characterClass.proficiencies || []),
    ...splitProficiencyText(characterClass.proficiencyDetails ? characterClass.proficiencyDetails.Armor : ""),
    ...splitProficiencyText(characterClass.proficiencyDetails ? characterClass.proficiencyDetails.Weapons : ""),
  ] : [];
  const raceProficiencies = [
    ...splitProficiencyText(race && race.proficiencyDetails ? race.proficiencyDetails.Armor : ""),
    ...splitProficiencyText(race && race.proficiencyDetails ? race.proficiencyDetails.Weapons : ""),
  ];
  return [...staticProficiencies, ...raceProficiencies, ...getClericDomainProficiencies(character)]
    .some((item) => item.toLowerCase() === proficiency.toLowerCase());
}

function getClericDomainFeatures(character) {
  const domain = getSelectedClericDomain(character);
  return domain && domain.mechanics.features ? domain.mechanics.features : [];
}

function sanitizeDomainTriggeredChoices(character) {
  if (!character.domainSkillProficiencies) character.domainSkillProficiencies = {};
  const domainId = getSelectedClericDomainId(character);
  const domainSkillChoice = getDomainSkillChoice(character);
  if (!isDraconicSorcerer(character) && character.classFeatures) delete character.classFeatures.dragonAncestor;
  if (domainId !== "knowledge") {
    const finishing = getFinishingTouches(character);
    delete finishing.choices["knowledge-language-1"];
    delete finishing.choices["knowledge-language-2"];
  }
  if (!domainSkillChoice) {
    character.domainSkillProficiencies = {};
  } else {
    const allowedSkills = new Set(domainSkillChoice.options);
    const race = getSelectedRace(character);
    const background = getActiveBackground(character);
    Object.keys(character.domainSkillProficiencies).forEach((skillName) => {
      if (!allowedSkills.has(skillName) || getUnavailableDomainSkillSources(skillName, character, race, background).length) delete character.domainSkillProficiencies[skillName];
    });
  }
  if (domainId !== "nature") {
    if (character.spellcasting && Array.isArray(character.spellcasting.natureBonusCantrip)) character.spellcasting.natureBonusCantrip = [];
  }
  if (domainId === "light" && character.spellcasting && Array.isArray(character.spellcasting.cantrips)) {
    character.spellcasting.cantrips = character.spellcasting.cantrips.filter((spellId) => spellId !== "light");
  }
}

function resetClassFeatureSelections(character) {
  character.classFeatures = { fightingStyle: "" };
  character.domainSkillProficiencies = {};
  if (character.spellcasting) character.spellcasting.natureBonusCantrip = [];
}

function sanitizeRaceTriggeredChoices(character) {
  if (!character.raceChoices) character.raceChoices = { dragonbornAncestry: "", halfElfAbilities: [], halfElfSkills: [] };
  if (!Array.isArray(character.raceChoices.halfElfAbilities)) character.raceChoices.halfElfAbilities = [];
  if (!Array.isArray(character.raceChoices.halfElfSkills)) character.raceChoices.halfElfSkills = [];

  if (!isHalfElf(character)) {
    character.raceChoices.halfElfAbilities = [];
    character.raceChoices.halfElfSkills = [];
    const finishing = getFinishingTouches(character);
    delete finishing.choices["half-elf-language-1"];
    return;
  }

  const seenAbilities = new Set();
  character.raceChoices.halfElfAbilities = character.raceChoices.halfElfAbilities
    .filter((ability) => DND_DATA.abilities.includes(ability) && ability !== "Charisma")
    .filter((ability) => {
      if (seenAbilities.has(ability)) return false;
      seenAbilities.add(ability);
      return true;
    })
    .slice(0, 2);

  const seenSkills = new Set();
  const race = getSelectedRace(character);
  const background = getActiveBackground(character);
  character.raceChoices.halfElfSkills = character.raceChoices.halfElfSkills
    .filter((skillName) => DND_DATA.skills.some((skill) => skill.name === skillName))
    .filter((skillName) => !getUnavailableHalfElfSkillSources(skillName, character, race, background).length)
    .filter((skillName) => {
      if (seenSkills.has(skillName)) return false;
      seenSkills.add(skillName);
      return true;
    })
    .slice(0, 2);
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
  if (group.dragonAncestorChoices && selectedOption.id === "draconic-bloodline") {
    return Boolean(character.classFeatures[group.dragonAncestorChoices.field.id]);
  }
  return true;
}

function hasCompleteClassFeatureChoices(character) {
  return getClassFeatureChoiceGroups(character).every((group) => hasCompleteClassFeatureGroup(character, group));
}

function getClassStepScrollTargetSelector(character) {
  const groups = getClassFeatureChoiceGroups(character);
  for (const group of groups) {
    const selectedOption = getSelectedClassFeatureOption(character, group);
    if (!selectedOption) return `[data-class-feature-group="${group.id}"]`;
    if (group.humanoidChoices && selectedOption.id === "humanoids" && !hasCompleteClassFeatureGroup(character, group)) {
      return `[data-class-feature-followup="${group.id}"]`;
    }
    if (group.dragonAncestorChoices && selectedOption.id === "draconic-bloodline" && !hasCompleteClassFeatureGroup(character, group)) {
      return `[data-class-feature-followup="${group.id}"]`;
    }
  }
  if (character.classId === "cleric" && groups.length) return "[data-cleric-faith-section]";
  return "[data-selected-class-details]";
}

function getClassFeatureGroupForExtraField(character, fieldId) {
  return getClassFeatureChoiceGroups(character).find((group) => {
    if (group.humanoidChoices && group.humanoidChoices.fields.some((field) => field.id === fieldId)) return true;
    if (group.dragonAncestorChoices && group.dragonAncestorChoices.field.id === fieldId) return true;
    return false;
  }) || null;
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

function isEquipmentOptionAvailable(character, option) {
  return !option.requiresProficiency || hasCharacterProficiency(character, option.requiresProficiency);
}

function getVisibleEquipmentOptions(group, character) {
  return group.options.filter((option) => isEquipmentOptionAvailable(character, option));
}

function clearInvalidEquipmentSelections(character) {
  const definition = getEquipmentDefinition(character.classId);
  if (!definition || usesRolledStartingGold(character)) return;
  const selections = getEquipmentSelections(character);
  definition.choices.forEach((group) => {
    const selectedChoice = selections.choices[group.id];
    if (!selectedChoice) return;
    const option = group.options.find((item) => item.id === selectedChoice.optionId);
    if (option && !isEquipmentOptionAvailable(character, option)) delete selections.choices[group.id];
  });
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
    if (!option || !isEquipmentOptionAvailable(character, option)) return;
    selectedItems.push(...getOptionItems(option, selectedChoice));
  });

  if (requireComplete && !hasCompleteEquipmentSelections(character)) return [];
  return [...selectedItems, ...fixedItems];
}

function getBackgroundEquipmentItems(character) {
  if (usesRolledStartingGold(character)) return [];
  const background = getActiveBackground(character);
  if (!background) return [];
  const fixedStructuredItems = (background.equipmentItems || []).map((itemId) => DND_DATA.getEquipmentItem(itemId)).filter(Boolean);
  const selectedEquipmentChoices = selectedBackgroundChoices(character)
    .filter((choice) => choice.equipment || (choice.category === "option" && /prayer|equipment|item/i.test(choice.label || "")))
    .map((choice) => {
      if (choice.category === "equipmentItem") return DND_DATA.getEquipmentItem(choice.value);
      if (choice.category !== "language" && choice.category !== "option") return equipmentItemForToolName(choice.value);
      return choice.value;
    })
    .filter(Boolean);
  return [...fixedStructuredItems, ...(background.equipment || []), ...selectedEquipmentChoices];
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
    if (!isEquipmentOptionAvailable(character, option)) return false;
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
  const draconicBaseAc = isDraconicSorcerer(character) && !armor.isArmor ? 13 : armor.baseAc;
  return { total: draconicBaseAc + dexBonus + conBonus + wisBonus + shieldBonus + defenseBonus, defenseBonus };
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
  return (hasLevelOneSpellcasting(character, characterClass) && DND_DATA.supportedSpellSelectionClasses.includes(classId))
    || Boolean(getRacialCantripChoice(character));
}

function getSpellcastingSelections(character) {
  if (!character.spellcasting) character.spellcasting = { cantrips: [], spellbookSpells: [], preparedSpells: [], natureBonusCantrip: [], racialCantrip: [] };
  if (!Array.isArray(character.spellcasting.cantrips)) character.spellcasting.cantrips = [];
  if (!Array.isArray(character.spellcasting.spellbookSpells)) character.spellcasting.spellbookSpells = [];
  if (!Array.isArray(character.spellcasting.preparedSpells)) character.spellcasting.preparedSpells = [];
  if (!Array.isArray(character.spellcasting.natureBonusCantrip)) character.spellcasting.natureBonusCantrip = [];
  if (!Array.isArray(character.spellcasting.racialCantrip)) character.spellcasting.racialCantrip = [];
  return character.spellcasting;
}

function resetSpellSelections(character) {
  character.spellcasting = { cantrips: [], spellbookSpells: [], preparedSpells: [], natureBonusCantrip: [], racialCantrip: [] };
}

function getSpellSelectionRule(character) {
  return DND_DATA.spellSelectionRules[character.classId] || { sections: [] };
}

function getPreparedSpellLimit(character) {
  const spellcasting = getLevelOneSpellcasting(character);
  if (spellcasting.castingType !== "prepared" && character.classId !== "wizard") return 0;
  return DND_DATA.getPreparedSpellLimit
    ? DND_DATA.getPreparedSpellLimit(character.classId, character.abilities, character.level)
    : Math.max(1, abilityModifierValue(character.abilities[spellcasting.ability]) + character.level);
}

function getSpellSelectionSections(character) {
  const rule = getSpellSelectionRule(character);
  return (rule.sections || []).map((section) => ({
    ...section,
    limit: section.limit === "prepared" ? getPreparedSpellLimit(character) : section.limit,
  }));
}

function getRacialCantripChoice(character) {
  const race = getSelectedRace(character);
  return race && race.racialCantripChoice ? race.racialCantripChoice : null;
}

function getGrantedRacialCantripEntries(character) {
  const race = getSelectedRace(character);
  return race && race.racialCantrips ? race.racialCantrips : [];
}

function getGrantedRacialCantripIds(character) {
  return getGrantedRacialCantripEntries(character).map((entry) => entry.id);
}

function getSelectedRacialCantripIds(character) {
  return [...getGrantedRacialCantripIds(character), ...getSelectedSpellIds(character, "racialCantrip")];
}

function getRacialCantripSpells(character) {
  const entries = [...getGrantedRacialCantripEntries(character)];
  const choice = getRacialCantripChoice(character);
  getSelectedSpellIds(character, "racialCantrip").forEach((spellId) => {
    entries.push({ id: spellId, label: choice ? choice.label : "Racial cantrip", ability: choice ? choice.ability : "" });
  });
  return entries
    .map((entry) => {
      const spell = DND_DATA.getSpellById(entry.id);
      return spell ? { ...spell, selectionNote: "Racial Spell", sourceNote: entry.label, racialAbility: entry.ability } : null;
    })
    .filter(Boolean);
}

function getSelectedSpellIds(character, selectionType) {
  return getSpellcastingSelections(character)[selectionType] || [];
}

function getClericDomainSpellIds(character) {
  if (character.classId !== "cleric" || !DND_DATA.getClericDomainSpellIds) return [];
  return DND_DATA.getClericDomainSpellIds(character.classFeatures.divineDomain);
}

function getClericDomainSpells(character) {
  return getClericDomainSpellIds(character).map((spellId) => DND_DATA.getSpellById(spellId)).filter(Boolean);
}

function getGrantedBonusCantripIds(character) {
  const domain = getSelectedClericDomain(character);
  return domain && domain.mechanics.bonusCantrips ? domain.mechanics.bonusCantrips : [];
}

function getSelectedBonusCantripIds(character) {
  return [...getGrantedBonusCantripIds(character), ...getSelectedSpellIds(character, "natureBonusCantrip")];
}

function getBonusCantripSpells(character) {
  return getSelectedBonusCantripIds(character).map((spellId) => DND_DATA.getSpellById(spellId)).filter(Boolean);
}

function getNatureBonusCantripChoice(character) {
  const domain = getSelectedClericDomain(character);
  return domain && domain.mechanics.bonusCantripChoice ? domain.mechanics.bonusCantripChoice : null;
}

function getSpellOptionsForSelection(character, selectionType) {
  const section = getSpellSelectionSections(character).find((item) => item.id === selectionType);
  const natureChoice = getNatureBonusCantripChoice(character);
  const racialChoice = getRacialCantripChoice(character);
  const level = section ? section.level : natureChoice && selectionType === natureChoice.id ? natureChoice.level : racialChoice && selectionType === racialChoice.id ? racialChoice.level : selectionType === "cantrips" ? 0 : 1;
  const classId = natureChoice && selectionType === natureChoice.id ? natureChoice.classId : racialChoice && selectionType === racialChoice.id ? racialChoice.classId : character.classId;
  const domainSpellIds = new Set(getClericDomainSpellIds(character));
  const bonusCantripIds = new Set(getSelectedBonusCantripIds(character));
  const racialCantripIds = new Set(getGrantedRacialCantripIds(character));
  const wizardSpellbookIds = new Set(getSelectedSpellIds(character, "spellbookSpells"));
  const baseOptions = DND_DATA.getSpellsForClassLevel(classId, level);
  const warlockPatron = getSelectedWarlockPatron(character);
  const warlockExpandedIds = new Set(character.classId === "warlock" && selectionType === "spellbookSpells" && DND_DATA.getWarlockPatronExpandedSpellIds
    ? DND_DATA.getWarlockPatronExpandedSpellIds(getSelectedWarlockPatronId(character))
    : []);
  const expandedOptions = warlockExpandedIds.size ? [...warlockExpandedIds].map((spellId) => DND_DATA.getSpellById(spellId)).filter(Boolean) : [];
  return [...baseOptions, ...expandedOptions]
    .filter((spell, index, spells) => spells.findIndex((item) => item.id === spell.id) === index)
    .filter((spell) => selectionType !== "preparedSpells" || !domainSpellIds.has(spell.id))
    .filter((spell) => character.classId !== "wizard" || selectionType !== "preparedSpells" || wizardSpellbookIds.has(spell.id))
    .filter((spell) => selectionType !== "cantrips" || (!bonusCantripIds.has(spell.id) && !racialCantripIds.has(spell.id)))
    .filter((spell) => selectionType !== "natureBonusCantrip" || !getSelectedSpellIds(character, "cantrips").includes(spell.id))
    .filter((spell) => selectionType !== "racialCantrip" || !getSelectedSpellIds(character, "cantrips").includes(spell.id))
    .map((spell) => warlockExpandedIds.has(spell.id) && warlockPatron
      ? { ...spell, selectionNote: "Patron Spell" }
      : racialChoice && selectionType === racialChoice.id
        ? { ...spell, selectionNote: "Racial Spell", sourceNote: racialChoice.label }
      : spell);
}

function sanitizeSpellSelections(character) {
  const selections = getSpellcastingSelections(character);
  const racialChoice = getRacialCantripChoice(character);
  const grantedRacialCantrips = new Set(getGrantedRacialCantripIds(character));
  if (grantedRacialCantrips.size) selections.cantrips = selections.cantrips.filter((spellId) => !grantedRacialCantrips.has(spellId));
  if (!racialChoice) selections.racialCantrip = [];
  if (racialChoice) selections.racialCantrip = selections.racialCantrip.slice(0, racialChoice.choose);
  if (character.classId === "wizard") {
    const spellbookIds = new Set(selections.spellbookSpells);
    selections.preparedSpells = selections.preparedSpells
      .filter((spellId) => spellbookIds.has(spellId))
      .slice(0, getPreparedSpellLimit(character));
  }
}

function hasCompleteSpellSelection(character) {
  const characterClass = getById(DND_DATA.classes, character.classId);
  if (!supportsSpellSelection(character, characterClass)) return true;
  const selections = getSpellcastingSelections(character);
  const sectionsComplete = getSpellSelectionSections(character).every((section) => selections[section.id].length === section.limit);
  const wizardPreparedSpellsAreValid = character.classId !== "wizard"
    || (
      selections.preparedSpells.length === getPreparedSpellLimit(character)
      && selections.preparedSpells.every((spellId) => selections.spellbookSpells.includes(spellId))
    );
  const natureChoice = getNatureBonusCantripChoice(character);
  const natureComplete = !natureChoice || selections[natureChoice.id].length === natureChoice.choose;
  const racialChoice = getRacialCantripChoice(character);
  const racialComplete = !racialChoice || selections[racialChoice.id].length === racialChoice.choose;
  return sectionsComplete && wizardPreparedSpellsAreValid && natureComplete && racialComplete;
}

function spellSelectionValidationMessage(character) {
  const selections = getSpellcastingSelections(character);
  const messages = getSpellSelectionSections(character)
    .map((section) => {
      const missing = Math.max(section.limit - selections[section.id].length, 0);
      if (!missing) return "";
      if (section.id === "cantrips") return `${missing} more ${missing === 1 ? "cantrip" : "cantrips"}`;
      if (section.id === "preparedSpells") return `${missing} more prepared ${missing === 1 ? "spell" : "spells"}`;
      if (getLevelOneSpellcasting(character).castingType === "known") return `${missing} more known ${missing === 1 ? "spell" : "spells"}`;
      return `${missing} more spellbook ${missing === 1 ? "spell" : "spells"}`;
    })
    .filter(Boolean);
  const natureChoice = getNatureBonusCantripChoice(character);
  if (natureChoice) {
    const missingNature = Math.max(natureChoice.choose - getSelectedSpellIds(character, natureChoice.id).length, 0);
    if (missingNature) messages.push(`${missingNature} Nature Domain bonus ${missingNature === 1 ? "cantrip" : "cantrips"}`);
  }
  const racialChoice = getRacialCantripChoice(character);
  if (racialChoice) {
    const missingRacial = Math.max(racialChoice.choose - getSelectedSpellIds(character, racialChoice.id).length, 0);
    if (missingRacial) messages.push(`${missingRacial} ${racialChoice.label}`);
  }
  if (character.classId === "wizard") {
    const preparedLimit = getPreparedSpellLimit(character);
    const preparedCount = getSelectedSpellIds(character, "preparedSpells").length;
    if (preparedCount < preparedLimit) messages.push(`${preparedLimit - preparedCount} more prepared ${preparedLimit - preparedCount === 1 ? "spell" : "spells"} from your spellbook`);
  }
  return messages.length ? `Choose ${messages.join(" and ")}.` : "";
}

function setRandomSpellSelections(character) {
  character.spellcasting = DND_DATA.randomSpellSelectionForClass(character.classId, {
    abilities: character.abilities,
    level: character.level,
    domainId: character.classFeatures.divineDomain,
    patronId: character.classFeatures.otherworldlyPatron,
  });
  const selections = getSpellcastingSelections(character);
  const racialChoice = getRacialCantripChoice(character);
  if (racialChoice) {
    const options = DND_DATA.shuffle(getSpellOptionsForSelection(character, racialChoice.id));
    selections[racialChoice.id] = options.slice(0, racialChoice.choose).map((spell) => spell.id);
  }
  sanitizeSpellSelections(character);
}

function toggleSpellSelection(character, selectionType, spellId) {
  const section = getSpellSelectionSections(character).find((item) => item.id === selectionType);
  const natureChoice = getNatureBonusCantripChoice(character);
  const racialChoice = getRacialCantripChoice(character);
  const limit = section ? section.limit : natureChoice && selectionType === natureChoice.id ? natureChoice.choose : racialChoice && selectionType === racialChoice.id ? racialChoice.choose : 0;
  const selections = getSpellcastingSelections(character);
  const current = selections[selectionType] || [];
  if (current.includes(spellId)) {
    selections[selectionType] = current.filter((id) => id !== spellId);
    sanitizeSpellSelections(character);
    return;
  }
  if (current.length >= limit) return;
  const validIds = new Set(getSpellOptionsForSelection(character, selectionType).map((spell) => spell.id));
  if (validIds.has(spellId)) selections[selectionType] = [...current, spellId];
  sanitizeSpellSelections(character);
}

function toggleWizardPreparedSpell(character, spellId) {
  if (character.classId !== "wizard") return;
  const selections = getSpellcastingSelections(character);
  if (!selections.spellbookSpells.includes(spellId)) return;
  if (selections.preparedSpells.includes(spellId)) {
    selections.preparedSpells = selections.preparedSpells.filter((id) => id !== spellId);
  } else {
    if (selections.preparedSpells.length >= getPreparedSpellLimit(character)) return;
    selections.preparedSpells = [...selections.preparedSpells, spellId];
  }
  sanitizeSpellSelections(character);
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

function calculateRacialSpellSaveDc(character, ability) {
  if (!ability || !hasAssignedAbilityScore(character, ability)) return "";
  return 8 + getProficiencyBonus(character) + abilityModifierValue(character.abilities[ability]);
}

function calculateRacialSpellAttackBonus(character, ability) {
  if (!ability || !hasAssignedAbilityScore(character, ability)) return "";
  return formatSpellAttackBonus(getProficiencyBonus(character) + abilityModifierValue(character.abilities[ability]));
}

function calculateBreathWeaponSaveDc(character) {
  if (!hasAssignedAbilityScore(character, "Constitution")) return "";
  return 8 + abilityModifierValue(character.abilities.Constitution) + getProficiencyBonus(character);
}

function calculateHitPoints(character, characterClass) {
  if (!characterClass) return "Not selected";
  if (!hasAssignedAbilityScore(character, "Constitution")) return "Assign Constitution";
  const draconicBonus = isDraconicSorcerer(character) ? 1 : 0;
  const raceBonus = getSelectedRace(character)?.hpBonus || 0;
  return characterClass.hitDie + abilityModifierValue(character.abilities.Constitution) + draconicBonus + raceBonus;
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
  const background = getActiveBackground(character);
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
  mergeSkillLevels(levels, getBackgroundSkillReplacementValues(character));
  mergeSkillLevels(levels, race ? race.skills : []);
  mergeSkillLevels(levels, race ? race.skillProficiencies : {});
  mergeSkillLevels(levels, character.classSkillProficiencies || {});
  mergeSkillLevels(levels, character.domainSkillProficiencies || {});
  mergeSkillLevels(levels, isHalfElf(character) ? getHalfElfSkillChoices(character) : []);
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
    <section class="preview-section dense-preview-section saving-throws-section">
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
      </table>
    </section>`;
}

function renderSkillsTable(character, race, background) {
  const proficiencyBonus = getProficiencyBonus(character);
  const skillLevels = getSkillProficiencyLevels(character, race, background);
  return `
    <section class="preview-section dense-preview-section skills-section">
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
      </table>
    </section>`;
}

function resetSkillSelections(character) {
  character.classSkillProficiencies = {};
  character.domainSkillProficiencies = {};
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

function getDomainSkillChoice(character) {
  const domain = getSelectedClericDomain(character);
  return domain && domain.mechanics.skillChoices ? domain.mechanics.skillChoices : null;
}

function getSelectedDomainSkillNames(character) {
  const choice = getDomainSkillChoice(character);
  if (!choice) return [];
  const allowedSkills = new Set(choice.options);
  return Object.entries(character.domainSkillProficiencies || {})
    .filter(([skillName, level]) => allowedSkills.has(skillName) && Number(level) > 0)
    .map(([skillName]) => skillName);
}

function getGrantedSkillSources(skillName, race, background) {
  const sources = [];
  const raceSkills = [...(race ? race.skills || [] : []), ...Object.keys(normalizeSkillSource(race ? race.skillProficiencies : {}))];
  const backgroundSkills = background ? background.skills || [] : [];
  const backgroundReplacementSkills = getBackgroundSkillReplacementValues(appState.character);
  if (backgroundSkills.includes(skillName)) sources.push("Background");
  if (backgroundReplacementSkills.includes(skillName)) sources.push("Background Replacement");
  if (raceSkills.includes(skillName)) sources.push("Race");
  if (isHalfElf(appState.character) && getHalfElfSkillChoices(appState.character).includes(skillName)) sources.push("Half-Elf Skill Versatility");
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
    druid: ["Nature", "Animal Handling", "Survival", "Perception"],
    bard: ["Performance", "Persuasion", "Deception", "Insight"],
    sorcerer: ["Arcana", "Persuasion", "Deception", "Intimidation"],
    warlock: ["Arcana", "Deception", "Intimidation", "Investigation"],
  };
  const tags = [];
  if (isAlreadyProficient) tags.push("Already Proficient");
  if (characterClass && (classFitSkills[characterClass.id] || []).includes(skill.name)) tags.push("Class Fit");
  return tags;
}

function hasCompleteSkillSelections(character) {
  const choice = getClassSkillChoice(character);
  const domainChoice = getDomainSkillChoice(character);
  const background = getActiveBackground(character);
  const race = getSelectedRace(character);
  const choices = getBackgroundChoices(character);
  const hasBackgroundReplacements = getBackgroundSkillDuplicateSlots(character, race, background)
    .every((slot) => getBackgroundReplacementSkillOptions(character, slot.id).includes(choices.skillReplacements[slot.id]));
  const hasClassSkills = getSelectedClassSkillNames(character).length === choice.choose;
  const hasDomainSkills = !domainChoice || getSelectedDomainSkillNames(character).length === domainChoice.choose;
  const hasHalfElfSkills = !isHalfElf(character) || getHalfElfSkillChoices(character).length === 2;
  return hasBackgroundReplacements && hasClassSkills && hasDomainSkills && hasHalfElfSkills;
}

function randomizeBackgroundSkillReplacement(character, slotId) {
  const options = getBackgroundReplacementSkillOptions(character, slotId);
  if (!options.length) return;
  getBackgroundChoices(character).skillReplacements[slotId] = DND_DATA.randomChoice(options);
  resetSkillSelections(character);
}

function setRandomClassSkillSelections(character) {
  const background = getActiveBackground(character);
  const race = getSelectedRace(character);
  getBackgroundSkillDuplicateSlots(character, race, background).forEach((slot) => randomizeBackgroundSkillReplacement(character, slot.id));
  const choice = getClassSkillChoice(character);
  const availableSkills = DND_DATA.shuffle(choice.options.filter((skillName) => !getGrantedSkillSources(skillName, race, background).length));
  character.classSkillProficiencies = {};
  availableSkills.slice(0, choice.choose).forEach((skillName) => {
    character.classSkillProficiencies[skillName] = 1;
  });
  setRandomDomainSkillSelections(character);
  setRandomHalfElfSkillSelections(character);
}

function getUnavailableDomainSkillSources(skillName, character, race, background) {
  const sources = getGrantedSkillSources(skillName, race, background);
  if (character.classSkillProficiencies && character.classSkillProficiencies[skillName]) sources.push("Class Skills");
  return sources;
}

function getUnavailableHalfElfSkillSources(skillName, character, race, background) {
  const sources = [];
  const raceSkills = [...(race ? race.skills || [] : []), ...Object.keys(normalizeSkillSource(race ? race.skillProficiencies : {}))];
  const backgroundSkills = background ? background.skills || [] : [];
  if (backgroundSkills.includes(skillName)) sources.push("Background");
  if (getBackgroundSkillReplacementValues(character).includes(skillName)) sources.push("Background Replacement");
  if (raceSkills.includes(skillName)) sources.push("Race");
  if (character.classSkillProficiencies && character.classSkillProficiencies[skillName]) sources.push("Class Skills");
  if (character.domainSkillProficiencies && character.domainSkillProficiencies[skillName]) sources.push("Domain Skills");
  return sources;
}

function setRandomHalfElfSkillSelections(character) {
  if (!isHalfElf(character)) return;
  const race = getSelectedRace(character);
  const background = getActiveBackground(character);
  const availableSkills = DND_DATA.shuffle(DND_DATA.skills
    .map((skill) => skill.name)
    .filter((skillName) => !getUnavailableHalfElfSkillSources(skillName, character, race, background).length));
  if (!character.raceChoices) character.raceChoices = { dragonbornAncestry: "", halfElfAbilities: [], halfElfSkills: [] };
  character.raceChoices.halfElfSkills = availableSkills.slice(0, 2);
}

function setRandomDomainSkillSelections(character) {
  const choice = getDomainSkillChoice(character);
  character.domainSkillProficiencies = {};
  if (!choice) return;
  const race = getSelectedRace(character);
  const background = getActiveBackground(character);
  const availableSkills = DND_DATA.shuffle(choice.options.filter((skillName) => !getUnavailableDomainSkillSources(skillName, character, race, background).length));
  availableSkills.slice(0, choice.choose).forEach((skillName) => {
    character.domainSkillProficiencies[skillName] = choice.expertise ? 2 : 1;
  });
}

function renderBackgroundSkillReplacementSection(race, background) {
  const slots = getBackgroundSkillDuplicateSlots(appState.character, race, background);
  if (!slots.length) return "";
  const renderReplacementControl = (slot) => {
    const selectedValue = getBackgroundChoices(appState.character).skillReplacements[slot.id] || "";
    const options = getBackgroundReplacementSkillOptions(appState.character, slot.id).map((skillName) => ({ value: skillName, label: skillName }));
    const pickerId = `background-skill-replacement:${slot.id}`;
    const isOpen = appState.openFinishingPicker === pickerId;
    const selectedOption = options.find((option) => option.value === selectedValue);
    return `
      <div class="replacement-skill-control">
        <button class="secondary-button" type="button" data-random-background-skill-replacement="${slot.id}">Randomize Choice</button>
        <div class="replacement-skill-picker inline-picker ${isOpen ? "open" : ""}">
          <button class="inline-picker-trigger" type="button" data-picker-toggle="${pickerId}" aria-expanded="${isOpen}">
            <span>${selectedOption ? selectedOption.label : "Choose a skill"}</span>
          </button>
          ${isOpen ? `<div class="inline-picker-options">${options.map((option) => `<button type="button" data-picker-option="${pickerId}" data-picker-action="background-skill-replacement" data-picker-value="${option.value}"><span>${option.label}</span></button>`).join("")}</div>` : ""}
        </div>
      </div>
    `;
  };
  if (slots.length === 1) {
    const slot = slots[0];
    return `
      <section class="skill-choice-section background-skill-replacement-section">
        <h3>Replacement Skill</h3>
        <p>${slot.sources.join(" and ")} both grant ${slot.skillName}. Choose another skill proficiency.</p>
        ${renderReplacementControl(slot)}
      </section>
    `;
  }
  return `
    <section class="skill-choice-section background-skill-replacement-section">
      <h3>Replacement Skills</h3>
      <p>Some skills were granted more than once. Choose a replacement for each duplicate.</p>
      <div class="replacement-skill-row-list">
        ${slots.map((slot) => `
          <div class="replacement-skill-row">
            <strong>${slot.skillName} &mdash; ${slot.sources.join(" and ")}</strong>
            ${renderReplacementControl(slot)}
          </div>
        `).join("")}
      </div>
    </section>
  `;
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

function renderDomainSkillCard(skillName, race, background) {
  const skill = DND_DATA.skills.find((item) => item.name === skillName);
  if (!skill) return "";
  const choice = getDomainSkillChoice(appState.character);
  const selectedSkills = getSelectedDomainSkillNames(appState.character);
  const isSelected = selectedSkills.includes(skillName);
  const blockedSources = getUnavailableDomainSkillSources(skillName, appState.character, race, background);
  const proficiencyLevel = isSelected ? (choice.expertise ? 2 : 1) : 0;
  const totalBonus = getSkillBonus(appState.character, skill, proficiencyLevel || 0);
  const isAtLimit = selectedSkills.length >= choice.choose && !isSelected;
  const disabled = Boolean(blockedSources.length) || isAtLimit;
  const note = blockedSources.length ? `Already proficient from ${blockedSources.join(" and ")}` : choice.expertise ? "Doubled proficiency for this domain skill." : "";

  return `
    <button class="skill-choice-card ${isSelected ? "selected" : ""} ${blockedSources.length ? "already-proficient" : ""}" type="button" data-domain-skill-choice="${skillName}" ${disabled ? "disabled" : ""} aria-pressed="${isSelected}">
      <span class="skill-choice-main">
        <strong>${skill.name}</strong>
        <span class="skill-choice-spacer"></span>
        <span class="skill-modifier">${DND_DATA.abilityShortLabels[skill.ability]}: ${formatSkillModifier(totalBonus)}</span>
      </span>
      ${note ? `<span class="skill-choice-note">${note}</span>` : ""}
    </button>
  `;
}

function renderDomainSkillSection(race, background) {
  const choice = getDomainSkillChoice(appState.character);
  if (!choice) return "";
  const selectedCount = getSelectedDomainSkillNames(appState.character).length;
  const helper = selectedCount === choice.choose
    ? "Unselect one to choose a different domain skill."
    : `Choose ${choice.choose} bonus ${choice.choose === 1 ? "skill" : "skills"}.`;
  return `
    <section class="skill-choice-summary">
      <h3>${choice.label}</h3>
      <p>Selected: ${selectedCount} / ${choice.choose}</p>
      <p class="skill-choice-helper">${helper}${choice.expertise ? " Selected Knowledge skills get doubled proficiency." : ""}</p>
    </section>
    <section class="skill-choice-section">
      <h3>${choice.label}</h3>
      <div class="skill-choice-grid">
        ${choice.options.map((skillName) => renderDomainSkillCard(skillName, race, background)).join("")}
      </div>
    </section>
  `;
}

function renderHalfElfSkillCard(skillName, race, background) {
  const skill = DND_DATA.skills.find((item) => item.name === skillName);
  if (!skill) return "";
  const selectedSkills = getHalfElfSkillChoices(appState.character);
  const isSelected = selectedSkills.includes(skillName);
  const blockedSources = getUnavailableHalfElfSkillSources(skillName, appState.character, race, background);
  const isAtLimit = selectedSkills.length >= 2 && !isSelected;
  const disabled = Boolean(blockedSources.length) || isAtLimit;
  const totalBonus = getSkillBonus(appState.character, skill, isSelected ? 1 : 0);
  const note = blockedSources.length ? `Already proficient from ${blockedSources.join(" and ")}` : "";
  return `
    <button class="skill-choice-card ${isSelected ? "selected" : ""} ${blockedSources.length ? "already-proficient" : ""}" type="button" data-half-elf-skill="${skillName}" ${disabled ? "disabled" : ""} aria-pressed="${isSelected}">
      <span class="skill-choice-main">
        <strong>${skill.name}</strong>
        <span class="skill-choice-spacer"></span>
        <span class="skill-modifier">${DND_DATA.abilityShortLabels[skill.ability]}: ${formatSkillModifier(totalBonus)}</span>
      </span>
      ${note ? `<span class="skill-choice-note">${note}</span>` : ""}
    </button>
  `;
}

function renderHalfElfSkillSection(race, background) {
  if (!isHalfElf(appState.character)) return "";
  const selectedCount = getHalfElfSkillChoices(appState.character).length;
  const helper = selectedCount === 2
    ? "Unselect one to choose a different Half-Elf skill."
    : "Choose any two additional skill proficiencies.";
  return `
    <section class="skill-choice-summary">
      <h3>Half-Elf Skill Versatility</h3>
      <p>Selected: ${selectedCount} / 2</p>
      <p class="skill-choice-helper">${helper}</p>
    </section>
    <section class="skill-choice-section">
      <h3>Half-Elf Skill Versatility</h3>
      <p>Choose any two additional skill proficiencies.</p>
      <div class="skill-choice-grid">
        ${DND_DATA.skills.map((skill) => renderHalfElfSkillCard(skill.name, race, background)).join("")}
      </div>
    </section>
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
  sanitizeRaceTriggeredChoices(appState.character);
  sanitizeBackgroundChoices(appState.character);
  appState.character.abilities = DND_DATA.applyRaceIncreases(appState.character.baseAbilities, appState.character.raceId, appState.character.subraceId, appState.character.raceChoices);
  if (appState.character.classId !== "fighter") appState.character.classFeatures.fightingStyle = "";
  sanitizeDomainTriggeredChoices(appState.character);
  sanitizeSpellSelections(appState.character);
  clearInvalidEquipmentSelections(appState.character);
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

function normalizeWeaponProficiencyText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isWeaponProficient(character, item) {
  if (!item || item.type !== "weapon") return false;
  const characterClass = getById(DND_DATA.classes, character.classId);
  const race = getSelectedRace(character);
  const weaponProficiencies = proficiencyEntries(character, characterClass, race, "Weapons")
    .map((entry) => normalizeWeaponProficiencyText(entry.text));
  const category = normalizeWeaponProficiencyText(item.category);
  const weaponName = normalizeWeaponProficiencyText(item.name);
  const pluralName = weaponName.endsWith("s") ? weaponName : `${weaponName}s`;

  return weaponProficiencies.some((proficiency) => {
    if (!proficiency || proficiency === "none") return false;
    if (/martial weapons?/.test(proficiency) && category === "martial weapon") return true;
    if (/simple weapons?/.test(proficiency) && category === "simple weapon") return true;
    return proficiency === weaponName || proficiency === pluralName;
  });
}

function getWeaponAttackBonus(character, item) {
  const styleBonus = shouldApplyArchery(character, item) ? 2 : 0;
  const proficiencyBonus = isWeaponProficient(character, item) ? getProficiencyBonus(character) : 0;
  return formatAttackBonus(getWeaponAbilityInfo(character, item).modifier + proficiencyBonus + styleBonus);
}

function formatDamage(damage, modifier, bonus = 0, includeModifier = true) {
  if (!damage) return "None";
  const totalModifier = (includeModifier ? modifier : 0) + bonus;
  if (totalModifier === 0) return damage;
  return `${damage} ${totalModifier > 0 ? "+" : "-"} ${Math.abs(totalModifier)}`;
}

function formatDamageType(damageType) {
  return damageType ? damageType.charAt(0).toUpperCase() + damageType.slice(1) : "Special";
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
  if (item.id === "net") {
    const notes = [
      "A net has no damage die. On a hit, a Large or smaller creature is restrained until freed; it has no effect on formless or Huge or larger creatures.",
      "A creature can use its action to make a DC 10 Strength check to free itself or another creature within reach. Dealing 5 slashing damage to the net also frees the creature and destroys it.",
      "When you use an action, bonus action, or reaction to attack with a net, you can make only one attack with that action.",
    ];
    if (!isWeaponProficient(character, item)) notes.push("Your current proficiencies do not include this weapon, so the attack bonus does not include proficiency.");
    return notes;
  }
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
  if (!isWeaponProficient(character, item)) notes.push("Your current proficiencies do not include this weapon, so the attack bonus does not include proficiency.");
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
    if (item.type === "weapon") entries.push(createWeaponCardEntry(character, item));
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
    if (item.type === "shield") return `${item.name} &mdash; +2 AC`;
    return item.name;
  });
  return { entries, note: getArmorDefenseNote(armor, hasShield, hasDefenseStyle, hasProtectionStyle, character) };
}

function weaponEquipmentEntries(items) {
  return items
    .filter((item) => typeof item !== "string" && item.type === "weapon")
    .map((item) => ({ text: item.name }));
}

function toolEntries(items) {
  return items.filter((item) => typeof item !== "string" && item.type === "tool").map((item) => {
    const description = getToolDescription(item.name);
    return { text: item.name, children: item.contents && item.contents.length ? item.contents : description ? [description] : [] };
  });
}

function renderOwnedToolRows(items) {
  const tools = items.filter((item) => typeof item !== "string" && item.type === "tool");
  if (!tools.length) return "";
  return `
    <h4 class="preview-subheading">Tools & Kits Carried</h4>
    <div class="compact-detail-list">
      ${tools.map((item) => {
        const description = getToolDescription(item.name);
        const components = item.contents && item.contents.length ? item.contents.join(", ") : getToolTypicalComponents(item.name);
        const details = [
          detailBlock("Common uses", description),
          detailBlock("Typical components", components),
          "This is equipment you carry. Ownership does not automatically grant proficiency.",
        ].filter(Boolean);
        return `
          <details class="compact-detail-row">
            <summary>
              <span class="compact-detail-heading">
                <strong>${item.name}</strong>
                <span>Equipment you carry</span>
              </span>
            </summary>
            <div class="compact-detail-body">
              ${details.map(renderDetailContent).join("")}
            </div>
          </details>
        `;
      }).join("")}
    </div>
  `;
}

function renderPackCards(items) {
  const packs = items.filter((item) => typeof item !== "string" && item.type === "pack");
  if (!packs.length) return "";
  return `
    <h4 class="preview-subheading">Equipment Packs</h4>
    <div class="compact-detail-list">
      ${packs.map((pack) => `
        <details class="compact-detail-row equipment-pack-row">
          <summary>
            <span class="compact-detail-heading">
              <strong>${pack.name}</strong>
              <span>Equipment bundle you carry</span>
            </span>
            <span class="compact-detail-action">View contents</span>
          </summary>
          <div class="compact-detail-body">
            <span class="guidance-section-label">Contents</span>
            <ul>${(pack.contents || []).map((item) => `<li>${item}</li>`).join("")}</ul>
          </div>
        </details>
      `).join("")}
    </div>
  `;
}

function isAdventuringGearString(item) {
  return /pack|backpack|bag|ball bearings|string|bell|candle|crowbar|hammer|piton|lantern|oil|ration|tinderbox|waterskin|rope|staff|trap|clothes|clothing|costume|map|knife|token|shovel|pot|pouch|dice|cards|letter|hair|charm|bottle|ring|tools/i.test(item);
}

function adventuringGearEntries(items) {
  const entries = [];
  items.forEach((item) => {
    if (typeof item === "string") {
      if (isAdventuringGearString(item)) entries.push({ text: item });
      return;
    }
    if (item.type === "pack") return;
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

function renderPreviewSection(title, subtitle, content, className = "") {
  if (!content) return "";
  return `
    <section class="preview-section ${className}">
      <h3>${title}</h3>
      ${subtitle ? `<p class="preview-section-subtitle">${subtitle}</p>` : ""}
      ${content}
    </section>
  `;
}

function renderCompactDetailRows(entries, defaultSubtitle = "Details") {
  if (!entries.length) return "";
  return `
    <div class="compact-detail-list">
      ${entries.map((entry) => `
        <details class="compact-detail-row">
          <summary>
            <span class="compact-detail-heading">
              <strong>${entry.title}</strong>
              <span>${entry.subtitle || defaultSubtitle}</span>
            </span>
            <span class="compact-detail-action">View details</span>
          </summary>
          <div class="compact-detail-body">
            ${entry.details.map(renderDetailContent).join("")}
          </div>
        </details>
      `).join("")}
    </div>
  `;
}

function detailBlock(label, text) {
  if (!text) return "";
  return `<div class="detail-block"><span class="guidance-section-label">${label}</span><p>${text}</p></div>`;
}

function renderDetailContent(detail) {
  const text = String(detail || "").trim();
  return text.startsWith("<") ? text : `<p>${text}</p>`;
}

function splitFeatureText(featureText) {
  const [name, ...descriptionParts] = String(featureText || "").split(" - ");
  return {
    name: name.trim(),
    description: descriptionParts.join(" - ").trim() || String(featureText || "").trim(),
  };
}

function isActiveFeatureName(name) {
  return /breath weapon|rage|second wind|bardic inspiration|lay on hands|divine sense|martial arts|sneak attack|arcane recovery|warding flare|wrath of the storm|blessing of the trickster|war priest|fey presence|dark one's blessing|awakened mind/i.test(name);
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

function getToolDescription(toolName) {
  const descriptions = DND_DATA.toolDescriptions || {};
  const normalizedName = String(toolName || "").toLowerCase();
  const key = Object.keys(descriptions).find((item) => item.toLowerCase() === normalizedName);
  return key ? descriptions[key] : "";
}

function getToolTypicalComponents(toolName) {
  const components = DND_DATA.toolTypicalComponents || {};
  const normalizedName = String(toolName || "").toLowerCase();
  const key = Object.keys(components).find((item) => item.toLowerCase() === normalizedName);
  return key ? components[key] : "";
}

function toolEntry(toolName) {
  const description = getToolDescription(toolName);
  return description ? { text: toolName, children: [description] } : { text: toolName };
}

function renderToolProficiencyRows(entries) {
  const tools = entries.filter((entry) => entry.text !== "None");
  if (!tools.length) return "<p class=\"empty-state\">None</p>";
  return `
    <div class="compact-detail-list tool-proficiency-list">
      ${tools.map((entry) => {
        const components = getToolTypicalComponents(entry.text);
        const description = getToolDescription(entry.text);
        const details = [
          detailBlock("Common uses", description),
          detailBlock("Typical components", components),
        ].filter(Boolean);
        return `
          <details class="compact-detail-row">
            <summary>
              <span class="compact-detail-heading">
                <strong>${entry.text}</strong>
              </span>
              ${details.length ? '<span class="compact-detail-action">View details</span>' : ""}
            </summary>
            <div class="compact-detail-body">
              ${details.map(renderDetailContent).join("")}
            </div>
          </details>
        `;
      }).join("")}
    </div>
  `;
}

function splitProficiencyText(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function isChoicePlaceholder(value) {
  return /^(one|three)\b/i.test(String(value || "").trim());
}

function backgroundChoiceGroups(background) {
  return background && Array.isArray(background.choiceGroups) ? background.choiceGroups : [];
}

function getEntertainerRoutineCount(character) {
  if (character.backgroundId !== "entertainer") return 1;
  const count = Number(getBackgroundChoices(character).choices.entertainerRoutineCount) || 1;
  return Math.max(1, Math.min(3, count));
}

function setEntertainerRoutineCount(character, count) {
  if (character.backgroundId !== "entertainer") return;
  getBackgroundChoices(character).choices.entertainerRoutineCount = Math.max(1, Math.min(3, count));
}

function getRoutineChoiceIndex(choice) {
  const match = String(choice.id || "").match(/entertainer-routine-(\d+)/);
  return match ? Number(match[1]) : 0;
}

function visibleBackgroundChoiceGroups(background, character = appState.character) {
  return backgroundChoiceGroups(background).filter((choice) => {
    if (choice.requiresChoice) {
      const selectedValue = getBackgroundChoices(character).choices[choice.requiresChoice.id] || "";
      if (selectedValue !== choice.requiresChoice.value) return false;
    }
    if (!choice.optionalRoutine) return true;
    return getRoutineChoiceIndex(choice) <= getEntertainerRoutineCount(character);
  });
}

function isEntertainerRoutineChoice(choice) {
  return choice && choice.uniqueGroup === "entertainer-routines";
}

function getAllToolOptionNames() {
  const seen = new Set();
  return Object.values(DND_DATA.toolOptions || {}).flat().filter((tool) => {
    const key = String(tool || "").toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function equipmentItemForToolName(toolName) {
  const normalizedName = String(toolName || "").toLowerCase();
  const item = Object.values(DND_DATA.equipmentItems || {})
    .find((equipmentItem) => equipmentItem.type === "tool" && equipmentItem.name.toLowerCase() === normalizedName);
  if (item) return item;
  if (!toolName) return null;
  return {
    id: `backgroundTool:${toolName}`,
    name: toolName,
    type: "tool",
    detail: `${toolName} - tool set`,
  };
}

function selectedBackgroundChoices(character) {
  const background = getActiveBackground(character);
  const selections = getBackgroundChoices(character).choices;
  return [
    ...((background && background.fixedChoices) || []),
    ...visibleBackgroundChoiceGroups(background, character)
    .map((choice) => ({ ...choice, value: selections[choice.id] || "" }))
    .filter((choice) => choice.value),
  ];
}

function selectedFinishingChoices(character) {
  const selections = getFinishingTouches(character).choices;
  return getFinishingChoices(character)
    .map((choice) => ({ ...choice, value: selections[choice.id] || "" }))
    .filter((choice) => choice.value);
}

function selectedLanguageValues(character) {
  return [
    ...selectedBackgroundChoices(character).filter((choice) => choice.category === "language").map((choice) => choice.value),
    ...selectedFinishingChoices(character).filter((choice) => choice.category === "language").map((choice) => choice.value),
  ];
}

function selectedToolValues(character) {
  return [
    ...selectedBackgroundChoices(character).filter((choice) => choice.category !== "language" && choice.category !== "option" && choice.category !== "equipmentItem").map((choice) => choice.value),
    ...selectedBackgroundChoices(character).map((choice) => getChoiceGrantedTool(choice, choice.value)).filter(Boolean),
    ...selectedFinishingChoices(character).filter((choice) => choice.category !== "language").map((choice) => choice.value),
  ];
}

function getChoiceGrantedTool(choice, value) {
  if (!choice || !choice.grantsTool) return "";
  if (typeof choice.grantsTool === "string") return choice.grantsTool;
  return choice.grantsTool[value] || "";
}

function getBaseSkillNamesBeforeBackground(character, race) {
  return [
    ...(race ? race.skills || [] : []),
    ...Object.keys(normalizeSkillSource(race ? race.skillProficiencies : {})),
  ];
}

function getBackgroundSkillDuplicateSlots(character, race, background) {
  if (!background) return [];
  const existing = new Set(getBaseSkillNamesBeforeBackground(character, race));
  return (background.skills || [])
    .filter((skillName) => existing.has(skillName))
    .map((skillName, index) => ({ id: `${skillName}-${index}`, skillName, sources: [race ? race.name : "Race", background.name] }));
}

function getBackgroundSkillReplacementValues(character) {
  const choices = getBackgroundChoices(character).skillReplacements;
  return Object.values(choices || {}).filter(Boolean);
}

function getClassToolNames(character) {
  const characterClass = getById(DND_DATA.classes, character.classId);
  return splitProficiencyText(characterClass && characterClass.proficiencyDetails ? characterClass.proficiencyDetails.Tools : "")
    .filter((tool) => tool !== "None" && !isChoicePlaceholder(tool));
}

function getBackgroundToolDuplicateSlots(character, race, background) {
  if (!background) return [];
  const existing = new Set([
    ...(race ? race.tools || [] : []),
    ...getClassToolNames(character),
  ].map((tool) => String(tool || "").toLowerCase()));
  const backgroundTools = [
    ...(background.tools || []),
    ...selectedBackgroundChoices(character).map((choice) => getChoiceGrantedTool(choice, choice.value)).filter(Boolean),
  ];
  return backgroundTools
    .filter((tool) => tool && !isChoicePlaceholder(tool) && existing.has(String(tool).toLowerCase()))
    .map((tool, index) => ({ id: `${tool}-${index}`, tool }));
}

function getBackgroundToolReplacementValues(character) {
  const choices = getBackgroundChoices(character).toolReplacements;
  return Object.values(choices || {}).filter(Boolean);
}

function languageEntries(character, race, background) {
  const languages = [
    ...(race ? race.languages || [] : []),
    ...(background ? background.languages || [] : []),
    ...(character.classId === "druid" ? ["Druidic"] : []),
    ...(isDraconicSorcerer(character) ? ["Draconic"] : []),
    ...selectedLanguageValues(character),
  ];
  return uniqueTextEntries(languages);
}

function toolProficiencyEntries(character, characterClass, race, background) {
  const tools = [
    ...(race ? race.tools || [] : []),
    ...(background ? background.tools || [] : []).filter((tool) => !isChoicePlaceholder(tool)),
    ...splitProficiencyText(characterClass && characterClass.proficiencyDetails ? characterClass.proficiencyDetails.Tools : "")
      .filter((tool) => tool !== "None" && !isChoicePlaceholder(tool)),
    ...selectedToolValues(character),
    ...getBackgroundToolReplacementValues(character),
  ];
  const seen = new Set();
  const entries = [];
  tools.forEach((tool) => {
    const text = String(tool || "").trim();
    if (!text || seen.has(text.toLowerCase())) return;
    seen.add(text.toLowerCase());
    entries.push(toolEntry(text));
  });
  return entries.length ? entries : [{ text: "None" }];
}

function proficiencyEntries(character, characterClass, race, label) {
  const classId = characterClass ? characterClass.id : "";
  const domainProficiencies = classId === "cleric" ? getClericDomainProficiencies(character) : [];
  const domainArmor = domainProficiencies.filter((item) => /armor|shield/i.test(item));
  const domainWeapons = domainProficiencies.filter((item) => /weapon/i.test(item));
  const proficiencies = [
    ...splitProficiencyText(characterClass && characterClass.proficiencyDetails ? characterClass.proficiencyDetails[label] : ""),
    ...splitProficiencyText(race && race.proficiencyDetails ? race.proficiencyDetails[label] : ""),
    ...(label === "Armor" ? domainArmor : []),
    ...(label === "Weapons" ? domainWeapons : []),
  ].filter((item) => item !== "None");
  return uniqueTextEntries(proficiencies);
}

function renderKnownProficienciesPreview(character, characterClass, race, background) {
  return [
    renderPreviewCategory("Languages", languageEntries(character, race, background)),
    renderPreviewCategory("Tool Proficiencies", toolProficiencyEntries(character, characterClass, race, background)),
    renderPreviewCategory("Armor Proficiencies", proficiencyEntries(character, characterClass, race, "Armor")),
    renderPreviewCategory("Weapon Proficiencies", proficiencyEntries(character, characterClass, race, "Weapons")),
    characterClass && characterClass.proficiencyNotes ? renderPreviewCategory("Proficiency Notes", characterClass.proficiencyNotes.map((text) => ({ text }))) : "",
  ].join("");
}

function getClassFeatureObjects(character, characterClass) {
  const classFeatures = characterClass && characterClass.features
    ? characterClass.features.map((feature) => splitFeatureText(feature))
    : [];
  const domainFeatures = getClericDomainFeatures(character);
  const sorcererFeatures = getSorcererOriginFeatures(character);
  const warlockFeatures = getWarlockPatronFeatures(character);
  return [...classFeatures, ...domainFeatures, ...sorcererFeatures, ...warlockFeatures]
    .filter((feature) => feature.name && !/^spellcasting$/i.test(feature.name));
}

function renderProficienciesTrainingPreview(character, characterClass, race, background) {
  const toolEntriesForCharacter = toolProficiencyEntries(character, characterClass, race, background);
  const rows = [
    { label: "Armor Training", value: proficiencyEntries(character, characterClass, race, "Armor").map((entry) => entry.text).join(", ") || "None" },
    { label: "Weapon Training", value: proficiencyEntries(character, characterClass, race, "Weapons").map((entry) => entry.text).join(", ") || "None" },
  ];
  const content = `
    <div class="training-row-list">
      ${rows.map((row) => `
        <div class="training-row">
          <span>${row.label}</span>
          <strong>${row.value}</strong>
        </div>
      `).join("")}
    </div>
    <h4 class="preview-subheading">Tool Proficiencies</h4>
    ${renderToolProficiencyRows(toolEntriesForCharacter)}
    ${characterClass && characterClass.proficiencyNotes ? `<div class="equipment-note">${characterClass.proficiencyNotes.join(" ")}</div>` : ""}
  `;
  return renderPreviewSection(
    "Proficiencies & Training",
    "Training your character has. This does not necessarily mean your character owns the related equipment.",
    content,
    "training-section",
  );
}

function renderSimpleFactsPreview(character, race, background) {
  const content = [
    renderPreviewCategory("Damage Resistances", getDamageResistanceEntries(character)),
  ].join("");
  return renderPreviewSection("Character Details", "", content, "simple-facts-section");
}

function renderFeatureActionCards(character, characterClass) {
  const features = getClassFeatureObjects(character, characterClass).filter((feature) => isActiveFeatureName(feature.name));
  if (!features.length) return "";
  return `
    <div class="weapon-card-list">
      ${features.map((feature) => `
        <details class="racial-action-card feature-action-card">
          <summary class="weapon-card-summary">
            <span class="weapon-card-heading">
              <strong>${feature.name}</strong>
              <span>${getFeatureActionSummary(feature)}</span>
            </span>
          </summary>
          <div class="weapon-card-details">
            <span class="guidance-section-label">Details</span>
            <ul>${getFeatureActionDetails(feature).map((detail) => `<li>${detail}</li>`).join("")}</ul>
          </div>
        </details>
      `).join("")}
    </div>
  `;
}

function getFeatureActionSummary(feature) {
  if (/^rage$/i.test(feature.name)) return "Bonus action &bull; 2 uses per long rest";
  return "Action your character can use";
}

function getFeatureActionDetails(feature) {
  if (!/^rage$/i.test(feature.name)) return [feature.description];
  return [
    "Activate Rage as a bonus action.",
    "You can rage 2 times, and regain expended uses when you finish a long rest.",
    "While raging, you have advantage on Strength checks.",
    "While raging, you have advantage on Strength saving throws.",
    "You gain a +2 damage bonus on melee weapon attacks made using Strength.",
    "You have resistance to bludgeoning, piercing, and slashing damage.",
    "You cannot cast spells or concentrate on spells while raging.",
    "Rage lasts up to 1 minute.",
    "Rage ends early if you are knocked unconscious.",
    "Rage also ends early if your turn ends and you have not attacked a hostile creature since your previous turn or taken damage since then.",
  ];
}

function renderTraitsAndFeaturesPreview(character, characterClass, race) {
  const ancestry = getSelectedDragonbornAncestry(character);
  const ancestryTraits = ancestry ? [
    `Draconic Ancestry - ${ancestry.name}; ${ancestry.damageType} damage; ${ancestry.area}; ${ancestry.saveAbility} saving throw.`,
    `Damage Resistance - You have resistance to ${ancestry.damageType.toLowerCase()} damage.`,
  ] : [];
  const racialTraitRows = [...(race && race.traitDetails && race.traitDetails.length ? race.traitDetails : race && race.traits ? race.traits : []), ...ancestryTraits]
    .map(splitFeatureText)
    .filter((feature) => feature.name && !/^breath weapon$/i.test(feature.name))
    .map((feature) => ({
      title: feature.name,
      subtitle: "Passive racial trait",
      details: [feature.description],
    }));
  const passiveClassRows = getClassFeatureObjects(character, characterClass)
    .filter((feature) => !isActiveFeatureName(feature.name))
    .map((feature) => ({
      title: feature.name,
      subtitle: "Passive class feature",
      details: [feature.description],
    }));
  const background = getActiveBackground(character);
  const backgroundFeatureRows = background && background.feature ? [{
    title: background.feature.name,
    subtitle: "Background feature",
    details: [background.feature.description],
  }] : [];
  return renderPreviewSection(
    "Traits & Features",
    "",
    renderCompactDetailRows([...racialTraitRows, ...passiveClassRows, ...backgroundFeatureRows]),
    "traits-section",
  );
}

function getWarlockPatronFeatures(character) {
  if (character.classId !== "warlock") return [];
  const patronId = getSelectedWarlockPatronId(character);
  if (patronId === "archfey") {
    return [{ name: "Fey Presence", description: "You can briefly charm or frighten nearby creatures. You regain this feature after a short or long rest." }];
  }
  if (patronId === "fiend") {
    return [{ name: "Dark One's Blessing", description: "When you reduce a hostile creature to 0 hit points, you gain temporary hit points equal to your Charisma modifier + your Warlock level." }];
  }
  if (patronId === "great-old-one") {
    return [{ name: "Awakened Mind", description: "You can telepathically speak to a nearby creature you can see, as long as it understands at least one language." }];
  }
  return [];
}

function getSorcererOriginFeatures(character) {
  if (character.classId !== "sorcerer") return [];
  if (isDraconicSorcerer(character)) {
    const ancestor = getDragonAncestor(character);
    return [
      { name: "Dragon Ancestor", description: ancestor ? `${ancestor.name} - ${ancestor.damageType}. This damage type matters for later Draconic features, but has little mechanical impact at level 1.` : "Choose a dragon ancestor." },
      { name: "Draconic Resilience", description: "Your draconic magic toughens your body. At level 1, your max HP increases by 1, and your AC is 13 + Dexterity modifier when you are not wearing armor." },
    ];
  }
  if (getSelectedSorcerousOriginId(character) === "wild-magic") {
    return [
      { name: "Wild Magic Surge", description: "After you cast a level 1 or higher Sorcerer spell, your DM can ask you to roll to see if a random magical effect happens." },
      { name: "Tides of Chaos", description: "You can give yourself advantage on one attack roll, ability check, or saving throw. Your DM may later ask you to roll for Wild Magic Surge after casting a spell." },
    ];
  }
  return [];
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

function getSpellDisplayTags(spell) {
  return [...(spell.selectionNotes || []), spell.selectionNote].filter(Boolean);
}

function renderSpellTags(spell) {
  const tags = getSpellDisplayTags(spell);
  return tags.map((tag) => `<span class="spell-selection-tag">${tag}</span>`).join("");
}

function renderSpellDisplayCard(spell) {
  return `
    <details class="spell-display-card">
      <summary>
        <span class="spell-card-main">
          <span class="spell-card-heading">
            <strong>${spell.name}</strong>
            <span>${formatSpellLevel(spell)} - ${spell.school}</span>
            ${renderSpellTags(spell)}
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

function getSpellcastingClassNote(character) {
  if (character.classId === "wizard") return "You prepare spells from your spellbook after a long rest. Your spellbook contains more spells than you can prepare at once.";
  if (character.classId === "cleric") return "You can prepare different Cleric spells after a long rest. Domain spells are always prepared and do not count against your prepared spells.";
  if (character.classId === "druid") return "You can prepare different Druid spells after a long rest.";
  if (character.classId === "bard") return "Your Bard spells are known spells. You do not prepare spells each day.";
  if (character.classId === "sorcerer") return "Your Sorcerer spells are known spells. You do not prepare spells each day.";
  if (character.classId === "warlock") return "Your Warlock spells are known spells. You regain your Pact Magic slot after a short or long rest.";
  return "";
}

function getWizardUnpreparedSpellbookSpells(character) {
  const preparedIds = new Set(getSelectedSpellIds(character, "preparedSpells"));
  return getSelectedSpells(character, "spellbookSpells").filter((spell) => !preparedIds.has(spell.id));
}

function mergeSpellSource(existingSpell, incomingSpell, tags) {
  const existingTags = new Set([...(existingSpell.selectionNotes || []), existingSpell.selectionNote].filter(Boolean));
  tags.forEach((tag) => existingTags.add(tag));
  return {
    ...existingSpell,
    selectionNote: "",
    selectionNotes: [...existingTags],
    racialAbility: existingSpell.racialAbility || incomingSpell.racialAbility || "",
    sourceNote: [existingSpell.sourceNote, incomingSpell.sourceNote].filter(Boolean).join("; "),
  };
}

function getCantripDisplaySpells(character) {
  const byId = new Map();
  const addSpell = (spell, tags) => {
    if (!spell) return;
    byId.set(spell.id, byId.has(spell.id)
      ? mergeSpellSource(byId.get(spell.id), spell, tags)
      : { ...spell, selectionNote: "", selectionNotes: tags });
  };

  getSelectedSpells(character, "cantrips").forEach((spell) => addSpell(spell, ["Class Spell"]));
  getBonusCantripSpells(character).forEach((spell) => addSpell(spell, ["Class Spell"]));
  getRacialCantripSpells(character).forEach((spell) => addSpell(spell, ["Racial Spell"]));
  return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function renderSpellcastingPreview(character, characterClass) {
  if (!hasLevelOneSpellcasting(character, characterClass)) return "";
  const spellcasting = getLevelOneSpellcasting(character, characterClass);
  const ability = getSpellcastingAbility(character, characterClass);
  const saveDc = calculateSpellSaveDc(character, characterClass);
  const attackBonus = calculateSpellAttackBonus(character, characterClass);
  const isPactMagic = getSpellcastingMagicType(character, characterClass) === "pact";
  const slotLabel = isPactMagic ? "Pact Magic Slot" : "Spell Slots";
  const slotCount = getLevelOneSpellSlotCount(character, characterClass);
  const cantripSpells = getSelectedSpells(character, "cantrips");
  const spellbookSpells = getSelectedSpells(character, "spellbookSpells");
  const preparedSpells = getSelectedSpells(character, "preparedSpells");
  const unpreparedSpellbookSpells = character.classId === "wizard" ? getWizardUnpreparedSpellbookSpells(character) : [];
  const domainSpells = getClericDomainSpells(character);
  const bonusCantrips = getBonusCantripSpells(character);
  const hasSpellSelection = supportsSpellSelection(character, characterClass);
  const isPreparedCaster = spellcasting.castingType === "prepared";
  const isKnownCaster = spellcasting.castingType === "known";
  const isWizard = character.classId === "wizard";
  const spellSelectionLabel = isPreparedCaster || isWizard ? "Prepared Level 1 Spells" : isKnownCaster ? "Known Level 1 Spells" : "Spellbook";
  const spellSelectionCount = isPreparedCaster || isWizard
    ? `${preparedSpells.length} / ${getPreparedSpellLimit(character)} prepared`
    : isKnownCaster
      ? `${spellbookSpells.length} known`
      : `${spellbookSpells.length} spells selected`;
  const spellcastingNote = getSpellcastingClassNote(character);

  return `
    <h3>${isPactMagic ? "Pact Magic" : "Spellcasting"}</h3>
    <div class="sheet-grid spellcasting-grid">
      <div class="sheet-item"><span class="sheet-label">Spellcasting Ability</span>${ability || "Not selected"}</div>
      <div class="sheet-item"><span class="sheet-label">Spell Save DC</span>${saveDc === "" ? `Assign ${ability}` : saveDc}</div>
      <div class="sheet-item"><span class="sheet-label">Spell Attack Bonus</span>${attackBonus === "" ? `Assign ${ability}` : attackBonus}</div>
      <div class="sheet-item"><span class="sheet-label">${slotLabel}</span>${formatLevelOneSpellSlots(slotCount)}</div>
      <div class="sheet-item"><span class="sheet-label">Cantrips</span>${hasSpellSelection ? `${cantripSpells.length} selected` : getSpellcastingCantripCount(character, characterClass)}</div>
      <div class="sheet-item"><span class="sheet-label">${hasSpellSelection ? spellSelectionLabel : "Spell Selection"}</span>${hasSpellSelection ? spellSelectionCount : spellcasting.selectionRule || "Handled in a later spell-selection phase"}</div>
      ${isWizard ? `<div class="sheet-item"><span class="sheet-label">Spellbook</span>${spellbookSpells.length} level 1 ${spellbookSpells.length === 1 ? "spell" : "spells"}</div>` : ""}
      ${character.classId === "cleric" && bonusCantrips.length ? `<div class="sheet-item"><span class="sheet-label">Bonus Cantrips</span>${bonusCantrips.map((spell) => spell.name).join(", ")}</div>` : ""}
      ${character.classId === "cleric" ? `<div class="sheet-item"><span class="sheet-label">Domain Spells</span>${domainSpells.length ? `${domainSpells.length} always prepared` : "Choose a Divine Domain"}</div>` : ""}
    </div>
    ${spellcastingNote ? `<p class="spell-selection-note">${spellcastingNote}</p>` : ""}
    ${isWizard ? renderSelectedSpellList("Prepared Level 1 Spells", preparedSpells) : ""}
    ${isWizard ? renderSelectedSpellList("Spellbook Spells Not Prepared", unpreparedSpellbookSpells) : ""}
    ${!isWizard && isPreparedCaster ? renderSelectedSpellList("Prepared Level 1 Spells", preparedSpells) : ""}
    ${!isWizard && isKnownCaster ? renderSelectedSpellList("Known Level 1 Spells", spellbookSpells) : ""}
    ${character.classId === "cleric" ? renderSelectedSpellList("Domain Spells, Always Prepared", domainSpells) : ""}
  `;
}

function renderCantripsPreview(character) {
  return renderSelectedSpellList("Cantrips", getCantripDisplaySpells(character));
}

function renderRacialMagicPreview(character) {
  const racialCantrips = getRacialCantripSpells(character);
  if (!racialCantrips.length) return "";
  const abilities = [...new Set(racialCantrips.map((spell) => spell.racialAbility).filter(Boolean))];
  const abilitySummary = abilities.length ? abilities.join(", ") : "Not selected";
  const primaryAbility = abilities[0] || "";
  const saveDc = calculateRacialSpellSaveDc(character, primaryAbility);
  const attackBonus = calculateRacialSpellAttackBonus(character, primaryAbility);
  return `
    <h3>Racial Magic</h3>
    <div class="sheet-grid spellcasting-grid">
      <div class="sheet-item"><span class="sheet-label">Spellcasting Ability</span>${abilitySummary}</div>
      <div class="sheet-item"><span class="sheet-label">Spell Save DC</span>${saveDc === "" ? `Assign ${primaryAbility || "ability scores"}` : saveDc}</div>
      <div class="sheet-item"><span class="sheet-label">Spell Attack Bonus</span>${attackBonus === "" ? `Assign ${primaryAbility || "ability scores"}` : attackBonus}</div>
      <div class="sheet-item"><span class="sheet-label">Racial Spell Sources</span>${racialCantrips.map((spell) => spell.sourceNote || spell.name).join(", ")}</div>
    </div>
  `;
}

function renderSpellsPreview(character, characterClass) {
  const content = [
    renderSpellcastingPreview(character, characterClass),
    renderRacialMagicPreview(character),
    renderCantripsPreview(character),
  ].join("");
  return renderPreviewSection("Spells", "", content, "spells-preview-section");
}

function renderRacialTraitsPreview(character, race) {
  if (!race || !(race.traitDetails || race.traits || []).length) return "";
  const ancestry = getSelectedDragonbornAncestry(character);
  const ancestryTraits = ancestry ? [
    `Draconic Ancestry - ${ancestry.name}; ${ancestry.damageType} damage; ${ancestry.area}; ${ancestry.saveAbility} saving throw.`,
    `Damage Resistance - You have resistance to ${ancestry.damageType.toLowerCase()} damage.`,
  ] : [];
  const traits = [...(race.traitDetails && race.traitDetails.length ? race.traitDetails : race.traits), ...ancestryTraits]
    .map((text) => ({ text }));
  return renderPreviewCategory("Racial Traits", traits);
}

function getDamageResistanceEntries(character) {
  const race = getSelectedRace(character);
  const ancestry = getSelectedDragonbornAncestry(character);
  const values = [
    ...((race && race.resistances) || []),
    ...(ancestry ? [ancestry.damageType] : []),
  ].map((type) => `${type} damage`);
  return values.length ? uniqueTextEntries(values) : [];
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

function resetFinishingRequiredChoices(character) {
  const finishing = getFinishingTouches(character);
  finishing.choices = {};
}

function hasResettableCurrentStepChoices() {
  const step = wizardSteps[appState.wizardStepIndex];
  if (!step) return false;
  const character = appState.character;
  if (step.key === "class") return Boolean(character.classId || Object.values(character.classFeatures || {}).some(Boolean));
  if (step.key === "race") return Boolean(character.raceId || character.subraceId || (character.raceChoices && (
    character.raceChoices.dragonbornAncestry
    || (character.raceChoices.halfElfAbilities || []).length
    || (character.raceChoices.halfElfSkills || []).length
  )));
  if (step.key === "background") return Boolean(character.backgroundId || Object.values(getBackgroundChoices(character).choices || {}).some(Boolean));
  if (step.key === "equipment") {
    const selections = getEquipmentSelections(character);
    return Boolean(selections.method !== EQUIPMENT_METHODS.take || Object.keys(selections.choices || {}).length || selections.rolledGold || selections.startingGoldRerollCount);
  }
  if (step.key === "abilities") {
    const standardTouched = Object.values(appState.abilityState.standard.assignments || {}).some((value) => value !== "");
    const rolledTouched = (appState.abilityState.rolled.results || []).length || Object.values(appState.abilityState.rolled.assignments || {}).some(Boolean) || appState.abilityState.rolled.rerollCount;
    const pointBuyTouched = Object.values(appState.abilityState.pointBuy.touched || {}).some(Boolean) || appState.abilityState.pointBuy.finalized;
    return Boolean(standardTouched || rolledTouched || pointBuyTouched || Object.values(character.baseAbilities || {}).some((value) => value !== ""));
  }
  if (step.key === "skills") {
    return Boolean(Object.keys(character.classSkillProficiencies || {}).length || Object.keys(character.domainSkillProficiencies || {}).length || (character.raceChoices && (character.raceChoices.halfElfSkills || []).length));
  }
  if (step.key === "spellSelection") {
    const spellcasting = character.spellcasting || {};
    return Boolean((spellcasting.cantrips || []).length || (spellcasting.spellbookSpells || []).length || (spellcasting.preparedSpells || []).length || (spellcasting.natureBonusCantrip || []).length || (spellcasting.racialCantrip || []).length);
  }
  if (step.key === "finishing") {
    const finishing = getFinishingTouches(character);
    return Boolean((character.name || "").trim()
      || Object.values(finishing.choices || {}).some(Boolean)
      || (finishing.alignment && (finishing.alignment.selected || finishing.alignment.skipped))
      || Object.values(finishing.personality || {}).some((entry) => entry && (entry.selected || entry.custom || entry.skipped))
      || (finishing.trinket && finishing.trinket.id));
  }
  return false;
}

function resetCurrentStepChoices() {
  const step = wizardSteps[appState.wizardStepIndex];
  if (!step) return;
  const character = appState.character;
  if (step.key === "class") {
    character.classId = "";
    resetClassFeatureSelections(character);
    resetEquipmentSelections(character);
    resetSkillSelections(character);
    resetSpellSelections(character);
    resetFinishingRequiredChoices(character);
  }
  if (step.key === "race") {
    character.raceId = "";
    resetRaceDependentState(character);
  }
  if (step.key === "background") {
    character.backgroundId = "";
    resetBackgroundChoices(character);
    resetSkillSelections(character);
    resetFinishingRequiredChoices(character);
  }
  if (step.key === "equipment") resetEquipmentSelections(character);
  if (step.key === "abilities") {
    appState.abilityState = createAbilityState();
    character.baseAbilities = emptyAbilityScores();
    character.abilities = emptyAbilityScores();
    character.rolledScores = [];
    character.rolledAssignments = emptyAbilityScores();
    character.abilityScoreRerollCount = 0;
    if (character.raceChoices) character.raceChoices.halfElfAbilities = [];
    resetSkillSelections(character);
    resetSpellSelections(character);
  }
  if (step.key === "skills") {
    resetSkillSelections(character);
    if (character.raceChoices) character.raceChoices.halfElfSkills = [];
  }
  if (step.key === "spellSelection") resetSpellSelections(character);
  if (step.key === "finishing") {
    character.name = "";
    resetFinishingTouches(character);
    appState.confirmBlankName = false;
  }
  appState.openFinishingPicker = "";
  syncAbilityScoresFromState();
}

function performResetCurrentStep() {
  if (!hasResettableCurrentStepChoices()) return;
  if (!window.confirm("Reset this step? This will clear the choices on this step only.")) return;
  resetCurrentStepChoices();
  renderWizard();
  scrollBuilderStepToTop();
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
  const race = getSelectedRace(character);
  const background = getActiveBackground(character);
  const characterClass = getById(DND_DATA.classes, character.classId);
  const choices = [];

  if (race && race.languageChoices) {
    Array.from({ length: race.languageChoices.choose || 0 }, (_, index) => {
      const choiceId = race.id === "half-elf" ? `half-elf-language-${index + 1}` : `race-language-${index + 1}`;
      choices.push(finishingChoice(
        choiceId,
        race.languageChoices.label || "Choose 1 language",
        "language",
        "Pick a language your character can speak, read, and write.",
        { note: "Ask your DM before choosing an exotic language.", preventDuplicates: true },
      ));
    });
  }

  (race && race.toolChoices ? race.toolChoices : []).forEach((toolChoice) => {
    Array.from({ length: toolChoice.choose || 0 }, (_, index) => {
      choices.push(finishingChoice(
        `${toolChoice.id}-${index + 1}`,
        toolChoice.category === "artisan" ? "Choose 1 artisan's tool" : "Choose 1 tool",
        toolChoice.category,
        "Tool proficiencies help with checks involving specialized equipment.",
        { preventDuplicates: true, options: toolChoice.options || [] },
      ));
    });
  });

  if (getSelectedClericDomainId(character) === "knowledge") {
    Array.from({ length: 2 }, (_, index) => {
      choices.push(finishingChoice(
        `knowledge-language-${index + 1}`,
        `Knowledge Domain Bonus Language ${index + 1}`,
        "language",
        "Pick a bonus language granted by Blessings of Knowledge.",
        { note: "Ask your DM before choosing an exotic language.", preventDuplicates: true },
      ));
    });
  }

  const classToolDetail = characterClass && characterClass.proficiencyDetails ? characterClass.proficiencyDetails.Tools || "" : "";
  if (character.classId === "bard") {
    Array.from({ length: 3 }, (_, index) => {
      choices.push(finishingChoice(
        `bard-instrument-${index + 1}`,
        `Bard Musical Instrument Proficiency ${index + 1}`,
        "musical",
        "Pick a musical instrument your Bard is proficient with.",
        { preventDuplicates: true },
      ));
    });
  }
  if (classToolDetail.toLowerCase().includes("one artisan") && classToolDetail.toLowerCase().includes("musical instrument")) {
    choices.push(finishingChoice("class-tool-1", "Choose 1 tool or instrument", "artisanOrMusical", "Tool proficiencies help with checks involving specialized equipment."));
  }

  if (!backgroundChoiceGroups(background).length) {
    (background ? background.tools || [] : []).forEach((tool, index) => {
      const normalizedTool = tool.toLowerCase();
      if (normalizedTool.includes("one gaming set")) choices.push(finishingChoice(`background-tool-${index}`, "Choose 1 gaming set", "gaming", "Tool proficiencies help with checks involving specialized equipment."));
      if (normalizedTool.includes("one musical instrument")) choices.push(finishingChoice(`background-tool-${index}`, "Choose 1 musical instrument", "musical", "Tool proficiencies help with checks involving specialized equipment."));
      if (normalizedTool.includes("one artisan")) choices.push(finishingChoice(`background-tool-${index}`, "Choose 1 artisan's tool", "artisan", "Tool proficiencies help with checks involving specialized equipment."));
      if (normalizedTool.includes("vehicles") && normalizedTool.includes("land or water")) choices.push(finishingChoice(`background-tool-${index}`, "Choose vehicles: land or water", "vehicles", "Tool proficiencies help with checks involving specialized equipment."));
      if (normalizedTool.includes("one other tool")) choices.push(finishingChoice(`background-tool-${index}`, "Choose 1 tool", "other", "Tool proficiencies help with checks involving specialized equipment."));
    });
  }

  return choices;
}

function getChoiceOptions(choice, character = appState.character) {
  if (choice.category === "language") {
    const selectedChoices = getFinishingTouches(character).choices || {};
    const blockedLanguages = new Set([
      ...(getSelectedRace(character)?.languages || []),
      ...(getActiveBackground(character)?.languages || []),
      ...selectedBackgroundChoices(character).filter((backgroundChoice) => backgroundChoice.category === "language").map((backgroundChoice) => backgroundChoice.value),
      ...Object.entries(selectedChoices)
        .filter(([choiceId]) => choiceId !== choice.id)
        .map(([, value]) => value),
    ].map((value) => String(value || "").toLowerCase()));
    return [
      ...DND_DATA.languages.standard.map((name) => ({ value: name, label: name })),
      ...DND_DATA.languages.exotic.map((name) => ({ value: name, label: `${name} (exotic)` })),
    ].filter((option) => !choice.preventDuplicates || !blockedLanguages.has(option.value.toLowerCase()));
  }
  const selectedChoices = getFinishingTouches(character).choices || {};
  const characterClass = getById(DND_DATA.classes, character.classId);
  const background = getActiveBackground(character);
  const fixedTools = [
    ...(getSelectedRace(character)?.tools || []),
    ...((background && background.tools) || []).filter((tool) => !isChoicePlaceholder(tool)),
    ...selectedBackgroundChoices(character).filter((backgroundChoice) => backgroundChoice.category !== "language" && backgroundChoice.category !== "option" && backgroundChoice.category !== "equipmentItem").map((backgroundChoice) => backgroundChoice.value),
    ...getBackgroundToolReplacementValues(character),
    ...splitProficiencyText(characterClass && characterClass.proficiencyDetails ? characterClass.proficiencyDetails.Tools : "")
      .filter((tool) => tool !== "None" && !isChoicePlaceholder(tool)),
  ];
  const blockedValues = new Set(Object.entries(selectedChoices)
    .filter(([choiceId]) => choiceId !== choice.id)
    .map(([, value]) => String(value || "").toLowerCase()));
  fixedTools.forEach((tool) => blockedValues.add(String(tool || "").toLowerCase()));
  return (DND_DATA.toolOptions[choice.category] || [])
    .filter((name) => !choice.options || choice.options.includes(name))
    .map((name) => ({ value: name, label: name, description: getToolDescription(name) }))
    .filter((option) => !choice.preventDuplicates || !blockedValues.has(option.value.toLowerCase()));
}

function isFinishingChoiceComplete(character, choice) {
  const selections = getFinishingTouches(character).choices;
  const selectedValue = String(selections[choice.id] || "");
  if (!selectedValue) return false;
  if (!choice.preventDuplicates) return true;
  const characterClass = getById(DND_DATA.classes, character.classId);
  const blockedValues = new Set([
    ...(choice.category === "language" ? getSelectedRace(character)?.languages || [] : []),
    ...(choice.category === "language" ? getActiveBackground(character)?.languages || [] : []),
    ...(choice.category === "language" ? selectedBackgroundChoices(character).filter((backgroundChoice) => backgroundChoice.category === "language").map((backgroundChoice) => backgroundChoice.value) : []),
    ...(choice.category !== "language" ? getSelectedRace(character)?.tools || [] : []),
    ...(choice.category !== "language" ? (getActiveBackground(character)?.tools || []).filter((tool) => !isChoicePlaceholder(tool)) : []),
    ...(choice.category !== "language" ? selectedBackgroundChoices(character).filter((backgroundChoice) => backgroundChoice.category !== "language" && backgroundChoice.category !== "option" && backgroundChoice.category !== "equipmentItem").map((backgroundChoice) => backgroundChoice.value) : []),
    ...(choice.category !== "language" ? getBackgroundToolReplacementValues(character) : []),
    ...(choice.category !== "language" ? splitProficiencyText(characterClass && characterClass.proficiencyDetails ? characterClass.proficiencyDetails.Tools : "").filter((tool) => tool !== "None" && !isChoicePlaceholder(tool)) : []),
    ...Object.entries(selections)
      .filter(([choiceId]) => choiceId !== choice.id)
      .map(([, value]) => value),
  ].map((value) => String(value || "").toLowerCase()));
  return !blockedValues.has(selectedValue.toLowerCase());
}

function hasCompleteFinishingTouches(character) {
  return getFinishingChoices(character).every((choice) => isFinishingChoiceComplete(character, choice));
}

function randomizeFinishingChoice(character, choiceId) {
  const choice = getFinishingChoices(character).find((item) => item.id === choiceId);
  if (!choice) return;
  const options = getChoiceOptions(choice, character);
  if (!options.length) return;
  getFinishingTouches(character).choices[choiceId] = DND_DATA.randomChoice(options).value;
}

function randomizeAlignment(character) {
  getFinishingTouches(character).alignment = { selected: DND_DATA.randomChoice(DND_DATA.alignments), skipped: false };
}

function randomizePersonalityField(character, field) {
  const background = getActiveBackground(character);
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
  const mode = entry.mode || (entry.skipped ? "skip" : entry.custom ? "custom" : "suggestion");
  if (mode === "skip") return "";
  if (mode === "custom") return (entry.custom || "").trim();
  return (entry.selected || "").trim();
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
  return Object.entries(labels)
    .map(([field, label]) => ({ label, value: getPersonalityValue(character, field) }))
    .filter((entry) => entry.value)
    .map((entry) => ({ text: `${entry.label}: ${entry.value}` }));
}

function renderFinishingTouchesPreview(character, race, background) {
  const trinket = getSelectedTrinket(character);
  const content = [
    renderPreviewCategory("Languages", languageEntries(character, race, background)),
    renderPreviewCategory("Roleplaying Details", personalityEntries(character)),
    trinket ? renderPreviewCategory("Optional Trinket", [{ text: `#${trinket.roll} - ${trinket.description}` }]) : "",
  ].join("");
  return renderPreviewSection("Finishing Touches", "", content, "finishing-touches-section");
}

function renderBackgroundDetailsPreview(character, background) {
  if (!background) return "";
  const choices = selectedBackgroundChoices(character)
    .filter((choice) => choice.category === "option" && !/prayer|equipment|item/i.test(choice.label || ""))
    .map((choice) => ({ text: `${choice.label}: ${choice.value}` }));
  const detailValues = getBackgroundChoices(character).details || {};
  const retainerIds = new Set(["squireName", "squireRole", "retainer2Name", "retainer2Role", "retainer3Name", "retainer3Role"]);
  const retainerEntries = background.versionId === "knight"
    ? [
      { label: "Squire", name: detailValues.squireName, role: detailValues.squireRole },
      { label: "Retainer 1", name: detailValues.retainer2Name, role: detailValues.retainer2Role },
      { label: "Retainer 2", name: detailValues.retainer3Name, role: detailValues.retainer3Role },
    ]
      .map((retainer) => {
        const name = String(retainer.name || "").trim();
        const role = String(retainer.role || "").trim();
        if (!name && !role) return null;
        return { text: `${retainer.label}: ${[name, role].filter(Boolean).join(" &mdash; ")}` };
      })
      .filter(Boolean)
    : [];
  const details = Object.entries(detailValues)
    .filter(([detailId]) => !retainerIds.has(detailId))
    .filter(([, value]) => String(value || "").trim())
    .map(([detailId, value]) => {
      const detail = (background.optionalDetails || []).find((item) => item.id === detailId);
      return { text: `${detail ? detail.label : detailId}: ${value}` };
    });
  const feature = background.feature ? [{ text: `${background.feature.name}: ${background.feature.description}` }] : [];
  const entries = [...feature, ...choices, ...details, ...retainerEntries];
  if (!entries.length) return "";
  return renderPreviewSection(
    "Background Details",
    "",
    `<ul class="plain-list categorized-equipment-list">${entries.map((entry) => `<li>${entry.text}</li>`).join("")}</ul>`,
    "background-details-section",
  );
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

function renderWeaponCards(entries, showHeading = true) {
  if (!entries.length) return "";
  return `
    ${showHeading ? "<h3>Weapons</h3>" : ""}
    <p class="weapon-card-note">Weapon attacks include proficiency when your character is proficient. Damage includes the relevant ability modifier when applicable.</p>
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

function renderRacialActionCards(character, showHeading = true) {
  const ancestry = getSelectedDragonbornAncestry(character);
  if (!ancestry) return "";
  const saveDc = calculateBreathWeaponSaveDc(character);
  return `
    ${showHeading ? "<h3>Racial Actions</h3>" : ""}
    <div class="weapon-card-list">
      <article class="racial-action-card">
        <div class="weapon-card-summary">
          <span class="weapon-card-heading">
            <strong>Breath Weapon</strong>
            <span>${ancestry.name} Draconic Ancestry</span>
          </span>
          <span class="weapon-card-stats" aria-label="Breath Weapon summary">
            <span class="weapon-stat"><span>Action</span><strong>1 action</strong></span>
            <span class="weapon-stat"><span>Damage</span><strong>2d6</strong></span>
            <span class="weapon-stat"><span>Type</span><strong>${ancestry.damageType}</strong></span>
          </span>
        </div>
        <div class="weapon-card-details">
          <span class="guidance-section-label">Details</span>
          <ul>
            <li>Area: ${ancestry.area}</li>
            <li>Saving Throw: ${ancestry.saveAbility}; DC ${saveDc === "" ? "Assign Constitution" : saveDc}</li>
            <li>Successful Save: Half damage</li>
            <li>Usage: Once per short or long rest</li>
          </ul>
        </div>
      </article>
    </div>
  `;
}

function renderAttacksAndActionsPreview(character, characterClass) {
  const items = usesRolledStartingGold(character) ? [] : getPreviewEquipmentItems(character);
  const content = [
    renderWeaponCards(categorizedWeaponEntries(items, character), false),
    renderRacialActionCards(character, false),
    renderFeatureActionCards(character, characterClass),
  ].join("");
  return renderPreviewSection("Attacks & Actions", "Actions and attacks your character can use during play.", content, "actions-section");
}

function renderEquipmentCarriedPreview(character) {
  if (usesRolledStartingGold(character)) {
    return renderPreviewSection(
      "Equipment Carried",
      "Physical items your character currently carries.",
      `${renderRolledStartingGoldPreview(character)}${renderEquipmentList([], "Manual equipment was chosen outside this builder.")}`,
      "equipment-carried-section",
    );
  }
  const items = getPreviewEquipmentItems(character);
  if (!items.length) {
    return renderPreviewSection(
      "Equipment Carried",
      "Physical items your character currently carries.",
      renderEquipmentList([], character.classId ? "Choose starting equipment." : "Choose a class first."),
      "equipment-carried-section",
    );
  }

  const content = [
    renderArmorDefenseCategory(armorDefenseEntries(items, character)),
    renderPreviewCategory("Weapons", weaponEquipmentEntries(items)),
    renderOwnedToolRows(items),
    renderPackCards(items),
    renderPreviewCategory("Adventuring Gear", adventuringGearEntries(items)),
    renderPreviewCategory("Other Equipment", otherEquipmentEntries(items)),
  ].join("");
  return renderPreviewSection("Equipment Carried", "Physical items your character currently carries.", content, "equipment-carried-section");
}

function renderPreview(container, character) {
  const characterClass = getById(DND_DATA.classes, character.classId);
  const race = getSelectedRace(character);
  const background = getActiveBackground(character);
  const armorClass = calculateArmorClass(character);

  container.innerHTML = `
    <div class="sheet-grid">
      <div class="sheet-item"><span class="sheet-label">Name</span>${character.name || ""}</div>
      <div class="sheet-item"><span class="sheet-label">Level</span>${character.level}</div>
      <div class="sheet-item"><span class="sheet-label">Class</span>${characterClass ? characterClass.name : "Not selected"}</div>
      <div class="sheet-item"><span class="sheet-label">Race</span>${race ? race.name : "Not selected"}</div>
      <div class="sheet-item"><span class="sheet-label">Size</span>${race ? race.size || "Medium" : "Not selected"}</div>
      <div class="sheet-item"><span class="sheet-label">Background</span>${background ? background.name : "Not selected"}</div>
      ${getAlignmentValue(character) ? `<div class="sheet-item"><span class="sheet-label">Alignment</span>${getAlignmentValue(character)}</div>` : ""}
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
    ${renderClassFaithPreviewItem(character)}
    </div>
    <div class="preview-core-tables">
      ${renderAbilityScoresTable(character, race)}
      ${renderSavingThrowsTable(character, characterClass)}
      ${renderSkillsTable(character, race, background)}
    </div>
    <div class="preview-lower-columns">
      <div class="preview-stack preview-left-stack">
        ${renderBackgroundDetailsPreview(character, background)}
        ${renderSimpleFactsPreview(character, race, background)}
        ${renderFinishingTouchesPreview(character, race, background)}
        ${renderSpellsPreview(character, characterClass)}
        ${renderTraitsAndFeaturesPreview(character, characterClass, race)}
      </div>
      <div class="preview-stack preview-right-stack">
        ${renderProficienciesTrainingPreview(character, characterClass, race, background)}
        ${renderAttacksAndActionsPreview(character, characterClass)}
        ${renderEquipmentCarriedPreview(character)}
      </div>
    </div>`;
}

function optionCard(option, selectedId, type, detail = "", extraClass = "") {
  const isSelected = selectedId === option.id;
  return `<button class="option-card ${extraClass} ${isSelected ? "selected" : ""}" type="button" data-option-type="${type}" data-option-id="${option.id}" aria-pressed="${isSelected}"><strong>${option.name}</strong>${detail ? `<span>${detail}</span>` : ""}</button>`;
}

function guidancePanel(text) {
  return `<div class="guidance-panel">${text}</div>`;
}

function classInfoPanel(characterClass) {
  if (!characterClass) return "";
  const notes = characterClass.proficiencyNotes || [];
  const features = (characterClass.features || []).map((feature) => splitFeatureText(feature).name).filter(Boolean);
  return `
    <section class="selected-class-details" data-selected-class-details>
      <h3>Class Details</h3>
      <div class="race-detail-card class-detail-card">
        <h4>${characterClass.name}</h4>
        <p>${characterClass.detail}</p>
        <div class="race-detail-grid">
          <div><span>Hit Die</span><strong>d${characterClass.hitDie}</strong></div>
          <div><span>Recommended Abilities</span><strong>${(characterClass.primaryAbilities || []).slice(0, 3).join(", ") || "None"}</strong></div>
          <div><span>Saving Throws</span><strong>${characterClass.proficiencyDetails["Saving Throws"] || "None"}</strong></div>
        </div>
        <div class="proficiency-block">
          <h5>Proficiencies</h5>
          <div class="proficiency-list">
            ${Object.entries(characterClass.proficiencyDetails)
              .filter(([label]) => label !== "Saving Throws")
              .map(([label, value]) => `<p><strong>${label}:</strong> ${value}</p>`)
              .join("")}
            ${notes.map((note) => `<p><strong>Note:</strong> ${note}</p>`).join("")}
          </div>
        </div>
        ${features.length ? `<h5>Level 1 Features</h5><ul>${features.map((feature) => `<li>${feature}</li>`).join("")}</ul>` : ""}
      </div>
    </section>
  `;
}

function renderClassChoiceSections() {
  const groups = getClassFeatureChoiceGroups(appState.character);
  if (!groups.length) return "";
  return `
    <section class="selected-class-details class-choice-details" data-class-choice-details>
      <h3>Class Choices</h3>
      ${groups.map((group) => renderClassFeatureGroup(group)).join("")}
      ${renderClassFeatureExtraFields(appState.character)}
    </section>
  `;
}

function renderClassStep(step) {
  const selectedClass = getById(DND_DATA.classes, appState.character.classId);
  const canContinue = appState.character.classId && hasCompleteClassFeatureChoices(appState.character);
  wizardStep.innerHTML = `
    <p class="progress-text">${step.progress}</p>
    <h2>${step.title}</h2>
    ${guidancePanel(stepGuidance.class)}
    <div class="race-step-controls"><button class="secondary-button race-randomize-button" type="button" data-action="randomize-class">Randomize Class</button></div>
    <div class="option-grid">${DND_DATA.classes.map((option) => optionCard(option, appState.character.classId, "class", `${option.cardDescription}. Hit Die: d${option.hitDie}`, "class-option-card")).join("")}</div>
    ${selectedClass ? renderClassChoiceSections() : ""}
    ${classInfoPanel(selectedClass)}
    <div class="wizard-actions">
      <button class="secondary-button" type="button" data-action="back">Back</button>
      ${resetStepButtonHtml()}
      <button class="secondary-button" type="button" data-action="randomize-current">Randomize</button>
      <button class="primary-button" type="button" data-action="continue" ${canContinue ? "" : "disabled"}>Continue</button>
    </div>
  `;
}

function renderChoiceStep(step, options, selectedId, type, detailForOption) {
  wizardStep.innerHTML = `<p class="progress-text">${step.progress}</p><h2>${step.title}</h2>${guidancePanel(stepGuidance[step.key])}<div class="option-grid">${options.map((option) => optionCard(option, selectedId, type, detailForOption(option))).join("")}</div><div class="wizard-actions">${appState.wizardStepIndex > 0 ? '<button class="secondary-button" type="button" data-action="back">Back</button>' : ""}${resetStepButtonHtml()}<button class="secondary-button" type="button" data-action="randomize-current">Randomize</button><button class="primary-button" type="button" data-action="continue" ${selectedId ? "" : "disabled"}>Continue</button></div>`;
}

function getKnownLanguageSetForBackground(character, currentChoiceId = "") {
  const selections = getBackgroundChoices(character).choices;
  return new Set([
    ...(getSelectedRace(character)?.languages || []),
    ...(getActiveBackground(character)?.languages || []),
    ...Object.entries(selections)
      .filter(([choiceId]) => choiceId !== currentChoiceId)
      .map(([, value]) => value),
  ].map((value) => String(value || "").toLowerCase()));
}

function getBackgroundChoiceOptions(choice, character = appState.character) {
  if (choice.category === "language") {
    const blocked = getKnownLanguageSetForBackground(character, choice.id);
    return [
      ...DND_DATA.languages.standard.map((name) => ({ value: name, label: name })),
      ...DND_DATA.languages.exotic.map((name) => ({ value: name, label: `${name} (exotic)` })),
    ].filter((option) => !blocked.has(option.value.toLowerCase()));
  }
  if (choice.category === "option") {
    const selectedChoices = getBackgroundChoices(character).choices;
    const blocked = new Set();
    if (choice.uniqueGroup) {
      visibleBackgroundChoiceGroups(getActiveBackground(character), character)
        .filter((item) => item.uniqueGroup === choice.uniqueGroup && item.id !== choice.id)
        .map((item) => selectedChoices[item.id])
        .filter(Boolean)
        .forEach((value) => blocked.add(String(value).toLowerCase()));
    }
    return (choice.options || [])
      .map((value) => ({ value, label: value }))
      .filter((option) => !blocked.has(option.value.toLowerCase()));
  }
  if (choice.category === "equipmentItem") {
    return (choice.itemIds || [])
      .map((itemId) => DND_DATA.getEquipmentItem(itemId))
      .filter(Boolean)
      .map((item) => ({ value: item.id, label: item.name, description: item.detail || formatEquipmentItem(item) }));
  }
  const selectedChoices = getBackgroundChoices(character).choices;
  const background = getActiveBackground(character);
  const blocked = new Set([
    ...(getSelectedRace(character)?.tools || []),
    ...getClassToolNames(character),
    ...((background && background.tools) || []).filter((tool) => !isChoicePlaceholder(tool)),
    ...Object.entries(selectedChoices)
      .filter(([choiceId]) => choiceId !== choice.id)
      .map(([, value]) => value),
  ].map((value) => String(value || "").toLowerCase()));
  return (DND_DATA.toolOptions[choice.category] || [])
    .map((name) => ({ value: name, label: name, description: getToolDescription(name) }))
    .filter((option) => !blocked.has(option.value.toLowerCase()));
}

function getBackgroundReplacementSkillOptions(character, slotId) {
  const background = getActiveBackground(character);
  const race = getSelectedRace(character);
  const selectedReplacements = getBackgroundChoices(character).skillReplacements;
  const blocked = new Set([
    ...getBaseSkillNamesBeforeBackground(character, race),
    ...(background ? background.skills || [] : []),
    ...Object.entries(selectedReplacements)
      .filter(([id]) => id !== slotId)
      .map(([, value]) => value),
  ]);
  return DND_DATA.skills.map((skill) => skill.name).filter((skillName) => !blocked.has(skillName));
}

function getBackgroundReplacementToolOptions(character, slotId) {
  const background = getActiveBackground(character);
  const selectedReplacements = getBackgroundChoices(character).toolReplacements;
  const blocked = new Set([
    ...(getSelectedRace(character)?.tools || []),
    ...getClassToolNames(character),
    ...((background && background.tools) || []).filter((tool) => !isChoicePlaceholder(tool)),
    ...selectedBackgroundChoices(character).filter((choice) => choice.category !== "language" && choice.category !== "option" && choice.category !== "equipmentItem").map((choice) => choice.value),
    ...selectedBackgroundChoices(character).map((choice) => getChoiceGrantedTool(choice, choice.value)).filter(Boolean),
    ...Object.entries(selectedReplacements)
      .filter(([id]) => id !== slotId)
      .map(([, value]) => value),
  ].map((value) => String(value || "").toLowerCase()));
  return getAllToolOptionNames().filter((tool) => !blocked.has(tool.toLowerCase()));
}

function isBackgroundChoiceComplete(character, choice) {
  const value = getBackgroundChoices(character).choices[choice.id] || "";
  if (!choice.required) return true;
  if (!value) return false;
  return getBackgroundChoiceOptions(choice, character).some((option) => option.value === value);
}

function hasCompleteBackgroundChoices(character) {
  if (backgroundVersionIsRequired(character)) return false;
  const background = getActiveBackground(character);
  if (!background) return false;
  const race = getSelectedRace(character);
  const choices = getBackgroundChoices(character);
  const requiredChoicesComplete = visibleBackgroundChoiceGroups(background, character).every((choice) => isBackgroundChoiceComplete(character, choice));
  const toolReplacementsComplete = getBackgroundToolDuplicateSlots(character, race, background)
    .every((slot) => getBackgroundReplacementToolOptions(character, slot.id).includes(choices.toolReplacements[slot.id]));
  return requiredChoicesComplete && toolReplacementsComplete;
}

function setRandomBackgroundChoices(character) {
  const background = getActiveBackground(character);
  if (!background) return;
  const version = getBackgroundVersion(character);
  resetBackgroundChoices(character);
  setBackgroundVersion(character, version);
  if (background.id === "entertainer") setEntertainerRoutineCount(character, Math.floor(Math.random() * 3) + 1);
  visibleBackgroundChoiceGroups(background, character).forEach((choice) => {
    const options = getBackgroundChoiceOptions(choice, character);
    if (options.length) getBackgroundChoices(character).choices[choice.id] = DND_DATA.randomChoice(options).value;
  });
  const race = getSelectedRace(character);
  getBackgroundToolDuplicateSlots(character, race, background).forEach((slot) => {
    const options = getBackgroundReplacementToolOptions(character, slot.id);
    if (options.length) getBackgroundChoices(character).toolReplacements[slot.id] = DND_DATA.randomChoice(options);
  });
}

function randomizeBackgroundChoice(character, choiceId) {
  const background = getActiveBackground(character);
  const choice = backgroundChoiceGroups(background).find((item) => item.id === choiceId);
  if (!choice) return;
  const options = getBackgroundChoiceOptions(choice, character);
  if (!options.length) return;
  getBackgroundChoices(character).choices[choiceId] = DND_DATA.randomChoice(options).value;
}

function randomizeBackgroundToolReplacement(character, slotId) {
  const options = getBackgroundReplacementToolOptions(character, slotId);
  if (!options.length) return;
  getBackgroundChoices(character).toolReplacements[slotId] = DND_DATA.randomChoice(options);
}

function sanitizeBackgroundChoices(character) {
  const background = getActiveBackground(character);
  const choices = getBackgroundChoices(character);
  if (!background) {
    resetBackgroundChoices(character);
    return;
  }
  if (background.id !== "entertainer") delete choices.choices.entertainerRoutineCount;
  const visibleChoiceIds = new Set(visibleBackgroundChoiceGroups(background, character).map((choice) => choice.id));
  backgroundChoiceGroups(background).forEach((choice) => {
    if (!visibleChoiceIds.has(choice.id)) {
      delete choices.choices[choice.id];
      return;
    }
    const value = choices.choices[choice.id];
    if (value && !getBackgroundChoiceOptions(choice, character).some((option) => option.value === value)) delete choices.choices[choice.id];
  });
  const race = getSelectedRace(character);
  const validSkillSlots = new Set(getBackgroundSkillDuplicateSlots(character, race, background).map((slot) => slot.id));
  Object.keys(choices.skillReplacements).forEach((slotId) => {
    if (!validSkillSlots.has(slotId) || !getBackgroundReplacementSkillOptions(character, slotId).includes(choices.skillReplacements[slotId])) delete choices.skillReplacements[slotId];
  });
  const validToolSlots = new Set(getBackgroundToolDuplicateSlots(character, race, background).map((slot) => slot.id));
  Object.keys(choices.toolReplacements).forEach((slotId) => {
    if (!validToolSlots.has(slotId) || !getBackgroundReplacementToolOptions(character, slotId).includes(choices.toolReplacements[slotId])) delete choices.toolReplacements[slotId];
  });
  const validDetailIds = new Set((background.optionalDetails || []).map((detail) => detail.id));
  Object.keys(choices.details).forEach((detailId) => {
    if (!validDetailIds.has(detailId)) delete choices.details[detailId];
  });
}

function renderBackgroundChoiceCard(choice) {
  const selectedValue = getBackgroundChoices(appState.character).choices[choice.id] || "";
  const placeholder = {
    language: "Choose a language",
    gaming: "Choose a gaming set",
    musical: "Choose a musical instrument",
    artisan: "Choose an artisan's tool",
    equipmentItem: `Choose ${choice.label.toLowerCase()}`,
    option: `Choose ${choice.label.toLowerCase()}`,
  }[choice.category] || "Choose an option";
  const isComplete = isBackgroundChoiceComplete(appState.character, choice);
  return `
    <section class="finishing-card background-choice-card">
      ${renderInlinePicker({
        id: `background-choice:${choice.id}`,
        label: choice.label,
        value: selectedValue,
        placeholder,
        options: getBackgroundChoiceOptions(choice),
        helper: choice.helper || "",
        beforeTrigger: `<div class="personality-actions"><button class="secondary-button" type="button" data-random-background-choice="${choice.id}">Randomize Choice</button></div>`,
        note: isComplete ? "" : `<p class="finishing-validation">${placeholder} before continuing.</p>`,
        actionType: "background-choice",
      })}
      ${choice.removable ? `<div class="personality-actions"><button class="secondary-button" type="button" data-remove-background-routine="${getRoutineChoiceIndex(choice)}">Remove</button></div>` : ""}
    </section>
  `;
}

function renderEntertainerRoutineControls(background) {
  if (!background || background.id !== "entertainer") return "";
  const count = getEntertainerRoutineCount(appState.character);
  const currentRoutineChoice = backgroundChoiceGroups(background).find((choice) => choice.id === `entertainer-routine-${count}`);
  const canAdd = count < 3 && (!currentRoutineChoice || isBackgroundChoiceComplete(appState.character, currentRoutineChoice));
  return `
    <div class="personality-actions background-routine-actions">
      <button class="secondary-button" type="button" data-add-background-routine ${canAdd ? "" : "disabled"}>Add Another Routine</button>
    </div>
  `;
}

function renderBackgroundToolReplacementCard(slot) {
  const selectedValue = getBackgroundChoices(appState.character).toolReplacements[slot.id] || "";
  const options = getBackgroundReplacementToolOptions(appState.character, slot.id).map((tool) => ({ value: tool, label: tool, description: getToolDescription(tool) }));
  return `
    <section class="finishing-card background-choice-card">
      ${renderInlinePicker({
        id: `background-tool-replacement:${slot.id}`,
        label: "Choose a replacement tool proficiency",
        value: selectedValue,
        placeholder: "Choose a tool proficiency",
        options,
        helper: `You already have ${slot.tool} proficiency, so choose a different tool proficiency.`,
        beforeTrigger: `<div class="personality-actions"><button class="secondary-button" type="button" data-random-background-tool-replacement="${slot.id}">Randomize Choice</button></div>`,
        note: selectedValue ? "" : '<p class="finishing-validation">Choose a tool before continuing.</p>',
        actionType: "background-tool-replacement",
      })}
    </section>
  `;
}

function renderBackgroundOptionalDetails(background) {
  const details = background.optionalDetails || [];
  if (!details.length) return "";
  const values = getBackgroundChoices(appState.character).details;
  return `
    <section class="background-detail-subsection">
      <div class="equipment-group-header"><h3>Optional Background Details</h3><span>Optional</span></div>
      <div class="personality-grid">
        ${details.map((detail) => `
          <section class="finishing-card">
            <label class="custom-personality-label">${detail.label}
              <textarea data-background-detail="${detail.id}" rows="2" placeholder="${detail.placeholder || "Optional detail"}">${escapeHtml(values[detail.id] || "")}</textarea>
            </label>
          </section>
        `).join("")}
      </div>
    </section>
  `;
}

function renderBackgroundVersionSection(rawBackground) {
  if (!backgroundHasVersions(rawBackground)) return "";
  const selectedVersion = getBackgroundVersion(appState.character);
  return `
    <section class="background-detail-subsection" data-background-version-section>
      <div class="equipment-group-header"><h3>Background Version</h3><span>Choose 1</span></div>
      <div class="personality-actions background-version-actions">
        <button class="secondary-button" type="button" data-random-background-version>Randomize Variant</button>
      </div>
      <div class="equipment-options">
        ${getBackgroundVersionOptions(rawBackground).map((version) => {
          const isSelected = selectedVersion === version.id;
          return `
            <div class="equipment-option ${isSelected ? "selected" : ""}" data-background-version="${version.id}">
              <button class="equipment-choice-button" type="button" data-background-version="${version.id}" aria-pressed="${isSelected}">
                <span class="equipment-radio" aria-hidden="true"></span>
                <span class="equipment-choice-copy">
                  <strong>${version.label}</strong>
                  ${version.variantLabel ? `<span>${version.variantLabel}</span>` : ""}
                </span>
              </button>
            </div>
          `;
        }).join("")}
      </div>
      ${selectedVersion ? "" : '<p class="finishing-validation">Choose Standard or Variant before continuing.</p>'}
    </section>
  `;
}

function renderSelectedBackgroundDetails() {
  const rawBackground = getById(DND_DATA.backgrounds, appState.character.backgroundId);
  const background = getActiveBackground(appState.character);
  if (!rawBackground || !background) return "";
  const versionSection = renderBackgroundVersionSection(rawBackground);
  if (backgroundVersionIsRequired(appState.character)) {
    return `<section class="selected-background-details" data-selected-background-details>${versionSection}</section>`;
  }
  const race = getSelectedRace(appState.character);
  const toolDuplicates = getBackgroundToolDuplicateSlots(appState.character, race, background);
  const requiredSections = [
    ...visibleBackgroundChoiceGroups(background, appState.character).map(renderBackgroundChoiceCard),
    renderEntertainerRoutineControls(background),
    ...toolDuplicates.map(renderBackgroundToolReplacementCard),
  ].filter(Boolean).join("");
  const tools = (background.tools || []).length ? background.tools.join(", ") : "None";
  const languages = visibleBackgroundChoiceGroups(background, appState.character).filter((choice) => choice.category === "language").length
    ? `Choose ${visibleBackgroundChoiceGroups(background, appState.character).filter((choice) => choice.category === "language").length}`
    : (background.languages || []).join(", ") || "None";
  const dynamicEquipment = backgroundChoiceGroups(background)
    .filter((choice) => choice.equipment || /prayer/i.test(choice.id))
    .map((choice) => {
      if (choice.category === "musical") return "Chosen musical instrument";
      if (choice.category === "artisan") return "Chosen artisan's tools";
      return `Chosen ${choice.label.toLowerCase()}`;
    });
  return `
    <section class="selected-background-details" data-selected-background-details>
      ${versionSection}
      <section class="background-detail-subsection" data-required-background-choices>
        <div class="equipment-group-header"><h3>Required Background Choices</h3><span>${requiredSections ? "Required" : "None"}</span></div>
        ${requiredSections || '<div class="finishing-empty">No required background choices.</div>'}
      </section>
      <h3>Background Details</h3>
      <div class="race-detail-card" data-selected-background-description>
        <h4>${background.name}</h4>
        ${background.description ? `<p>${background.description}</p>` : ""}
        <div class="race-detail-grid">
          <div><span>Skills</span><strong>${(background.skills || []).join(", ") || "None"}</strong></div>
          <div><span>Tools</span><strong>${tools}</strong></div>
          <div><span>Languages</span><strong>${languages}</strong></div>
          <div><span>Starting Gold</span><strong>${Number(background.startingGoldGp) || 0} gp</strong></div>
        </div>
        <h5>Equipment</h5>
        <ul>${[...(background.equipmentItems || []).map((itemId) => (DND_DATA.getEquipmentItem(itemId) || {}).name).filter(Boolean), ...(background.equipment || []), ...dynamicEquipment].map((item) => `<li>${item}</li>`).join("")}</ul>
        ${background.feature ? `<h5>Feature</h5><p><strong>${background.feature.name}:</strong> ${background.feature.description}</p>` : ""}
      </div>
      ${renderBackgroundOptionalDetails(background)}
    </section>
  `;
}

function renderBackgroundStep(step) {
  wizardStep.innerHTML = `
    <p class="progress-text">${step.progress}</p>
    <h2>${step.title}</h2>
    ${guidancePanel(stepGuidance.background)}
    <div class="race-step-controls"><button class="secondary-button race-randomize-button" type="button" data-action="randomize-background">Randomize Background</button></div>
    <div class="option-grid">${DND_DATA.backgrounds.map((background) => optionCard(background, appState.character.backgroundId, "background", (background.skills || []).join(", "), "background-option-card")).join("")}</div>
    ${renderSelectedBackgroundDetails()}
    <div class="wizard-actions"><button class="secondary-button" type="button" data-action="back">Back</button>${resetStepButtonHtml()}<button class="secondary-button" type="button" data-action="randomize-current">Randomize</button><button class="primary-button" type="button" data-action="continue" ${hasCompleteBackgroundChoices(appState.character) ? "" : "disabled"}>Continue</button></div>
  `;
}

function formatAbilityIncreaseSummary(increases = {}) {
  const entries = Object.entries(increases).filter(([, bonus]) => bonus);
  if (!entries.length) return "";
  if (entries.length === DND_DATA.abilities.length && entries.every(([, bonus]) => bonus === 1)) return "+1 to all ability scores";
  return entries.map(([ability, bonus]) => `${bonus > 0 ? "+" : ""}${bonus} ${ability}`).join(", ");
}

function conciseRaceTraits(race) {
  const traits = [];
  if ((race.senses || []).some((sense) => /darkvision/i.test(sense))) traits.push("Darkvision");
  (race.traits || []).forEach((trait) => {
    if (traits.length >= 3) return;
    if (!traits.includes(trait)) traits.push(trait);
  });
  return traits.slice(0, 3).join(" &middot; ");
}

function renderRaceBaseCard(race) {
  const abilitySummary = race.id === "half-elf" ? "+2 Charisma" : formatAbilityIncreaseSummary(race.abilityIncreases);
  const movement = race.speed !== 30 ? `${race.speed} ft. speed` : "";
  const summary = [abilitySummary, [movement, conciseRaceTraits(race)].filter(Boolean).join(" &middot; ")].filter(Boolean).join(" - ");
  return optionCard(race, appState.character.raceId, "race", summary, "race-option-card");
}

function renderSubraceCard(subrace) {
  const isSelected = appState.character.subraceId === subrace.id;
  return `
    <article class="subrace-card ${isSelected ? "selected" : ""}">
      <button class="subrace-choice-button" type="button" data-option-type="subrace" data-option-id="${subrace.id}" aria-pressed="${isSelected}">
        <strong>${subrace.name}</strong>
        <span>${formatAbilityIncreaseSummary(subrace.abilityIncreases)}</span>
        <span>${subrace.traitSummary || (subrace.traits || []).join(", ")}</span>
      </button>
    </article>
  `;
}

function renderSubraceSection() {
  const baseRace = getSelectedBaseRace(appState.character);
  const subraces = getSubracesForSelectedRace(appState.character);
  if (!baseRace || !subraces.length) return "";
  return `
    <section class="subrace-section" data-required-race-choice>
      <div class="equipment-group-header">
        <h3>Choose Your ${baseRace.name} Subrace</h3>
        <span>Required</span>
      </div>
      <button class="secondary-button race-randomize-button" type="button" data-action="randomize-secondary-race-choice">Randomize Subrace</button>
      <div class="subrace-grid">
        ${subraces.map(renderSubraceCard).join("")}
      </div>
    </section>
  `;
}

function renderDragonbornAncestryCard(ancestry) {
  const selectedId = (appState.character.raceChoices || {}).dragonbornAncestry || "";
  const isSelected = selectedId === ancestry.id;
  return `
    <article class="subrace-card ${isSelected ? "selected" : ""}">
      <button class="subrace-choice-button" type="button" data-option-type="dragonbornAncestry" data-option-id="${ancestry.id}" aria-pressed="${isSelected}">
        <strong>${ancestry.name}</strong>
        <span>${ancestry.damageType} damage</span>
        <span>${ancestry.area} breath &middot; ${ancestry.saveAbility} save &middot; resistance</span>
      </button>
    </article>
  `;
}

function renderDragonbornAncestrySection() {
  if (appState.character.raceId !== "dragonborn") return "";
  return `
    <section class="subrace-section" data-required-race-choice>
      <div class="equipment-group-header">
        <h3>Choose Your Draconic Ancestry</h3>
        <span>Required</span>
      </div>
      <button class="secondary-button race-randomize-button" type="button" data-action="randomize-secondary-race-choice">Randomize Ancestor</button>
      <div class="subrace-grid">
        ${DND_DATA.dragonbornAncestries.map(renderDragonbornAncestryCard).join("")}
      </div>
    </section>
  `;
}

function raceDetailRows(race, ancestry = null) {
  const rows = [];
  rows.push({ label: "Ability Scores", value: race.id === "half-elf" || race.baseRaceId === "half-elf" ? "+2 Charisma; choose two other +1 increases during Ability Scores." : formatAbilityIncreaseSummary(race.abilityIncreases) || "None" });
  rows.push({ label: "Size", value: race.size || "Medium" });
  rows.push({ label: "Speed", value: `${race.speed || 30} ft.` });
  if (race.languages && race.languages.length) rows.push({ label: "Languages", value: race.languages.join(", ") });
  if (race.senses && race.senses.length) rows.push({ label: "Senses", value: race.senses.join(", ") });
  if (race.resistances && race.resistances.length) rows.push({ label: "Resistances", value: race.resistances.map((type) => `${type} damage`).join(", ") });
  if (race.skills && race.skills.length) rows.push({ label: "Skill Proficiencies", value: race.skills.join(", ") });
  if (race.tools && race.tools.length) rows.push({ label: "Tool Proficiencies", value: race.tools.join(", ") });
  if (race.proficiencyDetails && race.proficiencyDetails.Weapons) rows.push({ label: "Weapon Proficiencies", value: race.proficiencyDetails.Weapons });
  if (race.proficiencyDetails && race.proficiencyDetails.Armor) rows.push({ label: "Armor Training", value: race.proficiencyDetails.Armor });
  if (ancestry) rows.push({ label: "Draconic Ancestry", value: `${ancestry.name}; ${ancestry.damageType} damage; ${ancestry.area}; ${ancestry.saveAbility} saving throw; resistance to ${ancestry.damageType.toLowerCase()} damage.` });
  return rows;
}

function raceLaterChoiceNotes(race) {
  const notes = [];
  if (race.id === "half-elf" || race.baseRaceId === "half-elf") {
    notes.push("Choose two additional +1 ability increases during Ability Scores.");
    notes.push("Choose two additional skills during Skills & Proficiencies.");
    notes.push("Choose one additional language during Finishing Touches.");
  } else {
    if (race.languageChoices) notes.push(`Choose ${race.languageChoices.choose || 1} additional ${race.languageChoices.choose === 1 ? "language" : "languages"} during Finishing Touches.`);
    if (race.toolChoices && race.toolChoices.length) notes.push("Choose the granted tool proficiency during Finishing Touches.");
    if (race.racialCantripChoice) notes.push("Choose one Wizard cantrip during Spell Selection.");
  }
  return notes;
}

function renderSelectedRaceDetails() {
  if (!hasCompleteRaceSelection(appState.character)) return "";
  const race = getSelectedRace(appState.character);
  if (!race) return "";
  const ancestry = getSelectedDragonbornAncestry(appState.character);
  const notes = raceLaterChoiceNotes(race);
  const traitDetails = ancestry
    ? (race.traitDetails || []).filter((detail) => !/^(Breath Weapon|Damage Resistance)\b/i.test(detail))
    : [...(race.traitDetails || [])];
  if (ancestry) {
    traitDetails.push(`Breath Weapon - Your ${ancestry.name} ancestry breath weapon deals ${ancestry.damageType} damage in a ${ancestry.area}. Targets make a ${ancestry.saveAbility} saving throw for half damage. You can use it once per short or long rest.`);
    traitDetails.push(`Damage Resistance - You have resistance to ${ancestry.damageType.toLowerCase()} damage.`);
  }
  return `
    <section class="selected-race-details" data-selected-race-details>
      <h3>Race Details</h3>
      <div class="race-detail-card">
        <h4>${race.name}</h4>
        <div class="race-detail-grid">
          ${raceDetailRows(race, ancestry).map((row) => `<div><span>${row.label}</span><strong>${row.value}</strong></div>`).join("")}
        </div>
        ${traitDetails.length ? `<h5>Traits</h5><ul>${traitDetails.map((detail) => `<li>${detail}</li>`).join("")}</ul>` : ""}
        ${race.racialCantrips && race.racialCantrips.length ? `<h5>Racial Spells</h5><ul>${race.racialCantrips.map((entry) => `<li>${entry.label}: ${DND_DATA.getSpellById ? DND_DATA.getSpellById(entry.id)?.name || entry.id : entry.id}</li>`).join("")}</ul>` : ""}
        ${notes.length ? `<h5>Later Choices</h5><ul>${notes.map((note) => `<li>${note}</li>`).join("")}</ul>` : ""}
      </div>
    </section>
  `;
}

function renderRaceStep(step) {
  wizardStep.innerHTML = `
    <p class="progress-text">${step.progress}</p>
    <h2>${step.title}</h2>
    ${guidancePanel(stepGuidance.race)}
    <div class="race-step-controls"><button class="secondary-button race-randomize-button" type="button" data-action="randomize-race">Randomize Race</button></div>
    <div class="option-grid">${DND_DATA.races.map(renderRaceBaseCard).join("")}</div>
    ${renderSubraceSection()}
    ${renderDragonbornAncestrySection()}
    ${renderSelectedRaceDetails()}
    <div class="wizard-actions">
      <button class="secondary-button" type="button" data-action="back">Back</button>
      ${resetStepButtonHtml()}
      <button class="secondary-button" type="button" data-action="randomize-current">Randomize</button>
      <button class="primary-button" type="button" data-action="continue" ${hasCompleteRaceSelection(appState.character) ? "" : "disabled"}>Continue</button>
    </div>
  `;
}

function renderClassFeatureGroup(group) {
  const selectedId = appState.character.classFeatures[group.id] || "";
  const selectedOption = group.options.find((option) => option.id === selectedId);
  const needsHumanoids = group.humanoidChoices && selectedOption && selectedOption.id === "humanoids";
  const needsDragonAncestor = group.dragonAncestorChoices && selectedOption && selectedOption.id === "draconic-bloodline";
  const choiceControl = group.id === "naturalExplorer"
    ? renderClassFeatureSelect(group, selectedId)
    : `<div class="option-grid">${group.options.map((option) => optionCard(option, selectedId, group.id, option.description || "")).join("")}</div>`;
  return `
    <section class="equipment-choice-group class-feature-group-${group.id}" data-class-feature-group="${group.id}">
      <div class="equipment-group-header"><h3>${group.title}</h3><span>Choose 1</span></div>
      ${group.description ? `<p class="equipment-note">${group.description}</p>` : ""}
      <div class="personality-actions class-choice-actions">
        <button class="secondary-button" type="button" data-random-class-feature="${group.id}">Randomize Choice</button>
      </div>
      ${choiceControl}
      ${needsHumanoids ? renderHumanoidEnemyPickers(group) : ""}
      ${needsDragonAncestor ? renderDragonAncestorPicker(group) : ""}
      ${!hasCompleteClassFeatureGroup(appState.character, group) ? `<p class="finishing-validation">${classFeatureValidationMessage(group)}</p>` : ""}
    </section>
  `;
}

function renderClassFeatureSelect(group, selectedId) {
  return `
    <label class="equipment-select-label class-feature-select-label">${group.title}
      <select data-class-feature-select="${group.id}">
        <option value="">Choose ${group.title.toLowerCase()}</option>
        ${group.options.map((option) => `<option value="${option.id}" ${selectedId === option.id ? "selected" : ""}>${option.name}</option>`).join("")}
      </select>
    </label>
  `;
}

function renderClassFeatureExtraFields(character) {
  if (character.classId !== "cleric") return "";
  return `
    <section class="equipment-choice-group" data-cleric-faith-section>
      <div class="equipment-group-header"><h3>Cleric Faith</h3><span>Optional</span></div>
      <label class="custom-personality-label">Deity, Faith, or Philosophy
        <input type="text" data-cleric-faith value="${escapeHtml(character.classFeatures.clericFaith || "")}" placeholder="Optional faith, deity, or philosophy" />
      </label>
      <p class="equipment-note">Optional. Clerics often serve a deity, faith, cosmic force, or philosophy. You can choose one, make one up, or ask your DM / Player's Handbook for examples.</p>
    </section>
  `;
}

function renderHumanoidEnemyPickers(group) {
  const selectedValues = group.humanoidChoices.fields.map((field) => appState.character.classFeatures[field.id] || "");
  return `
    <div class="equipment-dropdowns humanoid-enemy-pickers" data-class-feature-followup="${group.id}">
      ${group.humanoidChoices.fields.map((field, index) => {
        const selectedValue = appState.character.classFeatures[field.id] || "";
        const blockedValues = selectedValues.filter((value, valueIndex) => value && valueIndex !== index);
        return `<label class="equipment-select-label">${field.label}<select data-class-feature-extra="${field.id}"><option value="">Choose ${field.label.toLowerCase()}</option>${group.humanoidChoices.options.map((option) => `<option value="${option}" ${selectedValue === option ? "selected" : ""} ${blockedValues.includes(option) ? "disabled" : ""}>${option}</option>`).join("")}</select></label>`;
      }).join("")}
    </div>
  `;
}

function renderDragonAncestorPicker(group) {
  const choices = group.dragonAncestorChoices;
  const selectedValue = appState.character.classFeatures[choices.field.id] || "";
  return `
    <div class="equipment-dropdowns" data-class-feature-followup="${group.id}">
      <label class="equipment-select-label">${choices.field.label}
        <select data-class-feature-extra="${choices.field.id}">
          <option value="">Choose dragon ancestor</option>
          ${choices.options.map((option) => `<option value="${option.id}" ${selectedValue === option.id ? "selected" : ""}>${option.name} - ${option.damageType}</option>`).join("")}
        </select>
      </label>
      <div class="personality-actions class-choice-actions">
        <button class="secondary-button" type="button" data-random-class-feature-extra="${choices.field.id}">Randomize Choice</button>
      </div>
    </div>
    <p class="equipment-note">${choices.note}</p>
  `;
}

function classFeatureValidationMessage(group) {
  const selectedOption = getSelectedClassFeatureOption(appState.character, group);
  if (group.humanoidChoices && selectedOption && selectedOption.id === "humanoids") return "Choose two different humanoid races before continuing.";
  if (group.dragonAncestorChoices && selectedOption && selectedOption.id === "draconic-bloodline") return "Choose a dragon ancestor before continuing.";
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

function renderEquipmentOption(group, option, selectedChoice = {}, character = appState.character) {
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
  const options = getVisibleEquipmentOptions(group, appState.character);
  return `<section class="equipment-choice-group"><div class="equipment-group-header"><h3>${group.title}</h3><span>Choose 1</span></div>${group.description ? `<p class="equipment-note">${group.description}</p>` : ""}<div class="equipment-options">${options.map((option) => renderEquipmentOption(group, option, selectedChoice, appState.character)).join("")}</div></section>`;
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
    <div class="wizard-actions"><button class="secondary-button" type="button" data-action="back">Back</button>${resetStepButtonHtml()}<button class="secondary-button" type="button" data-action="randomize-current">Randomize</button><button class="primary-button" type="button" data-action="continue" ${hasCompleteEquipmentSelections(appState.character) ? "" : "disabled"}>Continue</button></div>
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
  if (race.id === "half-elf" || race.baseRaceId === "half-elf") return `${race.name} (+2 Charisma, +1 to two other abilities)`;
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
  const entries = getClassFeatureChoiceGroups(character)
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
  if (isDraconicSorcerer(character)) {
    const ancestor = getDragonAncestor(character);
    if (ancestor) entries.push({ label: "Dragon Ancestor", value: `${ancestor.name} &mdash; ${ancestor.damageType}` });
  }
  return entries;
}

function renderClassChoicePreviewItems(character) {
  return getSelectedClassFeatureChoiceEntries(character)
    .map((entry, index) => `
      <div class="sheet-item class-choice-sheet-item">
        <span class="sheet-label">${index + 1}. Class Choice</span>
        <span class="class-choice-preview-body">
          <span>${entry.label}:</span>
          <span>${entry.value}</span>
        </span>
      </div>
    `)
    .join("");
}

function renderClassFaithPreviewItem(character) {
  const faith = (character.classFeatures && character.classFeatures.clericFaith ? character.classFeatures.clericFaith : "").trim();
  if (character.classId !== "cleric" || !faith) return "";
  return `<div class="sheet-item"><span class="sheet-label">Deity, Faith, or Philosophy</span>${escapeHtml(faith)}</div>`;
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

  if (character.classId === "cleric") {
    return {
      primary: "Wisdom",
      secondary: "Constitution or Strength",
      notes: equipmentNotes,
    };
  }

  if (character.classId === "druid") {
    return {
      primary: "Wisdom",
      secondary: "Dexterity and Constitution",
      notes: ["Druids will not wear armor or use shields made of metal.", ...equipmentNotes],
    };
  }

  if (character.classId === "bard") {
    return {
      primary: "Charisma",
      secondary: "Dexterity and Constitution",
      notes: equipmentNotes,
    };
  }

  if (character.classId === "sorcerer") {
    return {
      primary: "Charisma",
      secondary: "Constitution and Dexterity",
      notes: equipmentNotes,
    };
  }

  if (character.classId === "warlock") {
    return {
      primary: "Charisma",
      secondary: "Constitution and Dexterity",
      notes: equipmentNotes,
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
  const race = getSelectedRace(appState.character);
  const featureName = getSelectedClassFeatureName(appState.character);
  const choice = getClassFeatureChoice(appState.character);
  const guidance = getSimpleAbilityGuidance(appState.character);

  return `
    <section class="ability-score-guidance-panel" aria-label="Ability Score Guidance">
      <h3>Ability Score Guidance</h3>
      <div class="guidance-section">
        <span class="guidance-section-label">Selected Build</span>
        <p><strong>Class:</strong> ${characterClass ? characterClass.name : "Not selected"}</p>
        ${choice ? `<p><strong>Class Choice:</strong> ${featureName}</p>` : ""}
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
  const race = getSelectedRace(appState.character);
  const usedScores = getUsedStandardScores();
  const availableScores = DND_DATA.standardArray.filter((score) => !usedScores.includes(score));
  return `<div class="available-scores">Available scores: ${availableScores.length ? availableScores.map((score) => `<span class="score-pill">${score}</span>`).join("") : '<span class="score-pill">None</span>'}</div><div class="ability-controls score-assignment-grid standard-array-grid">${DND_DATA.abilities.map((ability) => {
    const selectedScore = appState.abilityState.standard.assignments[ability];
    const blockedScores = getUsedStandardScores(ability);
    const racialBonus = getRaceAbilityBonus(race, ability);
    const availableStandardScores = DND_DATA.standardArray.filter((score) => Number(selectedScore) === score || !blockedScores.includes(score));
    return `<label>${ability}${raceAbilityMarker(racialBonus)}<select data-ability-method="${ABILITY_METHODS.standard}" data-ability="${ability}"><option value="">Score</option>${availableStandardScores.map((score) => `<option value="${score}" ${Number(selectedScore) === score ? "selected" : ""}>${formatRacialAdjustedScoreOption(score, racialBonus)}</option>`).join("")}</select></label>`;
  }).join("")}</div>${scoreAssignmentLegend()}<button class="secondary-button assignment-button" type="button" data-action="randomize-abilities">Random Assign</button>${renderHalfElfAbilityChoices()}`;
}

function rolledScoreControls() {
  const race = getSelectedRace(appState.character);
  const rolled = appState.abilityState.rolled;
  const hasRolledScores = rolled.results.length === 6;
  const rollSlots = hasRolledScores
    ? rolled.results
    : Array.from({ length: 6 }, (_, index) => ({ id: `empty-roll-${index + 1}`, dice: [], total: "" }));

  return `<div class="roll-results" aria-label="Rolled ability scores">${rollSlots.map((roll, index) => `<div class="roll-result ${hasRolledScores ? "" : "empty"}"><strong>${hasRolledScores ? `Roll ${index + 1}: ${roll.total}` : ""}</strong><span>${hasRolledScores ? `${roll.dice.join(", ")} -> ${roll.total}` : ""}</span></div>`).join("")}</div>${hasRolledScores ? `<p class="table-note">Reroll Attempts: ${rolled.rerollCount}</p>` : ""}<div class="ability-controls score-assignment-grid rolled-assignment-grid">${DND_DATA.abilities.map((ability) => {
    const selectedRollId = rolled.assignments[ability];
    const blockedRollIds = getUsedRollIds(ability);
    const racialBonus = getRaceAbilityBonus(race, ability);
    const availableRolls = rolled.results
      .map((roll, index) => ({ ...roll, label: `Roll ${index + 1}` }))
      .filter((roll) => roll.id === selectedRollId || !blockedRollIds.includes(roll.id));
    return `<label>${ability}${raceAbilityMarker(racialBonus)}<select data-ability-method="${ABILITY_METHODS.rolled}" data-ability="${ability}" ${hasRolledScores ? "" : "disabled"}><option value="">Score</option>${availableRolls.map((roll) => `<option value="${roll.id}" ${selectedRollId === roll.id ? "selected" : ""}>${formatRacialAdjustedScoreOption(roll.total, racialBonus)} (${roll.label})</option>`).join("")}</select></label>`;
  }).join("")}</div>${scoreAssignmentLegend()}${hasRolledScores ? "" : '<button class="secondary-button assignment-button" type="button" data-action="roll-scores">Roll Six Scores</button>'}${hasRolledScores ? '<div class="assignment-actions"><button class="secondary-button assignment-button" type="button" data-action="randomly-assign-rolled">Random Assign</button><button class="secondary-button assignment-button" type="button" data-action="reroll-stats">Reroll Stats</button></div>' : ""}${renderHalfElfAbilityChoices()}`;
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
  const race = getSelectedRace(appState.character);

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
  }).join("")}</div><p class="point-buy-legend">Scores shown include racial bonuses. Point Buy costs use base scores. * = +1 racial bonus; ** = +2 racial bonus.</p>${renderHalfElfAbilityChoices()}`;
}

function renderInlinePicker({ id, label, value, placeholder, options, helper = "", beforeTrigger = "", note = "", actionType, skipped = false }) {
  const isOpen = appState.openFinishingPicker === id;
  const selectedOption = options.find((option) => option.value === value);
  const displayValue = skipped ? "Skipped for now" : selectedOption ? selectedOption.label : placeholder;
  return `
    <div class="inline-picker ${isOpen ? "open" : ""}">
      <span class="inline-picker-label">${label}</span>
      ${helper ? `<p>${helper}</p>` : ""}
      ${beforeTrigger || ""}
      <button class="inline-picker-trigger" type="button" data-picker-toggle="${id}" aria-expanded="${isOpen}">
        <span>${displayValue}</span>
      </button>
      ${isOpen ? `<div class="inline-picker-options">${options.map((option) => `<button type="button" data-picker-option="${id}" data-picker-action="${actionType}" data-picker-value="${option.value}"><span>${option.label}</span>${option.description ? `<small>${option.description}</small>` : ""}</button>`).join("")}</div>` : ""}
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
  const validation = isFinishingChoiceComplete(appState.character, choice)
    ? ""
    : `<p class="finishing-validation">${selectedValue ? "Choose a different option before finishing." : `${placeholder} before finishing.`}</p>`;
  const note = `${choice.note ? `<p>${choice.note}</p>` : ""}${validation}`;
  const incompleteAttribute = isFinishingChoiceComplete(appState.character, choice) ? "" : "data-incomplete-finishing-choice";
  return `
    <section class="finishing-card" ${incompleteAttribute}>
      ${renderInlinePicker({
        id: `choice:${choice.id}`,
        label: choice.label,
        value: selectedValue,
        placeholder,
        options,
        helper: choice.helper,
        beforeTrigger: `<div class="personality-actions"><button class="secondary-button" type="button" data-random-finishing-choice="${choice.id}">Randomize</button></div>`,
        note,
        actionType: "finishing-choice",
      })}
    </section>
  `;
}

function renderPersonalityField(field, label, options = []) {
  const entry = getFinishingTouches(appState.character).personality[field] || {};
  const mode = entry.mode || (entry.skipped ? "skip" : entry.custom ? "custom" : "suggestion");
  const placeholders = {
    trait: "Choose a personality trait",
    ideal: "Choose an ideal",
    bond: "Choose a bond",
    flaw: "Choose a flaw",
  };
  return `
    <section class="finishing-card personality-card">
      <span class="inline-picker-label">${label}</span>
      <div class="personality-mode-control" role="group" aria-label="${label} mode">
        <button class="secondary-button ${mode === "suggestion" ? "selected" : ""}" type="button" data-personality-mode="${field}" data-personality-mode-value="suggestion">Choose a suggestion</button>
        <button class="secondary-button ${mode === "custom" ? "selected" : ""}" type="button" data-personality-mode="${field}" data-personality-mode-value="custom">Write custom text</button>
        <button class="secondary-button ${mode === "skip" ? "selected" : ""}" type="button" data-personality-mode="${field}" data-personality-mode-value="skip">Skip this for now</button>
      </div>
      ${mode === "suggestion" ? `
        <div class="personality-actions">
          <button class="secondary-button" type="button" data-random-personality="${field}">Randomize</button>
        </div>
        ${renderInlinePicker({
          id: `personality:${field}`,
          label: `${label} Suggestion`,
          value: entry.selected || "",
          placeholder: placeholders[field],
          options: options.map((option) => ({ value: option, label: option })),
          actionType: "personality-select",
        })}
      ` : ""}
      ${mode === "custom" ? `
        <label class="custom-personality-label">Custom text
          <textarea data-personality-custom="${field}" rows="2" placeholder="Optional custom ${label.toLowerCase()}">${escapeHtml(entry.custom || "")}</textarea>
        </label>
      ` : ""}
      ${mode === "skip" ? '<p>This will be left blank on your sheet.</p>' : ""}
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
        beforeTrigger: '<div class="personality-actions"><button class="secondary-button" type="button" data-random-alignment>Randomize</button></div>',
        actionType: "alignment-select",
        skipped: Boolean(entry.skipped),
      })}
      ${entry.skipped ? '<p>This will be left blank on your sheet.</p>' : ""}
      <div class="personality-actions">
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
  const background = getActiveBackground(appState.character);
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
    <div class="wizard-actions"><button class="secondary-button" type="button" data-action="back">Back</button>${resetStepButtonHtml()}<button class="secondary-button" type="button" data-randomize-finishing>Randomize</button><button class="primary-button" type="button" data-action="finish" ${canFinish ? "" : "disabled"}>Finish</button></div>
  `;
}

function renderAbilityStep(step) {
  const controls = appState.abilityMethod === ABILITY_METHODS.rolled ? rolledScoreControls() : appState.abilityMethod === ABILITY_METHODS.pointBuy ? pointBuyControls() : standardArrayControls();
  wizardStep.innerHTML = `<p class="progress-text">${step.progress}</p><h2>${step.title}</h2>${renderAbilityScoreGuidancePanel()}${methodSelector()}<div class="method-content">${controls}</div><div class="wizard-actions"><button class="secondary-button" type="button" data-action="back">Back</button>${resetStepButtonHtml()}<button class="primary-button" type="button" data-action="continue" ${hasValidAbilityAssignments() ? "" : "disabled"}>Continue</button></div>`;
}

function renderSkillsStep(step) {
  const characterClass = getById(DND_DATA.classes, appState.character.classId);
  const race = getSelectedRace(appState.character);
  const background = getActiveBackground(appState.character);
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
    ${renderBackgroundSkillReplacementSection(race, background)}
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
    ${renderDomainSkillSection(race, background)}
    ${renderHalfElfSkillSection(race, background)}
    <div class="wizard-actions"><button class="secondary-button" type="button" data-action="back">Back</button>${resetStepButtonHtml()}<button class="secondary-button" type="button" data-action="randomize-current" ${choice.choose ? "" : "disabled"}>Randomize</button><button class="primary-button" type="button" data-action="continue" ${canFinish ? "" : "disabled"}>Continue</button></div>
  `;
}

function formatSpellLevel(spell) {
  return spell.level === 0 ? "Cantrip" : `Level ${spell.level}`;
}

function renderWizardPrepareControl(spell, selectionType, isSelected, character) {
  if (character.classId !== "wizard" || selectionType !== "spellbookSpells" || !isSelected) return "";
  const preparedIds = getSelectedSpellIds(character, "preparedSpells");
  const preparedLimit = getPreparedSpellLimit(character);
  const isPrepared = preparedIds.includes(spell.id);
  const isAtPreparedLimit = preparedIds.length >= preparedLimit && !isPrepared;
  const remaining = Math.max(preparedLimit - preparedIds.length, 0);
  const progressText = remaining ? `Prepare ${remaining} more.` : "Prepared spells complete.";
  const helperText = isPrepared
    ? `This spell is prepared. ${progressText}`
    : isAtPreparedLimit
      ? `You already prepared ${preparedIds.length} of ${preparedLimit} spells. Unprepare one first.`
      : `Mark this spell as prepared. ${progressText}`;
  return `
    <div class="wizard-prepare-row">
      <button class="wizard-prepare-button ${isPrepared ? "prepared" : ""}" type="button" data-wizard-prepare-spell="${spell.id}" ${isAtPreparedLimit ? "disabled" : ""} aria-pressed="${isPrepared}">
        ${isPrepared ? "Prepared" : "Prepare"}
      </button>
      <span>${helperText}</span>
    </div>
  `;
}

function renderSpellSelectionCard(spell, selectionType, selectedIds, limit, character = appState.character) {
  const isSelected = selectedIds.includes(spell.id);
  const isAtLimit = selectedIds.length >= limit && !isSelected;
  return `
    <article class="spell-choice-card ${isSelected ? "selected" : ""} ${isAtLimit ? "disabled" : ""}">
      <button class="spell-select-button" type="button" data-spell-selection="${selectionType}" data-spell-id="${spell.id}" ${isAtLimit ? "disabled" : ""} aria-pressed="${isSelected}">
        <span class="spell-card-main">
          <span class="spell-card-heading">
            <strong>${spell.name}</strong>
            ${renderSpellTags(spell)}
            <span>${formatSpellLevel(spell)} - ${spell.school}</span>
          </span>
          <span class="spell-card-facts">
            ${renderSpellFactBoxes(spell)}
          </span>
        </span>
      </button>
      ${renderWizardPrepareControl(spell, selectionType, isSelected, character)}
      <details class="spell-card-detail-toggle">
        <summary>Open details</summary>
        <span class="spell-card-details">
          ${renderSpellDetailContent(spell)}
        </span>
      </details>
    </article>
  `;
}

function sortSpellsByName(spells) {
  return [...spells].sort((a, b) => a.name.localeCompare(b.name));
}

function renderSpellChoiceGrid(spells, selectionType, selectedIds, limit) {
  return `
    <div class="spell-choice-grid">
      ${spells.map((spell) => renderSpellSelectionCard(spell, selectionType, selectedIds, limit)).join("")}
    </div>
  `;
}

function renderWarlockKnownSpellOptions(spells, selectionType, selectedIds, limit) {
  const expandedIds = new Set(DND_DATA.getWarlockPatronExpandedSpellIds
    ? DND_DATA.getWarlockPatronExpandedSpellIds(getSelectedWarlockPatronId(appState.character))
    : []);
  const expandedSpells = sortSpellsByName(spells.filter((spell) => expandedIds.has(spell.id)));
  const regularSpells = sortSpellsByName(spells.filter((spell) => !expandedIds.has(spell.id)));
  return renderSpellChoiceGrid([...expandedSpells, ...regularSpells], selectionType, selectedIds, limit);
}

function renderSpellSelectionSection(title, helper, selectionType, spells, selectedIds, limit) {
  const wizardPreparedCount = getSelectedSpellIds(appState.character, "preparedSpells").length;
  const wizardPreparedLimit = getPreparedSpellLimit(appState.character);
  const wizardPrepareRemaining = Math.max(wizardPreparedLimit - wizardPreparedCount, 0);
  const wizardPrepareProgress = appState.character.classId === "wizard" && selectionType === "spellbookSpells"
    ? `
      <div class="wizard-prepare-guidance">
        <p>Your spellbook can hold more spells than you can have ready at once. Choose which spellbook spells your Wizard has prepared for the day. You can cast prepared spells using your spell slots.</p>
        <p><strong>Prepared ${wizardPreparedCount} of ${wizardPreparedLimit}.</strong> ${wizardPrepareRemaining ? `Prepare ${wizardPrepareRemaining} more.` : "Prepared spells complete."}</p>
      </div>
    `
    : "";
  return `
    <section class="spell-selection-section">
      <div class="spell-selection-header">
        <h3>${title}</h3>
        <span>${selectedIds.length} / ${limit} selected</span>
      </div>
      <p>${helper}</p>
      ${wizardPrepareProgress}
      ${appState.character.classId === "warlock" && selectionType === "spellbookSpells"
        ? renderWarlockKnownSpellOptions(spells, selectionType, selectedIds, limit)
        : renderSpellChoiceGrid(spells, selectionType, selectedIds, limit)}
    </section>
  `;
}

function renderDomainSpellSelectionSection(character) {
  const domainSpells = getClericDomainSpells(character);
  if (character.classId !== "cleric") return "";
  return `
    <section class="spell-selection-section">
      <div class="spell-selection-header">
        <h3>Domain Spells</h3>
        <span>Always prepared</span>
      </div>
      <p>These spells come from your Divine Domain and do not count against prepared spells.</p>
      <div class="spell-card-list">
        ${domainSpells.length ? domainSpells.map(renderSpellDisplayCard).join("") : "<p>Choose a Divine Domain to see domain spells.</p>"}
      </div>
    </section>
  `;
}

function renderBonusCantripSelectionSection(character) {
  const grantedCantrips = getGrantedBonusCantripIds(character).map((spellId) => DND_DATA.getSpellById(spellId)).filter(Boolean);
  const natureChoice = getNatureBonusCantripChoice(character);
  const selectedNatureIds = natureChoice ? getSelectedSpellIds(character, natureChoice.id) : [];
  const natureOptions = natureChoice ? getSpellOptionsForSelection(character, natureChoice.id) : [];
  if (!grantedCantrips.length && !natureChoice) return "";
  return `
    <section class="spell-selection-section">
      <div class="spell-selection-header">
        <h3>Bonus Cantrips</h3>
        <span>${natureChoice ? `${selectedNatureIds.length} / ${natureChoice.choose} selected` : "Granted"}</span>
      </div>
      ${grantedCantrips.length ? `<p>These cantrips are granted by your Divine Domain and do not count against Cleric cantrips.</p><div class="spell-card-list">${grantedCantrips.map(renderSpellDisplayCard).join("")}</div>` : ""}
      ${natureChoice ? `<p>Choose 1 Druid cantrip from Acolyte of Nature. It does not count against Cleric cantrips.</p><div class="spell-choice-grid">${natureOptions.map((spell) => renderSpellSelectionCard(spell, natureChoice.id, selectedNatureIds, natureChoice.choose)).join("")}</div>` : ""}
    </section>
  `;
}

function renderRacialCantripSelectionSection(character) {
  const choice = getRacialCantripChoice(character);
  if (!choice) return "";
  const selectedIds = getSelectedSpellIds(character, choice.id);
  const options = getSpellOptionsForSelection(character, choice.id);
  return `
    <section class="spell-selection-section">
      <div class="spell-selection-header">
        <h3>High Elf Racial Cantrip</h3>
        <span>${selectedIds.length} / ${choice.choose} selected</span>
      </div>
      <p>Choose one Wizard cantrip granted by your High Elf ancestry. It does not count against any class cantrip limit and uses Intelligence.</p>
      ${renderSpellChoiceGrid(options, choice.id, selectedIds, choice.choose)}
    </section>
  `;
}

function spellSelectionSectionHelper(character, section) {
  if ((character.classId === "cleric" || character.classId === "druid") && section.id === "preparedSpells") {
    const className = character.classId === "druid" ? "Druid" : "Cleric";
    const domainNote = character.classId === "cleric" ? " Domain spells are always prepared and do not count." : "";
    return `Prepare ${section.limit} level 1 ${className} ${section.limit === 1 ? "spell" : "spells"}.${domainNote}`;
  }
  return section.helper;
}

function renderSpellSelectionStep(step) {
  const characterClass = getById(DND_DATA.classes, appState.character.classId);
  const sections = getSpellSelectionSections(appState.character);
  const selections = getSpellcastingSelections(appState.character);
  const canContinue = hasCompleteSpellSelection(appState.character);
  const validationMessage = canContinue ? "" : spellSelectionValidationMessage(appState.character);

  wizardStep.innerHTML = `
    <p class="progress-text">${step.progress}</p>
    <h2>${step.title}</h2>
    ${guidancePanel(stepGuidance.spellSelection)}
    ${validationMessage ? `<p class="spell-selection-validation">${validationMessage}</p>` : ""}
    ${sections.map((section) => renderSpellSelectionSection(
      section.title,
      spellSelectionSectionHelper(appState.character, section),
      section.id,
      getSpellOptionsForSelection(appState.character, section.id),
      selections[section.id] || [],
      section.limit,
    )).join("")}
    ${renderBonusCantripSelectionSection(appState.character)}
    ${renderRacialCantripSelectionSection(appState.character)}
    ${renderDomainSpellSelectionSection(appState.character)}
    <div class="wizard-actions"><button class="secondary-button" type="button" data-action="back">Back</button>${resetStepButtonHtml()}<button class="secondary-button" type="button" data-action="randomize-current">Randomize</button><button class="primary-button" type="button" data-action="continue" ${canContinue ? "" : "disabled"}>Continue</button></div>
  `;
}
function renderWizard() {
  const step = wizardSteps[appState.wizardStepIndex];
  views.build.classList.toggle("ability-step-active", step.key === "abilities");
  views.build.classList.toggle("finishing-step-active", step.key === "finishing");
  syncAbilityScoresFromState();
  renderPreview(livePreview, appState.character);
  if (step.key === "class") renderClassStep(step);
  if (step.key === "race") renderRaceStep(step);
  if (step.key === "background") renderBackgroundStep(step);
  if (step.key === "equipment") renderEquipmentStep(step);
  if (step.key === "abilities") renderAbilityStep(step);
  if (step.key === "skills") renderSkillsStep(step);
  if (step.key === "spellSelection") renderSpellSelectionStep(step);
  if (step.key === "finishing") renderFinishingStep(step);
  updateUtilityBarState();
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
  setRandomBackgroundChoices(appState.character);
  setRandomClassSkillSelections(appState.character);
  recomputeCharacter();
  renderPreview(randomPreview, appState.character);
  navigateToCompletedSheet();
}

function randomChoiceExcept(items, currentId) {
  const otherItems = items.filter((item) => item.id !== currentId);
  return DND_DATA.randomChoice(otherItems.length ? otherItems : items);
}

function randomizeBaseRaceOnly() {
  const race = randomChoiceExcept(DND_DATA.races, appState.character.raceId);
  appState.character.raceId = race.id;
  resetRaceDependentState(appState.character);
  renderWizard();
  scrollToRaceStepTargetOnMobile();
  scrollToRaceStepTargetOnDesktop();
}

function randomizeSecondaryRaceChoice() {
  if (raceRequiresSubrace(appState.character)) {
    const subraces = getSubracesForSelectedRace(appState.character);
    const subrace = randomChoiceExcept(subraces, appState.character.subraceId);
    appState.character.subraceId = subrace.id;
    resetSkillSelections(appState.character);
    resetSpellSelections(appState.character);
    resetFinishingRequiredChoices(appState.character);
    renderWizard();
    scrollToRaceStepTargetOnMobile();
    scrollToRaceStepTargetOnDesktop();
    return;
  }

  if (raceRequiresAncestry(appState.character)) {
    const ancestry = randomChoiceExcept(DND_DATA.dragonbornAncestries || [], (appState.character.raceChoices || {}).dragonbornAncestry);
    if (!ancestry) return;
    if (!appState.character.raceChoices) appState.character.raceChoices = { dragonbornAncestry: "", halfElfAbilities: [], halfElfSkills: [] };
    appState.character.raceChoices.dragonbornAncestry = ancestry.id;
    renderWizard();
    scrollToRaceStepTargetOnMobile();
    scrollToRaceStepTargetOnDesktop();
  }
}

function randomizeClassOnly() {
  appState.character.classId = randomChoiceExcept(DND_DATA.classes, appState.character.classId).id;
  resetClassFeatureSelections(appState.character);
  resetEquipmentSelections(appState.character);
  resetSkillSelections(appState.character);
  resetSpellSelections(appState.character);
  resetFinishingRequiredChoices(appState.character);
  renderWizard();
  scrollToClassStepTargetOnMobile(getClassStepScrollTargetSelector(appState.character));
  scrollToClassStepTargetOnDesktop();
}

function randomizeBackgroundOnly() {
  const currentVersion = getBackgroundVersion(appState.character);
  const currentKey = currentVersion ? `${appState.character.backgroundId}:${currentVersion}` : appState.character.backgroundId;
  const outcome = DND_DATA.randomBackgroundOutcome
    ? DND_DATA.randomBackgroundOutcome(currentKey)
    : { background: randomChoiceExcept(DND_DATA.backgrounds, appState.character.backgroundId), version: "" };
  if (!outcome || !outcome.background) return;
  appState.character.backgroundId = outcome.background.id;
  resetBackgroundChoices(appState.character);
  setBackgroundVersion(appState.character, outcome.version || "");
  sanitizeBackgroundChoices(appState.character);
  resetSkillSelections(appState.character);
  resetFinishingRequiredChoices(appState.character);
  appState.openFinishingPicker = "";
  renderWizard();
  scrollToBackgroundStepTargetOnMobile();
  scrollToBackgroundStepTargetOnDesktop();
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
  if (group.dragonAncestorChoices) {
    delete character.classFeatures[group.dragonAncestorChoices.field.id];
    if (option.id === "draconic-bloodline") {
      character.classFeatures[group.dragonAncestorChoices.field.id] = DND_DATA.randomChoice(group.dragonAncestorChoices.options).id;
    }
  }
}

function randomizeClassFeatureChoice(groupId) {
  const group = getClassFeatureChoiceGroups(appState.character).find((item) => item.id === groupId);
  if (!group) return;
  randomClassFeatureSelection(appState.character, group);
  resetSkillSelections(appState.character);
  resetSpellSelections(appState.character);
  renderWizard();
  scrollToClassStepTargetOnMobile(getClassStepScrollTargetSelector(appState.character));
  scrollToClassStepTargetOnDesktop();
}

function randomizeClassFeatureExtraChoice(fieldId) {
  const group = getClassFeatureGroupForExtraField(appState.character, fieldId);
  if (!group || !group.dragonAncestorChoices || group.dragonAncestorChoices.field.id !== fieldId) return;
  appState.character.classFeatures[fieldId] = DND_DATA.randomChoice(group.dragonAncestorChoices.options).id;
  resetSkillSelections(appState.character);
  resetSpellSelections(appState.character);
  renderWizard();
  scrollToClassStepTargetOnMobile(getClassStepScrollTargetSelector(appState.character));
  scrollToClassStepTargetOnDesktop();
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
    const availableOptions = group.options.filter((option) => isEquipmentOptionAvailable(character, option));
    const option = DND_DATA.randomChoice(availableOptions.length ? availableOptions : group.options);
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
    getClassFeatureChoiceGroups(appState.character).forEach((group) => randomClassFeatureSelection(appState.character, group));
    resetEquipmentSelections(appState.character);
    resetSkillSelections(appState.character);
    resetSpellSelections(appState.character);
    resetFinishingRequiredChoices(appState.character);
    renderWizard();
    scrollToClassStepTargetOnMobile(getClassStepScrollTargetSelector(appState.character));
    scrollToClassStepTargetOnDesktop();
    return;
  }
  if (step.key === "race") {
    const raceSelection = DND_DATA.randomRaceSelection
      ? DND_DATA.randomRaceSelection(appState.character.raceId)
      : { race: randomChoiceExcept(DND_DATA.races, appState.character.raceId), subrace: null };
    appState.character.raceId = raceSelection.race.id;
    appState.character.subraceId = raceSelection.subrace ? raceSelection.subrace.id : "";
    appState.character.raceChoices = { dragonbornAncestry: raceSelection.ancestry ? raceSelection.ancestry.id : "", halfElfAbilities: [], halfElfSkills: [] };
    resetSkillSelections(appState.character);
    resetSpellSelections(appState.character);
    resetFinishingRequiredChoices(appState.character);
  }
  if (step.key === "background") {
    const currentVersion = getBackgroundVersion(appState.character);
    const currentKey = currentVersion ? `${appState.character.backgroundId}:${currentVersion}` : appState.character.backgroundId;
    const outcome = DND_DATA.randomBackgroundOutcome ? DND_DATA.randomBackgroundOutcome(currentKey) : { background: randomChoiceExcept(DND_DATA.backgrounds, appState.character.backgroundId), version: "" };
    appState.character.backgroundId = outcome.background.id;
    resetBackgroundChoices(appState.character);
    setBackgroundVersion(appState.character, outcome.version || "");
    setRandomBackgroundChoices(appState.character);
    resetSkillSelections(appState.character);
    resetFinishingRequiredChoices(appState.character);
  }
  if (step.key === "equipment") randomizeEquipmentSelections(appState.character);
  if (step.key === "abilities") {
    randomizeCurrentAbilityStep();
    setRandomHalfElfAbilityChoices(appState.character);
    renderWizard();
    return;
  }
  if (step.key === "skills") setRandomClassSkillSelections(appState.character);
  if (step.key === "spellSelection") setRandomSpellSelections(appState.character);
  renderWizard();
  scrollToCurrentStepDetailsOnMobile();
  if (step.key === "race") scrollToRaceStepTargetOnDesktop();
  if (step.key === "background") scrollToBackgroundStepTargetOnDesktop();
}

function setRandomHalfElfAbilityChoices(character) {
  if (!isHalfElf(character)) return;
  if (!character.raceChoices) character.raceChoices = { dragonbornAncestry: "", halfElfAbilities: [], halfElfSkills: [] };
  character.raceChoices.halfElfAbilities = DND_DATA.shuffle(DND_DATA.abilities.filter((ability) => ability !== "Charisma")).slice(0, 2);
}

function randomizeCurrentAbilityStep() {
  resetSkillSelections(appState.character);
  resetSpellSelections(appState.character);
  if (appState.abilityMethod === ABILITY_METHODS.standard) {
    const scores = [...DND_DATA.standardArray].sort(() => Math.random() - 0.5);
    DND_DATA.abilities.forEach((ability, index) => {
      appState.abilityState.standard.assignments[ability] = scores[index];
    });
  }
  if (appState.abilityMethod === ABILITY_METHODS.rolled) {
    if (appState.abilityState.rolled.results.length !== 6) appState.abilityState.rolled.results = DND_DATA.rollSixAbilityScores();
    appState.abilityState.rolled.assignments = DND_DATA.randomlyAssignRolls(appState.abilityState.rolled.results);
  }
  if (appState.abilityMethod === ABILITY_METHODS.pointBuy) {
    const scores = DND_DATA.assignStandardArray(appState.character.classId || "");
    DND_DATA.abilities.forEach((ability) => {
      appState.abilityState.pointBuy.scores[ability] = scores[ability];
      appState.abilityState.pointBuy.touched[ability] = true;
    });
    appState.abilityState.pointBuy.finalized = true;
  }
}

function randomizeAbilityScores() {
  resetSkillSelections(appState.character);
  resetSpellSelections(appState.character);
  const scores = [...DND_DATA.standardArray].sort(() => Math.random() - 0.5);
  DND_DATA.abilities.forEach((ability, index) => {
    appState.abilityState.standard.assignments[ability] = scores[index];
  });
  renderWizard();
}

function rollSixScores() {
  resetSkillSelections(appState.character);
  resetSpellSelections(appState.character);
  appState.abilityState.rolled.results = DND_DATA.rollSixAbilityScores();
  appState.abilityState.rolled.assignments = emptyAbilityScores();
  appState.abilityState.rolled.rerollCount = 0;
  renderWizard();
}

function rerollRolledAbilityScores() {
  resetSkillSelections(appState.character);
  resetSpellSelections(appState.character);
  appState.abilityState.rolled.results = DND_DATA.rollSixAbilityScores();
  appState.abilityState.rolled.assignments = emptyAbilityScores();
  appState.abilityState.rolled.rerollCount += 1;
  renderWizard();
}

function randomlyAssignRolledScores() {
  if (appState.abilityState.rolled.results.length !== 6) return;
  resetSkillSelections(appState.character);
  resetSpellSelections(appState.character);
  appState.abilityState.rolled.assignments = DND_DATA.randomlyAssignRolls(appState.abilityState.rolled.results);
  renderWizard();
}

function adjustPointBuyScore(ability, direction) {
  resetSkillSelections(appState.character);
  resetSpellSelections(appState.character);
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
  return hasValidBaseAbilityAssignments() && hasCompleteHalfElfAbilityChoices(appState.character);
}

function finishCharacter({ allowBlankName = false } = {}) {
  if (!hasValidAbilityAssignments() || !hasCompleteSkillSelections(appState.character) || !hasCompleteSpellSelection(appState.character) || !hasCompleteFinishingTouches(appState.character)) return;
  if (!allowBlankName && !appState.character.name.trim()) {
    appState.confirmBlankName = true;
    renderWizard();
    requestAnimationFrame(() => {
      scrollElementBelowUtilityBar(wizardStep.querySelector(".blank-name-confirmation"), "auto");
    });
    return;
  }
  appState.confirmBlankName = false;
  if (appState.abilityMethod === ABILITY_METHODS.pointBuy) appState.abilityState.pointBuy.finalized = true;
  syncAbilityScoresFromState();
  renderPreview(randomPreview, appState.character);
  navigateToCompletedSheet();
  saveProgress();
}

wizardStep.addEventListener("click", (event) => {
  const optionButton = event.target.closest("[data-option-id]");
  const methodButton = event.target.closest("[data-score-method]");
  const pointBuyButton = event.target.closest("[data-point-buy]");
  const equipmentMethodButton = event.target.closest("[data-equipment-method]");
  const equipmentChoiceButton = event.target.closest("[data-equipment-group]");
  const skillChoiceButton = event.target.closest("[data-skill-choice]");
  const domainSkillChoiceButton = event.target.closest("[data-domain-skill-choice]");
  const halfElfSkillChoiceButton = event.target.closest("[data-half-elf-skill]");
  const halfElfAbilityButton = event.target.closest("[data-half-elf-ability]");
  const spellChoiceButton = event.target.closest("[data-spell-selection]");
  const wizardPrepareButton = event.target.closest("[data-wizard-prepare-spell]");
  const pickerToggleButton = event.target.closest("[data-picker-toggle]");
  const pickerOptionButton = event.target.closest("[data-picker-option]");
  const randomFinishingButton = event.target.closest("[data-randomize-finishing]");
  const randomFinishingChoiceButton = event.target.closest("[data-random-finishing-choice]");
  const randomBackgroundChoiceButton = event.target.closest("[data-random-background-choice]");
  const randomBackgroundSkillReplacementButton = event.target.closest("[data-random-background-skill-replacement]");
  const randomBackgroundToolReplacementButton = event.target.closest("[data-random-background-tool-replacement]");
  const randomBackgroundVersionButton = event.target.closest("[data-random-background-version]");
  const addBackgroundRoutineButton = event.target.closest("[data-add-background-routine]");
  const removeBackgroundRoutineButton = event.target.closest("[data-remove-background-routine]");
  const backgroundVersionButton = event.target.closest("[data-background-version]");
  const randomAlignmentButton = event.target.closest("[data-random-alignment]");
  const skipAlignmentButton = event.target.closest("[data-skip-alignment]");
  const randomPersonalityButton = event.target.closest("[data-random-personality]");
  const skipPersonalityButton = event.target.closest("[data-skip-personality]");
  const personalityModeButton = event.target.closest("[data-personality-mode]");
  const rollTrinketButton = event.target.closest("[data-roll-trinket]");
  const clearTrinketButton = event.target.closest("[data-clear-trinket]");
  const randomClassFeatureButton = event.target.closest("[data-random-class-feature]");
  const randomClassFeatureExtraButton = event.target.closest("[data-random-class-feature-extra]");
  const actionButton = event.target.closest("[data-action]");

  if (randomClassFeatureExtraButton) {
    randomizeClassFeatureExtraChoice(randomClassFeatureExtraButton.dataset.randomClassFeatureExtra);
    return;
  }

  if (randomClassFeatureButton) {
    randomizeClassFeatureChoice(randomClassFeatureButton.dataset.randomClassFeature);
    return;
  }

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
    scrollToFinishingStepTargetOnMobile();
    return;
  }

  if (randomBackgroundChoiceButton) {
    randomizeBackgroundChoice(appState.character, randomBackgroundChoiceButton.dataset.randomBackgroundChoice);
    appState.openFinishingPicker = "";
    renderWizard();
    scrollToBackgroundStepTargetOnMobile();
    scrollToBackgroundStepTargetOnDesktop();
    return;
  }

  if (randomBackgroundSkillReplacementButton) {
    randomizeBackgroundSkillReplacement(appState.character, randomBackgroundSkillReplacementButton.dataset.randomBackgroundSkillReplacement);
    appState.openFinishingPicker = "";
    renderWizard();
    scrollToBackgroundStepTargetOnMobile();
    scrollToBackgroundStepTargetOnDesktop();
    return;
  }

  if (randomBackgroundToolReplacementButton) {
    randomizeBackgroundToolReplacement(appState.character, randomBackgroundToolReplacementButton.dataset.randomBackgroundToolReplacement);
    appState.openFinishingPicker = "";
    renderWizard();
    scrollToBackgroundStepTargetOnMobile();
    scrollToBackgroundStepTargetOnDesktop();
    return;
  }

  if (randomBackgroundVersionButton) {
    const rawBackground = getById(DND_DATA.backgrounds, appState.character.backgroundId);
    const versions = rawBackground ? getBackgroundVersionOptions(rawBackground) : [];
    if (!versions.length) return;
    const version = randomChoiceExcept(versions, getBackgroundVersion(appState.character));
    if (!version) return;
    setBackgroundVersion(appState.character, version.id);
    sanitizeBackgroundChoices(appState.character);
    resetSkillSelections(appState.character);
    resetFinishingRequiredChoices(appState.character);
    appState.openFinishingPicker = "";
    renderWizard();
    scrollToBackgroundStepTargetOnMobile();
    scrollToBackgroundStepTargetOnDesktop();
    return;
  }

  if (backgroundVersionButton) {
    setBackgroundVersion(appState.character, backgroundVersionButton.dataset.backgroundVersion);
    sanitizeBackgroundChoices(appState.character);
    resetSkillSelections(appState.character);
    resetFinishingRequiredChoices(appState.character);
    appState.openFinishingPicker = "";
    renderWizard();
    if (hasCompleteBackgroundChoices(appState.character)) scrollToSelectedBackgroundDescriptionOnMobile();
    else scrollToRequiredBackgroundChoicesOnMobile();
    scrollToBackgroundStepTargetOnDesktop();
    return;
  }

  if (addBackgroundRoutineButton) {
    setEntertainerRoutineCount(appState.character, getEntertainerRoutineCount(appState.character) + 1);
    appState.openFinishingPicker = "";
    renderWizard();
    return;
  }

  if (removeBackgroundRoutineButton) {
    const removeIndex = Number(removeBackgroundRoutineButton.dataset.removeBackgroundRoutine);
    const count = getEntertainerRoutineCount(appState.character);
    const choices = getBackgroundChoices(appState.character).choices;
    for (let index = removeIndex; index < count; index += 1) {
      choices[`entertainer-routine-${index}`] = choices[`entertainer-routine-${index + 1}`] || "";
    }
    delete choices[`entertainer-routine-${count}`];
    setEntertainerRoutineCount(appState.character, count - 1);
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
    const wasBackgroundComplete = hasCompleteBackgroundChoices(appState.character);
    if (action === "finishing-choice") {
      const choiceId = pickerId.replace("choice:", "");
      getFinishingTouches(appState.character).choices[choiceId] = value;
    }
    if (action === "background-choice") {
      const choiceId = pickerId.replace("background-choice:", "");
      getBackgroundChoices(appState.character).choices[choiceId] = value;
    }
    if (action === "background-skill-replacement") {
      const slotId = pickerId.replace("background-skill-replacement:", "");
      getBackgroundChoices(appState.character).skillReplacements[slotId] = value;
      resetSkillSelections(appState.character);
    }
    if (action === "background-tool-replacement") {
      const slotId = pickerId.replace("background-tool-replacement:", "");
      getBackgroundChoices(appState.character).toolReplacements[slotId] = value;
    }
    if (action === "personality-select") {
      const field = pickerId.replace("personality:", "");
      getFinishingTouches(appState.character).personality[field] = { selected: value, custom: "", skipped: false, mode: "suggestion" };
    }
    if (action === "alignment-select") {
      getFinishingTouches(appState.character).alignment = { selected: value, skipped: false };
    }
    if (action === "trinket-select") {
      getFinishingTouches(appState.character).trinket = { id: value, source: "chosen" };
    }
    appState.openFinishingPicker = "";
    renderWizard();
    if ((action === "background-choice" || action === "background-tool-replacement") && !wasBackgroundComplete && hasCompleteBackgroundChoices(appState.character)) {
      scrollToSelectedBackgroundDescriptionOnMobile();
    }
    return;
  }

  if (personalityModeButton) {
    const field = personalityModeButton.dataset.personalityMode;
    const mode = personalityModeButton.dataset.personalityModeValue;
    const entry = getFinishingTouches(appState.character).personality[field] || {};
    getFinishingTouches(appState.character).personality[field] = {
      selected: mode === "suggestion" ? entry.selected || "" : "",
      custom: mode === "custom" ? entry.custom || "" : "",
      skipped: mode === "skip",
      mode,
    };
    appState.openFinishingPicker = "";
    renderWizard();
    return;
  }

  if (randomPersonalityButton) {
    const field = randomPersonalityButton.dataset.randomPersonality;
    const background = getActiveBackground(appState.character);
    const options = background && background.personality ? background.personality[field] || [] : [];
    if (!options.length) return;
    getFinishingTouches(appState.character).personality[field] = { selected: DND_DATA.randomChoice(options), custom: "", skipped: false, mode: "suggestion" };
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

  if (halfElfAbilityButton) {
    if (!isHalfElf(appState.character)) return;
    if (!hasValidBaseAbilityAssignments()) return;
    const ability = halfElfAbilityButton.dataset.halfElfAbility;
    if (ability === "Charisma") return;
    if (!appState.character.raceChoices) appState.character.raceChoices = { dragonbornAncestry: "", halfElfAbilities: [], halfElfSkills: [] };
    const selectedAbilities = getHalfElfAbilityChoices(appState.character);
    appState.character.raceChoices.halfElfAbilities = selectedAbilities.includes(ability)
      ? selectedAbilities.filter((item) => item !== ability)
      : selectedAbilities.length < 2
        ? [...selectedAbilities, ability]
        : selectedAbilities;
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

  if (domainSkillChoiceButton) {
    const skillName = domainSkillChoiceButton.dataset.domainSkillChoice;
    const choice = getDomainSkillChoice(appState.character);
    if (!choice) return;
    const selectedSkills = getSelectedDomainSkillNames(appState.character);
    if (selectedSkills.includes(skillName)) {
      delete appState.character.domainSkillProficiencies[skillName];
    } else {
      if (selectedSkills.length >= choice.choose) return;
      const race = getSelectedRace(appState.character);
      const background = getActiveBackground(appState.character);
      if (getUnavailableDomainSkillSources(skillName, appState.character, race, background).length) return;
      appState.character.domainSkillProficiencies[skillName] = choice.expertise ? 2 : 1;
    }
    renderWizard();
    return;
  }

  if (halfElfSkillChoiceButton) {
    if (!isHalfElf(appState.character)) return;
    const skillName = halfElfSkillChoiceButton.dataset.halfElfSkill;
    if (!appState.character.raceChoices) appState.character.raceChoices = { dragonbornAncestry: "", halfElfAbilities: [], halfElfSkills: [] };
    const selectedSkills = getHalfElfSkillChoices(appState.character);
    if (selectedSkills.includes(skillName)) {
      appState.character.raceChoices.halfElfSkills = selectedSkills.filter((item) => item !== skillName);
    } else {
      const race = getSelectedRace(appState.character);
      const background = getActiveBackground(appState.character);
      if (selectedSkills.length >= 2 || getUnavailableHalfElfSkillSources(skillName, appState.character, race, background).length) return;
      appState.character.raceChoices.halfElfSkills = [...selectedSkills, skillName];
    }
    renderWizard();
    return;
  }

  if (wizardPrepareButton) {
    toggleWizardPreparedSpell(appState.character, wizardPrepareButton.dataset.wizardPrepareSpell);
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
    const definition = getEquipmentDefinition(appState.character.classId);
    const group = definition ? definition.choices.find((item) => item.id === groupId) : null;
    const option = group ? group.options.find((item) => item.id === optionId) : null;
    if (option && !isEquipmentOptionAvailable(appState.character, option)) return;
    if (selections.choices[groupId] && selections.choices[groupId].optionId === optionId) return;
    selections.choices[groupId] = { optionId };
    renderWizard();
    return;
  }

  if (optionButton) {
    const optionType = optionButton.dataset.optionType;
    const optionId = optionButton.dataset.optionId;
    let shouldScrollToClassTarget = false;
    let shouldScrollToSubrace = false;
    let shouldScrollToRaceDetails = false;
    if (optionType === "class") {
      const isSameClass = appState.character.classId === optionId;
      appState.character.classId = isSameClass ? "" : optionId;
      resetClassFeatureSelections(appState.character);
      resetEquipmentSelections(appState.character);
      resetSkillSelections(appState.character);
      resetSpellSelections(appState.character);
      resetFinishingRequiredChoices(appState.character);
      shouldScrollToClassTarget = !isSameClass;
    }
    if (optionType === "race") {
      if (appState.character.raceId === optionId) {
        appState.character.raceId = "";
        resetRaceDependentState(appState.character);
      } else {
        appState.character.raceId = optionId;
        resetRaceDependentState(appState.character);
        shouldScrollToSubrace = raceRequiresSubrace(appState.character) || raceRequiresAncestry(appState.character);
        shouldScrollToRaceDetails = !shouldScrollToSubrace;
      }
    }
    if (optionType === "subrace") {
      const subrace = DND_DATA.getSubraceById ? DND_DATA.getSubraceById(optionId) : null;
      if (!subrace || subrace.raceId !== appState.character.raceId) return;
      appState.character.subraceId = appState.character.subraceId === optionId ? "" : optionId;
      resetSkillSelections(appState.character);
      resetSpellSelections(appState.character);
      resetFinishingRequiredChoices(appState.character);
      shouldScrollToRaceDetails = Boolean(appState.character.subraceId);
    }
    if (optionType === "dragonbornAncestry") {
      if (appState.character.raceId !== "dragonborn") return;
      if (!appState.character.raceChoices) appState.character.raceChoices = { dragonbornAncestry: "", halfElfAbilities: [], halfElfSkills: [] };
      appState.character.raceChoices.dragonbornAncestry = appState.character.raceChoices.dragonbornAncestry === optionId ? "" : optionId;
      shouldScrollToRaceDetails = Boolean(appState.character.raceChoices.dragonbornAncestry);
    }
    if (optionType === "background") {
      const isSameBackground = appState.character.backgroundId === optionId;
      appState.character.backgroundId = isSameBackground ? "" : optionId;
      resetBackgroundChoices(appState.character);
      resetSkillSelections(appState.character);
      resetFinishingRequiredChoices(appState.character);
      renderWizard();
      if (!isSameBackground) {
        const rawBackground = getById(DND_DATA.backgrounds, appState.character.backgroundId);
        if (backgroundHasVersions(rawBackground) && backgroundVersionIsRequired(appState.character)) scrollToBackgroundVersionOnMobile();
        else if (hasCompleteBackgroundChoices(appState.character)) scrollToSelectedBackgroundDescriptionOnMobile();
        else scrollToRequiredBackgroundChoicesOnMobile();
        scrollToBackgroundStepTargetOnDesktop();
      }
      return;
    }
    if (optionType === "fightingStyle") {
      appState.character.classFeatures.fightingStyle = appState.character.classFeatures.fightingStyle === optionId ? "" : optionId;
      resetSkillSelections(appState.character);
      shouldScrollToClassTarget = true;
    }
    const featureGroup = getClassFeatureChoiceGroups(appState.character).find((group) => group.id === optionType);
    if (featureGroup && optionType !== "fightingStyle") {
      appState.character.classFeatures[featureGroup.id] = appState.character.classFeatures[featureGroup.id] === optionId ? "" : optionId;
      if (featureGroup.humanoidChoices) {
        featureGroup.humanoidChoices.fields.forEach((field) => {
          delete appState.character.classFeatures[field.id];
        });
      }
      if (featureGroup.dragonAncestorChoices) {
        delete appState.character.classFeatures[featureGroup.dragonAncestorChoices.field.id];
      }
      resetSkillSelections(appState.character);
      resetSpellSelections(appState.character);
      const selectedOption = getSelectedClassFeatureOption(appState.character, featureGroup);
      const revealsSameSectionFollowup = (
        featureGroup.dragonAncestorChoices
        || featureGroup.humanoidChoices
      )
        && selectedOption
        && (selectedOption.id === "draconic-bloodline" || selectedOption.id === "humanoids")
        && !hasCompleteClassFeatureGroup(appState.character, featureGroup);
      shouldScrollToClassTarget = !revealsSameSectionFollowup;
    }
    renderWizard();
    if (shouldScrollToClassTarget) scrollToClassStepTargetOnMobile(getClassStepScrollTargetSelector(appState.character));
    if (shouldScrollToSubrace) scrollToRequiredRaceChoiceOnMobile();
    if (shouldScrollToRaceDetails) scrollToSelectedRaceDetailsOnMobile();
    if (shouldScrollToClassTarget) scrollToClassStepTargetOnDesktop();
    if (shouldScrollToSubrace || shouldScrollToRaceDetails) scrollToRaceStepTargetOnDesktop();
    return;
  }

  if (methodButton) {
    resetSkillSelections(appState.character);
    resetSpellSelections(appState.character);
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
    if (appState.wizardStepIndex === 0) {
      showView("home");
      return;
    }
    goToWizardStep(getPreviousStepIndex());
    return;
  }
  if (action === "continue") {
    if (wizardSteps[appState.wizardStepIndex].key === "class" && (!appState.character.classId || !hasCompleteClassFeatureChoices(appState.character))) return;
    if (wizardSteps[appState.wizardStepIndex].key === "race" && !hasCompleteRaceSelection(appState.character)) return;
    if (wizardSteps[appState.wizardStepIndex].key === "background" && !hasCompleteBackgroundChoices(appState.character)) return;
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
  if (action === "reset-step") {
    performResetCurrentStep();
    return;
  }
  if (action === "restart-builder") {
    restartCharacterCreation();
    return;
  }
  if (action === "randomize-class") {
    randomizeClassOnly();
    return;
  }
  if (action === "randomize-background") {
    randomizeBackgroundOnly();
    return;
  }
  if (action === "randomize-current") randomizeCurrentStep();
  if (action === "randomize-race") randomizeBaseRaceOnly();
  if (action === "randomize-secondary-race-choice") randomizeSecondaryRaceChoice();
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
  if (event.target.matches("[data-class-feature-select]")) {
    const groupId = event.target.dataset.classFeatureSelect;
    appState.character.classFeatures[groupId] = event.target.value;
    resetSkillSelections(appState.character);
    resetSpellSelections(appState.character);
    renderWizard();
    scrollToClassStepTargetOnMobile(getClassStepScrollTargetSelector(appState.character));
    scrollToClassStepTargetOnDesktop();
    return;
  }

  if (event.target.matches("[data-class-feature-extra]")) {
    const fieldId = event.target.dataset.classFeatureExtra;
    appState.character.classFeatures[fieldId] = event.target.value;
    resetSkillSelections(appState.character);
    resetSpellSelections(appState.character);
    renderWizard();
    const group = getClassFeatureGroupForExtraField(appState.character, fieldId);
    if (!group || hasCompleteClassFeatureGroup(appState.character, group)) {
      scrollToClassStepTargetOnMobile(getClassStepScrollTargetSelector(appState.character));
      scrollToClassStepTargetOnDesktop();
    }
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
  resetSpellSelections(appState.character);
  renderWizard();
});

wizardStep.addEventListener("input", (event) => {
  if (event.target.matches("[data-cleric-faith]")) {
    appState.character.classFeatures.clericFaith = event.target.value;
    saveProgress();
    updateUtilityBarState();
    renderPreview(livePreview, appState.character);
    return;
  }

  if (event.target.matches("[data-character-name]")) {
    appState.character.name = event.target.value;
    appState.confirmBlankName = false;
    wizardStep.querySelector(".blank-name-confirmation")?.remove();
    saveProgress();
    updateUtilityBarState();
    renderPreview(livePreview, appState.character);
    return;
  }

  if (event.target.matches("[data-background-detail]")) {
    const detailId = event.target.dataset.backgroundDetail;
    getBackgroundChoices(appState.character).details[detailId] = event.target.value;
    saveProgress();
    updateUtilityBarState();
    renderPreview(livePreview, appState.character);
    return;
  }

  if (event.target.matches("[data-personality-custom]")) {
    const field = event.target.dataset.personalityCustom;
    const entry = getFinishingTouches(appState.character).personality[field] || {};
    getFinishingTouches(appState.character).personality[field] = { ...entry, selected: "", custom: event.target.value, skipped: false, mode: "custom" };
    saveProgress();
    updateUtilityBarState();
    renderPreview(livePreview, appState.character);
  }
});

homeButton.addEventListener("click", restartCharacterCreation);
resetStepButton.addEventListener("click", performResetCurrentStep);
randomizeRestartButton.addEventListener("click", restartCharacterCreation);
completedRestartButton.addEventListener("click", restartCharacterCreation);
buildButton.addEventListener("click", () => startBuild());
randomizeButton.addEventListener("click", () => {
  appState.randomSetup = { abilityMethod: "standard-array", equipmentMethod: EQUIPMENT_METHODS.take };
  renderRandomSetupSelections();
  showView("randomize");
});
views.randomize.addEventListener("click", (event) => {
  const abilityButton = event.target.closest("[data-random-ability-method]");
  if (abilityButton) {
    appState.randomSetup.abilityMethod = abilityButton.dataset.randomAbilityMethod;
    renderRandomSetupSelections();
    return;
  }
  const equipmentButton = event.target.closest("[data-random-equipment-method]");
  if (equipmentButton) {
    appState.randomSetup.equipmentMethod = equipmentButton.dataset.randomEquipmentMethod;
    renderRandomSetupSelections();
  }
});
generateRandomButton.addEventListener("click", generateRandomCharacter);
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
  updateUtilityBarState();
}

initializeApp();












