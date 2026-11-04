export type LeadStatus =
  | 'New Enquiry'
  | 'Contact Pending'
  | 'Contacted'
  | 'Interested'
  | 'Counselling Scheduled'
  | 'Application Started'
  | 'Documents Pending'
  | 'Under Review'
  | 'Admission Approved'
  | 'Payment Pending'
  | 'Enrolled'
  | 'Lost / Closed';

export type LeadPriority = 'High' | 'Medium' | 'Low' | 'Urgent';

export type LeadSource =
  | 'Google Ads'
  | 'Website Form'
  | 'Education Fair'
  | 'Shiksha / CollegeDunia'
  | 'Meta Ads'
  | 'Campus Walk-in'
  | 'Alumni Referral'
  | 'Inbound Call'
  | 'Agent Partner';

export type Campus =
  | 'All Campuses'
  | 'Mumbai Main Campus'
  | 'Bengaluru Tech Campus'
  | 'Delhi NCR Campus'
  | 'Pune Innovation Hub';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  interestedCourse: string;
  preferredCampus: string;
  source: LeadSource;
  assignedCounsellorId: string;
  assignedCounsellorName: string;
  status: LeadStatus;
  priority: LeadPriority;
  score: number;
  scoreCategory: 'Hot' | 'Warm' | 'Cold';
  scoreExplanation: string;
  engagementLevel: 'Very High' | 'High' | 'Moderate' | 'Low' | 'Dormant';
  lastActivity: string;
  nextFollowUp: string;
  createdAt: string;
  academicBackground: {
    qualification: string;
    percentageOrGpa: string;
    institution: string;
    passingYear: number;
  };
  consent: {
    whatsapp: boolean;
    email: boolean;
    call: boolean;
  };
  tags: string[];
  notesCount: number;
  tasksCount: number;
  applicationsCount: number;
  utmSource?: string;
  utmCampaign?: string;
}

export interface Task {
  id: string;
  leadId: string;
  leadName: string;
  counsellorId: string;
  counsellorName: string;
  type: 'Call' | 'Email' | 'WhatsApp' | 'Campus Visit' | 'Document Review' | 'General';
  title: string;
  dueDate: string;
  dueTime: string;
  priority: LeadPriority;
  status: 'Pending' | 'Completed' | 'Overdue';
  completedAt?: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  leadId: string;
  leadName: string;
  counsellorId: string;
  counsellorName: string;
  course: string;
  campus: string;
  date: string;
  timeSlot: string;
  type: 'Online (Google Meet)' | 'In-Person (Campus Office)' | 'Telephonic';
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled' | 'No-Show';
  meetingLink?: string;
  roomNumber?: string;
  attendanceMarked: boolean;
  notes?: string;
  outcome?: string;
}

export interface Application {
  id: string;
  applicantId: string;
  applicantName: string;
  email: string;
  phone: string;
  course: string;
  campus: string;
  submissionDate: string;
  completenessPercent: number;
  documentStatus: 'All Verified' | 'Verification Pending' | 'Action Required' | 'Not Uploaded';
  assignedReviewer: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Shortlisted' | 'Approved' | 'Waitlisted' | 'Rejected';
  entranceScore?: string;
  category: 'General' | 'Management Quota' | 'NRI / International' | 'Scholarship Merit';
  lastUpdated: string;
  remarks?: string;
}

export interface DocumentRecord {
  id: string;
  applicationId: string;
  applicantName: string;
  leadId: string;
  course: string;
  category: 'Class 10 Marksheet' | 'Class 12 Marksheet' | 'Graduation Degree' | 'ID Proof / Aadhaar' | 'Transfer Certificate' | 'Entrance Scorecard';
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: 'Verified' | 'Pending Review' | 'Rejected' | 'Reupload Requested';
  reviewer?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  version: number;
  previewUrl?: string;
}

export interface AdmissionRecord {
  id: string;
  applicationId: string;
  studentName: string;
  course: string;
  campus: string;
  offerDate: string;
  offerStatus: 'Issued' | 'Accepted' | 'Declined' | 'Waitlisted' | 'Expired';
  feeStatus: 'Paid in Full' | 'Partial / Token Paid' | 'Installment Pending' | 'Unpaid';
  feeAmount: number;
  feePaid: number;
  studentId?: string;
  registrationStatus: 'Enrolled' | 'Provisional' | 'Pending Payment' | 'Onboarding';
  onboardingStepsCompleted: number;
  totalOnboardingSteps: number;
  duplicateCheckPassed: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  channel: 'Google Search' | 'Instagram / Meta' | 'Education Portals' | 'LinkedIn Sponsored' | 'Offline Roadshow' | 'Alumni Referral';
  status: 'Active' | 'Paused' | 'Completed' | 'Draft';
  budget: number;
  spend: number;
  leadsGenerated: number;
  applicationsReceived: number;
  admissionsEnrolled: number;
  costPerLead: number;
  costPerEnrolment: number;
  conversionRate: number;
  referralCode?: string;
  utmSource: string;
  startDate: string;
  endDate: string;
}

export interface CommunicationMessage {
  id: string;
  leadId: string;
  leadName: string;
  channel: 'Email' | 'WhatsApp' | 'SMS' | 'Call Log';
  direction: 'Inbound' | 'Outbound';
  sender: string;
  recipient: string;
  subject?: string;
  content: string;
  timestamp: string;
  status: 'Delivered' | 'Read' | 'Sent' | 'Failed' | 'Scheduled';
  templateUsed?: string;
}

export interface Counsellor {
  id: string;
  name: string;
  email: string;
  phone: string;
  campus: string;
  role: 'Admissions Counsellor' | 'Senior Counsellor' | 'Team Lead' | 'Admissions Director';
  assignedRoles: UserRole[];
  assignedLeadsCount: number;
  maxCapacity: number;
  activeStatus: 'Available' | 'In Meeting' | 'On Leave' | 'Busy';
  monthlyTarget: number;
  achievedConversions: number;
  conversionRate: number;
  averageResponseTime: string;
}

export interface WorkflowRule {
  id: string;
  name: string;
  trigger: string;
  conditions: string[];
  actions: string[];
  delay: string;
  status: 'Active' | 'Draft' | 'Paused';
  executionCount: number;
  lastExecuted: string;
}

export interface NurturingSequence {
  id: string;
  name: string;
  targetSegment: string;
  triggerEvent: string;
  status: 'Active' | 'Paused' | 'Draft';
  totalEnrolled: number;
  completedCount: number;
  avgEngagementRate: number;
  stepsCount: number;
}

export type UserRole = string;

export interface AuditLogItem {
  id: string;
  userName: string;
  userRole: string;
  action:
    | 'Create'
    | 'Update'
    | 'Delete'
    | 'Status Change'
    | 'Assignment'
    | 'Document Approval'
    | 'Offer Issued'
    | 'Permission Change'
    | 'Security Policy Reset'
    | 'Role Created'
    | 'Role Deleted';
  entity: 'Lead' | 'Application' | 'Document' | 'Admission' | 'Workflow' | 'Setting' | 'Security & RBAC';
  entityId: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  degree: string;
  department: string;
  duration: string;
  campuses: string[];
  annualFee: number;
  seatsAvailable: number;
  eligibility: string;
  minPercentage: number;
}

export type IntegrationCategory =
  | 'Advertising & Paid Social'
  | 'Direct Messaging'
  | 'Website & Forms'
  | 'Analytics & Attribution'
  | 'Email Services'
  | 'Scheduling & Calendar'
  | 'Workflow & iPaaS'
  | 'Education Portals';

export interface IntegrationServiceItem {
  id: string;
  name: string;
  provider: 'Meta' | 'WhatsApp' | 'LinkedIn' | 'Google Ads' | 'Google Analytics' | 'Website Webhooks' | 'SendGrid' | 'Google Calendar' | 'Zapier' | 'Education Portals';
  category: IntegrationCategory;
  description: string;
  iconName: string;
  status: 'Connected' | 'Syncing' | 'Action Required' | 'Disconnected';
  connectedAccountName?: string;
  connectedAccountId?: string;
  lastSyncTimestamp: string;
  nextScheduledSync?: string;
  leadsReceivedCount: number;
  syncErrorsCount: number;
  duplicateLeadsCount: number;
  webhookStatus: 'Healthy' | 'Degraded' | 'Offline';
  permissions: string[];
}

export interface FieldMapping {
  id: string;
  sourceField: string;
  targetCrmField: string;
  isRequired: boolean;
  sampleValue: string;
  transformation?: 'None' | 'Trim' | 'Phone Normalize (+91)' | 'Title Case' | 'Lowercase';
}

export interface MetaLeadForm {
  id: string;
  name: string;
  campaignName: string;
  adSetName: string;
  status: 'Active' | 'Paused' | 'Archived';
  leadsCaptured: number;
  createdDate: string;
  assignedCounsellorId?: string;
  fieldCount: number;
}

export interface WhatsAppTemplateItem {
  id: string;
  name: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  language: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  bodyText: string;
  lastUpdated: string;
}

export interface WebhookEventLog {
  id: string;
  platform: 'Meta Ads' | 'WhatsApp Cloud API' | 'LinkedIn Lead Gen' | 'Google Ads' | 'Website Webhook';
  eventType: string;
  timestamp: string;
  status: 'Success' | 'Failed' | 'Retried';
  payloadSummary: string;
  errorReason?: string;
  retryCount: number;
  rawPayload?: Record<string, any>;
}

export type PermissionKey =
  // Leads & Pipeline
  | 'leads.view_all'
  | 'leads.view_assigned_only'
  | 'leads.view_pii'
  | 'leads.create'
  | 'leads.edit'
  | 'leads.delete'
  | 'leads.export_csv'
  | 'leads.bulk_assign'
  | 'pipeline.stage_change'

  // Admissions & Offers
  | 'admissions.evaluate'
  | 'admissions.approve_offer'
  | 'admissions.convert_student'
  | 'admissions.reject'
  | 'admissions.view_financials'
  | 'documents.verify'
  | 'documents.reject'

  // Counselling & Tasks
  | 'counselling.book'
  | 'counselling.mark_attendance'
  | 'tasks.manage'

  // Communications & Marketing
  | 'communication.send_direct'
  | 'communication.send_whatsapp'
  | 'communication.manage_templates'
  | 'campaigns.manage'
  | 'nurturing.manage'

  // AI & Automation
  | 'ai.assistant'
  | 'ai.configure_scoring'
  | 'workflows.manage'

  // Administration, Security & APIs
  | 'integrations.manage'
  | 'integrations.dispatch_api'
  | 'users.manage'
  | 'roles.manage'
  | 'settings.manage'
  | 'audit.view'
  | 'audit.export';

export interface MultiRolePreset {
  id: string;
  title: string;
  roles: UserRole[];
  tag: string;
  description: string;
}

export interface RoleDefinition {
  id: string;
  name: string;
  tagline: string;
  description: string;
  badgeClass: string;
  department?: string;
  isCustom?: boolean;
  userCount: number;
  permissions: PermissionKey[];
}



