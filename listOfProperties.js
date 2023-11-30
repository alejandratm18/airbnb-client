// displayProperties.js
let headers = new Headers();

    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");

    headers.append("Access-Control-Allow-Origin", "http://127.0.0.1:5500/");
    headers.append("Access-Control-Allow-Credentials", "true");

    
async function displayProperties(searchData = null) {
  document.addEventListener("DOMContentLoaded", () => {
    const propertyListElement = document.getElementById("propetries_list");
    
    // headers.append('GET', 'POST', 'OPTIONS');
    // Fetch data from the external API

    // http://localhost:3000/api/properties
    // https://airbnb-server-s1jv.onrender.com/api/properties this shit is not working
    fetch("http://localhost:3000/api/properties", {
      headers: headers,
      method: "GET",
      body: searchData ?? null,
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
          <div>
          <a href="property/property.html?idProperty=${property.id_property}">
          <img src=${property.image_url}>
          <h3>${property.town}, ${property.street}</h3>
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


// Define the search function
function search() {
// Function to get valid form values and add to searchData
function addValueToSearchData(input, key, data) {
    displayProperties({});

    const value = input.value.trim();
    if (value) {
      data[key] = value;
    }
  }
  
  // Capture form input values and construct the JSON object with form data
  let searchData = {};
  const formInputs = {
    date_start: "startDate",
    date_end: "endDate",
    town: "town",
    price: "maxPrice",
    rooms_number: "roomsNumber",
    beds_number: "bedsNumber",
    distance: "distance",
  };
  
  for (const [inputId, key] of Object.entries(formInputs)) {
    const input = document.getElementById(inputId);
    if (input) {
      addValueToSearchData(input, key, searchData);
    }
  }
  console.log(searchData)
  
//   displayProperties(JSON.stringify(searchData));
searchData = JSON.stringify(searchData);

  fetch("http://localhost:3000/api/properties", {
    // headers: headers,
    body: searchData ?? null,
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
        <div>
        <img src="Images/photo1.jpg">
        <h3>${property.town}, ${property.street}</h3>
        <p>Beds: ${property.beds_number}, Rooms: ${property.rooms_number}</p>
        <p>Distance: ${property.distance} miles</p>
        <p>Price: $${property.price}</p>
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

displayProperties(null);

