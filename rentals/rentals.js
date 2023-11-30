let headers = new Headers();

headers.append("Content-Type", "application/json");
headers.append("Accept", "application/json");

headers.append("Access-Control-Allow-Origin", "http://127.0.0.1:5500/");
headers.append("Access-Control-Allow-Credentials", "true");

document.addEventListener("DOMContentLoaded", () => {
  // const activeUserRentals = rentals.filter(rental => rental.email_renter === "user1@example.com");
  // activeUserRentals.forEach(rental => {
  //   const listItem = document.createElement("li");
  //   listItem.textContent = `Rental ID: ${rental.email_renter}, Review: ${rental.review}, `;
  //   rentalsListElement.appendChild(listItem);
  // }); //! for displaying according to active user
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
      // Display properties in the DOM
      rentals.forEach((rental) => {
        const startDate = new Date(rental.date_start).toLocaleDateString(undefined, { 
          year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' 
        });
        
        const endDate = new Date(rental.date_end).toLocaleDateString(undefined, { 
          year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' 
        });

        const listItem = document.createElement("li");
        listItem.innerHTML = `
              <p>Email Renter: ${rental.email_renter}</p>
              <p>Start Date: ${startDate}</p>
              <p>End Date: ${endDate}</p>
              <p>Review: ${rental.review}</p>
              <a href='/property/property.html?idProperty=${rental.id_property}'>Property ID: ${rental.id_property}</a>
              <hr>
            `;
        rentalsListElement.appendChild(listItem);
      });
    })
    .catch((error) => {
      // Handle errors
      console.error("Error fetching data:", error);
    });
});
