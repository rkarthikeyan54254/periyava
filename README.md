# Just Periyava

**Just Periyava** is a deliberately small consumer product shell over the private Pramāṇa Mahaperiyava evidence service.

Its job is simple: help a person ask **“What did Periyava say?”** without exposing retrieval machinery, corpus internals, model terminology, restricted source text, or infrastructure details.

## Trust boundary

This repository **must never become a corpus repository**.

- Authoritative corpus, retrieval, evidence sufficiency, quality gates and restricted Deivathin Kural source material remain in `rkarthikeyan54254/pramana`.
- This service talks to the Pramāṇa production API.
- The browser never receives the Pramāṇa service credential.
- The server transforms Pramāṇa packets into a strict public DTO and drops support IDs, retrieval scores, raw evidence payloads, provider/model data, generation requests and policy internals.
- `supported`, `qualified` and `abstain` are preserved as first-class product states.
- An abstention describes a limitation of the currently verified corpus. It must never be phrased as proof that Mahaperiyava never spoke on the subject.

## Architecture

```text
Browser
  ↓ same-origin /api/*
Just Periyava Node server
  ↓ service credential remains server-side
Pramāṇa Mahaperiyava API
  ↓
curated evidence / sufficiency policy / beta ledger
```

The UI is framework-free on purpose. There are no runtime npm dependencies: native Node serves the mobile-first shell and proxies the evidence API.

## Local checks

```bash
npm run check
npm test
```

For a live backend smoke test, configure:

- `PRAMANA_API_BASE_URL`
- `PRAMANA_PROXY_TOKEN`

Then run:

```bash
npm run smoke
```

The smoke test sends a real question through the Pramāṇa answer endpoint, validates the public state mapping, and fails if known internal fields leak into the public DTO.

## Product integrity

Just Periyava does not log question text in this product service. Questions are sent to Pramāṇa for evidence lookup; the existing controlled beta ledger policy remains authoritative on the backend.

The UI explicitly describes answers as an **evidence-based curated representation of documented teachings**, not Mahaperiyava literally speaking through AI.
