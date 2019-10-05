import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root, channel) {
  ReactDOM.render(<Board channel={channel}/>, root);
}


class Board extends React.Component {
  constructor(props) {
    super(props)
    console.log("a")
    this.channel = props.channel;
    this.state = {
      showed: [],
      clickedNum: 0
    };
    console.log("before join")
    this.channel
        .join()
        .receive("ok", this.got_view.bind(this))
        .receive("error", resp => {cosole.log("Unable to join", resp); });
    console.log("after join")
    this.channel.on("update", this.got_view.bind(this));
    console.log("b")
  }

  got_view(view) {
    console.log("new view", view);
    this.setState(view.game);
  }


  handleClick(i) {
    this.channel.push("click", {click: i})
      .receive("ok", this.got_view.bind(this));
  }

  restart() {
    this.channel.push("restart", {})
        .receive("ok", this.got_view.bind(this));
  }

  gameover() {
    let count = 0;
    let show = this.state.showed;
    for (let i = 0; i < show.length; i++) {
      if (show[i] === "X") {
        count += 1;
      }
    }
    return count === 16;
  }
  
  renderTile(i) {
    return (
      <Tile key = {"tile" + i}
	    showedValue = {this.state.showed[i]}
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
      <div key = {"row" + row}
	    className = "board-row">
        {tiles}
      </div>
    );
  }

  render() {
    console.log("start render")
    let rows = [];
    for (let i = 0; i < 4; i++) {
      rows.push(this.renderRow(i));
    }

    let game_status;
    console.log("before if")
    if (this.gameover()) {
	    console.log("in if")
      game_status = "Congratulation! Completed in " + this.state.clickedNum.toString() + " clicks.";
    } else {
	    console.log("in else")
      game_status = "number of clicks: " + this.state.clickedNum.toString();
    }
	  console.log("before restart")
    let restart = <p><button onClick = {this.restart.bind(this)}>Restart</button></p>
    console.log("before board")
    return (
    <div className="game">
      <div className="board">
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





function Tile(props) {
  return (
    <button className="tile" onClick={props.onClick}>
      {props.showedValue}
    </button>
  );
}



