import React, { Component } from 'react';
import './register.css'

export class Sharding extends Component {
    state = {
        ...this.props.state,
        email: "",
        password: "",
        authMessage: ""
    };

    handleEmailInputChange = (e) => {
        // console.log(this.state)
        this.setState({ email: e.target.value });
    }
    handlePasswordInputChange = (e) => {
        this.setState({ password: e.target.value });
    }
    handleIdInputChange = (e) => {
        console.log(e.target.value);
        console.log(this.state)
        this.setState({ userId: Number(e.target.value) });
        console.log(this.state);
    }

    submitDetails = async (event) => {
        event.preventDefault();
        console.log(this.state);
        const { contract } = this.state;
        const response = await contract[1].methods.login(this.state.userId, this.state.email, this.state.password).call();

        console.log(response);
        if (response === "Logged in") {
            const response1 = await this.state.contract[1].methods.getUserDetails(this.state.userId).call();
            localStorage.setItem("user", response1);
            // this.props.navigation.navigate("/CreateCase",this.state);
            window.location.href = "/CreateCase";
        }
        else {
            this.setState({ authMessage: response });
        }
    }


    render() {
        return (

            <div class="container">
                <center><h2>Sharding Technique</h2></center>
                <form onSubmit={this.submitDetails}>
                    <br />
                    <label htmlFor="id">Enter Number Of Shards: </label>
                    <input required min="1" type="number" name="id" id="id" onChange={this.handleIdInputChange} />
                    <br />
                    <br />
                    <input type="submit" value="submit" id='submit' name="submit" />
                    <br />

                    <h4>{this.state.authMessage}</h4>

                </form>
            </div>
        )
    }
}