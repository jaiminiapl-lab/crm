import { LeadDTO } from './lead.dto';
import { LeadEntityModel } from './lead.types';
import { LeadStatus, LeadPriority, LeadSource } from '../../../shared/types';

export function mapLeadDtoToEntity(dto: LeadDTO): LeadEntityModel {
  return {
    id: dto.id,
    name: dto.full_name,
    email: dto.email_address,
    phone: dto.contact_number,
    city: dto.city_name,
    state: dto.state_name,
    interestedCourse: dto.target_course,
    preferredCampus: dto.target_campus,
    source: (dto.lead_source || 'Website Form') as LeadSource,
    assignedCounsellorId: dto.advisor_id,
    assignedCounsellorName: dto.advisor_name,
    status: (dto.lead_stage || 'New Enquiry') as LeadStatus,
    priority: (dto.priority_tier || 'Medium') as LeadPriority,
    score: dto.conversion_score || 0,
    scoreCategory: (dto.score_grade || 'Warm') as 'Hot' | 'Warm' | 'Cold',
    scoreExplanation: 'Automated AI scoring model',
    engagementLevel: 'Moderate',
    lastActivity: 'Recent interaction',
    nextFollowUp: 'Scheduled',
    createdAt: dto.created_at,
    tags: [],
  };
}
