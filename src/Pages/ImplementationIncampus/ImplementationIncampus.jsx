import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import Banner from '../../Images/banner.svg';

function ImplementationProgramForm() {
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [objectives, setObjectives] = useState(['']);
  const [dateTimes, setDateTimes] = useState(['']);
  const [sourcesOfFund, setSourcesOfFund] = useState(['']);
  const [projectedExpenses, setProjectedExpenses] = useState(['']);
  const [expectedOutputs, setExpectedOutputs] = useState(['']);

  const handleSignatureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSignaturePreview(null);
    }
  };

  const handleFieldChange = (setter, index, value) => {
    const newFieldValues = [...setter];
    newFieldValues[index] = value;
    setter(newFieldValues);
  };

  const addField = (setter) => {
    setter((prevFields) => [...prevFields, '']);
  };

  const removeField = (setter, index) => {
    setter((prevFields) => prevFields.filter((_, i) => i !== index));
  };

  return (
    <>
      <Helmet>
        <title>Implementation Program</title>
      </Helmet>

      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-green-800 py-4 px-6 flex justify-between items-center">
          <img src={Banner} alt="DTEC Logo" className="h-16" />
          <div className="flex items-center space-x-4">
            <FaBell className="text-white text-xl" />
            <FaUserCircle className="text-white text-2xl" />
          </div>
        </div>

        {/* Form Title */}
        <div className="p-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">New Transaction Request</h1>
              <p className="text-sm">Create New Request</p>
            </div>
            <h2 className="text-3xl font-bold">Implementation Letter (In Campus)</h2>
          </div>

          <div className="border-b border-gray-400 w-full my-4"></div>
        </div>

        {/* Form Section */}
        <div className="p-8 max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
          <h2 className="text-center text-2xl font-bold mb-8">IMPLEMENTATION PROGRAM</h2>

          {/* Organization/Club Name */}
          <div className="mt-4">
            <label className="block font-semibold mb-2">ORGANIZATION/CLUB NAME:</label>
            <input 
              type="text" 
              className="w-full border-gray-300 border-2 p-2 rounded-md" 
              placeholder="Enter Organization/Club Name" 
            />
          </div>

          {/* Activity Name */}
          <div className="mt-4">
            <label className="block font-semibold mb-2">NAME OF ACTIVITY:</label>
            <input 
              type="text" 
              className="w-full border-gray-300 border-2 p-2 rounded-md" 
              placeholder="Enter Name of Activity" 
            />
          </div>

          {/* Semester & School Year */}
          <div className="mt-4">
            <label className="block font-semibold mb-2">SEMESTER & SCHOOL YEAR:</label>
            <input 
              type="text" 
              className="w-full border-gray-300 border-2 p-2 rounded-md" 
              placeholder="Enter Semester & School Year" 
            />
          </div>

          {/* Title */}
          <div className="mt-4">
            <label className="block font-semibold mb-2">TITLE:</label>
            <input 
              type="text" 
              className="w-full border-gray-300 border-2 p-2 rounded-md" 
              placeholder="Enter Title" 
            />
          </div>

          {/* Date and Time */}
          <div className="mt-4">
            <label className="block font-semibold mb-2">DATE AND TIME:</label>
            {dateTimes.map((dateTime, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  className="w-full border-gray-300 border-2 p-2 rounded-md"
                  placeholder="Enter Date and Time"
                  value={dateTime}
                  onChange={(e) => handleFieldChange(setDateTimes, index, e.target.value)}
                />
                {dateTimes.length > 1 && (
                  <button
                    type="button"
                    className="ml-2 text-red-500"
                    onClick={() => removeField(setDateTimes, index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              onClick={() => addField(setDateTimes)}
            >
              Add Date and Time
            </button>
          </div>

          {/* Venue */}
          <div className="mt-4">
            <label className="block font-semibold mb-2">VENUE:</label>
            <input 
              type="text" 
              className="w-full border-gray-300 border-2 p-2 rounded-md" 
              placeholder="Enter Venue" 
            />
          </div>

          {/* Participants */}
          <div className="mt-4">
            <label className="block font-semibold mb-2">PARTICIPANTS:</label>
            <input 
              type="text" 
              className="w-full border-gray-300 border-2 p-2 rounded-md" 
              placeholder="Enter Participants" 
            />
          </div>

          {/* Rationale */}
          <div className="mt-4">
            <label className="block font-semibold mb-2">RATIONALE:</label>
            <textarea 
              rows="4" 
              className="w-full border-gray-300 border-2 p-2 rounded-md" 
              placeholder="Enter Rationale"
            ></textarea>
          </div>

          {/* Objectives */}
          <div className="mt-4">
            <label className="block font-semibold mb-2">OBJECTIVES:</label>
            {objectives.map((objective, index) => (
              <div key={index} className="flex items-center mb-2">
                <textarea
                  rows="2"
                  className="w-full border-gray-300 border-2 p-2 rounded-md"
                  placeholder="Enter Objective"
                  value={objective}
                  onChange={(e) => handleFieldChange(setObjectives, index, e.target.value)}
                />
                {objectives.length > 1 && (
                  <button
                    type="button"
                    className="ml-2 text-red-500"
                    onClick={() => removeField(setObjectives, index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              onClick={() => addField(setObjectives)}
            >
              Add Objective
            </button>
          </div>

          {/* Sources of Fund */}
          <div className="mt-4">
            <label className="block font-semibold mb-2">SOURCES OF FUND:</label>
            {sourcesOfFund.map((source, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  className="w-full border-gray-300 border-2 p-2 rounded-md"
                  placeholder="Enter Source of Fund"
                  value={source}
                  onChange={(e) => handleFieldChange(setSourcesOfFund, index, e.target.value)}
                />
                {sourcesOfFund.length > 1 && (
                  <button
                    type="button"
                    className="ml-2 text-red-500"
                    onClick={() => removeField(setSourcesOfFund, index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              onClick={() => addField(setSourcesOfFund)}
            >
              Add Source of Fund
            </button>
          </div>

          {/* Projected Expenses */}
          <div className="mt-4">
            <label className="block font-semibold mb-2">PROJECTED EXPENSES:</label>
            {projectedExpenses.map((expense, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  className="w-full border-gray-300 border-2 p-2 rounded-md"
                  placeholder="Enter Projected Expense"
                  value={expense}
                  onChange={(e) => handleFieldChange(setProjectedExpenses, index, e.target.value)}
                />
                {projectedExpenses.length > 1 && (
                  <button
                    type="button"
                    className="ml-2 text-red-500"
                    onClick={() => removeField(setProjectedExpenses, index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              onClick={() => addField(setProjectedExpenses)}
            >
              Add Projected Expense
            </button>
          </div>

          {/* Expected Output */}
          <div className="mt-4">
            <label className="block font-semibold mb-2">EXPECTED OUTPUT:</label>
            {expectedOutputs.map((output, index) => (
              <div key={index} className="flex items-center mb-2">
                <textarea
                  rows="2"
                  className="w-full border-gray-300 border-2 p-2 rounded-md"
                  placeholder="Enter Expected Output"
                  value={output}
                  onChange={(e) => handleFieldChange(setExpectedOutputs, index, e.target.value)}
                />
                {expectedOutputs.length > 1 && (
                  <button
                    type="button"
                    className="ml-2 text-red-500"
                    onClick={() => removeField(setExpectedOutputs, index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              onClick={() => addField(setExpectedOutputs)}
            >
              Add Expected Output
            </button>
          </div>

          {/* Prepared By */}
          <div className="mt-6">
            <div className="text-center">
              <p className="font-semibold">Prepared by:</p>
              <div className="mt-2">
                <label className="block font-semibold mb-2">Attach Signature</label>
                <input 
                  type="file" 
                  className="border-gray-300 border-2 p-2 rounded-md" 
                  accept="image/*"
                  onChange={handleSignatureChange}
                />
              </div>
              {signaturePreview && (
                <div className="mt-4">
                  <p className="font-semibold">Signature Preview:</p>
                  <img 
                    src={signaturePreview} 
                    alt="Signature Preview" 
                    className="mx-auto border border-gray-300 p-2 rounded-md"
                    style={{ maxHeight: '150px', maxWidth: '300px' }}
                  />
                </div>
              )}
              <input 
                type="text" 
                className="w-full border-gray-300 border-2 p-2 rounded-md mt-2 text-center"
                placeholder="Name of Club Mayor"
              />
              <p className="text-sm mt-2">POSITION, CLUB, A.Y. 2024-2025</p>
            </div>
          </div>

          {/* Noted By */}
          <div className="mt-6 text-center">
            <p className="font-semibold">Noted by:</p>
            <input
              type="text"
              className="w-full border-gray-300 border-2 p-2 rounded-md mt-2 text-center"
              placeholder="Name of Club Moderator"
            />
            <p className="text-sm mt-2">MODERATOR, CLUB, A.Y. 2024-2025</p>
          </div>

          {/* Approved By */}
          <div className="mt-6 text-center">
            <p className="font-semibold">Approved by:</p>
            <p className="mt-2">ENGR. LOUIE ANGELO G. RIN, MSIT</p>
            <p>Dean, Institute of Technology</p>
          </div>

          {/* Submit / Cancel Buttons */}
          <div className="flex justify-end mt-6 space-x-4">
            <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Cancel</button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Submit</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ImplementationProgramForm;
