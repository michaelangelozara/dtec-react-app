import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaFingerprint } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../../states/slices/UserSlicer';
import { hideModal, showModal } from '../../states/slices/ModalSlicer';
import Modal from '../../Components/modal/Modal';
import { useNavigate } from 'react-router-dom';
import { studentOfficerRole } from '../../services/UserUtil';
import axios from "../../api/AxiosConfig";
import PrimaryNavBar from '../../Components/NavBar/PrimaryNavBar';

function CommunicationLetter() {
  const [signaturePreview, setSignaturePreview] = useState("");
  const [letterContent, setLetterContent] = useState('');
  const [selectedDate, setSelectedDate] = useState("");
  const { user, status } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handler for date change
  const handleDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    const currentDate = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(currentDate.getDate() + 7);
  
    if (selectedDate >= sevenDaysFromNow) {
      setSelectedDate(event.target.value);
    } else {
      dispatch(showModal({ message: 'Please select a date at least 7 days from today' }));
    }
  };


  const fetchSignature = async() => {
    try {
      const response = await axios.get("/users/get-sm-e-signature");
      setSignaturePreview(response.data?.data);
    } catch (error) {
      
    }

  };


  const handleContentChange = (e) => {
    setLetterContent(e.target.value);
  };

  const handleCancel = () => {
    navigate("/user/document-tracking");
  }

  const resetFields = () => {
    setLetterContent("");
    setSignaturePreview(null);
  }

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/communication-letters/request-letter?type=IN_CAMPUS",
        {
          "date": selectedDate,
          "letter_of_content": letterContent,
          "signature": signaturePreview
        }
      );

      if (response.status === 201) {
        dispatch(showModal({ message: response.data?.message }))
        setTimeout(() => {
          navigate("/user/document-tracking");
          dispatch(hideModal());
          resetFields();
        }, 2000);
      }
    } catch (error) {
      if (error.status === 400 || error.status === 403) {
        dispatch(showModal({ message: error.response?.data?.message }));
      }
    }
  }

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }

    if (user && !studentOfficerRole.includes(user.role)) {
      navigate(navigateRouteByRole(user));
    }
  }, [dispatch, user, status]);

  return (
    <>
      {status === "Succeeded" && (
        <>
          <Helmet>
            <title>Communication Letter</title>
          </Helmet>

          <div className="min-h-screen bg-gray-100">
            <PrimaryNavBar />

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
                      onChange={handleDateChange}
                      value={selectedDate}
                      min={new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]}
                    />
              </div>

              {/* Receiver Information */}
              <div className="mb-4">
                <p className="font-bold">{user?.president}</p>
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
                          <button
                            onClick={() => fetchSignature()}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 mx-auto"
                          >
                            <FaFingerprint /> Attach Signature
                          </button>
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
                          className="w-full border-gray-300 border-2 p-2 rounded-md mt-2 font-bold"
                          placeholder="Name of Club Mayor"
                          disabled
                          defaultValue={user?.first_name + " " + user?.middle_name + " " + user?.lastname}
                        />
                        <p>MAYOR, {user?.officer_at}, A.Y. 2024-2025</p>
                      </div>
                    </div>


                  <div>
                    <p className="font-semibold">Noted by:</p>
                    <div className=" mt-2">
                      <p className="font-bold mt-2 font-bold" >{user?.moderator}</p>
                    </div>
                    <p >MODERATOR, {user?.officer_at}, A.Y. 2024-2025</p>
                  </div>

                  <div>
                    <p className="font-semibold">Noted by:</p>
                    <p className="font-bold mt-2 font-bold">{user?.dsa}</p>
                    <p>DIRECTOR OF STUDENT AFFAIRS</p>
                  </div>

                  <div>
                    <p className="font-semibold">Approved by:</p>
                    <p className="font-bold mt-2 font-bold">{user?.president}</p>
                    <p>PRESIDENT, NDTC</p>
                  </div>
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  onClick={handleCancel}
                >Cancel</button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  onClick={handleSubmit}
                >Submit</button>
              </div>
            </div>
          </div>
          <Modal />
        </>
      )}
    </>
  );
}

export default CommunicationLetter;
