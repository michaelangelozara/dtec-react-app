import React, { useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

export default function ClearanceModal({ show, onClose, clearance, onSignatureChange, onApprove, userRole }) {
  const [sigCanvas, setSigCanvas] = useState(null);
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!sigCanvas || sigCanvas.isEmpty()) {
      alert('Please provide your signature');
      return;
    }
    const signatureData = sigCanvas.toDataURL();
    onSignatureChange(signatureData, notes);
    onApprove();
  };

  const getSectionTitle = (role) => {
    const titles = {
      GUIDANCE: 'GUIDANCE IN-CHARGE',
      STUDENT_AFFAIRS: 'DIRECTOR OF STUDENT AFFAIRS',
      LABORATORY: 'LABORATORY IN-CHARGE',
      DEAN: 'DEAN',
      CASHIER: 'CASHIER',
      LIBRARIAN: 'LIBRARIAN',
      NURSE: 'SCHOOL NURSE',
      PROGRAM_HEAD: 'PROGRAM HEAD',
      HM_LAB: 'HM LAB',
      CRIM_LAB: 'CRIM LAB',
      REGISTRAR: 'REGISTRAR'
    };
    return titles[role] || role;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">E-Clearance Review</h2>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Student Information:</h3>
          <p>Name: {clearance.studentName}</p>
          <p>Year Level: {clearance.yearLevel}</p>
          <p>Course: {clearance.course}</p>
          <p>Academic Year: {clearance.academicYear}</p>
          <p>Semester: {clearance.semester}</p>
        </div>
        <h2 className="text-2xl font-bold mb-4">Library</h2>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">{getSectionTitle(userRole)} Section:</h3>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Notes/Remarks:</label>
            <textarea
              className="w-full border rounded-md p-2"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes or remarks here..."
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Signature:</label>
            <div className="border rounded-md p-2">
              <SignatureCanvas
                ref={(ref) => setSigCanvas(ref)}
                canvasProps={{
                  className: 'signature-canvas w-full h-40 border rounded',
                }}
              />
            </div>
            <button
              className="mt-2 text-sm text-blue-600"
              onClick={() => sigCanvas?.clear()}
            >
              Clear Signature
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-800 text-white rounded-md"
            onClick={handleSave}
          >
            Sign & Approve
          </button>
        </div>
      </div>
    </div>
  );
}