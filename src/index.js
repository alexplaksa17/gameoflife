import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Box extends React.Component{
  selectBox=()=>{this.props.selectBox(this.props.row,this.props.col);}
  render(){
    return(
      <div
       className={this.props.boxClass}
       id={this.props.id}
       onClick={this.selectBox}
      />
    )
  }
}

class Grid extends React.Component{
  render(){
    const width=this.props.cols*16;
    var rowsArr=[];
    var boxClass="";
    for (var i=0;i<this.props.rows;i++){
      for(var j=0; j<this.props.cols;j++){
        let boxId=  i+"_" +j ;

        boxClass= this.props.gridFull[i][j] ? "box on" : "box off";
        rowsArr.push(
          <Box
            boxClass={boxClass}
            key={boxId}
            boxId={boxId}
            row={i}
            col={j}
            selectBox={this.props.selectBox}
          />
        );
      }
    }
    return (
      <div className="grid" style={{width:width}}>
        {rowsArr}
      </div>
    )
  }
}


class Main extends React.Component{
  constructor(props){
    super(props);
    this.speed=100;
    this.rows=30;
    this.cols=50;
    this.state={
      generation : 0,
      gridFull : Array(this.rows).fill().map(()=>Array(this.cols).fill(false))
    }
  }
  playButton=()=>{
    clearInterval(this.IntervalId);
    this.intervarId=setInterval(this.play,this.props.speed);
  }
  play=()=>{
    let g = this.state.gridFull;
		let g2 = arrayClone(this.state.gridFull);

		for (let i = 0; i < this.rows; i++) {
		  for (let j = 0; j < this.cols; j++) {
		    let count = 0;
		    if (i > 0) if (g[i - 1][j]) count++;
		    if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
		    if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
		    if (j < this.cols - 1) if (g[i][j + 1]) count++;
		    if (j > 0) if (g[i][j - 1]) count++;
		    if (i < this.rows - 1) if (g[i + 1][j]) count++;
		    if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
		    if (i < this.rows - 1 && this.cols - 1) if (g[i + 1][j + 1]) count++;
		    if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
		    if (!g[i][j] && count === 3) g2[i][j] = true;
		  }
		}
		this.setState({
		  gridFull: g2,
		  generation: this.state.generation + 1
		});
  }



  selectBox=(row,col)=>{
    let gridCopy=arrayClone(this.state.gridFull);
    gridCopy[row][col] = !gridCopy[row][col];
    this.setState({gridFull: gridCopy});

  }
  seed=()=>{
    let gridCopy=arrayClone(this.state.gridFull);
    for (var i=0;i<this.rows;i++){
      for(var j=0; j<this.cols;j++){
       if (Math.floor(Math.random()*4)===1){
         gridCopy[i][j]=true;
       }
      }
    }
    this.setState({
      gridFull : gridCopy
    })
  }
  componentDidMount(){
    this.seed();
    this.playButton();
  }
  render(){
    return(
      <div>
        <h1>The Game of Life!</h1>
        <Grid
          rows={this.rows}
          cols={this.cols}
          gridFull={this.state.gridFull}
          selectBox={this.selectBox}
        />
        <h2>Generations: {this.state.generation}</h2>
      </div>
    );
  }
}
function arrayClone(arr){
  return JSON.parse(JSON.stringify(arr));
}

ReactDOM.render(<Main/>, document.getElementById('root'));
