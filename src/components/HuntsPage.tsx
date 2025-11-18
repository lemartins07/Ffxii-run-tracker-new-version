import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { useChecklistStore } from '../stores/useChecklistStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useGamificationStore, XP_REWARDS } from '../stores/useGamificationStore';
import { Sword, CheckCircle2, MapPin } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { GuideSectionFull, TocEntry } from '../domain/guide';

interface HuntsPageProps {
  markSections: TocEntry[];
  buildGuideSectionFull: (code: string) => GuideSectionFull | null;
}

export function HuntsPage({
  markSections,
  buildGuideSectionFull,
}: HuntsPageProps) {
  const showJapanese = useSettingsStore((state) => state.showJapanese);
  const currentPlaythroughId = useSettingsStore((state) => state.currentPlaythroughId);
  const { toggleItem, isItemComplete } = useChecklistStore();
  const { addXP, getStats } = useGamificationStore();
  const stats = getStats(currentPlaythroughId);

  const handleToggle = (code: string) => {
    const itemId = `${code}:mark`;
    const wasComplete = isItemComplete(currentPlaythroughId, itemId);
    toggleItem(currentPlaythroughId, itemId);
    
    if (!wasComplete) {
      addXP(currentPlaythroughId, XP_REWARDS.HUNT_COMPLETE);
      toast.success(`+${XP_REWARDS.HUNT_COMPLETE} XP`, {
        description: 'Hunt completed!',
      });
    }
  };

  const completedCount = markSections.filter(mark => 
    isItemComplete(currentPlaythroughId, `${mark.code}:mark`)
  ).length;

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <Sword className="size-8" />
          Elite Marks
        </h1>
        <p className="text-muted-foreground">
          Track all Hunt targets throughout Ivalice. Complete hunts for rewards and XP.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hunt Progress</CardTitle>
          <CardDescription>
            {completedCount} of {markSections.length} hunts completed
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {markSections.map((mark) => {
          const section = buildGuideSectionFull(mark.code);
          const isComplete = isItemComplete(currentPlaythroughId, `${mark.code}:mark`);
          const parentSection = mark.parentCode ? buildGuideSectionFull(mark.parentCode) : null;

          return (
            <Card
              key={mark.code}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isComplete ? 'bg-muted/50 border-primary/50' : ''
              }`}
              onClick={() => handleToggle(mark.code)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={isComplete}
                    onCheckedChange={() => handleToggle(mark.code)}
                    className="mt-1"
                    onClick={(e) => e.stopPropagation()}
                  />

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className={`font-semibold ${isComplete ? 'line-through text-muted-foreground' : ''}`}>
                          {mark.label.en || mark.label.raw}
                        </h3>
                        {showJapanese && mark.label.jp && (
                          <p className="text-sm text-muted-foreground">
                            {mark.label.jp}
                          </p>
                        )}
                      </div>
                      
                      {isComplete && (
                        <CheckCircle2 className="size-5 text-primary shrink-0" />
                      )}
                    </div>

                    {parentSection && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="size-4" />
                        <span>
                          Available in: {parentSection.toc.label.en || parentSection.toc.label.raw}
                        </span>
                      </div>
                    )}

                    {section?.entry?.narrative && section.entry.narrative.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {section.entry.narrative[0].text}
                      </p>
                    )}

                    <Badge variant="outline" className="text-xs">
                      {mark.code}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
