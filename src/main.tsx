import path from "node:path"
// ...
import { dumpCSS, HASH_RANDOMIZER, minifyCSSFromFile, render, type IRenderHtmlOption } from "./core"
import { CURRENT_BUILD_DATE, ProjectType } from "./api"
// ...
import HomePage, { HOME_PAGE_CLASSES } from "./page"
import ProjectPage from "./page/project"
import ProjectSubpage from "./page/project-subpage"
// ...
import { copyDir, formatPath } from "./utils"
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
await loader.render(async(metadata) => {
  const outputFolder = `./docs/${metadata.id}`
  if (metadata.assetsPath) {
    LOGGER.info("Copy assets from", formatPath(metadata.assetsPath))
    copyDir(metadata.assetsPath, `${outputFolder}/assets`)
  }
  
  const PAGE_OPTIONS = { basePath: ".." } as IRenderHtmlOption
  for (const subPage of metadata.pages) {
    const PAGE_FILE_NAME = path.basename(subPage.path).replace(".md", ".html")
    await render(
      <ProjectSubpage page={subPage} metadata={metadata} />, 
      `./docs/${metadata.id}/${PAGE_FILE_NAME}`, 
      PAGE_OPTIONS
    )
  }
  
  await render(<ProjectPage {...metadata} />, `./docs/${metadata.id}/index.html`, PAGE_OPTIONS)
})

await render((
  <HomePage 
    buildDate={CURRENT_BUILD_DATE} 
    projectList={loader.CANDIDATE}
  />
), "./docs/index.html", { bodyClass: HOME_PAGE_CLASSES })

dumpCSS("./docs/assets", GLOBAL_STYLE)
minifyCSSFromFile("./src/assets/base.css", "./docs/assets/base.css")