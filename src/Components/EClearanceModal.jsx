import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from "../api/AxiosConfig";
import { showModal } from '../states/slices/ModalSlicer';

function EClearanceModal({ show, onClose, clearance, onSignatureChange, signaturePreview, onApprove, toggle }) {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!user) {
    navigate("/oic/dashboard")
    return;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.post(`/clearances/${clearance?.id}/on-click`);
        toggle();
      } catch (error) {
        if (error.status === 403 || error.status === 404) {
          dispatch(showModal({ message: error.response?.data?.message }));
        }
      }
    }
    fetchData();
  }, []);


  const studentName = clearance?.student?.first_name + " " + clearance?.student?.middle_name[0] + ". " + clearance?.student?.lastname
  const schoolYear = clearance?.school_year;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Certificate of Clearance</h2>

          <div className="text-center mb-6">
            <p>This is to certify that <strong>{studentName}</strong>, a {clearance.yearLevel} {clearance.course} student,
              has complied with all the requirements and is cleared of all responsibilities
              under my charge this <strong>{schoolYear}</strong>.</p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">
              {user?.role}:
              <span className={`ml-2 ${clearance.status === 'In Progress' ? 'text-yellow-500' :
                clearance.clearance_signoffs?.filter((c) => c.role === user?.role)[0] ? 'text-green-500' : 'text-red-500'}`}>
                {clearance.clearance_signoffs?.filter((c) => c.role === user?.role)[0]?.status}
              </span>
            </h3>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Noted by:</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attach Signature
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={onSignatureChange}
                className="w-full"
              />
            </div>
            {signaturePreview && (
              <div className="mt-2">
                <img
                  src={signaturePreview}
                  alt="Signature Preview"
                  className="max-h-20 border rounded p-2"
                />
              </div>
            )}
            <input
              type="text"
              placeholder="Name of Office In-Charge"
              className="mt-4 w-full p-2 border rounded"
              defaultValue={user?.middle_name ? user.first_name + " " + user.middle_name[0] + ". " + user.lastname : user.first_name + " " + user.lastname}
              disabled
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Cancel
            </button>
            <button
              onClick={onApprove}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              disabled={clearance.clearance_signoffs?.filter((c) => c.role === user?.role)[0]?.status === "COMPLETED"}
            >
              Approve with Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EClearanceModal;