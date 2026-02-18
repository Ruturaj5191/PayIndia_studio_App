import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface GasProvider {
    id: string;
    name: string;
    logo: string;
    color: string;
}

interface ConnectionDetails {
    consumerName: string;
    mobile: string;
    deliveryAddress: string;
    lastBookingDate: string;
    subsidyStatus: string;
    amountPayable: string;
    cylinderType: string;
    nextRefillEligible: string;
}

export default function LPGCylinderScreen() {
    const router = useRouter();

    // State
    const [selectedProvider, setSelectedProvider] = useState<GasProvider | null>(null);
    const [consumerNumber, setConsumerNumber] = useState('');
    const [showProviderModal, setShowProviderModal] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails | null>(null);
    const [fetchError, setFetchError] = useState(false);

    // Gas Providers (will be from API in real app)
    const gasProviders = [
        { id: '1', name: 'Indane Gas', logo: '🔥', color: '#FF6B35' },
        { id: '2', name: 'Bharat Gas', logo: '🔵', color: '#0066CC' },
        { id: '3', name: 'HP Gas', logo: '🟢', color: '#00A651' },
    ];

    // Validate Consumer Number
    const validateConsumerNumber = (number: string) => {
        return number.length >= 10; // Minimum length validation
    };

    // Handle Provider Selection
    const handleProviderSelect = (provider: any) => {
        setSelectedProvider(provider);
        setShowProviderModal(false);
        setConnectionDetails(null); // Reset details when provider changes
        setFetchError(false);
    };

    // Fetch Connection Details
    const handleFetchConnection = async () => {
        if (!selectedProvider) {
            Alert.alert('Select Provider', 'Please select your gas provider');
            return;
        }

        if (!validateConsumerNumber(consumerNumber)) {
            Alert.alert('Invalid Number', 'Please enter a valid Consumer Number (minimum 10 digits)');
            return;
        }

        setIsFetching(true);
        setFetchError(false);

        // Simulate API call
        setTimeout(() => {
            // Randomly simulate success/failure for demo
            const isSuccess = Math.random() > 0.3; // 70% success rate

            if (isSuccess) {
                // Mock connection details - in real app, this comes from API
                setConnectionDetails({
                    consumerName: 'Rahul Kumar',
                    mobile: '9876543210',
                    deliveryAddress: 'Flat 101, Krishna Apartments, Pune - 411001',
                    lastBookingDate: '15 Jan 2026',
                    subsidyStatus: 'Eligible',
                    amountPayable: '₹853',
                    cylinderType: '14.2 KG',
                    nextRefillEligible: 'Yes',
                });
                setFetchError(false);
            } else {
                // Simulate error
                setFetchError(true);
                setConnectionDetails(null);
            }

            setIsFetching(false);
        }, 2000);
    };

    // Handle Booking
    const handleBooking = () => {
        Alert.alert(
            'Confirm Booking',
            `Book LPG Cylinder for ${selectedProvider?.name}?\nConsumer: ${consumerNumber}\nAmount: ${connectionDetails?.amountPayable}`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Book & Pay',
                    onPress: () => {
                        // Navigate to payment or process booking
                        Alert.alert('Success', 'Booking confirmed! Payment processing...');
                    },
                },
            ]
        );
    };

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
                        <Text style={styles.headerTitle}>LPG Cylinder</Text>
                        <Text style={styles.headerSubtext}>Book or pay LPG cylinder across India</Text>
                    </View>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* LPG Banner */}
                    <View style={styles.bannerContainer}>
                        <LinearGradient
                            colors={['#FFF3E0', '#FFE0B2', '#FFCC80']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.banner}
                        >
                            <View style={styles.bannerIcon}>
                                <Text style={styles.bannerEmoji}>🔥</Text>
                            </View>
                            <View style={styles.bannerContent}>
                                <Text style={styles.bannerTitle}>Instant LPG Booking</Text>
                                <Text style={styles.bannerSubtitle}>All major providers • Secure & Fast</Text>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Select Gas Provider */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Gas Provider</Text>
                        <TouchableOpacity
                            style={styles.selectCard}
                            onPress={() => setShowProviderModal(true)}
                        >
                            {selectedProvider ? (
                                <View style={styles.selectedProvider}>
                                    <Text style={styles.providerEmoji}>{selectedProvider.logo}</Text>
                                    <Text style={styles.providerName}>{selectedProvider.name}</Text>
                                </View>
                            ) : (
                                <Text style={styles.placeholderText}>Select Provider</Text>
                            )}
                            <Ionicons name="chevron-down" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {/* Enter Consumer Number */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Consumer Number / LPG ID</Text>
                        <View style={styles.inputCard}>
                            <MaterialCommunityIcons name="card-account-details-outline" size={20} color="#999" />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter LPG ID"
                                placeholderTextColor="#999"
                                value={consumerNumber}
                                onChangeText={setConsumerNumber}
                                keyboardType="number-pad"
                            />
                        </View>
                        <Text style={styles.helperText}>Check your gas book or SMS for LPG ID</Text>
                        {consumerNumber && !validateConsumerNumber(consumerNumber) && (
                            <Text style={styles.errorText}>Consumer number must be at least 10 digits</Text>
                        )}
                    </View>

                    {/* Fetch Connection Button */}
                    <View style={styles.section}>
                        <TouchableOpacity
                            style={[
                                styles.fetchButton,
                                (!selectedProvider || !validateConsumerNumber(consumerNumber)) && styles.fetchButtonDisabled,
                            ]}
                            onPress={handleFetchConnection}
                            disabled={!selectedProvider || !validateConsumerNumber(consumerNumber) || isFetching}
                        >
                            {isFetching ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <>
                                    <MaterialCommunityIcons name="database-search" size={20} color="#FFFFFF" />
                                    <Text style={styles.fetchButtonText}>Fetch Connection</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Error Card - Show if fetch fails */}
                    {fetchError && (
                        <View style={styles.errorCard}>
                            <Ionicons name="alert-circle" size={48} color="#E53935" />
                            <Text style={styles.errorCardTitle}>Unable to fetch details</Text>
                            <Text style={styles.errorCardText}>Please verify your LPG ID and try again</Text>
                            <TouchableOpacity
                                style={styles.retryButton}
                                onPress={handleFetchConnection}
                            >
                                <Text style={styles.retryButtonText}>Retry</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Connection Details Card - Show after fetch */}
                    {connectionDetails && selectedProvider && !fetchError && (
                        <View style={styles.connectionCard}>
                            {/* Header */}
                            <View style={styles.connectionHeader}>
                                <Text style={styles.providerEmoji}>{selectedProvider.logo}</Text>
                                <Text style={styles.connectionProvider}>{selectedProvider.name}</Text>
                            </View>

                            {/* Details Grid */}
                            <View style={styles.detailsGrid}>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Consumer Name</Text>
                                    <Text style={styles.detailValue}>{connectionDetails.consumerName}</Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Registered Mobile</Text>
                                    <Text style={styles.detailValue}>{connectionDetails.mobile}</Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Cylinder Type</Text>
                                    <Text style={styles.detailValue}>{connectionDetails.cylinderType}</Text>
                                </View>

                                <View style={styles.detailRowFull}>
                                    <Text style={styles.detailLabel}>Delivery Address</Text>
                                    <Text style={styles.detailValueAddress}>{connectionDetails.deliveryAddress}</Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Last Booking</Text>
                                    <Text style={styles.detailValue}>{connectionDetails.lastBookingDate}</Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Subsidy Status</Text>
                                    <View style={styles.subsidyBadge}>
                                        <Text style={styles.subsidyText}>{connectionDetails.subsidyStatus}</Text>
                                    </View>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Refill Eligible</Text>
                                    <View style={styles.eligibleBadge}>
                                        <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                                        <Text style={styles.eligibleText}>{connectionDetails.nextRefillEligible}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Amount Payable - Highlighted */}
                            <View style={styles.amountSection}>
                                <Text style={styles.amountLabel}>Amount Payable</Text>
                                <Text style={styles.amountValue}>{connectionDetails.amountPayable}</Text>
                            </View>
                        </View>
                    )}

                    {/* Bottom Spacing */}
                    <View style={{ height: 100 }} />
                </ScrollView>

                {/* Book & Pay Button - Sticky */}
                {connectionDetails && !fetchError && (
                    <View style={styles.bottomBar}>
                        <TouchableOpacity
                            style={styles.bookButton}
                            onPress={handleBooking}
                        >
                            <LinearGradient
                                colors={['#4CAF50', '#45A049']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.bookButtonGradient}
                            >
                                <Text style={styles.bookButtonText}>
                                    Book & Pay {connectionDetails.amountPayable}
                                </Text>
                                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )}
            </SafeAreaView>

            {/* Provider Selection Modal */}
            <Modal
                visible={showProviderModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowProviderModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Gas Provider</Text>
                            <TouchableOpacity onPress={() => setShowProviderModal(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView>
                            {gasProviders.map((provider) => (
                                <TouchableOpacity
                                    key={provider.id}
                                    style={styles.providerOption}
                                    onPress={() => handleProviderSelect(provider)}
                                >
                                    <View style={styles.providerLeft}>
                                        <View style={[styles.providerLogoCircle, { backgroundColor: provider.color + '20' }]}>
                                            <Text style={styles.providerLogo}>{provider.logo}</Text>
                                        </View>
                                        <Text style={styles.providerOptionName}>{provider.name}</Text>
                                    </View>
                                    {selectedProvider?.id === provider.id && (
                                        <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F9FC',
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
        paddingBottom: 15,
        backgroundColor: '#FFFFFF',
    },
    backButton: {
        padding: 5,
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    headerSubtext: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    placeholder: {
        width: 34,
    },

    scrollContent: {
        paddingBottom: 20,
    },

    // Banner
    bannerContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
    },
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 24,
        gap: 15,
        shadowColor: '#FF9800',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    bannerIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bannerEmoji: {
        fontSize: 28,
    },
    bannerContent: {
        flex: 1,
    },
    bannerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E65100',
        marginBottom: 4,
    },
    bannerSubtitle: {
        fontSize: 13,
        color: '#F57C00',
        opacity: 0.9,
    },

    // Section
    section: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 10,
    },

    // Select Card
    selectCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    selectedProvider: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    providerEmoji: {
        fontSize: 24,
    },
    providerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    placeholderText: {
        fontSize: 16,
        color: '#999',
    },

    // Input Card
    inputCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 18,
        paddingVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        gap: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    helperText: {
        fontSize: 12,
        color: '#999',
        marginTop: 8,
    },
    errorText: {
        fontSize: 12,
        color: '#E53935',
        marginTop: 8,
    },

    // Fetch Button
    fetchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: '#2196F3',
        paddingVertical: 16,
        borderRadius: 24,
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    fetchButtonDisabled: {
        backgroundColor: '#E0E0E0',
        shadowColor: '#999',
    },
    fetchButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },

    // Error Card
    errorCard: {
        marginHorizontal: 20,
        backgroundColor: '#FFEBEE',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFCDD2',
        marginBottom: 20,
    },
    errorCardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#C62828',
        marginTop: 15,
        marginBottom: 8,
    },
    errorCardText: {
        fontSize: 14,
        color: '#E53935',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#E53935',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 24,
    },
    retryButtonText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },

    // Connection Details Card
    connectionCard: {
        marginHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    connectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    connectionProvider: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    detailsGrid: {
        gap: 14,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailRowFull: {
        gap: 6,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
    },
    detailValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    detailValueAddress: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1A1A1A',
        lineHeight: 20,
    },
    subsidyBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },
    subsidyText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4CAF50',
    },
    eligibleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    eligibleText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4CAF50',
    },

    // Amount Section
    amountSection: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        alignItems: 'center',
    },
    amountLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    amountValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4CAF50',
    },

    // Bottom Bar
    bottomBar: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 8,
    },
    bookButton: {
        borderRadius: 24,
        overflow: 'hidden',
    },
    bookButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 16,
    },
    bookButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '60%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    providerOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    providerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    providerLogoCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    providerLogo: {
        fontSize: 24,
    },
    providerOptionName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
});