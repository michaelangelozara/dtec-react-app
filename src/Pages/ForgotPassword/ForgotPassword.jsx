import React from 'react';
import { Helmet } from 'react-helmet';
import NDTC from '../../Images/NDTC.svg';

function ForgotPassword() {
  const handleResetPassword = () => {
    // Add reset password logic here
    console.log('Password reset process initiated');
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
          <p className="mb-6 text-center text-sm text-gray-600">
            Click the button below to reset your password.
          </p>
          <button
            onClick={handleResetPassword}
            className="w-full p-3 text-white bg-green-700 rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Reset Password
          </button>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
