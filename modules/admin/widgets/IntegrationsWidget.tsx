import React, { useState } from 'react';
import { useCRM } from '../../../shared/services';
import { PageHeader } from '../../../shared/components';
import { StatusBadge } from '../../../shared/components';
import { IntegrationServiceItem, WebhookEventLog, MetaLeadForm, FieldMapping } from '../../../shared/types';
import {
  Share2,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Zap,
  Globe,
  MessageSquare,
  Mail,
  Calendar,
  Code,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Settings2,
  Layers,
  ArrowRight,
  Send,
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  Lock,
  Plus,
  Eye,
  FileCode,
  HelpCircle,
  X,
} from 'lucide-react';
import { PermissionGuard } from '../../../shared/components';

export const IntegrationsPage: React.FC = () => {
  const {
    integrations,
    toggleIntegrationConnection,
    syncIntegrationNow,
    testIntegrationConnection,
    metaForms,
    whatsappTemplates,
    webhookLogs,
    retryWebhook,
    fieldMappings,
    updateFieldMapping,
    simulateInboundLead,
    counsellors,
    addToast,
    setCurrentPage,
    hasPermission,
  } = useCRM();

  const [activeTab, setActiveTab] = useState<
    'directory' | 'meta' | 'whatsapp' | 'linkedin' | 'webhooks' | 'website-embed'
  >('directory');

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedConfigService, setSelectedConfigService] = useState<IntegrationServiceItem | null>(null);
  const [inspectedWebhook, setInspectedWebhook] = useState<WebhookEventLog | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // WhatsApp tester state
  const [waTestPhone, setWaTestPhone] = useState('+91 98201 44321');
  const [waSelectedTemplate, setWaSelectedTemplate] = useState('iapl_lead_welcome_ack');

  // Filtered integrations in directory
  const filteredIntegrations = integrations.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    return true;
  });

  const totalConnected = integrations.filter((i) => i.status === 'Connected').length;
  const totalLeadsCaptured = integrations.reduce((acc, i) => acc + i.leadsReceivedCount, 0);
  const totalFailures = webhookLogs.filter((w) => w.status === 'Failed').length;

  const handleCopyEmbedCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
    addToast({
      title: 'Embed Code Copied',
      message: 'HTML/JS snippet copied to clipboard for your landing page.',
      type: 'info',
    });
  };

  const handleSendWATestMessage = () => {
    if (!hasPermission('communication.send_whatsapp')) {
      addToast({
        title: '403 Forbidden - Message Blocked',
        message: 'WhatsApp Broadcast Dispatches require the "communication.send_whatsapp" permission.',
        type: 'error',
      });
      return;
    }

    addToast({
      title: 'WhatsApp Template Dispatched (200 OK)',
      message: `Sent HSM template "${waSelectedTemplate}" to ${waTestPhone} via Meta Cloud API.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Third-Party Integrations & Marketing API Hub"
        subtitle="Connect Meta Ads, WhatsApp Business Platform, LinkedIn Lead Gen, Google Ads, GA4, and website intake endpoints."
        breadcrumbs={[{ label: 'Home', page: 'dashboard' }, { label: 'Integrations Hub' }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => simulateInboundLead('Meta Ads')}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-xs"
              title="Simulate inbound Meta lead from Facebook Lead Form"
            >
              <Zap className="w-3.5 h-3.5 text-blue-600" /> Simulate Meta Lead
            </button>
            <button
              onClick={() => simulateInboundLead('WhatsApp')}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-xs"
              title="Simulate inbound WhatsApp inquiry"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" /> Simulate WhatsApp Lead
            </button>
          </div>
        }
      />

      {/* Top Integration KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Connected Platforms</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {totalConnected} / {integrations.length}
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Healthy
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Live API & Webhooks</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Auto-Synced Leads</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-blue-700">
              {totalLeadsCaptured.toLocaleString()}
            </span>
            <span className="text-xs text-blue-600 font-medium">All Sources</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">0 manual entries needed</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Webhook Event Stream</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900">99.8%</span>
            <span className="text-xs text-emerald-600 font-medium">Success Rate</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">&lt; 250ms avg ingestion</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Sync Errors / Retries</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-amber-700">{totalFailures}</span>
            {totalFailures > 0 ? (
              <span className="text-xs text-amber-600 font-semibold">Action Required</span>
            ) : (
              <span className="text-xs text-emerald-600 font-semibold">All Clear</span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Auto-retry queue active</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="flex items-center gap-1 border-b border-slate-200 px-4 pt-2 bg-slate-50/60 overflow-x-auto">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'directory'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Integration Directory ({integrations.length})
          </button>
          <button
            onClick={() => setActiveTab('meta')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'meta'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Meta Ads (FB & IG)</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded">
              Active
            </span>
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'whatsapp'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>WhatsApp Business</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">
              Verified
            </span>
          </button>
          <button
            onClick={() => setActiveTab('linkedin')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'linkedin'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>LinkedIn Lead Gen</span>
          </button>
          <button
            onClick={() => setActiveTab('webhooks')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'webhooks'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Webhook Stream & Retries</span>
            {totalFailures > 0 && (
              <span className="font-mono text-[10px] px-1.5 py-0.2 bg-rose-100 text-rose-800 rounded font-semibold">
                {totalFailures}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('website-embed')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'website-embed'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Website Embeds & Forms
          </button>
        </div>

        <div className="p-6">
          {/* TAB 1: INTEGRATION DIRECTORY */}
          {activeTab === 'directory' && (
            <div className="space-y-6">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {[
                  'All',
                  'Advertising & Paid Social',
                  'Direct Messaging',
                  'Website & Forms',
                  'Analytics & Attribution',
                  'Email Services',
                  'Scheduling & Calendar',
                  'Workflow & iPaaS',
                  'Education Portals',
                ].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredIntegrations.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-100">
                            {item.provider.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-slate-900 leading-tight">
                              {item.name}
                            </h3>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {item.category}
                            </span>
                          </div>
                        </div>

                        <StatusBadge status={item.status} size="sm" />
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>

                      {/* Connected Account metadata */}
                      <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-[11px] space-y-1">
                        <div className="flex justify-between text-slate-600">
                          <span className="text-slate-400">Account:</span>
                          <span className="font-semibold text-slate-800 truncate max-w-[160px]">
                            {item.connectedAccountName}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span className="text-slate-400">Synced Leads:</span>
                          <span className="font-mono font-semibold text-slate-900">
                            {item.leadsReceivedCount} leads
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span className="text-slate-400">Last Synced:</span>
                          <span className="font-mono text-slate-700">{item.lastSyncTimestamp}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <PermissionGuard permission="integrations.manage">
                        <button
                          onClick={() => testIntegrationConnection(item.id)}
                          className="text-slate-600 hover:text-blue-600 font-medium flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" /> Test Ping
                        </button>
                      </PermissionGuard>

                      <div className="flex items-center gap-2">
                        <PermissionGuard permission="integrations.manage">
                          <button
                            onClick={() => {
                              if (item.id === 'int-meta') setActiveTab('meta');
                              else if (item.id === 'int-whatsapp') setActiveTab('whatsapp');
                              else if (item.id === 'int-linkedin') setActiveTab('linkedin');
                              else setSelectedConfigService(item);
                            }}
                            className="px-2.5 py-1 font-semibold text-blue-600 hover:bg-blue-50 rounded-md border border-blue-200 transition-colors"
                          >
                            Configure
                          </button>
                        </PermissionGuard>

                        <PermissionGuard permission="integrations.manage">
                          <button
                            onClick={() => toggleIntegrationConnection(item.id)}
                            className={`px-2.5 py-1 font-semibold rounded-md transition-colors ${
                              item.status === 'Connected'
                                ? 'text-slate-700 bg-slate-100 hover:bg-slate-200'
                                : 'text-white bg-blue-600 hover:bg-blue-700'
                            }`}
                          >
                            {item.status === 'Connected' ? 'Disconnect' : 'Connect'}
                          </button>
                        </PermissionGuard>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: META ADS (FACEBOOK & INSTAGRAM) */}
          {activeTab === 'meta' && (
            <div className="space-y-6">
              {/* Meta Account Status Header */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <h3 className="font-bold text-sm text-slate-900">
                      Connected to Meta Business Manager (act_98124018247)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Lead Ads Webhook subscribed for Page ID: <strong>1092841920 (IAPL University Group)</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => syncIntegrationNow('int-meta')}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" /> Pull Leads Now
                  </button>
                  <button
                    onClick={() => simulateInboundLead('Meta Ads')}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" /> Simulate Test Lead
                  </button>
                </div>
              </div>

              {/* Subscribed Meta Lead Forms */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-900">Active Meta Instant Lead Forms</h4>
                  <span className="text-xs text-slate-500">{metaForms.length} Forms Mapped</span>
                </div>

                <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                        <th className="py-3 px-4">Lead Form Name & ID</th>
                        <th className="py-3 px-4">Attached Campaign & Ad Set</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-center">Leads Ingested</th>
                        <th className="py-3 px-4">Auto-Assigned Counsellor</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {metaForms.map((form) => (
                        <tr key={form.id} className="hover:bg-slate-50/70">
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-900 block">{form.name}</span>
                            <span className="font-mono text-[10px] text-slate-400">
                              {form.id} · {form.fieldCount} fields mapped
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-700">
                            <div className="font-medium text-slate-800">{form.campaignName}</div>
                            <span className="text-[11px] text-slate-400">{form.adSetName}</span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <StatusBadge status={form.status} size="sm" />
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                            {form.leadsCaptured}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-medium text-slate-800 block">
                              {counsellors.find((c) => c.id === form.assignedCounsellorId)?.name || 'Round-Robin Engine'}
                            </span>
                            <span className="text-[10px] text-slate-400">SLA: Immediate</span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() =>
                                addToast({
                                  title: 'Form Mappings Verified',
                                  message: `Form fields synced with Meta Graph API for "${form.name}".`,
                                  type: 'info',
                                })
                              }
                              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                            >
                              Edit Mapping
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dynamic Field Mapping Matrix */}
              <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      Meta Instant Form $\rightarrow$ CRM Field Mapping
                    </h4>
                    <p className="text-xs text-slate-500">
                      Ensures accurate parsing of applicant contact details, selected courses, and academic backgrounds
                    </p>
                  </div>
                  <span className="text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    Schema Matched
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                        <th className="py-2.5 px-3">Meta Form Field Key</th>
                        <th className="py-2.5 px-3">Target CRM Student Attribute</th>
                        <th className="py-2.5 px-3">Required?</th>
                        <th className="py-2.5 px-3">Transformation Rule</th>
                        <th className="py-2.5 px-3">Sample Inbound Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {fieldMappings.map((map) => (
                        <tr key={map.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">
                            {map.sourceField}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px] border border-blue-200">
                              {map.targetCrmField}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono">
                            {map.isRequired ? (
                              <span className="text-rose-600 font-bold">Mandatory</span>
                            ) : (
                              <span className="text-slate-400">Optional</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                            {map.transformation}
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                            {map.sampleValue}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AUTOMATED WHATSAPP BUSINESS PLATFORM */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-6">
              {/* Account Credentials & Status */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <h3 className="font-bold text-sm text-slate-900">
                      Meta Cloud API Verified WhatsApp WABA ID: waba_88491209341
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600">
                    Sender Phone: <strong>+91 98201 00100 (Official IAPL Admissions)</strong> · Quality Rating: <strong className="text-emerald-700">High</strong> · Messaging Tier: <strong>100k/day</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs bg-white text-emerald-800 border border-emerald-300 font-semibold px-2.5 py-1 rounded-md">
                    24h Service Window Active (48 candidates)
                  </span>
                </div>
              </div>

              {/* Grid: Approved HSM Templates + Test Sender Studio */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Approved HSM Templates Table (2 Cols) */}
                <div className="lg:col-span-2 p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">Approved Meta HSM Message Templates</h4>
                      <p className="text-xs text-slate-500">Official templates verified for outbound notifications outside the 24h window</p>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">DLT Registered</span>
                  </div>

                  <div className="space-y-3">
                    {whatsappTemplates.map((tpl) => (
                      <div
                        key={tpl.id}
                        className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-900">{tpl.name}</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-200 text-slate-700">
                              {tpl.category}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                            {tpl.status}
                          </span>
                        </div>

                        <p className="text-slate-600 text-xs leading-relaxed font-sans bg-white p-2.5 rounded-lg border border-slate-100">
                          {tpl.bodyText}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                          <span>Language: {tpl.language}</span>
                          <span>Approved: {tpl.lastUpdated}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WhatsApp Dispatch & Attribution Simulator (1 Col) */}
                <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
                  <div className="pb-3 border-b border-slate-100">
                    <h4 className="text-sm font-semibold text-slate-900">Counsellor WhatsApp Console</h4>
                    <p className="text-xs text-slate-500">Test template dispatch & click-to-WhatsApp campaign tracking</p>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Target Student Phone</label>
                      <input
                        type="text"
                        value={waTestPhone}
                        onChange={(e) => setWaTestPhone(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Select Approved Template</label>
                      <select
                        value={waSelectedTemplate}
                        onChange={(e) => setWaSelectedTemplate(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                      >
                        {whatsappTemplates.map((t) => (
                          <option key={t.id} value={t.name}>
                            {t.name} ({t.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-slate-700 text-xs space-y-1">
                      <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider block">
                        Click-to-WhatsApp Attribution
                      </span>
                      <p className="text-[11px] leading-relaxed">
                        Incoming WhatsApp chats initiated from Meta Reel / Story ads automatically carry the campaign UTM tag and refering ad ID into the student CRM lead profile.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSendWATestMessage}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" /> Dispatch Test WhatsApp HSM
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LINKEDIN LEAD GEN INTEGRATION */}
          {activeTab === 'linkedin' && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <h3 className="font-bold text-sm text-slate-900">
                      LinkedIn Sponsored InMail & Feed Lead Gen Sync
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Authorized Page: <strong>IAPL Educational Trust (Page ID: 881290)</strong> · Account: <strong>li_ad_7721094</strong>
                  </p>
                </div>

                <button
                  onClick={() => simulateInboundLead('LinkedIn')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" /> Simulate LinkedIn Lead
                </button>
              </div>

              {/* Data & Privacy notice */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Privacy & API Scope Adherence:</strong> This integration strictly captures form responses explicitly submitted by candidates on LinkedIn Lead Gen forms. It never extracts unauthorized member connections, private browsing data, or non-consented profiles.
                </div>
              </div>

              {/* LinkedIn Form Submissions */}
              <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
                <h4 className="text-sm font-semibold text-slate-900">
                  Targeted Postgraduate & Executive Forms
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <span className="font-bold text-slate-900 block text-sm">
                      MBA FinTech Working Professional Leadership Form
                    </span>
                    <p className="text-slate-600">
                      Captures: Full Name, Work Email, Phone, Company, Job Title, Years of Experience, Highest Education.
                    </p>
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-mono text-[11px] text-slate-500">
                      <span>132 Ingested Leads</span>
                      <span className="text-emerald-700 font-semibold">Assigned: Pooja Iyer</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <span className="font-bold text-slate-900 block text-sm">
                      M.Sc in Data Science & Machine Learning Industry Track
                    </span>
                    <p className="text-slate-600">
                      Captures: Full Name, Email, Phone, Primary Programming Language, Current Employer, Graduation Year.
                    </p>
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-mono text-[11px] text-slate-500">
                      <span>63 Ingested Leads</span>
                      <span className="text-emerald-700 font-semibold">Assigned: Ananya Verma</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: WEBHOOK EVENT STREAM & RETRIES */}
          {activeTab === 'webhooks' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Live Inbound Webhook Event Stream</h4>
                  <p className="text-xs text-slate-500">Real-time audit log of payloads received across Meta, WhatsApp, LinkedIn, and forms</p>
                </div>

                <span className="text-xs text-slate-500 font-mono">
                  {webhookLogs.length} events logged
                </span>
              </div>

              <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <th className="py-3 px-4">Event ID & Time</th>
                      <th className="py-3 px-4">Origin Platform</th>
                      <th className="py-3 px-4">Event Type</th>
                      <th className="py-3 px-4">Payload Summary</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {webhookLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/70">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-slate-900 block">{log.id}</span>
                          <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-medium text-slate-800">{log.platform}</span>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          {log.eventType}
                        </td>

                        <td className="py-3.5 px-4 text-slate-700 max-w-md">
                          <p className="line-clamp-1">{log.payloadSummary}</p>
                          {log.errorReason && (
                            <span className="text-[10px] text-rose-600 font-semibold block mt-0.5">
                              {log.errorReason}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <StatusBadge status={log.status} size="sm" />
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setInspectedWebhook(log)}
                              className="p-1 text-slate-500 hover:text-blue-600"
                              title="Inspect Payload"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {log.status === 'Failed' && (
                              <button
                                onClick={() => retryWebhook(log.id)}
                                className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors"
                              >
                                Retry Sync
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: WEBSITE EMBEDS & FORM WEBHOOKS */}
          {activeTab === 'website-embed' && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h4 className="text-sm font-bold text-slate-900">
                  Headless REST API Endpoint & Landing Page Code Generator
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Easily embed admissions enquiry widgets onto college microsites, campaign landing pages (Unbounce, Webflow, WordPress), or send direct JSON payloads via cURL.
                </p>
              </div>

              {/* Endpoint card */}
              <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3 text-xs">
                <span className="font-semibold text-slate-800 uppercase tracking-wider text-[10px] block">
                  Public Ingestion Endpoint
                </span>
                <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-lg flex items-center justify-between">
                  <span>POST https://admissions.iapl-lms.edu/api/v1/inbound-webhook</span>
                  <span className="text-[10px] text-slate-400">Bearer Token Auth</span>
                </div>
              </div>

              {/* Embed snippet */}
              <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 uppercase tracking-wider text-[10px] block">
                    Copy-Paste HTML / JavaScript Landing Page Widget
                  </span>
                  <button
                    onClick={() =>
                      handleCopyEmbedCode(
                        `<div id="iapl-enquiry-widget" data-campus="Mumbai Main Campus" data-source="Website Form"></div>\n<script src="https://cdn.iapl-lms.edu/v2/enquiry-form.js" async></script>`
                      )
                    }
                    className="px-3 py-1 font-semibold text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-md flex items-center gap-1.5"
                  >
                    {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedSnippet ? 'Copied' : 'Copy Embed Snippet'}
                  </button>
                </div>

                <pre className="p-3.5 bg-slate-900 text-slate-200 font-mono text-[11px] rounded-lg overflow-x-auto">
{`<div id="iapl-enquiry-widget" data-campus="Mumbai Main Campus" data-source="Website Form"></div>
<script src="https://cdn.iapl-lms.edu/v2/enquiry-form.js" async></script>`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inspect Webhook Modal */}
      {inspectedWebhook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Webhook Event: {inspectedWebhook.id}
              </h3>
              <button
                onClick={() => setInspectedWebhook(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Platform:</span>
                  <span className="font-semibold text-slate-900">{inspectedWebhook.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Event:</span>
                  <span className="font-mono text-slate-900">{inspectedWebhook.eventType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Timestamp:</span>
                  <span className="font-mono text-slate-700">{inspectedWebhook.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ingestion Status:</span>
                  <StatusBadge status={inspectedWebhook.status} size="sm" />
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Payload JSON</span>
                <pre className="p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-lg overflow-x-auto max-h-48">
                  {JSON.stringify(
                    inspectedWebhook.rawPayload || {
                      event: inspectedWebhook.eventType,
                      summary: inspectedWebhook.payloadSummary,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setInspectedWebhook(null)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configure Service Modal */}
      {selectedConfigService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900">
              Configure {selectedConfigService.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1">{selectedConfigService.description}</p>

            <div className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Account Identifier / App ID</label>
                <input
                  type="text"
                  defaultValue={selectedConfigService.connectedAccountId}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">API Key / Webhook Secret Token</label>
                <input
                  type="password"
                  defaultValue="whk_secret_iapl_live_998410294"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Duplicate Lead Policy</label>
                <select className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-slate-50">
                  <option>Match by Mobile Number & Email (Merge Activity)</option>
                  <option>Create Secondary Lead with Duplicate Tag</option>
                  <option>Ignore Duplicate (Preserve Original Source)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedConfigService(null)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addToast({
                      title: 'Configuration Updated',
                      message: `Saved connection parameters for ${selectedConfigService.name}.`,
                      type: 'success',
                    });
                    setSelectedConfigService(null);
                  }}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { IntegrationsPage as IntegrationsWidget };
export default IntegrationsPage;
