import React, { useState } from 'react';
import { useCRM } from '../../../shared/services';
import { PageHeader } from '../../../shared/components';
import { StatusBadge } from '../../../shared/components';
import {
  Settings,
  Sliders,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Shield,
  Bell,
  Mail,
  MessageSquare,
  Calendar,
  CreditCard,
  Database,
  Sparkles,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { addToast, setCurrentPage, resetAllDataToFactory } = useCRM();

  const [activeTab, setActiveTab] = useState<'integrations' | 'pipeline' | 'notifications' | 'ai-controls'>('integrations');

  // Integrations state
  const [integrations, setIntegrations] = useState([
    {
      id: 'whatsapp',
      name: 'WhatsApp Business Cloud API',
      category: 'Messaging',
      status: 'Connected',
      latency: '24ms',
      lastSynced: '2 mins ago',
    },
    {
      id: 'sendgrid',
      name: 'Transactional Email (SendGrid API)',
      category: 'Email Delivery',
      status: 'Connected',
      latency: '18ms',
      lastSynced: 'Just now',
    },
    {
      id: 'google-cal',
      name: 'Google Calendar & Meet Integration',
      category: 'Scheduling',
      status: 'Connected',
      latency: '35ms',
      lastSynced: '10 mins ago',
    },
    {
      id: 'payment-gateway',
      name: 'Razorpay / Bank NEFT Payment Gateway',
      category: 'Tuition Billing',
      status: 'Connected',
      latency: '12ms',
      lastSynced: 'Live webhook active',
    },
    {
      id: 'lms-sync',
      name: 'IAPL Core Student LMS Synchronization',
      category: 'SIS & Enrolment',
      status: 'Connected',
      latency: '20ms',
      lastSynced: 'Every 5 mins',
    },
    {
      id: 'sms-gateway',
      name: 'DLT Registered SMS Gateway (India)',
      category: 'Telephony',
      status: 'Connected',
      latency: '40ms',
      lastSynced: 'Live',
    },
  ]);

  // AI Feature Toggles
  const [aiScoringEnabled, setAiScoringEnabled] = useState(true);
  const [aiAssistantDraftsEnabled, setAiAssistantDraftsEnabled] = useState(true);
  const [autoDeduplicationEnabled, setAutoDeduplicationEnabled] = useState(true);

  const handleTestConnection = (name: string) => {
    addToast({
      title: 'Health Check Verified',
      message: `${name} ping check returned HTTP 200 OK.`,
      type: 'success',
    });
  };

  const handleSaveSettings = () => {
    addToast({
      title: 'Settings Saved',
      message: 'CRM integration configurations updated successfully.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="CRM Settings & Institutional Integrations"
        subtitle="Manage communication gateway APIs, pipeline customization, automated SLAs, and AI feature governance."
        breadcrumbs={[{ label: 'Home', page: 'dashboard' }, { label: 'CRM Settings' }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={resetAllDataToFactory}
              className="px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
            >
              Reset Demo Data
            </button>
            <button
              onClick={() => setCurrentPage('integrations')}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Integrations Hub &rarr;
            </button>
            <button
              onClick={handleSaveSettings}
              className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Save All Configurations
            </button>
          </div>
        }
      />

      {/* Settings Navigation Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="flex items-center gap-1 border-b border-slate-200 px-4 pt-2 bg-slate-50/60">
          <button
            onClick={() => setActiveTab('integrations')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'integrations'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Gateways & Integrations
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'pipeline'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Pipeline & Custom Fields
          </button>
          <button
            onClick={() => setActiveTab('ai-controls')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'ai-controls'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            AI Engine Controls
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'notifications'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Notification Preferences
          </button>
        </div>

        <div className="p-6">
          {/* TAB 1: INTEGRATIONS */}
          {activeTab === 'integrations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Active Service Connectors
                </span>
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> 6 / 6 Operational
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900">{item.name}</h4>
                        <span className="text-[11px] text-slate-500">{item.category}</span>
                      </div>
                      <StatusBadge status={item.status} size="sm" />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-200/60">
                      <span>Latency: {item.latency}</span>
                      <span>{item.lastSynced}</span>
                    </div>

                    <div className="pt-1 flex items-center justify-end">
                      <button
                        onClick={() => handleTestConnection(item.name)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Test Connectivity
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PIPELINE CUSTOMIZATION */}
          {activeTab === 'pipeline' && (
            <div className="space-y-4 max-w-2xl text-xs">
              <h4 className="text-sm font-semibold text-slate-900">Configured 12 Pipeline Stages</h4>
              <p className="text-slate-500">
                Stages represent sequential candidate progression from intake to student enrolment.
              </p>

              <div className="grid grid-cols-2 gap-2">
                {[
                  '1. New Enquiry',
                  '2. Contact Pending',
                  '3. Contacted',
                  '4. Interested',
                  '5. Counselling Scheduled',
                  '6. Application Started',
                  '7. Documents Pending',
                  '8. Under Review',
                  '9. Admission Approved',
                  '10. Payment Pending',
                  '11. Enrolled',
                  '12. Lost / Closed',
                ].map((s) => (
                  <div key={s} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700">
                    {s}
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-2">
                <h4 className="font-semibold text-slate-900">Custom Intake Fields</h4>
                <div className="space-y-1.5 text-slate-600">
                  <div className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between">
                    <span>Hostel Accommodation Required (Boolean)</span>
                    <span className="text-emerald-700 font-mono">Active</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between">
                    <span>Entrance Score / Percentile Rank (Text)</span>
                    <span className="text-emerald-700 font-mono">Active</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between">
                    <span>Parent / Guardian Occupation (Text)</span>
                    <span className="text-emerald-700 font-mono">Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AI CONTROLS */}
          {activeTab === 'ai-controls' && (
            <div className="space-y-5 max-w-2xl text-xs">
              <div>
                <h4 className="text-sm font-bold text-slate-900">AI Admissions Intelligence Settings</h4>
                <p className="text-slate-500 mt-0.5">
                  Govern predictive propensity scoring models, counsellor assistants, and human-in-the-loop safeguards.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-900 block">AI Lead Propensity Scoring</span>
                    <span className="text-slate-500 text-[11px]">
                      Calculate 0-100 conversion probability index based on academic cutoff and digital engagement signals.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={aiScoringEnabled}
                    onChange={(e) => setAiScoringEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-900 block">AI Counsellor Outreach Drafts</span>
                    <span className="text-slate-500 text-[11px]">
                      Generate personalized WhatsApp and email templates tailored to student qualification and target course.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={aiAssistantDraftsEnabled}
                    onChange={(e) => setAiAssistantDraftsEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-900 block">Strict Human Review Requirement</span>
                    <span className="text-slate-500 text-[11px]">
                      Prevent automated dispatch of messages or automated rejection of applications without counsellor approval.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="w-4 h-4 rounded text-blue-600 cursor-not-allowed opacity-80"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 max-w-xl text-xs">
              <h4 className="text-sm font-semibold text-slate-900">Counsellor Alert Preferences</h4>

              <div className="space-y-2 text-slate-700">
                <label className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  <span>Instant desktop alert when a new lead is assigned to my queue</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  <span>Escalation notice if follow-up task is pending past 2 hours</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  <span>Notification when candidate completes token fee payment</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  <span>Daily morning agenda digest at 08:30 AM IST</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { SettingsPage as SettingsWidget };
export default SettingsPage;
