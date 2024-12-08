import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import Banner from '../../Images/banner.svg';

function ImplementationLetterOffCampus() {
  const [rows, setRows] = useState([{ activity: '', objective: '', output: '', committee: '' }]);
  const [signaturePreview, setSignaturePreview] = useState(null);

  const addRow = () => {
    setRows([...rows, { activity: '', objective: '', output: '', committee: '' }]);
  };

  const removeRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

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

  return (
    <>
      <Helmet>
        <title>Implementation Letter (Off Campus)</title>
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
            <h2 className="text-3xl font-bold">Implementation Letter (Off-Campus)</h2>
          </div>

          <div className="border-b border-gray-400 w-full my-4"></div>
        </div>

        {/* Form Section */}
        <div className="p-8 max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
          <h2 className="text-center text-2xl font-bold mb-8 underline">
            INSTITUTIONAL OUTREACH PROJECT PROPOSAL
          </h2>

          {/* Title of the Activity */}
          <div className="mt-4">
            <label className="block font-semibold mb-2">I. TITLE OF THE ACTIVITY</label>
            <input 
              type="text" 
              className="w-full border-gray-300 border-2 p-2 rounded-md" 
              placeholder="Enter Activity Title" 
            />
          </div>

          {/* Rationale */}
          <div className="mt-4">
            <label className="block font-semibold mb-2">II. BRIEF DESCRIPTION AND / OR RATIONALE OF THE OUTREACH ACTIVITY / SERVICE</label>
            <textarea 
              rows="4" 
              className="w-full border-gray-300 border-2 p-2 rounded-md" 
              placeholder="Enter Description/Rationale"
            ></textarea>
          </div>

          {/* Target Group */}
          <div className="mt-4">
            <label className="block font-semibold mb-2">III. TARGET GROUP AND REASONS FOR CHOOSING IT</label>
            <textarea 
              rows="4" 
              className="w-full border-gray-300 border-2 p-2 rounded-md" 
              placeholder="Enter Target Group and Reasons"
            ></textarea>
          </div>

          {/* Date and Place of Implementation */}
          <div className="mt-4">
            <label className="block font-semibold mb-2">IV. DATE AND PLACE OF IMPLEMENTATION</label>
            <input 
              type="text" 
              className="w-full border-gray-300 border-2 p-2 rounded-md" 
              placeholder="Enter Date and Place of Implementation" 
            />
          </div>

          {/* Committees, Objectives, Outputs */}
          <div className="mt-4">
            <label className="block font-semibold mb-2">V. COMMITTEE, ACTIVITIES, OBJECTIVES, OUTPUTS</label>
            <table className="w-full border-collapse border border-gray-300 mt-2">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">ACTIVITIES</th>
                  <th className="border border-gray-300 p-2">OBJECTIVES</th>
                  <th className="border border-gray-300 p-2">EXPECTED OUTPUT</th>
                  <th className="border border-gray-300 p-2">COMMITTEES/IN-CHARGE</th>
                  <th className="border border-gray-300 p-2">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">
                      <input 
                        type="text" 
                        className="w-full p-2"
                        value={row.activity}
                        onChange={(e) => handleInputChange(index, 'activity', e.target.value)}
                        placeholder="Enter Activity"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input 
                        type="text" 
                        className="w-full p-2"
                        value={row.objective}
                        onChange={(e) => handleInputChange(index, 'objective', e.target.value)}
                        placeholder="Enter Objective"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input 
                        type="text" 
                        className="w-full p-2"
                        value={row.output}
                        onChange={(e) => handleInputChange(index, 'output', e.target.value)}
                        placeholder="Enter Expected Output"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input 
                        type="text" 
                        className="w-full p-2"
                        value={row.committee}
                        onChange={(e) => handleInputChange(index, 'committee', e.target.value)}
                        placeholder="Enter Committee/In-Charge"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <button 
                        onClick={() => removeRow(index)} 
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 text-center">
              <button 
                onClick={addRow} 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Row
              </button>
            </div>
          </div>

          {/* Program or Flow of Activities */}
          <div className="mt-4">
            <label className="block font-semibold mb-2">VI. PROGRAM OR FLOW OF ACTIVITIES</label>
            <textarea 
              rows="4" 
              className="w-full border-gray-300 border-2 p-2 rounded-md" 
              placeholder="Enter Program/Flow of Activities"
            ></textarea>
          </div>

          {/* Prepared By with Signature Preview */}
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
            <p className="mt-2">REV. FR. DARYLL DHAN L. BILBAO, DCC</p>
            <p>Community Development and Services Officer</p>
          </div>

          {/* Approved By */}
          <div className="mt-6 text-center">
            <p className="font-semibold">Approved by:</p>
            <p className="mt-2">REV. FR. JESSIE P. PASQUIN, DCC</p>
            <p>NDTC President</p>
          </div>
          
          {/* Submit / Cancel Buttons */} 
          <div className="flex justify-end mt-6 space-x-4"> 
              <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Cancel</button> 
              <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Submit</button> </div>
        </div>
      </div>
    </>
  );
}

export default ImplementationLetterOffCampus;
