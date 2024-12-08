import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import Banner from '../../Images/banner.svg';
import DT from '../../Images/DT.svg';
import EC from '../../Images/EC.svg';

function Dashboard() {
  const navigate = useNavigate();


  return (
    <>
      <Helmet>
        <title>Dashboard</title>
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
        <div className="py-10 px-10">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, Xtian!</h1>
          <p className="mt-2 text-gray-600">Select your Transaction</p>
          <hr className="mt-4 border-gray-300" />
        </div>

        {/* Button Options */}
        <div className="flex justify-center space-x-8 mt-10">
          <button  onClick={() => navigate('/user/document-tracking')} className="text-2xl w-80  bg-green-700 hover:bg-green-800 text-white font-bold py-6 px-10 rounded-lg flex items-center flex-col">
            <img src={DT} alt="Document Tracking" className="ml-4 w-6 h-6 mb-4 " />
            Document Tracking
          </button>
          <button onClick={() => navigate('/user/e-clearance')} className="text-2xl flex-col w-80 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-6 px-10  rounded-lg flex items-center">
            <img src={EC} alt="E-Clearance" className="items-center w-7 h-7 ml-3 mb-4 " />
            E-Clearance
          </button>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
