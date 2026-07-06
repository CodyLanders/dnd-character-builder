window.DND_DATA = window.DND_DATA || {};

DND_DATA.equipment = {
  fighter: ["Chain mail", "Longsword", "Shield", "Light crossbow", "Explorer's pack"],
  barbarian: ["Greataxe", "Two handaxes", "Explorer's pack", "Four javelins"],
  rogue: ["Rapier", "Shortbow", "Burglar's pack", "Leather armor", "Two daggers", "Thieves' tools"],
  monk: ["Shortsword", "Dungeoneer's pack", "10 darts"],
};

DND_DATA.getStarterEquipment = function getStarterEquipment(classId) {
  return [...(DND_DATA.equipment[classId] || [])];
};
