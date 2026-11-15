export interface ServiceItem {
  slug: string;
  title: string;
  icon: string;
  tag: string;
  tagColor: string;
  turnaround: string;
  rating: string;
  reviewsCount: number;
  shortDesc: string;
  fullDesc: string;
  doorstepFeasible: boolean;
  warranty: string;
  symptoms: string[];
  process: string[];
  faqs: { q: string; a: string }[];
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    slug: "display-replacement",
    title: "Display Replacement",
    icon: "📱",
    tag: "5% OFF OEM",
    tagColor: "bg-emerald-600",
    turnaround: "30 mins",
    rating: "4.9 ★",
    reviewsCount: 312,
    shortDesc: "Glass, touch & lines fixed with OEM-grade OLED / LCD panels.",
    fullDesc: "Restore your smartphone display to factory clarity. We replace cracked outer glass, damaged touch digitizers, blank displays, and OLED vertical color lines right in front of you at your doorstep in Manikonda.",
    doorstepFeasible: true,
    warranty: "Up to 6 Months Warranty",
    symptoms: [
      "Cracked or shattered front glass",
      "Touch screen unresponsive or ghost touching",
      "Green, white, or pink vertical display lines",
      "Black screen with phone vibrating (dead OLED)",
      "Ink bleed spots spreading across the screen"
    ],
    process: [
      "Doorstep diagnosis and frame inspection",
      "Precision screen separation and dust cleanup",
      "Testing of replacement panel touch & brightness",
      "OEM adhesive gasket sealing and reassembly",
      "Final touch calibration and warranty card issue"
    ],
    faqs: [
      {
        q: "Is display replacement done at my doorstep?",
        a: "Yes! 95% of smartphone display replacements are completed in 30 minutes in our technician's mobile repair kit at your home or office."
      },
      {
        q: "Will my phone data remain safe?",
        a: "Absolutely. Screen replacement is a hardware-only procedure. Your photos, WhatsApp, and private apps remain untouched, and we never ask for your device passcode."
      }
    ]
  },
  {
    slug: "battery-replacement",
    title: "Battery Replacement",
    icon: "🔋",
    tag: "Popular",
    tagColor: "bg-accent-500",
    turnaround: "20 mins",
    rating: "4.9 ★",
    reviewsCount: 245,
    shortDesc: "High-capacity certified battery for fast drain & heating issues.",
    fullDesc: "Get all-day battery life back. Our certified technicians replace degraded or swollen batteries using fresh grade-A cells with integrated overload and short-circuit protection.",
    doorstepFeasible: true,
    warranty: "Up to 8 Months Warranty",
    symptoms: [
      "Battery drains from 100% to 20% in just a few hours",
      "Phone shuts down abruptly when opening the camera or calling",
      "Back panel lifting or bulging due to swollen battery",
      "Phone gets abnormally hot during normal browsing or charging"
    ],
    process: [
      "Battery health and charging cycle diagnosis",
      "Safe thermal removal of degraded battery pack",
      "Cleaning internal adhesive residue",
      "Installation of brand-new certified battery with stretch pull-tabs",
      "Charging amperage load test and warranty activation"
    ],
    faqs: [
      {
        q: "How long does doorstep battery replacement take?",
        a: "Between 15 to 25 minutes depending on the phone model."
      },
      {
        q: "Do you supply original batteries?",
        a: "We provide OEM-certified batteries manufactured with grade-A lithium-ion/polymer cells meeting exact factory mAh specifications."
      }
    ]
  },
  {
    slug: "charging-port-repair",
    title: "Charging Port Repair",
    icon: "⚡",
    tag: "Doorstep",
    tagColor: "bg-blue-600",
    turnaround: "25 mins",
    rating: "4.8 ★",
    reviewsCount: 168,
    shortDesc: "Loose pin, slow charging or moisture detection alert fixed.",
    fullDesc: "Resolve loose charging cables, intermittent connections, burnt connector pins, and faulty sub-board charging flexes with genuine replacement modules.",
    doorstepFeasible: true,
    warranty: "3 Months Warranty",
    symptoms: [
      "Cable needs to be angled or held tightly to charge",
      "Persistent 'Moisture detected in charging port' alert",
      "Super-slow charging (taking 4+ hours for full charge)",
      "Computer fails to recognize phone when connected via USB"
    ],
    process: [
      "Port microscope inspection and debris extraction",
      "Voltage and current pin conductivity test",
      "Sub-board module replacement or micro-soldering pin fix",
      "Fast charging protocol verification (Dash, VOOC, PD)"
    ],
    faqs: [
      {
        q: "Can lint or dust be cleaned without replacing the port?",
        a: "Yes! During our free initial inspection, if the issue is just accumulated pocket lint, our technician cleans it professionally without charging for part replacement."
      },
      {
        q: "What types of charging ports do you repair at doorstep?",
        a: "We service USB Type-C, Apple Lightning, and micro-USB ports across all major brands including Apple, Samsung, OnePlus, Vivo, Oppo, and Xiaomi."
      }
    ]
  },
  {
    slug: "software-repair",
    title: "Software Repair & Unlocking",
    icon: "💻",
    tag: "OS / Unlock",
    tagColor: "bg-indigo-600",
    turnaround: "30 mins",
    rating: "4.9 ★",
    reviewsCount: 120,
    shortDesc: "Continuous boot loop, frozen logo, and corrupted firmware recovery.",
    fullDesc: "Expert software restoration for Android and iOS devices. We fix recurring boot loops, bricked phones, system UI crashes, and recovery errors.",
    doorstepFeasible: true,
    warranty: "Service Guarantee",
    symptoms: [
      "Phone repeatedly restarts and gets stuck on Apple / Samsung logo",
      "System UI keeps crashing with black screen",
      "Failed OS update resulting in bricked device",
      "Storage full error preventing phone from booting up"
    ],
    process: [
      "Firmware version & bootloader diagnostics",
      "Data-preserving software recovery attempt where feasible",
      "Clean official OS flashing via diagnostic software",
      "Post-boot verification and stability benchmarking"
    ],
    faqs: [
      {
        q: "Will my photos and contacts be erased during software fix?",
        a: "We always attempt non-destructive recovery first. If complete factory flashing is required, our technician discusses it with you beforehand."
      },
      {
        q: "How long does software recovery take?",
        a: "Most boot loop recoveries and official OS restorations take between 20 to 35 minutes."
      }
    ]
  },
  {
    slug: "hardware-repair",
    title: "Hardware & Board Repair",
    icon: "🔧",
    tag: "Mic / Cam",
    tagColor: "bg-slate-700",
    turnaround: "30–45 mins",
    rating: "4.9 ★",
    reviewsCount: 142,
    shortDesc: "Speaker, microphone, camera module & motherboard IC repairs.",
    fullDesc: "Component-level repairs for smartphone ear speakers, loud ringers, primary microphones, vibration motors, camera stabilization modules, and power/volume buttons.",
    doorstepFeasible: true,
    warranty: "Up to 3 Months Warranty",
    symptoms: [
      "Callers cannot hear you (broken primary microphone)",
      "Earpiece volume is extremely faint during calls",
      "Rear camera vibrates violently or shows blurry image",
      "Power button or volume rocker stuck and unresponsive"
    ],
    process: [
      "Multi-meter hardware diagnostic test",
      "Disassembly of internal chassis and component isolation",
      "Replacement with tested OEM module",
      "Full hardware functional test"
    ],
    faqs: [
      {
        q: "Can camera lenses be replaced separately without replacing the whole camera?",
        a: "Yes! If only the outer glass lens is cracked and the inner sensor is intact, we replace just the sapphire/glass lens for a fraction of the cost."
      },
      {
        q: "Can earpiece and speaker issues be fixed at doorstep?",
        a: "Yes! Speaker mesh ultrasonic cleaning and module replacements are routinely performed in 30 minutes at your home."
      }
    ]
  },
  {
    slug: "water-damage-diagnosis",
    title: "Water Damage Diagnosis",
    icon: "💧",
    tag: "Diagnosis-First",
    tagColor: "bg-amber-600",
    turnaround: "Lab Pickup Required",
    rating: "4.9 ★",
    reviewsCount: 95,
    shortDesc: "Chemical ultrasonic bath & motherboard short-circuit diagnosis.",
    fullDesc: "Crucial note: Water damage requires specialized ultrasonic baths and thermal camera short-circuit diagnosis in our Manikonda workshop. We arrange doorstep pickup and deliver it back safely.",
    doorstepFeasible: false, // In alignment with PRD rule: do not guarantee doorstep repair
    warranty: "Subject to Board Condition",
    symptoms: [
      "Phone dropped in water, sink, toilet or exposed to heavy rain",
      "Screen flickers or shows water condensation under glass",
      "Phone overheating while turned off or unresponsive to power button",
      "Corrosion visible inside SIM tray or charging port"
    ],
    process: [
      "Immediate doorstep pickup and battery disconnection",
      "Complete disassembly and ultrasonic board bath with pure IPA",
      "Thermal camera short-circuit tracing on power rail",
      "Detailed repair quotation provided before any component replacement",
      "Safe doorstep delivery upon completion"
    ],
    faqs: [
      {
        q: "Why can't water damage be repaired at doorstep?",
        a: "Liquid damage causes microscopic corrosion under motherboard chips that must be cleaned in an industrial ultrasonic tank and dried in a specialized oven to prevent permanent short circuits."
      },
      {
        q: "What should I do right now if my phone fell in water?",
        a: "Do NOT charge it or connect a cable. Turn it off immediately, wipe the exterior, and book our diagnostic pickup."
      }
    ]
  }
];
