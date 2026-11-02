window.PORTFOLIO_PROJECTS.push(...[
  {
    "id": "walle-balance-line",
    "title": "Wall-E · Balance & line following",
    "category": [
      "embedded",
      "robotics"
    ],
    "tag": "Embedded control · Robot study",
    "status": "CV-documented project",
    "desc": "An ESP32 robot project exploring line sensing, motor PWM, PID balance control, and an OLED startup interface.",
    "short": "An ESP32 robot project exploring line sensing, motor PWM, PID balance control, and an OLED startup interface.",
    "stack": "ESP32 / PWM / PID / Line sensor array / OLED",
    "work": [
      "Worked on an ESP32-based line-following and self-balancing robot.",
      "Studied line-sensor arrays, PWM motor commands and PID control flow.",
      "Implemented startup text on an OLED interface."
    ],
    "note": "Documented in the undergraduate CV. Original firmware and a successful balancing demonstration have not been recovered; the diagram explains the intended system.",
    "next": "Recover the original design files and document reproducible verification.",
    "flow": "SENSE → CONTROL ERROR → PID / PWM → MOTOR RESPONSE",
    "stats": [
      [
        "ESP32",
        "Controller"
      ],
      [
        "PID + PWM",
        "Control concepts"
      ],
      [
        "OLED",
        "Startup interface"
      ]
    ],
    "metric": "ESP32 · PID + PWM · OLED",
    "art": "walle",
    "image": "assets/walle-system.svg",
    "mediaKind": "diagram",
    "cvDocumented": true
  },
  {
    "id": "adaptive-recumbent-bicycle",
    "title": "Adaptive recumbent bicycle",
    "category": [
      "mechanical",
      "simulation"
    ],
    "tag": "Accessible design · Structural study",
    "status": "Undergraduate design study",
    "desc": "A recumbent bicycle design focused on seating ergonomics, chassis strength, and accessible steering and braking.",
    "short": "A recumbent bicycle design focused on seating ergonomics, chassis strength, and accessible steering and braking.",
    "stack": "SolidWorks / Mechanical design / FEA",
    "work": [
      "Designed a recumbent bicycle concept for users with disabilities.",
      "Modeled the chassis in SolidWorks and considered structural load response.",
      "Developed steering and braking arrangements around user needs."
    ],
    "note": "The CV documents CAD and FEA work; original models, numerical results and a manufactured bicycle have not been recovered. No clinical or user-testing outcome is claimed.",
    "next": "Recover the original design files and document reproducible verification.",
    "flow": "USER NEEDS → ERGONOMICS → CHASSIS → STEERING + BRAKING → FEA",
    "stats": [
      [
        "SolidWorks",
        "Chassis design"
      ],
      [
        "FEA",
        "CV-documented study"
      ],
      [
        "Ergonomics",
        "Accessible layout"
      ]
    ],
    "metric": "SolidWorks · FEA · Ergonomics",
    "art": "adaptive",
    "image": "assets/adaptive-bicycle-system.svg",
    "mediaKind": "diagram",
    "cvDocumented": true
  },
  {
    "id": "sugarcane-juicer",
    "title": "Sugarcane juicer mechanism",
    "category": [
      "mechanical",
      "simulation"
    ],
    "tag": "Machine design · Power transmission",
    "status": "Undergraduate design study",
    "desc": "A mechanically driven juicer design using geared rollers, component CAD, and a structural-analysis workflow.",
    "short": "A mechanically driven juicer design using geared rollers, component CAD, and a structural-analysis workflow.",
    "stack": "Mechanical design / CAD / Ansys / Gears + rollers",
    "work": [
      "Designed a gear-and-roller mechanism for sugarcane extraction.",
      "Developed CAD models and studied critical-component stress in Ansys.",
      "Considered friction, materials and tolerances in the mechanism design."
    ],
    "note": "CV-documented design study. Original CAD, load cases and efficiency measurements have not been recovered; no measured extraction improvement is claimed.",
    "next": "Recover the original design files and document reproducible verification.",
    "flow": "POWER INPUT → GEARS → ROLLERS → EXTRACTION",
    "stats": [
      [
        "Gears",
        "Power transmission"
      ],
      [
        "Rollers",
        "Extraction mechanism"
      ],
      [
        "Ansys",
        "Component study"
      ]
    ],
    "metric": "Gears · Rollers · Ansys",
    "art": "sugarcane",
    "image": "assets/sugarcane-roller-system.svg",
    "mediaKind": "diagram",
    "cvDocumented": true
  },
  {
    "id": "printing-defect-detection",
    "title": "3D-printing surface-defect detection",
    "category": [
      "ml"
    ],
    "tag": "Manufacturing intelligence · Research",
    "status": "Research / prototype development",
    "desc": "A vision-and-sensing study of surface-defect classification for fused-deposition 3D printing.",
    "short": "A vision-and-sensing study of surface-defect classification for fused-deposition 3D printing.",
    "stack": "Computer vision / Machine learning / Sensor-based classification",
    "work": [
      "Reviewed defect-detection methods for fused-deposition printing.",
      "Developed a vision-and-sensing classification approach.",
      "Investigated a physical prototype as ongoing work in the source CV."
    ],
    "note": "The CV describes literature review and algorithm development with prototype work still underway. A trained model, dataset, accuracy benchmark and completed inspection prototype have not been recovered.",
    "next": "Recover the original design files and document reproducible verification.",
    "flow": "PRINT SURFACE → VISION + SENSING → FEATURES → DEFECT CLASSIFICATION",
    "stats": [
      [
        "FDM",
        "Printing process"
      ],
      [
        "Vision + sensing",
        "Classification approach"
      ],
      [
        "Research",
        "Prototype unfinished"
      ]
    ],
    "metric": "FDM · Vision + sensing · Research",
    "art": "printing",
    "image": "assets/printing-defect-system.svg",
    "mediaKind": "diagram",
    "cvDocumented": true
  },
  {
    "id": "ecosteps",
    "title": "EcoSteps · Carbon-footprint UX",
    "category": [],
    "tag": "Product prototyping · Sustainability UX",
    "status": "Award-winning UI/UX prototype",
    "desc": "An award-winning FlutterFlow interface prototype for estimating carbon footprints from everyday activities.",
    "short": "An award-winning FlutterFlow interface prototype for estimating carbon footprints from everyday activities.",
    "stack": "FlutterFlow / UI design / UX prototyping",
    "work": [
      "Developed the EcoSteps UI/UX prototype in FlutterFlow.",
      "Designed daily-activity inputs and carbon-footprint calculation features.",
      "Won the Allianz Tech Championship; the €3,000 award amount was confirmed by Grishma."
    ],
    "note": "The CV documents the championship win and interface prototype. This concept diagram does not reproduce the original screens. A deployed app, verified emissions model and measured environmental impact are not claimed.",
    "next": "Recover the original design files and document reproducible verification.",
    "flow": "DAILY ACTIVITIES → INPUT FLOW → FOOTPRINT ESTIMATE → USER FEEDBACK",
    "stats": [
      [
        "Winner",
        "Allianz Tech Championship"
      ],
      [
        "€3,000",
        "User-confirmed award"
      ],
      [
        "FlutterFlow",
        "UI/UX prototype"
      ]
    ],
    "metric": "Winner · €3,000 · FlutterFlow",
    "art": "ecosteps",
    "image": "assets/ecosteps-interface.svg",
    "mediaKind": "diagram",
    "cvDocumented": true
  },
  {
    "id": "circuit-breaker-rom",
    "title": "Circuit-breaker digital twins & ROMs",
    "category": [
      "simulation",
      "mechanical"
    ],
    "tag": "CAE · Reduced-order modeling",
    "status": "Schneider Electric internship",
    "desc": "Internship modeling work connecting circuit-breaker mechanics, thermal behavior, and reduced-order representations.",
    "short": "Internship modeling work connecting circuit-breaker mechanics, thermal behavior, and reduced-order representations.",
    "stack": "Altair Twin Activate / romAI / CAE / Dynamic + thermal modeling",
    "work": [
      "Contributed to CAE and digital-twin models of circuit-breaker mechanisms.",
      "Studied spring configurations and vibration response for reduced-order modeling.",
      "Worked on temperature-prediction and faster model-evaluation workflows."
    ],
    "note": "Professional work summarized from the CV. Employer models and datasets are not published. The CV describes a speed benefit, but no reproducible timing or accuracy benchmark is available here, so no numeric speedup is presented.",
    "next": "Compare reduced and full models on held-out load cases with timing and error measurements.",
    "flow": "DETAILED CAE → MODEL REDUCTION → FAST EVALUATION → VALIDATION",
    "stats": [
      [
        "CAE",
        "Mechanism models"
      ],
      [
        "ROM",
        "Reduced-order workflow"
      ],
      [
        "Thermal + dynamic",
        "Modeling scope"
      ]
    ],
    "metric": "CAE · ROM · Thermal + dynamic",
    "art": "circuit",
    "image": "assets/reduced-order-system.svg",
    "mediaKind": "diagram",
    "cvDocumented": true
  }
]);
