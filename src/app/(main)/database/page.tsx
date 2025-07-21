import { LegalDatabaseSearch } from '@/components/features/legal-database-search';

export default function DatabasePage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-primary">
          Advanced Legal Database
        </h1>
        <p className="mt-2 text-muted-foreground">
          Enable filtering of judgments by IPC/CrPC sections, topics, court, and headnote keywords.
        </p>
      </div>
      <LegalDatabaseSearch />
    </div>
  );
}
