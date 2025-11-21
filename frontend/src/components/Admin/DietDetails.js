import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { dietPlanApi } from '../../api/gymApi';

const DietDetails = () => {
  const [dietPlans, setDietPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mealPlan: '',
    calories: '',
    duration: '',
    category: 'weight-loss'
  });

  useEffect(() => {
    fetchDietPlans();
  }, []);

  const fetchDietPlans = async () => {
    setLoading(true);
    try {
      const data = await dietPlanApi.list();
      setDietPlans(data);
    } catch (error) {
      toast.error('Error fetching diet plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        mealPlan: formData.mealPlan,
        category: formData.category,
        calories: parseInt(formData.calories, 10),
        durationWeeks: parseInt(formData.duration, 10)
      };
      if (editingPlan) {
        await dietPlanApi.update(editingPlan.id, payload);
        toast.success('Diet plan updated successfully');
      } else {
        await dietPlanApi.create(payload);
        toast.success('Diet plan added successfully');
      }
      setShowForm(false);
      setEditingPlan(null);
      setFormData({
        title: '',
        description: '',
        mealPlan: '',
        calories: '',
        duration: '',
        category: 'weight-loss'
      });
      fetchDietPlans();
    } catch (error) {
      toast.error('Error saving diet plan');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      title: plan.title || '',
      description: plan.description || '',
      mealPlan: plan.mealPlan || '',
      calories: plan.calories || '',
      duration: plan.durationWeeks || '',
      category: plan.category || 'weight-loss'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this diet plan?')) {
      try {
        await dietPlanApi.remove(id);
        toast.success('Diet plan deleted successfully');
        fetchDietPlans();
      } catch (error) {
        toast.error('Error deleting diet plan');
      }
    }
  };

  return (
    <div className="diet-details">
      <div className="card">
        <div className="card-header">
          <h2>Diet Details Management</h2>
          <button className="btn btn-primary" onClick={() => {
            setShowForm(true);
            setEditingPlan(null);
            setFormData({
              title: '',
              description: '',
              mealPlan: '',
              calories: '',
              duration: '',
              category: 'weight-loss'
            });
          }}>
            Add Diet Plan
          </button>
        </div>

        {showForm && (
          <div className="form-modal">
            <div className="modal-content">
              <h3>{editingPlan ? 'Edit Diet Plan' : 'Add New Diet Plan'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                    <option value="weight-loss">Weight Loss</option>
                    <option value="muscle-gain">Muscle Gain</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="cutting">Cutting</option>
                    <option value="bulking">Bulking</option>
                  </select>
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
                  <label className="form-label">Meal Plan</label>
                  <textarea
                    className="form-control"
                    value={formData.mealPlan}
                    onChange={(e) => setFormData({ ...formData, mealPlan: e.target.value })}
                    rows="5"
                    placeholder="Breakfast: ...&#10;Lunch: ...&#10;Dinner: ...&#10;Snacks: ..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Daily Calories</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    required
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (weeks)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                    min="1"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : editingPlan ? 'Update' : 'Add'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowForm(false);
                      setEditingPlan(null);
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
          <div className="diet-plans-list">
            {dietPlans.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '20px' }}>No diet plans found</p>
            ) : (
              dietPlans.map((plan) => (
                <div key={plan.id} className="diet-plan-card">
                  <div className="diet-plan-header">
                    <h3>{plan.title}</h3>
                    <span className="category-badge">{plan.category}</span>
                  </div>
                  <p className="description">{plan.description}</p>
                  <div className="diet-plan-details">
                    <div className="detail-item">
                      <strong>Calories:</strong> {plan.calories} kcal/day
                    </div>
                    <div className="detail-item">
                      <strong>Duration:</strong> {plan.duration} weeks
                    </div>
                  </div>
                  <div className="meal-plan-section">
                    <strong>Meal Plan:</strong>
                    <pre className="meal-plan-text">{plan.mealPlan}</pre>
                  </div>
                  <div className="diet-plan-actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleEdit(plan)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(plan.id)}
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

export default DietDetails;

