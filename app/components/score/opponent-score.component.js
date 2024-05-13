import React, { useState, useContext, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { SocketContext } from "../../contexts/socket.context";


export const OpponentScore = () => {
  const socket = useContext(SocketContext);
  const [opponentScore, setOppenentScore] = useState(0);

  useEffect(() => {
    socket.on("game.score.update", (data) => {
      if (data.player === 'player:1') {
        setOppenentScore(data.score);
      }
    });
  }, []);
  


    return (
      <View style={styles.opponentScoreContainer}>
        <Text>Score: {opponentScore}</Text>
      </View>
    );
  };

  const styles = StyleSheet.create({
  opponentScoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})