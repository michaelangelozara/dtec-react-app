import React, { useEffect, useState } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import axios from "../../api/AxiosConfig";
import Modal from "../../Components/modal/Modal";

import { getAccessToken } from "../../services/TokenUtils";
import { fetchUser } from "../../states/slices/UserSlicer";
import { navigateRouteByRole } from "../../services/RouteUtil";
import { showModal } from "../../states/slices/ModalSlicer";

// components 
import PrimaryNavBar from "../../Components/NavBar/PrimaryNavBar";
import { useDispatch, useSelector } from "react-redux";

function UserList() {
  const [userList, setUserList] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastname, setLastname] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const isLoggedIn = getAccessToken();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const roles = {
    "admin": "ADMIN",
    "student": "STUDENT",
    "personnel": "PERSONNEL",
    "studentOfficer": "STUDENT_OFFICER",
    "moderator": "MODERATOR",
    "officeInCharge": "OFFICE_IN_CHARGE",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        dispatch(fetchUser());
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    }

    if (user === null) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      navigateRouteByRole(user)
    }
  }, [user]);

  const validateFields = () => {
      if (firstName === "" || firstName.length == 0) {
        
        console.log(firstName);
        showModal({message : "Make Sure to fill all the Blanks out"});
      }
  }

  const handleCreateUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/admin/add-user", {
        "first_name": firstName,
        "middle_name": middleName,
        lastname,
        username,
        password,
        role
      });
      console.log(response);
      if (response.status === 201) {

      }
    } catch (err) {
    } finally {
      setIsCreateModalOpen(false);
      setIsLoading(false);
    }
  };

  const resetFields = () => {
    setFirstName("");
    setMiddleName("");
    setLastname("");
    setUsername("");
    setPassword("");
  }

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (confirmed) {
      // setUsers(users.filter((user) => user.id !== id));
    }
  };

  // Filter users by selected role
  const sortedUsers = selectedRole
    ? userList.filter((user) => user.role === selectedRole)
    : userList;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <PrimaryNavBar />

      {/* Heading and Sorting */}
      <div className="p-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">List of Users</h2>
        <div className="flex items-center space-x-4">
          <select
            className="border p-2 rounded"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value={roles.admin}>
              Admin
            </option>
            <option value={roles.personnel}>
              Personnel
            </option>
            <option value={roles.officeInCharge}>
              Office In-charge
            </option>
            <option value={roles.moderator}>
              Moderator
            </option>
            <option value={roles.studentOfficer}>
              Student Officer
            </option>
            <option value={roles.student}>
              Student
            </option>
          </select>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <FaPlus className="mr-2" /> Create User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="p-8">
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 bg-white shadow-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  First Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Middle Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Last Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Role
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  User ID
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                    {user.firstName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                    {user.middleName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                    {user.lastName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                    {user.role}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                    {user.userId}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-600">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg mx-1"
                      onClick={() => handleDelete(user.id)}
                    >
                      <FaTrash className="inline" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Create New User</h3>
            <label className="block mb-2">
              <span className="font-bold">First Name:</span>
              <input
                type="text"
                className="border p-2 w-full"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>
            <label className="block mb-2">
              <span className="font-bold">Middle Name:</span>
              <input
                type="text"
                className="border p-2 w-full"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
              />
            </label>
            <label className="block mb-2">
              <span className="font-bold">Last Name:</span>
              <input
                type="text"
                className="border p-2 w-full"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </label>
            <label className="block mb-2">
              <span className="font-bold">Role:</span>
              <select
                className="border p-2 w-full"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="ADMIN">Admin</option>
                <option value="PERSONNEL">Personnel</option>
                <option value="OFFICE_IN_CHARGE">Office In-Charge</option>
                <option value="STUDENT">Student</option>
                <option value="MAYOR">Officer</option>
              </select>
            </label>
            <label className="block mb-2">
              <span className="font-bold">User ID:</span>
              <input
                type="text"
                className="border p-2 w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <label className="block mb-2">
              <span className="font-bold">Password:</span>
              <input
                type="password"
                className="border p-2 w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button
              className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              onClick={handleCreateUser}
            >
              Create
            </button>
            <button
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded ml-2"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <Modal />
    </div>
  );
}

export default UserList;
