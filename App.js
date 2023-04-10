import * as Linking from "expo-linking";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import * as Clipboard from 'expo-clipboard';

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

const DEFAULT_URI = "https://l1sitconnectsite.sgamesuat.com/";

const copyToClipBoard = async (message) => {
  await Clipboard.setStringAsync(message);
}

const handleMessage = (event) => {
  try{
    const eventData = JSON.parse(event.nativeEvent.data);
    if(eventData.eventType === 'copy_to_clipboard'){
      copyToClipBoard(eventData.data);
    }
  }
  catch  {}
}


export default function () {
  const { queryParams } = Linking.parse(Linking.useURL() ?? "_blank");
  const uri = queryParams?.uri ?? DEFAULT_URI;

  return (
    <>
      <SafeAreaView style={stylesheet.statusBar} />
      <SafeAreaView style={stylesheet.navigationBar}>
        <View style={stylesheet.container}>
          <StatusBar hidden={true} />
          <WebView source={{ uri }} setSupportMultipleWindows={false} onMessage={handleMessage} />
        </View>
      </SafeAreaView>
    </>
  );
}
