import React, { Component } from 'react';
import './register.css'

export class Register extends Component {
    state = {
        ...this.props.state,
        email: "",
        password: "",
        name: "",
        age: 0,
        role: "",
        authMessage: ""
    };


    handleEmailInputChange = (e) => {
        this.setState({ email: e.target.value });
    }
    handlePasswordInputChange = (e) => {
        this.setState({ password: e.target.value });
    }
    handleNameInputChange = (e) => {
        this.setState({ name: e.target.value });
    }
    handleAgeInputChange = (e) => {
        this.setState({ age: e.target.value });
    }
    handleRoleInputChange = (e) => {
        this.setState({ role: e.target.value });
    }

    submitDetails = async (event) => {
        event.preventDefault();
        console.log(this.state);
        const response = await this.state.contract[1].methods.register(this.state.name, this.state.role, this.state.age, this.state.password, this.state.email).send({ from: this.state.accounts[0] });
        // const response = await this.state.contract[1].methods.getUserDetails(1).call();
        console.log(response);
        this.setState({ authMessage: `${response.events.createUser.returnValues.message} <br></br> User ID:${response.events.createUser.returnValues[1]}` });
        console.log(this.state.authMessage);
        console.log(response.events.createUser.returnValues.message, response.events.createUser.returnValues[1]);
        window.location.href = "/Login";
    }



    render() {
        return (

            <div className="container">
                <center><h2>Welcome to Digital Forensic Security</h2></center>
                <center><h4>(An advanced way to secure digital evidences using Blockchain Technology)</h4></center>
                <form onSubmit={this.submitDetails}>
                    <br />
                    <label htmlFor="name">Name: </label>
                    <input required minLength="2" maxLength="20" size="10" type="name" name="name" id="name" onChange={this.handleNameInputChange} />
                    <br />
                    <label htmlFor="email">Email: </label>
                    <input required type="email" name="email" id="email" onChange={this.handleEmailInputChange} />
                    <br />
                    <label htmlFor="role">Role: </label>
                    <input required type="text" name="role" id="role" onChange={this.handleRoleInputChange} />
                    <br />
                    <label htmlFor="age">Age: </label>
                    <input required min="20" max="70" type="number" name="age" id="age" onChange={this.handleAgeInputChange} />
                    <br />
                    <label htmlFor="password">Password: </label>
                    <input pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" required type="password" name="password" id="psw" onChange={this.handlePasswordInputChange} />
                    <br />
                    <br />
                    <input type="submit" value="submit" id='submit' name="submit" />
                    <br />

                    <div>
                        <center>
                            {this.state.authMessage}
                        </center>
                    </div>

                    <div id="message">
                        <h3>Password must contain the following:</h3>
                        <p id="letter" className="invalid">A <b>lowercase</b> letter</p>
                        <p id="capital" className="invalid">A <b>capital (uppercase)</b> letter</p>
                        <p id="number" className="invalid">A <b>number</b></p>
                        <p id="length" className="invalid">Minimum <b>8 characters</b></p>
                    </div>

                </form>

            </div>


        )
    }
}


