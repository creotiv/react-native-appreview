'use strict';

import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  Animated,
  PixelRatio,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TouchableOpacity,
  BackAndroid,
  StatusBar
} from 'react-native';
import RateStars from './rateStars.js';
import HangoverStars from './hangoverStars.js';

let SCREEN_WIDTH;
let SCREEN_HEIGHT;

class AppReview extends Component {

  propTypes: {
    animationDuration: PropTypes.number,
    onClose: PropTypes.func,
    style: PropTypes.object,
    visible: PropTypes.boolean,
    bodyText: PropTypes.string,
    headerText: PropTypes.string,
    closeButtonText: propTypes.string,
    dontShowButtonText: propTypes.string
  }

  constructor(props) {
    super(props);
    this.orientation = 'PORTRAIT';
    this.rate = 0;
    this.dontShowAgain = false;
    this.state = {
      dialogState: (this.props.visible)?"init":"closed",
      fadeAnim: new Animated.Value(0),
      width: 0,
      height: 0
    };
    this._close = this._close.bind(this);
    this._open = this._open.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this._onAnimate = this._onAnimate.bind(this);
    this._getStyles = this._getStyles.bind(this);
    this._getAnim = this._getAnim.bind(this);

    this.state.fadeAnim.addListener(this._onAnimate);
    BackAndroid.addEventListener('hardwareBackPress', this.close);

  }

  componentWillUnmount(){
    // don't forget to remove all listeners on component destroy
    // to prevent memory leaks
    this.state.fadeAnim.removeAllListeners(0);
    BackAndroid.removeEventListener('hardwareBackPress', this.close);
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
    if(this.props.visible) this.open();
  }

  _closed_state() {
    return (this.state.dialogState == 'closed' || this.state.dialogState == 'closing' || this.state.dialogState == 'init')
  }

  _open_state() {
    return (this.state.dialogState == 'opened' || this.state.dialogState == 'opening')
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.visible != this.props.visible) {
      if(nextProps.visible && this._closed_state()) {
        this.open();
      } else if(!nextProps.visible && this._open_state()) {
        this.close();
      }
    }
  }

  open() {
    if(this._closed_state()) {
      this._open();
    }
  }

  close() {
    if(this._open_state()) {
      this._close();
    }
    return true;
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
        this.refs.stars.show();
    }
    this.orientation = orientation;
  }

  _onAnimate(value) {
    if(value.value === 1 && this.state.dialogState === 'opening') {
      this.setState({dialogState:"opened"}); 
      this.refs.stars.show();
    } else if(value.value === 0 && this.state.dialogState === 'closing') {
      this.setState({dialogState:"closed"});
    }
  }

  _close() {
    this.setState({dialogState: "closing"});
    this.refs.stars.hide();
    setTimeout(()=>{
    Animated.timing(this.state.fadeAnim, {
        toValue: 0,
        duration: this.props.animationDuration
    }).start(()=>{if(this.props.onClose) this.props.onClose({rate:this.rate,dontShowAgain:this.dontShowAgain});});
    },(this.props.animationDuration+200));
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
    let height = this.state.height*0.64-StatusBar.currentHeight;
    let top = this.state.height*0.36;
    let left = 0;
    if(this.orientation == "LANDSCAPE") {
      height = this.state.height-StatusBar.currentHeight;     
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
    let t = StyleSheet.create(obj);
    return t;
  }

  _getAnim() {
    let width = this.state.width;
    let height = this.state.height*0.64-StatusBar.currentHeight;
    let top = this.state.height*0.36;
    let left = 0;
    if(this.orientation == "LANDSCAPE") {
      height = this.state.height-StatusBar.currentHeight;     
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

  render() {
    let hidden;
    if (this.state.dialogState === 'closed') {
      // when opacity == 0 then hide dialog to optimize render
      hidden = styles.hidden;
    }

    let width = (this.orientation == 'PORTRAIT')?this.state.width:this.state.width/2;
    this.dStyles = this._getStyles();
    let anim = this._getAnim();

    return (
      <View style={[this.dStyles.container, hidden]}>
        <Animated.View
          style={[this.dStyles.container, styles.overlay, {
          opacity:anim.opacity
        }]}>
            <TouchableOpacity style={[this.dStyles.container]} onPress={()=>{this._close()}}/>
        </Animated.View>

        <Animated.View style={[this.dStyles.dialog, {transform: [
            {translateY: anim.dialogScroll},
        ]}]}>

          <View style={[styles.header, this.props.style.header]}>
            <Text style={[styles.headerText, this.props.style.headerText]}>
              Will you help us?
            </Text>
          </View>
          <View style={[styles.body, this.props.style.body]}>
            <Text style={[styles.bodyText, this.props.style.bodyText]}>
            If you have a free minute, please be so kind to rate out app.
            </Text>
          </View>
          
          <RateStars width={360} onSet={(rate)=>{this.rate = rate;this.close()}}/>
          
          <View style={{flex:1, flexDirection:"column", justifyContent:"flex-end"}}>
            <View style={{flexDirection:"row", justifyContent:"space-between", padding:15}}>
              <TouchableOpacity onPress={()=>{this.dontShowAgain=true;this.close()}} activeOpacity={0.4}>
                  <Text style={[styles.buttons, this.props.style.buttons]}>
                    {this.props.dontShowButtonText}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this.dontShowAgain=false;this.close()}}>
                  <Text style={[styles.buttons, this.props.style.buttons]}>
                  {this.props.closeButtonText}
                  </Text>
                </TouchableOpacity>
            </View>
          </View>  


        </Animated.View>

        <HangoverStars ref={'stars'} width={width} />
         
      </View>
    );
  }
}

AppReview.defaultProps = {
  animationDuration: 300,
  headerText: "Will you help us?",
  bodyText: "If you have a free minute, please be so kind to rate out app.",
  closeButtonText: "Close",
  dontShowButtonText: "Don't show again",
  style: {
    header: {
      margin: 28,
    },
    headerText: {
      color: "#333333",
      fontSize: 26,
      textAlign: "center"
    },
    body: {
      margin: 15
    },
    bodyText: {
      color: "#555555",
      fontSize: 20,
      textAlign: "center"
    },
    buttons: {
      fontSize:18,
      padding: 15
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#ff0000",
    flexDirection: "column",
    alignItems: "center",
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
    margin: 28,
  },
  headerText: {
    color: "#333333",
    fontSize: 26,
    textAlign: "center"
  },
  body: {
    margin: 15
  },
  bodyText: {
    color: "#555555",
    fontSize: 20,
    textAlign: "center"
  },
  buttons: {
    fontSize:18,
    padding: 15,
    color: "#555"
  }
});

export default AppReview;