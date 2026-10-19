import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  User,
  GraduationCap,
  Sparkles,
  MapPin,
  Globe,
  IndianRupee,
  CheckCircle2,
  X,
  Plus,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { api, getActiveProfileId, setActiveProfileId, type Profile } from "../lib/api";

const PRESET_BRANCHES = [
  "Computer Science & Engineering",
  "Information Technology",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Robotics & Automation",
  "Mathematics & Computing",
  "Chemical Engineering",
  "Civil Engineering",
];

const SUGGESTED_SKILLS = [
  "Python",
  "AI",
  "Machine Learning",
  "React",
  "FastAPI",
  "Go",
  "Docker",
  "Kubernetes",
  "C++",
  "Figma",
  "Linux",
  "ROS",
  "Git",
  "Algorithms",
];

export const ProfilePage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const profileId = getActiveProfileId();

  const { data: profile } = useQuery({
    queryKey: ["profile", profileId],
    queryFn: () => api.getProfile(profileId),
  });

  const [branch, setBranch] = useState("Computer Science & Engineering");
  const [year, setYear] = useState<number>(2);
  const [skills, setSkills] = useState<string[]>(["Python", "AI", "Machine Learning", "React", "Git"]);
  const [customSkill, setCustomSkill] = useState("");
  const [location, setLocation] = useState("Maharashtra");
  const [remoteOk, setRemoteOk] = useState(true);
  const [hasBudgetCap, setHasBudgetCap] = useState(true);
  const [budgetCap, setBudgetCap] = useState<number>(500);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state when profile loads
  useEffect(() => {
    if (profile) {
      setBranch(profile.branch || "Computer Science & Engineering");
      setYear(profile.year || 2);
      setSkills(profile.skills || []);
      setLocation(profile.location || "");
      setRemoteOk(profile.remote_ok ?? true);
      if (profile.budget_cap !== null && profile.budget_cap !== undefined) {
        setHasBudgetCap(true);
        setBudgetCap(profile.budget_cap);
      } else {
        setHasBudgetCap(false);
      }
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: (data: Partial<Profile>) => api.upsertProfile(data),
    onSuccess: (saved) => {
      setActiveProfileId(saved.id);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
      queryClient.invalidateQueries({ queryKey: ["plan"] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    },
  });

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setCustomSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      id: profileId,
      branch,
      year,
      skills,
      location,
      remote_ok: remoteOk,
      budget_cap: hasBudgetCap ? Number(budgetCap) : null,
    });
  };

  const applyPreset = (presetType: "cse2" | "it3" | "firstyear") => {
    if (presetType === "cse2") {
      setBranch("Computer Science & Engineering");
      setYear(2);
      setSkills(["Python", "AI", "Machine Learning", "FastAPI", "React", "Git"]);
      setLocation("Maharashtra");
      setRemoteOk(true);
      setHasBudgetCap(true);
      setBudgetCap(500);
    } else if (presetType === "it3") {
      setBranch("Information Technology");
      setYear(3);
      setSkills(["Go", "Docker", "Kubernetes", "Linux", "Cloud Architecture"]);
      setLocation("Online");
      setRemoteOk(true);
      setHasBudgetCap(false);
    } else {
      setBranch("Electronics & Communication");
      setYear(1);
      setSkills(["C++", "Algorithms", "Git", "Hardware"]);
      setLocation("Bengaluru, Karnataka");
      setRemoteOk(false);
      setHasBudgetCap(true);
      setBudgetCap(1000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-border p-6 sm:p-8 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-subtle text-primary text-xs font-semibold mb-2">
              <User className="w-3.5 h-3.5" />
              <span>Stage 02: Profile Configuration</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              Build Your Student Profile
            </h1>
            <p className="text-ink-muted text-sm mt-1 max-w-xl leading-relaxed">
              These lightweight preferences drive transparent match reasons and eligibility checks across all opportunities. Never shared with third parties.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-col gap-2 shrink-0">
            <span className="text-xs font-semibold text-ink-subtle uppercase tracking-wider">
              Sample Presets
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset("cse2")}
                className="text-xs px-2.5 py-1 rounded border border-border bg-canvas hover:bg-white text-ink transition-colors"
              >
                2nd Yr CSE
              </button>
              <button
                type="button"
                onClick={() => applyPreset("it3")}
                className="text-xs px-2.5 py-1 rounded border border-border bg-canvas hover:bg-white text-ink transition-colors"
              >
                3rd Yr IT
              </button>
              <button
                type="button"
                onClick={() => applyPreset("firstyear")}
                className="text-xs px-2.5 py-1 rounded border border-border bg-canvas hover:bg-white text-ink transition-colors"
              >
                1st Yr ECE
              </button>
            </div>
          </div>
        </div>

        {saveSuccess && (
          <div className="mt-6 p-4 rounded-lg bg-status-meets-bg border border-status-meets/30 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2.5 text-sm font-medium text-status-meets">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Profile preferences saved. Match reasons have been updated for all opportunities.</span>
            </div>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-status-meets underline hover:opacity-80"
            >
              <span>View Matches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-6 sm:p-8 shadow-subtle space-y-6">
        {/* Branch & Year Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-ink uppercase tracking-wider mb-2">
              <GraduationCap className="w-4 h-4 text-primary" />
              <span>Academic Branch</span>
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-ink text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            >
              {PRESET_BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <p className="text-xs text-ink-subtle mt-1.5">
              Used to match branch-restricted opportunities like engineering hackathons.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-2">
              Undergraduate Study Year
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setYear(yr)}
                  className={`py-2 text-sm font-semibold rounded-lg border transition-all ${
                    year === yr
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-surface border-border text-ink-muted hover:border-primary/40 hover:text-ink"
                  }`}
                >
                  Year {yr}
                </button>
              ))}
            </div>
            <p className="text-xs text-ink-subtle mt-1.5">
              Matches year eligibility brackets (e.g. internships requiring Year 2+).
            </p>
          </div>
        </div>

        {/* Skills & Competencies */}
        <div className="pt-4 border-t border-border-subtle">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-ink uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Skills & Technical Interests</span>
          </label>
          <p className="text-xs text-ink-subtle mb-3">
            Select or enter the tools and topics you want to practice. The matching engine computes overlap count and names specific shared skills.
          </p>

          {/* Active Skill Tags */}
          <div className="flex flex-wrap gap-2 mb-3 min-h-[38px] p-2 rounded-lg bg-canvas border border-border-subtle">
            {skills.length === 0 ? (
              <span className="text-xs text-ink-subtle italic py-1">No skills selected yet. Add some below.</span>
            ) : (
              skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white border border-border text-ink shadow-sm"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-status-unmet transition-colors"
                    aria-label={`Remove skill ${skill}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Add Custom Skill Input */}
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              placeholder="Type custom skill (e.g. Next.js, Rust, Solidity)..."
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill(customSkill);
                }
              }}
              className="flex-1 px-3.5 py-2 rounded-lg border border-border bg-surface text-ink text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
            <button
              type="button"
              onClick={() => handleAddSkill(customSkill)}
              className="px-4 py-2 rounded-lg bg-canvas hover:bg-border text-ink text-xs font-semibold border border-border transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Suggested Skill Pills */}
          <div className="space-y-1.5">
            <span className="text-xs text-ink-subtle font-medium">Quick suggestions:</span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleAddSkill(suggestion)}
                  className="text-xs px-2.5 py-1 rounded-md border border-dashed border-border bg-white text-ink-muted hover:border-primary hover:text-primary transition-colors"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Location & Remote Preferences */}
        <div className="pt-4 border-t border-border-subtle grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-ink uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Base Location / State</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Maharashtra, Bengaluru, Delhi NCR"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-surface text-ink text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-ink uppercase tracking-wider mb-2">
              <Globe className="w-4 h-4 text-primary" />
              <span>Remote / Virtual Opportunities</span>
            </label>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRemoteOk(!remoteOk)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
                  remoteOk ? "bg-primary" : "bg-border"
                }`}
                role="switch"
                aria-checked={remoteOk}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    remoteOk ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-sm text-ink font-medium">
                {remoteOk ? "Include remote and online events (Recommended)" : "In-person opportunities only"}
              </span>
            </div>
          </div>
        </div>

        {/* Budget Cap */}
        <div className="pt-4 border-t border-border-subtle">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-ink uppercase tracking-wider mb-2">
            <IndianRupee className="w-4 h-4 text-primary" />
            <span>Registration Fee Budget Cap</span>
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="budgetToggle"
                checked={!hasBudgetCap}
                onChange={(e) => setHasBudgetCap(!e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-border cursor-pointer"
              />
              <label htmlFor="budgetToggle" className="text-sm text-ink cursor-pointer">
                No budget cap (Show free and paid opportunities)
              </label>
            </div>

            {hasBudgetCap && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-ink-muted font-medium">Max justified fee: ₹</span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={budgetCap}
                  onChange={(e) => setBudgetCap(Number(e.target.value))}
                  className="w-28 px-3 py-1.5 rounded-lg border border-border bg-surface text-ink text-sm font-semibold focus:border-primary outline-none"
                />
              </div>
            )}
          </div>
          <p className="text-xs text-ink-subtle mt-1.5">
            Opportunities with registration fees above this threshold will be flagged as exceeding your budget.
          </p>
        </div>

        {/* Submit Actions */}
        <div className="pt-6 border-t border-border flex items-center justify-between">
          <div className="text-xs text-ink-subtle flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-status-meets" />
            <span>Changes immediately recalibrate fit ratings.</span>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-sm transition-all duration-200 disabled:opacity-50"
          >
            {mutation.isPending ? "Saving Profile..." : "Save Profile & Update Matches"}
          </button>
        </div>
      </form>
    </div>
  );
};
