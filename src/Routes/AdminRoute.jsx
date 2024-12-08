import AdminDashboard from "../Pages/AdminDashboard/AdminDashboard"
import StudentList from "../Pages/StudentList/StudentList"
import PersonnelList from "../Pages/PersonnelList/PersonnelList"
import OICList from "../Pages/OICList/OICList"
import StudentOfficerList from "../Pages/OfficerList/OfficerList"
import CoursesAndDepartmentList from "../Pages/CoursesAndDepartment/CoursesAndDepartment"
import StudentManagement from "../Pages/StudentManagement/StudentManagement"
import PersonnelManagement from "../Pages/PersonnelManagement/PersonnelManagement"
import OicMangement from "../Pages/OICManagement/OICManagement"
import UserList from "../Pages/UserList/UserList"
import ClubList from "../Pages/ClubList/ClubList"
import OICDash from "../Pages/OICDashboard/OICDashboard"


const AdminDashboardRoute = {
  path: "/admin/dashboard",
  element:  <AdminDashboard/>
}
const StudentListRoute = {
  path: "/admin/student-list",
  element:  <StudentList/>
}
const PersonnelListRoute = {
  path: "/admin/personnel-list",
  element:  <PersonnelList/>
}
const OICListRoute = {
  path: "/admin/oic-list",
  element:  <OICList/>
}
const OfficerListRoute = {
  path: "/admin/officer-list",
  element:  <StudentOfficerList/>
}
const CoursesAndDepartmentListRoute = {
  path: "/admin/couses&department-list",
  element:  <CoursesAndDepartmentList/>
}
const StudentManagementRoute = {
  path: "/admin/student-management",
  element:  <StudentManagement/>
}
const PersonnelManagementRoute = {
  path: "/admin/personnel-management",
  element:  <PersonnelManagement/>
}
const OicMangementRoute = {
  path: "/admin/oic-management",
  element:  <OicMangement/>
}
const UserListRoute = {
  path: "/admin/user-list",
  element:  <UserList/>
}
const ClubListRoute = {
  path: "/admin/club-list",
  element:  <ClubList/>
}
const OICDashRoute = {
  path: "/oic/dash",
  element:  <OICDash/>
}

export {AdminDashboardRoute,StudentListRoute,PersonnelListRoute,OICListRoute,OfficerListRoute,CoursesAndDepartmentListRoute,StudentManagementRoute,PersonnelManagementRoute,OicMangementRoute,UserListRoute,ClubListRoute,OICDashRoute}
