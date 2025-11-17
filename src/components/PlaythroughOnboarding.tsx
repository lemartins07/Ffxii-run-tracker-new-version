import { useState } from 'react';
import { useSettingsStore } from '../stores/useSettingsStore';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { BookOpen, Sparkles } from 'lucide-react';

interface PlaythroughOnboardingProps {
  onComplete: () => void;
}

export function PlaythroughOnboarding({ onComplete }: PlaythroughOnboardingProps) {
  const { createPlaythrough } = useSettingsStore();
  const [playthroughName, setPlaythroughName] = useState('');
  const [error, setError] = useState('');

  const handleCreate = () => {
    if (!playthroughName.trim()) {
      setError('Please enter a name for your playthrough');
      return;
    }

    createPlaythrough(playthroughName.trim());
    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-500/10 via-background to-orange-500/10">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto size-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-2xl">XII</span>
          </div>
          <div>
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Sparkles className="size-6 text-amber-500" />
              Welcome to FFXII Guide
            </CardTitle>
            <CardDescription className="mt-2">
              Let's start your journey through Ivalice. Create your first playthrough to begin tracking your progress.
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="playthrough-name">Playthrough Name</Label>
            <Input
              id="playthrough-name"
              placeholder="e.g., My First Adventure"
              value={playthroughName}
              onChange={(e) => {
                setPlaythroughName(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreate();
                }
              }}
              autoFocus
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-accent"
                onClick={() => setPlaythroughName('My First Adventure')}
              >
                My First Adventure
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-accent"
                onClick={() => setPlaythroughName('100% Completion')}
              >
                100% Completion
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-accent"
                onClick={() => setPlaythroughName('Speedrun')}
              >
                Speedrun
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-accent"
                onClick={() => setPlaythroughName('New Game+')}
              >
                New Game+
              </Badge>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen className="size-4 text-muted-foreground" />
              <p className="text-sm font-medium">What you'll get:</p>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1 ml-6">
              <li>• Complete walkthrough with checklists</li>
              <li>• Progress tracking and gamification</li>
              <li>• Shop items, loot alerts, and hunt guides</li>
              <li>• Multiple playthrough support</li>
            </ul>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button onClick={handleCreate} className="w-full" size="lg">
            Start Your Journey
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
