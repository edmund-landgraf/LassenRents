# Lassen Rents Rebuild

Modern React, Tailwind, shadcn-style UI, and Express stub for `lassenrents.com`.

## Content Ingest

The legacy site was crawled from the public WordPress pages:

- Home
- Containers
- Accessories
- Modifications
- Pinpoint Delivery
- Trucking

The rebuild preserves the core copy: onsite storage container rentals and sales, 20' and 40' specialization, service in Lassen, Plumas, and Modoc Counties, PinPoint delivery, accessories, modifications, trucking, local ownership, and Terry Mallery contact details.

## App Structure

- Public website sections: Home, Containers, Options & Accessories, Delivery, Trucking, Contact.
- Client portal: active rental, agreement, payment history, open balance, and payment action.
- Admin backend: inventory, rentals, due-back tracking, dispatch, workers, trucks, maintenance, payments, and pricing.

Frontend folders:

- `src/pages/web` - public marketing/service website.
- `src/pages/portal` - client portal experience.
- `src/pages/admin` - backend/admin operations experience.
- `src/components` - shared shadcn-style UI primitives.
- `src/data` - front-end mock data used by the pages.

Frontend routes:

- `/` - public website.
- `/containers` - container rentals and sales.
- `/request-quote` - quote request form with container selection.
- `/options` - accessories and modifications.
- `/delivery` - PinPoint delivery and pickup.
- `/trucking` - trucking and relocation.
- `/gallery` - scraped photo gallery from the Lassen Rents WordPress media library.
- `/portal/login` - client login with "Login as test client".
- `/portal` - client portal.
- `/portal/contracts` - client rental contracts grid with detail and PDF preview.
- `/portal/payment` - client payment screen with demo card flow.
- `/portal/end-rental` - client end-rental pickup request and closeout workflow.
- `/admin/login` - admin login with "Login as test admin".
- `/admin` - admin dashboard.
- `/admin/inventory` - container inventory management.
- `/admin/trucks` - truck capability management.
- `/admin/calendar` - graphical layered calendar.
- `/admin/tax-export` - Quicken tax export staging.

Admin modules now include fleet-style inventory status management, truck capability matching for 20 ft/40 ft and high-cube containers, layered calendar events, depreciation fields, and Quicken CSV tax export staging.

The public quote flow links the global "Request quote" action to `/request-quote`. Container cards with monthly pricing include a "Get quote" action that opens the request form with that container type preselected.

The public gallery uses the scraped WordPress media catalog at `public/assets/lassen-gallery/media.json`, with category filters, search, responsive image cards, and a lightbox preview.

Product images pasted in chat should be saved as local public assets when useful. The container size photos currently live in `public/assets/container-sizes` and are used by `/containers`.

The client portal includes an end-rental pickup request workflow. Until persistent database workflow state exists, the client UI reads the process steps from markdown files in `public/workflows/end-rental`.

## Commands

```bash
npm install
npm run dev
npm run build
```

The Vite dev server proxies `/api` to the Express stub on port `5174`.

## API Stubs

Key endpoints are implemented in `server/index.js`.

- `GET /api/portal/dashboard`
- `GET /api/portal/rentals`
- `GET /api/portal/payments`
- `POST /api/portal/payments`
- `GET /api/admin/dashboard`
- `GET /api/admin/containers`
- `GET /api/admin/rentals`
- `GET /api/admin/dispatch/jobs`
- `GET /api/admin/maintenance`
- `GET /api/admin/pricing`

Data is in-memory stub data in `server/data.js`.
