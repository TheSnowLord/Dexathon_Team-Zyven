import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Compass, User, Calendar, Settings, ShieldCheck } from "lucide-react";
import { api, getActiveProfileId } from "../../lib/api";

export const Header: React.FC = () => {
  const location = useLocation();
  const profileId = getActiveProfileId();

  // Health query
  const { isSuccess } = useQuery({
    queryKey: ["health"],
    queryFn: api.getHealth,
    refetchInterval: 15000,
  });

  // Active profile query
  const { data: profile } = useQuery({
    queryKey: ["profile", profileId],
    queryFn: () => api.getProfile(profileId),
    enabled: !!profileId,
  });

  const navLinks = [
    { to: "/", label: "Discover", icon: Compass, stage: "01" },
    { to: "/profile", label: "Profile", icon: User, stage: "02" },
    { to: "/plan", label: "My Plan", icon: Calendar, stage: "04" },
    { to: "/settings", label: "Settings", icon: Settings, stage: "05" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg text-ink tracking-tight">
                  Opportunity Compass
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-primary-subtle text-primary font-medium tracking-wide">
                  ACE NextGen
                </span>
              </div>
              <p className="text-xs text-ink-subtle hidden sm:block">
                Transparent match reasons & actionable preparation timelines
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));
              return (
                <Link
                  key={to}
                  to={to}
                  aria-label={label}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-ink-muted hover:text-ink hover:bg-canvas"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="hidden xs:inline sm:inline">{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Live Status & Active Profile Badge */}
          <div className="hidden md:flex items-center gap-3">
            {/* System Live Ping */}
            <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-border bg-canvas">
              <span className={`w-2 h-2 rounded-full ${isSuccess ? "bg-status-meets animate-pulse" : "bg-status-verify"}`} />
              <span className="text-ink-muted font-medium">
                {isSuccess ? "Live Engine" : "Connecting..."}
              </span>
            </div>

            {/* Profile summary pill */}
            {profile && (
              <Link
                to="/profile"
                className="flex items-center gap-2 text-xs py-1 px-2.5 rounded-full border border-border bg-surface hover:bg-canvas transition-colors"
                title="Edit student profile"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-status-meets" />
                <span className="text-ink font-semibold max-w-[120px] truncate">
                  Year {profile.year} · {profile.branch.split(" ")[0]}
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
