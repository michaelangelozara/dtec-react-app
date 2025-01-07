import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { DocumentIcon } from '@heroicons/react/24/outline';
import UserAddIcon from "../../Images/useradd.png";
import DepartmentListIcon from "../../Images/department.png";
import EditUserIcon from "../../Images/user.png";
import ClubListIcon from "../../Images/club.png";
import PrimaryNavBar from "../../Components/NavBar/PrimaryNavBar";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../states/slices/UserSlicer";
import { adminRole } from "../../services/UserUtil";
import { navigateRouteByRole } from "../../services/RouteUtil";
import axios from "../../api/AxiosConfig";
import { showModal } from "../../states/slices/ModalSlicer";
import Modal from "../../Components/modal/Modal";

function AdminDashboard() {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isClearanceModalOpen, setIsClearanceModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedClearanceType, setSelectedClearanceType] = useState(null);
  const [selectedAction, setSelectedAction] = useState("");

  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const openUserModal = () => setIsUserModalOpen(true);
  const closeUserModal = () => {
    setIsUserModalOpen(false);
    setSelectedAction("");
  };

  const openClearanceModal = () => setIsClearanceModalOpen(true);
  const closeClearanceModal = () => {
    setIsClearanceModalOpen(false);
    setSelectedClearanceType(null);
  };

  const handleClearanceClick = (type) => {
    setSelectedClearanceType(type);
    setIsConfirmationOpen(true);
  };

  const handleConfirmClearance = async () => {
    try {
      if (selectedClearanceType === "STUDENT") {
        const response = await axios.post("/admin/students/release-clearances");
        if (response.status === 201) {
          dispatch(showModal({ message: response.data?.message }));
        }
      } else {
        const response = await axios.post("/admin/personnel/release-clearances");
        if (response.status === 201) {
          dispatch(showModal({ message: response.data?.message }));
        }
      }
    } catch (error) {
      console.log(error);
      if (error.status === 404) {
        dispatch(showModal({ message: error.response?.data?.message }));
      }
    } finally {
      setIsConfirmationOpen(false);
      closeClearanceModal();
    }
  };

  const handleCancelConfirmation = () => {
    setIsConfirmationOpen(false);
    setSelectedClearanceType(null);
  };

  const handleProceed = () => {
    if (selectedAction === "") {
      alert("Please select a valid action before proceeding.");
      return;
    }
    if (selectedAction === "student-management") {
      navigate("/admin/student-management");
    } else if (selectedAction === "personnel-management") {
      navigate("/admin/personnel-management");
    } else if (selectedAction === "oic-management") {
      navigate("/admin/oic-management");
    } else {
      alert("Invalid action selected.");
    }
  };

  const handleActionChange = (event) => {
    setSelectedAction(event.target.value);
  };

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }

    if (user && !adminRole.includes(user.role)) {
      navigate(navigateRouteByRole(user));
    }
  }, [dispatch, user, status]);

  return (
    <>
      <Helmet>
        {status === "Succeeded" && (
          <title>Admin Dashboard</title>
        )}
      </Helmet>

      {status === "Succeeded" && (
        <div className="min-h-screen bg-gray-100">
          <PrimaryNavBar />

          {/* Welcome Message */}
          <div className="py-10 px-10">
            <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.first_name} {user?.middle_name} {user?.lastname}!</h1>
            <p className="mt-2 text-gray-600">Access the options below</p>
            <hr className="mt-4 border-gray-300" />
          </div>

          {/* Buttons Section */}
          <div className="flex justify-center space-x-8 mt-10 pl-10 pr-10">
            {/* User List */}
            <button
              onClick={() => navigate("/admin/user-list")}
              className="text-2xl w-80 bg-green-700 hover:bg-green-800 text-white font-bold py-6 px-10 rounded-lg flex items-center flex-col"
            >
              <img src={UserAddIcon} alt="User Section" className="w-7 h-7 mb-4" />
              User List
            </button>

            {/* Department List */}
            <button
              onClick={() => navigate("/admin/courses-department-list")}
              className="text-2xl w-80 bg-green-700 hover:bg-green-800 text-white font-bold py-6 px-10 rounded-lg flex items-center flex-col"
            >
              <img src={DepartmentListIcon} alt="Department List" className="w-7 h-7 mb-4" />
              Department List
            </button>

            {/* Club List */}
            <button
              onClick={() => navigate("/admin/club-list")}
              className="text-2xl w-80 bg-green-700 hover:bg-green-800 text-white font-bold py-6 px-10 rounded-lg flex items-center flex-col"
            >
              <img src={ClubListIcon} alt="Club List" className="w-7 h-7 mb-4" />
              Club List
            </button>

            {/* Release Clearance */}
            <button
              onClick={openClearanceModal}
              className="text-2xl w-80 bg-green-700 hover:bg-green-800 text-white font-bold py-6 px-10 rounded-lg flex items-center flex-col"
            >
              <DocumentIcon className="w-7 h-7 mb-4 text-white" />
              Release Clearance
            </button>
          </div>

          {/* User Management Modal */}
          {isUserModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">User Management</h2>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2 text-gray-700"
                  value={selectedAction}
                  onChange={handleActionChange}
                >
                  <option value="">-- Select Action --</option>
                  <option value="oic-management">Office In-Charger</option>
                  <option value="personnel-management">Personnel</option>
                  <option value="student-management">Student Officer</option>
                  <option value="student-management">Student</option>
                </select>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={closeUserModal}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg mr-2"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleProceed}
                    className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Proceed
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Clearance Modal */}
          {isClearanceModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Release Clearance</h2>
                <div className="space-y-4">
                  <button
                    onClick={() => handleClearanceClick('STUDENT')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg"
                  >
                    Student Clearance
                  </button>
                  <button
                    onClick={() => handleClearanceClick('PERSONNEL')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg"
                  >
                    Personnel Clearance
                  </button>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={closeClearanceModal}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Modal */}
          {isConfirmationOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Action</h2>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to release clearance for {selectedClearanceType === 'student' ? 'students' : 'personnel'}?
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCancelConfirmation}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmClearance}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <Modal />
    </>
  );
}

export default AdminDashboard;