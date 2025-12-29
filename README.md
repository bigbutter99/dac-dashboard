# dac-dashboard

## Summary

Pilot-ready SPFx web part that renders a DAC dashboard using offline-friendly mock data and requires no Graph/AAD/API permissions.

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.18.2-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Prerequisites

- Node.js 18.x (SPFx 1.18.2 requires >=18.17.1 <19.0.0). This repo pins `18.19.1` in `.nvmrc`.
- Windows (PowerShell) using nvm-windows:
  - `nvm install 18.19.1`
  - `nvm use 18.19.1`

### Troubleshooting (Node/npm)

- If you see `npm ... does not support Node.js v18.x`, your `npm` is too new for Node 18.
- Recommended: use Node 18 with npm 9 or 10 for SPFx 1.18.x builds (or install Node 18 LTS which ships with a compatible npm).

## Solution

This repository contains an SPFx web part (`DAC Dashboard (Pilot)`) and a small local playground for UI iteration.

## Version history

| Version | Date       | Comments |
| ------- | ---------- | -------- |
| 0.0.1   | 2025-12-28 | Initial pilot cut |

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Local UI iteration (no SharePoint tenant required):
  - `cd playground`
  - `npm ci`
  - `npm run dev`
- SPFx hosted workbench (requires tenant):
  - `npm ci`
  - `npx gulp serve`

- Ship package (no tenant required):
  - `npm ci`
  - `npm run ship`

### CI build artifact

- GitHub Actions workflow `Ship Package` builds and uploads the `.sppkg` as an artifact named `dac-dashboard-sppkg`.
- Admin-ready handoff doc: `docs/admin-request.md`

- Clone this repository
- Ensure that you are at the solution folder
- in the command-line run:
  - **npm ci**
  - **npx gulp serve**

> Include any additional steps as needed.

## Pilot Deployment (Tenant-Ready, Minimal Admin Ask)

### What admins will be asked to do (pilot)

- Upload the SPFx package `sharepoint/solution/dac-dashboard.sppkg` to the tenant App Catalog.
- For a low-risk pilot, keep deployment scoped:
  - Do not enable tenant-wide deployment unless explicitly required for your pilot approach.
    - In the App Catalog, leave unchecked: “Make this solution available to all sites in the organization”.
  - Do not approve API permissions (this solution is intended to require none).

### What site owners will do (pilot)

- On the pilot site, add the app from the tenant App Catalog (Site contents → Add an app).
- Edit a page and add the web part `DAC Dashboard (Pilot)`.

### Rollback / Uninstall

- Remove the web part from pages where it is used.
- Remove the app from the pilot site (Site contents).
- Admins can remove the package from the App Catalog to prevent future installs.

### “Minimal Admin Ask” checklist

- No Microsoft Graph usage.
- No AAD app registration.
- No `webApiPermissionRequests` / API permission approvals.
- No external CDN required for pilot packaging (`includeClientSideAssets` is enabled).
- Mock mode is offline-capable and should render without public internet connectivity.

## Known Constraints / Security Notes

- Default mode is mock/offline-friendly and is designed to render without public internet access.
- The solution does not request SharePoint API permissions (`webApiPermissionRequests` is not used).
- The solution is intended to run without Microsoft Graph and without AAD app registration.
- For pilots, prefer site-scoped install and avoid tenant-wide deployment unless required.

## Deep Links & Print

- Navigate directly to a company: append `#view=company&org=<slug>` (example: `#view=company&org=climeworks`).
- Map stub for upcoming geo view: `#view=map&org=<slug>` keeps the same company selected when you swap tabs.
- Print/save the exec brief: open `#view=brief&org=<slug>`; use the browser's print dialog to export to PDF.
- Cmd/Ctrl-click any “Open 360” link to compare multiple orgs side-by-side in separate tabs.

## Features

Description of the extension that expands upon high-level summary above.

This extension illustrates the following concepts:

- Pilot-friendly SPFx packaging and deterministic ship builds
- Offline-capable mock mode (no external calls required)
- SharePoint-only host support

> Notice that better pictures and documentation will increase the sample usage and the value you are providing for others. Thanks for your submissions advance.

> Share your web part with others through Microsoft 365 Patterns and Practices program to get visibility and exposure. More details on the community, open-source projects and other activities from http://aka.ms/m365pnp.

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development
