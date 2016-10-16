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
  Alert,
  View
} from 'react-native';
import AppReview from 'react-native-appreview';

class AppReviewDialogExample extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dialogVisible: true
    };
    this.showReview = this.showReview.bind(this);
    this._onLayout = this._onLayout.bind(this);
  }

  showReview() {
    this.setState({dialogVisible: true});
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
        <AppReview ref={"app_review"} visible={this.state.dialogVisible} onClose={(obj)=>{this.setState({dialogVisible: false});Alert.alert(
            'App Rated',
            "rate: "+obj.rate+" dont show again: "+obj.dontShowAgain)}}
          headerText={"Will you help us?"} 
          bodyText={"If you have a free minute, please be so kind to rate out app."}
          closeButtonText={"Close"}
          dontShowButtonText={"Don't show again"}
        />
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
