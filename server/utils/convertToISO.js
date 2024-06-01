const convertToISO = (originalDateString) => {
  const originalDate = new Date(originalDateString)

  // Extracting components
  const year = originalDate.getFullYear()
  const month = String(originalDate.getMonth() + 1).padStart(2, '0') // Adding 1 since getMonth() returns 0-indexed month
  const day = String(originalDate.getDate()).padStart(2, '0')
  const hours = String(originalDate.getUTCHours()).padStart(2, '0')
  const minutes = String(originalDate.getUTCMinutes()).padStart(2, '0')
  const seconds = String(originalDate.getUTCSeconds()).padStart(2, '0')
  const milliseconds = String(originalDate.getUTCMilliseconds()).padStart(
    3,
    '0',
  )
  const offset = originalDate.toTimeString().match(/([+\-]\d{2}:?\d{2})/)[0] // Extracting timezone offset

  // Creating ISO 8601 formatted date string
  const isoDateString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offset}`

  return isoDateString
}

module.exports = convertToISO
