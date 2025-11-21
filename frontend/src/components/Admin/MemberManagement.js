import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { memberApi, feePackageApi } from '../../api/gymApi';
import './MemberManagement.css';

const MemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    joinDate: '',
    status: 'active',
    feePackageId: ''
  });
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetchMembers();
    fetchPackages();
  }, []);
  const fetchPackages = async () => {
    try {
      const data = await feePackageApi.list();
      setPackages(data);
    } catch (error) {
      console.error(error);
      toast.error('Error fetching fee packages');
    }
  };

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await memberApi.list();
      setMembers(data);
    } catch (error) {
      console.error(error);
      toast.error('Error fetching members');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        joinDate: formData.joinDate || null,
        role: 'member'
      };
      if (formData.feePackageId) {
        const selectedPackage = packages.find(
          (pkg) => String(pkg.id) === String(formData.feePackageId)
        );
        if (selectedPackage) {
          payload.feePackageId = selectedPackage.id;
          payload.feePackageName = selectedPackage.name;
          payload.feePackageAmount = selectedPackage.amount;
          payload.assignedAt = new Date().toISOString();
        }
      } else {
        payload.feePackageId = null;
        payload.feePackageName = null;
        payload.feePackageAmount = null;
        payload.assignedAt = null;
      }
      if (editingMember) {
        await memberApi.update(editingMember.id, payload);
        toast.success('Member updated successfully');
      } else {
        await memberApi.create(payload);
        toast.success('Member added successfully');
      }
      setShowForm(false);
      setEditingMember(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        joinDate: '',
        status: 'active',
        feePackageId: ''
      });
      fetchMembers();
    } catch (error) {
      toast.error('Error saving member');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || '',
      email: member.email || '',
      phone: member.phone || '',
      address: member.address || '',
      joinDate: member.joinDate ? member.joinDate.split('T')[0] : '',
      status: member.status || 'active',
      feePackageId: member.feePackageId ? String(member.feePackageId) : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member?')) {
      return;
    }
    try {
      await memberApi.remove(id);
      toast.success('Member deleted successfully');
      fetchMembers();
    } catch (error) {
      console.error(error);
      toast.error('Error deleting member');
    }
  };

  return (
    <div className="member-management">
      <div className="card">
        <div className="card-header">
          <h2>Member Management</h2>
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowForm(true);
              setEditingMember(null);
              setFormData({
                name: '',
                email: '',
                phone: '',
                address: '',
                joinDate: '',
                status: 'active'
              });
            }}
          >
            Add Member
          </button>
        </div>

        {showForm && (
          <div className="form-modal">
            <div className="modal-content">
              <h3>{editingMember ? 'Edit Member' : 'Add New Member'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <textarea
                    className="form-control"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Join Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.joinDate}
                    onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              <div className="form-group">
                <label className="form-label">Fee Package (optional)</label>
                <select
                  className="form-control"
                  value={formData.feePackageId}
                  onChange={(e) => setFormData({ ...formData, feePackageId: e.target.value })}
                >
                  <option value="">Select Package</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={String(pkg.id)}>
                      {pkg.name} - ${pkg.amount?.toFixed(2) || '0.00'}
                    </option>
                  ))}
                </select>
              </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : editingMember ? 'Update' : 'Add'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowForm(false);
                      setEditingMember(null);
                    }}
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
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Join Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>
                    No members found
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td>{member.phone}</td>
                    <td>{member.joinDate ? new Date(member.joinDate).toLocaleDateString() : '—'}</td>
                    <td>
                      <span className={`status-badge ${member.status}`}>
                        {member.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleEdit(member)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(member.id)}
                        style={{ marginLeft: '10px' }}
                      >
                        Delete
                      </button>
                    </td>
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

export default MemberManagement;

