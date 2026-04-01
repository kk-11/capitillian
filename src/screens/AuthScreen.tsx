import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	ActivityIndicator,
	Alert,
	StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../services/supabase";
import { colors } from "../theme/colors";

interface AuthScreenProps {
	onAuthSuccess: () => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [loading, setLoading] = useState(false);
	const [otpSent, setOtpSent] = useState(false);
	const [cooldown, setCooldown] = useState(0);

	const handleSendOtp = async () => {
		if (!email) {
			Alert.alert("Error", "Please enter your email address.");
			return;
		}

		if (cooldown > 0) {
			Alert.alert("Please wait", `Try again in ${cooldown} seconds.`);
			return;
		}

		setLoading(true);

		try {
			const { error } = await supabase.auth.signInWithOtp({
				email,
				options: { shouldCreateUser: true },
			});

			if (error) {
				if (error.message?.includes("email_send_rate_limit")) {
					throw new Error("Too many requests. Please wait 60 seconds and try again.");
				}
				throw error;
			}

			setOtpSent(true);
			setCooldown(60);

			const interval = setInterval(() => {
				setCooldown((prev) => {
					if (prev <= 1) {
						clearInterval(interval);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);

			Alert.alert("Code sent", `Check your email at ${email}.`);
		} catch (error: any) {
			Alert.alert("Error", error.message || "Something went wrong.");
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyOtp = async () => {
		if (!otp || otp.length !== 6) {
			Alert.alert("Error", "Please enter the 6-digit code.");
			return;
		}

		setLoading(true);

		try {
			const { error } = await supabase.auth.verifyOtp({
				email,
				token: otp,
				type: "email",
			});

			if (error) throw error;

			onAuthSuccess();
		} catch (error: any) {
			Alert.alert("Invalid code", error.message || "Please check your code and try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.safe}>
			<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
				<View style={styles.content}>
					<Text style={styles.title}>Capitillian</Text>
					<Text style={styles.subtitle}>{otpSent ? "Enter your code" : "Sign in to continue"}</Text>

					{!otpSent ? (
						<>
							<TextInput
								style={styles.input}
								placeholder="Email address"
								placeholderTextColor={colors.textSecondary}
								value={email}
								onChangeText={setEmail}
								autoCapitalize="none"
								autoCorrect={false}
								autoComplete="email"
								keyboardType="email-address"
								editable={!loading}
								autoFocus
								returnKeyType="send"
								onSubmitEditing={handleSendOtp}
							/>

							<TouchableOpacity
								style={[styles.button, (loading || cooldown > 0) && styles.buttonDisabled]}
								onPress={handleSendOtp}
								disabled={loading || cooldown > 0}
							>
								{loading ? (
									<ActivityIndicator color="#000" />
								) : cooldown > 0 ? (
									<Text style={styles.buttonText}>Wait {cooldown}s</Text>
								) : (
									<Text style={styles.buttonText}>Send code</Text>
								)}
							</TouchableOpacity>

							<Text style={styles.helperText}>No password needed — we'll email you a code.</Text>
						</>
					) : (
						<>
							<Text style={styles.helperText}>Code sent to {email}</Text>

							<TextInput
								style={[styles.input, styles.otpInput]}
								placeholder="000000"
								placeholderTextColor={colors.textSecondary}
								value={otp}
								onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ""))}
								keyboardType="number-pad"
								maxLength={6}
								autoFocus
								editable={!loading}
								returnKeyType="done"
								onSubmitEditing={handleVerifyOtp}
							/>

							<TouchableOpacity
								style={[styles.button, (loading || otp.length !== 6) && styles.buttonDisabled]}
								onPress={handleVerifyOtp}
								disabled={loading || otp.length !== 6}
							>
								{loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Verify</Text>}
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.linkButton}
								onPress={() => {
									setOtpSent(false);
									setOtp("");
								}}
								disabled={cooldown > 0}
							>
								<Text style={[styles.linkText, cooldown > 0 && styles.linkTextDisabled]}>
									{cooldown > 0 ? `Use different email (${cooldown}s)` : "Use different email"}
								</Text>
							</TouchableOpacity>
						</>
					)}
				</View>
			</KeyboardAvoidingView>
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
	},
	content: {
		flex: 1,
		justifyContent: "center",
		paddingHorizontal: 32,
		gap: 16,
	},
	title: {
		fontSize: 32,
		fontWeight: "700",
		color: colors.textPrimary,
		marginBottom: 4,
	},
	subtitle: {
		fontSize: 18,
		color: colors.textSecondary,
		marginBottom: 16,
	},
	input: {
		backgroundColor: colors.surface,
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 14,
		fontSize: 16,
		color: colors.textPrimary,
		borderWidth: 1,
		borderColor: colors.border,
	},
	otpInput: {
		fontSize: 28,
		letterSpacing: 12,
		textAlign: "center",
	},
	button: {
		backgroundColor: colors.primary,
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: "center",
	},
	buttonDisabled: {
		opacity: 0.4,
	},
	buttonText: {
		color: "#000",
		fontSize: 16,
		fontWeight: "600",
	},
	helperText: {
		color: colors.textSecondary,
		fontSize: 14,
		textAlign: "center",
	},
	linkButton: {
		alignItems: "center",
		paddingVertical: 8,
	},
	linkText: {
		color: colors.textSecondary,
		fontSize: 14,
		textDecorationLine: "underline",
	},
	linkTextDisabled: {
		opacity: 0.5,
	},
});
