'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Search } from 'lucide-react';

import { searchLegalDatabase, SearchLegalDatabaseOutput } from '@/ai/flows/search-legal-database';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { JudgmentCard } from './judgment-card';
import { Skeleton } from '../ui/skeleton';

const formSchema = z.object({
  ipcCrpcSections: z.string().optional(),
  topics: z.string().optional(),
  court: z.string().optional(),
  headnoteKeywords: z.string().optional(),
});

type Judgment = SearchLegalDatabaseOutput['judgments'][0];

export function LegalDatabaseSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [judgments, setJudgments] = useState<Judgment[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ipcCrpcSections: '',
      topics: '',
      court: '',
      headnoteKeywords: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setJudgments([]);
    try {
      const result = await searchLegalDatabase(values);
      setJudgments(result.judgments);
    } catch (error) {
      console.error(error);
      toast({
        title: 'An Error Occurred',
        description: 'Failed to search the database. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderJudgments = () => {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        </div>
      ));
    }

    if (!judgments.length) {
      return (
        <div className="md:col-span-2 lg:col-span-3 text-center text-muted-foreground">
          No judgments found. Try adjusting your search criteria.
        </div>
      );
    }

    return judgments.map((judgment) => (
      <JudgmentCard key={judgment.id} {...judgment} />
    ));
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="p-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
            >
              <FormField
                control={form.control}
                name="ipcCrpcSections"
                render={({ field }) => (
                  <FormItem className="lg:col-span-1">
                    <FormControl>
                      <Input placeholder="IPC/CrPC Sections..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="topics"
                render={({ field }) => (
                  <FormItem className="lg:col-span-1">
                    <FormControl>
                      <Input placeholder="Topics..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="court"
                render={({ field }) => (
                  <FormItem className="lg:col-span-1">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Court" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sc">Supreme Court</SelectItem>
                        <SelectItem value="hc">High Court</SelectItem>
                        <SelectItem value="dc">District Court</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="headnoteKeywords"
                render={({ field }) => (
                  <FormItem className="lg:col-span-1">
                    <FormControl>
                      <Input placeholder="Headnote Keywords..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                Search
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderJudgments()}
      </div>
    </div>
  );
}
