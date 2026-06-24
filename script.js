const sourceSelect = document.getElementById("source");
const destinationSelect = document.getElementById("destination");

// Load locations
locations.forEach(loc => {
  sourceSelect.add(new Option(loc, loc));
  destinationSelect.add(new Option(loc, loc));
});

function bookTicket() {
  const name = document.getElementById("name").value.trim();
  const source = sourceSelect.value;
  const destination = destinationSelect.value;

  if (!name || source === destination) {
    alert("Enter valid details!");
    return;
  }

  let key1 = source + "-" + destination;
  let key2 = destination + "-" + source;

  let price = prices[key1] || prices[key2];

  if (!price) {
    alert("Route not available!");
    return;
  }

  // Random ticket details
  const bus = buses[Math.floor(Math.random() * buses.length)];
  const seat = "S" + Math.floor(Math.random() * 40 + 1);
  const ticketId = "TKT" + Math.floor(Math.random() * 1000000);

  const ticket = {
    id: ticketId,
    name,
    source,
    destination,
    price,
    busNo: bus.busNo,
    time: bus.time,
    seat
  };

  // Save → prevents loss
  localStorage.setItem(ticketId, JSON.stringify(ticket));

  displayTicket(ticket);
}

function displayTicket(t) {
  const box = document.getElementById("ticket");

  box.style.display = "block";
  box.innerHTML = `
    <h3>🎟️ Ticket Confirmed</h3>
    <p><b>ID:</b> ${t.id}</p>
    <p><b>Name:</b> ${t.name}</p>
    <p><b>From:</b> ${t.source}</p>
    <p><b>To:</b> ${t.destination}</p>
    <p><b>Bus No:</b> ${t.busNo}</p>
    <p><b>Time:</b> ${t.time}</p>
    <p><b>Seat:</b> ${t.seat}</p>
    <p><b>Amount:</b> ₹${t.price}</p>
  `;
}