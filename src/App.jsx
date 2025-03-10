import React, { Component } from "react";
import Activities from "./components/Activities";
import Clock from "./components/Clock";
import BoardText from "./components/BoardText";
import Quotes from "./components/Quotes";
import Ad from "./components/Ad";
import { TeamPage } from "./components/Team";
import { LOGO } from "./helpers/env";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current: "activities",
      index: 0,
    };
  }

  next() {
    const params = new URLSearchParams(window.location.search);

    const display_internal = params.get("internal") == "true";

    switch (this.state.current) {
      case "activities":
        if (this.finishedState) {
          this.finishedState = false;
          this.setState({
            current: "advertisement",
            index: 0,
          });
        } else {
          this.setState({
            index: this.state.index + 1,
          });
        }
        break;
      case "advertisement":
        if (this.finishedState) {
          this.finishedState = false;

          // skip boardText and quotes on the screen on the outside of the
          // Sticky room
          let new_state = display_internal ? "boardText" : "activities";
          this.setState({
            current: new_state,
            index: 0,
          });
        } else {
          this.setState({
            index: this.state.index + 1,
          });
        }
        break;
      case "boardText":
        this.setState({
          current: "quotes",
        });
        break;
      case "quotes":
        this.setState({
          current: "team",
        });
        break;
      case "team":
        this.setState({
          current: "activities",
        });
        break;
      default:
        return;
    }
  }

  componentDidMount() {
    // Set up interval.
    // Every this.props.nextInterval, we switch to the next ad or activity to display
    this.activityChanger = setInterval(
      this.next.bind(this),
      parseInt(import.meta.env.VITE_NEXT_INTERVAL)
    );
  }

  componentWillUnmount() {
    clearInterval(this.dataLoader);
    clearInterval(this.activityChanger);
  }

  renderContent() {
    switch (this.state.current) {
      case "activities":
        return (
          <Activities
            current={this.state.index}
            onChange={() => {
              this.finishedState = true;
            }}
          />
        );
      case "advertisement":
        return (
          <Ad
            current={this.state.index}
            onChange={() => {
              this.finishedState = true;
            }}
          />
        );
      case "boardText":
        return <BoardText />;
      case "quotes":
        return <Quotes />;
      case "team":
        return <TeamPage />;
      default:
        return;
    }
  }

  render() {
    return (
      <div className="app">
        <div className="topbar">
          <div className="logo">
            <img src={LOGO} />
          </div>
          <Clock />
        </div>
        {this.renderContent()}
      </div>
    );
  }
}
