var Web3 = require('web3');
require("dotenv").config()
const fs = require("fs")
const web3 = new Web3(Web3.givenProvider || process.env.ENDPOINT);

// prepare output
const gasEstimate = async () => {
const address = web3.eth.accounts.wallet.add(JSON.parse(fs.readFileSync('./dls/keys.json', 'utf8')).privateKey).address;
const receiver = fs.readFileSync("./dls/receiver.json", 'utf8')
var valid = web3.utils.isHexStrict(receiver);
if (valid === true) {
const estimate = await web3.eth.estimateGas({
    to: receiver
});

// write as page for web viewing
fs.writeFileSync("./pages/estimate.html", 'Estimate gas cost from: ' + address + ' to: ' + receiver + ' is: ' + JSON.stringify(estimate) + '<form action="../dls/estimate.json" method="GET">' + '<button id="estimateDL" onclick="loadEstimateDL()">Download</button>' + '</form>' + '<button id="returnHome" onclick="window.location=`../`">Return home</button>');

fs.writeFileSync("./dls/estimate.json", JSON.stringify({
  sender: address,
  receiver: receiver,
  estimate: estimate
}));
} else {

// pass error if input is ivalid
fs.writeFileSync("./pages/estimate.html", "<strong>Input error: Invalid wallet address</strong>" + "</br>Confirm you have entered the receiving address correctly." + "</br>Don't forget to add '0x' as prefix to the receiving address to pass the validation!" + "</br>Example: 0x4281eCF07778Ee777C564a59048801330f3084eE</br>" + `<button id="tryAgain" onclick="window.location='../'">Try again</button>`);
fs.writeFileSync("./dls/estimate.json", '');
}
fs.writeFileSync("./dls/receiver.json", '');
}
gasEstimate()
