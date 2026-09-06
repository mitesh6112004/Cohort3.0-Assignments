let showRegister = document.querySelector("#showRegister");
let showLogin = document.querySelector("#showLogin");

let loginForm = document.querySelector("#loginForm");
let loginUser = document.querySelector("#loginUser");
let loginPass = document.querySelector("#loginPass");

let registerForm = document.querySelector("#registerForm");
let regUser = document.querySelector("#regUser");
let regPass = document.querySelector("#regPass");

document.addEventListener("click", (e) => {
  if (e.target.id === "showRegister") {
    document.querySelector("#login-box").style.display = "none";
    document.querySelector("#register-box").style.display = "flex";
  }

  if (e.target.id === "showLogin") {
    document.querySelector("#register-box").style.display = "none";
    document.querySelector("#login-box").style.display = "flex";
    loginForm.reset();
  }
});

let registeredUser = JSON.parse(localStorage.getItem("registeredUser")) || [];

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let user = {
    username: loginUser.value,
    currency: "$",
  };
  let pass = loginPass.value;
  let existUser = registeredUser.some((elem) => {
    return (
      elem.username.toLowerCase() === user.username.toLowerCase() &&
      elem.password === pass
    );
  });

  console.log(existUser);
  if (existUser) {
    localStorage.setItem("user", JSON.stringify(user));
    loginForm.reset();
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid username or password.");
  }
});

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let user = {
    username: regUser.value,
    password: regPass.value,
    currency: "$",
  };
  console.log(user);

  let existUser = registeredUser.some((elem) => {
    return elem.username.toLowerCase() === user.username.toLowerCase();
  });

  if (existUser) {
    alert("Username already exists! Please choose another.");
  } else {
    registeredUser.push(user);
    localStorage.setItem("registeredUser", JSON.stringify(registeredUser));
    alert("Registration successful! You can now log in.");
    registerForm.reset();
    document.querySelector("#register-box").style.display = "none";
    document.querySelector("#login-box").style.display = "flex";
  }
});
