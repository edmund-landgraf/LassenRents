import { CalendarClock, Container, PackageCheck, Truck, Wrench } from "lucide-react";

export const legacyAssets = {
  header: "https://lassenrents.com/wp-content/uploads/2013/10/header.jpg",
  refrigerated: "https://lassenrents.com/wp-content/uploads/2018/05/refrigeratedcontainer960.png",
  delivery: "https://lassenrents.com/wp-content/uploads/2013/10/deliveryblock-1024x271.jpg",
  trucking: "https://lassenrents.com/wp-content/uploads/2018/03/truckingtop.png",
  shelving: "https://lassenrents.com/wp-content/uploads/2013/10/shelving.jpg",
  modifications: "https://lassenrents.com/wp-content/uploads/2013/10/office.jpg"
};

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
    pdfUrl: "/api/portal/rentals/rent-1048/agreement",
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
    pdfUrl: "/api/portal/rentals/rent-1048/agreement",
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
    { date: "Jul 7", time: "8:30 AM", layer: "Dropoff", title: "Lassen High School", asset: "LR-40HC-203", truck: "T-20-01", tone: "success" },
    { date: "Jul 7", time: "11:00 AM", layer: "Pickup", title: "Plumas Ag Supply", asset: "LR-20-091", truck: "T-40-02", tone: "warn" },
    { date: "Jul 8", time: "9:00 AM", layer: "Maintenance", title: "Hydraulic service", asset: "SVC-01", truck: "SVC-01", tone: "danger" },
    { date: "Jul 10", time: "All day", layer: "Due back", title: "Quincy retail", asset: "LR-20-091", truck: "-", tone: "warn" },
    { date: "Jul 12", time: "1:30 PM", layer: "Committed", title: "County fair reserve", asset: "LR-20-122", truck: "T-HC-03", tone: "default" }
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
