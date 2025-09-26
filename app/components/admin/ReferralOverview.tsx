"use client";

import React, { useState, useEffect } from "react";
import { ReferralStats } from "../../fetch/types";
import { useUserStore } from "../../store/userStore";
import "./referral-management.css";

interface ReferralOverviewProps {
  className?: string;
}

const ReferralOverview: React.FC<ReferralOverviewProps> = ({ className }) => {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUserStore();

  const fetchStats = async () => {
    try {
      // Get Firebase Auth token
      const auth = (await import('../../lib/firebaseConfig')).auth;
      const currentUser = auth.currentUser;
      const token = await currentUser?.getIdToken();
      
      if (!token) {
        console.error('No authentication token available');
        return;
      }
      
      const response = await fetch('/api/referrals/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching referral stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className={`referral-overview ${className || ''}`}>
        <div className="loading">Loading referral statistics...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={`referral-overview ${className || ''}`}>
        <div className="no-data">No referral data available</div>
      </div>
    );
  }

  return (
    <div className={`referral-overview ${className || ''}`}>
      <h3>Referral System Overview</h3>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalCodesGenerated}</div>
            <div className="stat-label">Total Codes</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalSignups}</div>
            <div className="stat-label">Total Signups</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.activeCodes}</div>
            <div className="stat-label">Active Codes</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-value">{stats.conversionRate.toFixed(1)}%</div>
            <div className="stat-label">Conversion Rate</div>
          </div>
        </div>
      </div>

      {stats.topReferrers.length > 0 && (
        <div className="top-referrers-section">
          <h4>Top Referrers</h4>
          <div className="referrers-list">
            {stats.topReferrers.slice(0, 5).map((referrer, index) => (
              <div key={referrer.userId} className="referrer-item">
                <div className="rank">#{index + 1}</div>
                <div className="referrer-info">
                  <div className="name">{referrer.userName}</div>
                  <div className="count">{referrer.referralCount} referrals</div>
                </div>
                <div className="referrer-badge">
                  {referrer.referralCount >= 10 ? '🏆' : referrer.referralCount >= 5 ? '🥇' : '⭐'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="quick-actions">
        <button 
          className="btn btn-primary"
          onClick={() => window.location.href = '/admin?page=referrals'}
        >
          Manage Referrals
        </button>
      </div>
    </div>
  );
};

export default ReferralOverview;
