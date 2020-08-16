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

class CommentForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          name: '',
          email: '',
          start_time: '',
          end_time:'',
          message: '',
          isGeneral: false,
          isQuestion: false,
        };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
        let nam = event.target.name;
        //let val = event.target.value;
        let val = (event.target.name === 'isQuestion' || event.target.name === 'isGeneral') ? event.target.checked : event.target.value;
        this.setState({[nam]: val});
    }
  
    handleSubmit(event) {
    //   alert(this.state.name + " " + this.state.email);
        var formdata = new FormData();
        formdata.append("name", this.state.name);
        formdata.append("email", this.state.email);
        formdata.append("start_time", this.state.start_time);
        formdata.append("end_time", this.state.end_time);
        formdata.append("message", this.state.message);
        formdata.append("start_time", this.state.start_time);
        formdata.append("isGeneral", this.state.isGeneral);
        formdata.append("isQuestion", this.state.isQuestion);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        fetch("http://127.0.0.1:8000/api/comments/", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
      event.preventDefault();
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
              <div>
                Name:
                <input type="text" name='name' value={this.state.name} onChange={this.handleChange} />
                Email:
                <input type="email" name='email' value={this.state.email} onChange={this.handleChange} />
              </div>
            Comment?
            <input type="checkbox" name='isGeneral' checked={this.state.isGeneral} onChange={this.handleChange} />
            Question?
            <input type="checkbox" name='isQuestion' checked={this.state.isQuestion} onChange={this.handleChange} />
            <div>
                Comment:
                <input type="text" name='message' value={this.state.message} onChange={this.handleChange} />
                Start Time:
                <input type="number" name='start_time' value={this.state.start_time} onChange={this.handleChange} />
                End Time:
                <input type="number" name='end_time' value={this.state.end_time} onChange={this.handleChange} />
            </div>
          </label>
          <input type="submit" value="Submit" />
        </form>
      );
    }
  }

export default CommentSection;

const container = document.getElementById("app");
render(
<div>
    <MyVideo/>
    <CommentForm/>
</div>, container);