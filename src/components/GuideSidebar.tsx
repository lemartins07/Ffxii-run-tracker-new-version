import { TocEntry } from '../domain/guide';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Sword, MapPin, AlertTriangle, Map } from 'lucide-react';
import { cn } from './ui/utils';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useNavigation } from '../contexts/NavigationContext';

interface GuideSidebarProps {
  sections: TocEntry[];
  activeCode?: string;
  className?: string;
}

const kindIcons = {
  story: Map,
  mark: Sword,
  loot: AlertTriangle,
  sidequest: MapPin,
  other: Map,
};

const kindColors = {
  story: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  mark: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  loot: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  sidequest: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  other: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
};

export function GuideSidebar({ sections, activeCode, className }: GuideSidebarProps) {
  const showJapanese = useSettingsStore((state) => state.showJapanese);
  const { navigateTo } = useNavigation();
  
  // Group sections by arc
  const storySections = sections.filter(s => s.kind === 'story');
  const early = storySections.slice(0, 3);
  const mid = storySections.slice(3, 7);
  const late = storySections.slice(7);

  const groups = [
    { title: 'Early Game', sections: early },
    { title: 'Mid Game', sections: mid },
    { title: 'Late Game', sections: late },
  ].filter(g => g.sections.length > 0);

  return (
    <aside className={cn('border-r bg-muted/20', className)}>
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          <div>
            <h2 className="mb-3 px-2 font-semibold">Guide Sections</h2>
          </div>

          {groups.map((group) => (
            <div key={group.title}>
              <div className="mb-2 px-2">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  {group.title}
                </div>
              </div>
              <div className="space-y-1">
                {group.sections.map((section) => {
                  const Icon = kindIcons[section.kind];
                  const isActive = section.code === activeCode;

                  return (
                    <button
                      key={section.code}
                      onClick={() => navigateTo('guide', section.code)}
                      className={cn(
                        'w-full text-left block rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-accent',
                        isActive && 'bg-accent border-l-2 border-primary'
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <Icon className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <div className={cn('font-medium truncate', isActive && 'text-primary')}>
                            {section.label.en || section.label.raw}
                          </div>
                          {showJapanese && section.label.jp && (
                            <div className="text-xs text-muted-foreground truncate mt-0.5">
                              {section.label.jp}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}