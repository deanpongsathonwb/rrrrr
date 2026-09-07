import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/src/stores/auth.store';
import { useUiStore } from '@/src/stores/ui.store';
import { UI, ROUTES } from '@/src/constants';
import { ToastNotification } from '@/src/components/feedback/ToastNotification';
import {
  ShieldCheck,
  FileText,
  Settings,
  BarChart3,
  ExternalLink,
  LogOut,
  Shield,
  User,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

export const PortalLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentOfficer, logout } = useAuthStore();
  const { showToast } = useUiStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = currentOfficer?.roleType === 'admin';
  const portalName = isAdmin ? UI.portals.admin.name : UI.portals.officer.name;
  const portalBadge = isAdmin ? UI.portals.admin.badge : UI.portals.officer.badge;

  const navItems = isAdmin
    ? [
        {
          label: UI.nav.authenticated.manageComplaints,
          path: ROUTES.ADMIN_COMPLAINTS,
          icon: FileText,
        },
        {
          label: UI.nav.authenticated.systemSettings,
          path: ROUTES.ADMIN_SETTINGS,
          icon: Settings,
        },
        {
          label: UI.nav.public.statistics,
          path: ROUTES.STATISTICS,
          icon: BarChart3,
        },
      ]
    : [
        {
          label: UI.nav.authenticated.manageComplaints,
          path: ROUTES.OFFICER_COMPLAINTS,
          icon: FileText,
        },
        {
          label: UI.nav.public.statistics,
          path: ROUTES.STATISTICS,
          icon: BarChart3,
        },
      ];

  const handleLogout = () => {
    logout();
    showToast(UI.toasts.logoutSuccess, 'info');
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans antialiased">
      {/* Official Government Portal Top Bar */}
      <header
        id="production-portal-header"
        className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* System Emblem & Portal Identifier */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {UI.app.name}
                  </span>
                  <span
                    id="portal-role-indicator-badge"
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                      isAdmin
                        ? 'bg-purple-950 text-purple-200 border-purple-800'
                        : 'bg-blue-950 text-blue-200 border-blue-800'
                    }`}
                  >
                    {portalBadge}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-medium">{portalName}</span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5">
              {navItems.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    id={`portal-nav-${item.path.replace(/[^a-zA-Z0-9]/g, '-')}`}
                    to={item.path}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: Officer Profile & Logout */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                id="btn-portal-view-citizen-site"
                to={ROUTES.HOME}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors"
                title="เปิดหน้าพอร์ทัลบริการประชาชน"
              >
                <span>{UI.portals.citizen.name}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <div className="h-6 w-px bg-slate-800" />

              <div className="flex items-center gap-3">
                <img
                  src={currentOfficer?.avatar}
                  alt={currentOfficer?.name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-700 shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <div className="text-left">
                  <div className="text-xs font-semibold text-white leading-tight">
                    {currentOfficer?.name}
                  </div>
                  <div className="text-[11px] text-slate-400 leading-tight">
                    {currentOfficer?.role}
                  </div>
                </div>
              </div>

              <button
                id="btn-portal-logout"
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-300 hover:text-rose-100 hover:bg-rose-950/80 border border-rose-900/60 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{UI.buttons.logout}</span>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center md:hidden gap-2">
              <button
                id="btn-portal-mobile-menu-toggle"
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 py-4 space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <img
                src={currentOfficer?.avatar}
                alt={currentOfficer?.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-700"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="text-sm font-semibold text-white">{currentOfficer?.name}</div>
                <div className="text-xs text-slate-400">{currentOfficer?.department}</div>
              </div>
            </div>

            <div className="space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                      active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <Link
                to={ROUTES.HOME}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-xs text-slate-300 py-2 px-3 rounded-lg hover:bg-slate-800"
              >
                <span>{UI.portals.citizen.name}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 text-xs font-semibold text-rose-300 py-2 px-3 rounded-lg hover:bg-rose-950/60 text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>{UI.buttons.logout}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Production Portal Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-4 px-4 text-xs text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>{portalName} · {UI.app.name}</div>
          <div className="text-slate-500">
            {UI.footer.rights}
          </div>
        </div>
      </footer>

      <ToastNotification />
    </div>
  );
};
