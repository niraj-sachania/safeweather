// Redirect to homepage if no query parameters
if (!window.location.search) {
  window.location.href = 'index.html';
}

// Scroll to top button visibility
window.onscroll = function () {
  const button = document.getElementById("scrollToTop");
  if (
    document.body.scrollTop > 20 ||
    document.documentElement.scrollTop > 20
  ) {
    button.style.display = "block";
  } else {
    button.style.display = "none";
  }
};

// Scroll to top function
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Make scrollToTop available globally
window.scrollToTop = scrollToTop;
