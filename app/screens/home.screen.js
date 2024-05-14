import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Animated } from 'react-native';

export default function HomeScreen({ navigation }) {
    const [buttonScale] = useState(new Animated.Value(1));

    const handleButtonPress = (screen) => {
        Animated.sequence([
            Animated.timing(buttonScale, {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(buttonScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start(() => {
            navigation.navigate(screen);
        });
    };

    const animatedButtonStyle = {
        transform: [{ scale: buttonScale }],
    };

    return (
        <ImageBackground source={require('../assets/dice-689618_1920.jpg')} style={styles.backgroundImage}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Yarm's Game</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <Animated.View style={[styles.button, animatedButtonStyle]}>
                        <TouchableOpacity onPress={() => handleButtonPress('OnlineGameScreen')}>
                            <Text style={styles.buttonText}>Jouer en ligne</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View style={[styles.button, animatedButtonStyle]}>
                        <TouchableOpacity onPress={() => handleButtonPress('VsBotGameScreen')}>
                            <Text style={styles.buttonText}>Jouer contre le bot</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        width: '100%',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond semi-transparent pour une meilleure lisibilité
    },
    header: {
        marginBottom: 40,
    },
    headerText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    buttonContainer: {
        width: '80%',
    },
    button: {
        backgroundColor: '#e67e22',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginBottom: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
