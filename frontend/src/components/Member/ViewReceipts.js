import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { billApi, memberApi } from '../../api/gymApi';

const ViewReceipts = () => {
  const { currentUser } = useAuth();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReceipts = useCallback(async () => {
    setLoading(true);
    try {
      const member = await memberApi.findByEmail(currentUser?.email);
      if (!member) {
        toast.warning('Member profile not found');
        setLoading(false);
        return;
      }

      const bills = await billApi.listByMember(member.id);
      setReceipts(
        bills.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    } catch (error) {
      toast.error('Error fetching receipts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.email) {
      fetchReceipts();
    }
  }, [currentUser, fetchReceipts]);

  const printReceipt = (receipt) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${receipt.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .receipt-header { text-align: center; margin-bottom: 30px; }
            .receipt-details { margin: 20px 0; }
            .receipt-details p { margin: 10px 0; }
            .receipt-footer { margin-top: 30px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="receipt-header">
            <h1>GYM Management System</h1>
            <h2>Payment Receipt</h2>
          </div>
          <div class="receipt-details">
            <p><strong>Receipt ID:</strong> ${receipt.id}</p>
            <p><strong>Amount:</strong> $${receipt.amount?.toFixed(2) || '0.00'}</p>
            <p><strong>Description:</strong> ${receipt.description}</p>
            <p><strong>Due Date:</strong> ${receipt.dueDate}</p>
            <p><strong>Status:</strong> ${receipt.status}</p>
            <p><strong>Date:</strong> ${receipt.createdAt ? new Date(receipt.createdAt).toLocaleString() : 'N/A'}</p>
          </div>
          <div class="receipt-footer">
            <p>Thank you for your payment!</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="view-receipts">
      <div className="card">
        <div className="card-header">
          <h2>Bill Receipts</h2>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : receipts.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>No receipts found</p>
        ) : (
          <div className="receipts-list">
            {receipts.map((receipt) => (
              <div key={receipt.id} className="receipt-card">
                <div className="receipt-header-section">
                  <h3>Receipt #{receipt.id}</h3>
                  <span className={`status-badge ${receipt.status}`}>
                    {receipt.status}
                  </span>
                </div>
                <div className="receipt-details-section">
                  <div className="detail-row">
                    <strong>Amount:</strong>
                    <span>${receipt.amount?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Description:</strong>
                    <span>{receipt.description}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Due Date:</strong>
                    <span>{receipt.dueDate}</span>
                  </div>
                  <div className="detail-row">
                    <strong>Date:</strong>
                    <span>{new Date(receipt.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <div className="receipt-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => printReceipt(receipt)}
                  >
                    Print Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewReceipts;

