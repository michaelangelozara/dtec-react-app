import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import Banner from '../../Images/banner.svg';
import SignatureCanvas from 'react-signature-canvas';
import { fetchUser } from '../../states/slices/UserSlicer';
import { navigateRouteByRole } from '../../services/RouteUtil';
import { studentAndPersonnelRole } from '../../services/UserUtil';
import { useDispatch, useSelector } from 'react-redux';
import { showModal } from '../../states/slices/ModalSlicer';
import { useNavigate } from 'react-router-dom';

function PersonnelClearanceForm({ clearance, setSigCanvas, saveSignature, handlePrint, handleCancel, handleOpenTermsAndCondition }) {
    const [signatures, setSignatures] = useState({
        libraryMultimedia: null,
        scienceLab: null,
        criminologyLab: null,
        computerLab: null,
        elCircuits: null,
        hrm: null,
        nursing: null,
        cashier: null,
        registrar: null,
        accountingClerk: null,
        financeOfficer: null,
        propertyCustodian: null,
        programHead: null,
        dean: null,
        vpaf: null,
        vpa: null,
        president: null
    });

    const [notes, setNotes] = useState({
        libraryMultimedia: 'No notes available',
        scienceLab: 'No notes available',
        criminologyLab: 'No notes available',
        computerLab: 'No notes available',
        elCircuits: 'No notes available',
        hrm: 'No notes available',
        nursing: 'No notes available',
        cashier: 'No notes available',
        registrar: 'No notes available',
        accountingClerk: 'No notes available',
        financeOfficer: 'No notes available',
        propertyCustodian: 'No notes available',
        programHead: 'No notes available',
        dean: 'No notes available',
        vpaf: 'No notes available',
        vpa: 'No notes available',
        president: 'No notes available'
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    // const [signature, setSignature] = useState(null);
    // const [sigCanvas, setSigCanvas] = useState(null);
    const { user, status } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const formFields = [
        { label: 'LIBRARY/MULTIMEDIA', key: 'LIBRARIAN' },
        { label: 'CASHIER', key: 'CASHIER' },
        { label: 'REGISTRAR', key: 'REGISTRAR' },
        { label: 'ACCOUNTING CLERK', key: 'ACCOUNTING_CLERK' },
        { label: 'FINANCE OFFICER', key: 'FINANCE' },
        { label: 'PROPERTY CUSTODIAN', key: 'CUSTODIAN' },
        { label: 'PROGRAM HEAD', key: 'PROGRAM_HEAD' },
        { label: 'DEAN', key: 'DEAN' },
        { label: 'VPAF', key: 'VPAF' },
        { label: 'VPA', key: 'VPA' },
        { label: 'PRESIDENT', key: 'PRESIDENT' }
    ];

    const laboratoryFields = [
        { label: 'SCIENCE', key: 'SCIENCE_LAB' },
        { label: 'CRIMINOLOGY', key: 'CRIM_LAB' },
        { label: 'COMPUTER', key: 'COMPUTER_SCIENCE_LAB' },
        { label: 'EL CIRCUITS', key: 'ELECTRONICS_LAB' },
        { label: 'HRM', key: 'HRM_LAB' },
        { label: 'NURSING', key: 'NURSING_LAB' }
    ];

    const openSignatureModal = () => {
        setIsSignatureModalOpen(true);
    };

    const closeSignatureModal = () => {
        setIsSignatureModalOpen(false);
    };

    useEffect(() => {
        if (clearance && clearance?.student_signature && clearance?.status === "PENDING") {
            dispatch(showModal({ message: "Your Clearance is In-Progress" }));
            setTimeout(() => {
                navigate("/user/e-clearance");
            }, 2000);
        }
    }, [clearance]);

    useEffect(() => {
        if (!user) {
            dispatch(fetchUser())
        }

    }, [dispatch, user, status]);

    return (
        <>
            <Helmet>
                <title>Faculty Clearance Form</title>
            </Helmet>

            <div className="min-h-screen bg-gray-100">
                {/* Form Title */}
                <div className="p-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">New Faculty Clearance</h1>
                            <p className="text-sm">Create New Request</p>
                        </div>
                        <h2 className="text-3xl font-bold">Faculty E-Clearance</h2>
                    </div>

                    <div className="border-b border-gray-400 w-full my-4"></div>
                </div>

                {/* Form Section */}
                <div className="p-8 max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
                    <h2 className="text-center text-2xl font-bold mb-8">Certificate of Clearance</h2>

                    <p className="text-center mb-6">
                        This is to certify that <strong>{user?.middle_name ? user?.first_name + " " + user?.middle_name[0] + ". " + user?.lastname : user?.first_name + " " + user?.lastname}</strong> ,
                        has complied with all the requirements and is cleared of all responsibilities under my charge
                        this First Semester, A.Y. 2024 - 2025:
                    </p>

                    {/* Laboratory Section */}
                    <div className="mb-8">
                        <div className="border border-gray-400 p-4 rounded-lg">
                            <h3 className="font-bold mb-4">LABORATORY CLEARANCE</h3>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                {laboratoryFields.map(({ label, key }) => (
                                    <div key={key} className="flex flex-col">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold">{label}:</span>
                                            <span className={`ml-2 ${clearance?.clearance_signoffs?.filter((cs) => cs.role === key)[0]?.status === "COMPLETED" ? `text-green-600` : `text-red-600`}`}>
                                                {clearance?.clearance_signoffs?.filter((cs) => cs.role === key)[0]?.status === "COMPLETED" ? "COMPLETED" : "PENDING"}
                                            </span>
                                        </div>
                                        <div className="mt-2">
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

                    {/* Other Clearances */}
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
                                    {clearance?.clearance_signoffs?.filter((cs) => cs.role === key)[0]?.status === "COMPLETED" ? (
                                        <div className="border border-gray-400 p-2 rounded-md text-center">
                                            <img src={clearance?.clearance_signoffs?.filter((cs) => cs.role === key)[0]?.signature} alt="Signature" className="h-10 mx-auto" />
                                        </div>
                                    ) : (
                                        <div className="border border-gray-400 p-2 rounded-md text-center text-gray-500">
                                            No signature yet ({clearance?.clearance_signoffs?.filter((cs) => cs.role === key)[0]?.status})
                                        </div>
                                    )}
                                </div>
                                <div className="mt-2">
                                    <div className="border border-gray-300 p-2 rounded-md">
                                        <span className="font-bold">Notes:</span>
                                        <div className="text-gray-500">{notes[key]}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
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
                                canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
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
                                    onClick={() => setIsModalOpen(true)}
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
                                including but not limited to <strong>TERMINATION</strong> of employment.
                            </p>
                            <p className="mb-6">
                                The institution reserves the right to pursue legal action against individuals found violating these terms.
                                Please proceed with caution and respect the integrity of this process.
                            </p>
                            <button
                                className="bg-green-800 text-white py-2 px-4 rounded"
                                onClick={() => {
                                    saveSignature();
                                    setIsModalOpen(false);
                                }}
                            >
                                I Agree
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default PersonnelClearanceForm;