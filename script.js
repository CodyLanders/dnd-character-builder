const wizardSteps = [
  { key: "class", title: "Pick Your Class", progress: "Step 1 of 5 - Class" },
  { key: "race", title: "Pick Your Race", progress: "Step 2 of 5 - Race" },
  { key: "background", title: "Pick Your Background", progress: "Step 3 of 5 - Background" },
  {
    key: "classFeature",
    title: "Choose Your Level 1 Class Feature",
    progress: "Step 4 of 5 - Level 1 Class Feature",
  },
  { key: "abilities", title: "Assign Your Ability Scores", progress: "Step 5 of 5 - Ability Scores" },
];

const stepGuidance = {
  class:
    `Your class is your character’s main job in the party. It determines how you are trained to handle danger, the weapons and armor you can use, your starting equipment, and the abilities you bring into combat.

When choosing a class, think about:
• How you want to fight or help the group
• Whether you prefer armor, weapons, speed, or special techniques
• What role sounds most fun to play at the table

You will make more choices later, but your class is the foundation for how your character works.`,
  classFeature:
    "Some classes make an important choice at level 1. This choice helps define how your character plays and is separate from a subclass, which may come later.",
  race:
    "Your race gives your character traits that can affect ability scores, movement, senses, and other special abilities. Choose the option that best fits the character you want to play.",
  background:
    "Your background explains what your character did before adventuring. It provides skills, tools or languages, starting equipment, and a roleplaying hook.",
};

const appState = {
  wizardStepIndex: 0,
  character: createBlankCharacter(),
};

const views = {
  home: document.querySelector("#homeView"),
  build: document.querySelector("#buildView"),
  preview: document.querySelector("#previewView"),
};

const homeButton = document.querySelector("#homeButton");
const buildButton = document.querySelector("#buildButton");
const randomizeButton = document.querySelector("#randomizeButton");
const editRandomButton = document.querySelector("#editRandomButton");
const wizardStep = document.querySelector("#wizardStep");
const livePreview = document.querySelector("#livePreview");
const randomPreview = document.querySelector("#randomPreview");

function createBlankCharacter() {
  return {
    name: "",
    level: 1,
    rulesVersion: "2014 PHB starter",
    classId: "",
    raceId: "",
    backgroundId: "",
    classFeatures: {
      fightingStyle: "",
    },
    skillProficiencies: {},
    classSkillProficiencies: {},
    expertise: {},
    savingThrowProficiencies: {},
    savingThrowExpertise: {},
    baseAbilities: DND_DATA.abilities.reduce((scores, ability) => {
      scores[ability] = "";
      return scores;
    }, {}),
    abilities: DND_DATA.abilities.reduce((scores, ability) => {
      scores[ability] = "";
      return scores;
    }, {}),
    equipment: [],
    notes: "Stage 1 wizard character",
  };
}

function getById(collection, id) {
  return collection.find((item) => item.id === id);
}

function showView(viewName) {
  Object.values(views).forEach((view) => view.classList.add("hidden"));
  views[viewName].classList.remove("hidden");
  homeButton.classList.toggle("hidden", viewName === "home");
}

function abilityModifier(score) {
  if (score === "") {
    return "";
  }

  const modifier = Math.floor((score - 10) / 2);
  if (modifier === 0) {
    return "";
  }

  return modifier >= 0 ? `+${modifier}` : String(modifier);
}

function abilityModifierValue(score) {
  const safeScore = score === "" || score === undefined || score === null ? 10 : score;
  return Math.floor((safeScore - 10) / 2);
}

function formatSignedModifier(value) {
  if (value === 0) {
    return "";
  }

  return value > 0 ? `+${value}` : String(value);
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

function hasAnyRaceAbilityBonus(race) {
  return Object.values(getRaceAbilityBonuses(race)).some((bonus) => bonus !== 0);
}

function formatRaceAbilityBonus(bonus) {
  return bonus > 0 ? `+${bonus} (Racial Bonus)` : `${bonus} (Racial Bonus)`;
}

function raceAbilityMarker(bonus) {
  return bonus > 0 ? "*".repeat(bonus) : "";
}

function renderAbilityScoresTable(character, race) {
  return `
    <h3>Ability Scores</h3>
    <table class="ability-table">
      <thead>
        <tr>
          <th>Ability</th>
          <th>Score</th>
          <th>Modifier</th>
        </tr>
      </thead>
      <tbody>
        ${DND_DATA.abilities
          .map((ability) => {
            const score = character.abilities[ability];
            const hasAssignedScore = hasAssignedAbilityScore(character, ability);
            const racialBonus = getRaceAbilityBonus(race, ability);
            const abilityDisplay = `${ability}${raceAbilityMarker(racialBonus)}`;
            const scoreDisplay = hasAssignedScore
              ? `${score}`
              : racialBonus
                ? formatRaceAbilityBonus(racialBonus)
                : "";

            return `
              <tr>
                <td>${abilityDisplay}</td>
                <td>${scoreDisplay}</td>
                <td>${hasAssignedScore ? abilityModifier(score) : ""}</td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
    <div class="table-note racial-bonus-legend">
      <p>Racial Ability Score Bonus:</p>
      <p>* = +1</p>
      <p>** = +2</p>
    </div>
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
  if (equipment.includes("Chain mail")) {
    return { name: "Chain mail", baseAc: 16, usesDex: false, isArmor: true };
  }

  if (equipment.includes("Leather armor")) {
    return { name: "Leather armor", baseAc: 11, usesDex: true, isArmor: true };
  }

  return { name: "None", baseAc: 10, usesDex: true, isArmor: false };
}

function calculateArmorClass(character) {
  const armor = getArmorInfo(character.equipment);
  const shieldBonus = character.equipment.includes("Shield") ? 2 : 0;
  const defenseBonus = character.classFeatures.fightingStyle === "defense" && armor.isArmor ? 1 : 0;
  const dexBonus = armor.usesDex ? abilityModifierValue(character.abilities.Dexterity) : 0;

  return {
    total: armor.baseAc + dexBonus + shieldBonus + defenseBonus,
    defenseBonus,
  };
}

function getProficiencyBonus(character) {
  return character.level >= 1 ? 2 : 0;
}

function normalizeSkillSource(source, defaultLevel = 1) {
  if (!source) {
    return {};
  }

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
  if (level >= 2) {
    return "✓✓";
  }

  if (level === 1) {
    return "✓";
  }

  return "";
}

function renderSavingThrowsTable(character, characterClass) {
  const proficiencyBonus = getProficiencyBonus(character);
  const savingThrowLevels = getSavingThrowProficiencyLevels(character, characterClass);

  return `
    <h3>Saving Throws</h3>
    <table class="preview-table saving-throws-table">
      <thead>
        <tr>
          <th>Proficiency</th>
          <th>Ability</th>
          <th>Modifier</th>
        </tr>
      </thead>
      <tbody>
        ${DND_DATA.abilities
          .map((ability) => {
            const level = savingThrowLevels[ability] || 0;
            const hasAssignedScore = hasAssignedAbilityScore(character, ability);
            const abilityContribution = hasAssignedScore ? abilityModifierValue(character.abilities[ability]) : 0;
            const modifier = abilityContribution + proficiencyBonus * level;

            return `
              <tr>
                <td>${proficiencyMark(level)}</td>
                <td>${ability}</td>
                <td>${level || hasAssignedScore ? formatSignedModifier(modifier) : ""}</td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `;
}

function renderSkillsTable(character, race, background) {
  const proficiencyBonus = getProficiencyBonus(character);
  const skillLevels = getSkillProficiencyLevels(character, race, background);

  return `
    <h3>Skills</h3>
    <table class="preview-table skills-table">
      <thead>
        <tr>
          <th>Proficiency</th>
          <th>Skill</th>
          <th>Modifier</th>
          <th>Base Ability</th>
        </tr>
      </thead>
      <tbody>
        ${DND_DATA.skills
          .map((skill) => {
            const level = skillLevels[skill.name] || 0;
            const hasAssignedScore = hasAssignedAbilityScore(character, skill.ability);
            const abilityContribution = hasAssignedScore ? abilityModifierValue(character.abilities[skill.ability]) : 0;
            const modifier = abilityContribution + proficiencyBonus * level;

            return `
              <tr>
                <td>${proficiencyMark(level)}</td>
                <td>${skill.name}</td>
                <td>${level || hasAssignedScore ? formatSignedModifier(modifier) : ""}</td>
                <td>${DND_DATA.abilityShortLabels[skill.ability]}</td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `;
}

function recomputeCharacter() {
  appState.character.equipment = appState.character.classId
    ? DND_DATA.getStarterEquipment(appState.character.classId)
    : [];
  appState.character.abilities = DND_DATA.applyRaceIncreases(
    appState.character.baseAbilities,
    appState.character.raceId
  );

  if (appState.character.classId !== "fighter") {
    appState.character.classFeatures.fightingStyle = "";
  }
}

function renderPreview(container, character) {
  const characterClass = getById(DND_DATA.classes, character.classId);
  const race = getById(DND_DATA.races, character.raceId);
  const background = getById(DND_DATA.backgrounds, character.backgroundId);
  const fightingStyle = getSelectedFightingStyle(character);
  const armorClass = calculateArmorClass(character);

  container.innerHTML = `
    <div class="sheet-grid">
      <div class="sheet-item">
        <span class="sheet-label">Name</span>
        ${character.name || "Unnamed Hero"}
      </div>
      <div class="sheet-item">
        <span class="sheet-label">Level</span>
        ${character.level}
      </div>
      <div class="sheet-item">
        <span class="sheet-label">Class</span>
        ${characterClass ? characterClass.name : "Not selected"}
      </div>
      <div class="sheet-item">
        <span class="sheet-label">Race</span>
        ${race ? race.name : "Not selected"}
      </div>
      <div class="sheet-item">
        <span class="sheet-label">Background</span>
        ${background ? background.name : "Not selected"}
      </div>
      <div class="sheet-item">
        <span class="sheet-label">Hit Die</span>
        ${characterClass ? `d${characterClass.hitDie}` : "Not selected"}
      </div>
      <div class="sheet-item">
        <span class="sheet-label">Armor Class</span>
        ${armorClass.total}${armorClass.defenseBonus ? " (Defense +1)" : ""}
      </div>
      <div class="sheet-item">
        <span class="sheet-label">Level 1 Feature</span>
        ${fightingStyle ? `Fighting Style: ${fightingStyle.name}` : "Not selected"}
      </div>
    </div>

    ${renderAbilityScoresTable(character, race)}

    ${renderSavingThrowsTable(character, characterClass)}
    ${renderSkillsTable(character, race, background)}

    <h3>Starter Equipment</h3>
    <ul class="plain-list">
      ${
        character.equipment.length
          ? character.equipment.map((item) => `<li>${item}</li>`).join("")
          : "<li>Choose a class first.</li>"
      }
    </ul>
  `;
}

function optionCard(option, selectedId, type, detail = "", extraClass = "") {
  const isSelected = selectedId === option.id;

  return `
    <button
      class="option-card ${extraClass} ${isSelected ? "selected" : ""}"
      type="button"
      data-option-type="${type}"
      data-option-id="${option.id}"
      aria-pressed="${isSelected}"
    >
      <strong>${option.name}</strong>
      ${detail ? `<span>${detail}</span>` : ""}
    </button>
  `;
}

function guidancePanel(text) {
  return `<div class="guidance-panel">${text}</div>`;
}

function defaultClassGuidancePanel() {
  return `
    <div class="class-info-panel">
      <p>Your class is your character’s main job in the party. It determines how you are trained to handle danger, the weapons and armor you can use, your starting equipment, and the abilities you bring into combat.</p>
      <p>When choosing a class, think about:</p>
      <p class="guidance-bullet">• How you want to fight or help the group</p>
      <p class="guidance-bullet">• Whether you prefer armor, weapons, speed, or special techniques</p>
      <p class="guidance-bullet">• What role sounds most fun to play at the table</p>
      <p>You will make more choices later, but your class is the foundation for how your character works.</p>
    </div>
  `;
}

function classInfoPanel(characterClass) {
  if (!characterClass) {
    return defaultClassGuidancePanel();
  }

  return `
    <div class="class-info-panel selected">
      <p>${characterClass.detail}</p>
      <div class="proficiency-block">
        <h3>Proficiencies</h3>
        <div class="proficiency-list">
          ${Object.entries(characterClass.proficiencyDetails)
            .map(
              ([label, value]) => `
                <p><strong>${label}:</strong> ${value}</p>
              `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

function renderClassStep(step) {
  const canContinue = Boolean(appState.character.classId);
  const selectedClass = getById(DND_DATA.classes, appState.character.classId);

  wizardStep.innerHTML = `
    <p class="progress-text">${step.progress}</p>
    <h2>${step.title}</h2>
    ${classInfoPanel(selectedClass)}
    <div class="option-grid">
      ${DND_DATA.classes
        .map((option) =>
          optionCard(option, appState.character.classId, "class", option.cardDescription, "class-option-card")
        )
        .join("")}
    </div>
    <div class="wizard-actions">
      <button class="secondary-button" type="button" data-action="randomize-current">Randomize</button>
      <button class="primary-button" type="button" data-action="continue" ${canContinue ? "" : "disabled"}>Continue</button>
    </div>
  `;
}

function renderChoiceStep(step, options, selectedId, type, detailForOption) {
  const canContinue = Boolean(selectedId);

  wizardStep.innerHTML = `
    <p class="progress-text">${step.progress}</p>
    <h2>${step.title}</h2>
    ${guidancePanel(stepGuidance[step.key])}
    <div class="option-grid">
      ${options.map((option) => optionCard(option, selectedId, type, detailForOption(option))).join("")}
    </div>
    <div class="wizard-actions">
      ${appState.wizardStepIndex > 0 ? '<button class="secondary-button" type="button" data-action="back">Back</button>' : ""}
      <button class="secondary-button" type="button" data-action="randomize-current">Randomize</button>
      <button class="primary-button" type="button" data-action="continue" ${canContinue ? "" : "disabled"}>Continue</button>
    </div>
  `;
}

function renderClassFeatureStep(step) {
  const choice = getClassFeatureChoice(appState.character);

  if (!choice) {
    appState.wizardStepIndex = getNextStepIndex();
    renderWizard();
    return;
  }

  const selectedId = appState.character.classFeatures[choice.id];
  const canContinue = Boolean(selectedId);

  wizardStep.innerHTML = `
    <p class="progress-text">${step.progress}</p>
    <h2>${step.title}</h2>
    ${guidancePanel(stepGuidance.classFeature)}
    <h3>${choice.title}</h3>
    <div class="option-grid">
      ${choice.options.map((option) => optionCard(option, selectedId, choice.id)).join("")}
    </div>
    <div class="wizard-actions">
      <button class="secondary-button" type="button" data-action="back">Back</button>
      <button class="secondary-button" type="button" data-action="randomize-current">Randomize</button>
      <button class="primary-button" type="button" data-action="continue" ${canContinue ? "" : "disabled"}>Continue</button>
    </div>
  `;
}

function getUsedScores(exceptAbility = "") {
  return DND_DATA.abilities
    .filter((ability) => ability !== exceptAbility)
    .map((ability) => Number(appState.character.baseAbilities[ability]))
    .filter(Boolean);
}

function renderAbilityStep(step) {
  const usedScores = getUsedScores();
  const availableScores = DND_DATA.standardArray.filter((score) => !usedScores.includes(score));
  const isComplete = hasValidAbilityAssignments();

  wizardStep.innerHTML = `
    <p class="progress-text">${step.progress}</p>
    <h2>${step.title}</h2>
    <div class="available-scores">
      Available scores:
      ${
        availableScores.length
          ? availableScores.map((score) => `<span class="score-pill">${score}</span>`).join("")
          : '<span class="score-pill">None</span>'
      }
    </div>
    <div class="ability-controls">
      ${DND_DATA.abilities
        .map((ability) => {
          const selectedScore = appState.character.baseAbilities[ability];
          const blockedScores = getUsedScores(ability);

          return `
            <label>
              ${ability}
              <select data-ability="${ability}">
                <option value="">Choose score</option>
                ${DND_DATA.standardArray
                  .map((score) => {
                    const isSelected = Number(selectedScore) === score;
                    const isDisabled = blockedScores.includes(score);
                    return `<option value="${score}" ${isSelected ? "selected" : ""} ${
                      isDisabled ? "disabled" : ""
                    }>${score}</option>`;
                  })
                  .join("")}
              </select>
            </label>
          `;
        })
        .join("")}
    </div>
    <div class="wizard-actions">
      <button class="secondary-button" type="button" data-action="back">Back</button>
      <button class="secondary-button" type="button" data-action="randomize-abilities">Randomize Ability Scores</button>
      <button class="primary-button" type="button" data-action="finish" ${isComplete ? "" : "disabled"}>Finish Character</button>
    </div>
  `;
}

function renderWizard() {
  const step = wizardSteps[appState.wizardStepIndex];
  recomputeCharacter();
  renderPreview(livePreview, appState.character);

  if (step.key === "class") {
    renderClassStep(step);
  }

  if (step.key === "race") {
    renderChoiceStep(step, DND_DATA.races, appState.character.raceId, "race", (item) => item.traits.slice(0, 2).join(", "));
  }

  if (step.key === "background") {
    renderChoiceStep(
      step,
      DND_DATA.backgrounds,
      appState.character.backgroundId,
      "background",
      (item) => item.skills.join(", ")
    );
  }

  if (step.key === "classFeature") {
    renderClassFeatureStep(step);
  }

  if (step.key === "abilities") {
    renderAbilityStep(step);
  }
}

function startBuild(character = createBlankCharacter(), stepIndex = 0) {
  appState.character = character;
  appState.wizardStepIndex = stepIndex;
  renderWizard();
  showView("build");
}

function randomizeCharacter() {
  appState.character = DND_DATA.randomizeCharacter();
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

  if (currentKey === "background" && !getClassFeatureChoice(appState.character)) {
    return wizardSteps.findIndex((step) => step.key === "abilities");
  }

  return appState.wizardStepIndex + 1;
}

function getPreviousStepIndex() {
  const currentKey = wizardSteps[appState.wizardStepIndex].key;

  if (currentKey === "abilities" && !getClassFeatureChoice(appState.character)) {
    return wizardSteps.findIndex((step) => step.key === "background");
  }

  return appState.wizardStepIndex - 1;
}

function randomizeCurrentStep() {
  const step = wizardSteps[appState.wizardStepIndex];

  if (step.key === "class") {
    appState.character.classId = randomChoiceExcept(DND_DATA.classes, appState.character.classId).id;
  }

  if (step.key === "race") {
    appState.character.raceId = randomChoiceExcept(DND_DATA.races, appState.character.raceId).id;
  }

  if (step.key === "background") {
    appState.character.backgroundId = randomChoiceExcept(DND_DATA.backgrounds, appState.character.backgroundId).id;
  }

  if (step.key === "classFeature") {
    const choice = getClassFeatureChoice(appState.character);
    appState.character.classFeatures[choice.id] = randomChoiceExcept(
      choice.options,
      appState.character.classFeatures[choice.id]
    ).id;
  }

  renderWizard();
}

function randomizeAbilityScores() {
  const scores = [...DND_DATA.standardArray].sort(() => Math.random() - 0.5);

  DND_DATA.abilities.forEach((ability, index) => {
    appState.character.baseAbilities[ability] = scores[index];
  });

  recomputeCharacter();
  renderWizard();
}

function hasValidAbilityAssignments() {
  const scores = DND_DATA.abilities.map((ability) => Number(appState.character.baseAbilities[ability]));
  const uniqueScores = new Set(scores);

  return (
    scores.every((score) => DND_DATA.standardArray.includes(score)) &&
    uniqueScores.size === DND_DATA.standardArray.length
  );
}

function finishCharacter() {
  if (!hasValidAbilityAssignments()) {
    return;
  }

  recomputeCharacter();
  renderPreview(randomPreview, appState.character);
  showView("preview");
}

wizardStep.addEventListener("click", (event) => {
  const optionButton = event.target.closest("[data-option-id]");
  const actionButton = event.target.closest("[data-action]");

  if (optionButton) {
    const optionType = optionButton.dataset.optionType;
    const optionId = optionButton.dataset.optionId;

    if (optionType === "class") {
      appState.character.classId = appState.character.classId === optionId ? "" : optionId;
    }

    if (optionType === "race") {
      appState.character.raceId = appState.character.raceId === optionId ? "" : optionId;
    }

    if (optionType === "background") {
      appState.character.backgroundId = appState.character.backgroundId === optionId ? "" : optionId;
    }

    if (optionType === "fightingStyle") {
      appState.character.classFeatures.fightingStyle =
        appState.character.classFeatures.fightingStyle === optionId ? "" : optionId;
    }

    renderWizard();
    return;
  }

  if (!actionButton) {
    return;
  }

  const action = actionButton.dataset.action;

  if (action === "back") {
    appState.wizardStepIndex = getPreviousStepIndex();
    renderWizard();
  }

  if (action === "continue") {
    appState.wizardStepIndex = getNextStepIndex();
    renderWizard();
  }

  if (action === "randomize-current") {
    randomizeCurrentStep();
  }

  if (action === "randomize-abilities") {
    randomizeAbilityScores();
  }

  if (action === "finish") {
    finishCharacter();
  }
});

wizardStep.addEventListener("change", (event) => {
  if (!event.target.matches("[data-ability]")) {
    return;
  }

  appState.character.baseAbilities[event.target.dataset.ability] = event.target.value
    ? Number(event.target.value)
    : "";
  recomputeCharacter();
  renderWizard();
});

homeButton.addEventListener("click", () => showView("home"));
buildButton.addEventListener("click", () => startBuild());
randomizeButton.addEventListener("click", randomizeCharacter);
editRandomButton.addEventListener("click", () => startBuild(appState.character));

renderPreview(livePreview, appState.character);
