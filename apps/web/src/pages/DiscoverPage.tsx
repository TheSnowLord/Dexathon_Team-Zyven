import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { api, getActiveProfileId, type OpportunityWithMatch } from "../lib/api";

export const DiscoverPage: React.FC = () => {
  const profileId = getActiveProfileId();

  const { data: opportunities, isLoading, isError } = useQuery({
    queryKey: ["opportunities", profileId],
    queryFn: () => api.listOpportunities({ profileId }),
  });

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-white rounded-xl border border-border p-6 sm:p-8 shadow-subtle">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-subtle text-primary text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Stage 01: Discover & Explain</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-2">
            Curated Opportunities with Verified Fit
          </h1>
          <p className="text-ink-muted text-sm sm:text-base leading-relaxed">
            Browse hackathons, internships, competitions, and workshops. Every listing displays transparent match reasons and an eligibility checklist separating confirmed criteria from what to verify with organizers.
          </p>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && (
          <div className="col-span-full py-12 text-center text-ink-subtle">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2" />
            <p className="text-sm">Loading verified opportunities from engine...</p>
          </div>
        )}

        {isError && (
          <div className="col-span-full py-8 text-center text-status-unmet bg-status-unmet-bg border border-status-unmet/20 rounded-lg">
            <p className="text-sm font-semibold">Unable to connect to Opportunity Compass API.</p>
            <p className="text-xs text-ink-muted mt-1">Ensure the Go API server is running on port 8080.</p>
          </div>
        )}

        {opportunities?.map((opp: OpportunityWithMatch) => (
          <div
            key={opp.id}
            className="bg-white rounded-xl border border-border hover:border-primary/40 transition-all p-5 flex flex-col justify-between shadow-subtle"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 rounded font-medium bg-canvas text-ink-muted capitalize">
                  {opp.category}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    opp.match.fit_badge === "Looks eligible"
                      ? "bg-status-meets-bg text-status-meets"
                      : opp.match.fit_badge === "Not eligible"
                      ? "bg-status-unmet-bg text-status-unmet"
                      : "bg-status-verify-bg text-status-verify"
                  }`}
                >
                  {opp.match.fit_badge}
                </span>
              </div>

              <h2 className="font-display font-bold text-lg text-ink line-clamp-1 mb-1">
                {opp.title}
              </h2>
              <p className="text-xs text-ink-subtle mb-3 line-clamp-1">{opp.theme}</p>

              {/* Match reasons snippet */}
              <div className="space-y-1 mb-4 text-xs text-ink-muted bg-canvas p-2.5 rounded-lg border border-border-subtle">
                {opp.match.match_reasons.slice(0, 2).map((reason: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-status-meets shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
              <span className="text-xs text-ink-subtle font-medium">
                Deadline: {opp.deadline}
              </span>
              <Link
                to={`/opportunity/${opp.id}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
