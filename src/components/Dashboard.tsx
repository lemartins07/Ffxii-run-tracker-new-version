import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useGamificationStore } from '../stores/useGamificationStore';
import { useChecklistStore } from '../stores/useChecklistStore';
import { useNavigation } from '../contexts/NavigationContext';
import { getStorySections, getMarkSections, getLootSections } from '../lib/guide-data';
import { Trophy, Map, Sword, AlertTriangle, Zap, ChevronRight, Award } from 'lucide-react';

export function Dashboard() {
  const currentPlaythroughId = useSettingsStore((state) => state.currentPlaythroughId);
  const { getStats } = useGamificationStore();
  const { navigateTo } = useNavigation();
  const stats = getStats(currentPlaythroughId);

  const storySections = getStorySections();
  const markSections = getMarkSections();
  const lootSections = getLootSections();

  const xpToNextLevel = ((stats.level) * 100) - stats.xp;
  const xpProgress = (stats.xp % 100);

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4 space-y-8">
      {/* Hero Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome, Sky Pirate!
        </h1>
        <p className="text-muted-foreground">
          Track your journey through Ivalice with this comprehensive FFXII guide.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level</CardTitle>
            <Trophy className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.level}</div>
            <p className="text-xs text-muted-foreground">
              {xpToNextLevel} XP to next level
            </p>
            <Progress value={xpProgress} className="h-1.5 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Story Progress</CardTitle>
            <Map className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.sectionsCompleted}/{storySections.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Sections completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hunts</CardTitle>
            <Sword className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.huntsCompleted}/{markSections.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Elite Marks defeated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loot Tracked</CardTitle>
            <AlertTriangle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.lootCollected}/{lootSections.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Missable items found
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="size-5" />
              Story Walkthrough
            </CardTitle>
            <CardDescription>
              Follow the main story path with detailed guidance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigateTo('guide', 'wt01a')} className="w-full">
              <span className="flex items-center gap-2">
                Start Guide
                <ChevronRight className="size-4" />
              </span>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sword className="size-5" />
              Elite Marks
            </CardTitle>
            <CardDescription>
              Track all Hunt targets and rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigateTo('hunts')} variant="outline" className="w-full">
              <span className="flex items-center gap-2">
                View Hunts
                <ChevronRight className="size-4" />
              </span>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity / Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="size-5" />
            Getting Started
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Award className="size-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Earn XP as you progress</p>
              <p className="text-sm text-muted-foreground">
                Complete objectives, find loot, and defeat hunts to level up your guide progress.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <AlertTriangle className="size-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Don't miss important items</p>
              <p className="text-sm text-muted-foreground">
                Watch for "Missable" badges - these items can only be obtained once!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Map className="size-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Navigate with ease</p>
              <p className="text-sm text-muted-foreground">
                Use the sidebar to jump between sections, or follow the linear path with Next/Previous buttons.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}