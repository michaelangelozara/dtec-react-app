import React, { useState } from 'react';
import { FingerPrintIcon } from '@heroicons/react/24/outline';
import signature from './try.png';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from "../../api/AxiosConfig";

function ImplementationLetterOffCampus({ letter, setSignedPeople }) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [implementationLetter, setImplementationLetter] = useState(null);

  const handleCaptureFingerprint = () => {

  };

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
      <h2 className="text-center text-2xl font-bold mb-8 underline">
        INSTITUTIONAL OUTREACH PROJECT PROPOSAL
      </h2>

      {/* Content Sections */}
      <div>
        <label className="block font-semibold mb-2">I. TITLE OF THE ACTIVITY</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {letter.content?.activityName}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">
          II. BRIEF DESCRIPTION AND / OR RATIONALE OF THE OUTREACH ACTIVITY / SERVICE
        </label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line">
          {letter.content?.rationale}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">III. TARGET GROUP AND REASONS FOR CHOOSING IT</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line">
          {letter.content?.participants}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">IV. DATE AND TIME OF IMPLEMENTATION</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {letter.content?.dateTime}
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
              {letter.content?.activities?.map((activity, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{activity.activity}</td>
                  <td className="border border-gray-300 p-2">{activity.objective}</td>
                  <td className="border border-gray-300 p-2">{activity.output}</td>
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
          <ul className="list-disc pl-4">
            {letter.content?.programFlow?.map((item, index) => (
              <li key={index} className="mb-2">
                <span className="font-bold">{item.time}</span>: {item.activity}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mayor's Signature */}
      <div className="mt-6 text-center">
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
      <div className="mt-6 text-center">
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
      <div className="mt-6 text-center">
        <p className="font-semibold">Noted by:</p>
        {signatures.dsa ? (
          <img
            src={signature}
            alt="DSA Signature"
            className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
            style={{ maxHeight: '150px', maxWidth: '300px' }}
          />
        ) : (
          <div className="mt-4">
            <button
              onClick={() => handleCaptureFingerprint('dsa')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
            >
              <FingerPrintIcon className="w-6 h-6" />
              <span>Capture Fingerprint</span>
            </button>
          </div>
        )}
        <p className="mt-2 font-bold">BENJIE E. TAHUM, LPT, MAED-TESL</p>
        <p>Director of Student Affairs</p>
      </div>

      {/* CDSO Head Signature Section */}
      <div className="mt-6 text-center">
        <p className="font-semibold">Approved by:</p>
        {signatures.cdsHead ? (
          <img
            src={signature}
            alt="CDSO Head Signature"
            className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
            style={{ maxHeight: '150px', maxWidth: '300px' }}
          />
        ) : (
          <div className="mt-4">
            <button
              onClick={() => handleCaptureFingerprint('cdsHead')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
            >
              <FingerPrintIcon className="w-6 h-6" />
              <span>Capture Fingerprint</span>
            </button>
          </div>
        )}
        <p className="mt-2 font-bold">REV. FR. DARYLL DHAN L. BILBAO, DCC</p>
        <p>Office Head, CDSO</p>
      </div>
    </div>
  );
}

export default ImplementationLetterOffCampus;
