import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  CheckCircle,
  Kanban,
  ShieldCheck,
  Users2,
  BarChart3,
  ChevronDown,
  Sparkles,
  Layers,
  Lock,
  GitBranch,
} from 'lucide-react';

export const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'What is WorkNest?',
      a: 'WorkNest is a production-grade full-stack project management and team collaboration SaaS platform built as part of the AUREX Month 3 Engineering Internship. It provides multi-role governance, interactive Kanban boards, and centralized team oversight.',
    },
    {
      q: 'What roles does WorkNest support?',
      a: 'WorkNest enforces three real backend-validated roles: Administrator (global user and platform governance), Project Manager (project creation, member delegation, and task assignment), and Team Member (task status updates, comments, and personal deadlines).',
    },
    {
      q: 'How is security implemented?',
      a: 'WorkNest uses cryptographic bcrypt password hashing, stateless JSON Web Tokens (JWT), role-based middleware guards on all REST endpoints, CORS origin validation, Helmet security headers, and rate limiting.',
    },
    {
      q: 'Does task drag-and-drop persist to the database?',
      a: 'Yes. Every status transition on the interactive Kanban board instantly fires a PATCH request to the Express REST API, updating the MongoDB document and generating an audit trail in the ActivityLog collection.',
    },
  ];

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-forest selection:bg-brand-sage selection:text-brand-forest">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-brand-ivory/80 backdrop-blur-md border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-brand-forest flex items-center justify-center text-brand-ivory shadow-sm">
              <Compass className="w-5 h-5 text-brand-peach" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-brand-forest block leading-none">
                WorkNest
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-brand-primary">
                Team Project Platform
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-brand-muted">
            <a href="#features" className="hover:text-brand-forest transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-brand-forest transition-colors">How It Works</a>
            <a href="#security" className="hover:text-brand-forest transition-colors">Security</a>
            <a href="#faq" className="hover:text-brand-forest transition-colors">FAQ</a>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-brand-forest hover:text-brand-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-brand-forest text-brand-ivory hover:bg-brand-darkGreen transition-all shadow-sm"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 text-brand-peach" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-sage/60 border border-brand-sage text-brand-primary text-xs font-semibold mb-8">
            <Sparkles className="w-3.5 h-3.5 text-brand-peach" />
            <span>AUREX Month 3 Full-Stack Engineering Capstone</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-brand-forest tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Plan projects. Organize teams. <span className="italic font-normal text-brand-primary">Deliver work.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-brand-muted max-w-2xl mx-auto font-sans leading-relaxed">
            A production-oriented team management platform engineered with React, Express, and MongoDB. Featuring real-time role-based access control, interactive Kanban boards, and dynamic workflow analytics.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-brand-primary text-white font-semibold text-base hover:bg-brand-hoverGreen transition-all shadow-elevated"
            >
              <span>Start Free Workspace</span>
              <ArrowRight className="w-5 h-5 text-brand-peach" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white text-brand-forest font-semibold text-base border border-brand-border hover:bg-brand-ivory transition-all"
            >
              <span>Explore Live Demo</span>
            </Link>
          </div>

          {/* Product UI Preview Mockup */}
          <div className="mt-16 sm:mt-20 max-w-5xl mx-auto rounded-3xl border border-brand-border bg-white shadow-2xl overflow-hidden p-2 sm:p-4">
            <div className="rounded-2xl border border-brand-border/60 bg-brand-ivory/50 p-6 sm:p-8 text-left">
              <div className="flex items-center justify-between border-b border-brand-border/80 pb-4 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="ml-3 text-xs font-mono text-brand-muted">worknest-app.internal/dashboard</span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-sage text-brand-primary">
                  Interactive Preview
                </span>
              </div>

              {/* Mock Dashboard Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-brand-border shadow-subtle">
                  <div className="text-xs text-brand-muted">Active Projects</div>
                  <div className="font-serif text-2xl font-bold text-brand-forest mt-1">12</div>
                  <div className="text-[11px] text-green-700 font-medium mt-1">↑ 100% On Schedule</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-brand-border shadow-subtle">
                  <div className="text-xs text-brand-muted">Pending Tasks</div>
                  <div className="font-serif text-2xl font-bold text-brand-forest mt-1">38</div>
                  <div className="text-[11px] text-brand-muted font-medium mt-1">Across 4 Active Teams</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-brand-border shadow-subtle">
                  <div className="text-xs text-brand-muted">Completed Work</div>
                  <div className="font-serif text-2xl font-bold text-brand-forest mt-1">94%</div>
                  <div className="text-[11px] text-brand-primary font-medium mt-1">Sprint Velocity High</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-brand-border shadow-subtle">
                  <div className="text-xs text-brand-muted">Team Members</div>
                  <div className="font-serif text-2xl font-bold text-brand-forest mt-1">24</div>
                  <div className="text-[11px] text-brand-muted font-medium mt-1">RBAC Synchronized</div>
                </div>
              </div>

              {/* Mock Kanban Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-brand-ivory p-4 rounded-xl border border-brand-border/80">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-brand-forest uppercase tracking-wider">To Do</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white text-brand-muted font-medium">2</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-brand-border shadow-subtle mb-2">
                    <div className="text-xs font-semibold text-brand-forest">Design Architecture Blueprint</div>
                    <div className="text-[11px] text-brand-muted mt-1">System design specs for AUREX Week 1</div>
                  </div>
                </div>

                <div className="bg-brand-sage/40 p-4 rounded-xl border border-brand-sage">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">In Progress</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white text-brand-primary font-medium">3</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-brand-border shadow-subtle mb-2">
                    <div className="text-xs font-semibold text-brand-forest">Implement JWT & RBAC Middleware</div>
                    <div className="text-[11px] text-brand-muted mt-1">Backend auth token & role verification</div>
                  </div>
                </div>

                <div className="bg-green-50/50 p-4 rounded-xl border border-green-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-green-800 uppercase tracking-wider">Completed</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white text-green-700 font-medium">8</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-brand-border shadow-subtle mb-2">
                    <div className="text-xs font-semibold text-brand-forest">Mongoose 6-Entity NoSQL Schemas</div>
                    <div className="text-[11px] text-green-700 font-medium mt-1">✓ Verified with Jest & Supertest</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary block mb-2">
              Core Capabilities
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-brand-forest">
              Engineered for seamless full-stack execution.
            </h2>
            <p className="mt-4 text-base text-brand-muted">
              Every feature is backed by a dedicated Mongoose schema, authenticated Express REST endpoints, and reactive React state.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-brand-ivory border border-brand-border hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-xl bg-brand-forest text-brand-peach flex items-center justify-center mb-6">
                <Kanban className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-brand-forest mb-3">
                Persistent Kanban Boards
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                Smooth drag-and-drop workflow moving tasks across To Do, In Progress, In Review, and Completed stages. Each transition persists through validated REST API patches.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-brand-ivory border border-brand-border hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-xl bg-brand-primary text-brand-ivory flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-brand-forest mb-3">
                Three-Tier RBAC Governance
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                Granular permissions for Administrators, Project Managers, and Team Members. Strict backend-enforced route guards prevent unauthorized data mutations.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-brand-ivory border border-brand-border hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-xl bg-brand-forest text-brand-ivory flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-brand-peach" />
              </div>
              <h3 className="font-serif text-xl font-bold text-brand-forest mb-3">
                Real-Time Aggregations
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                Role-specific dashboard statistics computed dynamically via MongoDB aggregation pipelines without mock or hardcoded numbers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-brand-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary block mb-2">
              Workflow
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-brand-forest">
              From requirement to delivery in 3 steps.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative p-6">
              <div className="font-serif text-5xl font-bold text-brand-sage mb-4">01</div>
              <h3 className="font-serif text-xl font-bold text-brand-forest mb-2">Create & Scope Projects</h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                Define deliverables, target completion deadlines, priority rankings, and invite registered team members.
              </p>
            </div>

            <div className="relative p-6">
              <div className="font-serif text-5xl font-bold text-brand-sage mb-4">02</div>
              <h3 className="font-serif text-xl font-bold text-brand-forest mb-2">Delegate & Collaborate</h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                Break work into atomic tasks, assign them to verified project members, discuss feedback via comments, and receive notification alerts.
              </p>
            </div>

            <div className="relative p-6">
              <div className="font-serif text-5xl font-bold text-brand-sage mb-4">03</div>
              <h3 className="font-serif text-xl font-bold text-brand-forest mb-2">Track & Finalize</h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                Monitor sprint progress, review overdue task alerts, inspect audit trail logs, and mark projects completed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Architecture */}
      <section id="security" className="py-20 bg-brand-forest text-brand-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-peach block mb-3">
                Security & Secrets Management
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white mb-6">
                Built strictly to AUREX Month 3 security directives.
              </h2>
              <ul className="space-y-4 text-sm text-brand-sage">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-peach flex-shrink-0 mt-0.5" />
                  <span><strong>Zero Plain-Text Secrets:</strong> All credentials and keys isolated in environment variables.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-peach flex-shrink-0 mt-0.5" />
                  <span><strong>Cryptographic Hashing:</strong> Passwords hashed with bcrypt (salt rounds: 10) before storage.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-peach flex-shrink-0 mt-0.5" />
                  <span><strong>Stateless JWT Verification:</strong> Protected backend endpoints guarded by tamper-proof bearer tokens.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-peach flex-shrink-0 mt-0.5" />
                  <span><strong>HTTP Header Hardening:</strong> Helmet headers, CORS origin restrictions, and rate limiters active.</span>
                </li>
              </ul>
            </div>

            <div className="bg-brand-darkGreen p-8 rounded-2xl border border-brand-primary/40 font-mono text-xs text-brand-sage space-y-3">
              <div className="text-brand-peach font-bold">// Security Verification Baseline</div>
              <div>✓ Bcrypt Salt Rounds: 10 (Encrypted)</div>
              <div>✓ JWT Expiration: 7d (Stateless)</div>
              <div>✓ Default Role on Registration: 'member'</div>
              <div>✓ Self-Elevation Blocked: Verified</div>
              <div>✓ Cascade Comment Deletion: Active</div>
              <div>✓ Supertest API Coverage: 100% Passed</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary block mb-2">
              Frequently Asked Questions
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-forest">
              Technical & Internship Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-brand-border bg-brand-ivory/40 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full p-6 text-left flex items-center justify-between font-serif text-lg font-semibold text-brand-forest"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-brand-muted transition-transform duration-200 ${
                      openFaq === i ? 'rotate-180 text-brand-primary' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-sm text-brand-muted leading-relaxed font-sans border-t border-brand-border/60 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-brand-ivory text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-brand-forest">
            Ready to explore WorkNest?
          </h2>
          <p className="mt-4 text-base text-brand-muted max-w-xl mx-auto">
            Experience complete full-stack project governance with role-based security and interactive task workflows.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brand-forest text-brand-ivory font-semibold text-base hover:bg-brand-darkGreen transition-all shadow-elevated"
            >
              <span>Create Account</span>
              <ArrowRight className="w-5 h-5 text-brand-peach" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-brand-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-forest flex items-center justify-center text-brand-ivory shadow-sm">
              <Compass className="w-4 h-4 text-brand-peach" />
            </div>
            <span className="font-serif text-xl font-bold text-brand-forest">WorkNest</span>
          </div>
          <div className="text-xs text-brand-muted text-center sm:text-right">
            <div>AUREX Full-Stack Engineering Internship — Month 3 Project</div>
            <div className="mt-1">Candidate Project Proposal (Pending Formal Mentor Approval)</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
