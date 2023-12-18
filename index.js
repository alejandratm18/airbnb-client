// displayProperties.js
let headers = new Headers();

headers.append("Content-Type", "application/json");
headers.append("Accept", "application/json");

headers.append("Access-Control-Allow-Origin", "http://127.0.0.1:5500/");
headers.append("Access-Control-Allow-Credentials", "true");

async function displayProperties() {
  document.addEventListener("DOMContentLoaded", () => {
    const propertyListElement = document.getElementById("propetries_list");
    const createPropertyEmailInput = document.getElementById("email");
    const welcomeSign = document.getElementById("welcome-sign");
    const signedInEmail = localStorage.getItem("user_email");
    createPropertyEmailInput.value = signedInEmail ?? "not logged in";
    welcomeSign.innerHTML = signedInEmail ?? "You're not logged in";
    // headers.append('GET', 'POST', 'OPTIONS');
    // Fetch data from the external API

    // http://localhost:3000/api/properties
    // https://airbnb-server-s1jv.onrender.com/api/properties this shit is not working
    fetch("http://localhost:3000/api/properties", {
      headers: headers,
      method: "GET",
      // body: searchData ?? null,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then((properties) => {
        // Display properties in the DOM
        properties.forEach((property) => {
          const propertyElement = document.createElement("div");
          propertyElement.classList.add("property");
          propertyElement.innerHTML = `
          <div  style="width: 205px;">
          <a class="property-item" href="property/property.html?idProperty=${property.id_property}">
          <img width="240" height="160" src=${property.image_url}>
          <h3>${property.town}, ${property.street}</h3>
          <p>Postal code: ${property.code}</p>
          <p>Beds: ${property.beds_number}, Rooms: ${property.rooms_number}</p>
          <p>Distance: ${property.distance} miles</p>
          <p>Price: $${property.price}</p>
          </a>
          </div>
        `;
          propertyListElement.appendChild(propertyElement);
        });
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
      });
  });
}

displayProperties();

// Define the search function
function search() {
  // Function to get valid form values and add to searchData
  function addValueToSearchData(input, key, data) {
    // displayProperties();

    const value = input.value.trim();
    if (value) {
      data[key] = value;
    }
  }

  // Capture form input values and construct the JSON object with form data
  let searchData = {};
  const formInputs = {
    date_start: "date_start",
    date_end: "date_end",
    town: "town",
    price: "price",
    rooms_number: "rooms_number",
    beds_number: "beds_number",
    distance: "distance",
  };

  for (const [inputId, key] of Object.entries(formInputs)) {
    //!JUST USE var form = document.getElementById("property_update_form");  var formData = new FormData(form)

    const input = document.getElementById(inputId);
    if (input) {
      addValueToSearchData(input, key, searchData);
    }
  }
  console.log(searchData);

  //   displayProperties(JSON.stringify(searchData));
  searchDataURLQuery = new URLSearchParams(searchData);
  const propertyListElement = document.getElementById("propetries_list");

  fetch(`http://localhost:3000/api/properties/?${searchDataURLQuery}`, {
    headers: headers,
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
    .then((properties) => {
      // remove old list
      propertyListElement.innerHTML = " ";
      // Display properties in the DOM
      properties.forEach((property) => {
        const propertyElement = document.createElement("div");
        propertyElement.classList.add("property");
        propertyElement.innerHTML = `
        <div style="width: 205px;">
        <a class="property-item" href="property/property.html?idProperty=${property.id_property}">
          <img width="240" height="160" src=${property.image_url}>
        <h3>${property.town}, ${property.street}</h3>
        <p>Postal code: ${property.code}</p>
        <p>Beds: ${property.beds_number}, Rooms: ${property.rooms_number}</p>
        <p>Distance: ${property.distance} miles</p>
        <p>Price: $${property.price}</p>
        </a>
        </div>
      `;
        propertyListElement.appendChild(propertyElement);
      });
    })
    .catch((error) => {
      // Handle errors
      console.error("Error fetching data:", error);
    });
}

function createProperty() {
  const propertyCreateElement = document.getElementById("property_create_form");
  const createPropertyEmailInput = document.getElementById("email").value;

  var formData = new FormData(propertyCreateElement);
  var jsonData = {};

  for (var [key, value] of formData.entries()) {
    if (value.length !== 0) {
      jsonData[key] = value;
    }
  }

  jsonData["email_proprietor"] = createPropertyEmailInput;

  console.log(jsonData);

  fetch("http://localhost:3000/api/properties", {
    headers: headers,
    method: "POST",
    body: JSON.stringify(jsonData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      console.log(response.json());
    })
    .catch((error) => {
      // Handle errors
      console.error("Error fetching data:", error);
    });
}
