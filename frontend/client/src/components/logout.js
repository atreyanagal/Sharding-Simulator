import React, { Component } from 'react';


export class Logout extends Component {

    componentDidMount = () => {
        localStorage.removeItem("user");
        window.location.href = "/Login";
    }

    render() {
        return (
            <div></div>
        )
    }
}