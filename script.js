const sourceSelect = document.getElementById("source");
const destinationSelect = document.getElementById("destination");
const bookingForm = document.getElementById("booking-form");
const routeMessage = document.getElementById("route-message");
const ticketSection = document.getElementById("ticket-section");
const ticketDetails = document.getElementById("ticket-details");
const lookupMessage = document.getElementById("lookup-message");

function addLocationOptions(select) {
  locations.forEach((location) => {
    select.add(new Option(location, location));
  });
}

addLocationOptions(sourceSelect);
addLocationOptions(destinationSelect);

const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString().slice(0, 10);
const travelDateInput = document.getElementById("travel-date");
travelDateInput.min = localToday;
document.getElementById("year").textContent = new Date().getFullYear();

function routeKey(from, to) {
  return [from, to].sort((a, b) => a.localeCompare(b)).join("-");
}

function getFare(from, to) {
  return prices[routeKey(from, to)] ?? null;
}

function getBookings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveBookings(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

function updateRouteMessage() {
  const from = sourceSelect.value;
  const to = destinationSelect.value;

  if (!from || !to) {
    routeMessage.textContent = "Select your departure and destination cities to check the route.";
    routeMessage.className = "route-message";
    return;
  }
  if (from === to) {
    routeMessage.textContent = "Departure and destination must be different.";
    routeMessage.className = "route-message error";
    return;
  }

  const fare = getFare(from, to);
  if (fare === null) {
    routeMessage.textContent = "Sorry, this route is not available in the demo yet.";
    routeMessage.className = "route-message error";
    return;
  }

  routeMessage.textContent = `Route available · Estimated demo fare: ₹${fare}`;
  routeMessage.className = "route-message success";
}

sourceSelect.addEventListener("change", updateRouteMessage);
destinationSelect.addEventListener("change", updateRouteMessage);

function makeTicketId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return `TKT-${window.crypto.randomUUID().replaceAll("-", "").slice(0, 10).toUpperCase()}`;
  }
  return `TKT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

function chooseAvailableSeat(busNo, travelDate, bookings) {
  const occupied = new Set(
    bookings
      .filter((booking) => booking.busNo === busNo && booking.travelDate === travelDate)
      .map((booking) => booking.seat)
  );
  for (let seatNumber = 1; seatNumber <= 40; seatNumber += 1) {
    const seat = `S${seatNumber}`;
    if (!occupied.has(seat)) return seat;
  }
  return null;
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function addTicketRow(container, label, value) {
  const row = createElement("div", "ticket-row");
  row.append(createElement("span", "ticket-label", label));
  row.append(createElement("strong", "ticket-value", String(value)));
  container.append(row);
}

function displayTicket(ticket) {
  ticketDetails.replaceChildren();
  const idBlock = createElement("div", "ticket-id-block");
  idBlock.append(createElement("span", "ticket-label", "TICKET REFERENCE"));
  idBlock.append(createElement("strong", "ticket-reference", ticket.id));
  ticketDetails.append(idBlock);

  const grid = createElement("div", "ticket-grid");
  [
    ["Passenger", ticket.name],
    ["From", ticket.source],
    ["To", ticket.destination],
    ["Journey date", ticket.travelDate],
    ["Bus number", ticket.busNo],
    ["Departure", ticket.time],
    ["Seat", ticket.seat],
    ["Total fare", `₹${ticket.price}`]
  ].forEach(([label, value]) => addTicketRow(grid, label, value));
  ticketDetails.append(grid);
  ticketSection.hidden = false;
  ticketSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const source = sourceSelect.value;
  const destination = destinationSelect.value;
  const travelDate = travelDateInput.value;

  if (name.length < 2) {
    alert("Please enter a name with at least 2 characters.");
    return;
  }
  if (!source || !destination || !travelDate) {
    alert("Please complete all booking details.");
    return;
  }
  if (source === destination) {
    alert("Choose two different cities.");
    return;
  }
  if (travelDate < localToday) {
    alert("Journey date cannot be in the past.");
    return;
  }

  const price = getFare(source, destination);
  if (price === null) {
    alert("This route is not available yet. Please choose another route.");
    return;
  }

  const bookings = getBookings();
  const availableBuses = buses
    .map((bus) => ({ ...bus, seat: chooseAvailableSeat(bus.busNo, travelDate, bookings) }))
    .filter((bus) => bus.seat !== null);

  if (availableBuses.length === 0) {
    alert("Sorry, all demo seats are booked for this date.");
    return;
  }

  const selectedBus = availableBuses[Math.floor(Math.random() * availableBuses.length)];
  const ticket = {
    id: makeTicketId(),
    name,
    source,
    destination,
    travelDate,
    price,
    busNo: selectedBus.busNo,
    time: selectedBus.time,
    seat: selectedBus.seat,
    createdAt: new Date().toISOString()
  };

  bookings.push(ticket);
  try {
    saveBookings(bookings);
  } catch {
    alert("Your browser could not save the booking. Please check available storage.");
    return;
  }

  displayTicket(ticket);
  lookupMessage.textContent = "";
});

document.getElementById("lookup-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const requestedId = document.getElementById("ticket-id").value.trim().toUpperCase();
  const ticket = getBookings().find((booking) => booking.id.toUpperCase() === requestedId);

  if (!ticket) {
    lookupMessage.textContent = "No matching ticket was found in this browser.";
    lookupMessage.className = "lookup-message error";
    return;
  }

  lookupMessage.textContent = "Ticket found.";
  lookupMessage.className = "lookup-message success";
  displayTicket(ticket);
});

document.getElementById("print-ticket").addEventListener("click", () => window.print());
document.getElementById("new-booking").addEventListener("click", () => {
  bookingForm.reset();
  ticketSection.hidden = true;
  updateRouteMessage();
  document.getElementById("name").focus();
});
