
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useLanguage, type Language } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Sun } from "lucide-react";

const Settings = () => {
  const { 
    currentLanguage, 
    setLanguage, 
    theme, 
    toggleTheme, 
    notificationTime, 
    setNotificationTime,
    quizRemindersEnabled,
    toggleQuizReminders
  } = useLanguage();
  const { logout } = useAuth();
  const { toast } = useToast();
  
  const [tempNotificationTime, setTempNotificationTime] = useState(notificationTime);

  const languages: { value: Language; label: string }[] = [
    { value: 'english', label: 'English' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'portuguese', label: 'Portuguese' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'italian', label: 'Italian' },
  ];

  const handleLanguageChange = (value: string) => {
    setLanguage(value as Language);
    toast({
      title: "Language Changed",
      description: `Your learning language has been set to ${value}.`,
    });
  };

  const handleNotificationTimeChange = () => {
    setNotificationTime(tempNotificationTime);
    toast({
      title: "Notification Time Updated",
      description: `You will receive notifications at ${tempNotificationTime}.`,
    });
  };

  return (
    <div className="p-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 text-center">Settings</h1>
      
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Language Preferences</CardTitle>
            <CardDescription>
              Choose which language you want to learn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="language">Learning Language</Label>
              <Select
                value={currentLanguage}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.value} value={language.value}>
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how the app looks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {theme === 'light' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                <Label htmlFor="theme-mode">
                  {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                </Label>
              </div>
              <Switch
                id="theme-mode"
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Configure when and how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="notification-time">Daily Word Notification Time</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="notification-time"
                  type="time"
                  value={tempNotificationTime}
                  onChange={(e) => setTempNotificationTime(e.target.value)}
                  className="w-32"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleNotificationTimeChange}
                  disabled={tempNotificationTime === notificationTime}
                >
                  Save
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="quiz-reminders">Quiz Reminders</Label>
              <Switch
                id="quiz-reminders"
                checked={quizRemindersEnabled}
                onCheckedChange={toggleQuizReminders}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              onClick={() => {
                logout();
                // Redirect to home after logout
                window.location.href = "/";
              }}
              className="w-full"
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
