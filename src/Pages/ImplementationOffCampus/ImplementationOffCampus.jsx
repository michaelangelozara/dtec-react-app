import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaTrash, FaFingerprint } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../../states/slices/UserSlicer';
import { navigateRouteByRole } from '../../services/RouteUtil';
import { studentOfficerRole } from '../../services/UserUtil';
import axios from "../../api/AxiosConfig";
import Modal from '../../Components/modal/Modal';
import PrimaryNavBar from '../../Components/NavBar/PrimaryNavBar';
import { hideModal, showModal } from '../../states/slices/ModalSlicer';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';


function ImplementationLetterOffCampus() {
  const [rows, setRows] = useState([{ activity: '', objective: '', expected_output: '', committee: '' }]);
  const [signature, setSignature] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reason, setReason] = useState("");
  const [dateTimes, setDateTimes] = useState([null]);
  const [programOfFlowOfActivities, setProgramOfFlowOfActivities] = useState("");

  const navigate = useNavigate();

  const { user, status } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const addRow = () => {
    setRows([...rows, { activity: '', objective: '', expected_output: '', committee: '' }]);
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
      alert('Please select a date at least 7 days from today');
    }
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
        setSignature(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSignature(null);
    }
  };

  const handleCancel = () => {
    navigate("/user/document-tracking");
  }

  const resetFields = () => {
    setRows([{ activity: '', objective: '', expected_output: '', committee: '' }]);
    setSignature(null);
    setTitle("");
    setDescription("");
    setReason("");
    setDateAndPlace("");
    setProgramOfFlowOfActivities("");
  }
  const fetchSignature = async() => {
    try {
      const response = await axios.get("/users/get-sm-e-signature");
      setSignature(response.data?.data);
    } catch (error) {
      
    }

  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/implementation-letter-off-campuses/request-letter",
        {
          title,
          description,
          reason,
          "date_and_time": dateTimes[0].toISOString(),
          "caoos": rows,
          "program_of_flow_of_activity": programOfFlowOfActivities,
          signature
        });
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
            <title>Implementation Letter (Off Campus)</title>
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Rationale */}
              <div className="mt-4">
                <label className="block font-semibold mb-2">II. BRIEF DESCRIPTION AND / OR RATIONALE OF THE OUTREACH ACTIVITY / SERVICE</label>
                <textarea
                  rows="4"
                  className="w-full border-gray-300 border-2 p-2 rounded-md"
                  placeholder="Enter Description/Rationale"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              {/* Target Group */}
              <div className="mt-4">
                <label className="block font-semibold mb-2">III. TARGET GROUP AND REASONS FOR CHOOSING IT</label>
                <textarea
                  rows="4"
                  className="w-full border-gray-300 border-2 p-2 rounded-md"
                  placeholder="Enter Target Group and Reasons"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                ></textarea>
              </div>

              {/* Date and Place of Implementation */}
              <div>
                <label className="block font-semibold mb-2">DATE AND TIME OF IMPLEMENTATION:</label>
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
                        minDate={new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)}
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
                            value={row.expected_output}
                            onChange={(e) => handleInputChange(index, 'expected_output', e.target.value)}
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
                  value={programOfFlowOfActivities}
                  onChange={(e) => setProgramOfFlowOfActivities(e.target.value)}
                ></textarea>
              </div>

              {/* Prepared By with Signature Preview */}
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
                  {signature && (
                    <div className="mt-4">
                      <p className="font-semibold">Signature Preview:</p>
                      <img
                        src={signature}
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
                    defaultValue={user.role === "STUDENT_OFFICER" ? user.first_name + " " + user.middle_name + " " + user.lastname : ""}
                    disabled
                  />
                  <p className="text-sm mt-2">POSITION, {user?.officer_at}, A.Y. 2024-2025</p>
                </div>
              </div>

              {/* Noted By */}
              <div className="mt-6 text-center">
                <p className="font-semibold">Noted by:</p>
                <p className="mt-2 font-bold">{user?.office_head}</p>
                <p>Community Development and Services Officer</p>
              </div>

              {/* Approved By */}
              <div className="mt-6 text-center">
                <p className="font-semibold">Approved by:</p>
                <p className="mt-2 font-bold">{user?.president}</p>
                <p>NDTC President</p>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex justify-end mt-6 space-x-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  onClick={handleCancel}
                >Cancel</button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  onClick={handleSubmit}
                >Submit</button> </div>
            </div>
          </div>
          <Modal />
        </>
      )}
    </>
  );
}

export default ImplementationLetterOffCampus;
