import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  /** Custom photo URL. If provided, takes priority over generated avatar */
  src?: string | null;
  /** User's display name - used for avatar generation and fallback initials */
  name: string;
  /** Optional user ID for more unique avatar generation */
  id?: number | string;
  className?: string;
  fallbackClassName?: string;
}

/**
 * User avatar component that uses Vercel's avatar.vercel.sh service
 * for generating unique, colorful geometric avatars when no custom photo is set.
 */
export function UserAvatar({ src, name, id, className, fallbackClassName }: UserAvatarProps) {
  const initials = name.slice(0, 2).toUpperCase();
  
  // Use Vercel's avatar service for generated avatars
  // If user has custom photo, use that. Otherwise generate from name/id
  const avatarSrc = src || `https://avatar.vercel.sh/${encodeURIComponent(id ?? name)}`;

  return (
    <Avatar className={className}>
      <AvatarImage src={avatarSrc} alt={name} />
      <AvatarFallback 
        className={cn(
          "bg-white/10 text-white font-black text-sm tracking-tight",
          fallbackClassName
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
