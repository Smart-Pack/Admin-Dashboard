# Continuous Deployment

SmartPack uses Vercel for continuous deployment of the frontend.

## Deployment Environments

The deployment process uses two environments:

* **Preview** — deployments from the `testing` branch for validation and testing.
* **Production** — deployments from the `main` branch for production use.

## Deployment Flow

Changes follow this flow:

```text
Feature Branch
      ↓
   testing
      ↓
   Preview
      ↓
    main
      ↓
  Production
```

Feature branches are merged into `testing` first. The resulting Preview deployment is used to validate the changes before they are promoted to `main`.

Merging into `main` triggers the Production deployment.

## Environment Configuration

Environment-specific configuration is managed through Vercel environment variables.

Preview deployments use testing environment configuration, while Production deployments use production configuration.

## Deployment Configuration

The frontend uses `vercel.json` to define the Vite build and deployment configuration.

The project uses pnpm as its package manager, with the lockfile enforced during deployment.

## Release

Production deployments are associated with the project's release and versioning process. Stable production states are tagged using semantic versioning.

