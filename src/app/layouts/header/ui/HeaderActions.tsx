import React from 'react';
import { InternationalSwitcher } from './InternationalSwitcher';
import { CampusSelector } from './CampusSelector';
import { NotificationsDropdown } from './NotificationsDropdown';
import { UserProfileMenu } from './UserProfileMenu';

export const HeaderActions: React.FC = () => {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <CampusSelector />
      <InternationalSwitcher />
      <NotificationsDropdown />
      <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />
      <UserProfileMenu />
    </div>
  );
};
