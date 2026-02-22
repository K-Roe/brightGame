// types/quest.ts

export type QuestMode = "WALKING" | "BATTLE" | "STORY_BREAK" | "LOOT";

export type MilestoneType = "STORY" | "BATTLE" | "REWARD";

export interface QuestMilestone {
  atKm: number; // The distance trigger (e.g., 0.05)
  text: string; // The text that appears in the Journal
  type: MilestoneType;
  monsterId?: string; // Optional: specific monster for this milestone
}

export interface QuestData {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Legendary";
  milestones: QuestMilestone[];
  rewards: {
    xp: number;
    gold: number;
    items?: string[];
  };
}

export interface LocationCoord {
  latitude: number;
  longitude: number;
}
