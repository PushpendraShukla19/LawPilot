import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BookOpen,
  Database,
  FileText,
  Newspaper,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    title: 'AI Headnote Generation',
    description: 'Upload a judgment PDF to generate a concise headnote automatically.',
    href: '/headnote',
    icon: <FileText className="size-8 text-accent" />,
  },
  {
    title: 'Advanced Legal Database',
    description: 'Search and filter judgments from our extensive legal database.',
    href: '/database',
    icon: <Database className="size-8 text-accent" />,
  },
  {
    title: 'AI Legal Drafting',
    description: 'Get AI-powered suggestions for replies to court orders.',
    href: '/drafting',
    icon: <BookOpen className="size-8 text-accent" />,
  },
  {
    title: 'Web Intelligence',
    description: 'Summarize legal news and trends on any topic.',
    href: '/intelligence',
    icon: <Newspaper className="size-8 text-accent" />,
  },
  {
    title: 'Compliance Engine',
    description: 'Find compliance requirements for any business case.',
    href: '/compliance',
    icon: <ShieldCheck className="size-8 text-accent" />,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-primary">
          Welcome to LawPilot
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your AI-powered co-pilot for navigating the legal landscape.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.href} className="group">
            <Card className="flex h-full flex-col transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-1">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <CardTitle className="font-headline">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </div>
                {feature.icon}
              </CardHeader>
              <CardContent className="mt-auto flex items-center justify-end">
                  <span className="text-sm font-medium text-accent transition-all duration-200 group-hover:underline">
                    Get Started
                  </span>
                  <ArrowRight className="ml-2 size-4 text-accent transition-transform duration-200 group-hover:translate-x-1" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
