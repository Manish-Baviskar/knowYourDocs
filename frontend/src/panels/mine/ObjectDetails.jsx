import React from "react";
import { Truck, Activity, User, Gauge, Fuel, Clock, Wrench, X } from "lucide-react";

export function ObjectDetails({ selectedObject, onClose }) {
  if (!selectedObject) {
    return (
      <div className="object-details-empty">
        <Truck size={36} color="#b78645" />
        <h4>Asset Inspector</h4>
        <p>Click on any mining equipment or bench in the 3D scene to inspect real-time operational telemetry.</p>
      </div>
    );
  }

  return (
    <div className="object-details-panel">
      <div className="details-header">
        <div>
          <span className="details-tag">{selectedObject.type}</span>
          <h3>{selectedObject.name} ({selectedObject.id})</h3>
        </div>
        <button className="close-btn" onClick={onClose}><X size={16} /></button>
      </div>

      <div className={`status-banner ${selectedObject.status.toLowerCase()}`}>
        <Activity size={16} />
        <span>Status: {selectedObject.status}</span>
      </div>

      <div className="details-grid">
        <div className="detail-item">
          <span className="label"><User size={13} /> Operator</span>
          <strong className="val">{selectedObject.operator || "Unassigned"}</strong>
        </div>

        <div className="detail-item">
          <span className="label"><Gauge size={13} /> Speed</span>
          <strong className="val">{selectedObject.speed}</strong>
        </div>

        <div className="detail-item">
          <span className="label"><Fuel size={13} /> Fuel Level</span>
          <strong className="val">{selectedObject.fuel}</strong>
        </div>

        <div className="detail-item">
          <span className="label"><Clock size={13} /> Operating Hours</span>
          <strong className="val">{selectedObject.operatingHours} hrs</strong>
        </div>
      </div>

      <div className="detail-box">
        <strong>Location / Bench:</strong>
        <p>{selectedObject.bench}</p>
      </div>

      <div className="detail-box">
        <strong>Current Activity:</strong>
        <p>{selectedObject.currentActivity}</p>
      </div>

      <div className="detail-box">
        <strong>Capacity / Spec:</strong>
        <p>{selectedObject.capacity}</p>
      </div>

      <div className="detail-footer">
        <span><Wrench size={13} /> Health: <b>{selectedObject.healthStatus}</b></span>
        <span>Last Service: {selectedObject.lastService}</span>
      </div>
    </div>
  );
}
