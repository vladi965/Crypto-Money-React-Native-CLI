import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class FavoritesEmptyState extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>you don't have any favorites yet</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: "center",
        justifyContent: "center",
    },
    text: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
        alignSelf: "center"
    }

})