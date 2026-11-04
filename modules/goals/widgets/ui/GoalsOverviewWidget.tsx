import React from 'react';
import { Target, TrendingUp, CheckCircle, IndianRupee } from 'lucide-react';
import { Goal } from '../../entities';

interface GoalsOverviewWidgetProps {
  goals: Goal[];
}

export const GoalsOverviewWidget: React.FC<GoalsOverviewWidgetProps> = ({ goals }) => {
  const totalGoals = goals.length;
  const onTrackOrExceeded = goals.filter((g) => g.status === 'on_track' || g.status === 'exceeded').length;
  const healthRate = totalGoals > 0 ? Math.round((onTrackOrExceeded / totalGoals) * 100) : 0;

  // Revenue goals calculation
  const revenueGoals = goals.filter((g) => g.metric === 'revenue');
  const totalRevTarget = revenueGoals.reduce((sum, g) => sum + g.targetValue, 0);
  const totalRevActual = revenueGoals.reduce((sum, g) => sum + g.currentValue, 0);
  const revPacing = totalRevTarget > 0 ? Math.round((totalRevActual / totalRevTarget) * 100) : 0;

  // Total admissions / enrolment goals
  const enrolGoals = goals.filter((g) => g.metric === 'enrolments');
  const totalEnrolTarget = enrolGoals.reduce((sum, g) => sum + g.targetValue, 0);
  const totalEnrolActual = enrolGoals.reduce((sum, g) => sum + g.currentValue, 0);

  const formatLakhs = (amt: number) => {
    if (amt >= 10000000) return `₹${(amt / 10000000).toFixed(2)} Cr`;
    if (amt >= 100000) return `₹${(amt / 100000).toFixed(1)} Lakh`;
    return `₹${amt.toLocaleString()}`;
  };

  const cards = [
    {
      title: 'Active Goals & Targets',
      value: totalGoals,
      subtext: `${goals.filter((g) => g.cadence === 'weekly').length} Weekly • ${goals.filter((g) => g.cadence === 'monthly').length} Monthly`,
      icon: Target,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'Admissions Enrolled vs Goal',
      value: `${totalEnrolActual} / ${totalEnrolTarget}`,
      subtext: `${totalEnrolTarget > 0 ? Math.round((totalEnrolActual / totalEnrolTarget) * 100) : 0}% Target Pacing`,
      icon: CheckCircle,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Tuition Revenue Collection',
      value: formatLakhs(totalRevActual),
      subtext: `Target: ${formatLakhs(totalRevTarget)} (${revPacing}%)`,
      icon: IndianRupee,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      title: 'Organizational Pacing Health',
      value: `${healthRate}%`,
      subtext: `${onTrackOrExceeded} of ${totalGoals} targets on track`,
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-start justify-between"
          >
            <div>
              <span className="text-xs font-medium text-slate-500 block">{card.title}</span>
              <div className="text-xl font-bold text-slate-900 mt-1">{card.value}</div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">{card.subtext}</span>
            </div>
            <div className={`p-2 rounded-lg border ${card.color} shrink-0`}>
              <Icon className="w-4 h-4" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
