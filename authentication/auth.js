document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const currentUser = localStorage.getItem("user_email");
  if (currentUser) {
    while (auth_actions.firstChild) {
      auth_actions.removeChild(auth_actions.firstChild);
    }
    let currentUserBanner = document.createElement("div");
    currentUserBanner.innerHTML = `You are current logged in under ${currentUser} email`;

    let logoutButton = document.createElement("button");
    logoutButton.innerText = "Logout";
    logoutButton.classList.add("auth-action");

    logoutButton.addEventListener("click", logoutAction);

    auth_actions.appendChild(currentUserBanner);
    auth_actions.appendChild(logoutButton);
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
      const response = await fetch(`${envVars.BASE_LOCAL_ENDPOINT}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        window.location.href = "/index.html";
        const responseMessage = await response.json();
        localStorage.setItem("token", responseMessage.response.token);
        localStorage.setItem("user_email", responseMessage.response.email);
      } else {
        // Handle failed signup (e.g., display error message)
        alert("Login failed ddd");
      }
    } catch (error) {
      console.log(error);
      alert("Error during login:", error);
    }
  });

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    let signUpObj = {};
    let signupFormData = new FormData(signupForm);
    signUpObj.email = signupFormData.get("signup-email");
    signUpObj.password = signupFormData.get("signup-password");
    signUpObj.last_name = signupFormData.get("lastname");
    signUpObj.phone_number = signupFormData.get("phone-number");
    signUpObj.name = signupFormData.get("name");
    console.log(signUpObj);

    try {
      const response = await fetch(`${envVars.BASE_LOCAL_ENDPOINT}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpObj),
      });

      if (response.ok) {
        const responseMessage = await response.json();
        alert(responseMessage.message);
      } else {
        alert("Signup failed");
      }
    } catch (error) {
      alert("Error during signup:", error);
    }
  });
});

function togglePasswordVisibility() {
  var loginPasswordInput = document.getElementById("login-password");
  var signupPasswordInput = document.getElementById("signup-password");
  if (loginPasswordInput.type === "password") {
    loginPasswordInput.type = "text";
    signupPasswordInput.type = "text";
  } else {
    loginPasswordInput.type = "password";
    signupPasswordInput.type = "password";
  }
}

function logoutAction() {
  localStorage.setItem("token", "");
  localStorage.setItem("user_email", "");
  location.reload();
}
