import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import { colors } from "../theme/colors";

export default function HomeScreen() {
	const { user, signOut } = useAuth();

	return (
		<SafeAreaView style={styles.safe}>
			<View style={styles.container}>
				<Text style={styles.title}>Home</Text>
				<Text style={styles.subtitle}>{user?.email}</Text>

				<TouchableOpacity style={styles.button} onPress={signOut}>
					<Text style={styles.buttonText}>Sign out</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: {
		flex: 1,
		backgroundColor: colors.background,
	},
	container: {
		flex: 1,
		padding: 24,
		gap: 16,
	},
	title: {
		fontSize: 28,
		fontWeight: "700",
		color: colors.textPrimary,
	},
	subtitle: {
		fontSize: 16,
		color: colors.textSecondary,
	},
	button: {
		backgroundColor: colors.surface,
		borderRadius: 12,
		paddingVertical: 14,
		paddingHorizontal: 16,
		borderWidth: 1,
		borderColor: colors.border,
		alignItems: "center",
	},
	buttonText: {
		color: colors.textPrimary,
		fontSize: 16,
	},
});
