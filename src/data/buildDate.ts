const dateFormatter = new Intl.DateTimeFormat("default", {
  day: "2-digit",
  month: "short",
  year: "numeric"
})

export const CURRENT_BUILD_DATE = dateFormatter.format(new Date())