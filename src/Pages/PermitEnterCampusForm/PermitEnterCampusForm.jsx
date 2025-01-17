import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { FaFingerprint } from "react-icons/fa";
import TorreseSig from "../../assets/images/torresesig.png";
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

function PermitEnterCampusForm() {
  const [signaturePreview, setSignaturePreview] = useState("");
  const [requisitioner, setRequisitioner] = useState("");
  const [club, setClub] = useState("");
  const [position, setPosition] = useState("");
  const [activityPurpose, setActivityPurpose] = useState("");
  const [date, setDate] = useState(null);
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [participants, setParticipants] = useState("");

  const navigate = useNavigate();
  const { user, status } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleDateChange = (selectedDate) => {
    const currentDate = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(currentDate.getDate() + 7);

    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate > sevenDaysFromNow) {
      setDate(selectedDate);
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

      const newLine = textBeforeCursor.endsWith("\n") || textBeforeCursor === ""
        ? "• "
        : "\n• ";

      setValue(textBeforeCursor + newLine + textAfterCursor);

      setTimeout(() => {
        e.target.selectionStart = cursorPosition + newLine.length;
        e.target.selectionEnd = cursorPosition + newLine.length;
      }, 0);
    }
  };

  const resetFields = () => {
    setRequisitioner("");
    setClub("");
    setPosition("");
    setActivityPurpose("");
    setDate(null);
    setTimeFrom("");
    setTimeTo("");
    setParticipants("");
    setSignaturePreview("");
  };

  const handleCancel = () => {
    navigate("/user/document-tracking");
  };

  const fetchSignature = async () => {
    try {
      const response = await axios.get("/users/get-sm-e-signature");
      setSignaturePreview(response.data?.data);
    } catch (error) {
      if (error.status === 404) {
        dispatch(showModal({ message: error?.response?.data?.message }))
      }
    }

  };

  const handleSubmit = async () => {
    if (!activityPurpose || !date || !timeFrom || !timeTo || !participants) {
      dispatch(showModal({ message: "Please fill in all required fields" }));
      return;
    }

    try {
      const formattedDate = date.toLocaleDateString('en-CA');
      const response = await axios.post("/permit-to-enters/request-permit-to-enter", {
        activity: activityPurpose,
        date: formattedDate,
        time_from: timeFrom,
        time_to: timeTo,
        participants,
        signature: signaturePreview
      });
      if (response.status === 201) {
        dispatch(showModal({ message: response.data?.message || "Permit request submitted successfully!" }));
        setTimeout(() => {
          navigate("/user/document-tracking");
          dispatch(hideModal());
          resetFields();
        }, 2000);
      }
    } catch (error) {
      if (error.status === 403) {
        dispatch(showModal({ message: error.response?.data?.message || "An error occurred while submitting the request" }));
      }
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
  //  console.log(user);

  return (
    <>
      {status === "Succeeded" && (
        <>
          <Helmet>
            <title>Permit to Enter Campus</title>
          </Helmet>

          <div className="min-h-screen bg-gray-100">
            <PrimaryNavBar />

            <div className="p-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold">New Transaction Request</h1>
                  <p className="text-sm">Create New Request</p>
                </div>
                <h2 className="text-3xl font-bold">Permit to Enter Campus</h2>
              </div>

              <div className="border-b border-gray-400 w-full my-4"></div>
            </div>

            <div className="p-8 max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
              <h2 className="text-center text-2xl font-bold mb-8">
                PERMIT TO ENTER THE CAMPUS OUTSIDE REGULAR SCHEDULES
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">Requisitioner:</label>
                  <input
                    type="text"
                    className="w-full border-gray-300 border-2 p-2 rounded-md"
                    disabled
                    defaultValue={user?.first_name + " " + user?.middle_name + " " + user?.lastname}
                    onChange={(e) => setRequisitioner(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">Club:</label>
                  <input
                    type="text"
                    className="w-full border-gray-300 border-2 p-2 rounded-md"
                    disabled
                    defaultValue={user?.officer_at}
                    onChange={(e) => setClub(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">Position/Role:</label>
                  <input
                    type="text"
                    className="w-full border-gray-300 border-2 p-2 rounded-md"
                    disabled
                    defaultValue={user?.role}
                    onChange={(e) => setPosition(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">Activity/Purpose:</label>
                  <textarea
                    rows="4"
                    className="w-full border-gray-300 border-2 p-2 rounded-md"
                    value={activityPurpose}
                    onChange={(e) => setActivityPurpose(e.target.value)}
                    onKeyDown={(e) => handleTextAreaKeyDown(e, setActivityPurpose, activityPurpose)}
                    placeholder="Enter activity/purpose... (Press Enter for bullet points)"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">Date:</label>
                  <DatePicker
                    selected={date}
                    onChange={handleDateChange}
                    dateFormat="MMMM d, yyyy"
                    className="w-full border-gray-300 border-2 p-2 rounded-md"
                    placeholderText="Select date"
                    minDate={new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)}
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block font-semibold mb-2">Time From:</label>
                    <input
                      type="time"
                      className="w-full border-gray-300 border-2 p-2 rounded-md"
                      value={timeFrom}
                      onChange={(e) => setTimeFrom(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block font-semibold mb-2">Time To:</label>
                    <input
                      type="time"
                      className="w-full border-gray-300 border-2 p-2 rounded-md"
                      value={timeTo}
                      onChange={(e) => setTimeTo(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-2">Participants:</label>
                  <textarea
                    rows="4"
                    className="w-full border-gray-300 border-2 p-2 rounded-md"
                    value={participants}
                    onChange={(e) => setParticipants(e.target.value)}
                    onKeyDown={(e) => handleTextAreaKeyDown(e, setParticipants, participants)}
                    placeholder="Enter participants... (Press Enter for bullet points)"
                  />
                </div>

                {/* Signature Section */}
                <div className="mt-6">
                  <div className="text-center">
                    <p className="font-semibold">Requested By:</p>
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
                      placeholder="Name of Requisitioner"
                      defaultValue={user?.first_name + " " + user?.middle_name + " " + user?.lastname}
                      disabled
                    />
                    <p className="text-sm mt-2">MAYOR, {user?.officer_at} , A.Y. 2024-2025</p>
                  </div>
                </div>

                {/* Noted By */}
                <div className="mt-6 text-center">
                  <p className="font-semibold">Noted by:</p>
                  <input
                    type="text"
                    className="w-full border-gray-300 border-2 p-2 rounded-md mt-2 text-center font-bold"
                    placeholder="Name of Moderator"
                    defaultValue={user?.moderator}
                    disabled
                  />
                  <p >MODERATOR, {user?.officer_at}, A.Y. 2024-2025</p>
                </div>

                {/* Approved By */}
                <div className="mt-6 text-center">
                  <p className="font-semibold">Approved by:</p>
                  <div className="mt-4">

                    <p className="font-bold mt-2 font-bold">{user?.office_head}</p>
                    <p>Office Head, CDSO</p>
                  </div>
                  <div className="mt-4">
                    <p className="font-bold">{user?.president}</p>
                    <p>President</p>
                  </div>
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

export default PermitEnterCampusForm;