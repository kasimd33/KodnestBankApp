/**
 * PDF Statement Download using jsPDF
 */
import jsPDF from "jspdf";

export const downloadStatement = (transactions, accountNumber = "") => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Kodnest Bank - Account Statement", 20, 20);
  if (accountNumber) {
    doc.setFontSize(12);
    doc.text(`Account: ${accountNumber}`, 20, 28);
  }
  doc.setFontSize(10);

  let y = 45;
  doc.text("Date", 20, y);
  doc.text("Type", 60, y);
  doc.text("Amount", 120, y);
  y += 8;

  transactions.forEach((txn) => {
    const date = new Date(txn.createdAt || txn.date).toLocaleDateString();
    doc.text(`${date}`, 20, y);
    doc.text(`${txn.type}`, 60, y);
    doc.text(`₹${txn.amount}`, 120, y);
    y += 8;
  });

  doc.save(`statement-${accountNumber || "all"}.pdf`);
};
