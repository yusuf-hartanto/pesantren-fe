export const tableColumn = (title, key = '', align = 'left', formatter = null, sx = null, sortable = false) => {
  return {
    title: title,
    key: key,
    format: formatter,
    align: align,
    sx: sx,
    sortable: sortable
  }
}

export const formatThousand = (row, value) => {
  return Number(value).toLocaleString()
}
