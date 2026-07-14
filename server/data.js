export const containerSizes = [
  { id: "size-5x9", label: "5 x 9", monthlyRate: 89, dailyRate: 12, weeklyRate: 45, isActive: true },
  { id: "size-20", label: "20 ft", monthlyRate: 145, dailyRate: 18, weeklyRate: 70, isActive: true },
  { id: "size-20hc", label: "20 ft High Cube", monthlyRate: 165, dailyRate: 22, weeklyRate: 85, isActive: true },
  { id: "size-40", label: "40 ft", monthlyRate: 225, dailyRate: 32, weeklyRate: 120, isActive: true },
  { id: "size-40hc", label: "40 ft High Cube", monthlyRate: 255, dailyRate: 36, weeklyRate: 140, isActive: true },
  { id: "size-reefer", label: "Refrigerated", monthlyRate: 420, dailyRate: 65, weeklyRate: 220, isActive: true }
];

export const pricing = {
  id: "pricing-default",
  deliveryFee: 150,
  pickupFee: 150,
  defaultRateUnit: "monthly",
  lateFeePolicy: "Stub: add late fee after configurable grace period.",
  updatedAt: "2026-07-07T12:00:00.000Z"
};

export const customers = [
  {
    id: "cust-1001",
    name: "Mallery Construction",
    email: "accounts@mallery.example",
    phone: "530.555.0144",
    billingAddress: "705-120 Johnstonville Rd, Susanville, CA",
    status: "active",
    createdAt: "2026-05-01T16:00:00.000Z"
  },
  {
    id: "cust-1002",
    name: "Lassen High School",
    email: "facilities@lassenhigh.example",
    phone: "530.555.0198",
    billingAddress: "Susanville, CA",
    status: "active",
    createdAt: "2026-06-04T16:00:00.000Z"
  }
];

export const containers = [
  { id: "cont-118", containerNumber: "LR-20HC-118", sizeId: "size-20hc", length: "20 ft", highCube: true, status: "rented", currentLocation: "Susanville jobsite", condition: "good", bookValue: 4100, monthlyDepreciation: 68, lastInspectionAt: "2026-05-02" },
  { id: "cont-044", containerNumber: "LR-40-044", sizeId: "size-40", length: "40 ft", highCube: false, status: "available", currentLocation: "Yard A", condition: "good", bookValue: 5200, monthlyDepreciation: 87, lastInspectionAt: "2026-06-21" },
  { id: "cont-091", containerNumber: "LR-20-091", sizeId: "size-20", length: "20 ft", highCube: false, status: "due_back", currentLocation: "Quincy retail", condition: "fair", bookValue: 3300, monthlyDepreciation: 55, lastInspectionAt: "2026-04-12" },
  { id: "cont-203", containerNumber: "LR-40HC-203", sizeId: "size-40hc", length: "40 ft", highCube: true, status: "committed", currentLocation: "Yard B", condition: "good", bookValue: 6100, monthlyDepreciation: 102, lastInspectionAt: "2026-06-26" },
  { id: "cont-006", containerNumber: "LR-REF-006", sizeId: "size-reefer", length: "40 ft", highCube: true, status: "maintenance", currentLocation: "Shop", condition: "service", bookValue: 14200, monthlyDepreciation: 237, lastInspectionAt: "2026-07-05" }
];

export const rentals = [
  {
    id: "rent-1048",
    agreementNumber: "RA-1048",
    customerId: "cust-1001",
    containerId: "cont-118",
    sizeId: "size-20hc",
    status: "active",
    siteAddress: "705-120 Johnstonville Rd, Susanville, CA",
    startDate: "2026-05-03",
    dueBackDate: "2026-08-03",
    returnedAt: null,
    rentalRate: 165,
    rateUnit: "monthly",
    deliveryFee: 150,
    pickupFee: 150,
    depositAmount: 150,
    termsAcceptedAt: "2026-05-03T14:30:00.000Z",
    agreementPdfUrl: "/api/portal/rentals/rent-1048/agreement"
  },
  {
    id: "rent-1062",
    agreementNumber: "RA-1062",
    customerId: "cust-1002",
    containerId: "cont-091",
    sizeId: "size-20",
    status: "due_back",
    siteAddress: "Susanville, CA",
    startDate: "2026-06-10",
    dueBackDate: "2026-07-10",
    returnedAt: null,
    rentalRate: 145,
    rateUnit: "monthly",
    deliveryFee: 150,
    pickupFee: 150,
    depositAmount: 150,
    termsAcceptedAt: "2026-06-10T09:00:00.000Z",
    agreementPdfUrl: "/api/portal/rentals/rent-1062/agreement"
  },
  {
    id: "rent-1031",
    agreementNumber: "RA-1031",
    customerId: "cust-1001",
    containerId: "cont-044",
    sizeId: "size-40",
    status: "closed",
    siteAddress: "Quincy retail overflow, Quincy, CA",
    startDate: "2026-01-12",
    dueBackDate: "2026-04-15",
    returnedAt: "2026-04-15T17:15:00.000Z",
    rentalRate: 225,
    rateUnit: "monthly",
    deliveryFee: 175,
    pickupFee: 175,
    depositAmount: 500,
    termsAcceptedAt: "2026-01-12T10:15:00.000Z",
    agreementPdfUrl: "/api/portal/rentals/rent-1031/agreement"
  },
  {
    id: "rent-1018",
    agreementNumber: "RA-1018",
    customerId: "cust-1001",
    containerId: "cont-091",
    sizeId: "size-20",
    status: "closed",
    siteAddress: "Modoc County fair storage, Alturas, CA",
    startDate: "2025-09-08",
    dueBackDate: "2025-12-08",
    returnedAt: "2025-12-08T16:45:00.000Z",
    rentalRate: 145,
    rateUnit: "monthly",
    deliveryFee: 150,
    pickupFee: 150,
    depositAmount: 250,
    termsAcceptedAt: "2025-09-08T13:20:00.000Z",
    agreementPdfUrl: "/api/portal/rentals/rent-1018/agreement"
  }
];

export const invoices = [
  { id: "inv-2307", customerId: "cust-1001", rentalAgreementId: "rent-1048", status: "open", subtotal: 465, feesTotal: 150, taxTotal: 27, total: 642, balanceDue: 642, dueDate: "2026-07-15" },
  { id: "inv-2260", customerId: "cust-1001", rentalAgreementId: "rent-1048", status: "paid", subtotal: 315, feesTotal: 0, taxTotal: 0, total: 315, balanceDue: 0, dueDate: "2026-05-15" }
];

export const payments = [
  { id: "pay-2219", customerId: "cust-1001", rentalAgreementId: "rent-1048", invoiceId: "inv-2260", amount: 165, method: "card", status: "paid", processorPaymentId: "stub-card-2219", paidAt: "2026-06-15T18:30:00.000Z" },
  { id: "pay-2178", customerId: "cust-1001", rentalAgreementId: "rent-1048", invoiceId: "inv-2260", amount: 315, method: "ach", status: "paid", processorPaymentId: "stub-ach-2178", paidAt: "2026-05-15T18:30:00.000Z" }
];

export const workers = [
  { id: "worker-ray", name: "Ray", phone: "530.555.0171", role: "driver", status: "available" },
  { id: "worker-mason", name: "Mason", phone: "530.555.0172", role: "driver", status: "assigned" },
  { id: "worker-terry", name: "Terry Mallery", phone: "530.257.3865", role: "owner", status: "assigned" }
];

export const trucks = [
  { id: "truck-tilt-2", truckNumber: "Tilt Trailer 20", plateNumber: "STUB-102", status: "available", supportedLengths: ["20 ft"], supportsHighCube: true, capacityNotes: "PinPoint tilt trailer for tight 20 ft placements", maintenanceDueAt: "2026-08-15" },
  { id: "truck-roll-1", truckNumber: "Rollback 40", plateNumber: "STUB-201", status: "assigned", supportedLengths: ["20 ft", "40 ft"], supportsHighCube: false, capacityNotes: "Standard-height pickup and relocation", maintenanceDueAt: "2026-07-20" },
  { id: "truck-hc-3", truckNumber: "Landoll High Cube", plateNumber: "STUB-260", status: "available", supportedLengths: ["20 ft", "40 ft"], supportsHighCube: true, capacityNotes: "Handles high-cube containers", maintenanceDueAt: "2026-09-01" },
  { id: "truck-service", truckNumber: "Service Truck", plateNumber: "STUB-301", status: "service", supportedLengths: [], supportsHighCube: false, capacityNotes: "Maintenance and inspection only", maintenanceDueAt: "2026-07-08" }
];

export const dispatchJobs = [
  { id: "job-501", rentalAgreementId: "rent-1062", type: "dropoff", status: "scheduled", scheduledDate: "2026-07-07T08:30:00.000Z", completedAt: null, address: "Lassen High School, Susanville, CA", workerId: "worker-ray", truckId: "truck-tilt-2", notes: "Tight placement near facilities gate." },
  { id: "job-502", rentalAgreementId: "rent-1048", type: "pickup", status: "scheduled", scheduledDate: "2026-07-07T11:00:00.000Z", completedAt: null, address: "Plumas Ag Supply, Quincy, CA", workerId: "worker-mason", truckId: "truck-roll-1", notes: "Call before arrival." },
  { id: "job-503", rentalAgreementId: "rent-1048", type: "service", status: "scheduled", scheduledDate: "2026-07-07T14:00:00.000Z", completedAt: null, address: "Modoc County site", workerId: "worker-terry", truckId: "truck-service", notes: "Inspect lockbox." }
];

export const maintenanceRecords = [
  { id: "maint-700", containerId: "cont-006", status: "open", issue: "Refrigeration compressor inspection", resolution: null, openedAt: "2026-07-05", closedAt: null, cost: 0 },
  { id: "maint-701", containerId: "cont-044", status: "open", issue: "Door gasket and lockbox repair", resolution: null, openedAt: "2026-07-02", closedAt: null, cost: 75 },
  { id: "maint-702", containerId: null, truckId: "truck-service", status: "scheduled", issue: "Hydraulic service due", resolution: null, openedAt: "2026-07-07", closedAt: null, cost: 0 }
];

export const calendarLayers = [
  { id: "cal-1", date: "2026-07-07", layer: "dropoff", title: "Lassen High School", assetId: "cont-203", truckId: "truck-tilt-2" },
  { id: "cal-2", date: "2026-07-07", layer: "pickup", title: "Plumas Ag Supply", assetId: "cont-091", truckId: "truck-roll-1" },
  { id: "cal-3", date: "2026-07-08", layer: "maintenance", title: "Hydraulic service", assetId: "truck-service", truckId: "truck-service" },
  { id: "cal-4", date: "2026-07-10", layer: "due_back", title: "Quincy retail", assetId: "cont-091", truckId: null }
];

export const taxExport = {
  period: "2026 Q3",
  target: "Quicken CSV",
  rows: [
    { date: "2026-07-01", account: "Rental Income:Containers", memo: "Monthly container rental invoices", amount: 18450 },
    { date: "2026-07-01", account: "Expense:Depreciation", memo: "Container and truck monthly depreciation", amount: -3860 },
    { date: "2026-07-05", account: "Expense:Repairs", memo: "Container lockbox and truck hydraulic service", amount: -925 },
    { date: "2026-07-07", account: "Expense:Vehicle Mileage", memo: "Dispatch mileage export", amount: -920 }
  ]
};
