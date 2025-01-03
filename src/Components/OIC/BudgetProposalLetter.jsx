import React, { useEffect, useState } from 'react';
import { FingerPrintIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from "../../api/AxiosConfig";
import { getSignature } from "../../services/LetterUtil";
import Fingerprint from "../../Components/Fingerprint/Fingerprint";

function BudgetProposalLetter({ letter, signaturePreview, onSignatureChange, setSignedPeople, setSignaturePreview }) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [budgetProposal, setBudgetProposal] = useState(null);
  const [captureFingerprint, setCaptureFingerprint] = useState(false);
  const [signature, setSignature] = useState(null);

  if (!user) {
    navigate("/user/moderator-transaction");
    return;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (user.role !== "STUDENT_OFFICER") {
          await axios.post(
            `/generic-letters/on-click/${letter.id}?type=${letter.type}`
          );
        }
        const response = await axios.get(`/budget-proposals/${letter.id}`);
        setBudgetProposal(response.data?.data);
      } catch (error) {
        if (error.status === 404) {
          dispatch(showModal({ message: error.response?.data?.message }));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (budgetProposal) {
      setSignedPeople(budgetProposal?.signed_people)
    }
  }, [budgetProposal]);

  return (
    <div className="space-y-4">
      <h2 className="text-center text-2xl font-bold mb-8">PROPOSED BUDGET</h2>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-2">Name of Activity:</label>
          <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
            {budgetProposal?.name}
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-2">Date:</label>
          <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
            {budgetProposal?.date}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-2">Venue:</label>
          <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
            {budgetProposal?.venue}
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-2">Source of Fund:</label>
          <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
            {budgetProposal?.source_of_fund}
          </div>
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Amount Allotted for the Activity:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          ₱ {budgetProposal?.allotted_amount}
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
                ₱ {budgetProposal?.allotted_amount}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Mayor's Signature (Always shown) */}
      <div className={`mt-6 text-center ${user?.role !== "STUDENT_OFFICER" ? 'hidden' : ''}`}>
        <p className="font-semibold">Prepared by:</p>
        {getSignature(budgetProposal, "STUDENT_OFFICER") && (
          <img
            src={getSignature(budgetProposal, "STUDENT_OFFICER")}
            alt="Mayor's Signature"
            className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
            style={{ maxHeight: '150px', maxWidth: '300px' }}
          />
        )}
        <p className="mt-2 font-bold">CHRISTIAN JAMES V. TORRES</p>
        <p className="text-sm mt-2">Mayor, BLC A.Y. 2023-2024</p>
      </div>

      {/* Moderator's Signature (Already signed) */}
      <div className={`mt-6 text-center ${user?.role !== "MODERATOR" ? 'hidden' : ''}`}>
        <p className="font-semibold">Noted by:</p>
        {getSignature(budgetProposal, "MODERATOR") && (
          <img
            src={getSignature(budgetProposal, "MODERATOR")}
            alt="MODERATOR's Signature"
            className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
            style={{ maxHeight: '150px', maxWidth: '300px' }}
          />
        )}
        <p className="mt-2 font-bold">[Moderator Name]</p>
        <p className="text-sm mt-2">Moderator, BLC A.Y. 2023-2024</p>
      </div>

      {/* DSA Signature Section */}
      <div className={`mt-6 text-center ${user?.role !== "DSA" ? 'hidden' : ''}`}>
        <p className="font-semibold">Noted by:</p>
        <div className="mt-4">
          <button
            onClick={() => setCaptureFingerprint(true)}
            className={`${getSignature(budgetProposal, "DSA") || signature ? "hidden" : ""} flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto`}
          >
            <FingerPrintIcon className="w-6 h-6" />
            <span>Capture Fingerprint</span>
          </button>
        </div>
        {budgetProposal && getSignature(budgetProposal, "DSA") ? <>
          <img
            src={getSignature(budgetProposal, "DSA")}
            alt="DSA's Signature"
            className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
            style={{ maxHeight: '150px', maxWidth: '300px' }}
          />
        </> : <>
          {signature && (
            <img
              src={signature}
              alt="DSA's Signature"
              className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
              style={{ maxHeight: '150px', maxWidth: '300px' }}
            />
          )}
        </>}
        <p className="mt-2 font-bold">BENJIE E. TAHUM, LPT, MAED-TESL</p>
        <p>Director of Student Affairs</p>
      </div>

      {/* Finance Officer Signature Section */}
      <div className={`mt-6 text-center ${user?.role !== "FINANCE" ? 'hidden' : ''}`}>
        <p className="font-semibold">Noted by:</p>
        <div className="mt-4">
          <button
            onClick={() => setCaptureFingerprint(true)}
            className={`${getSignature(budgetProposal, "FINANCE") || signature ? "hidden" : ""} flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto`}
          >
            <FingerPrintIcon className="w-6 h-6" />
            <span>Capture Fingerprint</span>
          </button>
        </div>
        {budgetProposal && getSignature(budgetProposal, "FINANCE") ? <>
          <img
            src={getSignature(budgetProposal, "FINANCE")}
            alt="FINANCE's Signature"
            className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
            style={{ maxHeight: '150px', maxWidth: '300px' }}
          />
        </> : <>
          {signature && (
            <img
              src={signature}
              alt="FINANCE's Signature"
              className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
              style={{ maxHeight: '150px', maxWidth: '300px' }}
            />
          )}
        </>}
        <p className="mt-2 font-bold">VANESSA CLAIRE C. ESPAÑA, CPA</p>
        <p>Finance Officer</p>
      </div>

      {/* President's Signature Section */}
      <div className={`mt-6 text-center ${user?.role !== "PRESIDENT" ? 'hidden' : ''}`}>
        <p className="font-semibold">Approved by:</p>
        <div className="mt-4">
          <button
            onClick={() => setCaptureFingerprint(true)}
            className={`${getSignature(budgetProposal, "PRESIDENT") || signature ? "hidden" : ""} flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto`}
          >
            <FingerPrintIcon className="w-6 h-6" />
            <span>Capture Fingerprint</span>
          </button>
        </div>
        {budgetProposal && getSignature(budgetProposal, "PRESIDENT") ? <>
          <img
            src={getSignature(budgetProposal, "PRESIDENT")}
            alt="PRESIDENT's Signature"
            className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
            style={{ maxHeight: '150px', maxWidth: '300px' }}
          />
        </> : <>
          {signature && (
            <img
              src={signature}
              alt="PRESIDENT's Signature"
              className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
              style={{ maxHeight: '150px', maxWidth: '300px' }}
            />
          )}
        </>}
        <p className="mt-2 font-bold">REV. FR. JESSIE P. PASQUIN, DCC</p>
        <p>President</p>
      </div>

      {captureFingerprint && (
        <Fingerprint
          onOkClick={() => setCaptureFingerprint(false)}
          setSignature={setSignature}
          setSignaturePreview={setSignaturePreview} />
      )}
    </div>
  );
}

export default BudgetProposalLetter;