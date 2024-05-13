import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import PlayerDeck from "./decks/player-deck.component";
import OpponentDeck from "./decks/opponent-deck.component";
import PlayerTimer from "./timers/player-timer.component";
import OpponentTimer from "./timers/opponent-timer.component";
import Choices from "./choices/choices.component";
import Grid from "./grid/grid.component";
import { OpponentInfos } from "./opponent-infos.component";
import { PlayerScore } from "../score/player-score.component";
import { OpponentScore } from "../score/opponent-score.component";
import { PlayerInfos } from "./player-infos.component";









const Board = ({ gameViewState }) => {

  return (

    <View style={styles.container}>

      <View style={[styles.row, { height: '5%' }]}>
        <OpponentInfos />
        <View style={styles.opponentTimerScoreContainer}>
          <OpponentTimer />
          <OpponentScore />
        </View>
      </View>

      <View style={[styles.row, { height: '25%' }]}>
        <OpponentDeck />
      </View>

      <View style={[styles.row, { height: '40%' }]}>
        <Grid />
        <Choices />
      </View>

      <View style={[styles.row, { height: '25%' }]}>
        <PlayerDeck />
      </View>

      <View style={[styles.row, { height: '5%' }]}>
        <PlayerInfos />
        <View style={styles.playerTimerScoreContainer}>
          <PlayerTimer />
          <PlayerScore />
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  opponentInfosContainer: {
    flex: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: 'black',
    backgroundColor: "lightgrey"
  },
  opponentTimerScoreContainer: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "lightgrey"
  },
  opponentTimerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  opponentScoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deckOpponentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "black"
  },
  gridContainer: {
    flex: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: 'black',
  },
  choicesContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "lightgrey"
  },
  deckPlayerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  playerInfosContainer: {
    flex: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: 'black',
    backgroundColor: "lightgrey"
  },
  playerTimerScoreContainer: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "lightgrey"
  },
  playerTimerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "lightgrey"
  },
  playerScoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "lightgrey"
  },
});

export default Board;
