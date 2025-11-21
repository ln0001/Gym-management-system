import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { supplementApi } from '../../api/gymApi';

const SupplementStore = () => {
  const [supplements, setSupplements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSupplement, setEditingSupplement] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'protein'
  });

  useEffect(() => {
    fetchSupplements();
  }, []);

  const fetchSupplements = async () => {
    setLoading(true);
    try {
      const data = await supplementApi.list();
      setSupplements(data);
    } catch (error) {
      toast.error('Error fetching supplements');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10)
      };
      if (editingSupplement) {
        await supplementApi.update(editingSupplement.id, payload);
        toast.success('Supplement updated successfully');
      } else {
        await supplementApi.create(payload);
        toast.success('Supplement added successfully');
      }
      setShowForm(false);
      setEditingSupplement(null);
      setFormData({ name: '', description: '', price: '', stock: '', category: 'protein' });
      fetchSupplements();
    } catch (error) {
      toast.error('Error saving supplement');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (supplement) => {
    setEditingSupplement(supplement);
    setFormData({
      name: supplement.name || '',
      description: supplement.description || '',
      price: supplement.price || '',
      stock: supplement.stock || '',
      category: supplement.category || 'protein'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplement?')) {
      try {
        await supplementApi.remove(id);
        toast.success('Supplement deleted successfully');
        fetchSupplements();
      } catch (error) {
        toast.error('Error deleting supplement');
      }
    }
  };

  return (
    <div className="supplement-store">
      <div className="card">
        <div className="card-header">
          <h2>Supplement Store</h2>
          <button className="btn btn-primary" onClick={() => {
            setShowForm(true);
            setEditingSupplement(null);
            setFormData({ name: '', description: '', price: '', stock: '', category: 'protein' });
          }}>
            Add Supplement
          </button>
        </div>

        {showForm && (
          <div className="form-modal">
            <div className="modal-content">
              <h3>{editingSupplement ? 'Edit Supplement' : 'Add New Supplement'}</h3>
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
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="protein">Protein</option>
                    <option value="creatine">Creatine</option>
                    <option value="vitamins">Vitamins</option>
                    <option value="pre-workout">Pre-Workout</option>
                    <option value="post-workout">Post-Workout</option>
                  </select>
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
                <div className="form-group">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                    min="0"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : editingSupplement ? 'Update' : 'Add'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowForm(false);
                      setEditingSupplement(null);
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
          <div className="supplements-grid">
            {supplements.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '20px' }}>No supplements found</p>
            ) : (
              supplements.map((supplement) => (
                <div key={supplement.id} className="supplement-card">
                  <h4>{supplement.name}</h4>
                  <p className="category">{supplement.category}</p>
                  <p className="description">{supplement.description}</p>
                  <div className="supplement-footer">
                    <span className="price">${supplement.price?.toFixed(2) || '0.00'}</span>
                    <span className={`stock ${supplement.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      Stock: {supplement.stock}
                    </span>
                  </div>
                  <div className="supplement-actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleEdit(supplement)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(supplement.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplementStore;

