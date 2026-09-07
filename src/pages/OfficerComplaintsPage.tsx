import { useState, useMemo, type FormEvent } from 'react';
import { useAppStore } from '@/src/stores/app.store';
import { useAuthStore } from '@/src/stores/auth.store';
import { useUiStore } from '@/src/stores/ui.store';
import { UI } from '@/src/constants';
import { StatusBadge, PriorityBadge } from '@/src/components/ui/StatusBadge';
import { Complaint, ComplaintStatus } from '@/src/types/common.types';
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Send,
  X,
  MapPin,
  Calendar,
  User,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const OfficerComplaintsPage = () => {
  const { complaints, categories, updateComplaintStatus } = useAppStore();
  const { currentOfficer, officers } = useAuthStore();
  const { showToast } = useUiStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);

  // Form State inside Modal
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('in_progress');
  const [assignedOfficerId, setAssignedOfficerId] = useState<string>('');
  const [responseMsg, setResponseMsg] = useState<string>('');
  const [internalNote, setInternalNote] = useState<string>('');

  const openActionModal = (complaint: Complaint) => {
    setActiveComplaint(complaint);
    setNewStatus(complaint.status);
    setAssignedOfficerId(complaint.assignedOfficerId || currentOfficer?.id || '');
    setResponseMsg('');
    setInternalNote('');
  };

  const handleUpdateComplaint = (e: FormEvent) => {
    e.preventDefault();
    if (!activeComplaint) return;

    const assignedOfficer = officers.find((o) => o.id === assignedOfficerId);
    const officerName = assignedOfficer ? assignedOfficer.name : (currentOfficer?.name || '');

    updateComplaintStatus(
      activeComplaint.id,
      newStatus,
      officerName,
      responseMsg,
      assignedOfficerId
    );

    showToast(UI.toasts.statusUpdatedSuccess, 'success');
    setActiveComplaint(null);
  };

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchStatus = selectedStatus === 'all' || c.status === selectedStatus;
      const matchCategory = selectedCategory === 'all' || c.categoryId === selectedCategory;
      const matchQuery =
        !searchQuery.trim() ||
        c.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase());

      return matchStatus && matchCategory && matchQuery;
    });
  }, [complaints, selectedStatus, selectedCategory, searchQuery]);

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name : catId;
  };

  const getOfficerName = (id: string) => {
    const off = officers.find((o) => o.id === id);
    return off ? off.name : UI.placeholders.unassigned;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {UI.nav.authenticated.manageComplaints}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {UI.headings.complaintList}
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 self-start">
          {currentOfficer?.name} ({currentOfficer?.department})
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="officer-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={UI.placeholders.searchComplaints}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <select
              id="officer-status-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">{UI.status.all}</option>
              <option value="pending">{UI.status.pending}</option>
              <option value="in_progress">{UI.status.in_progress}</option>
              <option value="resolved">{UI.status.resolved}</option>
              <option value="rejected">{UI.status.rejected}</option>
            </select>
          </div>

          <div>
            <select
              id="officer-category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">{UI.placeholders.filterAllCategories}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table id="complaints-data-table" className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
              <tr>
                <th className="py-4 px-6">{UI.tableHeaders.trackingCode}</th>
                <th className="py-4 px-6">{UI.tableHeaders.title}</th>
                <th className="py-4 px-6">{UI.tableHeaders.category}</th>
                <th className="py-4 px-6">{UI.tableHeaders.status}</th>
                <th className="py-4 px-6">{UI.tableHeaders.priority}</th>
                <th className="py-4 px-6">{UI.tableHeaders.assignedOfficer}</th>
                <th className="py-4 px-6 text-right">{UI.tableHeaders.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    {UI.placeholders.noSearchResults}
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {item.trackingCode}
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <div className="font-semibold text-slate-900 truncate">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600 whitespace-nowrap">
                      {getCategoryName(item.categoryId)}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <PriorityBadge priority={item.priority} />
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600 whitespace-nowrap">
                      {getOfficerName(item.assignedOfficerId)}
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <button
                        id={`btn-manage-complaint-${item.id}`}
                        type="button"
                        onClick={() => openActionModal(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{UI.buttons.updateStatus}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action / Detail Modal */}
      {activeComplaint && (
        <div
          id="officer-action-modal"
          className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="text-xs font-mono font-bold text-blue-600">
                  {activeComplaint.trackingCode}
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {UI.modals.officerAction.title}
                </h2>
              </div>
              <button
                id="btn-close-modal"
                type="button"
                onClick={() => setActiveComplaint(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Complaint Info Snippet */}
            <div className="p-4 rounded-2xl bg-slate-50 space-y-2 border border-slate-100">
              <div className="text-sm font-bold text-slate-900">
                {activeComplaint.title}
              </div>
              <div className="text-xs text-slate-600 leading-relaxed">
                {activeComplaint.description}
              </div>
              <div className="text-xs text-slate-500 pt-1 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>{activeComplaint.location}</span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <User className="w-3.5 h-3.5" />
                <span>
                  {activeComplaint.isAnonymous
                    ? UI.placeholders.anonymousCitizen
                    : `${activeComplaint.citizenName} (${activeComplaint.citizenPhone})`}
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateComplaint} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    {UI.forms.statusUpdate.statusLabel}
                  </label>
                  <select
                    id="modal-status-select"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="pending">{UI.status.pending}</option>
                    <option value="in_progress">{UI.status.in_progress}</option>
                    <option value="resolved">{UI.status.resolved}</option>
                    <option value="rejected">{UI.status.rejected}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    {UI.forms.statusUpdate.assignedToLabel}
                  </label>
                  <select
                    id="modal-officer-select"
                    value={assignedOfficerId}
                    onChange={(e) => setAssignedOfficerId(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">{UI.placeholders.unassigned}</option>
                    {officers.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name} ({o.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="modal-response-msg" className="block text-xs font-semibold text-slate-700">
                  {UI.forms.statusUpdate.responseLabel} <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="modal-response-msg"
                  rows={3}
                  required
                  value={responseMsg}
                  onChange={(e) => setResponseMsg(e.target.value)}
                  placeholder={UI.forms.statusUpdate.responsePlaceholder}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="modal-internal-note" className="block text-xs font-semibold text-slate-700">
                  {UI.forms.statusUpdate.internalNoteLabel}
                </label>
                <textarea
                  id="modal-internal-note"
                  rows={2}
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder={UI.forms.statusUpdate.internalNotePlaceholder}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  id="btn-modal-cancel"
                  type="button"
                  onClick={() => setActiveComplaint(null)}
                  className="px-5 py-2 rounded-xl text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {UI.buttons.cancel}
                </button>
                <button
                  id="btn-modal-save"
                  type="submit"
                  className="px-6 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{UI.buttons.save}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
