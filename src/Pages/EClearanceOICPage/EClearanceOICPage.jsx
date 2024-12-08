import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Helmet } from 'react-helmet';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import Banner from '../../Images/banner.svg';

function OfficeInChargeForm() {
  const [signatures, setSignatures] = useState({
    guidanceInCharge: null,
    studentAffairs: null,
    scienceLab: null,
    computerLab: null,
    electronicsLab: null,
    dean: null,
    cashier: null,
    librarian: null,
    schoolNurse: null,
    programHead: null,
    hmLab: null,
    crimLab: null,
    registrar: null,
  });

  const [notes, setNotes] = useState({
    guidanceInCharge: '',
    studentAffairs: '',
    scienceLab: '',
    computerLab: '',
    electronicsLab: '',
    dean: '',
    cashier: '',
    librarian: '',
    schoolNurse: '',
    programHead: '',
    hmLab: '',
    crimLab: '',
    registrar: '',
  });

  const formFields = [
    { label: 'GUIDANCE IN-CHARGE', key: 'guidanceInCharge' },
    { label: 'DIRECTOR OF STUDENT AFFAIRS', key: 'studentAffairs' },
    { label: 'DEAN', key: 'dean' },
    { label: 'CASHIER', key: 'cashier' },
    { label: 'LIBRARIAN', key: 'librarian' },
    { label: 'SCHOOL NURSE', key: 'schoolNurse' },
    { label: 'PROGRAM HEAD (IF APPLICABLE)', key: 'programHead' },
    { label: 'HM LAB (IF APPLICABLE)', key: 'hmLab' },
    { label: 'CRIM LAB (IF APPLICABLE)', key: 'crimLab' },
    { label: 'REGISTRAR', key: 'registrar' },
  ];

  const laboratoryFields = [
    { label: 'SCIENCE LAB (IF APPLICABLE)', key: 'scienceLab' },
    { label: 'COMPUTER SCIENCE LAB', key: 'computerLab' },
    { label: 'ELECTRONICS & CIRCUITS LAB (IF APPLICABLE)', key: 'electronicsLab' },
  ];

  const sigCanvasRefs = {
    guidanceInCharge: useRef(null),
    studentAffairs: useRef(null),
    dean: useRef(null),
    cashier: useRef(null),
    librarian: useRef(null),
    schoolNurse: useRef(null),
    programHead: useRef(null),
    hmLab: useRef(null),
    crimLab: useRef(null),
    registrar: useRef(null),
    scienceLab: useRef(null),
    computerLab: useRef(null),
    electronicsLab: useRef(null),
  };

  const saveSignature = (key, sigCanvas) => {
    if (sigCanvas) {
      // Draw watermark on the canvas
      const canvas = sigCanvas.getCanvas();
      const ctx = canvas.getContext('2d');
      ctx.font = '30px Arial';
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.textAlign = 'center';
      ctx.fillText('CONFIDENTIAL', canvas.width / 2, canvas.height / 2);

      const dataUrl = canvas.toDataURL('image/png');
      setSignatures((prevSignatures) => ({
        ...prevSignatures,
        [key]: dataUrl,
      }));
    }
  };

  const clearSignature = (sigCanvas) => {
    if (sigCanvas) {
      sigCanvas.clear();
    }
  };

  const saveNotes = (key, newNote) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [key]: newNote,
    }));
  };

  const getCanvasWidth = () => {
    return window.innerWidth > 768 ? 500 : 300;
  };

  const handleDone = () => {
    alert('Form submitted!');
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel?')) {
      alert('Form canceled!');
    }
  };

  const disableRightClick = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <Helmet>
        <title>Office In-Charge Form</title>
      </Helmet>

      <div className="min-h-screen bg-gray-100" onContextMenu={disableRightClick}>
        <div className="bg-green-800 py-4 px-6 flex justify-between items-center">
          <img src={Banner} alt="DTEC Logo" className="h-16" />
          <div className="flex items-center space-x-4">
            <FaBell className="text-white text-xl" />
            <FaUserCircle className="text-white text-2xl" />
          </div>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Clearance Approval</h1>
              <p className="text-sm">Office In-Charge</p>
            </div>
            <h2 className="text-3xl font-bold">E-Clearance</h2>
          </div>

          <div className="border-b border-gray-400 w-full my-4"></div>
        </div>

        <div className="p-8 max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
          <h2 className="text-center text-2xl font-bold mb-8">Certificate of Clearance</h2>

          <p className="text-center mb-6">
            This is to certify that <strong>TORRES, Christian James V.</strong>, a <strong>4th-year</strong> BSCS student,
            has complied with all the requirements and is cleared of all responsibilities under my charge
            this First Semester, A.Y. 2024 - 2025:
          </p>

          <div className="grid grid-cols-2 gap-x-16 gap-y-8 text-lg">
            {formFields.map(({ label, key }) => (
              <div key={key} className="flex flex-col">
                <div className="flex justify-between items-center">
                  <span className="font-bold">{label}:</span>
                  <span className={`ml-2 ${signatures[key] ? 'text-green-600' : 'text-red-600'}`}>
                    {signatures[key] ? 'Signed' : 'Pending'}
                  </span>
                </div>
                <div className={`mt-2 text-gray-500 border ${signatures[key] ? '' : 'border-gray-300'} p-2 rounded-md relative`}>
                  {signatures[key] ? (
                    <div className="relative">
                      <img
                        src={signatures[key]}
                        alt="Signature"
                        className="h-20 mx-auto"
                        onContextMenu={disableRightClick}
                      />
                      {/* Watermark overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-50 text-red-500 text-xl font-bold">
                        CONFIDENTIAL
                      </div>
                    </div>
                  ) : (
                    'No signature yet (Pending)'
                  )}
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-bold mb-2">Signature ({label}):</label>
                  <SignatureCanvas
                    ref={sigCanvasRefs[key]}
                    penColor="black"
                    canvasProps={{
                      width: getCanvasWidth(),
                      height: 200,
                      className: 'border w-full p-2 rounded',
                    }}
                  />
                  <div className="mt-2 mb-2 flex space-x-4">
                    <button
                      type="button"
                      onClick={() => clearSignature(sigCanvasRefs[key].current)}
                      className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => saveSignature(key, sigCanvasRefs[key].current)}
                      className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
                    >
                      Save Signature
                    </button>
                  </div>
                  <div className="border border-gray-300 p-2 rounded-md mt-2">
                    <label className="font-bold">Notes:</label>
                    <textarea
                      value={notes[key]}
                      onChange={(e) => saveNotes(key, e.target.value)}
                      className="w-full mt-1 p-2 border rounded-md"
                      rows="3"
                    />
                    <button
                      type="button"
                      onClick={() => saveNotes(key, notes[key])}
                      className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="col-span-2">
              <div className="border border-gray-400 p-4 rounded-lg">
                <h3 className="font-bold mb-4">LABORATORY IN-CHARGE</h3>

                <div className="grid grid-cols-2 gap-x-8 gap-y-6">

            {laboratoryFields.map(({ label, key }) => (
              <div key={key} className="flex flex-col">
                <div className="flex justify-between items-center">
                  <span className="font-bold">{label}:</span>
                  <span className={`ml-2 ${signatures[key] ? 'text-green-600' : 'text-red-600'}`}>
                    {signatures[key] ? 'Signed' : 'Pending'}
                  </span>
                </div>
                <div className={`mt-2 text-gray-500 border ${signatures[key] ? '' : 'border-gray-300'} p-2 rounded-md relative`}>
                  {signatures[key] ? (
                    <div className="relative">
                      <img
                        src={signatures[key]}
                        alt="Signature"
                        className="h-20 mx-auto"
                        onContextMenu={disableRightClick}
                      />
                      {/* Watermark overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-50 text-red-500 text-xl font-bold">
                        CONFIDENTIAL
                      </div>
                    </div>
                  ) : (
                    'No signature yet (Pending)'
                  )}
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-bold mb-2">Signature ({label}):</label>
                  <SignatureCanvas
                    ref={sigCanvasRefs[key]}
                    penColor="black"
                    canvasProps={{
                      width: getCanvasWidth(),
                      height: 200,
                      className: 'border w-full p-2 rounded',
                    }}
                  />
                  <div className="mt-2 mb-2 flex space-x-4">
                    <button
                      type="button"
                      onClick={() => clearSignature(sigCanvasRefs[key].current)}
                      className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => saveSignature(key, sigCanvasRefs[key].current)}
                      className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
                    >
                      Save Signature
                    </button>
                  </div>
                  <div className="border border-gray-300 p-2 rounded-md mt-2">
                    <label className="font-bold">Notes:</label>
                    <textarea
                      value={notes[key]}
                      onChange={(e) => saveNotes(key, e.target.value)}
                      className="w-full mt-1 p-2 border rounded-md"
                      rows="3"
                    />
                    <button
                      type="button"
                      onClick={() => saveNotes(key, notes[key])}
                      className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-red-500 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDone}
              className="bg-green-500 text-white font-bold py-2 px-4 rounded"
            >
              Done
            </button>
          
        </div>
      </div>
      </div>
        </div>
      </div>
    </>
  );
}

export default OfficeInChargeForm;
