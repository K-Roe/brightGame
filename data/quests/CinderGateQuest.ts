import { QuestData } from "@/types/quest";

export const CinderGateQuest: QuestData = {
  id: "cinder_gate",
  title: "The Cinder-Gate Ritual",
  difficulty: "Easy",
  milestones: [
    {
      atKm: 0.0,
      text: "The iron gates creak open. Find the Altar of Sun.",
      type: "STORY",
    },
    {
      atKm: 0.05,
      text: "A Shadow Creeper blocks the path!",
      type: "BATTLE",
      monsterId: "shadow_creeper", // You can use this to pull specific monster stats
    },
    {
      atKm: 0.15,
      text: "You find the Altar. It's colder than you expected.",
      type: "STORY",
    },
  ],
  rewards: { xp: 100, gold: 50 },
};
