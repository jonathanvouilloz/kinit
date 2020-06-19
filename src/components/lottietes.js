import React from 'react';
import LottieView from "lottie-react-native";
import { TouchableWithoutFeedbackBase } from 'react-native';

export default class App extends React.Component {
  componentDidMount() {
    // Or set a specific startFrame and endFrame with:
    this.animation.play();
  }

  render() {
    return (
        <LottieView
          loop={this.props.loop}
          ref={animation => {
            this.animation = animation;
          }}
          style={{
            width: this.props.size,
            height: this.props.size,
          }}
          source={this.props.src}
          // OR find more Lottie files @ https://lottiefiles.com/featured
          // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
        />
    );
  }
}

