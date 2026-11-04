import { ApplicantDTO } from './applicant.dto';
import { ApplicantEntityModel } from './applicant.types';

export function mapApplicantDtoToEntity(dto: ApplicantDTO): ApplicantEntityModel {
  return {
    id: dto.application_id,
    applicantId: dto.candidate_id,
    applicantName: dto.candidate_name,
    email: dto.contact_email,
    phone: dto.contact_phone,
    course: dto.degree_program,
    campus: dto.campus_location,
    submissionDate: dto.date_applied,
    completenessPercent: dto.docs_verified ? 100 : 75,
    documentStatus: dto.docs_verified ? 'All Verified' : 'Verification Pending',
    assignedReviewer: dto.officer_assigned,
    status: (dto.review_status || 'Submitted') as any,
    category: (dto.quota_category || 'General') as any,
    lastUpdated: dto.date_applied,
  };
}
