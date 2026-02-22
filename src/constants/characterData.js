export const CLASS_STATS = {
  Warrior: {
    str: 10,
    dex: 4,
    agi: 5,
    int: 2,
    desc: "High strength. Perfect for heavy lifting and push-ups.",
  },
  Mage: {
    str: 2,
    dex: 3,
    agi: 4,
    int: 10,
    desc: "Master of focus. Great for meditation and mental discipline.",
  },
  Rogue: {
    str: 4,
    dex: 10,
    agi: 8,
    int: 4,
    desc: "Fast and nimble. Ideal for high-intensity interval training.",
  },
  Cleric: {
    str: 6,
    dex: 4,
    agi: 4,
    int: 8,
    desc: "Balanced and resilient. Best for steady, consistent recovery.",
  },
  Ranger: {
    str: 4,
    dex: 7,
    agi: 10,
    int: 5,
    desc: "The distance specialist. Built for long runs and walking.",
  },
};

export const CLASS_ITEMS = {
  Warrior: [
    {
      name: "Wooden Sword",
      description: "A sturdy wooden blade for beginners.",
      icon: "⚔️",
    },
    {
      name: "Wooden Shield",
      description: "A solid shield for basic protection.",
      icon: "🛡️",
    },
    {
      name: "Rusty Plate",
      description: "Heavy but dependable metal chestpiece.",
      icon: "👕",
    },
  ],
  Mage: [
    {
      name: "Magic Staff",
      description: "A wooden staff imbued with arcane energy.",
      icon: "🪄",
    },
    {
      name: "Beginner Spellbook",
      description: "Contains basic incantations for focus.",
      icon: "📖",
    },
    {
      name: "Apprentice Robe",
      description: "Light cloth that allows for easy movement.",
      icon: "🥋",
    },
  ],
  Rogue: [
    {
      name: "Shadow Dagger",
      description: "A swift, silent blade for stealth.",
      icon: "🗡️",
    },
    {
      name: "Throwing Knives",
      description: "Small blades for quick secondary attacks.",
      icon: "🎯",
    },
    {
      name: "Dark Leather",
      description: "Reinforced leather dyed for the shadows.",
      icon: "🧥",
    },
  ],
  Cleric: [
    {
      name: "Healing Mace",
      description: "A mace that channels restoration power.",
      icon: "🔨",
    },
    {
      name: "Silver Rosary",
      description: "A holy relic to boost prayer strength.",
      icon: "📿",
    },
    {
      name: "Blessed Vestments",
      description: "Sacred robes protected by divine grace.",
      icon: "👗",
    },
  ],
  Ranger: [
    {
      name: "Longbow",
      description: "A powerful bow for ranged combat.",
      icon: "🏹",
    },
    {
      name: "Hunting Knife",
      description: "A sharp tool for close encounters.",
      icon: "🔪",
    },
    {
      name: "Scout Tunic",
      description: "Camouflaged gear for forest trekking.",
      icon: "🎽",
    },
  ],
};
export const HEROS_CLASSES = Object.keys(CLASS_STATS);
