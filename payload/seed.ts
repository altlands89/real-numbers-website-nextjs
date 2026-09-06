/**
 * One-off migration script: populates Payload with the site's current,
 * real content (today's hardcoded copy + existing public/ photos) so
 * /admin opens already fully populated instead of empty. Safe to re-run —
 * uploadOnce() and upsertGlobal() are idempotent by filename/slug.
 *
 * Run with: npm run payload:seed
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPayload } from "payload";
import config from "../payload.config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, "../public");

async function run() {
  const payload = await getPayload({ config });

  async function uploadOnce(relPath: string, alt: string): Promise<{ id: number }> {
    const filename = path.basename(relPath);
    const existing = await payload.find({
      collection: "media",
      where: { filename: { equals: filename } },
      limit: 1,
    });
    if (existing.docs.length) return existing.docs[0] as unknown as { id: number };
    const created = await payload.create({
      collection: "media",
      data: { alt },
      filePath: path.join(PUBLIC_DIR, relPath),
    });
    return created as unknown as { id: number };
  }

  console.log("Uploading media...");
  const headerLogo = await uploadOnce("img/logo-black.svg", "Real Numbers logo (black)");
  const footerLogo = await uploadOnce("img/logo-offwhite.svg", "Real Numbers logo (off-white)");
  const figLogo = await uploadOnce("img/logos/fig.svg", "Fig");
  const noveeLogo = await uploadOnce("img/logos/novee.svg", "Novee");
  const linesLogo = await uploadOnce("img/logos/lines.svg", "Lines");
  const aboutAtmosphere = await uploadOnce("img/photography/about-atmosphere.jpg", "Inside a Real Numbers strategy session");
  const expertiseAtmosphere = await uploadOnce("img/photography/expertise-atmosphere.jpg", "A financial model in progress");
  const usecasesAtmosphere = await uploadOnce("img/photography/usecases-atmosphere.jpg", "A team working through a growth decision");
  const faqAtmosphere = await uploadOnce("img/photography/faq-atmosphere.jpg", "A quiet corner of the Real Numbers office");
  const whyDifferentPhoto = await uploadOnce("img/abstract/sq-8.jpg", "Abstract brand still-life");
  const heroSlideshow = await Promise.all(
    [
      "img/photography/team-hero.jpg",
      "img/photography/about-atmosphere.jpg",
      "img/photography/faq-atmosphere.jpg",
      "img/photography/home-final-cta.jpg",
      "img/photography/contact-hero.jpg",
      "img/photography/why-hero.jpg",
    ].map((p) => uploadOnce(p, "Real Numbers")),
  );

  const teamPhotos: Record<string, { id: number }> = {};
  for (const name of [
    "eran-dor",
    "uzi-baruch",
    "dana-atzmon",
    "shalom-renard",
    "idan-stern",
    "dorit-blit",
    "reila-eliach",
    "yael-korchak",
    "yulia-sytnyk",
  ]) {
    teamPhotos[name] = await uploadOnce(`img/team/${name}.jpg`, name.replace("-", " "));
  }

  console.log("Seeding Branding + Stats...");
  await payload.updateGlobal({
    slug: "branding",
    data: {
      headerLogo: headerLogo.id,
      footerLogo: footerLogo.id,
      footerCopyright: "Real Numbers. All rights reserved.",
    },
  });

  await payload.updateGlobal({
    slug: "stats",
    data: {
      heading: "Proof in numbers",
      stats: [
        { label: "People on the team", value: 12, color: "red" },
        { label: "Years in business", value: 10, color: "blue" },
        { label: "M&A deals", value: 8, color: "jet" },
        { label: "Funds managed ($M)", value: 250, color: "horizon" },
      ],
    },
  });

  console.log("Seeding Client Logos, Testimonials, FAQ Items...");
  const clientLogos = [
    { name: "Fig", logo: figLogo.id },
    { name: "Novee", logo: noveeLogo.id },
    { name: "Lines", logo: linesLogo.id },
  ];
  for (let i = 0; i < clientLogos.length; i++) {
    const existing = await payload.find({ collection: "client-logos", where: { name: { equals: clientLogos[i].name } }, limit: 1 });
    if (!existing.docs.length) {
      await payload.create({ collection: "client-logos", data: { ...clientLogos[i], order: i } });
    }
  }

  const testimonials = [
    {
      quote:
        "Working with Real Numbers has been a real asset for us. Uzi and Eran are thoughtful, precise, and always available when we need them. They understand our business deeply and help turn complex challenges into clear, practical plans. Their team combines the professionalism of a strong finance department with the care and ownership of true partners.",
      name: "Gilad Uziely",
      role: "Get Sequence",
    },
    {
      quote:
        "The Real Numbers team supported us every step of the way, guiding with clarity, strengthening our business model, and responding quickly whenever needed. Their true partnership and personal approach made us feel like the first and only client.",
      name: "Yaniv Nisanboim",
      role: "",
    },
    {
      quote:
        "I've worked with many advisors, but Real Numbers really changed the game. They're that rare mix of professionalism, reliability, and true partnership. With them, I gained clarity, control, and confidence in financial decisions. More than just a service provider, they became a trusted partner to me and the company.",
      name: "Marina",
      role: "VP of Finance and Operations, Astrix",
    },
    {
      quote:
        "As a CEO, trust is everything, especially when it comes to finances. The team at Real Numbers has become a true partner in our journey. They act as real-time advisors for every financial strategy and question, and their proactive approach allows us to focus fully on our customers, confident that Real Numbers has our back at every step. Their professionalism, combined with a level of service that is truly unheard of, sets them apart in every way.",
      name: "Amit Rapaport",
      role: "CEO, Compete",
    },
  ];
  for (let i = 0; i < testimonials.length; i++) {
    const existing = await payload.find({ collection: "testimonials", where: { name: { equals: testimonials[i].name } }, limit: 1 });
    if (!existing.docs.length) {
      await payload.create({ collection: "testimonials", data: { ...testimonials[i], order: i } });
    }
  }

  const faqs = [
    {
      question: "When does a company actually need a CFO?",
      answer:
        "Not every company needs one full-time. But every growing company reaches a point where financial decisions get more complex, the stakes get higher, and instinct alone stops being enough. If you're hiring, raising, entering new markets, or deciding with less visibility than you'd like, it's time.",
    },
    {
      question: "How are you different from a traditional accounting firm?",
      answer:
        "Traditional accounting explains what already happened. We help leadership understand what comes next: clarity, strategic perspective, and executive confidence alongside the accounting itself.",
    },
    {
      question: "Can you work alongside our existing finance team?",
      answer:
        "Yes, it's one of our most common setups. We work alongside internal finance teams, controllers, and accountants, adding executive-level guidance where it's missing rather than replacing anyone.",
    },
    {
      question: "What type of companies do you usually work with?",
      answer:
        "Mostly startups, technology companies, and growth-stage businesses: founders and executive teams who want a partner that understands both the business and the numbers behind it.",
    },
    {
      question: "We're not raising yet. Is this still the right time?",
      answer:
        "Often, yes. This is the ideal time. Fundraising readiness starts long before the first investor conversation. The stronger your foundations today, the more options you'll have when the moment comes.",
    },
    {
      question: "Do you only support fundraising?",
      answer:
        "No, it's one milestone among many. We support every stage of growth: operations, planning, board reporting, strategic decisions, and long-term growth planning.",
    },
    {
      question: "What does onboarding look like?",
      answer:
        "We start by understanding your business: its goals, challenges, priorities, and growth plans. Only then do we recommend a framework. No standard package; every partnership is built around what your company needs.",
    },
    {
      question: "Is your model suitable for companies without an internal finance department?",
      answer:
        "Absolutely. Many of our clients are exactly that. Growing businesses often need executive-level financial expertise well before they need a full-time CFO. Our flexible model gets you there without the overhead.",
    },
    {
      question: "How do you measure success?",
      answer: "Not in reports produced, but in decisions our clients are able to make with them: real clarity, real visibility, real confidence.",
    },
    {
      question: "What should we expect from working with Real Numbers?",
      answer:
        "More than technical expertise: a partner who understands your business, communicates directly, challenges assumptions when it matters, and stays committed past the first engagement. The goal is simple: turn financial complexity into clarity, so leadership spends its time building the business, not decoding a spreadsheet.",
    },
  ];
  for (let i = 0; i < faqs.length; i++) {
    const existing = await payload.find({ collection: "faq-items", where: { question: { equals: faqs[i].question } }, limit: 1 });
    if (!existing.docs.length) {
      await payload.create({ collection: "faq-items", data: { ...faqs[i], order: i } });
    }
  }

  console.log("Seeding Team Members...");
  const leadership = [
    {
      name: "Eran Dor",
      role: "Founder & CEO",
      photo: teamPhotos["eran-dor"].id,
      bio: "A CPA and economist with a 360-degree view of the high-tech industry: auditor, controller, CFO, and investor. Eran has guided hundreds of fundraising processes and prepared companies for IPOs, M&As, and major growth phases. Before founding Real Numbers, he built his career at EY, then served as CFO across cybersecurity and health-tech VCs and startups, experience that gives him a close read on what investors actually expect.",
      education: "B.A. in Accounting and Business Administration, MBA.",
      leadership: true,
    },
    {
      name: "Uzi Baruch",
      role: "Partner, Investor Relations",
      photo: teamPhotos["uzi-baruch"].id,
      bio: "Over 15 years inside Israel's technology and financial ecosystems, working every engagement from both the business and financial side. Before Real Numbers, Uzi led Business Development for KPMG Israel's Technology Practice, with deep focus on mobility and fintech. His path runs through the Israel Securities Authority, American Express, and PwC: investigation, management, and accounting, all in one background.",
      education: "B.A. in Accounting and Business Administration, LLB in Law.",
      leadership: true,
    },
  ];
  const team = [
    {
      name: "Dana Atzmon",
      role: "VP Finance",
      photo: teamPhotos["dana-atzmon"].id,
      bio: "Startup financial management, corporate finance, and financial reporting under US GAAP and IFRS. Dana leads strategic planning and due diligence for growing companies.",
    },
    {
      name: "Shalom Renard",
      role: "Finance Director",
      photo: teamPhotos["shalom-renard"].id,
      bio: "Financial leadership for early-stage and established companies across high-tech, medical, food tech, and SaaS: financial modeling, cash flow, and ERP implementation.",
    },
    {
      name: "Idan Stern",
      role: "Controller",
      photo: teamPhotos["idan-stern"].id,
      bio: "Manages financial operations for Real Numbers clients, including venture capital funds: financial reporting, internal and external audits, full event tracking.",
    },
    {
      name: "Dorit Blit",
      role: "Senior Bookkeeper & Payroll Manager",
      photo: teamPhotos["dorit-blit"].id,
      bio: "Complex payroll and business operations for high-tech companies, with over 10 years across FATCA/CRS implementation and regulatory compliance.",
    },
    {
      name: "Reila Eliach",
      role: "Senior Bookkeeper",
      photo: teamPhotos["reila-eliach"].id,
      bio: "End-to-end bookkeeping across manufacturing, contracting, and startups, with particular strength in high-tech financial services and Priority.",
    },
    {
      name: "Yael Korchak",
      role: "Grant Specialist & Customer Success",
      photo: teamPhotos["yael-korchak"].id,
      bio: "Runs administrative operations and payroll preparation while coordinating clients, suppliers, and banks. Leads Real Numbers' work with the Israeli Innovation Authority.",
    },
    {
      name: "Yulia Sytnyk",
      role: "Financial Operations",
      photo: teamPhotos["yulia-sytnyk"].id,
      bio: "Manages financial processes and payment workflows to keep day-to-day operations running smoothly: precise, detail-driven, client-focused.",
    },
    {
      name: "Haim Dagan",
      role: "Senior Bookkeeper",
      bio: "Financial systems and technology: ERP implementation, U.S. bookkeeping, and digital transformation of accounting processes using Priority and SAP.",
    },
    {
      name: "Lesya Feldman",
      role: "Senior Bookkeeper & Payroll Manager",
      bio: "Over 12 years in advanced bookkeeping and payroll: monthly closings, tax reporting, international payments, and advanced payroll solutions.",
    },
    {
      name: "Sara Kanal",
      role: "Senior Bookkeeper",
      bio: "Comprehensive accounting for startups and corporations: financial reporting, payroll, and international banking reconciliations including SVB and PayPal.",
    },
  ];
  const allTeam = [...leadership, ...team];
  for (let i = 0; i < allTeam.length; i++) {
    const existing = await payload.find({ collection: "team-members", where: { name: { equals: allTeam[i].name } }, limit: 1 });
    if (!existing.docs.length) {
      await payload.create({ collection: "team-members", data: { ...allTeam[i], order: i } });
    }
  }

  console.log("Seeding page Globals...");

  await payload.updateGlobal({
    slug: "home",
    data: {
      sections: [
        {
          blockType: "hero",
          rotatingWords: [{ word: "Numbers." }, { word: "Clarity." }, { word: "Confidence." }],
          description:
            "Real Numbers is a financial partnership platform that backs growing companies and turns financial complexity into clear, confident decisions, at every stage.",
          primaryCtaLabel: "Let's Talk",
          secondaryCtaLabel: "Our Expertise",
          featuredPhoto: {
            heading: "A partnership\nthat works",
            ctaLabel: "Our approach",
            images: heroSlideshow.map((img) => ({ image: img.id })),
          },
          logosStrip: { ctaLabel: "Why Real Numbers" },
        },
        { blockType: "diff", heading: "The numbers that\nmake the difference" },
        { blockType: "stats" },
        { blockType: "divider" },
        { blockType: "cta", heading: "From ambition to\ntangible results", ctaLabel: "Discover more" },
        {
          blockType: "audience",
          heading: "One partnership\nfor every stage of growth",
          areas: [
            { title: "Financial Operations", text: "The foundations every growing business depends on: bookkeeping, payroll, compliance, and control." },
            { title: "Strategic Finance", text: "Turning financial information into business direction: budgeting, forecasting, and board-ready reporting." },
            { title: "Fundraising & Growth", text: "Building the credibility investors expect to see, long before the first pitch deck opens." },
            { title: "Business Performance", text: "Dashboards, profitability analysis, and executive insight that turn data into decisions." },
          ],
        },
        { blockType: "stories", eyebrow: "Client Stories", heading: "What happens when the numbers start working for you" },
      ],
    },
  });

  await payload.updateGlobal({
    slug: "about-page",
    data: {
      hero: {
        eyebrow: "About Real Numbers",
        heading: "We believe every growing company deserves a financial partner it can actually trust",
        lede: "We didn't build Real Numbers to become another accounting firm. We built it because leadership deserves more than accurate reports: it deserves clarity, perspective, honest conversations, and a partner who understands that behind every financial decision sits a business, a team, and a vision worth protecting.",
      },
      ourStory: {
        heading: "Our Story",
        paragraphs: [
          { text: "Every business reaches a point where instinct alone stops being enough. Growth brings new opportunity and greater complexity in the same breath: the questions get more strategic, the risk more consequential, the decisions heavier than they used to be." },
          { text: "That's the gap Real Numbers was built to close: between traditional financial management and strategic business leadership. We work alongside founders and executive teams to turn financial complexity into business clarity, helping companies decide with confidence and build foundations that hold under real growth." },
          { text: "Our role was never just to explain what happened. It's to help leadership understand what comes next." },
        ],
        photos: [{ image: aboutAtmosphere.id }],
        photoCaption: "Where the conversations happen",
      },
      whatWeBelieve: {
        heading: "What We Believe",
        intro: "Every company has numbers. Not every company has clarity. Four principles guide how we work.",
        principles: [
          { lead: "Clarity comes first.", text: "Financial information should simplify leadership, not overwhelm it. Our job is turning complexity into insight you can act on." },
          { lead: "Confidence is earned.", text: "Strong partnerships run on honesty, consistency, and discretion, earned conversation by conversation, decision by decision." },
          { lead: "Growth needs a partner, not a vendor.", text: "We don't sit outside the business looking in. We work inside the decisions that shape where it goes." },
          { lead: "Visibility is a discipline.", text: "We don't optimize only for today's problem. We build the foundations you'll still rely on two years from now." },
        ],
      },
      howWeWork: {
        heading: "How We Work",
        paragraphs: [
          { text: "Every engagement starts with understanding, not a template. Before we build a forecast, dashboard, or model, we learn the business behind the numbers: its ambitions, its pace, its people, and what growth is actually pressuring right now." },
          { text: "Every company deserves a financial framework built around its own journey. As your business evolves, our role evolves with it: building foundations one quarter, preparing a raise the next, sitting in on a decision that has nothing to do with a spreadsheet and everything to do with judgment." },
          { text: "Whatever the challenge, the purpose stays the same: clarity and confidence to move forward." },
        ],
      },
      leadership: {
        heading: "Leadership",
        cards: [
          {
            name: "Eran Dor",
            role: "Founder & CEO",
            bio: "Eran is a CPA and economist who learned finance from the inside before founding Real Numbers, starting at KPMG, then moving client-side through VP Finance and CFO roles, including time at BRM. He founded Real Numbers in 2016 on a simple conviction: growing companies need financial leadership, not just financial reporting. That conviction still shapes how he works: Eran would rather understand what a business actually needs than hand over a standard deliverable, and that instinct sits behind every model, forecast, and board conversation we lead.",
          },
          {
            name: "Uzi Baruch",
            role: "Partner, Client & Investor Relations",
            bio: "Uzi doesn't fit the usual mold of the profession, by design. He trained in accounting and holds a law degree, but built his career on people more than paperwork: first as an investigator at the Israel Securities Authority, then in fintech business development at KPMG, where he built the market relationships and startup-ecosystem knowledge that still shape how we work with founders today. At Real Numbers, Uzi is the reason clients feel looked after rather than processed: he owns the relationship and the responsiveness, so the team stays focused on getting the numbers right.",
          },
        ],
        note: "Eran and Uzi have worked together across more than one chapter of their careers. What carried into Real Numbers is the same division that makes the partnership work: one holds the professional depth, the other makes sure it reaches the people who need it.",
        teamLinkLabel: "Meet the full team",
      },
    },
  });

  await payload.updateGlobal({
    slug: "team-page",
    data: {
      hero: {
        eyebrow: "Our Team",
        heading: "The people behind Real Numbers",
        lede: "Every model, every board deck, every late-night answer to an urgent question: it comes from this team.",
      },
      sectionHeading: "The Team",
      closingCta: {
        heading: "The right people, at every stage of growth",
        closingLine: "Let's talk about what your business needs next.",
        buttonLabel: "Let's Talk",
      },
    },
  });

  await payload.updateGlobal({
    slug: "contact-page",
    data: {
      hero: { eyebrow: "Contact", heading: "Every meaningful partnership starts with a conversation" },
      directContact: { label: "Prefer a direct conversation?", whatsappNumber: "972523735059", email: "Uzi@realnumbers.co.il" },
      manifesto: {
        heading: "Real Numbers. Built on trust. Driven by clarity. Focused on growth",
        text: "That's why Real Numbers exists. And that's how we help businesses grow.",
      },
    },
  });

  await payload.updateGlobal({
    slug: "why-real-numbers-page",
    data: {
      hero: {
        eyebrow: "Why Real Numbers",
        heading: "Financial leadership was never really about numbers. It's about helping leaders make better decisions",
        ledeParagraphs: [
          { text: "The most valuable financial conversations rarely start with a spreadsheet. They start with questions: Where are we today? What are we missing? Can we afford the next step? Should we raise now, or wait?" },
          { text: "The answers shape the future of the business. Our role is helping leadership answer them with clarity, confidence, and perspective." },
        ],
      },
      whyChooseUs: {
        heading: "Why companies choose us",
        paragraphs: [
          { text: "Choosing a financial partner is one of the most consequential decisions a growing business makes, not because of bookkeeping or compliance, but because the quality of financial leadership shapes every decision that follows it." },
          { text: "Most companies end up choosing between two extremes: a large, generalist firm that sees them as one account among hundreds, or a technical bookkeeper who can close the books but can't sit at the leadership table. Neither is built for the moment finance becomes strategy." },
          { text: "Real Numbers is built for what sits between them: companies who need more than a service provider but aren't ready for (or don't need) a full internal finance department. Trusted thinking, strategic perspective, and a partner still in the room a year from now, not just at signing." },
        ],
      },
      valueProps: [
        {
          title: "Startup Mindset",
          paragraph1: "We understand how founders think, because we work inside that world every day. Startups don't move in straight lines: priorities shift overnight, markets move faster than plans, funding timelines compress without warning.",
          paragraph2: "Our role isn't slowing you down with process. It's building the clarity that lets leadership move faster, with confidence instead of guesswork.",
        },
        {
          title: "Strategic Thinking",
          paragraph1: "Numbers only matter when they change a decision. Financial reports explain the past; strategic finance shapes what's next. We connect financial insight to business strategy, not just what happened, but what it means and what should happen because of it.",
          paragraph2: "Information only becomes valuable the moment it drives action.",
        },
        {
          title: "Hands-on Partnership",
          paragraph1: "Great partnerships aren't measured by how many meetings happen, they're measured by what gets said in them.",
          paragraph2: "Our clients don't treat us as an outside advisor looped in occasionally. They bring us into planning, board meetings, fundraising, hiring, expansion. They know we'll bring honest, practical thinking to the table, not a status update. We become part of how leadership decides. Not a report that arrives after the decision's made.",
        },
        {
          title: "Built for Long-Term Growth",
          paragraph1: "Today's decisions should hold up under tomorrow's ambitions. Our responsibility doesn't end at this quarter's problem. We build financial frameworks that keep supporting growth as the business changes shape: operational foundations, executive reporting, fundraising prep, strategic planning, the first five hires through international expansion.",
          paragraph2: "Every recommendation is made with the next stage already in mind. The goal was never to fix today. It's to be right about tomorrow.",
        },
      ],
      whatMakesDifferent: {
        heading: "What makes the partnership different",
        paragraphs: [
          { text: "Clarity changes what happens next: decisions move faster, communication gets stronger, planning gets more accurate, investors trust the numbers behind the story, and teams align around information instead of instinct." },
          { text: "That's the value we aim to create: every engagement, every quarter, every board deck." },
        ],
        photos: [{ image: whyDifferentPhoto.id }],
      },
      closingCta: {
        heading: "Better financial decisions begin with better conversations",
        closingLine: "Let's start one.",
        buttonLabel: "Let's Talk",
      },
    },
  });

  await payload.updateGlobal({
    slug: "our-expertise-page",
    data: {
      hero: {
        eyebrow: "Our Expertise",
        heading: "The right expertise at every stage of growth",
        ledeParagraphs: [
          { text: "Every growing business hits a different financial challenge at a different moment: stronger operations, strategic leadership in the room, fundraising readiness, or infrastructure for scale it hasn't hit yet." },
          { text: "Our expertise is built as one connected financial ecosystem, supporting leadership from daily operations to the company's most consequential decisions." },
        ],
      },
      areas: [
        {
          title: "Financial Operations",
          tagline: "Build confidence from the ground up.",
          paragraphs: [{ text: "Strong businesses run on strong financial foundations: not exciting, but non-negotiable. Financial Operations keeps every process accurate, compliant, and scalable, giving leadership full visibility into the real health of the business, and structure to grow without losing control of what's underneath it." }],
          services: ["Bookkeeping", "Payroll", "Financial Statements", "Tax Compliance & Reporting", "Accounts Payable & Receivable", "Cash Flow Management", "Financial Controls"].map((label) => ({ label })),
        },
        {
          title: "Strategic Finance",
          tagline: "Turning financial information into business direction.",
          paragraphs: [
            { text: "As companies grow, finance moves from the edge of strategic conversations to the center of them. We connect financial insight to business planning: sharper budgeting and forecasting, KPI frameworks that mean something, board reporting that earns trust, strategy grounded in real numbers." },
            { text: "Numbers should guide leadership. Not overwhelm it." },
          ],
          services: ["Fractional CFO", "Budget Planning", "Forecasting", "Financial Planning", "KPI Frameworks", "Executive Reporting", "Scenario Planning", "Decision Support"].map((label) => ({ label })),
        },
        {
          title: "Fundraising & Growth",
          tagline: "Building credibility before you meet a single investor.",
          paragraphs: [
            { text: "Fundraising starts long before the first pitch deck opens. We build the financial foundations investors expect to see, the kind that hold up through the entire process, not just the room." },
            { text: "Whether you're preparing for Seed, Series A, or your next milestone, we help leadership tell a financial story investors trust because it's true, not just polished." },
          ],
          services: ["Financial Models", "Investor Materials", "Due Diligence Preparation", "Valuation Support", "Capital Planning", "Growth Planning", "M&A Financial Support"].map((label) => ({ label })),
        },
        {
          title: "Business Performance",
          tagline: "Make every number mean something.",
          paragraphs: [{ text: "Data creates value the moment it changes a decision. We turn financial information into clear insight: performance dashboards, profitability analysis, runway monitoring, executive reporting, built so leadership spots opportunity and manages risk without waiting for next quarter to explain what already happened." }],
          services: ["KPI Reporting", "Performance Dashboards", "Business Analysis", "Profitability Analysis", "Unit Economics", "Budget vs. Actual", "Cash Runway Monitoring", "Executive Insights"].map((label) => ({ label })),
        },
      ],
      integrated: {
        heading: "One integrated financial partnership",
        text: "Each area creates value alone. Together, they're one connected financial framework supporting leadership at every stage: one partner who sees the whole business, instead of four providers each holding a piece of a picture no one sees whole.",
        photos: [{ image: expertiseAtmosphere.id }],
        photoCaption: "The work behind the clarity",
      },
      closingCta: {
        heading: "Whatever stage your business is in, we'll help you prepare for what's next",
        closingLine: "Let's build clarity. Let's build confidence. Let's build growth that lasts.",
        buttonLabel: "Let's Talk",
      },
    },
  });

  await payload.updateGlobal({
    slug: "use-cases-page",
    data: {
      hero: {
        eyebrow: "Use Cases",
        heading: "Different companies. Different challenges. One trusted financial partner",
        lede: "Some are preparing to raise. Others are scaling faster than their systems can handle. Some need sharper visibility. Others are gearing up for international growth. The challenges vary. The need underneath doesn't: clear financial insight, so leadership decides with confidence instead of guesswork.",
      },
      atmospherePhotos: [{ image: usecasesAtmosphere.id }],
      atmospherePhotoCaption: "Every stage looks different",
      situationsIntro: "Some of the situations that typically bring companies to Real Numbers:",
      situations: [
        { question: "\"We're growing faster than our financial infrastructure.\"", answer: "Growth exposes gaps in process, reporting, and decision-making fast. When the business outpaces the finance function, leadership loses visibility right when it matters most. We build foundations that scale alongside the business, without slowing it down." },
        { question: "\"We need strategic financial leadership, but not a full-time CFO.\"", answer: "Financial decisions get more sophisticated before a full-time executive hire makes sense. Our Fractional CFO model gives leadership experienced guidance exactly when it's needed, not on a headcount timeline." },
        { question: "\"We're preparing to raise investment.\"", answer: "Fundraising begins long before the first investor meeting: strong reporting, reliable forecasts, assumptions that hold up, models that read as credible, not hopeful. We build what investors expect to see before they ask for it." },
        { question: "\"We need better visibility into our business.\"", answer: "Leadership shouldn't decide on incomplete information. We build the reporting frameworks, dashboards, and performance visibility that show clearly where the business stands, and where it's heading." },
        { question: "\"We've outgrown traditional accounting.\"", answer: "Growth needs strategic thinking, financial planning, scenario analysis, real business insight, right where a traditional bookkeeper's role usually ends. That's where ours begins." },
        { question: "\"We're entering a new stage of growth.\"", answer: "International expansion, rapid hiring, a new product line, a possible acquisition. Every new stage needs stronger financial infrastructure than the last one did. We help businesses prepare before complexity becomes a crisis." },
        { question: "\"We need someone who understands both finance and business.\"", answer: "Technical expertise matters. Business judgment matters more. We connect financial knowledge to strategic thinking, so leadership understands not just the number, but what it means for the decision in front of them." },
      ],
      closingCta: {
        heading: "If one of these sounds familiar, let's talk. Every business deserves financial clarity before its next important decision, not after",
        buttonLabel: "Let's Talk",
      },
    },
  });

  await payload.updateGlobal({
    slug: "questions-founders-ask-page",
    data: {
      hero: { eyebrow: "Questions Founders Ask", heading: "Honest answers to the questions we hear most, before we start working together" },
      atmospherePhotos: [{ image: faqAtmosphere.id }],
    },
  });

  console.log("Seed complete.");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
