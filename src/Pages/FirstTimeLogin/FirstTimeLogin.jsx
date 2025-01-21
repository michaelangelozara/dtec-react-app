import React, { useState } from "react";
import Modal from "../../Components/modal/Modal";
import { useDispatch } from "react-redux";
import axios from "../../api/AxiosConfig";
import { showModal } from "../../states/slices/ModalSlicer";
import { handleLogout } from "../../services/TokenUtils";
import { useSearchParams } from "react-router-dom";

function FirstTimeLogin() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();
  // this where the token stores that has a validity of 7 days
  const token = searchParams.get('t');

  const handleSubmit = async () => {
    try {
      const response = await axios.put("/auth/change-password", {
        "password1": password,
        "password2": confirmPassword,
        "token": token
      });
      console.log(response);
      if (response.status === 200) {
        setTimeout(() => {
          handleLogout();
        }, 2000);
        dispatch(showModal({ message: response?.data?.message }))
      }
    } catch (error) {
      console.log(error);
      if (error.status === 404 || error.status === 403 || error.status === 401) {
        dispatch(showModal({ message: error?.response?.data?.message }))
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-green-800">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
          First Time Login
        </h2>
        <div>
          {/* Change Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Change Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-green-700 text-white p-3 rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Submit
          </button>
        </div>
      </div>
      <Modal />
    </div>
  );
}

export default FirstTimeLogin;
