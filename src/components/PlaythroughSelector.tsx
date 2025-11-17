import { useState } from 'react';
import { useSettingsStore, Playthrough } from '../stores/useSettingsStore';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Badge } from './ui/badge';
import { BookOpen, Plus, Check, Calendar } from 'lucide-react';

interface PlaythroughSelectorProps {
  onSelect: () => void;
}

export function PlaythroughSelector({ onSelect }: PlaythroughSelectorProps) {
  const { 
    playthroughs, 
    currentPlaythroughId, 
    setCurrentPlaythrough,
  } = useSettingsStore();

  const [selectedId, setSelectedId] = useState(currentPlaythroughId);

  const handleContinue = () => {
    if (selectedId !== currentPlaythroughId) {
      setCurrentPlaythrough(selectedId);
    }
    onSelect();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Sort by last played
  const sortedPlaythroughs = [...playthroughs].sort((a, b) => 
    new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime()
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-500/10 via-background to-orange-500/10">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto size-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-2xl">XII</span>
          </div>
          <div>
            <CardTitle className="text-2xl">Select Your Playthrough</CardTitle>
            <CardDescription className="mt-2">
              Choose which run you want to continue tracking
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {sortedPlaythroughs.map((pt) => (
            <button
              key={pt.id}
              onClick={() => setSelectedId(pt.id)}
              className={`
                w-full text-left p-4 rounded-lg border-2 transition-all
                ${selectedId === pt.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50 hover:bg-accent'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <div className={`
                    size-5 rounded-full border-2 flex items-center justify-center
                    ${selectedId === pt.id ? 'border-primary bg-primary' : 'border-muted-foreground'}
                  `}>
                    {selectedId === pt.id && (
                      <Check className="size-3 text-primary-foreground" />
                    )}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{pt.name}</h3>
                    {pt.id === currentPlaythroughId && (
                      <Badge variant="secondary" className="text-xs">Current</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                    <Calendar className="size-3" />
                    Last played: {formatDate(pt.lastPlayed)}
                  </div>
                </div>

                <BookOpen className="size-5 text-muted-foreground shrink-0 mt-1" />
              </div>
            </button>
          ))}
        </CardContent>
        
        <CardFooter className="flex gap-2">
          <Button 
            onClick={handleContinue} 
            className="flex-1"
            size="lg"
          >
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
