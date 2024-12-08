import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import SignatureCanvas from 'react-signature-canvas';
import Banner from '../../Images/banner.svg';

function ClearanceForm() {
  const [socialClubs, setSocialClubs] = useState([
    { name: '', position: '', treasurerSignature: '', moderatorSignature: '' }
  ]);
  const [departmentalClub, setDepartmentalClub] = useState({ name: '', position: '', treasurerSignature: '', presidentSignature: '' });
  const [departmentCouncil, setDepartmentCouncil] = useState({ name: '', position: '', treasurerSignature: '', presidentSignature: '' });
  const [csc, setCsc] = useState({ treasurerSignature: '', presidentSignature: '' });
  const [dsaSignature, setDsaSignature] = useState('');

  // Signature Refs
  const treasurerSigRefs = socialClubs.map(() => useRef(null));
  const moderatorSigRefs = socialClubs.map(() => useRef(null));
  const departmentalTreasurerSigRef = useRef(null);
  const departmentalPresidentSigRef = useRef(null);
  const departmentCouncilTreasurerSigRef = useRef(null);
  const departmentCouncilPresidentSigRef = useRef(null);
  const cscTreasurerSigRef = useRef(null);
  const cscPresidentSigRef = useRef(null);
  const dsaSigRef = useRef(null);

  const handleAddSocialClub = () => {
    if (socialClubs.length < 2) {
      setSocialClubs([...socialClubs, { name: '', position: '', treasurerSignature: '', moderatorSignature: '' }]);
    }
  };

  const handleSocialClubChange = (index, event) => {
    const newSocialClubs = [...socialClubs];
    newSocialClubs[index][event.target.name] = event.target.value;
    setSocialClubs(newSocialClubs);
  };

  const handleDepartmentalClubChange = (event) => {
    setDepartmentalClub({ ...departmentalClub, [event.target.name]: event.target.value });
  };

  const handleDepartmentCouncilChange = (event) => {
    setDepartmentCouncil({ ...departmentCouncil, [event.target.name]: event.target.value });
  };

  // Handle Save Signature
  const saveSignature = (ref, index, type, section) => {
    const signatureData = ref.current.toDataURL();
    
    if (section === 'social') {
      const newSocialClubs = [...socialClubs];
      if (type === 'treasurer') {
        newSocialClubs[index].treasurerSignature = signatureData;
      } else if (type === 'moderator') {
        newSocialClubs[index].moderatorSignature = signatureData;
      }
      setSocialClubs(newSocialClubs);
    } else if (section === 'departmental') {
      if (type === 'treasurer') {
        setDepartmentalClub(prev => ({ ...prev, treasurerSignature: signatureData }));
      } else if (type === 'president') {
        setDepartmentalClub(prev => ({ ...prev, presidentSignature: signatureData }));
      }
    } else if (section === 'departmentCouncil') {
      if (type === 'treasurer') {
        setDepartmentCouncil(prev => ({ ...prev, treasurerSignature: signatureData }));
      } else if (type === 'president') {
        setDepartmentCouncil(prev => ({ ...prev, presidentSignature: signatureData }));
      }
    } else if (section === 'csc') {
      if (type === 'treasurer') {
        setCsc(prev => ({ ...prev, treasurerSignature: signatureData }));
      } else if (type === 'president') {
        setCsc(prev => ({ ...prev, presidentSignature: signatureData }));
      }
    } else if (section === 'dsa') {
      setDsaSignature(signatureData);
    }
  };

  // Handle Clear Signature
  const clearSignature = (ref) => {
    ref.current.clear();
  };

  return (
    <>
      <Helmet>
        <title>OSA Clearance Form</title>
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
              <h1 className="text-3xl font-bold">OSA Clearance Form</h1>
              <p className="text-sm">For Club Officers</p>
            </div>
            <h2 className="text-3xl font-bold">E-Clearance</h2>
          </div>

          <div className="border-b border-gray-400 w-full my-4"></div>
        </div>

        {/* Form Section */}
        <div className="p-8 max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
          <h2 className="text-center text-2xl font-bold mb-8">Certificate of Clearance</h2>

          {/* Departmental Club Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Departmental Club</h3>

            <label className="block text-gray-700 font-bold mb-2">Name of Club:</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Club Name"
              value={departmentalClub.name}
              onChange={handleDepartmentalClubChange}
              className="block w-full p-2 border border-gray-300 rounded mb-2"
            />
            <label className="block text-gray-700 font-bold mb-2">Position:</label>
            <input
              type="text"
              name="position"
              placeholder="Enter Position"
              value={departmentalClub.position}
              onChange={handleDepartmentalClubChange}
              className="block w-full p-2 border border-gray-300 rounded mb-2"
            />

            {/* Treasurer's Signature */}
            {departmentalClub.treasurerSignature && (
              <div className="mt-4">
                <p className="font-bold text-gray-700">Treasurer's Signature Preview:</p>
                <img
                  src={departmentalClub.treasurerSignature}
                  alt="Departmental Treasurer's Signature"
                  className="border border-gray-400 rounded mt-2"
                  width="200"
                />
              </div>
            )}
            <label className="block text-gray-700 font-bold mb-2">Treasurer's Signature:</label>
            <SignatureCanvas
              ref={departmentalTreasurerSigRef}
              penColor="black"
              canvasProps={{ width: 500, height: 200, className: 'signature-canvas border border-gray-400 rounded' }}
              className="mb-2"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-2 mt-4"
              onClick={() => saveSignature(departmentalTreasurerSigRef, null, 'treasurer', 'departmental')}
            >
              Save Signature
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mb-4 mt-4"
              onClick={() => clearSignature(departmentalTreasurerSigRef)}
            >
              Clear Signature
            </button>

            {/* President's Signature */}
            {departmentalClub.presidentSignature && (
              <div className="mt-4">
                <p className="font-bold text-gray-700">President's Signature Preview:</p>
                <img
                  src={departmentalClub.presidentSignature}
                  alt="Departmental President's Signature"
                  className="border border-gray-400 rounded mt-2"
                  width="200"
                />
              </div>
            )}
            <label className="block text-gray-700 font-bold mb-2">President's Signature:</label>
            <SignatureCanvas
              ref={departmentalPresidentSigRef}
              penColor="black"
              canvasProps={{ width: 500, height: 200, className: 'signature-canvas border border-gray-400 rounded' }}
              className="mb-2"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-2 mt-4"
              onClick={() => saveSignature(departmentalPresidentSigRef, null, 'president', 'departmental')}
            >
              Save Signature
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mb-4 mt-4"
              onClick={() => clearSignature(departmentalPresidentSigRef)}
            >
              Clear Signature
            </button>
          </div>

          {/* Social Clubs Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Social Clubs</h3>

            {socialClubs.map((club, index) => (
              <div key={index} className="mb-4 border-b border-gray-300 pb-4">
                <label className="block text-gray-700 font-bold mb-2">Name of Club:</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Club Name"
                  value={club.name}
                  onChange={(event) => handleSocialClubChange(index, event)}
                  className="block w-full p-2 border border-gray-300 rounded mb-2"
                />
                <label className="block text-gray-700 font-bold mb-2">Position:</label>
                <input
                  type="text"
                  name="position"
                  placeholder="Enter Position"
                  value={club.position}
                  onChange={(event) => handleSocialClubChange(index, event)}
                  className="block w-full p-2 border border-gray-300 rounded mb-2"
                />

                {/* Treasurer's Signature */}
                {club.treasurerSignature && (
                  <div className="mt-4">
                    <p className="font-bold text-gray-700">Treasurer's Signature Preview:</p>
                    <img
                      src={club.treasurerSignature}
                      alt={`Social Club ${index + 1} Treasurer's Signature`}
                      className="border border-gray-400 rounded mt-2"
                      width="200"
                    />
                  </div>
                )}
                <label className="block text-gray-700 font-bold mb-2">Treasurer's Signature:</label>
                <SignatureCanvas
                  ref={treasurerSigRefs[index]}
                  penColor="black"
                  canvasProps={{ width: 500, height: 200, className: 'signature-canvas border border-gray-400 rounded' }}
                  className="mb-2"
                />
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-2 mt-4"
                  onClick={() => saveSignature(treasurerSigRefs[index], index, 'treasurer', 'social')}
                >
                  Save Signature
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mb-4 mt-4"
                  onClick={() => clearSignature(treasurerSigRefs[index])}
                >
                  Clear Signature
                </button>

                {/* Moderator's Signature */}
                {club.moderatorSignature && (
                  <div className="mt-4">
                    <p className="font-bold text-gray-700">Moderator's Signature Preview:</p>
                    <img
                      src={club.moderatorSignature}
                      alt={`Social Club ${index + 1} Moderator's Signature`}
                      className="border border-gray-400 rounded mt-2"
                      width="200"
                    />
                  </div>
                )}
                <label className="block text-gray-700 font-bold mb-2">Moderator's Signature:</label>
                <SignatureCanvas
                  ref={moderatorSigRefs[index]}
                  penColor="black"
                  canvasProps={{ width: 500, height: 200, className: 'signature-canvas border border-gray-400 rounded' }}
                  className="mb-2"
                />
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-2 mt-4"
                  onClick={() => saveSignature(moderatorSigRefs[index], index, 'moderator', 'social')}
                >
                  Save Signature
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mb-4 mt-4"
                  onClick={() => clearSignature(moderatorSigRefs[index])}
                >
                  Clear Signature
                </button>
              </div>
            ))}

            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={handleAddSocialClub}
              disabled={socialClubs.length >= 2} // Disable if 2 social clubs are added
            >
              Add Another Social Club
            </button>
          </div>

          {/* Department Council Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Department Council</h3>

            <label className="block text-gray-700 font-bold mb-2">Name of Department:</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Department Name"
              value={departmentCouncil.name}
              onChange={handleDepartmentCouncilChange}
              className="block w-full p-2 border border-gray-300 rounded mb-2"
            />
            <label className="block text-gray-700 font-bold mb-2">Position:</label>
            <input
              type="text"
              name="position"
              placeholder="Enter Position"
              value={departmentCouncil.position}
              onChange={handleDepartmentCouncilChange}
              className="block w-full p-2 border border-gray-300 rounded mb-2"
            />

            {/* Treasurer's Signature */}
            {departmentCouncil.treasurerSignature && (
              <div className="mt-4">
                <p className="font-bold text-gray-700">Treasurer's Signature Preview:</p>
                <img
                  src={departmentCouncil.treasurerSignature}
                  alt="Department Council Treasurer's Signature"
                  className="border border-gray-400 rounded mt-2"
                  width="200"
                />
              </div>
            )}
            <label className="block text-gray-700 font-bold mb-2">Treasurer's Signature:</label>
            <SignatureCanvas
              ref={departmentCouncilTreasurerSigRef}
              penColor="black"
              canvasProps={{ width: 500, height: 200, className: 'signature-canvas border border-gray-400 rounded' }}
              className="mb-2"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-2 mt-4"
              onClick={() => saveSignature(departmentCouncilTreasurerSigRef, null, 'treasurer', 'departmentCouncil')}
            >
              Save Signature
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mb-4 mt-4"
              onClick={() => clearSignature(departmentCouncilTreasurerSigRef)}
            >
              Clear Signature
            </button>

            {/* President's Signature */}
            {departmentCouncil.presidentSignature && (
              <div className="mt-4">
                <p className="font-bold text-gray-700">President's Signature Preview:</p>
                <img
                  src={departmentCouncil.presidentSignature}
                  alt="Department Council President's Signature"
                  className="border border-gray-400 rounded mt-2"
                  width="200"
                />
              </div>
            )}
            <label className="block text-gray-700 font-bold mb-2">President's Signature:</label>
            <SignatureCanvas
              ref={departmentCouncilPresidentSigRef}
              penColor="black"
              canvasProps={{ width: 500, height: 200, className: 'signature-canvas border border-gray-400 rounded' }}
              className="mb-2"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-2 mt-4"
              onClick={() => saveSignature(departmentCouncilPresidentSigRef, null, 'president', 'departmentCouncil')}
            >
              Save Signature
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mb-4 "
              onClick={() => clearSignature(departmentCouncilPresidentSigRef)}
            >
              Clear Signature
            </button>
          </div>

          {/* Central Student Council Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Central Student Council</h3>

            {/* CSC Treasurer's Signature */}
            {csc.treasurerSignature && (
              <div className="mt-4">
                <p className="font-bold text-gray-700">Treasurer's Signature Preview:</p>
                <img
                  src={csc.treasurerSignature}
                  alt="CSC Treasurer's Signature"
                  className="border border-gray-400 rounded mt-2"
                  width="200"
                />
              </div>
            )}
            <label className="block text-gray-700 font-bold mb-2">CSC Treasurer's Signature:</label>
            <SignatureCanvas
              ref={cscTreasurerSigRef}
              penColor="black"
              canvasProps={{ width: 500, height: 200, className: 'signature-canvas border border-gray-400 rounded' }}
              className="mb-2"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-2 mt-4"
              onClick={() => saveSignature(cscTreasurerSigRef, null, 'treasurer', 'csc')}
            >
              Save Signature
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mb-4 mt-4"
              onClick={() => clearSignature(cscTreasurerSigRef)}
            >
              Clear Signature
            </button>

            {/* CSC President's Signature */}
            {csc.presidentSignature && (
              <div className="mt-4">
                <p className="font-bold text-gray-700">President's Signature Preview:</p>
                <img
                  src={csc.presidentSignature}
                  alt="CSC President's Signature"
                  className="border border-gray-400 rounded mt-2"
                  width="200"
                />
              </div>
            )}
            <label className="block text-gray-700 font-bold mb-2">CSC President's Signature:</label>
            <SignatureCanvas
              ref={cscPresidentSigRef}
              penColor="black"
              canvasProps={{ width: 500, height: 200, className: 'signature-canvas border border-gray-400 rounded' }}
              className="mb-2"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-2 mt-4"
              onClick={() => saveSignature(cscPresidentSigRef, null, 'president', 'csc')}
            >
              Save Signature
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mt-4"
              onClick={() => clearSignature(cscPresidentSigRef)}
            >
              Clear Signature
            </button>
          </div>

          {/* Director of Student Affairs Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Director of Student Affairs</h3>

            {/* DSA Signature */}
            {dsaSignature && (
              <div className="mt-4">
                <p className="font-bold text-gray-700">DSA Signature Preview:</p>
                <img
                  src={dsaSignature}
                  alt="DSA Signature"
                  className="border border-gray-400 rounded mt-2"
                  width="200"
                />
              </div>
            )}
            <label className="block text-gray-700 font-bold mb-2">DSA Signature:</label>
            <SignatureCanvas
              ref={dsaSigRef}
              penColor="black"
              canvasProps={{ width: 500, height: 200, className: 'signature-canvas border border-gray-400 rounded' }}
              className="mb-2"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-2 mt-4"
              onClick={() => saveSignature(dsaSigRef, null, 'dsa', 'dsa')}
            >
              Save Signature
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mt-4"
              onClick={() => clearSignature(dsaSigRef)}
            >
              Clear Signature
            </button>
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

export default ClearanceForm;
