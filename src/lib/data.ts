export const portfolioData = {
  name: "Mohamed El Amine Benoumessad",
  title: "AI Engineer — Applied AI in Security Engineering",
  email: "benoumessadmohamedelamine@gmail.com",
  phone: "+213 775 056 465",
  location: "Boumerdès, Algeria",
  socials: {
    linkedin: "benoumessad-mohamed-el-amine",
    github: "benoumessad-mohamed-el-amine",
  },
  about: [
    "AI engineer building agentic and machine-learning systems, with a focus on LLM agents, multi-agent pipelines and anomaly detection.",
    "Background in security engineering, which I apply to making AI systems reliable and safe to deploy. Open to relocation within Europe.",
  ],
  education: [
    {
      degree: "Master's in Applied Artificial Intelligence",
      institution: "M'Hamed Bougara University of Boumerdès (UMBB)",
      duration: "2026 – Present",
    },
    {
      degree: "Bachelor's in Computer Science (Information Systems)",
      institution: "M'Hamed Bougara University of Boumerdès (UMBB)",
      duration: "2023 – 2026",
    },
  ],
  experience: [
    {
      role: "Cybersecurity & AI Engineering Intern",
      company: "Soficlef",
      location: "Algeria",
      period: "Jan 2026 – Jun 2026",
      points: [
        "Designed and deployed Sentinel Flow — a dual-engine NIDS combining a 4-tier signature rule set with a Scikit-learn anomaly detection pipeline trained on live packet telemetry.",
        "Built a hardened Django backend to ingest, parse and inspect network packet streams with low latency.",
      ],
    },
    {
      role: "Server Infrastructure Security Audit Intern",
      company: "Société Badis",
      location: "Algeria",
      period: "Aug 2026 – Sep 2026",
      points: [
        "Audited production servers against CIS benchmarks, identifying 32 misconfigurations (5 high severity).",
        "Wrote remediation playbooks to standardize security posture across infrastructure.",
      ],
    },
    {
      role: "Cybersecurity Department Lead & Instructor",
      company: "DevUp Scientific Club, UMBB",
      location: "Boumerdès, Algeria",
      period: "2025 – Present",
      points: [
        "Lead the cybersecurity department and teach threat mitigation fundamentals to 23 students through hands-on workshops.",
      ],
    },
  ],
  skillCategories: [
    {
      title: "AI & Agentic Systems",
      skills: [
        "LangGraph",
        "LangChain",
        "Ollama",
        "MCP",
        "Scikit-learn",
        "PyTorch",
        "TensorFlow",
        "NLP",
        "Anomaly Detection",
      ],
    },
    {
      title: "Engineering",
      skills: [
        "Python",
        "TypeScript",
        "JavaScript",
        "Bash",
        "C",
        "Django",
        "Flask",
        "Express",
        "REST APIs",
        "Docker",
        "Linux",
        "Git",
      ],
    },
    {
      title: "Security",
      skills: [
        "NIDS",
        "SOAR",
        "Wireshark",
        "Nmap",
        "Scapy",
        "Metasploit",
        "Pentesting",
        "Web Audit",
        "Network Audit",
        "CTF",
      ],
    },
  ],
  projects: [
    {
      title: "firewall-warden: Deterministic Firewall for AI Agent Tool Calls",
      description:
        "Open-source Node.js firewall that vets every agent tool call with a deterministic classifier (25 threat families) and policy engine, returning allow/block verdicts in ~58µs. Includes MCP proxy and cross-call taint tracking.",
      tags: ["AI Security", "Node.js", "MCP", "Agentic Systems"],
      link: "https://github.com/benoumessad-mohamed-el-amine/firewall-warden",
    },
    {
      title: "SilentFracture: SOAR Platform",
      description:
        "Real-time log ingestion pipelines with automated containment scripts for threat remediation, built as part of a 4-person team.",
      tags: ["SOAR", "Security", "Python", "Automation"],
      link: "https://github.com/benoumessad-mohamed-el-amine",
    },
    {
      title: "NetSpectorPro: Automated PCAP & Network Log Triage",
      description:
        "Client-side open-source triage tool with statistical C2 beaconing detection, Shannon entropy analysis and TCP state auditing.",
      tags: ["Network Security", "PCAP", "Python", "Open Source"],
      link: "https://github.com/benoumessad-mohamed-el-amine",
    },
    {
      title: "Product Intelligence System: Multi-Agent Market Analysis",
      description:
        "LangGraph/LangChain multi-agent pipeline that parses unstructured product PDFs to generate market viability and pricing models.",
      tags: ["LangGraph", "LangChain", "Multi-Agent", "AI"],
      link: "https://github.com/benoumessad-mohamed-el-amine",
    },
  ],
  aiResearch: [
    {
      title: "Shellmates mini CTF — 3rd Place Overall",
      description:
        "Competed in Shellmates mini CTF at ESI Algiers, placing 3rd overall across all challenge categories.",
      tags: ["CTF", "Security", "Competitive"],
      link: "#",
    },
    {
      title: "InnoByte 2.0 — SecDevOps Hackathon Finalist",
      description:
        "Finalist at InnoByte 2.0 hackathon at ESTIN Béjaïa, competing in the SecDevOps track.",
      tags: ["Hackathon", "SecDevOps", "Finalist"],
      link: "#",
    },
    {
      title: "Hackini 2.0 — Pentest CTF Competitor",
      description:
        "Competed in Hackini 2.0 pentest-focused CTF at ESI Algiers, applying offensive security skills in a competitive environment.",
      tags: ["CTF", "Pentesting", "Offensive Security"],
      link: "#",
    },
  ],
  languages: [
    { name: "Arabic", level: "Native", percentage: 100 },
    {
      name: "English",
      level: "B2 – Upper Intermediate",
      percentage: 75,
    },
    {
      name: "French",
      level: "B2 – Upper Intermediate",
      percentage: 75,
    },
  ],
  philosophy:
    "Building AI systems that are not just capable, but trustworthy — Applying Zero Trust from the kernel up — avoiding opaque software I can't inspect under the hood.",
};
