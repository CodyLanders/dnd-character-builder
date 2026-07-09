window.DND_DATA = window.DND_DATA || {};

DND_DATA.supportedSpellSelectionClasses = ["wizard"];

DND_DATA.spellSelectionRules = {
  wizard: {
    cantrips: 3,
    spellbookSpells: 6,
  },
};

DND_DATA.spells = [
  { id: "acid-splash", name: "Acid Splash", level: 0, school: "Conjuration", castingTime: "1 action", range: "60 ft.", components: "V, S", duration: "Instantaneous", concentration: false, ritual: false, summary: "Hurl acid at one or two nearby creatures.", classLists: ["wizard"] },
  { id: "blade-ward", name: "Blade Ward", level: 0, school: "Abjuration", castingTime: "1 action", range: "Self", components: "V, S", duration: "1 round", concentration: false, ritual: false, summary: "Briefly protect yourself against weapon damage.", classLists: ["wizard"] },
  { id: "chill-touch", name: "Chill Touch", level: 0, school: "Necromancy", castingTime: "1 action", range: "120 ft.", components: "V, S", duration: "1 round", concentration: false, ritual: false, summary: "A ghostly hand harms a creature and hinders healing.", classLists: ["wizard"] },
  { id: "dancing-lights", name: "Dancing Lights", level: 0, school: "Evocation", castingTime: "1 action", range: "120 ft.", components: "V, S, M", material: "A bit of phosphorus or wychwood, or a glowworm", duration: "1 minute", concentration: true, ritual: false, summary: "Create small moving lights to illuminate an area.", classLists: ["wizard"] },
  { id: "fire-bolt", name: "Fire Bolt", level: 0, school: "Evocation", castingTime: "1 action", range: "120 ft.", components: "V, S", duration: "Instantaneous", concentration: false, ritual: false, summary: "Launch a bolt of fire at a creature or object.", classLists: ["wizard"] },
  { id: "friends", name: "Friends", level: 0, school: "Enchantment", castingTime: "1 action", range: "Self", components: "S, M", material: "A small amount of makeup applied as the spell is cast", duration: "1 minute", concentration: true, ritual: false, summary: "Gain a short-lived edge on Charisma checks with one creature.", classLists: ["wizard"] },
  { id: "light", name: "Light", level: 0, school: "Evocation", castingTime: "1 action", range: "Touch", components: "V, M", material: "A firefly or phosphorescent moss", duration: "1 hour", concentration: false, ritual: false, summary: "Make an object shine bright light.", classLists: ["wizard"] },
  { id: "mage-hand", name: "Mage Hand", level: 0, school: "Conjuration", castingTime: "1 action", range: "30 ft.", components: "V, S", duration: "1 minute", concentration: false, ritual: false, summary: "Create a floating hand that can manipulate small objects.", classLists: ["wizard"] },
  { id: "mending", name: "Mending", level: 0, school: "Transmutation", castingTime: "1 minute", range: "Touch", components: "V, S, M", material: "Two lodestones", duration: "Instantaneous", concentration: false, ritual: false, summary: "Repair a small break or tear in an object.", classLists: ["wizard"] },
  { id: "message", name: "Message", level: 0, school: "Transmutation", castingTime: "1 action", range: "120 ft.", components: "V, S, M", material: "A short piece of copper wire", duration: "1 round", concentration: false, ritual: false, summary: "Whisper a private message to a creature at range.", classLists: ["wizard"] },
  { id: "minor-illusion", name: "Minor Illusion", level: 0, school: "Illusion", castingTime: "1 action", range: "30 ft.", components: "S, M", material: "A bit of fleece", duration: "1 minute", concentration: false, ritual: false, summary: "Create a small sound or image as a simple illusion.", classLists: ["wizard"] },
  { id: "poison-spray", name: "Poison Spray", level: 0, school: "Conjuration", castingTime: "1 action", range: "10 ft.", components: "V, S", duration: "Instantaneous", concentration: false, ritual: false, summary: "Spray poison at a nearby creature.", classLists: ["wizard"] },
  { id: "prestidigitation", name: "Prestidigitation", level: 0, school: "Transmutation", castingTime: "1 action", range: "10 ft.", components: "V, S", duration: "Up to 1 hour", concentration: false, ritual: false, summary: "Perform small magical tricks and harmless sensory effects.", classLists: ["wizard"] },
  { id: "ray-of-frost", name: "Ray of Frost", level: 0, school: "Evocation", castingTime: "1 action", range: "60 ft.", components: "V, S", duration: "Instantaneous", concentration: false, ritual: false, summary: "Blast a creature with cold and slow it briefly.", classLists: ["wizard"] },
  { id: "shocking-grasp", name: "Shocking Grasp", level: 0, school: "Evocation", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Instantaneous", concentration: false, ritual: false, summary: "Shock a creature you touch and make it harder to react.", classLists: ["wizard"] },
  { id: "true-strike", name: "True Strike", level: 0, school: "Divination", castingTime: "1 action", range: "30 ft.", components: "S", duration: "1 round", concentration: true, ritual: false, summary: "Study a target to help your next attack against it.", classLists: ["wizard"] },

  { id: "alarm", name: "Alarm", level: 1, school: "Abjuration", castingTime: "1 minute", range: "30 ft.", components: "V, S, M", material: "A tiny bell and a piece of fine silver wire", duration: "8 hours", concentration: false, ritual: true, summary: "Set a magical warning around an area.", classLists: ["wizard"] },
  { id: "burning-hands", name: "Burning Hands", level: 1, school: "Evocation", castingTime: "1 action", range: "Self", components: "V, S", duration: "Instantaneous", concentration: false, ritual: false, summary: "Send a fan of fire out from your hands.", classLists: ["wizard"] },
  { id: "charm-person", name: "Charm Person", level: 1, school: "Enchantment", castingTime: "1 action", range: "30 ft.", components: "V, S", duration: "1 hour", concentration: false, ritual: false, summary: "Make a humanoid regard you as friendly for a while.", classLists: ["wizard"] },
  { id: "chromatic-orb", name: "Chromatic Orb", level: 1, school: "Evocation", castingTime: "1 action", range: "90 ft.", components: "V, S, M", material: "A diamond worth at least 50 gp", duration: "Instantaneous", concentration: false, ritual: false, summary: "Fire a ranged orb of your chosen elemental damage type.", classLists: ["wizard"] },
  { id: "color-spray", name: "Color Spray", level: 1, school: "Illusion", castingTime: "1 action", range: "Self", components: "V, S, M", material: "A pinch of powder or sand colored red, yellow, and blue", duration: "1 round", concentration: false, ritual: false, summary: "Flash bright colors that can blind nearby creatures briefly.", classLists: ["wizard"] },
  { id: "comprehend-languages", name: "Comprehend Languages", level: 1, school: "Divination", castingTime: "1 action", range: "Self", components: "V, S, M", material: "A pinch of soot and salt", duration: "1 hour", concentration: false, ritual: true, summary: "Understand the literal meaning of languages you hear or read.", classLists: ["wizard"] },
  { id: "detect-magic", name: "Detect Magic", level: 1, school: "Divination", castingTime: "1 action", range: "Self", components: "V, S", duration: "10 minutes", concentration: true, ritual: true, summary: "Sense nearby magic and learn its school.", classLists: ["wizard"] },
  { id: "disguise-self", name: "Disguise Self", level: 1, school: "Illusion", castingTime: "1 action", range: "Self", components: "V, S", duration: "1 hour", concentration: false, ritual: false, summary: "Change your appearance with an illusion.", classLists: ["wizard"] },
  { id: "expeditious-retreat", name: "Expeditious Retreat", level: 1, school: "Transmutation", castingTime: "1 bonus action", range: "Self", components: "V, S", duration: "10 minutes", concentration: true, ritual: false, summary: "Move quickly by dashing as a bonus action.", classLists: ["wizard"] },
  { id: "false-life", name: "False Life", level: 1, school: "Necromancy", castingTime: "1 action", range: "Self", components: "V, S, M", material: "A small amount of alcohol or distilled spirits", duration: "1 hour", concentration: false, ritual: false, summary: "Bolster yourself with temporary hit points.", classLists: ["wizard"] },
  { id: "feather-fall", name: "Feather Fall", level: 1, school: "Transmutation", castingTime: "1 reaction", range: "60 ft.", components: "V, M", material: "A small feather or piece of down", duration: "1 minute", concentration: false, ritual: false, summary: "Slow falling creatures so they land safely.", classLists: ["wizard"] },
  { id: "find-familiar", name: "Find Familiar", level: 1, school: "Conjuration", castingTime: "1 hour", range: "10 ft.", components: "V, S, M", material: "Charcoal, incense, and herbs consumed by fire in a brass brazier", duration: "Instantaneous", concentration: false, ritual: true, summary: "Summon a helpful spirit in the form of a small animal.", classLists: ["wizard"] },
  { id: "floating-disk", name: "Floating Disk", level: 1, school: "Conjuration", castingTime: "1 action", range: "30 ft.", components: "V, S, M", material: "A drop of mercury", duration: "1 hour", concentration: false, ritual: true, summary: "Create a floating disk that carries gear for you.", classLists: ["wizard"] },
  { id: "fog-cloud", name: "Fog Cloud", level: 1, school: "Conjuration", castingTime: "1 action", range: "120 ft.", components: "V, S", duration: "1 hour", concentration: true, ritual: false, summary: "Fill an area with thick fog that blocks sight.", classLists: ["wizard"] },
  { id: "grease", name: "Grease", level: 1, school: "Conjuration", castingTime: "1 action", range: "60 ft.", components: "V, S, M", material: "A bit of pork rind or butter", duration: "1 minute", concentration: false, ritual: false, summary: "Coat the ground in slippery grease.", classLists: ["wizard"] },
  { id: "hideous-laughter", name: "Hideous Laughter", level: 1, school: "Enchantment", castingTime: "1 action", range: "30 ft.", components: "V, S, M", material: "Tiny tarts and a feather waved in the air", duration: "1 minute", concentration: true, ritual: false, summary: "Overwhelm a creature with magical laughter.", classLists: ["wizard"] },
  { id: "identify", name: "Identify", level: 1, school: "Divination", castingTime: "1 minute", range: "Touch", components: "V, S, M", material: "A pearl worth at least 100 gp and an owl feather", duration: "Instantaneous", concentration: false, ritual: true, summary: "Learn what a magic item or magical effect does.", classLists: ["wizard"] },
  { id: "illusory-script", name: "Illusory Script", level: 1, school: "Illusion", castingTime: "1 minute", range: "Touch", components: "S, M", material: "Lead-based ink worth at least 10 gp, consumed by the spell", duration: "10 days", concentration: false, ritual: true, summary: "Hide a written message behind a magical illusion.", classLists: ["wizard"] },
  { id: "jump", name: "Jump", level: 1, school: "Transmutation", castingTime: "1 action", range: "Touch", components: "V, S, M", material: "A grasshopper's hind leg", duration: "1 minute", concentration: false, ritual: false, summary: "Greatly increase a creature's jumping distance.", classLists: ["wizard"] },
  { id: "longstrider", name: "Longstrider", level: 1, school: "Transmutation", castingTime: "1 action", range: "Touch", components: "V, S, M", material: "A pinch of dirt", duration: "1 hour", concentration: false, ritual: false, summary: "Increase a creature's walking speed.", classLists: ["wizard"] },
  { id: "mage-armor", name: "Mage Armor", level: 1, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S, M", material: "A piece of cured leather", duration: "8 hours", concentration: false, ritual: false, summary: "Give an unarmored creature a protective magical force.", classLists: ["wizard"] },
  { id: "magic-missile", name: "Magic Missile", level: 1, school: "Evocation", castingTime: "1 action", range: "120 ft.", components: "V, S", duration: "Instantaneous", concentration: false, ritual: false, summary: "Create darts of force that automatically hit visible targets.", classLists: ["wizard"] },
  { id: "protection-from-evil-and-good", name: "Protection from Evil and Good", level: 1, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S, M", material: "Holy water or powdered silver and iron, consumed by the spell", duration: "10 minutes", concentration: true, ritual: false, summary: "Protect a creature from several supernatural creature types.", classLists: ["wizard"] },
  { id: "ray-of-sickness", name: "Ray of Sickness", level: 1, school: "Necromancy", castingTime: "1 action", range: "60 ft.", components: "V, S", duration: "Instantaneous", concentration: false, ritual: false, summary: "Fire a sickly ray that can poison a creature briefly.", classLists: ["wizard"] },
  { id: "shield", name: "Shield", level: 1, school: "Abjuration", castingTime: "1 reaction", range: "Self", components: "V, S", duration: "1 round", concentration: false, ritual: false, summary: "Raise a sudden magical barrier against an attack.", classLists: ["wizard"] },
  { id: "silent-image", name: "Silent Image", level: 1, school: "Illusion", castingTime: "1 action", range: "60 ft.", components: "V, S, M", material: "A bit of fleece", duration: "10 minutes", concentration: true, ritual: false, summary: "Create a visible illusion that can move but makes no sound.", classLists: ["wizard"] },
  { id: "sleep", name: "Sleep", level: 1, school: "Enchantment", castingTime: "1 action", range: "90 ft.", components: "V, S, M", material: "A pinch of fine sand, rose petals, or a cricket", duration: "1 minute", concentration: false, ritual: false, summary: "Magically lull weaker creatures into sleep.", classLists: ["wizard"] },
  { id: "thunderwave", name: "Thunderwave", level: 1, school: "Evocation", castingTime: "1 action", range: "Self", components: "V, S", duration: "Instantaneous", concentration: false, ritual: false, summary: "Release a burst of thunderous force around you.", classLists: ["wizard"] },
  { id: "unseen-servant", name: "Unseen Servant", level: 1, school: "Conjuration", castingTime: "1 action", range: "60 ft.", components: "V, S, M", material: "A piece of string and a bit of wood", duration: "1 hour", concentration: false, ritual: true, summary: "Create an invisible servant that performs simple tasks.", classLists: ["wizard"] },
  { id: "witch-bolt", name: "Witch Bolt", level: 1, school: "Evocation", castingTime: "1 action", range: "30 ft.", components: "V, S, M", material: "A twig from a tree struck by lightning", duration: "1 minute", concentration: true, ritual: false, summary: "Link lightning to a creature and keep hurting it while focused.", classLists: ["wizard"] },
];

DND_DATA.getSpellById = function getSpellById(spellId) {
  return DND_DATA.spells.find((spell) => spell.id === spellId) || null;
};

DND_DATA.getSpellsForClassLevel = function getSpellsForClassLevel(classId, level) {
  return DND_DATA.spells.filter((spell) => spell.level === level && spell.classLists.includes(classId));
};

DND_DATA.randomSpellSelectionForClass = function randomSpellSelectionForClass(classId) {
  if (!DND_DATA.supportedSpellSelectionClasses.includes(classId)) return { cantrips: [], spellbookSpells: [] };
  const rules = DND_DATA.spellSelectionRules[classId];
  const shuffledCantrips = [...DND_DATA.getSpellsForClassLevel(classId, 0)].sort(() => Math.random() - 0.5);
  const shuffledSpells = [...DND_DATA.getSpellsForClassLevel(classId, 1)].sort(() => Math.random() - 0.5);
  return {
    cantrips: shuffledCantrips.slice(0, rules.cantrips).map((spell) => spell.id),
    spellbookSpells: shuffledSpells.slice(0, rules.spellbookSpells).map((spell) => spell.id),
  };
};
