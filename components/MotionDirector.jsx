"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * One motion system for the whole page. The previous effects were local to
 * each component; this director gives the page a continuous, cinematic rhythm.
 */
export default function MotionDirector() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    const cleanups = [];
    const ctx = gsap.context(() => {
      // Global progress drives the ambient lines and lighting in CSS.
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) =>
          document.documentElement.style.setProperty("--page-progress", self.progress.toFixed(4)),
      });

      // The opening scene recedes as the next chapter arrives.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#hero-section",
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        })
        .to(".hero-content", { yPercent: 22, scale: 0.93, opacity: 0.18, ease: "none" }, 0)
        .to(".hero-foot", { y: 45, opacity: 0, ease: "none" }, 0)
        .to(".hero-stage-line", { scaleX: 0.2, opacity: 0, ease: "none" }, 0);

      gsap.to(".about-ghost", {
        xPercent: -18,
        ease: "none",
        scrollTrigger: { trigger: "#sobre", start: "top bottom", end: "bottom top", scrub: 1 },
      });

      // Section headings move like editorial title cards rather than generic fades.
      gsap.utils.toArray("section:not(.hero) h2").forEach((heading) => {
        gsap.fromTo(
          heading,
          { yPercent: 32, skewY: 2.5, opacity: 0 },
          {
            yPercent: 0,
            skewY: 0,
            opacity: 1,
            duration: 1.15,
            ease: "expo.out",
            scrollTrigger: { trigger: heading, start: "top 88%", toggleActions: "play none none reverse" },
          }
        );
      });

      // Services arrive from alternating depths and gently settle while scrolling.
      gsap.utils.toArray(".solution-card").forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            xPercent: desktop ? (index % 2 ? 8 : -8) : 0,
            y: 80,
            rotateX: desktop ? 8 : 0,
            scale: 0.94,
            opacity: 0,
          },
          {
            xPercent: 0,
            y: 0,
            rotateX: 0,
            scale: 1,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 92%",
              end: "top 58%",
              scrub: 0.7,
            },
          }
        );

        gsap.to(card.querySelector(".solution-dots"), {
          xPercent: -18,
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 1.1 },
        });
      });

      // The process reads as one sequence, not four unrelated boxes.
      if (desktop) {
        const processCards = gsap.utils.toArray(".process-card");
        gsap.fromTo(
          processCards,
          { y: 90, rotateY: -8, opacity: 0, transformOrigin: "left center" },
          {
            y: 0,
            rotateY: 0,
            opacity: 1,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: ".process-grid", start: "top 86%", end: "center 58%", scrub: 0.6 },
          }
        );
      }

      // Portrait and work media get depth without changing page structure.
      gsap.fromTo(
        ".avatar img",
        { scale: 1.16, yPercent: -4 },
        {
          scale: 1.03,
          yPercent: 5,
          ease: "none",
          scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: 1 },
        }
      );

      const preparedCards = new WeakSet();
      const prepareWorkCard = (card, index) => {
        if (preparedCards.has(card)) return;
        preparedCards.add(card);
        gsap.fromTo(
          card,
          { y: 70 + (index % 3) * 24, opacity: 0, scale: 0.94 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 94%", end: "top 68%", scrub: 0.55 },
          }
        );

        const media = card.querySelector(".thumb");
        if (media) {
          gsap.fromTo(media, { yPercent: -4, scale: 1.08 }, {
            yPercent: 4,
            scale: 1.01,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 1 },
          });
        }

        if (desktop && finePointer) {
          const project = card.querySelector(".project");
          const onMove = (event) => {
            const rect = card.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width - 0.5;
            const py = (event.clientY - rect.top) / rect.height - 0.5;
            gsap.to(project, {
              rotateY: px * 9,
              rotateX: py * -7,
              x: px * 6,
              y: py * 5 - 4,
              duration: 0.55,
              ease: "power2.out",
              transformPerspective: 900,
              transformOrigin: "center",
            });
          };
          const onLeave = () => gsap.to(project, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.8, ease: "elastic.out(1,.45)" });
          card.addEventListener("pointermove", onMove);
          card.addEventListener("pointerleave", onLeave);
          cleanups.push(() => {
            card.removeEventListener("pointermove", onMove);
            card.removeEventListener("pointerleave", onLeave);
          });
        }
      };

      const prepareVisibleCards = () => {
        gsap.utils.toArray(".tilt-card").forEach((card, index) => prepareWorkCard(card, index));
        ScrollTrigger.refresh();
      };
      prepareVisibleCards();
      const workGrid = document.querySelector("#workGrid");
      const workObserver = new MutationObserver(prepareVisibleCards);
      if (workGrid) workObserver.observe(workGrid, { childList: true });
      cleanups.push(() => workObserver.disconnect());

      gsap.fromTo(
        ".cta-final .wrap",
        { scale: 0.88, opacity: 0, y: 80 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          ease: "power3.out",
          scrollTrigger: { trigger: ".cta-final", start: "top 92%", end: "center 62%", scrub: 0.7 },
        }
      );

      if (desktop && finePointer) {
        const hero = document.querySelector("#hero-section");
        const onHeroMove = (event) => {
          const x = event.clientX / window.innerWidth - 0.5;
          const y = event.clientY / window.innerHeight - 0.5;
          gsap.to(".hero-content", { x: x * -18, y: y * -10, duration: 1.2, ease: "power3.out", overwrite: "auto" });
          gsap.to(".hero-orbit", { x: x * 44, y: y * 32, rotate: x * 10, duration: 1.5, ease: "power3.out" });
        };
        const onHeroLeave = () => {
          gsap.to([".hero-content", ".hero-orbit"], { x: 0, y: 0, rotate: 0, duration: 1.2, ease: "expo.out" });
        };
        hero?.addEventListener("pointermove", onHeroMove);
        hero?.addEventListener("pointerleave", onHeroLeave);

        cleanups.push(() => {
          hero?.removeEventListener("pointermove", onHeroMove);
          hero?.removeEventListener("pointerleave", onHeroLeave);
        });
      }
    });

    ScrollTrigger.refresh();
    return () => {
      cleanups.forEach((cleanup) => cleanup());
      ctx.revert();
      document.documentElement.style.removeProperty("--page-progress");
    };
  }, []);

  return null;
}
