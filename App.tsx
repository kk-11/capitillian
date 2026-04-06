import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PremiumProvider } from "./src/contexts/PremiumContext";
import GameScreen from "./src/screens/GameScreen";
import { colors } from "./src/theme/colors";

const Stack = createNativeStackNavigator();

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
    primary: colors.primary,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PremiumProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer theme={theme}>
            <Stack.Navigator>
              <Stack.Screen name="Game" component={GameScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
          </NavigationContainer>
        </GestureHandlerRootView>
      </PremiumProvider>
    </SafeAreaProvider>
  );
}
