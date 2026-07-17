import { CalendarClock, Container, PackageCheck, Truck, Wrench } from "lucide-react";

export const legacyAssets = {
  header: "/assets/trucking/truckingbig.png",
  refrigerated: "https://lassenrents.com/wp-content/uploads/2018/05/refrigeratedcontainer960.png",
  delivery: "/assets/delivery/deliveryblock.jpg",
  trucking: "/assets/trucking/truckingtop.png",
  shelving: "https://lassenrents.com/wp-content/uploads/2013/10/shelving.jpg",
  modifications: "/assets/modifications/office.jpg"
};

export const homeProofShots = [
  {
    src: "/assets/delivery/toughdelivery.png",
    alt: "PinPoint tilt-trailer delivery on a tight site",
    label: "PinPoint delivery",
    href: "/delivery"
  },
  {
    src: "/assets/trucking/truckingtop.png",
    alt: "Lassen Rents trucking and container haul",
    label: "Trucking",
    href: "/trucking"
  },
  {
    src: "/assets/container-sizes/twentyfoot.png",
    alt: "20 foot storage container",
    label: "Containers",
    href: "/containers"
  },
  {
    src: "/assets/modifications/office.jpg",
    alt: "Modified container office interior",
    label: "Modifications",
    href: "/options"
  }
];

export const deliveryAssets = {
  videoId: "Q9InSkMyBMM",
  videoUrl: "https://www.youtube.com/embed/Q9InSkMyBMM",
  hero: "/assets/delivery/deliveryblock.jpg",
  bottom: "/assets/delivery/pinpointdeliverybottom.jpg",
  longDay: "/assets/delivery/longday.png",
  toughDelivery: "/assets/delivery/toughdelivery.png"
};

export const truckingAssets = [
  {
    title: "Trucking service",
    image: "/assets/trucking/truckingtop.png",
    summary: "Dedicated trucking support for containers, equipment, and local hauling needs."
  },
  {
    title: "Relocating",
    image: "/assets/trucking/relocating.png",
    summary: "Move containers from one site to another when projects, yards, or jobsite plans change."
  },
  {
    title: "Hay and material hauling",
    image: "/assets/trucking/hay.png",
    summary: "Support for agricultural hauling and bulk material movement around Northeastern California."
  },
  {
    title: "Container transport",
    image: "/assets/trucking/trucking3.png",
    summary: "Haul loaded or empty storage containers with the right truck and route plan."
  },
  {
    title: "Local hauling",
    image: "/assets/trucking/trucking4.png",
    summary: "Practical hauling service for customers who need more than a standard container dropoff."
  },
  {
    title: "Jobsite support",
    image: "/assets/trucking/trucking7.png",
    summary: "Coordinate delivery, pickup, and movement for active commercial and rural sites."
  },
  {
    title: "Equipment movement",
    image: "/assets/trucking/trucking8.png",
    summary: "Truck availability can be matched to the load, site access, and schedule."
  },
  {
    title: "Regional service",
    image: "/assets/trucking/trucking9.png",
    summary: "Serving Lassen, Plumas, and Modoc Counties with local knowledge."
  },
  {
    title: "Lassen Rents fleet",
    image: "/assets/trucking/truckingbig.png",
    summary: "A locally owned operation with prompt, friendly service and no hidden costs."
  }
];

export const modificationOptions = [
  {
    label: "Air conditioning",
    image: "/assets/modifications/airconditionerblock.jpg",
    summary: "Add climate control for office, records, retail, and temperature-sensitive storage uses.",
    details: ["Wall-mounted AC option", "Useful for office conversions", "Pairs well with doors and windows"]
  },
  {
    label: "Personnel doors",
    image: "/assets/modifications/doorblock.jpg",
    summary: "Add walk-in access so the container works more like a shop, office, or frequent-use storage room.",
    details: ["Easy daily access", "Commercial-style entry", "Can be placed for workflow"]
  },
  {
    label: "Roll-up doors",
    image: "/assets/modifications/rollupdoorblock.jpg",
    summary: "Improve loading access for equipment, pallets, retail inventory, and jobsite materials.",
    details: ["Wide loading access", "Good for frequent loading", "Helps segment storage zones"]
  },
  {
    label: "Windows",
    image: "/assets/modifications/windowsblock.jpg",
    summary: "Bring light and visibility into a modified container for office or workspace use.",
    details: ["Natural light", "Workspace visibility", "Pairs with office layouts"]
  },
  {
    label: "Lockboxes",
    image: "/assets/modifications/lockboxblock.jpg",
    summary: "Protect padlocks and improve security for rented or purchased containers.",
    details: ["Added lock protection", "Cleaner exterior security", "Useful for jobsites"]
  },
  {
    label: "Vents and louvers",
    image: "/assets/modifications/louverblock.jpg",
    summary: "Add airflow for storage, workspace, or equipment needs.",
    details: ["Louvered ventilation", "Airflow upgrades", "Can pair with whirly vents"]
  }
];

export const containerSizes = [
  {
    label: "5 x 9",
    dimensions: "5' x 7' x 7' and 9' x 7' x 7'",
    description: "Compact onsite storage for tight spaces, small inventory, tools, and seasonal overflow.",
    rate: 89,
    status: "Limited",
    image: "/assets/container-sizes/fivenine.png"
  },
  {
    label: "20 ft",
    dimensions: "20' x 8.5' x 8'",
    description: "Standard ground-level storage for jobsites, retail, schools, and household moves.",
    rate: 145,
    status: "Available",
    image: "/assets/container-sizes/twentyfoot.png"
  },
  {
    label: "20 ft High Cube",
    dimensions: "20' x 9.5' x 8'",
    description: "Extra headroom for bulky equipment, taller pallets, and easier loading clearance.",
    rate: 165,
    status: "Available",
    image: "/assets/container-sizes/twentyfoothighcube.png"
  },
  {
    label: "40 ft",
    dimensions: "40' x 8.5' x 8'",
    description: "Large capacity storage for contractors, farms, warehouses, and extended projects.",
    rate: 225,
    status: "Available",
    image: "/assets/container-sizes/fortyfoot.png"
  },
  {
    label: "40 ft High Cube",
    dimensions: "40' x 9.5' x 8'",
    description: "Maximum volume with an extra foot of headroom for commercial and agricultural storage.",
    rate: 255,
    status: "Reserved",
    image: "/assets/container-sizes/fortyfoothigh.png"
  },
  { label: "Refrigerated", dimensions: "Call for sizing", description: "Cold storage for seasonal and commercial needs.", rate: 420, status: "Call", image: legacyAssets.refrigerated }
];

export const clientAccount = {
  customer: "Mallery Construction",
  balance: 642,
  nextDue: "July 15, 2026",
  rental: {
    id: "RA-1048",
    container: "20 ft High Cube",
    address: "705-120 Johnstonville Rd, Susanville, CA",
    start: "May 3, 2026",
    dueBack: "August 3, 2026",
    status: "Rented",
    agreement: "Month-to-month rental with flat delivery and pickup fees."
  },
  payments: [
    { id: "PAY-2219", date: "Jun 15, 2026", method: "Card", amount: 165, status: "Paid" },
    { id: "PAY-2178", date: "May 15, 2026", method: "ACH", amount: 315, status: "Paid" },
    { id: "INV-2307", date: "Jul 15, 2026", method: "Invoice", amount: 642, status: "Open" }
  ]
};

export const rentalContracts = [
  {
    id: "rent-1048",
    agreementNumber: "RA-1048",
    container: "20 ft High Cube",
    address: "705-120 Johnstonville Rd, Susanville, CA",
    start: "May 3, 2026",
    dueBack: "August 3, 2026",
    status: "Current",
    balance: 642,
    deposit: 300,
    pdfUrl: "/api/portal/rentals/rent-1048/agreement",
    notes: "Month-to-month rental with flat delivery and pickup fees."
  },
  {
    id: "rent-1031",
    agreementNumber: "RA-1031",
    container: "40 ft Standard",
    address: "Quincy retail overflow, Quincy, CA",
    start: "January 12, 2026",
    dueBack: "April 15, 2026",
    status: "Closed",
    balance: 0,
    deposit: 500,
    pdfUrl: "/api/portal/rentals/rent-1031/agreement",
    notes: "Closed rental. Deposit refunded after clean inspection."
  },
  {
    id: "rent-1018",
    agreementNumber: "RA-1018",
    container: "20 ft Standard",
    address: "Modoc County fair storage, Alturas, CA",
    start: "September 8, 2025",
    dueBack: "December 8, 2025",
    status: "Closed",
    balance: 0,
    deposit: 250,
    pdfUrl: "/api/portal/rentals/rent-1018/agreement",
    notes: "Closed rental. No damages recorded."
  }
];

export const testimonials = [
  {
    name: "Carrie B.",
    role: "Retail owner, Susanville",
    quote: "The container was clean, secure, and set exactly where we needed it. Delivery was quick, pricing was clear, and the whole rental was easy.",
    rating: 5
  },
  {
    name: "Mike R.",
    role: "General contractor",
    quote: "We use Lassen Rents when a jobsite needs storage without drama. Terry gets the unit there, places it tight, and keeps us moving.",
    rating: 5
  },
  {
    name: "Janet M.",
    role: "Facilities coordinator",
    quote: "The high-cube container gave us the extra room we needed. Pickup and billing were straightforward, and the local service was excellent.",
    rating: 5
  }
];

export const operations = {
  metrics: [
    { label: "Available", value: "18", icon: Container },
    { label: "Committed", value: "9", icon: CalendarClock },
    { label: "Rented", value: "42", icon: PackageCheck },
    { label: "Trucks", value: "4", icon: Truck }
  ],
  inventory: [
    { id: "LR-20HC-118", length: "20 ft", highCube: true, status: "Rented", location: "Susanville jobsite", customer: "Mallery Construction", due: "Aug 3", bookValue: 4100, monthlyDepreciation: 68, utilization: "91%" },
    { id: "LR-40-044", length: "40 ft", highCube: false, status: "Available", location: "Yard A", customer: "-", due: "-", bookValue: 5200, monthlyDepreciation: 87, utilization: "66%" },
    { id: "LR-20-091", length: "20 ft", highCube: false, status: "Due back", location: "Quincy retail", customer: "Plumas Ag Supply", due: "Jul 10", bookValue: 3300, monthlyDepreciation: 55, utilization: "84%" },
    { id: "LR-40HC-203", length: "40 ft", highCube: true, status: "Committed", location: "Yard B", customer: "Lassen High School", due: "Dropoff Jul 12", bookValue: 6100, monthlyDepreciation: 102, utilization: "72%" },
    { id: "LR-REF-006", length: "40 ft", highCube: true, status: "Maintenance", location: "Shop", customer: "-", due: "Compressor inspection", bookValue: 14200, monthlyDepreciation: 237, utilization: "58%" },
    { id: "LR-20-122", length: "20 ft", highCube: false, status: "Hold", location: "Yard A", customer: "County fair", due: "Reserved Jul 18", bookValue: 3600, monthlyDepreciation: 60, utilization: "49%" }
  ],
  statusSummary: [
    { label: "Available", count: 18, tone: "success" },
    { label: "Committed", count: 9, tone: "warn" },
    { label: "Rented", count: 42, tone: "default" },
    { label: "Due back", count: 7, tone: "warn" },
    { label: "Hold", count: 3, tone: "default" },
    { label: "Maintenance", count: 5, tone: "danger" }
  ],
  dispatch: [
    { type: "Dropoff", customer: "Lassen High School", truck: "Tilt Trailer 2", worker: "Ray", time: "8:30 AM" },
    { type: "Pickup", customer: "Plumas Ag Supply", truck: "Rollback 1", worker: "Mason", time: "11:00 AM" },
    { type: "Service", customer: "Modoc County", truck: "Service Truck", worker: "Terry", time: "2:00 PM" }
  ],
  trucks: [
    { id: "T-20-01", name: "Tilt Trailer 20", status: "Available", lengths: ["20 ft"], highCube: true, driver: "Ray", nextService: "Aug 15", note: "Tight placement jobs" },
    { id: "T-40-02", name: "Rollback 40", status: "Assigned", lengths: ["20 ft", "40 ft"], highCube: false, driver: "Mason", nextService: "Jul 20", note: "Standard-height 40 ft moves" },
    { id: "T-HC-03", name: "Landoll High Cube", status: "Available", lengths: ["20 ft", "40 ft"], highCube: true, driver: "Terry", nextService: "Sep 1", note: "Handles high-cube containers" },
    { id: "SVC-01", name: "Service Truck", status: "Service", lengths: [], highCube: false, driver: "Unassigned", nextService: "Jul 8", note: "Maintenance only" }
  ],
  calendarLayers: [
    {
      date: "Jul 7",
      time: "8:30 AM",
      layer: "Dropoff",
      title: "Lassen College",
      address: "478-200 Hwy 139, Susanville, CA 96130",
      driverNote: "Check in near the main campus entrance before placing the unit.",
      asset: "LR-40HC-203",
      truck: "T-20-01",
      tone: "success"
    },
    {
      date: "Jul 7",
      time: "11:00 AM",
      layer: "Pickup",
      title: "Banner Lassen Medical Center",
      address: "1800 Spring Ridge Dr, Susanville, CA 96130",
      driverNote: "Call site contact before entering the service access lane.",
      asset: "LR-20-091",
      truck: "T-40-02",
      tone: "warn"
    },
    {
      date: "Jul 8",
      time: "9:00 AM",
      layer: "Maintenance",
      title: "Historic Lassen County Courthouse",
      address: "220 S Lassen St, Susanville, CA",
      driverNote: "Service truck only. Park clear of courthouse access points.",
      asset: "SVC-01",
      truck: "SVC-01",
      tone: "danger"
    },
    {
      date: "Jul 10",
      time: "All day",
      layer: "Due back",
      title: "High Desert State Prison staging",
      address: "475-750 Rice Canyon Rd, Susanville, CA",
      driverNote: "Confirm security access before dispatching a pickup truck.",
      asset: "LR-20-091",
      truck: "-",
      tone: "warn"
    },
    {
      date: "Jul 12",
      time: "1:30 PM",
      layer: "Committed",
      title: "California Correctional Center staging",
      address: "711-045 Center Rd, Susanville, CA 96127",
      driverNote: "Reserved placement window. Match truck capability before assigning.",
      asset: "LR-20-122",
      truck: "T-HC-03",
      tone: "default"
    }
  ],
  monthlyRevenue: [
    { month: "Feb", income: 15240, expenses: 4120 },
    { month: "Mar", income: 16180, expenses: 3980 },
    { month: "Apr", income: 17420, expenses: 4510 },
    { month: "May", income: 16890, expenses: 4230 },
    { month: "Jun", income: 17960, expenses: 4675 },
    { month: "Jul", income: 18450, expenses: 5705 }
  ],
  taxExport: {
    period: "2026 Q3",
    target: "Quicken CSV",
    revenue: 18450,
    depreciation: 3860,
    repairs: 925,
    mileage: 1380,
    exportRows: [
      { date: "2026-07-01", account: "Rental Income:Containers", memo: "Monthly container rental invoices", amount: 18450 },
      { date: "2026-07-01", account: "Expense:Depreciation", memo: "Container and truck monthly depreciation", amount: -3860 },
      { date: "2026-07-05", account: "Expense:Repairs", memo: "Container lockbox and truck hydraulic service", amount: -925 },
      { date: "2026-07-07", account: "Expense:Vehicle Mileage", memo: "Dispatch mileage export", amount: -920 }
    ]
  },
  maintenance: [
    { container: "LR-REF-006", issue: "Refrigeration compressor inspection", age: "2 days" },
    { container: "LR-40HC-022", issue: "Door gasket and lockbox repair", age: "5 days" },
    { container: "Truck T-02", issue: "Hydraulic service due", age: "Tomorrow" }
  ]
};

export const demoWorkflow = {
  quoteLeads: [
    {
      id: "Q-260714-01",
      receivedAt: "Today, 8:42 AM",
      name: "Diana Ortiz",
      company: "Honey Lake Ag Supply",
      phone: "530-257-4410",
      email: "diana@honeylake.example",
      address: "Johnstonville Rd, Susanville, CA",
      interests: ["Containers", "Delivery"],
      container: "40 ft High Cube",
      date: "2026-07-18",
      duration: "6+ months",
      notes: "Needs dry storage near loading bay. Gravel pad, wide gate, weekday delivery preferred.",
      status: "New",
      fit: "Match found"
    },
    {
      id: "Q-260714-02",
      receivedAt: "Today, 9:15 AM",
      name: "Marcus Lee",
      company: "Plumas Builders",
      phone: "530-283-1184",
      email: "marcus@plumasbuilders.example",
      address: "Main St, Quincy, CA",
      interests: ["Containers", "Modifications"],
      container: "20 ft",
      date: "2026-07-21",
      duration: "3-months",
      notes: "Wants lockbox and shelves for jobsite tools.",
      status: "Review",
      fit: "Needs pricing"
    },
    {
      id: "Q-260713-04",
      receivedAt: "Yesterday, 3:50 PM",
      name: "Shannon Rivera",
      company: "Modoc Fairgrounds",
      phone: "530-233-0920",
      email: "shannon@modocfair.example",
      address: "Alturas, CA",
      interests: ["Trucking", "Containers"],
      container: "20 ft High Cube",
      date: "2026-07-24",
      duration: "1-month",
      notes: "Temporary overflow during event setup. Tight placement near livestock barns.",
      status: "Quoted",
      fit: "Truck match"
    }
  ],
  customers: [
    {
      id: "cust-1001",
      name: "Mallery Construction",
      contact: "Pat Mallery",
      phone: "530-257-3865",
      email: "accounts@mallery.example",
      balance: 642,
      rentals: 1,
      status: "Active",
      lastTouch: "Payment reminder sent today",
      notes: "Prefers text confirmation before dispatch. Gravel driveway is accessible for high-cube placement."
    },
    {
      id: "cust-1002",
      name: "Plumas Ag Supply",
      contact: "Emily Park",
      phone: "530-283-4118",
      email: "emily@plumasag.example",
      balance: 0,
      rentals: 2,
      status: "Active",
      lastTouch: "Pickup scheduled Jul 16",
      notes: "Seasonal renter. Usually needs 40 ft units from March through June."
    },
    {
      id: "cust-1003",
      name: "Lassen High School",
      contact: "Robert Gaines",
      phone: "530-257-2141",
      email: "facilities@lassenhigh.example",
      balance: 225,
      rentals: 1,
      status: "Active",
      lastTouch: "Container committed for Jul 18",
      notes: "Requires school access window and placement clear of student pathways."
    }
  ],
  rentalWizard: {
    customer: "Honey Lake Ag Supply",
    container: "40 ft High Cube",
    matchedUnit: "LR-40HC-203",
    truck: "Landoll High Cube",
    startDate: "2026-07-18",
    monthlyRate: 255,
    deliveryFee: 175,
    pickupFee: 175,
    deposit: 500,
    steps: ["Customer", "Availability", "Terms", "Agreement"]
  },
  dispatchBoard: [
    {
      id: "JOB-771",
      lane: "Unassigned",
      type: "Dropoff",
      customer: "Honey Lake Ag Supply",
      container: "LR-40HC-203",
      truck: "Needs high-cube truck",
      driver: "Unassigned",
      time: "Jul 18, 9:00 AM",
      address: "Johnstonville Rd, Susanville, CA",
      note: "Wide gravel pad. Call Diana before arrival."
    },
    {
      id: "JOB-768",
      lane: "Assigned",
      type: "Pickup",
      customer: "Plumas Ag Supply",
      container: "LR-20-091",
      truck: "Rollback 40",
      driver: "Mason",
      time: "Jul 16, 11:00 AM",
      address: "Quincy, CA",
      note: "Customer says container is empty and unlocked."
    },
    {
      id: "JOB-766",
      lane: "In Route",
      type: "Service",
      customer: "Mallery Construction",
      container: "LR-20HC-118",
      truck: "Service Truck",
      driver: "Terry",
      time: "Today, 2:00 PM",
      address: "705-120 Johnstonville Rd, Susanville, CA",
      note: "Inspect door seal and photograph condition."
    },
    {
      id: "JOB-761",
      lane: "Complete",
      type: "Dropoff",
      customer: "Lassen High School",
      container: "LR-20-122",
      truck: "Landoll High Cube",
      driver: "Ray",
      time: "Today, 8:30 AM",
      address: "Susanville, CA",
      note: "Placed behind maintenance building."
    }
  ],
  invoices: [
    { id: "INV-2307", customer: "Mallery Construction", due: "2026-07-15", amount: 642, status: "Open", age: "Due tomorrow" },
    { id: "INV-2311", customer: "Lassen High School", due: "2026-07-18", amount: 225, status: "Sent", age: "Due in 4 days" },
    { id: "INV-2298", customer: "Modoc County", due: "2026-07-01", amount: 390, status: "Past due", age: "13 days late" },
    { id: "INV-2291", customer: "Plumas Ag Supply", due: "2026-06-28", amount: 0, status: "Paid", age: "Paid Jul 2" }
  ],
  inspections: [
    "Confirm container is empty and accessible",
    "Photograph all four sides before loading",
    "Check doors, gasket, roof line, lockbox, and floor",
    "Record placement or pickup condition",
    "Collect customer signature when required"
  ],
  activity: [
    { time: "9:42 AM", type: "Lead", text: "Honey Lake Ag Supply requested a 40 ft High Cube quote." },
    { time: "9:50 AM", type: "Match", text: "LR-40HC-203 and Landoll High Cube matched for Jul 18 delivery." },
    { time: "10:05 AM", type: "Invoice", text: "Invoice INV-2307 remains open for Mallery Construction." },
    { time: "11:15 AM", type: "Dispatch", text: "Pickup JOB-768 assigned to Mason and Rollback 40." },
    { time: "2:00 PM", type: "Inspection", text: "Service checklist ready for LR-20HC-118." }
  ]
};
