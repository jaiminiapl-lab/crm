import React from 'react';
import { Lead, Appointment, CommunicationMessage } from '../../../shared/types';

interface LeadTimelineTabProps {
  lead: Lead;
  appointments: Appointment[];
  messages: CommunicationMessage[];
}

export const LeadTimelineTab: React.FC<LeadTimelineTabProps> = ({
  lead,
  appointments,
  messages,
}) => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        <div className="relative">
          <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-blue-600 shadow-xs" />
          <div className="text-xs font-semibold text-slate-900">Lead Status: {lead.status}</div>
          <p className="text-xs text-slate-600 mt-0.5">{lead.lastActivity}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Today, 2 hours ago</span>
        </div>

        {appointments.map((apt) => (
          <div key={apt.id} className="relative">
            <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-purple-600 shadow-xs" />
            <div className="text-xs font-semibold text-slate-900">Counselling Appointment: {apt.type}</div>
            <p className="text-xs text-slate-600 mt-0.5">
              Scheduled for {apt.date} at {apt.timeSlot} with {apt.counsellorName}
            </p>
            {apt.meetingLink && (
              <a
                href={apt.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 hover:underline mt-1 inline-block"
              >
                Join Meeting Link
              </a>
            )}
          </div>
        ))}

        {messages.map((msg) => (
          <div key={msg.id} className="relative">
            <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-emerald-600 shadow-xs" />
            <div className="text-xs font-semibold text-slate-900">
              {msg.channel} ({msg.direction}): {msg.templateUsed || 'Direct Message'}
            </div>
            <p className="text-xs text-slate-600 mt-0.5">{msg.content}</p>
            <span className="text-[10px] text-slate-400 mt-1 block font-mono">{msg.timestamp}</span>
          </div>
        ))}

        <div className="relative">
          <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-slate-400 shadow-xs" />
          <div className="text-xs font-semibold text-slate-900">Enquiry Created via {lead.source}</div>
          <p className="text-xs text-slate-600 mt-0.5">
            Assigned to {lead.assignedCounsellorName} based on academic preference
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block font-mono">{lead.createdAt}</span>
        </div>
      </div>
    </div>
  );
};
