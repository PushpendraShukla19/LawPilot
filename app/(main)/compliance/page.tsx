import { ComplianceEngine } from '@/components/features/compliance-engine';

export default function CompliancePage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-primary">
          Compliance Suggestion Engine
        </h1>
        <p className="mt-2 text-muted-foreground">
         Suggest the correct legal forms, filings, deadlines, and potential penalties using an AI tool to interpret regulations and laws.
        </p>
      </div>
      <ComplianceEngine />
    </div>
  );
}
