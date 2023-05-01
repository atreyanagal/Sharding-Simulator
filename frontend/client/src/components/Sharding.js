import React, { Component } from 'react';
import './register.css'

export class Sharding extends Component {
    state = {
        ...this.props.state,
        shardCount: 0,
        authMessage: ""
    };

    handleShardCountInputChange = (e) => {
        // console.log(this.state)
        this.setState({ shardCount: e.target.value });
    }
    
    submitDetails = async (event) => {
        event.preventDefault();
        console.log(this.state);
        const { contract } = this.state;
        let response = await contract[2].methods.setshardParameters(this.state.shardCount,this.state.shardCount).send({ from: this.state.accounts[0] });
        console.log(response);


        // for(let i=0;i<this.state.shardCount;i++){
        //     response = await contract[2].methods.setShardHash(i,"0xa0ea57091e7f1d8d0c29ae04029d50d67440988ddd1bba093ef9281745d2c08c").send({ from: this.state.accounts[0] });
        //     console.log(response);
            
        //     for(let j=0;j<2;j++){
        //         response = await contract[2].methods.addValidator(i,this.state.accounts[0]).send({ from: this.state.accounts[0] });
        //         console.log(response);    
        //     }
        // }


        
    }


    render() {
        return (

            <div className="container">
                <center><h2>Sharding Technique</h2></center>
                <form onSubmit={this.submitDetails}>
                    <br />
                    <label htmlFor="id">Enter Number Of Shards: </label>
                    <input required min="1" type="number" name="id" id="id" onChange={this.handleShardCountInputChange} />
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