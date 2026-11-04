import React, { useState } from 'react';
import { Bell, Check, Clock } from 'lucide-react';
import { useCRM } from '../../../../shared/services';

export const NotificationsDropdown: React.FC = () => {
  const { notifications, markAllNotificationsRead, setCurrentPage } = useCRM();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 rounded-lg hover:bg-slate-100 hover:text-slate-800 transition-colors"
        aria-label="View notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-40 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
              <span className="text-xs font-semibold text-slate-900">
                Institutional Notifications ({unreadCount} new)
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">No new alerts</div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (item.linkTo) {
                        setCurrentPage(item.linkTo);
                        setIsOpen(false);
                      }
                    }}
                    className={`p-3 text-xs hover:bg-slate-50 transition-colors cursor-pointer ${
                      !item.read ? 'bg-indigo-50/30 font-medium' : ''
                    }`}
                  >
                    <div className="text-slate-800 leading-snug">{item.title}</div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
