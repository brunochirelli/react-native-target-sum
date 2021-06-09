/**
 * Top level component
 */

import React from "react";
import { Platform, StatusBar } from "react-native";
import Game from "./Game";

const App = () => {
  return (
    <>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "default"}
      />
      <Game randomNumberCount={6} initialSeconds={10} />
    </>
  );
};

export default App;
