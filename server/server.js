const express = require('express');
const {ethers} = require('ethers');

const contractABI = require('./ContractABI.json');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(express.json());


const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";


const provider = ethers.getDefaultProvider("http://127.0.0.1:8545/");
const contract = new ethers.Contract(contractAddress, contractABI, provider);




async function getContractBalance() {
    try {
       // const result = await contract.getBalance();
        //console.log("Contract Balance:", result);
        const balance = await contract.getBalance();
        console.log("Contract Balance:", balance);
        const admin = await contract.minimumContribution();
        console.log("minimum Contribution  :",admin);
        //list all accounts
        // Get the list of available accounts
        const accounts = await provider.listAccounts();
        console.log("list of all accounts");
        console.log(accounts);




    } catch (error) {
        console.error("Error:", error);
    }
}

//function to switch accounts
async function switchAccountAndCallFunction(accountIndex) {
    try {
        // Get the list of available accounts
        const accounts = await provider.listAccounts();
        
        // Check if the desired account index is within bounds
        if (accountIndex >= 0 && accountIndex < accounts.length) {
            // Get the address of the desired account
            const selectedAccount = accounts[accountIndex];
            
            // Connect to the contract using the selected account
            const connectedContract = contract.connect(provider.getSigner(selectedAccount));
            
            // Now you can call any function on the contract using the selected account
            // For example:
            const result = await connectedContract.someFunction();
            
            console.log("Result:", result);
        } else {
            console.log("Invalid account index");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}


app.post("/api/data",async (req,res)=>{

const data = req.body;
console.log("data :", data);
 // Get the list of available accounts
 const accounts = await provider.listAccounts();
 const selectedAccount = accounts[2];
 const signer = provider.getSigner(selectedAccount);
 const connectedContract = contract.connect(signer);
 
//send wei to the contract
 const amountToSend = ethers.BigNumber.from(data.amount);
 const tx = await connectedContract.contribute({
     value: amountToSend,
 });
 //check the balance of the contract
 const balance = await provider.getBalance(contractAddress);
 const balanceInEther = ethers.utils.formatEther(balance);
 console.log("contract Balance in ether :", balanceInEther);
 res.status(200).json({ message: "Data processed successfully" });

});

app.get("/api/ether" , async(req,res)=>{
    const balance = await provider.getBalance(contractAddress);
    const balanceInEther = ethers.utils.formatEther(balance);
    console.log("contract Balance in ether :", balanceInEther);
    res.json({balance : balanceInEther})

});

//step1 - create 5 a spending request on node js
//step2 - get all the spending request and list them on the spending
//request page as card elements
//step3 - the spending requests will have a vote button to vote for the request

app.get("/api/requests" , async(req , res)=>{

})



// Start the server
app.listen(port, () => {
    console.log(`server running on port`,port);
});