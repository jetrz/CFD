// connect to Moralis server
const serverUrl = "https://6nr05rjdwjeb.usemoralis.com:2053/server";
const appId = "AKW42OOzgjfiKczFh2yDyfakgZCujj9plM5e32m0";
Moralis.start({ serverUrl, appId });

let signinpage = "./../sign-in/index.html";

//redirect user back to sign-in page if not logged in
if (Moralis.User.current() == null) {
  document.querySelector('body').style.display = 'none';
  window.location.href = signinpage;
}

async function getTransactions() {
  // get mainnet transactions for the current user
  const transactions = await Moralis.Web3API.account.getTransactions();
  console.log(transactions);

  if (transactions.total >= 0) {
    let table = `
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Transaction</th>
          <th scope="col">Block Number</th>
          <th scope="col">Age</th>
          <th scope="col">Type</th>
          <th scope="col">Fee</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody id="theTransactions">
      </tbody>
    </table>
    `
    document.querySelector('#tableOfTransactions').innerHTML = table;

    transactions.result.forEach(t => {
      let content = `
      <tr>
          <td><a href="https://rinkeby.etherscan.io/tx/${t.hash}" target="_blank" rel="noopener noreferrer">${t.hash}</a></td>
          <td><a href="https://rinkeby.etherscan.io/block/${t.block_number}" target="_blank" rel="noopener noreferrer">${t.block_number}</a></td>
          <td>${millisecondsToTime(Date.parse(new Date()) - Date.parse(t.block_timestamp))}</td>
          <td>${t.from_address == Moralis.User.current().get('ethAddress') ? 'Outgoing' : 'Incoming'}</td>
          <td>${(t.gas*t.gas_price/1e18).toFixed(5)} ETH</td>
          <td>${(t.value/1e18).toFixed(5)} ETH</td>
      </tr>
      `

      theTransactions.innerHTML += content;
    })
  }
}

async function getBalances() {
  const ethBalance = await Moralis.Web3API.account.getNativeBalance(); //default is eth
  const ropstenBalance = await Moralis.Web3API.account.getNativeBalance({chain: "ropsten"});
  const rinkebyBalance = await Moralis.Web3API.account.getNativeBalance({chain: "rinkeby"});

  let content = document.querySelector('#userBalances').innerHTML = `
  <table class="table">
    <thead>
      <tr>
        <th scope="col">Token</th>
        <th scope="col">Balance</th>
      </tr>
    </thead>
    <tbody id="theBalances">
      <tr>
        <th>Ether</th>
        <td>${(ethBalance.balance / 1e18).toFixed(5)} ETH</td>
      </tr>
      <tr>
        <th>Ropsten</th>
        <td>${(ropstenBalance.balance / 1e18).toFixed(5)} Ropsten</td>
      </tr>
      <tr>
        <th>Rinkeby</th>
        <td>${(rinkebyBalance.balance / 1e18).toFixed(5)} Rinkeby</td>
      </tr>
    </tbody>
  </table>
  `
}

async function getNFTs() {
  console.log('get NFTs called');
  const userEthNFTs = await Moralis.Web3API.account.getNFTs();
  let tableOfNFTs = document.querySelector('#tableOfNFTs');

  if (userEthNFTs.result.length > 0) {
    userEthNFTs.result.forEach(n => {
      let metadata = JSON.parse(n.metadata);
      let content = `
      <div class="card col-md-3">
        <img src="${fixURL(metadata.image_url)}" class="card-img-top" height=300>
        <div class="card-body">
          <h5 class="card-title">${metadata.name}</h5>
          <p class="card-text">${metadata.description}</p>
        </div>
      </div>
      `

      tableOfNFTs.innerHTML += content;
    })
  }
}

function millisecondsToTime(ms) {
  let minutes = Math.floor(ms / 60000);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  if (days < 1) {
    if (hours < 1) {
      if (minutes < 1) {
        return `less than a minute ago`;
      } else return `${minutes} minute(s) ago`;
    } else return `${hours} hour(s) ago`;
  } else return `${days} day(s) ago`;
}

function fixURL(url) {
  if (url.startsWith("ipfs")) {
    return "https://ipfs.moralis.io:2053/ipfs/" + url.split("ipfs://").slice(-1);
  } else {
    return url + "?format=json"
  }
}

//logout function
async function logout() {
  await Moralis.User.logOut();
  window.location.href = signinpage;
}

//settting links for all the buttons
if (document.querySelector('#btn-logout') != null) {
  document.querySelector('#btn-logout').onclick = logout;
}

if (document.querySelector('#get-transactions-link') != null) {
  document.querySelector('#get-transactions-link').onclick = getTransactions;
}


if (document.querySelector('#get-balances-link') != null) {
  document.querySelector('#get-balances-link').onclick = getBalances;
}

if (document.querySelector('#get-nfts-link') != null) {
  document.querySelector('#get-nfts-link').onclick = getNFTs;
}