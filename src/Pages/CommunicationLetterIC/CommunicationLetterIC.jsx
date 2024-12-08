import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaUserCircle, FaBell, FaPen } from 'react-icons/fa';
import Banner from '../../Images/banner.svg';

function CommunicationLetter() {
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [letterContent, setLetterContent] = useState('');

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

  const handleContentChange = (e) => {
    setLetterContent(e.target.value);
  };

  return (
    <>
      <Helmet>
        <title>Communication Letter</title>
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
            <h2 className="text-3xl font-bold">Communication Letter</h2>
          </div>

          <div className="border-b border-gray-400 w-full my-4"></div>
        </div>

        {/* Form Section */}
        <div className="p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
          <h2 className="text-center text-xl font-bold mb-8">COMMUNICATION LETTER (IN-CAMPUS)</h2>

          {/* Date */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">DATE:</label>
            <input
              type="date"
              className="w-full border-gray-300 border-2 p-2 rounded-md"
            />
          </div>

          {/* Receiver Information */}
          <div className="mb-4">
            <p className="font-bold">REV. FR. JESSIE P. PASQUIN, DCC</p>
            <p>President</p>
            <p>Notre Dame of Tacurong College</p>
            <p>City of Tacurong</p>
          </div>

          {/* Letter Content */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">LETTER CONTENT:</label>
            <textarea
              rows="10"
              className="w-full border-gray-300 border-2 p-2 rounded-md"
              placeholder="Enter the content of the letter"
              value={letterContent}
              onChange={handleContentChange}
            />
          </div>

          {/* Approval Section */}
          <div className="mb-6">
            <div className="grid grid-cols-1 gap-6">
              
          {/* Prepared By Section */}
            <div className="mt-6">
              <div>
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
                      className="border border-gray-300 p-2 rounded-md"
                      style={{ maxHeight: '150px', maxWidth: '300px' }}
                    />
                  </div>
                )}
                <input 
                  type="text" 
                  className="w-full border-gray-300 border-2 p-2 rounded-md mt-2"
                  placeholder="Name of Club Mayor"
                />
                <p >MAYOR, CLUB, A.Y. 2024-2025</p>
              </div>
            </div>


              <div>
                <p className="font-semibold">Noted by:</p>
                <div className=" mt-2">
                <p className="font-bold mt-2" >NAME OF CLUB MODERATOR</p>
                </div>
                <p >MODERATOR, CLUB, A.Y. 2024-2025</p>
              </div>

              <div>
                <p className="font-semibold">Noted by:</p>
                <p className="font-bold mt-2">ENGR. LOUIE ANGELO G. VILLEGAS, PCPE, MOE-CPE</p>
                <p>DIRECTOR OF STUDENT AFFAIRS</p>
              </div>

              <div>
                <p className="font-semibold">Approved by:</p>
                <p className="font-bold mt-2">REV. FR. JESSIE P. PASQUIN, DCC</p>
                <p>PRESIDENT, NDTC</p>
              </div>
            </div>
          </div>

          {/* Submit / Cancel Buttons */}
          <div className="flex justify-end space-x-4">
            <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Cancel</button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Submit</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CommunicationLetter;
