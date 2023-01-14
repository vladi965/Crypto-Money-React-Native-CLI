import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native'
import React, { Component } from 'react'
import Http from '../../libs/http';
import CoinsItem from './CoinsItem';
import CoinsSearch from './CoinsSearch';
import Colors from '../../res/colors';

class CoinsScreen extends Component {
    
    state = {
        coins: [],
        allCoins: [],
        loading: false
    }



    componentDidMount = async () => {
        this.getCoins();
     }

     getCoins = async () => {
        this.setState({ loading: true });
        const res = await Http.instance.get("https://api.coinlore.net/api/tickers/");
        this.setState({ coins: res.data, allCoins: res.data, loading: false });
     }

    handlePress = (coin) => {
        this.props.navigation.navigate('CoinDetail', {coin});
    }

    handleSearch = (query) => {
        const {allCoins} = this.state;
        const coinsFiltered = allCoins.filter((coin) => {
            return coin.name.toLowerCase().includes(query.toLowerCase()) || 
            coin.symbol.toLowerCase().includes(query.toLowerCase());
        });

        this.setState({ coins: coinsFiltered});
    }

    render(){
        const { coins, loading } = this.state;
        
        return (
          <View style={styles.container}>
            <CoinsSearch onChange={this.handleSearch}/>
            { loading ?
                <ActivityIndicator
                style={styles.loader}
                color="red" size="large" /> : null
            }
           <FlatList
             data={coins}
             keyExtractor={( item ) => item.id}
             renderItem={({ item }) => (
                <CoinsItem item={item} onPress={() => this.handlePress(item)} />
             )}
           />
          </View>
        )
    }
}

export default CoinsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.charade,
    },
    btn: {
        padding: 8,
        backgroundColor: "blue",
        borderRadius: 8,
        margin: 16
    },
    titleText: {
        color: "white",
        textAlign: "center"
    },
    btnText: {
        color: "#fff",
        textAlign: "center"
    },
    loader: {
        marginTop: 160
    }
})