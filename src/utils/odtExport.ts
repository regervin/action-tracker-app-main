import { TextDocument, ParagraphStyle, TableStyle, TableColumnStyle, TableRowStyle, TableCellStyle } from 'wasm-odf';
import { saveAs } from 'file-saver';
import { ActionItem, AppData } from '../types';

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

export const exportToODT = async (data: AppData): Promise<void> => {
  const { department, responsiblePerson, date, actions } = data;
  
  // Create a new text document
  const doc = new TextDocument();
  
  // Define styles
  const titleStyle = new ParagraphStyle('TitleStyle');
  titleStyle.setFontSize(18);
  titleStyle.setFontWeight('bold');
  titleStyle.setColor('#0369a1');
  titleStyle.setMarginBottom(10);
  doc.addStyle(titleStyle);
  
  const headerStyle = new ParagraphStyle('HeaderStyle');
  headerStyle.setFontSize(14);
  headerStyle.setFontWeight('bold');
  headerStyle.setMarginTop(10);
  headerStyle.setMarginBottom(5);
  doc.addStyle(headerStyle);
  
  const normalStyle = new ParagraphStyle('NormalStyle');
  normalStyle.setFontSize(11);
  normalStyle.setMarginBottom(5);
  doc.addStyle(normalStyle);
  
  const infoLabelStyle = new ParagraphStyle('InfoLabelStyle');
  infoLabelStyle.setFontSize(11);
  infoLabelStyle.setFontWeight('bold');
  infoLabelStyle.setMarginBottom(2);
  doc.addStyle(infoLabelStyle);
  
  // Table styles
  const tableStyle = new TableStyle('ActionTable');
  tableStyle.setBorderWidth(1);
  tableStyle.setBorderColor('#cbd5e1');
  tableStyle.setWidth('100%');
  tableStyle.setMarginTop(10);
  tableStyle.setMarginBottom(10);
  doc.addStyle(tableStyle);
  
  const tableHeaderStyle = new TableRowStyle('TableHeader');
  tableHeaderStyle.setBackgroundColor('#f1f5f9');
  tableHeaderStyle.setFontWeight('bold');
  doc.addStyle(tableHeaderStyle);
  
  const tableCellStyle = new TableCellStyle('TableCell');
  tableCellStyle.setPadding(5);
  tableCellStyle.setBorderWidth(1);
  tableCellStyle.setBorderColor('#cbd5e1');
  doc.addStyle(tableCellStyle);
  
  const completedCellStyle = new TableCellStyle('CompletedCell');
  completedCellStyle.setPadding(5);
  completedCellStyle.setBorderWidth(1);
  completedCellStyle.setBorderColor('#cbd5e1');
  completedCellStyle.setBackgroundColor('#f0fdf4');
  completedCellStyle.setColor('#64748b');
  doc.addStyle(completedCellStyle);
  
  // Add title
  doc.addParagraph('Action List', 'TitleStyle');
  
  // Add date
  doc.addParagraph(`Date: ${formatDate(date)}`, 'NormalStyle');
  
  // Add info section
  doc.addParagraph('Project Information:', 'HeaderStyle');
  doc.addParagraph(`Department: ${department || 'N/A'}`, 'NormalStyle');
  doc.addParagraph(`Responsible Person: ${responsiblePerson || 'N/A'}`, 'NormalStyle');
  
  // Add actions table
  doc.addParagraph('Action Items:', 'HeaderStyle');
  
  // Create table with 5 columns
  const table = doc.addTable(actions.length + 1, 5, 'ActionTable');
  
  // Add table header
  table.setCell(0, 0, 'Action', 'TableHeader');
  table.setCell(0, 1, 'How It Will Be Accomplished', 'TableHeader');
  table.setCell(0, 2, 'Who', 'TableHeader');
  table.setCell(0, 3, 'When', 'TableHeader');
  table.setCell(0, 4, 'Done', 'TableHeader');
  
  // Set column widths
  table.setColumnWidth(0, '25%');
  table.setColumnWidth(1, '30%');
  table.setColumnWidth(2, '15%');
  table.setColumnWidth(3, '15%');
  table.setColumnWidth(4, '5%');
  
  // Add action items
  actions.forEach((action, index) => {
    const rowIndex = index + 1;
    const cellStyle = action.done ? 'CompletedCell' : 'TableCell';
    
    table.setCell(rowIndex, 0, action.action, cellStyle);
    table.setCell(rowIndex, 1, action.how, cellStyle);
    table.setCell(rowIndex, 2, action.who, cellStyle);
    table.setCell(rowIndex, 3, formatDate(action.when), cellStyle);
    table.setCell(rowIndex, 4, action.done ? '✓' : '', cellStyle);
  });
  
  // Add footer
  doc.addParagraph(`Generated on ${new Date().toLocaleDateString()} from Action List Manager`, 'NormalStyle');
  
  // Generate and save the document
  const blob = await doc.saveAsBlob();
  const fileName = `Action_List_${department ? department.replace(/\s+/g, '_') : 'Report'}_${new Date().toISOString().split('T')[0]}.odt`;
  saveAs(blob, fileName);
};

export default exportToODT;
