import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import Banner from '../../Images/banner.svg';
import SignatureCanvas from 'react-signature-canvas';
import PrimaryNavBar from '../../Components/NavBar/PrimaryNavBar';
import axios from "../../api/AxiosConfig";
import { showModal } from '../../states/slices/ModalSlicer';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../Components/modal/Modal';
import { fetchUser } from '../../states/slices/UserSlicer';
import { useNavigate } from 'react-router-dom';
import PersonnelClearanceForm from "../../Pages/Personnel/PersonnelClearanceForm";

function ClearanceRequestForm() {
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
    guidanceInCharge: 'No notes available',
    studentAffairs: 'No notes available',
    scienceLab: 'No notes available',
    computerLab: 'No notes available',
    electronicsLab: 'No notes available',
    dean: 'No notes available',
    cashier: 'No notes available',
    librarian: 'No notes available',
    schoolNurse: 'No notes available',
    programHead: 'No notes available',
    hmLab: 'No notes available',
    crimLab: 'No notes available',
    registrar: 'No notes available',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [signature, setSignature] = useState(null);
  const [sigCanvas, setSigCanvas] = useState(null);
  const [clearance, setClearance] = useState(null);
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const formFields = [
    { label: 'GUIDANCE IN-CHARGE', key: 'GUIDANCE' },
    { label: 'DIRECTOR OF STUDENT AFFAIRS', key: 'DSA' },
    { label: 'DEAN', key: 'DEAN' },
    { label: 'CASHIER', key: 'CASHIER' },
    { label: 'LIBRARIAN', key: 'LIBRARIAN' },
    { label: 'SCHOOL NURSE', key: 'SCHOOL_NURSE' },
    { label: 'PROGRAM HEAD (IF APPLICABLE)', key: 'PROGRAM_HEAD' },
    { label: 'HM LAB (IF APPLICABLE)', key: 'hmLab' },
    { label: 'CRIM LAB (IF APPLICABLE)', key: 'CRIM_LAB' },
    { label: 'REGISTRAR', key: 'REGISTRAR' },
  ];

  const laboratoryFields = [
    { label: 'SCIENCE LAB (IF APPLICABLE)', key: 'NURSING_LAB' },
    { label: 'COMPUTER SCIENCE LAB', key: 'COMPUTER_SCIENCE_LAB' },
    { label: 'ELECTRONICS & CIRCUITS LAB (IF APPLICABLE)', key: 'ELECTRONICS_LAB' },
  ];

  const openSignatureModal = () => {
    setIsSignatureModalOpen(true);
  };

  const closeSignatureModal = () => {
    setIsSignatureModalOpen(false);
  };

  const handleCancel = () => {
    navigate("/user/e-clearance");
  }

  const handlePrint = () => {
    alert("Print here")
  }

  const saveSignature = async () => {
    if (sigCanvas) {
      const signatureData = sigCanvas.toDataURL('image/png');
      setSignature(signatureData);
      try {
        const response = await axios.post(`/clearances/students/sign-clearance/${clearance?.id}`, {
          "signature": signatureData
        });

        if (response.status === 200 || response.status === 201) {
          dispatch(showModal({ message: response.data?.data }));
          setTimeout(() => {
            navigate("/user/e-clearance");
          }, 2000);
        }
      } catch (error) {
      } finally {
        closeSignatureModal();
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/clearances/new-clearance");
        setClearance(response.data?.data);
      } catch (error) {
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (clearance && clearance?.student_signature && clearance?.status === "PENDING") {
      dispatch(showModal({ message: "Your Clearance is In-Progress" }));
      setTimeout(() => {
        navigate("/user/e-clearance");
      }, 2000);
    }
  }, [clearance]);

  const closeModal = () => {
    setIsModalOpen(false);
    saveSignature();
  };

  const openModal = () => {
    setIsModalOpen(true);
  }

  return (
    <>
      <Helmet>
        <title>Clearance Request Form</title>
      </Helmet>

      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <PrimaryNavBar />

        {/* Form Title */}
        {user && user?.role === "STUDENT" || user?.role === "STUDENT_OFFICER" ? <>
          <div className="p-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">New Clearance Request</h1>
                <p className="text-sm">Create New Request</p>
              </div>
              <h2 className="text-3xl font-bold">E-Clearance</h2>
            </div>

            <div className="border-b border-gray-400 w-full my-4"></div>
          </div>

          {/* Form Section */}
          <div className="p-8 max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
            <h2 className="text-center text-2xl font-bold mb-8">Certificate of Clearance</h2>

            <p className="text-center mb-6">
              This is to certify that <strong>{user?.first_name} {user?.lastname}</strong>, a <strong>4th-year</strong> BSCS student,
              has complied with all the requirements and is cleared of all responsibilities under my charge
              this First Semester, A.Y. 2024 - 2025:
            </p>

            <div className="grid grid-cols-2 gap-x-16 gap-y-8 text-lg">
              {formFields.map(({ label, key }) => (
                <div key={key} className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{label}:</span>
                    <span className={`ml-2 ${clearance?.clearance_signoffs?.filter((cs) => cs.role === key)[0]?.status === "COMPLETED" ? `text-green-600` : `text-red-600`}`}>
                      {clearance?.clearance_signoffs?.filter((cs) => cs.role === key)[0]?.status}
                    </span>
                  </div>
                  <div className="mt-2">
                    {/* Signature Preview */}
                    {clearance?.clearance_signoffs?.filter((cs) => cs.role === key)[0]?.status === "COMPLETED" ? (
                      <div className="border border-gray-400 p-2 rounded-md text-center">
                        <img src={clearance?.clearance_signoffs?.filter((cs) => cs.role === key)[0]?.signature} alt="Signature" className="h-10 mx-auto" />
                      </div>
                    ) : (
                      <div className="border border-gray-400 p-2 rounded-md text-center text-gray-500">
                        No signature yet ({clearance?.clearance_signoffs?.filter((cs) => cs.role === key)[0]?.status === "COMPLETED" ? "COMPLETED" : "PENDING"})
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    {/* Notes */}
                    <div className="border border-gray-300 p-2 rounded-md">
                      <span className="font-bold">Notes:</span>
                      <div className="text-gray-500">{notes[key]}</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Laboratory In-Charge Section */}
              <div className="col-span-2">
                <div className="border border-gray-400 p-4 rounded-lg">
                  <h3 className="font-bold mb-4">LABORATORY IN-CHARGE</h3>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                    {laboratoryFields.map(({ label, key }) => (
                      <div key={key} className="flex flex-col">
                        <div className="flex justify-between items-center">
                          <span className="font-bold">{label}:</span>
                          <span className={`ml-2 ${clearance?.clearance_signoffs?.filter((cs) => cs.role === key)[0]?.status === "COMPLETED" ? `text-green-600` : `text-red-600`}`}>
                            {clearance?.clearance_signoffs?.filter((cs) => cs.role === key)[0]?.status}
                          </span>
                        </div>
                        <div className="mt-2">
                          {/* Signature Preview */}
                          {clearance?.clearance_signoffs?.filter((cs) => cs.role === key)[0]?.status === "COMPLETED" ? (
                            <div className="border border-gray-400 p-2 rounded-md text-center">
                              <img src={clearance?.clearance_signoffs?.filter((cs) => cs.role === key)[0]?.signature} alt="Signature" className="h-10 mx-auto" />
                            </div>
                          ) : (
                            <div className="border border-gray-400 p-2 rounded-md text-center text-gray-500">
                              No signature yet ({clearance?.clearance_signoffs?.filter((cs) => cs.role === key)[0]?.status === "COMPLETED" ? "COMPLETED" : "PENDING"})
                            </div>
                          )}
                        </div>
                        <div className="mt-2">
                          {/* Notes */}
                          <div className="border border-gray-300 p-2 rounded-md">
                            <span className="font-bold">Notes:</span>
                            <div className="text-gray-500">{notes[key]}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Process Clearance and Cancel Buttons */}
            <div className="flex justify-end mt-8 space-x-4">
              <button
                className="bg-yellow-600 text-white py-2 px-4 rounded"
                onClick={handlePrint}
              >
                Print
              </button>
              <button
                className="bg-red-600 text-white py-2 px-4 rounded"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="bg-green-800 text-white py-2 px-4 rounded"
                onClick={openSignatureModal}
              >
                Process Clearance
              </button>
            </div>
          </div>

          {/* Signature Modal */}
          {isSignatureModalOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
              <div className="bg-white p-8 rounded-lg max-w-md mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">Sign Below</h2>
                <SignatureCanvas
                  penColor="black"
                  canvasProps={{ width: 500, height: 200, className: ' sigCanvas' }}
                  ref={(ref) => setSigCanvas(ref)}
                />
                <div className="flex justify-between mt-6">
                  <button
                    className="bg-red-600 text-white py-2 px-4 rounded"
                    onClick={closeSignatureModal}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={openModal}
                    className="bg-green-800 text-white py-2 px-4 rounded"
                  >
                    Save Signature
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal for Terms of Use and Legal Warning */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
              <div className="bg-white p-8 rounded-lg max-w-md mx-auto text-center">
                <h2 className="text-4xl font-bold mb-8">Terms of Use and Legal Warning</h2>
                <p className="mb-4">
                  By accessing this document, you acknowledge and agree that any attempt to <strong>COPY, TAKE SCREENSHOTS,
                    or OTHERWISE REPRODUCE SIGNATURES</strong> in this form is strictly prohibited and illegal.
                  Unauthorized reproduction or use of these signatures will result in severe disciplinary action,
                  including but not limited to <strong>EXPULSION</strong>  from the institution.
                </p>
                <p className="mb-6">
                  The institution reserves the right to pursue legal action against individuals found violating these terms.
                  Please proceed with caution and respect the integrity of this process.
                </p>
                <button
                  className="bg-green-800 text-white py-2 px-4 rounded"
                  onClick={closeModal}
                >
                  I Agree
                </button>
              </div>
            </div>

          )}
        </> : <>
          <PersonnelClearanceForm
            setSigCanvas={setSigCanvas}
            saveSignature={closeModal}
            clearance={clearance}
            handlePrint={handlePrint}
            handleCancel={handleCancel}
            handleOpenTermsAndCondition={openModal}
          />
        </>}
      </div>
      <Modal />
    </>
  );
}

export default ClearanceRequestForm;