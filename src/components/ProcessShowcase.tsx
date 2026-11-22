"use client";

import { useEffect, useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import {
  Search,
  Send,
  Wrench,
  CreditCard,
  CheckCircle2,
  Circle,
  Phone,
  MapPin,
  CalendarDays,
  Lock,
  ArrowRight,
} from "lucide-react";

const AUTO_MS = 4500;

const STEPS = [
  {
    title: "Find a service",
    desc: "Filter admin-approved technicians by device, area and Home Visit or Shop Drop-off.",
    icon: Search,
    badge: "Browsing",
    color: "#94a3b8",
  },
  {
    title: "Send a request",
    desc: "Describe the problem, pick a date and send it. No advance fee.",
    icon: Send,
    badge: "Requested",
    color: "#3b82f6",
  },
  {
    title: "Technician fixes it",
    desc: "Follow the job from Accepted to In Progress and Completed.",
    icon: Wrench,
    badge: "In progress",
    color: "#f59e0b",
  },
  {
    title: "Pay after completion",
    desc: "Pay the final amount through Stripe only after your device is fixed.",
    icon: CreditCard,
    badge: "Completed",
    color: "#22c55e",
  },
];

const PIPELINE = ["Requested", "Accepted", "In progress", "Completed", "Paid"];

function Pipeline({ current }: { current: number }) {
  return (
    <div>
      {PIPELINE.map((label, i) => {
        const done = i < current;
        const now = i === current;
        return (
          <div
            key={label}
            className="fm-ps-row"
            style={{
              color: done || now ? "#f1f5f9" : "#64748b",
              borderBottom:
                i < PIPELINE.length - 1
                  ? "1px dashed rgba(255,255,255,.1)"
                  : "none",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {done ? (
                <CheckCircle2 size={18} color="#34d399" />
              ) : now ? (
                <span className="fm-ps-dot" />
              ) : (
                <Circle size={18} />
              )}
              {label}
            </span>
            {now && <span className="fm-ps-now">Now</span>}
          </div>
        );
      })}
    </div>
  );
}

function PanelBody({ step }: { step: number }) {
  if (step === 0) {
    return (
      <div>
        <div className="fm-ps-search">
          <Search size={16} />
          iPhone screen replacement
        </div>
        {[
          ["iPhone Screen Replacement", "Home Visit", "$45"],
          ["Battery Replacement", "Shop Drop-off", "$25"],
          ["Water Damage Repair", "Home Visit", "$60"],
        ].map(([t, m, p]) => (
          <div key={t} className="fm-ps-result">
            <span>
              <strong style={{ display: "block", color: "#f8fafc" }}>
                {t}
              </strong>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>{m}</span>
            </span>
            <strong style={{ color: "#67e8f9" }}>{p}</strong>
          </div>
        ))}
      </div>
    );
  }

  if (step === 1) {
    return (
      <div>
        <div className="fm-ps-field">
          <Phone size={15} color="#a5b4fc" /> 01700-000000
        </div>
        <div className="fm-ps-field">
          <MapPin size={15} color="#a5b4fc" /> House 12, Dhanmondi, Dhaka
        </div>
        <div className="fm-ps-field">
          <CalendarDays size={15} color="#a5b4fc" /> Preferred date: Tomorrow
        </div>
        <div
          className="fm-ps-field"
          style={{ alignItems: "flex-start", lineHeight: 1.5 }}
        >
          Screen cracked after a fall. Touch still works but the display has
          lines.
        </div>
        <div className="fm-ps-btn">
          Send request <ArrowRight size={16} />
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div>
        <Pipeline current={2} />
        <div
          style={{
            marginTop: 14,
            height: 6,
            borderRadius: 9999,
            background: "rgba(255,255,255,.12)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "62%",
              height: "100%",
              borderRadius: 9999,
              background: "linear-gradient(90deg,#34d399,#22d3ee)",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Pipeline current={3} />
      <div
        style={{
          marginTop: 14,
          padding: 14,
          borderRadius: 14,
          background: "rgba(255,255,255,.06)",
          fontSize: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#94a3b8",
          }}
        >
          <span>Base price</span>
          <span>$45.00</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 6,
            fontWeight: 800,
            color: "#67e8f9",
            fontSize: 18,
          }}
        >
          <span>Final amount</span>
          <span>$55.00</span>
        </div>
      </div>
      <div className="fm-ps-btn">
        <Lock size={15} /> Pay Now with Stripe
      </div>
    </div>
  );
}

export default function ProcessShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Move to the next step automatically unless the user is interacting
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(
      () => setActive((a) => (a + 1) % STEPS.length),
      AUTO_MS,
    );
    return () => clearTimeout(t);
  }, [active, paused]);

  const current = STEPS[active];

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <style>{`
        .fm-ps{display:grid;grid-template-columns:1fr;gap:32px;align-items:center}
        @media (min-width:1024px){.fm-ps{grid-template-columns:5fr 6fr;gap:56px}}
        .fm-ps-vars{--ps-bg:#ffffff;--ps-border:#e2e8f0;--ps-title:#0f172a;--ps-text:#475569;--ps-active:#eef2ff}
        .dark .fm-ps-vars,[data-theme="dark"] .fm-ps-vars{--ps-bg:#0f172a;--ps-border:#1e293b;--ps-title:#ffffff;--ps-text:#94a3b8;--ps-active:#1e1b4b}

        .fm-ps-list{display:flex;flex-direction:column;gap:12px}
        .fm-ps-step{position:relative;display:flex;gap:16px;width:100%;text-align:left;padding:18px;
          border-radius:20px;border:1px solid var(--ps-border);background:var(--ps-bg);
          cursor:pointer;overflow:hidden;transition:transform .3s,box-shadow .3s,border-color .3s,background .3s}
        .fm-ps-step:hover{transform:translateX(4px);box-shadow:0 12px 30px -12px rgba(79,70,229,.35)}
        .fm-ps-step[data-active="true"]{border-color:#6366f1;background:var(--ps-active);
          box-shadow:0 18px 40px -14px rgba(79,70,229,.5)}
        .fm-ps-num{flex:none;width:46px;height:46px;border-radius:14px;display:flex;align-items:center;
          justify-content:center;background:var(--ps-border);color:var(--ps-text);transition:all .3s}
        .fm-ps-step[data-active="true"] .fm-ps-num{background:linear-gradient(135deg,#6366f1,#06b6d4);
          color:#fff;box-shadow:0 10px 20px -6px rgba(99,102,241,.6)}
        .fm-ps-title{display:block;font-size:17px;font-weight:800;color:var(--ps-title)}
        .fm-ps-desc{display:block;margin-top:4px;font-size:14px;line-height:1.6;color:var(--ps-text)}
        .fm-ps-bar{position:absolute;left:0;bottom:0;height:3px;background:linear-gradient(90deg,#6366f1,#06b6d4);width:0}
        .fm-ps-step[data-active="true"][data-auto="true"] .fm-ps-bar{animation:fm-ps-fill ${AUTO_MS}ms linear forwards}
        .fm-ps-step[data-active="true"][data-auto="false"] .fm-ps-bar{width:100%}

        .fm-ps-panel{position:relative;overflow:hidden;border-radius:28px;padding:24px;background:#020617;color:#fff;
          border:1px solid rgba(255,255,255,.1);box-shadow:0 35px 70px -20px rgba(15,23,42,.6)}
        .fm-ps-panel::before{content:"";position:absolute;top:-80px;right:-80px;width:260px;height:260px;border-radius:9999px;
          background:radial-gradient(circle,rgba(99,102,241,.45),transparent 70%);pointer-events:none}
        .fm-ps-head{position:relative;display:flex;align-items:center;justify-content:space-between;
          padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,.1)}
        .fm-ps-badge{padding:4px 12px;border-radius:9999px;font-size:12px;font-weight:700;border:1px solid}
        .fm-ps-body{position:relative;min-height:330px;padding-top:18px}
        .fm-ps-in{animation:fm-ps-in .45s ease both}

        .fm-ps-search{display:flex;align-items:center;gap:8px;padding:11px 14px;border-radius:12px;font-size:14px;
          color:#cbd5e1;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12)}
        .fm-ps-result{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;margin-top:10px;
          border-radius:14px;font-size:14px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08)}
        .fm-ps-field{display:flex;align-items:center;gap:10px;padding:11px 12px;margin-top:8px;border-radius:12px;
          font-size:13px;color:#e2e8f0;background:rgba(255,255,255,.06)}
        .fm-ps-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;margin-top:16px;
          padding:13px;border-radius:14px;font-size:14px;font-weight:700;color:#fff;
          background:linear-gradient(90deg,#6366f1,#06b6d4);box-shadow:0 12px 25px -8px rgba(99,102,241,.6)}
        .fm-ps-row{display:flex;align-items:center;justify-content:space-between;padding:11px 0;font-size:14px}
        .fm-ps-dot{width:18px;height:18px;border-radius:9999px;background:#22d3ee;
          box-shadow:0 0 0 4px rgba(34,211,238,.25);animation:fm-ps-pulse 1.6s ease-in-out infinite}
        .fm-ps-now{padding:2px 8px;border-radius:6px;font-size:12px;font-weight:700;color:#67e8f9;
          background:rgba(34,211,238,.15);border:1px solid rgba(34,211,238,.3)}

        @keyframes fm-ps-fill{from{width:0}to{width:100%}}
        @keyframes fm-ps-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        @keyframes fm-ps-pulse{0%,100%{box-shadow:0 0 0 3px rgba(34,211,238,.25)}50%{box-shadow:0 0 0 8px rgba(34,211,238,.05)}}
        @media (prefers-reduced-motion:reduce){.fm-ps-in,.fm-ps-dot{animation:none}}
      `}</style>

      <SectionHeading
        title="From broken to fixed in four steps"
        subtitle="You always know where your repair stands"
      />

      <div
        className="fm-ps fm-ps-vars"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Steps */}
        <div className="fm-ps-list">
          {STEPS.map((s, i) => (
            <button
              key={s.title}
              type="button"
              className="fm-ps-step"
              data-active={active === i}
              data-auto={!paused}
              aria-current={active === i ? "step" : undefined}
              onClick={() => setActive(i)}
            >
              <span className="fm-ps-num">
                <s.icon size={20} />
              </span>
              <span>
                <span
                  className="fm-ps-title"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {i + 1}. {s.title}
                </span>
                <span className="fm-ps-desc">{s.desc}</span>
              </span>
              <span className="fm-ps-bar" key={`${i}-${active}`} />
            </button>
          ))}
        </div>

        {/* Job panel */}
        <div className="fm-ps-panel">
          <div className="fm-ps-head">
            <span style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>
              Job #FM-8821
            </span>
            <span
              className="fm-ps-badge"
              style={{
                color: current.color,
                borderColor: `${current.color}66`,
                background: `${current.color}22`,
              }}
            >
              {current.badge}
            </span>
          </div>
          <div className="fm-ps-body">
            <div key={active} className="fm-ps-in">
              <PanelBody step={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
