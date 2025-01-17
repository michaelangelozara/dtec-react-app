import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {FaTrash, FaFingerprint } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchUser } from "../../states/slices/UserSlicer";
import { hideModal, showModal } from "../../states/slices/ModalSlicer";
import axios from "../../api/AxiosConfig";
import { studentOfficerRole } from "../../services/UserUtil";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../Components/modal/Modal";
import PrimaryNavBar from "../../Components/NavBar/PrimaryNavBar";
import { useNavigate } from "react-router-dom";

function ImplementationProgramForm() {
  const [signaturePreview, setSignaturePreview] = useState("");
  const [rationale, setRationale] = useState("");
  const [objectives, setObjectives] = useState("");
  const [dateTimes, setDateTimes] = useState([null]);
  const [sourcesOfFund, setSourcesOfFund] = useState("");
  const [projectedExpenses, setProjectedExpenses] = useState("");
  const [expectedOutputs, setExpectedOutputs] = useState("");
  const [nameOfActivity, setNameOfActivity] = useState("");
  const [venue, setVenue] = useState("");
  const [participants, setParticipants] = useState("");

  const navigate = useNavigate();
  const { user, status } = useSelector((state) => state.user);
  const dispatch = useDispatch();

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

  const handleDateChange = (date, index) => {
    const currentDate = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(currentDate.getDate() + 7);

    if (date > sevenDaysFromNow) {
      const newDates = [...dateTimes];
      newDates[index] = date;
      setDateTimes(newDates);
    } else {
      alert("Please select a date at least 7 days from today");
    }
  };

  const handleTextAreaKeyDown = (e, setValue, currentValue) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const cursorPosition = e.target.selectionStart;
      const textBeforeCursor = currentValue.substring(0, cursorPosition);
      const textAfterCursor = currentValue.substring(cursorPosition);

      // Add bullet point if at start of line or after another bullet point
      const newLine =
        textBeforeCursor.endsWith("\n") || textBeforeCursor === ""
          ? "• "
          : "\n• ";

      setValue(textBeforeCursor + newLine + textAfterCursor);

      // Set cursor position after the bullet point
      setTimeout(() => {
        e.target.selectionStart = cursorPosition + newLine.length;
        e.target.selectionEnd = cursorPosition + newLine.length;
      }, 0);
    }
  };

  const addDateTime = () => {
    setDateTimes((prev) => [...prev, null]);
  };

  const resetFields = () => {
    setNameOfActivity("");
    setDateTimes([null]);
    setVenue("");
    setParticipants("");
    setSourcesOfFund("");
    setProjectedExpenses("");
    setExpectedOutputs("");
    setSignaturePreview("");
  };

  
  const removeDateTime = (index) => {
    setDateTimes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    navigate("/user/document-tracking");
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "/implementation-letter-in-campuses/request-letter",
        {
          name_of_activity: nameOfActivity,
          date_and_times: dateTimes[0].toISOString(),
          venue,
          participants,
          rationale,
          objectives,
          source_of_funds: sourcesOfFund,
          projected_expenses: projectedExpenses,
          expected_outputs: expectedOutputs,
          signature: signaturePreview,
        }
      );
      if (response.status === 201) {
        dispatch(showModal({ message: response.data?.message }));
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
  };
  const fetchSignature = async() => {
    try {
      const response = await axios.get("/users/get-sm-e-signature");
      setSignaturePreview(response.data?.data);
    } catch (error) {
      
    }

  };

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
            <title>Implementation Program</title>
          </Helmet>

          <div className="min-h-screen bg-gray-100">
            <PrimaryNavBar />

            {/* Form Title */}
            <div className="p-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold">
                    New Transaction Request
                  </h1>
                  <p className="text-sm">Create New Request</p>
                </div>
                <h2 className="text-3xl font-bold">
                  Implementation Letter (In Campus)
                </h2>
              </div>

              <div className="border-b border-gray-400 w-full my-4"></div>
            </div>

            {/* Form Section */}
            <div className="p-8 max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
              <h2 className="text-center text-2xl font-bold mb-8">
                IMPLEMENTATION PROGRAM
              </h2>

              {/* Basic Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">
                    ORGANIZATION/CLUB NAME:
                  </label>
                  <input
                    type="text"
                    className="w-full border-gray-300 border-2 p-2 rounded-md"
                    defaultValue={user?.officer_at}
                    disabled
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    NAME OF ACTIVITY:
                  </label>
                  <input
                    type="text"
                    className="w-full border-gray-300 border-2 p-2 rounded-md"
                    value={nameOfActivity}
                    onChange={(e) => setNameOfActivity(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    SEMESTER & SCHOOL YEAR:
                  </label>
                  <input
                    type="text"
                    className="w-full border-gray-300 border-2 p-2 rounded-md"
                    value="2nd SEM, S.Y. 2024-2025"
                    disabled
                  />
                </div>

                {/* Date and Time Section */}
                <div>
                  <label className="block font-semibold mb-2">
                    DATE AND TIME OF IMPLEMENTATION:
                  </label>
                  <style>
                    {`
                  .react-datepicker-wrapper {
                    display: block !important;
                    width: 100% !important;
                  }
                  .react-datepicker__input-container {
                    display: block !important;
                    width: 100% !important;
                  }
                `}
                  </style>
                  {dateTimes.map((dateTime, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <div className="flex-1">
                        <DatePicker
                          selected={dateTime}
                          onChange={(date) => handleDateChange(date, index)}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="MMMM d, yyyy h:mm aa"
                          className="w-full border-gray-300 border-2 p-2 rounded-md"
                          placeholderText="Select date and time"
                          minDate={
                            new Date(
                              new Date().getTime() + 7 * 24 * 60 * 60 * 1000
                            )
                          }
                        />
                      </div>
                      {dateTimes.length > 1 && (
                        <button
                          type="button"
                          className="text-red-500"
                          onClick={() => removeDateTime(index)}
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block font-semibold mb-2">VENUE:</label>
                  <input
                    type="text"
                    className="w-full border-gray-300 border-2 p-2 rounded-md"
                    onChange={(e) => setVenue(e.target.value)}
                    value={venue}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    PARTICIPANTS:
                  </label>
                  <input
                    type="text"
                    className="w-full border-gray-300 border-2 p-2 rounded-md"
                    onChange={(e) => setParticipants(e.target.value)}
                    value={participants}
                  />
                </div>

                {/* Bullet Point Text Areas */}
                {[
                  {
                    label: "RATIONALE",
                    value: rationale,
                    setter: setRationale,
                  },
                  {
                    label: "OBJECTIVES",
                    value: objectives,
                    setter: setObjectives,
                  },
                  {
                    label: "SOURCES OF FUND",
                    value: sourcesOfFund,
                    setter: setSourcesOfFund,
                  },
                  {
                    label: "PROJECTED EXPENSES",
                    value: projectedExpenses,
                    setter: setProjectedExpenses,
                  },
                  {
                    label: "EXPECTED OUTPUT",
                    value: expectedOutputs,
                    setter: setExpectedOutputs,
                  },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block font-semibold mb-2">
                      {field.label}:
                    </label>
                    <textarea
                      rows="4"
                      className="w-full border-gray-300 border-2 p-2 rounded-md"
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      onKeyDown={(e) =>
                        handleTextAreaKeyDown(e, field.setter, field.value)
                      }
                      placeholder={`Enter ${field.label.toLowerCase()}... (Press Enter for bullet points)`}
                    />
                  </div>
                ))}

                {/* Signature Section */}
                <div className="mt-6">
                  <div className="text-center">
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
                          className="mx-auto border border-gray-300 p-2 rounded-md"
                          style={{ maxHeight: '150px', maxWidth: '300px' }}
                        />
                      </div>
                    )}
                    <input
                      type="text"
                      className="w-full border-gray-300 border-2 p-2 rounded-md mt-2 text-center font-bold"
                      placeholder="Name of Club Mayor"
                      defaultValue={user?.role === "STUDENT_OFFICER" ? user.first_name + " " + user.middle_name + " " + user.lastname : ""}
                      disabled
                    />
                    <p className="text-sm mt-2">MAYOR, {user?.officer_at}, A.Y. 2024-2025</p>
                  </div>
                </div>
                {/* Noted By */}
                <div className="mt-6 text-center">
                  <p className="font-semibold">Noted by:</p>
                  <input
                    type="text"
                    className="w-full border-gray-300 border-2 p-2 rounded-md mt-2 text-center font-bold"
                    placeholder="Name of Club Moderator"
                    defaultValue={user?.moderator}
                    disabled
                  />
                  <p className="text-sm mt-2">
                    MODERATOR, {user?.officer_at}, A.Y. 2024-2025
                  </p>
                </div>

                {/* Approved By */}
                <div className="mt-6 text-center">
                  <p className="font-semibold">Approved by:</p>
                  <p className="mt-2 font-bold font-bold">{user?.dsa}</p>
                  <p>Director of Student Affairs</p>
                </div>

                {/* Submit / Cancel Buttons */}
                <div className="flex justify-end mt-6 space-x-4">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Modal />
        </>
      )}
    </>
  );
}

export default ImplementationProgramForm;
