import React from 'react';
import { Helmet } from 'react-helmet';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import Banner from '../../Images/banner.svg';

const transactionsData = [
  {
    documentName: 'Implementation Letter (In-Campus)',
    currentOffice: 'Guidance Office',
    nextOffice: 'Registrar',
    dateTime: '2024-08-24 14:30',
    status: 'Pending',
    notes: 'Pending review',
  },
  {
    documentName: 'Budget Proposal',
    currentOffice: 'Finance Office',
    nextOffice: 'Department Head',
    dateTime: '2024-08-23 09:15',
    status: 'Completed',
    notes: 'Approved and forwarded',
  },
  // Add more transactions as needed
];

function MyTransactions() {
  return (
    <>
      <Helmet>
        <title>My Transactions</title>
      </Helmet>

      {/* Header Section */}
      <div className="bg-green-800 py-4 px-6 flex justify-between items-center">
        <img src={Banner} alt="DTEC Logo" className="h-16" />
        <div className="flex items-center space-x-4">
          <FaBell className="text-white text-xl" />
          <FaUserCircle className="text-white text-2xl" />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Track Your Transactions</h1>
        <div className="border-b border-gray-400 w-full my-4"></div>

        <table className="min-w-full bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="py-3 px-6 text-left">Document Name</th>
              <th className="py-3 px-6 text-left">Current Office</th>
              <th className="py-3 px-6 text-left">Next Office</th>

              <th className="py-3 px-6 text-left">Date and Time</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            {transactionsData.map((transaction, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-4 px-6">{transaction.documentName}</td>
                <td className="py-4 px-6">{transaction.currentOffice}</td>
                <td className="py-4 px-6">{transaction.nextOffice}</td>
                <td className="py-4 px-6">{transaction.dateTime}</td>
                <td className={`py-4 px-6 font-bold ${transaction.status === 'Completed' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.status}
                </td>
                <td className="py-4 px-6">{transaction.notes || 'No notes available'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default MyTransactions;
