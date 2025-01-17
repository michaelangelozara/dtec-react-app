import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaPlus, FaTrash, FaFingerprint } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PrimaryNavBar from "../../Components/NavBar/PrimaryNavBar";
import axios from "../../api/AxiosConfig";
import { navigateRouteByRole } from "../../services/RouteUtil";
import { studentOfficerRole } from "../../services/UserUtil";
import { fetchUser } from "../../states/slices/UserSlicer";
import { hideModal, showModal } from '../../states/slices/ModalSlicer';
import Modal from "../../Components/modal/Modal";

function BudgetProposalLetter() {
  const { user, status } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signaturePreview, setSignaturePreview] = useState("");

  const [formData, setFormData] = useState({
    name: '',
    date: '',
    venue: '',
    source_of_fund: '',
    allotted_amount: '',
    expected_expenses: [{ name: '', amount: '' }],
    student_officer_signature: ""
  });

  const handleDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    const currentDate = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(currentDate.getDate() + 7);
  
    if (selectedDate >= sevenDaysFromNow) {
      setFormData({ ...formData, date: event.target.value });
    } else {
      dispatch(showModal({ message: 'Please select a date at least 7 days from today' }));
    }
  };

  const fetchSignature = async() => {
    try {
      const response = await axios.get("/users/get-sm-e-signature");
      const signatureData = response.data?.data;
      setSignaturePreview(signatureData);
      setFormData({ ...formData, student_officer_signature: signatureData });
    } catch (error) {
      dispatch(showModal({ message: 'Failed to fetch signature' }));
    }
  };

  const handleSignatureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, student_officer_signature: reader.result });
        setSignaturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, student_officer_signature: null });
      setSignaturePreview("");
    }
  };

  const handleExpenseChange = (index, field, value) => {
    const newExpenses = [...formData.expected_expenses];
    newExpenses[index][field] = field === 'amount' ? Number(value) : value;
    setFormData({ ...formData, expected_expenses: newExpenses });
  };

  const addExpense = () => {
    setFormData({
      ...formData,
      expected_expenses: [...formData.expected_expenses, { name: '', amount: '' }]
    });
  };

  const removeExpense = (index) => {
    const newExpenses = formData.expected_expenses.filter((_, i) => i !== index);
    setFormData({ ...formData, expected_expenses: newExpenses });
  };

  const calculateTotal = () => {
    return formData.expected_expenses.reduce((total, expense) => {
      return total + (parseFloat(expense.amount) || 0);
    }, 0);
  };

  const resetFields = () => {
    setFormData({
      name: '',
      date: '',
      venue: '',
      source_of_fund: '',
      allotted_amount: '',
      expected_expenses: [{ name: '', amount: '' }],
      student_officer_signature: ""
    });
    setSignaturePreview("");
  }

  const handleSave = async () => {
    try {
      const response = await axios.post("/budget-proposals/propose-budget", formData);
      if (response.status === 201) {
        dispatch(showModal({ message: response.data?.message }));
        setTimeout(() => {
          navigate("/user/document-tracking");
          dispatch(hideModal());
          resetFields();
        }, 2000);
      }
    } catch (error) {
      if (error.status === 400 || error.status === 403 || error.status === 400) {
        dispatch(showModal({ message: error.response?.data?.message }));
      }
    }
  }

  const handleCancel = () => {
    navigate("/user/document-tracking")
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
            <title>Budget Proposal Letter</title>
          </Helmet>

          <div className="min-h-screen bg-gray-100">
            <PrimaryNavBar />

            {/* Main Content */}
            <div className="p-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-2xl font-bold text-center mb-8">PROPOSED BUDGET</h1>

                {/* Form Fields */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block font-medium mb-2">Name of Activity:</label>
                      <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-2">Date:</label>
                      <input
                          type="date"
                          className="w-full border rounded p-2"
                          value={formData.date}
                          onChange={handleDateChange}
                          min={new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]}
                        />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block font-medium mb-2">Venue:</label>
                      <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={formData.venue}
                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-2">Source of Fund:</label>
                      <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={formData.source_of_fund}
                        onChange={(e) => setFormData({ ...formData, source_of_fund: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium mb-2">Amount Allotted for the Activity:</label>
                    <input
                      type="number"
                      className="w-full border rounded p-2"
                      value={formData.allotted_amount}
                      onChange={(e) => setFormData({ ...formData, allotted_amount: e.target.value })}
                    />
                  </div>

                  {/* Expected Expenses */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="font-medium">Expected Expenses:</label>
                      <button
                        type="button"
                        onClick={addExpense}
                        className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
                      >
                        <FaPlus className="mr-2" /> Add Item
                      </button>
                    </div>

                    {formData.expected_expenses.map((expense, index) => (
                      <div key={index} className="flex space-x-4 mb-4">
                        <input
                          type="text"
                          placeholder="Item"
                          className="flex-1 border rounded p-2"
                          value={expense.name}
                          onChange={(e) => handleExpenseChange(index, 'name', e.target.value)}
                        />
                        <input
                          type="number"
                          placeholder="Amount"
                          className="w-32 border rounded p-2"
                          value={expense.amount}
                          onChange={(e) => handleExpenseChange(index, 'amount', e.target.value)}
                        />
                        {formData.expected_expenses.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExpense(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    ))}

                    <div className="text-right font-bold mt-4">
                      Total: ₱ {calculateTotal().toFixed(2)}
                    </div>
                  </div>

                  {/* Signatures Section */}
                  <div className="grid grid-cols-2 gap-8 mt-8">
                      <div>
                        <p className="font-bold">Prepared by:</p>
                        <div className="mt-4">
                          <button
                            onClick={fetchSignature}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 mx-auto"
                          >
                            <FaFingerprint /> Attach Signature
                          </button>
                          {signaturePreview && (
                            <div className="mb-4">
                              <p className="text-sm font-medium mb-2">Signature Preview:</p>
                              <img
                                src={signaturePreview}
                                alt="Mayor Signature"
                                className="max-h-20 border rounded p-2"
                              />
                            </div>
                          )}
                          <input
                            type="text"
                            className="w-full border-b-2 font-bold"
                            placeholder="Enter name"
                            defaultValue={user?.role === "STUDENT_OFFICER" ? user?.first_name + " " + user?.middle_name + " " + user?.lastname : ""}
                            disabled
                          />
                          <p>Mayor, {user?.officer_at} A.Y. 2023-2024</p>
                        </div>
                      </div>
                    <div>
                      <p className="font-bold">Noted by:</p>
                      <div className="mt-4">
                        <input
                          type="text"
                          className="w-full border-b-2 font-bold"
                          placeholder="Enter name"
                          defaultValue={user?.moderator}
                          disabled
                        />
                        <p>Moderator, {user?.officer_at} A.Y. 2023-2024</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Signatures */}
                  <div className="grid grid-cols-2 gap-8 mt-8">
                    <div>
                      <p className="font-bold mb-2">{user?.dsa}</p>
                      <p>Director of Student Affairs</p>
                    </div>
                    <div>
                      <p className="font-bold mb-2">{user?.finance}</p>
                      <p>Finance Officer</p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <p className="font-bold mb-2">Approved by:</p>
                    <p className="font-bold">{user?.president}</p>
                    <p>President</p>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-end space-x-4 mt-8">
                    <button
                      className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                  </div>
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

export default BudgetProposalLetter;