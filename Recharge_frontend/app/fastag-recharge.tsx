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

interface Issuer {
    id: string;
    name: string;
    logo: string;
    category: string;
}

interface TagDetails {
    vehicleNumber: string;
    bankName: string;
    availableBalance: string;
    minimumBalance: string;
    tagId: string;
    vehicleClass: string;
    registeredMobile: string;
}

export default function FASTagScreen() {
    const router = useRouter();

    // State
    const [selectedIssuer, setSelectedIssuer] = useState<Issuer | null>(null);
    const [showIssuerModal, setShowIssuerModal] = useState(false);
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const [tagDetails, setTagDetails] = useState<TagDetails | null>(null);
    const [rechargeAmount, setRechargeAmount] = useState('');

    // FASTag Issuer Banks (India-wide comprehensive list)
    const fastagIssuers: Issuer[] = [
        // Public Sector Banks
        { id: '1', name: 'State Bank of India (SBI FASTag)', logo: '🏦', category: 'Public Sector' },
        { id: '2', name: 'Bank of Baroda FASTag', logo: '🏦', category: 'Public Sector' },
        { id: '3', name: 'Punjab National Bank FASTag', logo: '🏦', category: 'Public Sector' },
        { id: '4', name: 'Union Bank of India FASTag', logo: '🏦', category: 'Public Sector' },
        { id: '5', name: 'Canara Bank FASTag', logo: '🏦', category: 'Public Sector' },
        { id: '6', name: 'Indian Bank FASTag', logo: '🏦', category: 'Public Sector' },
        { id: '7', name: 'Central Bank of India FASTag', logo: '🏦', category: 'Public Sector' },
        { id: '8', name: 'Bank of Maharashtra FASTag', logo: '🏦', category: 'Public Sector' },
        { id: '9', name: 'UCO Bank FASTag', logo: '🏦', category: 'Public Sector' },
        { id: '10', name: 'Indian Overseas Bank FASTag', logo: '🏦', category: 'Public Sector' },
        { id: '11', name: 'Punjab & Sind Bank FASTag', logo: '🏦', category: 'Public Sector' },

        // Private Sector Banks
        { id: '12', name: 'HDFC Bank FASTag', logo: '🏦', category: 'Private Sector' },
        { id: '13', name: 'ICICI Bank FASTag', logo: '🏦', category: 'Private Sector' },
        { id: '14', name: 'Axis Bank FASTag', logo: '🏦', category: 'Private Sector' },
        { id: '15', name: 'Kotak Mahindra Bank FASTag', logo: '🏦', category: 'Private Sector' },
        { id: '16', name: 'IDFC First Bank FASTag', logo: '🏦', category: 'Private Sector' },
        { id: '17', name: 'IndusInd Bank FASTag', logo: '🏦', category: 'Private Sector' },
        { id: '18', name: 'Yes Bank FASTag', logo: '🏦', category: 'Private Sector' },
        { id: '19', name: 'Federal Bank FASTag', logo: '🏦', category: 'Private Sector' },
        { id: '20', name: 'South Indian Bank FASTag', logo: '🏦', category: 'Private Sector' },
        { id: '21', name: 'Karur Vysya Bank FASTag', logo: '🏦', category: 'Private Sector' },
        { id: '22', name: 'City Union Bank FASTag', logo: '🏦', category: 'Private Sector' },

        // Payment Banks
        { id: '23', name: 'Paytm Payments Bank FASTag', logo: '💳', category: 'Payment Banks' },
        { id: '24', name: 'Airtel Payments Bank FASTag', logo: '💳', category: 'Payment Banks' },
        { id: '25', name: 'India Post Payments Bank (IPPB) FASTag', logo: '💳', category: 'Payment Banks' },
        { id: '26', name: 'Fino Payments Bank FASTag', logo: '💳', category: 'Payment Banks' },

        // NBFC / Other Issuers
        { id: '27', name: 'Equitas Small Finance Bank FASTag', logo: '🏢', category: 'Other Issuers' },
        { id: '28', name: 'AU Small Finance Bank FASTag', logo: '🏢', category: 'Other Issuers' },
        { id: '29', name: 'ESAF Small Finance Bank FASTag', logo: '🏢', category: 'Other Issuers' },
        { id: '30', name: 'LivQuik FASTag', logo: '🏢', category: 'Other Issuers' },
        { id: '31', name: 'IDBI Bank FASTag', logo: '🏢', category: 'Other Issuers' },
        { id: '32', name: 'Saraswat Bank FASTag', logo: '🏢', category: 'Other Issuers' },
    ];

    // Quick amounts
    const quickAmounts = ['500', '1000', '1500', '2000'];

    // Handle Vehicle Number Input (Auto uppercase and format)
    const handleVehicleNumberChange = (text: string) => {
        // Remove spaces and convert to uppercase
        const formatted = text.replace(/\s/g, '').toUpperCase();
        setVehicleNumber(formatted);
    };

    // Validate Vehicle Number (Indian format: AA00AA0000)
    const validateVehicleNumber = (number: string) => {
        const regex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/;
        return regex.test(number);
    };

    // Handle Issuer Selection
    const handleIssuerSelect = (issuer: Issuer) => {
        setSelectedIssuer(issuer);
        setShowIssuerModal(false);
        setTagDetails(null);
    };

    // Fetch FASTag Details
    const handleFetchDetails = async () => {
        if (!selectedIssuer) {
            Alert.alert('Select Issuer', 'Please select your FASTag issuer bank');
            return;
        }

        if (!validateVehicleNumber(vehicleNumber)) {
            Alert.alert('Invalid Vehicle Number', 'Please enter a valid vehicle number (e.g., MH12AB1234)');
            return;
        }

        setIsFetching(true);

        // Simulate API call
        setTimeout(() => {
            // Mock FASTag details
            setTagDetails({
                vehicleNumber: vehicleNumber,
                bankName: selectedIssuer.name,
                availableBalance: '₹850',
                minimumBalance: '₹100',
                tagId: 'FAST' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                vehicleClass: 'Car/Jeep/Van',
                registeredMobile: mobileNumber || '98765XXXXX',
            });
            setIsFetching(false);
        }, 2000);
    };

    // Handle Quick Amount
    const handleQuickAmount = (amount: string) => {
        setRechargeAmount(amount);
    };

    // Calculate Payment
    const calculatePayment = () => {
        const amount = parseInt(rechargeAmount) || 0;
        const platformFee = Math.ceil(amount * 0.01); // 1% platform fee
        const total = amount + platformFee;
        return { amount, platformFee, total };
    };

    // Handle Payment
    const handlePayment = () => {
        if (!rechargeAmount || parseInt(rechargeAmount) < 100) {
            Alert.alert('Invalid Amount', 'Minimum recharge amount is ₹100');
            return;
        }

        const { amount, platformFee, total } = calculatePayment();

        Alert.alert(
            'Confirm Payment',
            `Recharge ₹${amount} to ${vehicleNumber}?\n\nPlatform Fee: ₹${platformFee}\nTotal: ₹${total}`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Pay Now',
                    onPress: () => {
                        // Navigate to payment or show success
                        Alert.alert('Success! ✅', `FASTag recharged successfully!\n\nTransaction ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
                    },
                },
            ]
        );
    };

    // Group issuers by category
    const groupedIssuers = fastagIssuers.reduce((acc: { [key: string]: Issuer[] }, issuer) => {
        const category = issuer.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(issuer);
        return acc;
    }, {});

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
                    <Text style={styles.headerTitle}>FASTag Recharge</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Banner */}
                    <View style={styles.bannerContainer}>
                        <LinearGradient
                            colors={['#E3F2FD', '#BBDEFB', '#90CAF9']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.banner}
                        >
                            <View style={styles.bannerIcon}>
                                <Text style={styles.bannerEmoji}>🚗</Text>
                            </View>
                            <View style={styles.bannerContent}>
                                <Text style={styles.bannerTitle}>FASTag Recharge</Text>
                                <Text style={styles.bannerSubtitle}>All banks • Instant process</Text>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Select FASTag Issuer */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>FASTag Issuer Bank</Text>
                        <TouchableOpacity
                            style={styles.selectCard}
                            onPress={() => setShowIssuerModal(true)}
                        >
                            {selectedIssuer ? (
                                <View style={styles.selectedIssuer}>
                                    <Text style={styles.issuerEmoji}>{selectedIssuer.logo}</Text>
                                    <Text style={styles.issuerName}>{selectedIssuer.name}</Text>
                                </View>
                            ) : (
                                <Text style={styles.placeholderText}>Select FASTag Issuer</Text>
                            )}
                            <Ionicons name="chevron-down" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {/* Vehicle Number */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Vehicle Number</Text>
                        <View style={styles.inputCard}>
                            <MaterialCommunityIcons name="car" size={20} color="#2196F3" />
                            <TextInput
                                style={styles.input}
                                placeholder="MH12AB1234"
                                placeholderTextColor="#999"
                                value={vehicleNumber}
                                onChangeText={handleVehicleNumberChange}
                                autoCapitalize="characters"
                                maxLength={13}
                            />
                        </View>
                        <Text style={styles.helperText}>Format: AA00AA0000 (e.g., MH12AB1234)</Text>
                        {vehicleNumber && !validateVehicleNumber(vehicleNumber) && (
                            <Text style={styles.errorText}>Invalid vehicle number format</Text>
                        )}
                    </View>

                    {/* Mobile Number (Optional) */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Registered Mobile (Optional)</Text>
                        <View style={styles.inputCard}>
                            <Ionicons name="call" size={20} color="#4CAF50" />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter mobile number"
                                placeholderTextColor="#999"
                                value={mobileNumber}
                                onChangeText={setMobileNumber}
                                keyboardType="phone-pad"
                                maxLength={10}
                            />
                        </View>
                    </View>

                    {/* Fetch Details Button */}
                    <View style={styles.section}>
                        <TouchableOpacity
                            style={[
                                styles.fetchButton,
                                (!selectedIssuer || !validateVehicleNumber(vehicleNumber)) && styles.fetchButtonDisabled,
                            ]}
                            onPress={handleFetchDetails}
                            disabled={!selectedIssuer || !validateVehicleNumber(vehicleNumber) || isFetching}
                        >
                            {isFetching ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <>
                                    <MaterialCommunityIcons name="magnify" size={20} color="#FFFFFF" />
                                    <Text style={styles.fetchButtonText}>Fetch FASTag Details</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* FASTag Details Card */}
                    {tagDetails && (
                        <>
                            <View style={styles.tagDetailsCard}>
                                <View style={styles.tagHeader}>
                                    <Text style={styles.tagEmoji}>🚗</Text>
                                    <View style={styles.tagHeaderText}>
                                        <Text style={styles.tagVehicle}>{tagDetails.vehicleNumber}</Text>
                                        <Text style={styles.tagBank}>{tagDetails.bankName}</Text>
                                    </View>
                                </View>

                                <View style={styles.tagDetailsGrid}>
                                    <View style={styles.tagDetailRow}>
                                        <Text style={styles.tagDetailLabel}>Tag ID</Text>
                                        <Text style={styles.tagDetailValue}>{tagDetails.tagId}</Text>
                                    </View>

                                    <View style={styles.tagDetailRow}>
                                        <Text style={styles.tagDetailLabel}>Vehicle Class</Text>
                                        <Text style={styles.tagDetailValue}>{tagDetails.vehicleClass}</Text>
                                    </View>

                                    <View style={styles.tagDetailRow}>
                                        <Text style={styles.tagDetailLabel}>Registered Mobile</Text>
                                        <Text style={styles.tagDetailValue}>{tagDetails.registeredMobile}</Text>
                                    </View>

                                    <View style={styles.balanceRow}>
                                        <View style={styles.balanceItem}>
                                            <Text style={styles.balanceLabel}>Available Balance</Text>
                                            <Text style={styles.balanceValue}>{tagDetails.availableBalance}</Text>
                                        </View>
                                        <View style={styles.balanceItem}>
                                            <Text style={styles.balanceLabel}>Minimum Balance</Text>
                                            <Text style={styles.balanceMinValue}>{tagDetails.minimumBalance}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Recharge Amount Section */}
                            <View style={styles.section}>
                                <Text style={styles.sectionLabel}>Recharge Amount</Text>

                                {/* Quick Amounts */}
                                <View style={styles.quickAmounts}>
                                    {quickAmounts.map((amount) => (
                                        <TouchableOpacity
                                            key={amount}
                                            style={[
                                                styles.quickAmountBtn,
                                                rechargeAmount === amount && styles.quickAmountBtnActive,
                                            ]}
                                            onPress={() => handleQuickAmount(amount)}
                                        >
                                            <Text style={[
                                                styles.quickAmountText,
                                                rechargeAmount === amount && styles.quickAmountTextActive,
                                            ]}>
                                                ₹{amount}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* Custom Amount */}
                                <View style={styles.inputCard}>
                                    <Text style={styles.currencySymbol}>₹</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter custom amount"
                                        placeholderTextColor="#999"
                                        value={rechargeAmount}
                                        onChangeText={setRechargeAmount}
                                        keyboardType="number-pad"
                                    />
                                </View>
                                <Text style={styles.helperText}>Minimum amount: ₹100</Text>
                            </View>

                            {/* Payment Summary */}
                            {rechargeAmount && parseInt(rechargeAmount) >= 100 && (
                                <View style={styles.paymentSummary}>
                                    <Text style={styles.summaryTitle}>Payment Summary</Text>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Recharge Amount</Text>
                                        <Text style={styles.summaryValue}>₹{calculatePayment().amount}</Text>
                                    </View>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Platform Fee (1%)</Text>
                                        <Text style={styles.summaryValue}>₹{calculatePayment().platformFee}</Text>
                                    </View>
                                    <View style={styles.summaryDivider} />
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryTotalLabel}>Total Amount</Text>
                                        <Text style={styles.summaryTotalValue}>₹{calculatePayment().total}</Text>
                                    </View>
                                </View>
                            )}

                            {/* Bottom Spacing */}
                            <View style={{ height: 100 }} />
                        </>
                    )}
                </ScrollView>

                {/* Proceed to Pay Button */}
                {tagDetails && rechargeAmount && (
                    <View style={styles.bottomBar}>
                        <TouchableOpacity
                            style={[
                                styles.payButton,
                                (!rechargeAmount || parseInt(rechargeAmount) < 100) && styles.payButtonDisabled,
                            ]}
                            onPress={handlePayment}
                            disabled={!rechargeAmount || parseInt(rechargeAmount) < 100}
                        >
                            <LinearGradient
                                colors={rechargeAmount && parseInt(rechargeAmount) >= 100 ? ['#4CAF50', '#45A049'] : ['#E0E0E0', '#BDBDBD']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.payButtonGradient}
                            >
                                <Text style={styles.payButtonText}>
                                    Proceed to Pay ₹{calculatePayment().total}
                                </Text>
                                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )}
            </SafeAreaView>

            {/* Issuer Selection Modal */}
            <Modal
                visible={showIssuerModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowIssuerModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select FASTag Issuer</Text>
                            <TouchableOpacity onPress={() => setShowIssuerModal(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView>
                            {Object.keys(groupedIssuers).map((category) => (
                                <View key={category}>
                                    <Text style={styles.categoryHeader}>{category}</Text>
                                    {groupedIssuers[category].map((issuer: any) => (
                                        <TouchableOpacity
                                            key={issuer.id}
                                            style={styles.issuerOption}
                                            onPress={() => handleIssuerSelect(issuer)}
                                        >
                                            <View style={styles.issuerLeft}>
                                                <Text style={styles.issuerLogo}>{issuer.logo}</Text>
                                                <Text style={styles.issuerOptionName}>{issuer.name}</Text>
                                            </View>
                                            {selectedIssuer?.id === issuer.id && (
                                                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
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
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
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
        shadowColor: '#2196F3',
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
        color: '#0D47A1',
        marginBottom: 4,
    },
    bannerSubtitle: {
        fontSize: 13,
        color: '#1565C0',
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
    selectedIssuer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    issuerEmoji: {
        fontSize: 24,
    },
    issuerName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
        flex: 1,
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
    currencySymbol: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
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

    // Tag Details Card
    tagDetailsCard: {
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
    tagHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    tagEmoji: {
        fontSize: 32,
    },
    tagHeaderText: {
        flex: 1,
    },
    tagVehicle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    tagBank: {
        fontSize: 13,
        color: '#666',
    },
    tagDetailsGrid: {
        gap: 14,
    },
    tagDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tagDetailLabel: {
        fontSize: 14,
        color: '#666',
    },
    tagDetailValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    balanceRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 10,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    balanceItem: {
        flex: 1,
        backgroundColor: '#F1F8FE',
        padding: 12,
        borderRadius: 12,
    },
    balanceLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    balanceValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    balanceMinValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF9800',
    },

    // Quick Amounts
    quickAmounts: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 15,
    },
    quickAmountBtn: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        alignItems: 'center',
    },
    quickAmountBtnActive: {
        borderColor: '#2196F3',
        backgroundColor: '#F1F8FE',
    },
    quickAmountText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#666',
    },
    quickAmountTextActive: {
        color: '#2196F3',
    },

    // Payment Summary
    paymentSummary: {
        marginHorizontal: 20,
        backgroundColor: '#F1F8FE',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#BBDEFB',
        marginBottom: 20,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0D47A1',
        marginBottom: 15,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666',
    },
    summaryValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    summaryDivider: {
        height: 1,
        backgroundColor: '#BBDEFB',
        marginVertical: 12,
    },
    summaryTotalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    summaryTotalValue: {
        fontSize: 18,
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
    payButton: {
        borderRadius: 24,
        overflow: 'hidden',
    },
    payButtonDisabled: {
        opacity: 0.6,
    },
    payButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 16,
    },
    payButtonText: {
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
        maxHeight: '80%',
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
    categoryHeader: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2196F3',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#F1F8FE',
    },
    issuerOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    issuerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    issuerLogo: {
        fontSize: 24,
    },
    issuerOptionName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1A1A1A',
        flex: 1,
    },
});