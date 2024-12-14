import React, { useState } from "react";
import { FaEye, FaCheck, FaTimes } from "react-icons/fa";
import PrimaryNavBar from "../../Components/NavBar/PrimaryNavBar";

function PendingTransaction() {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "Clearance Request",
      requestedBy: "John Doe",
      dateRequested: "2024-11-25",
    },
    {
      id: 2,
      type: "Document/Letter Request",
      requestedBy: "Jane Smith",
      dateRequested: "2024-11-26",
    },
  ]);

  const handleView = (transaction) => {
    alert(`Viewing details for: ${transaction.type} by ${transaction.requestedBy}`);
  };

  const handleApprove = (id) => {
    const confirmed = window.confirm("Are you sure you want to approve this request?");
    if (confirmed) {
      setTransactions(transactions.filter((transaction) => transaction.id !== id));
    }
  };

  const handleDecline = (id) => {
    const confirmed = window.confirm("Are you sure you want to decline this request?");
    if (confirmed) {
      setTransactions(transactions.filter((transaction) => transaction.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <PrimaryNavBar />

      {/* Heading */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Pending Transactions
        </h2>
      </div>

      {/* Table */}
      <div className="p-8">
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 bg-white shadow-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Transaction Type
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Requested By
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Date Requested
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                    {transaction.type}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                    {transaction.requestedBy}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                    {transaction.dateRequested}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-600">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-lg mx-1"
                      onClick={() => handleView(transaction)}
                    >
                      <FaEye className="inline" /> View
                    </button>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-lg mx-1"
                      onClick={() => handleApprove(transaction.id)}
                    >
                      <FaCheck className="inline" /> Approve
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg mx-1"
                      onClick={() => handleDecline(transaction.id)}
                    >
                      <FaTimes className="inline" /> Decline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PendingTransaction;
