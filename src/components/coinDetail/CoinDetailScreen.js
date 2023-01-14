import { StyleSheet, Text, Pressable, SectionList, View, Image, FlatList, Alert } from 'react-native'
import React, { Component } from 'react'
import Colors from '../../res/colors';
import Http from '../../libs/http';
import CoinMarketItem from './CoinMarketItem';
import Storage from '../../libs/storage';

class CoinDetailScreen extends Component {

  state = {
    coin: {},
    markets: [],
    isFavorite: false
  }

  toggleFavorite = () => {
    if(this.state.isFavorite) {
      this.removeFavorite();
    } else {
      this.addFavorite();
    }
  }

  addFavorite = async () => {
    const coin = JSON.stringify(this.state.coin);
    const key = `favorite-${this.state.coin.id}`;

    const stored = await Storage.instance.store(key, coin);

    console.log("stored", stored);

    if(stored){
      this.setState({ isFavorite: true });
    }
  }

  removeFavorite = async () => {
    Alert.alert("Remove Favorite", "Estas Seguro?", [
      {
        text: "cancel",
        onPress: () => {},
        style: "cancel"
      },
      {
        text: "Remove",
        onPress: async () => {
          const key = `favorite-${this.state.coin.id}`;
      
          await Storage.instance.remove(key);
      
          this.setState({ isFavorite: false });
        },
        style: "destructive"
      }
    ])
  }

  getFavorite = async () => {
    try {
      const key = `favorite-${this.state.coin.id}`;
      const favStr = await Storage.instance.get(key);

      if(favStr != null){
        this.setState({ isFavorite: true });
      }
      console.log("fav", favStr);
    } catch (err) {
      console.log("get favorites err", err);
    }
  }


  getSymbolsIcon = (name) => {
    if(name) {

      const symbol = name.toLowerCase().replace(" ", "-");
      return `https://c1.coinlore.com/img/25x25/${symbol}.png`
    }
  }

  getSections = (coin) => {
    const sections = [
      {
        title: "Market Cap",
        data: [coin.market_cap_usd]
      },
      {
        title: "Volume 24h",
        data: [coin.volume24]
      },
      {
        title: "Change 24h",
        data: [coin.percent_change_24h]
      }
    ];

    return sections;
  }

  getMarkets = async (coinId) => {
    const url = `https://api.coinlore.net/api/coin/markets/?id=${coinId}`;
    const markets = await Http.instance.get(url);
    this.setState({ markets });
  }

  componentDidMount() {
    const {coin} = this.props.route.params;
    this.props.navigation.setOptions({ title: coin.symbol})
    this.getMarkets(coin.id);
    this.setState({coin}, () => {
      this.getFavorite();
    });
  }

  render() {

    const { coin, markets, isFavorite } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.subHeader}>
          <View style={styles.row}>
            <Image style={styles.iconImg} source={{ uri: this.getSymbolsIcon(coin.name)}} />
            <Text style={styles.titleText}>{coin.name}</Text>
          </View>
          <Pressable  onPress={this.toggleFavorite}
          style={[styles.btnFavorite, isFavorite ? styles.btnFavoriteRemove : styles.btnFavoriteAdd]}>
            <Text style={styles.btnFavoriteText}>{isFavorite ? "Remove favorite" : "Add Favorites"}</Text>
          </Pressable>
        </View>
        <SectionList style={styles.section}
          sections={this.getSections(coin)}
          keyExtractor={(item) => item}
          renderItem={({ item }) =>
          <View style={styles.sectionItem}>
            <Text style={styles.itemText}>{item}</Text>
          </View>
          }
          renderSectionHeader={({ section }) =>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionText}>{section.title}</Text>
          </View>
          }
        />

        <Text style={styles.marketsTitle}>Markets</Text>

        <FlatList
          style={styles.list}
          horizontal={true}
          data={markets}
          renderItem={({ item }) => <CoinMarketItem item={item} />}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }
}

export default CoinDetailScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackPearl,
  },
  row: {
    flexDirection: "row"
  },
  subHeader: {
    backgroundColor: "rgba(0,0,0,0.1)",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.white,
    marginLeft: 8
  },
  iconImg: {
    width: 25,
    height: 25,
  },
  sectionHeader: {
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: 8,
  },
  sectionItem: {
    padding: 8,
  },
  itemText: {
    color: Colors.white,
    fontSize: 14,
  },
  sectionText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  section: {
    maxHeight: 220
  },
  list: {
    maxHeight: 100,
    paddingLeft: 16
  },
  marketsTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    paddingLeft: 16
  },
  btnFavorite: {
    padding: 8,
    borderRadius: 8,
  },
  btnFavoriteText: {
    color: "#fff"
  },
  btnFavoriteAdd: {
    backgroundColor: Colors.picton
  },
  btnFavoriteRemove: {
    backgroundColor: Colors.carmine
  }
})