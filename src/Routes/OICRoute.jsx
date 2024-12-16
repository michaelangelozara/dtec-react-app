import OICDash from "../Pages/OICDashboard/OICDashboard";
import PendingTransaction from "../Pages/PendingTransaction/PendingTransaction";
import OICTransaction from "../Pages/OICTransaction/OICTransaction";

export const oicRoutes = [
  {
    path: "/oic/dashboard",
    element: <OICDash />
  },
  {
    path: "/oic/transactions",
    element: <OICTransaction />
  },
  {
    path: "/oic/pending-transaction",
    element: <PendingTransaction />
  }
];