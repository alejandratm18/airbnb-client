document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        // !window.location.href = "/dashboard";
        const responseMessage = await response.json();
        localStorage.setItem("token", responseMessage.response.token);
        localStorage.setItem("user_email", responseMessage.response.email);
      } else {
        // Handle failed signup (e.g., display error message)
        alert("Login failed ddd");
      }
    } catch (error) {
        console.log(error)
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
      const response = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpObj),
      });

      if (response.ok) {
        const responseMessage = await response.json();
        alert(responseMessage.message)
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
