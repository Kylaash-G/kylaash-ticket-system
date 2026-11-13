// Demo route data. Fares are the same in either travel direction.
const locations = [
  "Chennai",
  "Bangalore",
  "Hyderabad",
  "Coimbatore",
  "Madurai",
  "Trichy"
];

const prices = {
  "Bangalore-Chennai": 300,
  "Chennai-Coimbatore": 350,
  "Chennai-Hyderabad": 450,
  "Chennai-Madurai": 320,
  "Chennai-Trichy": 250,
  "Bangalore-Coimbatore": 370,
  "Bangalore-Hyderabad": 400,
  "Hyderabad-Madurai": 500,
  "Coimbatore-Trichy": 220
};

const buses = [
  { busNo: "TN01AB1234", time: "6:00 AM" },
  { busNo: "TN02CD5678", time: "10:00 AM" },
  { busNo: "TN03EF9012", time: "2:00 PM" },
  { busNo: "TN04GH3456", time: "8:00 PM" }
];

const STORAGE_KEY = "kylaash-ticket-bookings-v2";
