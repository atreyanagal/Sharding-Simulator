import React, { Component } from 'react';
import { Web3Storage } from 'web3.storage';
const client = new Web3Storage({token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDY5RTJiOEM2QjYxMzE1QzM3MDM3NGQyN2M3NkFkYzQyODI1MEM3YkYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODI5NjAyNjE1NTYsIm5hbWUiOiJzaGFyZGluZyJ9.TzhNermbnVl5nDOgs3iK3CbG5hW76c2E1-lRjCf9h68"});
export class Insertevidence extends Component {
  state = {
    ...this.props.state,
    authMessage: ""
  };
  handleChangeCase = (e) => {
    console.log(e.target.value);
    this.setState({ caseId: e.target.value });
  }
  handleChangeEvidence = (e) => {
    console.log(e.target.value);
    this.setState({ evidenceId: e.target.value });
  }

  convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  handleChangeEvidenceDetails = async (e) => {
    console.log(e.target.files);
    const file = e.target.files;
    this.setState({ memory: file[0] });
    // const {datatransfer:{files}} =e.target.files;
    // const reader = new FileReader();
    // reader.readAsArrayBuffer(file[0]);
    // const base64 = await this.convertToBase64(file);
    // console.log(base64);
  }



  insertEvidence = async () => {
    const { contract } = this.state;
    console.log(this.state.memory);

    const ownerShipCases = await contract[1].methods.getOwnershipCases(Number(localStorage.getItem("user")[0])).call();
    console.log(ownerShipCases);
    const cid = await client.put([this.state.memory]);
    console.log('Content added with CID:', cid);
    if (ownerShipCases.includes(this.state.caseId) === true) {
      const response = await contract[0].methods.insertEvidence(this.state.caseId, this.state.evidenceId, cid).send({ from: this.state.accounts[0] });
      console.log(response);
      this.setState({ message: response.events.EvidenceCreated.returnValues.message });
    }
    else {
      console.log("You are not in this Network");
      this.setState({ authMessage: "You are not in this Network" });
    }

  };

  render() {
    return (
      <center>
        <div>
          <br />
          <h1>Insert Evidence</h1>
          <div class="container">
            <label htmlFor="caseId">Enter Case ID:</label>
            <input class="form-control" required min="1" type="number" name="caseId" id="caseId" onChange={this.handleChangeCase} />
            <br />
            <label htmlFor="evidenceId">Enter Evidence ID:</label>
            <input class="form-control" required min="1" type="number" name="evidenceId" id="evidenceId" onChange={this.handleChangeEvidence} />
            <br />

            <label htmlFor="evidence">Upload Evidence:</label>
            <input class="form-control" required type="file" name="evidence" id="evidence" accept=".jpeg, .png, .jpg" onChange={this.handleChangeEvidenceDetails} />
            <label htmlFor="evidence">Only .jpeg, .png, .jpg formats are allowed </label>
            <br />
            <br />
            <button className="btn btn-primary" onClick={() => this.insertEvidence()}>Click Here</button>
          </div>

          <br /><br /><br /><br />

          {this.state.message.length !== 0 ?
            <>
              <h4>{this.state.message}</h4>
            </>
            :
            <>
              <h4>{this.state.authMessage}</h4>
            </>
          }
        </div>
      </center>
    )
  }
}