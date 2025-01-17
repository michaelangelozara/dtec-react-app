import React, { useEffect, useState } from 'react';
import { FingerPrintIcon } from '@heroicons/react/24/outline';
import signature from './try.png';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from "../../api/AxiosConfig";
import { getSignature } from '../../services/LetterUtil';
import Fingerprint from '../Fingerprint/Fingerprint';

function ImplementationLetterOffCampus({
  letter,
  signaturePreview,
  onSignatureChange,
  setSignedPeople,
  setSignaturePreview }) {
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
        const response = await axios.get(`/implementation-letter-off-campuses/${letter.id}`);
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

  console.log(implementationLetter);
  return (
    <div className="space-y-4">
      <h2 className="text-center text-2xl font-bold mb-8 underline">
        INSTITUTIONAL OUTREACH PROJECT PROPOSAL
      </h2>

      {/* Content Sections */}
      <div>
        <label className="block font-semibold mb-2">I. TITLE OF THE ACTIVITY</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {implementationLetter?.name_of_activity}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">
          II. BRIEF DESCRIPTION AND / OR RATIONALE OF THE OUTREACH ACTIVITY / SERVICE
        </label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line">
          {implementationLetter?.description}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">III. TARGET GROUP AND REASONS FOR CHOOSING IT</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line">
          {implementationLetter?.reason}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">IV. DATE AND TIME OF IMPLEMENTATION</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {implementationLetter?.date_time}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">V. COMMITTEE, ACTIVITIES, OBJECTIVES, OUTPUTS</label>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">ACTIVITIES</th>
                <th className="border border-gray-300 p-2">OBJECTIVES</th>
                <th className="border border-gray-300 p-2">EXPECTED OUTPUT</th>
                <th className="border border-gray-300 p-2">COMMITTEES/IN-CHARGE</th>
              </tr>
            </thead>
            <tbody>
              {implementationLetter?.caoos?.map((activity, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{activity.activity}</td>
                  <td className="border border-gray-300 p-2">{activity.objective}</td>
                  <td className="border border-gray-300 p-2">{activity.expectedOutput}</td>
                  <td className="border border-gray-300 p-2">{activity.committee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">VI. PROGRAM OR FLOW OF ACTIVITIES</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {implementationLetter?.program_or_flow}
        </div>
      </div>

      {/* Mayor's Signature */}
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

      {/* Moderator's Signature */}
      <div className={`mt-6 text-center ${user?.role !== "MODERATOR" ? 'hidden' : ''}`}>
        <p className="font-semibold">Noted by:</p>
        <img
          src={signature}
          alt="Moderator's Signature"
          className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
          style={{ maxHeight: '150px', maxWidth: '300px' }}
        />
        <p className="mt-2 font-bold">ANDY SUAREZ</p>
        <p className="text-sm mt-2">Moderator, BLC A.Y. 2023-2024</p>
      </div>

      {/* DSA Signature Section */}
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
        {implementationLetter && getSignature(implementationLetter, "OFFICE_HEAD") ? <>
          <img
            src={getSignature(implementationLetter, "OFFICE_HEAD")}
            alt="DSA's Signature"
            className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
            style={{ maxHeight: '150px', maxWidth: '300px' }}
          />
        </> : <>
          {signature && (
            <img
              src={signature}
              alt="COMMUNITY's Signature"
              className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
              style={{ maxHeight: '150px', maxWidth: '300px' }}
            />
          )}
        </>}
        <p className="mt-2 font-bold">{user?.office_head}</p>
        <p>Community Development and Services Officer</p>
      </div>

      {/* CDSO Head Signature Section */}
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
        {implementationLetter && getSignature(implementationLetter, "PRESIDENT") ? <>
          <img
            src={getSignature(implementationLetter, "PRESIDENT")}
            alt="DSA's Signature"
            className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
            style={{ maxHeight: '150px', maxWidth: '300px' }}
          />
        </> : <>
          {signature && (
            <img
              src={signature}
              alt="PRESIDENT's Signature"
              className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
              style={{ maxHeight: '150px', maxWidth: '300px' }}
            />
          )}
        </>}
        <p className="mt-2 font-bold">{user?.president}</p>
        <p>NDTC President</p>
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

export default ImplementationLetterOffCampus;
