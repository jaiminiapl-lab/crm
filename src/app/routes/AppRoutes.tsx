import React from 'react';
import { useCRM } from '../../shared/services';
import { AccessDeniedView } from '../../shared/components';
import { AdminRoutes } from '../admin-routes';
import { APP_ROUTES } from './routeConfig';

// Domain Module Page Builders
import { DashboardPageBuilder } from '../../modules/dashboard';
import { LeadsPageBuilder, LeadDetailsPageBuilder } from '../../modules/leads';
import { PipelinePageBuilder } from '../../modules/pipeline';
import { ApplicantsPageBuilder } from '../../modules/applicants';
import { AdmissionsPageBuilder } from '../../modules/admissions';
import { CounsellingPageBuilder } from '../../modules/counselling';
import { TasksPageBuilder } from '../../modules/tasks';
import { DocumentsPageBuilder } from '../../modules/documents';
import { GoalsPageBuilder } from '../../modules/goals';
import { AssignmentPageBuilder } from '../../modules/operations';
import {
  CampaignsPageBuilder,
  CommunicationPageBuilder,
  NurturingPageBuilder,
} from '../../modules/marketing';
import {
  ReportsPageBuilder,
  AIScoringPageBuilder,
  AIAssistantPageBuilder,
  ConversionPageBuilder,
  RecommendationsPageBuilder,
} from '../../modules/analytics';

export const AppRoutes: React.FC = () => {
  const { currentPage, canAccessPage, hasPermission } = useCRM();
  const route = APP_ROUTES[currentPage];

  if (!canAccessPage(currentPage) || (route?.requiredPermission && !hasPermission(route.requiredPermission))) {
    return (
      <AccessDeniedView
        requiredPermission={route?.requiredPermission || 'admin.manage'}
        pageTitle={route?.title || 'Restricted Module'}
      />
    );
  }

  if (route?.isAdminOnly) {
    return <AdminRoutes pageId={currentPage} />;
  }

  switch (currentPage) {
    case 'dashboard': return <DashboardPageBuilder />;
    case 'leads': return <LeadsPageBuilder />;
    case 'lead-details': return <LeadDetailsPageBuilder />;
    case 'pipeline': return <PipelinePageBuilder />;
    case 'tasks': return <TasksPageBuilder />;
    case 'applications': return <ApplicantsPageBuilder />;
    case 'admissions': return <AdmissionsPageBuilder />;
    case 'counselling': return <CounsellingPageBuilder />;
    case 'documents': return <DocumentsPageBuilder />;
    case 'goals': return <GoalsPageBuilder />;
    case 'assignment': return <AssignmentPageBuilder />;
    case 'campaigns': return <CampaignsPageBuilder />;
    case 'communication': return <CommunicationPageBuilder />;
    case 'nurturing': return <NurturingPageBuilder />;
    case 'ai-scoring': return <AIScoringPageBuilder />;
    case 'ai-assistant': return <AIAssistantPageBuilder />;
    case 'conversion-prediction': return <ConversionPageBuilder />;
    case 'recommendations': return <RecommendationsPageBuilder />;
    case 'reports': return <ReportsPageBuilder />;
    default: return <DashboardPageBuilder />;
  }
};
