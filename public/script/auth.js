// ===============================
// ✅ Auth Check for College Dashboard
// ===============================

// Check if the user is logged in
if (!localStorage.getItem("userPhone")) {
  // If not logged in, redirect to login page
  window.location.href = "login.html";
} else {
  console.log("✅ User is logged in:", localStorage.getItem("userPhone"));
}

// ===============================
// 🚪 Logout Functionality
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("userPhone");
      alert("👋 You have been logged out successfully!");
      window.location.href = "login.html";
    });
  }
});

// ===============================
// 🧠 Auto Display Logged-In User Info
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const userDisplay = document.getElementById("userPhone");
  if (userDisplay) {
    const userPhone = localStorage.getItem("userPhone");
    userDisplay.innerText = userPhone ? userPhone : "Guest";
  }
});
