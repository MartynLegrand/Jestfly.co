
import React from "react";
import { useParams } from "react-router-dom";
import ProfileHeader from "./profile/ProfileHeader";
import ProfileLoading from "./profile/ProfileLoading";
import ProfileNotFound from "./profile/ProfileNotFound";
import UserProfileCard from "./UserProfileCard";
import UserInfoCard from "./profile/UserInfoCard";
import UserPostsSection from "./profile/UserPostsSection";
import { useUserProfile } from "./profile/useUserProfile";

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user, posts, isLoadingUser, isLoadingPosts, joinDate } = useUserProfile(id);

  if (isLoadingUser) {
    return <ProfileLoading />;
  }

  if (!user) {
    return <ProfileNotFound />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ProfileHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <UserProfileCard user={user} />
          <UserInfoCard user={user} joinDate={joinDate} />
        </div>
        
        <div className="md:col-span-2">
          <UserPostsSection 
            user={user} 
            posts={posts} 
            isLoading={isLoadingPosts}
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
