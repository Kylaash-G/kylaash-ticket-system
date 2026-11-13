# Kylaash's Online Ticket Booking System

A lightweight bus ticket booking **front-end demo** built with HTML, CSS and vanilla JavaScript.

## Features
- Six predefined cities and a fixed set of supported routes
- Route fare lookup (same fare in either direction)
- Passenger name and journey-date validation
- Date-based seat allocation within this browser's saved demo bookings
- Unique ticket references
- Ticket details rendered safely as text
- Browser-local ticket storage and ticket lookup by reference
- Printable ticket layout
- Responsive, accessible booking interface

## Run locally
1. Download or clone this repository.
2. Open `index.html` in a modern browser.
3. Select a supported route, enter a passenger name and choose a journey date.
4. Book a ticket. Use the generated ticket reference in the lookup section to retrieve it.

No build tools or package installation are required.

## Important demo limitations
This is a browser-only demonstration. Bookings are stored in the current browser using `localStorage`; they are not shared across devices or users. Seat availability is therefore not globally guaranteed. There is no backend, authentication, payment gateway, live bus inventory or real reservation confirmation. Do not use it to collect real customer or payment information.

## Project files
- `index.html` – page structure and booking form
- `style.css` – responsive visual design and print styles
- `data.js` – locations, route fares, demo buses and storage key
- `script.js` – validation, booking, seat selection, storage and ticket lookup
