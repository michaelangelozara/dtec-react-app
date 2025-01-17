import React, { useState, useMemo, useEffect } from "react";
import { FaUserCircle, FaBell, FaEye } from "react-icons/fa";
import { Helmet } from "react-helmet";
import Banner from "../../Images/banner.svg";
import PendingIcon from "../../Images/pending.png";
import ApprovedIcon from "../../Images/approved.png";
import LetterModal from "../../Components/OIC/LetterModal";
import EClearanceModal from "../../Components/EClearanceModal";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "../../states/slices/ModalSlicer";
import axios from "../../api/AxiosConfig";
import { fetchUser } from "../../states/slices/UserSlicer";
import Modal from "../../Components/modal/Modal";
import { officeInChargeRole } from "../../services/UserUtil";
import PrimaryNavBar from "../../Components/NavBar/PrimaryNavBar";
import { navigateRouteByRole } from "../../services/RouteUtil";
import { getUserEvaluation } from "../../services/LetterUtil";

const rolesDontNeedLetter = [
  "SCHOOL_NURSE",
  "GUIDANCE",
  "DEAN",
  "CASHIER",
  "LIBRARIAN",
  "SCHOOL_NURSE",
  "PROGRAM_HEAD",
  "REGISTRAR",
  "ACCOUNTING_CLERK",
  "CUSTODIAN",
  "VPAF",
  "VPA",
  "MULTIMEDIA",
  "SCIENCE_LAB",
  "COMPUTER_SCIENCE_LAB",
  "ELECTRONICS_LAB",
  "CRIM_LAB",
  "HRM_LAB",
  "NURSING_LAB",
];

const rolesDontNeedClearance = ["OFFICE_HEAD"];

const statusesForLetter = [
  { label: "For Evaluation", value: "FOR_EVALUATION" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Approved", value: "COMPLETED" },
  { label: "Declined", value: "DECLINED" },
];

const statusesForClearance = [
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Approved", value: "COMPLETED" },
  { label: "Declined", value: "DECLINED" },
];

function StatusCard({ count, title, icon, onClick, isActive }) {
  return (
    <div
      onClick={onClick}
      className={`relative ${isActive ? "bg-green-900" : "bg-green-800"
        } hover:bg-green-900 rounded-lg p-4 cursor-pointer transition-colors w-64`}
    >
      <div className="flex flex-col h-24">
        <div className="flex justify-between items-start">
          <span className="text-4xl font-bold text-white">{count}</span>
          <img src={icon} alt={title} className="w-8 h-8" />
        </div>
        <div className="mt-auto">
          <p className="text-sm uppercase text-white">{title}</p>
        </div>
      </div>
    </div>
  );
}

function OICDashboard() {
  // State management
  const [activeTab, setActiveTab] = useState("letters"); // 'letters' or 'clearances'

  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedApplicationStatus, setSelectedApplicationStatus] =
    useState("SELECT ALL");
  const [showModalForClearance, setShowModalForClearnace] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [letters, setLetter] = useState([]);
  const [clearances, setClearances] = useState([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedClearance, setSelectedClearance] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [clearanceType, setClearanceType] = useState("SELECT ALL");
  const [clearanceStatus, setClearanceStatus] = useState("SELECT ALL");
  const [completedClearances, setCompletedClearances] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.user);

  const toggle = () => {
    setIsMounted((v) => !v);
  };

  // Get current data based on active tab
  const currentData = activeTab === "letters" ? letters : clearances;

  const normalizedData = letters.map((item) => ({
    id: item.id,
    cml: item.cml,
    createdDate: item.createdDate,
    type: item.type,
    signed_people: item.signed_people,
    ...item.fields, // Flatten the fields object
  }));

  // Memoized filtered items
  const filteredLetter = useMemo(() => {
    return normalizedData.filter((item) => {
      const matchesStatus = selectedStatus
        ? item.status === selectedStatus
        : true;
      const matchesApplicationStatus =
        selectedApplicationStatus === "SELECT ALL"
          ? true
          : item.status === selectedApplicationStatus;

      return matchesStatus && matchesApplicationStatus;
    });
  }, [normalizedData, selectedStatus, selectedApplicationStatus]);

  const filteredClearance = useMemo(() => {
    return clearances?.filter((item) => {
      const matchesStatus =
        clearanceStatus === "SELECT ALL"
          ? true
          : item?.clearance_signoffs?.filter((cs) => cs.role === user?.role)[0]
            ?.status === clearanceStatus;
      const matchesType =
        clearanceType === "SELECT ALL" ? true : item.type === clearanceType;
      return matchesStatus && matchesType;
    });
  }, [clearanceStatus, clearanceType, clearances, user]);

  // Pagination calculations
  const indexOfLastItem = currentPage * entriesPerPage;
  const indexOfFirstItem = indexOfLastItem - entriesPerPage;
  const currentItems = filteredLetter.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLetter.length / entriesPerPage);

  const pendingCountForLetter = letters?.filter((t) =>
    activeTab === "letters"
      ? t.signed_people?.filter((sp) => sp.role === user?.role)[0]?.status ===
      "FOR_EVALUATION"
      : ""
  ).length;
  const approvedCountForLetter = letters?.filter((t) =>
    activeTab === "letters" ? t.fields.status === "COMPLETED" : ""
  ).length;

  const pendingCountForClearance = clearances?.filter(
    (c) => activeTab === "clearances" && c.status === "PENDING"
  ).length;
  const approvedCountForClearance = clearances?.filter(
    (c) => activeTab === "clearances" && c.status === "COMPLETED"
  ).length;


  // Event handlers
  const handleCardClick = (status) => {
    setSelectedStatus(status === selectedStatus ? null : status);
    setSelectedApplicationStatus("SELECT ALL");
    setCurrentPage(1);
  };

  const handleSignatureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusNameForClearance = (item) => {
    const data = item.clearance_signoffs?.filter(
      (s) => s.role === user?.role
    )[0]?.status;
    if (data === "PENDING") {
      return "Pending";
    } else if (data === "IN_PROGRESS") {
      return "In Progress";
    } else {
      return "Completed";
    }
  };

  const openModalForLetter = (letter) => {
    setSelectedLetter(letter);
    setIsDetailsOpen(true);
  };

  const openModalForClearance = (clearance) => {
    setActiveTab("clearances");
    setSelectedClearance(clearance);
    setIsDetailsOpen(true);
    toggle();
  };

  const closeModal = () => {
    setIsDetailsOpen(false);
    setSelectedLetter(null);
  };

  const handleApprove = async () => {
    try {
      if (!signaturePreview) {
        dispatch(showModal({ message: "No Signature Found" }));
        return;
      }

      let response;
      if (activeTab === "letters") {
        response = await axios.post(
          `/generic-letters/sign-letter/${selectedLetter.id}?type=${selectedLetter.type}`,
          {
            signature: signaturePreview,
          }
        );
      } else {
        response = await axios.post(
          `/clearances/sign-clearance/${selectedClearance?.id}`,
          {
            signature: signaturePreview,
          }
        );
      }

      if (response.status === 201) {
        dispatch(showModal({ message: response.data?.message }));
        toggle();
      }
    } catch (error) {
      if (error.status === 403 || error.status === 404) {
        dispatch(showModal({ message: error.response?.data?.message }));
      }
    } finally {
      if (signaturePreview) {
        closeModal();
      }
    }
  };

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "FOR_EVALUATION":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "DECLINED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const shouldShowStatusCards = () => {
    if (user?.role === "CASHIER" && activeTab === "completed-clearances") {
      return false;
    }
    return true;
  };

  const handleRelease = async (id) => {
    try {

      const response = await axios.post(`/clearances/students/completed-clearances/${id}`);
      if (response.status === 200) {
        toggle();
        dispatch(showModal({ message: response.data?.message }));

      }
    } catch (error) {

    }
  }


  useEffect(() => {
    if (user && rolesDontNeedLetter.includes(user?.role)) {
      setActiveTab("clearances");
    } else if (user && rolesDontNeedClearance.includes(user?.role)) {
      setActiveTab("letters");
    } else {
      setActiveTab("letters");
    }
  }, [user, status]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/generic-letters?s=${entriesPerPage}`
        );
        setLetter(response.data?.data);
      } catch (error) { }
    };

    if (activeTab === "letters") {
      fetchData();
    }
  }, [isDetailsOpen]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/clearances`);
        setClearances(response.data?.data);
      } catch (error) { }
    };

    if (activeTab !== "letters") {
      fetchData();
    }
  }, [activeTab, entriesPerPage, isMounted]);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }

    if (user && !officeInChargeRole.includes(user.role)) {
      navigate(navigateRouteByRole(user));
    }
  }, [dispatch, user, status]);

  useEffect(() => {
    const fetchCompletedClearances = async () => {
      try {
        const response = await axios.get(`/clearances/students/completed-clearances`);
        setCompletedClearances(response?.data?.data);
      } catch (error) {

      }
    }
    fetchCompletedClearances();
  }, [isMounted]);


  return (
    <>
      {status === "Succeeded" && (
        <>
          <Helmet>
            <title>OIC Dashboard</title>
          </Helmet>

          <div className="min-h-screen bg-gray-100">
            <PrimaryNavBar />

            {/* Title Section */}
            <div className="py-6 px-10">
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome,{" "}
                {user?.first_name +
                  " " +
                  user?.middle_name +
                  " " +
                  user?.lastname}
                !
              </h1>
              <p className="mt-2 text-gray-600">Transaction Evaluation</p>
              <hr className="mt-4 border-gray-300" />
            </div>

            {/* Tabs */}
            <div className="px-10 mb-6">
              <div className="flex space-x-4 border-b">
                <button
                  className={`${rolesDontNeedLetter.includes(user?.role) ? "hidden" : ""
                    } py-2 px-4 ${activeTab === "letters"
                      ? "border-b-2 border-green-800 text-green-800"
                      : "text-gray-500"
                    }`}
                  onClick={() => setActiveTab("letters")}
                >
                  Letters
                </button>
                <button
                  className={`py-2 px-4 ${rolesDontNeedClearance.includes(user?.role) ? "hidden" : ""
                    } ${activeTab === "clearances"
                      ? "border-b-2 border-green-800 text-green-800"
                      : "text-gray-500"
                    }`}
                  onClick={() => setActiveTab("clearances")}
                >
                  E-Clearances
                </button>
                <button
                  className={`py-2 px-4 ${user?.role !== "CASHIER" ? "hidden" : ""
                    } ${activeTab === "completed-clearances"
                      ? "border-b-2 border-green-800 text-green-800"
                      : "text-gray-500"
                    }`}
                  onClick={() => setActiveTab("completed-clearances")}
                >
                  Completed Clearances
                </button>
              </div>
            </div>

            {/* Status Cards and Filters */}
            {shouldShowStatusCards() && (
              <div className="px-10 flex justify-between items-start">
                <div className="flex space-x-4">
                  <StatusCard
                    count={
                      activeTab === "letters"
                        ? pendingCountForLetter
                        : pendingCountForClearance
                    }
                    title={activeTab === "letters" ? "FOR EVALUATION" : "PENDING"}
                    icon={PendingIcon}
                    onClick={() =>
                      handleCardClick(
                        activeTab === "letters" ? "For Evaluation" : "In Progress"
                      )
                    }
                    isActive={
                      selectedStatus ===
                      (activeTab === "letters" ? "For Evaluation" : "In Progress")
                    }
                  />
                  <StatusCard
                    count={
                      activeTab === "letters"
                        ? approvedCountForLetter
                        : approvedCountForClearance
                    }
                    title={activeTab === "letters" ? "COMPLETED" : "COMPLETED"}
                    icon={ApprovedIcon}
                    onClick={() => handleCardClick("Approved")}
                    isActive={selectedStatus === "Approved"}
                  />
                </div>


                {activeTab === "letters" && (
                  <div className="flex space-x-4">
                    <div className="relative">
                      <label className="block text-xs text-gray-500 mb-1">
                        Application Status
                      </label>
                      <select
                        className="appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 w-48 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={selectedApplicationStatus}
                        onChange={(e) => {
                          setSelectedApplicationStatus(e.target.value);
                          setSelectedStatus(null);
                          setCurrentPage(1);
                        }}
                      >
                        <option>SELECT ALL</option>
                        {activeTab === "letters" ? (
                          <>
                            {statusesForLetter.map((status, index) => (
                              <option key={index} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </>
                        ) : (
                          <>
                            {statusesForClearance.map((status, index) => (
                              <option key={index} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                )}
                {activeTab === "clearances" && (
                  <>
                    <div className="flex space-x-4">
                      <div className="relative">
                        <label className="block text-xs text-gray-500 mb-1">
                          Clearance Status
                        </label>
                        <select
                          className="appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 w-48 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          value={clearanceStatus}
                          onChange={(e) => setClearanceStatus(e.target.value)}
                        >
                          <option>SELECT ALL</option>
                          <option value="PENDING">Pending</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <div className="relative">
                        <label className="block text-xs text-gray-500 mb-1">
                          Clearance Type
                        </label>
                        <select
                          className="appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 w-48 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          value={clearanceType}
                          onChange={(e) => {
                            setClearanceType(e.target.value);
                          }}
                        >
                          <option value="SELECT ALL">SELECT ALL</option>
                          <option value="STUDENT_CLEARANCE">
                            Student Clearance
                          </option>
                          <option value="PERSONNEL_CLEARANCE">
                            Personnel Clearance
                          </option>
                        </select>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            {/* Table Section */}
            <div className="mx-10 mt-10">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Table Header */}
                <div className="bg-green-800 text-white p-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">
                      {activeTab === "letters"
                        ? "List of Transactions"
                        : "List of E-Clearances"}
                    </h2>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <span className="text-sm mr-2">Search:</span>
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="bg-white text-gray-800 rounded px-2 py-1 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        {activeTab === "letters" ? (
                          <>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Date Requested
                            </th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Type Of Letter
                            </th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Name of Transaction
                            </th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Requested By
                            </th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Transaction Status
                            </th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Notes
                            </th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Date and Time Completed
                            </th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Action
                            </th>
                          </>
                        ) : activeTab === "clearances" ? (
                          <>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Date Requested
                            </th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Type Of Clearance
                            </th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Name
                            </th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Course & Year
                            </th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Status
                            </th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Notes
                            </th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Date Completed
                            </th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Action
                            </th>
                          </>
                        ) : (
                          <>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Date Completed
                            </th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Name
                            </th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Course & Year
                            </th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Status
                            </th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Action
                            </th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {activeTab === "letters" ? (
                        <>
                          {filteredLetter.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="p-3">{item.date_requested}</td>
                              <td className="p-3">
                                {item.cml
                                  ? item.name_of_transaction +
                                  " (" +
                                  item.cml +
                                  ")"
                                  : item.letter_type}
                              </td>
                              <td className="p-3">
                                {item.name_of_transaction}
                              </td>
                              <td className="p-3">{item.requested_by}</td>
                              <td className="p-3">
                                <span
                                  className={`${getStatusColor(
                                    item.status
                                  )} px-2 py-1 rounded-full text-xs`}
                                >
                                  {item.status !== "IN_PROGRESS"
                                    ? item.status
                                    : item.signed_people?.filter(
                                      (sp) => sp.role === user?.role
                                    )[0]?.status}
                                </span>
                              </td>
                              <td className="p-3">
                                {item.reason_of_rejection}
                              </td>
                              <td className="p-3">
                                {item.status === "COMPLETED"
                                  ? item.last_update
                                  : "N/A"}
                              </td>
                              <td className="p-3">
                                <button
                                  disabled={
                                    getUserEvaluation(item, user?.role) ===
                                    "EVALUATED"
                                  }
                                  className={`${item.status === "COMPLETED"
                                      ? "bg-gray-500"
                                      : "bg-green-800"
                                    } text-white text-sm px-4 py-2 rounded ${item.status !== "COMPLETED"
                                      ? "hover:bg-green-900"
                                      : ""
                                    }`}
                                  onClick={() => openModalForLetter(item)}
                                >
                                  <FaEye className="inline mr-1" />
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </>
                      ) : activeTab === "clearances" ? (
                        <>
                          {filteredClearance?.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="p-3">
                                {item.date_of_student_signature}
                              </td>
                              <td className="p-3">{item.type}</td>
                              <td className="p-3">
                                {item.user?.first_name}{" "}
                                {item.user?.middle_name[0]}.{" "}
                                {item.user?.lastname}
                              </td>
                              <td className="p-3">
                                {item.type === "STUDENT_CLEARANCE"
                                  ? item.user?.course?.short_name +
                                  " - " +
                                  item.user?.year_level
                                  : "N/A"}
                              </td>
                              <td className={`p-3`}>
                                <span
                                  className={`${getStatusNameForClearance(item) ===
                                      "Pending"
                                      ? "bg-blue-400"
                                      : getStatusNameForClearance(item) ===
                                        "In Progress"
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                                    }`}
                                >
                                  {getStatusNameForClearance(item)}
                                </span>
                              </td>
                              <td className="p-3">N/A</td>
                              <td className="p-3">
                                {item.status === "COMPLETED"
                                  ? item.last_modified
                                  : "N/A"}
                              </td>
                              <td className="p-3">
                                <button
                                  disabled={
                                    getUserEvaluation(item, user?.role) ===
                                    "COMPLETED"
                                  }
                                  className={`${item.status === "COMPLETED"
                                      ? "bg-gray-500"
                                      : "bg-green-800"
                                    } text-white text-sm px-4 py-2 rounded ${item.status !== "COMPLETED"
                                      ? "hover:bg-green-900"
                                      : ""
                                    }`}
                                  onClick={() => openModalForClearance(item)}
                                >
                                  <FaEye className="inline mr-1" />
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </>
                      ) : (
                        <>
                          {completedClearances
                            ?.map((item, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="p-3">{item.last_modified}</td>
                                <td className="p-3">
                                  {item.user?.first_name}{" "}
                                  {item.user?.middle_name[0]}.{" "}
                                  {item.user?.lastname}
                                </td>
                                <td className="p-3">
                                  {item.user?.course?.short_name +
                                    " - " +
                                    item.user?.year_level}
                                </td>
                                <td className="p-3">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${item.is_released
                                        ? "bg-green-500 text-white"
                                        : "bg-blue-500 text-white"
                                      }`}
                                  >
                                    {item.is_released ? "Released" : "Pending"}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <button
                                    className="bg-green-800 text-white text-sm px-4 py-2 rounded hover:bg-green-900 disabled:bg-gray-400"
                                    onClick={() => handleRelease(item.id)}
                                    disabled={item.is_released}
                                  >
                                    Release
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="bg-white px-4 py-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Showing {indexOfFirstItem + 1} to{" "}
                      {Math.min(indexOfLastItem, filteredLetter.length)} of{" "}
                      {filteredLetter.length} entries
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 border rounded text-sm ${currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "text-gray-600 hover:bg-gray-50"
                          }`}
                      >
                        Previous
                      </button>
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => paginate(index + 1)}
                          className={`px-3 py-1 rounded text-sm ${currentPage === index + 1
                              ? "bg-green-800 text-white"
                              : "border text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 border rounded text-sm ${currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "text-gray-600 hover:bg-gray-50"
                          }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modals */}
            {isDetailsOpen && activeTab === "letters" && (
              <LetterModal
                onClose={closeModal}
                letter={selectedLetter}
                onSignatureChange={handleSignatureChange}
                signaturePreview={signaturePreview}
                onApprove={handleApprove}
                setSignaturePreview={setSignaturePreview}
              />
            )}
            {isDetailsOpen && activeTab === "clearances" && (
              <EClearanceModal
                show={showModalForClearance}
                onClose={closeModal}
                clearance={selectedClearance}
                onSignatureChange={handleSignatureChange}
                signaturePreview={signaturePreview}
                onApprove={handleApprove}
                toggle={toggle}
                setSignaturePreview={setSignaturePreview}
              />
            )}
          </div>
          <Modal />
        </>
      )}
    </>
  );
}

export default OICDashboard;
