import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

// ---------------------------------------------------------------------------
// Feature list
// ---------------------------------------------------------------------------

const FEATURES = [
  { icon: "∞",  label: "Unlimited daily games" },
  { icon: "↺",  label: "Unlimited practice sessions" },
  { icon: "◉",  label: "Learning mode — study without timer pressure" },
  { icon: "◈",  label: "Game settings — filter by continent & difficulty" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface PremiumDialogProps {
  visible: boolean;
  onPurchase: () => void;
  onDismiss: () => void;
  onRestore: () => void;
}

export default function PremiumDialog({ visible, onPurchase, onDismiss, onRestore }: PremiumDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.card}>

          <Text style={styles.eyebrow}>UNLOCK THE FULL GAME</Text>
          <Text style={styles.title}>Go Premium</Text>
          <Text style={styles.price}>€5 · one-time purchase</Text>

          <View style={styles.divider} />

          <View style={styles.features}>
            {FEATURES.map((f) => (
              <View key={f.label} style={styles.featureRow}>
                <Text style={styles.featureIcon}>{f.icon}</Text>
                <Text style={styles.featureLabel}>{f.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.buyButton} onPress={onPurchase} activeOpacity={0.85}>
            <Text style={styles.buyText}>Unlock for €5</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dismissButton} onPress={onDismiss} activeOpacity={0.7}>
            <Text style={styles.dismissText}>Maybe Later</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.restoreButton} onPress={onRestore} activeOpacity={0.7}>
            <Text style={styles.restoreText}>Restore Purchase</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.88)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    backgroundColor: "#0A1628",
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: "#1565C0",
    gap: 16,
    alignItems: "center",
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.8,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: -4,
  },
  price: {
    fontSize: 15,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    marginTop: -8,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  features: {
    width: "100%",
    gap: 14,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  featureIcon: {
    fontSize: 18,
    color: "#42A8E8",
    width: 24,
    textAlign: "center",
  },
  featureLabel: {
    flex: 1,
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 21,
  },
  buyButton: {
    width: "100%",
    backgroundColor: "#E53935",
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: "center",
  },
  buyText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  dismissButton: {
    paddingVertical: 4,
  },
  dismissText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.45)",
  },
  restoreButton: {
    paddingVertical: 4,
  },
  restoreText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.3)",
  },
});
