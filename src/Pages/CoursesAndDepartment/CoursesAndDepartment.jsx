import React from "react";
import Banner from "../../Images/banner.svg";

const courses = [
  {
    department: "College of Arts and Sciences, and Education",
    programs: [
      "Bachelor of Arts in Political Science (AB)",
      "Bachelor of Elementary Education (BEEd)",
      "Bachelor of Science in Computer Engineering (BSCpE)",
      "Bachelor of Science in Computer Science (BSCS)",
      "Bachelor of Science in Criminology (BSCrim)",
      "Bachelor of Science in Social Work (BSSW)",
      "Bachelor of Secondary Education (BSEd) Major in English",
      "Bachelor of Secondary Education (BSEd) Major in Mathematics",
    ],
  },
  {
    department: "College of Business and Technical Vocational Courses",
    programs: [
      "Bachelor of Science in Accountancy (BSA)",
      "Bachelor of Science in Business Administration (BSBA) Major in Financial Management",
      "Bachelor of Science in Business Administration (BSBA) Major in Marketing Management",
      "Bachelor of Science in Hospitality Management (BSHM)",
      "TESDA Programs - Cookery NC II",
      "TESDA Programs - Food and Beverages NC II",
      "TESDA Programs - Housekeeping NC II",
    ],
  },
  {
    department: "College of Nursing",
    programs: ["Bachelor of Science in Nursing (BSN)"],
  },
];

function CoursesAndDepartment() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-800 py-4 px-6 flex justify-between items-center">
        <img src={Banner} alt="DTEC Logo" className="h-16" />
      </div>

      {/* Heading */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Courses and Departments
        </h2>
      </div>

      {/* Table */}
      <div className="p-8">
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 bg-white shadow-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Department
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Programs
                </th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600 font-semibold">
                    {course.department}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                    <ul className="list-disc pl-6">
                      {course.programs.map((program, programIndex) => (
                        <li key={programIndex}>{program}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CoursesAndDepartment;
