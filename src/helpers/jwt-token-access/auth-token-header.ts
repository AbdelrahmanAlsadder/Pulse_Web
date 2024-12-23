// This function returns an object containing the Authorization header
// with a valid access token if it exists in sessionStorage, otherwise it returns an empty object.
export default function authHeader() {
  // Retrieve the 'authUser' object from sessionStorage, which contains user details
  const obj = JSON.parse(sessionStorage.getItem("authUser") || "")

  // Check if the 'authUser' object exists and contains an access token
  if (obj && obj.accessToken) {
    // Return the Authorization header with the access token if it exists
    return { Authorization: obj.accessToken }
  } else {
    // If the access token is not found, return an empty object
    return {}
  }
}
