import React, { useState } from 'react';
import { useCRM } from '../../../shared/services';
import { PageHeader } from '../../../shared/components';
import { StatusBadge } from '../../../shared/components';
import { Course } from '../../../shared/types';
import {
  Compass,
  CheckCircle,
  AlertCircle,
  Plus,
  BookOpen,
  Building,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const CourseRecommendationsPage: React.FC = () => {
  const { leads, courses, addToast, setSelectedLeadId, setCurrentPage } = useCRM();

  const [selectedLeadId, setLocalLeadId] = useState(leads[0]?.id || '');
  const [selectedDegree, setSelectedDegree] = useState('All');

  const activeLead = leads.find((l) => l.id === selectedLeadId) || leads[0];

  // Parse student percentage
  const studentPct = parseFloat(activeLead.academicBackground.percentageOrGpa.replace('%', '')) || 75;

  const matchedCourses = courses.filter((c) => {
    if (selectedDegree !== 'All' && c.degree !== selectedDegree) return false;
    return true;
  });

  const handleAddRecommendationToProfile = (courseName: string) => {
    addToast({
      title: 'Course Added to Recommendations',
      message: `Recommended "${courseName}" added to ${activeLead.name}'s counselling profile.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Recommendations & Eligibility Matcher"
        subtitle="Rule-based academic matching against institutional prerequisite requirements, minimum cutoffs, and campus seat capacity."
        breadcrumbs={[{ label: 'Home', page: 'dashboard' }, { label: 'Course Recommendations' }]}
      />

      {/* Student Selector Card */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
            {activeLead.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <span className="text-xs text-slate-400">Evaluating Profile For:</span>
            <div className="flex items-center gap-2">
              <select
                value={selectedLeadId}
                onChange={(e) => setLocalLeadId(e.target.value)}
                className="font-bold text-sm text-slate-900 border-none bg-transparent focus:outline-hidden cursor-pointer"
              >
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.id})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div>
            <span className="text-slate-400">Qualification: </span>
            <strong className="text-slate-800">{activeLead.academicBackground.qualification}</strong>
          </div>
          <div>
            <span className="text-slate-400">Recorded Score: </span>
            <strong className="font-mono text-emerald-700">{activeLead.academicBackground.percentageOrGpa}</strong>
          </div>
          <div>
            <span className="text-slate-400">Pref Campus: </span>
            <strong className="text-slate-800">{activeLead.preferredCampus}</strong>
          </div>
        </div>
      </div>

      {/* Courses Matching Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Curriculum Eligibility Matches</h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Level:</span>
            <select
              value={selectedDegree}
              onChange={(e) => setSelectedDegree(e.target.value)}
              className="px-2.5 py-1 text-xs border border-slate-200 rounded-md bg-slate-50 text-slate-700"
            >
              <option value="All">All Degrees</option>
              <option value="Undergraduate">Undergraduate (UG)</option>
              <option value="Postgraduate">Postgraduate (PG)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matchedCourses.map((crs) => {
            const isEligible = studentPct >= crs.minPercentage;

            return (
              <div
                key={crs.id}
                className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                        {crs.code}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1 leading-snug">
                        {crs.name}
                      </h4>
                    </div>

                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                        isEligible
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {isEligible ? 'Eligible' : 'Cutoff Strict'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">{crs.department} · {crs.duration}</p>

                  <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1.5 text-slate-600">
                    <div>
                      <strong className="text-slate-700">Eligibility Rule:</strong> {crs.eligibility}
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 font-mono text-[11px]">
                      <span>Annual Tuition: ₹{crs.annualFee.toLocaleString()}</span>
                      <span className="text-emerald-700 font-semibold">
                        {crs.seatsAvailable} seats available
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Campuses: {crs.campuses.length} locations
                  </span>
                  <button
                    onClick={() => handleAddRecommendationToProfile(crs.name)}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add to Student Profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { CourseRecommendationsPage as RecommendationsWidget };
export default CourseRecommendationsPage;
