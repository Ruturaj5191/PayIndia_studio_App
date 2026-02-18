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

interface DTHOperator {
    id: string;
    name: string;
    logo: string;
    color: string;
}

interface AccountDetails {
    subscriberName: string;
    mobile: string;
    currentPlan: string;
    balance: string;
    expiryDate: string;
    lastRecharge?: string;
}

interface DTHPlan {
    id: string;
    price: string;
    duration: string;
    popular: boolean;
}

export default function DTHRechargeScreen() {
    const router = useRouter();

    // State
    const [selectedOperator, setSelectedOperator] = useState<DTHOperator | null>(null);
    const [subscriberId, setSubscriberId] = useState('');
    const [showOperatorModal, setShowOperatorModal] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<DTHPlan | null>(null);
    const [customAmount, setCustomAmount] = useState('');

    // DTH Operators (will be from API in real app)
    const operators = [
        { id: '1', name: 'Tata Play', logo: '📡', color: '#0066CC' },
        { id: '2', name: 'Dish TV', logo: '📺', color: '#FF6B35' },
        { id: '3', name: 'Airtel Digital TV', logo: '📡', color: '#ED1C24' },
        { id: '4', name: 'Sun Direct', logo: '☀️', color: '#FF9500' },
        { id: '5', name: 'D2H (Videocon)', logo: '📺', color: '#00A8E1' },
    ];

    // Available Plans (will be from API after fetch)
    const availablePlans = [
        { id: '1', price: '₹299', duration: '1 Month', popular: true },
        { id: '2', price: '₹599', duration: '3 Months', popular: false },
        { id: '3', price: '₹999', duration: '6 Months', popular: false },
        { id: '4', price: '₹1799', duration: '1 Year', popular: false },
    ];

    // Validate Subscriber ID
    const validateSubscriberId = (id: string) => {
        return id.length >= 8; // Minimum length validation
    };

    // Handle Operator Selection
    const handleOperatorSelect = (operator: any) => {
        setSelectedOperator(operator);
        setShowOperatorModal(false);
        setAccountDetails(null); // Reset details when operator changes
        setSelectedPlan(null);
    };

    // Fetch Account Details
    const handleFetchDetails = async () => {
        if (!selectedOperator) {
            Alert.alert('Select Operator', 'Please select your DTH operator');
            return;
        }

        if (!validateSubscriberId(subscriberId)) {
            Alert.alert('Invalid ID', 'Please enter a valid Subscriber ID (minimum 8 characters)');
            return;
        }

        setIsFetching(true);

        // Simulate API call
        setTimeout(() => {
            // Mock account details - in real app, this comes from API
            setAccountDetails({
                subscriberName: 'Rahul Kumar',
                mobile: '9876543210',
                currentPlan: 'HD Sports Pack',
                balance: '₹150',
                expiryDate: '25 Feb 2026',
                lastRecharge: '15 Jan 2026',
            });
            setIsFetching(false);
        }, 2000);
    };

    // Handle Plan Selection
    const handlePlanSelect = (plan: any) => {
        setSelectedPlan(plan);
        setCustomAmount(''); // Clear custom amount if plan selected
    };

    // Handle Payment
    const handlePayment = () => {
        const amount = selectedPlan ? selectedPlan.price : customAmount;

        if (!amount) {
            Alert.alert('Select Plan', 'Please select a plan or enter amount');
            return;
        }

        Alert.alert(
            'Confirm Payment',
            `Proceed to pay ${amount} for ${selectedOperator?.name}?\nSubscriber ID: ${subscriberId}`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Pay Now',
                    onPress: () => {
                        // Navigate to payment screen or process payment
                        Alert.alert('Success', 'Payment processing...');
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
                        <Text style={styles.headerTitle}>DTH Recharge</Text>
                        <Text style={styles.headerSubtext}>Recharge any DTH service across India</Text>
                    </View>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* DTH Banner */}
                    <View style={styles.bannerContainer}>
                        <LinearGradient
                            colors={['#E3F2FD', '#BBDEFB', '#90CAF9']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.banner}
                        >
                            <View style={styles.bannerIcon}>
                                <Text style={styles.bannerEmoji}>📡</Text>
                            </View>
                            <View style={styles.bannerContent}>
                                <Text style={styles.bannerTitle}>Instant DTH Recharge</Text>
                                <Text style={styles.bannerSubtitle}>All operators • Secure payment</Text>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Select Operator */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>DTH Operator</Text>
                        <TouchableOpacity
                            style={styles.selectCard}
                            onPress={() => setShowOperatorModal(true)}
                        >
                            {selectedOperator ? (
                                <View style={styles.selectedOperator}>
                                    <Text style={styles.operatorEmoji}>{selectedOperator.logo}</Text>
                                    <Text style={styles.operatorName}>{selectedOperator.name}</Text>
                                </View>
                            ) : (
                                <Text style={styles.placeholderText}>Select Operator</Text>
                            )}
                            <Ionicons name="chevron-down" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {/* Enter Subscriber ID */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Subscriber ID / VC Number</Text>
                        <View style={styles.inputCard}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Subscriber ID"
                                placeholderTextColor="#999"
                                value={subscriberId}
                                onChangeText={setSubscriberId}
                                keyboardType="number-pad"
                            />
                        </View>
                        <Text style={styles.helperText}>Enter ID as per your DTH connection</Text>
                        {subscriberId && !validateSubscriberId(subscriberId) && (
                            <Text style={styles.errorText}>Subscriber ID must be at least 8 characters</Text>
                        )}
                    </View>

                    {/* Fetch Details Button */}
                    <View style={styles.section}>
                        <TouchableOpacity
                            style={[
                                styles.fetchButton,
                                (!selectedOperator || !validateSubscriberId(subscriberId)) && styles.fetchButtonDisabled,
                            ]}
                            onPress={handleFetchDetails}
                            disabled={!selectedOperator || !validateSubscriberId(subscriberId) || isFetching}
                        >
                            {isFetching ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <>
                                    <MaterialCommunityIcons name="account-search" size={20} color="#FFFFFF" />
                                    <Text style={styles.fetchButtonText}>Fetch Account</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Account Details Card - Show after fetch */}
                    {accountDetails && selectedOperator && (
                        <View style={styles.accountDetailsCard}>
                            <View style={styles.detailsHeader}>
                                <Text style={styles.operatorEmoji}>{selectedOperator.logo}</Text>
                                <Text style={styles.detailsOperator}>{selectedOperator.name}</Text>
                            </View>

                            <View style={styles.detailsGrid}>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Subscriber Name</Text>
                                    <Text style={styles.detailValue}>{accountDetails.subscriberName}</Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Registered Mobile</Text>
                                    <Text style={styles.detailValue}>{accountDetails.mobile}</Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Current Plan</Text>
                                    <Text style={styles.detailValue}>{accountDetails.currentPlan}</Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Balance</Text>
                                    <Text style={[styles.detailValue, styles.balanceText]}>{accountDetails.balance}</Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Expiry Date</Text>
                                    <Text style={[styles.detailValue, styles.expiryText]}>{accountDetails.expiryDate}</Text>
                                </View>

                                {accountDetails.lastRecharge && (
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Last Recharge</Text>
                                        <Text style={styles.detailValue}>{accountDetails.lastRecharge}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}

                    {/* Available Plans - Show after account details */}
                    {accountDetails && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Available Plans</Text>
                            <View style={styles.plansGrid}>
                                {availablePlans.map((plan) => (
                                    <TouchableOpacity
                                        key={plan.id}
                                        style={[
                                            styles.planCard,
                                            selectedPlan?.id === plan.id && styles.planCardSelected,
                                        ]}
                                        onPress={() => handlePlanSelect(plan)}
                                    >
                                        {plan.popular && (
                                            <View style={styles.popularBadge}>
                                                <Text style={styles.popularText}>POPULAR</Text>
                                            </View>
                                        )}
                                        <Text style={styles.planPrice}>{plan.price}</Text>
                                        <Text style={styles.planDuration}>{plan.duration}</Text>
                                        {selectedPlan?.id === plan.id && (
                                            <View style={styles.selectedCheck}>
                                                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Custom Amount (Optional) */}
                    {accountDetails && (
                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>Or Enter Custom Amount</Text>
                            <View style={styles.inputCard}>
                                <Text style={styles.currencySymbol}>₹</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Amount"
                                    placeholderTextColor="#999"
                                    value={customAmount}
                                    onChangeText={(text) => {
                                        setCustomAmount(text.replace(/[^0-9]/g, ''));
                                        setSelectedPlan(null); // Clear plan selection
                                    }}
                                    keyboardType="number-pad"
                                />
                            </View>
                        </View>
                    )}

                    {/* Bottom Spacing */}
                    <View style={{ height: 100 }} />
                </ScrollView>

                {/* Proceed to Pay Button - Sticky */}
                {accountDetails && (
                    <View style={styles.bottomBar}>
                        <TouchableOpacity
                            style={[
                                styles.payButton,
                                (!selectedPlan && !customAmount) && styles.payButtonDisabled,
                            ]}
                            onPress={handlePayment}
                            disabled={!selectedPlan && !customAmount}
                        >
                            <LinearGradient
                                colors={selectedPlan || customAmount ? ['#4CAF50', '#45A049'] : ['#E0E0E0', '#BDBDBD']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.payButtonGradient}
                            >
                                <Text style={styles.payButtonText}>
                                    Pay {selectedPlan ? selectedPlan.price : customAmount ? `₹${customAmount}` : '₹0'}
                                </Text>
                                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )}
            </SafeAreaView>

            {/* Operator Selection Modal */}
            <Modal
                visible={showOperatorModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowOperatorModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select DTH Operator</Text>
                            <TouchableOpacity onPress={() => setShowOperatorModal(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView>
                            {operators.map((operator) => (
                                <TouchableOpacity
                                    key={operator.id}
                                    style={styles.operatorOption}
                                    onPress={() => handleOperatorSelect(operator)}
                                >
                                    <View style={styles.operatorLeft}>
                                        <View style={[styles.operatorLogoCircle, { backgroundColor: operator.color + '20' }]}>
                                            <Text style={styles.operatorLogo}>{operator.logo}</Text>
                                        </View>
                                        <Text style={styles.operatorOptionName}>{operator.name}</Text>
                                    </View>
                                    {selectedOperator?.id === operator.id && (
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
    sectionTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 15,
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
    selectedOperator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    operatorEmoji: {
        fontSize: 24,
    },
    operatorName: {
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
        gap: 10,
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

    // Account Details Card
    accountDetailsCard: {
        marginHorizontal: 20,
        backgroundColor: '#F1F8FE',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#BBDEFB',
    },
    detailsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#BBDEFB',
    },
    detailsOperator: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0D47A1',
    },
    detailsGrid: {
        gap: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    balanceText: {
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    expiryText: {
        color: '#FF9800',
        fontWeight: 'bold',
    },

    // Plans Grid
    plansGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    planCard: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        position: 'relative',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    planCardSelected: {
        borderColor: '#4CAF50',
        backgroundColor: '#E8F5E9',
    },
    popularBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#FF9800',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    popularText: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    planPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2196F3',
        marginBottom: 6,
    },
    planDuration: {
        fontSize: 14,
        color: '#666',
    },
    selectedCheck: {
        position: 'absolute',
        bottom: 8,
        right: 8,
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
        maxHeight: '70%',
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
    operatorOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    operatorLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    operatorLogoCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    operatorLogo: {
        fontSize: 24,
    },
    operatorOptionName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
});