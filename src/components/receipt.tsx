import React from "react";
import type { Product, Sale } from "../types";
import { format } from "date-fns";

interface ReceiptProps {
  sale: Sale;
  product: Product;
  companyName: string;
  companyEmail: string;
  currency: string;
  receiptNumber?: string;
}

const Receipt = React.forwardRef<HTMLDivElement, ReceiptProps>(
  (
    { sale, product, companyName, companyEmail, currency, receiptNumber },
    ref
  ) => {
    // Generate receipt number if not provided
    const receiptId =
      receiptNumber || `REC-${sale.id.toString().padStart(6, "0")}`;

    // Format date
    const saleDate = new Date(sale.date);
    const formattedDate = format(saleDate, "MMM dd, yyyy");
    const formattedTime = format(saleDate, "hh:mm a");

    // Calculate tax (assuming 10% tax)
    const subtotal = sale.total;
    const taxRate = 0.1;
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    // Format currency
    const formatCurrency = (amount: number) => {
      const symbol =
        currency === "USD"
          ? "$"
          : currency === "EUR"
          ? "€"
          : currency === "GBP"
          ? "£"
          : currency === "JPY"
          ? "¥"
          : "$";

      return `${symbol}${amount.toFixed(2)}`;
    };

    return (
      <div
        ref={ref}
        className="receipt-container p-8 max-w-md mx-auto bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 print:text-black print:bg-white"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold">{companyName}</h1>
          <p className="text-sm">{companyEmail}</p>
          <p className="text-sm mt-1">Tel: (555) 123-4567</p>
          <p className="text-sm">123 Business Street, City, Country</p>
        </div>

        {/* Receipt Info */}
        <div className="flex justify-between mb-6 text-sm">
          <div>
            <p>
              <span className="font-semibold">Receipt:</span> {receiptId}
            </p>
            <p>
              <span className="font-semibold">Date:</span> {formattedDate}
            </p>
          </div>
          <div className="text-right">
            <p>
              <span className="font-semibold">Time:</span> {formattedTime}
            </p>
            <p>
              <span className="font-semibold">Customer:</span> {sale.customer}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-b border-gray-300 dark:border-gray-600 print:border-gray-300 py-2 mb-4">
          <div className="flex font-semibold text-sm">
            <div className="w-1/2">Item</div>
            <div className="w-1/6 text-right">Price</div>
            <div className="w-1/6 text-right">Qty</div>
            <div className="w-1/6 text-right">Total</div>
          </div>
        </div>

        {/* Items */}
        <div className="mb-6">
          <div className="flex text-sm mb-2">
            <div className="w-1/2">{product.name}</div>
            <div className="w-1/6 text-right">
              {formatCurrency(product.price)}
            </div>
            <div className="w-1/6 text-right">{sale.quantity}</div>
            <div className="w-1/6 text-right">{formatCurrency(subtotal)}</div>
          </div>
        </div>

        {/* Totals */}
        <div className="border-t border-gray-300 dark:border-gray-600 print:border-gray-300 pt-4 mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Tax ({(taxRate * 100).toFixed(0)}%):</span>
            <span>{formatCurrency(taxAmount)}</span>
          </div>
          <div className="flex justify-between font-bold text-base mt-3">
            <span>Total:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Payment Info */}
        <div className="text-center text-sm mb-6">
          <p className="font-semibold">Payment Method</p>
          <p>Cash</p>
        </div>

        {/* Footer */}
        <div className="text-center text-sm">
          <p className="mb-2">Thank you for your business!</p>
          <p>Please keep this receipt for your records.</p>
          <p className="mt-4">www.yourcompany.com</p>
        </div>
      </div>
    );
  }
);

Receipt.displayName = "Receipt";

export default Receipt;
