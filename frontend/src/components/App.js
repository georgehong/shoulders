import React, { Component } from "react";
import {useState} from "react";
import YouTube from "react-youtube";

import { render } from "react-dom";
const videoIdA = 'XxVg_s8xAms';

// Display Video 
function MyVideo() {
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
      {/* <h1> Current Timestamp: {time} </h1> */}
      <CommentSection currentTime={time} key={time}/>
    </div>
  );
}

class CommentSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loaded: false,
      placeholder: "Loading",
      currentTime: props.currentTime
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
  componentWillUnmount(){
    return;
  }

  render() {
    return (
        <div>
            <h2> Comments </h2>
                {this.state.data.map(contact => {
                    if (contact.isGeneral && this.state.currentTime >= contact.start_time && this.state.currentTime <= contact.end_time){
                        return (
                            <p>{contact.name} - {contact.email} - {contact.message}</p>
                        );
                    }
                    return "";
                })}
            <h2> Questions </h2>
                {this.state.data.map(contact => {
                    if (contact.isQuestion && this.state.currentTime >= contact.start_time && this.state.currentTime <= contact.end_time){
                        return (
                            <p>{contact.name} - {contact.email} - {contact.message}</p>
                        );
                    }
                    return "";
                })}
        </div>
    );
  }
}

class CommentForm extends Component{
    


}

export default CommentSection;

const container = document.getElementById("app");
render(
<div>
    <MyVideo/>
</div>, container);