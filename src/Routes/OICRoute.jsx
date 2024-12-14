import OICDash from "../Pages/OICDashboard/OICDashboard";
import PendingTransaction from "../Pages/PendingTransaction/PendingTransaction";

export const oicRoutes = [
  {
    path: "/oic/dashboard",
    element: <OICDash />
  },
  {
    path: "/oic/pending-transaction",
    element: <PendingTransaction />
  }
];