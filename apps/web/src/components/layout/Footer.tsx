import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 text-sm">
          {/* Col 1 */}
          <div className="md:col-span-2">
            <h3 className="font-display font-semibold text-ink text-base mb-2">
              ACE Opportunity Compass
            </h3>
            <p className="text-ink-muted text-xs leading-relaxed max-w-md">
              An additive planning and confidence layer on top of ACE discovery. Built for DEXATHON 2026 (ACE NextGen Challenge, PS Category: Software) by <strong>Team Zyven</strong>.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-status-meets">
              <ShieldCheck className="w-4 h-4" />
              <span>Trust-by-design: Transparent rule-based eligibility with zero black-box scoring.</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-semibold text-ink uppercase tracking-wider mb-2">
              The 5 Stages
            </h4>
            <ul className="space-y-1.5 text-xs text-ink-muted">
              <li><span className="font-medium text-ink">01 Discover:</span> Multi-facet catalog</li>
              <li><span className="font-medium text-ink">02 Profile:</span> Minimal student signals</li>
              <li><span className="font-medium text-ink">03 Explain:</span> Verified fit breakdown</li>
              <li><span className="font-medium text-ink">04 Plan:</span> Save to actionable timeline</li>
              <li><span className="font-medium text-ink">05 Remind:</span> Opt-in deadline alerts</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-semibold text-ink uppercase tracking-wider mb-2">
              Integrations & Trust
            </h4>
            <ul className="space-y-1.5 text-xs text-ink-muted">
              <li>
                <a
                  href="https://allcollegeevent.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary inline-flex items-center gap-1"
                >
                  All College Event <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link to="/settings" className="hover:text-primary">
                  Data Privacy & Deletion
                </Link>
              </li>
              <li>
                <Link to="/plan" className="hover:text-primary">
                  RFC 5545 Calendar Sync (.ics)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-subtle">
          <p>© 2026 Team Zyven (Ankush Shahu) · MIT License</p>
          <p className="mt-2 sm:mt-0">
            DEXATHON 2026 · Built with Go, SQLite, React, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};
