import { useState } from "react";
import { useHabits } from "@/hooks/use-habits";
import { useAuth } from "@/hooks/use-auth";
import { ChevronLeft, Bell, Moon, Volume2, Shield, Mail, Lock, User as UserIcon, Download, Trash2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserName, exportUserData, deleteAccount } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function SettingsPage() {
  const { user } = useHabits();
  const { logoutMutation } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [isNameDialogOpen, setNameDialogOpen] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const updateNameMutation = useMutation({
    mutationFn: updateUserName,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast({ title: "Name Updated", description: "Your display name has been changed." });
      setNewName(user.name);
      setNameDialogOpen(false);
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

  const sections = [
    {
      title: "Account",
      icon: UserIcon,
      items: [
        { label: "Edit Name", icon: UserIcon, type: "action", action: () => setNameDialogOpen(true) },
        { label: "Export Data", icon: Download, type: "action", action: handleExport },
      ]
    },
    {
      title: "Preferences",
      icon: Shield,
      items: [
        { label: "Notifications", icon: Bell, type: "switch" },
        { label: "Dark Mode", icon: Moon, type: "switch", defaultValue: true },
        { label: "Sound Effects", icon: Volume2, type: "switch" },
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <header className="px-6 py-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-md z-50">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setLocation("/profile")}
          className="rounded-full hover:bg-white/10"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="font-display font-black uppercase tracking-widest text-lg">Settings</h1>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <div className="p-6 space-y-8 pb-32">
        {/* Settings Sections */}
        {sections.map((section) => {
          const SectionIcon = section.icon;
          return (
            <div key={section.title} className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <SectionIcon className="h-4 w-4 text-primary" />
                <h3 className="font-display font-black uppercase tracking-widest text-[10px] text-muted-foreground">{section.title}</h3>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">
                {section.items.map((item, idx) => {
                  const ItemIcon = item.icon;
                  return (
                    <div 
                      key={item.label} 
                      className={cn(
                        "flex items-center justify-between p-5 transition-all",
                        item.type === "action" ? "hover:bg-white/5 cursor-pointer active:scale-[0.98]" : "",
                        idx !== section.items.length - 1 ? "border-b border-white/5" : ""
                      )}
                      onClick={item.type === "action" && 'action' in item ? item.action : undefined}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-xl bg-white/5">
                          <ItemIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <span className="font-bold uppercase tracking-wider text-xs">{item.label}</span>
                      </div>
                      {item.type === "switch" ? (
                        <Switch defaultChecked={'defaultValue' in item ? item.defaultValue : false} />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
                          <ChevronLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Danger Zone */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-2 text-destructive">
            <Trash2 className="h-4 w-4" />
            <h3 className="font-display font-black uppercase tracking-widest text-[10px]">Danger Zone</h3>
          </div>
          <div className="bg-destructive/5 border border-destructive/20 rounded-[32px] p-6 space-y-4 text-center">
            {!showDeleteConfirm ? (
              <Button 
                onClick={() => setShowDeleteConfirm(true)}
                variant="outline"
                className="w-full h-14 rounded-2xl font-black uppercase tracking-widest border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                Delete Account
              </Button>
            ) : (
              <div className="space-y-4">
                <p className="text-sm font-bold text-destructive/80">Are you absolutely sure? This cannot be undone.</p>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => setShowDeleteConfirm(false)}
                    variant="outline"
                    className="flex-1 h-12 rounded-xl bg-white/5 border-white/10"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => deleteAccountMutation.mutate()}
                    disabled={deleteAccountMutation.isPending}
                    className="flex-1 h-12 rounded-xl bg-destructive text-white hover:bg-destructive/90 font-black uppercase tracking-widest text-xs"
                  >
                    {deleteAccountMutation.isPending ? "..." : "Confirm"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Logout */}
        <Button 
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          variant="ghost"
          className="w-full h-16 rounded-[32px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:bg-white/5 hover:text-white transition-all text-[10px]"
        >
          <LogOut className="mr-3 h-4 w-4" />
          {logoutMutation.isPending ? "Logging out..." : "Log Out System"}
        </Button>
      </div>

      {/* Edit Name Dialog */}
      <Dialog open={isNameDialogOpen} onOpenChange={setNameDialogOpen}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 text-white rounded-[40px] p-8 max-w-[90%] sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="font-display tracking-[0.2em] uppercase italic text-2xl font-black text-center mb-6">Edit Identity</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-2">
            <div className="space-y-4">
              <label className="text-[10px] uppercase text-muted-foreground font-black tracking-[0.3em] px-2">Display Name</label>
              <Input 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-white/5 border-white/10 h-16 rounded-2xl flex-1 text-lg font-bold focus:ring-primary/20"
                placeholder="Enter shadow name..."
              />
            </div>
            <Button 
              onClick={() => updateNameMutation.mutate(newName)}
              disabled={newName === user.name || updateNameMutation.isPending}
              className="w-full bg-primary text-black hover:bg-primary/90 h-16 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-[0.98]"
            >
              {updateNameMutation.isPending ? "Updating..." : "Synchronize Name"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
