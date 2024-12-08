import EC from "../Pages/EClearancePage/EClearancePage"
import ECOIC from "../Pages/EClearanceOICPage/EClearanceOICPage"
import ECMT from "../Pages/EClearanceTransaction/EClearanceTransaction"
import OFO from "../Pages/OsaFormOfficer/OsaFormOfficer"

const ECRoute = {
  path: "/user/clearance-form",
  element:  <EC/>
}
const ECMTRoute = {
  path: "/user/my-transactions",
  element:  <ECMT/>
}
const ECOICRoute = {
  path: "/admin/clearance-form",
  element:  <ECOIC/>
}
const OFORoute = {
  path: "/user/OSA-form-officer",
  element:  <OFO/>
}

export {ECRoute,ECOICRoute,ECMTRoute,OFORoute}
