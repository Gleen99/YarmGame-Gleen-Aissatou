import React, { useState, useContext, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { SocketContext } from "../../contexts/socket.context";

export const OpponentInfos = () => {
    return (
      <View style={styles.opponentInfosContainer}>
        <Text>Opponent infos</Text>
      </View>
    );
  };

  const styles = StyleSheet.create({
  opponentInfosContainer: {
    flex: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: 'black',
    backgroundColor: "lightgrey"
  },
})