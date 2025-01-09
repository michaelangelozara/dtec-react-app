import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import DT from '../../Images/DT.svg';
import EC from '../../Images/EC.svg';
import { useDispatch, useSelector } from 'react-redux';
import Modal from "../../Components/modal/Modal";
import { navigateRouteByRole } from '../../services/RouteUtil';
import { moderatorRole } from '../../services/UserUtil';
import { fetchUser } from '../../states/slices/UserSlicer';
import PrimaryNavBar from '../../Components/NavBar/PrimaryNavBar';

function ModeratorDashboard() {
  const navigate = useNavigate();
  const { user, status } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser())
    }

    if (user && !moderatorRole.includes(user.role)) {
      navigate(navigateRouteByRole(user));
    }
  }, [dispatch, user, status]);
  return (
    <>
      {status === "Succeeded" && (
        <>
          <Helmet>
            <title>Moderator Dashboard</title>
          </Helmet>

          <div className="min-h-screen bg-gray-100">
            <PrimaryNavBar />

            {/* Welcome Message */}
            <div className="py-10 px-10">
              <h1 className="text-3xl font-bold text-gray-800">Welcome, Moderator!</h1>
              <p className="mt-2 text-gray-600">Select your Transaction</p>
              <hr className="mt-4 border-gray-300" />
            </div>

            {/* Button Options */}
            <div className="flex justify-center space-x-8 mt-10">
              <button onClick={() => navigate('/user/moderator-transaction')} className="text-2xl w-80 bg-green-700 hover:bg-green-800 text-white font-bold py-6 px-10 rounded-lg flex items-center flex-col">
                <img src={DT} alt="Transactions" className="ml-4 w-6 h-6 mb-4" />
                Transactions
              </button>
              <button onClick={() => navigate('/user/e-clearance')} className="text-2xl flex-col w-80 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-6 px-10 rounded-lg flex items-center">
                <img src={EC} alt="E-Clearance" className="items-center w-7 h-7 ml-3 mb-4" />
                E-Clearance
              </button>
            </div>
          </div>
          <Modal />
        </>
      )}
    </>
  );
}

export default ModeratorDashboard;