import UserDashboard from "../Pages/UserDashBoard/UserDashBoard";
import UserDocumentTracking from "../Pages/UserDocumentTracking/UserDocumentTracking";
import UserEClearance from "../Pages/UserE-Clearance/UserE-Clearance";
import UserDTTransactions from "../Pages/UserDTTransactions/UserDTTransactions";
import EC from "../Pages/EClearancePage/EClearancePage";
import ECMT from "../Pages/EClearanceTransaction/EClearanceTransaction";
import OFO from "../Pages/OsaFormOfficer/OsaFormOfficer";
import ILIC from "../Pages/ImplementationIncampus/ImplementationIncampus";
import ILOC from "../Pages/ImplementationOffCampus/ImplementationOffCampus";
import CLiC from "../Pages/CommunicationLetterIC/CommunicationLetterIC";
import CLOC from "../Pages/CommunicationLetterOC/CommunicationLetterOC";
import PTEC from "../Pages/PermitEnterCampusForm/PermitEnterCampusForm";
import UoF from "../Pages/UseFacilitiesForm/UseFacilitiesForm";
import BudgetProposalLetter from "../Pages/BudgetProposal/BudgetProposalLetter";
import ModeratorDashboard from "../Pages/ModeratorDashboard/ModeratorDashboard";
import ModeratorTransaction from "../Pages/ModeratorTransaction/ModeratorTransaction";
import PersonnelClearanceForm from "../Pages/Personnel/PersonnelClearanceForm";

export const userRoutes = [
  {
    path: "/user/dashboard",
    element: <UserDashboard />
  },
  {
    path: "/user/document-tracking",
    element: <UserDocumentTracking />
  },
  {
    path: "/user/document-tracking-transactions",
    element: <UserDTTransactions />
  },
  {
    path: "/user/e-clearance",
    element: <UserEClearance />
  },
  {
    path: "/user/clearance-form",
    element: <EC />
  },
  {
    path: "/user/my-transactions",
    element: <ECMT />
  },
  {
    path: "/user/OSA-form-officer",
    element: <OFO />
  },
  {
    path: "/user/implementation-letter-ic",
    element: <ILIC />
  },
  {
    path: "/user/implementation-letter-oc",
    element: <ILOC />
  },
  {
    path: "/user/communication-letter-ic",
    element: <CLiC />
  },
  {
    path: "/user/communication-letter-oc",
    element: <CLOC />
  },
  {
    path: "/user/permit-to-enter-campus",
    element: <PTEC />
  },
  {
    path: "/user/use-facilities",
    element: <UoF />
  },
  {
    path: "/user/budget-proposal",
    element: <BudgetProposalLetter />
  },
  {
    path: "/user/moderator-dashboard",
    element: <ModeratorDashboard />
  },
  {
    path: "/user/moderator-transaction",
    element: <ModeratorTransaction />
  },
  {
    path: "/user/personnel-clearance",
    element: <PersonnelClearanceForm />
  }
];