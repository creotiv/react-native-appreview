'use strict';

import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback
} from 'react-native';

class HangoverStars extends Component {

  propTypes: {
    animationDuration: PropTypes.number,
    style: PropTypes.object,
    width: PropTypes.number,
  }

  defaultProps: {
    animationDuration: 300
  }

  constructor(props) {
    super(props);
    this.state = {
      starsAnim: new Animated.Value(0)
    };
    this._getViews = this._getViews.bind(this);
    this._hideStars = this._hideStars.bind(this);
    this._showStars = this._showStars.bind(this);
    this._getStyles = this._getStyles.bind(this);
    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);

    this.starsData = [
      {left:0.14,scale:0.2,input:[0,0.3,1],output:[-2000,-1050,-1120]},
      {left:0.33,scale:0.10,input:[0,0.5,1],output:[-2000,-1000,-1090]},
      {left:0.48,scale:0.14,input:[0,0.5,1],output:[-2000,-1230,-1040]},
      {left:0.67,scale:0.15,input:[0,0.5,1],output:[-3000,-1140,-1080]},
      {left:0.86,scale:0.19,input:[0,0.5,1],output:[-2000,-980,-1050]}
    ]
  }

  hide() {
    this._hideStars();
  }

  show() {
    this._showStars();
  }

  _hideStars() {
    Animated.timing(this.state.starsAnim, {
      toValue: 0,
      duration: this.props.animationDuration
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

  _getStyles() {
    let width = this.props.width;
    let obj = {};
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

  _getViews(styles) {
    let res = [];
    for(let i=1; i<=this.starsData.length; i++) {
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

  render() {
    let views = this._getViews(this._getStyles());

    return (
      <View style={[{width:this.props.width,position:"absolute",left:0,top:0},this.props.style]}>
        {views}
      </View>
    );
  }
}

export default HangoverStars;