import { store } from "@/reduxFolder/store";
import { Stack } from "expo-router";
import { Provider } from "react-redux";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="message" />
        <Stack.Screen name="myProfile" />
        <Stack.Screen name="searchUser" />
        <Stack.Screen name="cameraScreen" />
        <Stack.Screen name="otherProfile" />
      </Stack>
    </Provider>
  );
}