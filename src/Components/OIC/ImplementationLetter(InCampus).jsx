import React, { useEffect, useState } from 'react';
import { FingerPrintIcon } from '@heroicons/react/24/outline';
import axios from "../../api/AxiosConfig";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSignature } from '../../services/LetterUtil';
import Fingerprint from '../Fingerprint/Fingerprint';

function ImplementationLetter({ letter, signaturePreview, onSignatureChange, setSignedPeople, setSignaturePreview }) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [implementationLetter, setImplementationLetter] = useState(null);
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
        const response = await axios.get(`/implementation-letter-in-campuses/${letter.id}`);
        setImplementationLetter(response.data?.data);
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
    if (implementationLetter) {
      setSignedPeople(implementationLetter?.signed_people)
    }
  }, [implementationLetter]);

  return (
    <div className="space-y-4">
      {/* Basic Information */}
      <div>
        <label className="block font-semibold mb-2">ORGANIZATION/CLUB NAME:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {implementationLetter?.club}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">NAME OF ACTIVITY:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {implementationLetter?.name_of_activity}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">SEMESTER & SCHOOL YEAR:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {implementationLetter?.semester_and_school_year}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">TITLE:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {implementationLetter?.title}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">DATE AND TIME:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {implementationLetter?.date_time}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">VENUE:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {implementationLetter?.venue}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">PARTICIPANTS:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {implementationLetter?.participants}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">RATIONALE</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line min-h-[100px]">
          {implementationLetter?.rationale}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">OBJECTIVES</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line min-h-[100px]">
          {implementationLetter?.objective}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">SOURCES OF FUND</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line min-h-[100px]">
          {implementationLetter?.source_of_fund}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">PROJECTED EXPENSES</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line min-h-[100px]">
          {implementationLetter?.projected_expenses}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">EXPECTED OUTPUT</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line min-h-[100px]">
          {implementationLetter?.expected_output}
        </div>
      </div>

      {/* Mayor's Signature (Always shown) */}
      <div className={`mt-6 text-center ${user?.role !== "STUDENT_OFFICER" ? 'hidden' : ''}`}>
        <p className="font-semibold">Prepared by:</p>
        <img
          src={signature}
          alt="Mayor's Signature"
          className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
          style={{ maxHeight: '150px', maxWidth: '300px' }}
        />
        <p className="mt-2 font-bold">CHRISTIAN JAMES V. TORRES</p>
        <p className="text-sm mt-2">Mayor, BLC A.Y. 2023-2024</p>
      </div>

      {/* Moderator's Signature (Always shown) */}
      <div className={`mt-6 text-center ${user?.role !== "MODERATOR" ? 'hidden' : ''}`}>
        <p className="font-semibold">Noted by:</p>
        <img
          src={signature}
          alt="Moderator's Signature"
          className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
          style={{ maxHeight: '150px', maxWidth: '300px' }}
        />
        <p className="mt-2 font-bold">[Moderator Name]</p>
        <p className="text-sm mt-2">Moderator, BLC A.Y. 2023-2024</p>
      </div>

      {/* DSA Signature Section */}
      <div className={`mt-6 text-center ${user?.role !== "DSA" ? 'hidden' : ''}`}>
        <p className="font-semibold">Approved by:</p>
        <div className="mt-4">
          <button
            onClick={() => setCaptureFingerprint(true)}
            className={`${getSignature(implementationLetter, "DSA") || signature ? "hidden" : ""} flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto`}
          >
            <FingerPrintIcon className="w-6 h-6" />
            <span>Capture Fingerprint</span>
          </button>
        </div>
        {implementationLetter && getSignature(implementationLetter, "DSA") ? <>
          <img
            src={getSignature(implementationLetter, "DSA")}
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

      {captureFingerprint && (
        <Fingerprint
          onOkClick={() => setCaptureFingerprint(false)}
          setSignature={setSignature}
          setSignaturePreview={setSignaturePreview} />
      )}
    </div>
  );
}

export default ImplementationLetter;