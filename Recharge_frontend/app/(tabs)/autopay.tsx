import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    Alert,
    BackHandler,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function AutopayScreen() {
    const router = useRouter();

    // Handle hardware back button - go to account screen
    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                router.push("/account");
                return true;
            };

            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                backAction,
            );

            return () => backHandler.remove();
        }, [router]),
    );

    // Sample autopay data - Change hasAutopay to false to see empty state
    const [hasAutopay, setHasAutopay] = useState(true);
    const [autopayList, setAutopayList] = useState([
        {
            id: 1,
            type: "Mobile Recharge",
            amount: 299,
            frequency: "Every 28 days",
            nextPayment: "15 March 2026",
            icon: "phone-portrait",
            color: "#4CAF50",
            isPaused: false,
        },
        {
            id: 2,
            type: "DTH Recharge",
            amount: 599,
            frequency: "Every 30 days",
            nextPayment: "20 March 2026",
            icon: "tv",
            color: "#FF9800",
            isPaused: false,
        },
    ]);

    const handlePauseAutopay = (id: number) => {
        setAutopayList(
            autopayList.map((item) =>
                item.id === id ? { ...item, isPaused: !item.isPaused } : item,
            ),
        );
    };

    const handleCancelAutopay = (id: number, type: string) => {
        Alert.alert(
            "Cancel Autopay?",
            `Are you sure you want to cancel autopay for ${type}?`,
            [
                { text: "No", style: "cancel" },
                {
                    text: "Yes, Cancel",
                    style: "destructive",
                    onPress: () => {
                        setAutopayList(autopayList.filter((item) => item.id !== id));
                        if (autopayList.length === 1) {
                            setHasAutopay(false);
                        }
                        Alert.alert("Success", `Autopay cancelled for ${type}`);
                    },
                },
            ],
        );
    };

    const handleSetupAutopay = () => {
        router.push("/setup-autopay");
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.push("/account")}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Autopay</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {hasAutopay && autopayList.length > 0 ? (
                        /* Active Autopay View */
                        <View style={styles.content}>
                            {/* Active Autopay Cards */}
                            <View style={styles.autopaySection}>
                                {autopayList.map((autopay) => (
                                    <View key={autopay.id} style={styles.autopayCard}>
                                        <LinearGradient
                                            colors={
                                                autopay.isPaused
                                                    ? ["#F5F5F5", "#E0E0E0"]
                                                    : ["#E8F5E9", "#C8E6C9"]
                                            }
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.autopayGradient}
                                        >
                                            {/* Header Row */}
                                            <View style={styles.cardHeader}>
                                                <View style={styles.iconCircle}>
                                                    <Ionicons
                                                        name={autopay.icon as any}
                                                        size={24}
                                                        color={autopay.isPaused ? "#999" : autopay.color}
                                                    />
                                                </View>

                                                {autopay.isPaused && (
                                                    <View style={styles.pausedBadge}>
                                                        <Ionicons
                                                            name="pause-circle"
                                                            size={16}
                                                            color="#FF9800"
                                                        />
                                                        <Text style={styles.pausedText}>Paused</Text>
                                                    </View>
                                                )}
                                            </View>

                                            {/* Autopay Details */}
                                            <Text
                                                style={[
                                                    styles.autopayType,
                                                    autopay.isPaused && styles.mutedText,
                                                ]}
                                            >
                                                {autopay.type}
                                            </Text>

                                            <View style={styles.amountRow}>
                                                <Text
                                                    style={[
                                                        styles.autopayAmount,
                                                        autopay.isPaused && styles.mutedText,
                                                    ]}
                                                >
                                                    ₹{autopay.amount}
                                                </Text>
                                                <Text
                                                    style={[
                                                        styles.frequency,
                                                        autopay.isPaused && styles.mutedText,
                                                    ]}
                                                >
                                                    {autopay.frequency}
                                                </Text>
                                            </View>

                                            {/* Next Payment */}
                                            <View style={styles.nextPaymentRow}>
                                                <Ionicons
                                                    name="calendar-outline"
                                                    size={16}
                                                    color={autopay.isPaused ? "#999" : "#4CAF50"}
                                                />
                                                <Text
                                                    style={[
                                                        styles.nextPaymentText,
                                                        autopay.isPaused && styles.mutedText,
                                                    ]}
                                                >
                                                    Next Payment: {autopay.nextPayment}
                                                </Text>
                                            </View>

                                            {/* Action Buttons */}
                                            <View style={styles.actionButtons}>
                                                <TouchableOpacity
                                                    style={[
                                                        styles.pauseButton,
                                                        autopay.isPaused && styles.resumeButton,
                                                    ]}
                                                    onPress={() => handlePauseAutopay(autopay.id)}
                                                >
                                                    <Ionicons
                                                        name={autopay.isPaused ? "play" : "pause"}
                                                        size={16}
                                                        color={autopay.isPaused ? "#4CAF50" : "#FF9800"}
                                                    />
                                                    <Text
                                                        style={[
                                                            styles.pauseButtonText,
                                                            autopay.isPaused && styles.resumeButtonText,
                                                        ]}
                                                    >
                                                        {autopay.isPaused ? "Resume" : "Pause"}
                                                    </Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={styles.cancelButton}
                                                    onPress={() =>
                                                        handleCancelAutopay(autopay.id, autopay.type)
                                                    }
                                                >
                                                    <Ionicons
                                                        name="close-circle"
                                                        size={16}
                                                        color="#E53935"
                                                    />
                                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </LinearGradient>
                                    </View>
                                ))}
                            </View>

                            {/* Setup New Autopay Button */}
                            <View style={styles.setupButtonContainer}>
                                <TouchableOpacity
                                    style={styles.setupButton}
                                    onPress={handleSetupAutopay}
                                >
                                    <Ionicons name="add-circle" size={24} color="#FFFFFF" />
                                    <Text style={styles.setupButtonText}>Setup New Autopay</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Info Card */}
                            <View style={styles.infoCard}>
                                <Ionicons name="information-circle" size={20} color="#2196F3" />
                                <Text style={styles.infoText}>
                                    Autopay ensures you never miss a recharge. Payments are
                                    automatically processed on the scheduled date.
                                </Text>
                            </View>
                        </View>
                    ) : (
                        /* Empty State View */
                        <View style={styles.emptyStateContainer}>
                            {/* Illustration */}
                            <View style={styles.illustrationContainer}>
                                <View style={styles.illustrationCircle}>
                                    <MaterialCommunityIcons
                                        name="calendar-sync-outline"
                                        size={80}
                                        color="#BBDEFB"
                                    />
                                </View>
                            </View>

                            {/* Empty State Text */}
                            <Text style={styles.emptyTitle}>No active autopay found</Text>
                            <Text style={styles.emptySubtext}>
                                Never miss a recharge again
                            </Text>
                            <Text style={styles.emptyDescription}>
                                Set up autopay to automatically recharge your services on time,
                                every time.
                            </Text>

                            {/* Setup Autopay Button */}
                            <TouchableOpacity
                                style={styles.emptySetupButton}
                                onPress={handleSetupAutopay}
                            >
                                <Ionicons name="add-circle" size={24} color="#FFFFFF" />
                                <Text style={styles.emptySetupButtonText}>Setup Autopay</Text>
                            </TouchableOpacity>

                            {/* Benefits */}
                            <View style={styles.benefitsContainer}>
                                <Text style={styles.benefitsTitle}>Benefits of Autopay:</Text>

                                <View style={styles.benefitItem}>
                                    <View style={styles.benefitIconCircle}>
                                        <Ionicons name="checkmark" size={18} color="#4CAF50" />
                                    </View>
                                    <Text style={styles.benefitText}>
                                        Never miss a recharge deadline
                                    </Text>
                                </View>

                                <View style={styles.benefitItem}>
                                    <View style={styles.benefitIconCircle}>
                                        <Ionicons name="checkmark" size={18} color="#4CAF50" />
                                    </View>
                                    <Text style={styles.benefitText}>
                                        Save time with automatic payments
                                    </Text>
                                </View>

                                <View style={styles.benefitItem}>
                                    <View style={styles.benefitIconCircle}>
                                        <Ionicons name="checkmark" size={18} color="#4CAF50" />
                                    </View>
                                    <Text style={styles.benefitText}>
                                        Pause or cancel anytime you want
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1A1A1A",
    },
    placeholder: {
        width: 34,
    },

    // Active Autopay View
    content: {
        padding: 20,
    },

    autopaySection: {
        marginBottom: 20,
    },

    autopayCard: {
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },

    autopayGradient: {
        padding: 16,
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },

    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        justifyContent: "center",
        alignItems: "center",
    },

    pausedBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "#FFF3E0",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },

    pausedText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#FF9800",
    },

    autopayType: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1A1A1A",
        marginBottom: 8,
    },

    amountRow: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 8,
        marginBottom: 8,
    },

    autopayAmount: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#4CAF50",
    },

    frequency: {
        fontSize: 14,
        color: "#666",
    },

    nextPaymentRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 16,
    },

    nextPaymentText: {
        fontSize: 14,
        color: "#4CAF50",
        fontWeight: "500",
    },

    mutedText: {
        color: "#999",
    },

    actionButtons: {
        flexDirection: "row",
        gap: 10,
    },

    pauseButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        backgroundColor: "#FFF3E0",
        paddingVertical: 10,
        borderRadius: 12,
    },

    pauseButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#FF9800",
    },

    resumeButton: {
        backgroundColor: "#E8F5E9",
    },

    resumeButtonText: {
        color: "#4CAF50",
    },

    cancelButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        backgroundColor: "#FFEBEE",
        paddingVertical: 10,
        borderRadius: 12,
    },

    cancelButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#E53935",
    },

    setupButtonContainer: {
        marginBottom: 20,
    },

    setupButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#4CAF50",
        paddingVertical: 16,
        borderRadius: 25,
        gap: 10,
        shadowColor: "#4CAF50",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },

    setupButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
    },

    infoCard: {
        flexDirection: "row",
        backgroundColor: "#E3F2FD",
        padding: 16,
        borderRadius: 16,
        gap: 12,
        borderWidth: 1,
        borderColor: "#BBDEFB",
    },

    infoText: {
        flex: 1,
        fontSize: 13,
        color: "#0D47A1",
        lineHeight: 18,
    },

    // Empty State
    emptyStateContainer: {
        flex: 1,
        alignItems: "center",
        padding: 40,
    },

    illustrationContainer: {
        marginBottom: 30,
        marginTop: 40,
    },

    illustrationCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: "#E3F2FD",
        justifyContent: "center",
        alignItems: "center",
    },

    emptyTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#1A1A1A",
        marginBottom: 8,
        textAlign: "center",
    },

    emptySubtext: {
        fontSize: 16,
        color: "#666",
        marginBottom: 12,
        textAlign: "center",
    },

    emptyDescription: {
        fontSize: 14,
        color: "#999",
        textAlign: "center",
        lineHeight: 20,
        marginBottom: 32,
        paddingHorizontal: 20,
    },

    emptySetupButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#4CAF50",
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 25,
        gap: 10,
        shadowColor: "#4CAF50",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        marginBottom: 40,
    },

    emptySetupButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
    },

    benefitsContainer: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        padding: 20,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },

    benefitsTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 16,
    },

    benefitItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 12,
    },

    benefitIconCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#E8F5E9",
        justifyContent: "center",
        alignItems: "center",
    },

    benefitText: {
        flex: 1,
        fontSize: 14,
        color: "#666",
    },
});
