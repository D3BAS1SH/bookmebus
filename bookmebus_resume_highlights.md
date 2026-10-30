# BookMeBus - Bus Transit Management System

## Overview
BookMeBus is a modern, full-stack web application designed for bus transit management. It serves multiple roles (Travelers, Drivers, Admins) with a comprehensive suite of features ranging from seat booking and ticket generation to real-time bus tracking and driver dashboards. Built with a robust Hybrid BFF (Backend-For-Frontend) architecture, it ensures secure, high-performance interactions between the client and server.

---

## 🚀 Key Features

*   **Real-Time Bus Tracking**: Live GPS location broadcasting from driver dashboards to traveler interfaces using WebSockets (STOMP/SockJS).
*   **Seat Booking & Locking Mechanism**: Interactive seat selection with concurrent booking prevention using Redis-based distributed locks.
*   **Automated Ticket Generation**: Server-side PDF ticket generation (iText 8) and QR code creation (ZXing) for seamless boarding.
*   **Driver Cockpit & Boarding Verification**: A dedicated driver dashboard featuring an active trip view, passenger manifest, and a built-in QR code scanner (html5-qrcode) for quick traveler boarding verification.
*   **Role-Based Access Control (RBAC)**: Secure access management with distinct views and permissions for Travelers, Drivers, and Administrators, backed by JWT authentication.
*   **Hybrid BFF Architecture**: Secure token handling (httpOnly cookies) and API proxying via Next.js API routes (BFF) to a Spring Boot backend.
*   **Interactive Maps**: Integration of React Leaflet for geographical visualization of routes, boarding/drop-off points, and live bus locations.

---

## 🛠 Technology Stack

### Frontend (Client & BFF)
*   **Framework**: Next.js 16 (App Router, Server-Side Rendering)
*   **Library**: React 19
*   **Styling**: Tailwind CSS v4, Framer Motion (Animations)
*   **UI Components**: Shadcn UI, Radix UI, Phosphor Icons, Lucide React
*   **State & Data Fetching**: Zustand, TanStack React Query v5
*   **Mapping & Scanning**: React Leaflet, html5-qrcode
*   **Real-Time**: @stomp/stompjs, sockjs-client

### Backend (Microservice Core)
*   **Framework**: Spring Boot 4.0.5, Java 25
*   **Database & ORM**: PostgreSQL 18, Spring Data JPA, Hibernate, Hypersistence Utils
*   **Caching & Locking**: Redis 7, Spring Data Redis
*   **Security**: Spring Security, JSON Web Tokens (JJWT)
*   **Real-Time**: Spring WebSocket + Spring Security Messaging (STOMP)
*   **Utilities**: Flyway (Database Migrations), MapStruct (DTO Mapping), Lombok, iText 8 (PDFs), ZXing (QR Codes), Springdoc OpenAPI

### DevOps & Infrastructure
*   **Containerization**: Docker, Docker Compose (Multi-stage builds)

---

## 🌟 Resume Highlights / Talking Points

*   **Architected a Hybrid BFF System**: Engineered a Next.js Backend-For-Frontend layer to proxy requests to a Spring Boot microservice, securing JWTs in `httpOnly` cookies and preventing XSS vulnerabilities.
*   **Implemented Real-Time Geospatial Tracking**: Developed a WebSocket-based GPS tracking system using STOMP and Leaflet, allowing travelers to track their buses with sub-10-second latency.
*   **Built a Concurrency-Safe Booking Engine**: Designed a Redis-backed seat locking mechanism to handle high-traffic booking scenarios and prevent double-booking of bus seats.
*   **Developed a Full-Fledged Driver Dashboard**: Created a mobile-responsive "cockpit" for bus drivers featuring real-time passenger manifests, automated background GPS transmission, and integrated QR code boarding verification.
*   **Optimized Containerized Deployments**: Configured optimized, multi-stage Dockerfiles and a comprehensive `docker-compose` environment for local development and production readiness, significantly reducing image sizes.
*   **Integrated Automated Document Generation**: Utilized Java libraries (iText and ZXing) to dynamically generate downloadable PDF tickets embedded with secure QR codes upon successful booking.
