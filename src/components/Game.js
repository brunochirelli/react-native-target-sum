// TODO: Shuffle random numbers
// TODO: Combine boxes styles
// TODO: Timer with start and reset buttons, and when the
// game is not started, hide the keyboard, maybe add another
// screen to wrap the game before it starts

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { View, Text, Button, StyleSheet } from "react-native";
import RandomNumber from "./RandomNumber";
import useInterval from "../hooks/useInterval";

const Game = ({ randomNumberCount, initialSeconds }) => {
  const [randomNumbers, setRandomNumbers] = useState([]);
  const [target, setTarget] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [gameStatus, setGameStatus] = useState("IDLE");
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);

  /**
   * Function to populate a given number array length with
   * random numbers
   *
   * @returns array with numbers
   */
  const addRandomNumbers = () => {
    const arrayWithNumbers = Array.from({ length: randomNumberCount }).map(
      () => 1 + Math.floor(10 * Math.random())
    );

    return arrayWithNumbers;
  };

  /**
   * Essa função recebe o index do Array.map e checa se
   * dentre os números selecionados ele esta presente.
   *
   * A função é acionada para cada elemento no momento da
   * renderização.
   *
   * Lembre-se que NÃO é passado o NÚMERO, mas o INDEX (como
   * identificador único) evitando duplicados.
   *
   * @param {number} numberIndex index of the map
   * @returns {boolean}
   */
  const isIdSelected = (numberIndex) => selectedIds.indexOf(numberIndex) >= 0;

  /**
   * Popular o array de selectedIds baseado no clique de
   * cada número.
   *
   * @param {number} numberIndex
   * @returns {function} setState function
   */
  const selectNumber = (numberIndex) => {
    setSelectedIds((prev) => [...prev, numberIndex]);
  };

  /**
   * Reset the state
   */
  const handleReset = (nextRound) => {
    setRandomNumbers(addRandomNumbers());
    setSelectedIds([]);
    setGameStatus(nextRound ? "STARTED" : "IDLE");
    setRemainingSeconds(initialSeconds);
  };

  /**
   * Handle start function
   */
  const handleStart = () => {
    setGameStatus("STARTED");
  };

  /**
   * Spread random numbers across the initialized state.
   */
  useEffect(() => {
    setRandomNumbers([...addRandomNumbers()]);

    // everytime component will re-render, reset state
    return handleReset();
  }, []);

  /**
   * Check if gameStatus is not IDLE and return the
   * countdown using this custom hook.
   *
   * This hook is need instead use setInterval API.
   */
  useInterval(
    () => {
      setRemainingSeconds((prev) => prev - 1);
    },
    remainingSeconds === 0 || gameStatus !== "STARTED" ? null : 1000
  );

  /**
   * This effect helps previous useInterval to check for the
   * rest of the reaminingSeconds setting the game lost if
   * reach 0.
   */
  useEffect(() => {
    if (remainingSeconds === 0) {
      setGameStatus("LOST");
    }
  }, [remainingSeconds]);

  /**
   * Waits for randomNumbers to be updated before set a new target.
   */
  useEffect(() => {
    if (randomNumbers.length > 0) {
      setTarget(
        randomNumbers
          .slice(0, randomNumberCount - 2)
          .reduce((acc, curr) => acc + curr, 0)
      );
    }
  }, [randomNumbers]);

  /**
   * Sum all selected numbers and update result.
   */
  useEffect(() => {
    if (selectedIds.length === 0) {
      return;
    }

    let sumSelected = selectedIds.reduce(
      (acc, curr) => acc + randomNumbers[curr],
      0
    );

    if (sumSelected < target) {
      return setGameStatus("STARTED");
    }

    if (sumSelected === target) {
      return setGameStatus("WON");
    }

    if (sumSelected > target) {
      return setGameStatus("LOST");
    }
  }, [selectedIds, remainingSeconds]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "flex-start",
        padding: 8,
        paddingTop: 40,
        backgroundColor: "#E6E6E6",
      }}
    >
      <View
        style={{
          flex: 1,
          width: "100%",
          height: 100,
          padding: 16,
          marginHorizontal: 0,
          flexGrow: 1,
        }}
      >
        <View style={[styles.targetBox, styles[`STATUS_${gameStatus}`]]}>
          <Text style={styles.targetText}>{!!target && target}</Text>

          {gameStatus === "STARTED" ? (
            <View
              style={{
                width: `${100 - remainingSeconds * 10}%`,
                height: 4,
                backgroundColor: "red",
                alignSelf: "flex-start",
              }}
            />
          ) : null}
        </View>
        <View
          style={{
            // flexDirection default é 'column'
            flexDirection: "row",
            flexGrow: 1,
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            backgroundColor: "#D3CDCD",
            borderRadius: 8,
          }}
        >
          {gameStatus === "IDLE" ? (
            <View
              style={{
                flex: 1,
                padding: 16,
                flexGrow: 1,
                justifyContent: "space-between",
              }}
            >
              <Text style={{ paddingBottom: 8 }}>Vamos jogar!</Text>
              <Text style={{ paddingBottom: 8 }}>
                O objetivo desse jogo é encontrar os números que somados será
                igual ao número em destaque
              </Text>
              <Text style={{ paddingBottom: 8 }}>
                Mas se apresse, você tem apenas 10 segundos para descobrir
              </Text>

              <Button title="Start" onPress={handleStart} />
            </View>
          ) : (
            !!randomNumbers &&
            randomNumbers.map((number, index) => (
              <RandomNumber
                number={number}
                /** Verbaliza o que deve acontecer (is
                disabled when number is selected). Dessa
                forma, você indica que este componente não
                está aplicando nenhuma lógica, apenas
                renderizando o componente com as informações
                recebidas.
                */
                isDisabled={
                  isIdSelected(index) ||
                  gameStatus === "LOST" ||
                  gameStatus === "WON"
                }
                onPress={selectNumber}
                /** Neste caso, tudo bem passar o index, mas
                 em uma aplicação real, deveria ser o objeto
                 com seu UID
                */
                id={index}
                key={index}
              />
            ))
          )}
        </View>
      </View>
      <View
        style={{
          width: "100%",
          height: 64,
          flexGrow: 0,
          borderRadius: 8,
          padding: 8,
        }}
      >
        {gameStatus === "LOST" || gameStatus === "WON" ? (
          <View>
            <Text style={{ textAlign: "center" }}>You {gameStatus}</Text>
            <Button title="Play Again" onPress={() => handleReset(true)} />
          </View>
        ) : null}
      </View>
    </View>
  );
};

/**
 * StyleSheet helps you debug your styles
 */
const styles = StyleSheet.create({
  targetBox: {
    width: "100%",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderRadius: 8,
  },
  targetText: {
    padding: 8,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 60,
    fontWeight: "bold",
    color: "#383832",
    height: "auto",
    width: "100%",
  },
  STATUS_IDLE: {
    backgroundColor: "white",
  },
  STATUS_STARTED: {
    backgroundColor: "white",
  },
  STATUS_WON: {
    backgroundColor: "#79D8A2",
  },
  STATUS_LOST: {
    backgroundColor: "#FF9797",
  },
});

Game.propTypes = {
  randomNumberCount: PropTypes.number.isRequired,
  initialSeconds: PropTypes.number.isRequired,
};

export default Game;
