import React, { Component } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import FavoritesEmptyState from './FavoritesEmptyState';
import CoinsItem from '../../components/coins/CoinsItem';
import Colors from '../../res/colors';
import Storage from "../../libs/storage";

export default class FavoriteScreen extends Component {

  state = {
    favorites: []
  }

  getFavorites = async () =>  {
    try {
       const allKeys = await Storage.instance.getAllKeys();
       const keys = allKeys.filter((key) => key.includes("favorite-"));
       const favs = await Storage.instance.multiGet(keys);
       const favorites = favs.map((fav) => JSON.parse(fav[1]));

       this.setState({ favorites });


    } catch (err) {
      console.log("get favorites err", err);
    }
  }

  handlePress = (coin) => {
    this.props.navigation.navigate("CoinDetail", { coin });
  }


  componentDidMount() {

    this.props.navigation.addListener("focus", this.getFavorites);
  }

  componentWillUnmount() {
    this.props.navigation.removeListener("focus", this.getFavorites);
  }


  render() {
    const { favorites } = this.state;

    return (
      <View style={styles.container}>
        { favorites.length === 0 ?
        <FavoritesEmptyState />
        : null
       }

       { favorites.length > 0 ?
        <FlatList
          data={favorites}
          renderItem={({ item }) =>
            <CoinsItem
              item={item}
              onPress={() => this.handlePress(item)}
            />
          }
        />
        : null
       }
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.charade,
        flex: 1
    }
})