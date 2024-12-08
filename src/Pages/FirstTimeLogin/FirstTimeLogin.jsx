import React, { useState } from "react";

const courses = [
  "Bachelor of Arts in Political Science (AB)",
  "Bachelor of Elementary Education (BEEd)",
  "Bachelor of Science in Computer Engineering (BSCpE)",
  "Bachelor of Science in Computer Science (BSCS)",
  "Bachelor of Science in Criminology (BSCrim)",
  "Bachelor of Science in Social Work (BSSW)",
  "Bachelor of Secondary Education (BSEd) Major in English",
  "Bachelor of Secondary Education (BSEd) Major in Mathematics",
  "Bachelor of Science in Accountancy (BSA)",
  "Bachelor of Science in Business Administration (BSBA) Major in Financial Management",
  "Bachelor of Science in Business Administration (BSBA) Major in Marketing Management",
  "Bachelor of Science in Hospitality Management (BSHM)",
  "TESDA Programs - Cookery NC II",
  "TESDA Programs - Food and Beverages NC II",
  "TESDA Programs - Housekeeping NC II",
  "Bachelor of Science in Nursing (BSN)",
];

function FirstTimeLogin() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert(`Password changed successfully! Course: ${selectedCourse}`);
  };

  const filteredCourses = courses.filter((course) =>
    course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex justify-center items-center bg-green-800">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
          First Time Login
        </h2>
        <form onSubmit={handleFormSubmit}>
          {/* Change Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Change Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Course Search Box */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Course
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a course"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {searchQuery && (
              <ul className="border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setSelectedCourse(course);
                        setSearchQuery(course);
                      }}
                      className="p-2 cursor-pointer hover:bg-green-100"
                    >
                      {course}
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500">No courses found</li>
                )}
              </ul>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-700 text-white p-3 rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default FirstTimeLogin;
