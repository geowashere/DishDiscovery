export const handleShowImage = (e, setShowImage) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()

    reader.onloadend = () => setShowImage(reader.result)

    reader.readAsDataURL(file)
  }
}

export const handleImageChange = (e, setImage, setShowImageError, di) => {
  const file = e.target.files[0]
  if (!file) {
    setImage(di)
    setShowImageError(null)
    return
  }
  if (
    file.type !== 'image/jpeg' &&
    file.type !== 'image/png' &&
    file.type !== 'image/jpg'
  ) {
    setImage(di)
    setShowImageError('Please upload a valid image file (jpeg, jpg, png)')
  } else if (file.size > 10 * 1024 * 1024) {
    setImage(di)
    setShowImageError('Please upload an image file less than 10MB')
  } else {
    setImage(file)
    setShowImageError(null)
  }
  e.target.value = null
}
