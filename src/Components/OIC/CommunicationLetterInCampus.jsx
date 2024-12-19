import React, { useState } from 'react';
import { FingerPrintIcon } from '@heroicons/react/24/outline';
import signature from './try.png';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from "../../api/AxiosConfig";

function CommunicationLetterInCampus({ letter, signaturePreview, onSignatureChange }) {
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


  return (
    <div className="space-y-4">
      <div>
        <label className="block font-semibold mb-2">DATE:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {letter.content?.date}
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
          {letter.content?.letterContent}
        </div>
      </div>

      {/* Mayor's Signature (Always shown) */}
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

      {/* Moderator's Signature (Always shown) */}
      <div className="mt-6 text-center">
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

      {/* President's Signature Section */}
      <div className="mt-6 text-center">
        <p className="font-semibold">Approved by:</p>
        {signatures.president ? (
          <img 
            src={signature}
            alt="President Signature" 
            className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
            style={{ maxHeight: '150px', maxWidth: '300px' }}
          />
        ) : (
          <div className="mt-4">
            <button
              onClick={() => handleCaptureFingerprint('president')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
            >
              <FingerPrintIcon className="w-6 h-6" />
              <span>Capture Fingerprint</span>
            </button>
          </div>
        )}
        <p className="mt-2 font-bold">REV. FR. JESSIE P. PASQUIN, DCC</p>
        <p>President</p>
      </div>
    </div>
  );
}

export default CommunicationLetterInCampus;