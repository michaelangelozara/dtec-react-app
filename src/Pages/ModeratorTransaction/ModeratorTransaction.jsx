import React, { useEffect, useMemo, useState } from "react";
import { FaUserCircle, FaBell, FaEye } from "react-icons/fa";
import { Helmet } from "react-helmet";
import PendingIcon from "../../Images/pending.png";
import ApprovedIcon from "../../Images/approved.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { moderatorRole } from "../../services/UserUtil";
import { navigateRouteByRole } from "../../services/RouteUtil";
import { fetchUser } from "../../states/slices/UserSlicer";
import Modal from "../../Components/modal/Modal";
import PrimaryNavBar from "../../Components/NavBar/PrimaryNavBar";
import axios from "../../api/AxiosConfig";

import LetterModal from "../../Components/moderator/LetterModal";
import { showModal } from "../../states/slices/ModalSlicer";

function StatusCard({ count, title, icon, onClick, isActive }) {
  return (
    <div
      onClick={onClick}
      className={`relative ${isActive ? 'bg-green-900' : 'bg-green-800'
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

const statusOfLetter = [
  { label: "For Evaluation", value: "FOR_EVALUATION" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Approved", value: "COMPLETED" },
  { label: "Declined", value: "DECLINED" }
];

const typeOfLetter = [
  { label: "Communication Letter (In Campus)", value: "IN_CAMPUS" },
  { label: "Communication Letter (Off Campus)", value: "OFF_CAMPUS" },
  { label: "Implementation Letter (In Campus)", value: "IMPLEMENTATION_LETTER_IN_CAMPUS" },
  { label: "Implementation Letter (Off Campus)", value: "IMPLEMENTATION_LETTER_OFF_CAMPUS" },
  { label: "Budget Proposal", value: "BUDGET_PROPOSAL" }
];

function ModeratorTransaction() {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState("SELECT ALL");
  const [selectedLetterType, setSelectedLetterType] = useState("SELECT ALL");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [selectedLetter, setSelectedLetter] = useState({});
  const [signaturePreview, setSignaturePreview] = useState("");

  const { user, status } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [pageRange, setPageRange] = useState([0, 10]);
  const [fields, setFields] = useState([]);

  const getStatusColor = (status) => {
    switch (status) {
      case "FOR_EVALUATION":
        return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "DECLINED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const openModal = (letter) => {
    setSelectedLetter(letter);
    setIsDetailsOpen(true);
  };

  const closeModal = () => {
    setIsDetailsOpen(false);
    setSelectedLetter(null);
  };

  const handleSignatureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        console.error('Unsupported file type');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result); // Set the base64 string
      };
      reader.readAsDataURL(file);
    } else {
      setSignaturePreview(null);
    }
  };

  const filteredTransactions = useMemo(() => {
    return fields.filter((field) => {
      const matchesStatus = selectedStatus === "SELECT ALL"
        ? true
        : field.fields && field.fields.status === selectedStatus;

      const matchesApplicationStatus = selectedLetterType === "SELECT ALL"
        ? true
        : field.fields && field.fields.letter_type === selectedLetterType;

      return matchesStatus && matchesApplicationStatus;
    });
  }, [fields, selectedStatus, selectedLetterType]);

  const forEvaluationCount = fields.filter(t => t.fields.status === "FOR_EVALUATION").length;
  const approvedCount = fields.filter(t => t.fields.status === "APPROVED").length;

  const handleCardClick = (status) => {
    setSelectedStatus(status === selectedStatus ? null : status);
    setSelectedLetterType("SELECT ALL");
  };

  const handleModeratorSignature = async () => {
    try {

      const response = await axios.post(`/generic-letters/sign-letter/${selectedLetter.id}?type=${selectedLetter.type}`, {
        "signature": signaturePreview
      });
      if (response.status === 201) {
        dispatch(showModal({ message: response.data?.message }));
      }
    } catch (error) {
      if (error.status === 403 || error.status === 404) {
        dispatch(showModal({ message: error.response?.data?.message }));
      }
    } finally {
      closeModal();
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/generic-letters?s=${entriesPerPage}`);
        setFields(response.data?.data);
        console.log(response);
      } catch (error) {
        console.log(error)
      }
    }
    fetchData();
  }, [selectedStatus, isDetailsOpen, entriesPerPage]);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser())
    }

    if (user && !moderatorRole.includes(user.role)) {
      navigate(navigateRouteByRole(user));
    }
  }, [dispatch, user, status]);

  return (
    <>
      {status === "Succeeded" && (
        <>
          <Helmet>
            <title>Moderator Transactions</title>
          </Helmet>

          <div className="min-h-screen bg-gray-100">
            <PrimaryNavBar />

            <div className="py-6 px-10">
              <h1 className="text-3xl font-bold text-gray-800">Club Letters Processing</h1>
              <p className="mt-2 text-gray-600">Manage and process club letters</p>
              <hr className="mt-4 border-gray-300" />
            </div>

            <div className="px-10 flex justify-between items-start">
              <div className="flex space-x-4">
                <StatusCard
                  count={forEvaluationCount}
                  title="FOR EVALUATION"
                  icon={PendingIcon}
                  onClick={() => handleCardClick("For Evaluation")}
                  isActive={selectedStatus === "For Evaluation"}
                />
                <StatusCard
                  count={approvedCount}
                  title="APPROVED"
                  icon={ApprovedIcon}
                  onClick={() => handleCardClick("Approved")}
                  isActive={selectedStatus === "Approved"}
                />
              </div>

              <div className="flex space-x-4">
                <div className="relative">
                  <label className="block text-xs text-gray-500 mb-1">Application Status</label>
                  <select
                    className="appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 w-48 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option>SELECT ALL</option>
                    {statusOfLetter.map((element, index) => (
                      <option key={index} value={element.value}>{element.label}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 mt-6">
                    <svg className="fill-current h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-xs text-gray-500 mb-1">Letter Type</label>
                  <select
                    className="appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 w-64 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={selectedLetterType}
                    onChange={(e) => setSelectedLetterType(e.target.value)}
                  >
                    <option>SELECT ALL</option>
                    {typeOfLetter.map((element, index) => (
                      <option key={index} value={element.value}>{element.label}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 mt-6">
                    <svg className="fill-current h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-10 mt-10">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-green-800 text-white p-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">List of Letters</h2>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <span className="text-sm mr-2">Show</span>
                        <select
                          className="bg-white text-gray-800 rounded px-2 py-1 text-sm"
                          value={entriesPerPage}
                          onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                        >
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                        </select>
                        <span className="text-sm ml-2">entries</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm mr-2">Search:</span>
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="bg-white text-gray-800 rounded px-2 py-1 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Date Requested</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Letter Type</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Name of Transaction</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Requested By</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Last Update</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Current Location</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredTransactions.map((transaction, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="p-3">{transaction.fields.date_requested}</td>
                          <td className="p-3">{transaction.type === "COMMUNICATION_LETTER" ? transaction.type + " (" + transaction.cml + ")" : transaction.type}</td>
                          <td className="p-3">{transaction.fields.name_of_transaction}</td>
                          <td className="p-3">{transaction.fields.requested_by}</td>
                          <td className="p-3">
                            <span className={`${getStatusColor(transaction.fields.status)} px-2 py-1 rounded text-sm`}>
                              {transaction.fields?.status === "COMPLETED" || transaction.fields?.status === "DECLINED" ? transaction.fields.status : transaction.signed_people?.filter(sp => sp.role === user?.role)[0]?.status}
                            </span>
                          </td>
                          <td className="p-3">{transaction.fields.last_update ? transaction.fields.last_update : "N/A"}</td>
                          <td className="p-3">{transaction.fields.current_location}</td>
                          <td className="p-3">
                            <button
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded flex items-center space-x-1"
                              onClick={() => openModal(transaction)}
                            >
                              <FaEye className="text-sm" />
                              <span>VIEW</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-white px-4 py-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Showing 1 to {filteredTransactions.length} of {filteredTransactions.length} entries
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 border rounded text-sm text-gray-600 hover:bg-gray-50">Previous</button>
                      <button className="px-3 py-1 bg-green-800 text-white rounded text-sm">1</button>
                      <button className="px-3 py-1 border rounded text-sm text-gray-600 hover:bg-gray-50">Next</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal />
          {isDetailsOpen && (
            <LetterModal
              letter={selectedLetter}
              onClose={closeModal}
              signaturePreview={signaturePreview}
              onSignatureChange={handleSignatureChange}
              onApprove={handleModeratorSignature}
            />
          )}
        </>
      )}
    </>
  );
}

export default ModeratorTransaction;