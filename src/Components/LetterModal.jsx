import React from 'react';
import ImplementationLetter from './ImplementationLetter(InCampus)';
import ImplementationLetterOffCampus from './ImplementationLetterOffCampus';
import CommunicationLetterInCampus from './CommunicationLetterInCampus';
import CommunicationLetterOffCampus from './CommunicationLetterOffCampus';
import BudgetProposalLetter from './BudgetProposalLetter';

function LetterModal({ letter, onClose, signaturePreview, onSignatureChange, onApprove }) {
  
  if (!letter) return null;

  const getLetterComponent = () => {
    switch (letter.type) {
      case 'IMPLEMENTATION_LETTER_IN_CAMPUS':
        return (
          <ImplementationLetter
            letter={letter}
            signaturePreview={signaturePreview}
            onSignatureChange={onSignatureChange}
          />
        );
      case 'IMPLEMENTATION_LETTER_OFF_CAMPUS':
        return (
          <ImplementationLetterOffCampus
            letter={letter}
            signaturePreview={signaturePreview}
            onSignatureChange={onSignatureChange}
          />
        );
      case 'COMMUNICATION_LETTER':
        if (letter.cml === "OFF_CAMPUS") {
          return (
            <CommunicationLetterOffCampus
              letter={letter}
              signaturePreview={signaturePreview}
              onSignatureChange={onSignatureChange}
            />
          );
        } else {
          return (
            <CommunicationLetterInCampus
              letter={letter}
              signaturePreview={signaturePreview}
              onSignatureChange={onSignatureChange}
            />
          );
        }
      case 'BUDGET_PROPOSAL':
        return (
          <BudgetProposalLetter
            letter={letter}
            signaturePreview={signaturePreview}
            onSignatureChange={onSignatureChange}
          />
        );
      default:
        return <div>Unsupported letter type</div>;
    }
  };

  return (
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
              onClick={onApprove}
              className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Approve with Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LetterModal;