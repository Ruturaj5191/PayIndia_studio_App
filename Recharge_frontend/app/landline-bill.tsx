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
//  DATA — Landline Operators
// ============================================================

const landlineOperators = [
    {
        id: 'bsnl',
        name: 'BSNL Landline',
        shortName: 'B',
        brandColor: '#1B5E20',
        requiresAccountId: false,
    },
    {
        id: 'mtnl',
        name: 'MTNL',
        shortName: 'M',
        brandColor: '#4A148C',
        requiresAccountId: false,
    },
    {
        id: 'airtel',
        name: 'Airtel Landline',
        shortName: 'A',
        brandColor: '#E11900',
        requiresAccountId: true,
    },
    {
        id: 'tata',
        name: 'Tata Tele Services',
        shortName: 'T',
        brandColor: '#0EA5E9',
        requiresAccountId: true,
    },
    {
        id: 'reliance',
        name: 'Reliance Communications',
        shortName: 'R',
        brandColor: '#1565C0',
        requiresAccountId: false,
    },
    {
        id: 'local',
        name: 'Local Operator / Others',
        shortName: '⚙',
        brandColor: '#6B7280',
        requiresAccountId: false,
    },
];

// ============================================================
//  DATA — Indian Circles / States
// ============================================================

const indianCircles = [
    'Andhra Pradesh',
    'Assam',
    'Bihar & Jharkhand',
    'Chennai',
    'Delhi & NCR',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jammu & Kashmir',
    'Karnataka',
    'Kerala',
    'Kolkata',
    'Madhya Pradesh',
    'Maharashtra',
    'Mumbai',
    'North East',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Tamil Nadu',
    'UP East',
    'UP West',
    'West Bengal',
];

// ============================================================
//  DATA — Payment Methods
// ============================================================

const paymentMethods = [
    {
        id: 'upi',
        label: 'UPI',
        iconName: 'qr-code',
        iconColor: '#7C3AED',
    },
    {
        id: 'debit',
        label: 'Debit Card',
        iconName: 'card',
        iconColor: '#0EA5E9',
    },
    {
        id: 'credit',
        label: 'Credit Card',
        iconName: 'card-outline',
        iconColor: '#F59E0B',
    },
    {
        id: 'netbanking',
        label: 'Net Banking',
        iconName: 'business',
        iconColor: '#10B981',
    },
    {
        id: 'wallet',
        label: 'Wallet Balance',
        iconName: 'wallet',
        iconColor: '#EC4899',
    },
];

// ============================================================
//  DATA — Mock Bill (replace with real API response)
// ============================================================

const mockBillData = {
    customerName: 'Ramesh Deshmukh',
    landlineNumber: '020-24567890',
    billingAddress: '12, MG Road, Shivajinagar, Pune - 411004',
    billingPeriod: '01 Jan – 31 Jan 2026',
    totalAmount: 620,
    dueDate: '18 Feb 2026',
    breakdown: {
        monthlyRental: 350,
        usageCharges: 180,
        gstAmount: 94,
        previousDues: 0,
        adjustments: -4,
    },
};

// ============================================================
//  COMPONENT
// ============================================================

export default function LandlineBillScreen() {
    const router = useRouter();

    // ── State Variables ──────────────────────────────────────

    // Selected operator object (null = not yet selected)
    const [selectedOperator, setSelectedOperator] = useState<typeof landlineOperators[0] | null>(null);

    // User input fields
    const [stdCode, setStdCode] = useState('');
    const [landlineNumber, setLandlineNumber] = useState('');
    const [accountId, setAccountId] = useState('');
    const [selectedCircle, setSelectedCircle] = useState('Maharashtra');

    // Fetch bill states
    const [isFetchingBill, setIsFetchingBill] = useState(false);
    const [billData, setBillData] = useState<typeof mockBillData | null>(null);
    const [hasFetchError, setHasFetchError] = useState(false);

    // Payment states
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');
    const [promoCodeText, setPromoCodeText] = useState('');
    const [isPromoApplied, setIsPromoApplied] = useState(false);

    // Accordion open/close
    const [showBillBreakdown, setShowBillBreakdown] = useState(false);

    // Toggle switches
    const [isSaveConnectionOn, setIsSaveConnectionOn] = useState(false);
    const [isAutoPayOn, setIsAutoPayOn] = useState(false);

    // Modal visibility
    const [isOperatorModalVisible, setIsOperatorModalVisible] = useState(false);
    const [isCircleModalVisible, setIsCircleModalVisible] = useState(false);

    // ── Derived / Computed Values ────────────────────────────

    // Fetch button enabled only when required fields are filled
    const canFetchBill =
        selectedOperator !== null &&
        stdCode.length >= 2 &&
        stdCode.length <= 5 &&
        landlineNumber.length >= 6 &&
        landlineNumber.length <= 8;

    // Preview: combined display of STD + landline
    const landlinePreview =
        stdCode && landlineNumber ? `${stdCode} - ${landlineNumber}` : '';

    // Whether this operator needs Account ID (dynamic field)
    const operatorNeedsAccountId = selectedOperator?.requiresAccountId ?? false;

    // Promo discount
    const promoDiscount = isPromoApplied ? 50 : 0;

    // Final payable amount after discount
    const totalPayableAmount = billData ? billData.totalAmount - promoDiscount : 0;

    // ── Handlers ─────────────────────────────────────────────

    // When user picks an operator from the modal
    const handleOperatorSelect = (operator: typeof landlineOperators[0]) => {
        setSelectedOperator(operator);
        setIsOperatorModalVisible(false);
        // Clear account ID if new operator doesn't need it
        if (!operator.requiresAccountId) {
            setAccountId('');
        }
    };

    // When user picks a circle from the modal
    const handleCircleSelect = (circle: string) => {
        setSelectedCircle(circle);
        setIsCircleModalVisible(false);
    };

    // Allow only numeric input for STD code
    const handleStdCodeChange = (text: string) => {
        const onlyDigits = text.replace(/\D/g, '');
        setStdCode(onlyDigits);
    };

    // Allow only numeric input for landline number
    const handleLandlineNumberChange = (text: string) => {
        const onlyDigits = text.replace(/\D/g, '');
        setLandlineNumber(onlyDigits);
    };

    // Called when user taps Fetch Bill
    const handleFetchBill = () => {
        setIsFetchingBill(true);
        setHasFetchError(false);
        setBillData(null);

        // Simulate API call — 2 second delay
        // Replace with: GET /api/landline/bill?operator=bsnl&std=020&number=24567890
        setTimeout(() => {
            // Trigger error if landline number starts with '000' (for testing)
            if (landlineNumber.startsWith('000')) {
                setHasFetchError(true);
            } else {
                setBillData(mockBillData);
            }
            setIsFetchingBill(false);
        }, 2000);
    };

    // Called when user taps Edit Details on error card
    const handleEditDetails = () => {
        setHasFetchError(false);
        setLandlineNumber('');
        setStdCode('');
    };

    // Called when user taps Apply on promo code
    const handleApplyPromoCode = () => {
        if (promoCodeText.trim().toUpperCase() === 'LAND50') {
            setIsPromoApplied(true);
        } else {
            Alert.alert('Invalid Code', 'Try LAND50 for ₹50 off!');
        }
    };

    // Called when user taps Pay Now
    const handlePayNow = () => {
        Alert.alert(
            'Confirm Payment',
            `Pay ₹${totalPayableAmount} for ${landlinePreview}\nvia ${selectedPaymentMethod.toUpperCase()}`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm & Pay',
                    onPress: () =>
                        Alert.alert('✅ Payment Successful!', 'Your landline bill has been paid.'),
                },
            ]
        );
    };

    // ── Render ───────────────────────────────────────────────

    return (
        <View style={styles.screenContainer}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <SafeAreaView style={styles.safeArea}>

                {/* ================================================
            HEADER — Back arrow + Title (no circle button)
        ================================================= */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
                        <Ionicons name="arrow-back" size={22} color="#111827" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Landline Bill Payment</Text>

                    {/* Info button on right side */}
                    <TouchableOpacity>
                        <Ionicons name="information-circle-outline" size={22} color="#6B7280" />
                    </TouchableOpacity>
                </View>

                {/* ================================================
            SCROLLABLE CONTENT
        ================================================= */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >

                    {/* ── TOP BANNER ──────────────────────────────── */}
                    <LinearGradient
                        colors={['#EFF6FF', '#DBEAFE', '#EFF6FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.topBanner}
                    >
                        <View style={styles.bannerIconCircle}>
                            <MaterialCommunityIcons name="phone-classic" size={32} color="#1D4ED8" />
                        </View>
                        <View style={styles.bannerTextContainer}>
                            <Text style={styles.bannerTitle}>Landline Bill Payment</Text>
                            <Text style={styles.bannerSubtitle}>BSNL, MTNL, Airtel & more</Text>
                        </View>
                    </LinearGradient>

                    {/* ================================================
              ENTER LANDLINE DETAILS CARD
          ================================================= */}
                    <View style={styles.detailsCard}>
                        <Text style={styles.detailsCardTitle}>Enter Landline Details</Text>

                        {/* ---- Field 1: Operator Dropdown ---- */}
                        <Text style={styles.fieldLabel}>Landline Operator *</Text>
                        <TouchableOpacity
                            style={styles.dropdownButton}
                            onPress={() => setIsOperatorModalVisible(true)}
                        >
                            {/* Show colored dot with initials if selected */}
                            {selectedOperator ? (
                                <View
                                    style={[
                                        styles.operatorColorDot,
                                        { backgroundColor: selectedOperator.brandColor },
                                    ]}
                                >
                                    <Text style={styles.operatorColorDotText}>
                                        {selectedOperator.shortName}
                                    </Text>
                                </View>
                            ) : (
                                <MaterialCommunityIcons name="phone-classic" size={18} color="#9CA3AF" />
                            )}

                            <Text
                                style={[
                                    styles.dropdownText,
                                    !selectedOperator && styles.dropdownPlaceholderText,
                                ]}
                            >
                                {selectedOperator ? selectedOperator.name : 'Select landline operator'}
                            </Text>

                            <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
                        </TouchableOpacity>

                        {/* ---- Field 2: STD Code ---- */}
                        <Text style={styles.fieldLabel}>STD Code *</Text>
                        <View style={styles.inputContainer}>
                            <MaterialCommunityIcons name="dialpad" size={18} color="#9CA3AF" />
                            <TextInput
                                style={styles.inputField}
                                placeholder="e.g. 020, 011, 0422"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="number-pad"
                                maxLength={5}
                                value={stdCode}
                                onChangeText={handleStdCodeChange}
                            />
                        </View>
                        {/* Validation hint */}
                        {stdCode.length > 0 && (stdCode.length < 2 || stdCode.length > 5) && (
                            <Text style={styles.validationErrorText}>
                                STD code must be 2 to 5 digits
                            </Text>
                        )}
                        <Text style={styles.helperText}>Enter STD code without leading 0 if required</Text>

                        {/* ---- Field 3: Landline Number ---- */}
                        <Text style={styles.fieldLabel}>Landline Number *</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="call-outline" size={18} color="#9CA3AF" />
                            <TextInput
                                style={styles.inputField}
                                placeholder="e.g. 24567890"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="number-pad"
                                maxLength={8}
                                value={landlineNumber}
                                onChangeText={handleLandlineNumberChange}
                            />
                        </View>
                        {/* Validation hint */}
                        {landlineNumber.length > 0 && (landlineNumber.length < 6 || landlineNumber.length > 8) && (
                            <Text style={styles.validationErrorText}>
                                Landline number must be 6 to 8 digits
                            </Text>
                        )}

                        {/* Live preview of combined number */}
                        {landlinePreview !== '' && (
                            <View style={styles.numberPreviewContainer}>
                                <Ionicons name="eye-outline" size={14} color="#6B7280" />
                                <Text style={styles.numberPreviewText}>Preview: {landlinePreview}</Text>
                            </View>
                        )}

                        {/* ---- Field 4: Account ID (only if operator requires it) ---- */}
                        {operatorNeedsAccountId && (
                            <>
                                <Text style={styles.fieldLabel}>Account Number / Customer ID</Text>
                                <View style={styles.inputContainer}>
                                    <MaterialCommunityIcons name="identifier" size={18} color="#9CA3AF" />
                                    <TextInput
                                        style={styles.inputField}
                                        placeholder="Enter account or customer ID"
                                        placeholderTextColor="#9CA3AF"
                                        autoCapitalize="characters"
                                        value={accountId}
                                        onChangeText={setAccountId}
                                        maxLength={20}
                                    />
                                </View>
                                <Text style={styles.helperText}>Required by {selectedOperator?.name}</Text>
                            </>
                        )}

                        {/* ---- Field 5: Circle / State ---- */}
                        <Text style={styles.fieldLabel}>Circle / State</Text>
                        <TouchableOpacity
                            style={styles.dropdownButton}
                            onPress={() => setIsCircleModalVisible(true)}
                        >
                            <Ionicons name="location-outline" size={18} color="#9CA3AF" />
                            <Text style={styles.dropdownText}>{selectedCircle}</Text>
                            <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
                        </TouchableOpacity>

                        {/* ---- Toggle: Save this connection ---- */}
                        <View style={styles.toggleRow}>
                            <View style={styles.toggleLabelGroup}>
                                <Ionicons name="star-outline" size={17} color="#F59E0B" />
                                <Text style={styles.toggleLabelText}>Save this landline for quick payment</Text>
                            </View>
                            <Switch
                                value={isSaveConnectionOn}
                                onValueChange={setIsSaveConnectionOn}
                                trackColor={{ false: '#E5E7EB', true: '#FEF3C7' }}
                                thumbColor={isSaveConnectionOn ? '#F59E0B' : '#ffffff'}
                            />
                        </View>

                        {/* ---- Toggle: AutoPay ---- */}
                        <View style={styles.toggleRow}>
                            <View style={styles.toggleLabelGroup}>
                                <MaterialCommunityIcons name="autorenew" size={17} color="#10B981" />
                                <View>
                                    <Text style={styles.toggleLabelText}>Enable AutoPay</Text>
                                    <Text style={styles.toggleSublabelText}>
                                        Deducted 2 days before due date
                                    </Text>
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

                    {/* ================================================
              FETCH BILL BUTTON
          ================================================= */}
                    <TouchableOpacity
                        style={[
                            styles.fetchBillButton,
                            !canFetchBill && styles.fetchBillButtonDisabled,
                        ]}
                        onPress={handleFetchBill}
                        disabled={!canFetchBill || isFetchingBill}
                        activeOpacity={0.88}
                    >
                        <LinearGradient
                            colors={canFetchBill ? ['#1D4ED8', '#2563EB'] : ['#D1D5DB', '#9CA3AF']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
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

                    {/* ================================================
              ERROR CARD — shown when bill fetch fails
          ================================================= */}
                    {hasFetchError && (
                        <View style={styles.errorCard}>
                            <View style={styles.errorIconWrapper}>
                                <Ionicons name="close-circle" size={38} color="#DC2626" />
                            </View>
                            <Text style={styles.errorTitle}>Unable to Fetch Bill</Text>
                            <Text style={styles.errorMessage}>
                                Please verify your STD code and landline number and try again.
                            </Text>
                            <TouchableOpacity
                                style={styles.editDetailsButton}
                                onPress={handleEditDetails}
                            >
                                <Text style={styles.editDetailsButtonText}>Edit Details</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* ================================================
              BILL SECTION — visible only after successful fetch
          ================================================= */}
                    {billData && !hasFetchError && (
                        <>

                            {/* ── BILL SUMMARY CARD ────────────────────── */}
                            <View style={styles.billSummaryCard}>

                                {/* Card title row */}
                                <View style={styles.billCardTitleRow}>
                                    <MaterialCommunityIcons
                                        name="receipt"
                                        size={20}
                                        color={selectedOperator?.brandColor ?? '#1D4ED8'}
                                    />
                                    <Text style={styles.billCardTitle}>Bill Details</Text>
                                </View>

                                {/* Customer name row */}
                                <View style={styles.billDetailRow}>
                                    <View style={styles.billDetailLabelGroup}>
                                        <Ionicons name="person-outline" size={14} color="#9CA3AF" />
                                        <Text style={styles.billDetailLabel}>Customer Name</Text>
                                    </View>
                                    <Text style={styles.billDetailValue}>{billData.customerName}</Text>
                                </View>

                                {/* Landline number row */}
                                <View style={styles.billDetailRow}>
                                    <View style={styles.billDetailLabelGroup}>
                                        <Ionicons name="call-outline" size={14} color="#9CA3AF" />
                                        <Text style={styles.billDetailLabel}>Landline Number</Text>
                                    </View>
                                    <Text style={styles.billDetailValue}>{billData.landlineNumber}</Text>
                                </View>

                                {/* Billing address row */}
                                <View style={styles.billDetailRow}>
                                    <View style={styles.billDetailLabelGroup}>
                                        <Ionicons name="location-outline" size={14} color="#9CA3AF" />
                                        <Text style={styles.billDetailLabel}>Address</Text>
                                    </View>
                                    <Text style={[styles.billDetailValue, styles.addressText]}>
                                        {billData.billingAddress}
                                    </Text>
                                </View>

                                {/* Billing period row */}
                                <View style={styles.billDetailRow}>
                                    <View style={styles.billDetailLabelGroup}>
                                        <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
                                        <Text style={styles.billDetailLabel}>Billing Period</Text>
                                    </View>
                                    <Text style={styles.billDetailValue}>{billData.billingPeriod}</Text>
                                </View>

                                {/* Due date row */}
                                <View style={styles.billDetailRow}>
                                    <View style={styles.billDetailLabelGroup}>
                                        <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                                        <Text style={styles.billDetailLabel}>Due Date</Text>
                                    </View>
                                    <Text style={[styles.billDetailValue, styles.dueDateText]}>
                                        {billData.dueDate}
                                    </Text>
                                </View>

                                {/* Bill amount row — no bottom border */}
                                <View style={[styles.billDetailRow, styles.billDetailRowLast]}>
                                    <View style={styles.billDetailLabelGroup}>
                                        <Ionicons name="cash-outline" size={14} color="#9CA3AF" />
                                        <Text style={styles.billDetailLabel}>Total Amount</Text>
                                    </View>
                                    <Text style={styles.billAmountText}>₹{billData.totalAmount}</Text>
                                </View>

                                {/* Late payment warning */}
                                <View style={styles.latePaymentWarning}>
                                    <Ionicons name="warning-outline" size={14} color="#B45309" />
                                    <Text style={styles.latePaymentWarningText}>
                                        Late payment charges may apply after due date.
                                    </Text>
                                </View>

                                {/* ── Bill Breakdown Accordion ────────────── */}
                                <TouchableOpacity
                                    style={styles.breakdownToggleButton}
                                    onPress={() => setShowBillBreakdown(!showBillBreakdown)}
                                >
                                    <MaterialCommunityIcons
                                        name="format-list-bulleted"
                                        size={16}
                                        color="#6B7280"
                                    />
                                    <Text style={styles.breakdownToggleText}>
                                        {showBillBreakdown ? 'Hide' : 'View'} Bill Breakdown
                                    </Text>
                                    <Ionicons
                                        name={showBillBreakdown ? 'chevron-up' : 'chevron-down'}
                                        size={14}
                                        color="#9CA3AF"
                                    />
                                </TouchableOpacity>

                                {/* Breakdown rows — visible when expanded */}
                                {showBillBreakdown && (
                                    <View style={styles.breakdownContainer}>

                                        <View style={styles.breakdownRow}>
                                            <Text style={styles.breakdownLabel}>Monthly Rental</Text>
                                            <Text style={styles.breakdownValue}>
                                                ₹{billData.breakdown.monthlyRental}
                                            </Text>
                                        </View>

                                        <View style={styles.breakdownRow}>
                                            <Text style={styles.breakdownLabel}>Usage Charges</Text>
                                            <Text style={styles.breakdownValue}>
                                                ₹{billData.breakdown.usageCharges}
                                            </Text>
                                        </View>

                                        <View style={styles.breakdownRow}>
                                            <Text style={styles.breakdownLabel}>GST (18%)</Text>
                                            <Text style={styles.breakdownValue}>
                                                ₹{billData.breakdown.gstAmount}
                                            </Text>
                                        </View>

                                        <View style={styles.breakdownRow}>
                                            <Text style={styles.breakdownLabel}>Previous Dues</Text>
                                            <Text style={styles.breakdownValue}>
                                                {billData.breakdown.previousDues > 0
                                                    ? `₹${billData.breakdown.previousDues}`
                                                    : '—'}
                                            </Text>
                                        </View>

                                        <View style={styles.breakdownRow}>
                                            <Text style={styles.breakdownLabel}>Adjustments</Text>
                                            <Text
                                                style={[
                                                    styles.breakdownValue,
                                                    billData.breakdown.adjustments < 0 && styles.adjustmentGreenText,
                                                ]}
                                            >
                                                {billData.breakdown.adjustments !== 0
                                                    ? `₹${billData.breakdown.adjustments}`
                                                    : '—'}
                                            </Text>
                                        </View>

                                        {/* Divider line */}
                                        <View style={styles.breakdownDivider} />

                                        {/* Total row */}
                                        <View style={styles.breakdownRow}>
                                            <Text style={styles.breakdownTotalLabel}>Total Payable</Text>
                                            <Text style={styles.breakdownTotalLabel}>
                                                ₹{billData.totalAmount}
                                            </Text>
                                        </View>

                                    </View>
                                )}

                            </View>

                            {/* ── PAYMENT METHOD SECTION ───────────────── */}
                            <Text style={styles.sectionHeading}>Select Payment Method</Text>

                            <View style={styles.paymentMethodsCard}>
                                {paymentMethods.map((method, index) => {
                                    const isSelected = selectedPaymentMethod === method.id;
                                    const isLastRow = index === paymentMethods.length - 1;

                                    return (
                                        <TouchableOpacity
                                            key={method.id}
                                            style={[
                                                styles.paymentMethodRow,
                                                isSelected && styles.paymentMethodRowSelected,
                                                isLastRow && styles.paymentMethodRowLast,
                                            ]}
                                            onPress={() => setSelectedPaymentMethod(method.id)}
                                        >
                                            {/* Colored icon background */}
                                            <View
                                                style={[
                                                    styles.paymentMethodIconContainer,
                                                    { backgroundColor: method.iconColor + '18' },
                                                ]}
                                            >
                                                <Ionicons
                                                    name={method.iconName as any}
                                                    size={20}
                                                    color={method.iconColor}
                                                />
                                            </View>

                                            {/* Method name */}
                                            <Text style={styles.paymentMethodLabel}>{method.label}</Text>

                                            {/* Radio button circle */}
                                            <View
                                                style={[
                                                    styles.radioButtonOuter,
                                                    isSelected && { borderColor: method.iconColor },
                                                ]}
                                            >
                                                {isSelected && (
                                                    <View
                                                        style={[
                                                            styles.radioButtonInner,
                                                            { backgroundColor: method.iconColor },
                                                        ]}
                                                    />
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            {/* ── PROMO CODE SECTION ───────────────────── */}
                            <View style={styles.promoCodeCard}>
                                <Text style={styles.promoCodeHintText}>Have a promo code?</Text>

                                <View style={styles.promoCodeInputRow}>
                                    {/* Code input */}
                                    <View style={styles.promoCodeInputContainer}>
                                        <MaterialCommunityIcons
                                            name="ticket-percent-outline"
                                            size={16}
                                            color="#9CA3AF"
                                        />
                                        <TextInput
                                            style={styles.promoCodeTextField}
                                            placeholder="Enter code (try LAND50)"
                                            placeholderTextColor="#9CA3AF"
                                            value={promoCodeText}
                                            onChangeText={setPromoCodeText}
                                            autoCapitalize="characters"
                                            editable={!isPromoApplied}
                                        />
                                    </View>

                                    {/* Apply button */}
                                    <TouchableOpacity
                                        style={[
                                            styles.promoApplyButton,
                                            isPromoApplied && styles.promoApplyButtonSuccess,
                                        ]}
                                        onPress={handleApplyPromoCode}
                                        disabled={isPromoApplied}
                                    >
                                        <Text style={styles.promoApplyButtonText}>
                                            {isPromoApplied ? '✓ Applied' : 'Apply'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Success confirmation */}
                                {isPromoApplied && (
                                    <Text style={styles.promoSuccessText}>🎉 ₹50 discount applied!</Text>
                                )}
                            </View>

                            {/* Bottom spacer to clear sticky bar */}
                            <View style={{ height: 100 }} />

                        </>
                    )}

                </ScrollView>

                {/* ================================================
            STICKY BOTTOM PAY BAR
            Only shown after bill is fetched successfully
        ================================================= */}
                {billData && !hasFetchError && (
                    <View style={styles.stickyPayBar}>

                        {/* Left side — amount display */}
                        <View>
                            <Text style={styles.stickyBarSmallLabel}>Amount Payable</Text>
                            <View style={styles.stickyBarAmountRow}>
                                <Text style={styles.stickyBarAmountText}>₹{totalPayableAmount}</Text>
                                {/* Show original amount with strikethrough if promo applied */}
                                {isPromoApplied && (
                                    <Text style={styles.stickyBarStrikethroughAmount}>
                                        ₹{billData.totalAmount}
                                    </Text>
                                )}
                            </View>
                        </View>

                        {/* Right side — Pay Now button */}
                        <TouchableOpacity
                            style={styles.payNowButton}
                            onPress={handlePayNow}
                            activeOpacity={0.88}
                        >
                            <LinearGradient
                                colors={['#1D4ED8', '#2563EB']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.payNowButtonGradient}
                            >
                                <Ionicons name="flash" size={18} color="#ffffff" />
                                <Text style={styles.payNowButtonText}>Pay Now</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                    </View>
                )}

            </SafeAreaView>

            {/* ================================================
          OPERATOR SELECTION MODAL (bottom sheet)
      ================================================= */}
            <Modal
                visible={isOperatorModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setIsOperatorModalVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.bottomSheet}>

                        {/* Handle bar at top of sheet */}
                        <View style={styles.bottomSheetHandle} />
                        <Text style={styles.bottomSheetTitle}>Select Landline Operator</Text>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {landlineOperators.map((operator) => {
                                const isChosen = selectedOperator?.id === operator.id;
                                return (
                                    <TouchableOpacity
                                        key={operator.id}
                                        style={[
                                            styles.bottomSheetRow,
                                            isChosen && styles.bottomSheetRowSelected,
                                        ]}
                                        onPress={() => handleOperatorSelect(operator)}
                                    >
                                        {/* Colored circle with initials */}
                                        <View
                                            style={[
                                                styles.operatorLogoCircle,
                                                { backgroundColor: operator.brandColor + '22' },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.operatorLogoText,
                                                    { color: operator.brandColor },
                                                ]}
                                            >
                                                {operator.shortName}
                                            </Text>
                                        </View>

                                        {/* Operator name */}
                                        <View style={styles.operatorNameContainer}>
                                            <Text
                                                style={[
                                                    styles.bottomSheetRowText,
                                                    isChosen && styles.bottomSheetRowTextSelected,
                                                ]}
                                            >
                                                {operator.name}
                                            </Text>
                                            {/* Badge if account ID is required */}
                                            {operator.requiresAccountId && (
                                                <Text style={styles.requiresAccountBadge}>Needs Account ID</Text>
                                            )}
                                        </View>

                                        {/* Checkmark when chosen */}
                                        {isChosen && (
                                            <Ionicons name="checkmark-circle" size={22} color="#1D4ED8" />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                    </View>
                </View>
            </Modal>

            {/* ================================================
          CIRCLE SELECTION MODAL (bottom sheet)
      ================================================= */}
            <Modal
                visible={isCircleModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setIsCircleModalVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.bottomSheet}>

                        <View style={styles.bottomSheetHandle} />
                        <Text style={styles.bottomSheetTitle}>Select Circle / State</Text>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {indianCircles.map((circle) => {
                                const isChosen = selectedCircle === circle;
                                return (
                                    <TouchableOpacity
                                        key={circle}
                                        style={[
                                            styles.bottomSheetRow,
                                            isChosen && styles.bottomSheetRowSelected,
                                        ]}
                                        onPress={() => handleCircleSelect(circle)}
                                    >
                                        <Ionicons
                                            name="location"
                                            size={16}
                                            color={isChosen ? '#1D4ED8' : '#9CA3AF'}
                                        />
                                        <Text
                                            style={[
                                                styles.bottomSheetRowText,
                                                isChosen && styles.bottomSheetRowTextSelected,
                                            ]}
                                        >
                                            {circle}
                                        </Text>
                                        {isChosen && (
                                            <Ionicons name="checkmark" size={18} color="#1D4ED8" />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                    </View>
                </View>
            </Modal>

        </View>
    );
}

// ============================================================
//  STYLES
// ============================================================

const styles = StyleSheet.create({

    // ── Screen Layout ─────────────────────────────────────────
    screenContainer: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 8,
    },

    // ── Header ────────────────────────────────────────────────
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingTop: 52,
        paddingBottom: 14,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerBackButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#111827',
    },

    // ── Top Banner ────────────────────────────────────────────
    topBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        borderRadius: 16,
        padding: 18,
        marginBottom: 16,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    bannerIconCircle: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bannerTextContainer: {
        flex: 1,
    },
    bannerTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1E3A8A',
        marginBottom: 3,
    },
    bannerSubtitle: {
        fontSize: 12,
        color: '#3B82F6',
        fontWeight: '500',
    },

    // ── Details Card ──────────────────────────────────────────
    detailsCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
    },
    detailsCardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 16,
    },

    // Field label above each input
    fieldLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        marginTop: 14,
        marginBottom: 8,
        letterSpacing: 0.2,
    },

    // Dropdown trigger buttons (operator, circle)
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        paddingHorizontal: 14,
        height: 50,
    },
    dropdownText: {
        flex: 1,
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    dropdownPlaceholderText: {
        color: '#9CA3AF',
        fontWeight: '400',
    },

    // Colored dot with operator initials
    operatorColorDot: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    operatorColorDotText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: '800',
    },

    // Text input containers (STD, landline, account ID)
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        paddingHorizontal: 14,
        height: 50,
    },
    inputField: {
        flex: 1,
        fontSize: 15,
        color: '#111827',
        fontWeight: '500',
    },

    // Helper and error text under inputs
    helperText: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 5,
        marginLeft: 2,
    },
    validationErrorText: {
        fontSize: 11,
        color: '#DC2626',
        marginTop: 5,
        marginLeft: 2,
    },

    // Live preview of combined STD + number
    numberPreviewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 6,
        marginLeft: 2,
    },
    numberPreviewText: {
        fontSize: 12,
        color: '#374151',
        fontWeight: '600',
    },

    // Toggle rows for save & autopay
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        marginTop: 8,
    },
    toggleLabelGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
        paddingRight: 10,
    },
    toggleLabelText: {
        fontSize: 13,
        color: '#374151',
        fontWeight: '500',
    },
    toggleSublabelText: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 2,
    },

    // ── Fetch Bill Button ──────────────────────────────────────
    fetchBillButton: {
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: 10,
    },
    fetchBillButtonDisabled: {
        opacity: 0.5,
    },
    fetchBillButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: 52,
    },
    fetchBillButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },

    // ── Error Card ────────────────────────────────────────────
    errorCard: {
        backgroundColor: '#FEF2F2',
        borderRadius: 14,
        padding: 22,
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    errorIconWrapper: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FEE2E2',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    errorTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#991B1B',
        marginBottom: 6,
    },
    errorMessage: {
        fontSize: 13,
        color: '#B91C1C',
        textAlign: 'center',
        lineHeight: 19,
        marginBottom: 16,
        paddingHorizontal: 10,
    },
    editDetailsButton: {
        backgroundColor: '#DC2626',
        borderRadius: 10,
        paddingHorizontal: 26,
        paddingVertical: 10,
    },
    editDetailsButtonText: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 14,
    },

    // ── Bill Summary Card ─────────────────────────────────────
    billSummaryCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
    },
    billCardTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    billCardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
    },

    // Individual bill detail rows
    billDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    billDetailRowLast: {
        borderBottomWidth: 0,
        paddingBottom: 4,
    },
    billDetailLabelGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        flex: 1,
    },
    billDetailLabel: {
        fontSize: 13,
        color: '#6B7280',
    },
    billDetailValue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#111827',
        flex: 1,
        textAlign: 'right',
    },
    addressText: {
        fontSize: 12,
        lineHeight: 17,
    },
    dueDateText: {
        color: '#DC2626',
    },
    billAmountText: {
        fontSize: 20,
        fontWeight: '800',
        color: '#059669',
        textAlign: 'right',
    },

    // Late payment warning row
    latePaymentWarning: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FFFBEB',
        borderRadius: 10,
        padding: 10,
        marginTop: 12,
    },
    latePaymentWarningText: {
        flex: 1,
        fontSize: 12,
        color: '#92400E',
        fontWeight: '500',
    },

    // Bill breakdown accordion toggle
    breakdownToggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 14,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    breakdownToggleText: {
        flex: 1,
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },

    // Breakdown content container
    breakdownContainer: {
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        padding: 14,
        marginTop: 10,
        gap: 10,
    },
    breakdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    breakdownLabel: {
        fontSize: 13,
        color: '#6B7280',
    },
    breakdownValue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
    },
    adjustmentGreenText: {
        color: '#059669',
    },
    breakdownDivider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 2,
    },
    breakdownTotalLabel: {
        fontSize: 14,
        fontWeight: '800',
        color: '#111827',
    },

    // ── Section Heading ───────────────────────────────────────
    sectionHeading: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
        marginLeft: 2,
    },

    // ── Payment Methods Card ──────────────────────────────────
    paymentMethodsCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
    },
    paymentMethodRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    paymentMethodRowSelected: {
        backgroundColor: '#F8FAFF',
    },
    paymentMethodRowLast: {
        borderBottomWidth: 0,
    },
    paymentMethodIconContainer: {
        width: 42,
        height: 42,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    paymentMethodLabel: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    radioButtonOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },

    // ── Promo Code Card ───────────────────────────────────────
    promoCodeCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
    },
    promoCodeHintText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
        marginBottom: 10,
    },
    promoCodeInputRow: {
        flexDirection: 'row',
        gap: 10,
    },
    promoCodeInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        paddingHorizontal: 12,
        height: 44,
    },
    promoCodeTextField: {
        flex: 1,
        fontSize: 13,
        color: '#111827',
    },
    promoApplyButton: {
        backgroundColor: '#1D4ED8',
        borderRadius: 10,
        paddingHorizontal: 18,
        justifyContent: 'center',
        height: 44,
    },
    promoApplyButtonSuccess: {
        backgroundColor: '#059669',
    },
    promoApplyButtonText: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 13,
    },
    promoSuccessText: {
        fontSize: 12,
        color: '#059669',
        fontWeight: '600',
        marginTop: 8,
    },

    // ── Sticky Pay Bar ────────────────────────────────────────
    stickyPayBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 12,
    },
    stickyBarSmallLabel: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '500',
        marginBottom: 3,
        flex: 1,
    },
    stickyBarAmountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },
    stickyBarAmountText: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
    },
    stickyBarStrikethroughAmount: {
        fontSize: 14,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
        marginTop: 3,
    },
    payNowButton: {
        borderRadius: 14,
        overflow: 'hidden',
    },
    payNowButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        paddingHorizontal: 28,
        height: 50,
    },
    payNowButtonText: {
        color: '#ffffff',
        fontWeight: '800',
        fontSize: 15,
    },

    // ── Modal Bottom Sheets ───────────────────────────────────
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        maxHeight: '72%',
        paddingBottom: 28,
    },
    bottomSheetHandle: {
        width: 38,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#E5E7EB',
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 14,
    },
    bottomSheetTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        paddingHorizontal: 20,
        marginBottom: 8,
    },
    bottomSheetRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingVertical: 13,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F9FAFB',
    },
    bottomSheetRowSelected: {
        backgroundColor: '#EFF6FF',
    },
    operatorLogoCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    operatorLogoText: {
        fontSize: 11,
        fontWeight: '800',
    },
    operatorNameContainer: {
        flex: 1,
    },
    bottomSheetRowText: {
        fontSize: 14,
        color: '#374151',
    },
    bottomSheetRowTextSelected: {
        color: '#1D4ED8',
        fontWeight: '600',
    },
    requiresAccountBadge: {
        fontSize: 10,
        color: '#6B7280',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 3,
        alignSelf: 'flex-start',
    },
});