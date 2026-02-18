import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
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

// ── OPERATOR DATA ──────────────────────────────────────────────
const OPERATORS = [
    {
        id: 'airtel',
        name: 'Airtel',
        short: 'A',
        gradientColors: ['#E11900', '#FF4B2B'] as const,
        bgLight: '#FFF0EE',
        textColor: '#E11900',
        plans: '₹399',
    },
    {
        id: 'jio',
        name: 'Jio',
        short: 'Jio',
        gradientColors: ['#005AB5', '#0077CC'] as const,
        bgLight: '#EEF4FF',
        textColor: '#005AB5',
        plans: '₹349',
    },
    {
        id: 'vi',
        name: 'Vi',
        short: 'Vi',
        gradientColors: ['#C8006B', '#E5006E'] as const,
        bgLight: '#FFF0F7',
        textColor: '#C8006B',
        plans: '₹379',
    },
    {
        id: 'bsnl',
        name: 'BSNL',
        short: 'B',
        gradientColors: ['#1B5E20', '#2E7D32'] as const,
        bgLight: '#F0FAF0',
        textColor: '#2E7D32',
        plans: '₹275',
    },
    {
        id: 'mtnl',
        name: 'MTNL',
        short: 'M',
        gradientColors: ['#4A148C', '#6A1B9A'] as const,
        bgLight: '#F5F0FF',
        textColor: '#6A1B9A',
        plans: '₹249',
    },
];

// ── CIRCLES ───────────────────────────────────────────────────
const CIRCLES = [
    'Andhra Pradesh', 'Assam', 'Bihar & Jharkhand', 'Chennai',
    'Delhi & NCR', 'Gujarat', 'Haryana', 'Himachal Pradesh',
    'Jammu & Kashmir', 'Karnataka', 'Kerala', 'Kolkata',
    'Madhya Pradesh', 'Maharashtra', 'Mumbai', 'North East',
    'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu',
    'UP East', 'UP West', 'West Bengal',
];

// ── MOCK BILL DATA ────────────────────────────────────────────
const MOCK_BILL = {
    customerName: 'Rahul Kumar',
    billingPeriod: '01 Jan – 31 Jan 2026',
    billAmount: 499,
    dueDate: '15 Feb 2026',
    lastBills: [
        { month: 'Dec 2025', amount: 499 },
        { month: 'Nov 2025', amount: 449 },
        { month: 'Oct 2025', amount: 499 },
    ],
};

export default function MobilePostpaidScreen() {
    const router = useRouter();

    // ── STATE ──────────────────────────────────────────────────
    const [step, setStep] = useState<'operator' | 'details' | 'bill'>('operator');
    const [selectedOp, setSelectedOp] = useState<(typeof OPERATORS)[0] | null>(null);
    const [mobile, setMobile] = useState('');
    const [selectedCircle, setSelectedCircle] = useState('Maharashtra');
    const [isFetching, setIsFetching] = useState(false);
    const [bill, setBill] = useState<typeof MOCK_BILL | null>(null);
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);
    const [showCircleModal, setShowCircleModal] = useState(false);
    const [showLastBills, setShowLastBills] = useState(false);
    const [saveFavorite, setSaveFavorite] = useState(false);
    const [autoPay, setAutoPay] = useState(false);

    // Format: 98765 43210
    const formatMobile = (raw: string) => {
        const d = raw.replace(/\D/g, '').slice(0, 10);
        if (d.length <= 5) return d;
        return d.slice(0, 5) + ' ' + d.slice(5);
    };

    const rawMobile = mobile.replace(/\s/g, '');

    // ── CONTACT PICKER ────────────────────────────────────────
    const handleContactPicker = async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status !== 'granted') { Alert.alert('Permission required'); return; }
        const { data } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.PhoneNumbers] });
        if (data[0]?.phoneNumbers?.[0]?.number) {
            const num = data[0].phoneNumbers[0].number.replace(/\D/g, '').slice(-10);
            setMobile(formatMobile(num));
        }
    };

    // ── OPERATOR SELECT ───────────────────────────────────────
    const handleOperatorSelect = (op: typeof OPERATORS[0]) => {
        setSelectedOp(op);
        setStep('details');
        setMobile('');
        setBill(null);
    };

    // ── FETCH BILL ────────────────────────────────────────────
    const handleFetchBill = () => {
        if (rawMobile.length !== 10) {
            Alert.alert('Invalid Number', 'Enter a valid 10-digit mobile number');
            return;
        }
        setIsFetching(true);
        setTimeout(() => {
            setBill(MOCK_BILL);
            setIsFetching(false);
            setStep('bill');
        }, 2000);
    };

    // ── PROMO ─────────────────────────────────────────────────
    const handleApplyPromo = () => {
        if (promoCode.toUpperCase() === 'SAVE50') {
            setPromoApplied(true);
            Alert.alert('🎉 Promo Applied!', '₹50 discount applied');
        } else {
            Alert.alert('Invalid Code', 'Enter a valid promo code');
        }
    };

    // ── PAY ───────────────────────────────────────────────────
    const handlePay = () => {
        const total = bill ? bill.billAmount - (promoApplied ? 50 : 0) : 0;
        Alert.alert(
            'Confirm Payment',
            `Pay ₹${total} for ${rawMobile}\nvia ${paymentMethod.toUpperCase()}`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Confirm', onPress: () => Alert.alert('✅ Success!', 'Bill paid successfully!') },
            ]
        );
    };

    const discountedAmount = bill ? bill.billAmount - (promoApplied ? 50 : 0) : 0;

    // ── PAYMENT METHODS ───────────────────────────────────────
    const payMethods = [
        { id: 'upi', label: 'UPI', icon: 'qr-code', color: '#7C3AED' },
        { id: 'debit', label: 'Debit Card', icon: 'card', color: '#0EA5E9' },
        { id: 'credit', label: 'Credit Card', icon: 'card-outline', color: '#F59E0B' },
        { id: 'wallet', label: 'Wallet Balance', icon: 'wallet', color: '#10B981' },
    ];

    return (
        <View style={styles.root}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <SafeAreaView style={styles.safe}>
                {/* ─── HEADER ──────────────────────────────────── */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => {
                            if (step === 'details') setStep('operator');
                            else if (step === 'bill') setStep('details');
                            else router.back();
                        }}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                    </TouchableOpacity>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.headerTitle}>Mobile Postpaid</Text>
                        {selectedOp && step !== 'operator' && (
                            <Text style={styles.headerSub}>{selectedOp.name} • {selectedCircle}</Text>
                        )}
                    </View>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* ═══════════════════════════════════════════
              STEP 1 – SELECT OPERATOR
          ══════════════════════════════════════════════ */}
                    {step === 'operator' && (
                        <View>
                            {/* Hero gradient strip */}
                            <LinearGradient
                                colors={['#EFF6FF', '#DBEAFE', '#F0F9FF']}
                                style={styles.heroBanner}
                            >
                                <MaterialCommunityIcons name="phone-check" size={40} color="#1D4ED8" />
                                <Text style={styles.heroTitle}>Pay Postpaid Bill</Text>
                                <Text style={styles.heroSub}>Select your operator to get started</Text>
                            </LinearGradient>

                            {/* Operator grid */}
                            <Text style={styles.sectionLabel}>Choose Operator</Text>
                            <View style={styles.opGrid}>
                                {OPERATORS.map((op) => (
                                    <TouchableOpacity
                                        key={op.id}
                                        style={styles.opCard}
                                        onPress={() => handleOperatorSelect(op)}
                                        activeOpacity={0.85}
                                    >
                                        <LinearGradient
                                            colors={op.gradientColors}
                                            style={styles.opCircleLarge}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                        >
                                            <Text style={styles.opCircleText}>{op.short}</Text>
                                        </LinearGradient>
                                        <Text style={styles.opCardName}>{op.name}</Text>
                                        <Text style={styles.opCardPlan}>from {op.plans}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* ═══════════════════════════════════════════
              STEP 2 – ENTER DETAILS
          ══════════════════════════════════════════════ */}
                    {step === 'details' && selectedOp && (
                        <View>
                            {/* Operator chip */}
                            <View style={styles.selectedOpChip}>
                                <LinearGradient
                                    colors={selectedOp.gradientColors}
                                    style={styles.chipCircle}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <Text style={styles.chipCircleText}>{selectedOp.short}</Text>
                                </LinearGradient>
                                <Text style={styles.chipOpName}>{selectedOp.name} Postpaid</Text>
                                <TouchableOpacity
                                    style={styles.changeOpBtn}
                                    onPress={() => setStep('operator')}
                                >
                                    <Text style={styles.changeOpText}>Change</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Details Card */}
                            <View style={styles.detailsCard}>
                                <Text style={styles.cardSectionTitle}>Enter Postpaid Details</Text>

                                {/* Mobile Number */}
                                <Text style={styles.fieldLabel}>Mobile Number</Text>
                                <View style={styles.inputRow}>
                                    <View style={styles.flagChip}>
                                        <Text style={styles.flagEmoji}>🇮🇳</Text>
                                        <Text style={styles.dialCode}>+91</Text>
                                    </View>
                                    <View style={styles.dividerV} />
                                    <TextInput
                                        style={styles.phoneField}
                                        placeholder="98765 43210"
                                        placeholderTextColor="#9CA3AF"
                                        keyboardType="phone-pad"
                                        value={mobile}
                                        onChangeText={(t) => setMobile(formatMobile(t))}
                                    />
                                    <TouchableOpacity style={styles.contactBtn} onPress={handleContactPicker}>
                                        <Ionicons name="person-add" size={18} color={selectedOp.textColor} />
                                    </TouchableOpacity>
                                </View>

                                {/* Link Mobile */}
                                <TouchableOpacity style={styles.linkMobileRow}>
                                    <MaterialCommunityIcons name="link-variant" size={16} color="#6B7280" />
                                    <Text style={styles.linkMobileText}>Link a saved mobile number</Text>
                                    <Ionicons name="chevron-forward" size={14} color="#9CA3AF" />
                                </TouchableOpacity>

                                {/* Circle */}
                                <Text style={styles.fieldLabel}>Circle / State</Text>
                                <TouchableOpacity
                                    style={styles.dropdownBtn}
                                    onPress={() => setShowCircleModal(true)}
                                >
                                    <Ionicons name="location-outline" size={18} color="#6B7280" />
                                    <Text style={styles.dropdownText}>{selectedCircle}</Text>
                                    <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
                                </TouchableOpacity>

                                {/* Save favorite */}
                                <View style={styles.toggleRow}>
                                    <View style={styles.toggleLeft}>
                                        <Ionicons name="star-outline" size={18} color="#F59E0B" />
                                        <Text style={styles.toggleLabel}>Save as Favorite</Text>
                                    </View>
                                    <Switch
                                        value={saveFavorite}
                                        onValueChange={setSaveFavorite}
                                        trackColor={{ false: '#E5E7EB', true: '#FEF3C7' }}
                                        thumbColor={saveFavorite ? '#F59E0B' : '#fff'}
                                        ios_backgroundColor="#E5E7EB"
                                    />
                                </View>

                                {/* AutoPay */}
                                <View style={styles.toggleRow}>
                                    <View style={styles.toggleLeft}>
                                        <MaterialCommunityIcons name="autorenew" size={18} color="#10B981" />
                                        <Text style={styles.toggleLabel}>Enable AutoPay</Text>
                                    </View>
                                    <Switch
                                        value={autoPay}
                                        onValueChange={setAutoPay}
                                        trackColor={{ false: '#E5E7EB', true: '#D1FAE5' }}
                                        thumbColor={autoPay ? '#10B981' : '#fff'}
                                        ios_backgroundColor="#E5E7EB"
                                    />
                                </View>
                            </View>

                            {/* Fetch Button */}
                            <TouchableOpacity
                                style={[styles.fetchBtn, rawMobile.length !== 10 && styles.fetchBtnDim]}
                                onPress={handleFetchBill}
                                disabled={rawMobile.length !== 10 || isFetching}
                                activeOpacity={0.88}
                            >
                                <LinearGradient
                                    colors={rawMobile.length === 10
                                        ? [selectedOp.gradientColors[0], selectedOp.gradientColors[1]]
                                        : ['#D1D5DB', '#9CA3AF']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.fetchBtnGrad}
                                >
                                    {isFetching
                                        ? <ActivityIndicator color="#fff" />
                                        : <>
                                            <MaterialCommunityIcons name="file-search" size={20} color="#fff" />
                                            <Text style={styles.fetchBtnText}>Fetch Bill</Text>
                                        </>
                                    }
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* ═══════════════════════════════════════════
              STEP 3 – BILL + PAYMENT
          ══════════════════════════════════════════════ */}
                    {step === 'bill' && bill && selectedOp && (
                        <View>
                            {/* Number chip */}
                            <View style={styles.selectedOpChip}>
                                <LinearGradient
                                    colors={selectedOp.gradientColors}
                                    style={styles.chipCircle}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <Text style={styles.chipCircleText}>{selectedOp.short}</Text>
                                </LinearGradient>
                                <View>
                                    <Text style={styles.chipOpName}>{selectedOp.name} Postpaid</Text>
                                    <Text style={styles.chipMobile}>+91 {formatMobile(rawMobile)}</Text>
                                </View>
                                <TouchableOpacity style={styles.changeOpBtn} onPress={() => setStep('details')}>
                                    <Text style={styles.changeOpText}>Edit</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Bill Summary Card */}
                            <View style={styles.billCard}>
                                <View style={styles.billCardHeader}>
                                    <MaterialCommunityIcons name="receipt" size={22} color={selectedOp.textColor} />
                                    <Text style={styles.billCardTitle}>Bill Summary</Text>
                                </View>

                                <View style={styles.billRow}>
                                    <Text style={styles.billKey}>Customer Name</Text>
                                    <Text style={styles.billVal}>{bill.customerName}</Text>
                                </View>
                                <View style={styles.billRow}>
                                    <Text style={styles.billKey}>Billing Period</Text>
                                    <Text style={styles.billVal}>{bill.billingPeriod}</Text>
                                </View>
                                <View style={styles.billRow}>
                                    <Text style={styles.billKey}>Bill Amount</Text>
                                    <Text style={[styles.billVal, styles.billAmt]}>₹{bill.billAmount}</Text>
                                </View>
                                <View style={styles.billRow}>
                                    <Text style={styles.billKey}>Due Date</Text>
                                    <Text style={[styles.billVal, styles.billDue]}>{bill.dueDate}</Text>
                                </View>

                                <View style={styles.dueDateWarning}>
                                    <Ionicons name="warning-outline" size={14} color="#D97706" />
                                    <Text style={styles.dueDateWarningText}>
                                        Pay before due date to avoid late fee
                                    </Text>
                                </View>

                                {/* Last Bills expandable */}
                                <TouchableOpacity
                                    style={styles.lastBillsToggle}
                                    onPress={() => setShowLastBills(!showLastBills)}
                                >
                                    <MaterialCommunityIcons name="history" size={16} color="#6B7280" />
                                    <Text style={styles.lastBillsToggleText}>
                                        {showLastBills ? 'Hide' : 'View'} Last 3 Bills
                                    </Text>
                                    <Ionicons
                                        name={showLastBills ? 'chevron-up' : 'chevron-down'}
                                        size={14}
                                        color="#9CA3AF"
                                    />
                                </TouchableOpacity>

                                {showLastBills && (
                                    <View style={styles.lastBillsList}>
                                        {bill.lastBills.map((lb, i) => (
                                            <View key={i} style={styles.lastBillRow}>
                                                <Text style={styles.lastBillMonth}>{lb.month}</Text>
                                                <Text style={styles.lastBillAmt}>₹{lb.amount}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>

                            {/* Payment Method */}
                            <Text style={styles.sectionLabel}>Choose Payment Method</Text>
                            <View style={styles.payMethodsCard}>
                                {payMethods.map((pm) => (
                                    <TouchableOpacity
                                        key={pm.id}
                                        style={[styles.payMethodRow, paymentMethod === pm.id && styles.payMethodRowActive]}
                                        onPress={() => setPaymentMethod(pm.id)}
                                    >
                                        <View style={[styles.payMethodIcon, { backgroundColor: pm.color + '18' }]}>
                                            <Ionicons name={pm.icon as any} size={20} color={pm.color} />
                                        </View>
                                        <Text style={styles.payMethodLabel}>{pm.label}</Text>
                                        <View style={[
                                            styles.radioOuter,
                                            paymentMethod === pm.id && { borderColor: pm.color }
                                        ]}>
                                            {paymentMethod === pm.id && (
                                                <View style={[styles.radioInner, { backgroundColor: pm.color }]} />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Promo Code */}
                            <View style={styles.promoCard}>
                                <Text style={styles.promoTitle}>Have a promo code?</Text>
                                <View style={styles.promoRow}>
                                    <View style={styles.promoInput}>
                                        <MaterialCommunityIcons name="ticket-percent" size={18} color="#9CA3AF" />
                                        <TextInput
                                            style={styles.promoTextField}
                                            placeholder="Enter code (try SAVE50)"
                                            placeholderTextColor="#9CA3AF"
                                            value={promoCode}
                                            onChangeText={setPromoCode}
                                            autoCapitalize="characters"
                                            editable={!promoApplied}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        style={[styles.promoApplyBtn, promoApplied && styles.promoApplied]}
                                        onPress={handleApplyPromo}
                                        disabled={promoApplied}
                                    >
                                        <Text style={styles.promoApplyText}>
                                            {promoApplied ? '✓ Applied' : 'Apply'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                {promoApplied && (
                                    <Text style={styles.promoSaved}>🎉 ₹50 saved with SAVE50!</Text>
                                )}
                            </View>

                            {/* Spacer for sticky bar */}
                            <View style={{ height: 100 }} />
                        </View>
                    )}
                </ScrollView>

                {/* ─── STICKY PAY BAR ──────────────────────── */}
                {step === 'bill' && bill && selectedOp && (
                    <View style={styles.stickyBar}>
                        <View style={styles.stickyLeft}>
                            <Text style={styles.stickyLabel}>Total Payable</Text>
                            <View style={styles.stickyAmountRow}>
                                <Text style={styles.stickyAmount}>₹{discountedAmount}</Text>
                                {promoApplied && (
                                    <Text style={styles.stickyStrike}>₹{bill.billAmount}</Text>
                                )}
                            </View>
                        </View>
                        <TouchableOpacity style={styles.payNowBtn} onPress={handlePay}>
                            <LinearGradient
                                colors={selectedOp.gradientColors}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.payNowGrad}
                            >
                                <Ionicons name="flash" size={18} color="#fff" />
                                <Text style={styles.payNowText}>Pay Now</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )}
            </SafeAreaView>

            {/* ─── CIRCLE MODAL ────────────────────────── */}
            <Modal
                visible={showCircleModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowCircleModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalSheet}>
                        <View style={styles.modalHandle} />
                        <Text style={styles.modalTitle}>Select Circle / State</Text>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {CIRCLES.map((c) => (
                                <TouchableOpacity
                                    key={c}
                                    style={[styles.circleRow, selectedCircle === c && styles.circleRowActive]}
                                    onPress={() => { setSelectedCircle(c); setShowCircleModal(false); }}
                                >
                                    <Ionicons name="location" size={16} color={selectedCircle === c ? '#1D4ED8' : '#9CA3AF'} />
                                    <Text style={[styles.circleText, selectedCircle === c && styles.circleTextActive]}>{c}</Text>
                                    {selectedCircle === c && <Ionicons name="checkmark" size={18} color="#1D4ED8" />}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// ── STYLES ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#F8FAFF' },
    safe: { flex: 1 },

    // Header
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
    headerSub: { fontSize: 11, color: '#6B7280', marginTop: 1 },

    scroll: { padding: 16, paddingBottom: 8 },

    // Hero
    heroBanner: {
        borderRadius: 20,
        padding: 28,
        alignItems: 'center',
        marginBottom: 24,
        gap: 10,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 5,
    },
    heroTitle: { fontSize: 22, fontWeight: '800', color: '#1E3A8A', letterSpacing: -0.3 },
    heroSub: { fontSize: 13, color: '#3B82F6', fontWeight: '500' },

    sectionLabel: {
        fontSize: 15, fontWeight: '700',
        color: '#111827',
        marginBottom: 14,
        marginLeft: 2,
    },

    // Operator grid
    opGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    opCard: {
        width: '30%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 8,
        alignItems: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 3,
    },
    opCircleLarge: {
        width: 60, height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    opCircleText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
    opCardName: { fontSize: 13, fontWeight: '700', color: '#111827' },
    opCardPlan: { fontSize: 10, color: '#6B7280' },

    // Selected op chip
    selectedOpChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    chipCircle: {
        width: 44, height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chipCircleText: { color: '#fff', fontWeight: '800', fontSize: 14 },
    chipOpName: { fontSize: 14, fontWeight: '700', color: '#111827' },
    chipMobile: { fontSize: 12, color: '#6B7280', marginTop: 1 },
    changeOpBtn: {
        marginLeft: 'auto',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
    },
    changeOpText: { fontSize: 12, fontWeight: '600', color: '#1D4ED8' },

    // Details Card
    detailsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 18,
        marginBottom: 16,
        gap: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 12,
        elevation: 3,
    },
    cardSectionTitle: {
        fontSize: 15, fontWeight: '700',
        color: '#111827',
        marginBottom: 14,
    },
    fieldLabel: {
        fontSize: 12, fontWeight: '600',
        color: '#6B7280',
        marginBottom: 6,
        marginTop: 10,
        letterSpacing: 0.3,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFF',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        paddingHorizontal: 12,
        height: 52,
        gap: 10,
    },
    flagChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    flagEmoji: { fontSize: 18 },
    dialCode: { fontSize: 14, fontWeight: '700', color: '#374151' },
    dividerV: { width: 1, height: 24, backgroundColor: '#E2E8F0' },
    phoneField: { flex: 1, fontSize: 16, fontWeight: '600', color: '#111827' },
    contactBtn: {
        width: 34, height: 34,
        borderRadius: 8,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
    },

    linkMobileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 4,
        marginTop: 4,
    },
    linkMobileText: { flex: 1, fontSize: 12, color: '#6B7280', fontWeight: '500' },

    dropdownBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#F8FAFF',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        paddingHorizontal: 14,
        height: 52,
    },
    dropdownText: { flex: 1, fontSize: 15, color: '#374151', fontWeight: '500' },

    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        marginTop: 8,
    },
    toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    toggleLabel: { fontSize: 14, color: '#374151', fontWeight: '500' },

    // Fetch Button
    fetchBtn: { borderRadius: 16, overflow: 'hidden', marginBottom: 8 },
    fetchBtnDim: { opacity: 0.6 },
    fetchBtnGrad: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: 52,
    },
    fetchBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

    // Bill Card
    billCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 18,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 12,
        elevation: 3,
    },
    billCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    billCardTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 9,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    billKey: { fontSize: 13, color: '#6B7280' },
    billVal: { fontSize: 14, fontWeight: '600', color: '#111827' },
    billAmt: { fontSize: 18, fontWeight: '800', color: '#059669' },
    billDue: { color: '#DC2626' },

    dueDateWarning: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FFFBEB',
        borderRadius: 8,
        padding: 10,
        marginTop: 12,
    },
    dueDateWarningText: { fontSize: 12, color: '#92400E', flex: 1, fontWeight: '500' },

    lastBillsToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 14,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    lastBillsToggleText: { flex: 1, fontSize: 13, color: '#6B7280', fontWeight: '500' },
    lastBillsList: { marginTop: 10, gap: 8 },
    lastBillRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#F8FAFF',
        borderRadius: 8,
        padding: 10,
    },
    lastBillMonth: { fontSize: 13, color: '#374151' },
    lastBillAmt: { fontSize: 13, fontWeight: '600', color: '#1D4ED8' },

    // Payment Methods
    payMethodsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 12,
        elevation: 3,
    },
    payMethodRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    payMethodRowActive: { backgroundColor: '#F8FAFF' },
    payMethodIcon: {
        width: 40, height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    payMethodLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: '#111827' },
    radioOuter: {
        width: 20, height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioInner: { width: 10, height: 10, borderRadius: 5 },

    // Promo
    promoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 12,
        elevation: 3,
    },
    promoTitle: { fontSize: 13, color: '#6B7280', fontWeight: '500', marginBottom: 10 },
    promoRow: { flexDirection: 'row', gap: 10 },
    promoInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#F8FAFF',
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        paddingHorizontal: 12,
        height: 44,
    },
    promoTextField: { flex: 1, fontSize: 13, color: '#111827' },
    promoApplyBtn: {
        backgroundColor: '#1D4ED8',
        borderRadius: 10,
        paddingHorizontal: 18,
        justifyContent: 'center',
        height: 44,
    },
    promoApplied: { backgroundColor: '#059669' },
    promoApplyText: { color: '#fff', fontWeight: '700', fontSize: 13 },
    promoSaved: { fontSize: 12, color: '#059669', fontWeight: '600', marginTop: 8 },

    // Sticky bar
    stickyBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 12,
    },
    stickyLeft: { flex: 1 },
    stickyLabel: { fontSize: 11, color: '#6B7280', fontWeight: '500' },
    stickyAmountRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
    stickyAmount: { fontSize: 22, fontWeight: '800', color: '#111827' },
    stickyStrike: {
        fontSize: 14,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
        marginTop: 3,
    },
    payNowBtn: { borderRadius: 14, overflow: 'hidden' },
    payNowGrad: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingHorizontal: 28,
        height: 50,
    },
    payNowText: { color: '#fff', fontWeight: '800', fontSize: 15 },

    // Circle Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
    modalSheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '72%',
        paddingBottom: 30,
    },
    modalHandle: {
        width: 40, height: 4,
        borderRadius: 2,
        backgroundColor: '#E5E7EB',
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 16, fontWeight: '700',
        color: '#111827',
        paddingHorizontal: 20,
        marginBottom: 8,
    },
    circleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 13,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F8FAFF',
    },
    circleRowActive: { backgroundColor: '#EFF6FF' },
    circleText: { flex: 1, fontSize: 14, color: '#374151' },
    circleTextActive: { color: '#1D4ED8', fontWeight: '600' },
});