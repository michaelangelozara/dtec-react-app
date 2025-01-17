import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaKey,
  FaFingerprint,
  FaTrash,
  FaSignature,
} from "react-icons/fa";
import PrimaryNavBar from "../../Components/NavBar/PrimaryNavBar";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../states/slices/UserSlicer";
import { navigateRouteByRole } from "../../services/RouteUtil";
import Modal from "../../Components/modal/Modal";
import axios from "../../api/AxiosConfig";
import { adminRole } from "../../services/UserUtil";
import { showModal } from "../../states/slices/ModalSlicer";
import { useNavigate } from "react-router-dom";

const staffRoles = ["Moderator", "Personnel", "Office In-Charge"];
const roles = [
  { label: "Student", value: "STUDENT" },
  { label: "Student Officer", value: "STUDENT_OFFICER" },
  { label: "Admin", value: "ADMIN" },
  { label: "Personnel", value: "PERSONNEL" },
  { label: "Moderator", value: "MODERATOR" },
  { label: "DSA", value: "DSA" },
  { label: "Finance", value: "FINANCE" },
  { label: "President", value: "PRESIDENT" },
  { label: "CDSO", value: "OFFICE_HEAD" },
  { label: "Guidance", value: "GUIDANCE" },
  { label: "DEAN", value: "DEAN" },
  { label: "Cashier", value: "CASHIER" },
  { label: "Librarian", value: "LIBRARIAN" },
  { label: "School Nurse", value: "SCHOOL_NURSE" },
  { label: "Program Head", value: "PROGRAM_HEAD" },
  { label: "Registrar", value: "REGISTRAR" },

  { label: "ACCOUNTING CLERK", value: "ACCOUNTING_CLERK" },
  { label: "PROPERTY CUSTODIAN", value: "CUSTODIAN" },
  { label: "VPAF", value: "VPAF" },
  { label: "VPA", value: "VPA" },
  { label: "Multimedia", value: "MULTIMEDIA" },
  { label: "Auxiliary Service Head", value: "AUXILIARY_SERVICE_HEAD" },
  { label: "PPLO", value: "PPLO" },
  { label: "Chapel", value: "CHAPEL" },

  { label: "Science Lab", value: "SCIENCE_LAB" },
  { label: "Computer Lab", value: "COMPUTER_SCIENCE_LAB" },
  { label: "Electronics Lab", value: "ELECTRONICS_LAB" },
  { label: "Criminology Lab", value: "CRIM_LAB" },
  { label: "HRM Lab", value: "HRM_LAB" },
  { label: "Nursing Lab", value: "NURSING_LAB" },
];

const offices = [
  { label: "DSA", value: "DSA" },
  { label: "Registrar", value: "REGISTRAR" },
  { label: "Dean", value: "DEAN" },
  { label: "School Nurse", value: "SCHOOL_NURSE" },
];

const rolesNoNeedOrganization = [
  "ADMIN",
  "OFFICE_IN_CHARGE",
  "DSA",
  "FINANCE",
  "PRESIDENT",
  "OFFICE_HEAD",
  "GUIDANCE",
  "CASHIER",
  "LIBRARIAN",
  "SCHOOL_NURSE",
  "REGISTRAR",
  "ACCOUNTING_CLERK",
  "CUSTODIAN",
  "VPAF",
  "VPA",
  "MULTIMEDIA",
  "AUXILIARY_SERVICE_HEAD",
  "PPLO",
  "CHAPEL",
];

const labInChargeRoles = [
  "SCIENCE_LAB",
  "COMPUTER_SCIENCE_LAB",
  "ELECTRONICS_LAB",
  "CRIM_LAB",
  "HRM_LAB",
  "NURSING_LAB"
]

const roleOnlyNeedIsDepartment = ["DEAN"];

const roleOnlyNeedIsCourse = ["PROGRAM_HEAD"];

const clubRoles = [
  { label: "Member", value: "MEMBER" },
  { label: "Student Officer", value: "STUDENT_OFFICER" },
  { label: "Moderator", value: "MODERATOR" },
];

const yearLevels = ["1", "2", "3", "4"];

function UserList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [signature, setSignature] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [newUser, setNewUser] = useState({
    first_name: "",
    middle_name: "",
    lastname: "",
    role: "SELECT ALL",
    username: "",
    email: "",
    department_id: 0,
    course_id: 0,
    year_level: 0,
    department_club_id: 0,
    department_club_role: "MEMBER",
    social_club_id: 0,
    social_club_role: "MEMBER",
    moderator_club_id: 0,
    type_of_personnel: null,
    office: null,
  });
  const [pageRange, setPageRange] = useState([0, 50]);
  const itemsPerPage = 15;

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessAdded, setIsSuccessAdded] = useState(false);

  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Sorting and filtering users by role and search term
  const sortedFilteredUsers = useMemo(() => {
    // First, filter by role
    const filteredByRole = filteredUsers.filter((user) => {
      const matchRole = newUser?.role === "SELECT ALL" || newUser?.role === user?.role;
      return matchRole;
    });

    // Then, sort by role (ADMIN comes first, others follow)
    return filteredByRole.sort((a, b) => {
      if (a.role === b.role) return 0;
      return a.role === "ADMIN" ? -1 : 1; // Sort 'admin' before 'user'
    });
  }, [filteredUsers, newUser?.role, isSuccessAdded]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (staffRoles.includes(newUser.role)) {
      setNewUser((prev) => ({ ...prev, yearLevel: "N/A" }));
    }
  }, [newUser.role]);

  const handleCreateUser = async () => {
    // please put a filter exception that depends by the role
    if (
      newUser.first_name === "" ||
      newUser.lastname === "" ||
      newUser.username === "" ||
      newUser.email === ""
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    if (
      (newUser.role === "STUDENT" || newUser.role === "STUDENT_OFFICER") &&
      newUser.year_level === 0
    ) {
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

  const handleEdit = async (user) => {
    try {
      setSelectedUser(user);
      setIsLoading(true);
      const response = await axios.get(`/admin/users/${user?.id}`);
      if (response.status === 200 && response.data?.data) {
        const fetchedUser = response.data?.data;
        setNewUser(prevValue => ({
          ...prevValue,
          first_name: fetchedUser.first_name,
          middle_name: fetchedUser.middle_name,
          lastname: fetchedUser.lastname,
          role: fetchedUser.role,
          username: fetchedUser.username,
          email: fetchedUser.email,
          department_id: fetchedUser.department?.id,
          course_id: fetchedUser.course?.id,
          year_level: fetchedUser.year_level,
          department_club_id: fetchedUser.department_club?.id,
          department_club_role: fetchedUser.department_club_role,
          social_club_id: fetchedUser.social_club?.id,
          social_club_role: fetchedUser.social_club_role,
          moderator_club_id: fetchedUser.moderator_club?.id,
          type_of_personnel: fetchedUser.type_of_personnel,
          office: fetchedUser.office,
        }));
        console.log(fetchedUser);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
      setIsEditModalOpen(true);
    }
  };

  const departmentHandler = (id) => {
    if (id !== 0) {
      setFilteredCourses(
        courses.filter((course) => course.department_id == id)
      );
    } else {
      setFilteredCourses([]);
    }
    setNewUser({ ...newUser, department_id: Number(id) });
  };

  const handleUpdateUser = async () => {
    if (
      !newUser.first_name ||
      !newUser.lastname ||
      !newUser.role ||
      !newUser.email
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const response = await axios.put(`/admin/update-user/${selectedUser?.id}`, newUser);
      if (response.status === 200) {
        dispatch(showModal({ message: response?.data?.message }))
      }
    } catch (error) {
      if (error?.status === 409 || error?.status === 404) {
        dispatch(showModal({ message: error?.response?.data?.message }))
      }
    } finally {
      setIsEditModalOpen(false);
      setEditingUser(null);
      resetUserFields();
      addedUserToggle();
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmed) {
      try {
        const response = await axios.delete(`/admin/users/delete-user/${id}`);
        if (response.status === 200) {
          dispatch(showModal({ message: response?.data?.message }))
          addedUserToggle();
        }
      } catch (error) {
      }
    }
  };

  const resetUserFields = () => {
    setNewUser({
      first_name: "",
      middle_name: "",
      lastname: "",
      role: "SELECT ALL",
      username: "",
      email: "",
      department_id: 0,
      course_id: 0,
      year_level: 0,
      department_club_id: 0,
      department_club_role: "MEMBER",
      social_club_id: 0,
      social_club_role: "MEMBER",
      moderator_club_id: 0,
      type_of_personnel: null,
      office: null,
    });
  };

  const handleResetPassword = async (userId) => {
    if(!userId) return;
    try {
      const response = await axios.put(`/admin/users/reset-password?id=${userId}`);
      if(response.status === 200){
        dispatch(showModal({message : response?.data?.data}))
      }
    } catch (error) {
    }
  };

  const handleRoleChange = (e) => {
    setNewUser((prevUser) => ({ ...prevUser, role: e.target.value }));
  };

  const handleSignatureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSignature(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureSave = async () => {
    if (!signature && !selectedUser) {
      alert("Please select a signature image first");
      return;
    }

    try {
      const response = await axios.post("/users/add/e-signature", {
        "user_id": selectedUser?.id,
        "image": previewUrl
      });
      if (response.status === 201) {
        // Reset the state
        setSignature(null);
        setPreviewUrl("");
        setIsSignatureModalOpen(false);
        setSelectedUserId(null);
        dispatch(showModal({ message: response.data?.message }));
      }

    } catch (error) {
      if (error.status === 403 || error.status === 404 || error.status === 409) {
        dispatch(showModal({ message: error.response?.data.message }));
      }
    }
  };

  const addedUserToggle = () => {
    setIsSuccessAdded((v) => !v);
  };

  const handlePageChange = (pageFrom, pageTo) => {
    if (pageFrom < 0 || pageFrom > pageTo) return;
    setPageRange([pageFrom, pageTo]);
  };

  // Update the debounced query after 400ms delay
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.length > 2) {
        setDebouncedQuery(searchTerm);
      }
    }, 400);

    // Cleanup function to clear the timeout if query changes
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Update filteredUsers when the search term is cleared
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers(users);  // Reset to all users when search term is empty
    }
  }, [searchTerm, users]);

  // Fetch users based on the search term (debounced)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/admin/users/search?q=${debouncedQuery}`);
        if (debouncedQuery.length === 0) {
          setFilteredUsers(users); // Reset to original users when search term is empty
        } else {
          setFilteredUsers(response.data?.data); // Update with search results
        }
      } catch (error) {
      }
    };

    if (debouncedQuery) {
      fetchData(); // Fetch data if there's a search term
    } else {
      setFilteredUsers(users); // Reset to all users when search term is empty
    }
  }, [debouncedQuery, users]);

  useEffect(() => {
    if (newUser.department_id) {
      setFilteredCourses(
        courses.filter((course) => course.department_id == newUser.department_id)
      );
    }
  }, [newUser.department_id, courses]);

  // get all clubs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/clubs");
        setClubs(response.data?.data);
      } catch (error) { }
    };
    fetchData();
  }, []);

  // get all departments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/departments");
        setDepartments(response.data?.data);
      } catch (error) { }
    };
    fetchData();
  }, []);

  // get all courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/courses");
        setCourses(response.data?.data);
      } catch (error) { }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/admin/users?s=${pageRange[0]}&e=${pageRange[1]}`
        );
        setUsers(response.data?.data);
        setFilteredUsers(response.data?.data);
      } catch (error) { }
    };
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
            <h2 className="text-2xl font-semibold text-gray-800">
              List of Users
            </h2>
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
                  value={newUser?.role}
                  onChange={handleRoleChange}
                >
                  <option value="SELECT ALL">All Roles</option>
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
                    <th className="border border-gray-300 px-4 py-2 w-32">
                      First Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 w-32">
                      Middle Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 w-32">
                      Last Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 w-32">
                      Role
                    </th>
                    <th className="border border-gray-300 px-4 py-2 w-24">
                      User ID
                    </th>
                    <th
                      className="border border-gray-300 px-4 py-2"
                      style={{ width: "200px", minWidth: "200px" }}
                    >
                      <div className="max-w-xs break-words">Department</div>
                    </th>
                    <th
                      className="border border-gray-300 px-4 py-2"
                      style={{ width: "200px", minWidth: "200px" }}
                    >
                      <div className="max-w-xs break-words">Course</div>
                    </th>
                    <th className="border border-gray-300 px-4 py-2 w-16">
                      Year
                    </th>
                    <th className="border border-gray-300 px-4 py-2 w-32">
                      Department Club
                    </th>
                    <th className="border border-gray-300 px-4 py-2 w-32">
                      Social Club
                    </th>
                    <th className="border border-gray-300 px-4 py-2 w-24 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(sortedFilteredUsers) &&
                    sortedFilteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-100">
                        <td className="border px-4 py-2">{user.first_name}</td>
                        <td className="border px-4 py-2">{user.middle_name}</td>
                        <td className="border px-4 py-2">{user.lastname}</td>
                        <td className="border px-4 py-2">{user.role}</td>
                        <td className="border px-4 py-2">{user.username}</td>
                        <td
                          className="border px-4 py-2"
                          style={{ width: "200px", minWidth: "200px" }}
                        >
                          <div className="max-w-xs break-words">
                            {user.department ? user.department.name : "N/A"}
                          </div>
                        </td>
                        <td
                          className="border px-4 py-2"
                          style={{ width: "200px", minWidth: "200px" }}
                        >
                          <div className="max-w-xs break-words">
                            {user.course ? user.course.name : "N/A"}
                          </div>
                        </td>
                        <td className="border px-4 py-2">
                          {user.year_level > 0 ? user.year_level : "N/A"}
                        </td>
                        <td className="border px-4 py-2">
                          {user.clubs
                            ? user.clubs
                              .filter((club) => club.type === "DEPARTMENT")
                              .map((club) => club.name)
                            : "N/A"}
                        </td>
                        <td className="border px-4 py-2">
                          {user.clubs
                            ? user.clubs
                              .filter((club) => club.type === "SOCIAL")
                              .map((club) => club.name)
                            : "N/A"}
                        </td>
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
                            <div className={`relative dropdown-container ${user?.role === "STUDENT" || user?.role === "ADMIN" || user?.role === "PERSONNEL" ? 'hidden' : ''}`}>
                              <button
                                className="text-green-500 hover:text-green-700"
                                title="Enroll"
                                onClick={() =>
                                  setOpenDropdownId(
                                    openDropdownId === user.id ? null : user.id
                                  )
                                }
                              >
                                <FaFingerprint />
                              </button>
                              {openDropdownId === user.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg py-2 z-10">
                                  <button
                                    onClick={() => {
                                      setOpenDropdownId(null);
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <FaFingerprint className="mr-2" />
                                    Enroll Fingerprint
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedUserId(user.id);
                                      setIsSignatureModalOpen(true);
                                      setOpenDropdownId(null);
                                      setSelectedUser(user);
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <FaSignature className="mr-2" />
                                    Attach Signature
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
                    <label className="block text-sm font-medium mb-1">
                      First Name *
                    </label>
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
                    <label className="block text-sm font-medium mb-1">
                      Middle Name
                    </label>
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
                    <label className="block text-sm font-medium mb-1">
                      Last Name *
                    </label>
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
                    <label className="block text-sm font-medium mb-1">
                      Role *
                    </label>
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
                    <label className="block text-sm font-medium mb-1">
                      {newUser.role === "STUDENT" || newUser.role === "STUDENT_OFFICER"? "Student ID" : "Employment ID"}
                    </label>
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
                    <label className="block text-sm font-medium mb-1">
                      Email *
                    </label>
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
                  <div
                    className={`mb-4 ${newUser?.role !== "PERSONNEL" ? "hidden" : ""
                      }`}
                  >
                    <label className="block text-sm font-medium mb-1">
                      Type of Personnel *
                    </label>
                    <select
                      value={newUser.type_of_personnel}
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          type_of_personnel: e.target.value,
                        })
                      }
                      className="w-full border p-2 rounded"
                    >
                      <option value="">Select Type</option>
                      <option value="ACADEMIC">Academic</option>
                      <option value="NON_ACADEMIC">Non Academic</option>
                    </select>
                  </div>
                  <div
                    className={`mb-4 ${newUser.type_of_personnel !== "NON_ACADEMIC" ||
                      newUser.role !== "PERSONNEL"
                      ? "hidden"
                      : ""
                      }`}
                  >
                    <label className="block text-sm font-medium mb-1">
                      Office *
                    </label>
                    <select
                      value={newUser.office}
                      onChange={(e) =>
                        setNewUser({ ...newUser, office: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                    >
                      <option value="">Select Office</option>
                      {offices.map((office, index) => (
                        <option key={index} value={office.value}>
                          {office.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div
                    className={`mb-4 ${!(
                      newUser?.role === "MODERATOR" ||
                      newUser?.role === "STUDENT" ||
                      newUser?.role === "STUDENT_OFFICER" ||
                      newUser?.role === "DEAN" ||
                      newUser?.role === "PROGRAM_HEAD" ||
                      labInChargeRoles.includes(newUser?.role) ||
                      (newUser?.role === "PERSONNEL" &&
                        newUser?.type_of_personnel === "ACADEMIC")
                    )
                      ? "hidden"
                      : ""
                      }`}
                  >
                    <label className="block text-sm font-medium mb-1">
                      Department *
                    </label>
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
                  <div
                    className={`mb-4 ${roleOnlyNeedIsCourse.includes(newUser.role) ||
                      newUser?.type_of_personnel === "ACADEMIC" ||
                      newUser.role === "MODERATOR" ||
                      newUser.role === "STUDENT" ||
                      newUser.role === "STUDENT_OFFICER" ||
                      labInChargeRoles.includes(newUser?.role)
                      ? ""
                      : "hidden"
                      }`}
                  >
                    <label className="block text-sm font-medium mb-1">
                      Course *
                    </label>
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
                  <div
                    className={`mb-4 ${rolesNoNeedOrganization.includes(newUser?.role) ||
                      newUser?.role === "MODERATOR" ||
                      roleOnlyNeedIsDepartment.includes(newUser?.role) ||
                      roleOnlyNeedIsCourse.includes(newUser?.role) ||
                      labInChargeRoles.includes(newUser?.role) ||
                      newUser.role === "PERSONNEL"
                      ? "hidden"
                      : ""
                      }`}
                  >
                    <label className="block text-sm font-medium mb-1">
                      Year Level
                    </label>
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
                  <div
                    className={`mb-4 ${rolesNoNeedOrganization.includes(newUser?.role) ||
                      newUser?.role === "MODERATOR" ||
                      roleOnlyNeedIsDepartment.includes(newUser?.role) ||
                      roleOnlyNeedIsCourse.includes(newUser?.role) ||
                      labInChargeRoles.includes(newUser?.role) ||
                      newUser.role === "PERSONNEL"
                      ? "hidden"
                      : ""
                      }`}
                  >
                    <label className="block text-sm font-medium mb-1">
                      Department Club
                    </label>
                    <div className="flex gap-2">
                      <select
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            department_club_id: e.target.value,
                          })
                        }
                        className="w-full border p-2 rounded"
                      >
                        <option value="">Select Department Club</option>
                        {clubs
                          .filter((club) => club.type === "DEPARTMENT")
                          .map((club) => (
                            <option key={club.id} value={club.id}>
                              {club.name}
                            </option>
                          ))}
                      </select>
                      <select
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            department_club_role: e.target.value,
                          })
                        }
                        className={`w-40 border p-2 rounded ${newUser.role === "STUDENT" ? "hidden" : ""
                          }`}
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
                  <div
                    className={`mb-4 ${rolesNoNeedOrganization.includes(newUser?.role) ||
                      newUser?.role === "MODERATOR" ||
                      roleOnlyNeedIsDepartment.includes(newUser?.role) ||
                      roleOnlyNeedIsCourse.includes(newUser?.role) ||
                      labInChargeRoles.includes(newUser?.role) ||
                      newUser.role === "PERSONNEL"
                      ? "hidden"
                      : ""
                      }`}
                  >
                    <label className="block text-sm font-medium mb-1">
                      Social Club
                    </label>
                    <div className="flex gap-2">
                      <select
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            social_club_id: e.target.value,
                          })
                        }
                        className="w-full border p-2 rounded"
                      >
                        <option value="">Select Social Club</option>
                        {clubs
                          .filter((club) => club.type === "SOCIAL")
                          .map((club) => (
                            <option key={club.id} value={club.id}>
                              {club.name}
                            </option>
                          ))}
                      </select>
                      <select
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            social_club_role: e.target.value,
                          })
                        }
                        className={`w-40 border p-2 rounded ${newUser.role === "STUDENT" ? "hidden" : ""
                          }`}
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
                  <div
                    className={`mb-4 ${newUser.role !== "MODERATOR" ? "hidden" : ""
                      }`}
                  >
                    <label className="block text-sm font-medium mb-1">
                      Club
                    </label>
                    <div className="flex gap-2">
                      <select
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            moderator_club_id: e.target.value,
                          })
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

          {isEditModalOpen && !isLoading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">Edit User</h2>
                <form className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      First Name *
                    </label>
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
                    <label className="block text-sm font-medium mb-1">
                      Middle Name
                    </label>
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
                    <label className="block text-sm font-medium mb-1">
                      Last Name *
                    </label>
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
                    <label className="block text-sm font-medium mb-1">
                      Role *
                    </label>
                    <select
                      value={newUser.role}
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
                    <label className="block text-sm font-medium mb-1">
                    {newUser.role === "STUDENT" || newUser.role === "STUDENT_OFFICER"? "Student ID" : "Employment ID"}
                    </label>
                    <input
                      type="text"
                      defaultValue={newUser.username}
                      disabled
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Email *
                    </label>
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
                  <div
                    className={`mb-4 ${newUser?.role !== "PERSONNEL" ? "hidden" : ""
                      }`}
                  >
                    <label className="block text-sm font-medium mb-1">
                      Type of Personnel *
                    </label>
                    <select
                      value={newUser.type_of_personnel}
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          type_of_personnel: e.target.value,
                        })
                      }
                      className="w-full border p-2 rounded"
                    >
                      <option value="">Select Type</option>
                      <option value="ACADEMIC">Academic</option>
                      <option value="NON_ACADEMIC">Non Academic</option>
                    </select>
                  </div>
                  <div
                    className={`mb-4 ${newUser.type_of_personnel !== "NON_ACADEMIC" ||
                      newUser.role !== "PERSONNEL"
                      ? "hidden"
                      : ""
                      }`}
                  >
                    <label className="block text-sm font-medium mb-1">
                      Office *
                    </label>
                    <select
                      value={newUser.office}
                      onChange={(e) =>
                        setNewUser({ ...newUser, office: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                    >
                      <option value="">Select Office</option>
                      {offices.map((office, index) => (
                        <option key={index} value={office.value}>
                          {office.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div
                    className={`mb-4 ${!(
                      newUser?.role === "MODERATOR" ||
                      newUser?.role === "STUDENT" ||
                      newUser?.role === "STUDENT_OFFICER" ||
                      newUser?.role === "DEAN" ||
                      (newUser?.role === "PERSONNEL" &&
                        newUser?.type_of_personnel === "ACADEMIC")
                    )
                      ? "hidden"
                      : ""
                      }`}
                  >
                    <label className="block text-sm font-medium mb-1">
                      Department *
                    </label>
                    <select
                      value={departments?.filter(d => d.id === newUser.department_id)[0]?.id}
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
                  <div
                    className={`mb-4 ${roleOnlyNeedIsCourse.includes(newUser.role) ||
                      newUser?.type_of_personnel === "ACADEMIC" ||
                      newUser.role === "MODERATOR" ||
                      newUser.role === "STUDENT" ||
                      newUser.role === "STUDENT_OFFICER"
                      ? ""
                      : "hidden"
                      }`}
                  >
                    <label className="block text-sm font-medium mb-1">
                      Course *
                    </label>
                    <select
                      value={newUser?.course_id}
                      onChange={(e) => setNewUser({ ...newUser, course_id: e.target.value })}
                      className="w-full border p-2 rounded"
                    >
                      <option value="">Select Course</option>
                      {newUser?.role !== "PROGRAM_HEAD" ? (
                        <>
                          {filteredCourses.map((course) => (
                            <option key={course.id} value={course.id}>
                              {course.name}
                            </option>
                          ))}
                        </>
                      ) : (
                        <>
                          {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                              {course.name}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                  </div>
                  <div
                    className={`mb-4 ${rolesNoNeedOrganization.includes(newUser?.role) ||
                      newUser?.role === "MODERATOR" ||
                      roleOnlyNeedIsDepartment.includes(newUser?.role) ||
                      roleOnlyNeedIsCourse.includes(newUser?.role) ||
                      newUser.role === "PERSONNEL"
                      ? "hidden"
                      : ""
                      }`}
                  >
                    <label className="block text-sm font-medium mb-1">
                      Year Level
                    </label>
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
                  <div
                    className={`mb-4 ${rolesNoNeedOrganization.includes(newUser?.role) ||
                      newUser?.role === "MODERATOR" ||
                      roleOnlyNeedIsDepartment.includes(newUser?.role) ||
                      roleOnlyNeedIsCourse.includes(newUser?.role) ||
                      newUser.role === "PERSONNEL"
                      ? "hidden"
                      : ""
                      }`}
                  >
                    <label className="block text-sm font-medium mb-1">
                      Department Club
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={newUser?.department_club_id}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            department_club_id: e.target.value,
                          })
                        }
                        className="w-full border p-2 rounded"
                      >
                        <option value="">Select Department Club</option>
                        {clubs
                          .filter((club) => club.type === "DEPARTMENT")
                          .map((club) => (
                            <option key={club.id} value={club.id}>
                              {club.name}
                            </option>
                          ))}
                      </select>
                      <select
                        value={newUser?.department_club_role}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            department_club_role: e.target.value,
                          })
                        }
                        className={`w-40 border p-2 rounded ${newUser.role === "STUDENT" ? "hidden" : ""
                          }`}
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
                  <div
                    className={`mb-4 ${rolesNoNeedOrganization.includes(newUser?.role) ||
                      newUser?.role === "MODERATOR" ||
                      roleOnlyNeedIsDepartment.includes(newUser?.role) ||
                      roleOnlyNeedIsCourse.includes(newUser?.role) ||
                      newUser.role === "PERSONNEL"
                      ? "hidden"
                      : ""
                      }`}
                  >
                    <label className="block text-sm font-medium mb-1">
                      Social Club
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={newUser?.social_club_id}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            social_club_id: e.target.value,
                          })
                        }
                        className="w-full border p-2 rounded"
                      >
                        <option value="">Select Social Club</option>
                        {clubs
                          .filter((club) => club.type === "SOCIAL")
                          .map((club) => (
                            <option key={club.id} value={club.id}>
                              {club.name}
                            </option>
                          ))}
                      </select>
                      <select
                        value={newUser?.social_club_role}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            social_club_role: e.target.value,
                          })
                        }
                        className={`w-40 border p-2 rounded ${newUser.role === "STUDENT" ? "hidden" : ""
                          }`}
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
                  <div
                    className={`mb-4 ${newUser.role !== "MODERATOR" ? "hidden" : ""
                      }`}
                  >
                    <label className="block text-sm font-medium mb-1">
                      Club
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={newUser?.moderator_club_id}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            moderator_club_id: e.target.value,
                          })
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
                      onClick={() => setIsEditModalOpen(false)}
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
          {isSignatureModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                <h2 className="text-lg font-semibold mb-4">Upload Signature</h2>
                <div className="mb-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleSignatureUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Select Signature Image
                  </button>
                </div>
                {previewUrl && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Preview:</p>
                    <img
                      src={previewUrl}
                      alt="Signature Preview"
                      className="max-w-full h-auto border rounded"
                    />
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setIsSignatureModalOpen(false);
                      setSignature(null);
                      setPreviewUrl("");
                      setSelectedUserId(null);
                    }}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSignatureSave}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                </div>
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
