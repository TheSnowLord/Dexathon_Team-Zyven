import React from "react";

export const ProfilePage: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-border p-6 shadow-subtle">
      <h1 className="font-display text-2xl font-bold text-ink mb-2">Student Profile</h1>
      <p className="text-ink-muted text-sm">Lightweight student preferences for branch, year, and skills.</p>
    </div>
  );
};
