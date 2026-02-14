document.getElementById("year").textContent = new Date().getFullYear();

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const isLocalFile = window.location.protocol === "file:";
const ajaxEndpoint = "https://formsubmit.co/ajax/hello@deepfield.co.za";

if (contactForm && formStatus && !isLocalFile) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    formStatus.classList.remove("error");
    formStatus.textContent = "Submitting your message...";

    try {
      const response = await fetch(ajaxEndpoint, {
        method: "POST",
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json",
        },
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || payload.success === "false") {
        throw new Error("Submission failed");
      }

      contactForm.reset();
      formStatus.textContent = "Thanks. Your message has been sent.";
    } catch (error) {
      formStatus.classList.add("error");
      formStatus.textContent =
        "We could not send your message right now. Please email hello@deepfield.co.za.";
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Send";
      }
    }
  });
}

if (contactForm && formStatus && isLocalFile) {
  formStatus.textContent = "Local preview mode: submitting will open FormSubmit in a new page.";
}
