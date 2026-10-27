(function () {
  "use strict";

  var doc = document;
  var hamburger = doc.getElementById("hamburger");
  var nav = doc.getElementById("nav");
  var overlay = doc.getElementById("overlay");
  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function closeNav() {
    if (!nav || !nav.classList.contains("show")) return;
    nav.classList.remove("show");
    if (overlay) overlay.classList.remove("active");
    if (hamburger) {
      hamburger.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    }
    doc.body.style.overflow = "";
  }

  function openNav() {
    if (!nav) return;
    nav.classList.add("show");
    if (overlay) overlay.classList.add("active");
    if (hamburger) {
      hamburger.classList.add("active");
      hamburger.setAttribute("aria-expanded", "true");
    }
    doc.body.style.overflow = "hidden";
    var firstLink = nav.querySelector("a");
    if (firstLink) firstLink.focus();
  }

  if (hamburger) {
    hamburger.addEventListener("click", function () {
      if (nav && nav.classList.contains("show")) {
        closeNav();
      } else {
        openNav();
      }
    });
  }

  if (overlay) overlay.addEventListener("click", closeNav);

  if (nav) {
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
  }

  doc.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && nav && nav.classList.contains("show")) {
      closeNav();
      if (hamburger) hamburger.focus();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 992) closeNav();
  });

  var revealItems = Array.prototype.slice.call(doc.querySelectorAll(".nbm-reveal"));
  var revealTicking = false;

  function revealInView() {
    revealTicking = false;
    var trigger = window.innerHeight * 0.92;
    revealItems.forEach(function (item) {
      if (item.classList.contains("is-visible")) return;
      if (item.getBoundingClientRect().top < trigger) {
        item.classList.add("is-visible");
      }
    });
  }

  function requestReveal() {
    if (revealTicking) return;
    revealTicking = true;
    window.requestAnimationFrame(revealInView);
  }

  if (prefersReduced) {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  } else {
    window.addEventListener("scroll", requestReveal, { passive: true });
    window.addEventListener("resize", requestReveal);
    window.addEventListener("load", requestReveal);
    window.requestAnimationFrame(revealInView);
  }

  var footerItems = Array.prototype.slice.call(doc.querySelectorAll(".footer-animate"));
  if (footerItems.length) {
    if (prefersReduced) {
      footerItems.forEach(function (item) {
        item.classList.add("show");
      });
    } else {
      window.requestAnimationFrame(function () {
        footerItems.forEach(function (item, index) {
          window.setTimeout(function () {
            item.classList.add("show");
          }, 80 + index * 70);
        });
      });
    }
  }

  var year = doc.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
