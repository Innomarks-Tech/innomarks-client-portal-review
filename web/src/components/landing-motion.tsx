"use client";

import { useEffect, useState } from "react";
import styles from "@/app/landing.module.css";

const directions = ["forward", "ahead", "onward", "further"];
export function RotatingWord() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      clearInterval(timer);
      if (!preference.matches && !paused) timer = setInterval(() => {
        if (!document.hidden) setIndex((value) => (value + 1) % directions.length);
      }, 3200);
    };
    sync();
    preference.addEventListener("change", sync);
    return () => { clearInterval(timer); preference.removeEventListener("change", sync); };
  }, [paused]);
  return <em className={styles.rotatingWord}><button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? "Resume headline animation" : "Pause headline animation"}><span className="sr-only">forward.</span><span aria-hidden="true" className={styles.wordStack}>{directions.map((word, position) => <span key={word} className={styles.wordFrame} data-active={position === index}>{word}.</span>)}</span></button></em>;
}

/** Progressive enhancement: content stays readable without JS or animation support. */
export function LandingMotion() {
  useEffect(() => {
    const root = document.getElementById("main-content");
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!root || preference.matches || !("IntersectionObserver" in window)) return;
    const animations: Animation[] = [];
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (preference.matches) continue;
        const element = entry.target as HTMLElement;
        const words = element.querySelectorAll<HTMLElement>("[data-word]");
        const targets = words.length ? Array.from(words) : [element];
        targets.forEach((target, index) => {
          const direction = element.dataset.motion;
          const transform = words.length ? "translateY(16px)" : direction === "left" ? "translateX(-18px)" : direction === "right" ? "translateX(18px)" : "translateY(18px)";
          animations.push(target.animate(
            [{ opacity: 0, transform }, { opacity: 1, transform: "none" }],
            { duration: words.length ? 650 : 700, delay: words.length ? index * 65 : Number(element.dataset.delay || 0), easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" },
          ));
        });
      }
    }, { threshold: 0.12 });
    root.querySelectorAll("[data-motion]").forEach((element) => observer.observe(element));
    const stop = () => { if (preference.matches) { animations.forEach((animation) => animation.cancel()); observer.disconnect(); } };
    preference.addEventListener("change", stop);
    return () => { observer.disconnect(); animations.forEach((animation) => animation.cancel()); preference.removeEventListener("change", stop); };
  }, []);
  return null;
}

export function MotionWords({ text }: { text: string }) {
  return <>{text.split(" ").map((word, index) => <span key={index}><span data-word="" style={{ display: "inline-block" }}>{word}</span>{index < text.split(" ").length - 1 ? " " : ""}</span>)}</>;
}
