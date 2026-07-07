"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Search,
  Calendar,
  MapPin,
  Stethoscope,
  Shield,
  Clock,
  Bot,
} from "lucide-react";
import {
  CARE_INTENTS,
  SPECIALTIES,
  VALUE_PROPS,
  QUICK_LINKS,
} from "./constants";

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedLanding() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".dt-reveal-hero > *", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.15,
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
          y: 32,
          opacity: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: "power3.out",
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="dt-home">
      {/* Hero — UCSF "Your health, our priority" */}
      <section className="dt-hero-ucsf">
        <div className="dt-hero-ucsf__bg" aria-hidden="true" />
        <div className="dt-container dt-reveal-hero">
          <p className="dt-eyebrow">DocTime Healthcare</p>
          <h1 className="dt-hero-ucsf__title">Your health, our priority</h1>
          <p className="dt-hero-ucsf__subtitle">How can we help you today?</p>

          <div className="dt-hero-search">
            <Search className="dt-hero-search__icon" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search doctors, services, or specialties"
              className="dt-hero-search__input"
              readOnly
              onFocus={(e) => e.target.blur()}
            />
            <Link href="/appointment" className="dt-hero-search__btn">
              Search
            </Link>
          </div>

          <div className="dt-hero-actions">
            <Link href="/appointment" className="dt-hero-action">
              <Stethoscope className="h-5 w-5" />
              <span>Find a doctor</span>
            </Link>
            <span className="dt-hero-divider" aria-hidden="true" />
            <Link href="/appointment" className="dt-hero-action">
              <Calendar className="h-5 w-5" />
              <span>Book appointment</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Great care starts here */}
      <section className="dt-section dt-animate-section">
        <div className="dt-container">
          <div className="dt-section-intro dt-reveal-item">
            <h2 className="dt-section-title">Great care starts here</h2>
            <p className="dt-section-lead">
              Whether you have a pressing health concern or are planning ahead,
              we&apos;re here to support you every step of the way.
            </p>
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
      <section id="services" className="dt-section dt-section--muted dt-animate-section">
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

      {/* Value props */}
      <section className="dt-section dt-animate-section">
        <div className="dt-container">
          <div className="dt-split-layout">
            <div className="dt-split-layout__content dt-reveal-item">
              <h2 className="dt-section-title">Our doctors specialize in you</h2>
              <p className="dt-section-lead">
                At DocTime, you get access to trusted specialists, seamless
                scheduling, and tools that put your health journey in your hands.
              </p>
              <Link href="/about" className="dt-btn-primary">
                About DocTime
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="dt-value-grid">
              {VALUE_PROPS.map((item, i) => {
                const icons = [Stethoscope, Clock, Shield, Bot];
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

      {/* Banner CTA */}
      <section className="dt-banner dt-animate-section">
        <div className="dt-banner__bg" aria-hidden="true" />
        <div className="dt-container dt-banner__content dt-reveal-item">
          <h2>World-class medicine. Compassionate care.</h2>
          <p>Schedule your next visit with a DocTime specialist today.</p>
          <Link href="/appointment" className="dt-btn-white">
            Request appointment
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Locations teaser */}
      <section className="dt-section dt-animate-section">
        <div className="dt-container dt-locations">
          <div className="dt-locations__content dt-reveal-item">
            <h2 className="dt-section-title">Excellent care, wherever you are</h2>
            <p className="dt-section-lead">
              Connect with healthcare providers through virtual and in-person
              appointments — access quality care close to home.
            </p>
            <Link href="/appointment" className="dt-btn-outline">
              <MapPin className="h-4 w-4" />
              Find a provider
            </Link>
          </div>
          <div className="dt-locations__visual dt-reveal-item">
            <Image
              src="/assets/images/landing.jpg"
              alt="Healthcare facility"
              width={600}
              height={400}
              className="dt-locations__image"
            />
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="dt-section dt-section--quick dt-animate-section">
        <div className="dt-container">
          <h2 className="dt-section-title dt-reveal-item">I want to…</h2>
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
