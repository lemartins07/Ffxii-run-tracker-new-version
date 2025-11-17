import { GuideSectionFull } from '../domain/guide';
import { useChecklistStore } from '../stores/useChecklistStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useGamificationStore, XP_REWARDS } from '../stores/useGamificationStore';
import { Checkbox } from './ui/checkbox';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle2, Sword, AlertTriangle, Flag } from 'lucide-react';
import { cn } from './ui/utils';
import { toast } from 'sonner@2.0.3';

interface GuideSectionChecklistProps {
  section: GuideSectionFull;
}

interface ChecklistItem {
  id: string;
  label: string;
  labelJp?: string;
  type: 'main' | 'mark' | 'loot' | 'shop';
  isMissable?: boolean;
}

export function GuideSectionChecklist({ section }: GuideSectionChecklistProps) {
  const currentPlaythroughId = useSettingsStore((state) => state.currentPlaythroughId);
  const showJapanese = useSettingsStore((state) => state.showJapanese);
  const { toggleItem, isItemComplete } = useChecklistStore();
  const { addXP } = useGamificationStore();

  // Build checklist items
  const items: ChecklistItem[] = [];

  // Main objective
  items.push({
    id: `${section.toc.code}:main`,
    label: `Complete: ${section.toc.label.en || section.toc.label.raw}`,
    labelJp: section.toc.label.jp,
    type: 'main',
  });

  // Child marks
  section.children
    .filter(c => c.kind === 'mark')
    .forEach(mark => {
      items.push({
        id: `${mark.code}:mark`,
        label: mark.label.en || mark.label.raw,
        labelJp: mark.label.jp,
        type: 'mark',
      });
    });

  // Child loot alerts
  section.children
    .filter(c => c.kind === 'loot')
    .forEach(loot => {
      items.push({
        id: `${loot.code}:loot`,
        label: loot.label.en || loot.label.raw,
        labelJp: loot.label.jp,
        type: 'loot',
        isMissable: true,
      });
    });

  // Shop recommendation (if section has shops)
  if (section.entry?.shops && section.entry.shops.length > 0) {
    items.push({
      id: `${section.toc.code}:shops`,
      label: 'Check shops and upgrade equipment',
      type: 'shop',
    });
  }

  // Group items
  const mainItems = items.filter(i => i.type === 'main');
  const markItems = items.filter(i => i.type === 'mark');
  const lootItems = items.filter(i => i.type === 'loot');
  const shopItems = items.filter(i => i.type === 'shop');

  const handleToggle = (item: ChecklistItem) => {
    const wasComplete = isItemComplete(currentPlaythroughId, item.id);
    toggleItem(currentPlaythroughId, item.id);
    
    if (!wasComplete) {
      addXP(currentPlaythroughId, XP_REWARDS.CHECKLIST_ITEM);
      toast.success(`+${XP_REWARDS.CHECKLIST_ITEM} XP`, {
        description: 'Objective completed!',
      });
    }
  };

  const renderItem = (item: ChecklistItem) => {
    const isComplete = isItemComplete(currentPlaythroughId, item.id);
    
    return (
      <Card
        key={item.id}
        className={cn(
          'p-4 transition-all hover:shadow-md cursor-pointer',
          isComplete && 'bg-muted/50 border-primary/50'
        )}
        onClick={() => handleToggle(item)}
      >
        <div className="flex items-start gap-3">
          <Checkbox
            checked={isComplete}
            onCheckedChange={() => handleToggle(item)}
            className="mt-1"
            onClick={(e) => e.stopPropagation()}
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn('font-medium', isComplete && 'line-through text-muted-foreground')}>
                {item.label}
              </span>
              
              {item.isMissable && (
                <Badge variant="destructive" className="text-xs gap-1">
                  <AlertTriangle className="size-3" />
                  Missable
                </Badge>
              )}
              
              {item.type === 'mark' && (
                <Badge variant="outline" className="text-xs gap-1">
                  <Sword className="size-3" />
                  Hunt
                </Badge>
              )}
            </div>
            
            {showJapanese && item.labelJp && (
              <div className="text-sm text-muted-foreground mt-1">
                {item.labelJp}
              </div>
            )}
          </div>
          
          {isComplete && (
            <CheckCircle2 className="size-5 text-primary shrink-0" />
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {mainItems.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <Flag className="size-4" />
            Main Objective
          </h3>
          <div className="space-y-2">
            {mainItems.map(renderItem)}
          </div>
        </div>
      )}

      {shopItems.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Preparations & Shopping
          </h3>
          <div className="space-y-2">
            {shopItems.map(renderItem)}
          </div>
        </div>
      )}

      {lootItems.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle className="size-4" />
            Loot Alerts
          </h3>
          <div className="space-y-2">
            {lootItems.map(renderItem)}
          </div>
        </div>
      )}

      {markItems.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sword className="size-4" />
            Hunts Available
          </h3>
          <div className="space-y-2">
            {markItems.map(renderItem)}
          </div>
        </div>
      )}
    </div>
  );
}