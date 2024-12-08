import ILIC from "../Pages/ImplementationIncampus/ImplementationIncampus"
import ILOC from "../Pages/ImplementationOffCampus/ImplementationOffCampus"
import CLiC from "../Pages/CommunicationLetterIC/CommunicationLetterIC"
import CLOC from "../Pages/CommunicationLetterOC/CommunicationLetterOC"

const ILICRoute = {
  path: "/user/implementation-letter-ic",
  element:  <ILIC/>
}
const ILOCRoute = {
  path: "/user/implementation-letter-oc",
  element:  <ILOC/>
}
const CLICRoute = {
  path: "/user/communication-letter-ic",
  element:  <CLiC/>
}
const CLOCRoute = {
  path: "/user/communication-letter-oc",
  element:  <CLOC/>
}


export {ILICRoute,ILOCRoute,CLICRoute,CLOCRoute}
