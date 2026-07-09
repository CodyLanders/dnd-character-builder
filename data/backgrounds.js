window.DND_DATA = window.DND_DATA || {};

DND_DATA.backgrounds = [
  {
    id: "soldier",
    name: "Soldier",
    skills: ["Athletics", "Intimidation"],
    tools: ["One gaming set", "Vehicles (land)"],
    equipment: ["Insignia of rank", "Trophy from a fallen enemy", "Set of bone dice or deck of cards", "Common clothes"],
    startingGoldGp: 10,
    personality: {
      trait: ["I'm always polite and respectful.", "I'm haunted by memories of war.", "I can stare down danger without flinching."],
      ideal: ["Greater Good. Our lot is to lay down our lives in defense of others.", "Responsibility. I do what I must and obey just authority.", "Independence. When people follow orders blindly, they embrace tyranny."],
      bond: ["I would still lay down my life for the people I served with.", "Someone saved my life on the battlefield; I will never leave a friend behind.", "My honor is my life."],
      flaw: ["The monstrous enemy we faced still leaves me quivering with fear.", "I obey the law, even if it causes misery.", "I'd rather eat my armor than admit when I'm wrong."],
    },
  },
  {
    id: "outlander",
    name: "Outlander",
    skills: ["Athletics", "Survival"],
    tools: ["One musical instrument"],
    equipment: ["Staff", "Hunting trap", "Trophy from an animal you killed", "Traveler's clothes"],
    startingGoldGp: 10,
    personality: {
      trait: ["I'm driven by wanderlust.", "I watch over my friends as if they were newborn cubs.", "I feel far more comfortable around animals than people."],
      ideal: ["Change. Life is like the seasons, in constant change.", "Greater Good. It is each person's responsibility to make the most happiness.", "Nature. The natural world is more important than civilization."],
      bond: ["My family, clan, or tribe is the most important thing in my life.", "An injury to the unspoiled wilderness is an injury to me.", "I suffer awful visions of a coming disaster and will prevent it."],
      flaw: ["I am too enamored of ale, wine, and other intoxicants.", "There's no room for caution in a life lived to the fullest.", "I remember every insult and nurse a silent resentment."],
    },
  },
  {
    id: "criminal",
    name: "Criminal",
    skills: ["Deception", "Stealth"],
    tools: ["One gaming set", "Thieves' tools"],
    equipment: ["Crowbar", "Dark common clothes with hood"],
    startingGoldGp: 15,
    personality: {
      trait: ["I always have a plan for what to do when things go wrong.", "I am always calm, no matter the situation.", "The first thing I do in a new place is note valuables and exits."],
      ideal: ["Honor. I don't steal from others in the trade.", "Freedom. Chains are meant to be broken.", "People. I'm loyal to my friends, not ideals."],
      bond: ["I'm trying to pay off an old debt.", "My ill-gotten gains support my family.", "Something important was taken from me, and I aim to steal it back."],
      flaw: ["When I see something valuable, I can't think about anything but how to steal it.", "I turn tail and run when things look bad.", "An innocent person is in prison for a crime I committed."],
    },
  },
  {
    id: "urchin",
    name: "Urchin",
    skills: ["Sleight of Hand", "Stealth"],
    tools: ["Disguise kit", "Thieves' tools"],
    equipment: ["Small knife", "Map of your home city", "Pet mouse", "Token from your parents", "Common clothes"],
    startingGoldGp: 10,
    personality: {
      trait: ["I hide scraps of food and trinkets in my pockets.", "I ask a lot of questions.", "I bluntly say what other people only hint at."],
      ideal: ["Respect. All people deserve dignity.", "Community. We have to take care of each other.", "Retribution. The rich need to be shown what life is like in the gutters."],
      bond: ["My town or city is my home, and I'll fight to defend it.", "I sponsor an orphanage to keep others from enduring what I did.", "No one else should have to endure the hardships I've been through."],
      flaw: ["If I'm outnumbered, I run away from a fight.", "Gold seems like a lot of money to me, and I'll do just about anything for more.", "I will never fully trust anyone other than myself."],
    },
  },
  {
    id: "folk-hero",
    name: "Folk Hero",
    skills: ["Animal Handling", "Survival"],
    tools: ["One artisan's tools", "Vehicles (land)"],
    equipment: ["Artisan's tools", "Shovel", "Iron pot", "Common clothes"],
    startingGoldGp: 10,
    personality: {
      trait: ["I judge people by their actions, not words.", "If someone is in trouble, I'm always ready to lend help.", "I'm confident in my own abilities and do what I can to instill confidence in others."],
      ideal: ["Respect. People deserve to be treated with dignity.", "Fairness. No one should get special treatment before the law.", "Sincerity. There's no good in pretending to be something I'm not."],
      bond: ["I have a family, but I have no idea where they are.", "I worked the land, I love the land, and I will protect the land.", "A proud noble once gave me a horrible beating, and I will take revenge."],
      flaw: ["The tyrant who rules my land will stop at nothing to see me killed.", "I'm convinced of the significance of my destiny.", "I have trouble trusting my allies."],
    },
  },
];
