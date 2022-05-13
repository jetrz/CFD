// connect to Moralis server
const serverUrl = "https://6nr05rjdwjeb.usemoralis.com:2053/server";
const appId = "AKW42OOzgjfiKczFh2yDyfakgZCujj9plM5e32m0";
Moralis.start({ serverUrl, appId });

/* Authentication code */
async function login() {
    let user = Moralis.User.current();
    console.log(user);
    console.log("login reached");
    if (!user) {
      user = await Moralis.authenticate({
        signingMessage: "Log in using Moralis",
      })
        .then(function (user) {
          console.log("logged in user:", user);
          //user.set("name", document.getElementById('user-username').value);
          //user.set("password", document.getElementById('user-password').value);
          //user.save();
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    window.location.href = "./../dashboard/dashboard.html";
}
  
document.querySelector('#btn-login').onclick = login;