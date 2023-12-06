document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    console.log({ email, password });

    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Handle successful login (e.g., redirect to dashboard)
        // !window.location.href = "/dashboard";
        console.log(response);
      } else {
        // Handle failed signup (e.g., display error message)
        alert("Login failed");
      }
    } catch (error) {
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
        // Handle successful signup (e.g., redirect to login)
        //! window.location.href = "/login";
        console.log(response);
      } else {
        // Handle failed signup (e.g., display error message)
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
