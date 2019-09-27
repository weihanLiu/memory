import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
  ReactDOM.render(<Game />, root);
}


class Game extends React.Component {
  render() {
    return (
    <div className="game">
      <div className="title">
        <h2>{["Memory Game"]}</h2>
      </div>
      <div className="board">
        <Board />
      </div>
    </div> 
    );
  }
}



function Tile(props) {
  return (
    <button className="tile" onClick={props.onClick}>
      {props.showedValue}
    </button>
  );
}

function random_tileValue() {
  let a = Array.from("ABCDEFGH");
  a = a.concat(a);
  shuffle_arr(a);
  return a;
}


// using Fisher-Yates shuffle algorithm
// cited from https://en.wikipedia.org/wiki/Fisher–Yates_shuffle#The_modern_algorithm
function shuffle_arr(a) {
  for(let i = a.length - 1; i > 0; i--) {
    let random = Math.floor(Math.random() * i);
    let temp = a[i];
    a[i] = a[random];
    a[random] = temp;
  }
}



class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showed: Array(16).fill(null),
      tileValue: random_tileValue(),
      lastClicked: -1,
      clickedNum: 0
    };
  }

  //return state that expose value at tile i, 
  //and change the lastClicked to input "last"
  exposeValue(i, last) {
    let showedCopy = this.state.showed.slice();
    let tileValue_copy = this.state.tileValue.slice();
    let c = this.state.clickedNum + 1;
    showedCopy[i] = tileValue_copy[i];
    let st = {
      showed: showedCopy,
      tileValue:tileValue_copy,
      lastClicked: last,
      clickedNum: c
    };
    return st;
    
  }

  //mark a pair as complete, shown as "X"
  markCompleted(i, j) {
    let show = this.state.showed.slice();
    show[i] = "X";
    show[j] = "X";
    let st = {
      showed: show,
      tileValue: this.state.tileValue,
      lastClicked: -1,
      clickedNum: this.state.clickedNum + 1
    };
    return st;
  }

  //hide a pair
  hide(i, j) {
    let show = this.state.showed.slice();
    show[i] = null;
    show[j] = null;
    let st = {
      showed: show,
      tileValue: this.state.tileValue,
      lastClicked: -1,
      clickedNum: this.state.clickedNum + 1
    };
    return st;
  }

  log() {
    console.log(this.state.showed);
    console.log(this.state.tileValue);
    console.log(this.state.lastClicked);
    console.log(this.state.clickedNum);
  }

  logSt(st) {
    console.log(st.showed);
    console.log(st.tileValue);
    console.log(st.lastClicked);
    console.log(st.clickedNum);
  }

  gameover() {
    let count = 0;
    let show = this.state.showed.slice();
    for (let i = 0; i < show.length; i++) {
      if (show[i] === "X") {
        count += 1;
      }
    }
    return count === 16;
  }

  handleClick(i) {
    if (this.state.showed[i]) {
      return
    }

    let show = this.state.showed.slice();
    let value = this.state.tileValue.slice();
    let last = this.state.lastClicked;
    let st1;
    let st2;
    //if this click is first in a pair, expose this click
    //and change the lastclick to i
    if (last === -1) {
      st1 = this.exposeValue(i, i);
      this.setState(st1);
      return;
    }
    //if this click is second in a pair and match with previos click
    //expose the click first and mark the pair as completed
    //also change the lastClicked to -1
    if(value[last] === value[i]) {
      st1 = this.exposeValue(i, -1);
      st2 = this.markCompleted(last, i);
      console.log("=== st1..st2");
      this.logSt(st1);
      this.logSt(st2);
    }
    //if this click is the second in a pair and does not match the 
    //previous click, expose this click first and then hide this pair 
    //also change the lastClicked to -1
    else {
      st1 = this.exposeValue(i, -1);
      st2 = this.hide(last, i);
      console.log("!== st1..st2");
      this.logSt(st1);
      this.logSt(st2);
    }
    
    this.setState(st1);
    setTimeout(() => {this.setState(st2)}, 1000);
  }



  renderTile(i) {
    return (
      <Tile showedValue = {this.state.showed[i]}
            onClick = {() => this.handleClick(i)}
      />
    );
  }

  renderRow(row) {
    let tiles = [];
    for(let i = 0; i < 4; i++) {
      tiles.push(this.renderTile(row * 4 + i))
    }
    return (
      <div className = "board-row">
        {tiles}
      </div>
    );
  }

  restart(_ev) {
    let st = {
      showed: Array(16).fill(null),
      tileValue: random_tileValue(),
      lastClicked: -1,
      clickedNum: 0
    };
    this.setState(st);
  }


  render() {
    let rows = [];
    for (let i = 0; i < 4; i++) {
      rows.push(this.renderRow(i));
    }
    let game_status;
    if (this.gameover()) {
      game_status = "congratulation! Completed in " + this.state.clickedNum.toString() + " clicks.";
    } else {
      game_status = "Number of Clicks: " + this.state.clickedNum.toString();
    }
    let restart = <p><button onClick={this.restart.bind(this)}>Restart</button></p>;

    return (
    <div className = "board">
      <div className = "rows">
        {rows}
      </div>
      <div className = "game_status">
        {game_status}
      </div>
      <div className = "restart">
        {restart}
      </div>
    </div>
    );
  }

}

class Starter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { left: false };
  }

  swap(_ev) {
    let state1 = _.assign({}, this.state, { left: !this.state.left });
    this.setState(state1);
  }

  hax(_ev) {
    alert("hax!");
  }

  render() {
    let button = <div className="column" onMouseMove={this.swap.bind(this)}>
      <p><button onClick={this.hax.bind(this)}>Click Me</button></p>
    </div>;

    let blank = <div className="column">
      <p>Nothing here.</p>
    </div>;

    if (this.state.left) {
      return <div className="row">
        {button}
        {blank}
      </div>;
    }
    else {
      return <div className="row">
        {blank}
        {button}
      </div>;
    }
  }
}

