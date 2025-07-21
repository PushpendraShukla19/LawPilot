import { LegalDraftingSuggestions } from '@/components/features/legal-drafting-suggestions';

export default function DraftingPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-primary">
          AI Legal Drafting Suggestions
        </h1>
        <p className="mt-2 text-muted-foreground">
          Suggest potential replies and drafts for court orders based on uploaded documents, incorporating relevant case law.
        </p>
      </div>
      <LegalDraftingSuggestions />
    </div>
  );
}
