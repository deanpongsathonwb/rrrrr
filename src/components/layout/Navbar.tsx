import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/src/stores/auth.store';
import { useUiStore } from '@/src/stores/ui.store';
import { UI, ROUTES } from '@/src/constants';
import {
  FileText,
  Search,
  BarChart3,
  HelpCircle,
  LogIn,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  FilePlus,
  ArrowRight,
} from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, currentOfficer, logout } = useAuthStore();
  const { mobileMenuOpen, toggleMobileMenu, setMobileMenuOpen } = useUiStore();

  const publicNavItems = [
    { label: UI.nav.public.home, path: ROUTES.HOME, icon: FileText },
    { label: UI.nav.public.submitComplaint, path: ROUTES.SUBMIT, icon: FilePlus },
    { label: UI.nav.public.trackStatus, path: ROUTES.TRACK, icon: Search },
    { label: UI.nav.public.statistics, path: ROUTES.STATISTICS, icon: BarChart3 },
    { label: UI.nav.public.faq, path: ROUTES.FAQ, icon: HelpCircle },
  ];

  const portalPath =
    currentOfficer?.roleType === 'admin'
      ? ROUTES.ADMIN_COMPLAINTS
      : ROUTES.OFFICER_COMPLAINTS;

  const portalLabel =
    currentOfficer?.roleType === 'admin'
      ? UI.portals.admin.badge
      : UI.portals.officer.badge;

  const isActive = (path: string) => {
    if (path === ROUTES.HOME) {
      return location.pathname === ROUTES.HOME;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header
      id="main-navigation-bar"
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link
            id="nav-logo-link"
            to={ROUTES.HOME}
            className="flex items-center gap-3 focus:outline-none"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold shadow-md shadow-blue-700/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {UI.app.name}
              </span>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md self-start border border-emerald-200">
                {UI.app.badge}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            id="desktop-nav-menu"
            aria-label={UI.nav.aria.mainMenu}
            className="hidden lg:flex items-center gap-1"
          >
            {publicNavItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  id={`nav-link-${item.path.replace('/', '') || 'home'}`}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="h-6 w-px bg-slate-200 mx-2" />

            {/* Authenticated Staff vs Official Login */}
            {isAuthenticated && currentOfficer ? (
              <div className="flex items-center gap-3">
                <Link
                  id="btn-nav-go-to-portal"
                  to={portalPath}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors shadow-sm"
                >
                  <span>เข้าสู่พอร์ทัล ({portalLabel})</span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                </Link>

                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <img
                    src={currentOfficer.avatar}
                    alt={currentOfficer.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    id="btn-nav-logout"
                    onClick={logout}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{UI.buttons.logout}</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link
                id="btn-nav-login"
                to={ROUTES.LOGIN}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200"
              >
                <LogIn className="w-4 h-4" />
                <span>{UI.nav.public.officerLogin}</span>
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              id="btn-mobile-menu-toggle"
              type="button"
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label={mobileMenuOpen ? UI.nav.aria.closeMenu : UI.nav.aria.openMenu}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div id="mobile-nav-menu" className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1">
          {publicNavItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                id={`mobile-link-${item.path.replace('/', '') || 'home'}`}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                  active ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-100">
            {isAuthenticated && currentOfficer ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-slate-50 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      {currentOfficer.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {currentOfficer.department} ({portalLabel})
                    </div>
                  </div>
                </div>
                <Link
                  id="mobile-btn-go-to-portal"
                  to={portalPath}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                >
                  <span>เข้าสู่พอร์ทัล ({portalLabel})</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  id="btn-mobile-logout"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{UI.buttons.logout}</span>
                </button>
              </div>
            ) : (
              <Link
                id="mobile-btn-login"
                to={ROUTES.LOGIN}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-base font-semibold text-blue-700 bg-blue-50 border border-blue-200"
              >
                <LogIn className="w-5 h-5" />
                <span>{UI.nav.public.officerLogin}</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
