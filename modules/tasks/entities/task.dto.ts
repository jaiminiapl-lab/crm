export interface TaskDTO {
  task_id: string;
  associated_lead_id: string;
  lead_full_name: string;
  staff_id: string;
  staff_name: string;
  activity_type: string;
  subject_title: string;
  deadline_date: string;
  deadline_time: string;
  urgency_level: string;
  completion_status: string;
}
