import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type JudgmentCardProps = {
  title: string;
  court: string;
  date: string;
  sections: string[];
  keywords: string[];
};

export function JudgmentCard({
  title,
  court,
  date,
  sections,
  keywords,
}: JudgmentCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-lg">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {court} - {date}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <h4 className="text-sm font-semibold mb-2">Sections</h4>
          <div className="flex flex-wrap gap-1">
            {sections.map((section) => (
              <Badge key={section} variant="secondary">
                {section}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Keywords</h4>
          <div className="flex flex-wrap gap-1">
            {keywords.map((keyword) => (
              <Badge key={keyword} variant="outline">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
