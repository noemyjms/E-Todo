// -------------------------------------------------------------------------------------------------
// Formulaire d'inscription
// -------------------------------------------------------------------------------------------------

const registerForm = document.getElementById("registerformID");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("regemailID").value;
    const userName = document.getElementById("regusernameID").value;
    const firstName = document.getElementById("regfirstnameID").value;
    const password = document.getElementById("regpasswordID").value;

    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: userName,
          firstname: firstName,
          password
        })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "/todo/todo.html";
      } else {
        alert(`Erreur inscription : ${data.msg}`);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  });
}

// -------------------------------------------------------------------------------------------------
// Formulaire de connexion
// -------------------------------------------------------------------------------------------------

const loginForm = document.getElementById("loginformID");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginemailID").value;
    const password = document.getElementById("loginpasswordID").value;

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "/todo/todo.html";
      } else {
        alert(`Erreur connexion : ${data.msg}`);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  });
}

