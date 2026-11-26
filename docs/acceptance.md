# Acceptance gate — COVENANT

## Automated acceptance
- Run `node --test`.
- CI browser smoke: desktop 1440×900, mobile 390×844, sidebar, one visible page, no horizontal page overflow, no uncaught browser errors, core product flow. External network is blocked in this test; it does not verify third-party integration.
- Production: verify exact deployed source and HTTP responses; manually repeat product flow on public domain.

## Required live evidence (NOT VERIFIED until demonstrated)
Demonstrate genuine Neuro SAN inference and two interoperable agents with actual browser exchange; verify authorized and denied responses. A local model or timeout does not prove denial.

## Release criteria
- GitHub Actions green for exact release commit.
- Manual visual review on desktop and mobile, genuine platform integration and independent evidence.
- No paid infrastructure, no secret collection, no mainnet. Do not submit as complete while any live requirement remains open.
