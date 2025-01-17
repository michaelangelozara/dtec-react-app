import React, { useEffect, useState } from 'react';
import { FingerPrintIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from "../../api/AxiosConfig";
import { getSignature } from '../../services/LetterUtil';
import Fingerprint from '../Fingerprint/Fingerprint';

function PermitEnterApproval({
  permit,
  signaturePreview,
  onSignatureChange,
  setSignedPeople,
  setSignaturePreview 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [permitDetails, setPermitDetails] = useState(null);
  const [captureFingerprint, setCaptureFingerprint] = useState(false);
  const [signature, setSignature] = useState(null);
  
  if (!user) {
    navigate("/user/moderator-transaction");
    return;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (user.role !== "STUDENT_OFFICER") {
          await axios.post(
            `/generic-letters/on-click/${permit.id}?type=${permit.type}`
          );
        }
        const response = await axios.get(`/permit-to-enters/${permit.id}`);
        setPermitDetails(response.data?.data);
      } catch (error) {
        if (error.status === 404) {
          dispatch(showModal({ message: error.response?.data?.message }));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (permitDetails) {
      setSignedPeople(permitDetails?.signed_people)
    }
  }, [permitDetails]);

  return (
    <div className="space-y-4">
      <h2 className="text-center text-2xl font-bold mb-8 underline">
        PERMIT TO ENTER THE CAMPUS OUTSIDE REGULAR SCHEDULES
      </h2>

      {/* Content Sections */}
      <div>
        <label className="block font-semibold mb-2">Requisitioner:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {permitDetails?.requisitioner}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Club:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {permitDetails?.club}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Position/Role:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {permitDetails?.position}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Activity/Purpose:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line">
          {permitDetails?.activity}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Date:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {permitDetails?.date}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-2">Time From:</label>
          <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
            {permitDetails?.time_from}
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-2">Time To:</label>
          <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
            {permitDetails?.time_to}
          </div>
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Participants:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line">
          {permitDetails?.participants}
        </div>
      </div>

      {/* Requisitioner's Signature */}
      <div className="mt-6 text-center">
        <p className="font-semibold">Requested By:</p>
        {permitDetails && getSignature(permitDetails, "STUDENT_OFFICER") && (
          <img
            src={getSignature(permitDetails, "STUDENT_OFFICER")}
            alt="Requisitioner's Signature"
            className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
            style={{ maxHeight: '150px', maxWidth: '300px' }}
          />
        )}
        <p className="mt-2 font-bold">{permitDetails?.requisitioner}</p>
        <p className="text-sm mt-2">MAYOR, {permitDetails?.club} A.Y. 2023-2024</p>
      </div>

      {/* Moderator's Signature */}
      <div className={`mt-6 text-center ${user?.role !== "MODERATOR" ? 'hidden' : ''}`}>
        <p className="font-semibold">Noted by:</p>
        <div className={`mt-4 ${user?.role !== "MODERATOR" ? "hidden" : ""}`}>
          <button
            onClick={() => setCaptureFingerprint(true)}
            disabled={user?.role !== "MODERATOR"}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
          >
            <FingerPrintIcon className="w-6 h-6" />
            <span>Capture Fingerprint</span>
          </button>
        </div>
        {permitDetails && getSignature(permitDetails, "MODERATOR") ? (
          <img
            src={getSignature(permitDetails, "MODERATOR")}
            alt="Moderator's Signature"
            className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
            style={{ maxHeight: '150px', maxWidth: '300px' }}
          />
        ) : (
          signature && (
            <img
              src={signature}
              alt="Moderator's Signature"
              className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
              style={{ maxHeight: '150px', maxWidth: '300px' }}
            />
          )
        )}
        <p className="mt-2 font-bold">{permitDetails?.moderator}</p>
        <p className="text-sm mt-2">MODERATOR, {permitDetails?.club} A.Y. 2023-2024</p>
      </div>

      {/* CDSO Signature Section */}
      <div className={`mt-6 text-center ${user?.role !== "OFFICE_HEAD" ? 'hidden' : ''}`}>
        <p className="font-semibold">Noted by:</p>
        <div className={`mt-4 ${user?.role !== "OFFICE_HEAD" ? "hidden" : ""}`}>
          <button
            onClick={() => setCaptureFingerprint(true)}
            disabled={user?.role !== "OFFICE_HEAD"}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
          >
            <FingerPrintIcon className="w-6 h-6" />
            <span>Capture Fingerprint</span>
          </button>
        </div>
        {permitDetails && getSignature(permitDetails, "OFFICE_HEAD") ? (
          <img
            src={getSignature(permitDetails, "OFFICE_HEAD")}
            alt="CDSO's Signature"
            className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
            style={{ maxHeight: '150px', maxWidth: '300px' }}
          />
        ) : (
          signature && (
            <img
              src={signature}
              alt="CDSO's Signature"
              className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
              style={{ maxHeight: '150px', maxWidth: '300px' }}
            />
          )
        )}
        <p className="mt-2 font-bold">{permitDetails?.office_head}</p>
        <p>Community Development and Services Officer</p>
      </div>

      {/* President Signature Section */}
      <div className={`mt-6 text-center ${user?.role !== "PRESIDENT" ? 'hidden' : ''}`}>
        <p className="font-semibold">Approved by:</p>
        <div className={`mt-4 ${user?.role !== "PRESIDENT" ? "hidden" : ""}`}>
          <button
            onClick={() => setCaptureFingerprint(true)}
            disabled={user?.role !== "PRESIDENT"}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
          >
            <FingerPrintIcon className="w-6 h-6" />
            <span>Capture Fingerprint</span>
          </button>
        </div>
        {permitDetails && getSignature(permitDetails, "PRESIDENT") ? (
          <img
            src={getSignature(permitDetails, "PRESIDENT")}
            alt="President's Signature"
            className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
            style={{ maxHeight: '150px', maxWidth: '300px' }}
          />
        ) : (
          signature && (
            <img
              src={signature}
              alt="President's Signature"
              className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
              style={{ maxHeight: '150px', maxWidth: '300px' }}
            />
          )
        )}
        <p className="mt-2 font-bold">{permitDetails?.president}</p>
        <p>NDTC President</p>
      </div>

      {captureFingerprint && (
        <Fingerprint
          onOkClick={() => setCaptureFingerprint(false)}
          setSignature={setSignature}
          setSignaturePreview={setSignaturePreview}
        />
      )}
    </div>
  );
}

export default PermitEnterApproval;