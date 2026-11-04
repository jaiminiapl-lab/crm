import React from 'react';
import { PageId, useCRM } from '../../shared/services';
import { AccessDeniedView } from '../../shared/components';
import { APP_ROUTES } from '../routes/routeConfig';
import {
  RolesPageBuilder,
  UsersPageBuilder,
  WorkflowsPageBuilder,
  IntegrationsPageBuilder,
  AuditLogsPageBuilder,
  SettingsPageBuilder,
} from '../../modules/admin';

interface AdminRoutesProps {
  pageId: PageId;
}

export const AdminRoutes: React.FC<AdminRoutesProps> = ({ pageId }) => {
  const { hasPermission } = useCRM();
  const route = APP_ROUTES[pageId];

  if (route?.requiredPermission && !hasPermission(route.requiredPermission)) {
    return (
      <AccessDeniedView
        requiredPermission={route.requiredPermission}
        pageTitle={route.title}
      />
    );
  }

  switch (pageId) {
    case 'roles':
      return <RolesPageBuilder />;
    case 'users':
      return <UsersPageBuilder />;
    case 'workflows':
      return <WorkflowsPageBuilder />;
    case 'integrations':
      return <IntegrationsPageBuilder />;
    case 'audit':
      return <AuditLogsPageBuilder />;
    case 'settings':
      return <SettingsPageBuilder />;
    default:
      return null;
  }
};
