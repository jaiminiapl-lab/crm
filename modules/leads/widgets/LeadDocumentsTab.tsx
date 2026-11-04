import React from 'react';
import { DocumentRecord } from '../../../shared/types';
import { StatusBadge } from '../../../shared/components';

interface LeadDocumentsTabProps {
  documents: DocumentRecord[];
  onReviewDocuments: () => void;
}

export const LeadDocumentsTab: React.FC<LeadDocumentsTabProps> = ({
  documents,
  onReviewDocuments,
}) => {
  if (documents.length === 0) {
    return <p className="text-xs text-slate-500 py-4">No documents submitted yet for verification.</p>;
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="p-3 border border-slate-200 rounded-lg flex items-center justify-between text-xs"
        >
          <div>
            <span className="font-semibold text-slate-800">{doc.category}</span>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              {doc.fileName} ({doc.fileSize}) · Uploaded: {doc.uploadDate}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={doc.status} />
            <button
              onClick={onReviewDocuments}
              className="text-xs text-blue-600 hover:underline cursor-pointer"
            >
              Review
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
