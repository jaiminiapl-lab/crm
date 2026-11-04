import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { Course, Counsellor, LeadPriority } from '../../../shared/types';
import { AddLeadFormFields } from './AddLeadFormFields';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  courses: Course[];
  counsellors: Counsellor[];
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  courses,
  counsellors,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [interestedCourse, setInterestedCourse] = useState(courses[0]?.name || 'B.Tech Computer Science');
  const [preferredCampus, setPreferredCampus] = useState('Mumbai Main Campus');
  const [priority, setPriority] = useState<LeadPriority>('High');
  const [assignedId, setAssignedId] = useState(counsellors[0]?.id || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const advisor = counsellors.find((c) => c.id === assignedId) || counsellors[0];

    onSubmit({
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: `${countryCode} ${phone.trim() || '98200 11223'}`,
      city: preferredCampus.split(' ')[0] || 'Global',
      state: 'International',
      interestedCourse,
      preferredCampus,
      source: 'Website Form',
      assignedCounsellorId: advisor?.id || 'c-1',
      assignedCounsellorName: advisor?.name || 'Aarav Sharma',
      status: 'New Enquiry',
      priority,
      score: 78,
      scoreCategory: 'Warm',
      scoreExplanation: 'Direct international applicant. High academic interest registered.',
      engagementLevel: 'Moderate',
      lastActivity: 'Enquiry captured via portal',
      nextFollowUp: 'Today 03:00 PM',
      academicBackground: {
        qualification: 'High School Diploma / Grade 12',
        percentageOrGpa: '88.5%',
        institution: 'Global Academy',
        passingYear: 2026,
      },
      consent: { whatsapp: true, email: true, call: true },
      tags: ['International Applicant', 'Direct Inbound'],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base">New International Inquiry</h3>
              <p className="text-xs text-slate-500">Capture candidate details across study centres</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <AddLeadFormFields
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            countryCode={countryCode}
            setCountryCode={setCountryCode}
            phone={phone}
            setPhone={setPhone}
            interestedCourse={interestedCourse}
            setInterestedCourse={setInterestedCourse}
            preferredCampus={preferredCampus}
            setPreferredCampus={setPreferredCampus}
            priority={priority}
            setPriority={setPriority}
            assignedId={assignedId}
            setAssignedId={setAssignedId}
            courses={courses}
            counsellors={counsellors}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
            >
              Save Candidate Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
