import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useCRM, PageId } from '../services';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  breadcrumbs: { label: string; page?: PageId }[];
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
}) => {
  const { setCurrentPage } = useCRM();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-slate-200">
      <div>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.label}>
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
              {crumb.page ? (
                <button
                  onClick={() => crumb.page && setCurrentPage(crumb.page)}
                  className="hover:text-blue-600 transition-colors"
                >
                  {crumb.label}
                </button>
              ) : (
                <span className="text-slate-700 font-medium">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Title and Subtitle */}
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
          {title}
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-0.5">{subtitle}</p>
      </div>

      {/* Action buttons */}
      {actions && <div className="flex items-center gap-2.5 shrink-0 flex-wrap">{actions}</div>}
    </div>
  );
};
