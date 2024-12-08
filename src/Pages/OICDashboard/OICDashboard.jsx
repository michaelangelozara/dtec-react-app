import React from "react";
import { FaUserCircle, FaBell } from "react-icons/fa";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Banner from "../../Images/banner.svg";
import PendingIcon from "../../Images/pending.png";
import ApprovedIcon from "../../Images/approved.png";
import DeclinedIcon from "../../Images/declined.png";

function OICDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>OIC Dashboard</title>
      </Helmet>

      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-green-800 py-4 px-6 flex justify-between items-center">
          <img src={Banner} alt="Banner Logo" className="h-16" />
          <div className="flex items-center space-x-4">
            <FaBell className="text-white text-xl" />
            <FaUserCircle className="text-white text-2xl" />
          </div>
        </div>

        {/* Welcome Message */}
        <div className="py-10 px-10">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, Office In-Charge!</h1>
          <p className="mt-2 text-gray-600">Here is an overview of your dashboard.</p>
          <hr className="mt-4 border-gray-300" />
        </div>

        {/* Cards Section */}
        <div className="flex justify-center space-x-8 mt-10">
          {/* Pending Transactions */}
          <div
            className="w-80 h-40 bg-green-700 hover:bg-green-800 text-white font-bold rounded-lg relative flex flex-col justify-center items-center cursor-pointer"
            onClick={() => navigate("/pending-transactions")}
          >
            <img
              src={PendingIcon}
              alt="Pending Icon"
              className="absolute top-4 left-4 w-10 h-10"
            />
            <h2 className="text-6xl font-extrabold">5</h2>
            <p className="text-2xl mt-2">Pending Transactions</p>
          </div>

          {/* Declined Transactions */}
          <div
            className="w-80 h-40 bg-green-700 hover:bg-green-800 text-white font-bold rounded-lg relative flex flex-col justify-center items-center cursor-pointer"
            onClick={() => navigate("/declined-transactions")}
          >
            <img
              src={DeclinedIcon}
              alt="Declined Icon"
              className="absolute top-4 left-4 w-10 h-10"
            />
            <h2 className="text-6xl font-extrabold">5</h2>
            <p className="text-2xl mt-2">Declined Transactions</p>
          </div>

          {/* Approved Transactions */}
          <div
            className="w-80 h-40 bg-green-700 hover:bg-green-800 text-white font-bold rounded-lg relative flex flex-col justify-center items-center cursor-pointer"
            onClick={() => navigate("/approved-transactions")}
          >
            <img
              src={ApprovedIcon}
              alt="Approved Icon"
              className="absolute top-4 left-4 w-12 h-12"
            />
            <h2 className="text-6xl font-extrabold">5</h2>
            <p className="text-2xl mt-2">Approved Transactions</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default OICDashboard;
