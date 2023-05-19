import React, { Component } from 'react';

export class Getevidence extends Component {
  state = {
    ...this.props.state,
    authMessage: ""
  };

  handleChangeCase = (e) => {
    console.log(e.target.value);
    this.setState({ caseId: e.target.value });
    // this.forceUpdate();
  }
  handleChangeEvidence = (e) => {
    console.log(e.target.value);
    this.setState({ evidenceId: e.target.value });
    // this.forceUpdate();
  }

  getEvidence = async () => {
    const { contract } = this.state;

    const onChainCases = await contract[1].methods.getOnChainCases(Number(localStorage.getItem("user").split(",")[0])).call();
    console.log(onChainCases);
    if (onChainCases.includes(this.state.caseId) === true) {
      const response = await contract[0].methods.getEvidenceInfo(this.state.caseId, this.state.evidenceId).call();
      console.log(response);
      this.setState({ message: response });
    }
    else {
      console.log("You are not in this Network");
      this.setState({ authMessage: "You are not in this Network" });
    }

  };
  render() {
    return (
      <center>
        <div class="form-group">
          <br />
          <h1>Get Evidence Details</h1>
          <div class="container">
            <label htmlFor="caseId">Enter Case ID:</label>
            <input class="form-control" required min="1" type="number" name="caseId" id="caseId" onChange={this.handleChangeCase} />


            <br />
            <label htmlFor="evidenceId">Enter Case ID:</label>
            <input class="form-control" required min="1" type="number" name="evidenceId" id="evidenceId" onChange={this.handleChangeEvidence} />
            <br />
            <br />
            <button className="btn btn-primary" onClick={() => this.getEvidence()}>Click Here</button>
          </div>

          <br /><br /><br /><br />

          {this.state !== null && this.state.message.length !== 0 ?
            (
              <>

                {this.state.message[2] === "CaseID doesn't Exist" ?

                  <>
                    <p>Case ID doesn't Exist</p>
                  </>

                  :

                  <>

                    {this.state.message[2] === "DocID doesn't Exist" ?
                      <>
                        <p>Evidence ID doesn't Exist</p>
                      </>
                      :
                      <>
                        {
                          this.state.message.length !== 0 ?
                            <>
                              <p>Case ID: {this.state.message[0]}</p>
                              <p>Evidence ID: {this.state.message[1]}</p>
                              <a href={`https://dweb.link/ipfs/${this.state.message[2]}`}> click here </a>
                            </>
                            :

                            <>

                            </>
                        }
                      </>
                    }
                  </>
                }

              </>
            )
            :
            (
              <h4>{this.state.authMessage}</h4>
            )
          }

        </div>
      </center>
    )
  }
}