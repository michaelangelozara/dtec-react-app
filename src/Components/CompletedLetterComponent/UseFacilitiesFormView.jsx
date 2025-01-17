import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from "../../api/AxiosConfig";
import { getSignature } from '../../services/LetterUtil';
import { showModal } from '../../states/slices/ModalSlicer';

function UseFacilitiesFormView({
  facilities,
  signaturePreview,
  onSignatureChange,
  setSignedPeople,
  setSignaturePreview
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [facilitiesForm, setFacilitiesForm] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/user/moderator-transaction");
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (user.role !== "STUDENT_OFFICER") {
          await axios.post(
            `/generic-letters/on-click/${facilities.id}?type=${facilities.type}`
          );
        }
        const response = await axios.get(`/sfefs/${facilities.id}`);
        setFacilitiesForm(response.data?.data);
      } catch (error) {
        if (error.response?.status === 404) {
          dispatch(showModal({ message: error.response?.data?.message }));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, facilities, navigate, dispatch]);

  useEffect(() => {
    if (facilitiesForm) {
      setSignedPeople(facilitiesForm?.signed_people)
    }
  }, [facilitiesForm, setSignedPeople]);

  if (!user) return null;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const signatureStyle = {
    maxHeight: '150px',
    maxWidth: '300px',
    minHeight: '150px',
    minWidth: '300px',
    objectFit: 'contain',
  };

  return (
    <div className="space-y-4">
      <h2 className="text-center text-2xl font-bold mb-8 underline">
        USE OF SCHOOL FACILITIES & EQUIPMENT FORM
      </h2>

      {/* Content Sections */}
      <div>
        <label className="block font-semibold mb-2">Requisitioner:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {facilitiesForm?.requisitioner}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Club:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {facilitiesForm?.club}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Position:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {facilitiesForm?.position}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Name of Venue/s:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line">
          {facilitiesForm?.venue}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Activity/Purpose:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50 whitespace-pre-line">
          {facilitiesForm?.activity}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Date and Time:</label>
        <div className="w-full border-gray-300 border-2 p-2 rounded-md bg-gray-50">
          {facilitiesForm?.date} | {facilitiesForm?.time_from} - {facilitiesForm?.time_to}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Facilities/Equipment Needed:</label>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Name of Facilities/Equipment</th>
                <th className="border border-gray-300 p-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {facilitiesForm?.facilityOrEquipments?.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{item.name}</td>
                  <td className="border border-gray-300 p-2">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Signature Sections */}
      <div className="mt-6 text-center">
        <p className="font-semibold">Requested By:</p>
        <img
          src={getSignature(facilitiesForm, "STUDENT_OFFICER") || ''}
          alt="Student Officer's Signature"
          className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
          style={signatureStyle}
        />
        <p className="mt-2 font-bold">{facilitiesForm?.requisitioner}</p>
        <p className="text-sm mt-2">Mayor, {facilitiesForm?.club}</p>
      </div>

      <div className="mt-6">
        <div className="text-center">
          <p className="font-semibold">Noted by:</p>
          <div className="mt-6 flex justify-center items-center flex-col">
            <p className="text-sm font-medium mb-2">Signature Preview:</p>
            <img
              src={getSignature(facilitiesForm, "MODERATOR") || ''}
              alt="Moderator's Signature"
              className="border rounded p-2 mx-auto"
              style={signatureStyle}
            />
          </div>
          <p className="mt-2 font-bold">{user?.moderator}</p>
          <p className="text-sm mt-2">Moderator, {facilitiesForm?.club}</p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="font-semibold">Booked By:</p>
        <div className="mt-4">
          <p className="font-semibold">Signature Preview:</p>
          <img
            src={getSignature(facilitiesForm, "AUXILIARY_SERVICE_HEAD") || ''}
            alt="Office Head's Signature"
            className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
            style={signatureStyle}
          />
        </div>
        <p className="mt-2 font-bold">{user?.office_head}</p>
        <p>Auxiliary Service Head</p>
      </div>

      {/* Acknowledged By Section */}
      <div className="mt-6 text-center">
        <p className="font-semibold">Acknowledged By:</p>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {/* Chapel In-charge */}
          <div>
            <img
              src={getSignature(facilitiesForm, "CHAPEL") || ''}
              alt="Chapel In-charge's Signature"
              className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
              style={signatureStyle}
            />
            <p className="mt-2 font-bold">{user?.chapel_incharge || "Chapel In-charge"}</p>
            <p className="text-sm">Chapel In-charge</p>
          </div>

          {/* Physical Plant In-charge */}
          <div>
            <img
              src={getSignature(facilitiesForm, "PPLO") || ''}
              alt="Physical Plant In-charge's Signature"
              className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
              style={signatureStyle}
            />
            <p className="mt-2 font-bold">{user?.physical_plant_incharge || "Physical Plant In-charge"}</p>
            <p className="text-sm">Physical Plant In-charge</p>
          </div>

          {/* Multimedia In-charge */}
          <div>
            <img
              src={getSignature(facilitiesForm, "MULTIMEDIA") || ''}
              alt="Multimedia In-charge's Signature"
              className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
              style={signatureStyle}
            />
            <p className="mt-2 font-bold">{user?.multimedia_incharge || "Multimedia In-charge"}</p>
            <p className="text-sm">Multimedia In-charge</p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="font-semibold">Approved By:</p>
        <div className="mt-4">
          <p className="font-semibold">Signature Preview:</p>
          <img
            src={getSignature(facilitiesForm, "PRESIDENT") || ''}
            alt="President's Signature"
            className="mx-auto border border-gray-300 p-2 rounded-md mt-2"
            style={signatureStyle}
          />
        </div>
        <p className="mt-2 font-bold">{user?.president}</p>
        <p>NDTC President</p>
      </div>
    </div>
  );
}

export default UseFacilitiesFormView;