import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function BudgetProposalLetter({ letter, signaturePreview, onSignatureChange }) {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  if (!user) {
    navigate("/user/moderator-transaction")
    return;
  }

  const calculateTotal = () => {
    return letter.object?.expectedExpenses?.reduce((total, expense) => {
      return total + (parseFloat(expense.amount) || 0);
    }, 0) || 0;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-center text-2xl font-bold mb-8">PROPOSED BUDGET</h2>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-2">Name of Activity:</label>
          <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
            {letter.object.name}
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-2">Date:</label>
          <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
            {letter.object.date}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-2">Venue:</label>
          <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
            {letter.object.venue}
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-2">Source of Fund:</label>
          <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
            {letter.object.source_of_fund}
          </div>
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Amount Allotted for the Activity:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {letter.object.allotted_amount}
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
            {letter.object?.expectedExpenses?.map((expense, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">{expense.name}</td>
                <td className="border border-gray-300 p-2 text-right">
                  ₱ {parseFloat(expense.amount || 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="border border-gray-300 p-2 font-bold">Total</td>
              <td className="border border-gray-300 p-2 text-right font-bold">
                ₱ {calculateTotal().toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Signatures Section */}
      <div className="mt-6 text-center">
        <p className="font-semibold">Prepared by:</p>
        <img
          alt="Mayor's Signature"
          className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
          style={{ maxHeight: '150px', maxWidth: '300px' }}
          src={letter.object.student_officer_signature}
        />
        <p className="mt-2 font-bold">{letter.object.student_officer}</p>
        <p className="text-sm mt-2">Mayor, BLC A.Y. 2023-2024</p>
      </div>

      <div className="mt-6">
        <div className="text-center">
          <p className="font-semibold">Noted by:</p>
          <div className="mt-4">
            <label className="block font-semibold mb-2">Attach Signature</label>
            <input
              type="file"
              className="border-gray-300 border-2 p-2 rounded-md w-full"
              accept="image/*"
              onChange={onSignatureChange}
            />
          </div>
          {signaturePreview && (
            <div className="mt-4">
              <p className="font-semibold">Signature Preview:</p>
              <img
                src={signaturePreview}
                alt="Signature Preview"
                className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
                style={{ maxHeight: '150px', maxWidth: '300px' }}
              />
            </div>
          )}
          <input
            type="text"
            className="w-full border-gray-300 border-2 p-2 rounded-md mt-4 text-center"
            placeholder="Name of Club Moderator"
            disabled
            defaultValue={user.first_name + " " + user.middle_name + " " + user.lastname}
          />
          <p className="text-sm mt-2">Moderator, BLC A.Y. 2023-2024</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mt-8">
        <div>
          <p className="font-bold mb-2">BENJIE E. TAHUM, LPT, MAED-TESL</p>
          <p>Director of Student Affairs</p>
        </div>
        <div>
          <p className="font-bold mb-2">VANESSA CLAIRE C. ESPAÑA, CPA</p>
          <p>Finance Officer</p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="font-semibold">Approved by:</p>
        <p className="mt-2 font-bold">REV. FR. JESSIE P. PASQUIN, DCC</p>
        <p>President</p>
      </div>
    </div>
  );
}

export default BudgetProposalLetter;