'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { fileToDataUri } from '@/lib/utils';
import { generateHeadnote } from '@/ai/flows/generate-headnote';
import { Loader2, FileUp, FileText } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

export function HeadnoteGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [headnote, setHeadnote] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast({
          title: 'Invalid File Type',
          description: 'Please upload a PDF file.',
          variant: 'destructive',
        });
        return;
      }
      setFile(selectedFile);
      setHeadnote(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: 'No File Selected',
        description: 'Please upload a judgment PDF.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setHeadnote(null);
    try {
      const judgmentPdfDataUri = await fileToDataUri(file);
      const result = await generateHeadnote({ judgmentPdfDataUri });
      setHeadnote(result.headnote);
    } catch (error) {
      console.error(error);
      toast({
        title: 'An Error Occurred',
        description:
          'Failed to generate headnote. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Upload Judgment PDF</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8">
              <FileUp className="size-12 text-muted-foreground mb-4" />
              <Input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="pdf-upload" className="cursor-pointer">
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
              Generate Headnote
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <FileText className="text-primary" /> Generated Headnote
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
          )}
          {headnote && (
            <p className="text-sm whitespace-pre-wrap">{headnote}</p>
          )}
          {!isLoading && !headnote && (
            <p className="text-sm text-muted-foreground">
              Your generated headnote will appear here.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
