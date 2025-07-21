'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { summarizeLegalNews } from '@/ai/flows/summarize-legal-news';
import { Loader2, Lightbulb, Newspaper } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Skeleton } from '../ui/skeleton';

const formSchema = z.object({
    legalTopic: z.string().min(3, { message: "Topic must be at least 3 characters."}),
});

export function WebIntelligence() {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      legalTopic: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await summarizeLegalNews({ legalTopic: values.legalTopic });
      setSummary(result.summary);
    } catch (error) {
      console.error(error);
      toast({
        title: 'An Error Occurred',
        description:
          'Failed to summarize news. Please try again.',
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
                <CardTitle className="font-headline">Enter Legal Topic</CardTitle>
                <CardDescription>Provide a topic to get the latest news, trends, and circulars.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="legalTopic"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Legal Topic</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lightbulb className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="e.g., 'Corporate Law'" {...field} className="pl-10" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Summarize News
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Newspaper className="text-primary" /> AI-Generated Summary
                </CardTitle>
            </CardHeader>
            <CardContent className="min-h-[200px]">
                {isLoading && (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[90%]" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[70%]" />
                    </div>
                )}
                {summary && (
                    <p className="text-sm whitespace-pre-wrap">{summary}</p>
                )}
                {!isLoading && !summary && (
                    <p className="text-sm text-muted-foreground">
                        Your generated summary will appear here.
                    </p>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
