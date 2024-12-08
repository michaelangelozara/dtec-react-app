import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import NDTC from '../../Images/NDTC.svg';

function RegisterPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Add registration logic here
    console.log('User registered');
  };

  return (
    <>
      <Helmet>
        <title>Register</title>
      </Helmet>

      <div className="flex items-center justify-center min-h-screen bg-green-800">
        <div className="bg-white rounded-lg shadow-lg p-8 w-96">
          <div className="flex justify-center">
            <img src={NDTC} alt="School Logo" className="w-24 h-24 mb-6" />
          </div>
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-700">Register</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Last Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="First Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Middle Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="ID Number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-4 relative">
              <input
                type={passwordVisible ? 'text' : 'password'}
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                {passwordVisible ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="mb-6 relative">
              <input
                type={confirmPasswordVisible ? 'text' : 'password'}
                placeholder="Confirm Password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                {confirmPasswordVisible ? 'Hide' : 'Show'}
              </button>
            </div>
            <button
              type="submit"
              className="w-full p-3 text-white bg-green-700 rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Register
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login-user" className="text-green-700 hover:text-green-900 font-semibold">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
