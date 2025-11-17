import { GuideSectionFull } from '../domain/guide';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { Save, Radio } from 'lucide-react';
import { useSettingsStore } from '../stores/useSettingsStore';

interface GuideSectionHeaderProps {
  section: GuideSectionFull;
  progressPercent: number;
  completedCount: number;
  totalCount: number;
}

export function GuideSectionHeader({ 
  section, 
  progressPercent,
  completedCount,
  totalCount 
}: GuideSectionHeaderProps) {
  const showJapanese = useSettingsStore((state) => state.showJapanese);
  const { toc, entry } = section;

  const title = entry?.titles.primary.en || toc.label.en || toc.label.raw;
  const titleJp = entry?.titles.primary.jp || toc.label.jp;

  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/guide">Guide</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/guide">Story</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
              <Badge variant="secondary" className="text-xs">
                {toc.code}
              </Badge>
            </div>
            
            {showJapanese && titleJp && (
              <p className="text-lg text-muted-foreground">{titleJp}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="capitalize">
            {toc.kind}
          </Badge>
          
          {entry?.crystals?.teleport && (
            <Badge variant="outline" className="gap-1">
              <Radio className="size-3" />
              Teleport Crystal
            </Badge>
          )}
          
          {entry?.crystals?.save && (
            <Badge variant="outline" className="gap-1">
              <Save className="size-3" />
              Save Crystal
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Section Progress</span>
            <span className="font-medium">
              {completedCount}/{totalCount} completed ({progressPercent}%)
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </div>
    </div>
  );
}