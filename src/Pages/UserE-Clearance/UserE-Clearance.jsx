import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import Banner from '../../Images/banner.svg';
import newTransactionIcon from '../../Images/nt.svg';
import myTransactionIcon from '../../Images/mt.svg';
import PrimaryNavBar from '../../Components/NavBar/PrimaryNavBar';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { navigateRouteByRole } from '../../services/RouteUtil';
import { studentAndPersonnelRole } from '../../services/UserUtil';
import { fetchUser } from '../../states/slices/UserSlicer';

function EClearance() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {user, status} = useSelector((state) => state.user);

  const navigateNewTransaction = () => {
    navigate('/user/clearance-form');
  }

  const navigateMyTransactions = () => {
    navigate('/user/my-transactions');
  }

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user, status]);

  return (
    <>
      <Helmet>
        <title>E-Clearance</title>
      </Helmet>

      <div className="min-h-screen bg-gray-100">
        <PrimaryNavBar />

        {/* Welcome Message */}
        <div className="p-8">


          <div className="flex justify-between ">

            <div className='flex flex-col'>
              <h1 className="text-3xl font-bold">Welcome, {user?.middle_name ? user?.first_name + " " + user?.middle_name[0] + ". " + user?.lastname : user?.first_name + " "  + user?.lastname}!</h1>
              <p className="text-sm text-gray-600">Select your Transaction</p>
            </div>
            <div className='left-96'><h2 className="text-3xl font-bold mb-8 ">E-Clearance</h2></div>
          </div>


          <div className="border-b border-gray-400 w-full my-2"></div>

          {/* Transaction Buttons */}
          <div className="flex flex-wrap justify-center gap-8 mt-">

            {/* Button Options */}
            <div className="flex justify-center space-x-8 mt-10">
              <a onClick={navigateNewTransaction} className="bg-yellow-500 text-white font-bold py-8 px-12 rounded-lg flex flex-col items-center justify-center hover:bg-yellow-600 transition-colors w-72 h-45">
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