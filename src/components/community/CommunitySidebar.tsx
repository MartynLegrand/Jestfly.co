
import { UserProfile } from "@/types";
import GlassCard from "@/components/ui/GlassCard";
import UserProfileCard from "@/components/community/UserProfileCard";

interface CommunitySidebarProps {
  trendingTopics: string[];
}

const CommunitySidebar = ({ trendingTopics }: CommunitySidebarProps) => {
  // Mock data
  const suggestedUsers: UserProfile[] = [
    { id: "1", display_name: "Maya Beats", username: "mayabeats", profile_type: "artist" as const, avatar_url: "/avatars/artist1.jpg", wallet_id: "1" },
    { id: "2", display_name: "Tom's Studio", username: "tomstudio", profile_type: "collaborator" as const, avatar_url: "/avatars/collab1.jpg", wallet_id: "2" },
    { id: "3", display_name: "Music Lover", username: "musiclover42", profile_type: "fan" as const, avatar_url: "/avatars/fan1.jpg", wallet_id: "3" },
  ];

  return (
    <div className="space-y-6">
      <GlassCard>
        <h2 className="font-semibold mb-4">Trending Topics</h2>
        <div className="flex flex-wrap gap-2">
          {trendingTopics.map((topic) => (
            <div
              key={topic}
              className="px-3 py-1 bg-secondary hover:bg-secondary/80 cursor-pointer rounded-full text-sm transition-colors"
            >
              {topic}
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="font-semibold mb-4">Suggested Connections</h2>
        <div className="space-y-4">
          {suggestedUsers.map((profile) => (
            <UserProfileCard 
              key={profile.id}
              user={profile}
              minimal
            />
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default CommunitySidebar;
