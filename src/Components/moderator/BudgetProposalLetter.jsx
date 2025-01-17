import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from "../../api/AxiosConfig";
import { showModal } from '../../states/slices/ModalSlicer';
import { getSignature } from '../../services/LetterUtil';
import { FaFingerprint } from 'react-icons/fa';

function BudgetProposalLetter({ letter, setSignedPeople }) {
  const [isLoading, setIsLoading] = useState(false);
  const [budgetProposal, setBudgetProposal] = useState(null);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signaturePreview, setSignaturePreview] = useState("");

  if (!user) {
    navigate("/user/moderator-transaction")
    return;
  }

  const fetchSignature = async() => {
    try {
      const response = await axios.get("/users/get-sm-e-signature");
      setSignaturePreview(response.data?.data);
    } catch (error) {
      
    }

  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (user.role !== "STUDENT_OFFICER") {
          await axios.post(`/generic-letters/on-click/${letter.id}?type=${letter.type}`);
        }
        const response = await axios.get(`/budget-proposals/${letter.id}`);
        setBudgetProposal(response.data?.data);
      } catch (error) {
        if (error.status === 404) {
          dispatch(showModal({ message: error.response?.data?.message }))
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [])

  useEffect(() => {
    if (budgetProposal) {
      setSignedPeople(budgetProposal.signed_people);
    }
  }, [budgetProposal]);

  return (
    <>
      {budgetProposal && !isLoading && (
        <div className="space-y-4">
          <h2 className="text-center text-2xl font-bold mb-8">PROPOSED BUDGET</h2>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2">Name of Activity:</label>
              <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
                {budgetProposal.name}
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-2">Date:</label>
              <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
                {budgetProposal.date}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2">Venue:</label>
              <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
                {budgetProposal.venue}
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-2">Source of Fund:</label>
              <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
                {budgetProposal.source_of_fund}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Amount Allotted for the Activity:</label>
            <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
              {budgetProposal.allotted_amount}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Expected Expenses:</label>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">Item</th>
                  <th className="border border-gray-300 p-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {budgetProposal?.expectedExpenses?.map((expense, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">{expense.name}</td>
                    <td className="border border-gray-300 p-2 text-right">
                      ₱ {expense.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="border border-gray-300 p-2 font-bold">Total</td>
                  <td className="border border-gray-300 p-2 text-right font-bold">
                    ₱ {budgetProposal.allotted_amount}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Signatures Section */}
          {/* <div className={`mt-6 text-center ${user?.role !== 'STUDENT_OFFICER' ? 'hidden' : ''}`}>
            <p className="font-semibold">Prepared by:</p>
            <img
              alt="Mayor's Signature"
              className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
              style={{ maxHeight: '150px', maxWidth: '300px' }}
              src={budgetProposal.student_officer_signature}
            />
            <p className="mt-2 font-bold">{budgetProposal.student_officer}</p>
            <p className="text-sm mt-2">Mayor, BLC A.Y. 2023-2024</p>
          </div> */}

          <div className="mt-6">
            <div className="text-center">
              <p className="font-semibold">Noted by:</p>
              {getSignature(budgetProposal, "MODERATOR") ? (
                <img
                  alt="MODERATOR's Signature"
                  className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                  style={{ maxHeight: "150px", maxWidth: "300px" }}
                  src={getSignature(budgetProposal, "MODERATOR")}
                />
              ) : (
                <>
                  <button
                    onClick={() => fetchSignature()}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 mx-auto"
                    disabled={user.role !== "MODERATOR"}
                  >
                    <FaFingerprint /> Attach Signature
                  </button>
                  {signaturePreview && (
                    <div className="mt-4">
                      <p className="font-semibold">Signature Preview:</p>
                      <img
                        alt="MODERATOR's Signature"
                        className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                        style={{ maxHeight: "150px", maxWidth: "300px" }}
                        src={signaturePreview}
                      />
                    </div>
                  )}
                </>
              )}

              <input
                type="text"
                className="w-full border-gray-300 border-2 p-2 rounded-md mt-4 text-center"
                placeholder="Name of Club Moderator"
                disabled
                defaultValue={user.first_name + " " + user.middle_name + " " + user.lastname}
              />
              <p className="text-sm mt-2">Moderator, {user?.officer_at} A.Y. 2023-2024</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BudgetProposalLetter;