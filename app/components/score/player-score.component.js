import React, { useState, useContext, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { SocketContext } from "../../contexts/socket.context";  


export const PlayerScore = () => {

  const socket = useContext(SocketContext);
  const [playerScore, setPlayerScore] = useState(0);

  useEffect(() => {

    socket.on("game.score.update", (data) => {
      if (data.player === 'player:2') {
        setPlayerScore(data.score);
      }
    });

  }, []);

    return (
      <View style={styles.playerScoreContainer}>
        {console.log("score",playerScore)}
        <Text>PlayerScore: {playerScore}</Text>
      </View>
    );
  };

  const styles = StyleSheet.create({

  playerScoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "lightgrey"
  },
})