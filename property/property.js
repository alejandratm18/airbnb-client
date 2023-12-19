let headers = new Headers();

headers.append("Content-Type", "application/json");
headers.append("Accept", "application/json");

headers.append("Access-Control-Allow-Origin", "http://127.0.0.1:5500/");
headers.append("Access-Control-Allow-Credentials", "true");

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("idProperty");

document.addEventListener("DOMContentLoaded", () => {
  const propertyListElement = document.getElementById("property");
  const propertyUpdateButton = document.getElementById(
    "update_property_button"
  );
  const propertyUpdateEmailInput = document.getElementById("email_proprietor");
  const propertyReserveEmailInput = document.getElementById("email_renter");
  const currentUser = localStorage.getItem("user_email");
  const deleteButton = document.getElementById("delete-button");

  propertyReserveEmailInput.value = currentUser;

  fetch(`${envVars.BASE_LOCAL_ENDPOINT}/properties/:${id}`, {
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
        propertyUpdateEmailInput.value = property.email_proprietor;
        if (currentUser !== property.email_proprietor) {
          propertyUpdateButton.disabled = true;
          deleteButton.disabled = true;
        }
        propertyListElement.appendChild(propertyElement);
      });
    })
    .catch((error) => {
      // Handle errors
      console.error("Error fetching data:", error);
    });

  var element = document.getElementById("made_reservations");

  fetch(`${envVars.BASE_LOCAL_ENDPOINT}/rentals/property/:${id}`, {
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
                <div class="card">
                <p>Email Renter: ${rental.email_renter}</p>
                <p>Start Date: ${startDate}</p>
                <p>End Date: ${endDate}</p>
                <p>Review: ${rental.review}</p>
                <a href='/property/property.html?idProperty=${rental.id_property}'>Property ID: ${rental.id_property}</a>
                </div>
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
    fetch(`${envVars.BASE_LOCAL_ENDPOINT}/properties/:${id}`, {
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
    fetch(`${envVars.BASE_LOCAL_ENDPOINT}/properties/:${id}`, {
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
  let form = document.getElementById("property_reserve_form");
  const emailRenter = document.getElementById("email_renter").value;
  let formData = new FormData(form);
  let jsonData = {};

  for (var [key, value] of formData.entries()) {
    if (value.length !== 0) {
      jsonData[key] = value;
    }
  }
  jsonData.id_property = id;
  jsonData.email_renter = emailRenter;
  console.log(jsonData);
  // console.log(JSON.stringify(jsonData),jsonData);

  const confirmation = confirm(
    "Are you sure you want to reserve this property?"
  );
  if (confirmation) {
    fetch(`${envVars.BASE_LOCAL_ENDPOINT}/rentals`, {
      headers: headers,
      method: "POST",
      body: JSON.stringify(jsonData),
    })
      .then((response) => {
        if (!response.ok) {
          console.log(response, response.statusText);
          alert(response.statusText);
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
