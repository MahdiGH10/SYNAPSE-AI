export function logout() {
  // Clear user-related data from localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userId");
  localStorage.removeItem("userImage");
    // Redirect to the login page
    window.location.href = "/";
}