import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
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

// ── BROADBAND PROVIDERS ────────────────────────────────────────
const PROVIDERS = [
    { id: 'airtel', name: 'Airtel Xstream Fiber', short: 'A', color: '#E11900', bg: '#FFF0EE', icon: 'wifi' },
    { id: 'jio', name: 'JioFiber', short: 'J', color: '#005AB5', bg: '#EEF4FF', icon: 'wifi' },
    { id: 'bsnl', name: 'BSNL Broadband', short: 'B', color: '#1B5E20', bg: '#F0FAF0', icon: 'wifi' },
    { id: 'act', name: 'ACT Fibernet', short: 'ACT', color: '#7C3AED', bg: '#F5F0FF', icon: 'wifi' },
    { id: 'tata', name: 'Tata Play Fiber', short: 'T', color: '#0EA5E9', bg: '#EFF9FF', icon: 'wifi' },
    { id: 'hathway', name: 'Hathway', short: 'H', color: '#D97706', bg: '#FFFBEB', icon: 'wifi' },
    { id: 'tikona', name: 'Tikona', short: 'TK', color: '#059669', bg: '#ECFDF5', icon: 'wifi' },
    { id: 'you', name: 'YOU Broadband', short: 'Y', color: '#DC2626', bg: '#FEF2F2', icon: 'wifi' },
    { id: 'excitel', name: 'Excitel', short: 'EX', color: '#4F46E5', bg: '#EEF2FF', icon: 'wifi' },
    { id: 'localIsp', name: 'Local ISP / Others', short: '⚙', color: '#6B7280', bg: '#F9FAFB', icon: 'wifi' },
];

const CIRCLES = [
    'Andhra Pradesh', 'Assam', 'Bihar & Jharkhand', 'Chennai',
    'Delhi & NCR', 'Gujarat', 'Haryana', 'Himachal Pradesh',
    'Jammu & Kashmir', 'Karnataka', 'Kerala', 'Kolkata',
    'Madhya Pradesh', 'Maharashtra', 'Mumbai', 'North East',
    'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu',
    'UP East', 'UP West', 'West Bengal',
];

const PAY_METHODS = [
    { id: 'upi', label: 'UPI', icon: 'qr-code', color: '#7C3AED' },
    { id: 'debit', label: 'Debit Card', icon: 'card', color: '#0EA5E9' },
    { id: 'credit', label: 'Credit Card', icon: 'card-outline', color: '#F59E0B' },
    { id: 'netbanking', label: 'Net Banking', icon: 'business', color: '#10B981' },
    { id: 'wallet', label: 'Wallet Balance', icon: 'wallet', color: '#EC4899' },
];

// Mock bill data returned after fetch
const MOCK_BILL = {
    customerName: 'Suresh Patil',
    address: 'Flat 3B, Shivaji Nagar, Pune - 411005',
    billingPeriod: '01 Jan – 31 Jan 2026',
    planName: '100 Mbps Unlimited Plan',
    billAmount: 849,
    dueDate: '20 Feb 2026',
    lateFee: 100,
    breakdown: {
        planCharges: 719,
        gst: 130,
        addons: 0,
        lateFee: 0,
    },
};

export default function BroadbandBillScreen() {
    const router = useRouter();

    // ── STATE ──────────────────────────────────────────────────
    const [selectedProvider, setSelectedProvider] = useState<typeof PROVIDERS[0] | null>(null);
    const [accountNumber, setAccountNumber] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [selectedCircle, setSelectedCircle] = useState('Maharashtra');
    const [isFetching, setIsFetching] = useState(false);
    const [bill, setBill] = useState<typeof MOCK_BILL | null>(null);
    const [fetchError, setFetchError] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);
    const [showBreakdown, setShowBreakdown] = useState(false);
    const [showLastBills, setShowLastBills] = useState(false);
    const [saveConnection, setSaveConnection] = useState(false);
    const [autoPay, setAutoPay] = useState(false);
    const [showProviderModal, setShowProviderModal] = useState(false);
    const [showCircleModal, setShowCircleModal] = useState(false);

    // ── VALIDATION ────────────────────────────────────────────
    const canFetch =
        selectedProvider !== null &&
        accountNumber.length >= 6 &&
        (mobileNumber === '' || mobileNumber.length === 10);

    // ── FETCH BILL ─────────────────────────────────────────────
    const handleFetchBill = () => {
        setIsFetching(true);
        setFetchError(false);
        setBill(null);

        setTimeout(() => {
            // Simulate: if account starts with '000' → error
            if (accountNumber.startsWith('000')) {
                setFetchError(true);
            } else {
                setBill(MOCK_BILL);
            }
            setIsFetching(false);
        }, 2200);
    };

    // ── PROMO ──────────────────────────────────────────────────
    const handleApplyPromo = () => {
        if (promoCode.trim().toUpperCase() === 'BROAD50') {
            setPromoApplied(true);
        } else {
            Alert.alert('Invalid Code', 'Try BROAD50 for ₹50 off!');
        }
    };

    const discount = promoApplied ? 50 : 0;
    const totalPayable = bill ? bill.billAmount - discount : 0;

    // ── PAY ────────────────────────────────────────────────────
    const handlePay = () => {
        Alert.alert(
            'Confirm Payment',
            `Pay ₹${totalPayable} for ${accountNumber}\nvia ${paymentMethod.toUpperCase()}`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Confirm', onPress: () => Alert.alert('✅ Payment Successful!', 'Your broadband bill is paid.') },
            ]
        );
    };

    return (
        <View style={s.root}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <SafeAreaView style={s.safe}>

                {/* ─── HEADER ─────────────────────────────────── */}
                <View style={s.header}>
                    <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={22} color="#111827" />
                    </TouchableOpacity>
                    <View style={s.headerMid}>
                        <Text style={s.headerTitle}>Broadband Bill</Text>
                        {selectedProvider && (
                            <Text style={s.headerSub}>{selectedProvider.name}</Text>
                        )}
                    </View>
                    <TouchableOpacity style={s.backBtn}>
                        <Ionicons name="information-circle-outline" size={22} color="#6B7280" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={s.scroll}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* ─── BANNER ─────────────────────────────────── */}
                    <LinearGradient
                        colors={['#EFF6FF', '#DBEAFE', '#EFF6FF']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        style={s.banner}
                    >
                        <View style={s.bannerIconWrap}>
                            <MaterialCommunityIcons name="wifi" size={34} color="#1D4ED8" />
                        </View>
                        <View style={s.bannerText}>
                            <Text style={s.bannerTitle}>Broadband Bill Payment</Text>
                            <Text style={s.bannerSub}>10+ providers • Instant confirmation</Text>
                        </View>
                    </LinearGradient>

                    {/* ─── DETAILS CARD ────────────────────────────── */}
                    <View style={s.card}>
                        <Text style={s.cardTitle}>Enter Connection Details</Text>

                        {/* Provider */}
                        <Text style={s.fieldLabel}>Broadband Provider *</Text>
                        <TouchableOpacity style={s.dropRow} onPress={() => setShowProviderModal(true)}>
                            {selectedProvider ? (
                                <View style={[s.providerDot, { backgroundColor: selectedProvider.color }]}>
                                    <Text style={s.providerDotText}>{selectedProvider.short}</Text>
                                </View>
                            ) : (
                                <MaterialCommunityIcons name="wifi" size={18} color="#9CA3AF" />
                            )}
                            <Text style={[s.dropText, !selectedProvider && s.dropPlaceholder]}>
                                {selectedProvider ? selectedProvider.name : 'Select broadband provider'}
                            </Text>
                            <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
                        </TouchableOpacity>

                        {/* Account Number */}
                        <Text style={s.fieldLabel}>Account Number / Customer ID *</Text>
                        <View style={s.inputWrap}>
                            <MaterialCommunityIcons name="identifier" size={18} color="#9CA3AF" />
                            <TextInput
                                style={s.textField}
                                placeholder="Enter account / customer ID"
                                placeholderTextColor="#9CA3AF"
                                autoCapitalize="characters"
                                value={accountNumber}
                                onChangeText={setAccountNumber}
                                maxLength={20}
                            />
                        </View>
                        <Text style={s.helperText}>Min 6 characters (varies by provider)</Text>

                        {/* Mobile */}
                        <Text style={s.fieldLabel}>Registered Mobile (Optional)</Text>
                        <View style={s.inputWrap}>
                            <View style={s.dialChip}>
                                <Text style={s.flagTxt}>🇮🇳</Text>
                                <Text style={s.dialTxt}>+91</Text>
                            </View>
                            <View style={s.divV} />
                            <TextInput
                                style={s.textField}
                                placeholder="10-digit mobile"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="phone-pad"
                                maxLength={10}
                                value={mobileNumber}
                                onChangeText={setMobileNumber}
                            />
                        </View>
                        {mobileNumber.length > 0 && mobileNumber.length < 10 && (
                            <Text style={s.errorTxt}>Enter valid 10-digit number</Text>
                        )}

                        {/* Circle */}
                        <Text style={s.fieldLabel}>Circle / State</Text>
                        <TouchableOpacity style={s.dropRow} onPress={() => setShowCircleModal(true)}>
                            <Ionicons name="location-outline" size={18} color="#9CA3AF" />
                            <Text style={s.dropText}>{selectedCircle}</Text>
                            <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
                        </TouchableOpacity>

                        {/* Toggles */}
                        <View style={s.toggleRow}>
                            <View style={s.toggleLeft}>
                                <Ionicons name="star-outline" size={17} color="#F59E0B" />
                                <Text style={s.toggleLabel}>Save connection</Text>
                            </View>
                            <Switch
                                value={saveConnection}
                                onValueChange={setSaveConnection}
                                trackColor={{ false: '#E5E7EB', true: '#FEF3C7' }}
                                thumbColor={saveConnection ? '#F59E0B' : '#fff'}
                            />
                        </View>
                        <View style={s.toggleRow}>
                            <View style={s.toggleLeft}>
                                <MaterialCommunityIcons name="autorenew" size={17} color="#10B981" />
                                <Text style={s.toggleLabel}>Enable AutoPay</Text>
                            </View>
                            <Switch
                                value={autoPay}
                                onValueChange={setAutoPay}
                                trackColor={{ false: '#E5E7EB', true: '#D1FAE5' }}
                                thumbColor={autoPay ? '#10B981' : '#fff'}
                            />
                        </View>
                    </View>

                    {/* ─── FETCH BUTTON ──────────────────────────── */}
                    <TouchableOpacity
                        style={[s.fetchBtn, !canFetch && s.fetchBtnDim]}
                        onPress={handleFetchBill}
                        disabled={!canFetch || isFetching}
                        activeOpacity={0.88}
                    >
                        <LinearGradient
                            colors={canFetch ? ['#1D4ED8', '#2563EB'] : ['#D1D5DB', '#9CA3AF']}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={s.fetchGrad}
                        >
                            {isFetching
                                ? <ActivityIndicator color="#fff" />
                                : <>
                                    <MaterialCommunityIcons name="file-find" size={20} color="#fff" />
                                    <Text style={s.fetchTxt}>Fetch Bill</Text>
                                </>
                            }
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* ─── ERROR CARD ────────────────────────────── */}
                    {fetchError && (
                        <View style={s.errorCard}>
                            <View style={s.errorIconWrap}>
                                <Ionicons name="close-circle" size={36} color="#DC2626" />
                            </View>
                            <Text style={s.errorCardTitle}>Account Not Found</Text>
                            <Text style={s.errorCardSub}>Please check your Customer ID and try again</Text>
                            <TouchableOpacity
                                style={s.editBtn}
                                onPress={() => { setFetchError(false); setAccountNumber(''); }}
                            >
                                <Text style={s.editBtnTxt}>Edit Details</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* ─── BILL SUMMARY ─────────────────────────── */}
                    {bill && !fetchError && (
                        <>
                            <View style={s.billCard}>
                                <View style={s.billCardHeader}>
                                    <MaterialCommunityIcons name="receipt" size={22} color={selectedProvider?.color ?? '#1D4ED8'} />
                                    <Text style={s.billCardTitle}>Bill Details</Text>
                                </View>

                                <View style={s.billRow}>
                                    <Text style={s.billKey}>Customer Name</Text>
                                    <Text style={s.billVal}>{bill.customerName}</Text>
                                </View>
                                <View style={s.billRow}>
                                    <Text style={s.billKey}>Plan</Text>
                                    <Text style={s.billVal}>{bill.planName}</Text>
                                </View>
                                <View style={s.billRow}>
                                    <Text style={s.billKey}>Billing Period</Text>
                                    <Text style={s.billVal}>{bill.billingPeriod}</Text>
                                </View>
                                <View style={s.billRow}>
                                    <Text style={s.billKey}>Address</Text>
                                    <Text style={[s.billVal, s.billAddr]}>{bill.address}</Text>
                                </View>
                                <View style={s.billRow}>
                                    <Text style={s.billKey}>Due Date</Text>
                                    <Text style={[s.billVal, s.dueTxt]}>{bill.dueDate}</Text>
                                </View>
                                <View style={[s.billRow, s.billRowLast]}>
                                    <Text style={s.billKey}>Bill Amount</Text>
                                    <Text style={s.billAmtTxt}>₹{bill.billAmount}</Text>
                                </View>

                                {/* Urgency line */}
                                <View style={s.urgencyBanner}>
                                    <Ionicons name="time-outline" size={14} color="#B45309" />
                                    <Text style={s.urgencyTxt}>
                                        Pay ₹{bill.billAmount} before {bill.dueDate} to avoid late fee of ₹{bill.lateFee}
                                    </Text>
                                </View>

                                {/* Breakdown accordion */}
                                <TouchableOpacity
                                    style={s.accordionHeader}
                                    onPress={() => setShowBreakdown(!showBreakdown)}
                                >
                                    <MaterialCommunityIcons name="format-list-bulleted" size={16} color="#6B7280" />
                                    <Text style={s.accordionTxt}>
                                        {showBreakdown ? 'Hide' : 'View'} Bill Breakdown
                                    </Text>
                                    <Ionicons
                                        name={showBreakdown ? 'chevron-up' : 'chevron-down'}
                                        size={14} color="#9CA3AF"
                                    />
                                </TouchableOpacity>

                                {showBreakdown && (
                                    <View style={s.breakdownBox}>
                                        <View style={s.bdRow}>
                                            <Text style={s.bdKey}>Plan Charges</Text>
                                            <Text style={s.bdVal}>₹{bill.breakdown.planCharges}</Text>
                                        </View>
                                        <View style={s.bdRow}>
                                            <Text style={s.bdKey}>GST (18%)</Text>
                                            <Text style={s.bdVal}>₹{bill.breakdown.gst}</Text>
                                        </View>
                                        <View style={s.bdRow}>
                                            <Text style={s.bdKey}>Add-ons</Text>
                                            <Text style={s.bdVal}>
                                                {bill.breakdown.addons > 0 ? `₹${bill.breakdown.addons}` : '—'}
                                            </Text>
                                        </View>
                                        <View style={s.bdRow}>
                                            <Text style={s.bdKey}>Late Fee</Text>
                                            <Text style={[s.bdVal, bill.breakdown.lateFee > 0 && s.lateFeeRed]}>
                                                {bill.breakdown.lateFee > 0 ? `₹${bill.breakdown.lateFee}` : '—'}
                                            </Text>
                                        </View>
                                        <View style={s.bdDivider} />
                                        <View style={s.bdRow}>
                                            <Text style={s.bdTotal}>Total</Text>
                                            <Text style={s.bdTotal}>₹{bill.billAmount}</Text>
                                        </View>
                                    </View>
                                )}
                            </View>

                            {/* ─── PAYMENT METHOD ─────────────────────── */}
                            <Text style={s.sectionLabel}>Choose Payment Method</Text>
                            <View style={s.payCard}>
                                {PAY_METHODS.map((pm, i) => (
                                    <TouchableOpacity
                                        key={pm.id}
                                        style={[
                                            s.payRow,
                                            paymentMethod === pm.id && s.payRowActive,
                                            i === PAY_METHODS.length - 1 && s.payRowLast,
                                        ]}
                                        onPress={() => setPaymentMethod(pm.id)}
                                    >
                                        <View style={[s.payIcon, { backgroundColor: pm.color + '18' }]}>
                                            <Ionicons name={pm.icon as any} size={20} color={pm.color} />
                                        </View>
                                        <Text style={s.payLabel}>{pm.label}</Text>
                                        <View style={[s.radio, paymentMethod === pm.id && { borderColor: pm.color }]}>
                                            {paymentMethod === pm.id && (
                                                <View style={[s.radioFill, { backgroundColor: pm.color }]} />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* ─── PROMO CODE ─────────────────────────── */}
                            <View style={s.promoCard}>
                                <Text style={s.promoHint}>Have a promo code?</Text>
                                <View style={s.promoRow}>
                                    <View style={s.promoInputWrap}>
                                        <MaterialCommunityIcons name="ticket-percent-outline" size={17} color="#9CA3AF" />
                                        <TextInput
                                            style={s.promoInput}
                                            placeholder='Enter code (try BROAD50)'
                                            placeholderTextColor="#9CA3AF"
                                            value={promoCode}
                                            onChangeText={setPromoCode}
                                            autoCapitalize="characters"
                                            editable={!promoApplied}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        style={[s.applyBtn, promoApplied && s.applyBtnGreen]}
                                        onPress={handleApplyPromo}
                                        disabled={promoApplied}
                                    >
                                        <Text style={s.applyTxt}>{promoApplied ? '✓ Applied' : 'Apply'}</Text>
                                    </TouchableOpacity>
                                </View>
                                {promoApplied && (
                                    <Text style={s.promoSaved}>🎉 ₹50 saved with BROAD50!</Text>
                                )}
                            </View>

                            {/* spacer */}
                            <View style={{ height: 100 }} />
                        </>
                    )}
                </ScrollView>

                {/* ─── STICKY PAY BAR ──────────────────────────── */}
                {bill && !fetchError && (
                    <View style={s.stickyBar}>
                        <View>
                            <Text style={s.stickyLabel}>Total Payable</Text>
                            <View style={s.stickyAmtRow}>
                                <Text style={s.stickyAmt}>₹{totalPayable}</Text>
                                {promoApplied && (
                                    <Text style={s.stickyStrike}>₹{bill.billAmount}</Text>
                                )}
                            </View>
                        </View>
                        <TouchableOpacity style={s.payNowBtn} onPress={handlePay} activeOpacity={0.88}>
                            <LinearGradient
                                colors={['#1D4ED8', '#2563EB']}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                style={s.payNowGrad}
                            >
                                <Ionicons name="flash" size={18} color="#fff" />
                                <Text style={s.payNowTxt}>Pay Now</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )}
            </SafeAreaView>

            {/* ─── PROVIDER MODAL ──────────────────────────── */}
            <Modal
                visible={showProviderModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowProviderModal(false)}
            >
                <View style={s.modalOverlay}>
                    <View style={s.modalSheet}>
                        <View style={s.sheetHandle} />
                        <Text style={s.sheetTitle}>Select Broadband Provider</Text>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {PROVIDERS.map((p) => (
                                <TouchableOpacity
                                    key={p.id}
                                    style={[s.sheetRow, selectedProvider?.id === p.id && s.sheetRowActive]}
                                    onPress={() => { setSelectedProvider(p); setShowProviderModal(false); }}
                                >
                                    <View style={[s.sheetDot, { backgroundColor: p.color + '22' }]}>
                                        <Text style={[s.sheetDotTxt, { color: p.color }]}>{p.short}</Text>
                                    </View>
                                    <Text style={[s.sheetRowTxt, selectedProvider?.id === p.id && s.sheetRowTxtActive]}>
                                        {p.name}
                                    </Text>
                                    {selectedProvider?.id === p.id && (
                                        <Ionicons name="checkmark-circle" size={22} color="#1D4ED8" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* ─── CIRCLE MODAL ────────────────────────────── */}
            <Modal
                visible={showCircleModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowCircleModal(false)}
            >
                <View style={s.modalOverlay}>
                    <View style={s.modalSheet}>
                        <View style={s.sheetHandle} />
                        <Text style={s.sheetTitle}>Select Circle / State</Text>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {CIRCLES.map((c) => (
                                <TouchableOpacity
                                    key={c}
                                    style={[s.sheetRow, selectedCircle === c && s.sheetRowActive]}
                                    onPress={() => { setSelectedCircle(c); setShowCircleModal(false); }}
                                >
                                    <Ionicons name="location" size={16} color={selectedCircle === c ? '#1D4ED8' : '#9CA3AF'} />
                                    <Text style={[s.sheetRowTxt, selectedCircle === c && s.sheetRowTxtActive]}>{c}</Text>
                                    {selectedCircle === c && (
                                        <Ionicons name="checkmark" size={18} color="#1D4ED8" />
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

// ── STYLES ──────────────────────────────────────────────────────
const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#F8FAFF' },
    safe: { flex: 1 },

    // Header
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingTop: 52, paddingBottom: 14,
        backgroundColor: '#fff',
        borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    },
    backBtn: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: '#F1F5F9',
        alignItems: 'center', justifyContent: 'center',
    },
    headerMid: { flex: 1, alignItems: 'center' },
    headerTitle: { fontSize: 17, fontWeight: '700', color: '#111827' },
    headerSub: { fontSize: 11, color: '#6B7280', marginTop: 1 },

    scroll: { padding: 16, paddingBottom: 8 },

    // Banner
    banner: {
        flexDirection: 'row', alignItems: 'center', gap: 14,
        borderRadius: 20, padding: 18, marginBottom: 16,
        shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12, shadowRadius: 16, elevation: 5,
    },
    bannerIconWrap: {
        width: 56, height: 56, borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center', justifyContent: 'center',
    },
    bannerText: { flex: 1 },
    bannerTitle: { fontSize: 16, fontWeight: '800', color: '#1E3A8A', marginBottom: 3 },
    bannerSub: { fontSize: 12, color: '#3B82F6', fontWeight: '500' },

    // Card
    card: {
        backgroundColor: '#fff', borderRadius: 20, padding: 18,
        marginBottom: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07, shadowRadius: 12, elevation: 3,
    },
    cardTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 16 },

    fieldLabel: {
        fontSize: 12, fontWeight: '600', color: '#6B7280',
        marginTop: 12, marginBottom: 7, letterSpacing: 0.3,
    },

    // Dropdown row
    dropRow: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: '#F8FAFF', borderRadius: 12,
        borderWidth: 1.5, borderColor: '#E2E8F0',
        paddingHorizontal: 14, height: 52,
    },
    dropText: { flex: 1, fontSize: 14, color: '#374151', fontWeight: '500' },
    dropPlaceholder: { color: '#9CA3AF', fontWeight: '400' },
    providerDot: {
        width: 30, height: 30, borderRadius: 15,
        alignItems: 'center', justifyContent: 'center',
    },
    providerDotText: { color: '#fff', fontSize: 11, fontWeight: '700' },

    // Input
    inputWrap: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: '#F8FAFF', borderRadius: 12,
        borderWidth: 1.5, borderColor: '#E2E8F0',
        paddingHorizontal: 14, height: 52,
    },
    textField: { flex: 1, fontSize: 15, color: '#111827', fontWeight: '500' },
    helperText: { fontSize: 11, color: '#9CA3AF', marginTop: 5, marginLeft: 2 },
    errorTxt: { fontSize: 11, color: '#DC2626', marginTop: 5, marginLeft: 2 },

    dialChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    flagTxt: { fontSize: 18 },
    dialTxt: { fontSize: 13, fontWeight: '700', color: '#374151' },
    divV: { width: 1, height: 24, backgroundColor: '#E2E8F0' },

    // Toggles
    toggleRow: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9', marginTop: 6,
    },
    toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    toggleLabel: { fontSize: 14, color: '#374151', fontWeight: '500' },

    // Fetch button
    fetchBtn: { borderRadius: 16, overflow: 'hidden', marginBottom: 8 },
    fetchBtnDim: { opacity: 0.55 },
    fetchGrad: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 9, height: 54,
    },
    fetchTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },

    // Error card
    errorCard: {
        backgroundColor: '#FEF2F2', borderRadius: 16, padding: 24,
        alignItems: 'center', marginBottom: 16,
        borderWidth: 1, borderColor: '#FECACA',
    },
    errorIconWrap: {
        width: 64, height: 64, borderRadius: 32,
        backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
    },
    errorCardTitle: { fontSize: 17, fontWeight: '700', color: '#991B1B', marginBottom: 6 },
    errorCardSub: { fontSize: 13, color: '#B91C1C', textAlign: 'center', marginBottom: 16 },
    editBtn: {
        backgroundColor: '#DC2626', borderRadius: 12,
        paddingHorizontal: 28, paddingVertical: 11,
    },
    editBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },

    // Bill card
    billCard: {
        backgroundColor: '#fff', borderRadius: 20, padding: 18, marginBottom: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07, shadowRadius: 12, elevation: 3,
    },
    billCardHeader: {
        flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14,
    },
    billCardTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
    billRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
        paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    },
    billRowLast: { borderBottomWidth: 0 },
    billKey: { fontSize: 13, color: '#6B7280', flex: 1 },
    billVal: { fontSize: 13, fontWeight: '600', color: '#111827', flex: 1, textAlign: 'right' },
    billAddr: { fontSize: 12, lineHeight: 18 },
    dueTxt: { color: '#DC2626' },
    billAmtTxt: { fontSize: 20, fontWeight: '800', color: '#059669', textAlign: 'right' },

    urgencyBanner: {
        flexDirection: 'row', alignItems: 'center', gap: 7,
        backgroundColor: '#FFFBEB', borderRadius: 10, padding: 11, marginTop: 14,
    },
    urgencyTxt: { flex: 1, fontSize: 12, color: '#92400E', fontWeight: '500', lineHeight: 17 },

    // Breakdown
    accordionHeader: {
        flexDirection: 'row', alignItems: 'center', gap: 7,
        marginTop: 14, paddingTop: 12,
        borderTopWidth: 1, borderTopColor: '#F1F5F9',
    },
    accordionTxt: { flex: 1, fontSize: 13, color: '#6B7280', fontWeight: '500' },
    breakdownBox: {
        backgroundColor: '#F8FAFF', borderRadius: 12,
        padding: 14, marginTop: 10, gap: 10,
    },
    bdRow: { flexDirection: 'row', justifyContent: 'space-between' },
    bdKey: { fontSize: 13, color: '#6B7280' },
    bdVal: { fontSize: 13, fontWeight: '600', color: '#374151' },
    lateFeeRed: { color: '#DC2626' },
    bdDivider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 4 },
    bdTotal: { fontSize: 14, fontWeight: '800', color: '#111827' },

    // Section label
    sectionLabel: {
        fontSize: 15, fontWeight: '700', color: '#111827',
        marginBottom: 12, marginLeft: 2,
    },

    // Payment methods
    payCard: {
        backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', marginBottom: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07, shadowRadius: 12, elevation: 3,
    },
    payRow: {
        flexDirection: 'row', alignItems: 'center', gap: 14,
        paddingHorizontal: 16, paddingVertical: 14,
        borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    },
    payRowActive: { backgroundColor: '#F8FAFF' },
    payRowLast: { borderBottomWidth: 0 },
    payIcon: {
        width: 42, height: 42, borderRadius: 12,
        alignItems: 'center', justifyContent: 'center',
    },
    payLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: '#111827' },
    radio: {
        width: 20, height: 20, borderRadius: 10,
        borderWidth: 2, borderColor: '#D1D5DB',
        alignItems: 'center', justifyContent: 'center',
    },
    radioFill: { width: 10, height: 10, borderRadius: 5 },

    // Promo
    promoCard: {
        backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07, shadowRadius: 12, elevation: 3,
    },
    promoHint: { fontSize: 12, color: '#6B7280', fontWeight: '500', marginBottom: 10 },
    promoRow: { flexDirection: 'row', gap: 10 },
    promoInputWrap: {
        flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: '#F8FAFF', borderRadius: 10,
        borderWidth: 1.5, borderColor: '#E2E8F0',
        paddingHorizontal: 12, height: 44,
    },
    promoInput: { flex: 1, fontSize: 13, color: '#111827' },
    applyBtn: {
        backgroundColor: '#1D4ED8', borderRadius: 10,
        paddingHorizontal: 18, justifyContent: 'center', height: 44,
    },
    applyBtnGreen: { backgroundColor: '#059669' },
    applyTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },
    promoSaved: { fontSize: 12, color: '#059669', fontWeight: '600', marginTop: 8 },

    // Sticky bar
    stickyBar: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1, borderTopColor: '#F1F5F9',
        shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08, shadowRadius: 12, elevation: 12,
    },
    stickyLabel: { fontSize: 11, color: '#6B7280', fontWeight: '500', flex: 1 },
    stickyAmtRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 2 },
    stickyAmt: { fontSize: 22, fontWeight: '800', color: '#111827' },
    stickyStrike: { fontSize: 14, color: '#9CA3AF', textDecorationLine: 'line-through', marginTop: 3 },
    payNowBtn: { borderRadius: 14, overflow: 'hidden' },
    payNowGrad: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 7, paddingHorizontal: 28, height: 52,
    },
    payNowTxt: { color: '#fff', fontWeight: '800', fontSize: 15 },

    // Modals
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end',
    },
    modalSheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        maxHeight: '75%', paddingBottom: 30,
    },
    sheetHandle: {
        width: 40, height: 4, borderRadius: 2, backgroundColor: '#E5E7EB',
        alignSelf: 'center', marginTop: 12, marginBottom: 14,
    },
    sheetTitle: {
        fontSize: 16, fontWeight: '700', color: '#111827',
        paddingHorizontal: 20, marginBottom: 8,
    },
    sheetRow: {
        flexDirection: 'row', alignItems: 'center', gap: 14,
        paddingVertical: 13, paddingHorizontal: 20,
        borderBottomWidth: 1, borderBottomColor: '#F8FAFF',
    },
    sheetRowActive: { backgroundColor: '#EFF6FF' },
    sheetDot: {
        width: 36, height: 36, borderRadius: 18,
        alignItems: 'center', justifyContent: 'center',
    },
    sheetDotTxt: { fontSize: 11, fontWeight: '800' },
    sheetRowTxt: { flex: 1, fontSize: 14, color: '#374151' },
    sheetRowTxtActive: { color: '#1D4ED8', fontWeight: '600' },
});