import { type IProjectStat, type ProjectMetadataSchema, LICENSE_REGISTRY } from "../api";

export function appendLicenceUrl(dataRef: IProjectStat, metadata: ProjectMetadataSchema) {
  dataRef.licence = metadata.licence ? metadata.licence.map(it => ({
    ...it,
    // @ts-ignore
    url: LICENSE_REGISTRY.getOrElseThrow(it.name?.toLowerCase()!),
  })) : undefined
}