export function generateRandomString() {
  return ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
}
