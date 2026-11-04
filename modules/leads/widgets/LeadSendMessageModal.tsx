import React, { useState } from 'react';
import { Lead } from '../../../shared/types';
import { X, Send } from 'lucide-react';

interface LeadSendMessageModalProps {
  isOpen: boolean;
  lead: Lead;
  defaultChannel: 'WhatsApp' | 'Email' | 'SMS';
  onClose: () => void;
  onSend: (channel: 'WhatsApp' | 'Email' | 'SMS', body: string) => void;
}

export const LeadSendMessageModal: React.FC<LeadSendMessageModalProps> = ({
  isOpen,
  lead,
  defaultChannel,
  onClose,
  onSend,
}) => {
  const [channel, setChannel] = useState(defaultChannel);
  const [body, setBody] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">
            Dispatch Omnichannel Message: {lead.name}
          </h3>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Channel Selection</label>
            <div className="grid grid-cols-3 gap-2">
              {(['WhatsApp', 'Email', 'SMS'] as const).map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setChannel(ch)}
                  className={`py-1.5 px-3 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                    channel === ch
                      ? 'bg-blue-50 border-blue-600 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Message Content</label>
            <textarea
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type personalized message or counseling follow-up details..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-medium text-slate-700 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => { onSend(channel, body); setBody(''); }}
            disabled={!body.trim()}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg font-medium text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" /> Send Now
          </button>
        </div>
      </div>
    </div>
  );
};
