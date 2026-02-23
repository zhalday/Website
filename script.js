document.getElementById("year").textContent = new Date().getFullYear();

const workMarkdownContainer = document.getElementById("work-markdown-items");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const isLocalFile = window.location.protocol === "file:";
const ajaxEndpoint = "https://formsubmit.co/ajax/hello@deepfield.co.za";

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getFirstParagraph(markdown) {
  const blocks = markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  for (const block of blocks) {
    if (
      block.startsWith("#") ||
      block.startsWith("-") ||
      block.startsWith("*") ||
      block.startsWith("---")
    ) {
      continue;
    }

    return block.replace(/\n/g, " ");
  }

  return "Read the full case study.";
}

async function loadWorkMarkdown() {
  if (!workMarkdownContainer) {
    return;
  }

  try {
    const manifestResponse = await fetch("assets/work/work-items.json");
    if (!manifestResponse.ok) {
      return;
    }

    const items = await manifestResponse.json();
    if (!Array.isArray(items) || items.length === 0) {
      return;
    }

    for (const [index, item] of items.entries()) {
      if (!item || typeof item.file !== "string") {
        continue;
      }

      const markdownResponse = await fetch(item.file);
      if (!markdownResponse.ok) {
        continue;
      }

      const markdown = await markdownResponse.text();
      const headingMatch = markdown.match(/^#\s+(.+)$/m);
      const title = item.title || (headingMatch ? headingMatch[1].trim() : "Case Study");
      const excerpt = getFirstParagraph(markdown);
      const wordCount = markdown.split(/\s+/).filter(Boolean).length;
      const readMinutes = Math.max(2, Math.round(wordCount / 220));
      const renderedBody =
        typeof marked === "object" && typeof marked.parse === "function"
          ? marked.parse(markdown)
          : `<p>${escapeHtml(markdown)}</p>`;

      const card = document.createElement("article");
      card.className = "card md-work-card";
      card.dataset.variant = String((index % 4) + 1);
      card.innerHTML = `
        <p class="md-work-meta">Case Study ${index + 1} · ${readMinutes} min read</p>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(excerpt)}</p>
        <details class="md-work-details">
          <summary>Read full case study</summary>
          <div class="md-work-body">
            ${renderedBody}
            <div class="md-work-close-wrap">
              <p class="md-work-close-note">Done reading? Close this case study and continue to the next one.</p>
              <button class="md-work-close" type="button">Minimize article</button>
            </div>
          </div>
        </details>
      `;

      workMarkdownContainer.appendChild(card);
    }
  } catch (_error) {
    // Leave the section quiet if markdown loading fails.
  }
}

loadWorkMarkdown();

if (workMarkdownContainer) {
  workMarkdownContainer.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.classList.contains("md-work-close")) {
      return;
    }

    const details = target.closest(".md-work-details");
    if (details instanceof HTMLDetailsElement) {
      details.open = false;
      const summary = details.querySelector("summary");
      if (summary instanceof HTMLElement) {
        summary.focus();
      }
    }
  });
}

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
      const successFlag = payload.success;
      const isSuccess = successFlag === true || successFlag === "true";

      if (!response.ok || !isSuccess) {
        if (typeof payload.message === "string" && payload.message.length > 0) {
          throw new Error(payload.message);
        }
        throw new Error("Submission failed");
      }

      contactForm.reset();
      formStatus.textContent = "Thanks. Your message has been sent.";
    } catch (error) {
      const message = String(error?.message || "");

      // FormSubmit may require initial email verification before accepting submissions.
      if (message.toLowerCase().includes("activate")) {
        formStatus.classList.add("error");
        formStatus.textContent =
          "Please verify the FormSubmit activation email for hello@deepfield.co.za, then try again.";
      } else {
        formStatus.textContent = "Redirecting to secure form submit...";
        contactForm.submit();
        return;
      }
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
