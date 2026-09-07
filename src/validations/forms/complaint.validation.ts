import { z } from 'zod';
import { UI } from '@/src/constants';

export const complaintFormSchema = z
  .object({
    title: z.string().min(5, UI.validation.titleMin),
    categoryId: z.string().min(1, UI.validation.requiredCategory),
    description: z.string().min(15, UI.validation.descriptionMin),
    location: z.string().min(1, UI.validation.requiredLocation),
    isAnonymous: z.boolean(),
    citizenName: z.string(),
    citizenPhone: z.string(),
    citizenEmail: z.string().optional(),
    imageUrl: z.string().optional(),
    termsConsent: z.boolean().refine((val) => val === true, {
      message: UI.validation.mustAgreeTerms,
    }),
  })
  .superRefine((data, ctx) => {
    if (!data.isAnonymous) {
      if (!data.citizenName || data.citizenName.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: UI.validation.requiredCitizenName,
          path: ['citizenName'],
        });
      }
      const phoneClean = (data.citizenPhone || '').replace(/\D/g, '');
      if (phoneClean.length !== 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: UI.validation.requiredCitizenPhone,
          path: ['citizenPhone'],
        });
      }
      if (data.citizenEmail && data.citizenEmail.trim().length > 0) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.citizenEmail)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: UI.validation.invalidEmail,
            path: ['citizenEmail'],
          });
        }
      }
    }
  });

export type ComplaintFormData = z.infer<typeof complaintFormSchema>;

export const trackingFormSchema = z.object({
  query: z.string().min(1, UI.validation.trackingInputRequired),
});

export type TrackingFormData = z.infer<typeof trackingFormSchema>;

export const loginFormSchema = z.object({
  email: z.string().email(UI.validation.invalidEmail).min(1, UI.validation.loginEmailRequired),
  password: z.string().min(1, UI.validation.loginPasswordRequired),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

export const statusUpdateSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'resolved', 'rejected']),
  assignedOfficerId: z.string().optional(),
  responseMessage: z.string().min(1, UI.validation.responseRequired),
  internalNote: z.string().optional(),
});

export type StatusUpdateFormData = z.infer<typeof statusUpdateSchema>;
