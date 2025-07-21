'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { fileToDataUri } from '@/lib/utils';
import { suggestLegalReplies, SuggestLegalRepliesOutput } from '@/ai/flows/suggest-legal-replies';
import { Loader2, FileUp, BookCopy, Gavel, Lightbulb } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Skeleton } from '../ui/skeleton';


export function LegalDraftingSuggestions() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestLegalRepliesOutput | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSuggestions(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: 'No File Selected',
        description: 'Please upload a court order document.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setSuggestions(null);
    try {
      const courtOrderDataUri = await fileToDataUri(file);
      const result = await suggestLegalReplies({ courtOrderDataUri });
      setSuggestions(result);
    } catch (error) {
      console.error(error);
      toast({
        title: 'An Error Occurred',
        description:
          'Failed to generate suggestions. Please try again.',
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
          <CardTitle className="font-headline">Upload Court Order</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8">
              <FileUp className="size-12 text-muted-foreground mb-4" />
              <Input
                id="order-upload"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="order-upload" className="cursor-pointer">
                <Button type="button" variant="outline" asChild>
                  <span>Choose File</span>
                </Button>
              </label>
              {file && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Selected: {file.name}
                </p>
              )}
            </div>
            <Button type="submit" disabled={isLoading || !file}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get Suggestions
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">AI-Generated Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-4">
               <Skeleton className="h-10 w-full" />
               <Skeleton className="h-10 w-full" />
               <Skeleton className="h-10 w-full" />
            </div>
          )}
          {suggestions ? (
            <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                    <BookCopy className="mr-2 text-accent" /> Suggested Replies
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    {suggestions.suggestedReplies.map((reply, index) => (
                      <li key={index}>{reply}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                    <Gavel className="mr-2 text-accent" /> Relevant Case Law
                </AccordionTrigger>
                <AccordionContent>
                   <ul className="list-disc pl-5 space-y-2 text-sm">
                    {suggestions.relevantCaseLaw.map((law, index) => (
                      <li key={index}>{law}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                    <Lightbulb className="mr-2 text-accent" /> Litigation Strategy
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm">{suggestions.litigationStrategy}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : !isLoading && (
            <p className="text-sm text-muted-foreground">
              Your generated suggestions will appear here.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
