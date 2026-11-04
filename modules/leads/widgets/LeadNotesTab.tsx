import React, { useState } from 'react';
import { Lead } from '../../../shared/types';

interface LeadNotesTabProps {
  lead: Lead;
  onAddNote: (note: string) => void;
}

export const LeadNotesTab: React.FC<LeadNotesTabProps> = ({ lead, onAddNote }) => {
  const [newNoteText, setNewNoteText] = useState('');

  const handleSave = () => {
    if (!newNoteText.trim()) return;
    onAddNote(newNoteText);
    setNewNoteText('');
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <label className="block text-xs font-medium text-slate-700">Add Confidential Note</label>
        <textarea
          rows={3}
          value={newNoteText}
          onChange={(e) => setNewNoteText(e.target.value)}
          placeholder="Record insights from student/parent call, fee negotiations, or specific course electives..."
          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
        />
        <button
          onClick={handleSave}
          disabled={!newNoteText.trim()}
          className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-lg transition-colors cursor-pointer"
        >
          Save Note to Dossier
        </button>
      </div>

      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
            <span className="font-semibold text-slate-800">{lead.assignedCounsellorName}</span>
            <span className="font-mono">Yesterday, 04:30 PM</span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            Student scored 91.4% in 12th PCM. Father inquired about the Apple iOS Developer Academy and hostel room accommodation facilities. Advised to attend campus tour.
          </p>
        </div>
      </div>
    </div>
  );
};
