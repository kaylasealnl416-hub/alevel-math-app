# Secret Remediation Record

- Date: 2026-07-05
- Scope: current repository tree only
- Status: repository-visible values redacted

## What Was Remediated

The current repository tree contained historical deployment documentation with database connection strings and JWT secret examples that looked operational. These values have been replaced with non-functional placeholders.

Affected areas:

- `archive/old-deploy-docs/DEPLOY_TO_RAILWAY.md`
- `archive/old-deploy-docs/QUICK_DEPLOY.md`
- `archive/history-2026-03/WORK_LOG_2026-03-08.md`
- `specs/deployment-checklist.md`

## Required External Rotation

Because these values were already present in Git history, redacting the current tree is not enough if any value was ever live. The following external actions are required in the service consoles:

1. Rotate the Supabase database password or revoke the exposed connection credential.
2. Rotate production `JWT_SECRET` in Render and any other backend runtime environment.
3. Confirm Vercel and Render environment variables do not use any historical value from archived docs.
4. Consider Git history rewriting only after coordinating with all clones and deployment integrations.

## Verification

A targeted repository scan should no longer find the specific historical credential strings in the current tree.
