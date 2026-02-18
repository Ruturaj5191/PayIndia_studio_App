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
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// ============================================================
//  DATA — Cable Operators
// ============================================================

interface Operator {
    id: string;
    name: string;
    shortName: string;
    requiresCircle: boolean;
    brandColor: string;
}

const cableOperators: Operator[] = [
    { id: 'hathway', name: 'Hathway Digital', shortName: 'H', requiresCircle: true, brandColor: '#6A1B9A' },
    { id: 'siti', name: 'Siti Cable', shortName: 'S', requiresCircle: false, brandColor: '#1565C0' },
    { id: 'den', name: 'DEN Networks', shortName: 'D', requiresCircle: true, brandColor: '#00838F' },
    { id: 'gtpl', name: 'GTPL', shortName: 'G', requiresCircle: false, brandColor: '#2E7D32' },
    { id: 'asianet', name: 'Asianet', shortName: 'A', requiresCircle: false, brandColor: '#AD1457' },
    { id: 'local', name: 'Local Cable Operator', shortName: 'L', requiresCircle: true, brandColor: '#E65100' },
];

const indianCircles = [
    'Ahmedabad', 'Bangalore', 'Chennai', 'Delhi', 'Hyderabad', 'Kolkata', 'Mumbai', 'Pune'
];

const paymentMethods = [
    { id: 'upi', label: 'UPI', iconName: 'qr-code', iconColor: '#7C3AED' },
    { id: 'debit', label: 'Debit Card', iconName: 'card', iconColor: '#0EA5E9' },
    { id: 'credit', label: 'Credit Card', iconName: 'card-outline', iconColor: '#F59E0B' },
    { id: 'netbanking', label: 'Net Banking', iconName: 'business', iconColor: '#10B981' },
    { id: 'wallet', label: 'Wallet Balance', iconName: 'wallet', iconColor: '#EC4899' },
];

const mockBillData = {
    customerName: 'Rajesh Kumar',
    subscriberId: '12345678',
    billingAddress: 'A-204, Shanti Nagar, Mumbai - 400001',
    billingPeriod: '01 Feb – 28 Feb 2026',
    totalAmount: 449,
    dueDate: '05 Mar 2026',
    breakdown: {
        basePack: 299,
        addOns: 50,
        hdCharges: 60,
        gstAmount: 73.62,
        previousDues: 0,
        adjustments: -33.62,
    },
};

export default function CableTVScreen() {
    const router = useRouter();

    // ── State Variables ──────────────────────────────────────
    const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
    const [subscriberId, setSubscriberId] = useState('');
    const [selectedCircle, setSelectedCircle] = useState('Mumbai');

    const [isFetchingBill, setIsFetchingBill] = useState(false);
    const [billData, setBillData] = useState<typeof mockBillData | null>(null);
    const [hasFetchError, setHasFetchError] = useState(false);

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');
    const [promoCodeText, setPromoCodeText] = useState('');
    const [isPromoApplied, setIsPromoApplied] = useState(false);
    const [showBillBreakdown, setShowBillBreakdown] = useState(false);

    const [isSaveConnectionOn, setIsSaveConnectionOn] = useState(false);
    const [isAutoPayOn, setIsAutoPayOn] = useState(false);

    const [isOperatorModalVisible, setIsOperatorModalVisible] = useState(false);
    const [isCircleModalVisible, setIsCircleModalVisible] = useState(false);

    // ── Derived ─────────────────────────────────────────────
    const canFetchBill =
        selectedOperator !== null &&
        subscriberId.trim().length >= 6 &&
        (!selectedOperator.requiresCircle || selectedCircle !== '');

    const promoDiscount = isPromoApplied ? 50 : 0;
    const totalPayableAmount = billData ? billData.totalAmount - promoDiscount : 0;

    // ── Handlers ─────────────────────────────────────────────
    const handleOperatorSelect = (operator: Operator) => {
        setSelectedOperator(operator);
        setIsOperatorModalVisible(false);
        if (!operator.requiresCircle) {
            setSelectedCircle('');
        }
    };

    const handleCircleSelect = (circle: string) => {
        setSelectedCircle(circle);
        setIsCircleModalVisible(false);
    };

    const handleFetchBill = () => {
        setIsFetchingBill(true);
        setHasFetchError(false);
        setBillData(null);

        setTimeout(() => {
            if (subscriberId === '000000') {
                setHasFetchError(true);
            } else {
                setBillData(mockBillData);
            }
            setIsFetchingBill(false);
        }, 2000);
    };

    const handleApplyPromoCode = () => {
        if (promoCodeText.trim().toUpperCase() === 'CABLE50') {
            setIsPromoApplied(true);
        } else {
            Alert.alert('Invalid Code', 'Try CABLE50 for ₹50 off!');
        }
    };

    const handlePayNow = () => {
        Alert.alert(
            'Confirm Payment',
            `Pay ₹${totalPayableAmount} for Subscriber ID ${subscriberId}\nvia ${selectedPaymentMethod.toUpperCase()}`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm & Pay',
                    onPress: () => Alert.alert('✅ Payment Successful!', 'Your cable TV bill has been paid.'),
                },
            ]
        );
    };

    return (
        <View style={styles.screenContainer}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <SafeAreaView style={styles.safeArea}>
                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
                        <Ionicons name="arrow-back" size={22} color="#111827" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Cable TV Bill Payment</Text>
                    <TouchableOpacity>
                        <Ionicons name="information-circle-outline" size={22} color="#6B7280" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* TOP BANNER */}
                    <LinearGradient
                        colors={['#EFF6FF', '#DBEAFE', '#EFF6FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.topBanner}
                    >
                        <View style={styles.bannerIconCircle}>
                            <MaterialCommunityIcons name="television-play" size={32} color="#1D4ED8" />
                        </View>
                        <View style={styles.bannerTextContainer}>
                            <Text style={styles.bannerTitle}>Cable TV Bill Payment</Text>
                            <Text style={styles.bannerSubtitle}>Hathway, Siti, DEN & more</Text>
                        </View>
                    </LinearGradient>

                    {/* DETAILS CARD */}
                    <View style={styles.detailsCard}>
                        <Text style={styles.detailsCardTitle}>Enter Subscriber Details</Text>

                        {/* Operator Dropdown */}
                        <Text style={styles.fieldLabel}>Cable Operator *</Text>
                        <TouchableOpacity
                            style={styles.dropdownButton}
                            onPress={() => setIsOperatorModalVisible(true)}
                        >
                            {selectedOperator ? (
                                <View style={[styles.operatorColorDot, { backgroundColor: selectedOperator.brandColor }]}>
                                    <Text style={styles.operatorColorDotText}>{selectedOperator.shortName}</Text>
                                </View>
                            ) : (
                                <MaterialCommunityIcons name="television-classic" size={18} color="#9CA3AF" />
                            )}
                            <Text style={[styles.dropdownText, !selectedOperator && styles.dropdownPlaceholderText]}>
                                {selectedOperator ? selectedOperator.name : 'Select operator'}
                            </Text>
                            <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
                        </TouchableOpacity>

                        {/* Subscriber ID */}
                        <Text style={styles.fieldLabel}>Subscriber ID / Smart Card No. *</Text>
                        <View style={styles.inputContainer}>
                            <MaterialCommunityIcons name="smart-card-outline" size={18} color="#9CA3AF" />
                            <TextInput
                                style={styles.inputField}
                                placeholder="Enter your Subscriber ID"
                                placeholderTextColor="#9CA3AF"
                                value={subscriberId}
                                onChangeText={(t) => setSubscriberId(t.replace(/\s/g, '').toUpperCase())}
                                autoCapitalize="characters"
                            />
                        </View>

                        {/* Circle (if required) */}
                        {selectedOperator?.requiresCircle && (
                            <>
                                <Text style={styles.fieldLabel}>Circle / City *</Text>
                                <TouchableOpacity
                                    style={styles.dropdownButton}
                                    onPress={() => setIsCircleModalVisible(true)}
                                >
                                    <Ionicons name="location-outline" size={18} color="#9CA3AF" />
                                    <Text style={styles.dropdownText}>{selectedCircle || 'Select city'}</Text>
                                    <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
                                </TouchableOpacity>
                            </>
                        )}

                        {/* Save Connection Toggle */}
                        <View style={styles.toggleRow}>
                            <View style={styles.toggleLabelGroup}>
                                <Ionicons name="star-outline" size={17} color="#F59E0B" />
                                <Text style={styles.toggleLabelText}>Save this connection</Text>
                            </View>
                            <Switch
                                value={isSaveConnectionOn}
                                onValueChange={setIsSaveConnectionOn}
                                trackColor={{ false: '#E5E7EB', true: '#FEF3C7' }}
                                thumbColor={isSaveConnectionOn ? '#F59E0B' : '#ffffff'}
                            />
                        </View>

                        {/* AutoPay Toggle */}
                        <View style={styles.toggleRow}>
                            <View style={styles.toggleLabelGroup}>
                                <MaterialCommunityIcons name="autorenew" size={17} color="#10B981" />
                                <View>
                                    <Text style={styles.toggleLabelText}>Enable AutoPay</Text>
                                    <Text style={styles.toggleSublabelText}>Deducted 2 days before due date</Text>
                                </View>
                            </View>
                            <Switch
                                value={isAutoPayOn}
                                onValueChange={setIsAutoPayOn}
                                trackColor={{ false: '#E5E7EB', true: '#D1FAE5' }}
                                thumbColor={isAutoPayOn ? '#10B981' : '#ffffff'}
                            />
                        </View>
                    </View>

                    {/* FETCH BUTTON */}
                    <TouchableOpacity
                        style={[styles.fetchBillButton, !canFetchBill && styles.fetchBillButtonDisabled]}
                        onPress={handleFetchBill}
                        disabled={!canFetchBill || isFetchingBill}
                    >
                        <LinearGradient
                            colors={canFetchBill ? ['#1D4ED8', '#2563EB'] : ['#D1D5DB', '#9CA3AF']}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={styles.fetchBillButtonGradient}
                        >
                            {isFetchingBill ? (
                                <ActivityIndicator color="#ffffff" size="small" />
                            ) : (
                                <>
                                    <MaterialCommunityIcons name="file-search-outline" size={20} color="#ffffff" />
                                    <Text style={styles.fetchBillButtonText}>Fetch Bill</Text>
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* ERROR CARD */}
                    {hasFetchError && (
                        <View style={styles.errorCard}>
                            <View style={styles.errorIconWrapper}>
                                <Ionicons name="close-circle" size={38} color="#DC2626" />
                            </View>
                            <Text style={styles.errorTitle}>Unable to Fetch Bill</Text>
                            <Text style={styles.errorMessage}>Please verify your Subscriber ID and try again.</Text>
                            <TouchableOpacity style={styles.editDetailsButton} onPress={() => { setHasFetchError(false); setSubscriberId(''); }}>
                                <Text style={styles.editDetailsButtonText}>Edit Details</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* BILL SECTION */}
                    {billData && !hasFetchError && (
                        <>
                            <View style={styles.billSummaryCard}>
                                <View style={styles.billCardTitleRow}>
                                    <MaterialCommunityIcons name="receipt" size={20} color={selectedOperator?.brandColor ?? '#1D4ED8'} />
                                    <Text style={styles.billCardTitle}>Bill Details</Text>
                                </View>
                                <View style={styles.billDetailRow}>
                                    <View style={styles.billDetailLabelGroup}>
                                        <Ionicons name="person-outline" size={14} color="#9CA3AF" />
                                        <Text style={styles.billDetailLabel}>Customer Name</Text>
                                    </View>
                                    <Text style={styles.billDetailValue}>{billData.customerName}</Text>
                                </View>
                                <View style={styles.billDetailRow}>
                                    <View style={styles.billDetailLabelGroup}>
                                        <Ionicons name="location-outline" size={14} color="#9CA3AF" />
                                        <Text style={styles.billDetailLabel}>Address</Text>
                                    </View>
                                    <Text style={[styles.billDetailValue, styles.addressText]}>{billData.billingAddress}</Text>
                                </View>
                                <View style={styles.billDetailRow}>
                                    <View style={styles.billDetailLabelGroup}>
                                        <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                                        <Text style={styles.billDetailLabel}>Due Date</Text>
                                    </View>
                                    <Text style={[styles.billDetailValue, styles.dueDateText]}>{billData.dueDate}</Text>
                                </View>
                                <View style={[styles.billDetailRow, styles.billDetailRowLast]}>
                                    <View style={styles.billDetailLabelGroup}>
                                        <Ionicons name="cash-outline" size={14} color="#9CA3AF" />
                                        <Text style={styles.billDetailLabel}>Total Amount</Text>
                                    </View>
                                    <Text style={styles.billAmountText}>₹{billData.totalAmount}</Text>
                                </View>

                                <TouchableOpacity style={styles.breakdownToggleButton} onPress={() => setShowBillBreakdown(!showBillBreakdown)}>
                                    <MaterialCommunityIcons name="format-list-bulleted" size={16} color="#6B7280" />
                                    <Text style={styles.breakdownToggleText}>{showBillBreakdown ? 'Hide' : 'View'} Bill Breakdown</Text>
                                    <Ionicons name={showBillBreakdown ? 'chevron-up' : 'chevron-down'} size={14} color="#9CA3AF" />
                                </TouchableOpacity>

                                {showBillBreakdown && (
                                    <View style={styles.breakdownContainer}>
                                        <View style={styles.breakdownRow}><Text style={styles.breakdownLabel}>Base Pack</Text><Text style={styles.breakdownValue}>₹{billData.breakdown.basePack}</Text></View>
                                        <View style={styles.breakdownRow}><Text style={styles.breakdownLabel}>Add-ons</Text><Text style={styles.breakdownValue}>₹{billData.breakdown.addOns}</Text></View>
                                        <View style={styles.breakdownRow}><Text style={styles.breakdownLabel}>HD Charges</Text><Text style={styles.breakdownValue}>₹{billData.breakdown.hdCharges}</Text></View>
                                        <View style={styles.breakdownRow}><Text style={styles.breakdownLabel}>GST (18%)</Text><Text style={styles.breakdownValue}>₹{billData.breakdown.gstAmount}</Text></View>
                                        <View style={styles.breakdownDivider} />
                                        <View style={styles.breakdownRow}><Text style={styles.breakdownTotalLabel}>Total Payable</Text><Text style={styles.breakdownTotalLabel}>₹{billData.totalAmount}</Text></View>
                                    </View>
                                )}
                            </View>

                            <Text style={styles.sectionHeading}>Select Payment Method</Text>
                            <View style={styles.paymentMethodsCard}>
                                {paymentMethods.map((method, index) => {
                                    const isSelected = selectedPaymentMethod === method.id;
                                    return (
                                        <TouchableOpacity
                                            key={method.id}
                                            style={[styles.paymentMethodRow, isSelected && styles.paymentMethodRowSelected, index === paymentMethods.length - 1 && styles.paymentMethodRowLast]}
                                            onPress={() => setSelectedPaymentMethod(method.id)}
                                        >
                                            <View style={[styles.paymentMethodIconContainer, { backgroundColor: method.iconColor + '18' }]}>
                                                <Ionicons name={method.iconName as any} size={20} color={method.iconColor} />
                                            </View>
                                            <Text style={styles.paymentMethodLabel}>{method.label}</Text>
                                            <View style={[styles.radioButtonOuter, isSelected && { borderColor: method.iconColor }]}>
                                                {isSelected && <View style={[styles.radioButtonInner, { backgroundColor: method.iconColor }]} />}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            <View style={styles.promoCodeCard}>
                                <Text style={styles.promoCodeHintText}>Have a promo code?</Text>
                                <View style={styles.promoCodeInputRow}>
                                    <View style={styles.promoCodeInputContainer}>
                                        <MaterialCommunityIcons name="ticket-percent-outline" size={16} color="#9CA3AF" />
                                        <TextInput
                                            style={styles.promoCodeTextField}
                                            placeholder="Enter code (try CABLE50)"
                                            placeholderTextColor="#9CA3AF"
                                            value={promoCodeText}
                                            onChangeText={setPromoCodeText}
                                            autoCapitalize="characters"
                                            editable={!isPromoApplied}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        style={[styles.applyPromoButton, isPromoApplied && styles.applyPromoButtonDisabled]}
                                        onPress={handleApplyPromoCode}
                                        disabled={isPromoApplied}
                                    >
                                        <Text style={styles.applyPromoButtonText}>{isPromoApplied ? 'Applied' : 'Apply'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>
                    )}
                    <View style={{ height: 120 }} />
                </ScrollView>

                {/* STICKY BOTTOM BAR */}
                {billData && (
                    <View style={styles.bottomBar}>
                        <View style={styles.bottomLeft}>
                            <Text style={styles.bottomAmountLabel}>Total Amount</Text>
                            <Text style={styles.bottomAmount}>₹{totalPayableAmount}</Text>
                        </View>
                        <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
                            <LinearGradient colors={['#1D4ED8', '#2563EB']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.payGradient}>
                                <Ionicons name="lock-closed" size={16} color="#FFF" />
                                <Text style={styles.payText}>Pay Now</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )}
            </SafeAreaView>

            {/* OPERATOR MODAL */}
            <Modal visible={isOperatorModalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Cable Operator</Text>
                            <TouchableOpacity onPress={() => setIsOperatorModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            {cableOperators.map((op) => (
                                <TouchableOpacity key={op.id} style={styles.modalItem} onPress={() => handleOperatorSelect(op)}>
                                    <View style={[styles.operatorColorDot, { backgroundColor: op.brandColor }]}>
                                        <Text style={styles.operatorColorDotText}>{op.shortName}</Text>
                                    </View>
                                    <Text style={styles.modalItemText}>{op.name}</Text>
                                    {selectedOperator?.id === op.id && <Ionicons name="checkmark-circle" size={20} color="#1D4ED8" />}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* CIRCLE MODAL */}
            <Modal visible={isCircleModalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Circle / City</Text>
                            <TouchableOpacity onPress={() => setIsCircleModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            {indianCircles.map((c) => (
                                <TouchableOpacity key={c} style={styles.modalItem} onPress={() => handleCircleSelect(c)}>
                                    <Ionicons name="location-outline" size={18} color="#6B7280" />
                                    <Text style={styles.modalItemText}>{c}</Text>
                                    {selectedCircle === c && <Ionicons name="checkmark-circle" size={20} color="#1D4ED8" />}
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
    screenContainer: { flex: 1, backgroundColor: '#FFFFFF' },
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 45,
        paddingBottom: 15,
        backgroundColor: '#FFFFFF',
    },
    headerBackButton: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
    scrollContent: { paddingHorizontal: 20 },
    topBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        padding: 20,
        marginVertical: 15,
    },
    bannerIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#1D4ED8',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    bannerTextContainer: { marginLeft: 16 },
    bannerTitle: { fontSize: 18, fontWeight: '800', color: '#1E1B4B' },
    bannerSubtitle: { fontSize: 13, color: '#3B82F6', marginTop: 2 },
    detailsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 5,
    },
    detailsCardTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 20 },
    fieldLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8, marginTop: 12 },
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: '#F9FAFB',
    },
    dropdownText: { flex: 1, fontSize: 14, color: '#111827', fontWeight: '500', marginLeft: 10 },
    dropdownPlaceholderText: { color: '#9CA3AF' },
    operatorColorDot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    operatorColorDotText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: '#F9FAFB',
    },
    inputField: { flex: 1, fontSize: 15, color: '#111827', fontWeight: '600', marginLeft: 10 },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    toggleLabelGroup: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
    toggleLabelText: { fontSize: 14, fontWeight: '600', color: '#374151' },
    toggleSublabelText: { fontSize: 11, color: '#6B7280', marginTop: 1 },
    fetchBillButton: { borderRadius: 18, overflow: 'hidden', marginBottom: 16 },
    fetchBillButtonDisabled: { opacity: 0.6 },
    fetchBillButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 10,
    },
    fetchBillButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
    errorCard: {
        backgroundColor: '#FEF2F2',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    errorIconWrapper: { marginBottom: 12 },
    errorTitle: { fontSize: 16, fontWeight: '700', color: '#B91C1C', marginBottom: 4 },
    errorMessage: { fontSize: 13, color: '#991B1B', textAlign: 'center', marginBottom: 15 },
    editDetailsButton: { backgroundColor: '#DC2626', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
    editDetailsButtonText: { color: '#FFFFFF', fontWeight: '700' },
    billSummaryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
    },
    billCardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 },
    billCardTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
    billDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    billDetailRowLast: { borderBottomWidth: 0 },
    billDetailLabelGroup: { flexDirection: 'row', alignItems: 'center', gap: 8, width: 120 },
    billDetailLabel: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
    billDetailValue: { flex: 1, fontSize: 14, fontWeight: '600', color: '#111827', textAlign: 'right' },
    addressText: { fontSize: 12, color: '#4B5563' },
    dueDateText: { color: '#B45309' },
    billAmountText: { fontSize: 20, fontWeight: '800', color: '#111827' },
    breakdownToggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 10,
        paddingVertical: 8,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
    },
    breakdownToggleText: { fontSize: 13, color: '#4B5563', fontWeight: '600' },
    breakdownContainer: { marginTop: 15, paddingHorizontal: 10 },
    breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    breakdownLabel: { fontSize: 13, color: '#6B7280' },
    breakdownValue: { fontSize: 13, fontWeight: '600', color: '#111827' },
    breakdownDivider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 10 },
    breakdownTotalLabel: { fontSize: 14, fontWeight: '700', color: '#111827' },
    sectionHeading: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 15, marginTop: 10 },
    paymentMethodsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    paymentMethodRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    paymentMethodRowSelected: { backgroundColor: '#F9FAFB' },
    paymentMethodRowLast: { borderBottomWidth: 0 },
    paymentMethodIconContainer: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    paymentMethodLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: '#111827', marginLeft: 12 },
    radioButtonOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
    radioButtonInner: { width: 12, height: 12, borderRadius: 6 },
    promoCodeCard: {
        backgroundColor: '#EFF6FF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },
    promoCodeHintText: { fontSize: 13, color: '#1D4ED8', fontWeight: '600', marginBottom: 12 },
    promoCodeInputRow: { flexDirection: 'row', gap: 10 },
    promoCodeInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    promoCodeTextField: { flex: 1, fontSize: 14, fontWeight: '700', color: '#111827', marginLeft: 8 },
    applyPromoButton: { backgroundColor: '#1D4ED8', paddingHorizontal: 18, justifyContent: 'center', borderRadius: 12 },
    applyPromoButtonDisabled: { backgroundColor: '#9CA3AF' },
    applyPromoButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 35,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
    bottomLeft: { flex: 1 },
    bottomAmountLabel: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
    bottomAmount: { fontSize: 24, fontWeight: '800', color: '#111827' },
    payButton: { flex: 1.5, borderRadius: 18, overflow: 'hidden' },
    payGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
    payText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, maxHeight: '80%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
    modalItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
    modalItemText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#374151', marginLeft: 15 },
});