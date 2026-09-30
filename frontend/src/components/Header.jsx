import React from "react";
import { Activity } from "lucide-react";

export function Header({ eyebrow, title, description }) {
  return (
    <header className="page-header">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="header-status">
        <Activity size={17} />
        <span>Platform Operational</span>
      </div>
    </header>
  );
}
