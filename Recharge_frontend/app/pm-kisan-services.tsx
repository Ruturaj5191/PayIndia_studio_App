import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function PMKisanServicesScreen() {
    const router = useRouter();

    const services = [
        {
            id: "registration",
            title: "New Registration",
            desc: "Register as a new beneficiary",
            icon: "account-plus-outline",
            route: "/new-pm-kisan-registration",
            color: "#2E7D32",
        },
        {
            id: "update",
            title: "Update Farmer Details",
            desc: "Update Aadhaar / Bank / Land details",
            icon: "account-edit-outline",
            route: "/pm-kisan-update",
            color: "#2196F3",
        },
        {
            id: "status",
            title: "Check Installment Status",
            desc: "Track payment status",
            icon: "magnify",
            route: "/pm-kisan-status",
            color: "#E65100",
        },
    ];

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>PM-KISAN Services</Text>
                        <Text style={styles.headerSubtitle}>Farmer Registration & Installment Status</Text>
                    </View>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Scheme Info Card */}
                    <LinearGradient colors={["#059669", "#10B981", "#3B82F6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.infoCard}>
                        <View style={styles.infoCardHeader}>
                            <View style={styles.sproutIconCircle}>
                                <MaterialCommunityIcons name="sprout" size={24} color="#FFF" />
                            </View>
                            <Text style={styles.infoCardTitle}>PM-KISAN Samman Nidhi</Text>
                        </View>
                        <View style={styles.infoCardBody}>
                            <Text style={styles.benefitText}>Benefit: ₹6,000 per year (₹2,000 × 3 installments)</Text>
                            <Text style={styles.eligibleText}>Eligible: Small & Marginal Farmers</Text>

                            <View style={styles.tagRow}>
                                <View style={styles.tag}><Ionicons name="flash" size={12} color="#FFF" /><Text style={styles.tagText}>Direct DBT</Text></View>
                                <View style={styles.tag}><Ionicons name="card" size={12} color="#FFF" /><Text style={styles.tagText}>Aadhaar Linked</Text></View>
                                <View style={styles.tag}><Ionicons name="ribbon" size={12} color="#FFF" /><Text style={styles.tagText}>Central Scheme</Text></View>
                            </View>
                        </View>
                    </LinearGradient>

                    <Text style={styles.sectionTitle}>Available Services</Text>

                    {/* Services Grid */}
                    <View style={styles.servicesContainer}>
                        {services.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.serviceItem}
                                onPress={() => router.push(item.route as any)}
                            >
                                <View style={[styles.iconBox, { backgroundColor: item.color + "15" }]}>
                                    <MaterialCommunityIcons name={item.icon as any} size={28} color={item.color} />
                                </View>
                                <View style={styles.serviceInfo}>
                                    <Text style={styles.serviceTitle}>{item.title}</Text>
                                    <Text style={styles.serviceDesc}>{item.desc}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Footer Info */}
                    <View style={styles.footerInfo}>
                        <Ionicons name="information-circle-outline" size={20} color="#64748B" />
                        <Text style={styles.footerInfoText}>
                            Please ensure your mobile number is linked with Aadhaar for OTP verification.
                        </Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8FAFC" },
    safeArea: { flex: 1 },
    header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20, backgroundColor: "#FFF" },
    backButton: { padding: 4 },
    headerCenter: { flex: 1, alignItems: "center" },
    headerTitle: { fontSize: 18, fontWeight: "800", color: "#1E293B" },
    headerSubtitle: { fontSize: 12, color: "#64748B", marginTop: 2 },
    scrollContent: { padding: 20 },

    infoCard: { borderRadius: 24, padding: 20, marginBottom: 25, elevation: 12, shadowColor: "#10B981", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 15 },
    infoCardHeader: { flexDirection: "row", alignItems: "center", gap: 15, marginBottom: 15 },
    sproutIconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
    infoCardTitle: { fontSize: 20, fontWeight: "900", color: "#FFF", letterSpacing: 0.5 },
    infoCardBody: { gap: 10 },
    benefitText: { fontSize: 16, color: "#FFF", fontWeight: "800" },
    eligibleText: { fontSize: 13, color: "rgba(255,255,255,0.9)", fontWeight: "600" },
    tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 12 },
    tag: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(255,255,255,0.15)", paddingVertical: 5, paddingHorizontal: 12, borderRadius: 10 },
    tagText: { fontSize: 11, color: "#FFF", fontWeight: "800" },

    sectionTitle: { fontSize: 16, fontWeight: "800", color: "#1E293B", marginBottom: 15, marginLeft: 4 },
    servicesContainer: { gap: 12 },
    serviceItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", padding: 16, borderRadius: 20, gap: 16, elevation: 4, shadowColor: "#64748B", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
    iconBox: { width: 60, height: 60, borderRadius: 18, alignItems: "center", justifyContent: "center" },
    serviceInfo: { flex: 1 },
    serviceTitle: { fontSize: 15, fontWeight: "800", color: "#1E293B" },
    serviceDesc: { fontSize: 12, color: "#64748B", marginTop: 2 },

    footerInfo: { flexDirection: "row", gap: 12, backgroundColor: "#F0FDF4", padding: 18, borderRadius: 20, marginTop: 30, alignItems: "center", borderWidth: 1, borderColor: "#DCFCE7" },
    footerInfoText: { flex: 1, fontSize: 12, color: "#166534", fontWeight: "600", lineHeight: 18 },
});
