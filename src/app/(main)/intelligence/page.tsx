import { WebIntelligence } from '@/components/features/web-intelligence';

export default function IntelligencePage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-primary">
          Google + Web Intelligence
        </h1>
        <p className="mt-2 text-muted-foreground">
          Display summaries of relevant news, legal trends and government circulars related to a specific legal topic.
        </p>
      </div>
      <WebIntelligence />
    </div>
  );
}
