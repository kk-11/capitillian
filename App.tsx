import { Text, View } from "react-native";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { supabaseConfigured } from "./src/services/supabase";
import AuthScreen from "./src/screens/AuthScreen";
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

function AppInner() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<NavigationContainer theme={theme}>
				<Stack.Navigator>
					<Stack.Screen name="Game" component={GameScreen} options={{ headerShown: false }} />
					<Stack.Screen
						name="Auth"
						component={AuthScreen}
						options={{ presentation: "modal", headerShown: false }}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</GestureHandlerRootView>
	);
}

export default function App() {
	if (!supabaseConfigured) {
		return (
			<View
				style={{ flex: 1, backgroundColor: "#0a0a0a", justifyContent: "center", alignItems: "center", padding: 20 }}
			>
				<Text style={{ color: colors.error, fontSize: 16, textAlign: "center" }}>
					Missing Supabase environment variables.{"\n"}Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to
					your .env.local file.
				</Text>
			</View>
		);
	}

	return (
		<SafeAreaProvider>
			<AuthProvider>
				<AppInner />
			</AuthProvider>
		</SafeAreaProvider>
	);
}
