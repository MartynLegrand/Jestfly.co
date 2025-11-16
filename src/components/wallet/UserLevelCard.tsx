
import React from "react";
import { UserLevel } from "@/types/rewards";
import GlassCard from "@/components/ui/GlassCard";
import { Trophy, Star, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface UserLevelCardProps {
  userLevel: UserLevel | null;
  nextLevel?: { level: number; xp_required: number } | null;
}

const UserLevelCard: React.FC<UserLevelCardProps> = ({ userLevel, nextLevel }) => {
  if (!userLevel) {
    return (
      <GlassCard className="p-6 animate-pulse">
        <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
        <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
        <div className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded-full mb-2"></div>
        <div className="flex justify-between">
          <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </GlassCard>
    );
  }

  const { level, experience_points, level_info } = userLevel;
  const currentXp = experience_points;
  const nextXpRequired = nextLevel?.xp_required || 0;
  const currentXpRequired = level_info?.xp_required || 0;
  
  // Calculate XP needed for the next level
  const xpForCurrentLevel = currentXpRequired;
  const xpForNextLevel = nextLevel?.xp_required || currentXpRequired + 100;
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
  const currentLevelProgress = xpNeededForNextLevel > 0 
    ? ((currentXp - xpForCurrentLevel) / xpNeededForNextLevel) * 100 
    : 100;

  return (
    <GlassCard className="p-6 overflow-hidden relative">
      {/* Badge in the corner */}
      <div className="absolute top-0 right-0 bg-primary text-primary-foreground py-1 px-3 rounded-bl-lg text-xs font-medium">
        LEVEL {level}
      </div>
      
      <div className="flex items-center text-muted-foreground mb-2">
        <Trophy className="h-4 w-4 mr-1" />
        <span className="text-sm">Your Level</span>
      </div>
      
      <h2 className="text-2xl font-bold mb-3">
        {level_info?.benefits?.title || `Level ${level}`}
      </h2>
      
      <div className="mb-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Current XP: {currentXp}</span>
          {nextLevel && <span>Next level: {nextXpRequired} XP</span>}
        </div>
        <Progress value={currentLevelProgress} className="h-2" />
      </div>
      
      {level_info?.benefits?.features && level_info.benefits.features.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center text-muted-foreground mb-2">
            <Star className="h-4 w-4 mr-1" />
            <span className="text-sm">Benefits</span>
          </div>
          <ul className="text-sm space-y-1">
            {level_info.benefits.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {nextLevel && (
        <div className="mt-4 text-sm flex items-center text-muted-foreground">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span>
            <strong>{xpNeededForNextLevel} XP</strong> needed for Level {nextLevel.level}
          </span>
        </div>
      )}
    </GlassCard>
  );
};

export default UserLevelCard;
