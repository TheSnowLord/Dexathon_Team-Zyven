import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Download,
  Trash2,
  Layers,
  ArrowRight,
  Clock,
  MapPin,
  Check,
} from "lucide-react";
import { api, getActiveProfileId, type PlanItem, type PlanStep } from "../lib/api";

export const PlanPage: React.FC = () => {
  const queryClient = useQueryClient();
  const profileId = getActiveProfileId();
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  // Fetch all saved plan items for this profile
  const { data: planItems, isLoading, isError } = useQuery({
    queryKey: ["plan", profileId],
    queryFn: () => api.listPlanItems(profileId),
  });

  // Toggle step mutation
  const toggleStepMutation = useMutation({
    mutationFn: ({ planId, stepId, done }: { planId: string; stepId: string; done: boolean }) =>
      api.updatePlanItem(planId, { stepId, done }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan", profileId] });
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ planId, status }: { planId: string; status: string }) =>
      api.updatePlanItem(planId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan", profileId] });
    },
  });

  // Delete plan item mutation
  const deletePlanMutation = useMutation({
    mutationFn: (planId: string) => api.deletePlanItem(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan", profileId] });
    },
  });

  const handleDownloadICS = (planId: string, title: string) => {
    const url = api.getPlanICSUrl(planId);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `plan-${title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccessId(planId);
    setTimeout(() => setDownloadSuccessId(null), 3000);
  };

  // Compute metrics
  const totalItems = planItems?.length || 0;
  let totalSteps = 0;
  let completedSteps = 0;

  planItems?.forEach((item: PlanItem) => {
    item.steps.forEach((s: PlanStep) => {
      totalSteps++;
      if (s.done) completedSteps++;
    });
  });

  const overallPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-border p-6 sm:p-8 shadow-subtle">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-subtle text-primary text-xs font-semibold mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>Stage 04: Action Plan & Milestones</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-2">
              My Opportunity Plan & Timeline
            </h1>
            <p className="text-ink-muted text-sm sm:text-base leading-relaxed">
              Every saved opportunity converts into concrete preparation steps with deadline back-offs. Check off tasks as you finish them or export deadlines directly to Apple Calendar, Google Calendar, or Outlook (.ics).
            </p>
          </div>

          {/* Metric Tiles */}
          <div className="flex sm:grid sm:grid-cols-2 gap-3 shrink-0">
            <div className="p-4 rounded-lg bg-canvas border border-border-subtle text-center min-w-[130px]">
              <span className="block font-display text-2xl font-bold text-primary">
                {totalItems}
              </span>
              <span className="text-xs text-ink-muted font-medium">Saved Targets</span>
            </div>
            <div className="p-4 rounded-lg bg-canvas border border-border-subtle text-center min-w-[130px]">
              <span className="block font-display text-2xl font-bold text-status-meets">
                {overallPercent}%
              </span>
              <span className="text-xs text-ink-muted font-medium">
                {completedSteps} / {totalSteps} Tasks Done
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Items List */}
      {isLoading ? (
        <div className="py-16 text-center text-ink-subtle space-y-3">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-sm">Loading your opportunity plans...</p>
        </div>
      ) : isError ? (
        <div className="p-6 rounded-xl bg-status-unmet-bg border border-status-unmet/20 text-center text-status-unmet">
          <p className="text-sm font-semibold">Unable to fetch plan items from the API server.</p>
        </div>
      ) : totalItems === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center max-w-lg mx-auto space-y-4 shadow-subtle">
          <div className="w-12 h-12 rounded-full bg-canvas flex items-center justify-center mx-auto text-ink-subtle">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-ink">No Saved Opportunities Yet</h3>
            <p className="text-xs text-ink-muted mt-1 leading-relaxed">
              Browse the catalog and click <strong>"Save to plan"</strong> on hackathons, internships, or workshops that fit your goals to generate milestone checklists here.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-colors"
          >
            <span>Explore Opportunities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {planItems?.map((item: PlanItem) => {
            const opp = item.opportunity;
            const completedCount = item.steps.filter((s) => s.done).length;
            const itemPercent = Math.round((completedCount / item.steps.length) * 100);

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-border p-6 shadow-subtle space-y-5 transition-all hover:border-primary/40"
              >
                {/* Header Row: Title, Category, Status & ICS Action */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-canvas text-ink-muted uppercase tracking-wider">
                        {opp?.category || "Opportunity"}
                      </span>
                      <span className="text-xs text-ink-subtle font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Deadline: <strong>{opp?.deadline}</strong></span>
                      </span>
                    </div>

                    <h2 className="font-display text-xl font-bold text-ink">
                      {opp?.title}
                    </h2>
                    <p className="text-xs text-ink-subtle">{opp?.theme}</p>
                  </div>

                  {/* Actions: Download Calendar & Status Selector */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Status Dropdown */}
                    <select
                      value={item.status}
                      onChange={(e) =>
                        updateStatusMutation.mutate({ planId: item.id, status: e.target.value })
                      }
                      className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border bg-canvas text-ink focus:border-primary outline-none"
                    >
                      <option value="saved">Status: Saved</option>
                      <option value="in_progress">Status: In Progress</option>
                      <option value="done">Status: Completed</option>
                      <option value="dropped">Status: Dropped</option>
                    </select>

                    {/* Download ICS Button */}
                    <button
                      type="button"
                      onClick={() => handleDownloadICS(item.id, opp?.title || "opportunity")}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold border flex items-center gap-1.5 transition-colors ${
                        downloadSuccessId === item.id
                          ? "bg-status-meets-bg text-status-meets border-status-meets/30"
                          : "bg-surface hover:bg-canvas text-primary border-border"
                      }`}
                      title="Download calendar (.ics) file"
                    >
                      {downloadSuccessId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Downloaded</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Calendar (.ics)</span>
                        </>
                      )}
                    </button>

                    {/* Remove Action */}
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Remove this opportunity and its steps from your plan?")) {
                          deletePlanMutation.mutate(item.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-ink-subtle hover:text-status-unmet hover:bg-status-unmet-bg transition-colors"
                      title="Remove from plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-ink-muted">
                    <span className="font-medium">
                      Progress: {completedCount} of {item.steps.length} milestones complete
                    </span>
                    <span className="font-semibold text-primary">{itemPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-canvas border border-border-subtle overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${itemPercent}%` }}
                    />
                  </div>
                </div>

                {/* Step Checklist */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold text-ink-subtle uppercase tracking-wider block">
                    Preparation Milestones
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {item.steps.map((step: PlanStep) => (
                      <label
                        key={step.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                          step.done
                            ? "bg-status-meets-bg/25 border-status-meets/30 text-ink-muted"
                            : "bg-canvas border-border-subtle hover:bg-white text-ink"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={step.done}
                          onChange={(e) =>
                            toggleStepMutation.mutate({
                              planId: item.id,
                              stepId: step.id,
                              done: e.target.checked,
                            })
                          }
                          className="w-4 h-4 mt-0.5 rounded text-primary focus:ring-primary border-border cursor-pointer shrink-0"
                        />
                        <div className="flex-1 text-xs sm:text-sm">
                          <span className={`font-medium ${step.done ? "line-through text-ink-subtle" : "text-ink"}`}>
                            {step.label}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-ink-subtle shrink-0 px-2 py-0.5 rounded bg-white border border-border-subtle">
                          Due: {step.due_date}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Detail Link */}
                {opp && (
                  <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-ink-subtle">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{opp.is_remote ? "Online / Virtual" : opp.location}</span>
                    </div>

                    <Link
                      to={`/opportunity/${opp.id}`}
                      className="text-primary hover:underline font-semibold inline-flex items-center gap-1"
                    >
                      <span>Review Eligibility & Fit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
