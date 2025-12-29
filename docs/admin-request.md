# Admin Request Pack (Pilot Install)

## What this is

`dac-dashboard` is a SharePoint Framework (SPFx) web part intended for a low-friction SharePoint pilot. It is designed to run in a mock/offline-friendly mode by default.

## What this solution does *not* require

- No Microsoft Graph usage.
- No AAD app registration.
- No API permission approvals (`webApiPermissionRequests` is not used).
- No external CDN for pilot packaging (client-side assets are included in the `.sppkg`).

## What we are asking the tenant admin to do

1) Upload the SPFx package to the tenant App Catalog:
   - Package file: `sharepoint/solution/dac-dashboard.sppkg`
2) For pilot (recommended), do **not** enable tenant-wide deployment:
   - Leave unchecked: “Make this solution available to all sites in the organization”.
3) No API permission approvals should be required.

## What the pilot site owner will do

1) On the pilot site: Site contents → New → App
2) Find and add the app, then edit a page and add the web part:
   - Web part name: `DAC Dashboard (Pilot)`

## Rollback / Uninstall

1) Remove the web part from any pages where it is used.
2) Site contents → remove the app from the pilot site.
3) Admin: remove the package from the App Catalog to prevent future installs.

## Build provenance (optional)

The package can be built offline from source using:

- `npm ci`
- `npm run ship`

Output package: `sharepoint/solution/dac-dashboard.sppkg`

