/* Shared site behaviour: navigation, footer year, portrait fallback. */
(function () {
  "use strict";

  function initNavigation() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("primary-nav");

    if (!toggle || !nav) {
      return;
    }

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      nav.classList.toggle("is-open", open);
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (
        toggle.getAttribute("aria-expanded") === "true" &&
        !nav.contains(event.target) &&
        !toggle.contains(event.target)
      ) {
        setOpen(false);
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 960) {
        setOpen(false);
      }
    });
  }

  function initYear() {
    var year = String(new Date().getFullYear());
    document.querySelectorAll("[data-current-year]").forEach(function (node) {
      node.textContent = year;
    });
  }

  function initPortraitFallback() {
    var portrait = document.querySelector("[data-portrait]");
    if (!portrait) {
      return;
    }

    var image = portrait.querySelector("img");
    if (!image) {
      return;
    }

    function showFallback() {
      portrait.classList.add("is-fallback");
    }

    if (image.complete && image.naturalWidth === 0) {
      showFallback();
    }

    image.addEventListener("error", showFallback);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNavigation();
    initYear();
    initPortraitFallback();
  });
})();
