# Playbbit Frontend

A high-performance, modern video streaming and social platform frontend built with Next.js, optimized for seamless interaction and low-latency playback.

## Features

- Low-Latency Streaming: Powered by hls.js for smooth video delivery.
- Real-time Interaction: Integrated STOMP/SockJS for live updates and chat.
- Robust Auth: Secure session management using NextAuth.js.
- Modern UI: Crafted with React 19, Tailwind CSS, and Radix UI components.
- Responsive Design: Mobile-first approach for viewing on any device.

## Technologies Used

### Core Framework & UI
- **Next.js 16.1.6**: React framework with App Router support.
- **React 19**: Core UI library.
- **TypeScript**: Type-safe JavaScript development.
- **Tailwind CSS 4**: Modern CSS-in-JS styling with `tailwindcss-animate` and `@tailwindcss/forms`.
- **Radix UI**: Primitive UI components for accessibility and customization.
- **Lucide React**: Scalable icon set.
- **class-variance-authority & tailwind-merge**: Utilities for managing dynamic CSS classes.

### Media & Real-time
- **hls.js**: JavaScript library for HTTP Live Streaming (HLS) playback.
- **@stomp/stompjs & sockjs-client**: Messaging protocol for real-time WebSocket communication.

### Authentication & Integration
- **NextAuth.js**: Authentication solution for Next.js applications.
- **ESLint**: Pluggable linting utility for code quality.

### Infrastructure
- **Teeter**: Go-based custom load balancer.
- **Playbbit-Backend**: Main API service.
- **MinIO**: S3-compatible object storage for media assets.

## System Architecture

Playbbit is designed with a decoupled architecture to ensure scalability and reliability.

- **Frontend**: This repository (Next.js Application).
- **Backend**: [Playbbit-Backend](https://github.com/SiddhantTotade/Playbbit) — The core API and business logic.
- **Load Balancer**: [Teeter](https://github.com/SiddhantTotade/Playbbit) — A custom Go-based high-performance load balancer that manages traffic between the frontend and distributed backend services.

## Getting Started

### Prerequisites

- **Node.js**: v20 or later.
- **npm**: v10 or later.
- **Backend Services**: Ensure [Playbbit-Backend](https://github.com/SiddhantTotade/Teeter) and [Teeter](https://github.com/SiddhantTotade/Teeter) are configured and running.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SiddhantTotade/Playbbit-Frontend.git
   cd Playbbit-Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file and update the values for your setup:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and populate it with your specific configuration:
   ```env
   # Public API URL (Accessible via Teeter Load Balancer)
   NEXT_PUBLIC_API_URL=http://your-teeter-ip:1996/api

   # Internal API URL (Direct Backend Access for Server-Side Auth)
   AUTH_API_URL=http://your-backend-ip:1994/api

   # Media Storage (MinIO / S3)
   NEXT_PUBLIC_MINIO_URL=http://your-minio-ip:9000/pbs
   NEXT_PUBLIC_MINIO_BUCKET=pbs
   ```

### Running Locally

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server with Hot Module Replacement. |
| `npm run build` | Compiles the application for production deployment. |
| `npm run start` | Runs the built production application. |
| `npm run lint` | Performs linting checks to ensure code quality. |

## Related Projects

- **[Playbbit-Backend](https://github.com/SiddhantTotade/Teeter)**: The Java/Spring-based backend powering the platform.
- **[Teeter](https://github.com/SiddhantTotade/Teeter)**: The custom Go-based load balancer ensuring high availability.

---

Built with passion by the Playbbit Team.
