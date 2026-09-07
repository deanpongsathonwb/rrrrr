import { create } from 'zustand';
import { Officer } from '@/src/types/common.types';
import { localStorageService } from '@/src/storage/localStorage/localStorage.service';
import { STORAGE_KEYS } from '@/src/constants/storage';
import officersSeed from '@/src/seed/officers.json';

export interface LoginResult {
  success: boolean;
  officer?: Officer;
  message?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  currentOfficer: Officer | null;
  officers: Officer[];
  login: (email: string, password: string) => LoginResult;
  logout: () => void;
}

const savedSession = localStorageService.getItem<Officer | null>(STORAGE_KEYS.AUTH_SESSION, null);

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: savedSession !== null,
  currentOfficer: savedSession,
  officers: officersSeed as Officer[],

  login: (email: string, password: string): LoginResult => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const found = get().officers.find(
      (o) => o.email.trim().toLowerCase() === cleanEmail
    );

    if (!found) {
      return {
        success: false,
        message: 'ไม่พบบัญชีผู้ใช้งานในระบบ กรุณาตรวจสอบอีเมลอีกครั้ง',
      };
    }

    if (found.password && found.password !== cleanPassword) {
      return {
        success: false,
        message: 'รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง',
      };
    }

    localStorageService.setItem(STORAGE_KEYS.AUTH_SESSION, found);
    set({ isAuthenticated: true, currentOfficer: found });
    return {
      success: true,
      officer: found,
    };
  },

  logout: () => {
    localStorageService.removeItem(STORAGE_KEYS.AUTH_SESSION);
    set({ isAuthenticated: false, currentOfficer: null });
  },
}));
