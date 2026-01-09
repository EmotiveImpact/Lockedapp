import { useState } from "react";
import { useHabits } from "@/hooks/use-habits";
import { useAuth } from "@/hooks/use-auth";
import { Settings, ChevronRight, Bell, Moon, Volume2, Shield, Mail, Lock, User as UserIcon, Download, Trash2, LogOut, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { UserAvatar } from "@/components/user-avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserName, exportUserData, deleteAccount, uploadProfilePhoto } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function ProfilePage() {
  const { user } = useHabits();
  const { logoutMutation } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const updateNameMutation = useMutation({
    mutationFn: updateUserName,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast({ title: "Name Updated", description: "Your display name has been changed." });
      setNewName(user.name);
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      toast({ title: "Account Deleted", description: "Your account has been permanently deleted." });
      setLocation("/auth");
    },
  });

  const handleExport = async () => {
    try {
      await exportUserData();
      toast({ title: "Data Exported", description: "Your data has been downloaded." });
    } catch (error) {
      toast({ title: "Export Failed", description: "Could not export data.", variant: "destructive" });
    }
  };

  const uploadPhotoMutation = useMutation({
    mutationFn: uploadProfilePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast({ title: "Photo Updated", description: "Your profile photo has been changed." });
    },
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File Too Large", description: "Please select an image under 2MB.", variant: "destructive" });
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      uploadPhotoMutation.mutate(base64);
    };
    reader.readAsDataURL(file);
  };

  const sections = [
    {
      title: "Account",
      icon: UserIcon,
      items: [
        { label: "Edit Name", icon: UserIcon, type: "action", action: () => setSettingsOpen(true) },
        { label: "Export Data", icon: Download, type: "action", action: handleExport },
      ]
    },
    {
      title: "Preferences",
      icon: Settings,
      items: [
        { label: "Notifications", icon: Bell, type: "switch" },
        { label: "Dark Mode", icon: Moon, type: "switch", defaultValue: true },
        { label: "Sound Effects", icon: Volume2, type: "switch" },
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-full pb-32 bg-black">
       {/* Header */}
       <header className="p-8 pb-0 border-b border-white/5 bg-gradient-to-b from-black/80 via-black/40 to-black/0 backdrop-blur-md sticky top-0 z-20 flex flex-col items-center relative">
        <div className="w-full flex items-center justify-center absolute top-8 px-6 left-0">
          <h1 className="text-5xl font-display font-black tracking-tighter italic leading-none uppercase whitespace-nowrap">LOCKED IN</h1>
        </div>

        <div className="mt-16 mb-4 flex flex-col items-center w-full px-4">
          <p className="text-muted-foreground text-[10px] uppercase tracking-[0.4em] font-black">SYSTEM STATUS: <span className="text-primary">LVL {user.level} ACTIVE</span></p>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Profile Header Card */}
        <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 flex items-center gap-6 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 blur-[60px] translate-x-1/2" />
            <div className="relative">
              <UserAvatar 
                src={user.profilePhoto} 
                name={user.name}
                id={user.id}
                className="h-24 w-24 border-4 border-primary/20 relative z-10"
                fallbackClassName="text-xl"
              />
              <label 
                htmlFor="photo-upload" 
                className="absolute bottom-0 right-0 h-8 w-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform z-20 shadow-lg"
              >
                <Camera className="h-4 w-4 text-black" />
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
            <div className="flex-1 relative z-10">
              <h2 className="text-2xl font-black tracking-tight">{user.name}</h2>
              <p className="text-primary text-[10px] uppercase font-black tracking-widest mt-1 italic">LOCKED IN MEMBER</p>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 text-center">
            <div className="text-primary text-3xl font-display font-black leading-none mb-1 drop-shadow-[0_0_8px_rgba(204,255,0,0.3)]">{user.currentXp}</div>
            <div className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">Total XP</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 text-center">
            <div className="text-white text-3xl font-display font-black leading-none mb-1">{user.level}</div>
            <div className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">Level</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 text-center">
            <div className="text-white text-3xl font-display font-black leading-none mb-1">{user.streak}</div>
            <div className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">Streak</div>
          </div>
        </div>

        {/* Settings Sections */}
        {sections.map((section) => {
          const SectionIcon = section.icon;
          return (
            <div key={section.title} className="bg-white/5 border border-white/10 rounded-[32px] p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <SectionIcon className="h-5 w-5 text-primary" />
                <h3 className="font-display font-black uppercase tracking-widest text-sm">{section.title}</h3>
              </div>
              {section.items.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div 
                    key={item.label} 
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl transition-all",
                      item.type === "action" ? "hover:bg-white/5 cursor-pointer active:scale-[0.98]" : "bg-black/20"
                    )}
                    onClick={item.type === "action" && 'action' in item ? item.action : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <ItemIcon className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.type === "switch" ? (
                      <Switch defaultChecked={'defaultValue' in item ? item.defaultValue : false} />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Danger Zone */}
        <div className="bg-destructive/5 border border-destructive/20 rounded-[32px] p-6">
          <h3 className="font-display font-black uppercase tracking-widest text-sm text-destructive mb-4">Danger Zone</h3>
          {!showDeleteConfirm ? (
            <Button 
              onClick={() => setShowDeleteConfirm(true)}
              variant="outline"
              className="w-full h-12 rounded-xl font-black uppercase tracking-wider border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-white/60">Are you absolutely sure? This cannot be undone.</p>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowDeleteConfirm(false)}
                  variant="outline"
                  className="flex-1 h-10 rounded-xl"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => deleteAccountMutation.mutate()}
                  disabled={deleteAccountMutation.isPending}
                  className="flex-1 h-10 rounded-xl bg-destructive text-white hover:bg-destructive/90 font-black"
                >
                  {deleteAccountMutation.isPending ? "Deleting..." : "Confirm Delete"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <Button 
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          variant="outline"
          className="w-full h-14 rounded-xl font-black uppercase tracking-wider border-white/10 hover:border-destructive/50 hover:text-destructive"
        >
          <LogOut className="mr-2 h-5 w-5" />
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </Button>
      </div>

      {/* Edit Name Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="bg-card border-white/10 text-foreground rounded-[32px]">
          <DialogHeader>
            <DialogTitle className="font-display tracking-widest uppercase italic">Edit Name</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">Display Name</label>
              <div className="flex gap-2">
                <Input 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-black/40 border-white/10 h-12 rounded-xl flex-1"
                />
                <Button 
                  onClick={() => updateNameMutation.mutate(newName)}
                  disabled={newName === user.name || updateNameMutation.isPending}
                  className="bg-primary text-black hover:bg-primary/90 h-12 px-6 rounded-xl font-black"
                >
                  {updateNameMutation.isPending ? "..." : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
