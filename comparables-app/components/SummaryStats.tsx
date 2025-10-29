interface StatCardProps {
  number: number | string;
  label: string;
}

function StatCard({ number, label }: StatCardProps) {
  return (
    <div className="stat-card">
      <span className="number">{number}</span>
      <span className="label">{label}</span>
    </div>
  );
}

interface SummaryStatsProps {
  stats: {
    number: number | string;
    label: string;
  }[];
}

export default function SummaryStats({ stats }: SummaryStatsProps) {
  return (
    <div className="stats">
      {stats.map((stat, idx) => (
        <StatCard key={idx} number={stat.number} label={stat.label} />
      ))}
    </div>
  );
}
