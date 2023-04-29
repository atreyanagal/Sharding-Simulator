import React, { Component } from 'react';

export class Createcase extends Component {
  state = {
    ...this.props.state,
    description: "",
    createdCaseId:0
  };

  handleChange(e) {
    console.log(e);
    this.setState({ caseId: e.target.value });
  }

  // handleTextAreaChange(e){
  //   console.log(e.target.value);
  //   this.setState({description:e.target.value});
  // }

  createCase = async (event) => {
    event.preventDefault();
    const { contract } = this.state;

    const response1 = await contract[0].methods.createCase("Creating a Case").send({ from: this.state.accounts[0] });
    console.log(response1)
    this.setState({createdCaseId: response1.events.CaseCreated.returnValues[1]});
    const response2 = await contract[1].methods.createCase(Number(localStorage.getItem("user")[0]), response1.events.CaseCreated.returnValues[1]).send({ from: this.state.accounts[0] });
    const response3 = await contract[1].methods.appendIntoChain(Number(localStorage.getItem("user")[0]), Number(response1.events.CaseCreated.returnValues[1]), response1.events.CaseCreated.returnValues[1]).send({ from: this.state.accounts[0] });

    console.log(response3);
    this.setState({ message: response2 });

    // console.log(response1);
    console.log(response2.events.createCaseInfo.returnValues.message);
    // this.state.contract.events.CaseCreated(function (err,results){
    //   if(err)
    //     console.log(err);
    //   else
    //     console.log(results.returnValues.message);
    // })
  };
  render() {
    return (

      <center>

        <div>
          <br />
          <h1>Create Case</h1>

          <br />
          <form onSubmit={this.createCase}>
            {/* <textarea value={this.state.description} onChange={this.handleTextAreaChange}/> */}
            {/* <br /> */}
            <button className="btn btn-primary" type="submit">Click Here</button>
          </form>
          <br /><br /><br /><br />

          {Object.keys(this.state.message).length !== 0 && Object.keys(this.state.message).length !== 3 ?
            (
              <div>
                <h1>Case Created {this.state.createdCaseId}</h1>
              </div>
            ) :
            (
              <p>

              </p>
            )}
        </div>
      </center>

    )
  }
}