import React from 'react';
import { Helmet } from 'react-helmet';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import Banner from '../../Images/banner.svg';
import newTransactionIcon from '../../Images/nt.svg';
import myTransactionIcon from '../../Images/mt.svg';

function EClearance() {

  const navigateLogin = () => {
    window.location.href  = '/user/clearance-form';
  }

  const navigateMyTransactions = () => {
    window.location.href  = '/user/my-transactions';
  }

  return (
    <>
      <Helmet>
        <title>E-Clearance</title>
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

        {/* Welcome Message */}
        <div className="p-8">

       
        <div  className="flex justify-between ">

        <div className='flex flex-col'>
        <h1 className="text-3xl font-bold">Welcome, Xtian!</h1>
        <p className="text-sm text-gray-600">Select your Transaction</p>
        </div>
        <div className='left-96'><h2 className="text-3xl font-bold mb-8 ">E-Clearance</h2></div>
        </div>


        <div className="border-b border-gray-400 w-full my-2"></div>

         {/* Transaction Buttons */}
         <div className="flex flex-wrap justify-center gap-8 mt-">

        {/* Button Options */}
        <div className="flex justify-center space-x-8 mt-10">
        <a  onClick={navigateLogin} className="bg-yellow-500 text-white font-bold py-8 px-12 rounded-lg flex flex-col items-center justify-center hover:bg-yellow-600 transition-colors w-72 h-45">
            <img src={newTransactionIcon} alt="New Transaction" className="h-12 mb-2" />
            New Transaction
            <span className="text-sm font-normal">Create New Request</span>
          </a>
          <a onClick={navigateMyTransactions} className="bg-yellow-500 text-white font-bold py-8 px-12 rounded-lg flex flex-col items-center justify-center hover:bg-yellow-600 transition-colors w-72 h-45">
            <img src={myTransactionIcon} alt="My Transaction" className="h-12 mb-2" />
            My Transaction
            <span className="text-sm font-normal">S.Y. 2024-2025</span>
          </a>
        </div>
      </div>
      </div>
      </div>
    </>
  );
}

export default EClearance;
