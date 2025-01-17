import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Helmet } from 'react-helmet';
import newTransactionIcon from '../../Images/nt.svg';
import myTransactionIcon from '../../Images/mt.svg';
import downloadablesIcon from '../../Images/dl.svg';
import PrimaryNavBar from '../../Components/NavBar/PrimaryNavBar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from "../../states/slices/UserSlicer";
import { useNavigate } from 'react-router-dom';
import { studentOfficerRole } from "../../services/UserUtil";

Modal.setAppElement('#root');

function DocumentTracking() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [alertModalIsOpen, setAlertModalIsOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState('');

  const { user, status } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpenModal = () => setModalIsOpen(true);
  const handleCloseModal = () => setModalIsOpen(false);

  const handleCloseAlertModal = () => {
    setAlertModalIsOpen(false);
    handleOpenModal();
  };

  const handleTransactionChange = (event) => {
    setSelectedTransaction(event.target.value);
  };

  const handleSubmit = () => {
    switch (selectedTransaction) {
      case 'Implementation Program (In-Campus)':
        navigate('/user/implementation-letter-ic');
        break;
      case 'Implementation Program (Off-Campus)':
        navigate('/user/implementation-letter-oc');
        break;
      case 'Communication Letter (In-Campus)':
        navigate('/user/communication-letter-ic');
        break;
      case 'Communication Letter (Off-Campus)':
        navigate('/user/communication-letter-oc');
        break;
      case 'Budget Proposal':
        navigate('/user/budget-proposal');
        break;
      case 'Permit to Enter the Campus Outside Regular Schedules':
        navigate('/user/permit-to-enter-campus');
        break;
      case 'Use of School Facilities & Equipment':
        navigate('/user/use-facilities');
        break;
      default:
        alert("Please select a valid transaction type.");
        break;
    }
    handleCloseModal();
  };

  const navigateMyTransactions = () => {
    navigate('/user/document-tracking-transactions');
  };

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser())
    }

    if (user && !studentOfficerRole.includes(user.role)) {
      navigate(navigateRouteByRole(user));
    }
  }, [dispatch, user]);

  return (
    <>
      {status === "Succeeded" && (
        <>
          <Helmet>
            <title>Document Tracking</title>
          </Helmet>
          <PrimaryNavBar />

          <div className="p-8">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold">Welcome, {user?.first_name} {user?.middle_name} {user?.lastname}!</h1>
                <p className="text-sm text-gray-600">Select your Transaction</p>
              </div>
              <div className="left-96">
                <h2 className="text-2xl font-bold mb-8">Document Tracking</h2>
              </div>
            </div>

            <div className="border-b border-gray-400 w-full my-2"></div>

            <div className="flex flex-wrap justify-center gap-8 mt-16">
              <button
                onClick={handleOpenModal}
                className="bg-green-700 text-white font-bold py-8 px-12 rounded-lg flex flex-col items-center justify-center hover:bg-green-800 transition-colors w-72 h-45"
              >
                <img src={newTransactionIcon} alt="New Transaction" className="h-12 mb-2" />
                New Transaction
                <span className="text-sm font-normal">Create New Transaction</span>
              </button>
              <a
                onClick={navigateMyTransactions}
                className="bg-green-700 text-white font-bold py-8 px-12 rounded-lg flex flex-col items-center justify-center hover:bg-green-800 transition-colors w-72 h-45"
              >
                <img src={myTransactionIcon} alt="My Transaction" className="h-12 mb-2" />
                My Transaction
                <span className="text-sm font-normal">S.Y. 2024-2025</span>
              </a>
              <a
                href="/downloadables"
                className="bg-green-700 text-white font-bold py-8 px-12 rounded-lg flex flex-col items-center justify-center hover:bg-green-800 transition-colors w-72 h-45"
              >
                <img src={downloadablesIcon} alt="Downloadables" className="h-12 mb-2" />
                Downloadables
                <span className="text-sm font-normal text-center">Sample Forms and Letter Format</span>
              </a>
            </div>
          </div>

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={handleCloseModal}
            contentLabel="Select Transaction"
            className="modal-content"
            overlayClassName="modal-overlay"
          >
            <h2 className="text-2xl font-bold mb-4">Select Transaction Type</h2>
            <div className="mb-4 w-full">
              <label htmlFor="transactionType" className="block text-lg font-semibold mb-2">Transaction Type:</label>
              <select
                id="transactionType"
                value={selectedTransaction}
                onChange={handleTransactionChange}
                className="border border-gray-300 p-2 rounded-lg w-full"
              >
                <option value="">Select an option...</option>
                <option value="Implementation Program (In-Campus)">Implementation Program (In-Campus)</option>
                <option value="Implementation Program (Off-Campus)">Implementation Program (Off-Campus)</option>
                <option value="Communication Letter (In-Campus)">Communication Letter (In-Campus)</option>
                <option value="Communication Letter (Off-Campus)">Communication Letter (Off-Campus)</option>
                <option value="Budget Proposal">Budget Proposal</option>
                <option value="Permit to Enter the Campus Outside Regular Schedules">Permit to Enter the Campus Outside Regular Schedules</option>
                <option value="Use of School Facilities & Equipment">Use of School Facilities & Equipment</option>
              </select>
            </div>
            <div className="flex justify-end gap-4 w-full">
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-800"
              >
                Submit
              </button>
            </div>
          </Modal>
        </>
      )}

      <style>
        {`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .modal-content {
            background: white;
            border-radius: 8px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
          }
        `}
      </style>
    </>
  );
}

export default DocumentTracking;