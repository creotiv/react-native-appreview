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
    animationDuration: PropTypes.number
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
    this._getStars = this._getStars.bind(this);
    this._getStyles = this._getStyles.bind(this);
    this._getAnim = this._getAnim.bind(this);
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

  _getStyles() {
    let obj = {

    };
    let t = StyleSheet.create(obj);
    return t;
  }

  _getViews() {

  }

  render() {
    let views = this._getViews();

    return views
  }
}

export default HangoverStars;