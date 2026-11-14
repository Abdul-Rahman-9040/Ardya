import React, { useEffect, useRef } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const elements = container.querySelectorAll<HTMLElement>(
      "section:not([data-no-scroll-reveal]), [data-scroll-reveal]"
    );

    if (!("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
    );

    elements.forEach((element) => {
      element.classList.add("scroll-reveal");
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return <div ref={containerRef} className="contents">{children}</div>;
};
