import React, { useState } from 'react';
import { useCRM } from '../../../shared/services';
import { PageHeader } from '../../../shared/components';
import { StatusBadge } from '../../../shared/components';
import { CommunicationMessage } from '../../../shared/types';
import {
  MessageSquare,
  Mail,
  Send,
  Clock,
  CheckCheck,
  Search,
  Filter,
  FileCode,
  ShieldCheck,
  PhoneCall,
  User,
  Plus,
  AlertCircle,
} from 'lucide-react';

export const CommunicationHubPage: React.FC = () => {
  const { messages, setMessages, leads, addToast } = useCRM();

  const [selectedChannel, setSelectedChannel] = useState<'All' | 'WhatsApp' | 'Email' | 'SMS'>('All');
  const [recipientLeadId, setRecipientLeadId] = useState(leads[0]?.id || '');
  const [composerChannel, setComposerChannel] = useState<'WhatsApp' | 'Email' | 'SMS'>('WhatsApp');
  const [composerSubject, setComposerSubject] = useState('');
  const [composerBody, setComposerBody] = useState(
    'Hi {{student_name}}, thank you for inquiring about {{course_name}} at IAPL LMS. We have confirmed your counselling session for tomorrow. Please reply if you have questions!'
  );
  const [selectedTemplate, setSelectedTemplate] = useState('Welcome');

  const templates = [
    {
      name: 'Welcome Inquiry',
      channel: 'WhatsApp',
      body: 'Hi {{student_name}}! Welcome to IAPL LMS. We noticed your interest in {{course_name}}. Our Senior Counsellor {{counsellor_name}} is assigned to assist you with eligibility and scholarships.',
    },
    {
      name: 'Counselling Confirmation',
      channel: 'Email',
      subject: 'Confirmed: 1-on-1 Academic Counselling for {{course_name}}',
      body: 'Dear {{student_name}}, your counselling session has been scheduled with {{counsellor_name}} at our {{campus}}. Please join the video room or visit the admissions office.',
    },
    {
      name: 'Fee Payment Token Alert',
      channel: 'SMS',
      body: 'IAPL ADMISSIONS: Urgent reminder for {{student_name}} regarding token fee reservation for {{course_name}}. Complete transaction before seat quota closes.',
    },
    {
      name: 'Document Upload Reminder',
      channel: 'WhatsApp',
      body: 'Hi {{student_name}}, your application is 80% complete! Please upload your pending marksheets to the student portal today to secure board evaluation.',
    },
  ];

  const filteredMessages = messages.filter((m) => {
    if (selectedChannel !== 'All' && m.channel !== selectedChannel) return false;
    return true;
  });

  const activeLead = leads.find((l) => l.id === recipientLeadId) || leads[0];

  // Template variable replacer
  const previewText = composerBody
    .replace(/{{student_name}}/g, activeLead?.name || 'Student')
    .replace(/{{course_name}}/g, activeLead?.interestedCourse || 'Program')
    .replace(/{{counsellor_name}}/g, activeLead?.assignedCounsellorName || 'Admissions Team')
    .replace(/{{campus}}/g, activeLead?.preferredCampus || 'Campus');

  const handleApplyTemplate = (tplName: string) => {
    setSelectedTemplate(tplName);
    const t = templates.find((item) => item.name === tplName);
    if (t) {
      setComposerChannel(t.channel as any);
      setComposerBody(t.body);
      if (t.subject) setComposerSubject(t.subject);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerBody.trim()) return;

    const newMsg: CommunicationMessage = {
      id: `MSG-${Date.now().toString().slice(-4)}`,
      leadId: activeLead.id,
      leadName: activeLead.name,
      channel: composerChannel,
      direction: 'Outbound',
      sender: 'Admissions Office',
      recipient: composerChannel === 'Email' ? activeLead.email : activeLead.phone,
      subject: composerChannel === 'Email' ? composerSubject : undefined,
      content: previewText,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Delivered',
      templateUsed: selectedTemplate,
    };

    setMessages((prev) => [newMsg, ...prev]);
    addToast({
      title: `Dispatched via ${composerChannel}`,
      message: `Message sent to ${activeLead.name} (${newMsg.recipient}).`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Unified Communication Hub"
        subtitle="Omnichannel student outreach via verified WhatsApp API, transactional email, and SMS gateways."
        breadcrumbs={[{ label: 'Home', page: 'dashboard' }, { label: 'Communication Hub' }]}
      />

      {/* Main Grid: Composer (1 Col) + Activity Feed (2 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Message Composer */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Message Composer</h3>
            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Gateway Online
            </span>
          </div>

          <form onSubmit={handleSendMessage} className="space-y-3.5 text-xs">
            {/* Recipient lead */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">Select Candidate *</label>
              <select
                value={recipientLeadId}
                onChange={(e) => setRecipientLeadId(e.target.value)}
                className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
              >
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.phone})
                  </option>
                ))}
              </select>
            </div>

            {/* Channel picker */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">Channel</label>
              <div className="grid grid-cols-3 gap-2">
                {(['WhatsApp', 'Email', 'SMS'] as const).map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setComposerChannel(ch)}
                    className={`py-1.5 text-xs font-semibold rounded-lg border text-center transition-colors ${
                      composerChannel === ch
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Templates */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">Standard Templates</label>
              <select
                value={selectedTemplate}
                onChange={(e) => handleApplyTemplate(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-slate-50"
              >
                {templates.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name} ({t.channel})
                  </option>
                ))}
              </select>
            </div>

            {composerChannel === 'Email' && (
              <div>
                <label className="block text-slate-700 font-medium mb-1">Subject Line</label>
                <input
                  type="text"
                  value={composerSubject}
                  onChange={(e) => setComposerSubject(e.target.value)}
                  placeholder="Subject line..."
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            )}

            {/* Message template content */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">Message Template Body</label>
              <textarea
                rows={4}
                value={composerBody}
                onChange={(e) => setComposerBody(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            {/* Variable tags helper */}
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">
              <span>Insert:</span>
              <button
                type="button"
                onClick={() => setComposerBody((p) => p + ' {{student_name}}')}
                className="px-1.5 py-0.5 bg-slate-100 rounded hover:bg-slate-200"
              >
                + student_name
              </button>
              <button
                type="button"
                onClick={() => setComposerBody((p) => p + ' {{course_name}}')}
                className="px-1.5 py-0.5 bg-slate-100 rounded hover:bg-slate-200"
              >
                + course_name
              </button>
              <button
                type="button"
                onClick={() => setComposerBody((p) => p + ' {{campus}}')}
                className="px-1.5 py-0.5 bg-slate-100 rounded hover:bg-slate-200"
              >
                + campus
              </button>
            </div>

            {/* Live Preview Card */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Live Dynamic Preview
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-sans">{previewText}</p>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Dispatch via {composerChannel}
            </button>
          </form>
        </div>

        {/* Right: Feed of Sent & Received Communications (2 Cols) */}
        <div className="lg:col-span-2 p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Communication Timeline & Delivery Logs</h3>
              <p className="text-xs text-slate-500">Audit trail of outbound notices and student responses</p>
            </div>

            {/* Channel filter tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
              {(['All', 'WhatsApp', 'Email', 'SMS'] as const).map((ch) => (
                <button
                  key={ch}
                  onClick={() => setSelectedChannel(ch)}
                  className={`px-2.5 py-1 font-medium rounded-md transition-colors ${
                    selectedChannel === ch
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-100 space-y-3">
            {filteredMessages.map((msg) => (
              <div key={msg.id} className="pt-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{msg.leadName}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                      {msg.channel}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">({msg.recipient})</span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <span>{msg.timestamp}</span>
                    <StatusBadge status={msg.status} size="sm" />
                  </div>
                </div>

                {msg.subject && (
                  <p className="font-semibold text-slate-800 text-xs">{msg.subject}</p>
                )}

                <p className="text-slate-600 text-xs leading-relaxed bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                  {msg.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { CommunicationHubPage as CommunicationWidget };
export default CommunicationHubPage;
