# D&D Character Builder

An interactive web-based Dungeons & Dragons character builder that guides users through core character-creation choices and displays the resulting character details.

## Features
* Guided character creation workflow
* Race, class, background, level 1 feature, and ability-score selection
* Starting equipment choices for Fighter, Barbarian, Rogue, and Monk
* Character Preview with ability scores, saving throws, skills, armor class, initiative, speed, and equipment
* Armor & Defense explanation showing how the current Armor Class is being sourced
* Racial ability-score bonuses shown beside affected abilities
* Clear bonus legend available throughout the builder
* Responsive browser-based interface

## Built With
- HTML
- CSS
- JavaScript

## Project Evolution

### v0.4.1 — Wizard Spellcasting, Spell Cards, and Blank-Name Confirmation Polish — July 9, 2026
- Added the level 1 spellcasting foundation for spellcasting classes.
- Added Wizard as the first selectable spellcasting class.
- Added Wizard cantrip selection.
- Added Wizard level 1 spellbook spell selection.
- Added Wizard spell cards using the same card-style pattern as weapon cards.
- Added spell quick info for Level, School, Range, and Casting Time.
- Added expandable spell details for deeper spell information.
- Added spell components display, including material component details where required.
- Removed unnecessary visible selected-state text from spell cards.
- Added selected cantrips and selected spellbook spells to the final character sheet.
- Added a Wizard prepared-spell note instead of requiring prepared spell selection in v1.
- Added Wizard spellcasting basics to the final sheet, including Intelligence casting, spell slots, spell save DC, and spell attack bonus.
- Preserved non-spellcaster behavior by hiding spellcasting sections when they do not apply.
- Planned Wizard class UX around the existing builder flow without adding extra steps.
- Confirmed Wizard skills, proficiencies, starting equipment, and Arcane Recovery display cleanly for users.
- Added a Wizard-focused test checklist for selection, randomize, equipment, final sheet display, and restart behavior.
- Moved the blank-name finish confirmation near the top of the Finishing Touches step.
- Added scroll-to-top behavior when the blank-name confirmation appears.
- Kept Character Name optional while still requiring confirmation before finishing without one.

### v0.4.0 — Final Sheet Polish, Restart Flow, and Character Basics — July 8, 2026
- Added level 1 Hit Points using maximum class Hit Die plus Constitution modifier.
- Added Hit Dice, Passive Perception, and Proficiency Bonus to the final character sheet.
- Added Senses, including Darkvision where applicable.
- Added Languages, Tool Proficiencies, Armor Proficiencies, and Weapon Proficiencies to the final sheet.
- Improved final-sheet capitalization for values like Medium Armor, Shields, Simple Weapons, Martial Weapons, Disguise Kit, and Thieves’ Tools.
- Cleaned up optional Background Details so blank roleplay fields no longer show empty rows.
- Added simple background-based Starting Gold support using `startingGoldGp`.
- Added Starting Gold display to the final sheet while keeping gold separate from equipment.
- Kept gold shopping, buying/selling, and gold-instead-of-equipment flows out of v1 scope.
- Kept HP rolling out of v1 because it belongs with a future level-up system.
- Updated Restart behavior so it clears the current character and returns to the start page.
- Improved navigation behavior so continuing to the next step scrolls back to the top of the page.

### v0.3.2 — July 8, 2026 — Skills, Proficiencies, and Finishing Touches
- Added a dedicated Skills & Proficiencies step after Ability Scores.
- Added class skill selection with duplicate-proficiency prevention.
- Displayed race and background skill proficiencies as already-proficient skills.
- Added final skill bonus calculations using ability modifiers and proficiency bonus.
- Improved the skill-selection UI with mobile-friendly cards, clearer selected states, and better max-selection handling.
- Added a Finishing Touches step for remaining character-completion choices.
- Added support for required language and tool choices, including artisan tools, gaming sets, instruments, vehicles, and miscellaneous tools.
- Added optional character details including Character Name, Alignment, Personality Trait, Ideal, Bond, and Flaw.
- Added inline picker panels to replace long dropdowns for better mobile usability.
- Added Randomize support for Finishing Touches.
- Added a soft confirmation when finishing with a blank character name.
- Kept optional roleplay fields skippable while ensuring required language/tool choices must be completed before finishing.

### v0.3.1 — July 8, 2026 — UI Polish, Mobile UX, and Save Protection
- Reworked parts of the Character Preview UI to be easier to read and less table-heavy.
- Converted weapon/combat output from dense tables into cleaner card-style displays where appropriate.
- Improved beginner-facing action details so attacks and combat options are easier to understand at a glance.
- Refined spacing, labels, and section structure across the preview to make the page feel more polished.
- Improved mobile usability across the character builder workflow.
- Refined ability-score and Point Buy layouts for smaller screens.
- Adjusted Point Buy controls so buttons, numbers, and labels align more cleanly.
- Clarified random ability-score assignment language with the “Random Assign” label.
- Added autosave behavior so character-building progress can survive refreshes.
- Added refresh protection to reduce the chance of accidentally losing progress.
- Added future polish notes for improving horizontal mobile scrolling and replacing the Home button with a clearer Restart action.

### v0.3.0 — July 8, 2026 — Starting Equipment & Armor Preview Polish
* Added starting equipment selection for supported classes.
* Added Initiative and Speed to the Character Preview.
* Improved the Character Preview layout with stronger visual grouping between major sections.
* Expanded equipment preview details for weapons, armor, tools, adventuring gear, and other equipment.
* Added an Armor & Defense section that explains the sources contributing to Armor Class.
* Added support for defensive class features such as Fighter Defense/Protection Fighting Style and Monk/Barbarian Unarmored Defense.
* Kept the final Armor Class value centralized in the Armor Class summary box while using Armor & Defense for beginner-friendly explanation.
* Added an Attack Summary that calculates weapon attack bonuses, damage bonuses, attack ability, range, and relevant fighting-style bonuses.

### July 7, 2026 — Ability Score Methods & Beginner Guidance
- Added three ability-score assignment methods:
  - Standard Array
  - Roll 4d6, Drop Lowest
  - 27-point Point Buy
- Added a random-character flow with separate rolled-score and Standard Array options.
- Added Point Buy controls that show:
  - Racial-adjusted displayed scores
  - Ability modifiers
  - Point cost or refund for each score adjustment
  - Remaining Point Buy points
- Added racial-bonus indicators to help distinguish final scores from pre-racial Point Buy scores.
- Added Ability Score Guidance that summarizes the selected character build and explains recommended primary and secondary abilities.
- Added beginner-focused equipment notes, such as how armor and weapon choices interact with ability scores.
- Improved mobile layouts for Standard Array, rolled scores, and Point Buy.
- Kept the Character Preview stable while users switch ability-score methods or make score selections.

### July 6, 2026 — Ability Score Clarity & GitHub Publishing
- Published the D&D Character Builder as a standalone public GitHub project.
- Preserved the existing Ability Score dropdown workflow so users can continue assigning scores the same way.
- Added racial ability-score bonus indicators directly beside the relevant ability names.
- Used one asterisk for each racial bonus point:
  - `*` = +1 bonus
  - `**` = +2 bonus
- Kept the racial bonus legend visible throughout the character-building process rather than only after race selection.
- Simplified the legend into one compact line:  
  `Racial Ability Score Bonus: Number of * indicates bonus points to that ability.`
