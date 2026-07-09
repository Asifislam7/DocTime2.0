"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Calendar,
  Stethoscope,
  Shield,
  Clock,
  Bot,
} from "lucide-react";
import {
  STATS,
  CARE_INTENTS,
  SPECIALTIES,
  VALUE_PROPS,
  QUICK_LINKS,
  TESTIMONIAL,
} from "./constants";

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedLanding() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".dt-reveal-hero > *", {
        y: 48,
        opacity: 0,
        duration: 1,
        stagger: 0.14,
        ease: "power3.out",
        delay: 0.1,
      });

      gsap.utils.toArray<HTMLElement>(".dt-animate-section").forEach((section) => {
        const items = section.querySelectorAll(".dt-reveal-item");
        if (!items.length) return;

        gsap.from(items, {
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          y: 36,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const featureIcons = [Stethoscope, Clock, Shield, Bot];

  return (
    <div ref={rootRef} className="dt-home">
      {/* Hero */}
      <section className="dt-hero">
        <div className="dt-hero__glow" aria-hidden="true" />
        <div className="dt-container dt-reveal-hero">
          <p className="dt-label">DocTime Healthcare</p>
          <h1 className="dt-hero__title">
            Healthcare that evolves
            <span className="dt-hero__title-accent">with you</span>
          </h1>
          <p className="dt-hero__lead">
            More than appointments — seamless scheduling, secure records, and
            care that adapts to your life.
          </p>
          <div className="dt-hero__cta">
            <Link href="/appointment" className="dt-btn-primary">
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="#services" className="dt-btn-ghost">
              Explore services
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="dt-stats dt-animate-section">
        <div className="dt-container">
          <p className="dt-stats__label dt-reveal-item">Trusted by patients across the region</p>
          <div className="dt-stats__grid">
            {STATS.map((stat) => (
              <div key={stat.label} className="dt-reveal-item">
                <div className="dt-stat__number">{stat.value}</div>
                <div className="dt-stat__label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="dt-mission dt-animate-section">
        <div className="dt-container">
          <div className="dt-mission__inner dt-reveal-item">
            <p className="dt-mission__eyebrow">
              Care that remembers you
            </p>
            <p className="dt-mission__text">
              In a world where healthcare often feels fragmented, we believe the
              most important thing is giving you <strong>control over your health
              journey</strong> — to book when you need, access records when you
              want, and connect with specialists who truly understand you.
            </p>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="dt-section dt-animate-section">
        <div className="dt-container">
          <div className="dt-section-header dt-reveal-item">
            <h2 className="dt-section-title">Built for modern care</h2>
            <p className="dt-section-lead">
              Everything you need to manage your health — in one place.
            </p>
          </div>
          <div className="dt-feature-grid">
            {VALUE_PROPS.map((item, i) => {
              const Icon = featureIcons[i] ?? Stethoscope;
              return (
                <article key={item.title} className="dt-feature-card dt-reveal-item">
                  <div className="dt-feature-card__icon">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Care intents */}
      <section className="dt-section dt-section--surface dt-animate-section">
        <div className="dt-container">
          <div className="dt-section-header dt-reveal-item">
            <h2 className="dt-section-title">How can we help?</h2>
          </div>
          <div className="dt-intent-grid">
            {CARE_INTENTS.map((intent) => (
              <article key={intent.title} className="dt-intent-card dt-reveal-item">
                <h3 className="dt-intent-card__title">{intent.title}</h3>
                <ul className="dt-intent-card__links">
                  {intent.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="dt-intent-link">
                        {link.label}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section id="services" className="dt-section dt-animate-section">
        <div className="dt-container">
          <div className="dt-section-header dt-reveal-item">
            <h2 className="dt-section-title">Expert care in every specialty</h2>
            <Link href="/appointment" className="dt-text-link">
              See all specialties <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="dt-specialty-grid">
            {SPECIALTIES.map((spec) => (
              <Link
                key={spec.name}
                href="/appointment"
                className="dt-specialty-card dt-reveal-item"
              >
                <div className="dt-specialty-card__image">
                  <Image
                    src={spec.image}
                    alt={spec.name}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 50vw, 200px"
                  />
                </div>
                <span className="dt-specialty-card__name">{spec.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="dt-testimonial dt-section--surface dt-animate-section">
        <div className="dt-container">
          <blockquote className="dt-testimonial__quote dt-reveal-item">
            &ldquo;{TESTIMONIAL.quote}&rdquo;
          </blockquote>
          <div className="dt-testimonial__author dt-reveal-item">
            <strong>{TESTIMONIAL.author}</strong>
            {TESTIMONIAL.role}
          </div>
        </div>
      </section>

      {/* Value props split */}
      <section className="dt-section dt-animate-section">
        <div className="dt-container">
          <div className="dt-split-layout">
            <div className="dt-split-layout__content dt-reveal-item">
              <h2 className="dt-section-title">Our doctors specialize in you</h2>
              <p className="dt-section-lead" style={{ marginTop: "1rem", marginBottom: "2rem" }}>
                At DocTime, you get access to trusted specialists, seamless
                scheduling, and tools that put your health journey in your hands.
              </p>
              <Link href="/about" className="dt-btn-accent">
                About DocTime
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="dt-value-grid">
              {VALUE_PROPS.map((item, i) => {
                const icons = [Stethoscope, Calendar, Shield, Bot];
                const Icon = icons[i] ?? Stethoscope;
                return (
                  <article key={item.title} className="dt-value-card dt-reveal-item">
                    <div className="dt-value-card__icon">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="dt-banner dt-animate-section">
        <div className="dt-banner__bg" aria-hidden="true" />
        <div className="dt-container dt-banner__content dt-reveal-item">
          <h2>World-class medicine. Compassionate care.</h2>
          <p>Schedule your next visit with a DocTime specialist today.</p>
          <Link href="/appointment" className="dt-btn-primary">
            Request appointment
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Quick links */}
      <section className="dt-section dt-animate-section">
        <div className="dt-container">
          <h2 className="dt-section-title dt-reveal-item" style={{ marginBottom: "2rem" }}>
            I want to…
          </h2>
          <div className="dt-quick-grid">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="dt-quick-link dt-reveal-item"
              >
                {link.label}
                <ArrowRight className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
