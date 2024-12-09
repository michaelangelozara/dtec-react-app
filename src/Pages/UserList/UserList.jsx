import React, { useEffect, useState } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import axios from "../../api/AxiosConfig";
import Modal from "../../Components/modal/Modal";

import { fetchUser } from "../../states/slices/UserSlicer";
import { navigateRouteByRole } from "../../services/RouteUtil";

// components 
import PrimaryNavBar from "../../Components/NavBar/PrimaryNavBar";
import { useDispatch, useSelector } from "react-redux";

import { adminRole } from "../../services/UserUtil";
import { useNavigate } from "react-router-dom";
import { showModal } from "../../states/slices/ModalSlicer";

function UserList() {
  const [userList, setUserList] = useState([]);

  const [initialCount, setInitialCount] = useState([0, 30]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const [hasNewUser, setHasNewUser] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastname, setLastname] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const { user, status } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const roles = {
    "admin": "ADMIN",
    "student": "STUDENT",
    "personnel": "PERSONNEL",
    "studentOfficer": "STUDENT_OFFICER",
    "moderator": "MODERATOR",
    "officeInCharge": "OFFICE_IN_CHARGE",
  };

  const toggleNewUser = () => {
    setHasNewUser(v => !v);
  }

  const areFieldsValid = () => {
    if (firstName === "" || firstName.length == 0) {
      dispatch(showModal({ message: "Make Sure to fill all the Blanks out" }));
      return false;
    } else if (lastname === "" || lastname.length == 0) {
      dispatch(showModal({ message: "Make Sure to fill all the Blanks out" }));
      return false;
    } else if (username === "" || username.length == 0) {
      dispatch(showModal({ message: "Make Sure to fill all the Blanks out" }));
      return false;
    } else if (password === "" || username.length == 0) {
      dispatch(showModal({ message: "Make Sure to fill all the Blanks out" }));
      return false;
    } else {
      return true;
    }
  }

  const handleCreateUser = async () => {
    try {
      if (!areFieldsValid()) return;

      setIsLoading(true);
      const response = await axios.post("/admin/add-user", {
        "first_name": firstName,
        "middle_name": middleName,
        lastname,
        username,
        password,
        role
      });

      if (response.status === 201) {
        dispatch(showModal({ message: response.data?.message }))
        resetFields();
        toggleNewUser();
      }
    } catch (err) {
      dispatch(showModal({ message: err?.response?.data?.message }))
    } finally {
      setIsLoading(false);
      setIsCreateModalOpen(false);
    }
  };

  const resetFields = () => {
    setFirstName("");
    setMiddleName("");
    setLastname("");
    setUsername("");
    setPassword("");
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    try {
      setIsLoading(true);
      if (confirmed) {
        const response = await axios.delete(`/admin/users/delete/${id}`);
        dispatch(showModal({ message: response.data?.data }))
        setUserList(userList.filter((user) => user.id !== id));
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }

  };

  // Filter users by selected role
  const sortedUsers = selectedRole
    ? userList.filter((user) => user.role === selectedRole)
    : userList;

  // fetch the initial list
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/admin/users?s=${initialCount[0]}&e=${initialCount[1]}`);
        if (response.status === 200) {
          setUserList(response.data?.data)
        }
      } catch (error) {
      }
    }

    fetchData();
  }, [hasNewUser]);


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
      {status === "Succeeded" && (
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
                        {user.first_name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                        {user.middle_name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                        {user.lastname}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                        {user.role}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                        {user.username}
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
                  {isLoading ? "Loading..." : "Create"}
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
      )}
    </>
  );
}

export default UserList;
