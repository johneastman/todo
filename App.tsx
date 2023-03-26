import { StatusBar } from 'expo-status-bar';
import { Component } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 40
  }
});

interface AppState {
  count: number;
}

export default class App extends Component<{}, AppState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      count: 0
    }
  }

  onPress(): void {
    this.setState({count: this.state.count + 1});
  }

  render(): JSX.Element {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Count: {this.state.count}</Text>
        <Button title="Increase Count" onPress={this.onPress.bind(this)}></Button>
        <StatusBar style="auto" />
      </View>
    );
  }
}
