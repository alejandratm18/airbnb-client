let headers = new Headers();

headers.append("Content-Type", "application/json");
headers.append("Accept", "application/json");

headers.append("Access-Control-Allow-Origin", "http://127.0.0.1:5500/");
headers.append("Access-Control-Allow-Credentials", "true");

document.addEventListener("DOMContentLoaded", () => {
  const rentalsListElement = document.getElementById("rentalsList");
  fetch("http://localhost:3000/api/rentals", {
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
      // Separate rentals into passed and upcoming
      const today = new Date();
      const passedRentals = rentals.filter(
        (rental) => new Date(rental.date_end) < today
      );
      const upcomingRentals = rentals.filter(
        (rental) => new Date(rental.date_start) >= today
      );

      // Display passed reservations in the DOM
      const passedRentalsHeader = document.createElement("h3");
      passedRentalsHeader.innerHTML = "Passed reservations";
      rentalsListElement.appendChild(passedRentalsHeader);
      passedRentals.forEach((rental) => {
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
        <div class="rental-item card">
          <div class="rental-info">
            <p>Email Renter: ${rental.email_renter}</p>
            <p>Start Date: ${startDate}</p>
            <p>End Date: ${endDate}</p>
            <p>Review: ${rental.review}</p>
            <a href='/property/property.html?idProperty=${rental.id_property}'>Property ID: ${rental.id_property}</a>
          </div>
          <div class="rental-forms">
            <form id="modify-rental-${rental.id_location}">
              <label for="email">Email:</label>
              <input value="${rental.email_renter}" disabled type="email" id="email_renter" name="email_renter" required><br>
              <input style="margin: 10px 0;" type="text" value="${rental.review}" id="review_${rental.id_location}" name="review"><br>
              <input type="button" value="Add a review!" onclick="modifyRental(${rental.id_location})">
            </form>
          </div>
        </div>
      `;
        rentalsListElement.appendChild(listItem);
      });

      const upcomingRentalsHeader = document.createElement("h3");
      upcomingRentalsHeader.innerHTML = "Upcoming reservations";
      rentalsListElement.appendChild(upcomingRentalsHeader);
      // Display upcoming reservations in the DOM
      upcomingRentals.forEach((rental) => {
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
        <div class="rental-item card">
          <div class="rental-info">
            <p>Email Renter: ${rental.email_renter}</p>
            <p>Start Date: ${startDate}</p>
            <p>End Date: ${endDate}</p>
            <p>Review: ${rental.review}</p>
            <a href='/property/property.html?idProperty=${rental.id_property}'>Property ID: ${rental.id_property}</a>
          </div>
          <div class="rental-forms">
            <form id="modify-rental-${rental.id_location}">
              <label for="email">Email:</label>
              <input value="${rental.email_renter}" disabled type="email" id="email_renter" name="email_renter" required><br><br>
              <label for="move_in_date">Move-in Date:</label>
              <input type="date" id="date_start_${rental.id_location}" name="date_start" required><br><br>
              <label for="move_out_date">Move-out Date:</label>
              <input type="date" id="date_end_${rental.id_location}" name="date_end" required><br><br>
              <label for="Review">Review:</label>
              <input type="text" value="${rental.review}" id="review_${rental.id_location}" name="review"><br><br>
              <input type="button" value="Change Reservation" onclick="modifyRental(${rental.id_location})">
            </form>
          </div>
        </div>
      `;
        rentalsListElement.appendChild(listItem);
      });
    })
    .catch((error) => {
      // Handle errors
      console.error("Error fetching data:", error);
    });
});
// doesn't work , propbably because of email
function modifyRental(id_location) {
  const date_start = document.getElementById(
    `date_start_${id_location}`
  )?.value;
  const date_end = document.getElementById(`date_end_${id_location}`)?.value;
  const review = document.getElementById(`review_${id_location}`).value;

  console.log(date_start, date_end, review);

  const confirmation = confirm(
    "Are you sure you want to update the details of your reservations?"
  );

  const body = { id_location };
  if (date_start) body.date_start = date_start;
  if (date_end) body.date_end = date_end;
  if (review) body.review = review;

  if (confirmation) {
    fetch(`http://localhost:3000/api/rentals/:${id_location}`, {
      headers: headers,
      method: "PUT",
      body: JSON.stringify(body),
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
