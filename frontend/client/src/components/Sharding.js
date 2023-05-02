import React, { Component } from 'react';
// import './register.css'

export class Sharding extends Component {
    state = {
        ...this.props.state,
        shardCount: 0,
        message1:[],
        interShard: [],
        DPOS: [],
        Efficiency:[],
        shard_before: [],
        shard_after: []
    };
    index=0;

    handleShardCountInputChange = (e) => {
        // console.log(this.state)
        this.setState({ shardCount: e.target.value });
    }

    // 1) Time Reduction:
    // Assuming that the network is fully sharded, the overall time reduction can be estimated using the following equation:

    tot_time_red =(s)=> {
        let TTR = ((1 - (1 / s)) ** 3) * 100;
        return TTR;
    }


    // Gas Reduction:
    // The reduction in gas can be estimated using the following equation:

    gas_red=(s) =>{
        let GR = (1 - 1/s)**(2/3) * 100;
        return GR;
    }
    
    // Gas Reduction:
    // The reduction in gas can be estimated using the following equation:

    gas_red1=(s,n,t,t0,i,i0) =>{
        let GR = (1 - (1/s)**(1/n) * (t/t0) * (i/i0))**(2/3) * 100;
        return GR;
    }
     

    // Ethereum Reduction:
    // The reduction in Ethereum can be estimated using the following equation:

    eth_red=(s)=> {
        let ER =(1 - 1/s)**(1/3) * 100;
        return ER
    }
    
    
    // Ethereum Reduction:
    // The reduction in Ethereum can be estimated using the following equation

    eth_red1=(s,n,t,t0,i,i0)=> {
        let ER = (1 - (1/s)**(1/n) * (t/t0) *(i/i0))**(1/3) * 100;
        return ER;
    }
    
    
    // Scalability:
    
    sca_red=(TR,GR,ER) =>{
        let SI = (TR/100) * (GR/100) * (ER/100) *100;
        return SI;
    }

    submitDetails = async (event) => {
        event.preventDefault();
        this.setState({ message: [], authMessage: "" });
        console.log(this.state);
        const { contract } = this.state;
        let shardSize = await contract[0].methods.getDocsCount().send({ from: this.state.accounts[0] }); 
        console.log(shardSize);
        let shardSize1=shardSize;
        shardSize = shardSize.events.noOfDOCS.returnValues[0];
        let shardCount=Number(this.state.shardCount);
        shardSize=Math.ceil(shardSize/shardCount);
        console.log(shardSize,shardCount);
        let response = await contract[0].methods.setshardParameters(shardCount,shardSize).send({ from: this.state.accounts[0] });
        console.log(response);
        this.index=1;
        // console.log(response.events.InterShard.returnValues[0]);
        // console.log(response.events.DPOS_Event.returnValues[0]);

        // this.setState({message:response.events.InterShard.returnValues[0]});
        // this.setState({message1:response.events.InterShard.returnValues[0]});
        // this.setState({authMessage:"response.events.InterShard.returnValues[0]"});

        // for(let i=0;i<this.state.shardCount;i++){
        //     response = await contract[2].methods.setShardHash(i,"0xa0ea57091e7f1d8d0c29ae04029d50d67440988ddd1bba093ef9281745d2c08c").send({ from: this.state.accounts[0] });
        //     console.log(response);
            
        //     for(let j=0;j<2;j++){
        //         response = await contract[2].methods.addValidator(i,this.state.accounts[0]).send({ from: this.state.accounts[0] });
        //         console.log(response);    
        //     }
        // }


        this.index=1;
        this.setState({ interShard: response.events.InterShard.returnValues[0] });
        this.setState({ DPOS: response.events.DPOS_Event.returnValues[0] });
    
          let shards_before=response.events.Shardss[0].returnValues[0]
    
          this.state.shard_before=[];
          let sum=0;
          for(let i=0;i<shards_before.length;i++){
            sum=0;
            
            for(let j=0;j<shards_before[i][2].length;j++){
              
              sum+=shards_before[i][2][j][0].length;
              
            }
              this.state.shard_before.push({shard:i,transactions:sum});
            }
            
            console.log(this.state.shard_before);
            
            let shards_after=response.events.Shardss[1].returnValues[0]
            
            this.state.shard_after=[];
            sum=0;
            for(let i=0;i<shards_after.length;i++){
              sum=0;
              
              for(let j=0;j<shards_after[i][2].length;j++){
                  
                  sum+=shards_after[i][2][j][0].length;
                  
                }
                this.state.shard_after.push({shard:i,transactions:sum});
            }
            
            console.log(this.state.shard_after);
            this.state.Efficiency=[];
            let tr=this.tot_time_red(shardCount),gr=this.gas_red(shardCount),er=this.eth_red(shardCount);
            this.setState(prevState => ({
                Efficiency: [
                  ...prevState.Efficiency,
                  { head: "Total Time Reduction", value: this.tot_time_red(shardCount) },
                  { head: "Gas Reduction1", value: this.gas_red(shardCount) },
                  { head: "Gas Reduction2", value: this.gas_red1(shardCount,100,1000,0.9,20,100000) },
                  { head: "Ethereum Reduction1", value: this.eth_red(shardCount) },
                  { head: "Ethereum Reduction2", value: this.eth_red1(shardCount,100,1000,0.9,20,100000)  },
                  { head: "Scalability Acheived", value: this.sca_red(tr,gr,er) }
                ]
              }));
    }

    render() {
        const Efficiency=this.state.Efficiency.map((item,index)=>{
            return(
              <p key={index}> {item.head} {item.value}</p>
            )
          })
    
        const InterShard = this.state.interShard.map((value, index1) => {
          return (
            <p key={index1}>
              {value === true ? (
                <p>CrossShard Communication Exists for Case {this.index++}</p>
              ) : (
                <p>CrossShard Communication does not Exists for Case {this.index++}</p>
              )}
            </p>
          );
        });
    
        const DPOS= this.state.DPOS.map((value,index)=>{
          return(
              <p key={index}>{value}</p>
          )
        })
    
        
    
        const Shards_Before= this.state.shard_before.map((item,index)=>{
          return(
            <p key={index}> Shard {item.shard} has {item.transactions} transactions</p>
          )
        })
    
        const Shards_After= this.state.shard_after.map((item,index)=>{
          return(
            <p key={index}>Shard {item.shard} has {item.transactions} transactions</p>
          )
        })
        return (
            
            <div>
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


                        {this.index > 0 ? (
                            <div>

                                <h2>Before Rebalancing</h2>
                                {Shards_Before}
                                <h2>After Rebalancing</h2>
                                {Shards_After}
                                <h2>Cross Shard Communications</h2>
                                {InterShard}
                                <h2>Order of Executions</h2>
                                {DPOS}
                                <h2>Efficiency Analysis</h2>
                                {Efficiency}

                            </div>
                            ) : (
                            <div>
                            </div>
                            )}
                    </form>
                </div>
            </div>
        )
    }
}