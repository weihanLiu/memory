import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root, channel) {
  ReactDOM.render(<Game channel={channel}/>, root);
}


class Game extends React.Component {
  constructor(props) {
    super(props)
    
    this.channel = props.channel;
    this.state = {
      showed: [],
      clickedNum: 0
    }
    this.channel
        .join()
        .receive("ok", this.got_view.bind(this))
        .receive("error", resp => {cosole.log("Unable to join", resp); });
    this.channel.on("update", this.got_view.bind(this));
  }

  got_view(view) {
    console.log("new view", view);
    this.setState(view.game);
  }


  handleClick(i) {
    this.channel.push("click", {click: i})
      .receive("ol", this.got_view.bind(this));
  }

  restart() {
    this.channel.push("restart", {})
        .receive("ok", this.got_view.bind(this));
  }

  gameover() {
    let count = 0;
    let show = this.state.shwed.slice();
    for (let i = 0; i < show.length; i++) {
      if (show[i] === "X") {
        count += 1;
      }
    }
    return count === 16;
  }


  render() {
    let game_status;
    if (this.gameover()) {
      game_status = "Congratulation! Completed in " + this.state.clickedNum.toString() + " clicks.";
    } else {
      game_status = "number of clicks: " + this.state.clickedNum.toString();
    }
    let restart = <p><button onClick = {this.restart.bind(this)}>Restart</button></p>
    let board = <Board root = {this}
                      showed = {this.state.showed}
                      onClick = {() +> this.handleClick(i)/>
    return (
    <div className="game">
      <div className="title">
        <h2>{["Memory Game"]}</h2>
      </div>
      <div className="board">
        {board} 
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





function Tile(props) {
  return (
    <button className="tile" onClick={props.onClick}>
      {props.showedValue}
    </button>
  );
}

class Board extends React.Component {

  renderTile(i) {
    return (
      <Tile showedValue = {props.showed[i]}
            onClick = {props.onClick}}
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
  
  render() {
    let rows = [];
    for (let i = 0; i < 4; i++) {
      rows.push(this.renderRow(i));
    }
    return (
    <div className = "board">
       {rows}
    </div>
    );
  }

}


