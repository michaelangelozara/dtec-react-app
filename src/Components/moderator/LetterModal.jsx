import React, { useState } from 'react';
import ImplementationLetter from '../moderator/ImplementationLetter(InCampus)';
import ImplementationLetterOffCampus from '../moderator/ImplementationLetterOffCampus';
import CommunicationLetterInCampus from '../moderator/CommunicationLetterInCampus';
import CommunicationLetterOffCampus from '../moderator/CommunicationLetterOffCampus';
import BudgetProposalLetter from '../moderator/BudgetProposalLetter';
import Modal from "../modal/Modal";
import axios from "../../api/AxiosConfig";
import { showModal } from '../../states/slices/ModalSlicer';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function LetterModal({ letter, onClose, signaturePreview, onSignatureChange, onApprove }) {
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signedPeople, setSignedPeople] = useState([]);

  if (!letter) return null;

  if (!user) {
    navigate("/user-login")
    return;
  }

  const handleDeclineSubmit = async () => {
    try {
      const response = await axios.post(`/generic-letters/reject/${letter.id}?type=${letter.type}`, {
        "reason_of_rejection": declineReason
      });
      if (response.status === 200) {
        dispatch(showModal({ message: response.data?.message }))
      }
    } catch (error) {
    } finally {
      setDeclineReason('');
      setShowDeclineModal(false);
      onClose();
    }
  };

  const handleDecline = () => {
    setShowDeclineModal(true);
  };

  const getLetterComponent = () => {
    switch (letter.type) {
      case 'IMPLEMENTATION_LETTER_IN_CAMPUS':
        return (
          <ImplementationLetter
            letter={letter}
            signaturePreview={signaturePreview}
            onSignatureChange={onSignatureChange}
            setSignedPeople={setSignedPeople}
          />
        );
      case 'IMPLEMENTATION_LETTER_OFF_CAMPUS':
        return (
          <ImplementationLetterOffCampus
            letter={letter}
            signaturePreview={signaturePreview}
            onSignatureChange={onSignatureChange}
            setSignedPeople={setSignedPeople}
          />
        );
      case 'COMMUNICATION_LETTER':
        if (letter.cml === "OFF_CAMPUS") {
          return (
            <CommunicationLetterOffCampus
              letter={letter}
              signaturePreview={signaturePreview}
              onSignatureChange={onSignatureChange}
              setSignedPeople={setSignedPeople}
            />
          );
        } else {
          return (
            <CommunicationLetterInCampus
              letter={letter}
              signaturePreview={signaturePreview}
              onSignatureChange={onSignatureChange}
              setSignedPeople={setSignedPeople}
            />
          );
        }
      case 'BUDGET_PROPOSAL':
        return (
          <BudgetProposalLetter
            letter={letter}
            signaturePreview={signaturePreview}
            onSignatureChange={onSignatureChange}
            setSignedPeople={setSignedPeople}
          />
        );
      default:
        return <div>Unsupported letter type</div>;
    }
  };

  const status = signedPeople.filter(s => s.role === user.role)[0]?.status;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold">Letter Details</h1>
                <p className="text-sm">Review and Approve Request</p>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="border-b border-gray-400 w-full mb-8"></div>

            {/* Letter Content */}
            {getLetterComponent()}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDecline}
                className={`px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 ${user?.role === "MODERATOR" || user?.role === "STUDENT_OFFICER" ? "hidden" : ""}`}
                disabled={status === "EVALUATED" || letter.status === "DECLINED" || letter.status === "COMPLETED"}
              >
                Decline
              </button>
              <button
                onClick={onApprove}
                className={`px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 ${user?.role === "STUDENT_OFFICER" ? "hidden" : ""}`}
                disabled={status === "EVALUATED" || letter.status === "DECLINED" || letter.status === "COMPLETED"}
              >
                {signaturePreview ? 'Approve with Signature' : 'Please Add Signature to Approve'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decline Reason Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Decline Request</h2>
                <button
                  onClick={() => setShowDeclineModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Please provide a reason for declining:
                </label>
                <textarea
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows="4"
                  placeholder="Enter your reason here..."
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeclineModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeclineSubmit}
                  disabled={!declineReason.trim()}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-red-300"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal />
    </>
  );
}

export default LetterModal;