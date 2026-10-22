import { render } from "../core"
import { CURRENT_BUILD_DATE } from "./data"
import { scanForProjectCandidate } from "./generated"
// ...
import HomePage from "./page"
import ProjectPage from "./page/project"

const projectCanidate = await scanForProjectCandidate("D:/projects")
console.log("Found", projectCanidate.length, "canidate, time to generate some pages")

render((
  <HomePage 
    buildDate={CURRENT_BUILD_DATE} 
    projectList={projectCanidate} 
  />
), "./docs/index.html")

for (const stat of projectCanidate) {
  render(<ProjectPage {...stat} />, `./docs/${stat.id}.html`)
}