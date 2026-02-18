import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
    BackHandler,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function MoreSevaScreen() {
    const router = useRouter();

    // Handle hardware back button - redirect to explore screen
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                router.push("/(tabs)/explore");
                return true;
            };

            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                onBackPress
            );

            return () => backHandler.remove();
        }, [router])
    );

    const handleBackPress = () => {
        router.push("/(tabs)/explore");
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <SafeAreaView style={styles.safeArea}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Tracking Banner */}
                    <View style={styles.trackingCard}>
                        <View style={styles.trackingContent}>
                            <Text style={styles.trackingTitle}>
                                Track your applications in{" "}
                                <Text style={styles.trackingHighlight}>real-time</Text>
                            </Text>
                            <Text style={styles.trackingSubtitle}>
                                Check the status of your Aadhaar, PAN, and other certificates
                                instantly.
                            </Text>
                            <TouchableOpacity style={styles.trackNowButton}>
                                <Text style={styles.trackNowButtonText}>Track Status</Text>
                            </TouchableOpacity>
                            <Text style={styles.trackingFootnote}>
                                *Application ID required
                            </Text>
                        </View>
                        <View style={styles.trackingIconContainer}>
                            <View style={styles.trackingIconCircle}>
                                <MaterialCommunityIcons
                                    name="file-search-outline"
                                    size={40}
                                    color="#2196F3"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Identity & Documents */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Identity & Documents</Text>
                            <View style={styles.popularBadge}>
                                <Text style={styles.popularText}>Popular</Text>
                            </View>
                        </View>

                        <View style={styles.servicesGrid}>
                            <TouchableOpacity
                                style={styles.serviceCard}
                                onPress={() => router.push("/aadhaar-services")}>
                                <View style={styles.iconCircle}>
                                    <MaterialCommunityIcons
                                        name="card-account-details"
                                        size={30}
                                        color="#0D47A1"
                                    />
                                </View>
                                <Text style={styles.serviceText}>Aadhar{"\n"}Update</Text>
                                <View style={styles.newBadge}>
                                    <Text style={styles.newBadgeText}>New</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.serviceCard}
                                onPress={() => router.push("/pan-card-services")}>
                                <View style={styles.iconCircle}>
                                    <MaterialCommunityIcons
                                        name="card-text"
                                        size={30}
                                        color="#0D47A1"
                                    />
                                </View>
                                <Text style={styles.serviceText}>Pan{"\n"}Card</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.serviceCard}>
                                <View style={styles.iconCircle}>
                                    <MaterialCommunityIcons
                                        name="card-account-mail"
                                        size={30}
                                        color="#0D47A1"
                                    />
                                </View>
                                <Text style={styles.serviceText}>Voter{"\n"}ID</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.serviceCard}>
                                <View style={styles.iconCircle}>
                                    <MaterialCommunityIcons
                                        name="book-open-page-variant"
                                        size={30}
                                        color="#0D47A1"
                                    />
                                </View>
                                <Text style={styles.serviceText}>Ration{"\n"}Card</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Certificates */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Certificates</Text>

                        <View style={styles.servicesGrid}>
                            <TouchableOpacity
                                style={styles.serviceCard}
                                onPress={() => router.push("/income-certificate")}
                            >
                                <View style={styles.iconCircle}>
                                    <MaterialCommunityIcons
                                        name="file-certificate"
                                        size={30}
                                        color="#0D47A1"
                                    />
                                </View>
                                <Text style={styles.serviceText}>Income{"\n"}Certificate</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.serviceCard}>
                                <View style={styles.iconCircle}>
                                    <MaterialCommunityIcons
                                        name="certificate-outline"
                                        size={30}
                                        color="#0D47A1"
                                    />
                                </View>
                                <Text style={styles.serviceText}>Caste{"\n"}Certificate</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.serviceCard}>
                                <View style={styles.iconCircle}>
                                    <MaterialCommunityIcons
                                        name="home-heart"
                                        size={30}
                                        color="#0D47A1"
                                    />
                                </View>
                                <Text style={styles.serviceText}>
                                    Domicile{"\n"}Certificate
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.serviceCard}>
                                <View style={styles.iconCircle}>
                                    <MaterialCommunityIcons
                                        name="baby-face-outline"
                                        size={30}
                                        color="#0D47A1"
                                    />
                                </View>
                                <Text style={styles.serviceText}>Birth{"\n"}Certificate</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.serviceCard}>
                                <View style={styles.iconCircle}>
                                    <MaterialCommunityIcons
                                        name="account-off-outline"
                                        size={30}
                                        color="#0D47A1"
                                    />
                                </View>
                                <Text style={styles.serviceText}>Death{"\n"}Certificate</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.serviceCard}>
                                <View style={styles.iconCircle}>
                                    <MaterialCommunityIcons
                                        name="ring"
                                        size={30}
                                        color="#0D47A1"
                                    />
                                </View>
                                <Text style={styles.serviceText}>
                                    Marriage{"\n"}Certificate
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.serviceCard}>
                                <View style={styles.iconCircle}>
                                    <MaterialCommunityIcons
                                        name="school-outline"
                                        size={30}
                                        color="#0D47A1"
                                    />
                                </View>
                                <Text style={styles.serviceText}>EWS{"\n"}Certificate</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.serviceCard}>
                                <View style={styles.iconCircle}>
                                    <MaterialCommunityIcons
                                        name="shield-account-outline"
                                        size={30}
                                        color="#0D47A1"
                                    />
                                </View>
                                <Text style={styles.serviceText}>Non-Creamy{"\n"}Layer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Land & Property */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Land & Property</Text>

                        <View style={styles.servicesGrid}>
                            <TouchableOpacity style={styles.serviceCard}>
                                <View style={styles.iconCircle}>
                                    <MaterialCommunityIcons
                                        name="map-marker-path"
                                        size={30}
                                        color="#0D47A1"
                                    />
                                </View>
                                <Text style={styles.serviceText}>7/12{"\n"}Extract</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.serviceCard}>
                                <View style={styles.iconCircle}>
                                    <MaterialCommunityIcons
                                        name="file-document-outline"
                                        size={30}
                                        color="#0D47A1"
                                    />
                                </View>
                                <Text style={styles.serviceText}>8A{"\n"}Extract</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.serviceCard}>
                                <View style={styles.iconCircle}>
                                    <MaterialCommunityIcons
                                        name="home-city-outline"
                                        size={30}
                                        color="#0D47A1"
                                    />
                                </View>
                                <Text style={styles.serviceText}>Property{"\n"}Tax</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.serviceCard}>
                                <View style={styles.iconCircle}>
                                    <MaterialCommunityIcons
                                        name="map-outline"
                                        size={30}
                                        color="#0D47A1"
                                    />
                                </View>
                                <Text style={styles.serviceText}>Ferfar{"\n"}Utara</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Business & Social */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Business & Social</Text>

                        <View style={styles.servicesGrid}>
                            <TouchableOpacity style={styles.serviceCard}>
                                <View style={styles.iconCircle}>
                                    <MaterialCommunityIcons
                                        name="factory"
                                        size={30}
                                        color="#0D47A1"
                                    />
                                </View>
                                <Text style={styles.serviceText}>Udyam{"\n"}Registration</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.serviceCard}>
                                <View style={styles.iconCircle}>
                                    <MaterialCommunityIcons
                                        name="sprout-outline"
                                        size={30}
                                        color="#0D47A1"
                                    />
                                </View>
                                <Text style={styles.serviceText}>PM{"\n"}Kisan</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.serviceCard}>
                                <View style={styles.iconCircle}>
                                    <MaterialCommunityIcons
                                        name="account-tie-outline"
                                        size={30}
                                        color="#0D47A1"
                                    />
                                </View>
                                <Text style={styles.serviceText}>
                                    Senior Citizen{"\n"}Certificate
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.serviceCard}>
                                <View style={styles.iconCircle}>
                                    <MaterialCommunityIcons
                                        name="bank-outline"
                                        size={30}
                                        color="#0D47A1"
                                    />
                                </View>
                                <Text style={styles.serviceText}>Janhan{"\n"}Scheme</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.serviceCard}>
                                <View style={styles.iconCircle}>
                                    <MaterialCommunityIcons
                                        name="heart-flash"
                                        size={30}
                                        color="#0D47A1"
                                    />
                                </View>
                                <Text style={styles.serviceText}>Ayushman{"\n"}Bharat</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.serviceCard}>
                                <View style={styles.iconCircle}>
                                    <MaterialCommunityIcons
                                        name="briefcase-outline"
                                        size={30}
                                        color="#0D47A1"
                                    />
                                </View>
                                <Text style={styles.serviceText}>Employment{"\n"}Reg</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Services powered by</Text>
                        <Text style={styles.footerBrand}>Digital India | MahaOnline</Text>
                    </View>
                </ScrollView>

                {/* Floating back button */}
                <TouchableOpacity
                    style={styles.floatingBackButton}
                    onPress={handleBackPress}
                >
                    <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                </TouchableOpacity>
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
    floatingBackButton: {
        position: "absolute",
        top: 50,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 999,
    },

    // Tracking Card Styles
    trackingCard: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 20,
        marginTop: 100, // Space for back button
        marginBottom: 20,
        borderRadius: 16,
        padding: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    trackingContent: {
        flex: 1,
        paddingRight: 10,
    },
    trackingTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1A1A1A",
        marginBottom: 8,
    },
    trackingHighlight: {
        color: "#2196F3",
    },
    trackingSubtitle: {
        fontSize: 12,
        color: "#666",
        lineHeight: 18,
        marginBottom: 15,
    },
    trackNowButton: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1.5,
        borderColor: "#1A1A1A",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignSelf: "flex-start",
        marginBottom: 8,
    },
    trackNowButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1A1A1A",
    },
    trackingFootnote: {
        fontSize: 10,
        color: "#999",
    },
    trackingIconContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    trackingIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#F1F8FE",
        justifyContent: "center",
        alignItems: "center",
    },

    section: {
        marginBottom: 25,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1A1A1A",
        letterSpacing: 0.3,
        marginBottom: 15,
    },
    popularBadge: {
        backgroundColor: "#2196F3",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 15,
    },
    popularText: {
        fontSize: 11,
        fontWeight: "600",
        color: "#FFFFFF",
    },
    servicesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    serviceCard: {
        width: "23%",
        alignItems: "center",
        marginBottom: 20,
        position: "relative",
    },
    iconCircle: {
        width: 65,
        height: 65,
        borderRadius: 32.5,
        backgroundColor: "#F1F8FE",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
        shadowColor: "#2196F3",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#BBDEFB",
    },
    serviceText: {
        fontSize: 10,
        color: "#1A1A1A",
        textAlign: "center",
        fontWeight: "600",
        lineHeight: 13,
    },
    newBadge: {
        position: "absolute",
        top: 0,
        right: 5,
        backgroundColor: "#4CAF50",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    newBadgeText: {
        fontSize: 9,
        fontWeight: "600",
        color: "#FFFFFF",
    },
    footer: {
        alignItems: "center",
        paddingVertical: 30,
        gap: 5,
    },
    footerText: {
        fontSize: 12,
        color: "#999",
    },
    footerBrand: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#1A1A1A",
    },
});