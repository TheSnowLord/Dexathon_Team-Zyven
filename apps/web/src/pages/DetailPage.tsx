import React from "react";
import { useParams } from "react-router-dom";

export const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="bg-white rounded-xl border border-border p-6 shadow-subtle">
      <h1 className="font-display text-2xl font-bold text-ink mb-2">Opportunity Fit & Plan</h1>
      <p className="text-ink-muted text-sm">Viewing details for: {id}</p>
    </div>
  );
};
