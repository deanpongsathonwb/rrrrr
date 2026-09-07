import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/src/stores/auth.store';
import { useUiStore } from '@/src/stores/ui.store';
import { UI, ROUTES } from '@/src/constants';
import { loginFormSchema, LoginFormData } from '@/src/validations/forms/complaint.validation';
import {
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentOfficer, login } = useAuthStore();
  const { showToast } = useUiStore();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // If already authenticated, route automatically to the designated Production Portal
  if (isAuthenticated && currentOfficer) {
    if (currentOfficer.roleType === 'admin') {
      return <Navigate to={ROUTES.ADMIN_COMPLAINTS} replace />;
    }
    return <Navigate to={ROUTES.OFFICER_COMPLAINTS} replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    const result = login(data.email, data.password);

    if (result.success && result.officer) {
      showToast(UI.toasts.loginSuccess, 'success');
      // Automatic Production Portal Routing based on account & role:
      if (result.officer.roleType === 'admin') {
        navigate(ROUTES.ADMIN_COMPLAINTS, { replace: true });
      } else {
        navigate(ROUTES.OFFICER_COMPLAINTS, { replace: true });
      }
    } else {
      const errMsg = result.message || UI.toasts.loginFailed;
      setAuthError(errMsg);
      showToast(errMsg, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8 antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Bar: Return to Citizen Portal */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
        <Link
          id="btn-return-citizen-portal"
          to={ROUTES.HOME}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{UI.forms.officerLogin.backToCitizen}</span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>ระบบรักษาความปลอดภัย SSL 256-bit</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md mx-auto w-full my-auto py-8">
        <div className="text-center space-y-3 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-blue-600/30 ring-4 ring-blue-500/20">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {UI.forms.officerLogin.title}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              {UI.forms.officerLogin.subtitle}
            </p>
          </div>
        </div>

        <div className="bg-slate-800/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-6">
          {/* Security Alert Header */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-blue-950/60 border border-blue-800/60 text-xs text-blue-200 leading-relaxed">
            <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>{UI.portals.securityProtocol}</span>
          </div>

          {/* Inline Auth Error Banner */}
          {authError && (
            <div
              id="auth-error-banner"
              className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-xs text-rose-200 animate-shake"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form id="production-login-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="input-login-email"
                className="block text-xs font-semibold text-slate-300 tracking-wide"
              >
                {UI.forms.officerLogin.emailLabel}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="input-login-email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  placeholder={UI.forms.officerLogin.emailPlaceholder}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 text-white placeholder-slate-500 border text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? 'border-rose-500 focus:ring-rose-500/30'
                      : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                />
              </div>
              {errors.email && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.email.message}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="input-login-password"
                className="block text-xs font-semibold text-slate-300 tracking-wide"
              >
                {UI.forms.officerLogin.passwordLabel}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="input-login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password')}
                  placeholder={UI.forms.officerLogin.passwordPlaceholder}
                  className={`w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-900/90 text-white placeholder-slate-500 border text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? 'border-rose-500 focus:ring-rose-500/30'
                      : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                />
                <button
                  id="btn-toggle-password-visibility"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
                  aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-slate-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.password.message}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              id="btn-production-login-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? UI.buttons.loggingIn : UI.buttons.login}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Official Security Disclaimer */}
          <div className="pt-4 border-t border-slate-700/60 text-[11px] text-slate-400 text-center leading-relaxed">
            {UI.forms.officerLogin.securityNotice}
          </div>
        </div>
      </div>

      {/* Footer System Info */}
      <div className="max-w-7xl w-full mx-auto text-center text-xs text-slate-500 py-2">
        <span>{UI.footer.rights}</span> · <span>{UI.app.name}</span>
      </div>
    </div>
  );
};
