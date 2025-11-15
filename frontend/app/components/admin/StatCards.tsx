'use client';

import StatCard from './StatCard';

interface StatCardsProps {
  stats: Array<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    iconBgColor?: string;
    iconColor?: string;
  }>;
}

export default function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}

