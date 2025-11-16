
import React, { useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useExploreData, ExploreTab } from "./explore/useExploreData";
import TrendingPosts from "./explore/TrendingPosts";
import PeopleToFollow from "./explore/PeopleToFollow";
import SearchInput from "./explore/SearchInput";

const ExploreComponent = () => {
  const [activeTab, setActiveTab] = useState<ExploreTab>("trending");
  const [searchTerm, setSearchTerm] = useState("");
  
  const { filteredUsers, filteredPosts, isLoadingUsers, isLoadingPosts } = 
    useExploreData(activeTab, searchTerm);

  return (
    <div className="space-y-6">
      <GlassCard>
        <h2 className="text-2xl font-bold mb-6">Explore JESTFLY</h2>
        
        <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        <Tabs defaultValue="trending" onValueChange={(value) => setActiveTab(value as ExploreTab)}>
          <TabsList className="mb-6">
            <TabsTrigger value="trending">Trending Posts</TabsTrigger>
            <TabsTrigger value="people">People to Follow</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trending" className="space-y-6">
            <TrendingPosts 
              posts={filteredPosts} 
              isLoading={isLoadingPosts} 
            />
          </TabsContent>
          
          <TabsContent value="people">
            <PeopleToFollow 
              users={filteredUsers} 
              isLoading={isLoadingUsers} 
            />
          </TabsContent>
        </Tabs>
      </GlassCard>
    </div>
  );
};

export default ExploreComponent;
