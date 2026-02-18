import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import {
    BackHandler,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function IncomeCertificateScreen() {
    const router = useRouter();

    // Handle back navigation
    useEffect(() => {
        const backAction = () => {
            router.replace('/explore');
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, []);

    const handleApplyNow = () => {
        router.push('/income-certificate-form');
    };

    const handleTrackStatus = () => {
        // Implement track status logic or navigate to status screen
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/explore')}>
                        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>Income Certificate</Text>
                        <Text style={styles.headerSubtitle}>Apply for income certificate issued by revenue authority</Text>
                    </View>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Information Card */}
                    <View style={styles.infoCard}>
                        <View style={styles.blueLeftBorder} />
                        <View style={styles.cardContent}>
                            <View style={styles.cardHeader}>
                                <View style={styles.iconCircle}>
                                    <MaterialCommunityIcons
                                        name="certificate-outline"
                                        size={28}
                                        color="#0A4DA3"
                                    />
                                </View>
                                <View style={styles.titleSection}>
                                    <Text style={styles.cardMainTitle}>Revenue Department</Text>
                                    <Text style={styles.cardSubtitle}>
                                        Official Certificate Issuance
                                    </Text>
                                </View>
                            </View>

                            {/* Trust Badges */}
                            <View style={styles.badgesRow}>
                                <View style={styles.badge}>
                                    <Ionicons name="checkmark-circle" size={16} color="#2E7D32" />
                                    <Text style={styles.badgeText}>Digital India</Text>
                                </View>
                                <View style={styles.badge}>
                                    <Ionicons name="checkmark-circle" size={16} color="#2E7D32" />
                                    <Text style={styles.badgeText}>QR Verified</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Apply Now Card */}
                    <View style={styles.serviceCard}>
                        <View style={styles.greenGradient}>
                            <View style={styles.serviceHeaderRow}>
                                <View style={styles.serviceIcon}>
                                    <MaterialCommunityIcons
                                        name="file-document-edit"
                                        size={28}
                                        color="#2E7D32"
                                    />
                                </View>
                                <View style={styles.serviceContent}>
                                    <Text style={styles.serviceTitle}>New Application</Text>
                                    <Text style={styles.serviceHindi}>उत्पन्न दाखला नवीन अर्ज</Text>
                                </View>
                            </View>

                            <View style={styles.serviceBottomRow}>
                                <Text style={styles.serviceDesc}>Process takes 7-10 working days</Text>
                                <TouchableOpacity
                                    style={styles.greenButton}
                                    onPress={handleApplyNow}
                                >
                                    <Text style={styles.buttonTextGreen}>Apply Now</Text>
                                    <Ionicons name="arrow-forward" size={16} color="#2E7D32" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>


                    {/* Required Documents Section */}
                    <View style={styles.whyChooseCard}>
                        <View style={styles.whyChooseHeader}>
                            <Ionicons name="information-circle" size={24} color="#0A4DA3" />
                            <Text style={styles.whyChooseTitle}>Documents Required</Text>
                        </View>

                        <View style={styles.featuresGrid}>
                            <View style={styles.featureRow}>
                                <View style={styles.feature}>
                                    <Ionicons name="checkmark-circle" size={18} color="#2E7D32" />
                                    <Text style={styles.featureText}>Aadhaar Card (आधार)</Text>
                                </View>
                                <View style={styles.feature}>
                                    <Ionicons name="checkmark-circle" size={18} color="#2E7D32" />
                                    <Text style={styles.featureText}>Address Proof (पत्ता)</Text>
                                </View>
                            </View>
                            <View style={styles.featureRow}>
                                <View style={styles.feature}>
                                    <Ionicons name="checkmark-circle" size={18} color="#2E7D32" />
                                    <Text style={styles.featureText}>Ration Card (रेशन कार्ड)</Text>
                                </View>
                                <View style={styles.feature}>
                                    <Ionicons name="checkmark-circle" size={18} color="#2E7D32" />
                                    <Text style={styles.featureText}>Income Proof (उत्पन्न)</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Service Fee Info Card */}
                    <View style={styles.noteCard}>
                        <View style={styles.noteHeader}>
                            <MaterialCommunityIcons name="currency-inr" size={20} color="#F57C00" />
                            <Text style={styles.noteTitle}>Service Fee:</Text>
                        </View>
                        <Text style={styles.noteText}>
                            A nominal fee of ₹50 is applicable for this service. Digital signatures are legally valid.
                        </Text>
                    </View>

                    <View style={{ height: 20 }} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        padding: 5,
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    headerSubtitle: {
        fontSize: 11,
        color: '#666',
        marginTop: 2,
    },
    placeholder: {
        width: 34,
    },

    scrollContent: {
        paddingTop: 12,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },

    // Info Card with Blue Left Border
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
    },
    blueLeftBorder: {
        width: 4,
        backgroundColor: '#0A4DA3',
    },
    cardContent: {
        flex: 1,
        padding: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#E3F2FD',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    titleSection: {
        flex: 1,
    },
    cardMainTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 1,
    },
    cardSubtitle: {
        fontSize: 11,
        color: '#666',
    },
    badgesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    badgeText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },

    // Service Cards
    serviceCard: {
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        overflow: 'hidden',
    },
    greenGradient: {
        backgroundColor: '#F1FBF4',
        padding: 16,
    },
    orangeGradient: {
        backgroundColor: '#FFF9F2',
        padding: 16,
    },
    serviceHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    serviceBottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },
    serviceIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    serviceContent: {
        flex: 1,
    },
    serviceTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    serviceHindi: {
        fontSize: 12,
        color: '#666',
    },
    serviceDesc: {
        flex: 1,
        fontSize: 12,
        color: '#777',
    },
    greenButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#E8F5E9',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#C8E6C9',
    },
    orangeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FFF3E0',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FFE0B2',
    },
    buttonTextGreen: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2E7D32',
    },
    buttonTextOrange: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#F57C00',
    },

    // Documents Section
    whyChooseCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    whyChooseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    whyChooseTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    featuresGrid: {
        gap: 8,
    },
    featureRow: {
        flexDirection: 'row',
        gap: 12,
    },
    feature: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    featureText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
        flex: 1,
    },

    // Note Card
    noteCard: {
        backgroundColor: '#FFF9E6',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#FFE0B2',
    },
    noteHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    noteTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    noteText: {
        fontSize: 12,
        color: '#666',
        lineHeight: 18,
    },
});