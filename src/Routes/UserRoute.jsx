import UserDashboard from "../Pages/UserDashBoard/UserDashBoard"
import UserDocumentTracking from "../Pages/UserDocumentTracking/UserDocumentTracking"
import UserEClearance from "../Pages/UserE-Clearance/UserE-Clearance"
import UserDTTransactions from "../Pages/UserDTTransactions/UserDTTransactions"
import LandingPage from "../Pages/LandingPage/LandingPage"


const UserDashboardRoute = {
  path: "/user/dashboard",
  element:  <UserDashboard/>
}
const UserDocumentTrackingRoute = {
  path: "/user/document-tracking",
  element:  <UserDocumentTracking/>
}
const UserDTTransactionRoute = {
  path: "/user/document-tracking-transactions",
  element:  <UserDTTransactions/>
}
const UserEClearanceRoute = {
  path: "/user/e-clearance",
  element:  <UserEClearance/>
}
const LandingPageRoute = {
  path: "/",
  element:  <LandingPage/>
}
export {UserDashboardRoute,UserDocumentTrackingRoute,UserEClearanceRoute,UserDTTransactionRoute,LandingPageRoute}
