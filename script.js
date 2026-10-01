/* =========================================================
   PORTOFOLIO — Mua'az Al Farizi
   ========================================================= */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Tahun footer ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar scroll state ---------- */
  const navbar = $("#navbar");
  const toTop = $("#toTop");

  function onScroll() {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle("scrolled", y > 30);
    if (toTop) toTop.classList.toggle("show", y > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })
    );
  }

  /* ---------- Mobile menu ---------- */
  const hamburger = $("#hamburger");
  const navLinks = $("#navLinks");

  function closeMenu() {
    hamburger?.classList.remove("open");
    navLinks?.classList.remove("open");
    hamburger?.setAttribute("aria-expanded", "false");
  }

  hamburger?.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    hamburger.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", String(open));
  });

  $$(".nav-link").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("click", (e) => {
    if (!navLinks?.classList.contains("open")) return;
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
  });

  /* ---------- Active nav link saat scroll ---------- */
  const sections = $$("main section[id]");
  const linkMap = {};
  $$(".nav-link").forEach((l) => (linkMap[l.getAttribute("href").slice(1)] = l));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        Object.values(linkMap).forEach((l) => l.classList.remove("active"));
        linkMap[id]?.classList.add("active");
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        setTimeout(() => el.classList.add("visible"), reduceMotion ? 0 : i * 80);
        obs.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  $$(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- Typewriter ---------- */
  const roles = [
    "Network Engineer",
    "Linux System Administrator",
    "Web Developer",
    "IT Infrastructure Enthusiast",
  ];
  const tw = $("#typewriter");

  function typewriter() {
    if (!tw) return;
    if (reduceMotion) {
      tw.textContent = roles[0];
      return;
    }
    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;

    (function tick() {
      const current = roles[roleIdx];
      charIdx += deleting ? -1 : 1;
      tw.textContent = current.slice(0, charIdx);

      let delay = deleting ? 45 : 95;
      if (!deleting && charIdx === current.length) {
        delay = 1800;
        deleting = true;
      } else if (deleting && charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        delay = 350;
      }
      setTimeout(tick, delay);
    })();
  }
  typewriter();

  /* ---------- Terminal berjalan ---------- */
  const term = $("#terminalBody");
  const lines = [
    { cls: "t-cmd", text: "whoami" },
    { cls: "", text: "muaz — Network &amp; Linux Engineer" },
    { cls: "t-cmd", text: "cat skills.txt" },
    { cls: "t-ok", text: "✓ Jaringan Komputer" },
    { cls: "t-ok", text: "✓ Administrasi Linux" },
    { cls: "t-ok", text: "✓ Web Development" },
    { cls: "t-cmd", text: "ping -c 3 portfolio.local" },
    { cls: "t-dim", text: "64 bytes: time=12ms ttl=63" },
    { cls: "t-dim", text: "64 bytes: time=11ms ttl=63" },
    { cls: "t-ok", text: "3 packets transmitted, 3 received, 0% loss" },
    { cls: "t-cmd", text: "./deploy --production" },
    { cls: "t-warn", text: "Build succeeded → site is live 🚀" },
  ];

  function runTerminal() {
    if (!term) return;
    if (reduceMotion) {
      term.innerHTML = lines
        .map((l) => `<div class="${l.cls}">${l.text}</div>`)
        .join("");
      return;
    }
    let i = 0;
    (function next() {
      if (i >= lines.length) {
        setTimeout(() => {
          term.innerHTML = "";
          i = 0;
          next();
        }, 3500);
        return;
      }
      const line = lines[i++];
      const div = document.createElement("div");
      div.className = line.cls;
      div.innerHTML = line.text;
      div.style.opacity = "0";
      term.appendChild(div);
      requestAnimationFrame(() => {
        div.style.transition = "opacity .3s ease";
        div.style.opacity = "1";
      });
      if (term.children.length > 12) term.removeChild(term.firstChild);
      setTimeout(next, line.cls === "t-cmd" ? 620 : 400);
    })();
  }
  runTerminal();

  /* ---------- Counter animasi ---------- */
  const counters = $$("[data-count]");
  const countObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10) || 0;

        if (reduceMotion) {
          el.textContent = target;
        } else {
          const dur = 1400;
          const start = performance.now();
          (function step(now) {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased);
            if (p < 1) requestAnimationFrame(step);
          })(start);
        }
        obs.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((c) => countObserver.observe(c));

  /* ---------- Progress bar skills ---------- */
  const bars = $$(".skill-bar");
  const barObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const bar = entry.target;
        const level = parseInt(bar.dataset.level, 10) || 0;
        const fill = $(".skill-fill", bar);
        const value = $(".skill-value", bar);
        if (fill) fill.style.width = level + "%";
        if (value && !reduceMotion) {
          let n = 0;
          const stepSize = Math.max(1, Math.round(level / 40));
          const t = setInterval(() => {
            n += stepSize;
            if (n >= level) {
              n = level;
              clearInterval(t);
            }
            value.textContent = n + "%";
          }, 30);
        } else if (value) {
          value.textContent = level + "%";
        }
        obs.unobserve(bar);
      });
    },
    { threshold: 0.5 }
  );
  bars.forEach((b) => barObserver.observe(b));

  /* ---------- Filter proyek ---------- */
  const filterBtns = $$(".filter-btn");
  const cards = $$(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;

      cards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("hidden", !match);
        if (match) {
          card.classList.remove("visible");
          requestAnimationFrame(() => card.classList.add("visible"));
        }
      });
    });
  });

  /* ---------- Form kontak ---------- */
  const form = $("#contactForm");
  const status = $("#formStatus");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fields = $$("#name, #email, #subject, #message", form);
    let valid = true;

    fields.forEach((f) => {
      const empty = !f.value.trim();
      const badEmail = f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value);
      const invalid = empty || badEmail;
      f.classList.toggle("error", invalid);
      if (invalid) valid = false;
    });

    if (!valid) {
      status.textContent = "Mohon lengkapi kolom yang masih kosong atau format email belum benar.";
      status.className = "form-status bad";
      return;
    }

    const btn = $("button[type=submit]", form);
    const original = btn.textContent;
    btn.textContent = "Mengirim...";
    btn.disabled = true;

    setTimeout(() => {
      status.textContent = "Pesan terkirim! Terima kasih, saya akan segera membalas.";
      status.className = "form-status ok";
      form.reset();
      btn.textContent = original;
      btn.disabled = false;
    }, 1200);
  });

  $$("#contactForm input, #contactForm textarea").forEach((f) =>
    f.addEventListener("input", () => f.classList.remove("error"))
  );

  /* ---------- Efek parallax ringan pada ornamen hero ---------- */
  if (!reduceMotion) {
    const orbs = $$(".orb");
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        if (y > window.innerHeight) return;
        orbs.forEach((orb, i) => {
          orb.style.translate = `0 ${y * (0.08 + i * 0.05)}px`;
        });
      },
      { passive: true }
    );
  }
})();
