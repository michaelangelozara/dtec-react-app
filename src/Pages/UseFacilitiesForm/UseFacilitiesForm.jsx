import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { FaFingerprint, FaPlus, FaTrash } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../../api/AxiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PrimaryNavBar from "../../Components/NavBar/PrimaryNavBar";
import Modal from "../../Components/modal/Modal";
import { hideModal, showModal } from "../../states/slices/ModalSlicer";


function UseFacilitiesForm() {
  const [signaturePreview, setSignaturePreview] = useState("");
  const [requisitioner, setRequisitioner] = useState("");
  const [club, setClub] = useState("");
  const [position, setPosition] = useState("");
  const [venues, setVenues] = useState("");
  const [activityPurpose, setActivityPurpose] = useState("");
  const [date, setDate] = useState(null);
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [facilities, setFacilities] = useState([
    { name: "", quantity: "" }
  ]);

  const resetFields = () => {
    setRequisitioner("");
    setClub("");
    setPosition("");
    setActivityPurpose("");
    setDate(null);
    setTimeFrom("");
    setTimeTo("");
    setSignaturePreview("");
  };

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleDateChange = (selectedDate) => {
    const currentDate = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(currentDate.getDate() + 7);

    if (selectedDate > sevenDaysFromNow) {
      setDate(selectedDate);
    } else {
      alert("Please select a date at least 7 days from today");
    }
  };

  const fetchSignature = async() => {
    try {
      const response = await axios.get("/users/get-sm-e-signature");
      setSignaturePreview(response.data?.data);
    } catch (error) {
      
    }

  };

  const handleSubmit = async () => {
    try {
      const formattedDate = date.toLocaleDateString('en-CA'); 
      const response = await axios.post("/sfefs/add", {
        venue: venues,
        activity: activityPurpose,
        date: formattedDate,
        time_from: timeFrom,
        time_to: timeTo,
        facilityOrEquipments: facilities,
        signature : signaturePreview
      });
      if (response.status === 201) {
              dispatch(showModal({ message: response.data?.message || "Permit request submitted successfully!" }));
              setTimeout(() => {
                navigate("/user/document-tracking");
                dispatch(hideModal());
                resetFields();
              }, 2000);
    }    } catch (error) {
          dispatch(showModal({ message: error.response?.data?.message || "An error occurred while submitting the request" }));
        }
  }

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

  const handleFacilityChange = (index, field, value) => {
    const newFacilities = [...facilities];
    newFacilities[index][field] = value;
    setFacilities(newFacilities);
  };

  const addFacility = () => {
    setFacilities([...facilities, { name: "", quantity: "" }]);
  };

  const removeFacility = (index) => {
    if (facilities.length > 1) {
      const newFacilities = facilities.filter((_, i) => i !== index);
      setFacilities(newFacilities);
    }
  };

  const handleCancel = () => {
    navigate("/user/document-tracking");
  };

  return (
    <>
      <Helmet>
        <title>Use of School Facilities & Equipment</title>
      </Helmet>

      <div className="min-h-screen bg-gray-100">
        <PrimaryNavBar />

        <div className="p-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">New Transaction Request</h1>
              <p className="text-sm">Create New Request</p>
            </div>
            <h2 className="text-3xl font-bold">Use of School Facilities & Equipment</h2>
          </div>

          <div className="border-b border-gray-400 w-full my-4"></div>
        </div>

        <div className="p-8 max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
          <h2 className="text-center text-2xl font-bold mb-8">
            USE OF SCHOOL FACILITIES & EQUIPMENT FORM
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">Requisitioner:</label>
              <input
                type="text"
                className="w-full border-gray-300 border-2 p-2 rounded-md"
                disabled
                defaultValue= {user?.first_name + " " + user?.middle_name + " " + user?.lastname}
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
              <label className="block font-semibold mb-2">Position:</label>
              <input
                type="text"
                className="w-full border-gray-300 border-2 p-2 rounded-md"
                disabled
                defaultValue={user?.role}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Name of Venue/s:</label>
              <textarea
                rows="4"
                className="w-full border-gray-300 border-2 p-2 rounded-md"
                value={venues}
                onChange={(e) => setVenues(e.target.value)}
                onKeyDown={(e) => handleTextAreaKeyDown(e, setVenues, venues)}
                placeholder="Enter venues... (Press Enter for bullet points)"
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
              <label className="block font-semibold mb-2">Date of Activity:</label>
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
              <div className="flex justify-between items-center mb-2">
                <label className="font-semibold">Facilities/Equipment Needed:</label>
                <button
                  onClick={addFacility}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 flex items-center gap-2"
                >
                  <FaPlus size={12} /> Add Item
                </button>
              </div>
              <div className="border-2 border-gray-300 rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Name of Facilities/Equipment</th>
                      <th className="px-4 py-2 text-left">Quantity</th>
                      <th className="px-4 py-2 text-center w-16">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facilities.map((facility, index) => (
                      <tr key={index} className="border-t border-gray-300">
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            className="w-full border-gray-300 border rounded-md p-1"
                            value={facility.name}
                            onChange={(e) => handleFacilityChange(index, 'name', e.target.value)}
                            placeholder="Enter facility/equipment name"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            className="w-full border-gray-300 border rounded-md p-1"
                            value={facility.quantity}
                            onChange={(e) => handleFacilityChange(index, 'quantity', e.target.value)}
                            placeholder="Enter quantity"
                          />
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => removeFacility(index)}
                            className="text-red-500 hover:text-red-700"
                            disabled={facilities.length === 1}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Signatures Section */}
            <div className="mt-6">
              {/* Requested By */}
              <div className="text-center mb-6">
                <p className="font-semibold">Requested By:</p>
                    <div className="mt-2">
                      <button
                        onClick={fetchSignature}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 mx-auto"
                      >
                        <FaFingerprint /> Attach Signature
                      </button>
                    </div>
                {signaturePreview && (
                  <div className="mt-4">
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
                  defaultValue={user?.first_name + " " + user?.middle_name + " " + user?.lastname}
                  disabled
                />
                <p className="text-sm mt-2">MAYOR, {user?.officer_at}, A.Y. 2024-2025</p>
              </div>

              {/* Noted By */}
              <div className="text-center mb-6">
                <p className="font-semibold">Noted By:</p>
                <input
                  type="text"
                  className="w-full border-gray-300 border-2 p-2 rounded-md mt-2 text-center font-bold"
                  defaultValue={user?.moderator}
                  disabled
                />
                <p className="text-sm">MODERATOR, {user?.officer_at}, A.Y. 2024-2025</p>
              </div>

              {/* Booked By */}
              <div className="text-center mb-6">
                <p className="font-semibold">Booked By:</p>
                <input
                  type="text"
                  className="w-full border-gray-300 border-2 p-2 rounded-md mt-2 text-center font-bold"
                  value="Auxiliary Service Head"
                  disabled
                />
                <p className="text-sm">Office Head</p>
              </div>

              {/* Acknowledged By */}
              <div className="text-center mb-6">
                <p className="font-semibold">Acknowledged By:</p>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <input
                      type="text"
                      className="w-full border-gray-300 border-2 p-2 rounded-md mt-2 text-center font-bold"
                      placeholder="Chapel In-charge"
                      disabled
                    />
                    <p className="text-sm">Chapel In-charge</p>
                  </div>
                  <div>
                    <input
                      type="text"
                      className="w-full border-gray-300 border-2 p-2 rounded-md mt-2 text-center font-bold"
                      placeholder="Physical Plant In-Charge"
                      disabled
                    />
                    <p className="text-sm">Physical Plant In-Charge</p>
                  </div>
                  <div>
                    <input
                      type="text"
                      className="w-full border-gray-300 border-2 p-2 rounded-md mt-2 text-center font-bold"
                      placeholder="Multimedia In-Charge"
                      disabled
                    />
                    <p className="text-sm">Multimedia In-Charge</p>
                  </div>
                </div>
              </div>

              {/* Approved By */}
              <div className="text-center">
                <p className="font-semibold">Approved By:</p>
                <input
                  type="text"
                  className="w-full border-gray-300 border-2 p-2 rounded-md mt-2 text-center font-bold"
                  defaultValue={user?.president}
                  disabled
                />
                <p className="text-sm">PRESIDENT</p>
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
  );
}

export default UseFacilitiesForm;