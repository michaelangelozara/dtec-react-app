import React from 'react';
import { Helmet } from 'react-helmet';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import Banner from '../../Images/banner.svg';

const transactions = [
  {
    officeName: 'Program Head',
    officeInCharge: 'Mr. Michael Angelo B. Zara',
    dateTime: '2024-08-25 14:30',
    notes: 'Completed all required forms.',
    status: 'Completed' // Add status for each transaction
  },
  {
    officeName: 'Computer Science Lab',
    officeInCharge: 'Mr. Joshua D. Lazaro',
    dateTime: '2024-08-24 09:15',
    notes: 'Pending additional clearance.',
    status: 'Pending' // Add status for each transaction
  },
  // Add more transactions as needed
];

function MyTransactionPage() {
  return (
    <>
      <Helmet>
        <title>My Transactions</title>
      </Helmet>

      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-green-800 py-4 px-6 flex justify-between items-center">
          <img src={Banner} alt="DTEC Logo" className="h-16" />
          <div className="flex items-center space-x-4">
            <FaBell className="text-white text-xl" />
            <FaUserCircle className="text-white text-2xl" />
          </div>
        </div>

        {/* Page Title */}
        <div className="p-8">
          <h1 className="text-3xl font-bold">My Transactions</h1>
          <p className="text-sm">Track your clearance transactions here</p>
          <div className="border-b border-gray-300 my-4"></div> {/* Gray line */}
        </div>

        {/* Transaction Table */}
        <div className="p-8 max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200 border-b border-gray-300">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Office Name</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Office In-Charge</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Date & Time</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Notes</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Status</th> {/* Add Status column */}
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index} className="border-b border-gray-300">
                  <td className="py-3 px-4 text-sm text-gray-700">{transaction.officeName}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{transaction.officeInCharge}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{transaction.dateTime}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{transaction.notes}</td>
                  <td className={`py-3 px-4 text-sm font-bold ${transaction.status === 'Completed' ? 'text-green-600' : 'text-red-600'}`}>{transaction.status}</td> {/* Status with color */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default MyTransactionPage;
