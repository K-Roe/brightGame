import { MotiView } from "moti";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

const AssetMaps = {
  bodies: {
    1: require("../assets/monster-parts/bodies/body_1.png"),
    2: require("../assets/monster-parts/bodies/body_2.png"),
    3: require("../assets/monster-parts/bodies/body_3.png"),
    4: require("../assets/monster-parts/bodies/body_4.png"),
    5: require("../assets/monster-parts/bodies/body_5.png"),
    6: require("../assets/monster-parts/bodies/body_6.png"),
  },
  eyes: {
    1: require("../assets/monster-parts/eyes/eyes_1.png"),
    2: require("../assets/monster-parts/eyes/eyes_2.png"),
    3: require("../assets/monster-parts/eyes/eyes_3.png"),
    4: require("../assets/monster-parts/eyes/eyes_4.png"),
    5: require("../assets/monster-parts/eyes/eyes_5.png"),
    6: require("../assets/monster-parts/eyes/eyes_6.png"),
  },
  mouths: {
    1: require("../assets/monster-parts/mouths/mouth_1.png"),
    2: require("../assets/monster-parts/mouths/mouth_2.png"),
    3: require("../assets/monster-parts/mouths/mouth_3.png"),
    4: require("../assets/monster-parts/mouths/mouth_4.png"),
    5: require("../assets/monster-parts/mouths/mouth_5.png"),
    6: require("../assets/monster-parts/mouths/mouth_6.png"),
  },
};

const getIndexFromHash = (hash, start, count, totalAssets) => {
  if (!hash) return 1;
  const subHash = hash.substring(start, start + count) || "0";
  const number = parseInt(subHash, 16);
  return (number % totalAssets) + 1;
};

const MonsterRenderer = ({ hash, isAlive = false }) => {
  const bodyId = getIndexFromHash(hash, 0, 2, 6);
  const eyeId = getIndexFromHash(hash, 2, 2, 6);
  const mouthId = getIndexFromHash(hash, 4, 2, 6);

  return (
    <View style={styles.container}>
      {/* SHADOW LAYER */}
      <View style={styles.shadowContainer}>
        <MotiView
          animate={{
            scale: isAlive ? [1, 1.1, 1] : 1,
            opacity: isAlive ? 0.3 : 0.1,
          }}
          transition={{
            type: "timing",
            duration: 1500,
            loop: true,
          }}
          style={styles.shadow}
        />
      </View>

      {/* MONSTER ANIMATION LAYER */}
      <MotiView
        from={{ translateY: 0 }}
        animate={{
          translateY: isAlive ? -10 : 0,
        }}
        transition={{
          type: "timing",
          duration: 1500,
          loop: true,
          reverse: true,
        }}
        style={styles.monsterWrapper}
      >
        {/* Layered Images */}
        <Image source={AssetMaps.bodies[bodyId]} style={styles.bodyLayer} />
        <Image source={AssetMaps.eyes[eyeId]} style={styles.eyeLayer} />
        <Image source={AssetMaps.mouths[mouthId]} style={styles.mouthLayer} />
      </MotiView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  monsterWrapper: {
    width: 200,
    height: 200,
    position: "relative",
  },
  shadowContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
  },
  shadow: {
    width: 80,
    height: 15,
    backgroundColor: "black",
    borderRadius: 40,
  },
  bodyLayer: {
    width: "100%",
    height: "100%",
    position: "absolute",
    resizeMode: "contain",
  },
  eyeLayer: {
    width: "45%",
    height: "45%",
    position: "absolute",
    top: "10%",
    left: "27.5%",
    resizeMode: "contain",
    zIndex: 2,
  },
  mouthLayer: {
    width: "40%",
    height: "40%",
    position: "absolute",
    top: "48%",
    left: "30%",
    resizeMode: "contain",
    zIndex: 1,
  },
});

export default MonsterRenderer;
