
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "@/types";

interface UserAvatarProps {
  user?: Partial<UserProfile>;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const UserAvatar = ({ user, size = "md", className }: UserAvatarProps) => {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const getInitials = (displayName?: string) => {
    if (!displayName) return "U";
    return displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className || ""}`}>
      <AvatarImage src={user?.avatar} alt={user?.display_name || "User"} />
      <AvatarFallback className="bg-primary text-primary-foreground">
        {getInitials(user?.display_name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
