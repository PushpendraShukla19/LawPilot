import { HeadnoteGenerator } from '@/components/features/headnote-generator';

export default function HeadnotePage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-primary">
          AI Headnote Generation
        </h1>
        <p className="mt-2 text-muted-foreground">
          Generate concise headnotes summarizing facts, legal issues, reasoning, and rulings from uploaded judgment PDFs.
        </p>
      </div>
      <HeadnoteGenerator />
    </div>
  );
}
