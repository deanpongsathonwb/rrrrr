import { create } from 'zustand';
import {
  Complaint,
  ComplaintCategory,
  SystemSettings,
  ComplaintStatus,
  TimelineItem,
  OfficerResponse,
} from '@/src/types/common.types';
import { localStorageService } from '@/src/storage/localStorage/localStorage.service';
import { STORAGE_KEYS } from '@/src/constants/storage';
import { UI } from '@/src/constants';
import complaintsSeed from '@/src/seed/complaints.json';
import categoriesSeed from '@/src/seed/categories.json';
import settingsSeed from '@/src/seed/settings.json';

interface AppState {
  complaints: Complaint[];
  categories: ComplaintCategory[];
  settings: SystemSettings;
  addComplaint: (data: {
    title: string;
    categoryId: string;
    description: string;
    location: string;
    citizenName: string;
    citizenPhone: string;
    citizenEmail?: string;
    isAnonymous: boolean;
    imageUrl?: string;
  }) => Complaint;
  updateComplaintStatus: (
    id: string,
    newStatus: ComplaintStatus,
    officerName: string,
    responseMsg: string,
    assignedOfficerId?: string
  ) => void;
  submitRating: (id: string, score: number, comment: string) => void;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  resetSettings: () => void;
  getComplaintByCodeOrPhone: (query: string) => Complaint[];
}

const initialComplaints = localStorageService.getItem<Complaint[]>(
  STORAGE_KEYS.COMPLAINTS,
  complaintsSeed as unknown as Complaint[]
);

const initialCategories = localStorageService.getItem<ComplaintCategory[]>(
  STORAGE_KEYS.CATEGORIES,
  categoriesSeed as ComplaintCategory[]
);

const initialSettings = localStorageService.getItem<SystemSettings>(
  STORAGE_KEYS.SETTINGS,
  settingsSeed as SystemSettings
);

export const useAppStore = create<AppState>((set, get) => ({
  complaints: initialComplaints,
  categories: initialCategories,
  settings: initialSettings,

  addComplaint: (data) => {
    const state = get();
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const seq = String(state.complaints.length + 1).padStart(3, '0');
    const trackingCode = `CMP-${year}${month}${day}-${seq}`;

    const timelineItem: TimelineItem = {
      timestamp: now.toISOString(),
      action: data.isAnonymous
        ? UI.timelineActions.submittedAnonymous
        : UI.timelineActions.submitted,
      actor: data.isAnonymous
        ? UI.timelineActions.anonymousActor
        : UI.timelineActions.citizenActor,
    };

    const newComplaint: Complaint = {
      id: `cmp_${Date.now()}`,
      trackingCode,
      title: data.title,
      categoryId: data.categoryId,
      description: data.description,
      location: data.location,
      citizenName: data.isAnonymous ? '' : data.citizenName,
      citizenPhone: data.isAnonymous ? '' : data.citizenPhone,
      citizenEmail: data.isAnonymous ? '' : (data.citizenEmail || ''),
      isAnonymous: data.isAnonymous,
      status: 'pending',
      priority: 'medium',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      assignedOfficerId: '',
      imageUrl: data.imageUrl || '',
      timeline: [timelineItem],
      officerResponses: [],
      rating: null,
    };

    const updated = [newComplaint, ...state.complaints];
    localStorageService.setItem(STORAGE_KEYS.COMPLAINTS, updated);
    set({ complaints: updated });
    return newComplaint;
  },

  updateComplaintStatus: (id, newStatus, officerName, responseMsg, assignedOfficerId) => {
    const state = get();
    const now = new Date().toISOString();
    const updated = state.complaints.map((c) => {
      if (c.id !== id) return c;

      const newTimeline: TimelineItem[] = [...c.timeline];
      const newResponses: OfficerResponse[] = [...c.officerResponses];

      const statusName = UI.status[newStatus];
      newTimeline.push({
        timestamp: now,
        action: `${UI.timelineActions.statusUpdated} ${statusName}`,
        actor: officerName || UI.timelineActions.systemActor,
      });

      if (assignedOfficerId && assignedOfficerId !== c.assignedOfficerId) {
        newTimeline.push({
          timestamp: now,
          action: `${UI.timelineActions.officerAssigned} ${officerName}`,
          actor: UI.timelineActions.systemActor,
        });
      }

      if (responseMsg.trim().length > 0) {
        newResponses.push({
          timestamp: now,
          officerName: officerName || UI.timelineActions.systemActor,
          message: responseMsg.trim(),
        });
      }

      return {
        ...c,
        status: newStatus,
        assignedOfficerId: assignedOfficerId || c.assignedOfficerId,
        updatedAt: now,
        timeline: newTimeline,
        officerResponses: newResponses,
        resolutionDetails: newStatus === 'resolved' ? responseMsg : c.resolutionDetails,
      };
    });

    localStorageService.setItem(STORAGE_KEYS.COMPLAINTS, updated);
    set({ complaints: updated });
  },

  submitRating: (id, score, comment) => {
    const state = get();
    const now = new Date().toISOString();
    const updated = state.complaints.map((c) => {
      if (c.id !== id) return c;
      return {
        ...c,
        rating: {
          score,
          comment,
          submittedAt: now,
        },
      };
    });

    localStorageService.setItem(STORAGE_KEYS.COMPLAINTS, updated);
    set({ complaints: updated });
  },

  updateSettings: (newSettings) => {
    const current = get().settings;
    const updated = { ...current, ...newSettings };
    localStorageService.setItem(STORAGE_KEYS.SETTINGS, updated);
    set({ settings: updated });
  },

  resetSettings: () => {
    const defaults = settingsSeed as SystemSettings;
    localStorageService.setItem(STORAGE_KEYS.SETTINGS, defaults);
    set({ settings: defaults });
  },

  getComplaintByCodeOrPhone: (query: string) => {
    const clean = query.trim().toLowerCase();
    const phoneClean = query.replace(/\D/g, '');
    const state = get();
    return state.complaints.filter((c) => {
      if (c.trackingCode.toLowerCase() === clean) return true;
      if (phoneClean.length >= 8 && c.citizenPhone.replace(/\D/g, '').includes(phoneClean)) {
        return true;
      }
      return false;
    });
  },
}));
