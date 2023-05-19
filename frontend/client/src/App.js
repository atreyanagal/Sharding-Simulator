import React, { Component } from "react";
import Evidence from "./contracts/Evidence.json";
import User from "./contracts/userStorage.json";
import getWeb3 from "./getWeb3";

import { Link } from 'react-router-dom'
import {BrowserRouter, Route,Routes } from 'react-router-dom';
import { Createcase } from './components/create_case';
import { Getcase } from './components/get_case';
import { Getevidence } from "./components/get_evidence";
import { Insertevidence } from "./components/insert_evidence";

import "./App.css";
import { Login } from "./components/login";
import { Register } from "./components/register";
import { Sharding } from "./components/Sharding";
import { Logout } from "./components/logout";
import { TransferCase } from "./components/transfer_case";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null ,caseId:1 , message:[] , memory: "" , evidenceId:1,flag:false,userId:0};
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork1 = Evidence.networks[networkId];
      const deployedNetwork2 = User.networks[networkId];
      const evidenceContract = new web3.eth.Contract(
        Evidence.abi,
        deployedNetwork1 && deployedNetwork1.address,
        );
      const userContract = new web3.eth.Contract(
        User.abi,
        deployedNetwork2 && deployedNetwork2.address,
        );

        
        if(localStorage.getItem("user")!==null){
          this.setState({flag:true});
          console.log(this.state.flag);
        }
        else{
          this.setState({flag:false});
        }
      
        // console.log(instance1);
        
        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        this.setState({ web3, accounts, contract:[evidenceContract,userContract] });
        // console.log(this.state);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const {contract } = this.state;
    const response = await contract[0].methods.getCaseInfo(this.state.caseId).call();
    console.log(response);
    // Update state with the result.
    this.setState({ message: response});
  };

  createCase = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    const createcase=await contract[0].methods.createCase().send({ from: accounts[0] });
    console.log(createcase);
  
    this.setState({ message:createcase});
  };


  handleChange=(e)=>{
    console.log(e);
    this.setState({caseId : e.target.value});
  }
  abcd=()=>{
    console.log(this.state);
  }
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    else
    return (
        
      <BrowserRouter>
            {this.abcd()}

            {this.state.flag===true?  
            
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
              <div class="container-fluid">
                  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                      aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                      <span class="navbar-toggler-icon"></span>
                  </button>
                  <div class="collapse navbar-collapse" id="navbarNav">
                      <ul class="navbar-nav">
                          <li class="nav-item">
                              <a class="nav-link" href="/CreateCase">CreateCase</a>
                          </li>
                          <li class="nav-item">
                              <a class="nav-link" href="/Getcase">Getcase</a>
                          </li>
                          <li class="nav-item">
                              <a class="nav-link" href="/Getevidence">Getevidence</a>
                          </li>
                          <li class="nav-item">
                              <a class="nav-link" href="/Insertevidence">Insertevidence</a>
                          </li>
                          <li class="nav-item">
                              <a class="nav-link" href="/TransferCase">TransferCase</a>
                          </li>
                          <li class="nav-item">
                              <a class="nav-link" href="/Sharding">Sharding</a>
                          </li>
                          <li class="nav-item">
                              <a class="nav-link" href="/Logout">Logout</a>
                          </li>
                      </ul>
                  </div>
              </div>
          </nav>


            :  
            
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
              <div class="container-fluid">
                  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                      aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                      <span class="navbar-toggler-icon"></span>
                  </button>
                  <div class="collapse navbar-collapse" id="navbarNav">
                      <ul class="navbar-nav">
                          <li class="nav-item">
                              <a class="nav-link" href="/Login">Login</a>
                          </li>
                          <li class="nav-item">
                              <a class="nav-link" href="/Register">Register</a>
                          </li>
                      </ul>
                  </div>
              </div>
            </nav>

            }
              
            
              
            <Routes>
                {/* <Route path='/' element={<App state={this.state}/>} /> */}
                <Route path='CreateCase' element={<Createcase state={this.state}/>} />
                <Route path='Getcase' element={<Getcase state={this.state}/>} />
                <Route path='Getevidence' element={<Getevidence state={this.state}/>} />
                <Route path='Insertevidence' element={<Insertevidence state={this.state}/>} />
                <Route path='TransferCase' element={<TransferCase state={this.state}/>} />
                <Route path='Login' element={<Login state={this.state}/>} />
                <Route path='Logout' element={<Logout state={this.state}/>} />
                <Route path='Register' element={<Register state={this.state}/>} />
                <Route path='Sharding' element={<Sharding state={this.state}/>} />
            </Routes>
        </BrowserRouter>
        
);
  }
}

export default App;
