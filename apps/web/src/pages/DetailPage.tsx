import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookmarkPlus,
  Check,
  Bell,
  Clock,
  ShieldCheck,
  Layers,
  Sparkles,
} from "lucide-react";
import { api, getActiveProfileId, type PlanItem, type ReminderSettings } from "../lib/api";

export const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const profileId = getActiveProfileId();

  // Fetch opportunity and computed match
  const {
    data: detail,
    isLoading: isOppLoading,
    isError: isOppError,
  } = useQuery({
    queryKey: ["opportunity", id, profileId],
    queryFn: () => api.getOpportunity(id!, profileId),
    enabled: !!id,
  });

  // Fetch saved plan items to see if this opportunity is already in plan
  const { data: planItems } = useQuery({
    queryKey: ["plan", profileId],
    queryFn: () => api.listPlanItems(profileId),
  });

  // Fetch reminder settings
  const { data: reminderSettings } = useQuery({
    queryKey: ["reminders", profileId],
    queryFn: () => api.getReminders(profileId),
  });

  // Local state for reminders toggle
  const [remindersOptedIn, setRemindersOptedIn] = useState(false);
  const [quietHoursStart, setQuietHoursStart] = useState("22:00");
  const [quietHoursEnd, setQuietHoursEnd] = useState("08:00");
  const [cadence, setCadence] = useState("per_deadline");
  const [reminderSavedToast, setReminderSavedToast] = useState(false);

  useEffect(() => {
    if (reminderSettings) {
      setRemindersOptedIn(reminderSettings.opted_in);
      setQuietHoursStart(reminderSettings.quiet_hours_start || "22:00");
      setQuietHoursEnd(reminderSettings.quiet_hours_end || "08:00");
      setCadence(reminderSettings.cadence || "per_deadline");
    }
  }, [reminderSettings]);

  // Existing plan item for this opportunity (if saved)
  const currentPlanItem = planItems?.find((p: PlanItem) => p.opportunity_id === id);

  // Save to plan mutation
  const savePlanMutation = useMutation({
    mutationFn: () => api.createPlanItem(id!, profileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan", profileId] });
    },
  });

  // Toggle step completion mutation
  const toggleStepMutation = useMutation({
    mutationFn: ({ planId, stepId, done }: { planId: string; stepId: string; done: boolean }) =>
      api.updatePlanItem(planId, { stepId, done }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan", profileId] });
    },
  });

  // Update reminders mutation
  const reminderMutation = useMutation({
    mutationFn: (updated: ReminderSettings) => api.upsertReminders(updated),
    onSuccess: (saved) => {
      setRemindersOptedIn(saved.opted_in);
      queryClient.invalidateQueries({ queryKey: ["reminders", profileId] });
      setReminderSavedToast(true);
      setTimeout(() => setReminderSavedToast(false), 3000);
    },
  });

  const handleReminderToggle = () => {
    const nextState = !remindersOptedIn;
    setRemindersOptedIn(nextState);
    reminderMutation.mutate({
      profile_id: profileId,
      opted_in: nextState,
      quiet_hours_start: quietHoursStart,
      quiet_hours_end: quietHoursEnd,
      cadence: cadence,
    });
  };

  const handleQuietHoursChange = (start: string, end: string, cad: string) => {
    setQuietHoursStart(start);
    setQuietHoursEnd(end);
    setCadence(cad);
    reminderMutation.mutate({
      profile_id: profileId,
      opted_in: remindersOptedIn,
      quiet_hours_start: start,
      quiet_hours_end: end,
      cadence: cad,
    });
  };

  if (isOppLoading) {
    return (
      <div className="py-20 text-center text-ink-subtle space-y-3">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <p className="text-sm font-medium">Computing transparent eligibility breakdown...</p>
      </div>
    );
  }

  if (isOppError || !detail) {
    return (
      <div className="p-8 rounded-xl bg-status-unmet-bg border border-status-unmet/20 text-center text-status-unmet max-w-lg mx-auto">
        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
        <h2 className="font-display font-bold text-lg">Opportunity Not Found</h2>
        <p className="text-xs text-ink-muted mt-1 mb-4">
          The requested opportunity could not be retrieved from the server.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const { opportunity: opp, match } = detail;
  const isSaved = !!currentPlanItem;

  const meetsList = match?.eligibility?.meets || [];
  const verifyList = match?.eligibility?.verify || [];
  const unmetList = match?.eligibility?.unmet || [];
  const matchReasonsList = match?.match_reasons || [];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Back Button & Breadcrumb */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-primary transition-colors py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Opportunities Catalog</span>
        </Link>
      </div>

      {/* Main Opportunity Hero Card */}
      <div className="bg-white rounded-xl border border-border p-6 sm:p-8 shadow-subtle space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded font-semibold bg-canvas text-ink-muted uppercase tracking-wider text-[11px]">
                {opp.category}
              </span>
              <span
                className={`text-xs px-3 py-0.5 rounded-full font-semibold border flex items-center gap-1 ${
                  match.fit_badge === "Looks eligible"
                    ? "bg-status-meets-bg text-status-meets border-status-meets/30"
                    : match.fit_badge === "Not eligible"
                    ? "bg-status-unmet-bg text-status-unmet border-status-unmet/30"
                    : "bg-status-verify-bg text-status-verify border-status-verify/30"
                }`}
              >
                {match.fit_badge === "Looks eligible" ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : match.fit_badge === "Not eligible" ? (
                  <AlertCircle className="w-3.5 h-3.5" />
                ) : (
                  <HelpCircle className="w-3.5 h-3.5" />
                )}
                <span>{match.fit_badge}</span>
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              {opp.title}
            </h1>
            <p className="text-sm text-ink-muted">{opp.theme}</p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-ink-muted pt-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-ink-subtle" />
                <span>{opp.is_remote ? "Online / Remote" : opp.location}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-ink-subtle" />
                <span>Application Deadline: <strong>{opp.deadline}</strong></span>
              </span>
              <span>·</span>
              <span>Cost: <strong>{opp.cost === 0 ? "Free Entry" : `₹${opp.cost}`}</strong></span>
            </div>
          </div>

          {/* Save to Plan Action Button */}
          <div className="shrink-0 flex sm:flex-col gap-2">
            <button
              type="button"
              disabled={isSaved || savePlanMutation.isPending}
              onClick={() => savePlanMutation.mutate()}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                isSaved
                  ? "bg-status-meets-bg text-status-meets border border-status-meets/30 shadow-none cursor-default"
                  : "bg-primary hover:bg-primary-hover text-white shadow-sm"
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved to Plan</span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-4 h-4" />
                  <span>{savePlanMutation.isPending ? "Saving..." : "Save to Plan"}</span>
                </>
              )}
            </button>

            {isSaved && (
              <Link
                to="/plan"
                className="text-xs text-center text-primary hover:underline font-medium py-1"
              >
                View in My Plan →
              </Link>
            )}
          </div>
        </div>

        {/* Source Link & Last Updated Trust Metadata */}
        <div className="pt-4 border-t border-border-subtle flex flex-wrap items-center justify-between text-xs text-ink-subtle gap-2">
          <div className="flex items-center gap-2">
            <span>Official Source Listing:</span>
            <a
              href={opp.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1 font-medium"
            >
              <span>{opp.source_url}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div>
            <span>Catalog verified at: {new Date(opp.last_updated).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Grid of 4 Structured Sections from Brief */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section 1: Why it Fits (Match Reasons) */}
        <div className="bg-white rounded-xl border border-border p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
            <Sparkles className="w-4 h-4 text-primary" />
            <h2 className="font-display font-bold text-lg text-ink">Why This Opportunity Fits</h2>
          </div>
          <p className="text-xs text-ink-subtle">
            Computed strictly against your active profile signals with zero hidden criteria or sponsored bias.
          </p>

          <div className="space-y-2.5">
            {matchReasonsList.map((reason: string, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-canvas border border-border-subtle flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-status-meets shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-ink leading-relaxed">{reason}</span>
              </div>
            ))}
          </div>

          <div className="pt-3">
            <span className="text-xs font-semibold text-ink-subtle uppercase tracking-wider block mb-2">
              Tagged Technical Skills
            </span>
            <div className="flex flex-wrap gap-1.5">
              {opp.skills_tags.map((skill: string) => (
                <span
                  key={skill}
                  className="text-xs px-2.5 py-1 rounded-md bg-canvas border border-border text-ink-muted"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Eligibility Check (3-Tier Trust Breakdown) */}
        <div className="bg-white rounded-xl border border-border p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <h2 className="font-display font-bold text-lg text-ink">Eligibility Checklist</h2>
            </div>
            <span className="text-xs text-ink-subtle italic">No false guarantees</span>
          </div>
          <p className="text-xs text-ink-subtle leading-relaxed">
            Clearly separates what is structurally confirmed from items requiring verification with the organizer or peer team.
          </p>

          <div className="space-y-4">
            {/* Confirmed Criteria (Meets) */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-status-meets uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirmed Requirements ({meetsList.length})</span>
              </div>
              {meetsList.length === 0 ? (
                <p className="text-xs text-ink-subtle italic pl-5">No explicit confirmed criteria recorded.</p>
              ) : (
                <div className="space-y-1.5 pl-5 border-l-2 border-status-meets/40">
                  {meetsList.map((m: string, i: number) => (
                    <div key={i} className="text-xs text-ink bg-status-meets-bg/60 p-2 rounded border border-status-meets/20">
                      {m}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Verify with Organizer */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-status-verify uppercase tracking-wider mb-2">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Verify with Organizer ({verifyList.length})</span>
              </div>
              {verifyList.length === 0 ? (
                <p className="text-xs text-ink-subtle italic pl-5">No items requiring external verification.</p>
              ) : (
                <div className="space-y-1.5 pl-5 border-l-2 border-status-verify/40">
                  {verifyList.map((v: string, i: number) => (
                    <div key={i} className="text-xs text-ink bg-status-verify-bg/70 p-2 rounded border border-status-verify/30">
                      {v}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Unmet Criteria (if any) */}
            {unmetList.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-status-unmet uppercase tracking-wider mb-2">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Unmet Criteria ({unmetList.length})</span>
                </div>
                <div className="space-y-1.5 pl-5 border-l-2 border-status-unmet/40">
                  {unmetList.map((u: string, i: number) => (
                    <div key={i} className="text-xs text-status-unmet bg-status-unmet-bg p-2 rounded border border-status-unmet/30">
                      {u}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Action Plan Checklist */}
        <div className="bg-white rounded-xl border border-border p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <h2 className="font-display font-bold text-lg text-ink">Action Plan Timeline</h2>
            </div>
            {isSaved && (
              <span className="text-xs font-semibold text-status-meets bg-status-meets-bg px-2.5 py-0.5 rounded-full border border-status-meets/30">
                Tracked in My Plan
              </span>
            )}
          </div>
          <p className="text-xs text-ink-subtle">
            Sensible preparation milestones calculated by backing off from the submission deadline.
          </p>

          <div className="space-y-2.5">
            {(currentPlanItem?.steps || [
              { id: "preview-1", label: "Read official guidelines and verify checklist items with organizer", done: false, due_date: "T-7 days" },
              { id: "preview-2", label: opp.category === "hackathon" ? "Form or confirm team members (2–4 students)" : "Prepare project demo repositories & resume", done: false, due_date: "T-5 days" },
              { id: "preview-3", label: "Complete draft submission and execute dry-run of all links", done: false, due_date: "T-2 days" },
              { id: "preview-4", label: `Submit final application for '${opp.title}' before cutoff`, done: false, due_date: opp.deadline },
            ]).map((step, idx) => (
              <div
                key={step.id || idx}
                className={`p-3 rounded-lg border transition-all flex items-start gap-3 ${
                  step.done ? "bg-status-meets-bg/30 border-status-meets/30" : "bg-canvas border-border-subtle"
                }`}
              >
                {currentPlanItem ? (
                  <input
                    type="checkbox"
                    checked={step.done}
                    onChange={(e) =>
                      toggleStepMutation.mutate({
                        planId: currentPlanItem.id,
                        stepId: step.id,
                        done: e.target.checked,
                      })
                    }
                    className="w-4 h-4 mt-0.5 rounded text-primary focus:ring-primary border-border cursor-pointer"
                  />
                ) : (
                  <span className="w-5 h-5 rounded-full bg-border text-ink-muted text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                )}

                <div className="flex-1">
                  <p className={`text-xs sm:text-sm font-medium ${step.done ? "line-through text-ink-subtle" : "text-ink"}`}>
                    {step.label}
                  </p>
                  <span className="text-[11px] text-ink-subtle font-medium block mt-0.5">
                    Target Due Date: {step.due_date}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {!isSaved && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => savePlanMutation.mutate()}
                className="text-xs px-4 py-2 rounded-lg bg-canvas hover:bg-border text-ink font-semibold border border-border inline-flex items-center gap-1.5 transition-colors"
              >
                <BookmarkPlus className="w-3.5 h-3.5 text-primary" />
                <span>Save opportunity to activate interactive checkboxes</span>
              </button>
            </div>
          )}
        </div>

        {/* Section 4: Smart Nudges (Opt-in Reminders) */}
        <div className="bg-white rounded-xl border border-border p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <h2 className="font-display font-bold text-lg text-ink">Smart Nudges & Reminders</h2>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-canvas text-ink-muted">
              Stage 05: Remind
            </span>
          </div>

          <p className="text-xs text-ink-subtle">
            Opt-in deadline notifications respecting your quiet hours. Defaults to off; one-tap instant opt-out anytime.
          </p>

          {/* Opt-in Toggle */}
          <div className="p-4 rounded-lg bg-canvas border border-border-subtle flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-ink block">
                Enable Preparation Reminders
              </span>
              <span className="text-xs text-ink-muted">
                {remindersOptedIn ? "Active: You will receive nudges before key step due dates." : "Disabled: No notifications will be dispatched."}
              </span>
            </div>

            <button
              type="button"
              onClick={handleReminderToggle}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
                remindersOptedIn ? "bg-status-meets" : "bg-border"
              }`}
              role="switch"
              aria-checked={remindersOptedIn}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  remindersOptedIn ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Quiet Hours & Cadence Settings */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>Quiet Hours Protection</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-ink-subtle mb-1">Do Not Disturb From:</label>
                <input
                  type="text"
                  value={quietHoursStart}
                  onChange={(e) => handleQuietHoursChange(e.target.value, quietHoursEnd, cadence)}
                  placeholder="22:00"
                  className="w-full px-3 py-1.5 rounded border border-border bg-surface text-xs font-medium text-ink focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-ink-subtle mb-1">Resume Alerts At:</label>
                <input
                  type="text"
                  value={quietHoursEnd}
                  onChange={(e) => handleQuietHoursChange(quietHoursStart, e.target.value, cadence)}
                  placeholder="08:00"
                  className="w-full px-3 py-1.5 rounded border border-border bg-surface text-xs font-medium text-ink focus:border-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-ink-subtle mb-1">Alert Cadence:</label>
              <select
                value={cadence}
                onChange={(e) => handleQuietHoursChange(quietHoursStart, quietHoursEnd, e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-border bg-surface text-xs font-medium text-ink focus:border-primary outline-none"
              >
                <option value="per_deadline">Per Deadline (3 days before each step)</option>
                <option value="daily">Daily digest during active runway</option>
                <option value="weekly">Weekly opportunity summary</option>
              </select>
            </div>

            {reminderSavedToast && (
              <div className="p-2.5 rounded bg-status-meets-bg text-status-meets text-xs font-semibold text-center border border-status-meets/30 animate-fadeIn">
                Notification preferences updated.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
