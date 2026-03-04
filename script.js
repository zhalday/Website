document.getElementById("year").textContent = new Date().getFullYear();

const workMarkdownContainer = document.getElementById("work-markdown-items");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const isLocalFile = window.location.protocol === "file:";
const ajaxEndpoint = "https://formsubmit.co/ajax/hello@deepfield.co.za";
const serviceToggles = Array.from(document.querySelectorAll(".service-toggle"));

function setServiceToggleState(toggle, expanded) {
  toggle.setAttribute("aria-expanded", String(expanded));

  const parentCard = toggle.closest(".service-card");
  if (parentCard instanceof HTMLElement) {
    parentCard.classList.toggle("is-open", expanded);
  }
}

for (const toggle of serviceToggles) {
  setServiceToggleState(toggle, toggle.getAttribute("aria-expanded") === "true");

  toggle.addEventListener("click", () => {
    const currentlyExpanded = toggle.getAttribute("aria-expanded") === "true";
    setServiceToggleState(toggle, !currentlyExpanded);
  });
}

// ── Hero visual expand toggle ──
const heroExpandToggle = document.querySelector(".hero-visual-expand-toggle");
if (heroExpandToggle) {
  heroExpandToggle.addEventListener("click", () => {
    const expanded = heroExpandToggle.getAttribute("aria-expanded") === "true";
    heroExpandToggle.setAttribute("aria-expanded", String(!expanded));
  });
}

// ── Scroll reveal ──
const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    }
  },
  { rootMargin: "0px 0px -60px 0px", threshold: 0.08 }
);

function observeReveal(el, stagger = 0) {
  el.classList.add("reveal");
  if (stagger > 0) el.style.setProperty("--stagger", String(stagger));
  revealObserver.observe(el);
}

// Section headings, subtext, and CTA blocks
for (const el of document.querySelectorAll(".section h2, .section .sub, .section .cta")) {
  observeReveal(el);
}

// Cards within each section: staggered
for (const group of document.querySelectorAll(".section .cards")) {
  Array.from(group.querySelectorAll(":scope > .card")).forEach((card, i) => {
    observeReveal(card, i);
  });
}

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

// ── Case study modal ──
const workModal = document.getElementById("work-modal");
const modalMeta = document.getElementById("modal-meta");
const modalBody = document.getElementById("modal-body");
const workModalData = [];
let lastFocusedBtn = null;

function openWorkModal(index) {
  const data = workModalData[index];
  if (!data || !workModal || !modalMeta || !modalBody) return;
  modalMeta.textContent = data.meta;
  modalBody.innerHTML = `<div class="md-work-body">${data.body}</div>`;
  workModal.removeAttribute("hidden");
  document.body.style.overflow = "hidden";
  workModal.querySelector(".modal-close")?.focus();
}

function closeWorkModal() {
  if (!workModal) return;
  workModal.classList.add("is-closing");
  setTimeout(() => {
    workModal.setAttribute("hidden", "");
    workModal.classList.remove("is-closing");
    document.body.style.overflow = "";
    if (lastFocusedBtn instanceof HTMLElement) lastFocusedBtn.focus();
  }, 200);
}

if (workModal) {
  workModal.querySelector(".modal-backdrop")?.addEventListener("click", closeWorkModal);
  workModal.querySelector(".modal-close")?.addEventListener("click", closeWorkModal);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && workModal && !workModal.hasAttribute("hidden")) {
    closeWorkModal();
  }
});

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

      workModalData.push({ meta: `Case Study ${index + 1} · ${readMinutes} min read`, body: renderedBody });

      const card = document.createElement("article");
      card.className = "card md-work-card";
      card.dataset.variant = String((index % 4) + 1);
      card.innerHTML = `
        <p class="md-work-meta">Case Study ${index + 1} · ${readMinutes} min read</p>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(excerpt)}</p>
        <button class="md-work-open" type="button" data-index="${index}">Read case study &rarr;</button>
      `;

      workMarkdownContainer.appendChild(card);
      observeReveal(card, index);
    }
  } catch (_error) {
    // Leave the section quiet if markdown loading fails.
  }
}

loadWorkMarkdown();

if (workMarkdownContainer) {
  workMarkdownContainer.addEventListener("click", (event) => {
    const btn = event.target.closest(".md-work-open");
    if (!(btn instanceof HTMLElement)) return;
    lastFocusedBtn = btn;
    openWorkModal(Number(btn.dataset.index));
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
