import { AdminPage } from "@/pages/admin/AdminPage";
import { AdminActivityPage } from "@/pages/admin/AdminActivityPage";
import { AdminCalendarPage } from "@/pages/admin/AdminCalendarPage";
import { AdminCustomersPage } from "@/pages/admin/AdminCustomersPage";
import { AdminDispatchPage } from "@/pages/admin/AdminDispatchPage";
import { AdminInspectionPage } from "@/pages/admin/AdminInspectionPage";
import { AdminInventoryPage } from "@/pages/admin/AdminInventoryPage";
import { AdminInvoicesPage } from "@/pages/admin/AdminInvoicesPage";
import { AdminLeadsPage } from "@/pages/admin/AdminLeadsPage";
import { AdminLoginPage } from "@/pages/admin/AdminLoginPage";
import { AdminRentalWizardPage } from "@/pages/admin/AdminRentalWizardPage";
import { AdminTaxExportPage } from "@/pages/admin/AdminTaxExportPage";
import { AdminTruckPage } from "@/pages/admin/AdminTruckPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ContainersPage } from "@/pages/web/ContainersPage";
import { DeliveryPage } from "@/pages/web/DeliveryPage";
import { GalleryPage } from "@/pages/web/GalleryPage";
import { OptionsPage } from "@/pages/web/OptionsPage";
import { RequestQuotePage } from "@/pages/web/RequestQuotePage";
import { TruckingPage } from "@/pages/web/TruckingPage";
import { PortalLoginPage } from "@/pages/portal/PortalLoginPage";
import { PortalContractsPage } from "@/pages/portal/PortalContractsPage";
import { PortalEndRentalPage } from "@/pages/portal/PortalEndRentalPage";
import { PortalPaymentPage } from "@/pages/portal/PortalPaymentPage";
import { PortalPage } from "@/pages/portal/PortalPage";
import { WebPage } from "@/pages/web/WebPage";

export default function App() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";

  if (path === "/") return <WebPage />;
  if (path === "/containers") return <ContainersPage />;
  if (path === "/options") return <OptionsPage />;
  if (path === "/delivery") return <DeliveryPage />;
  if (path === "/trucking") return <TruckingPage />;
  if (path === "/gallery") return <GalleryPage />;
  if (path === "/request-quote") return <RequestQuotePage />;
  if (path === "/portal/login") return <PortalLoginPage />;
  if (path === "/portal") return <PortalPage />;
  if (path === "/portal/contracts") return <PortalContractsPage />;
  if (path === "/portal/payment") return <PortalPaymentPage />;
  if (path === "/portal/end-rental") return <PortalEndRentalPage />;
  if (path === "/admin/login") return <AdminLoginPage />;
  if (path === "/admin") return <AdminPage />;
  if (path === "/admin/leads") return <AdminLeadsPage />;
  if (path === "/admin/customers") return <AdminCustomersPage />;
  if (path === "/admin/rentals/new") return <AdminRentalWizardPage />;
  if (path === "/admin/dispatch") return <AdminDispatchPage />;
  if (path === "/admin/invoices") return <AdminInvoicesPage />;
  if (path === "/admin/inspection") return <AdminInspectionPage />;
  if (path === "/admin/activity") return <AdminActivityPage />;
  if (path === "/admin/inventory") return <AdminInventoryPage />;
  if (path === "/admin/trucks") return <AdminTruckPage />;
  if (path === "/admin/calendar") return <AdminCalendarPage />;
  if (path === "/admin/tax-export") return <AdminTaxExportPage />;

  return <NotFoundPage />;
}
