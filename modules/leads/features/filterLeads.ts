import { Lead } from '../../../shared/types';
import { LeadFilterState } from './LeadFilterBar';

export function filterLeads(leads: Lead[], filters: LeadFilterState): Lead[] {
  return leads.filter((lead) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchesName = lead.name.toLowerCase().includes(q);
      const matchesEmail = lead.email.toLowerCase().includes(q);
      const matchesPhone = lead.phone.includes(q);
      const matchesId = lead.id.toLowerCase().includes(q);
      if (!matchesName && !matchesEmail && !matchesPhone && !matchesId) return false;
    }
    if (filters.status !== 'ALL' && lead.status !== filters.status) return false;
    if (filters.course !== 'ALL' && lead.interestedCourse !== filters.course) return false;
    if (filters.campus !== 'ALL' && lead.preferredCampus !== filters.campus) return false;
    if (filters.scoreTier === 'HOT' && (lead.score || 0) < 80) return false;
    if (filters.scoreTier === 'WARM' && ((lead.score || 0) < 60 || (lead.score || 0) >= 80)) return false;
    if (filters.scoreTier === 'NEUTRAL' && ((lead.score || 0) < 40 || (lead.score || 0) >= 60)) return false;
    if (filters.scoreTier === 'COLD' && (lead.score || 0) >= 40) return false;
    return true;
  });
}
