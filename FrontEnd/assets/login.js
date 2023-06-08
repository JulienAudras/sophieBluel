document.querySelector(".form").addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const user = {
    email: email,
    password: password,
  };

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())

    .then((data) => {
      const token = data.token;
      localStorage.setItem("token", token);
      console.log("token: ", token);

      if (token) {
        window.location.href = "index.html";
      } else {
        alert("Email ou mot de passe incorrect");
      }
    });
});

console.log(localStorage);
