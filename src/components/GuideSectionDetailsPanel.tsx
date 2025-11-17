import { GuideSectionFull } from '../domain/guide';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { useSettingsStore } from '../stores/useSettingsStore';
import { ShoppingCart, AlertTriangle, BookOpen, Coins } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface GuideSectionDetailsPanelProps {
  section: GuideSectionFull;
}

export function GuideSectionDetailsPanel({ section }: GuideSectionDetailsPanelProps) {
  const showJapanese = useSettingsStore((state) => state.showJapanese);
  const { entry, children } = section;

  const hasShops = entry?.shops && entry.shops.length > 0;
  const lootChildren = children.filter(c => c.kind === 'loot');
  const hasLoot = lootChildren.length > 0;
  const hasNarrative = entry?.narrative && entry.narrative.length > 0;

  if (!hasShops && !hasLoot && !hasNarrative) {
    return (
      <Card className="p-8">
        <p className="text-muted-foreground text-center">
          No additional details for this section.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {hasNarrative && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-5" />
              Walkthrough Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {entry!.narrative!.map((block, idx) => (
              <p key={idx} className="leading-relaxed">
                {block.text}
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      {hasShops && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="size-5" />
              Available Shops
            </CardTitle>
            <CardDescription>
              Items and equipment available in this location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={entry!.shops![0].name} className="w-full">
              <TabsList className="w-full justify-start flex-wrap h-auto gap-1">
                {entry!.shops!.map((shop) => (
                  <TabsTrigger key={shop.name} value={shop.name} className="text-xs">
                    {shop.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {entry!.shops!.map((shop) => (
                <TabsContent key={shop.name} value={shop.name} className="mt-4">
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Coins className="size-3" />
                              Gil
                            </div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {shop.items.map((item) => (
                          <TableRow key={item.itemId}>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {item.nameEn || item.nameRaw}
                                </div>
                                {showJapanese && item.nameJp && (
                                  <div className="text-xs text-muted-foreground">
                                    {item.nameJp}
                                  </div>
                                )}
                                {item.type && (
                                  <Badge variant="outline" className="text-xs mt-1">
                                    {item.type}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {item.price?.toLocaleString() ?? '—'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}

      {hasLoot && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5" />
              Loot Alerts
            </CardTitle>
            <CardDescription>
              Important items that may be missable
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {lootChildren.map((loot) => (
              <Card key={loot.code} className="p-4 border-amber-500/20 bg-amber-500/5">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="size-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {loot.label.en || loot.label.raw}
                      </h4>
                      {showJapanese && loot.label.jp && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {loot.label.jp}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    May be missable
                  </Badge>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}