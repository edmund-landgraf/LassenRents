import cors from "cors";
import express from "express";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  containerSizes,
  containers,
  customers,
  calendarLayers,
  dispatchJobs,
  invoices,
  maintenanceRecords,
  payments,
  pricing,
  rentals,
  taxExport,
  trucks,
  workers
} from "./data.js";

const app = express();
const port = process.env.PORT || 5174;
const inventoryFilePath = path.join(process.cwd(), "public", "data", "container-inventory.json");
const workOrdersFilePath = path.join(process.cwd(), "public", "data", "work-orders.json");
const trucksFilePath = path.join(process.cwd(), "public", "data", "trucks.json");
const helpPath = path.join(process.cwd(), "server", "help");

app.use(cors());
app.use(express.json());
app.use("/help", express.static(helpPath, { extensions: ["html"] }));

const byId = (items, id) => items.find((item) => item.id === id);
const currentCustomerId = "cust-1001";

function notFound(res, label) {
  return res.status(404).json({ error: `${label} not found` });
}

async function readContainerInventoryFile() {
  const contents = await readFile(inventoryFilePath, "utf8");
  return JSON.parse(contents);
}

async function writeContainerInventoryFile(items) {
  await mkdir(path.dirname(inventoryFilePath), { recursive: true });
  await writeFile(inventoryFilePath, `${JSON.stringify(items, null, 2)}\n`, "utf8");
}

function normalizeInventoryItem(body) {
  const length = body.length === "40 ft" ? "40 ft" : "20 ft";
  const status = body.status || "Available";
  const id = String(body.id || `LR-${length.replace(/\D/g, "")}${body.highCube ? "HC" : ""}-${Date.now().toString().slice(-4)}`).trim();
  const utilization = String(body.utilization || "0%").trim();

  return {
    id,
    length,
    highCube: Boolean(body.highCube),
    status,
    location: String(body.location || "Yard A").trim(),
    customer: String(body.customer || "-").trim(),
    due: String(body.due || "-").trim(),
    bookValue: Number(body.bookValue) || 0,
    monthlyDepreciation: Number(body.monthlyDepreciation) || 0,
    utilization: utilization.endsWith("%") ? utilization : `${utilization}%`
  };
}

async function readWorkOrdersFile() {
  const contents = await readFile(workOrdersFilePath, "utf8");
  return JSON.parse(contents);
}

async function writeWorkOrdersFile(items) {
  await mkdir(path.dirname(workOrdersFilePath), { recursive: true });
  await writeFile(workOrdersFilePath, `${JSON.stringify(items, null, 2)}\n`, "utf8");
}

function normalizeWorkOrder(body) {
  return {
    id: String(body.id || `WO-${Date.now().toString().slice(-6)}`).trim(),
    container: String(body.container || "Unassigned").trim(),
    type: String(body.type || "Maintenance").trim(),
    issue: String(body.issue || "General work order").trim(),
    priority: String(body.priority || "Medium").trim(),
    status: String(body.status || "Open").trim(),
    assignedTo: String(body.assignedTo || "Unassigned").trim(),
    dueDate: String(body.dueDate || "").trim(),
    notes: String(body.notes || "").trim(),
    createdAt: body.createdAt || new Date().toISOString()
  };
}

async function readTrucksFile() {
  const contents = await readFile(trucksFilePath, "utf8");
  return JSON.parse(contents);
}

async function writeTrucksFile(items) {
  await mkdir(path.dirname(trucksFilePath), { recursive: true });
  await writeFile(trucksFilePath, `${JSON.stringify(items, null, 2)}\n`, "utf8");
}

function normalizeTruck(body) {
  const lengths = Array.isArray(body.lengths) ? body.lengths.filter(Boolean) : [];

  return {
    id: String(body.id || `T-${Date.now().toString().slice(-5)}`).trim(),
    name: String(body.name || "New truck").trim(),
    status: String(body.status || "Available").trim(),
    lengths,
    highCube: Boolean(body.highCube),
    driver: String(body.driver || "Unassigned").trim(),
    nextService: String(body.nextService || "").trim(),
    note: String(body.note || "").trim()
  };
}

function decorateRental(rental) {
  return {
    ...rental,
    customer: byId(customers, rental.customerId),
    container: byId(containers, rental.containerId),
    size: byId(containerSizes, rental.sizeId),
    invoices: invoices.filter((invoice) => invoice.rentalAgreementId === rental.id),
    payments: payments.filter((payment) => payment.rentalAgreementId === rental.id)
  };
}

function escapePdfText(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function createPdfDocument(lines) {
  const content = [
    "BT",
    "/F1 11 Tf",
    "50 760 Td",
    "14 TL",
    ...lines.map((line) => `(${escapePdfText(line)}) Tj T*`),
    "ET"
  ].join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(content, "latin1")} >>\nstream\n${content}\nendstream`
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((body, index) => {
    offsets.push(Buffer.byteLength(pdf, "latin1"));
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf, "latin1");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(pdf, "latin1");
}

function rentalAgreementPdf(rental) {
  const customer = byId(customers, rental.customerId);
  const container = byId(containers, rental.containerId);
  const size = byId(containerSizes, rental.sizeId);

  return createPdfDocument([
    "Lassen Rents, Inc. - Sample Storage Container Rental Agreement",
    "",
    `Agreement No: ${rental.agreementNumber}`,
    `Customer: ${customer.name}`,
    `Customer Phone: ${customer.phone}`,
    `Customer Email: ${customer.email}`,
    `Site Address: ${rental.siteAddress}`,
    "",
    "Container",
    `Unit: ${container.containerNumber}`,
    `Size: ${size.label}`,
    `Condition at Delivery: ${container.condition}`,
    "",
    "Rental Terms",
    `Start Date: ${rental.startDate}`,
    `Due Back Date: ${rental.dueBackDate}`,
    `Rental Rate: $${rental.rentalRate} per ${rental.rateUnit}`,
    `Delivery Fee: $${rental.deliveryFee}`,
    `Pickup Fee: $${rental.pickupFee}`,
    `Deposit: $${rental.depositAmount}`,
    "",
    "Customer Responsibilities",
    "1. Customer is responsible for keeping the container locked and secure.",
    "2. Customer will not move the container without written approval.",
    "3. Customer will keep the container accessible for scheduled pickup or service.",
    "4. Customer will not store hazardous, illegal, explosive, or flammable materials.",
    "5. Customer is responsible for damage beyond ordinary wear and tear.",
    "",
    "Lassen Rents Responsibilities",
    "1. Lassen Rents will deliver the container to the approved site address.",
    "2. Lassen Rents will schedule pickup, service, or swap work as requested.",
    "3. Lassen Rents retains ownership of the container at all times.",
    "",
    "Payment",
    "Monthly rent, delivery, pickup, deposits, taxes, and fees are due as invoiced.",
    "Late fees, damage fees, or cleaning fees may apply when necessary.",
    "",
    "Pickup and Return",
    "Customer may request pickup or extension through the portal or office.",
    "Final charges may include unpaid rent, pickup, repair, cleaning, or adjustment items.",
    "",
    "Acceptance",
    `Terms Accepted: ${rental.termsAcceptedAt}`,
    "Customer Signature: ________________________________",
    "Lassen Rents Signature: _____________________________",
    "",
    "This is a prototype sample contract and is not legal advice."
  ]);
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "lassen-rents-api", mode: "stub" });
});

app.post("/api/auth/login", (req, res) => {
  res.json({ token: "stub-session-token", user: { customerId: currentCustomerId, email: req.body.email || "client@example.com" } });
});

app.post("/api/auth/logout", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/portal/me", (_req, res) => {
  res.json({ customer: byId(customers, currentCustomerId), portalUser: { id: "portal-1001", email: "accounts@mallery.example", isActive: true } });
});

app.get("/api/portal/dashboard", (_req, res) => {
  const customerInvoices = invoices.filter((invoice) => invoice.customerId === currentCustomerId);
  const customerRentals = rentals.filter((rental) => rental.customerId === currentCustomerId).map(decorateRental);
  res.json({
    customer: byId(customers, currentCustomerId),
    balanceDue: customerInvoices.reduce((sum, invoice) => sum + invoice.balanceDue, 0),
    activeRentals: customerRentals,
    nextDueDate: customerInvoices.find((invoice) => invoice.status === "open")?.dueDate ?? null,
    quickActions: ["make_payment", "request_pickup", "request_extension", "contact_office"]
  });
});

app.get("/api/portal/rentals", (_req, res) => {
  res.json(rentals.filter((rental) => rental.customerId === currentCustomerId).map(decorateRental));
});

app.get("/api/portal/rentals/:rentalId", (req, res) => {
  const rental = rentals.find((item) => item.id === req.params.rentalId && item.customerId === currentCustomerId);
  return rental ? res.json(decorateRental(rental)) : notFound(res, "Rental");
});

app.get("/api/portal/rentals/:rentalId/agreement", (req, res) => {
  const rental = rentals.find((item) => item.id === req.params.rentalId && item.customerId === currentCustomerId);
  if (!rental) return notFound(res, "Rental agreement");
  const pdf = rentalAgreementPdf(rental);
  const disposition = req.query.download === "1" ? "attachment" : "inline";
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `${disposition}; filename="${rental.agreementNumber}-container-rental-agreement.pdf"`);
  res.send(pdf);
});

app.get("/api/portal/payments", (_req, res) => {
  res.json({
    invoices: invoices.filter((invoice) => invoice.customerId === currentCustomerId),
    payments: payments.filter((payment) => payment.customerId === currentCustomerId)
  });
});

app.post("/api/portal/payments", (req, res) => {
  res.status(201).json({
    id: `pay-stub-${Date.now()}`,
    customerId: currentCustomerId,
    amount: req.body.amount,
    method: req.body.method || "card",
    status: "submitted",
    message: "Payment processor is stubbed."
  });
});

app.post("/api/portal/rentals/:rentalId/request-pickup", (req, res) => {
  res.status(202).json({ rentalId: req.params.rentalId, status: "pickup_requested", requestedDate: req.body.requestedDate ?? null });
});

app.post("/api/portal/rentals/:rentalId/request-extension", (req, res) => {
  res.status(202).json({ rentalId: req.params.rentalId, status: "extension_requested", requestedDueBackDate: req.body.requestedDueBackDate ?? null });
});

app.get("/api/admin/dashboard", (_req, res) => {
  res.json({
    inventorySnapshot: {
      available: containers.filter((item) => item.status === "available").length,
      rented: containers.filter((item) => item.status === "rented").length,
      committed: containers.filter((item) => item.status === "committed").length,
      dueBack: containers.filter((item) => item.status === "due_back").length,
      maintenance: containers.filter((item) => item.status === "maintenance").length
    },
    taxExport,
    calendarLayers,
    todayDispatch: dispatchJobs,
    openBalances: invoices.filter((invoice) => invoice.status === "open"),
    maintenance: maintenanceRecords.filter((record) => record.status !== "closed")
  });
});

app.get("/api/admin/customers", (_req, res) => res.json(customers));
app.post("/api/admin/customers", (req, res) => res.status(201).json({ id: `cust-stub-${Date.now()}`, ...req.body }));
app.get("/api/admin/customers/:customerId", (req, res) => {
  const customer = byId(customers, req.params.customerId);
  return customer ? res.json({ ...customer, rentals: rentals.filter((rental) => rental.customerId === customer.id), invoices: invoices.filter((invoice) => invoice.customerId === customer.id) }) : notFound(res, "Customer");
});
app.put("/api/admin/customers/:customerId", (req, res) => res.json({ id: req.params.customerId, ...req.body, status: "stub_updated" }));

app.get("/api/admin/rentals", (_req, res) => res.json(rentals.map(decorateRental)));
app.post("/api/admin/rentals", (req, res) => res.status(201).json({ id: `rent-stub-${Date.now()}`, status: "draft", ...req.body }));
app.get("/api/admin/rentals/:rentalId", (req, res) => {
  const rental = byId(rentals, req.params.rentalId);
  return rental ? res.json(decorateRental(rental)) : notFound(res, "Rental");
});
app.put("/api/admin/rentals/:rentalId", (req, res) => res.json({ id: req.params.rentalId, ...req.body, status: "stub_updated" }));
["activate", "complete", "cancel"].forEach((action) => {
  app.post(`/api/admin/rentals/:rentalId/${action}`, (req, res) => res.json({ rentalId: req.params.rentalId, action, ok: true }));
});

app.get("/api/admin/container-sizes", (_req, res) => res.json(containerSizes));
app.post("/api/admin/container-sizes", (req, res) => res.status(201).json({ id: `size-stub-${Date.now()}`, ...req.body }));
app.put("/api/admin/container-sizes/:sizeId", (req, res) => res.json({ id: req.params.sizeId, ...req.body }));

app.get("/api/admin/containers", (_req, res) => res.json(containers.map((container) => ({ ...container, size: byId(containerSizes, container.sizeId) }))));
app.post("/api/admin/containers", (req, res) => res.status(201).json({ id: `cont-stub-${Date.now()}`, ...req.body }));
app.get("/api/admin/containers/:containerId", (req, res) => {
  const container = byId(containers, req.params.containerId);
  return container ? res.json({ ...container, size: byId(containerSizes, container.sizeId), maintenance: maintenanceRecords.filter((record) => record.containerId === container.id) }) : notFound(res, "Container");
});
app.put("/api/admin/containers/:containerId", (req, res) => res.json({ id: req.params.containerId, ...req.body }));
app.post("/api/admin/containers/:containerId/mark-maintenance", (req, res) => res.json({ containerId: req.params.containerId, status: "maintenance", issue: req.body.issue ?? null }));
app.post("/api/admin/containers/:containerId/mark-available", (req, res) => res.json({ containerId: req.params.containerId, status: "available" }));

app.get("/api/admin/container-inventory-file", async (_req, res) => {
  try {
    res.json(await readContainerInventoryFile());
  } catch (error) {
    res.status(500).json({ error: "Unable to read container inventory file", detail: error.message });
  }
});

app.post("/api/admin/container-inventory-file", async (req, res) => {
  try {
    const inventory = await readContainerInventoryFile();
    const item = normalizeInventoryItem(req.body);
    if (inventory.some((existing) => existing.id.toLowerCase() === item.id.toLowerCase())) {
      return res.status(409).json({ error: "Container ID already exists" });
    }
    const nextInventory = [...inventory, item];
    await writeContainerInventoryFile(nextInventory);
    res.status(201).json({ item, inventory: nextInventory });
  } catch (error) {
    res.status(500).json({ error: "Unable to save container inventory file", detail: error.message });
  }
});

app.get("/api/admin/dispatch/jobs", (_req, res) => res.json(dispatchJobs));
app.post("/api/admin/dispatch/jobs", (req, res) => res.status(201).json({ id: `job-stub-${Date.now()}`, status: "pending", ...req.body }));
app.get("/api/admin/dispatch/jobs/:jobId", (req, res) => {
  const job = byId(dispatchJobs, req.params.jobId);
  return job ? res.json({ ...job, worker: byId(workers, job.workerId), truck: byId(trucks, job.truckId) }) : notFound(res, "Dispatch job");
});
app.put("/api/admin/dispatch/jobs/:jobId", (req, res) => res.json({ id: req.params.jobId, ...req.body }));
["assign", "start", "complete", "cancel"].forEach((action) => {
  app.post(`/api/admin/dispatch/jobs/:jobId/${action}`, (req, res) => res.json({ jobId: req.params.jobId, action, payload: req.body, ok: true }));
});

app.get("/api/admin/invoices", (_req, res) => res.json(invoices));
app.post("/api/admin/invoices", (req, res) => res.status(201).json({ id: `inv-stub-${Date.now()}`, status: "draft", ...req.body }));
app.get("/api/admin/invoices/:invoiceId", (req, res) => {
  const invoice = byId(invoices, req.params.invoiceId);
  return invoice ? res.json(invoice) : notFound(res, "Invoice");
});
app.post("/api/admin/invoices/:invoiceId/send", (req, res) => res.json({ invoiceId: req.params.invoiceId, status: "sent", recipient: req.body.email ?? null }));

app.get("/api/admin/payments", (_req, res) => res.json(payments));
app.post("/api/admin/payments", (req, res) => res.status(201).json({ id: `pay-stub-${Date.now()}`, status: "recorded", ...req.body }));
app.get("/api/admin/payments/:paymentId", (req, res) => {
  const payment = byId(payments, req.params.paymentId);
  return payment ? res.json(payment) : notFound(res, "Payment");
});

app.get("/api/admin/workers", (_req, res) => res.json(workers));
app.post("/api/admin/workers", (req, res) => res.status(201).json({ id: `worker-stub-${Date.now()}`, ...req.body }));
app.put("/api/admin/workers/:workerId", (req, res) => res.json({ id: req.params.workerId, ...req.body }));

app.get("/api/admin/trucks", (_req, res) => res.json(trucks));
app.post("/api/admin/trucks", (req, res) => res.status(201).json({ id: `truck-stub-${Date.now()}`, ...req.body }));
app.put("/api/admin/trucks/:truckId", (req, res) => res.json({ id: req.params.truckId, ...req.body }));

app.get("/api/admin/trucks-file", async (_req, res) => {
  try {
    res.json(await readTrucksFile());
  } catch (error) {
    res.status(500).json({ error: "Unable to read trucks file", detail: error.message });
  }
});

app.post("/api/admin/trucks-file", async (req, res) => {
  try {
    const fileTrucks = await readTrucksFile();
    const item = normalizeTruck(req.body);
    if (fileTrucks.some((existing) => existing.id.toLowerCase() === item.id.toLowerCase())) {
      return res.status(409).json({ error: "Truck ID already exists" });
    }
    const nextTrucks = [...fileTrucks, item];
    await writeTrucksFile(nextTrucks);
    res.status(201).json({ item, trucks: nextTrucks });
  } catch (error) {
    res.status(500).json({ error: "Unable to save trucks file", detail: error.message });
  }
});

app.delete("/api/admin/trucks-file/:truckId", async (req, res) => {
  try {
    const fileTrucks = await readTrucksFile();
    const nextTrucks = fileTrucks.filter((item) => item.id !== req.params.truckId);
    if (nextTrucks.length === fileTrucks.length) return notFound(res, "Truck");
    await writeTrucksFile(nextTrucks);
    res.json({ deletedId: req.params.truckId, trucks: nextTrucks });
  } catch (error) {
    res.status(500).json({ error: "Unable to delete truck", detail: error.message });
  }
});

app.get("/api/admin/calendar", (_req, res) => res.json(calendarLayers));
app.get("/api/admin/tax-export/quicken", (_req, res) => res.json(taxExport));

app.get("/api/admin/maintenance", (_req, res) => res.json(maintenanceRecords));
app.post("/api/admin/maintenance", (req, res) => res.status(201).json({ id: `maint-stub-${Date.now()}`, status: "open", ...req.body }));
app.put("/api/admin/maintenance/:recordId", (req, res) => res.json({ id: req.params.recordId, ...req.body }));
app.post("/api/admin/maintenance/:recordId/close", (req, res) => res.json({ id: req.params.recordId, status: "closed", resolution: req.body.resolution ?? null }));

app.get("/api/admin/work-orders-file", async (_req, res) => {
  try {
    res.json(await readWorkOrdersFile());
  } catch (error) {
    res.status(500).json({ error: "Unable to read work orders file", detail: error.message });
  }
});

app.post("/api/admin/work-orders-file", async (req, res) => {
  try {
    const workOrders = await readWorkOrdersFile();
    const item = normalizeWorkOrder(req.body);
    if (workOrders.some((existing) => existing.id.toLowerCase() === item.id.toLowerCase())) {
      return res.status(409).json({ error: "Work order ID already exists" });
    }
    const nextWorkOrders = [...workOrders, item];
    await writeWorkOrdersFile(nextWorkOrders);
    res.status(201).json({ item, workOrders: nextWorkOrders });
  } catch (error) {
    res.status(500).json({ error: "Unable to save work orders file", detail: error.message });
  }
});

app.delete("/api/admin/work-orders-file/:workOrderId", async (req, res) => {
  try {
    const workOrders = await readWorkOrdersFile();
    const nextWorkOrders = workOrders.filter((item) => item.id !== req.params.workOrderId);
    if (nextWorkOrders.length === workOrders.length) return notFound(res, "Work order");
    await writeWorkOrdersFile(nextWorkOrders);
    res.json({ deletedId: req.params.workOrderId, workOrders: nextWorkOrders });
  } catch (error) {
    res.status(500).json({ error: "Unable to delete work order", detail: error.message });
  }
});

app.get("/api/admin/pricing", (_req, res) => res.json(pricing));
app.put("/api/admin/pricing", (req, res) => res.json({ ...pricing, ...req.body, updatedAt: new Date().toISOString() }));

app.listen(port, () => {
  console.log(`Lassen Rents API stub running on http://localhost:${port}`);
});
