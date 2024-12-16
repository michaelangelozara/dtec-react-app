import React from 'react';

function EClearanceModal({ show, onClose, clearance, onSignatureChange, signaturePreview, onApprove }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Certificate of Clearance</h2>
          
          <div className="text-center mb-6">
            <p>This is to certify that <strong>{clearance.studentName}</strong>, a {clearance.yearLevel} {clearance.course} student,
            has complied with all the requirements and is cleared of all responsibilities
            under my charge this {clearance.semester}, A.Y. {clearance.academicYear}.</p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">
              {clearance.office}:
              <span className={`ml-2 ${
                clearance.status === 'In Progress' ? 'text-yellow-500' :
                clearance.status === 'Approved' ? 'text-green-500' : 'text-red-500'
              }`}>
                {clearance.status}
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