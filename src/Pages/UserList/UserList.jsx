import React, { useState, useEffect, useRef } from "react";
import { FaPlus, FaSearch, FaEdit, FaKey, FaFingerprint, FaTrash } from "react-icons/fa";
import PrimaryNavBar from "../../Components/NavBar/PrimaryNavBar";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../states/slices/UserSlicer";
import { navigateRouteByRole } from "../../services/RouteUtil";
import Modal from "../../Components/modal/Modal";
import axios from "../../api/AxiosConfig";
import { adminRole } from "../../services/UserUtil";
import { showModal } from "../../states/slices/ModalSlicer";
import { useNavigate } from "react-router-dom";

const staffRoles = ['Moderator', 'Personnel', 'Office In-Charge'];
const roles = [
  { label: "Student", value: "STUDENT" },
  { label: "Student Officer", value: "STUDENT_OFFICER" },
  { label: "Admin", value: "ADMIN" },
  { label: "Personnel", value: "PERSONNEL" },
  { label: "Moderator", value: "MODERATOR" },
  { label: "Office In-Charge", value: "OFFICE_IN_CHARGE" },
  { label: "DSA", value: "DSA" },
  { label: "Finance", value: "FINANCE" },
  { label: "Community", value: "COMMUNITY" },
  { label: "President", value: "PRESIDENT" },
  { label: "Office Head", value: "OFFICE_HEAD" },
];

const rolesNoNeedOrganization = ["ADMIN", "OFFICE_IN_CHARGE", "DSA", "FINANCE", "COMMUNITY", "PRESIDENT", "OFFICE_HEAD", "PERSONNEL"];

const clubRoles = [
  { label: "Member", value: "MEMBER" },
  { label: "Student Officer", value: "STUDENT_OFFICER" },
  { label: "Moderator", value: "MODERATOR" },
];


const yearLevels = ["1", "2", "3", "4"];

function UserList() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    first_name: "",
    middle_name: "",
    lastname: "",
    role: "STUDENT",
    username: "",
    email: "",
    department_id: 0,
    course_id: 0,
    year_level: 0,
    department_club_id: 0,
    department_club_role: "MEMBER",
    social_club_id: 0,
    social_club_role: "MEMBER",
    moderator_club_id: 0
  });
  const [pageRange, setPageRange] = useState([0, 20]);
  const itemsPerPage = 15;

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessAdded, setIsSuccessAdded] = useState(false);

  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (staffRoles.includes(newUser.role)) {
      setNewUser(prev => ({ ...prev, yearLevel: 'N/A' }));
    }
  }, [newUser.role]);

  const handleCreateUser = async () => {
    // please put a filter exception that depends by the role
    if (newUser.first_name === "" || newUser.lastname === "" || newUser.username === "" || newUser.email === "") {
      alert("Please fill out all required fields.");
      return;
    }

    if ((newUser.role === "STUDENT" || newUser.role === "STUDENT_OFFICER") && newUser.year_level === 0) {
      alert("Please Select Year Level");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post("/admin/add-user", newUser);
      if (response.status === 201) {
        dispatch(showModal({ message: response.data?.message }));
        addedUserToggle();
        resetUserFields();
      }
    } catch (err) {
      switch (err.status) {
        case 403:
          dispatch(showModal({ message: err.response?.data.message }));
          break;
        case 409:
          dispatch(showModal({ message: err.response?.data.message }));
          break;
        case 404:
          dispatch(showModal({ message: err.response?.data.message }));
          break;
      }
    } finally {
      setIsLoading(false);
      setIsCreateModalOpen(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser({ ...user });
    setIsEditModalOpen(true);
  };

  const departmentHandler = (id) => {
    if (id !== 0) {
      setFilteredCourses(courses.filter((course) => course.department_id == id));
    } else {
      setFilteredCourses([]);
    }
    setNewUser({ ...newUser, department_id: Number(id) })
  }

  const handleUpdateUser = () => {
    if (!editingUser.firstName || !editingUser.lastName || !editingUser.userId || !editingUser.department || !editingUser.course) {
      alert("Please fill out all required fields.");
      return;
    }

    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (confirmed) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const resetUserFields = () => {
    setNewUser({
      first_name: "",
      middle_name: "",
      lastname: "",
      role: "STUDENT",
      username: "",
      email: "",
      department_id: 0,
      course_id: 0,
      year_level: 0,
      department_club_id: 0,
      department_club_role: "MEMBER",
      social_club_id: 0,
      social_club_role: "MEMBER",
      moderator_club_id: 0
    })
  }

  const handleResetPassword = (userId) => {
    // Implement password reset logic here
    alert(`Password reset requested for user ${userId}`);
  };

  const handleEnrollFingerprint = (userId) => {
    // Implement fingerprint enrollment logic here
    alert(`Fingerprint enrollment requested for user ${userId}`);
  };

  const handleEnrollSignature = (userId) => {
    // Implement signature enrollment logic here
    alert(`Signature enrollment requested for user ${userId}`);
  };

  const addedUserToggle = () => {
    setIsSuccessAdded(v => !v);
  };

  const handlePageChange = (pageFrom, pageTo) => {
    if (pageFrom < 0 || pageFrom > pageTo) return;
    setPageRange([pageFrom, pageTo]);
  };

  // get all clubs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/clubs");
        setClubs(response.data?.data);
      } catch (error) {
      }
    }
    fetchData();
  }, []);

  // get all departments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/departments");
        setDepartments(response.data?.data);
      } catch (error) {
      }
    }
    fetchData();
  }, []);

  // get all courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/courses");
        setCourses(response.data?.data);
      } catch (error) {
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/admin/users?s=${pageRange[0]}&e=${pageRange[1]}`);
        setUsers(response.data?.data);
      } catch (error) {
      }
    }
    fetchData();
  }, [isSuccessAdded, pageRange]);

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
      {status === "Succeeded" && (
        <div className="min-h-screen bg-gray-100">
          <PrimaryNavBar />

          <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">List of Users</h2>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <select
                  className="border p-2 rounded w-full sm:w-auto"
                  value={newUser.role}
                  onChange={(e) => ({ ...newUser, role: e.target.value })}
                >
                  <option value="">All Roles</option>
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <FaPlus className="mr-2" /> Create User
              </button>
            </div>
          </div>

          <div className="p-3 pb-0">
            <div className="overflow-x-auto">
              <table className="table-auto w-full border-collapse border border-gray-300 bg-white shadow-lg">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 w-32">First Name</th>
                    <th className="border border-gray-300 px-4 py-2 w-32">Middle Name</th>
                    <th className="border border-gray-300 px-4 py-2 w-32">Last Name</th>
                    <th className="border border-gray-300 px-4 py-2 w-32">Role</th>
                    <th className="border border-gray-300 px-4 py-2 w-24">User ID</th>
                    <th className="border border-gray-300 px-4 py-2" style={{ width: '200px', minWidth: '200px' }}>
                      <div className="max-w-xs break-words">Department</div>
                    </th>
                    <th className="border border-gray-300 px-4 py-2" style={{ width: '200px', minWidth: '200px' }}>
                      <div className="max-w-xs break-words">Course</div>
                    </th>
                    <th className="border border-gray-300 px-4 py-2 w-16">Year</th>
                    <th className="border border-gray-300 px-4 py-2 w-32">Department Club</th>
                    <th className="border border-gray-300 px-4 py-2 w-32">Social Club</th>
                    <th className="border border-gray-300 px-4 py-2 w-24 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(users) && users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-100">
                      <td className="border px-4 py-2">{user.first_name}</td>
                      <td className="border px-4 py-2">{user.middle_name}</td>
                      <td className="border px-4 py-2">{user.lastname}</td>
                      <td className="border px-4 py-2">{user.role}</td>
                      <td className="border px-4 py-2">{user.username}</td>
                      <td className="border px-4 py-2" style={{ width: '200px', minWidth: '200px' }}>
                        <div className="max-w-xs break-words">{user.department ? user.department.name : "N/A"}</div>
                      </td>
                      <td className="border px-4 py-2" style={{ width: '200px', minWidth: '200px' }}>
                        <div className="max-w-xs break-words">{user.course ? user.course.name : "N/A"}</div>
                      </td>
                      <td className="border px-4 py-2">{user.year_level > 0 ? user.year_level : "N/A"}</td>
                      <td className="border px-4 py-2">{user.clubs ? user.clubs.filter((club) => club.type === "DEPARTMENT").map((club) => club.name) : "N/A"}</td>
                      <td className="border px-4 py-2">{user.clubs ? user.clubs.filter((club) => club.type === "SOCIAL").map((club) => club.name) : "N/A"}</td>
                      <td className="border px-4 py-2">
                        <div className="flex justify-center space-x-2">
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            title="Edit"
                            onClick={() => handleEdit(user)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="text-yellow-500 hover:text-yellow-700"
                            title="Reset Password"
                            onClick={() => handleResetPassword(user.id)}
                          >
                            <FaKey />
                          </button>
                          <div className="relative group">
                            <button
                              className="text-green-500 hover:text-green-700"
                              title="Enroll"
                            >
                              <FaFingerprint />
                            </button>
                            {user.role === "Office In-Charge" && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg py-2 hidden group-hover:block z-10">
                                <button
                                  onClick={() => handleEnrollFingerprint(user.id)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <FaFingerprint className="mr-2" />
                                  Enroll Fingerprint
                                </button>
                                <button
                                  onClick={() => handleEnrollSignature(user.id)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <FaSignature className="mr-2" />
                                  Enroll Signature
                                </button>
                              </div>
                            )}
                          </div>
                          <button
                            className="text-red-500 hover:text-red-700"
                            title="Delete"
                            onClick={() => handleDelete(user.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {isCreateModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">Create New User</h2>
                <form className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">First Name *</label>
                    <input
                      type="text"
                      value={newUser.first_name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, first_name: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Middle Name</label>
                    <input
                      type="text"
                      value={newUser.middle_name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, middle_name: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Last Name *</label>
                    <input
                      type="text"
                      value={newUser.lastname}
                      onChange={(e) =>
                        setNewUser({ ...newUser, lastname: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Role *</label>
                    <select
                      onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                      required
                    >
                      {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">User ID *</label>
                    <input
                      type="text"
                      value={newUser.username}
                      onChange={(e) =>
                        setNewUser({ ...newUser, username: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <input
                      type="text"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                      required
                    />
                  </div>
                  <div className={`mb-4 ${rolesNoNeedOrganization.includes(newUser?.role) || newUser?.role === "MODERATOR" ? "hidden" : ""}`}>
                    <label className="block text-sm font-medium mb-1">Department *</label>
                    <select
                      onChange={(e) => departmentHandler(e.target.value)}
                      className="w-full border p-2 rounded"
                    >
                      <option value="">Select Department</option>
                      {departments.map((department) => (
                        <option key={department.id} value={department.id}>
                          {department.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={`mb-4 ${rolesNoNeedOrganization.includes(newUser?.role) || newUser?.role === "MODERATOR" ? "hidden" : ""}`}>
                    <label className="block text-sm font-medium mb-1">Course *</label>
                    <select
                      onChange={(e) =>
                        setNewUser({ ...newUser, course_id: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                    >
                      <option value="">Select Course</option>
                      {filteredCourses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={`mb-4 ${rolesNoNeedOrganization.includes(newUser?.role) || newUser?.role === "MODERATOR" ? "hidden" : ""}`}>
                    <label className="block text-sm font-medium mb-1">Year Level</label>
                    <select
                      value={newUser.year_level}
                      onChange={(e) =>
                        setNewUser({ ...newUser, year_level: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                    >
                      <option value="">Select Year Level</option>
                      {yearLevels.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={`mb-4 ${rolesNoNeedOrganization.includes(newUser?.role) || newUser?.role === "MODERATOR" ? "hidden" : ""}`}>
                    <label className="block text-sm font-medium mb-1">Department Club</label>
                    <div className="flex gap-2">
                      <select
                        onChange={(e) =>
                          setNewUser({ ...newUser, department_club_id: e.target.value })
                        }
                        className="w-full border p-2 rounded"
                      >
                        <option value="">Select Department Club</option>
                        {clubs.filter((club) => club.type === "DEPARTMENT").map((club) => (
                          <option key={club.id} value={club.id}>
                            {club.name}
                          </option>
                        ))}
                      </select>
                      <select
                        onChange={(e) =>
                          setNewUser({ ...newUser, department_club_role: e.target.value })
                        }
                        className={`w-40 border p-2 rounded ${newUser.role === "STUDENT" ? "hidden" : ""}`}
                      >
                        <option value="">Select Role</option>
                        {clubRoles.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className={`mb-4 ${rolesNoNeedOrganization.includes(newUser?.role) || newUser?.role === "MODERATOR" ? "hidden" : ""}`}>
                    <label className="block text-sm font-medium mb-1">Social Club</label>
                    <div className="flex gap-2">
                      <select
                        onChange={(e) =>
                          setNewUser({ ...newUser, social_club_id: e.target.value })
                        }
                        className="w-full border p-2 rounded"
                      >
                        <option value="">Select Social Club</option>
                        {clubs.filter((club) => club.type === "SOCIAL").map((club) => (
                          <option key={club.id} value={club.id}>
                            {club.name}
                          </option>
                        ))}
                      </select>
                      <select
                        onChange={(e) =>
                          setNewUser({ ...newUser, social_club_role: e.target.value })
                        }
                        className={`w-40 border p-2 rounded ${newUser.role === "STUDENT" ? "hidden" : ""}`}
                      >
                        <option value="">Select Role</option>
                        {clubRoles.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className={`mb-4 ${newUser.role !== "MODERATOR" ? "hidden" : ""}`}>
                    <label className="block text-sm font-medium mb-1">Club</label>
                    <div className="flex gap-2">
                      <select
                        onChange={(e) =>
                          setNewUser({ ...newUser, moderator_club_id: e.target.value })
                        }
                        className="w-full border p-2 rounded"
                      >
                        <option value="">Select Social Club</option>
                        {clubs.map((club) => (
                          <option key={club.id} value={club.id}>
                            {club.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="px-4 py-2 bg-gray-200 rounded mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateUser}
                      className="px-4 py-2 bg-green-500 text-white rounded"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {isEditModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">Edit User</h2>
                <form className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">First Name *</label>
                    <input
                      type="text"
                      value={editingUser?.firstName || ''}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, firstName: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Middle Name</label>
                    <input
                      type="text"
                      value={editingUser?.middleName || ''}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, middleName: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Last Name *</label>
                    <input
                      type="text"
                      value={editingUser?.lastName || ''}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, lastName: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Role *</label>
                    <select
                      value={editingUser?.role || ''}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, role: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                      required
                    >
                      {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">User ID *</label>
                    <input
                      type="text"
                      value={editingUser?.userId || ''}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, userId: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Department *</label>
                    <select
                      value={editingUser?.department || ''}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, department: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                      required
                    >
                      <option value="">Select Department</option>
                      {courses.map((course) => (
                        <option key={course.department} value={course.department}>
                          {course.department}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Course *</label>
                    <select
                      value={editingUser?.course || ''}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, course: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                      required
                    >
                      <option value="">Select Course</option>
                      {courses
                        .find((c) => c.department === editingUser?.department)
                        ?.programs.map((program) => (
                          <option key={program} value={program}>
                            {program}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Year Level</label>
                    <select
                      value={editingUser?.yearLevel || ''}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, yearLevel: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                      disabled={staffRoles.includes(editingUser?.role)}
                    >
                      <option value="">Select Year Level</option>
                      {yearLevels.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Department Club</label>
                    <select
                      value={editingUser?.departmentClub || ''}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, departmentClub: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                    >
                      <option value="">Select Department Club</option>
                      {departmentalClubs.map((club) => (
                        <option key={club} value={club}>
                          {club}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Social Club</label>
                    <select
                      value={editingUser?.socialClub || ''}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, socialClub: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                    >
                      <option value="">Select Social Club</option>
                      {socialClubs.map((club) => (
                        <option key={club} value={club}>
                          {club}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditModalOpen(false);
                        setEditingUser(null);
                      }}
                      className="px-4 py-2 bg-gray-200 rounded mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleUpdateUser}
                      className="px-4 py-2 bg-green-500 text-white rounded"
                    >
                      Update
                    </button>
                  </div>
                </form>
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