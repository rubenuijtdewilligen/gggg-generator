# 📒 gggg-creator

Generator for the **Gouwe Gilde Gezichten Gids** (GGGG) of **Het Brabants Studenten Gilde** (Het BSG). Built with **SvelteKit**, **Tailwind CSS / DaisyUI**, and **PocketBase**.

## Features

- **Admin Dashboard (`/admin`)**: Overview of member counts, active board, and birthdate validation warnings.
- **Member Management (`/admin/personen`)**: Manage members, honorary members, aspirants, and alumni, including photos, studies, birthdates, and addresses.
- **Studies & Board (`/admin/studies`, `/admin/bestuur`)**: Manage bachelor/master study codes and link board roles to members.
- **Guide Configuration (`/admin/config`)**: Customize the cover title, volume, academic years, and primary theme color.
- **Print-ready A4 Guide (`/result`)**: Generates the complete print-ready GGGG layout with PDF export.

## Prerequisites

- **Node.js** 22+
- **PocketBase**

## Local Setup

1. **Install dependencies:**

   ```bash
   npm install

   ```

2. **Configure environment variables:**

   ```bash
   cp .env.example .env
   ```

   Fill in `PUBLIC_POCKETBASE_URL`, `POCKETBASE_EMAIL` and `POCKETBASE_PASSWORD` in `.env`.

3. **Set up PocketBase:**
   - Start PocketBase (`./pocketbase serve`) and create a superuser account matching `POCKETBASE_EMAIL` and `POCKETBASE_PASSWORD`.
   - Import the collection schema from `pocketbase.json` via the PocketBase dashboard (_Settings → Import collections_).

4. **Start the development server:**

   ```bash
   npm run dev
   ```

## Environment Variables

| Variable                | Required | Default                         | Description                                                                              |
| :---------------------- | :------- | :------------------------------ | :--------------------------------------------------------------------------------------- |
| `PUBLIC_POCKETBASE_URL` | Yes      | `https://bsg-gggg-pb.c.rbnu.nl` | URL of the PocketBase instance.                                                          |
| `POCKETBASE_EMAIL`      | Yes      | -                               | Email address of the PocketBase superuser account used for server-side admin operations. |
| `POCKETBASE_PASSWORD`   | Yes      | -                               | Password of the PocketBase superuser account.                                            |

## Available Scripts

- `npm run dev` - Start the Vite development server.
- `npm run build` - Build the production application using `adapter-node`.
- `npm run preview` - Preview the production build locally.
- `npm run lint` - Check code formatting and linting with Prettier and ESLint.
- `npm run format` - Format the codebase with Prettier.

## Credits

Built by Ruben Uijtdewilligen for Het Brabants Studenten Gilde.

Design of GGGG based on old versions. Credits to Isa Tiebosch for sharing her CorelDRAW source file of the GGGG from 2023-2024.

Generator: © 2026 Ruben Uijtdewilligen. All rights reserved.

Design: © Het Brabants Studenten Gilde.
