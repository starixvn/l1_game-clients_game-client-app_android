import * as Linking from "expo-linking";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

const stylesheet = StyleSheet.create({
  statusBar: {
    flex: 0,
    backgroundColor: "#000",
  },
  navigationBar: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
  },
});

const DEFAULT_URI = "https://connectsite.lumigame.com/";

export default function () {
  const { queryParams } = Linking.parse(Linking.useURL() ?? "_blank");
  const uri = queryParams?.uri ?? DEFAULT_URI;

  return (
    <>
      <SafeAreaView style={stylesheet.statusBar} />
      <SafeAreaView style={stylesheet.navigationBar}>
        <View style={stylesheet.container}>
          <StatusBar hidden={true} />
          <WebView source={{ uri }} setSupportMultipleWindows={false} />
        </View>
      </SafeAreaView>
    </>
  );
}
