/**
 * Data Transfer Object representing Lead payload from backend API
 */
export interface LeadDTO {
  id: string;
  full_name: string;
  email_address: string;
  contact_number: string;
  city_name: string;
  state_name: string;
  target_course: string;
  target_campus: string;
  lead_source: string;
  advisor_id: string;
  advisor_name: string;
  lead_stage: string;
  priority_tier: string;
  conversion_score: number;
  score_grade: string;
  created_at: string;
}
