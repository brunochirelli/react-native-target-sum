import React from "react";
import PropTypes from "prop-types";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";

// O nome deste componente poderia ser mais explícito sobre
// qual é seu papel no app. Ex.: PressNumber, ButtonNumber
const RandomNumber = ({ number, isDisabled, onPress, id }) => {
  const handlePress = () => {
    if (!isDisabled) {
      return onPress(id);
    }
  };

  // Formas de se definir uma interação de botão:
  // -  TouchableOpacity
  // -  TouchableHighlight
  return (
    <TouchableOpacity
      style={[styles.container]}
      onPress={handlePress}
      disabled={isDisabled}
    >
      <View style={[styles.number, isDisabled && styles.selected]}>
        <Text style={styles.numberText}>{number}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "50%",
    height: "33%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  number: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    borderBottomWidth: 4,
    borderColor: "#A69D93",
    borderRadius: 8,
    backgroundColor: "#E5E4E0",
  },
  numberText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#383832",
  },
  selected: {
    opacity: 0.3,
  },
});

RandomNumber.propTypes = {
  number: PropTypes.number.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

export default RandomNumber;
