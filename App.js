import * as Clipboard from "expo-clipboard";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { useEffect, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { CONSTANTS, JSHmac } from "react-native-hash";
import { WebView } from "react-native-webview";

const SECRET_KEY =
  "ba76cbdbf165fe8ded976d38efc5759fecf413299394b63d234ccd88abd4375";

const stylesheet = StyleSheet.create({
  statusBar: {
    flex: 0,
    backgroundColor: "#020d1f",
  },
  navigationBar: {
    flex: 1,
    backgroundColor: "#020d1f",
  },
  container: {
    flex: 1,
    backgroundColor: "#020d1f",
  },
});

const DEFAULT_URI = "https://connect.sabagame.com/login";

const copyToClipBoard = async (message) => {
  await Clipboard.setStringAsync(message);
};

const handleMessage = (event) => {
  try {
    const eventData = JSON.parse(event.nativeEvent.data);
    if (eventData.eventType === "copy_to_clipboard") {
      copyToClipBoard(eventData.data);
    }
  } catch {}
};

export default function () {
  const { queryParams } = Linking.parse(Linking.useURL() ?? "_blank");
  const [token, setToken] = useState("");
  const [userAgent, setUserAgent] = useState("");
  const [rerender, setRerender] = useState(true);
  const uri = queryParams?.uri ?? DEFAULT_URI;

  const generateToken = async () => {
    const userAgent = (await Constants.getWebViewUserAgentAsync()).replace(
      "Android",
      "Androidwv"
    );
    setUserAgent(userAgent);

    const token = await JSHmac(
      userAgent,
      SECRET_KEY,
      CONSTANTS.HmacAlgorithms.HmacSHA256
    );

    setToken(token);
  };

  const forceRerender = () => {
    setRerender(!rerender);
  };

  useEffect(() => {
    generateToken();
  }, []);

  return (
    <>
      <SafeAreaView style={stylesheet.statusBar} />
      <SafeAreaView style={stylesheet.navigationBar}>
        <View style={stylesheet.container}>
          <StatusBar hidden={true} />
          {token && (
            <WebView
              source={{
                uri,
                headers: {
                  Authorization: `${token}`,
                  Rerender: rerender.toString(),
                },
              }}
              userAgent={userAgent}
              setSupportMultipleWindows={false}
              onMessage={handleMessage}
              onShouldStartLoadWithRequest={(request) => {
                if (!request.url.includes("relogin")) return true;
                forceRerender();
                return false;
              }}
              style={{ backgroundColor: "transparent" }}
              renderLoading={() => (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "space-between",
                  }}
                >
                  <ActivityIndicator size="large" color="#ffff" />
                </View>
              )}
              startInLoadingState
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
}
