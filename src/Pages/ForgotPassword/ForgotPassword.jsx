import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import NDTC from '../../Images/NDTC.svg';
import axios from "../../api/AxiosConfig";
import { useDispatch } from 'react-redux';
import { showModal } from '../../states/slices/ModalSlicer';
import Modal from "../../Components/modal/Modal";
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      const response = await axios.put(`/auth/forgot-password?e=${email}`);
      if (response.status === 200) {
        setTimeout(() => {
          navigate("/login-user");
        }, 2000);
        dispatch(showModal({ message: response?.data?.message }));
      }
    } catch (err) {
      switch (err.status) {
        case 403:
          dispatch(showModal({ message: err.response?.data.message }));
          break;
        case 404:
          dispatch(showModal({ message: err.response?.data.message }));
          break;
        case 500:
          dispatch(showModal({ message: err.response?.data.message }));
          break;
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password</title>
      </Helmet>

      <div className="flex items-center justify-center min-h-screen bg-green-800">
        <div className="bg-white rounded-lg shadow-lg p-8 w-96">
          <div className="flex justify-center">
            <img src={NDTC} alt="School Logo" className="w-24 h-24 mb-6" />
          </div>
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-700">
            Forgot Password
          </h2>
          <div className='space-y-5'>
            <input onChange={(e) => setEmail(e.target.value)} className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500' type="email" placeholder='Email' />
            <button
              onClick={handleResetPassword}
              className="w-full p-3 text-white bg-green-700 rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>
      <Modal />
    </>
  );
}

export default ForgotPassword;
