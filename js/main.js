/* =========================================================
   MORISHU — site behavior
   - EN / VI language toggle (persisted)
   - mobile nav
   - one orchestrated hero reveal + on-scroll reveal
   ========================================================= */
(function () {
  "use strict";

  var STORAGE_KEY = "morishu-lang";
  var html = document.documentElement;

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || "en";
  }

  function applyLang(lang) {
    html.setAttribute("lang", lang === "vi" ? "vi" : "en");
    document.querySelectorAll("[data-en]").forEach(function (el) {
      var val = lang === "vi" ? el.getAttribute("data-vi") : el.getAttribute("data-en");
      if (val !== null) el.innerHTML = val;
    });
    document.querySelectorAll("[data-en-ph]").forEach(function (el) {
      var val = lang === "vi" ? el.getAttribute("data-vi-ph") : el.getAttribute("data-en-ph");
      if (val !== null) el.setAttribute("placeholder", val);
    });
    document.querySelectorAll(".lang-switch .lang-current").forEach(function (el) {
      el.textContent = lang === "vi" ? "VI" : "EN";
    });
    document.querySelectorAll(".lang-switch").forEach(function (btn) {
      btn.setAttribute("aria-label", lang === "vi" ? "Chuyển sang tiếng Anh" : "Switch to Vietnamese");
    });
  }

  function toggleLang() {
    var next = getLang() === "vi" ? "en" : "vi";
    localStorage.setItem(STORAGE_KEY, next);
    applyLang(next);
  }

  function initLang() {
    applyLang(getLang());
    document.querySelectorAll(".lang-switch").forEach(function (btn) {
      btn.addEventListener("click", toggleLang);
    });
  }

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".main-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initReveal() {
    var targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;
    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (t) { t.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    targets.forEach(function (t) { io.observe(t); });
  }

  function initForm() {
    var form = document.querySelector(".form-card form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector("button[type='submit']");
      var lang = getLang();
      if (btn) {
        btn.textContent = lang === "vi" ? "Đã gửi — cảm ơn bạn!" : "Sent — thank you!";
        btn.disabled = true;
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLang();
    initNav();
    initReveal();
    initForm();
  });
})();
