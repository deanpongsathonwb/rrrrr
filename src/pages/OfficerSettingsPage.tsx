import { useState, useEffect, type FormEvent } from 'react';
import { useAppStore } from '@/src/stores/app.store';
import { useUiStore } from '@/src/stores/ui.store';
import { UI } from '@/src/constants';
import { SystemSettings } from '@/src/types/common.types';
import { Settings, Save, RotateCcw, Building2, Sliders, Check } from 'lucide-react';

export const OfficerSettingsPage = () => {
  const { settings, updateSettings, resetSettings } = useAppStore();
  const { showToast } = useUiStore();

  const [formState, setFormState] = useState<SystemSettings>(settings);

  useEffect(() => {
    setFormState(settings);
  }, [settings]);

  const handleChange = (field: keyof SystemSettings, value: string | number | boolean) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    updateSettings(formState);
    showToast(UI.toasts.settingsSavedSuccess, 'success');
  };

  const handleReset = () => {
    resetSettings();
    showToast(UI.toasts.settingsResetSuccess, 'info');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-7 h-7 text-blue-600" />
            <span>{UI.nav.authenticated.systemSettings}</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {UI.forms.settings.agencySubtitle}
          </p>
        </div>

        <button
          id="btn-restore-default-settings"
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors self-start"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{UI.buttons.restoreDefaults}</span>
        </button>
      </div>

      <form id="system-settings-form" onSubmit={handleSave} className="space-y-8">
        {/* Agency Info Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {UI.forms.settings.agencyTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {UI.forms.settings.agencySubtitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label htmlFor="input-settings-agency-name" className="block text-xs font-semibold text-slate-700">
                {UI.forms.settings.agencyName}
              </label>
              <input
                id="input-settings-agency-name"
                type="text"
                value={formState.agencyName}
                onChange={(e) => handleChange('agencyName', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="input-settings-hotline" className="block text-xs font-semibold text-slate-700">
                {UI.forms.settings.hotline}
              </label>
              <input
                id="input-settings-hotline"
                type="text"
                value={formState.hotline}
                onChange={(e) => handleChange('hotline', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="input-settings-phone" className="block text-xs font-semibold text-slate-700">
                {UI.forms.settings.phone}
              </label>
              <input
                id="input-settings-phone"
                type="text"
                value={formState.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="input-settings-email" className="block text-xs font-semibold text-slate-700">
                {UI.forms.settings.email}
              </label>
              <input
                id="input-settings-email"
                type="email"
                value={formState.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="input-settings-working-hours" className="block text-xs font-semibold text-slate-700">
                {UI.forms.settings.workingHours}
              </label>
              <input
                id="input-settings-working-hours"
                type="text"
                value={formState.workingHours}
                onChange={(e) => handleChange('workingHours', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label htmlFor="input-settings-address" className="block text-xs font-semibold text-slate-700">
                {UI.forms.settings.address}
              </label>
              <textarea
                id="input-settings-address"
                rows={2}
                value={formState.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>

        {/* Rules & SLA Controls */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {UI.forms.settings.rulesTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {UI.forms.settings.rulesSubtitle}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="max-w-xs space-y-1.5">
              <label htmlFor="input-settings-sla-days" className="block text-xs font-semibold text-slate-700">
                {UI.forms.settings.defaultSlaDays}
              </label>
              <input
                id="input-settings-sla-days"
                type="number"
                min={1}
                max={60}
                value={formState.defaultSlaDays}
                onChange={(e) => handleChange('defaultSlaDays', parseInt(e.target.value, 10) || 1)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="pt-2 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  id="toggle-auto-assignment"
                  type="checkbox"
                  checked={formState.autoAssignment}
                  onChange={(e) => handleChange('autoAssignment', e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="text-sm text-slate-800 font-medium">
                  {UI.forms.settings.autoAssignment}
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  id="toggle-public-dashboard"
                  type="checkbox"
                  checked={formState.publicDashboard}
                  onChange={(e) => handleChange('publicDashboard', e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="text-sm text-slate-800 font-medium">
                  {UI.forms.settings.publicDashboard}
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  id="toggle-email-notifications"
                  type="checkbox"
                  checked={formState.emailNotification}
                  onChange={(e) => handleChange('emailNotification', e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="text-sm text-slate-800 font-medium">
                  {UI.forms.settings.emailNotification}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            id="btn-save-settings"
            type="submit"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20"
          >
            <Check className="w-4 h-4" />
            <span>{UI.buttons.save}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
