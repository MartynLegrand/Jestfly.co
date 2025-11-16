
import React from "react";
import { UserProfile } from "@/types";
import GlassCard from "@/components/ui/GlassCard";
import { Skeleton } from "@/components/ui/skeleton";
import UserProfileCard from "../UserProfileCard";

interface PeopleToFollowProps {
  users: UserProfile[];
  isLoading: boolean;
}

const PeopleToFollow = ({ users, isLoading }: PeopleToFollowProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <GlassCard key={i} className="animate-pulse">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-10 w-20" />
            </div>
          </GlassCard>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="col-span-full text-center py-8 text-muted-foreground">
        <p>No users found</p>
        <p className="text-sm mt-1">Try different search terms</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {users.map(user => (
        <UserProfileCard key={user.id} user={user} minimal />
      ))}
    </div>
  );
};

export default PeopleToFollow;
