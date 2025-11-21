import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { reportApi } from '../../api/gymApi';

const ReportExport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('members');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    let isMounted = true;
    const fetchReport = async () => {
      setLoading(true);
      try {
        const data = await reportApi.fetch({
          type: reportType,
          startDate: dateRange.startDate || undefined,
          endDate: dateRange.endDate || undefined
        });
        if (isMounted) {
          setReports(data);
        }
      } catch (error) {
        toast.error('Error generating report');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchReport();
    return () => {
      isMounted = false;
    };
  }, [reportType, dateRange]);

  const exportToCSV = () => {
    if (reports.length === 0) {
      toast.warning('No data to export');
      return;
    }

    const headers = Object.keys(reports[0]);
    const csvContent = [
      headers.join(','),
      ...reports.map(row =>
        headers.map(header => {
          const value = row[header];
          return typeof value === 'object' ? JSON.stringify(value) : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Report exported successfully');
  };

  return (
    <div className="report-export">
      <div className="card">
        <div className="card-header">
          <h2>Report Export</h2>
        </div>

        <div className="report-controls">
          <div className="form-group">
            <label className="form-label">Report Type</label>
            <select
              className="form-control"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              style={{ width: '200px' }}
            >
              <option value="members">Members Report</option>
              <option value="bills">Bills Report</option>
              <option value="payments">Payments Report</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              style={{ width: '200px' }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              style={{ width: '200px' }}
            />
          </div>
          <button className="btn btn-primary" onClick={exportToCSV} disabled={loading}>
            Export to CSV
          </button>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : (
          <div className="report-summary">
            <h3>Report Summary</h3>
            <p>Total Records: {reports.length}</p>
            {reportType === 'bills' && (
              <p>
                Total Amount: $
                {reports.reduce((sum, bill) => sum + (bill.amount || 0), 0).toFixed(2)}
              </p>
            )}
            {reportType === 'payments' && (
              <p>
                Total Paid: $
                {reports.reduce((sum, bill) => sum + (bill.amount || 0), 0).toFixed(2)}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportExport;

