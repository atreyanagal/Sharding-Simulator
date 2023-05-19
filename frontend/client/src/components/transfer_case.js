import React, { Component } from 'react';


export class TransferCase extends Component {

    state = {
        ...this.props.state,
        receiverId: 0,
    };

    handleCaseidInputChange = (e) => {
        // console.log(e.target.value);
        this.setState({ caseId: e.target.value });
    }

    handleReceiveridInputChange = (e) => {
        console.log(e.target.value);
        this.setState({ receiverId: e.target.value });
    }

    submitDetails = async (event) => {
        event.preventDefault();
        console.log(this.state);
        const { contract } = this.state;
        const response1 = await contract[1].methods.appendIntoChain(Number(localStorage.getItem("user").split(",")[0]), Number(this.state.receiverId), this.state.caseId).send({ from: this.state.accounts[0] });
        console.log(response1);
        if (response1.events.appendChain.returnValues.message === "You are in authenticated network") {
            const response2 = await contract[1].methods.transferOwnerShip(Number(localStorage.getItem("user").split(",")[0]), Number(this.state.receiverId), this.state.caseId).send({ from: this.state.accounts[0] });
            console.log(response2);

            if (response2.events.transferOwnerShipInfo.returnValues.message === "OwnerShip Transferred") {
                this.setState({ authMessage: `OwnerShip of CaseID: ${this.state.caseId} Transferred from userID: ${Number(localStorage.getItem("user").split(",")[0])} to userID: ${this.state.receiverId} ` })
            }
            else {
                this.setState({ authMessage: `${response2.events.transferOwnerShipInfo.returnValues.message}` });
            }

        }
        else {
            this.setState({ authMessage: `${response1.events.appendChain.returnValues.message}` });
        }

        // console.log(response);
    }


    render() {
        return (
            <center>
                <br />
                <h1>Transfer Case Ownership</h1>
                <form onSubmit={this.submitDetails}>
                    <br />
                    <div className="container">
                        <label htmlFor="caseId">CaseID: </label>
                        <input class="form-control" required type="number" name="caseId" id="caseId" onChange={this.handleCaseidInputChange} />
                        <br />
                        <label htmlFor="receiverId">ReceiverID: </label>
                        <input class="form-control" required min="1" type="number" name="receiverId" id="receiverId" onChange={this.handleReceiveridInputChange} />
                        <br />
                        <input className="btn btn-primary" type="submit" value="submit" id='submit' name="submit" />
                        <br />
                    </div>
                    <h4>{this.state.authMessage}</h4>
                </form>
            </center>
        )
    }
}