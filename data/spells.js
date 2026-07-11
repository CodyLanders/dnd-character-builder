window.DND_DATA = window.DND_DATA || {};

DND_DATA.supportedSpellSelectionClasses = ["wizard", "cleric", "druid", "bard", "sorcerer"];

DND_DATA.spellSelectionRules = {
  wizard: {
    sections: [
      { id: "cantrips", title: "Choose 3 Cantrips", helper: "Choose 3 Wizard cantrips.", level: 0, limit: 3 },
      { id: "spellbookSpells", title: "Choose 6 Spellbook Spells", helper: "Choose 6 level 1 Wizard spells for your spellbook.", level: 1, limit: 6 },
    ],
  },
  bard: {
    sections: [
      { id: "cantrips", title: "Choose 2 Cantrips", helper: "Choose 2 Bard cantrips.", level: 0, limit: 2 },
      { id: "spellbookSpells", title: "Known Spells", helper: "Choose 4 level 1 Bard spells known.", level: 1, limit: 4 },
    ],
  },
  sorcerer: {
    sections: [
      { id: "cantrips", title: "Choose 4 Cantrips", helper: "Choose 4 Sorcerer cantrips.", level: 0, limit: 4 },
      { id: "spellbookSpells", title: "Known Spells", helper: "Choose 2 level 1 Sorcerer spells known.", level: 1, limit: 2 },
    ],
  },
  cleric: {
    sections: [
      { id: "cantrips", title: "Choose 3 Cantrips", helper: "Choose 3 Cleric cantrips.", level: 0, limit: 3 },
      { id: "preparedSpells", title: "Prepare Level 1 Spells", helper: "Prepare Wisdom modifier + 1 level 1 Cleric spells, minimum 1.", level: 1, limit: "prepared" },
    ],
  },
  druid: {
    sections: [
      { id: "cantrips", title: "Choose 2 Cantrips", helper: "Choose 2 Druid cantrips.", level: 0, limit: 2 },
      { id: "preparedSpells", title: "Prepare Level 1 Spells", helper: "Prepare Wisdom modifier + 1 level 1 Druid spells, minimum 1.", level: 1, limit: "prepared" },
    ],
  },
};

DND_DATA.clericDomainSpells = {
  knowledge: ["command", "identify"],
  life: ["bless", "cure-wounds"],
  light: ["burning-hands", "faerie-fire"],
  nature: ["animal-friendship", "speak-with-animals"],
  tempest: ["fog-cloud", "thunderwave"],
  trickery: ["charm-person", "disguise-self"],
  war: ["divine-favor", "shield-of-faith"],
};

DND_DATA.spells = [
  { id: "acid-splash", name: "Acid Splash", level: 0, school: "Conjuration", castingTime: "1 action", range: "60 ft.", components: "V, S", duration: "Instantaneous", concentration: false, ritual: false, summary: "Hurl acid at one or two nearby creatures.", classLists: ["wizard", "sorcerer"] },
  { id: "blade-ward", name: "Blade Ward", level: 0, school: "Abjuration", castingTime: "1 action", range: "Self", components: "V, S", duration: "1 round", concentration: false, ritual: false, summary: "Briefly protect yourself against weapon damage.", classLists: ["wizard", "bard", "sorcerer"] },
  { id: "chill-touch", name: "Chill Touch", level: 0, school: "Necromancy", castingTime: "1 action", range: "120 ft.", components: "V, S", duration: "1 round", concentration: false, ritual: false, summary: "A ghostly hand harms a creature and hinders healing.", classLists: ["wizard", "sorcerer"] },
  { id: "dancing-lights", name: "Dancing Lights", level: 0, school: "Evocation", castingTime: "1 action", range: "120 ft.", components: "V, S, M", material: "A bit of phosphorus or wychwood, or a glowworm", duration: "1 minute", concentration: true, ritual: false, summary: "Create small moving lights to illuminate an area.", classLists: ["wizard", "bard", "sorcerer"] },
  { id: "fire-bolt", name: "Fire Bolt", level: 0, school: "Evocation", castingTime: "1 action", range: "120 ft.", components: "V, S", duration: "Instantaneous", concentration: false, ritual: false, summary: "Launch a bolt of fire at a creature or object.", classLists: ["wizard", "sorcerer"] },
  { id: "friends", name: "Friends", level: 0, school: "Enchantment", castingTime: "1 action", range: "Self", components: "S, M", material: "A small amount of makeup applied as the spell is cast", duration: "1 minute", concentration: true, ritual: false, summary: "Gain a short-lived edge on Charisma checks with one creature.", classLists: ["wizard", "bard", "sorcerer"] },
  { id: "light", name: "Light", level: 0, school: "Evocation", castingTime: "1 action", range: "Touch", components: "V, M", material: "A firefly or phosphorescent moss", duration: "1 hour", concentration: false, ritual: false, summary: "Make an object shine bright light.", classLists: ["wizard", "cleric", "bard", "sorcerer"] },
  { id: "mage-hand", name: "Mage Hand", level: 0, school: "Conjuration", castingTime: "1 action", range: "30 ft.", components: "V, S", duration: "1 minute", concentration: false, ritual: false, summary: "Create a floating hand that can manipulate small objects.", classLists: ["wizard", "bard", "sorcerer"] },
  { id: "mending", name: "Mending", level: 0, school: "Transmutation", castingTime: "1 minute", range: "Touch", components: "V, S, M", material: "Two lodestones", duration: "Instantaneous", concentration: false, ritual: false, summary: "Repair a small break or tear in an object.", classLists: ["wizard", "cleric", "druid", "bard", "sorcerer"] },
  { id: "message", name: "Message", level: 0, school: "Transmutation", castingTime: "1 action", range: "120 ft.", components: "V, S, M", material: "A short piece of copper wire", duration: "1 round", concentration: false, ritual: false, summary: "Whisper a private message to a creature at range.", classLists: ["wizard", "bard", "sorcerer"] },
  { id: "minor-illusion", name: "Minor Illusion", level: 0, school: "Illusion", castingTime: "1 action", range: "30 ft.", components: "S, M", material: "A bit of fleece", duration: "1 minute", concentration: false, ritual: false, summary: "Create a small sound or image as a simple illusion.", classLists: ["wizard", "bard", "sorcerer"] },
  { id: "poison-spray", name: "Poison Spray", level: 0, school: "Conjuration", castingTime: "1 action", range: "10 ft.", components: "V, S", duration: "Instantaneous", concentration: false, ritual: false, summary: "Spray poison at a nearby creature.", classLists: ["wizard", "druid", "sorcerer"] },
  { id: "prestidigitation", name: "Prestidigitation", level: 0, school: "Transmutation", castingTime: "1 action", range: "10 ft.", components: "V, S", duration: "Up to 1 hour", concentration: false, ritual: false, summary: "Perform small magical tricks and harmless sensory effects.", classLists: ["wizard", "bard", "sorcerer"] },
  { id: "ray-of-frost", name: "Ray of Frost", level: 0, school: "Evocation", castingTime: "1 action", range: "60 ft.", components: "V, S", duration: "Instantaneous", concentration: false, ritual: false, summary: "Blast a creature with cold and slow it briefly.", classLists: ["wizard", "sorcerer"] },
  { id: "shocking-grasp", name: "Shocking Grasp", level: 0, school: "Evocation", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Instantaneous", concentration: false, ritual: false, summary: "Shock a creature you touch and make it harder to react.", classLists: ["wizard", "sorcerer"] },
  { id: "true-strike", name: "True Strike", level: 0, school: "Divination", castingTime: "1 action", range: "30 ft.", components: "S", duration: "1 round", concentration: true, ritual: false, summary: "Study a target to help your next attack against it.", classLists: ["wizard", "bard", "sorcerer"] },
  { id: "vicious-mockery", name: "Vicious Mockery", level: 0, school: "Enchantment", castingTime: "1 action", range: "60 ft.", components: "V", duration: "Instantaneous", concentration: false, ritual: false, summary: "Insult a creature with magic, dealing psychic damage and hindering its next attack.", classLists: ["bard"] },

  { id: "alarm", name: "Alarm", level: 1, school: "Abjuration", castingTime: "1 minute", range: "30 ft.", components: "V, S, M", material: "A tiny bell and a piece of fine silver wire", duration: "8 hours", concentration: false, ritual: true, summary: "Set a magical warning around an area.", classLists: ["wizard"] },
  { id: "burning-hands", name: "Burning Hands", level: 1, school: "Evocation", castingTime: "1 action", range: "Self", components: "V, S", duration: "Instantaneous", concentration: false, ritual: false, summary: "Send a fan of fire out from your hands.", classLists: ["wizard", "sorcerer"] },
  { id: "charm-person", name: "Charm Person", level: 1, school: "Enchantment", castingTime: "1 action", range: "30 ft.", components: "V, S", duration: "1 hour", concentration: false, ritual: false, summary: "Make a humanoid regard you as friendly for a while.", classLists: ["wizard", "druid", "bard", "sorcerer"] },
  { id: "chromatic-orb", name: "Chromatic Orb", level: 1, school: "Evocation", castingTime: "1 action", range: "90 ft.", components: "V, S, M", material: "A diamond worth at least 50 gp", duration: "Instantaneous", concentration: false, ritual: false, summary: "Fire a ranged orb of your chosen elemental damage type.", classLists: ["wizard", "sorcerer"] },
  { id: "color-spray", name: "Color Spray", level: 1, school: "Illusion", castingTime: "1 action", range: "Self", components: "V, S, M", material: "A pinch of powder or sand colored red, yellow, and blue", duration: "1 round", concentration: false, ritual: false, summary: "Flash bright colors that can blind nearby creatures briefly.", classLists: ["wizard", "sorcerer"] },
  { id: "comprehend-languages", name: "Comprehend Languages", level: 1, school: "Divination", castingTime: "1 action", range: "Self", components: "V, S, M", material: "A pinch of soot and salt", duration: "1 hour", concentration: false, ritual: true, summary: "Understand the literal meaning of languages you hear or read.", classLists: ["wizard", "bard", "sorcerer"] },
  { id: "detect-magic", name: "Detect Magic", level: 1, school: "Divination", castingTime: "1 action", range: "Self", components: "V, S", duration: "10 minutes", concentration: true, ritual: true, summary: "Sense nearby magic and learn its school.", classLists: ["wizard", "cleric", "druid", "bard", "sorcerer"] },
  { id: "disguise-self", name: "Disguise Self", level: 1, school: "Illusion", castingTime: "1 action", range: "Self", components: "V, S", duration: "1 hour", concentration: false, ritual: false, summary: "Change your appearance with an illusion.", classLists: ["wizard", "bard", "sorcerer"] },
  { id: "expeditious-retreat", name: "Expeditious Retreat", level: 1, school: "Transmutation", castingTime: "1 bonus action", range: "Self", components: "V, S", duration: "10 minutes", concentration: true, ritual: false, summary: "Move quickly by dashing as a bonus action.", classLists: ["wizard", "sorcerer"] },
  { id: "false-life", name: "False Life", level: 1, school: "Necromancy", castingTime: "1 action", range: "Self", components: "V, S, M", material: "A small amount of alcohol or distilled spirits", duration: "1 hour", concentration: false, ritual: false, summary: "Bolster yourself with temporary hit points.", classLists: ["wizard", "sorcerer"] },
  { id: "feather-fall", name: "Feather Fall", level: 1, school: "Transmutation", castingTime: "1 reaction", range: "60 ft.", components: "V, M", material: "A small feather or piece of down", duration: "1 minute", concentration: false, ritual: false, summary: "Slow falling creatures so they land safely.", classLists: ["wizard", "bard", "sorcerer"] },
  { id: "find-familiar", name: "Find Familiar", level: 1, school: "Conjuration", castingTime: "1 hour", range: "10 ft.", components: "V, S, M", material: "Charcoal, incense, and herbs consumed by fire in a brass brazier", duration: "Instantaneous", concentration: false, ritual: true, summary: "Summon a helpful spirit in the form of a small animal.", classLists: ["wizard"] },
  { id: "floating-disk", name: "Floating Disk", level: 1, school: "Conjuration", castingTime: "1 action", range: "30 ft.", components: "V, S, M", material: "A drop of mercury", duration: "1 hour", concentration: false, ritual: true, summary: "Create a floating disk that carries gear for you.", classLists: ["wizard"] },
  { id: "fog-cloud", name: "Fog Cloud", level: 1, school: "Conjuration", castingTime: "1 action", range: "120 ft.", components: "V, S", duration: "1 hour", concentration: true, ritual: false, summary: "Fill an area with thick fog that blocks sight.", classLists: ["wizard", "druid", "sorcerer"] },
  { id: "grease", name: "Grease", level: 1, school: "Conjuration", castingTime: "1 action", range: "60 ft.", components: "V, S, M", material: "A bit of pork rind or butter", duration: "1 minute", concentration: false, ritual: false, summary: "Coat the ground in slippery grease.", classLists: ["wizard"] },
  { id: "hideous-laughter", name: "Tasha's Hideous Laughter", level: 1, school: "Enchantment", castingTime: "1 action", range: "30 ft.", components: "V, S, M", material: "Tiny tarts and a feather waved in the air", duration: "1 minute", concentration: true, ritual: false, summary: "Overwhelm a creature with magical laughter.", classLists: ["wizard", "bard"] },
  { id: "identify", name: "Identify", level: 1, school: "Divination", castingTime: "1 minute", range: "Touch", components: "V, S, M", material: "A pearl worth at least 100 gp and an owl feather", duration: "Instantaneous", concentration: false, ritual: true, summary: "Learn what a magic item or magical effect does.", classLists: ["wizard", "bard"] },
  { id: "illusory-script", name: "Illusory Script", level: 1, school: "Illusion", castingTime: "1 minute", range: "Touch", components: "S, M", material: "Lead-based ink worth at least 10 gp, consumed by the spell", duration: "10 days", concentration: false, ritual: true, summary: "Hide a written message behind a magical illusion.", classLists: ["wizard", "bard"] },
  { id: "jump", name: "Jump", level: 1, school: "Transmutation", castingTime: "1 action", range: "Touch", components: "V, S, M", material: "A grasshopper's hind leg", duration: "1 minute", concentration: false, ritual: false, summary: "Greatly increase a creature's jumping distance.", classLists: ["wizard", "druid", "sorcerer"] },
  { id: "longstrider", name: "Longstrider", level: 1, school: "Transmutation", castingTime: "1 action", range: "Touch", components: "V, S, M", material: "A pinch of dirt", duration: "1 hour", concentration: false, ritual: false, summary: "Increase a creature's walking speed.", classLists: ["wizard", "druid", "bard"] },
  { id: "mage-armor", name: "Mage Armor", level: 1, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S, M", material: "A piece of cured leather", duration: "8 hours", concentration: false, ritual: false, summary: "Give an unarmored creature a protective magical force.", classLists: ["wizard", "sorcerer"] },
  { id: "magic-missile", name: "Magic Missile", level: 1, school: "Evocation", castingTime: "1 action", range: "120 ft.", components: "V, S", duration: "Instantaneous", concentration: false, ritual: false, summary: "Create darts of force that automatically hit visible targets.", classLists: ["wizard", "sorcerer"] },
  { id: "protection-from-evil-and-good", name: "Protection from Evil and Good", level: 1, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S, M", material: "Holy water or powdered silver and iron, consumed by the spell", duration: "10 minutes", concentration: true, ritual: false, summary: "Protect a creature from several supernatural creature types.", classLists: ["wizard", "cleric"] },
  { id: "ray-of-sickness", name: "Ray of Sickness", level: 1, school: "Necromancy", castingTime: "1 action", range: "60 ft.", components: "V, S", duration: "Instantaneous", concentration: false, ritual: false, summary: "Fire a sickly ray that can poison a creature briefly.", classLists: ["wizard", "sorcerer"] },
  { id: "shield", name: "Shield", level: 1, school: "Abjuration", castingTime: "1 reaction", range: "Self", components: "V, S", duration: "1 round", concentration: false, ritual: false, summary: "Raise a sudden magical barrier against an attack.", classLists: ["wizard", "sorcerer"] },
  { id: "silent-image", name: "Silent Image", level: 1, school: "Illusion", castingTime: "1 action", range: "60 ft.", components: "V, S, M", material: "A bit of fleece", duration: "10 minutes", concentration: true, ritual: false, summary: "Create a visible illusion that can move but makes no sound.", classLists: ["wizard", "bard", "sorcerer"] },
  { id: "sleep", name: "Sleep", level: 1, school: "Enchantment", castingTime: "1 action", range: "90 ft.", components: "V, S, M", material: "A pinch of fine sand, rose petals, or a cricket", duration: "1 minute", concentration: false, ritual: false, summary: "Magically lull weaker creatures into sleep.", classLists: ["wizard", "bard", "sorcerer"] },
  { id: "thunderwave", name: "Thunderwave", level: 1, school: "Evocation", castingTime: "1 action", range: "Self", components: "V, S", duration: "Instantaneous", concentration: false, ritual: false, summary: "Release a burst of thunderous force around you.", classLists: ["wizard", "druid", "bard", "sorcerer"] },
  { id: "unseen-servant", name: "Unseen Servant", level: 1, school: "Conjuration", castingTime: "1 action", range: "60 ft.", components: "V, S, M", material: "A piece of string and a bit of wood", duration: "1 hour", concentration: false, ritual: true, summary: "Create an invisible servant that performs simple tasks.", classLists: ["wizard", "bard"] },
  { id: "witch-bolt", name: "Witch Bolt", level: 1, school: "Evocation", castingTime: "1 action", range: "30 ft.", components: "V, S, M", material: "A twig from a tree struck by lightning", duration: "1 minute", concentration: true, ritual: false, summary: "Link lightning to a creature and keep hurting it while focused.", classLists: ["wizard", "sorcerer"] },

  { id: "druidcraft", name: "Druidcraft", level: 0, school: "Transmutation", castingTime: "1 action", range: "30 ft.", components: "V, S", duration: "Instantaneous", concentration: false, ritual: false, summary: "Create a small nature omen or harmless natural effect.", classLists: ["druid"] },
  { id: "guidance", name: "Guidance", level: 0, school: "Divination", castingTime: "1 action", range: "Touch", components: "V, S", duration: "1 minute", concentration: true, ritual: false, summary: "Bless a creature with a small boost to one ability check.", classLists: ["cleric", "druid"] },
  { id: "produce-flame", name: "Produce Flame", level: 0, school: "Conjuration", castingTime: "1 action", range: "Self", components: "V, S", duration: "10 minutes", concentration: false, ritual: false, summary: "Create flame in your hand that can light an area or be thrown.", classLists: ["druid"] },
  { id: "resistance", name: "Resistance", level: 0, school: "Abjuration", castingTime: "1 action", range: "Touch", components: "V, S, M", material: "A miniature cloak", duration: "1 minute", concentration: true, ritual: false, summary: "Help a creature resist one saving throw.", classLists: ["cleric", "druid"] },
  { id: "sacred-flame", name: "Sacred Flame", level: 0, school: "Evocation", castingTime: "1 action", range: "60 ft.", components: "V, S", duration: "Instantaneous", concentration: false, ritual: false, summary: "Call radiant fire down on a creature.", classLists: ["cleric"] },
  { id: "shillelagh", name: "Shillelagh", level: 0, school: "Transmutation", castingTime: "1 bonus action", range: "Touch", components: "V, S, M", material: "Mistletoe, a shamrock leaf, and a club or quarterstaff", duration: "1 minute", concentration: false, ritual: false, summary: "Empower a wooden weapon with nature magic.", classLists: ["druid"] },
  { id: "spare-the-dying", name: "Spare the Dying", level: 0, school: "Necromancy", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Instantaneous", concentration: false, ritual: false, summary: "Stabilize a dying creature you touch.", classLists: ["cleric"] },
  { id: "thaumaturgy", name: "Thaumaturgy", level: 0, school: "Transmutation", castingTime: "1 action", range: "30 ft.", components: "V", duration: "Up to 1 minute", concentration: false, ritual: false, summary: "Create a small divine sign or dramatic sensory effect.", classLists: ["cleric"] },
  { id: "thorn-whip", name: "Thorn Whip", level: 0, school: "Transmutation", castingTime: "1 action", range: "30 ft.", components: "V, S, M", material: "The stem of a plant with thorns", duration: "Instantaneous", concentration: false, ritual: false, summary: "Strike with a thorny vine and pull a creature closer.", classLists: ["druid"] },

  { id: "animal-friendship", name: "Animal Friendship", level: 1, school: "Enchantment", castingTime: "1 action", range: "30 ft.", components: "V, S, M", material: "A morsel of food", duration: "24 hours", concentration: false, ritual: false, summary: "Convince a beast that you mean it no harm.", classLists: ["domain", "druid", "bard"] },
  { id: "bane", name: "Bane", level: 1, school: "Enchantment", castingTime: "1 action", range: "30 ft.", components: "V, S, M", material: "A drop of blood", duration: "1 minute", concentration: true, ritual: false, summary: "Hinder several enemies' attacks and saving throws.", classLists: ["cleric", "bard"] },
  { id: "bless", name: "Bless", level: 1, school: "Enchantment", castingTime: "1 action", range: "30 ft.", components: "V, S, M", material: "A sprinkling of holy water", duration: "1 minute", concentration: true, ritual: false, summary: "Bolster allies' attacks and saving throws.", classLists: ["cleric"] },
  { id: "command", name: "Command", level: 1, school: "Enchantment", castingTime: "1 action", range: "60 ft.", components: "V", duration: "1 round", concentration: false, ritual: false, summary: "Speak a one-word divine command to a creature.", classLists: ["cleric"] },
  { id: "create-or-destroy-water", name: "Create or Destroy Water", level: 1, school: "Transmutation", castingTime: "1 action", range: "30 ft.", components: "V, S, M", material: "A drop of water or a few grains of sand", duration: "Instantaneous", concentration: false, ritual: false, summary: "Create water, destroy water, or clear rain in a small area.", classLists: ["cleric", "druid"] },
  { id: "cure-wounds", name: "Cure Wounds", level: 1, school: "Evocation", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Instantaneous", concentration: false, ritual: false, summary: "Heal a creature you touch.", classLists: ["cleric", "druid", "bard"] },
  { id: "detect-evil-and-good", name: "Detect Evil and Good", level: 1, school: "Divination", castingTime: "1 action", range: "Self", components: "V, S", duration: "10 minutes", concentration: true, ritual: false, summary: "Sense certain supernatural creature types and sacred places nearby.", classLists: ["cleric"] },
  { id: "detect-poison-and-disease", name: "Detect Poison and Disease", level: 1, school: "Divination", castingTime: "1 action", range: "Self", components: "V, S, M", material: "A yew leaf", duration: "10 minutes", concentration: true, ritual: true, summary: "Sense poison, poisonous creatures, and disease nearby.", classLists: ["cleric", "druid"] },
  { id: "divine-favor", name: "Divine Favor", level: 1, school: "Evocation", castingTime: "1 bonus action", range: "Self", components: "V, S", duration: "1 minute", concentration: true, ritual: false, summary: "Empower your weapon strikes with radiant damage.", classLists: ["domain"] },
  { id: "entangle", name: "Entangle", level: 1, school: "Conjuration", castingTime: "1 action", range: "90 ft.", components: "V, S", duration: "1 minute", concentration: true, ritual: false, summary: "Cause grasping plants to restrain creatures in an area.", classLists: ["druid"] },
  { id: "dissonant-whispers", name: "Dissonant Whispers", level: 1, school: "Enchantment", castingTime: "1 action", range: "60 ft.", components: "V", duration: "Instantaneous", concentration: false, ritual: false, summary: "Assault a creature's mind with discordant sound and force it to flee.", classLists: ["bard"] },
  { id: "faerie-fire", name: "Faerie Fire", level: 1, school: "Evocation", castingTime: "1 action", range: "60 ft.", components: "V", duration: "1 minute", concentration: true, ritual: false, summary: "Outline creatures and objects in magical light.", classLists: ["domain", "druid", "bard"] },
  { id: "goodberry", name: "Goodberry", level: 1, school: "Transmutation", castingTime: "1 action", range: "Touch", components: "V, S, M", material: "A sprig of mistletoe", duration: "Instantaneous", concentration: false, ritual: false, summary: "Create magical berries that provide nourishment and a little healing.", classLists: ["druid"] },
  { id: "guiding-bolt", name: "Guiding Bolt", level: 1, school: "Evocation", castingTime: "1 action", range: "120 ft.", components: "V, S", duration: "1 round", concentration: false, ritual: false, summary: "Strike a creature with radiant light that helps the next attack against it.", classLists: ["cleric"] },
  { id: "healing-word", name: "Healing Word", level: 1, school: "Evocation", castingTime: "1 bonus action", range: "60 ft.", components: "V", duration: "Instantaneous", concentration: false, ritual: false, summary: "Heal a creature at range with a brief divine word.", classLists: ["cleric", "druid", "bard"] },
  { id: "heroism", name: "Heroism", level: 1, school: "Enchantment", castingTime: "1 action", range: "Touch", components: "V, S", duration: "1 minute", concentration: true, ritual: false, summary: "Bolster a willing creature with courage and temporary hit points.", classLists: ["bard"] },
  { id: "inflict-wounds", name: "Inflict Wounds", level: 1, school: "Necromancy", castingTime: "1 action", range: "Touch", components: "V, S", duration: "Instantaneous", concentration: false, ritual: false, summary: "Make a powerful melee spell attack with necrotic energy.", classLists: ["cleric"] },
  { id: "purify-food-and-drink", name: "Purify Food and Drink", level: 1, school: "Transmutation", castingTime: "1 action", range: "10 ft.", components: "V, S", duration: "Instantaneous", concentration: false, ritual: true, summary: "Remove poison and disease from food and drink.", classLists: ["cleric", "druid"] },
  { id: "sanctuary", name: "Sanctuary", level: 1, school: "Abjuration", castingTime: "1 bonus action", range: "30 ft.", components: "V, S, M", material: "A small silver mirror", duration: "1 minute", concentration: false, ritual: false, summary: "Ward a creature so attackers must push through divine protection.", classLists: ["cleric"] },
  { id: "shield-of-faith", name: "Shield of Faith", level: 1, school: "Abjuration", castingTime: "1 bonus action", range: "60 ft.", components: "V, S, M", material: "A small parchment with holy text", duration: "10 minutes", concentration: true, ritual: false, summary: "Wrap a creature in shimmering protection.", classLists: ["cleric"] },
  { id: "speak-with-animals", name: "Speak with Animals", level: 1, school: "Divination", castingTime: "1 action", range: "Self", components: "V, S", duration: "10 minutes", concentration: false, ritual: true, summary: "Communicate simple ideas with beasts.", classLists: ["domain", "druid", "bard"] },
];

DND_DATA.getSpellById = function getSpellById(spellId) {
  return DND_DATA.spells.find((spell) => spell.id === spellId) || null;
};

DND_DATA.getSpellsForClassLevel = function getSpellsForClassLevel(classId, level) {
  return DND_DATA.spells.filter((spell) => spell.level === level && spell.classLists.includes(classId));
};

DND_DATA.getClericDomainSpellIds = function getClericDomainSpellIds(domainId) {
  return DND_DATA.clericDomainSpells[domainId] || [];
};

DND_DATA.getClericDomainSpells = function getClericDomainSpells(domainId) {
  return DND_DATA.getClericDomainSpellIds(domainId).map((spellId) => DND_DATA.getSpellById(spellId)).filter(Boolean);
};

DND_DATA.getPreparedSpellLimit = function getPreparedSpellLimit(classId, abilities = {}, level = 1) {
  const ability = classId === "wizard" ? "Intelligence" : classId === "cleric" || classId === "druid" ? "Wisdom" : "";
  if (!ability) return 0;
  const score = abilities[ability];
  if (score === "" || score === undefined || score === null) return 1;
  return Math.max(1, Math.floor((Number(score) - 10) / 2) + level);
};

DND_DATA.randomSpellSelectionForClass = function randomSpellSelectionForClass(classId, context = {}) {
  if (!DND_DATA.supportedSpellSelectionClasses.includes(classId)) return { cantrips: [], spellbookSpells: [], preparedSpells: [], natureBonusCantrip: [] };
  const rules = DND_DATA.spellSelectionRules[classId];
  const selections = { cantrips: [], spellbookSpells: [], preparedSpells: [], natureBonusCantrip: [] };
  if (!rules || !Array.isArray(rules.sections)) return selections;
  const domainSpellIds = new Set(DND_DATA.getClericDomainSpellIds(context.domainId));
  const domainMechanics = classId === "cleric" && DND_DATA.clericDomainMechanics && context.domainId
    ? DND_DATA.clericDomainMechanics[context.domainId]
    : {};
  const grantedCantripIds = new Set(domainMechanics.bonusCantrips || []);

  rules.sections.forEach((section) => {
    const limit = section.limit === "prepared"
      ? DND_DATA.getPreparedSpellLimit(classId, context.abilities || {}, context.level || 1)
      : section.limit;
    const options = DND_DATA.getSpellsForClassLevel(classId, section.level)
      .filter((spell) => section.id !== "preparedSpells" || !domainSpellIds.has(spell.id))
      .filter((spell) => classId !== "wizard" || section.id !== "preparedSpells" || selections.spellbookSpells.includes(spell.id))
      .filter((spell) => section.id !== "cantrips" || !grantedCantripIds.has(spell.id))
      .sort(() => Math.random() - 0.5);
    selections[section.id] = options.slice(0, limit).map((spell) => spell.id);
  });

  if (classId === "wizard") {
    const preparedLimit = DND_DATA.getPreparedSpellLimit(classId, context.abilities || {}, context.level || 1);
    selections.preparedSpells = [...selections.spellbookSpells].sort(() => Math.random() - 0.5).slice(0, preparedLimit);
  }

  if (domainMechanics.bonusCantripChoice) {
    const choice = domainMechanics.bonusCantripChoice;
    const options = DND_DATA.getSpellsForClassLevel(choice.classId, choice.level)
      .filter((spell) => !(selections.cantrips || []).includes(spell.id))
      .sort(() => Math.random() - 0.5);
    selections[choice.id] = options.slice(0, choice.choose).map((spell) => spell.id);
  }

  return selections;
};
