import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Board from "../components/board/board.component";

const BotPlayer = () => {
    // État pour stocker les dés du bot
    const [botDice, setBotDice] = useState([]);

    // Fonction pour simuler le lancer de dés
    const rollDice = () => {
        const newDice = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
        setBotDice(newDice);
    };

    // Logique pour choisir les meilleurs dés à garder
    const chooseBestDice = () => {
        const diceCount = [0, 0, 0, 0, 0, 0]; // Tableau pour compter les occurrences de chaque valeur de dé

        // Compter les occurrences de chaque valeur de dé
        botDice.forEach((value) => {
            diceCount[value - 1]++;
        });

        const bestDice = [];

        // Garder les dés avec le plus d'occurrences
        for (let i = 5; i >= 0; i--) {
            if (diceCount[i] >= 3) {
                for (let j = 0; j < diceCount[i]; j++) {
                    bestDice.push(i + 1);
                }
                break;
            }
        }

        // Si aucune combinaison n'est trouvée, garder les dés les plus élevés
        if (bestDice.length === 0) {
            for (let i = 5; i >= 0; i--) {
                if (diceCount[i] > 0) {
                    bestDice.push(i + 1);
                    diceCount[i]--;
                }
            }
        }

        // Mettre à jour l'état avec les meilleurs dés à garder
        setBotDice(bestDice);
    };

    // Effet pour lancer les dés au chargement du composant
    useEffect(() => {
        rollDice();
    }, []);

    // Rendu du composant
    return (
        <Board/>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    diceContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    dice: {
        fontSize: 24,
        fontWeight: 'bold',
        marginHorizontal: 5,
    },
    instructions: {
        fontSize: 16,
        color: 'gray',
    },
});

export default BotPlayer;