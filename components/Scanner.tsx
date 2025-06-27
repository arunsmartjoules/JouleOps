import { View, Text, Alert, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";

interface Scan {
  onScan: (result: any) => Promise<void>;
  className: string;
}
const Scanner = ({ onScan, className }: Scan) => {
  const [hasPermission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const handleScan = async ({ data }: { data: string }) => {
    if (!scanned) {
      setScanned(true);
      onScan(data);
    }
  };

  if (!hasPermission) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Requesting Camera Permission...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center">
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleScan}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        facing="back"
        style={styles.camera}
      />
      <Text style={styles.text}>Scan a QR Code</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  camera: { width: "100%", height: "80%" },
  text: { color: "white", fontSize: 18, marginTop: 10 },
});

export default Scanner;
