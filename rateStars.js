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

class RateStars extends Component {

  propTypes: {
    onSet: PropTypes.func,
    style: PropTypes.object
  }

  constructor(props) {
    super(props);
    this._starPressed = this._starPressed.bind(this);
    this._getViews = this._getViews.bind(this);
    this._starsShow = this._starsShow.bind(this);
    this._onSet = this._onSet.bind(this);
    this._clicked = false;
  }

  componentWillMount() {
    this.state = {
      starsClickAnim: new Animated.Value(0),
      starsClicked: 0
    };
  }

  _starPressed(stars) {
    if (this._clicked)
      return;
    this._clicked = true;
    this.state.starsClickAnim.setValue(0);
    this.setState({starsClicked:stars}); 
    Animated.spring(this.state.starsClickAnim, {
          toValue: 1,
          tension: 40,
          friction: 3,
    }).start(this._onSet);
  }

  _starsShow(num) {
    let res = (this.state.starsClicked >= num)?1:0;
    return res;
  }

  _onSet() {
    if(this.props.onSet && this.state.starsClicked > 0) {
      this.props.onSet(this.state.starsClicked);
      this._clicked = false;
    }
  }

  _getStyles() {
    let obj = {
      starButton: {
        width: 40,
        height: 40,
      },
      disabledStars: {
        flexDirection: "row",
        justifyContent: 'space-between',
        top: 0
      },
      activeStars: {
        flexDirection: "row",
        justifyContent: 'space-between',
        top: -40      }
    };
    let t = StyleSheet.create(obj);
    return t;
  }

  _getViews() {
    let back = [];
    let front = [];
    let styles = this._getStyles();
    for(let i=1; i<=5; i++) {
      back.push(
        <TouchableWithoutFeedback key={"starButton"+i+"bw"}  onPress={()=>{this._starPressed(i);}}>  
          <Animated.Image source={require('./starbw.png')} style={[styles.starButton]} />
        </TouchableWithoutFeedback>
      );
      front.push(
        <TouchableWithoutFeedback key={"starButton"+i}  onPress={()=>{this._starPressed(i);}}> 
          <Animated.Image source={require('./star.png')} style={[styles.starButton,{
            transform:[{scale:this.state.starsClickAnim.interpolate({
                inputRange: [0,1],
                outputRange: [0,1.2],
                extrapolate:"clamp"
            })}]
          },{opacity: this._starsShow(i)}]} />
        </TouchableWithoutFeedback>  
      );
    }
    return (
      <View key={'rateContainer'} style={this.props.style}>
        <View key={'backStars'} style={styles.disabledStars}>
          {back}
        </View>
        <View key={'frontStars'} style={styles.activeStars}>
          {front}
        </View>
      </View>
    );
  }

  render() {
    let views = this._getViews();

    return views
  }
}

RateStars.defaultProps = {
  style: {
    margin: 25
  }  
}

export default RateStars;