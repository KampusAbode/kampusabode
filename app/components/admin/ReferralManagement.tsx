"use client";
// REFERRAL MANAGEMENT 
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { ReferralCode, ReferralRecord, ReferralStats } from "../../fetch/types";
import { useUserStore } from "../../store/userStore";
import { useUsersStore } from "../../store/usersStore";
import "./referral-management.css";

interface ReferralManagementProps {
  className?: string;
}

const ReferralManagement: React.FC<ReferralManagementProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState<'codes' | 'records' | 'stats'>('codes');
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>([]);
  const [referralRecords, setReferralRecords] = useState<ReferralRecord[]>([]);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Form state for creating referral codes
  const [formData, setFormData] = useState({
    ownerId: '',
    ownerName: '',
    ownerEmail: '',
    description: '',
  });
  
  // User search state
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const { user } = useUserStore();
  const { users } = useUsersStore();

  // Fetch data based on active tab
  const fetchData = async () => {
    setLoading(true);
    try {
      // Get Firebase Auth token
      const auth = (await import('../../lib/firebaseConfig')).auth;
      const currentUser = auth.currentUser;
      const token = await currentUser?.getIdToken();
      
      if (!token) {
        toast.error('Authentication required');
        return;
      }
      
      if (activeTab === 'codes') {
        const response = await fetch('/api/referrals/codes', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setReferralCodes(data.codes);
        }
      } else if (activeTab === 'records') {
        const response = await fetch('/api/referrals/records', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setReferralRecords(data.records);
        }
      } else if (activeTab === 'stats') {
        const response = await fetch('/api/referrals/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setReferralStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Search for users by email (local search)
  const searchUsersByEmail = (email: string) => {
    if (!email || email.length < 2) {
      setSearchResults([]);
      return;
    }

    if (!users || users.length === 0) {
      setSearchResults([]);
      return;
    }

    // Filter users by email
    const filteredUsers = users.filter(user => 
      user.email.toLowerCase().includes(email.toLowerCase())
    ).slice(0, 10); // Limit to 10 results

    setSearchResults(filteredUsers);
  };

  // Handle email search input
  const handleEmailSearch = (email: string) => {
    setSearchEmail(email);
    searchUsersByEmail(email);
  };

  // Select user from search results
  const selectUser = (selectedUser: any) => {
    setFormData({
      ...formData,
      ownerId: selectedUser.id,
      ownerName: selectedUser.name,
      ownerEmail: selectedUser.email,
    });
    setSearchEmail(selectedUser.email);
    setSearchResults([]);
  };

  const handleCreateReferralCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get Firebase Auth token
      const auth = (await import('../../lib/firebaseConfig')).auth;
      const currentUser = auth.currentUser;
      const token = await currentUser?.getIdToken();
      
      if (!token) {
        toast.error('Authentication required');
        return;
      }
      
      const response = await fetch('/api/referrals/create-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ownerId: formData.ownerId,
          ownerName: formData.ownerName,
          ownerEmail: formData.ownerEmail,
          description: formData.description,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Referral code created successfully!');
        setShowCreateForm(false);
        setFormData({
          ownerId: '',
          ownerName: '',
          ownerEmail: '',
          description: '',
        });
        fetchData(); // Refresh the codes list
      } else {
        toast.error(data.error || 'Failed to create referral code');
      }
    } catch (error) {
      console.error('Error creating referral code:', error);
      toast.error('Failed to create referral code');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.toDate ? timestamp.toDate() : timestamp).toLocaleDateString();
  };

  const formatDateTime = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.toDate ? timestamp.toDate() : timestamp).toLocaleString();
  };

  return (
    <div className={`referral-management ${className || ''}`}>
      <div className="referral-header">
        <h2>Referral Management</h2>
        <div className="tab-buttons">
          <button
            className={`tab-btn ${activeTab === 'codes' ? 'active' : ''}`}
            onClick={() => setActiveTab('codes')}
          >
            Referral Codes
          </button>
          <button
            className={`tab-btn ${activeTab === 'records' ? 'active' : ''}`}
            onClick={() => setActiveTab('records')}
          >
            Referral Records
          </button>
          <button
            className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
        </div>
      </div>

      {activeTab === 'codes' && (
        <div className="codes-section">
          <div className="section-header">
            <h3>Referral Codes</h3>
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateForm(true)}
            >
              Create New Code
            </button>
          </div>

          {showCreateForm && (
            <div className="create-form-overlay">
              <div className="create-form">
                <h4>Create Referral Code</h4>
                <form onSubmit={handleCreateReferralCode}>
                  <div className="form-group">
                    <label>Search User by Email</label>
                    <input
                      type="email"
                      value={searchEmail}
                      onChange={(e) => handleEmailSearch(e.target.value)}
                      placeholder="Type user email to search..."
                      required
                    />
                    {searchResults.length > 0 && (
                      <div className="search-results">
                        {searchResults.map((user) => (
                          <div
                            key={user.id}
                            className="search-result-item"
                            onClick={() => selectUser(user)}
                          >
                            <div className="user-info">
                              <div className="user-name">{user.name}</div>
                              <div className="user-email">{user.email}</div>
                              <div className="user-type">{user.userType}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {formData.ownerId && (
                    <>
                      <div className="form-group">
                        <label>Selected User</label>
                        <div className="selected-user">
                          <div className="user-name">{formData.ownerName}</div>
                          <div className="user-email">{formData.ownerEmail}</div>
                          <div className="user-id">ID: {formData.ownerId}</div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {!formData.ownerId && (
                    <div className="form-group">
                      <label>Manual Entry (if search doesn't work)</label>
                      <div className="manual-entry">
                        <input
                          type="text"
                          placeholder="Owner ID"
                          value={formData.ownerId}
                          onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="Owner Name"
                          value={formData.ownerName}
                          onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                        />
                        <input
                          type="email"
                          placeholder="Owner Email"
                          value={formData.ownerEmail}
                          onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                  <div className="form-group">
                    <label>Description (optional)</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="form-actions">
                    <button type="button" onClick={() => setShowCreateForm(false)}>
                      Cancel
                    </button>
                    <button type="submit" disabled={loading}>
                      {loading ? 'Creating...' : 'Create Code'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="codes-table">
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Owner</th>
                    <th>Usage</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {referralCodes.map((code) => (
                    <tr key={code.id}>
                      <td>
                        <code>{code.code}</code>
                      </td>
                      <td>
                        <div>
                          <div>{code.ownerName}</div>
                          <small>{code.ownerEmail}</small>
                        </div>
                      </td>
                      <td>
                        {code.usageCount}
                      </td>
                      <td>
                        <span className={`status ${code.isActive ? 'active' : 'inactive'}`}>
                          {code.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{formatDate(code.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'records' && (
        <div className="records-section">
          <div className="section-header">
            <h3>Referral Records</h3>
          </div>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="records-table">
              <table>
                <thead>
                  <tr>
                    <th>Referrer</th>
                    <th>Referred User</th>
                    <th>Code Used</th>
                    <th>Signup Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {referralRecords.map((record) => (
                    <tr key={record.id}>
                      <td>
                        <div>
                          <div>{record.referrerName}</div>
                          <small>ID: {record.referrerId}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>{record.referredUserName}</div>
                          <small>{record.referredUserEmail}</small>
                        </div>
                      </td>
                      <td>
                        <code>{record.referralCode}</code>
                      </td>
                      <td>{formatDateTime(record.signupDate)}</td>
                      <td>
                        <span className={`status ${record.status}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="stats-section">
          <div className="section-header">
            <h3>Referral Statistics</h3>
          </div>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : referralStats ? (
            <div className="stats-grid">
              <div className="stat-card">
                <h4>Total Codes Generated</h4>
                <div className="stat-value">{referralStats.totalCodesGenerated}</div>
              </div>
              <div className="stat-card">
                <h4>Total Signups</h4>
                <div className="stat-value">{referralStats.totalSignups}</div>
              </div>
              <div className="stat-card">
                <h4>Active Codes</h4>
                <div className="stat-value">{referralStats.activeCodes}</div>
              </div>
              <div className="stat-card">
                <h4>Conversion Rate</h4>
                <div className="stat-value">{referralStats.conversionRate.toFixed(2)}%</div>
              </div>
            </div>
          ) : (
            <div className="no-data">No statistics available</div>
          )}

          {referralStats && referralStats.topReferrers.length > 0 && (
            <div className="top-referrers">
              <h4>Top Referrers</h4>
              <div className="referrers-list">
                {referralStats.topReferrers.map((referrer, index) => (
                  <div key={referrer.userId} className="referrer-item">
                    <div className="rank">#{index + 1}</div>
                    <div className="referrer-info">
                      <div className="name">{referrer.userName}</div>
                      <div className="count">{referrer.referralCount} referrals</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReferralManagement;
