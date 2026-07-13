window.DND_DATA = window.DND_DATA || {};

const charlatanConTools = [
  "Ten stoppered bottles containing colored liquid",
  "Weighted dice",
  "Marked playing cards",
  "Signet ring from an imaginary noble",
];

const charlatanSchemes = [
  "Cheat at games of chance",
  "Alter coins or forge documents",
  "Gain someone's trust to exploit a weakness",
  "Frequently assume new identities",
  "Perform street-corner sleight-of-hand cons",
  "Sell worthless goods as valuable merchandise",
];

const entertainerFavors = [
  "Love letter",
  "Lock of hair",
  "Trinket from an admirer",
];

const entertainerRoutines = [
  "Actor",
  "Dancer",
  "Fire-Eater",
  "Jester",
  "Juggler",
  "Instrumentalist",
  "Poet",
  "Singer",
  "Storyteller",
  "Tumbler",
];

const guildBusinesses = [
  "Alchemists and apothecaries",
  "Armorers, locksmiths, and finesmiths",
  "Brewers, distillers, and vintners",
  "Calligraphers, scribes, and scriveners",
  "Carpenters, roofers, and plasterers",
  "Cartographers, surveyors, and chart-makers",
  "Cobblers and shoemakers",
  "Cooks and bakers",
  "Glassblowers and glaziers",
  "Jewelers and gemcutters",
  "Leatherworkers, skinners, and tanners",
  "Masons and stonecutters",
  "Painters, limners, and sign-makers",
  "Potters and tile-makers",
  "Shipwrights and sailmakers",
  "Smiths and metal-forgers",
  "Tinkers, pewterers, and casters",
  "Wagon-makers and wheelwrights",
  "Weavers and dyers",
  "Woodcarvers, coopers, and bowyers",
];

const criminalSpecialties = [
  "Blackmailer",
  "Burglar",
  "Enforcer",
  "Fence",
  "Highway robber",
  "Hired killer",
  "Pickpocket",
  "Smuggler",
];

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
    description: "You survived through underworld contacts, practiced schemes, and work outside the law.",
    skills: ["Deception", "Stealth"],
    tools: ["One gaming set", "Thieves' tools"],
    choiceGroups: [
      { id: "criminal-gaming-set", label: "Gaming Set", category: "gaming", required: true, helper: "Pick the gaming set tied to your criminal work." },
      { id: "criminal-specialty", label: "Criminal Specialty", category: "option", required: true, options: criminalSpecialties, helper: "Choose the underworld specialty you are known for." },
    ],
    equipment: ["Crowbar", "Dark common clothes with hood"],
    startingGoldGp: 15,
    feature: {
      name: "Criminal Contact",
      description: "You know how to reach a reliable contact who can carry messages through criminal networks.",
    },
    variants: [
      { id: "standard", name: "Criminal", label: "Standard: Criminal" },
      {
        id: "spy",
        name: "Spy",
        label: "Variant: Spy",
        variantLabel: "Criminal Variant",
        description: "You used criminal-style skills for espionage, intelligence gathering, infiltration, or the sale of secrets.",
        feature: {
          name: "Criminal Contact",
          description: "You can reach an informant, handler, intelligence connection, or underworld source who can pass messages discreetly.",
        },
        choiceOverrides: {
          "criminal-specialty": { label: "Specialty", helper: "Choose the specialty that supports your covert work." },
        },
        optionalDetails: [
          { id: "spyAlias", label: "Spy Alias", placeholder: "Alias, cover identity, or code name" },
          { id: "spyHandler", label: "Agency, Employer, or Handler", placeholder: "Handler, patron, network, crown, or employer" },
        ],
      },
    ],
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
  {
    id: "acolyte",
    name: "Acolyte",
    description: "You served a temple, shrine, or religious community before adventuring.",
    skills: ["Insight", "Religion"],
    choiceGroups: [
      { id: "acolyte-language-1", label: "Acolyte Language 1", category: "language", required: true, helper: "Pick a language learned through religious service." },
      { id: "acolyte-language-2", label: "Acolyte Language 2", category: "language", required: true, helper: "Pick a second language learned through religious service." },
      { id: "acolyte-prayer-item", label: "Prayer Item", category: "option", required: true, options: ["Prayer book", "Prayer wheel"], helper: "Choose the devotional item your Acolyte carries." },
    ],
    optionalDetails: [
      { id: "acolyteFaith", label: "Deity, Faith, or Philosophy", placeholder: "Optional deity, faith, cosmic force, or philosophy" },
    ],
    equipment: ["Holy symbol", "5 sticks of incense", "Vestments", "Common clothes"],
    startingGoldGp: 15,
    feature: {
      name: "Shelter of the Faithful",
      description: "Members of your faith can usually provide modest food, lodging, and support when you are near a temple or community that honors your beliefs.",
    },
    personality: {
      trait: ["I quote sacred teachings in everyday conversation.", "I look for omens in ordinary events.", "I try to see the divine spark in everyone.", "I am patient with honest doubt.", "I am uncomfortable around open disrespect for faith.", "I speak softly until my beliefs are challenged.", "I treat rituals as anchors in a chaotic world.", "I am eager to debate theology with anyone willing to listen."],
      ideal: ["Tradition. Ancient rites preserve hard-won wisdom.", "Charity. Those with strength must aid those without it.", "Change. Faith should guide people toward a better world.", "Power. Divine favor proves who should lead.", "Faith. Trust in higher truth can carry us through fear.", "Aspiration. I seek to be worthy of the teachings I follow."],
      bond: ["The temple that raised me is my true home.", "I owe my life to the priest who took me in.", "I protect a relic entrusted to my care.", "I seek proof of a vision I received.", "My faith community depends on what I discover.", "I left someone behind who still needs my help."],
      flaw: ["I judge harshly those who reject my beliefs.", "I sometimes mistake ritual for compassion.", "I am naive about worldly schemes.", "I hide doubts I am afraid to admit.", "I trust religious authority too easily.", "I can be inflexible when doctrine is involved."],
    },
  },
  {
    id: "sage",
    name: "Sage",
    description: "You spent years studying lore, records, formulas, or forgotten histories.",
    skills: ["Arcana", "History"],
    choiceGroups: [
      { id: "sage-language-1", label: "Sage Language 1", category: "language", required: true, helper: "Pick a language learned through study." },
      { id: "sage-language-2", label: "Sage Language 2", category: "language", required: true, helper: "Pick a second language learned through study." },
      { id: "sage-specialty", label: "Sage Specialty", category: "option", required: true, options: ["Alchemist", "Astronomer", "Discredited Academic", "Librarian", "Professor", "Researcher", "Wizard's Apprentice", "Scribe"], helper: "Choose the field that shaped your studies." },
    ],
    equipment: ["Bottle of black ink", "Quill", "Small knife", "Letter from a deceased colleague containing an unanswered question", "Common clothes"],
    startingGoldGp: 10,
    feature: {
      name: "Researcher",
      description: "When you do not know a piece of lore, you often know where and from whom it could be learned.",
    },
    personality: {
      trait: ["I use precise words even when simple ones would do.", "I get excited by obscure facts.", "I am more comfortable in libraries than taverns.", "I ask questions until people become impatient.", "I take careful notes about everything unusual.", "I value a good argument more than easy agreement.", "I often forget practical concerns while thinking.", "I treat mysteries like invitations."],
      ideal: ["Knowledge. Truth is worth pursuing for its own sake.", "Beauty. A brilliant idea is a work of art.", "Logic. Reason should overcome fear and superstition.", "No Limits. Forbidden knowledge is still knowledge.", "Power. Information is leverage.", "Self-Improvement. Study should make me better than I was."],
      bond: ["I must answer a question my mentor could not solve.", "A library or school gave me my purpose.", "I protect notes that dangerous people want.", "I seek a lost text central to my research.", "My reputation was ruined, and I will restore it.", "A student or colleague depends on my discoveries."],
      flaw: ["I dismiss people who lack formal education.", "I overlook danger when knowledge is at stake.", "I hoard information instead of sharing it.", "I am easily baited by intellectual challenges.", "I trust books more than people.", "I struggle to admit when I am wrong."],
    },
  },
  {
    id: "noble",
    name: "Noble",
    description: "You were born or adopted into wealth, title, or recognized privilege.",
    skills: ["History", "Persuasion"],
    choiceGroups: [
      { id: "noble-gaming-set", label: "Gaming Set", category: "gaming", required: true, helper: "Pick a gaming set common among your peers." },
      { id: "noble-language-1", label: "Noble Language", category: "language", required: true, helper: "Pick a language learned through education or courtly life." },
    ],
    optionalDetails: [
      { id: "nobleTitle", label: "Noble Title", placeholder: "Baroness, Lord, heir, minor noble..." },
      { id: "nobleHouse", label: "Family or House", placeholder: "House name, lineage, or influential family" },
    ],
    variants: [
      { id: "standard", name: "Noble", label: "Standard: Noble" },
      {
        id: "knight",
        name: "Knight",
        label: "Variant: Knight",
        variantLabel: "Noble Variant",
        description: "You carry noble standing through service, chivalric duty, and a small household retinue.",
        feature: {
          name: "Retainers",
          description: "You have one noble squire and two additional retainers. They can handle ordinary support tasks, but they are not combat companions or extra player-controlled fighters; dangerous participation remains subject to the feature and the DM.",
        },
        optionalDetails: [
          { id: "squireName", label: "Squire Name", placeholder: "Name of your squire" },
          { id: "squireRole", label: "Squire Role or Description", placeholder: "Carries the family banner, tends armor..." },
          { id: "retainer2Name", label: "Retainer 1 Name", placeholder: "Name of another retainer" },
          { id: "retainer2Role", label: "Retainer 1 Role or Description", placeholder: "Cook, herald, groom, valet..." },
          { id: "retainer3Name", label: "Retainer 2 Name", placeholder: "Name of another retainer" },
          { id: "retainer3Role", label: "Retainer 2 Role or Description", placeholder: "Servant, messenger, quartermaster..." },
        ],
      },
    ],
    equipment: ["Fine clothes", "Signet ring", "Scroll of pedigree"],
    startingGoldGp: 25,
    feature: {
      name: "Position of Privilege",
      description: "People tend to recognize your status, and high society is more likely to grant you access, audience, or respectful treatment.",
    },
    personality: {
      trait: ["My manners are polished even under pressure.", "I expect comfort but can endure hardship when pride demands it.", "I speak as though people are listening.", "I am generous when it costs me little.", "I remember every slight against my house.", "I enjoy the responsibilities of rank.", "I try to prove I am more than my title.", "I treat etiquette as a useful weapon."],
      ideal: ["Respect. Nobility must be earned through conduct.", "Responsibility. Rank exists to protect those below it.", "Independence. I will not be trapped by family expectations.", "Power. Authority belongs in capable hands.", "Family. Blood and house come before all else.", "Noblesse Oblige. Privilege means duty."],
      bond: ["My house's honor rests on my actions.", "I must secure an alliance important to my family.", "A commoner once showed me true loyalty.", "I carry proof of my lineage wherever I go.", "I will reclaim standing my family lost.", "My sibling or heir is counting on me."],
      flaw: ["I secretly believe I deserve special treatment.", "I cannot resist courtly gossip.", "I underestimate people of lower station.", "I spend money to avoid embarrassment.", "I am terrified of disgracing my family.", "I hold grudges behind a courteous smile."],
    },
  },
  {
    id: "hermit",
    name: "Hermit",
    description: "You lived apart from society in solitude, contemplation, or hidden service.",
    skills: ["Medicine", "Religion"],
    tools: ["Herbalism kit"],
    choiceGroups: [
      { id: "hermit-language-1", label: "Hermit Language", category: "language", required: true, helper: "Pick a language learned during your seclusion." },
      { id: "hermit-seclusion", label: "Life of Seclusion", category: "option", required: true, options: ["Seeking spiritual enlightenment", "Living communally under a religious order", "Exile for an alleged or actual crime", "Retreat after a life-changing event", "Seeking solitude to complete important work", "Communing with nature", "Protecting an ancient site or relic", "Undertaking a personal pilgrimage"], helper: "Choose what led you away from ordinary society." },
    ],
    optionalDetails: [
      { id: "hermitDiscovery", label: "Your Discovery", placeholder: "Describe the revelation or secret with your DM" },
    ],
    equipment: ["Scroll case filled with notes from studies or prayers", "Winter blanket", "Common clothes", "Herbalism kit"],
    startingGoldGp: 5,
    feature: {
      name: "Discovery",
      description: "Your isolation revealed an important truth, location, omen, or secret. Work with your DM to decide what it means.",
    },
    personality: {
      trait: ["I am unused to crowded places.", "I speak slowly because I choose words carefully.", "I find meaning in silence.", "I am blunt about what truly matters.", "I keep simple routines no matter where I travel.", "I am fascinated by ordinary city life.", "I prefer listening to speaking.", "I treat solitude as a source of strength."],
      ideal: ["Greater Good. My discovery must help others.", "Logic. Emotion clouds the truth I found.", "Free Thinking. Isolation freed me from old assumptions.", "Power. My secret can reshape the world.", "Live and Let Live. People should find their own paths.", "Self-Knowledge. The hardest truth is within."],
      bond: ["I protect the place where I made my discovery.", "A quiet community sheltered me in my seclusion.", "I must share my revelation with the right person.", "I left someone behind to pursue solitude.", "An ancient site or relic is under my care.", "My pilgrimage is not yet complete."],
      flaw: ["I distrust institutions and crowds.", "I speak of my discovery at the wrong times.", "I can be stubborn about my interpretation of signs.", "I neglect practical needs during contemplation.", "I avoid intimacy by retreating into solitude.", "I believe my suffering made me wiser than others."],
    },
  },
  {
    id: "charlatan",
    name: "Charlatan",
    description: "You learned to survive by invention, misdirection, and a convincing false face.",
    skills: ["Deception", "Sleight of Hand"],
    tools: ["Disguise kit", "Forgery kit"],
    choiceGroups: [
      { id: "charlatan-con-tool", label: "Con Tool", category: "option", required: true, equipment: true, options: charlatanConTools, helper: "Choose the physical item your Charlatan uses for scams." },
      { id: "charlatan-favorite-scheme", label: "Favorite Scheme", category: "option", required: true, options: charlatanSchemes, helper: "Choose the kind of con your Charlatan is best known for." },
    ],
    optionalDetails: [
      { id: "falseIdentityName", label: "False Identity Name", placeholder: "Alias, assumed name, or invented noble title" },
      { id: "falseIdentityRole", label: "False Identity Role", placeholder: "Merchant, minor noble, priest, scholar..." },
    ],
    equipment: ["Fine clothes", "Disguise kit"],
    startingGoldGp: 15,
    feature: {
      name: "False Identity",
      description: "You have built a second identity with documents, contacts, and practiced habits that help you pass as someone else.",
    },
    personality: {
      trait: ["I fall into a new persona as easily as changing clothes.", "I keep a friendly smile ready even when lying.", "I collect rumors the way others collect coins.", "I never tell the whole truth when a smaller lie will do.", "I admire a clever trick even when it is used against me.", "I make people feel like they are in on the secret.", "I always know the nearest exit.", "I treat every conversation as a possible opportunity."],
      ideal: ["Independence. I owe nothing to people who would chain me down.", "Fairness. I only cheat those who can afford the lesson.", "Charity. A good scam can fund a good cause.", "Creativity. A beautiful lie is a work of art.", "Friendship. My partners are worth more than any score.", "Aspiration. I will become the person I pretend to be."],
      bond: ["I swindled the wrong person and still owe a dangerous debt.", "My false identity protects someone I care about.", "A former partner vanished with my share of a job.", "I keep a token from the first mark I ever fooled.", "Someone saw through my best disguise, and I need to know how.", "I plan one last grand deception that will settle everything."],
      flaw: ["I cannot resist a mark who thinks they are smarter than me.", "I lie even when truth would be easier.", "I spend windfalls faster than I earn them.", "I trust charm more than planning.", "I keep too many false identities straight in my head.", "I struggle to believe anyone is honest with me."],
    },
  },
  {
    id: "entertainer",
    name: "Entertainer",
    description: "You lived by performance, applause, and the art of holding a crowd's attention.",
    skills: ["Acrobatics", "Performance"],
    tools: ["Disguise kit", "One musical instrument"],
    variants: [
      { id: "standard", name: "Entertainer", label: "Standard: Entertainer" },
      {
        id: "gladiator",
        name: "Gladiator",
        label: "Variant: Gladiator",
        variantLabel: "Entertainer Variant",
        description: "You turned contests, staged combat, and dangerous spectacle into a public performance.",
        feature: {
          name: "By Popular Demand",
          description: "You can usually find arenas, fighting clubs, or combat-entertainment venues willing to host you, often earning modest food and lodging while you perform.",
        },
        choiceOverrides: {
          "entertainer-instrument": { equipment: false, helper: "Choose the musical instrument proficiency your Gladiator learned. This does not add a carried instrument." },
        },
        removeChoiceIds: ["entertainer-routine-1"],
        addChoiceGroups: [
          { id: "gladiator-weapon", label: "Gladiator Weapon", category: "equipmentItem", required: true, equipment: true, itemIds: ["net", "trident", "whip"], helper: "Choose the show weapon included in your Gladiator equipment." },
        ],
        fixedChoices: [
          { id: "gladiator-routine", label: "Entertainer Routine 1", category: "option", value: "Gladiator" },
        ],
        replaceOptionalDetails: true,
        optionalDetails: [
          { id: "arenaName", label: "Arena Name", placeholder: "Arena, fighting pit, troupe, or circuit" },
        ],
      },
    ],
    choiceGroups: [
      { id: "entertainer-instrument", label: "Musical Instrument", category: "musical", required: true, equipment: true, preventDuplicates: true, helper: "Choose the instrument your Entertainer is proficient with and carries." },
      { id: "entertainer-favor", label: "Favor from an Admirer", category: "option", required: true, equipment: true, options: entertainerFavors, helper: "Choose the keepsake an admirer gave you." },
      { id: "entertainer-routine-1", label: "Entertainer Routine 1", category: "option", required: true, uniqueGroup: "entertainer-routines", options: entertainerRoutines, helper: "Choose at least one routine you perform." },
      { id: "entertainer-routine-2", label: "Entertainer Routine 2", category: "option", required: true, optionalRoutine: true, removable: true, uniqueGroup: "entertainer-routines", options: entertainerRoutines, helper: "Choose a different routine, or remove this row." },
      { id: "entertainer-routine-3", label: "Entertainer Routine 3", category: "option", required: true, optionalRoutine: true, removable: true, uniqueGroup: "entertainer-routines", options: entertainerRoutines, helper: "Choose a different routine, or remove this row." },
    ],
    optionalDetails: [
      { id: "stageName", label: "Stage Name", placeholder: "The name people know from the stage" },
    ],
    equipment: ["Costume"],
    startingGoldGp: 15,
    feature: {
      name: "By Popular Demand",
      description: "You can usually find a place to perform, earning modest lodging and attention in communities that value entertainment.",
    },
    personality: {
      trait: ["I know how to make an entrance.", "I practice lines, songs, or movements whenever I am idle.", "I love an audience, even an audience of one.", "I turn awkward moments into jokes.", "I remember faces from every crowd.", "I exaggerate stories until they sparkle.", "I am generous with praise for other performers.", "I get restless when no one is watching."],
      ideal: ["Beauty. Art can make even hard lives brighter.", "Tradition. Old songs and stories deserve to be carried forward.", "Creativity. The world improves when people make something new.", "People. A performance belongs to the crowd as much as the artist.", "Honesty. The stage reveals truths ordinary speech hides.", "Fame. I want my name remembered."],
      bond: ["My troupe was my family, and I still protect them.", "A patron gave me my first chance, and I owe them.", "I seek a lost song, script, or routine tied to my mentor.", "A rival performer pushes me to become better.", "I perform to honor someone who can no longer do so.", "My instrument or costume carries deep personal meaning."],
      flaw: ["I need applause more than I admit.", "I take criticism badly.", "I chase dramatic choices when practical ones would do.", "I flirt with trouble for a better story.", "I envy performers who outshine me.", "I promise more than I can deliver."],
    },
  },
  {
    id: "guild-artisan",
    name: "Guild Artisan",
    description: "You trained in a respected trade and belong to a guild, cartel, or professional association.",
    skills: ["Insight", "Persuasion"],
    tools: ["One artisan's tools"],
    variants: [
      { id: "standard", name: "Guild Artisan", label: "Standard: Guild Artisan" },
      {
        id: "guild-merchant",
        name: "Guild Merchant",
        label: "Variant: Guild Merchant",
        variantLabel: "Guild Artisan Variant",
        description: "You belong to a guild network of merchants, traders, caravan operators, shopkeepers, or commercial agents.",
        tools: [],
        equipment: ["Letter of introduction from the guild", "Traveler's clothes"],
        equipmentItems: ["mule", "cart"],
        feature: {
          name: "Guild Membership",
          description: "Your merchant guild can provide trade contacts, lodging, market introductions, and professional support while you remain in good standing.",
        },
        removeChoiceIds: ["guild-artisan-tools"],
        addChoiceGroups: [
          { id: "guild-merchant-training", label: "Merchant Training", category: "option", required: true, options: ["Navigator's Tools proficiency", "One additional language"], grantsTool: { "Navigator's Tools proficiency": "Navigator's tools" }, helper: "Choose whether your merchant training focused on navigation or languages." },
          { id: "guild-merchant-extra-language", label: "Additional Guild Merchant Language", category: "language", required: true, requiresChoice: { id: "guild-merchant-training", value: "One additional language" }, helper: "Pick the extra language learned in place of artisan's tools." },
        ],
        optionalDetails: [
          { id: "primaryTradeRoute", label: "Primary Trade, Shop, or Route", placeholder: "Caravan route, shop, imported goods, or trade specialty" },
        ],
      },
    ],
    choiceGroups: [
      { id: "guild-artisan-tools", label: "Artisan's Tools", category: "artisan", required: true, equipment: true, preventDuplicates: true, helper: "Choose the tools you are trained with and carry." },
      { id: "guild-artisan-language", label: "Guild Artisan Language", category: "language", required: true, helper: "Pick a language learned through guild dealings or travel." },
      { id: "guild-business", label: "Guild Business", category: "option", required: true, options: guildBusinesses, helper: "Choose the trade or guild work that shaped your background." },
    ],
    optionalDetails: [
      { id: "guildName", label: "Guild Name", placeholder: "Guild, trade house, cartel, or professional circle" },
    ],
    equipment: ["Letter of introduction from the guild", "Traveler's clothes"],
    startingGoldGp: 15,
    feature: {
      name: "Guild Membership",
      description: "Your guild can offer contacts, lodging, professional support, and a recognized place in trade society when you stay in good standing.",
    },
    personality: {
      trait: ["I judge work by its craft, not its price.", "I talk shop whenever someone shows interest.", "I keep my tools cleaner than my clothes.", "I bargain carefully and remember every deal.", "I am proud of honest labor.", "I notice flaws in objects before I notice their beauty.", "I treat apprentices with patience.", "I like knowing who made the things around me."],
      ideal: ["Community. A guild protects people who would be powerless alone.", "Generosity. Skilled hands should help those in need.", "Freedom. No guild should control every worker's life.", "Greed. My craft should make me rich.", "People. The customer matters more than the rules.", "Aspiration. I will become a master whose work lasts."],
      bond: ["My guild sponsored me, and I must prove worthy.", "I need to repay debts from my apprenticeship.", "A master craftsperson taught me everything I know.", "My workshop or guildhall is my true home.", "A rival guild wronged my people.", "I carry plans for a masterpiece I have not finished."],
      flaw: ["I look down on shoddy work and those who accept it.", "I can be stubborn about guild rules.", "I haggle even when it annoys my friends.", "I hide mistakes instead of admitting them.", "I measure people's worth by their usefulness.", "I take professional insults personally."],
    },
  },
  {
    id: "sailor",
    name: "Sailor",
    description: "You worked aboard ships, learned the sea's moods, and survived through discipline and hard labor.",
    skills: ["Athletics", "Perception"],
    tools: ["Navigator's tools", "Vehicles (water)"],
    equipment: ["50 feet of silk rope", "Lucky charm", "Common clothes"],
    equipmentItems: ["belayingPin"],
    startingGoldGp: 10,
    optionalDetails: [
      { id: "shipName", label: "Ship Name", placeholder: "The ship you served aboard" },
      { id: "formerShipRole", label: "Former Ship Role", placeholder: "Deckhand, navigator, cook, lookout..." },
    ],
    variants: [
      { id: "standard", name: "Sailor", label: "Standard: Sailor" },
      {
        id: "pirate",
        name: "Pirate",
        label: "Variant: Pirate",
        variantLabel: "Sailor Variant",
        description: "You learned the sailor's trade under a feared reputation for raids, smuggling, or life outside lawful ports.",
        feature: {
          name: "Bad Reputation",
          description: "Your feared reputation may let you get away with minor misconduct in civilized settlements because ordinary people hesitate to report or confront you. It does not protect you from serious crimes, authorities, or all consequences.",
        },
        optionalDetails: [
          { id: "pirateAlias", label: "Pirate Alias", placeholder: "Name feared in ports or whispered by crews" },
        ],
      },
    ],
    feature: {
      name: "Ship's Passage",
      description: "You can usually secure free passage for yourself and companions on ships where your sailing skills are useful.",
    },
    personality: {
      trait: ["I speak in shipboard phrases without thinking.", "I am calm in storms and restless in stillness.", "I judge people by how they act under pressure.", "I keep my gear tied down and ready.", "I enjoy telling impossible sea stories.", "I respect a clear chain of command.", "I wake easily at strange sounds.", "I miss the horizon whenever I am inland too long."],
      ideal: ["Respect. A ship survives when everyone pulls their weight.", "Fairness. The crew shares hardship and reward alike.", "Freedom. The open sea is the only home that never traps me.", "Mastery. Skill and discipline conquer chaos.", "People. A loyal crew is worth more than treasure.", "Adventure. The next voyage should be stranger than the last."],
      bond: ["My old crew is family to me.", "I owe my life to the captain who took me aboard.", "I seek news of a ship that never returned.", "The sea took someone from me, and I remember them always.", "I carry a charm from my first voyage.", "A port town or island waits for my return."],
      flaw: ["I follow orders too quickly, even bad ones.", "I gamble when shore leave lasts too long.", "I distrust people who have never faced real weather.", "I drink to forget what happened at sea.", "I become reckless when someone questions my courage.", "I struggle to settle in one place."],
    },
  },
];

DND_DATA.getBackgroundOutcomes = function getBackgroundOutcomes() {
  return DND_DATA.backgrounds.flatMap((background) => {
    if (!background.variants || !background.variants.length) return [{ background, version: "", key: background.id }];
    return background.variants.map((version) => ({
      background,
      version: version.id,
      key: `${background.id}:${version.id}`,
    }));
  });
};

DND_DATA.randomBackgroundOutcome = function randomBackgroundOutcome(currentKey = "") {
  const outcomes = DND_DATA.getBackgroundOutcomes();
  const otherOutcomes = outcomes.filter((outcome) => outcome.key !== currentKey);
  return DND_DATA.randomChoice(otherOutcomes.length ? otherOutcomes : outcomes);
};
