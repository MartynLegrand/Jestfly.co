
import React, { useState, useEffect } from "react";
import { searchUsers } from "@/lib/wallet"; // Updated to import from the new wallet module
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import UserAvatar from "@/components/ui/UserAvatar";

interface UserSearchProps {
  selectedUser: any | null;
  onSelectUser: (user: any) => void;
  currentUserId?: string;
}

const UserSearch: React.FC<UserSearchProps> = ({ selectedUser, onSelectUser, currentUserId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Handle searching users
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const fetchUsers = async () => {
      setIsSearching(true);
      try {
        const results = await searchUsers(searchQuery);
        // Filter out current user from results
        const filteredResults = results.filter(u => u.id !== currentUserId);
        setSearchResults(filteredResults);
      } catch (error) {
        console.error("Error searching users:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, currentUserId]);

  return (
    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={openCombobox}
          className="w-full justify-between"
        >
          {selectedUser ? (
            <div className="flex items-center gap-2">
              <UserAvatar
                user={selectedUser}
                size="sm"
              />
              <span>{selectedUser.display_name || selectedUser.username}</span>
            </div>
          ) : (
            "Search for a user..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput
            placeholder="Search users..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          {isSearching && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
          {!isSearching && (
            <>
              <CommandEmpty>No users found</CommandEmpty>
              <CommandGroup>
                {searchResults.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.id}
                    onSelect={() => {
                      onSelectUser(user);
                      setOpenCombobox(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <UserAvatar
                        user={user}
                        size="sm"
                      />
                      <div>
                        <p className="text-sm font-medium">{user.display_name}</p>
                        <p className="text-xs text-muted-foreground">@{user.username}</p>
                      </div>
                    </div>
                    <Check
                      className={`ml-auto h-4 w-4 ${
                        selectedUser?.id === user.id ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default UserSearch;
