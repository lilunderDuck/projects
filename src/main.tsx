import path from "node:path"
// ...
import { render } from "./core"
import { CURRENT_BUILD_DATE } from "./data"
// ...
import HomePage from "./page"
import ProjectPage from "./page/project"
import ProjectSubpage from "./page/project-subpage"
// ...
import { copyDir, dplLogger, ensureDirExist } from "./utils"
import { scanForProjectCandidate } from "./projectDiscovery"
import { initPrism } from "./prismInit"

initPrism()

const projectCanidate = await scanForProjectCandidate("D:/projects")

const GLOBAL_STYLE = `
  @keyframes dot_grid_move {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 40px -40px;
    }
  }
`

const TITLE = "Duck's project index"

render((
  <HomePage 
    buildDate={CURRENT_BUILD_DATE} 
    projectList={projectCanidate} 
  />
), "./docs/index.html", {
  title: "Duck's project index",
  description: "",
  css: GLOBAL_STYLE
})

for (const stat of projectCanidate) {
  const outputFolder = `./docs/${stat.id}`
  ensureDirExist(outputFolder)
  ensureDirExist(`${outputFolder}/assets`)
  if (stat.assetsPath) {
    copyDir(stat.assetsPath, `${outputFolder}/assets`)
  }

  const pageOptions = {
    title: TITLE,
    description: "",
    css: GLOBAL_STYLE,
    baseStylePath: "../assets/base.css"
  }
  
  render(<ProjectPage {...stat} />, `./docs/${stat.id}/index.html`, pageOptions)

  for (const subPage of stat.pages) {
    render(
      <ProjectSubpage page={subPage} metadata={stat} />, 
      `./docs/${stat.id}/${path.basename(subPage.path).replace(".md", ".html")}`, 
      pageOptions
    )
  }
}

dplLogger.info("Done :)")