/* global gapi */
import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSignedIn: false,
      err: null,
      events: []
    };
  }

  componentDidMount() {
    const successCallback = this.onSuccess.bind(this);

    window.gapi.load("auth2", () => {
      this.auth2 = gapi.auth2.init({
        client_id: "xxx"
      });

      // this.auth2.attachClickHandler(document.querySelector('#loginButton'), {}, this.onLoginSuccessful.bind(this))

      this.auth2.then(() => {
        console.log("on init");
        this.setState({
          isSignedIn: this.auth2.isSignedIn.get()
        });
      });
    });

    window.gapi.load("signin2", function() {
      // Method 3: render a sign in button
      // using this method will show Signed In if the user is already signed in
      var opts = {
        width: 200,
        height: 50,
        client_id: "xxx",
        onsuccess: successCallback
      };
      gapi.signin2.render("loginButton", opts);
    });

    this.getEvents();
  }

  getEvents() {
    let that = this;
    function start() {
      gapi.client
        .init({
          apiKey: "xxx"
        })
        .then(function() {
          return gapi.client.request({
            path: `https://www.googleapis.com/calendar/v3/calendars/xxx/events?maxResults=15`
          });
        })
        .then(
          response => {
            let events = response.result.items;
            that.setState(
              {
                events
              },
              () => {
                console.log(that.state.events);
              }
            );
          },
          function(reason) {
            console.log(reason);
          }
        );
    }
    gapi.load("client", start);
  }

  onSuccess() {
    console.log("on success");
    this.setState({
      isSignedIn: true,
      err: null
    });
  }

  onLoginFailed(err) {
    this.setState({
      isSignedIn: false,
      error: err
    });
  }

  getContent() {
    if (this.state.isSignedIn) {
      return <p>hello user, you're signed in </p>;
    } else {
      return (
        <div>
          <p>You are not signed in. Click here to sign in.</p>
          <button id="loginButton">Login with Google</button>
        </div>
      );
    }
  }

  handleButton() {
    console.log("test");
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Sample App.</h2>

          {this.getContent()}
          <br />
          <button onClick={this.handleButton}> Button!</button>
        </header>
      </div>
    );
  }
}

export default App;
