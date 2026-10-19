import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  BookmarkPlus,
  Check,
  Calendar,
  MapPin,
  Sparkles,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import { api, getActiveProfileId, type PlanItem } from "../lib/api";

const CATEGORIES = [
  { id: "all", label: "All Opportunities" },
  { id: "hackathon", label: "Hackathons" },
  { id: "internship", label: "Internships" },
  { id: "competition", label: "Competitions" },
  { id: "workshop", label: "Workshops" },
];

export const DiscoverPage: React.FC = () => {
  const queryClient = useQueryClient();
  const profileId = getActiveProfileId();

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [costFilter, setCostFilter] = useState("all"); // "all" | "free" | "under500"
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch opportunities with profile-aware match ranking
  const { data: opportunities, isLoading, isError } = useQuery({
    queryKey: ["opportunities", profileId],
    queryFn: () => api.listOpportunities({ profileId }),
  });

  // Fetch active saved plan items to identify already-saved opportunities
  const { data: planItems } = useQuery({
    queryKey: ["plan", profileId],
    queryFn: () => api.listPlanItems(profileId),
  });

  const savedOppIds = useMemo(() => {
    const set = new Set<string>();
    planItems?.forEach((item: PlanItem) => set.add(item.opportunity_id));
    return set;
  }, [planItems]);

  // Save-to-plan mutation
  const saveMutation = useMutation({
    mutationFn: (opportunityId: string) => api.createPlanItem(opportunityId, profileId),
    onSuccess: (savedItem) => {
      setSavedSuccessId(savedItem.opportunity_id);
      queryClient.invalidateQueries({ queryKey: ["plan", profileId] });
      setTimeout(() => setSavedSuccessId(null), 3000);
    },
  });

  // Client-side filtering across keywords, category, branch, year, remote, cost
  const filteredOpportunities = useMemo(() => {
    if (!opportunities) return [];

    return opportunities.filter((opp) => {
      // 1. Category Filter
      if (selectedCategory !== "all" && opp.category !== selectedCategory) {
        return false;
      }

      // 2. Search query (title, theme, skills)
      if (debouncedQuery.trim()) {
        const q = debouncedQuery.toLowerCase();
        const matchesTitle = opp.title.toLowerCase().includes(q);
        const matchesTheme = opp.theme.toLowerCase().includes(q);
        const matchesSkills = opp.skills_tags.some((s) => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesTheme && !matchesSkills) {
          return false;
        }
      }

      // 3. Branch filter
      if (selectedBranch !== "all") {
        if (opp.branches.length > 0 && !opp.branches.some((b) => b.toLowerCase().includes(selectedBranch.toLowerCase()))) {
          return false;
        }
      }

      // 4. Study Year filter
      if (selectedYear !== "all") {
        const yr = parseInt(selectedYear, 10);
        if ((opp.min_year && yr < opp.min_year) || (opp.max_year && yr > opp.max_year)) {
          return false;
        }
      }

      // 5. Remote filter
      if (remoteOnly && !opp.is_remote) {
        return false;
      }

      // 6. Cost filter
      if (costFilter === "free" && opp.cost > 0) {
        return false;
      }
      if (costFilter === "under500" && opp.cost > 500) {
        return false;
      }

      return true;
    });
  }, [opportunities, selectedCategory, debouncedQuery, selectedBranch, selectedYear, remoteOnly, costFilter]);

  const resetFilters = () => {
    setSearchQuery("");
    setDebouncedQuery("");
    setSelectedCategory("all");
    setSelectedBranch("all");
    setSelectedYear("all");
    setRemoteOnly(false);
    setCostFilter("all");
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-white rounded-xl border border-border p-6 sm:p-8 shadow-subtle">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-subtle text-primary text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Stage 01: Discover & Explain</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-2">
              Opportunities Ranked by Verified Fit
            </h1>
            <p className="text-ink-muted text-sm sm:text-base leading-relaxed">
              Find hackathons, internships, competitions, and workshops. Every recommendation transparently states <em>why it fits</em> and highlights any criteria needing organizer verification.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex sm:grid sm:grid-cols-2 gap-3 shrink-0 text-center">
            <div className="p-3.5 rounded-lg bg-canvas border border-border-subtle">
              <span className="block font-display text-2xl font-bold text-primary">
                {opportunities?.length || 0}
              </span>
              <span className="text-xs text-ink-muted font-medium">Verified Events</span>
            </div>
            <div className="p-3.5 rounded-lg bg-canvas border border-border-subtle">
              <span className="block font-display text-2xl font-bold text-status-meets">
                {planItems?.length || 0}
              </span>
              <span className="text-xs text-ink-muted font-medium">Saved to Plan</span>
            </div>
          </div>
        </div>

        {/* Search & Main Filter Controls */}
        <div className="mt-6 pt-6 border-t border-border-subtle space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle" />
              <input
                type="text"
                placeholder="Search by title, domain, or skill (e.g. AI, Python, ROS, FinTech)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-canvas text-ink text-sm focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-subtle hover:text-ink"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Secondary Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="px-3 py-2.5 rounded-lg border border-border bg-canvas text-xs font-semibold text-ink focus:border-primary outline-none"
              >
                <option value="all">All Branches</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Tech</option>
                <option value="Electronics">Electronics & Comm</option>
                <option value="Mechanical">Mechanical</option>
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2.5 rounded-lg border border-border bg-canvas text-xs font-semibold text-ink focus:border-primary outline-none"
              >
                <option value="all">All Years</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>

              <select
                value={costFilter}
                onChange={(e) => setCostFilter(e.target.value)}
                className="px-3 py-2.5 rounded-lg border border-border bg-canvas text-xs font-semibold text-ink focus:border-primary outline-none"
              >
                <option value="all">Any Fee</option>
                <option value="free">Free Only</option>
                <option value="under500">Under ₹500</option>
              </select>

              <button
                type="button"
                onClick={() => setRemoteOnly(!remoteOnly)}
                className={`px-3 py-2.5 rounded-lg text-xs font-semibold border transition-colors ${
                  remoteOnly
                    ? "bg-primary text-white border-primary"
                    : "bg-canvas text-ink-muted border-border hover:text-ink"
                }`}
              >
                Remote Only
              </button>
            </div>
          </div>

          {/* Category Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-ink text-white"
                    : "bg-canvas text-ink-muted hover:text-ink hover:bg-border/60"
                }`}
              >
                {cat.label}
              </button>
            ))}

            {(debouncedQuery || selectedCategory !== "all" || selectedBranch !== "all" || selectedYear !== "all" || remoteOnly || costFilter !== "all") && (
              <button
                onClick={resetFilters}
                className="ml-auto inline-flex items-center gap-1 text-xs text-ink-subtle hover:text-status-unmet transition-colors px-2 py-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Opportunities Catalog Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-border p-5 animate-pulse space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-4 w-20 bg-canvas rounded" />
                <div className="h-4 w-24 bg-canvas rounded" />
              </div>
              <div className="h-6 w-3/4 bg-canvas rounded" />
              <div className="h-4 w-1/2 bg-canvas rounded" />
              <div className="h-16 w-full bg-canvas rounded-lg" />
              <div className="h-4 w-1/3 bg-canvas rounded" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 rounded-xl bg-status-unmet-bg border border-status-unmet/20 text-center text-status-unmet">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <h3 className="font-display font-bold text-base">Backend Connection Unavailable</h3>
          <p className="text-xs text-ink-muted mt-1">
            Please make sure the Go server is running via <code className="bg-white px-1.5 py-0.5 rounded border">scripts/dev.sh</code>.
          </p>
        </div>
      ) : filteredOpportunities.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center max-w-md mx-auto space-y-4 shadow-subtle">
          <div className="w-12 h-12 rounded-full bg-canvas flex items-center justify-center mx-auto text-ink-subtle">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-ink">No Matching Opportunities</h3>
            <p className="text-xs text-ink-muted mt-1">
              No listings match your current combination of filters. Try clearing search terms or broadening academic branch settings.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opp) => {
            const isSaved = savedOppIds.has(opp.id);
            const isJustSaved = savedSuccessId === opp.id;

            return (
              <div
                key={opp.id}
                className="bg-white rounded-xl border border-border hover:border-primary/50 transition-all duration-200 flex flex-col justify-between p-5 shadow-subtle hover:shadow-elevation group"
              >
                <div>
                  {/* Category & Verified Fit Badge Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs px-2.5 py-0.5 rounded font-semibold bg-canvas text-ink-muted uppercase tracking-wider text-[10px]">
                      {opp.category}
                    </span>

                    {/* Eligibility Badge matching Section 9 tokens */}
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border flex items-center gap-1 ${
                        opp.match.fit_badge === "Looks eligible"
                          ? "bg-status-meets-bg text-status-meets border-status-meets/30"
                          : opp.match.fit_badge === "Not eligible"
                          ? "bg-status-unmet-bg text-status-unmet border-status-unmet/30"
                          : "bg-status-verify-bg text-status-verify border-status-verify/30"
                      }`}
                    >
                      {opp.match.fit_badge === "Looks eligible" ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : opp.match.fit_badge === "Not eligible" ? (
                        <AlertCircle className="w-3 h-3" />
                      ) : (
                        <HelpCircle className="w-3 h-3" />
                      )}
                      <span>{opp.match.fit_badge}</span>
                    </span>
                  </div>

                  {/* Title & Theme */}
                  <Link to={`/opportunity/${opp.id}`}>
                    <h2 className="font-display font-bold text-lg text-ink group-hover:text-primary transition-colors line-clamp-1">
                      {opp.title}
                    </h2>
                  </Link>
                  <p className="text-xs text-ink-subtle mt-0.5 line-clamp-1">{opp.theme}</p>

                  {/* Meta Tags: Format, Location & Cost */}
                  <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-ink-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-ink-subtle" />
                      <span>{opp.is_remote ? "Online / Remote" : opp.location}</span>
                    </span>
                    <span>·</span>
                    <span>{opp.cost === 0 ? "Free" : `₹${opp.cost}`}</span>
                  </div>

                  {/* Match Reasons Container */}
                  <div className="mt-4 p-3 rounded-lg bg-canvas border border-border-subtle space-y-1.5">
                    <span className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider block">
                      Why it fits your profile
                    </span>
                    {opp.match.match_reasons.slice(0, 3).map((reason: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-ink leading-snug">
                        <CheckCircle2 className="w-3.5 h-3.5 text-status-meets shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{reason}</span>
                      </div>
                    ))}
                  </div>

                  {/* Skill Badges */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {opp.skills_tags.slice(0, 4).map((skill: string) => (
                      <span
                        key={skill}
                        className="text-[11px] px-2 py-0.5 rounded bg-surface border border-border text-ink-muted"
                      >
                        {skill}
                      </span>
                    ))}
                    {opp.skills_tags.length > 4 && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded text-ink-subtle">
                        +{opp.skills_tags.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-5 pt-3.5 border-t border-border-subtle flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-ink-subtle">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Due: {opp.deadline}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Save to Plan Button */}
                    <button
                      type="button"
                      disabled={isSaved || saveMutation.isPending}
                      onClick={() => saveMutation.mutate(opp.id)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-colors ${
                        isSaved || isJustSaved
                          ? "bg-status-meets-bg text-status-meets border border-status-meets/30"
                          : "bg-canvas hover:bg-border text-ink border border-border"
                      }`}
                      title={isSaved ? "Saved to your plan" : "Add to preparation timeline"}
                    >
                      {isSaved || isJustSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <BookmarkPlus className="w-3.5 h-3.5 text-primary" />
                          <span>Save to plan</span>
                        </>
                      )}
                    </button>

                    {/* View Details Link */}
                    <Link
                      to={`/opportunity/${opp.id}`}
                      className="text-xs px-2.5 py-1.5 rounded-lg font-semibold text-primary hover:bg-primary-subtle transition-colors flex items-center gap-1"
                    >
                      <span>Explain</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
