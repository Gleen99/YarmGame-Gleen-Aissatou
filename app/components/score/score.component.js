// Score.component.js
import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SocketContext } from "../../../contexts/socket.context";

const Score = () => {
    const socket = useContext(SocketContext);
    const [score, setScore] = useState(0);

    useEffect(() => {
        socket.on("game.score.update", (data) => {
            setScore(data.score);
        });
    }, []);

    return (
        <View style={styles.scoreContainer}>
            <Text>Score du joueur: {score}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    scoreContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default Score;
