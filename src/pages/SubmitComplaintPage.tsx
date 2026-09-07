import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '@/src/stores/app.store';
import { useUiStore } from '@/src/stores/ui.store';
import { UI, ROUTES } from '@/src/constants';
import {
  complaintFormSchema,
  ComplaintFormData,
} from '@/src/validations/forms/complaint.validation';
import {
  ShieldAlert,
  Send,
  Copy,
  Check,
  CheckCircle2,
  Upload,
  AlertCircle,
  FileText,
  UserX,
} from 'lucide-react';

export const SubmitComplaintPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialCategory = searchParams.get('category') || '';

  const { categories, addComplaint } = useAppStore();
  const { showToast } = useUiStore();

  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintFormSchema),
    defaultValues: {
      title: '',
      categoryId: initialCategory,
      description: '',
      location: '',
      isAnonymous: false,
      citizenName: '',
      citizenPhone: '',
      citizenEmail: '',
      imageUrl: '',
      termsConsent: false,
    },
  });

  const isAnonymous = watch('isAnonymous');

  const onFormSubmit = async (data: ComplaintFormData) => {
    const newComplaint = addComplaint({
      title: data.title,
      categoryId: data.categoryId,
      description: data.description,
      location: data.location,
      citizenName: data.citizenName,
      citizenPhone: data.citizenPhone,
      citizenEmail: data.citizenEmail,
      isAnonymous: data.isAnonymous,
      imageUrl: data.imageUrl,
    });

    setSubmittedCode(newComplaint.trackingCode);
    showToast(UI.toasts.complaintCreatedSuccess, 'success');
  };

  const handleCopyCode = async () => {
    if (submittedCode) {
      try {
        await navigator.clipboard.writeText(submittedCode);
        setCopied(true);
        showToast(UI.toasts.copyTrackingSuccess, 'success');
        setTimeout(() => setCopied(false), 3000);
      } catch {
        // clipboard permission fallback
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Success Modal / Banner when submitted */}
      {submittedCode ? (
        <div
          id="submission-success-card"
          className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-200 shadow-xl text-center space-y-8 animate-fade-in"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {UI.modals.success.title}
            </h2>
            <p className="text-slate-600 max-w-lg mx-auto text-sm sm:text-base">
              {UI.modals.success.subtitle}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-md mx-auto space-y-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {UI.modals.success.trackingNotice}
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-blue-600 tracking-wider">
              {submittedCode}
            </div>
            <button
              id="btn-copy-tracking-code"
              type="button"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? UI.buttons.copied : UI.buttons.copyTrackingCode}</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            {UI.modals.success.saveCodeReminder}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              id="btn-go-to-tracking"
              to={`${ROUTES.TRACK}?q=${encodeURIComponent(submittedCode)}`}
              className="px-6 py-3 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20"
            >
              {UI.modals.success.goToTracking}
            </Link>
            <button
              id="btn-submit-another"
              type="button"
              onClick={() => {
                reset();
                setSubmittedCode(null);
              }}
              className="px-6 py-3 rounded-xl text-sm font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {UI.buttons.reset}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          {/* Header */}
          <div className="pb-6 border-b border-slate-100 space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{UI.app.badge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {UI.forms.complaint.title}
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              {UI.forms.complaint.subtitle}
            </p>
          </div>

          <form id="complaint-submission-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Title */}
            <div className="space-y-1.5">
              <label htmlFor="input-complaint-title" className="block text-sm font-semibold text-slate-800">
                {UI.forms.complaint.fields.title.label} <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-complaint-title"
                type="text"
                {...register('title')}
                placeholder={UI.forms.complaint.fields.title.placeholder}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  errors.title
                    ? 'border-rose-300 focus:ring-rose-500/20'
                    : 'border-slate-300 focus:ring-blue-500/20'
                }`}
              />
              {errors.title && (
                <div className="flex items-center gap-1 text-xs text-rose-600 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.title.message}</span>
                </div>
              )}
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label htmlFor="select-complaint-category" className="block text-sm font-semibold text-slate-800">
                {UI.forms.complaint.fields.category.label} <span className="text-rose-500">*</span>
              </label>
              <select
                id="select-complaint-category"
                {...register('categoryId')}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 ${
                  errors.categoryId
                    ? 'border-rose-300 focus:ring-rose-500/20'
                    : 'border-slate-300 focus:ring-blue-500/20'
                }`}
              >
                <option value="">{UI.forms.complaint.fields.category.placeholder}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.department})
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <div className="flex items-center gap-1 text-xs text-rose-600 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.categoryId.message}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label htmlFor="textarea-complaint-description" className="block text-sm font-semibold text-slate-800">
                {UI.forms.complaint.fields.description.label} <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="textarea-complaint-description"
                rows={4}
                {...register('description')}
                placeholder={UI.forms.complaint.fields.description.placeholder}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  errors.description
                    ? 'border-rose-300 focus:ring-rose-500/20'
                    : 'border-slate-300 focus:ring-blue-500/20'
                }`}
              />
              {errors.description && (
                <div className="flex items-center gap-1 text-xs text-rose-600 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.description.message}</span>
                </div>
              )}
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label htmlFor="input-complaint-location" className="block text-sm font-semibold text-slate-800">
                {UI.forms.complaint.fields.location.label} <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-complaint-location"
                type="text"
                {...register('location')}
                placeholder={UI.forms.complaint.fields.location.placeholder}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  errors.location
                    ? 'border-rose-300 focus:ring-rose-500/20'
                    : 'border-slate-300 focus:ring-blue-500/20'
                }`}
              />
              {errors.location && (
                <div className="flex items-center gap-1 text-xs text-rose-600 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.location.message}</span>
                </div>
              )}
            </div>

            {/* Attachment URL / Simulation */}
            <div className="space-y-1.5">
              <label htmlFor="input-attachment-url" className="block text-sm font-semibold text-slate-800">
                {UI.forms.complaint.fields.attachment.label}
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">
                      {UI.forms.complaint.fields.attachment.selectFile}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {UI.forms.complaint.fields.attachment.hint}
                    </div>
                  </div>
                </div>
                <input
                  id="input-attachment-url"
                  type="text"
                  {...register('imageUrl')}
                  placeholder={UI.forms.complaint.fields.attachment.urlPlaceholder}
                  className="w-full sm:w-72 px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>

            {/* Anonymous Toggle Option */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  id="checkbox-is-anonymous"
                  type="checkbox"
                  {...register('isAnonymous')}
                  className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <UserX className="w-4 h-4 text-slate-500" />
                    <span>{UI.forms.complaint.fields.isAnonymous.label}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {UI.forms.complaint.fields.isAnonymous.hint}
                  </div>
                </div>
              </label>
            </div>

            {/* Citizen Contact Section (Hidden if Anonymous) */}
            {!isAnonymous && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl border border-slate-200 bg-white animate-fade-in">
                <div className="sm:col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  {UI.forms.complaint.citizenInfo}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="input-citizen-name" className="block text-xs font-semibold text-slate-700">
                    {UI.forms.complaint.fields.citizenName.label} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-citizen-name"
                    type="text"
                    {...register('citizenName')}
                    placeholder={UI.forms.complaint.fields.citizenName.placeholder}
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                      errors.citizenName
                        ? 'border-rose-300 focus:ring-rose-500/20'
                        : 'border-slate-300 focus:ring-blue-500/20'
                    }`}
                  />
                  {errors.citizenName && (
                    <div className="flex items-center gap-1 text-xs text-rose-600 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.citizenName.message}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="input-citizen-phone" className="block text-xs font-semibold text-slate-700">
                    {UI.forms.complaint.fields.citizenPhone.label} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-citizen-phone"
                    type="tel"
                    {...register('citizenPhone')}
                    placeholder={UI.forms.complaint.fields.citizenPhone.placeholder}
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                      errors.citizenPhone
                        ? 'border-rose-300 focus:ring-rose-500/20'
                        : 'border-slate-300 focus:ring-blue-500/20'
                    }`}
                  />
                  {errors.citizenPhone && (
                    <div className="flex items-center gap-1 text-xs text-rose-600 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.citizenPhone.message}</span>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label htmlFor="input-citizen-email" className="block text-xs font-semibold text-slate-700">
                    {UI.forms.complaint.fields.citizenEmail.label}
                  </label>
                  <input
                    id="input-citizen-email"
                    type="email"
                    {...register('citizenEmail')}
                    placeholder={UI.forms.complaint.fields.citizenEmail.placeholder}
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                      errors.citizenEmail
                        ? 'border-rose-300 focus:ring-rose-500/20'
                        : 'border-slate-300 focus:ring-blue-500/20'
                    }`}
                  />
                  {errors.citizenEmail && (
                    <div className="flex items-center gap-1 text-xs text-rose-600 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.citizenEmail.message}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Terms & Certification */}
            <div className="space-y-1 pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  id="checkbox-terms-consent"
                  type="checkbox"
                  {...register('termsConsent')}
                  className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="text-xs text-slate-700 leading-relaxed font-medium">
                  {UI.forms.complaint.fields.termsConsent.label} <span className="text-rose-500">*</span>
                </span>
              </label>
              {errors.termsConsent && (
                <div className="flex items-center gap-1 text-xs text-rose-600 mt-1 pl-7">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.termsConsent.message}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                id="btn-form-reset"
                type="button"
                onClick={() => reset()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {UI.buttons.reset}
              </button>
              <button
                id="btn-form-submit"
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? UI.buttons.submitting : UI.buttons.submit}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
