import { QuestData } from "@/types/quest";
import { CinderGateQuest } from "./CinderGateQuest";
// import { FrozenWasteQuest } from "./FrozenWasteQuest"; // Example of how to add more

/**
 * 1. Add all your quest files to this array.
 * TypeScript will ensure every object here matches the QuestData interface.
 */
export const ALL_QUESTS: QuestData[] = [
  CinderGateQuest,
  // FrozenWasteQuest,
];

/**
 * 2. Helper to grab a random quest.
 * Perfect for the 'Start Quest' screen.
 */
export const getRandomQuest = (): QuestData => {
  const randomIndex = Math.floor(Math.random() * ALL_QUESTS.length);
  return ALL_QUESTS[randomIndex];
};

/**
 * 3. Optional: Helper to find a specific quest by ID
 * Useful if you want the user to pick a specific mission from a list.
 */
export const getQuestById = (id: string): QuestData | undefined => {
  return ALL_QUESTS.find((quest) => quest.id === id);
};
