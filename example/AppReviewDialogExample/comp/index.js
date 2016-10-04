'use strict';

import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  Animated,
  PixelRatio,
  TouchableWithoutFeedback,
  BackAndroid
} from 'react-native';
import RateStars from './rateStars.js';

let SCREEN_WIDTH;
let SCREEN_HEIGHT;

class AppReview extends Component {

  propTypes: {
    visible: PropTypes.bool,
    animationDuration: PropTypes.number
  }

  defaultProps: {
    animationDuration: 300,
    visible: false
  }

  constructor(props) {
    super(props);
    this.orientation = 'PORTRAIT'
    this.state = {
      dialogState: (this.props.visible)?"init":"closed",
      fadeAnim: new Animated.Value(0),
      starsAnim: new Animated.Value(0),
      width: 0,
      height: 0
    };
    this._close = this._close.bind(this);
    this._open = this._open.bind(this);
    this._onAnimate = this._onAnimate.bind(this);
    this._hideStars = this._hideStars.bind(this);
    this._showStars = this._showStars.bind(this);
    this._getStars = this._getStars.bind(this);
    this._getStyles = this._getStyles.bind(this);
    this._getAnim = this._getAnim.bind(this);
    this._getRatesStars = this._getRatesStars.bind(this);

    this.state.fadeAnim.addListener(this._onAnimate);
    BackAndroid.addEventListener('hardwareBackPress', this._close);

    this.starsData = [
      {left:0.14,scale:0.2,input:[0,0.3,1],output:[-2000,-1050,-1120]},
      {left:0.33,scale:0.10,input:[0,0.5,1],output:[-2000,-1000,-1090]},
      {left:0.48,scale:0.14,input:[0,0.5,1],output:[-2000,-1230,-1040]},
      {left:0.67,scale:0.15,input:[0,0.5,1],output:[-3000,-1140,-1080]},
      {left:0.86,scale:0.19,input:[0,0.5,1],output:[-2000,-980,-1050]}
    ]
  }

  componentWillReceiveProps(nextProps) {
    let visible = (this.state.dialogState == 'closed' || this.state.dialogState == 'closing')?false:true;
    if (visible != nextProps.visible) {
      if(nextProps.visible) {
        this._open();
      } else {
        this._close();
      }
    }
  }

  componentWillUnmount(){
    // don't forget to remove all listeners on component destroy
    // to prevent memory leaks
    this.state.fadeAnim.removeAllListeners(0);
    BackAndroid.removeEventListener('hardwareBackPress', this._close);
  }

  componentWillMount() {
    if (Dimensions.get('window').width >= Dimensions.get('window').height) {
      SCREEN_WIDTH = Dimensions.get('window').height;
      SCREEN_HEIGHT = Dimensions.get('window').width;
      this.orientation = 'LANDSCAPE'
    } else {
      SCREEN_WIDTH = Dimensions.get('window').width;
      SCREEN_HEIGHT = Dimensions.get('window').height; 
    }
    this.state.width = Dimensions.get('window').width;
    this.state.height = Dimensions.get('window').height;
    this.dStyles = this._getStyles();
    this.starViews = this._getStars(this.dStyles,this.starsNumber);
  }

  componentDidMount(){
    if(this.props.visible) {
      this._open();
    }
  }

  layoutChanged(event) {
    let {width, height} = event;
    let orientation = 'PORTRAIT';
    if (width >= height) {
      orientation = 'LANDSCAPE'
    } 
    if(orientation != this.orientation) {
      this.renderNewStars = true;
      if (orientation == 'LANDSCAPE') {
        this.setState({
          width: SCREEN_HEIGHT,
          height: SCREEN_WIDTH
        });
      } else {
        this.setState({
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT
        }); 
      }
      if(this.state.dialogState == 'opened')
        this._showStars();
    }
    this.orientation = orientation;
  }

  _onAnimate(value) {
    if(value.value === 1) {
      this.setState({dialogState:"opened"}); 
      this._showStars(); 
    } else if(value.value === 0) {
      this.setState({dialogState:"closed"});
    }
  }

  _hideStars() {
    Animated.timing(this.state.starsAnim, {
        toValue: 0,
        duration: 2000
    }).start();
  }

  _showStars() {
    this.state.starsAnim.setValue(0);
    Animated.spring(this.state.starsAnim, {
        toValue: 1,
        tension: 50,
        friction: 6,
    }).start();
  }

  _close() {
    this.setState({dialogState: "closing"});
    Animated.sequence([
      Animated.timing(this.state.starsAnim, {
          toValue: 0,
          duration: this.props.animationDuration+200
      }),
      Animated.timing(this.state.fadeAnim, {
          toValue: 0,
          duration: this.props.animationDuration
      })
    ]).start();
    return true;
  }

  _open() {
    this.state.fadeAnim.setValue(0);
    this.setState({dialogState: "opening"});
    Animated.timing(this.state.fadeAnim, {
        toValue: 1,
        duration: this.props.animationDuration
    }).start(); 
  }

  _getStyles() {
    let width = this.state.width;
    let height = this.state.height*0.64;
    let top = this.state.height*0.36;
    let left = 0;
    if(this.orientation == "LANDSCAPE") {
      height = this.state.height;     
      width = this.state.width/2;
      top = 0;
      left = this.state.width/2;
    }
    let obj = {
      container: {
        flex: 1,
        position: "absolute",
        top: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: this.state.width,
        height: this.state.height
      },
      dialog: {
        width: width,
        backgroundColor: '#ffffff',
        position: "absolute",
        height: height,
        top: top,
        left: left
      },  
    };
    for(let i=0; i<this.starsData.length; i++) {
      let scale = this.starsData[i].scale;
      let left = width * this.starsData[i].left;
      left += -330*(1-scale)/2 - 330*scale/2; //image center weight
      obj['star'+(i+1)] = {
        position: "absolute",
        left: left,
        transform: [{
          scale: scale
        }]
      }  
    }
    let t = StyleSheet.create(obj);
    return t;
  }

  _getAnim() {
    let width = this.state.width;
    let height = this.state.height*0.7;
    let top = this.state.height*0.3;
    let left = 0;
    if(this.orientation == "LANDSCAPE") {
      height = this.state.height;     
      width = this.state.width/2;
      top = 0;
      left = this.state.width/2;
    }
    return {
      opacity: this.state.fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.75]
      }),
      dialogScroll: this.state.fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [height, 0],
        extrapolate: "clamp"
      })
    }
  }

  _getStars(styles) {
    let res = [];
    for(let i=1; i<=this.starsData.length; i++) {
      let down = (this.orientation=="PORTRAIT")?-1050:-1030;
      res.push(
        <Animated.Image key={"star"+i} source={require('./star_rout.png')} style={[styles['star'+i],{
          top:this.state.starsAnim.interpolate({
              inputRange: this.starsData[i-1].input,
              outputRange: this.starsData[i-1].output
          })
        }]} />
      )
    }
    return res;
  }

  _getRatesStars() {
    return <RateStars width={360} style={{margin:30}} onSet={(stars)=>{console.log('SET: '+stars)}}/>
  }

  render() {
    let hidden;
    let stopTouch;
    if (this.state.dialogState === 'closed') {
      // when opacity == 0 then hide dialog to optimize render
      hidden = styles.hidden;
    } else if (this.state.dialogState === 'closing') {
      // needed to stop touch events propagation
      stopTouch = styles.hidden;
    }

    if (this.renderNewStars) {
      this.dStyles = this._getStyles();
      this.starViews = this._getStars(this.dStyles);
      this.renderNewStars = false;
    }
    let anim = this._getAnim();
    let rates = this._getRatesStars();

    return (
      <View style={[this.dStyles.container, hidden]}>
        <Animated.View
          style={[this.dStyles.container, styles.overlay, {
          opacity:anim.opacity
        }]}>
            <TouchableOpacity style={[this.dStyles.container, stopTouch]} onPress={()=>{this._close()}}/>
        </Animated.View>

        <Animated.View style={[this.dStyles.dialog, {transform: [
            {translateY: anim.dialogScroll},
        ]}]}>
          <View style={styles.header}>
            <Text style={styles.headerText}>
              Will you help us?
            </Text>
          </View>
          <View style={styles.body}>
            <Text style={styles.bodyText}>
            If you have a free minute, please be so kind to rate out app.
            </Text>
          </View>
          {rates}
        </Animated.View>

        {this.starViews}
         
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#ff0000",
    position: "absolute",
    top: 0,
    left: 0
  }, 
  overlay: {
    backgroundColor: '#000000',
  },
  hidden: {
    top: -10000,
    left: 0,
    height: 0,
    width: 0,
  },
  header: {
    padding: 28,
  },
  headerText: {
    color: "#333333",
    fontSize: 26,
    textAlign: "center"
  },
  body: {
    padding: 15
  },
  bodyText: {
    color: "#555555",
    fontSize: 20,
    textAlign: "center"
  }
});

export default AppReview;