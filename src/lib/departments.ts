export type Division =
  | "Policing"
  | "Fire & rescue"
  | "Medical"
  | "Roads"
  | "Maritime"
  | "Military"
  | "Oversight"
  | "Government"
  | "Justice"
  | "Civilian";

export type Unit = {
  /** Short designation shown as a badge, e.g. "MO8", "HART". */
  code?: string;
  name: string;
  description?: string;
  /** In-game callsign or callsign range, e.g. "CE-XXX" or "C-550 to C-574". */
  callsign?: string;
  /** Who can join, e.g. "Whitelisted". */
  access?: string;
};

export type Department = {
  slug: string;
  abbr: string;
  name: string;
  division: Division;
  /** Shown in the home page grid. The rest only appear on /departments. */
  featured?: boolean;
  /**
   * White-on-dark PNG built by scripts/build-logos.cjs from assets/department-logos.
   * `scale` enlarges marks that look small at a shared height (round badges, flags).
   * Leave out for departments with no official logo; a white text mark is shown instead.
   */
  logo?: { src: string; width: number; height: number; scale?: number };
  /** One-liner for the list and grid. */
  summary: string;
  /** Longer copy for the popup. */
  about: string[];
  roles: string[];
  units: Unit[];
  /** Optional "how do I get in" note shown under the units. */
  joining?: { question: string; answer: string };
  /** In-game screenshots for the popup. Empty slots render as placeholders. */
  gallery: { src: string; alt: string }[];
};

export const departments: Department[] = [
  {
    slug: "met",
    abbr: "MPS",
    name: "Metropolitan Police Service",
    division: "Policing",
    featured: true,
    logo: { src: "/departments/met.png", width: 640, height: 172 },
    summary:
      "The backbone of every session. Response teams take the 999 calls, Roads & Transport Policing handle pursuits and traffic, and the TSG steps in when things escalate.",
    about: [
      "The Met is the largest department in UKCW and the one most new members start in. Frontline officers take calls from the moment a session opens: domestics, shoplifters, collisions, and whatever else the city throws up.",
      "Once you've graduated as a constable, the Met Operations commands open up: roads policing, firearms, protection and the Taskforce. Each has its own training, kit and callsigns.",
    ],
    roles: ["Frontline policing", "Roads & transport", "Firearms", "Protection", "Taskforce"],
    units: [
      {
        code: "ERPT",
        name: "Frontline Policing",
        description: "Emergency Response & Patrol Teams. First on scene to most calls. Constables and below.",
        access: "Non-Whitelisted",
        callsign: "CE-XXX",
      },
      {
        code: "MO8",
        name: "Roads & Transport Policing Command",
        description: "Traffic enforcement, pursuits and serious collisions.",
        access: "Whitelisted",
        callsign: "OC-XXX",
      },
      {
        code: "MO19",
        name: "Specialist Firearms Command",
        description: "Authorised Firearms Officers crewing Trojan armed response cars.",
        access: "Whitelisted",
        callsign: "TJ-XX",
      },
      {
        code: "SO14",
        name: "Royalty & Specialist Protection",
        description: "Close protection for royalty and high-profile figures.",
        access: "Whitelisted",
        callsign: "SO-XXX",
      },
      {
        code: "MO7",
        name: "Taskforce: TSG & Dog Support Unit",
        description: "Territorial Support Group for public order and high-risk arrests, and the Dog Support Unit.",
        access: "Whitelisted",
        callsign: "U-XXX",
      },
    ],
    joining: {
      question: "How do I join Met Operations?",
      answer:
        "Become a constable and graduate from HCoP first. After that you can apply to a command, or be handpicked.",
    },
    gallery: [],
  },
  {
    slug: "colp",
    abbr: "CoLP",
    name: "City of London Police",
    division: "Policing",
    featured: true,
    logo: { src: "/departments/colp.png", width: 640, height: 235 },
    summary:
      "Responsible for the Square Mile. Smaller and tighter than the Met, with a focus on the financial district, protective security and fraud.",
    about: [
      "CoLP polices the Square Mile, the financial heart of the map. It's a smaller force than the Met, which means you get to know everyone you work with and have more room to take the lead.",
      "Expect protective security around high-value sites, checkpoint work on the Ring of Steel, and longer-running economic crime investigations alongside everyday response.",
    ],
    roles: ["City response", "Economic crime", "Ring of Steel checkpoints"],
    // Awaiting info from the department.
    units: [],
    gallery: [],
  },
  {
    slug: "lfb",
    abbr: "LFB",
    name: "London Fire Brigade",
    division: "Fire & rescue",
    featured: true,
    logo: { src: "/departments/lfb.png", width: 555, height: 240 },
    summary:
      "Structure fires, collisions with people trapped, hazardous materials and technical rescue. Crews work incidents from first arrival to handover.",
    about: [
      "LFB crews respond to anything that burns, collapses or traps people. You'll work as a watch, with an officer in charge running the incident and crews given clear tasks.",
      "Fires are only part of the job. Road traffic collisions, water rescues and hazmat spills make up a big share of LFB's calls in a session.",
    ],
    roles: ["Firefighter", "Rescue", "Incident command"],
    // Awaiting info from the department.
    units: [],
    gallery: [],
  },
  {
    slug: "las",
    abbr: "LAS",
    name: "London Ambulance Service",
    division: "Medical",
    featured: true,
    logo: { src: "/departments/las.png", width: 640, height: 154 },
    summary:
      "Patient care on scene and en route. Paramedics triage, treat and convey, working alongside police and fire at every major incident.",
    about: [
      "LAS crews treat and transport casualties, from a single injured pedestrian to a major incident with dozens of patients to triage.",
      "Good medical roleplay is about assessment and communication: clear handovers, calm patients and working safely inside a scene that police or fire control.",
    ],
    roles: ["Emergency ambulance", "Rapid response", "HART", "Critical care"],
    units: [
      {
        name: "Emergency Ambulance",
        description: "Double-crewed ambulances that assess, treat and convey patients.",
        callsign: "C-550 to C-574",
      },
      {
        name: "Fast Response Unit",
        description: "Solo clinician in a car, first on scene to the most serious calls.",
        callsign: "C-575 to C-599",
      },
      {
        code: "RRV",
        name: "Rapid Response Vehicle",
        description: "Rapid response cars that get a clinician to the patient ahead of an ambulance.",
        callsign: "F-101 to F-119",
      },
      {
        code: "HART",
        name: "Hazardous Area Response Team",
        description: "Treats patients inside hazardous scenes: collapses, height, water and hazmat.",
        callsign: "RT-01 to RT-10",
      },
      {
        code: "IRO",
        name: "Incident Response Officer",
        description: "Incident response vehicle. Takes charge of the ambulance response at larger scenes.",
        callsign: "IR02 to IR08",
      },
      {
        code: "OC",
        name: "Operational Command",
        description: "Senior operational commanders for major incidents.",
        callsign: "OD02 to OD08",
      },
      {
        code: "CC",
        name: "Advanced Paramedic (Critical Care)",
        description: "Critical care paramedics for the sickest and most seriously injured patients.",
        callsign: "CC-01 to CC-10",
      },
      {
        code: "HEMS",
        name: "Advanced Trauma Team",
        description: "Helicopter emergency medical service for major trauma.",
      },
      {
        code: "LAA",
        name: "Physician Response Unit",
        description: "London's Air Ambulance doctor and paramedic car.",
      },
      {
        code: "NEPTS",
        name: "Non-Emergency Patient Transport",
        description: "Planned, non-urgent patient transport.",
      },
    ],
    gallery: [],
  },
  {
    slug: "nca",
    abbr: "NCA",
    name: "National Crime Agency",
    division: "Policing",
    featured: true,
    logo: { src: "/departments/nca.png", width: 640, height: 236 },
    summary:
      "Plain-clothes investigations into organised crime. Long-running operations, surveillance and planned warrants rather than blue-light response.",
    about: [
      "The NCA goes after the people at the top of organised crime. Work is slower and more deliberate than response policing: build the intelligence, watch the targets, then move when the case is ready.",
      "Operations often run across several sessions and end in a planned warrant with support from other departments.",
    ],
    roles: ["Investigations", "Surveillance", "Armed operations"],
    // Awaiting info from the department.
    units: [],
    gallery: [],
  },
  {
    slug: "nh",
    abbr: "NH",
    name: "National Highways",
    division: "Roads",
    featured: true,
    logo: { src: "/departments/nh.png", width: 640, height: 187 },
    summary:
      "Traffic Officers keep the strategic road network moving: rolling roadblocks, lane closures, breakdowns and scene protection for emergency services.",
    about: [
      "National Highways Traffic Officers keep the major roads flowing. You'll set up closures, protect crashed vehicles, clear debris and hold traffic back so other services can work safely.",
      "It's a department for people who like planning and positioning. Good traffic management makes every other department's job easier.",
    ],
    roles: ["Traffic officer", "Incident support"],
    // Awaiting info from the department.
    units: [],
    gallery: [],
  },
  {
    slug: "rnli",
    abbr: "RNLI",
    name: "Royal National Lifeboat Institution",
    division: "Maritime",
    featured: true,
    logo: { src: "/departments/rnli.png", width: 360, height: 240, scale: 1.1 },
    summary:
      "Search and rescue on the Thames. Lifeboat crews respond to people in the water, vessels in difficulty and anything else the river throws at them.",
    about: [
      "The RNLI covers the river. Crews launch to people in the water, boats in difficulty and searches along the banks, often working with the Met's Marine Policing Unit and LAS.",
      "The Thames stations are among the busiest in the country, and in UKCW they get plenty of work.",
    ],
    roles: ["Helm", "Crew", "Water search"],
    // Awaiting info from the department.
    units: [],
    gallery: [],
  },
  {
    slug: "ctsfo",
    abbr: "CTSFO",
    name: "Counter Terrorist Specialist Firearms Officers",
    division: "Policing",
    featured: true,
    logo: { src: "/departments/ctsfo.png", width: 192, height: 240, scale: 1.3 },
    summary:
      "The highest tier of armed response. Deployed to marauding attacks, hostage situations and pre-planned high-risk entries.",
    about: [
      "CTSFOs are the most highly trained firearms officers in the country. They deploy to the incidents nobody else can handle: marauding terrorist attacks, hostage situations and high-risk planned entries.",
      "Entry is selective. Most CTSFOs come up through the Met and ARVs first, and the department runs its own assessments.",
    ],
    roles: ["Firearms", "Method of entry", "Tactical medic"],
    units: [
      {
        code: "MO19",
        name: "Specialist Firearms Command",
        description: "The Met command that CTSFO, SFO and ARV teams all belong to.",
      },
      {
        code: "ARV",
        name: "Armed Response Vehicle",
        description: "First armed response to spontaneous firearms incidents.",
      },
      {
        code: "SFO",
        name: "Specialist Firearms Officer",
        description: "Planned operations, containments and armed arrests.",
      },
      {
        code: "CTSFO",
        name: "Counter Terrorist SFO",
        description: "Counter-terror response, hostage rescue and dynamic entry.",
      },
    ],
    gallery: [],
  },

  /* ---- Placeholders: listed on /departments only, details to follow ---- */
  {
    slug: "army",
    abbr: "Army",
    name: "British Army",
    division: "Military",
    logo: { src: "/departments/army.png", width: 267, height: 240, scale: 1.2 },
    summary: "More details coming soon.",
    about: [],
    roles: [],
    units: [],
    gallery: [],
  },
  {
    slug: "sgc",
    abbr: "SGC",
    name: "Sportsman Gun Centre",
    division: "Civilian",
    summary: "More details coming soon.",
    about: [],
    roles: [],
    units: [],
    gallery: [],
  },
  {
    slug: "iopc",
    abbr: "IOPC",
    name: "Independent Office for Police Conduct",
    division: "Oversight",
    logo: { src: "/departments/iopc.png", width: 640, height: 129 },
    summary: "More details coming soon.",
    about: [],
    roles: [],
    units: [],
    gallery: [],
  },
  {
    slug: "hmps",
    abbr: "HMPS",
    name: "HM Prison Service",
    division: "Justice",
    logo: { src: "/departments/hmps.png", width: 530, height: 240, scale: 1.35 },
    summary: "More details coming soon.",
    about: [],
    roles: [],
    units: [],
    gallery: [],
  },
  {
    slug: "home-office",
    abbr: "HO",
    name: "Home Office",
    division: "Government",
    logo: { src: "/departments/homeoffice.png", width: 554, height: 240, scale: 1.35 },
    summary: "More details coming soon.",
    about: [],
    roles: [],
    units: [],
    gallery: [],
  },
  {
    slug: "coroner",
    abbr: "Coroner",
    name: "HM Coroner's Service",
    division: "Justice",
    summary: "More details coming soon.",
    about: [],
    roles: [],
    units: [],
    gallery: [],
  },
  {
    slug: "cwr",
    abbr: "CWR",
    name: "Canary Wharf Recovery",
    division: "Civilian",
    summary: "More details coming soon.",
    about: [],
    roles: [],
    units: [],
    gallery: [],
  },
];

export const featuredDepartments = departments.filter((d) => d.featured);
