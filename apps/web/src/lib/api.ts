export interface EligibilityCriterion {
  criterion: string;
  verifiable: boolean;
  type?: string;
}

export interface Profile {
  id: string;
  branch: string;
  year: number;
  skills: string[];
  location: string;
  remote_ok: boolean;
  budget_cap: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  theme: string;
  category: "hackathon" | "internship" | "competition" | "workshop";
  branches: string[];
  min_year: number;
  max_year: number;
  skills_tags: string[];
  location: string;
  is_remote: boolean;
  cost: number;
  deadline: string;
  source_url: string;
  last_updated: string;
  eligibility_raw: EligibilityCriterion[];
}

export interface MatchResult {
  opportunity_id: string;
  match_reasons: string[];
  eligibility: {
    meets: string[];
    verify: string[];
    unmet: string[];
  };
  fit_badge: string;
  score_percent: number;
}

export interface OpportunityWithMatch extends Opportunity {
  match: MatchResult;
}

export interface PlanStep {
  id: string;
  label: string;
  done: boolean;
  due_date: string;
}

export interface PlanItem {
  id: string;
  profile_id: string;
  opportunity_id: string;
  steps: PlanStep[];
  status: "saved" | "in_progress" | "done" | "dropped";
  created_at?: string;
  opportunity?: Opportunity;
}

export interface ReminderSettings {
  profile_id: string;
  opted_in: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  cadence: string;
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

const PROFILE_KEY = "ace_compass_profile_id";

export function getActiveProfileId(): string {
  const stored = localStorage.getItem(PROFILE_KEY);
  if (stored) return stored;
  // Default to the pre-seeded demo profile so everything is instantly demoable
  const defaultId = "demo-student-zyven";
  localStorage.setItem(PROFILE_KEY, defaultId);
  return defaultId;
}

export function setActiveProfileId(id: string): void {
  localStorage.setItem(PROFILE_KEY, id);
}

export function clearActiveProfileId(): void {
  localStorage.removeItem(PROFILE_KEY);
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Profile-ID": getActiveProfileId(),
      ...options?.headers,
    },
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body?.error?.message || `HTTP error ${res.status}`);
  }
  return body.data as T;
}

export const api = {
  getHealth: () => request<{ status: string; service: string; version: string }>("/api/v1/health"),
  
  getProfile: (id: string) => request<Profile>(`/api/v1/profiles/${id}`),
  
  upsertProfile: (profile: Partial<Profile>) =>
    request<Profile>("/api/v1/profiles", {
      method: "POST",
      body: JSON.stringify(profile),
    }),
    
  deleteProfile: (id: string) =>
    request<{ deleted: boolean; profile_id: string }>(`/api/v1/profiles/${id}`, {
      method: "DELETE",
    }),

  listOpportunities: (params?: {
    branch?: string;
    year?: string;
    skill?: string;
    location?: string;
    remote?: boolean;
    maxCost?: string;
    category?: string;
    profileId?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.branch) query.set("branch", params.branch);
    if (params?.year) query.set("year", params.year);
    if (params?.skill) query.set("skill", params.skill);
    if (params?.location) query.set("location", params.location);
    if (params?.remote !== undefined) query.set("remote", String(params.remote));
    if (params?.maxCost) query.set("maxCost", params.maxCost);
    if (params?.category) query.set("category", params.category);
    query.set("profileId", params?.profileId || getActiveProfileId());

    return request<OpportunityWithMatch[]>(`/api/v1/opportunities?${query.toString()}`);
  },

  getOpportunity: (id: string, profileId?: string) => {
    const pid = profileId || getActiveProfileId();
    return request<{ opportunity: Opportunity; match: MatchResult }>(
      `/api/v1/opportunities/${id}?profileId=${encodeURIComponent(pid)}`
    );
  },

  getOpportunityMatch: (id: string, profileId: string) =>
    request<MatchResult>(`/api/v1/opportunities/${id}/match?profileId=${encodeURIComponent(profileId)}`),

  createPlanItem: (opportunityId: string, profileId?: string) =>
    request<PlanItem>("/api/v1/plan", {
      method: "POST",
      body: JSON.stringify({
        profileId: profileId || getActiveProfileId(),
        opportunityId,
      }),
    }),

  listPlanItems: (profileId?: string) => {
    const pid = profileId || getActiveProfileId();
    return request<PlanItem[]>(`/api/v1/plan?profileId=${encodeURIComponent(pid)}`);
  },

  updatePlanItem: (id: string, updates: { stepId?: string; done?: boolean; status?: string }) =>
    request<PlanItem>(`/api/v1/plan/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    }),

  deletePlanItem: (id: string) =>
    request<{ deleted: boolean; id: string }>(`/api/v1/plan/${id}`, {
      method: "DELETE",
    }),

  getPlanICSUrl: (planId: string) => `${API_BASE}/api/v1/plan/${planId}/ics`,

  getReminders: (profileId?: string) => {
    const pid = profileId || getActiveProfileId();
    return request<ReminderSettings>(`/api/v1/reminders?profileId=${encodeURIComponent(pid)}`);
  },

  upsertReminders: (reminders: ReminderSettings) =>
    request<ReminderSettings>("/api/v1/reminders", {
      method: "PUT",
      body: JSON.stringify(reminders),
    }),
};
