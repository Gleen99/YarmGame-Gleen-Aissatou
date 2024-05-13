import React, { useState, useContext, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { SocketContext } from "../../contexts/socket.context";

export const PlayerInfos = () => {
    return (
      <View style={styles.playerInfosContainer}>
        <Text>Player Infos</Text>
      </View>
    );
  };

  const styles = StyleSheet.create({
  playerInfosContainer: {
    flex: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: 'black',
    backgroundColor: "lightgrey"
  },
})