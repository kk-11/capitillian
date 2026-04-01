import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

export const supabaseUrl =
	process.env.EXPO_PUBLIC_SUPABASE_URL ?? Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
	process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!supabaseConfigured) {
	console.error("Missing Supabase credentials. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.");
}

export const supabase = createClient(supabaseUrl ?? "https://placeholder.supabase.co", supabaseAnonKey ?? "placeholder", {
	auth: {
		storage: AsyncStorage,
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
	},
});
