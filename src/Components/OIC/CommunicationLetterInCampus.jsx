import React, { useEffect, useState } from 'react';
import { FingerPrintIcon } from '@heroicons/react/24/outline';
import signature from './try.png';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from "../../api/AxiosConfig";
import Fingerprint from '../Fingerprint/Fingerprint';
import { getSignature } from "../../services/LetterUtil";

function CommunicationLetterInCampus({ letter, signaturePreview, onSignatureChange, setSignedPeople, setSignaturePreview }) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [communicationLetter, setCommunicationLetter] = useState(null);
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
            `/generic-letters/on-click/${letter.id}?type=${letter.type}`
          );
        }
        const response = await axios.get(`/communication-letters/${letter.id}`);
        setCommunicationLetter(response.data?.data);
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
    if (communicationLetter) {
      setSignedPeople(communicationLetter?.signed_people)
    }
  }, [communicationLetter]);

  return (
    <>
      <div className="space-y-4">
        <div>
          <label className="block font-semibold mb-2">DATE:</label>
          <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
            {communicationLetter?.date}
          </div>
        </div>

        <div className="mb-4">
          <div className="font-bold">REV. FR. JESSIE P. PASQUIN, DCC</div>
          <div>President</div>
          <div>Notre Dame of Tacurong College</div>
          <div>City of Tacurong</div>
        </div>

        <div>
          <label className="block font-semibold mb-2">LETTER CONTENT:</label>
          <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 min-h-[200px] whitespace-pre-line">
            {communicationLetter?.letter_of_content}
          </div>
        </div>

        {/* Mayor's Signature (Always shown) */}
        <div className={`mt-6 text-center ${user?.role !== "STUDENT_OFFICER" ? 'hidden' : ''}`}>
          <p className="font-semibold">Prepared by:</p>
          {communicationLetter && getSignature(communicationLetter, "STUDENT_OFFICER") ? <>
            <img
              src={getSignature(communicationLetter, "STUDENT_OFFICER")}
              alt="Mayor's Signature"
              className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
              style={{ maxHeight: '150px', maxWidth: '300px' }}
            />
          </> : <></>}
          <p className="mt-2 font-bold">CHRISTIAN JAMES V. TORRES</p>
          <p className="text-sm mt-2">Mayor, BLC A.Y. 2023-2024</p>
        </div>

        {/* Moderator's Signature (Always shown) */}
        <div className={`mt-6 text-center ${user?.role !== "MODERATOR" ? 'hidden' : ''}`}>
          <p className="font-semibold">Noted by:</p>
          {communicationLetter && getSignature(communicationLetter, "MODERATOR") ? <>
            <img
              src={getSignature(communicationLetter, "MODERATOR")}
              alt="Mayor's Signature"
              className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
              style={{ maxHeight: '150px', maxWidth: '300px' }}
            />
          </> : <></>}
          <p className="mt-2 font-bold">[Moderator Name]</p>
          <p className="text-sm mt-2">Moderator, BLC A.Y. 2023-2024</p>
        </div>

        {/* DSA Signature Section */}
        <div className={`mt-6 text-center ${user?.role !== "DSA" ? 'hidden' : ''}`}>
          <p className="font-semibold">Noted by:</p>
          <div className="mt-4">
            <button
              onClick={() => setCaptureFingerprint(true)}
              className={`${getSignature(communicationLetter, "DSA") || signature ? "hidden" : ""} flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto`}
            >
              <FingerPrintIcon className="w-6 h-6" />
              <span>Capture Fingerprint</span>
            </button>
          </div>
          {communicationLetter && getSignature(communicationLetter, "DSA") ? <>
            <img
              src={getSignature(communicationLetter, "DSA")}
              alt="DSA's Signature"
              className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
              style={{ maxHeight: '150px', maxWidth: '300px' }}
            />
          </> : <>
            {signature && (
              <img
                src={signature}
                alt="DSA's Signature"
                className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                style={{ maxHeight: '150px', maxWidth: '300px' }}
              />
            )}
          </>}
          <p className="mt-2 font-bold">BENJIE E. TAHUM, LPT, MAED-TESL</p>
          <p>Director of Student Affairs</p>
        </div>

        {/* President's Signature Section */}
        <div className={`mt-6 text-center ${user?.role !== "PRESIDENT" ? 'hidden' : ''}`}>
          <p className="font-semibold">Approved by:</p>
          <div className="mt-4">
            <button
              onClick={() => setCaptureFingerprint(true)}
              className={`${getSignature(communicationLetter, "PRESIDENT") ? "hidden" : ""} flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto`}
            >
              <FingerPrintIcon className="w-6 h-6" />
              <span>Capture Fingerprint</span>
            </button>
          </div>
          {communicationLetter && getSignature(communicationLetter, "PRESIDENT") ? <>
            <img
              src={getSignature(communicationLetter, "PRESIDENT")}
              alt="PRESIDENT's Signature"
              className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
              style={{ maxHeight: '150px', maxWidth: '300px' }}
            />
          </> : <>
            {signature && (
              <img
                src={signature}
                alt="DSA's Signature"
                className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                style={{ maxHeight: '150px', maxWidth: '300px' }}
              />
            )}
          </>}
          <p className="mt-2 font-bold">REV. FR. JESSIE P. PASQUIN, DCC</p>
          <p>President</p>
        </div>
      </div>

      {captureFingerprint && (
        <Fingerprint
          onOkClick={() => setCaptureFingerprint(false)}
          setSignature={setSignature}
          setSignaturePreview={setSignaturePreview} />
      )}
    </>
  );
}

export default CommunicationLetterInCampus;