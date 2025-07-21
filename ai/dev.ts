import { config } from 'dotenv';
config();

import '@/ai/flows/compliance-suggestion.ts';
import '@/ai/flows/suggest-legal-replies.ts';
import '@/ai/flows/generate-headnote.ts';
import '@/ai/flows/summarize-legal-news.ts';
import '@/ai/flows/search-legal-database.ts';
