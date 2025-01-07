import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from "../api/AxiosConfig";
import { showModal } from '../states/slices/ModalSlicer';
import { FingerPrintIcon } from '@heroicons/react/24/outline';
import Fingerprint from "../Components/Fingerprint/Fingerprint";

function EClearanceModal({ show, onClose, clearance, onSignatureChange, signaturePreview, onApprove, toggle, setSignaturePreview }) {
  const { user, status } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [fingerprintData, setFingerprintData] = useState(null);
  const [captureFingerprint, setCaptureFingerprint] = useState(false);
  const [signature, setSignature] = useState(null);

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Certificate of Clearance</h2>

          <div className="text-center mb-6">
            <p>This is to certify that <strong>{clearance?.user?.middle_name ? clearance?.user?.first_name + " " + clearance?.user?.middle_name[0] + ". " + clearance?.user?.lastname : clearance?.user?.first_name + " " + clearance?.user?.lastname}</strong>, a {clearance.yearLevel} {clearance.course} student,
              has complied with all the requirements and is cleared of all responsibilities
              under my charge this <strong>{clearance?.school_year}</strong>.</p>
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
            <div className='w-full flex justify-center'>
              {signature && !captureFingerprint && (
                <img src={signature} alt="" />
              )}
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => setCaptureFingerprint(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
              >
                <FingerPrintIcon className="w-6 h-6" />
                <span>Capture Fingerprint</span>
              </button>
            </div>
            {fingerprintData && (
              <div className="mt-4 text-center">
                <p className="text-green-600 font-semibold">✓ Fingerprint captured successfully</p>
                <p className="text-sm text-gray-500">Timestamp: {new Date(fingerprintData.timestamp).toLocaleString()}</p>
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
              Approve with Fingerprint
            </button>
          </div>
        </div>
      </div>
      {captureFingerprint && (
        <Fingerprint
          onOkClick={() => setCaptureFingerprint(false)}
          setSignature={setSignature}
          setSignaturePreview={setSignaturePreview} />
      )}
    </div>
  );
}

export default EClearanceModal;