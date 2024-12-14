import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function ImplementationLetterOffCampus({ letter, signaturePreview, onSignatureChange }) {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  if (!user) {
    navigate("/user/moderator-transaction")
    return;
  }
    
  return (
    <div className="space-y-4">
      <h2 className="text-center text-2xl font-bold mb-8 underline">
        INSTITUTIONAL OUTREACH PROJECT PROPOSAL
      </h2>

      <div>
        <label className="block font-semibold mb-2">I. TITLE OF THE ACTIVITY</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {letter.object.name_of_activity}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">II. BRIEF DESCRIPTION AND / OR RATIONALE OF THE OUTREACH ACTIVITY / SERVICE</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line">
          {letter.object.description}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">III. TARGET GROUP AND REASONS FOR CHOOSING IT</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line">
          {letter.object.reason}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">IV. DATE AND PLACE OF IMPLEMENTATION</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {letter.object.date_time}
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
              {letter.object?.caoos?.map((activity, index) => (
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
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line">
          {letter.object.program_or_flow}
        </div>
      </div>

      {/* Signatures Section */}
      <div className="mt-6 text-center">
        <p className="font-semibold">Prepared by:</p>
        <img
          alt="Mayor's Signature"
          className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
          style={{ maxHeight: '150px', maxWidth: '300px' }}
          src={letter.object.student_officer_signature}
        />
        <p className="mt-2 font-bold">{letter.object.student_officer}</p>
        <p className="text-sm mt-2">Mayor, BLC A.Y. 2023-2024</p>
      </div>

      <div className="mt-6">
        <div className="text-center">
          <p className="font-semibold">Noted by:</p>
          <div className="mt-4">
            <label className="block font-semibold mb-2">Attach Signature</label>
            <input
              type="file"
              className="border-gray-300 border-2 p-2 rounded-md w-full"
              accept="image/*"
              onChange={onSignatureChange}
            />
          </div>
          {signaturePreview && (
            <div className="mt-4">
              <p className="font-semibold">Signature Preview:</p>
              <img
                src={signaturePreview}
                alt="Signature Preview"
                className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                style={{ maxHeight: '150px', maxWidth: '300px' }}
              />
            </div>
          )}
          <p className="mt-2 font-bold">REV. FR. DARYLL DHAN L. BILBAO, DCC</p>
          <p>Community Development and Services Officer</p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="font-semibold">Approved by:</p>
        <p className="mt-2 font-bold">REV. FR. JESSIE P. PASQUIN, DCC</p>
        <p>NDTC President</p>
      </div>
    </div>
  );
}

export default ImplementationLetterOffCampus;