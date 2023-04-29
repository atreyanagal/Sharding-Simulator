import React, { Component } from 'react';

export class Getcase extends Component {
  state = {
    ...this.props.state,
    authMessage: ""
  };

  handleChange = (e) => {
    console.log(e.target.value);
    this.setState({ caseId: e.target.value });
    // this.forceUpdate();
  }

  runExample = async (event) => {
    this.setState({ message: [], authMessage: "" });
    event.preventDefault();
    const { contract } = this.state;

    const onChainCases = await contract[1].methods.getOnChainCases(Number(localStorage.getItem("user")[0])).call();
    console.log(onChainCases);
    if (onChainCases.includes(this.state.caseId) === true) {
      const response = await contract[0].methods.getCaseInfo(this.state.caseId).call();
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
      <>
        <div class="form-group">
          <center>
            <form onSubmit={this.runExample}>
              <br />
              <h1>Get Case details</h1>

              <br />
              <div className="container">
                <label htmlFor="caseId">Enter Case ID:</label>
                <input class="form-control" required min="1" type="number" name="caseId" id="caseId" onChange={this.handleChange} />

                <br />
                <button type="submit" className="btn btn-primary">Click Here</button>
              </div>



              <br /><br /><br /><br />

              {this.state !== null && this.state.message.length !== 0 ?
                (
                  <>

                    {this.state.message[0] === "Invalid ID" ?

                      <>
                        <h3>Case ID doesn't Exist</h3>
                      </>
                      :
                      <>
                        <div>
                          <h2>Case ID:{this.state.message[1]}</h2>
                          {this.state.message[3].map((element => (
                            <>

                              <br />
                              <h3>Evidence ID:{element[0]}</h3>
                              <br />
                              <img alt="hello" src={element[1]} />
                              <br />
                            </>
                          )))}

                        </div>
                      </>
                    }
                  </>
                ) :
                (<>
                  <h4>{this.state.authMessage}</h4>
                </>)
              }


            </form>
          </center>
        </div>
      </>
    )

  }
}