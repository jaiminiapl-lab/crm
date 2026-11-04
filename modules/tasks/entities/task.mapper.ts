import { TaskDTO } from './task.dto';
import { TaskEntityModel } from './task.types';

export function mapTaskDtoToEntity(dto: TaskDTO): TaskEntityModel {
  return {
    id: dto.task_id,
    leadId: dto.associated_lead_id,
    leadName: dto.lead_full_name,
    counsellorId: dto.staff_id,
    counsellorName: dto.staff_name,
    type: (dto.activity_type || 'General') as any,
    title: dto.subject_title,
    dueDate: dto.deadline_date,
    dueTime: dto.deadline_time,
    priority: (dto.urgency_level || 'Medium') as any,
    status: (dto.completion_status || 'Pending') as any,
  };
}
