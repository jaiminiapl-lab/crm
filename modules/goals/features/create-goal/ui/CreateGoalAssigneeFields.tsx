import React from 'react';

interface CreateGoalAssigneeFieldsProps {
  assigneeName: string;
  onAssigneeNameChange: (name: string, isManager: boolean) => void;
  campus: string;
  onCampusChange: (campus: string) => void;
}

export const CreateGoalAssigneeFields: React.FC<CreateGoalAssigneeFieldsProps> = ({
  assigneeName,
  onAssigneeNameChange,
  campus,
  onCampusChange,
}) => {
  const managers = ['Rohan Mehra', 'Dr. Neha Agarwal', 'Vikram Malhotra', 'Sneha Kulkarni'];

  return (
    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
      <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wide">
        Assignee & Campus Allocation
      </span>
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-slate-600 mb-0.5">Assignee Person / Lead</label>
          <select
            value={assigneeName}
            onChange={(e) => {
              const name = e.target.value;
              onAssigneeNameChange(name, managers.includes(name));
            }}
            className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
          >
            <optgroup label="Managers & Team Leads">
              <option value="Rohan Mehra">Rohan Mehra (Admissions Manager)</option>
              <option value="Dr. Neha Agarwal">Dr. Neha Agarwal (Head of Admissions)</option>
              <option value="Vikram Malhotra">Vikram Malhotra (Finance Lead)</option>
              <option value="Sneha Kulkarni">Sneha Kulkarni (Operations Manager)</option>
            </optgroup>
            <optgroup label="Counsellors">
              <option value="Aarav Sharma">Aarav Sharma (Senior Counsellor)</option>
              <option value="Pooja Iyer">Pooja Iyer (Admissions Counsellor)</option>
              <option value="Ananya Verma">Ananya Verma (Admissions Counsellor)</option>
            </optgroup>
          </select>
        </div>
        <div>
          <label className="block text-slate-600 mb-0.5">Campus</label>
          <select
            value={campus}
            onChange={(e) => onCampusChange(e.target.value)}
            className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
          >
            <option value="Mumbai Main Campus">Mumbai Main Campus</option>
            <option value="Bengaluru Tech Campus">Bengaluru Tech Campus</option>
            <option value="Delhi NCR Campus">Delhi NCR Campus</option>
            <option value="Pune Innovation Hub">Pune Innovation Hub</option>
          </select>
        </div>
      </div>
    </div>
  );
};
