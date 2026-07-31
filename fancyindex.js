(function () {
  "use strict";

  const THEME_STORAGE_KEY = "fancyindex-theme";
  const ITEMS_PER_PAGE = 100;

  const form = document.querySelector(".directory-controls form");
  const input = document.getElementById("search");
  const themeToggle = document.querySelector(".theme-toggle");
  const resultsStatus = document.querySelector(".results-status");
  const body = document.body;
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  const table = document.querySelector("#list");
  const tbody = table?.querySelector("tbody");

  const themeOptions = ["auto", "light", "dark"];
  let currentThemeIndex = 0;

  function updateThemeButton() {
    if (!themeToggle) return;

    const theme = themeOptions[currentThemeIndex];
    const labels = { auto: "Auto", light: "Light", dark: "Dark" };
    themeToggle.textContent = labels[theme];
    themeToggle.setAttribute("data-theme", theme);
    themeToggle.setAttribute(
      "aria-label",
      `Theme: ${labels[theme]}. Change theme`,
    );
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      currentThemeIndex = (currentThemeIndex + 1) % themeOptions.length;
      const theme = themeOptions[currentThemeIndex];
      storeTheme(theme);
      applyTheme(theme);
      updateThemeButton();
    });
  }

  function updateBreadcrumbs() {
    const breadcrumbNav = document.querySelector(".breadcrumb-nav");
    if (!breadcrumbNav) return;

    let breadcrumbList = breadcrumbNav.querySelector(".breadcrumb");
    if (!breadcrumbList) {
      breadcrumbList = document.createElement("ol");
      breadcrumbList.className = "breadcrumb";
      breadcrumbNav.prepend(breadcrumbList);
    }
    breadcrumbList.replaceChildren();

    const rootLi = document.createElement("li");
    const rootLink = document.createElement("a");
    rootLink.href = "/";
    rootLink.textContent = "Root";
    rootLi.appendChild(rootLink);
    breadcrumbList.appendChild(rootLi);

    const encodedParts = window.location.pathname.split("/").filter(Boolean);
    const decodedParts = encodedParts.map((part) => {
      try {
        return decodeURIComponent(part);
      } catch {
        return part;
      }
    });

    // Path
    if (encodedParts.length) {
      let currentPath = "/";

      decodedParts.forEach((part, index) => {
        currentPath += `${encodedParts[index]}/`;
        const li = document.createElement("li");

        if (index === decodedParts.length - 1) {
          li.textContent = part;
          li.setAttribute("aria-current", "page");
          li.className = "breadcrumb-current";
        } else {
          const link = document.createElement("a");
          link.href = currentPath;
          link.textContent = part;
          li.appendChild(link);
        }

        breadcrumbList.appendChild(li);
      });
    } else {
      rootLink.setAttribute("aria-current", "page");
    }
  }

  updateBreadcrumbs();

  const copyBtn = document.querySelector(".copy-page-url-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const url = window.location.href;
      const originalText = copyBtn.textContent;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(url);
        } else {
          // https://stackoverflow.com/a/33928558
          const textarea = document.createElement("textarea");
          textarea.value = url;
          document.body.appendChild(textarea);
          try {
            textarea.select();
            textarea.setSelectionRange(0, textarea.value.length);
            if (!document.execCommand("copy")) throw new Error("Copy failed");
          } finally {
            textarea.remove();
          }
        }
        copyBtn.textContent = "Copied!";
      } catch {
        copyBtn.textContent = "Failed";
      } finally {
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      }
    });
  }

  const listItems = tbody ? Array.from(tbody.querySelectorAll("tr")) : [];
  const parentItems = listItems.filter((item) =>
    item.classList.contains("parent"),
  );
  const contentItems = listItems.filter(
    (item) => !item.classList.contains("parent"),
  );
  let filteredItems = [...contentItems];
  let currentPage = 1;

  function createPagination() {
    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    if (totalPages <= 1) return null;

    const paginationDiv = document.createElement("div");
    paginationDiv.className = "pagination";
    paginationDiv.setAttribute("role", "navigation");
    paginationDiv.setAttribute("aria-label", "Pagination");

    const info = document.createElement("span");
    info.className = "pagination-info";
    const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const end = Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length);
    info.textContent = `Showing ${start}–${end} of ${filteredItems.length}`;
    paginationDiv.appendChild(info);

    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "pagination-buttons";

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "← Previous";
    prevBtn.className = "pagination-btn";
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderPage({ shouldScroll: true });
      }
    });
    buttonsDiv.appendChild(prevBtn);

    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    if (endPage - startPage < maxButtons - 1)
      startPage = Math.max(1, endPage - maxButtons + 1);

    if (startPage > 1) {
      buttonsDiv.appendChild(createPageButton(1));
      if (startPage > 2) buttonsDiv.appendChild(makeEllipsis());
    }

    for (let i = startPage; i <= endPage; i++)
      buttonsDiv.appendChild(createPageButton(i));

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) buttonsDiv.appendChild(makeEllipsis());
      buttonsDiv.appendChild(createPageButton(totalPages));
    }

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next →";
    nextBtn.className = "pagination-btn";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderPage({ shouldScroll: true });
      }
    });
    buttonsDiv.appendChild(nextBtn);

    paginationDiv.appendChild(buttonsDiv);
    return paginationDiv;
  }

  function makeEllipsis() {
    const el = document.createElement("span");
    el.textContent = "...";
    el.className = "pagination-ellipsis";
    return el;
  }

  function createPageButton(pageNum) {
    const btn = document.createElement("button");
    btn.textContent = pageNum;
    btn.className = "pagination-btn";
    if (pageNum === currentPage) {
      btn.classList.add("active");
      btn.setAttribute("aria-current", "page");
    }
    btn.addEventListener("click", () => {
      currentPage = pageNum;
      renderPage({ shouldScroll: true });
    });
    return btn;
  }

  function renderPage({ shouldScroll = false } = {}) {
    if (!tbody) return;

    listItems.forEach((item) => (item.style.display = "none"));
    parentItems.forEach((item) => {
      item.hidden = false;
      item.style.display = "";
    });

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageItems = filteredItems.slice(start, start + ITEMS_PER_PAGE);
    pageItems.forEach((item) => {
      if (!item.hidden) item.style.display = "";
    });

    const existingPagination = table?.parentNode.querySelector(".pagination");
    if (existingPagination) existingPagination.remove();

    if (filteredItems.length > ITEMS_PER_PAGE) {
      const pagination = createPagination();
      if (pagination && table) table.after(pagination);
    }

    if (resultsStatus) {
      const query = input?.value.trim();
      resultsStatus.textContent = query
        ? filteredItems.length
          ? `${filteredItems.length} matching item${filteredItems.length === 1 ? "" : "s"}`
          : "No matching items"
        : "";
    }

    if (shouldScroll) {
      window.scrollTo({
        top: 0,
        behavior: reducedMotionQuery.matches ? "auto" : "smooth",
      });
    }
  }

  let searchTimeout;
  if (form) {
    form.addEventListener("submit", (event) => event.preventDefault());
  }

  input?.addEventListener(
    "input",
    function () {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const searchValue = this.value.trim();

        if (!searchValue) {
          filteredItems = [...contentItems];
          contentItems.forEach((item) => (item.hidden = false));
          currentPage = 1;
          renderPage();
          return;
        }

        const terms = searchValue.toLocaleLowerCase().split(/\s+/);

        filteredItems = contentItems.filter((item) => {
          const text =
            item.querySelector("td")?.textContent.replace(/\s+/g, " ") || "";
          const normalizedText = text.toLocaleLowerCase();
          const matches = terms.every((term) => normalizedText.includes(term));
          item.hidden = !matches;
          return matches;
        });

        currentPage = 1;
        renderPage();
      }, 150);
    },
    { passive: true },
  );

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) || "auto";
    } catch {
      return "auto";
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* storage not available */
    }
  }

  function applyTheme(theme) {
    const actualTheme =
      theme === "auto" ? (mediaQuery.matches ? "dark" : "light") : theme;

    if (theme === "auto") {
      mediaQuery.addEventListener("change", handleSystemThemeChange);
    } else {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    }

    body.classList.remove("theme-light", "theme-dark");
    body.classList.add(`theme-${actualTheme}`);
  }

  function handleSystemThemeChange() {
    if (getStoredTheme() === "auto") applyTheme("auto");
  }

  // Initialize theme
  const savedTheme = getStoredTheme();
  const storedTheme = themeOptions.includes(savedTheme) ? savedTheme : "auto";
  if (storedTheme !== savedTheme) storeTheme(storedTheme);
  currentThemeIndex = themeOptions.indexOf(storedTheme);
  if (currentThemeIndex === -1) currentThemeIndex = 0;
  applyTheme(storedTheme);
  updateThemeButton();

  document.addEventListener("keydown", (event) => {
    const active = document.activeElement;
    const isTyping =
      active &&
      (active.tagName === "INPUT" ||
        active.tagName === "TEXTAREA" ||
        active.isContentEditable);

    if (
      input &&
      (event.key === "/" || (event.ctrlKey && event.key === "f")) &&
      !isTyping
    ) {
      event.preventDefault();
      input.focus();
      input.select();
      return;
    }

    if (input && event.key === "Escape" && active === input) {
      event.preventDefault();
      input.value = "";
      input.dispatchEvent(new Event("input"));
      input.blur();
      return;
    }

    if (themeToggle && event.key === "t" && !isTyping) {
      event.preventDefault();
      themeToggle.click();
      return;
    }
  });

  // Initial render
  renderPage();
})();
