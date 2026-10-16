import { useEffect, useRef, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown,
  Clock3, Mail, MapPin, Menu, Moon, PencilLine, Phone, Printer,
  Sparkles, Sun, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroDesk from "@/assets/stationery-hero.jpg";
import creativeDesk from "@/assets/creative-products.jpg";
import { shop, whatsappLink } from "@/data/shop";

const introText = "Your neighbourhood stop for all things stationery. Find a new favourite, refill your cartridge, and get on with the good stuff.";
const navigation = [
  ["Home", "home"], ["Products", "products"], ["Services", "services"],
  ["About", "about"], ["Gallery", "gallery"], ["Contact", "contact"],
];

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Paresh Stationery Mart | Stationery Shop in Naranpura, Ahmedabad" },
      { name: "description", content: "Discover school, office and art supplies at Paresh Stationery Mart, Naranpura, Ahmedabad. Cartridge refilling available. Call or WhatsApp Paresh and Sanjay." },
      { property: "og:title", content: "Paresh Stationery Mart | Your Naranpura stationery shop" },
      { property: "og:description", content: "Dealing in all types of stationery. Visit us in Naranpura, Ahmedabad. Cartridge refilling available." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "StationeryStore",
        name: shop.name,
        description: `${shop.tagline}. Cartridge refilling available.`,
        address: {
          "@type": "PostalAddress",
          streetAddress: "74, Happy Home Shopping Center, Ankur Ranna Park Road, Naranpura",
          addressLocality: "Ahmedabad",
          postalCode: "380013",
          addressRegion: "Gujarat",
          addressCountry: "IN",
        },
        telephone: shop.owners.map((owner) => owner.tel),
        email: shop.email,
      }),
    }],
  }),
});

function HomePage() {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [introOpen, setIntroOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<"hero" | "art" | null>(null);
  const [galleryPage, setGalleryPage] = useState(0);
  const lastScroll = useRef(0);

  useEffect(() => {
    const preferred = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stored = window.localStorage.getItem("paresh-theme");
    const initialDark = stored === "dark";
    setDark(initialDark);
    document.documentElement.classList.toggle("dark", initialDark);

    if (!preferred && !window.sessionStorage.getItem("paresh-intro-seen")) {
      window.sessionStorage.setItem("paresh-intro-seen", "yes");
      setIntroOpen(true);
      const timeout = window.setTimeout(() => setIntroOpen(false), 850);
      const scrollHandler = () => {
        const top = window.scrollY;
        const progress = document.documentElement.scrollHeight - window.innerHeight;
        document.documentElement.style.setProperty("--scroll-progress", `${progress ? top / progress * 100 : 0}%`);
        setIsScrolled(top > 24);
        setNavHidden(top > 200 && top > lastScroll.current + 3);
        if (top < lastScroll.current - 3) setNavHidden(false);
        lastScroll.current = top;
      };
      window.addEventListener("scroll", scrollHandler, { passive: true });
      scrollHandler();
      const appear = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            appear.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll("[data-reveal]").forEach((element) => appear.observe(element));
      return () => {
        window.clearTimeout(timeout);
        window.removeEventListener("scroll", scrollHandler);
        appear.disconnect();
      };
    }

    const scrollHandler = () => {
      const top = window.scrollY;
      const progress = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty("--scroll-progress", `${progress ? top / progress * 100 : 0}%`);
      setIsScrolled(top > 24);
      setNavHidden(top > 200 && top > lastScroll.current + 3);
      if (top < lastScroll.current - 3) setNavHidden(false);
      lastScroll.current = top;
    };
    window.addEventListener("scroll", scrollHandler, { passive: true });
    scrollHandler();
    const appear = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          appear.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll("[data-reveal]").forEach((element) => appear.observe(element));
    return () => {
      window.removeEventListener("scroll", scrollHandler);
      appear.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [lightbox]);

  function toggleTheme() {
    setDark((value) => {
      const next = !value;
      document.documentElement.classList.toggle("dark", next);
      window.localStorage.setItem("paresh-theme", next ? "dark" : "light");
      return next;
    });
  }

  function sendMessage(event: FormEvent<HTMLFormElement>, formKind: "bulk" | "contact") {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const message = formKind === "bulk"
      ? `Hello! I'd like to discuss a bulk stationery order.\nName: ${fields.get("name")}\nSchool / office: ${fields.get("organisation")}\nPhone: ${fields.get("phone")}\nRequirements: ${fields.get("requirements")}`
      : `Hello! I'd like to get in touch with Paresh Stationery Mart.\nName: ${fields.get("name")}\nPhone: ${fields.get("phone")}\nMessage: ${fields.get("message")}`;
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
  }

  const selectedImage = lightbox === "hero" ? heroDesk : creativeDesk;

  return (
    <main className="site-main">
      <div className="top-progress" aria-hidden="true" />
      {introOpen && <div className="intro-curtain" aria-hidden="true"><div className="intro-mark"><span className="intro-pencil"><PencilLine /></span><span>PARESH</span><span className="intro-small">stationery mart · ahmedabad</span></div></div>}
      <header className={`site-header ${isScrolled ? "site-header--scrolled" : ""} ${navHidden ? "site-header--hidden" : ""}`}>
        <a href="#home" className="wordmark" aria-label="Paresh Stationery Mart home" onClick={() => setMenuOpen(false)}>
          <span className="wordmark-seal"><PencilLine size={21} strokeWidth={1.9} /></span>
          <span className="wordmark-type"><span>PARESH</span><small>STATIONERY MART</small></span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(([label, id]) => <a className="nav-link" href={`#${id}`} key={id}>{label}</a>)}
        </nav>
        <div className="header-actions">
          <Button variant="ghost" size="icon" className="theme-toggle" onClick={toggleTheme} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} title={dark ? "Light theme" : "Dark theme"}>{dark ? <Sun /> : <Moon />}</Button>
          <a className="header-whatsapp" href={whatsappLink("Hello! I'd like to ask about your stationery.")} target="_blank" rel="noreferrer">WhatsApp us <ArrowUpRight size={16} /></a>
          <Button variant="ghost" size="icon" className="menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
        </div>
      </header>
      {menuOpen && <nav className="mobile-menu" aria-label="Mobile navigation">{navigation.map(([label, id], index) => <a href={`#${id}`} onClick={() => setMenuOpen(false)} key={id}><span className="mobile-menu-index">0{index + 1}</span>{label}<ArrowUpRight aria-hidden="true" /></a>)}<a className="mobile-whatsapp" href={whatsappLink("Hello! I'd like to ask about your stationery.")} target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>Chat on WhatsApp <ArrowUpRight /></a></nav>}

      <section className="hero" id="home" aria-labelledby="hero-title">
        <div className="hero-photo" role="img" aria-label="A sunlit desktop arranged with a notebook, art supplies, pencils and stationery" />
        <div className="hero-paper-lines" aria-hidden="true" />
        <div className="hero-content">
          <span className="eyebrow hero-eyebrow"><span className="eyebrow-dot" /> YOUR NEIGHBOURHOOD STATIONERY SHOP <span className="eyebrow-city">· AHMEDABAD</span></span>
          <h1 id="hero-title" className="hero-title"><span>Good ideas</span><span>start <em>on paper.</em></span></h1>
          <p className="hero-description">{introText}</p>
          <div className="hero-actions"><a className="action-primary" href="#products">Find your next favourite <ArrowRight size={18} /></a><a className="action-secondary" href={whatsappLink("Hello! I'd like to ask about your stationery.")} target="_blank" rel="noreferrer">Say hello on WhatsApp <ArrowUpRight size={16} /></a></div>
          <div className="hero-meta"><span><MapPin size={14} /> Naranpura, Ahmedabad</span><span className="meta-divider" /><span>Dealing in all types of stationery</span></div>
        </div>
        <div className="hero-sticker"><span className="sticker-ring">CARTRIDGE · REFILLING · AVAILABLE · </span><span className="sticker-center"><Printer size={25} /><small>PRINT ON</small><strong>again!</strong></span></div>
        <a href="#products" className="hero-down" aria-label="Scroll down to browse stationery"><ArrowDownRight size={19} /></a>
        <span className="hero-index" aria-hidden="true">01 — 08</span>
      </section>

      <div className="marquee-band" aria-label="School supplies · Office essentials · Art and craft · Pens and pencils · Ink and cartridges">
        <div className="marquee-track" aria-hidden="true">{Array.from({ length: 4 }).map((_, index) => <span className="marquee-set" key={index}>PENS <i>✳</i> PAPER <i>✳</i> BIG IDEAS <i>✳</i> SCHOOL DAYS <i>✳</i> ART &amp; CRAFT <i>✳</i> GOOD INK <i>✳</i>&nbsp;</span>)}</div>
      </div>

      <section className="section products-section" id="products" aria-labelledby="products-heading">
        <div className="section-heading" data-reveal><div><span className="eyebrow"><span className="eyebrow-numeral">01</span> THE GOOD STUFF</span><h2 id="products-heading">A little something<br />for <em>every list.</em></h2></div><p className="section-aside">Big school project, little creative spark, fresh notebook smell — it all starts right here.</p></div>
        <div className="category-grid">{shop.categories.map((item, index) => <a className={`category-card category-card--${item.tone} ${item.wide ? "category-card--wide" : ""} ${item.photo ? "category-card--photo" : ""}`} href="#contact" key={item.number} data-reveal style={{ "--card-order": index } as React.CSSProperties}>
          {item.photo && <span className="category-photo" aria-hidden="true" />}
          <span className="category-top"><span className="category-number">{item.number} / 08</span><span className="category-icon" aria-hidden="true">{item.icon}</span></span>
          <span className="category-bottom"><span><strong>{item.title}</strong><small>{item.note}</small></span><span className="category-arrow"><ArrowUpRight size={17} /></span></span>
        </a>)}</div>
        <p className="section-footnote" data-reveal>Looking for something specific? <a href={whatsappLink("Hello! I'm looking for a stationery item. Could you please help?")} target="_blank" rel="noreferrer">Ask us on WhatsApp <ArrowUpRight size={13} /></a></p>
      </section>

      <section className="service-section" id="services" aria-labelledby="service-heading">
        <div className="service-inner"><div className="service-copy" data-reveal><span className="eyebrow"><span className="eyebrow-numeral">02</span> A LITTLE FIX FOR YOUR PRINTER</span><h2 id="service-heading">Good ink.<br /><em>Second life.</em></h2><p>Cartridge running dry? Bring it along. Cartridge refilling is available at Paresh Stationery Mart.</p><a className="action-light" href={whatsappLink("Hello! I'd like to ask about cartridge refilling. Could you please help?")} target="_blank" rel="noreferrer">Ask about a refill <ArrowUpRight size={17} /></a></div>
          <ol className="service-steps" aria-label="Cartridge refilling steps">{[{ number: "01", title: "Bring it along", note: "Drop by with your cartridge." }, { number: "02", title: "Quick check", note: "We’ll take a look together." }, { number: "03", title: "Refill available", note: "Ask us what your cartridge needs." }, { number: "04", title: "Back to printing", note: "Ready to get on with it." }].map((step) => <li key={step.number} data-reveal><span className="step-number">{step.number}</span><span className="step-copy"><strong>{step.title}</strong><small>{step.note}</small></span><Check className="step-check" size={18} /></li>)}</ol>
        </div><div className="service-caption"><span>KEEP THE GOOD IDEAS COMING</span><span>CARTRIDGE REFILLING AVAILABLE <Sparkles size={13} /></span></div>
      </section>

      <section className="section choose-section" aria-labelledby="choose-heading"><div className="section-heading" data-reveal><div><span className="eyebrow"><span className="eyebrow-numeral">03</span> THOUGHTFULLY STOCKED</span><h2 id="choose-heading">The right things.<br /><em>Right around the corner.</em></h2></div><p className="section-aside">Less searching. More making. A few reasons to make us your stationery stop.</p></div>
        <div className="trust-grid"><article className="trust-item" data-reveal><span className="trust-icon trust-icon--orange">✳</span><h3>A lot to choose from</h3><p>School, office, art and everyday stationery — all under one roof.</p></article><article className="trust-item" data-reveal><span className="trust-icon trust-icon--yellow">₹</span><h3>Fair and friendly</h3><p>Just what you need, with a real person on the other side of the counter.</p></article><article className="trust-item" data-reveal><span className="trust-icon trust-icon--blue"><PencilLine size={21} /></span><h3>For the big lists</h3><p>Ask us about stationery for your school, office or institution.</p></article><article className="trust-item" data-reveal><span className="trust-icon trust-icon--green"><MapPin size={21} /></span><h3>Here in Naranpura</h3><p>Find us at Happy Home Shopping Center, Ahmedabad.</p></article></div>
        <div className="facts-strip" data-reveal><span><strong>08</strong> stationery categories</span><span><strong>02</strong> direct shop contacts</span><span><strong>01</strong> friendly local stop</span></div>
      </section>

      <section className="bulk-section" id="bulk" aria-labelledby="bulk-heading"><div className="bulk-paper"><span className="bulk-mark" aria-hidden="true">GOOD<br />IDEAS<br /><em>IN BULK.</em></span><span className="bulk-paper-index">FOR THE BIG LISTS · 04 / 08</span></div><div className="bulk-content" data-reveal><span className="eyebrow"><span className="eyebrow-numeral">04</span> SCHOOLS · OFFICES · INSTITUTIONS</span><h2 id="bulk-heading">Got a<br />big list?</h2><p>Stocking up for a school, office or institution? Tell us what you need and we’ll start a conversation.</p>
          <form className="inquiry-form" onSubmit={(event) => sendMessage(event, "bulk")}><label>Your name<input name="name" placeholder="The name we should know you by" autoComplete="name" required /></label><label>School or organisation<input name="organisation" placeholder="Where’s the stationery headed?" required /></label><div className="form-row"><label>Phone number<input name="phone" type="tel" placeholder="Your best contact number" autoComplete="tel" required /></label><label>What do you need?<input name="requirements" placeholder="A rough list is perfect" required /></label></div><Button className="form-submit" type="submit">Start a WhatsApp conversation <ArrowUpRight size={16} /></Button><small className="form-privacy">Your message opens in WhatsApp, ready for you to send.</small></form>
        </div></section>

      <section className="about-section" id="about" aria-labelledby="about-heading"><div className="about-visual" data-reveal><img src={creativeDesk} alt="Colourful creative stationery, pencils and art supplies on a sketchbook" width={1200} height={912} loading="lazy" /><span className="about-image-note">A good excuse<br />to make a mess.</span><span className="about-image-idx">FIG. 01 — THE CREATIVE DESK</span></div><div className="about-copy" data-reveal><span className="eyebrow"><span className="eyebrow-numeral">05</span> A PLACE TO GET STARTED</span><h2 id="about-heading">For school days.<br />Work days.<br /><em>Any kind of day.</em></h2><p>Some days need a sharper pencil. Others call for a fresh stack of paper, a splash of colour, or a printer that starts working again.</p><p>Paresh Stationery Mart deals in all types of stationery — and cartridge refilling is available too. Find us at Happy Home Shopping Center in Naranpura.</p><div className="owner-pair"><div><span>COME SAY HELLO</span><strong>Paresh Shah</strong><a href={`tel:${shop.owners[0].tel}`}>{shop.owners[0].phone} <ArrowUpRight size={13} /></a></div><span className="owner-divider" aria-hidden="true" /><div><span>WE’RE HERE TO HELP</span><strong>Sanjay Shah</strong><a href={`tel:${shop.owners[1].tel}`}>{shop.owners[1].phone} <ArrowUpRight size={13} /></a></div></div></div></section>

      <section className="gallery-section" id="gallery" aria-labelledby="gallery-heading"><div className="section-heading" data-reveal><div><span className="eyebrow"><span className="eyebrow-numeral">06</span> DESK INSPIRATION</span><h2 id="gallery-heading">Made for a little<br /><em>everyday magic.</em></h2></div><div className="gallery-controls"><Button variant="outline" size="icon" className="round-arrow" onClick={() => setGalleryPage(0)} aria-label="Show stationery and ideas" disabled={galleryPage === 0}><ArrowLeft /></Button><Button variant="outline" size="icon" className="round-arrow" onClick={() => setGalleryPage(1)} aria-label="Show art supplies and colour" disabled={galleryPage === 1}><ArrowRight /></Button></div></div>
        <div className="gallery-viewport"><button type="button" className={`gallery-slide gallery-slide--main ${galleryPage ? "gallery-shift" : ""}`} onClick={() => setLightbox("hero")} aria-label="Enlarge the stationery desk photograph"><img src={heroDesk} alt="Thoughtfully arranged notebooks, a fountain pen, pencils and stationery on a bright desk" width={1536} height={1024} loading="lazy" /><span className="gallery-label"><span>01 / 02</span><strong>Notes, scribbles &amp; what comes next.</strong><ArrowUpRight size={18} /></span></button><button type="button" className={`gallery-slide gallery-slide--side ${galleryPage ? "gallery-shift" : ""}`} onClick={() => setLightbox("art")} aria-label="Enlarge the art supplies photograph"><img src={creativeDesk} alt="Art brushes and coloured pencils beside a sketchbook and watercolor paints" width={1200} height={912} loading="lazy" /><span className="gallery-label"><span>02 / 02</span><strong>A little room for colour.</strong><ArrowUpRight size={18} /></span></button></div><p className="gallery-caption">A FEW THINGS FOR THE CREATIVE DESK <span>PHOTOGRAPHY CONCEPTS · REPLACE WITH REAL SHOP PHOTOGRAPHS</span></p>
      </section>

      <section className="voices-section" aria-labelledby="voices-heading"><div className="voices-heading" data-reveal><span className="eyebrow"><span className="eyebrow-numeral">07</span> FROM OUR CORNER</span><h2 id="voices-heading">Good things<br />travel <em>by word.</em></h2></div><article className="testimonial-placeholder" data-reveal><span className="placeholder-quotes">“</span><span className="testimonial-label">YOUR NEIGHBOUR'S NOTE GOES HERE</span><p>“Add a real customer review here when you’re ready.”</p><div className="testimonial-attribution"><span className="review-avatar" aria-hidden="true">✳</span><span><strong>Customer review</strong><small>Placeholder — replace with a real review</small></span></div><span className="placeholder-corner" aria-hidden="true">✳</span></article></section>

      <section className="faq-section" aria-labelledby="faq-heading"><div className="faq-head" data-reveal><span className="eyebrow"><span className="eyebrow-numeral">08</span> A FEW QUICK ANSWERS</span><h2 id="faq-heading">Wondering <em>about…</em></h2><p>Something else on your mind? Give us a ring.</p><a href={`tel:${shop.owners[0].tel}`} className="faq-call"><Phone size={15} /> Call Paresh <ArrowUpRight size={14} /></a></div><div className="faq-list">{shop.faqs.map((faq, index) => <article className={`faq-item ${activeFaq === index ? "faq-item--open" : ""}`} key={faq.q}><h3><Button type="button" variant="ghost" className="faq-trigger" id={`faq-question-${index}`} aria-expanded={activeFaq === index} aria-controls={`faq-answer-${index}`} onClick={() => setActiveFaq(activeFaq === index ? null : index)}><span className="faq-number">0{index + 1}</span><span>{faq.q}</span><ChevronDown aria-hidden="true" className="faq-chevron" /></Button></h3>{activeFaq === index && <div className="faq-answer" id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`}><p>{faq.a}</p></div>}</article>)}</div></section>

      <section className="contact-section" id="contact" aria-labelledby="contact-heading"><div className="contact-content"><div className="contact-intro" data-reveal><span className="eyebrow"><span className="eyebrow-numeral">COME FIND US</span></span><h2 id="contact-heading">Your next<br />favourite thing<br /><em>is nearby.</em></h2><p>Drop in, call ahead, or send us a message. We’d love to hear what’s on your list.</p><a className="contact-address" href="https://maps.google.com/?q=74%2C+Happy+Home+Shopping+Center%2C+Ankur+Ranna+Park+Road%2C+Naranpura%2C+Ahmedabad+380013%2C+Gujarat" target="_blank" rel="noreferrer"><MapPin size={19} /><span>{shop.address}<small>GET DIRECTIONS <ArrowUpRight size={12} /></small></span></a>
            <div className="contact-methods"><a className="contact-person" href={`tel:${shop.owners[0].tel}`}><span><Phone size={16} /></span><span><small>CALL PARESH</small><strong>{shop.owners[0].phone}</strong></span><ArrowUpRight size={16} /></a><a className="contact-person" href={`tel:${shop.owners[1].tel}`}><span><Phone size={16} /></span><span><small>CALL SANJAY</small><strong>{shop.owners[1].phone}</strong></span><ArrowUpRight size={16} /></a><a className="contact-person" href={`mailto:${shop.email}`}><span><Mail size={16} /></span><span><small>WRITE US AN EMAIL</small><strong className="email-address">{shop.email}</strong></span><ArrowUpRight size={16} /></a><a className="contact-person" href={whatsappLink("Hello! I'd like to get in touch.")} target="_blank" rel="noreferrer"><span className="whatsapp-glyph">W</span><span><small>MESSAGE US</small><strong>WhatsApp the shop</strong></span><ArrowUpRight size={16} /></a></div>
          </div><div className="contact-right" data-reveal><form className="contact-form" onSubmit={(event) => sendMessage(event, "contact")}><span className="form-heading"><PencilLine size={18} /> SEND A LITTLE NOTE</span><label>Your name<input name="name" autoComplete="name" placeholder="What should we call you?" required /></label><label>Your phone number<input name="phone" type="tel" autoComplete="tel" placeholder="So we can get back to you" required /></label><label>What’s on your mind?<textarea name="message" rows={3} placeholder="Tell us a little about it…" required /></label><Button className="form-submit" type="submit">Write to us on WhatsApp <ArrowUpRight size={16} /></Button><p className="form-privacy">This opens WhatsApp with your note ready to send.</p></form><div className="shop-hours"><Clock3 size={17} /><span><strong>Planning a visit?</strong><small>Please call us to check today’s opening hours.</small></span></div></div>
        </div><div className="map-frame" aria-label="Map showing the shop area in Naranpura, Ahmedabad"><iframe title="Map of Naranpura, Ahmedabad" src="https://maps.google.com/maps?q=Happy%20Home%20Shopping%20Center%2C%20Naranpura%2C%20Ahmedabad&t=&z=15&ie=UTF8&iwloc=&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /></div>
      </section>

      <footer className="site-footer"><div className="footer-top"><a href="#home" className="wordmark footer-wordmark" aria-label="Paresh Stationery Mart — back to the top"><span className="wordmark-seal"><PencilLine size={21} /></span><span className="wordmark-type"><span>PARESH</span><small>STATIONERY MART</small></span></a><p>{shop.tagline}<br />Here when your next good idea needs a pen.</p><a className="back-top" href="#home">BACK TO THE TOP <ArrowUpRight size={15} /></a></div><span className="footer-giant" aria-hidden="true">PARESH<span>®</span></span><div className="footer-bottom"><span>© {new Date().getFullYear()} {shop.name}</span><a href={`mailto:${shop.email}`}><Mail size={13} /> {shop.email}</a><span>MADE FOR WHAT’S NEXT <Sparkles size={13} /></span></div></footer>

      <a className="whatsapp-float" href={whatsappLink("Hello! I'd like to get in touch with Paresh Stationery Mart.")} target="_blank" rel="noreferrer" aria-label="Start a WhatsApp chat with Paresh Stationery Mart"><span className="whatsapp-glyph">W</span><span>Let’s chat</span></a>
      {lightbox && <div className="lightbox-backdrop" role="dialog" aria-modal="true" aria-label="Stationery photo viewer" onMouseDown={(event) => { if (event.target === event.currentTarget) setLightbox(null); }}><div className="lightbox-panel"><Button variant="ghost" size="icon" className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close photo"><X /></Button><img src={selectedImage} alt={lightbox === "hero" ? "Notebook, fountain pen, pencil and stationery on a sunlit desk" : "Colourful pencils, brushes and art supplies on a sketchbook"} width={1536} height={1024} /><span>DESK INSPIRATION <span>·</span> {lightbox === "hero" ? "01" : "02"} / 02</span></div></div>}
    </main>
  );
}
