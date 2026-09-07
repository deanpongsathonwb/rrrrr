import { useAppStore } from '@/src/stores/app.store';
import { UI } from '@/src/constants';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Award,
  Layers,
  ShieldCheck,
} from 'lucide-react';

export const StatisticsPage = () => {
  const { complaints, categories, settings } = useAppStore();

  const total = complaints.length;
  const inProgress = complaints.filter((c) => c.status === 'in_progress').length;
  const resolved = complaints.filter((c) => c.status === 'resolved').length;
  const pending = complaints.filter((c) => c.status === 'pending').length;
  const rejected = complaints.filter((c) => c.status === 'rejected').length;

  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Average Rating
  const ratedComplaints = complaints.filter((c) => c.rating !== null);
  const avgRating =
    ratedComplaints.length > 0
      ? (
          ratedComplaints.reduce((acc, curr) => acc + (curr.rating?.score || 0), 0) /
          ratedComplaints.length
        ).toFixed(1)
      : UI.metrics.defaultRating;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{settings.agencyName}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          {UI.headings.summaryMetrics}
        </h1>
        <p className="text-sm text-slate-600">
          {UI.headings.howItWorksSub}
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{UI.metrics.totalReceived}</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {total} <span className="text-xs font-medium text-slate-500">{UI.units.complaints}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{UI.metrics.inProgress}</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-5 h-5 animate-spin" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {inProgress} <span className="text-xs font-medium text-slate-500">{UI.units.complaints}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{UI.metrics.resolutionRate}</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">
            {resolutionRate} <span className="text-xs font-medium text-emerald-700">{UI.units.percent}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{UI.metrics.satisfactionRate}</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-600">
            {avgRating} <span className="text-xs font-medium text-amber-700">{UI.units.stars}</span>
          </div>
        </div>
      </div>

      {/* Category Progress Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>{UI.headings.categoryBreakdown}</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {categories.length} {UI.units.items}
          </span>
        </div>

        <div className="space-y-5">
          {categories.map((cat) => {
            const catCount = complaints.filter((c) => c.categoryId === cat.id).length;
            const pct = total > 0 ? Math.round((catCount / total) * 100) : 0;
            return (
              <div key={cat.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-800">{cat.name}</span>
                  <span className="text-xs text-slate-600 font-mono font-medium">
                    {catCount} {UI.units.complaints} ({pct}{UI.units.percent})
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-xs text-slate-400">
                  {cat.department} {UI.units.dot} {UI.units.slaPrefix} {cat.defaultSlaDays} {UI.units.days}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
          <div className="text-xs font-semibold text-slate-500">{UI.status.pending}</div>
          <div className="text-2xl font-bold text-amber-600">
            {pending} <span className="text-xs font-normal text-slate-400">{UI.units.complaints}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
          <div className="text-xs font-semibold text-slate-500">{UI.status.in_progress}</div>
          <div className="text-2xl font-bold text-blue-600">
            {inProgress} <span className="text-xs font-normal text-slate-400">{UI.units.complaints}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
          <div className="text-xs font-semibold text-slate-500">{UI.status.resolved}</div>
          <div className="text-2xl font-bold text-emerald-600">
            {resolved} <span className="text-xs font-normal text-slate-400">{UI.units.complaints}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
          <div className="text-xs font-semibold text-slate-500">{UI.status.rejected}</div>
          <div className="text-2xl font-bold text-slate-600">
            {rejected} <span className="text-xs font-normal text-slate-400">{UI.units.complaints}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
