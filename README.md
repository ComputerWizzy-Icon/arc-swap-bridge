# ARC Developer Dashboard

A production-grade developer dashboard for interacting with Arc Testnet.

## Purpose

Provide developers with a reliable, accessible interface for monitoring Arc Testnet, managing an Arc-compatible wallet connection, inspecting recent activity, and testing RPC infrastructure.

## Architecture

The application uses Next.js App Router, a typed viem and wagmi blockchain layer, TanStack Query for remote-state caching, ConnectKit for wallet UX, and server-side RPC proxy routes for provider selection and credential protection.

## Supported features

The planned dashboard includes wallet connection and network switching, Arc network metrics, recent transactions, RPC diagnostics, portfolio visibility, configurable refresh settings, and an About Arc section.

## Setup

Install project dependencies, copy `.env.example` to `.env.local`, configure the required values, and start the development server. Exact commands are added after dependencies are installed.

## Environment variables

See `.env.example` for the public Arc metadata, WalletConnect project ID, server-side RPC provider URLs, request timeout, and retry configuration.

## Deployment

The dashboard is designed for deployment to Vercel or a Node-compatible Next.js host. Production deployment requires environment validation, linting, type checking, a production build, and an Arc RPC smoke test.
