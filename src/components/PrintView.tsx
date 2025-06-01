import React from 'react';
import { ActionItem } from '../types';

interface PrintViewProps {
  department: string;
  responsiblePerson: string;
  date: string;
  actions: ActionItem[];
}

const PrintView: React.FC<PrintViewProps> = ({ department, responsiblePerson, date, actions }) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="p-8 max-w-full mx-auto bg-white text-black">
      <style type="text/css" media="print">{`
        @page {
          size: landscape;
          margin: 0.5in;
        }
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .print-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #0369a1;
          padding-bottom: 10px;
        }
        .print-title {
          font-size: 24px;
          font-weight: bold;
          color: #0369a1;
        }
        .print-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .print-info-item {
          margin-bottom: 10px;
        }
        .print-info-label {
          font-weight: bold;
          margin-right: 5px;
        }
        .print-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .print-table th {
          background-color: #f1f5f9;
          color: #334155;
          font-weight: bold;
          text-align: left;
          padding: 10px;
          border: 1px solid #cbd5e1;
        }
        .print-table td {
          padding: 10px;
          border: 1px solid #cbd5e1;
          vertical-align: top;
        }
        .print-completed {
          background-color: #f0fdf4;
        }
        .print-completed td {
          text-decoration: line-through;
          color: #64748b;
        }
        .print-checkbox {
          width: 16px;
          height: 16px;
          border: 1px solid #cbd5e1;
          display: inline-block;
          position: relative;
        }
        .print-checkbox.checked:after {
          content: '✓';
          position: absolute;
          top: -3px;
          left: 2px;
          font-size: 14px;
        }
        @media screen {
          .print-only {
            margin: 20px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
        }
      `}</style>

      <div className="print-only">
        <div className="print-header">
          <div className="print-title">Action List</div>
          <div className="print-date">{formatDate(date)}</div>
        </div>

        <div className="print-info">
          <div className="print-info-item">
            <span className="print-info-label">Department:</span>
            <span>{department || 'N/A'}</span>
          </div>
          <div className="print-info-item">
            <span className="print-info-label">Responsible Person:</span>
            <span>{responsiblePerson || 'N/A'}</span>
          </div>
        </div>

        <table className="print-table">
          <thead>
            <tr>
              <th style={{ width: '25%' }}>Action</th>
              <th style={{ width: '30%' }}>How It Will Be Accomplished</th>
              <th style={{ width: '15%' }}>Who</th>
              <th style={{ width: '15%' }}>When</th>
              <th style={{ width: '5%' }}>Done</th>
            </tr>
          </thead>
          <tbody>
            {actions.map((action) => (
              <tr key={action.id} className={action.done ? 'print-completed' : ''}>
                <td>{action.action}</td>
                <td>{action.how}</td>
                <td>{action.who}</td>
                <td>{formatDate(action.when)}</td>
                <td style={{ textAlign: 'center' }}>
                  <div className={`print-checkbox ${action.done ? 'checked' : ''}`}></div>
                </td>
              </tr>
            ))}
            {actions.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                  No actions have been added.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={{ marginTop: '30px', fontSize: '12px', color: '#64748b', textAlign: 'center' }}>
          Printed on {new Date().toLocaleDateString()} from Action List Manager
        </div>
      </div>
    </div>
  );
};

export default PrintView;
