import Prism from "prismjs"
import loadAllLang from "prismjs/components/index"
// ...
import { dplLogger } from "./utils"

export function initPrism() {
  dplLogger.info("Loading all prism predefined langs for code highlighting...")
  loadAllLang()
  
  Prism.languages['gdscript'] = Prism.languages.extend('python', {
    keyword: /\b(?:var|const|func|void|static|extends|class|class_name|signal|enum|null|breakpoint|tool|return|else|if)\b/,
    // bool, int, float already exist in python
    builtin: /\b(?:Variant|String|Vector2|Vector2i|Vector3|Vector3i|Vector4|Vector4i|Rect2|Rect2i|AABB|Transform2D|Transform3D|Projection|Quaternion|Basis|Plane|Color|RID|NodePath|StringName|Callable|Signal|Array|Dictionary|PackedByteArray|PackedInt32Array|PackedInt64Array|PackedFloat32Array|PackedFloat64Array|PackedStringArray|PackedVector2Array|PackedVector3Array|PackedColorArray)\b/,
    // copied from python
    function: {
      pattern: /((?:^|\s)(func)[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
      lookbehind: true
    }
  })
} 