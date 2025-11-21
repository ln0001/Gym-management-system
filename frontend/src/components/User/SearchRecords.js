import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { memberApi, billApi, supplementApi } from '../../api/gymApi';

const SearchRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('members');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.warning('Please enter a search term');
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      if (searchType === 'members') {
        const data = await memberApi.search(searchTerm);
        setResults(data);
      } else if (searchType === 'bills') {
        const data = await billApi.search(searchTerm);
        setResults(data);
      } else if (searchType === 'supplements') {
        const data = await supplementApi.list(searchTerm);
        setResults(data);
      }
    } catch (error) {
      toast.error('Error searching records');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-records">
      <div className="card">
        <div className="card-header">
          <h2>Search Records</h2>
        </div>

        <div className="search-controls">
          <div className="form-group">
            <label className="form-label">Search Type</label>
            <select
              className="form-control"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              style={{ width: '200px' }}
            >
              <option value="members">Members</option>
              <option value="bills">Bills</option>
              <option value="supplements">Supplements</option>
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Search Term</label>
            <input
              type="text"
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter search term..."
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : results.length > 0 ? (
          <div className="search-results">
            <h3>Search Results ({results.length})</h3>
            {searchType === 'members' && (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.id}>
                      <td>{result.name}</td>
                      <td>{result.email}</td>
                      <td>{result.phone}</td>
                      <td>
                        <span className={`status-badge ${result.status}`}>
                          {result.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {searchType === 'bills' && (
              <table className="table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Amount</th>
                    <th>Description</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.id}>
                      <td>{result.memberName || 'N/A'}</td>
                      <td>${result.amount?.toFixed(2) || '0.00'}</td>
                      <td>{result.description}</td>
                      <td>{result.dueDate}</td>
                      <td>
                        <span className={`status-badge ${result.status}`}>
                          {result.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {searchType === 'supplements' && (
              <div className="supplements-grid">
                {results.map((result) => (
                  <div key={result.id} className="supplement-card">
                    <h4>{result.name}</h4>
                    <p className="category">{result.category}</p>
                    <p className="description">{result.description}</p>
                    <div className="supplement-footer">
                      <span className="price">${result.price?.toFixed(2) || '0.00'}</span>
                      <span className={`stock ${result.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        Stock: {result.stock}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : searchTerm && !loading ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>No results found</p>
        ) : null}
      </div>
    </div>
  );
};

export default SearchRecords;

