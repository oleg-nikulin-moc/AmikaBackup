function formResize(size) {
  const popups = document.querySelectorAll(".ac-popup");
  popups.forEach((popup) => {
    if (size === "lg") {
      popup.classList.add("ac-popup--lg");
      popup.classList.remove("ac-popup--sm");
    } else if (size === "sm") {
      popup.classList.add("ac-popup--sm");
      popup.classList.remove("ac-popup--lg");
    } else {
      popup.classList.add("ac-popup--md");
      popup.classList.remove("ac-popup--lg");
      popup.classList.remove("ac-popup--sm");
    }
  });
}
function showSpinner() {
  const spinner = document.querySelector("[data-spinner-wrap]");
  if (spinner) {
    spinner.style.display = "block";
  }
}

function hideSpinner() {
  const spinner = document.querySelector("[data-spinner-wrap]");
  if (spinner) {
    spinner.style.display = "none";
  }
}

function initializeDropdown(dropdownElement) {
  const dropdownToggleBtns = dropdownElement.querySelectorAll(
    "[data-dropdown-toggle]"
  );
  const dropdownMenu = dropdownElement.querySelector("[data-dropdown-menu]");
  dropdownToggleBtns.forEach((dropdownToggle) => {
    const dropdownMenu = document.querySelector(
      `[data-dropdown-menu="${dropdownToggle.dataset.dropdownToggle}"]`
    );
    const closeButton = dropdownMenu.querySelector("[data-dropdown-close]");

    dropdownToggle.addEventListener("click", () => {
      dropdownMenu.classList.toggle("active");
    });

    closeButton.addEventListener("click", () => {
      dropdownMenu.classList.remove("active");
    });
  });
}
