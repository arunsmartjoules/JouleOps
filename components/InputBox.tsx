import { View, TextInput } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

interface InputText {
  className: string;
  icon: string;
  placeHolder: string;
  value: string;
  inputMode: any;
  onChange: (text: string) => void;
}

const InputBox = ({
  className,
  icon,
  placeHolder,
  value,
  inputMode,
  onChange,
}: InputText) => {
  return (
    <View
      className={`flex-row items-center flex-1 border rounded border-slate-300 bg-white ${className}`}
    >
      <TextInput
        className="flex-1 text-black h-full no-underline"
        onChangeText={onChange}
        value={value}
        placeholder={placeHolder}
        inputMode={inputMode}
      />
      <MaterialIcons name={icon} size={22} className="font-bold" />
    </View>
  );
};

export default InputBox;
