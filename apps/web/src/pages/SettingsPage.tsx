import React from "react";

export const SettingsPage: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-border p-6 shadow-subtle">
      <h1 className="font-display text-2xl font-bold text-ink mb-2">Settings & Privacy</h1>
      <p className="text-ink-muted text-sm">Manage profile, notification quiet hours, and data deletion.</p>
    </div>
  );
};
