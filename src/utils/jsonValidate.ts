export function isValidJSONBySchema<T extends any>(input: any, thisSchema: any): input is T {
  return true
}