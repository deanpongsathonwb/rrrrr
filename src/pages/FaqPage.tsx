import { useState } from 'react';
import { useAppStore } from '@/src/stores/app.store';
import { UI } from '@/src/constants';
import faqSeed from '@/src/seed/faq.json';
import { FaqItem } from '@/src/types/common.types';
import { ChevronDown, HelpCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';

export const FaqPage = () => {
  const { settings } = useAppStore();
  const [openId, setOpenId] = useState<string | null>(faqSeed[0]?.id || null);

  const faqs = faqSeed as FaqItem[];

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          {UI.headings.faqTitle}
        </h1>
        <p className="text-sm text-slate-600">
          {UI.headings.faqSubtitle}
        </p>
      </div>

      {/* Accordion FAQ list */}
      <div className="space-y-4">
        {faqs.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all"
            >
              <button
                type="button"
                onClick={() => toggleAccordion(item.id)}
                className="w-full px-6 py-5 text-left font-bold text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <span className="text-base leading-snug">{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-6 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Agency Assistance Contact Box */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-3xl p-8 shadow-md space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold">{UI.footer.contactHeader}</h2>
          <p className="text-sm text-slate-300">{settings.agencyName}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-200">
          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-blue-400" />
            <span>
              {UI.forms.settings.hotline}: {settings.hotline}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-blue-400" />
            <span>
              {UI.forms.settings.phone}: {settings.phone}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-blue-400" />
            <span>{settings.email}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>{settings.workingHours}</span>
          </div>
          <div className="sm:col-span-2 flex items-start gap-2.5 pt-2 border-t border-slate-800">
            <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>{settings.address}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
