import React, { useState } from 'react';
import { useCRM } from '../../../shared/services';
import { PageHeader } from '../../../shared/components';
import { StatusBadge } from '../../../shared/components';
import { Appointment } from '../../../shared/types';
import {
  CalendarDays,
  Plus,
  Video,
  Building2,
  Clock,
  User,
  CheckCircle,
  XCircle,
  ExternalLink,
  MapPin,
  Calendar,
  AlertCircle,
  FileCheck,
  X,
} from 'lucide-react';

export const CounsellingPage: React.FC = () => {
  const {
    appointments,
    setAppointments,
    counsellors,
    leads,
    setSelectedLeadId,
    setCurrentPage,
    addToast,
  } = useCRM();

  const [calendarView, setCalendarView] = useState<'list' | 'week' | 'day'>('list');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // New appointment form state
  const [newLeadId, setNewLeadId] = useState(leads[0]?.id || '');
  const [newCounsellorId, setNewCounsellorId] = useState(counsellors[0]?.id || '');
  const [newDate, setNewDate] = useState('2026-10-24');
  const [newTimeSlot, setNewTimeSlot] = useState('11:00 AM - 11:45 AM');
  const [newType, setNewType] = useState<Appointment['type']>('Online (Google Meet)');
  const [newRoom, setNewRoom] = useState('Room 302, Academic Block');
  const [newNotes, setNewNotes] = useState('');

  const filteredAppointments = appointments.filter((apt) => {
    if (statusFilter !== 'All' && apt.status !== statusFilter) return false;
    if (typeFilter !== 'All' && !apt.type.includes(typeFilter)) return false;
    return true;
  });

  const handleToggleAttendance = (aptId: string) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === aptId) {
          const newAtt = !a.attendanceMarked;
          return {
            ...a,
            attendanceMarked: newAtt,
            status: newAtt ? 'Completed' : 'Scheduled',
          };
        }
        return a;
      })
    );
    addToast({
      title: 'Attendance Updated',
      message: 'Student attendance status saved.',
      type: 'info',
    });
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const lead = leads.find((l) => l.id === newLeadId) || leads[0];
    const counsellor = counsellors.find((c) => c.id === newCounsellorId) || counsellors[0];

    const newApt: Appointment = {
      id: `APT-${Date.now().toString().slice(-4)}`,
      leadId: lead.id,
      leadName: lead.name,
      counsellorId: counsellor.id,
      counsellorName: counsellor.name,
      course: lead.interestedCourse,
      campus: lead.preferredCampus,
      date: newDate,
      timeSlot: newTimeSlot,
      type: newType,
      status: 'Scheduled',
      meetingLink: newType.includes('Online')
        ? `https://meet.google.com/iapl-${Math.random().toString(36).slice(2, 6)}`
        : undefined,
      roomNumber: newType.includes('In-Person') ? newRoom : undefined,
      attendanceMarked: false,
      notes: newNotes,
    };

    setAppointments((prev) => [newApt, ...prev]);
    setIsBookModalOpen(false);
    addToast({
      title: 'Appointment Confirmed',
      message: `Counselling session booked for ${lead.name} with ${counsellor.name}. Calendar invites sent.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Counselling & Academic Consultations"
        subtitle="Manage 1-on-1 virtual sessions, campus tour counselling, slot availability, and post-session outcomes."
        breadcrumbs={[{ label: 'Home', page: 'dashboard' }, { label: 'Counselling' }]}
        actions={
          <button
            onClick={() => setIsBookModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Book Counselling Slot
          </button>
        }
      />

      {/* Filter and View toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          {(['list', 'week', 'day'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setCalendarView(v)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-colors ${
                calendarView === v
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {v} View
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700"
          >
            <option value="All">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="No-Show">No-Show</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-700"
          >
            <option value="All">All Formats</option>
            <option value="Online">Virtual (Google Meet)</option>
            <option value="In-Person">Campus Office</option>
            <option value="Telephonic">Telephonic</option>
          </select>
        </div>
      </div>

      {/* Appointments List View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAppointments.length === 0 ? (
          <div className="col-span-2 py-16 text-center text-slate-400 bg-white border border-slate-200 rounded-xl">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No appointments scheduled</p>
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3.5 hover:border-slate-300 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      onClick={() => {
                        setSelectedLeadId(apt.leadId);
                        setCurrentPage('lead-details');
                      }}
                      className="font-bold text-sm text-slate-900 hover:text-blue-600 cursor-pointer"
                    >
                      {apt.leadName}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">({apt.id})</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">{apt.course}</p>
                </div>
                <StatusBadge status={apt.status} />
              </div>

              {/* Format & Timing details */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {apt.type.includes('Online') ? (
                      <Video className="w-3.5 h-3.5 text-blue-600" />
                    ) : (
                      <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                    )}
                    <span className="font-semibold text-slate-800">{apt.type}</span>
                  </div>
                  <span className="font-mono text-slate-500 font-medium">
                    {apt.date} · {apt.timeSlot}
                  </span>
                </div>

                {apt.meetingLink && (
                  <div className="flex items-center gap-1.5 pt-1 text-blue-600">
                    <a
                      href={apt.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline flex items-center gap-1"
                    >
                      <span>Join Google Meet</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {apt.roomNumber && (
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>Location: {apt.roomNumber} ({apt.campus})</span>
                  </div>
                )}
              </div>

              {apt.notes && (
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  " {apt.notes} "
                </p>
              )}

              {/* Footer controls: Attendance & Outcomes */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">
                  Counsellor: <strong className="text-slate-700">{apt.counsellorName}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleAttendance(apt.id)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      apt.attendanceMarked
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {apt.attendanceMarked ? '✓ Attended' : 'Mark Attendance'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Book Slot Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-semibold text-slate-900">
                Book Counselling Consultation
              </h3>
              <button
                onClick={() => setIsBookModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookAppointment} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Target Student *</label>
                <select
                  value={newLeadId}
                  onChange={(e) => setNewLeadId(e.target.value)}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} — {l.interestedCourse}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Counsellor</label>
                <select
                  value={newCounsellorId}
                  onChange={(e) => setNewCounsellorId(e.target.value)}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  {counsellors.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.campus})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Session Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Time Slot</label>
                  <select
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="10:00 AM - 10:45 AM">10:00 AM - 10:45 AM</option>
                    <option value="11:00 AM - 11:45 AM">11:00 AM - 11:45 AM</option>
                    <option value="02:00 PM - 02:45 PM">02:00 PM - 02:45 PM</option>
                    <option value="04:00 PM - 04:45 PM">04:00 PM - 04:45 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Meeting Mode</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as Appointment['type'])}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Online (Google Meet)">Online (Google Meet - Link Auto-Generated)</option>
                  <option value="In-Person (Campus Office)">In-Person (Campus Office)</option>
                  <option value="Telephonic">Telephonic Consultation</option>
                </select>
              </div>

              {newType.includes('In-Person') && (
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Room / Suite</label>
                  <input
                    type="text"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-medium mb-1">Agenda / Student Goals</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Inquire about semester abroad, review fee structure with parents..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Confirm Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export { CounsellingPage as CounsellingWidget };
export default CounsellingPage;
