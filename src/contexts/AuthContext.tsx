import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../services/supabase";

type AuthContextValue = {
	session: Session | null;
	user: User | null;
	initializing: boolean;
	isAuthenticated: boolean;
	isPremium: boolean;
	displayName: string | null;
	getSession: () => Promise<Session | null>;
	refreshSession: () => Promise<void>;
	updateProfile: (updates: { displayName?: string }) => Promise<void>;
	signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [session, setSession] = useState<Session | null>(null);
	const [initializing, setInitializing] = useState(true);
	const [isPremium, setIsPremium] = useState(true);
	const [displayName, setDisplayName] = useState<string | null>(null);

	const refreshProfile = async (targetSession?: Session | null) => {
		const s = targetSession ?? session;
		const userId = s?.user?.id;
		if (!userId) {
			setIsPremium(true);
			setDisplayName(null);
			return;
		}

		try {
			const { data, error } = await supabase
				.from("user_profiles")
				.select("display_name, is_premium")
				.eq("id", userId)
				.single();

			if (error) {
				setIsPremium(false);
				setDisplayName(null);
				return;
			}

			setIsPremium(data?.is_premium === true);
			setDisplayName(typeof data?.display_name === "string" ? data.display_name : null);
		} catch {
			setIsPremium(false);
			setDisplayName(null);
		}
	};

	const updateProfile = async (updates: { displayName?: string }) => {
		if (!session?.user?.id) return;

		const updateData: Record<string, unknown> = {};
		if (updates.displayName !== undefined) {
			updateData.display_name = updates.displayName;
		}

		const { error } = await supabase
			.from("user_profiles")
			.upsert({ id: session.user.id, ...updateData }, { onConflict: "id" });

		if (error) throw error;

		await refreshProfile();
	};

	useEffect(() => {
		let mounted = true;

		const bootstrap = async () => {
			try {
				const {
					data: { session },
				} = await supabase.auth.getSession();
				if (!mounted) return;
				setSession(session ?? null);
				await refreshProfile(session ?? null);
			} finally {
				if (mounted) setInitializing(false);
			}
		};

		bootstrap();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, nextSession) => {
			setSession(nextSession ?? null);
			refreshProfile(nextSession ?? null);
			setInitializing(false);
		});

		return () => {
			mounted = false;
			subscription.unsubscribe();
		};
	}, []);

	const value = useMemo<AuthContextValue>(
		() => ({
			session,
			user: session?.user ?? null,
			initializing,
			isAuthenticated: !!session,
			isPremium,
			displayName,
			getSession: async () => {
				const {
					data: { session },
				} = await supabase.auth.getSession();
				return session ?? null;
			},
			refreshSession: async () => {
				const {
					data: { session },
				} = await supabase.auth.getSession();
				setSession(session ?? null);
				await refreshProfile(session ?? null);
			},
			updateProfile,
			signOut: async () => {
				await supabase.auth.signOut();
			},
		}),
		[initializing, session, isPremium, displayName],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return ctx;
}
