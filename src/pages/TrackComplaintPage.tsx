import { useState, useEffect, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppStore } from '@/src/stores/app.store';
import { useUiStore } from '@/src/stores/ui.store';
import { UI } from '@/src/constants';
import { StatusBadge, PriorityBadge } from '@/src/components/ui/StatusBadge';
import { Complaint } from '@/src/types/common.types';
import {
  Search,
  Calendar,
  MapPin,
  Clock,
  User,
  MessageSquare,
  Star,
  Printer,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  FileQuestion,
  CornerDownRight,
} from 'lucide-react';

export const TrackComplaintPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const { getComplaintByCodeOrPhone, submitRating, categories } = useAppStore();
  const { showToast } = useUiStore();

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [matchedComplaints, setMatchedComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [copied, setCopied] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Rating State
  const [ratingScore, setRatingScore] = useState<number>(5);
  const [ratingComment, setRatingComment] = useState<string>('');

  useEffect(() => {
    if (queryParam) {
      setSearchQuery(queryParam);
      performSearch(queryParam);
    }
  }, [queryParam]);

  const performSearch = (q: string) => {
    setHasSearched(true);
    const results = getComplaintByCodeOrPhone(q);
    setMatchedComplaints(results);
    if (results.length > 0) {
      setSelectedComplaint(results[0]);
    } else {
      setSelectedComplaint(null);
      showToast(UI.toasts.notFound, 'error');
    }
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
      performSearch(searchQuery.trim());
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      showToast(UI.toasts.copyTrackingSuccess, 'success');
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // clipboard permission fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRatingSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (selectedComplaint) {
      submitRating(selectedComplaint.id, ratingScore, ratingComment);
      showToast(UI.toasts.ratingSubmittedSuccess, 'success');
      // Update selected view
      setSelectedComplaint({
        ...selectedComplaint,
        rating: {
          score: ratingScore,
          comment: ratingComment,
          submittedAt: new Date().toISOString(),
        },
      });
      setRatingComment('');
    }
  };

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name : catId;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Search Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {UI.forms.tracking.title}
          </h1>
          <p className="text-sm text-slate-600">
            {UI.forms.tracking.subtitle}
          </p>
        </div>

        <form
          id="tracking-search-form"
          onSubmit={handleSearchSubmit}
          className="flex flex-col sm:flex-row gap-3 pt-2"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              id="input-tracking-query"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={UI.forms.tracking.placeholder}
              className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <button
            id="btn-tracking-search"
            type="submit"
            className="px-6 py-3 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Search className="w-4 h-4" />
            <span>{UI.buttons.track}</span>
          </button>
        </form>
      </div>

      {/* Multiple Results Tab Selector (if phone search yielded multiple) */}
      {matchedComplaints.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {matchedComplaints.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedComplaint(item)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-colors ${
                selectedComplaint?.id === item.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {item.trackingCode} - {item.title.slice(0, 20)}...
            </button>
          ))}
        </div>
      )}

      {/* Complaint Detail View */}
      {selectedComplaint ? (
        <div
          id="complaint-detail-sheet"
          className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 animate-fade-in"
        >
          {/* Top Bar: Tracking Code & Status & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-500">
                {UI.tableHeaders.trackingCode}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl font-mono font-extrabold text-blue-700">
                  {selectedComplaint.trackingCode}
                </span>
                <button
                  id="btn-copy-code-detail"
                  type="button"
                  onClick={() => handleCopyCode(selectedComplaint.trackingCode)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <PriorityBadge priority={selectedComplaint.priority} />
              <StatusBadge status={selectedComplaint.status} />
              <button
                id="btn-print-detail"
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{UI.buttons.print}</span>
              </button>
            </div>
          </div>

          {/* Incident Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                  {getCategoryName(selectedComplaint.categoryId)}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                  {selectedComplaint.title}
                </h2>
              </div>

              <div className="text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                {selectedComplaint.description}
              </div>

              <div className="flex items-start gap-2 text-xs text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{selectedComplaint.location}</span>
              </div>

              {/* Attached Image if exists */}
              {selectedComplaint.imageUrl && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-500">
                    {UI.modals.officerAction.evidenceImage}
                  </div>
                  <img
                    src={selectedComplaint.imageUrl}
                    alt={selectedComplaint.title}
                    referrerPolicy="no-referrer"
                    className="max-h-72 w-full object-cover rounded-2xl border border-slate-200"
                  />
                </div>
              )}
            </div>

            {/* Meta Sidebar */}
            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 h-fit">
              <div className="space-y-1">
                <div className="text-xs text-slate-500">{UI.tableHeaders.submittedDate}</div>
                <div className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{new Date(selectedComplaint.createdAt).toLocaleString('th-TH')}</span>
                </div>
              </div>

              <div className="space-y-1 border-t border-slate-200/60 pt-3">
                <div className="text-xs text-slate-500">{UI.modals.officerAction.citizenInfo}</div>
                <div className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {selectedComplaint.isAnonymous
                      ? UI.placeholders.anonymousCitizen
                      : selectedComplaint.citizenName}
                  </span>
                </div>
              </div>

              {selectedComplaint.resolutionDetails && (
                <div className="space-y-1 border-t border-slate-200/60 pt-3">
                  <div className="text-xs font-bold text-emerald-700">
                    {UI.status.resolved}
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    {selectedComplaint.resolutionDetails}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timeline Section */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>{UI.headings.timeline}</span>
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {selectedComplaint.timeline.map((item, index) => (
                <div key={index} className="relative space-y-1">
                  <div className="absolute -left-6 sm:-left-8 top-1 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
                  <div className="text-xs text-slate-400 font-mono">
                    {new Date(item.timestamp).toLocaleString('th-TH')}
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    {item.action}
                  </div>
                  <div className="text-xs text-slate-500">
                    {item.actor}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Officer Responses */}
          {selectedComplaint.officerResponses.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <span>{UI.headings.officerResponse}</span>
              </h3>

              <div className="space-y-3">
                {selectedComplaint.officerResponses.map((res, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-900 flex items-center gap-1.5">
                        <CornerDownRight className="w-3.5 h-3.5 text-blue-600" />
                        <span>{res.officerName}</span>
                      </span>
                      <span className="text-slate-400">
                        {new Date(res.timestamp).toLocaleString('th-TH')}
                      </span>
                    </div>
                    <p className="text-sm text-slate-800 leading-relaxed pl-5">
                      {res.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Citizen Feedback & Rating Module (For Resolved Complaints) */}
          {selectedComplaint.status === 'resolved' && (
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span>{UI.headings.citizenFeedback}</span>
              </h3>

              {selectedComplaint.rating ? (
                <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= selectedComplaint.rating!.score
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-amber-900">
                      {selectedComplaint.rating.score} {UI.units.outOfFive} {UI.units.stars}
                    </span>
                  </div>
                  {selectedComplaint.rating.comment && (
                    <p className="text-sm text-slate-700 italic">
                      {selectedComplaint.rating.comment}
                    </p>
                  )}
                  <div className="text-xs text-slate-500 pt-1">
                    {new Date(selectedComplaint.rating.submittedAt).toLocaleString('th-TH')}
                  </div>
                </div>
              ) : (
                <form
                  id="rating-submission-form"
                  onSubmit={handleRatingSubmit}
                  className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4"
                >
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-slate-800">
                      {UI.forms.rating.title}
                    </div>
                    <div className="text-xs text-slate-500">
                      {UI.forms.rating.subtitle}
                    </div>
                  </div>

                  {/* Star Rating buttons */}
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingScore(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= ratingScore
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-sm font-semibold text-slate-700 ml-2">
                      {ratingScore} {UI.units.stars}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="input-rating-comment" className="block text-xs font-semibold text-slate-700">
                      {UI.forms.rating.commentLabel}
                    </label>
                    <textarea
                      id="input-rating-comment"
                      rows={2}
                      value={ratingComment}
                      onChange={(e) => setRatingComment(e.target.value)}
                      placeholder={UI.forms.rating.commentPlaceholder}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <button
                    id="btn-submit-rating"
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-sm"
                  >
                    {UI.buttons.submitRating}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      ) : hasSearched ? (
        <div
          id="not-found-card"
          className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm text-center space-y-4"
        >
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileQuestion className="w-8 h-8" />
          </div>
          <div className="text-lg font-bold text-slate-900">
            {UI.placeholders.noSearchResults}
          </div>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            {UI.toasts.notFound}
          </p>
        </div>
      ) : null}
    </div>
  );
};
