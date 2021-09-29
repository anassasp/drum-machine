import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

const clickedStyle = {
  position: "relative",
  top: "5px",
  boxShadow: "none",
}

const normalStyle = {
  position: "relative",
  top: "0",
  boxShadow: "5px 10px 8px #888",
}

const soundList = [
  {
    name: 'Cymbal',
    key: 'Q',
    url: 'https://sampleswap.org/samples-ghost/DRUMS%20(FULL%20KITS)/DRUM%20MACHINES/606%20Basic/234[kb]606-cymbal1.wav.mp3'
  },
  {
    name: 'Kick',
    key: 'W',
    url: 'https://sampleswap.org/samples-ghost/DRUMS%20(FULL%20KITS)/DRUM%20MACHINES/606%20Basic/56[kb]606-kick1.wav.mp3'
  },
  {
    name: 'Snare',
    key: 'E',
    url: 'https://sampleswap.org/samples-ghost/DRUMS%20(FULL%20KITS)/DRUM%20MACHINES/606%20Basic/25[kb]606-snare1.wav.mp3'
  },
  {
    name: 'Tom',
    key: 'A',
    url: 'https://sampleswap.org/samples-ghost/DRUMS%20(FULL%20KITS)/DRUM%20MACHINES/606%20Basic/79[kb]606-tom1.wav.mp3'
  },
  {
    name: 'Drum',
    key: 'S',
    url: 'https://sampleswap.org/samples-ghost/DRUMS%20(FULL%20KITS)/DRUM%20MACHINES/808%20Extended/152[kb]808-bd04.wav.mp3'
  },
  {
    name: 'Chime',
    key: 'D',
    url: 'https://sampleswap.org/samples-ghost/DRUMS%20(FULL%20KITS)/DRUM%20MACHINES/808%20Extended/43[kb]808-chi1.wav.mp3'
  },
  {
    name: 'Clap',
    key: 'Z',
    url: 'https://sampleswap.org/samples-ghost/DRUMS%20(FULL%20KITS)/DRUM%20MACHINES/808%20Basic/35[kb]handclap.wav.mp3'
  },
  {
    name: 'Cowbell',
    key: 'X',
    url: 'https://sampleswap.org/samples-ghost/DRUMS%20(FULL%20KITS)/DRUM%20MACHINES/808%20Basic/33[kb]cowbell.wav.mp3'
  },
  {
    name: 'Hi Hat Open',
    key: 'C',
    url: 'https://sampleswap.org/samples-ghost/DRUMS%20(FULL%20KITS)/DRUM%20MACHINES/909%20Extended/21[kb]909-HiHatOpen-D0.wav.mp3'
  }
];



class DrumPad extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      styles: normalStyle,
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.changeStyle = this.changeStyle.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  changeStyle() {
    if(this.state.styles.boxShadow !== "none"){
      this.setState({
        styles: clickedStyle,
      });
    } else {
      this.setState({
        styles: normalStyle,
      });
    }
  }

  handleClick(){
    if(this.props.checkStatus){
      this.audio.play();
      this.audio.currentTime = 0;
      this.props.handleDisplay(this.props.item.name);
      this.changeStyle();
      setTimeout(() => this.changeStyle(), 100);
    }
  }

  handleKeyPress(event) {
    if (event.keyCode === this.props.item.key.charCodeAt()) {
      this.handleClick();
    }
  }

  render() {
    const data = this.props.item;
    return(
      <div 
        className="drum-pad"
        onClick={this.handleClick}
        style={this.state.styles}
      >
        <p className="keypad">{data.key}</p>
        <audio 
          ref={ref => this.audio = ref}
          className="clip"
          src={data.url}
          id={data.key}>
        </audio>
      </div>
    )
  }
}


class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      display: 'On',
      checkStatus: true,
      volume: 1,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  handleChange(){
    this.setState(state => ({
      checkStatus: !state.checkStatus
    }))
  }

  handleInput(event) {
    this.setState(state => ({
      volume: Number(event.target.value) / 100,
      display: event.target.value
    }))
    const listAudio = [].slice.call(document.getElementsByClassName('clip'));
    listAudio.forEach(item => {item.volume = this.state.volume;});
  }

  handleDisplay = display => this.setState({ display })

  render(){
    return(
      <div id="drum-machine" className="wrapper">
        <h1 className="title">Drum Machine</h1>
        <div className="content-wrapper">
          <div id="drum-pads" className="drum-container">
            {soundList.map((item, index) => (
              <DrumPad 
                item={item}
                key={item + "" + index}
                volume={this.state.volume} 
                handleInput={this.handleInput} 
                checkStatus={this.state.checkStatus} 
                handleDisplay={this.handleDisplay}
              />
            ))}
          </div>
          <div className="option">
            <div className="switch-wrapper">
              <span className="subtitle">Power</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={this.state.checkStatus} 
                  onChange={this.handleChange} 
                />
                <span className="slider"></span>
              </label>
            </div>
            <div id="display" className="display-container">
              {this.state.checkStatus? this.state.display: 'Off'}
            </div>
            <div className="slide-container">
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="1"
                value={this.state.volume*100} 
                onChange={this.handleInput} 
                onInput={this.handleInput} 
                className="slide"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
