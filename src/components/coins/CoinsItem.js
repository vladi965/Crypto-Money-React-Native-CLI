import React from "react";
import { View, Text, Image, Pressable, StyleSheet, Platform } from "react-native";
import Colors from '../../res/colors';

const CoinsItem = ({ item, onPress }) => {

    getImgArrow = () => {

        if(item.percent_change_1h > 0) {
            return require('../../assets/arrow_up.png');
        } else {
            return require('../../assets/arrow_down.png');
        }
    }

    return (
        <Pressable onPress={onPress} style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.symbolText}>{item.name}</Text>
                <Text style={styles.nameText}>{item.symbol}</Text>
                <Text style={styles.priceText}>{`$${item.price_usd}`}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.percentText}>{item.percent_change_1h}</Text>
                <Image
                    style={styles.imgIcon}
                    source={getImgArrow()}
                />
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        borderBottomColor: Colors.zircon,
        borderBottomWidth: 1,
        marginLeft: Platform.OS === "android" ? 10 : 0
    },
    row: {
        flexDirection: "row",
    },
    symbolText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        marginRight: 12
    },
    nameText: {
        color: "#fff",
        fontSize: 14,
        marginRight: 16
    },
    percentText: {
        color: "#fff",
        fontSize: 12,
        marginRight: 8
    },
    priceText: {
        color: "#fff",
        fontSize: 14,
    },
    imgIcon: {
        width: 22,
        height: 22
    }

})

export default CoinsItem;