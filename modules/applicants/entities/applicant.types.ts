export interface ApplicantEntityModel {
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
  category: 'General' | 'Management Quota' | 'NRI / International' | 'Scholarship Merit';
  lastUpdated: string;
}
