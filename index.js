import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Animated
} from 'react-native';

const SCRREN_WIDTH = Dimensions.get('window').width;
const SCRREN_HEIGHT = Dimensions.get('window').height;

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
    this.state = {
      dialogState: (this.props.visible)?"opening":"closed";
      fadeAnim: new Animated.Value(0)
    };
    this.state.fadeAnim.addListener(this._onAnimate);

    this.showReview = this.showReview.bind(this);
    this._close = this._close.bind(this);
    this._open = this._open.bind(this);
    this._onAnimate = this._onAnimate.bind(this);
  }

  componentWillUnmount(){
    this.state.fadeAnim.removeAllListeners(0);
  }

  componentDillMount(){
    if(this.state.dialogState=="opening") {
      this._open();
    }
  }

  _onAnimate(value) {
    if(value === 0.5) {
      this.setState({dialogState:"opened"});  
    } else if(value === 0) {
      this.setState({dialogState:"closed"});
    }
  }

  _close() {
    this.setState({dialogState: "closing"});
    Animated.timing(this.state.fadeAnim, {
        toValue: 0,
        duration: this.props.animationDuration
    }).start();
  }

  _open() {
    this.setState({dialogState: "opening"});
    Animated.timing(this.state.fadeAnim, {
        toValue: 1,
        duration: this.props.animationDuration
    }).start(); 
  }

  render() {
    let hidden;
    if (this.state.dialogState === 'closed') {
      hidden = styles.hidden;
    return (
      <View style={[styles.container, hidden]}>
        <Animated.View style={[styles.container, styles.overlay, {
          opacity:this.state.fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5]
          })
        }]}>
            <TouchableWithoutFeedback onPress={()=>{this._close()}}/>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: "absolute",
    top: 0,
    left: 0,
    height: SCRREN_HEIGHT,
    width: SCRREN_WIDTH,
  },
  overlay: {
    opacity: 0.5,
    backgroundColor: '#000000',
  },
  hidden: {
    top: -10000,
    left: 0,
    height: 0,
    width: 0,
  }
});

export default AppReview;