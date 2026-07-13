# D&D Character Builder

A mobile-friendly, web-based Dungeons & Dragons 5e character builder for creating level 1 characters through a guided step-by-step workflow.

# D&D Character Builder

A mobile-friendly, web-based Dungeons & Dragons 5e character builder for creating level 1 characters through a guided step-by-step workflow.

## Features

* Guided level 1 character creation for class, race, background, ability scores, skills, equipment, spells, and finishing touches
* Support for all 2014 PHB classes at level 1, including martial classes, prepared casters, known-spell casters, and Pact Magic
* Support for all 2014 PHB races and subraces, including required race choices, racial traits, racial spells, languages, senses, and randomization
* Support for all 13 base 2014 PHB backgrounds plus PHB background variants
* Background version handling for variants such as Spy, Gladiator, Guild Merchant, Knight, and Pirate
* Multiple ability-score methods, including Standard Array, rolled scores, Point Buy, rerolls, and random assignment support
* Skills & Proficiencies step with class skill choices, duplicate-proficiency prevention, replacement proficiency handling, and final skill bonus calculations
* Starting equipment choices, advanced rolled starting gold, equipment warnings, and optional trinkets
* Character Preview and final sheet with ability scores, saving throws, skills, armor class, initiative, speed, hit points, hit dice, passive perception, proficiencies, senses, languages, equipment, attacks, spells, traits, background details, and starting gold
* Armor & Defense explanation showing how Armor Class is calculated
* Attack Summary with weapon attack bonuses, damage bonuses, ability used, range, properties, and relevant class bonuses
* Spellcasting support with cantrips, known spells, prepared spells, spellbook spells, domain spells, patron spells, racial spells, spell slots, spell save DC, and spell attack bonus
* Organized preview sections for Attacks & Actions, Spells, Traits & Features, Proficiencies & Training, and Equipment Carried
* Expandable details for spells, traits, features, tools, kits, instruments, vehicles, equipment packs, carried gear, and background features
* Finishing Touches step with character name, alignment, required language/tool choices, background-specific roleplay suggestions, custom roleplay text, and optional trinkets
* Random character generation with support for class, race, background, variants, ability scores, skills, equipment, spells, and finishing-touch choices
* Autosave, browser save/load, refresh protection, and Restart flow
* Responsive mobile-friendly browser interface

## Built With

- HTML
- CSS
- JavaScript

## Project Evolution

### v0.8.0 — Randomize Controls, Utility Bar, and Class Step UX Polish — July 13, 2026
- Standardized local Randomize controls across the builder so section-level buttons randomize only their own choice while the bottom Randomize button continues to randomize the whole step.
- Improved mobile navigation after selections and randomization so the page guides users to the next required choice or the relevant details section without unnecessary desktop jumping.
- Renamed detail sections to cleaner labels: Race Details, Class Details, and Background Details.
- Added a top utility bar with Restart, Feedback, and Reset, while keeping the bottom sticky bar focused on Back, Randomize, and Continue/Finish.
- Added Reset as a current-step-only clearing action with confirmation, disabled states, and safer behavior that does not wipe the whole character.
- Added a Feedback button as a placeholder for the future feedback system.
- Polished Restart so it replaces the old Home behavior, returns users to the start page, and stays disabled until a character build has started.
- Consolidated level 1 class choices into the main Class step, removing the separate Class Choice step from the normal flow.
- Improved Class step flow so required class choices appear before Class Details, while skills, spells, equipment, tools, languages, and flavor choices remain in their dedicated steps.
- Added Class step randomize controls, including Randomize Class and Randomize Choice buttons for class-specific choices like Ranger options, Sorcerer origins, and Dragon Ancestor.
- Cleaned up class-choice UI with more compact Ranger options, beginner-friendly helper text, and smoother mobile behavior for multi-choice classes.
- Improved feature details for items like Fighting Style and Second Wind so they show useful selected-feature information instead of placeholder text.

### v0.7.2 — Complete PHB Backgrounds, Variants, and Final QA Polish — July 12, 2026
- Completed all 13 base 2014 PHB backgrounds by adding Charlatan, Entertainer, Guild Artisan, and Sailor with full skills, tools, languages, equipment, gold, features, required choices, optional details, randomization, autosave, preview, and final-sheet support.
- Added background-specific details such as false identities, stage names, routines, guild businesses, ship roles, and background feature text.
- Added all five PHB background variants: Spy, Gladiator, Guild Merchant, Knight, and Pirate.
- Added a Standard / Variant background version system while keeping the main Background grid clean at 13 cards.
- Built variants as structured parent-background overrides so they inherit the correct roleplay suggestions, randomization behavior, autosave support, and cleanup rules.
- Updated preview and final output to show the actual selected background or variant name.
- Improved background choice handling with field-level randomize buttons, duplicate prevention, source-aware cleanup, and better separation between tool proficiency and owned equipment.
- Added variant-specific support for Gladiator weapons, Guild Merchant trade details, Knight retainers, Spy aliases, and Pirate reputation details.
- Expanded Barbarian Rage details with its level 1 mechanics, including bonus action use, damage bonus, resistances, duration, restrictions, and ending conditions.
- Fixed Gladiator weapons so they appear correctly in Equipment Carried and Attack Summary without granting automatic proficiency.
- Added proper Net handling with range, restrained-target details, and no invented damage die.
- Renamed Knight support entries to Squire, Retainer 1, and Retainer 2 while preserving existing saved data.
- Confirmed final manual verification checks passed.

### v0.7.1 — Half-Elf, Background Expansion, and Proficiency Conflict Cleanup — July 12, 2026
- Strengthened the race and background systems overall so complex choices, replacement proficiencies, randomization, autosave, and final-sheet output behave more consistently.
- Added Half-Elf as a full race option, including flexible ability-score increases, Skill Versatility, extra language choice, racial trait cleanup, autosave support, and randomization support.
- Validated Human and Half-Orc against the newer race systems to confirm ability bonuses, racial traits, skills, languages, preview output, randomization, and state cleanup still work correctly.
- Redesigned the Race step with simpler comparison cards, cleaner required-choice behavior, mobile-friendly navigation, and a dynamic Selected Race Details section.
- Improved Ability Scores layout so Half-Elf flexible ability increases stay clearly separated from base score assignment and do not interfere with Random Assign.
- Added Acolyte, Sage, Noble, and Hermit backgrounds with full background data, required choices, equipment, starting gold, features, proficiencies, descriptions, and optional details.
- Expanded background roleplay support with background-specific Personality Trait, Ideal, Bond, and Flaw suggestion pools.
- Improved Finishing Touches so roleplay fields can use suggestions, custom text, or skipped values while preserving custom entries across background changes.
- Reworked the Background step into a cleaner flow with compact background cards, required background choices, full background details, field-level randomize buttons, and mobile-friendly navigation.
- Added proficiency conflict handling for duplicate fixed skills, tools, and languages, including replacement dropdowns, source-aware cleanup, field-level randomize, and support for multiple conflicts.
- Simplified duplicate-proficiency replacement UI so conflicts are easier to understand without oversized cards or repeated warnings.
- Updated Character Preview and final output with new background features, proficiencies, languages, equipment, gold, specialties, optional details, and cleaner Alignment placement.
- Improved background and race cleanup so changing choices removes stale traits, equipment, gold, proficiencies, languages, and background-specific details while preserving valid autosaved selections.

### v0.7.0 — Race Polish, Preview Cleanup, and Expandable Details — July 12, 2026
- Improved race selection with cleaner required-choice handling, mobile-friendly scrolling, and dedicated randomize controls for races, subraces, and Dragonborn ancestry.
- Cleaned up race-change behavior so incompatible traits, spells, proficiencies, resistances, and ancestry choices reset correctly.
- Improved racial spell handling by combining racial and class cantrips under one Cantrips section, adding Racial Spell tags, and preserving each spell’s correct source and casting ability.
- Reorganized the Character Preview so compact stats, skills, proficiencies, languages, attacks, spells, traits, features, and equipment are easier to scan.
- Separated tool proficiency from physical tool ownership, with clearer section-level guidance and expandable details for tools, kits, instruments, gaming sets, and vehicles.
- Added an Equipment Carried section for physical items, including expandable pack contents and clearer distinction between owned gear and trained proficiencies.
- Refined traits and features so passive traits use compact expandable rows while attacks, spells, Breath Weapon, and active-use features remain full cards.
- Fixed expandable feature behavior, including Warding Flare loading collapsed and View/Hide details working without changing character state or causing unexpected scrolling.
- Kept spellcasting summaries inside the Spells section while preserving spellcasting ability, save DC, attack bonus, slots, cantrip counts, prepared spell counts, and class-specific spell notes.
- Preserved existing race, class, spell, proficiency, attack, armor, equipment, autosave, randomization, and final-sheet behavior while improving mobile and keyboard usability.

### v0.6.0 — Sorcerer Validation and Warlock Pact Magic — July 11, 2026
- Validated Sorcerer as a complete level 1 class, including Draconic Bloodline, Wild Magic, Charisma-based spellcasting, and known-spell selection.
- Added and validated Warlock as a complete level 1 class with Archfey, Fiend, and Great Old One patron choices.
- Added Warlock Pact Magic with cantrips, known spells, a level 1 Pact Magic slot, and short-rest recovery guidance.
- Polished Warlock spell selection so patron expanded spells appear first, are clearly tagged, and behave as additional options rather than free spells.
- Added Warlock starting equipment, arcane focus choices, final sheet support, and randomize support.
- Confirmed the broader spellcasting system still works across Bard, Wizard, Cleric, Druid, Sorcerer, and Warlock.

### v0.5.2 — Bard Spellcasting, Wizard Preparation, and Sorcerer Start — July 10, 2026
- Added Bard as a selectable level 1 class.
- Added Bard skill selection with support for choosing any 3 skills.
- Added Bard musical instrument proficiencies through Finishing Touches.
- Added a separate Bard owned instrument choice in Starting Equipment.
- Added Bardic Inspiration as a level 1 class feature.
- Added Bard spellcasting as a known-spells caster.
- Added Bard cantrip selection and level 1 known spell selection.
- Confirmed Bard chooses 2 cantrips and 4 level 1 known spells.
- Confirmed Bard does not use prepared-spell wording.
- Confirmed Bard College and later Bard features do not appear at level 1.
- Clarified spellcasting behavior across known-spell and prepared-spell classes.
- Added Wizard prepared spell selection from selected spellbook spells.
- Added inline Prepare/Prepared toggles on selected Wizard spellbook spell cards.
- Improved Wizard prepared spell guidance and prepared-spell progress text.
- Clarified final sheet spell sections for prepared spells, known spells, cantrips, and unprepared spellbook spells.
- Started Sorcerer implementation as the next known-spells class.
- Added initial Sorcerer support for Sorcerous Origin, Draconic Bloodline, Wild Magic, known spells, cantrips, starting equipment, and randomize behavior.
- Left Sorcerer for follow-up validation and refinement.

### v0.5.1 — Druid Spellcasting and Ability Score Dropdown Cleanup — July 10, 2026
- Added Druid as a selectable level 1 class.
- Added Druid skills, proficiencies, class features, starting equipment, and starting gold support.
- Added Druidic as both a class feature and language.
- Added Druid spellcasting using the existing reusable spell selection system.
- Added Druid cantrip selection and level 1 prepared spell support.
- Added Druid cantrips and level 1 Druid spell data.
- Added Druid starting equipment, including leather armor, explorer’s pack, weapon choices, and Druidic Focus choice.
- Improved Druidic Focus descriptions so users understand it is used for spellcasting.
- Limited Druid simple weapon dropdowns to weapons Druids are proficient with.
- Confirmed Wild Shape and Druid Circle do not appear at level 1.
- Updated rolled ability score dropdowns so assigned rolls disappear from the other ability dropdowns.
- Updated Standard Array dropdowns to hide already-used scores from other ability dropdowns.
- Kept each ability dropdown’s current selection visible while hiding used scores from the other abilities.
- Preserved Point Buy, randomize, and restart behavior.

### v0.5.0 — Cleric Domains, Spellcasting, and Domain-Based Choices — July 10, 2026
- Added Cleric as a selectable class.
- Added Divine Domain selection with all 7 PHB Cleric domains.
- Cleaned up Divine Domain names for better display.
- Added optional Deity, Faith, or Philosophy support for Cleric flavor.
- Added Cleric spell selection support.
- Added Cleric cantrip, prepared spell, and domain spell handling.
- Added automatic Light cantrip support for the Light Domain.
- Added Nature Domain bonus skill and bonus Druid cantrip support.
- Added Knowledge Domain bonus skills and bonus languages.
- Added domain-based proficiency handling for Heavy Armor where appropriate.
- Added domain-based Martial Weapon proficiency for Tempest and War domains.
- Updated conditional equipment so Cleric only shows valid domain-based options.
- Updated random character generation to support Cleric domain mechanics.
- Updated the final sheet to show Cleric features, proficiencies, equipment, spells, and domain choices correctly.

### v0.4.3 — Paladin, Ranger, and Class Choice Preview Cleanup — July 9, 2026
- Added Paladin as a selectable level 1 class.
- Added Ranger as a selectable level 1 class.
- Confirmed Paladin and Ranger remain non-spellcasting at level 1.
- Added Paladin skills, proficiencies, class features, starting equipment, and starting gold support.
- Added Ranger skills, proficiencies, class features, starting equipment, and starting gold support.
- Added required Ranger choices for Favored Enemy and Natural Explorer.
- Added Humanoid Favored Enemy support with two humanoid race choices.
- Updated Character Preview to show separate numbered Class Choice cards.
- Added separate Ranger preview cards for Favored Enemy and Natural Explorer.
- Improved Humanoid Favored Enemy display, such as `Humanoids — Goblins and Orcs`.
- Kept Fighter showing one Class Choice card for Fighting Style.
- Prevented fixed-feature classes like Paladin and Wizard from showing unnecessary Class Choice cards.
- Confirmed validation checks passed.

### v0.4.2 — Friend Feedback, Rerolls, Starting Gold, and Trinkets — July 9, 2026
- Added reroll support for rolled ability scores.
- Added visible reroll attempt tracking for rolled ability scores.
- Added an advanced Roll Starting Gold equipment method.
- Kept Take Starting Equipment as the recommended beginner equipment path.
- Added starting gold reroll support and reroll attempt tracking.
- Added a manual-equipment warning when rolled starting gold is used.
- Added an optional trinket roll/picker to Finishing Touches.
- Kept trinkets blank by default so they remain fully optional.
- Excluded trinkets from the main Finishing Touches Randomize button.
- Avoided adding a full equipment shop or inventory builder for now.

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

### v0.4.0 — Final Sheet Polish, Restart Flow, and Character Basics — July 9, 2026
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
