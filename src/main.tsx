import { render } from "../core"
import { CURRENT_BUILD_DATE } from "./data"
import HomePage from "./page"
// import ProjectPage from "./page/project"

render(<HomePage buildDate={CURRENT_BUILD_DATE} />, "./docs/index.html")
// render(<ProjectPage />, "./")