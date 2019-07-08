import React, {Component} from 'react';
import Canvas from './components/canvas.js';

class App extends Component {
  constructor(props) {
    super(props);
    //video constraints
    this.constraints = window.constraints = {
      audio: false,
      video: {width: {exact: 1920}, height: {exact: 1080}}
    };
    this.state = {
      load:false,//whether video stream is loading?
      pause: true,//push release button
      error:false,////whether error occur
      errorMessage:''
    };
      (function() {
          var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
      })();
  }

  //initial video loading
  componentDidMount() {

    this.initVideo();
  }
  componentWillUnmount() {
  }
  //whether device detect the video or audio device
  initVideo =()=>
  {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(this.constraints)
          .then(this.successCallback)
          .catch(this.errorCallback);
    }
  }
  //if detect device, get stream data and call requestAnimationFrame to draw video image
  successCallback=(stream)=>{

    const video = document.getElementById('videoElement');
    //get video list
    let videoTracks = stream.getVideoTracks();
    //condition
    console.log('Got stream with constraints:', this.constraints);
    //device which you use
    console.log('Using video device: ' + videoTracks[0].label);
    //when remove track print console
    stream.onremovetrack = function() {
      console.log('Stream ended');
    };
    window.stream = stream; // make variable available to browser console
    video.srcObject = stream;
    //display the release button and zoom in/out button
    this.setState({
      load:true,
      pause:!stream.active
    })
    // if (this.requestID) {
    //   cancelAnimationFrame(this.requestID);
    //   this.requestID = null;
    // }
    //start video animation
    this.requestID = requestAnimationFrame(this.drawImage)|| window.webkitRequestAnimationFrame(this.drawImage);
  }
  drawImage=()=>{
    //if video width is zero, recall the animation ensure video loading
    if(!this.video.videoWidth){
      this.requestID = requestAnimationFrame(this.drawImage)|| window.webkitRequestAnimationFrame(this.drawImage);
      return ;
    }
    //draw video image to canvas
    this.canvas.draw(this.video, this.video.videoWidth, this.video.videoHeight)
    //draw next video image
    this.requestID = requestAnimationFrame(this.drawImage)|| window.webkitRequestAnimationFrame(this.drawImage);

  }
  errorCallback=(error)=>{
    console.log(error,error.name);
    let errorMsg = 'getUserMedia error:' + error.name;
    if (error.name === 'ConstraintNotSatisfiedError') {
      errorMsg='The resolution ' + this.constraints.video.width.exact + 'x' +
          this.constraints.video.width.exact + ' px is not supported by your device.'
    } else if (error.name === 'PermissionDeniedError') {
      errorMsg='Permissions have not been granted to use your camera and ' +
          'microphone, you need to allow the page access to your devices in ' +
          'order for the demo to work.';
    }
    //show error message
      this.setState({
      error:true,
      errorMessage:errorMsg,
    })
  }
  videoRelease =()=> {
    let stream = this.video.srcObject;
    //return all the media device connect list
    let tracks = stream.getTracks();
    console.log(tracks);
    for (let i = 0; i < tracks.length; i++) {
      let track = tracks[i];
      //stop use the track
      track.stop();
    }
    //display create button
    this.setState({
      pause:!stream.active
    })
    //stop drawImage
    if (this.requestID) {
    console.log('Release  stop drawImage~~~~~~~~~~~~~~ ',this.requestID);
    cancelAnimationFrame(this.requestID);
    this.requestID = null;
    }

  }
  handleZoomIn = () => {
    if (this.canvas)
      this.canvas.handleZoomIn();

  };
  handleZoomOut = () => {
    if (this.canvas)
      this.canvas.handleZoomOut();

  }
    render() {
    const container =  {
      margin: '0px auto',
      textAlign: 'center'
    }
    const videoElement =  {
      display: 'none',
      width: '800px',
      height: '450px',
    }

    const btn_style100={
      width: '100px'
    }
    const btn_style150={
      width: '150px'
    }
    return (
        <div style={container}>
            { this.state.error && <div id="errorMsg">Error Message: {this.state.errorMessage}</div> }
              <video autoPlay={true}  ref={video => this.video = video} id="videoElement"style={videoElement}/>
              <Canvas  ref={canvas => this.canvas =canvas}  video={this.video}/>
          <div>
            {/*load == false、pause ==true*/}
            {  this.state.load && this.state.pause  && <button type='button'  style={btn_style150} onClick={event => this.initVideo(event)}>create stream</button>}
            {/*pause == false、load ==true*/}
            { this.state.load && !this.state.pause  && <button type='button' style={btn_style150} onClick={event => this.videoRelease(event)}>release stream</button>}
          </div>
          <div>
              {  this.state.load && !this.state.pause  &&   <button type='button' style={btn_style100} onClick={event => this.handleZoomIn(event)}>zoom in</button>}
              {  this.state.load && !this.state.pause  &&    <button type='button' style={btn_style100} onClick={event => this.handleZoomOut(event)}>zoom out</button>}
          </div>
        </div>
    );
  }
}

export default App;
