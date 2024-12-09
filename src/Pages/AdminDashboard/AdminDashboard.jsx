import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import UserAddIcon from "../../Images/useradd.png";
import DepartmentListIcon from "../../Images/department.png";
import EditUserIcon from "../../Images/user.png";
import ClubListIcon from "../../Images/club.png";
import PrimaryNavBar from "../../Components/NavBar/PrimaryNavBar";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../states/slices/UserSlicer";
import { adminRole } from "../../services/UserUtil";
import { navigateRouteByRole } from "../../services/RouteUtil";

function AdminDashboard() {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");

  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const openUserModal = () => setIsUserModalOpen(true);

  const closeUserModal = () => {
    setIsUserModalOpen(false);
    setSelectedAction("");
  };

  const handleActionChange = (event) => {
    setSelectedAction(event.target.value);
  };

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser())
    }

    if (user && !adminRole.includes(user.role)) {
      navigate(navigateRouteByRole(user));
    }
  }, [dispatch, user]);

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

            {/* User Management */}
            <button
              onClick={openUserModal}
              className="text-2xl w-80 bg-green-700 hover:bg-green-800 text-white font-bold py-6 px-10 rounded-lg flex items-center flex-col"
            >
              <img src={EditUserIcon} alt="User Management" className="w-7 h-7 mb-4" />
              User Management
            </button>

            {/* Department List */}
            <button
              onClick={() => navigate("/admin/couses&department-list")}
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
                  <option value="student-management">Student Officer</option>
                  <option value="personnel-management">Moderator</option>
                  <option value="oic-management">Office In-Charge</option>
                </select>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={closeUserModal}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg mr-2"
                  >
                    Close
                  </button>
                  <button
                    onClick={""}
                    className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Proceed
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default AdminDashboard;
