import { getWalkthroughMeta } from '../lib/guide-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { BookOpen, User, Calendar, GitBranch } from 'lucide-react';

export function AboutPage() {
  const meta = getWalkthroughMeta();

  return (
    <div className="container max-w-4xl py-8 px-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">About This Guide</h1>
        <p className="text-muted-foreground">
          Information about this walkthrough and guide system
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="size-5" />
            {meta.title}
          </CardTitle>
          {meta.description && (
            <CardDescription>{meta.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <User className="size-5 shrink-0 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Author</p>
                <p className="text-sm text-muted-foreground">{meta.author}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <GitBranch className="size-5 shrink-0 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Version</p>
                <p className="text-sm text-muted-foreground">{meta.version}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 md:col-span-2">
              <Calendar className="size-5 shrink-0 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(meta.lastUpdated).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
          <CardDescription>
            What makes this guide special
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5">1</Badge>
              <div>
                <p className="font-medium">Interactive Checklist</p>
                <p className="text-sm text-muted-foreground">
                  Track your progress through every section with persistent checklists that save your progress.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5">2</Badge>
              <div>
                <p className="font-medium">Gamification System</p>
                <p className="text-sm text-muted-foreground">
                  Earn XP and level up as you complete objectives, find loot, and defeat hunts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5">3</Badge>
              <div>
                <p className="font-medium">Comprehensive Shop Lists</p>
                <p className="text-sm text-muted-foreground">
                  Detailed shop inventories for every location, including prices and availability.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5">4</Badge>
              <div>
                <p className="font-medium">Loot & Missable Tracking</p>
                <p className="text-sm text-muted-foreground">
                  Never miss important items with clear alerts for time-sensitive opportunities.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5">5</Badge>
              <div>
                <p className="font-medium">Bilingual Support</p>
                <p className="text-sm text-muted-foreground">
                  Toggle Japanese names on/off for locations, items, and more.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5">6</Badge>
              <div>
                <p className="font-medium">Dark/Light Mode</p>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred theme for comfortable reading in any environment.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Technology Stack</CardTitle>
          <CardDescription>
            Built with modern web technologies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge>React</Badge>
            <Badge>TypeScript</Badge>
            <Badge>Tailwind CSS</Badge>
            <Badge>Zustand</Badge>
            <Badge>shadcn/ui</Badge>
            <Badge>Lucide Icons</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}