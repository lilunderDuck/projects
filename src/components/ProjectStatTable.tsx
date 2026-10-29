import { css, For, Tag } from "../core"
import { PROJECT_STATUS_REGISTRY, PROJECT_TYPE_COLOR_MAPPING, type IProjectStat } from "../data"

const table__table = css`
  width: 100%;
  font-size: 1.5rem;
  border-collapse: collapse;
`

const table__tableHead = css`
  background-color: var(--surface1);
`

const table__titleCateogry = css`
  width: 35%;
`

const table__tableBody = css`
  text-align: left;
  & > tr:nth-child(even) {
    background-color: var(--base);
  }
  
  & > tr:nth-child(odd) {
    background-color: var(--surface0);
  }

  & tr > th, & tr > td {
    padding-block: 5px;
  }
`

const table__category = css`
  padding-left: 2rem;
  vertical-align: baseline;
`

const table__licenseRow = css`
  display: inline-flex;
  gap: 10px;
  align-items: center;
`

export function ProjectStatTable(props: IProjectStat) {
  const NONE_TAG = <Tag bgColor="var(--red)">none</Tag>

  const TABLE_CATEGORY_ROW = [
    {
      name: "Kind of project",
      stuff: <Tag bgColor={PROJECT_TYPE_COLOR_MAPPING.getOrElseThrow(props.type)}>{props.type}</Tag>
    },
    {
      name: "Project status",
      stuff: <>
        <Tag bgColor={PROJECT_STATUS_REGISTRY.getOrElseThrow(props.status).color}>{props.status}</Tag>
        <p>{PROJECT_STATUS_REGISTRY.getOrElseThrow(props.status).description}</p>
      </>
    },
    {
      name: "Github url",
      stuff: props.repoUrl ? (
        <a href={props.repoUrl} target="_blank">{props.title}</a>
      ) : NONE_TAG
    },
    {
      name: "Total commit",
      stuff: props.totalCommits
    },
    {
      name: "Licence(s)",
      stuff: <For each={props.licence} fallback={NONE_TAG} children={(it, index) => (
        <p class={table__licenseRow}>
          {it.name ? <a href={it.url} target="_blank">{it.name}</a> : NONE_TAG} {it.why}
          {index < props.licence!.length - 1 ? ", " : ""}
        </p>
      )} />
    }
  ]

  return (
    <table class={table__table}>
      <thead class={table__tableHead}>
        <tr>
          <th scope="col" class={table__titleCateogry}>Category</th>
          <th scope="col">Stuff</th>
        </tr>
      </thead>
      <tbody class={table__tableBody}>
        <For each={TABLE_CATEGORY_ROW} children={it => (
          <tr>
            <th scope="row" class={table__category}>{it.name}</th>
            <td>{it.stuff}</td>
          </tr>
        )} />
      </tbody>
    </table>
  )
}