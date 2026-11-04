import React, { useState } from 'react';
import { useCRM } from '../../../shared/services';
import { PageHeader } from '../../../shared/components';
import { StatusBadge } from '../../../shared/components';
import { Campaign } from '../../../shared/types';
import {
  Megaphone,
  Plus,
  TrendingUp,
  DollarSign,
  Users,
  GraduationCap,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Target,
  X,
} from 'lucide-react';

export const CampaignsPage: React.FC = () => {
  const { campaigns, setCampaigns, addToast } = useCRM();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUtmOpen, setIsUtmOpen] = useState(false);

  // New campaign form state
  const [name, setName] = useState('');
  const [channel, setChannel] = useState<Campaign['channel']>('Google Search');
  const [budget, setBudget] = useState(250000);
  const [utmSource, setUtmSource] = useState('google-search');
  const [copiedCode, setCopiedCode] = useState(false);

  // Generated UTM link demo state
  const [utmCampaignInput, setUtmCampaignInput] = useState('btech_fall_2026');
  const [utmSourceInput, setUtmSourceInput] = useState('meta_instagram');
  const [utmMediumInput, setUtmMediumInput] = useState('cpc');

  const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
  const totalLeads = campaigns.reduce((acc, c) => acc + c.leadsGenerated, 0);
  const totalEnrolments = campaigns.reduce((acc, c) => acc + c.admissionsEnrolled, 0);
  const avgCPL = totalLeads ? Math.round(totalSpend / totalLeads) : 0;
  const avgCPE = totalEnrolments ? Math.round(totalSpend / totalEnrolments) : 0;

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCamp: Campaign = {
      id: `CMP-${Date.now().toString().slice(-3)}`,
      name,
      channel,
      status: 'Active',
      budget: Number(budget),
      spend: 0,
      leadsGenerated: 0,
      applicationsReceived: 0,
      admissionsEnrolled: 0,
      costPerLead: 0,
      costPerEnrolment: 0,
      conversionRate: 0,
      utmSource,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
    };

    setCampaigns((prev) => [newCamp, ...prev]);
    setIsCreateOpen(false);
    setName('');
    addToast({
      title: 'Campaign Launched',
      message: `Campaign "${newCamp.name}" active and listening for UTM tags.`,
      type: 'success',
    });
  };

  const generatedLink = `https://admissions.iapl-lms.edu/apply?utm_source=${utmSourceInput}&utm_medium=${utmMediumInput}&utm_campaign=${utmCampaignInput}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    addToast({
      title: 'Copied to Clipboard',
      message: 'Attribution URL ready for marketing campaigns.',
      type: 'info',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketing Campaigns & Referral Attribution"
        subtitle="Track multi-channel acquisition ROI, CAC per enrolled student, UTM parameters, and alumni referral codes."
        breadcrumbs={[{ label: 'Home', page: 'dashboard' }, { label: 'Campaigns & Referrals' }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUtmOpen(true)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" /> UTM Builder
            </button>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Launch Campaign
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Total Marketing Spend</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900">
              ₹{(totalSpend / 1000).toFixed(0)}k
            </span>
            <span className="text-xs text-slate-400">INR</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Acquired Leads</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-blue-700">{totalLeads}</span>
            <span className="text-xs text-slate-400">All channels</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Average Cost per Lead</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900">₹{avgCPL}</span>
            <span className="text-xs text-emerald-600 font-medium">Optimal</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Cost per Enrolled Student</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-700">₹{avgCPE}</span>
            <span className="text-xs text-slate-400 font-mono">{totalEnrolments} enrolments</span>
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Active Performance Campaigns</h3>
          <span className="text-xs text-slate-500">{campaigns.length} campaigns active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Budget / Spend</th>
                <th className="py-3 px-4 text-center">Leads</th>
                <th className="py-3 px-4 text-center">Enrolments</th>
                <th className="py-3 px-4 text-right">CPL (₹)</th>
                <th className="py-3 px-4 text-right">CPE (₹)</th>
                <th className="py-3 px-4 text-center">Conv. Rate</th>
                <th className="py-3 px-4">UTM Tag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-900 block">{camp.name}</span>
                    <span className="font-mono text-[10px] text-slate-400">{camp.id}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium text-slate-700">
                      {camp.channel}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    <div>₹{camp.spend.toLocaleString()}</div>
                    <span className="text-[10px] text-slate-400">Budget: ₹{camp.budget.toLocaleString()}</span>
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                    {camp.leadsGenerated}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-700">
                    {camp.admissionsEnrolled}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono text-slate-800">
                    ₹{camp.costPerLead}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono text-emerald-800 font-semibold">
                    ₹{camp.costPerEnrolment.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-800">
                    {camp.conversionRate}%
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500">
                    {camp.utmSource}
                    {camp.referralCode && (
                      <span className="block text-purple-600 font-bold">Code: {camp.referralCode}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* UTM Builder Modal */}
      {isUtmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">UTM Attribution Link Builder</h3>
              <button
                onClick={() => setIsUtmOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Campaign Tag Name</label>
                <input
                  type="text"
                  value={utmCampaignInput}
                  onChange={(e) => setUtmCampaignInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">UTM Source</label>
                  <input
                    type="text"
                    value={utmSourceInput}
                    onChange={(e) => setUtmSourceInput(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">UTM Medium</label>
                  <input
                    type="text"
                    value={utmMediumInput}
                    onChange={(e) => setUtmMediumInput(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-slate-700 font-semibold mb-1">Generated Tracking URL</label>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-800 break-all select-all">
                  {generatedLink}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUtmOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-700"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => copyToClipboard(generatedLink)}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-1.5"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? 'Copied' : 'Copy Tracking Link'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900">Launch New Marketing Campaign</h3>
            <form onSubmit={handleCreateCampaign} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Campaign Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. MBA Early Bird Admissions Drive"
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Primary Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as Campaign['channel'])}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Google Search">Google Search</option>
                  <option value="Instagram / Meta">Instagram / Meta</option>
                  <option value="Education Portals">Education Portals (Shiksha/Collegedunia)</option>
                  <option value="LinkedIn Sponsored">LinkedIn Sponsored</option>
                  <option value="Offline Roadshow">Offline Roadshow / Fair</option>
                  <option value="Alumni Referral">Alumni Referral</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Allocated Budget (₹)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">UTM Tracking Source Identifier</label>
                <input
                  type="text"
                  value={utmSource}
                  onChange={(e) => setUtmSource(e.target.value)}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Save & Launch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export { CampaignsPage as CampaignsWidget };
export default CampaignsPage;
