
import React from "react";
import { UserAchievement, Achievement } from "@/types/rewards";
import GlassCard from "@/components/ui/GlassCard";
import { Award, Lock } from "lucide-react";
import { format } from "date-fns";

interface AchievementsGridProps {
  userAchievements: UserAchievement[];
  allAchievements: Achievement[];
}

const AchievementsGrid: React.FC<AchievementsGridProps> = ({ 
  userAchievements, 
  allAchievements 
}) => {
  // Create a map of earned achievements
  const earnedAchievementMap = new Map(
    userAchievements.map(ua => [ua.achievement_id, ua])
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {allAchievements.map(achievement => {
        const isEarned = earnedAchievementMap.has(achievement.id);
        const userAchievement = earnedAchievementMap.get(achievement.id);
        
        return (
          <GlassCard 
            key={achievement.id} 
            className={`p-4 ${isEarned ? 'border-primary' : 'opacity-75'}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isEarned ? 'bg-primary/20 text-primary' : 'bg-gray-200 dark:bg-gray-700 text-muted-foreground'
                }`}>
                  {isEarned ? (
                    <Award className="h-5 w-5" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">{achievement.name}</h3>
                  <p className="text-xs text-muted-foreground">Level {achievement.level}</p>
                </div>
              </div>
              <div className="text-lg font-semibold">
                +{achievement.reward_amount} JC
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">
              {achievement.description}
            </p>
            
            {isEarned && userAchievement?.earned_at && (
              <div className="text-xs text-primary mt-2">
                Earned on {format(new Date(userAchievement.earned_at), 'MMM dd, yyyy')}
              </div>
            )}
            
            {!isEarned && achievement.requirement_type && (
              <div className="text-xs text-muted-foreground mt-2">
                {achievement.requirement_type}: {achievement.requirement_count} required
              </div>
            )}
          </GlassCard>
        );
      })}
    </div>
  );
};

export default AchievementsGrid;
