export const ROUTES = {
  // Public Citizen Portal Routes
  HOME: '/',
  SUBMIT: '/submit',
  TRACK: '/track',
  STATISTICS: '/statistics',
  FAQ: '/faq',

  // Production Authentication
  LOGIN: '/login',

  // Authenticated Officer Operational Portal Routes
  OFFICER_ROOT: '/officer',
  OFFICER_COMPLAINTS: '/officer/complaints',
  OFFICER_SETTINGS: '/officer/settings',
  OFFICER_DASHBOARD: '/officer/dashboard',

  // Authenticated Administrator Management Portal Routes
  ADMIN_ROOT: '/admin',
  ADMIN_COMPLAINTS: '/admin/complaints',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_DASHBOARD: '/admin/dashboard',
} as const;
