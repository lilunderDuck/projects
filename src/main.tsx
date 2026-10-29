import path from "node:path"
// ...
import { createWordSlidingRandomizer, render } from "./core"
import { CURRENT_BUILD_DATE } from "./data"
// ...
import HomePage from "./page"
import ProjectPage from "./page/project"
import ProjectSubpage from "./page/project-subpage"
// ...
import { copyDir, dplLogger, ensureDirExist } from "./utils"
import { scanForProjectCandidate } from "./projectDiscovery"
import "./codeBlockBootstrap"

const randomizer = createWordSlidingRandomizer()
export const GLOBAL_PROJECT_PAGE_INLINE_PADDING = randomizer(8)

const GLOBAL_STYLE = `
  @keyframes dot_grid_move {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 40px -40px;
    }
  }

  @media screen and (max-width: 920px) {
    pre {
      word-break: break-all;
    }
  }

  @media screen and (max-width: 650px) {
    .${GLOBAL_PROJECT_PAGE_INLINE_PADDING} { padding-inline: 2rem; }
  }

  @media screen and (min-width: 650px) {
    .${GLOBAL_PROJECT_PAGE_INLINE_PADDING} { padding-inline: 4rem; }
  }
`

const GLOBAL_PAGE_OPTIONS = { 
  title: "Duck's project index", 
  css: GLOBAL_STYLE
}

const projectCanidate = await scanForProjectCandidate("D:/projects")

dplLogger.info("begin rendering all pages...")
render((
  <HomePage 
    buildDate={CURRENT_BUILD_DATE} 
    projectList={projectCanidate} 
  />
), "./docs/index.html", GLOBAL_PAGE_OPTIONS)

for (const stat of projectCanidate) {
  const outputFolder = `./docs/${stat.id}`
  ensureDirExist(outputFolder)
  ensureDirExist(`${outputFolder}/assets`)
  if (stat.assetsPath) {
    copyDir(stat.assetsPath, `${outputFolder}/assets`)
  }

  const pageOptions = { ...GLOBAL_PAGE_OPTIONS, baseStylePath: "../assets/base.css" }
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