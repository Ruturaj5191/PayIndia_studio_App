import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    BackHandler,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function TwoStepVerificationScreen() {
    const router = useRouter();
    const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
    const [phoneNumber] = useState("+91 9XXXX XXXXX");

    // Handle hardware back button
    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                router.push("/security");
                return true;
            };

            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                backAction
            );

            return () => backHandler.remove();
        }, [router])
    );

    const handleToggle = () => {
        setIsTwoFactorEnabled(!isTwoFactorEnabled);
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
                        onPress={() => router.push("/security")}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Two-Step Verification</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        {/* Enable Toggle Card */}
                        <View style={styles.toggleCard}>
                            <View style={styles.cardLeft}>
                                <View style={styles.iconCircle}>
                                    <MaterialCommunityIcons
                                        name="shield-check"
                                        size={28}
                                        color="#4CAF50"
                                    />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.cardTitle}>Enable OTP Verification</Text>
                                    <Text style={styles.cardSubtext}>
                                        An OTP will be sent on login for extra security
                                    </Text>
                                </View>
                            </View>
                            {/* Toggle Switch */}
                            <TouchableOpacity
                                style={styles.toggleSwitch}
                                onPress={handleToggle}
                                activeOpacity={0.7}
                            >
                                <View
                                    style={[
                                        styles.toggleTrack,
                                        {
                                            backgroundColor: isTwoFactorEnabled ? "#4CAF50" : "#E0E0E0",
                                        },
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.toggleThumb,
                                            {
                                                alignSelf: isTwoFactorEnabled ? "flex-end" : "flex-start",
                                            },
                                        ]}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Phone Number Card - Only show if enabled */}
                        {isTwoFactorEnabled && (
                            <View style={styles.phoneCard}>
                                <View style={styles.phoneHeader}>
                                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                                    <Text style={styles.verifiedText}>Verified Mobile Number</Text>
                                </View>

                                <View style={styles.phoneNumberRow}>
                                    <View style={styles.phoneIconCircle}>
                                        <Ionicons name="phone-portrait" size={20} color="#2196F3" />
                                    </View>
                                    <Text style={styles.phoneNumber}>{phoneNumber}</Text>
                                </View>

                                <TouchableOpacity style={styles.changeNumberButton}>
                                    <Text style={styles.changeNumberText}>Change Number</Text>
                                    <Ionicons name="chevron-forward" size={16} color="#2196F3" />
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Info Card */}
                        <View style={styles.infoCard}>
                            <Ionicons name="information-circle" size={20} color="#2196F3" />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoTitle}>How it works:</Text>
                                <Text style={styles.infoText}>
                                    • You'll receive an OTP via SMS when logging in{"\n"}
                                    • Enter the OTP to verify it's you{"\n"}
                                    • Adds an extra layer of security to your account
                                </Text>
                            </View>
                        </View>

                        {/* Benefits Card */}
                        <View style={styles.benefitsCard}>
                            <Text style={styles.benefitsTitle}>🛡️ Why enable 2-Step Verification?</Text>

                            <View style={styles.benefitItem}>
                                <View style={styles.benefitIcon}>
                                    <Ionicons name="shield-checkmark" size={18} color="#4CAF50" />
                                </View>
                                <Text style={styles.benefitText}>
                                    Protects your account even if someone knows your PIN
                                </Text>
                            </View>

                            <View style={styles.benefitItem}>
                                <View style={styles.benefitIcon}>
                                    <Ionicons name="lock-closed" size={18} color="#4CAF50" />
                                </View>
                                <Text style={styles.benefitText}>
                                    Prevents unauthorized access to your account
                                </Text>
                            </View>

                            <View style={styles.benefitItem}>
                                <View style={styles.benefitIcon}>
                                    <Ionicons name="notifications" size={18} color="#4CAF50" />
                                </View>
                                <Text style={styles.benefitText}>
                                    Get instant alerts for any login attempts
                                </Text>
                            </View>
                        </View>
                    </View>
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
        paddingTop: 30,
        paddingBottom: 15,
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

    content: {
        padding: 20,
    },

    toggleCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },

    cardLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        gap: 12,
    },

    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#E8F5E9",
        justifyContent: "center",
        alignItems: "center",
    },

    textContainer: {
        flex: 1,
    },

    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 4,
    },

    cardSubtext: {
        fontSize: 13,
        color: "#666",
        lineHeight: 18,
    },

    toggleSwitch: {
        marginLeft: 10,
    },

    toggleTrack: {
        width: 50,
        height: 30,
        borderRadius: 15,
        justifyContent: "center",
        paddingHorizontal: 3,
    },

    toggleThumb: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
    },

    phoneCard: {
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },

    phoneHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 12,
    },

    verifiedText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#4CAF50",
    },

    phoneNumberRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 12,
    },

    phoneIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#E3F2FD",
        justifyContent: "center",
        alignItems: "center",
    },

    phoneNumber: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1A1A1A",
    },

    changeNumberButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        alignSelf: "flex-start",
    },

    changeNumberText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#2196F3",
    },

    infoCard: {
        flexDirection: "row",
        backgroundColor: "#E3F2FD",
        padding: 16,
        borderRadius: 16,
        gap: 12,
        borderWidth: 1,
        borderColor: "#BBDEFB",
        marginBottom: 16,
    },

    infoTextContainer: {
        flex: 1,
    },

    infoTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#0D47A1",
        marginBottom: 8,
    },

    infoText: {
        fontSize: 13,
        color: "#0D47A1",
        lineHeight: 20,
    },

    benefitsCard: {
        backgroundColor: "#FFFFFF",
        padding: 16,
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
        alignItems: "flex-start",
        gap: 12,
        marginBottom: 12,
    },

    benefitIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#E8F5E9",
        justifyContent: "center",
        alignItems: "center",
    },

    benefitText: {
        flex: 1,
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
    },
});