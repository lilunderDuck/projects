import path from "node:path"
// ...
import { dumpCSS, HASH_RANDOMIZER, minifyCSSFromFile, render, type IRenderHtmlOption } from "./core"
import { CURRENT_BUILD_DATE, ProjectType, type AnyProjectStat } from "./api"
// ...
import HomePage, { HOME_PAGE_CLASSES } from "./page"
import ProjectPage from "./page/project"
import ProjectSubpage from "./page/project-subpage"
// ...
import { copyDir, ensureDirExist, formatPath } from "./utils"
import "./codeBlockBootstrap"
import { LOGGER, ProjectLoader } from "./project-discovery"

export const GLOBAL_PROJECT_PAGE_INLINE_PADDING = HASH_RANDOMIZER.next()
export const HOME_PAGE_TITLE_HEADER = HASH_RANDOMIZER.next()
export const HOME_PAGE_TITLE_WRAPPER_HEADER = HASH_RANDOMIZER.next()

const GLOBAL_STYLE = `
  @keyframes dot_grid_move {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 40px -40px;
    }
  }

  @keyframes cube__spinningAnimation {
    0% {
      transform: rotateX(-20deg) rotateY(20deg);
    }

    100% {
      transform: rotateX(-20deg) rotateY(740deg);
    }
  }

  @media screen and (max-width: 920px) {
    pre {
      word-break: break-all;
    }
  }

  .${GLOBAL_PROJECT_PAGE_INLINE_PADDING} { padding-inline: 4rem; }
  .${HOME_PAGE_TITLE_HEADER} {
    font-size: 3.5rem;
  }

  @media screen and (max-width: 820px) {
    .${GLOBAL_PROJECT_PAGE_INLINE_PADDING} { padding-inline: 1rem; }
    .${HOME_PAGE_TITLE_WRAPPER_HEADER} {
      padding-inline: 20px;
    }
  }

  @media screen and (max-width: 750px) {
    .${HOME_PAGE_TITLE_HEADER} {
      font-size: 2.5rem;
    }
  }
`

const loader = new ProjectLoader("D:/projects")
await loader.scanForCandidate()

const renderPage = async(metadata: AnyProjectStat, baseGroupId = '') => {
  const outputFolder = `./docs${baseGroupId}/${metadata.id}`
  console.log('id', metadata.id, "parent of", baseGroupId === "" ? "<root>" : baseGroupId, outputFolder)

  if (metadata.assetsPath) {
    LOGGER.info("Copy assets from", formatPath(metadata.assetsPath))
    copyDir(metadata.assetsPath, `${outputFolder}/assets`)
  }
  
  const PAGE_OPTIONS = { basePath: ".." } as IRenderHtmlOption
  if (baseGroupId !== "") {
    PAGE_OPTIONS.basePath = "../.."
  }

  for (const subPage of metadata.pages) {
    const PAGE_FILE_NAME = path.basename(subPage.path).replace(".md", ".html")
    await render(
      <ProjectSubpage page={subPage} metadata={metadata} />, 
      `${outputFolder}/${PAGE_FILE_NAME}`, 
      PAGE_OPTIONS
    )
  }

  if (metadata.projectType === ProjectType.GROUP) {
    for (const subProject of metadata.projects) {
      await renderPage(subProject, `/${metadata.id}`)
    }
  }
  
  await render(<ProjectPage {...metadata} />, `${outputFolder}/index.html`, PAGE_OPTIONS)
}

for (const metadata of loader.CANDIDATE) {
  await renderPage(metadata)
}

await render((
  <HomePage 
    buildDate={CURRENT_BUILD_DATE} 
    projectList={loader.CANDIDATE}
  />
), "./docs/index.html", { bodyClass: HOME_PAGE_CLASSES })

dumpCSS("./docs/assets", GLOBAL_STYLE)
minifyCSSFromFile("./src/assets/base.css", "./docs/assets/base.css")