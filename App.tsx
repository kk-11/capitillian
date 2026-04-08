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

	// Adds more context data to events (IP address, cookies, user, etc.)
	// For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
	sendDefaultPii: true,

	// Enable Logs
	enableLogs: true,

	// Configure Session Replay
	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1,
	integrations: [Sentry.mobileReplayIntegration()],

	// uncomment the line below to enable Spotlight (https://spotlightjs.com)
	// spotlight: __DEV__,
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
