import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { ActionItem, AppData } from '../types';

// Add the missing type for jspdf-autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Format date for display
const formatDate = (dateString: string): string => {
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

export const exportToPDF = async (data: AppData): Promise<void> => {
  const { department, responsiblePerson, date, actions } = data;
  
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(3, 105, 161); // #0369a1 (sky-700)
  doc.text('Action List', 14, 20);
  
  // Add date
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Date: ${formatDate(date)}`, 14, 30);
  
  // Add info section
  doc.setFontSize(14);
  doc.setTextColor(3, 105, 161); // #0369a1 (sky-700)
  doc.text('Project Information:', 14, 40);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Department: ${department || 'N/A'}`, 14, 48);
  doc.text(`Responsible Person: ${responsiblePerson || 'N/A'}`, 14, 56);
  
  // Add actions table
  doc.setFontSize(14);
  doc.setTextColor(3, 105, 161); // #0369a1 (sky-700)
  doc.text('Action Items:', 14, 68);
  
  // Prepare table data
  const tableHeaders = [['Action', 'How It Will Be Accomplished', 'Who', 'When', 'Done']];
  const tableData = actions.map(action => [
    action.action,
    action.how,
    action.who,
    formatDate(action.when),
    action.done ? '✓' : ''
  ]);
  
  // Create table
  doc.autoTable({
    startY: 72,
    head: tableHeaders,
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [241, 245, 249], // #f1f5f9 (slate-100)
      textColor: [51, 65, 85],    // #334155 (slate-700)
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 70 },
      2: { cellWidth: 40 },
      3: { cellWidth: 40 },
      4: { cellWidth: 20 }
    },
    didParseCell: (data) => {
      const action = actions[data.row.index];
      if (data.section === 'body' && action && action.done) {
        data.cell.styles.fillColor = [240, 253, 244]; // #f0fdf4 (green-50)
        data.cell.styles.textColor = [100, 116, 139]; // #64748b (slate-500)
      }
    }
  });
  
  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // #64748b (slate-500)
    doc.text(
      `Generated on ${new Date().toLocaleDateString()} from Action List Manager`,
      14,
      doc.internal.pageSize.height - 10
    );
  }
  
  // Generate and save the document
  const fileName = `Action_List_${department ? department.replace(/\s+/g, '_') : 'Report'}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

export default exportToPDF;
