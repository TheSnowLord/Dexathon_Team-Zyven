import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
  api,
  getActiveProfileId,
  setActiveProfileId,
  clearActiveProfileId,
  type Profile,
  type ReminderSettings,
} from "../lib/api";
import {
  ShieldAlert,
  Bell,
  User,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Database,
  Moon,
  Info,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";

export const SettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const profileId = getActiveProfileId();

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletionSuccess, setDeletionSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states for Reminders
  const [optedIn, setOptedIn] = useState(false);
  const [quietHoursStart, setQuietHoursStart] = useState("22:00");
  const [quietHoursEnd, setQuietHoursEnd] = useState("08:00");
  const [cadence, setCadence] = useState("T-7d, T-3d, T-1d, T-6h");

  // Query Profile
  const { data: profile, isLoading: isProfileLoading } = useQuery<Profile>({
    queryKey: ["profile", profileId],
    queryFn: () => api.getProfile(profileId),
  });

  // Query Reminders
  const { data: remindersData, isLoading: isRemindersLoading } = useQuery<ReminderSettings>({
    queryKey: ["reminders", profileId],
    queryFn: () => api.getReminders(profileId),
  });

  useEffect(() => {
    if (remindersData) {
      setOptedIn(remindersData.opted_in);
      setQuietHoursStart(remindersData.quiet_hours_start || "22:00");
      setQuietHoursEnd(remindersData.quiet_hours_end || "08:00");
      setCadence(remindersData.cadence || "T-7d, T-3d, T-1d, T-6h");
    }
  }, [remindersData]);

  // Update Reminders Mutation
  const updateRemindersMutation = useMutation({
    mutationFn: (newSettings: ReminderSettings) => api.upsertReminders(newSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders", profileId] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
    onError: (err: any) => {
      setErrorMessage(err.message || "Failed to update notification preferences.");
    },
  });

  // Delete Profile Mutation (True Data Deletion Guardrail)
  const deleteProfileMutation = useMutation({
    mutationFn: () => api.deleteProfile(profileId),
    onSuccess: () => {
      clearActiveProfileId();
      queryClient.clear();
      setDeletionSuccess(true);
      setDeleteConfirmOpen(false);
    },
    onError: (err: any) => {
      setErrorMessage(err.message || "Failed to delete student profile.");
      setDeleteConfirmOpen(false);
    },
  });

  const handleSaveReminders = (e: React.FormEvent) => {
    e.preventDefault();
    updateRemindersMutation.mutate({
      profile_id: profileId,
      opted_in: optedIn,
      quiet_hours_start: quietHoursStart,
      quiet_hours_end: quietHoursEnd,
      cadence,
    });
  };

  const handleRestoreDemoProfile = () => {
    setActiveProfileId("demo-student-zyven");
    queryClient.invalidateQueries();
    setDeletionSuccess(false);
    navigate(0); // Reload current page
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Page Header */}
      <div className="border-b border-border pb-5">
        <h1 className="font-display text-3xl font-bold text-ink tracking-tight flex items-center gap-3">
          <Database className="w-8 h-8 text-primary" />
          <span>Settings & Student Privacy</span>
        </h1>
        <p className="text-ink-muted text-sm mt-1">
          Complete control over your academic signals, anti-spam quiet hours, and permanent data deletion.
        </p>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-status-unmet-bg border border-status-unmet/30 text-status-unmet flex items-center gap-3 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span className="flex-1 font-medium">{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-xs underline hover:no-underline font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Deletion Success Banner */}
      {deletionSuccess && (
        <div className="p-6 rounded-2xl bg-status-meets-bg border border-status-meets/40 text-ink space-y-4 shadow-subtle">
          <div className="flex items-center gap-3 text-status-meets font-semibold text-lg">
            <CheckCircle2 className="w-6 h-6" />
            <span>All Your Data Has Been Completely and Permanently Erased</span>
          </div>
          <p className="text-xs sm:text-sm text-ink-muted">
            The profile <code className="px-1.5 py-0.5 rounded bg-white font-mono text-xs">{profileId}</code> and all associated plan items, milestone steps, and reminder configurations have been cascade-purged from SQLite database.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleRestoreDemoProfile}
              className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors flex items-center gap-2 shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restore Demo Student Profile</span>
            </button>
            <Link
              to="/profile"
              className="px-4 py-2 rounded-lg bg-white border border-border text-ink text-xs font-semibold hover:bg-canvas transition-colors"
            >
              Create New Empty Profile
            </Link>
          </div>
        </div>
      )}

      {/* Section 1: Active Profile & Signal Summary */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-subtle space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-canvas flex items-center justify-center text-primary border border-border-subtle">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-ink">Active Student Profile</h2>
              <p className="text-xs text-ink-subtle">
                ID: <span className="font-mono text-ink font-semibold">{profileId}</span>
              </p>
            </div>
          </div>

          <Link
            to="/profile"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-canvas hover:bg-surface text-primary border border-border flex items-center gap-1.5 transition-colors"
          >
            <span>Edit Signals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isProfileLoading ? (
          <div className="text-xs text-ink-subtle py-2">Loading profile details...</div>
        ) : profile ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-canvas border border-border-subtle text-xs">
            <div>
              <span className="text-ink-subtle block font-medium">Branch</span>
              <span className="font-semibold text-ink text-sm">{profile.branch}</span>
            </div>
            <div>
              <span className="text-ink-subtle block font-medium">Year of Study</span>
              <span className="font-semibold text-ink text-sm">Year {profile.year}</span>
            </div>
            <div>
              <span className="text-ink-subtle block font-medium">Max Fee Cap</span>
              <span className="font-semibold text-ink text-sm">
                {profile.budget_cap !== null && profile.budget_cap !== undefined
                  ? `₹${profile.budget_cap}`
                  : "No Limit"}
              </span>
            </div>
            <div>
              <span className="text-ink-subtle block font-medium">Remote Only</span>
              <span className="font-semibold text-ink text-sm">
                {profile.remote_ok ? "Yes" : "Open to In-Person"}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-4 pt-2 border-t border-border-subtle">
              <span className="text-ink-subtle block font-medium mb-1.5">Registered Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded bg-white text-ink text-[11px] font-medium border border-border-subtle"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-ink-subtle italic">No skills added yet</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-canvas text-xs text-ink-muted">
            No profile currently found in database for ID: <strong>{profileId}</strong>.
          </div>
        )}
      </div>

      {/* Section 2: Smart Nudges & Anti-Spam Quiet Hours */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-subtle space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-canvas flex items-center justify-center text-primary border border-border-subtle">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-ink">Smart Nudges & Quiet Hours</h2>
              <p className="text-xs text-ink-subtle">
                Deadline alert preferences designed to respect student rest and focus.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-ink-muted">
              {optedIn ? "Opted In" : "Default OFF"}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={optedIn}
              onClick={() => setOptedIn(!optedIn)}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                optedIn ? "bg-primary" : "bg-border"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  optedIn ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Explainability Callout */}
        <div className="p-3.5 rounded-xl bg-canvas border border-border-subtle flex items-start gap-2.5 text-xs text-ink-muted">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <span>
            <strong>Anti-spam guarantee:</strong> We never blast promotional newsletters. Smart Nudges only alert you when critical milestone deadlines approach for opportunities you actively save to your plan.
          </span>
        </div>

        <form onSubmit={handleSaveReminders} className="space-y-5">
          {/* Cadence Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink block uppercase tracking-wider">
              Alert Cadence Schedule
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: "T-7d, T-3d, T-1d, T-6h",
                  title: "Standard Back-off",
                  desc: "T-7 days, T-3 days, T-24h, T-6 hours",
                },
                {
                  id: "T-3d, T-1d",
                  title: "Moderate",
                  desc: "T-3 days and T-24 hours before deadline",
                },
                {
                  id: "T-1d",
                  title: "Minimalist",
                  desc: "Single alert 24 hours prior only",
                },
              ].map((tier) => (
                <button
                  type="button"
                  key={tier.id}
                  onClick={() => setCadence(tier.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    cadence === tier.id
                      ? "border-primary bg-primary/5 text-ink ring-1 ring-primary"
                      : "border-border-subtle bg-white hover:border-border text-ink-muted"
                  }`}
                >
                  <div className="font-semibold text-xs text-ink">{tier.title}</div>
                  <div className="text-[11px] text-ink-subtle mt-0.5">{tier.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quiet Hours Window */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink uppercase tracking-wider">
              <Moon className="w-3.5 h-3.5 text-primary" />
              <span>Quiet Hours Protection Window</span>
            </div>
            <p className="text-xs text-ink-subtle">
              Notifications arriving between these hours are automatically queued and held until your waking window to protect sleep.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-ink-muted font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3 text-ink-subtle" />
                  <span>Quiet Period Begins</span>
                </label>
                <input
                  type="time"
                  value={quietHoursStart}
                  onChange={(e) => setQuietHoursStart(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-white text-ink text-xs font-medium focus:border-primary outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-ink-muted font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3 text-ink-subtle" />
                  <span>Quiet Period Ends</span>
                </label>
                <input
                  type="time"
                  value={quietHoursEnd}
                  onChange={(e) => setQuietHoursEnd(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-white text-ink text-xs font-medium focus:border-primary outline-none"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
            <span className="text-xs text-ink-subtle">
              Changes apply instantly to your active profile session.
            </span>
            <button
              type="submit"
              disabled={updateRemindersMutation.isPending || isRemindersLoading}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                saveSuccess
                  ? "bg-status-meets-bg text-status-meets border border-status-meets/30"
                  : "bg-primary hover:bg-primary-hover text-white shadow-sm"
              }`}
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Preferences Saved</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Save Notification Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Section 3: Student Data Sovereignty & Danger Zone (True Data Deletion Guardrails) */}
      <div className="bg-white rounded-2xl border-2 border-status-unmet/30 p-6 shadow-subtle space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-status-unmet-bg flex items-center justify-center text-status-unmet">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-ink">
              Data Sovereignty & Permanent Erasure
            </h2>
            <p className="text-xs text-ink-subtle">
              True deletion guardrail conforming to strict student privacy principles.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-status-unmet-bg/40 border border-status-unmet/20 text-xs text-ink space-y-2">
          <p className="font-semibold text-status-unmet">Permanent Database Cascade Purge:</p>
          <p className="text-ink-muted leading-relaxed">
            When you click &ldquo;Delete All My Data&rdquo;, our backend executes an atomic cascade deletion.
            Your profile signals, every saved opportunity milestone in your plan, and all notification
            schedules are irreversibly purged from SQLite. No orphaned records remain.
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-ink-subtle">
            Active ID: <span className="font-mono text-ink font-medium">{profileId}</span>
          </div>

          <button
            type="button"
            onClick={() => setDeleteConfirmOpen(true)}
            className="px-4 py-2 rounded-lg bg-status-unmet text-white text-xs font-semibold hover:bg-status-unmet/90 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete All My Data</span>
          </button>
        </div>
      </div>

      {/* Deletion Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full border border-border p-6 shadow-card space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-status-unmet">
              <div className="w-10 h-10 rounded-xl bg-status-unmet-bg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-ink">
                Confirm Permanent Deletion?
              </h3>
            </div>

            <p className="text-xs text-ink-muted leading-relaxed">
              Are you sure you want to delete profile <strong className="font-mono text-ink">{profileId}</strong>?
              This will permanently remove:
            </p>

            <ul className="text-xs text-ink-muted space-y-1.5 list-disc pl-5">
              <li>Your branch, year, skills, and budget cap preferences.</li>
              <li>All opportunities saved to your preparation plan.</li>
              <li>All back-off milestones and check-off progress.</li>
              <li>Your reminder preferences and quiet hours schedule.</li>
            </ul>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-subtle">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-2 rounded-lg border border-border text-xs font-semibold text-ink hover:bg-canvas transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteProfileMutation.mutate()}
                disabled={deleteProfileMutation.isPending}
                className="px-4 py-2 rounded-lg bg-status-unmet text-white text-xs font-semibold hover:bg-status-unmet/90 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                {deleteProfileMutation.isPending ? (
                  <span>Deleting...</span>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Yes, Permanently Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
