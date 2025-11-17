import { Moon, Sun, Languages, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useGamificationStore } from '../stores/useGamificationStore';
import { useNavigation } from '../contexts/NavigationContext';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { PlaythroughManager } from './PlaythroughManager';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, toggleTheme, showJapanese, toggleJapanese, currentPlaythroughId } = useSettingsStore();
  const { getStats } = useGamificationStore();
  const { navigateTo } = useNavigation();
  const stats = getStats(currentPlaythroughId);

  const xpToNextLevel = ((stats.level) * 100) - stats.xp;
  const xpProgress = (stats.xp % 100);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="lg:hidden"
            >
              <Menu className="size-5" />
            </Button>
          )}
          
          <button onClick={() => navigateTo('dashboard')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="size-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded flex items-center justify-center">
              <span className="text-white">XII</span>
            </div>
            <div>
              <div className="font-semibold">FFXII Guide</div>
              <div className="text-xs text-muted-foreground">Complete Walkthrough</div>
            </div>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
            <Badge variant="secondary" className="text-xs">
              Level {stats.level}
            </Badge>
            <div className="flex flex-col gap-1 min-w-[120px]">
              <div className="text-xs text-muted-foreground">
                {xpProgress}/100 XP
              </div>
              <Progress value={xpProgress} className="h-1.5" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentPlaythroughId && (
            <div className="hidden lg:block">
              <PlaythroughManager />
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleJapanese}
            title={showJapanese ? 'Hide Japanese' : 'Show Japanese'}
          >
            <Languages className="size-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Dark mode' : 'Light mode'}
          >
            {theme === 'light' ? <Moon className="size-5" /> : <Sun className="size-5" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Menu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigateTo('dashboard')}>
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigateTo('guide')}>
                Guide
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigateTo('hunts')}>
                Hunts
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigateTo('about')}>
                About
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}