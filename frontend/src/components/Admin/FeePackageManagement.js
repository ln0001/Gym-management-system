import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { feePackageApi } from '../../api/gymApi';

const FeePackageManagement = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    duration: '',
    description: ''
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const data = await feePackageApi.list();
      setPackages(data);
    } catch (error) {
      toast.error('Error fetching packages');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await feePackageApi.create({
        name: formData.name,
        amount: parseFloat(formData.amount),
        durationMonths: parseInt(formData.duration, 10),
        description: formData.description
      });
      toast.success('Fee package created successfully');
      setShowForm(false);
      setFormData({ name: '', amount: '', duration: '', description: '' });
      fetchPackages();
    } catch (error) {
      toast.error('Error creating package');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fee-package-management">
      <div className="card">
        <div className="card-header">
          <h2>Fee Package Management</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Create Package
          </button>
        </div>

        {showForm && (
          <div className="form-modal">
            <div className="modal-content">
              <h3>Create Fee Package</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Package Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
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
                  <label className="form-label">Duration (months)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Package'}
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

        <div style={{ marginTop: '30px' }}>
          <h3>Available Packages</h3>
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Duration</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr key={pkg.id}>
                    <td>{pkg.name}</td>
                    <td>${pkg.amount?.toFixed(2) || '0.00'}</td>
                    <td>{pkg.durationMonths} months</td>
                    <td>{pkg.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
};

export default FeePackageManagement;

