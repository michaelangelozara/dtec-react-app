import AdminDashboard from "../Pages/AdminDashboard/AdminDashboard";
import StudentList from "../Pages/StudentList/StudentList";
import PersonnelList from "../Pages/PersonnelList/PersonnelList";
import OICList from "../Pages/OICList/OICList";
import StudentOfficerList from "../Pages/OfficerList/OfficerList";
import CoursesAndDepartmentList from "../Pages/CoursesAndDepartment/CoursesAndDepartment";
import StudentManagement from "../Pages/StudentManagement/StudentManagement";
import PersonnelManagement from "../Pages/PersonnelManagement/PersonnelManagement";
import OicMangement from "../Pages/OICManagement/OICManagement";
import UserList from "../Pages/UserList/UserList";
import ClubList from "../Pages/ClubList/ClubList";
import ECOIC from "../Pages/EClearanceOICPage/EClearanceOICPage";

export const adminRoutes = [
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />
  },
  {
    path: "/admin/student-list",
    element: <StudentList />
  },
  {
    path: "/admin/personnel-list",
    element: <PersonnelList />
  },
  {
    path: "/admin/oic-list",
    element: <OICList />
  },
  {
    path: "/admin/officer-list",
    element: <StudentOfficerList />
  },
  {
    path: "/admin/courses-department-list",
    element: <CoursesAndDepartmentList />
  },
  {
    path: "/admin/student-management",
    element: <StudentManagement />
  },
  {
    path: "/admin/personnel-management",
    element: <PersonnelManagement />
  },
  {
    path: "/admin/oic-management",
    element: <OicMangement />
  },
  {
    path: "/admin/user-list",
    element: <UserList />
  },
  {
    path: "/admin/club-list",
    element: <ClubList />
  },
  {
    path: "/admin/clearance-form",
    element: <ECOIC />
  }
];