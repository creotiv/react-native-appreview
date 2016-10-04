/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import AppReview from './comp/index';

class AppReviewDialogExample extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
    };

    this.showReview = this.showReview.bind(this);
    this._onLayout = this._onLayout.bind(this);
  }

  showReview() {
    this.setState({dialogOpen: true});
  }

  _onLayout(event) {
    this.refs.app_review.layoutChanged(event.nativeEvent.layout)
  }

  render() {
    return (
      <View style={styles.container} onLayout={this._onLayout}>
        <Text style={styles.openbtn} onPress={()=>{this.showReview()}}>
          Open review dialog
        </Text>
        <AppReview ref={"app_review"} visible={this.state.dialogOpen} animationDuration={200}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  openbtn: {
    fontSize: 26,
    textAlign: 'center',
    margin: 10,
    backgroundColor: '#FFFFFF'
  }
});

AppRegistry.registerComponent('AppReviewDialogExample', () => AppReviewDialogExample);
