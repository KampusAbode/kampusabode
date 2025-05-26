"use client";

import React, { useState } from "react";
import "./ScheduleInspectionModal.css";
import { useUserStore } from "../../../store/userStore";
import toast from "react-hot-toast";

interface Apartment {
  id: string;
  title: string;
}

interface ScheduleInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  apartment: Apartment;
  agentEmail: string;
  agentNumber: string;
  agencyName: string;
  onSubmit: (data: {
    apartmentId: string;
    name: string;
    email: string;
    phone: string;
    preferredDate: string;
    preferredTime: string;
    notes?: string;
    agentEmail: string;
    agentNumber: string;
    agencyName: string;
  }) => Promise<void>;
}

export default function ScheduleInspectionModal({
  isOpen,
  onClose,
  apartment,
  agentEmail,
  agentNumber,
  agencyName,
  onSubmit,
}: ScheduleInspectionModalProps) {
  const { user } = useUserStore();
  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [phone, setPhone] = useState(user?.phoneNumber);
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  if (!user) {
    toast.error("sign up before scheduling an inspection");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (!name || !email || !phone || !preferredDate || !preferredTime) {
        throw new Error("Please fill in all required fields.");
      }

      await onSubmit({
        apartmentId: apartment.id,
        name,
        email,
        phone,
        preferredDate,
        preferredTime,
        notes,
        agentEmail,
        agentNumber,
        agencyName,
      });

      setSuccessMsg("Inspection scheduled successfully!");
    } catch (error: any) {
      setErrorMsg(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="schedule-inspection-modal">
        <div className="modal-header">
          <h2>Schedule an Inspection</h2>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="modal-section">
            <label>Apartment:</label>
            <p>{apartment.title}</p>
          </div>

          <div className="modal-section">
            <label htmlFor="name">
              Name <span className="required">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              placeholder="Your full name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="modal-section">
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              placeholder="Your email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="modal-section">
            <label htmlFor="phone">
              Phone <span className="required">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              placeholder="Phone number"
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="modal-section">
            <label htmlFor="preferredDate">
              Preferred Date <span className="required">*</span>
            </label>
            <input
              id="preferredDate"
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              required
            />
          </div>

          <div className="modal-section">
            <label htmlFor="preferredTime">
              Preferred Time <span className="required">*</span>
            </label>
            <input
              id="preferredTime"
              type="time"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              required
            />
          </div>

          <div className="modal-section">
            <label htmlFor="notes">Additional Notes</label>
            <textarea
              id="notes"
              placeholder="Any special requests or info"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {errorMsg && <p className="error-msg">{errorMsg}</p>}
          {successMsg && <p className="success-msg">{successMsg}</p>}

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Scheduling..." : "Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
