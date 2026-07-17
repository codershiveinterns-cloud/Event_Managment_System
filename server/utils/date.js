function calculateInclusiveDays(fromDate, toDate) {
  const from = new Date(fromDate)
  const to = new Date(toDate)

  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return 0
  }

  const start = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())
  const end = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate())
  const diff = end - start

  if (diff < 0) {
    return 0
  }

  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1
}

module.exports = { calculateInclusiveDays }
