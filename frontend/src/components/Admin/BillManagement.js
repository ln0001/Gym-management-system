import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { billApi, memberApi } from '../../api/gymApi';

const BillManagement = () => {
  const [bills, setBills] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    memberId: '',
    amount: '',
    description: '',
    dueDate: '',
    status: 'pending'
  });

  useEffect(() => {
    fetchMembers();
    fetchBills();
  }, []);

  const fetchMembers = async () => {
    try {
      const data = await memberApi.list();
      setMembers(data.filter((member) => member.status === 'active'));
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchBills = async () => {
    setLoading(true);
    try {
      const data = await billApi.list();
      setBills(data);
    } catch (error) {
      toast.error('Error fetching bills');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await billApi.create({
        memberId: Number(formData.memberId),
        amount: parseFloat(formData.amount),
        description: formData.description,
        dueDate: formData.dueDate,
        status: formData.status
      });
      toast.success('Bill created successfully');
      setShowForm(false);
      setFormData({
        memberId: '',
        amount: '',
        description: '',
        dueDate: '',
        status: 'pending'
      });
      fetchBills();
    } catch (error) {
      toast.error('Error creating bill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bill-management">
      <div className="card">
        <div className="card-header">
          <h2>Bill Management</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Create Bill
          </button>
        </div>

        {showForm && (
          <div className="form-modal">
            <div className="modal-content">
              <h3>Create New Bill</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Member</label>
                  <select
                    className="form-control"
                    value={formData.memberId}
                    onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                    required
                  >
                    <option value="">Select Member</option>
                    {members.map(member => (
                      <option key={member.id} value={String(member.id)}>
                        {member.name} - {member.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-control"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Bill'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading && !showForm ? (
          <div className="spinner"></div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {bills.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>No bills found</td>
                </tr>
              ) : (
                bills.map((bill) => (
                  <tr key={bill.id}>
                    <td>{bill.memberName || 'Unknown'}</td>
                    <td>${bill.amount?.toFixed(2) || '0.00'}</td>
                    <td>{bill.description}</td>
                    <td>{bill.dueDate}</td>
                    <td>
                      <span className={`status-badge ${bill.status}`}>
                        {bill.status}
                      </span>
                    </td>
                    <td>{bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BillManagement;

