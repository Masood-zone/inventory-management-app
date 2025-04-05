import React from "react";
import ReactDOM from "react-dom/client";
import Receipt from "../components/receipt";
import { Product, Sale } from "../types";

interface PrintReceiptOptions {
  sale: Sale;
  product: Product;
  companyName: string;
  companyEmail: string;
  currency: string;
  receiptNumber?: string;
}

export const printReceipt = (options: PrintReceiptOptions): void => {
  // Create a new window for printing
  const printWindow = window.open("", "_blank", "width=800,height=600");

  if (!printWindow) {
    alert("Please allow pop-ups to print receipts");
    return;
  }

  // Write initial HTML
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Receipt #${options.sale.id}</title>
        <style>
          @media print {
            body {
              font-family: 'Helvetica', 'Arial', sans-serif;
              color: black;
              background-color: white;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .receipt-container {
              width: 80mm;
              margin: 0 auto;
              padding: 10mm;
            }
            @page {
              size: 80mm 297mm;
              margin: 0;
            }
          }
          
          body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: white;
            color: black;
          }
          
          .receipt-container {
            width: 80mm;
            margin: 0 auto;
            padding: 10mm;
            background-color: white;
            color: black;
          }
          
          /* Add all Tailwind classes used in Receipt component */
          .p-8 { padding: 2rem; }
          .max-w-md { max-width: 28rem; }
          .mx-auto { margin-left: auto; margin-right: auto; }
          .bg-white { background-color: white; }
          .text-gray-800 { color: #1f2937; }
          .text-center { text-align: center; }
          .mb-6 { margin-bottom: 1.5rem; }
          .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
          .font-bold { font-weight: 700; }
          .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
          .mt-1 { margin-top: 0.25rem; }
          .flex { display: flex; }
          .justify-between { justify-content: space-between; }
          .text-right { text-align: right; }
          .font-semibold { font-weight: 600; }
          .border-t { border-top-width: 1px; }
          .border-b { border-bottom-width: 1px; }
          .border-gray-300 { border-color: #d1d5db; }
          .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
          .mb-4 { margin-bottom: 1rem; }
          .w-1/2 { width: 50%; }
          .w-1/6 { width: 16.666667%; }
          .mb-2 { margin-bottom: 0.5rem; }
          .pt-4 { padding-top: 1rem; }
          .mb-1 { margin-bottom: 0.25rem; }
          .text-base { font-size: 1rem; line-height: 1.5rem; }
          .mt-3 { margin-top: 0.75rem; }
          .mt-4 { margin-top: 1rem; }
        </style>
      </head>
      <body>
        <div id="receipt-root"></div>
        <script>
          // Auto print when loaded
          window.onload = function() {
            window.setTimeout(function() {
              window.print();
              window.setTimeout(function() {
                window.close();
              }, 500);
            }, 500);
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();

  // Render the Receipt component into the new window
  const receiptRoot = printWindow.document.getElementById("receipt-root");
  if (receiptRoot) {
    const root = ReactDOM.createRoot(receiptRoot);
    root.render(
      React.createElement(Receipt, {
        sale: options.sale,
        product: options.product,
        companyName: options.companyName,
        companyEmail: options.companyEmail,
        currency: options.currency,
        receiptNumber: options.receiptNumber,
      })
    );
  }
};

// Function to preview receipt before printing
export const previewReceipt = (options: PrintReceiptOptions): void => {
  // Create a new window for preview
  const previewWindow = window.open("", "_blank", "width=800,height=600");

  if (!previewWindow) {
    alert("Please allow pop-ups to preview receipts");
    return;
  }

  // Write initial HTML
  previewWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Receipt Preview #${options.sale.id}</title>
        <style>
          body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          
          .controls {
            margin-bottom: 20px;
            display: flex;
            gap: 10px;
          }
          
          button {
            padding: 8px 16px;
            background-color: #0ea5e9;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
          }
          
          button:hover {
            background-color: #0284c7;
          }
          
          .receipt-wrapper {
            background-color: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 20px;
            border-radius: 8px;
          }
          
          /* Add all Tailwind classes used in Receipt component */
          .p-8 { padding: 2rem; }
          .max-w-md { max-width: 28rem; }
          .mx-auto { margin-left: auto; margin-right: auto; }
          .bg-white { background-color: white; }
          .text-gray-800 { color: #1f2937; }
          .text-center { text-align: center; }
          .mb-6 { margin-bottom: 1.5rem; }
          .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
          .font-bold { font-weight: 700; }
          .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
          .mt-1 { margin-top: 0.25rem; }
          .flex { display: flex; }
          .justify-between { justify-content: space-between; }
          .text-right { text-align: right; }
          .font-semibold { font-weight: 600; }
          .border-t { border-top-width: 1px; }
          .border-b { border-bottom-width: 1px; }
          .border-gray-300 { border-color: #d1d5db; }
          .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
          .mb-4 { margin-bottom: 1rem; }
          .w-1/2 { width: 50%; }
          .w-1/6 { width: 16.666667%; }
          .mb-2 { margin-bottom: 0.5rem; }
          .pt-4 { padding-top: 1rem; }
          .mb-1 { margin-bottom: 0.25rem; }
          .text-base { font-size: 1rem; line-height: 1.5rem; }
          .mt-3 { margin-top: 0.75rem; }
          .mt-4 { margin-top: 1rem; }
        </style>
      </head>
      <body>
        <div class="controls">
          <button id="print-btn">Print Receipt</button>
          <button id="close-btn">Close</button>
        </div>
        <div class="receipt-wrapper">
          <div id="receipt-root"></div>
        </div>
        <script>
          document.getElementById('print-btn').addEventListener('click', function() {
            window.print();
          });
          
          document.getElementById('close-btn').addEventListener('click', function() {
            window.close();
          });
        </script>
      </body>
    </html>
  `);

  previewWindow.document.close();

  // Render the Receipt component into the new window
  const receiptRoot = previewWindow.document.getElementById("receipt-root");
  if (receiptRoot) {
    const root = ReactDOM.createRoot(receiptRoot);
    root.render(
      React.createElement(Receipt, {
        sale: options.sale,
        product: options.product,
        companyName: options.companyName,
        companyEmail: options.companyEmail,
        currency: options.currency,
        receiptNumber: options.receiptNumber,
      })
    );
  }
};
