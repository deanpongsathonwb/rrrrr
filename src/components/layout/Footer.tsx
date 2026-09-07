import { Link } from 'react-router-dom';
import { UI, ROUTES } from '@/src/constants';
import { useAppStore } from '@/src/stores/app.store';
import { Phone, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  const { settings } = useAppStore();

  return (
    <footer id="app-footer" className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Agency & System Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                {UI.app.name}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {settings.agencyName}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              {settings.agencySubtext}
            </p>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-800/60">
              {UI.app.badge}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-white tracking-wider">
              {UI.footer.quickLinks}
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  id="footer-link-submit"
                  to={ROUTES.SUBMIT}
                  className="hover:text-white transition-colors"
                >
                  {UI.nav.public.submitComplaint}
                </Link>
              </li>
              <li>
                <Link
                  id="footer-link-track"
                  to={ROUTES.TRACK}
                  className="hover:text-white transition-colors"
                >
                  {UI.nav.public.trackStatus}
                </Link>
              </li>
              <li>
                <Link
                  id="footer-link-statistics"
                  to={ROUTES.STATISTICS}
                  className="hover:text-white transition-colors"
                >
                  {UI.nav.public.statistics}
                </Link>
              </li>
              <li>
                <Link
                  id="footer-link-faq"
                  to={ROUTES.FAQ}
                  className="hover:text-white transition-colors"
                >
                  {UI.nav.public.faq}
                </Link>
              </li>
              <li>
                <Link
                  id="footer-link-login"
                  to={ROUTES.LOGIN}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  {UI.nav.public.officerLogin}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details from Configurable Settings */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-white tracking-wider">
              {UI.footer.contactHeader}
            </div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>
                  {UI.forms.settings.hotline}: {settings.hotline}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>
                  {UI.forms.settings.phone}: {settings.phone}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{settings.email}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-1" />
                <span className="leading-snug">{settings.address}</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-1" />
                <span className="leading-snug">{settings.workingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Privacy Statement */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>{UI.footer.rights}</div>
          <div>{UI.footer.privacyNote}</div>
        </div>
      </div>
    </footer>
  );
};
