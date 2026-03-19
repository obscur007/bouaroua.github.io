import type { KpiCard as KpiCardType } from '../data/mockData';

const styles: Record<KpiCardType['tone'], string> = {
  primary: 'bg-brand-50 text-brand-900 ring-brand-100',
  warning: 'bg-amber-50 text-amber-900 ring-amber-100',
  success: 'bg-emerald-50 text-emerald-900 ring-emerald-100',
};

export function KpiCard({ title, value, delta, tone }: KpiCardType) {
  return (
    <div className={`rounded-3xl p-5 shadow-card ring-1 ${styles[tone]}`}>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
      <p className="mt-2 text-sm font-medium">{delta}</p>
    </div>
  );
}
