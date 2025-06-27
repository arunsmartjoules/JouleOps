import { View, Animated, StyleSheet } from "react-native";
import React from "react";

const Skeleton = () => {
  return (
    <View className="p-2 gap-[20px] flex-col">
      <View className="gap-4">
        <Animated.View
          className="w-[70%] h-[8px] rounded-lg"
          style={styleSheet.skeletonStyle}
        />
        <Animated.View
          className="w-[30%] h-[8px] rounded-lg"
          style={styleSheet.skeletonStyle}
        />
        <Animated.View
          className="w-[50%] h-[8px] rounded-lg"
          style={styleSheet.skeletonStyle}
        />
        <Animated.View
          className="w-[45%] h-[8px] rounded-lg"
          style={styleSheet.skeletonStyle}
        />
      </View>
      <View className="gap-4">
        <Animated.View
          className="w-[70%] h-[8px] rounded-lg"
          style={styleSheet.skeletonStyle}
        />
        <Animated.View
          className="w-[30%] h-[8px] rounded-lg"
          style={styleSheet.skeletonStyle}
        />
        <Animated.View
          className="w-[50%] h-[8px] rounded-lg"
          style={styleSheet.skeletonStyle}
        />
        <Animated.View
          className="w-[45%] h-[8px] rounded-lg"
          style={styleSheet.skeletonStyle}
        />
      </View>
      <View className="gap-4">
        <Animated.View
          className="w-[70%] h-[8px] rounded-lg"
          style={styleSheet.skeletonStyle}
        />
        <Animated.View
          className="w-[30%] h-[8px] rounded-lg"
          style={styleSheet.skeletonStyle}
        />
        <Animated.View
          className="w-[50%] h-[8px] rounded-lg"
          style={styleSheet.skeletonStyle}
        />
        <Animated.View
          className="w-[45%] h-[8px] rounded-lg"
          style={styleSheet.skeletonStyle}
        />
      </View>
      <View className="gap-4">
        <Animated.View
          className="w-[70%] h-[8px] rounded-lg"
          style={styleSheet.skeletonStyle}
        />
        <Animated.View
          className="w-[30%] h-[8px] rounded-lg"
          style={styleSheet.skeletonStyle}
        />
        <Animated.View
          className="w-[50%] h-[8px] rounded-lg"
          style={styleSheet.skeletonStyle}
        />
        <Animated.View
          className="w-[45%] h-[8px] rounded-lg"
          style={styleSheet.skeletonStyle}
        />
      </View>
      <View className="gap-4">
        <Animated.View
          className="w-[70%] h-[8px] rounded-lg"
          style={styleSheet.skeletonStyle}
        />
        <Animated.View
          className="w-[30%] h-[8px] rounded-lg"
          style={styleSheet.skeletonStyle}
        />
        <Animated.View
          className="w-[50%] h-[8px] rounded-lg"
          style={styleSheet.skeletonStyle}
        />
        <Animated.View
          className="w-[45%] h-[8px] rounded-lg"
          style={styleSheet.skeletonStyle}
        />
      </View>
      <View className="gap-4">
        <Animated.View
          className="w-[70%] h-[8px] rounded-lg"
          style={styleSheet.skeletonStyle}
        />
        <Animated.View
          className="w-[30%] h-[8px] rounded-lg"
          style={styleSheet.skeletonStyle}
        />
        <Animated.View
          className="w-[50%] h-[8px] rounded-lg"
          style={styleSheet.skeletonStyle}
        />
        <Animated.View
          className="w-[45%] h-[8px] rounded-lg"
          style={styleSheet.skeletonStyle}
        />
      </View>
    </View>
  );
};

const styleSheet = StyleSheet.create({
  skeletonStyle: {
    backgroundColor: "#e0e0e0",
  },
});

export default Skeleton;
