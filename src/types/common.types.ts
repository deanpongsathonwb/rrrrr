export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected';
export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TimelineItem {
  timestamp: string;
  action: string;
  actor: string;
}

export interface OfficerResponse {
  timestamp: string;
  officerName: string;
  message: string;
}

export interface CitizenRating {
  score: number;
  comment: string;
  submittedAt: string;
}

export interface Complaint {
  id: string;
  trackingCode: string;
  title: string;
  categoryId: string;
  description: string;
  location: string;
  citizenName: string;
  citizenPhone: string;
  citizenEmail: string;
  isAnonymous: boolean;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  createdAt: string;
  updatedAt: string;
  assignedOfficerId: string;
  imageUrl?: string;
  resolutionDetails?: string;
  timeline: TimelineItem[];
  officerResponses: OfficerResponse[];
  rating: CitizenRating | null;
}

export interface ComplaintCategory {
  id: string;
  name: string;
  department: string;
  defaultSlaDays: number;
  icon: string;
  badgeColor: string;
}

export type OfficerRoleType = 'admin' | 'officer';

export interface Officer {
  id: string;
  name: string;
  department: string;
  role: string;
  roleType: OfficerRoleType;
  email: string;
  password?: string;
  phone: string;
  avatar: string;
}

export interface SystemSettings {
  agencyName: string;
  agencySubtext: string;
  hotline: string;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  defaultSlaDays: number;
  autoAssignment: boolean;
  publicDashboard: boolean;
  emailNotification: boolean;
  allowAnonymousComplaints: boolean;
  maxAttachmentSizeMb: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
