import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import PrimaryNavBar from '../../Components/NavBar/PrimaryNavBar';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { navigateRouteByRole } from '../../services/RouteUtil';
import { fetchUser } from '../../states/slices/UserSlicer';
import { studentAndPersonnelRole } from '../../services/UserUtil';
import axios from "../../api/AxiosConfig";
import { showModal } from '../../states/slices/ModalSlicer';
import Modal from "../../Components/modal/Modal";

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

function StudentClearanceTracking() {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [clearance, setClearance] = useState([]);
  const { user, status } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "For Evaluation":
        return "bg-blue-100 text-blue-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/clearances/new-clearance");
        setClearance(response.data?.data);
      } catch (error) {
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
      if (clearance && clearance?.student_signature && clearance?.status === "PENDING") {
        dispatch(showModal({ message: "Your Clearance is In-Progress" }));
      } else if(clearance && clearance?.student_signature && clearance?.status === "COMPLETED"){
        if(clearance.type === "STUDENT_CLEARANCE"){
          dispatch(showModal({ message: "Please Claim your Permit at Cashier" }));
        }else{
          dispatch(showModal({ message: "Clearance is Completed" }));
        }
      }
    }, [clearance]);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user, status]);

  return (
    <>
      <Helmet>
        <title>Clearance Tracking</title>
      </Helmet>

      {status === "Succeeded" && (
        <div className="min-h-screen bg-gray-100">
          <PrimaryNavBar />

          <div className="py-6 px-10">
            <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.middle_name ? user?.first_name + " " + user?.middle_name[0] + ". " + user?.lastname : user?.first_name + " " + user?.lastname}!</h1>
            <p className="mt-2 text-gray-600">Clearance Status Tracking</p>
            <hr className="mt-4 border-gray-300" />
          </div>

          <div className="mx-10 mt-5 pb-10">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-green-800 text-white p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Clearance Status</h2>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time Submitted</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Office Name</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Office In-Charge</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time Completed</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Array.isArray(clearance?.clearance_signoffs) && clearance?.is_submitted && clearance?.clearance_signoffs?.map((signoff) => (
                      <tr 
                        key={signoff.id} 
                        className={`hover:bg-gray-50 ${signoff.status === "COMPLETED" ? 'bg-green-50' : ''}`}
                      >
                        <td className="p-3">{clearance?.date_of_student_signature}</td>
                        <td className="p-3">{signoff.role}</td>
                        <td className="p-3">{signoff.office_in_charge}</td>
                        <td className="p-3">{signoff.status === "COMPLETED" ? signoff.last_modified : "N/A"}</td>
                        <td className="p-3">{signoff.note ? signoff.note : "N/A"}</td>
                        <td className="p-3">
                          <span className={`${getStatusColor(signoff.status)} px-2 py-1 rounded text-sm`}>
                            {signoff.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <Modal />
        </div>
      )}
    </>
  );
}

export default StudentClearanceTracking;