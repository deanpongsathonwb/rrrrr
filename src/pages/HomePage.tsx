import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/src/stores/app.store';
import { UI, ROUTES } from '@/src/constants';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import {
  FilePlus,
  Search,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useState, type FormEvent } from 'react';

export const HomePage = () => {
  const navigate = useNavigate();
  const { complaints, categories, settings } = useAppStore();
  const [quickQuery, setQuickQuery] = useState('');

  const totalCount = complaints.length;
  const inProgressCount = complaints.filter((c) => c.status === 'in_progress').length;
  const resolvedCount = complaints.filter((c) => c.status === 'resolved').length;
  const recentResolved = complaints.filter((c) => c.status === 'resolved').slice(0, 3);

  const handleQuickTrack = (e: FormEvent) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      navigate(`${ROUTES.TRACK}?q=${encodeURIComponent(quickQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section
        id="hero-banner-section"
        className="relative bg-gradient-to-b from-blue-50/70 via-slate-50 to-white pt-12 pb-20 border-b border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>{UI.hero.badgeFeature}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {UI.hero.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              {UI.hero.subtitle}
            </p>

            {/* Quick Track Input */}
            <form
              id="hero-quick-track-form"
              onSubmit={handleQuickTrack}
              className="mt-8 flex flex-col sm:flex-row items-center gap-2 max-w-xl mx-auto bg-white p-2 rounded-2xl shadow-lg border border-slate-200"
            >
              <div className="relative flex-1 w-full">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="hero-quick-search-input"
                  type="text"
                  value={quickQuery}
                  onChange={(e) => setQuickQuery(e.target.value)}
                  placeholder={UI.forms.tracking.placeholder}
                  className="w-full pl-11 pr-4 py-3 text-sm text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <button
                id="btn-hero-quick-track"
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>{UI.buttons.track}</span>
              </button>
            </form>

            {/* Main Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                id="btn-hero-submit-cta"
                to={ROUTES.SUBMIT}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5"
              >
                <FilePlus className="w-5 h-5" />
                <span>{UI.hero.submitCta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                id="btn-hero-track-cta"
                to={ROUTES.TRACK}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold bg-white text-slate-800 hover:bg-slate-50 border border-slate-300 shadow-sm transition-all"
              >
                <Search className="w-5 h-5 text-slate-500" />
                <span>{UI.hero.trackCta}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Summary Strip */}
      <section id="metrics-summary-strip" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white rounded-2xl shadow-md border border-slate-200 p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FilePlus className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                {totalCount}{' '}
                <span className="text-sm font-medium text-slate-500">{UI.units.complaints}</span>
              </div>
              <div className="text-sm text-slate-600">{UI.metrics.totalReceived}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                {inProgressCount}{' '}
                <span className="text-sm font-medium text-slate-500">{UI.units.complaints}</span>
              </div>
              <div className="text-sm text-slate-600">{UI.metrics.inProgress}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                {resolvedCount}{' '}
                <span className="text-sm font-medium text-slate-500">{UI.units.complaints}</span>
              </div>
              <div className="text-sm text-slate-600">{UI.metrics.resolved}</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (4 Steps) */}
      <section id="how-it-works-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {UI.headings.howItWorks}
          </h2>
          <p className="mt-3 text-slate-600">
            {UI.headings.howItWorksSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {UI.steps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-lg mb-4">
                {step.number}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Showcase */}
      <section id="categories-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {UI.headings.categoryBreakdown}
            </h2>
            <p className="mt-2 text-slate-600">
              {settings.agencyName}
            </p>
          </div>
          <Link
            id="link-all-categories"
            to={ROUTES.SUBMIT}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
          >
            <span>{UI.buttons.submit}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const count = complaints.filter((c) => c.categoryId === cat.id).length;
            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {cat.department}
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 shrink-0">
                    {count} {UI.units.complaints}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {UI.units.slaPrefix} {cat.defaultSlaDays} {UI.units.days}
                  </span>
                  <Link
                    to={`${ROUTES.SUBMIT}?category=${cat.id}`}
                    className="font-medium text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>{UI.buttons.submit}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Resolved Complaints */}
      {recentResolved.length > 0 && (
        <section id="recent-resolved-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {UI.headings.recentPublicComplaints}
              </h2>
              <p className="mt-2 text-slate-600">
                {UI.headings.howItWorksSub}
              </p>
            </div>
            <Link
              id="link-view-statistics"
              to={ROUTES.STATISTICS}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>{UI.nav.public.statistics}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentResolved.map((complaint) => (
              <div
                key={complaint.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-blue-600">
                      {complaint.trackingCode}
                    </span>
                    <StatusBadge status={complaint.status} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-2">
                    {complaint.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3">
                    {complaint.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-2">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{complaint.location}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(complaint.createdAt).toLocaleDateString('th-TH')}</span>
                  </div>
                  <Link
                    to={`${ROUTES.TRACK}?q=${encodeURIComponent(complaint.trackingCode)}`}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {UI.buttons.viewDetails}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Citizen Guidance & Rights Footer Strip */}
      <section id="faq-summary-strip" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-emerald-400 border border-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{UI.app.badge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {UI.headings.faqTitle}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {UI.headings.faqSubtitle}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link
              id="btn-faq-link"
              to={ROUTES.FAQ}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{UI.nav.public.faq}</span>
            </Link>
            <Link
              id="btn-bottom-submit"
              to={ROUTES.SUBMIT}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <FilePlus className="w-4 h-4" />
              <span>{UI.buttons.submit}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
