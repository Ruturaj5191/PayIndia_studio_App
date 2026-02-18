import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
    Alert,
    BackHandler,
    Linking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function HelpSupportScreen() {
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
                backAction
            );

            return () => backHandler.remove();
        }, [router])
    );

    const handleBackPress = () => {
        router.push("/account");
    };

    // Handle Chat Support
    const handleChatSupport = () => {
        Alert.alert("Chat Support", "Opening live chat...");
        // In real app, open chat widget or WhatsApp
        // Linking.openURL('https://wa.me/9923400442');
    };

    // Handle Call Support
    const handleCallSupport = () => {
        Alert.alert(
            "Call Support",
            "Call our support team?\n\n📞 1800-123-4567\n\n⏰ 9 AM – 7 PM (Mon-Sat)",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Call Now",
                    onPress: () => Linking.openURL("tel:18001234567"),
                },
            ],
        );
    };

    // Handle Email Support
    const handleEmailSupport = () => {
        Linking.openURL("mailto:support@onlrecharge.com?subject=Support Request");
    };

    // Handle FAQs
    const handleFAQs = () => {
        Alert.alert("FAQs", "Opening frequently asked questions...");
        // In real app, navigate to FAQs screen
        // router.push('/faqs');
    };

    // Handle Raise Ticket
    const handleRaiseTicket = () => {
        Alert.alert("Raise a Ticket", "Opening ticket form...");
        // In real app, navigate to ticket form screen
        // router.push('/raise-ticket');
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
                        onPress={handleBackPress}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Help & Support</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Support Options */}
                    <View style={styles.section}>
                        {/* Chat Support */}
                        <TouchableOpacity
                            style={styles.supportCard}
                            onPress={handleChatSupport}
                        >
                            <View style={styles.supportLeft}>
                                <View
                                    style={[styles.iconCircle, { backgroundColor: "#E3F2FD" }]}
                                >
                                    <Ionicons name="chatbubbles" size={24} color="#2196F3" />
                                </View>
                                <View style={styles.supportInfo}>
                                    <Text style={styles.supportTitle}>Chat Support</Text>
                                    <Text style={styles.supportSubtext}>
                                        Instant live support
                                    </Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>

                        {/* Call Support */}
                        <TouchableOpacity
                            style={styles.supportCard}
                            onPress={handleCallSupport}
                        >
                            <View style={styles.supportLeft}>
                                <View
                                    style={[styles.iconCircle, { backgroundColor: "#E8F5E9" }]}
                                >
                                    <Ionicons name="call" size={24} color="#4CAF50" />
                                </View>
                                <View style={styles.supportInfo}>
                                    <Text style={styles.supportTitle}>Call Support</Text>
                                    <Text style={styles.supportSubtext}>
                                        9 AM – 7 PM (Mon-Sat)
                                    </Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>

                        {/* Email Support */}
                        <TouchableOpacity
                            style={styles.supportCard}
                            onPress={handleEmailSupport}
                        >
                            <View style={styles.supportLeft}>
                                <View
                                    style={[styles.iconCircle, { backgroundColor: "#FFF3E0" }]}
                                >
                                    <Ionicons name="mail" size={24} color="#FF9800" />
                                </View>
                                <View style={styles.supportInfo}>
                                    <Text style={styles.supportTitle}>Email Support</Text>
                                    <Text style={styles.supportSubtext}>
                                        support@payindia.com
                                    </Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>

                        {/* FAQs */}
                        <TouchableOpacity style={styles.supportCard} onPress={handleFAQs}>
                            <View style={styles.supportLeft}>
                                <View
                                    style={[styles.iconCircle, { backgroundColor: "#F3E5F5" }]}
                                >
                                    <Ionicons name="help-circle" size={24} color="#9C27B0" />
                                </View>
                                <View style={styles.supportInfo}>
                                    <Text style={styles.supportTitle}>FAQs</Text>
                                    <Text style={styles.supportSubtext}>Find quick answers</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>

                        {/* Raise a Ticket */}
                        <TouchableOpacity
                            style={styles.supportCard}
                            onPress={handleRaiseTicket}
                        >
                            <View style={styles.supportLeft}>
                                <View
                                    style={[styles.iconCircle, { backgroundColor: "#FCE4EC" }]}
                                >
                                    <MaterialCommunityIcons
                                        name="ticket"
                                        size={24}
                                        color="#E91E63"
                                    />
                                </View>
                                <View style={styles.supportInfo}>
                                    <Text style={styles.supportTitle}>Raise a Ticket</Text>
                                    <Text style={styles.supportSubtext}>Submit your issue</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>
                    </View>

                    {/* Additional Help */}
                    <View style={styles.helpSection}>
                        <Text style={styles.helpTitle}>Need More Help?</Text>
                        <Text style={styles.helpText}>
                            Our support team is here to help you 24/7. Choose any option above
                            to get started.
                        </Text>
                    </View>

                    {/* Contact Info Card */}
                    <View style={styles.contactCard}>
                        <View style={styles.contactHeader}>
                            <Ionicons name="information-circle" size={24} color="#2196F3" />
                            <Text style={styles.contactHeaderText}>Contact Information</Text>
                        </View>
                        <View style={styles.contactDetails}>
                            <View style={styles.contactRow}>
                                <Ionicons name="call" size={16} color="#666" />
                                <Text style={styles.contactText}>
                                    1800-123-4567 (Toll Free)
                                </Text>
                            </View>
                            <View style={styles.contactRow}>
                                <Ionicons name="mail" size={16} color="#666" />
                                <Text style={styles.contactText}>support@onlrecharge.com</Text>
                            </View>
                            <View style={styles.contactRow}>
                                <Ionicons name="globe" size={16} color="#666" />
                                <Text style={styles.contactText}>www.onlrecharge.com</Text>
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
        backgroundColor: "#F5F5F5",
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
        fontSize: 20,
        fontWeight: "bold",
        color: "#1A1A1A",
    },
    placeholder: {
        width: 34,
    },

    scrollContent: {
        paddingBottom: 30,
    },

    // Support Cards Section
    section: {
        paddingHorizontal: 20,
        paddingTop: 20,
        gap: 16,
    },
    supportCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    supportLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
        flex: 1,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    supportInfo: {
        flex: 1,
    },
    supportTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 3,
    },
    supportSubtext: {
        fontSize: 13,
        color: "#666",
    },

    // Help Section
    helpSection: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 20,
    },
    helpTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1A1A1A",
        marginBottom: 10,
    },
    helpText: {
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
    },

    // Contact Card
    contactCard: {
        marginHorizontal: 20,
        backgroundColor: "#F1F8FE",
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: "#BBDEFB",
    },
    contactHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 15,
    },
    contactHeaderText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#0D47A1",
    },
    contactDetails: {
        gap: 12,
    },
    contactRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    contactText: {
        fontSize: 14,
        color: "#1A1A1A",
    },
});