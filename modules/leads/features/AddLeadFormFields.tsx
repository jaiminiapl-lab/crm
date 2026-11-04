import React from 'react';
import { Course, Counsellor, LeadPriority } from '../../../shared/types';
import { INTERNATIONAL_CAMPUSES } from '../../../shared/constants';

interface AddLeadFormFieldsProps {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  countryCode: string;
  setCountryCode: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  interestedCourse: string;
  setInterestedCourse: (v: string) => void;
  preferredCampus: string;
  setPreferredCampus: (v: string) => void;
  priority: LeadPriority;
  setPriority: (v: LeadPriority) => void;
  assignedId: string;
  setAssignedId: (v: string) => void;
  courses: Course[];
  counsellors: Counsellor[];
}

export const AddLeadFormFields: React.FC<AddLeadFormFieldsProps> = (props) => {
  const {
    name, setName, email, setEmail, countryCode, setCountryCode, phone, setPhone,
    interestedCourse, setInterestedCourse, preferredCampus, setPreferredCampus,
    priority, setPriority, assignedId, setAssignedId, courses, counsellors,
  } = props;

  return (
    <>
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Candidate Full Name *</label>
        <input
          type="text"
          required
          placeholder="e.g., Alexander Wright or Ananya Deshmukh"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Email Address</label>
          <input
            type="email"
            placeholder="alex.wright@oxford.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Phone Number</label>
          <div className="flex gap-1.5">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="px-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+91">🇮🇳 +91</option>
              <option value="+971">🇦🇪 +971</option>
              <option value="+65">🇸🇬 +65</option>
            </select>
            <input
              type="tel"
              placeholder="98200 45678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Target Program</label>
          <select
            value={interestedCourse}
            onChange={(e) => setInterestedCourse(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Study Hub / Campus</label>
          <select
            value={preferredCampus}
            onChange={(e) => setPreferredCampus(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            {INTERNATIONAL_CAMPUSES.filter((c: string) => c !== 'All Campuses').map((campus: string) => (
              <option key={campus} value={campus}>{campus}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as LeadPriority)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Assigned Advisor</label>
          <select
            value={assignedId}
            onChange={(e) => setAssignedId(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            {counsellors.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};
