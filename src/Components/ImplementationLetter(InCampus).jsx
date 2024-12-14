import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function ImplementationLetter({ letter, signaturePreview, onSignatureChange }) {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  if (!user) {
    navigate("/user/moderator-transaction")
    return;
  }

  return (
    <div className="space-y-4">
      {/* Basic Information */}
      <div>
        <label className="block font-semibold mb-2">ORGANIZATION/CLUB NAME:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {letter.object.club}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">NAME OF ACTIVITY:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {letter.object.name_of_activity}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">SEMESTER & SCHOOL YEAR:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {letter.object.semester_and_school_year}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">TITLE:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {letter.object.title}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">DATE AND TIME:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {letter.object.date_time}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">VENUE:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {letter.object.venue}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">PARTICIPANTS:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {letter.object.participants}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">RATIONALE :</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line min-h-[100px]">
          {letter.object.rationale}
        </div>
      </div>
      <div>
        <label className="block font-semibold mb-2">OBJECTIVES :</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line min-h-[100px]">
          {letter.object.objective}
        </div>
      </div>
      <div>
        <label className="block font-semibold mb-2">SOURCES OF FUND :</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line min-h-[100px]">
          {letter.object.source_of_fund}
        </div>
      </div>
      <div>
        <label className="block font-semibold mb-2">PROJECTED EXPENSES :</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line min-h-[100px]">
          {letter.object.projected_expenses}
        </div>
      </div>
      <div>
        <label className="block font-semibold mb-2">EXPECTED OUTPUT :</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line min-h-[100px]">
          {letter.object.expected_output}
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
          <input
            type="text"
            className="w-full border-gray-300 border-2 p-2 rounded-md mt-4 text-center"
            placeholder="Name of Club Moderator"
            defaultValue={user.first_name + " " + user.middle_name + " " + user.lastname}
            disabled
          />
          <p className="text-sm mt-2">MODERATOR, CLUB, A.Y. 2024-2025</p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="font-semibold">Approved by:</p>
        <p className="mt-2 font-bold">BENJIE E. TAHUM, LPT, MAED-TESL</p>
        <p>Director of Student Affairs</p>
      </div>
    </div>
  );
}

export default ImplementationLetter;