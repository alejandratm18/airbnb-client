let headers = new Headers();

headers.append("Content-Type", "application/json");
headers.append("Accept", "application/json");

headers.append("Access-Control-Allow-Origin", "http://127.0.0.1:5500/");
headers.append("Access-Control-Allow-Credentials", "true");

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("idProperty");

document.addEventListener("DOMContentLoaded", () => {
  const propertyListElement = document.getElementById("property");

  fetch(`http://localhost:3000/api/properties/:${id}`, {
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
      // Display properties in the DOM
      properties.forEach((property) => {
        const propertyElement = document.createElement("div");
        propertyElement.classList.add("property");
        propertyElement.innerHTML = `
        <div>
        <img class="property_page_image" src=${property.image_url}>
        <h3>${property.town}, ${property.street}</h3>
        <p>Postal code: ${property.code}</p>
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

  var element = document.getElementById("made_reservations");

  fetch(`http://localhost:3000/api/rentals/property/:${id}`, {
    headers: headers,
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
    .then((rentals) => {
      // Display properties in the DOM
      rentals.forEach((rental) => {
        const startDate = new Date(rental.date_start).toLocaleDateString(
          undefined,
          {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          }
        );

        const endDate = new Date(rental.date_end).toLocaleDateString(
          undefined,
          {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          }
        );

        const listItem = document.createElement("li");
        listItem.innerHTML = `
                <p>Email Renter: ${rental.email_renter}</p>
                <p>Start Date: ${startDate}</p>
                <p>End Date: ${endDate}</p>
                <p>Review: ${rental.review}</p>
                <a href='/property/property.html?idProperty=${rental.id_property}'>Property ID: ${rental.id_property}</a>
                <hr>
              `;
        element.appendChild(listItem);
      });
    })
    .catch((error) => {
      // Handle errors
      console.error("Error fetching data:", error);
    });
});

function deleteProperty() {
  const confirmation = confirm("Are you sure you want to delete?");
  if (confirmation) {
    fetch(`http://localhost:3000/api/properties/:${id}`, {
      headers: headers,
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
      });
  }
}

function updateProperty() {
  var form = document.getElementById("property_update_form");
  var formData = new FormData(form);
  var jsonData = {};

  for (var [key, value] of formData.entries()) {
    if (value.length !== 0) {
      jsonData[key] = value;
    }
  }

  // console.log(JSON.stringify(jsonData),jsonData);

  const confirmation = confirm(
    "Are you sure you want to update the info about the property?"
  );
  if (confirmation) {
    fetch(`http://localhost:3000/api/properties/:${id}`, {
      headers: headers,
      method: "PUT",
      body: JSON.stringify(jsonData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
      });
  }
}

function reserveProperty() {
  var form = document.getElementById("property_reserve_form");
  var formData = new FormData(form);
  var jsonData = {};

  for (var [key, value] of formData.entries()) {
    if (value.length !== 0) {
      jsonData[key] = value;
    }
  }
  jsonData.id_property = id;

  // console.log(JSON.stringify(jsonData),jsonData);

  const confirmation = confirm(
    "Are you sure you want to reserve the info about the property?"
  );
  if (confirmation) {
    fetch(`http://localhost:3000/api/rentals`, {
      headers: headers,
      method: "POST",
      body: JSON.stringify(jsonData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
      });
  }
}
