import React, { Component } from "react";
import {useState} from "react";
import YouTube from "react-youtube";

import { render } from "react-dom";
const videoIdA = 'XxVg_s8xAms';

// Display Video 
function Example() {
  const [videoId, setVideoId] = useState(videoIdA);
  const [player, setPlayer] = useState(null);
  const [time, setTime] = useState(0);
  const [dispComm, dispToggle] = useState(null);

  const onReady = (event) => {
    // eslint-disable-next-line
    console.log(`YouTube Player object for videoId: "${videoId}" has been saved to state.`);
    // Feeds the event.target player into player.
    setPlayer(event.target);
  };

  const onPlayVideo = () => {
    player.playVideo();
  };

  const onPauseVideo = () => {
    player.pauseVideo();
  };

  const toggleComments = () =>{
    (dispComm === 'hidden') ? dispToggle(null) : dispToggle('hidden');
  }

  const getTimeStamp = () => {
    setTime(~~player.getCurrentTime());
  };

  return (
    <div>
      <h1> Sample Lecture Page</h1>
      <hr></hr>
      <YouTube videoId={videoId} onReady={onReady} onPause={getTimeStamp}/>
      <h1> Current Timestamp: {time} </h1>
      <button type="button" onClick={onPlayVideo} disabled={!player}>
        Play
      </button>
      <button type="button" onClick={onPauseVideo} disabled={!player}>
        Pause
      </button>
      <div visibility={dispComm}>
        <h3 >(Pause to show comment section)</h3>
      </div>
    </div>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loaded: false,
      placeholder: "Loading"
    };
  }

  componentDidMount() {
    fetch("api/comments")
      .then(response => {
        if (response.status > 400) {
          return this.setState(() => {
            return { placeholder: "Something went wrong!" };
          });
        }
        return response.json();
      })
      .then(data => {
        this.setState(() => {
          return {
            data,
            loaded: true
          };
        });
      });
  }

  render() {
    return (
      <ul>
        {this.state.data.map(contact => {
            if (!contact.isGeneral){
                return;
            }
          return (
            <li key={contact.id}>
              {contact.name} - {contact.email} - {contact.message}
            </li>
          );
        })}
      </ul>
    );
  }
}

export default App;

const container = document.getElementById("app");
render(
<div>
    <Example/>
    <App />
</div>, container);