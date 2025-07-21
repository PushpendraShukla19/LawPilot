'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getComplianceSuggestions, ComplianceSuggestionOutput } from '@/ai/flows/compliance-suggestion';
import { Loader2, FileText, CalendarClock, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Textarea } from '../ui/textarea';
import { Skeleton } from '../ui/skeleton';

const formSchema = z.object({
    businessCaseDetails: z.string().min(20, { message: "Please provide more details about the business case."}),
});

export function ComplianceEngine() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<ComplianceSuggestionOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        businessCaseDetails: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await getComplianceSuggestions({ businessCaseDetails: values.businessCaseDetails });
      setSuggestions(result);
    } catch (error) {
      console.error(error);
      toast({
        title: 'An Error Occurred',
        description:
          'Failed to get compliance suggestions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Describe Business Case</CardTitle>
                <CardDescription>Provide details on your business scenario to receive compliance suggestions.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="businessCaseDetails"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Business Case Details</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="e.g., 'A private limited company in India wants to issue new shares to a foreign investor...'" {...field} rows={6} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Get Suggestions
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
        
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <FileText className="text-accent" /> Suggested Forms & Requirements
                    </CardTitle>
                </CardHeader>
                <CardContent className="min-h-[50px]">
                    {isLoading && <Skeleton className="h-10 w-full" />}
                    {suggestions ? (
                        <>
                            <p className="font-semibold">Forms:</p>
                            <p className="text-sm mb-2">{suggestions.suggestedForms}</p>
                            <p className="font-semibold">Requirements:</p>
                            <p className="text-sm">{suggestions.filingRequirements}</p>
                        </>
                    ) : !isLoading && <p className="text-sm text-muted-foreground">Results will appear here.</p>}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <CalendarClock className="text-accent" /> Relevant Deadlines
                    </CardTitle>
                </CardHeader>
                <CardContent className="min-h-[30px]">
                    {isLoading && <Skeleton className="h-4 w-full" />}
                    {suggestions ? (
                        <p className="text-sm">{suggestions.relevantDeadlines}</p>
                    ) : !isLoading && <p className="text-sm text-muted-foreground">Results will appear here.</p>}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <AlertTriangle className="text-accent" /> Potential Penalties
                    </CardTitle>
                </CardHeader>
                <CardContent className="min-h-[30px]">
                    {isLoading && <Skeleton className="h-4 w-full" />}
                    {suggestions ? (
                        <p className="text-sm">{suggestions.potentialPenalties}</p>
                    ) : !isLoading && <p className="text-sm text-muted-foreground">Results will appear here.</p>}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
