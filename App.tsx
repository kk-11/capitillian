import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PremiumProvider } from "./src/contexts/PremiumContext";
import GameScreen from "./src/screens/GameScreen";
import { colors } from "./src/theme/colors";
import * as Sentry from "@sentry/react-native";

Sentry.init({
	dsn: "https://2f68940467d07195dd4c012c047c2bd0@o4511186084560896.ingest.de.sentry.io/4511186085085264",
	enabled: true,
	sendDefaultPii: true,
	enableLogs: true,
	replaysSessionSampleRate: 0,
	replaysOnErrorSampleRate: 0,
});

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

export default Sentry.wrap(function App() {
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
});
