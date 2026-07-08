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

### v0.3.0 — July 8, 2026 — Starting Equipment & Armor Preview Polish
* Added starting equipment selection for supported classes.
* Added Initiative and Speed to the Character Preview.
* Improved the Character Preview layout with stronger visual grouping between major sections.
* Expanded equipment preview details for weapons, armor, tools, adventuring gear, and other equipment.
* Added an Armor & Defense section that explains the sources contributing to Armor Class.
* Added support for defensive class features such as Fighter Defense/Protection Fighting Style and Monk/Barbarian Unarmored Defense.
* Kept the final Armor Class value centralized in the Armor Class summary box while using Armor & Defense for beginner-friendly explanation.
