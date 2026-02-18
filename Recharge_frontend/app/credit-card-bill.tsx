import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Animated,
    BackHandler,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Step = "select-bank" | "verify-card" | "verification-status" | "card-details" | "payment";

interface CardDetails {
    holderName: string;
    cardType: string;
    cardEnding: string;
    totalDue: number;
    minimumDue: number;
    dueDate: string;
    availableLimit?: number;
}

export default function CreditCardBillScreen() {
    const router = useRouter();

    const [currentStep, setCurrentStep] = useState<Step>("select-bank");
    const [selectedBank, setSelectedBank] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [lastFourDigits, setLastFourDigits] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [verificationSuccess, setVerificationSuccess] = useState(false);
    const [cardDetails, setCardDetails] = useState<CardDetails | null>(null);
    const [selectedAmount, setSelectedAmount] = useState<"total" | "minimum" | "custom">("total");
    const [customAmount, setCustomAmount] = useState("");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("upi");
    const [mobileError, setMobileError] = useState("");
    const [cardError, setCardError] = useState("");

    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                if (currentStep === "select-bank") {
                    router.back();
                } else if (currentStep === "verify-card") {
                    setCurrentStep("select-bank");
                } else if (currentStep === "card-details") {
                    setCurrentStep("verify-card");
                } else if (currentStep === "payment") {
                    setCurrentStep("card-details");
                } else {
                    router.back();
                }
                return true;
            };

            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                backAction
            );

            return () => backHandler.remove();
        }, [router, currentStep])
    );

    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    const banks = [
        { id: "hdfc", name: "HDFC Bank", icon: "🏦" },
        { id: "icici", name: "ICICI Bank", icon: "🏦" },
        { id: "sbi", name: "SBI Card", icon: "🏦" },
        { id: "axis", name: "Axis Bank", icon: "🏦" },
        { id: "kotak", name: "Kotak Mahindra", icon: "🏦" },
        { id: "indusind", name: "IndusInd Bank", icon: "🏦" },
        { id: "yes", name: "Yes Bank", icon: "🏦" },
        { id: "rbl", name: "RBL Bank", icon: "🏦" },
        { id: "sc", name: "Standard Chartered", icon: "🏦" },
        { id: "au", name: "AU Bank", icon: "🏦" },
        { id: "onecard", name: "OneCard", icon: "💳" },
        { id: "idfc", name: "IDFC First Bank", icon: "🏦" },
        { id: "hsbc", name: "HSBC Bank", icon: "🏦" },
        { id: "american", name: "American Express", icon: "💳" },
        { id: "citibank", name: "Citibank", icon: "🏦" },
        { id: "bob", name: "Bank of Baroda", icon: "🏦" },
    ];

    const filteredBanks = banks.filter(bank =>
        bank.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleBankSelect = (bankId: string, bankName: string) => {
        setSelectedBank(bankName);
        setCurrentStep("verify-card");
    };

    const validateMobile = () => {
        if (mobileNumber.length !== 10) {
            setMobileError("Mobile number must be 10 digits");
            return false;
        }
        setMobileError("");
        return true;
    };

    const validateCard = () => {
        if (lastFourDigits.length !== 4) {
            setCardError("Enter exactly 4 digits");
            return false;
        }
        setCardError("");
        return true;
    };

    const handleVerifyCard = async () => {
        if (!validateMobile() || !validateCard()) return;

        setIsLoading(true);
        setCurrentStep("verification-status");

        setTimeout(() => {
            const mockCardDetails: CardDetails = {
                holderName: "JOHN DOE",
                cardType: "Visa",
                cardEnding: lastFourDigits,
                totalDue: 15750,
                minimumDue: 1575,
                dueDate: "25 Feb 2026",
                availableLimit: 84250,
            };

            setCardDetails(mockCardDetails);
            setVerificationSuccess(true);
            setIsLoading(false);

            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }).start();

            setTimeout(() => {
                setCurrentStep("card-details");
            }, 1500);
        }, 2000);
    };

    const handlePayNow = () => {
        const amount =
            selectedAmount === "total" ? cardDetails?.totalDue :
                selectedAmount === "minimum" ? cardDetails?.minimumDue :
                    parseFloat(customAmount);
    };

    const renderStepIndicator = () => (
        <View style={styles.stepIndicator}>
            <View style={styles.stepItem}>
                <View style={[styles.stepCircle, currentStep !== "select-bank" && styles.stepCircleActive]}>
                    <Text style={[styles.stepNumber, currentStep !== "select-bank" && styles.stepNumberActive]}>1</Text>
                </View>
                <Text style={styles.stepLabel}>Bank</Text>
            </View>

            <View style={styles.stepLine} />

            <View style={styles.stepItem}>
                <View style={[styles.stepCircle, (currentStep === "card-details" || currentStep === "payment") && styles.stepCircleActive]}>
                    <Text style={[styles.stepNumber, (currentStep === "card-details" || currentStep === "payment") && styles.stepNumberActive]}>2</Text>
                </View>
                <Text style={styles.stepLabel}>Verify</Text>
            </View>

            <View style={styles.stepLine} />

            <View style={styles.stepItem}>
                <View style={[styles.stepCircle, currentStep === "payment" && styles.stepCircleActive]}>
                    <Text style={[styles.stepNumber, currentStep === "payment" && styles.stepNumberActive]}>3</Text>
                </View>
                <Text style={styles.stepLabel}>Payment</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => {
                            if (currentStep === "select-bank") {
                                router.back();
                            } else if (currentStep === "verify-card") {
                                setCurrentStep("select-bank");
                            } else if (currentStep === "card-details") {
                                setCurrentStep("verify-card");
                            } else if (currentStep === "payment") {
                                setCurrentStep("card-details");
                            } else {
                                router.back();
                            }
                        }}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                    </TouchableOpacity>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>Credit Card Bill Payment</Text>
                        <Text style={styles.headerSubtext}>Pay your credit card bill securely</Text>
                    </View>
                    <View style={styles.placeholder} />
                </View>

                {currentStep !== "select-bank" && renderStepIndicator()}

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        {currentStep === "select-bank" && (
                            <>
                                <View style={styles.searchContainer}>
                                    <Ionicons name="search" size={20} color="#666" />
                                    <TextInput
                                        style={styles.searchInput}
                                        placeholder="Search bank..."
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                    />
                                </View>

                                <View style={styles.banksList}>
                                    <View style={styles.categoryDivider}>
                                        <Text style={styles.categoryTitle}>All Banks</Text>
                                    </View>
                                    {filteredBanks.map((bank) => (
                                        <TouchableOpacity
                                            key={bank.id}
                                            style={styles.bankListItem}
                                            onPress={() => handleBankSelect(bank.id, bank.name)}
                                        >
                                            <View style={styles.bankListItemLeft}>
                                                <View style={styles.bankIconBg}>
                                                    <Text style={styles.bankIcon}>{bank.icon}</Text>
                                                </View>
                                                <Text style={styles.bankNameText}>{bank.name}</Text>
                                            </View>
                                            <Ionicons name="chevron-forward" size={18} color="#CCC" />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </>
                        )}

                        {currentStep === "verify-card" && (
                            <>
                                <View style={styles.selectedBankCard}>
                                    <View style={styles.selectedBankLeft}>
                                        <Text style={styles.selectedBankIcon}>🏦</Text>
                                        <Text style={styles.selectedBankName}>{selectedBank}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => setCurrentStep("select-bank")}>
                                        <Text style={styles.changeBankText}>Change Bank</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.inputCard}>
                                    <Text style={styles.inputLabel}>Registered Mobile Number *</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="Enter 10 digit mobile number"
                                        keyboardType="phone-pad"
                                        maxLength={10}
                                        value={mobileNumber}
                                        onChangeText={(text) => {
                                            setMobileNumber(text);
                                            setMobileError("");
                                        }}
                                        onBlur={validateMobile}
                                    />
                                    {mobileError ? (
                                        <Text style={styles.errorText}>{mobileError}</Text>
                                    ) : null}
                                </View>

                                <View style={styles.inputCard}>
                                    <Text style={styles.inputLabel}>Last 4 Digits of Card *</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="XXXX"
                                        keyboardType="number-pad"
                                        maxLength={4}
                                        value={lastFourDigits}
                                        onChangeText={(text) => {
                                            setLastFourDigits(text);
                                            setCardError("");
                                        }}
                                        onBlur={validateCard}
                                    />
                                    {cardError ? (
                                        <Text style={styles.errorText}>{cardError}</Text>
                                    ) : null}
                                </View>

                                <TouchableOpacity
                                    style={[styles.verifyButton, (!mobileNumber || !lastFourDigits) && styles.verifyButtonDisabled]}
                                    onPress={handleVerifyCard}
                                    disabled={!mobileNumber || !lastFourDigits}
                                >
                                    <Text style={styles.verifyButtonText}>Verify Card →</Text>
                                </TouchableOpacity>

                                <View style={styles.securityBadge}>
                                    <Ionicons name="shield-checkmark" size={16} color="#2E7D32" />
                                    <Text style={styles.securityText}>Secure RBI Compliant Payment</Text>
                                </View>
                            </>
                        )}

                        {currentStep === "verification-status" && (
                            <View style={styles.verificationStatusContainer}>
                                {isLoading ? (
                                    <>
                                        <ActivityIndicator size="large" color="#0A4DA3" />
                                        <Text style={styles.verifyingText}>Verifying Card...</Text>
                                    </>
                                ) : verificationSuccess ? (
                                    <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
                                        <View style={styles.successCircle}>
                                            <Ionicons name="checkmark" size={60} color="#2E7D32" />
                                        </View>
                                        <Text style={styles.successTitle}>Card Verified Successfully</Text>
                                    </Animated.View>
                                ) : (
                                    <>
                                        <View style={styles.errorCircle}>
                                            <Ionicons name="close" size={60} color="#D32F2F" />
                                        </View>
                                        <Text style={styles.errorTitle}>Card Not Found</Text>
                                        <Text style={styles.errorMessage}>Check details or try again</Text>
                                        <TouchableOpacity
                                            style={styles.retryButton}
                                            onPress={() => setCurrentStep("verify-card")}
                                        >
                                            <Text style={styles.retryButtonText}>Retry</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        )}

                        {currentStep === "card-details" && cardDetails && (
                            <>
                                <View style={styles.cardDetailsCard}>
                                    <Text style={styles.cardDetailsTitle}>Card Details</Text>

                                    <View style={styles.detailRow}>
                                        <Ionicons name="business" size={18} color="#0A4DA3" />
                                        <Text style={styles.detailLabel}>Bank Name:</Text>
                                        <Text style={styles.detailValue}>{selectedBank}</Text>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <Ionicons name="card" size={18} color="#0A4DA3" />
                                        <Text style={styles.detailLabel}>Card Type:</Text>
                                        <Text style={styles.detailValue}>{cardDetails.cardType}</Text>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <Ionicons name="lock-closed" size={18} color="#0A4DA3" />
                                        <Text style={styles.detailLabel}>Card Ending:</Text>
                                        <Text style={styles.detailValue}>XXXX XXXX XXXX {cardDetails.cardEnding}</Text>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <Ionicons name="person" size={18} color="#0A4DA3" />
                                        <Text style={styles.detailLabel}>Card Holder:</Text>
                                        <Text style={styles.detailValue}>{cardDetails.holderName}</Text>
                                    </View>
                                </View>

                                <View style={styles.billInfoCard}>
                                    <Text style={styles.billInfoTitle}>Bill Details</Text>

                                    <View style={styles.billInfoRow}>
                                        <Text style={styles.billInfoLabel}>Total Outstanding</Text>
                                        <Text style={styles.billInfoValue}>₹{cardDetails.totalDue.toLocaleString()}</Text>
                                    </View>

                                    <View style={styles.billInfoRow}>
                                        <Text style={styles.billInfoLabel}>Minimum Due</Text>
                                        <Text style={styles.billInfoMinDue}>₹{cardDetails.minimumDue.toLocaleString()}</Text>
                                    </View>

                                    <View style={styles.billInfoRow}>
                                        <Text style={styles.billInfoLabel}>Due Date</Text>
                                        <Text style={styles.billInfoDueDate}>{cardDetails.dueDate}</Text>
                                    </View>

                                    {cardDetails.availableLimit && (
                                        <View style={styles.billInfoRow}>
                                            <Text style={styles.billInfoLabel}>Available Limit</Text>
                                            <Text style={styles.billInfoValue}>₹{cardDetails.availableLimit.toLocaleString()}</Text>
                                        </View>
                                    )}
                                </View>

                                <TouchableOpacity
                                    style={styles.continueButton}
                                    onPress={() => setCurrentStep("payment")}
                                >
                                    <Text style={styles.continueButtonText}>Continue to Payment →</Text>
                                </TouchableOpacity>
                            </>
                        )}

                        {currentStep === "payment" && cardDetails && (
                            <>
                                <View style={styles.amountCard}>
                                    <Text style={styles.amountCardTitle}>Select Amount</Text>

                                    <TouchableOpacity
                                        style={styles.radioOption}
                                        onPress={() => setSelectedAmount("total")}
                                    >
                                        <View style={styles.radio}>
                                            {selectedAmount === "total" && <View style={styles.radioInner} />}
                                        </View>
                                        <View style={styles.radioTextContainer}>
                                            <Text style={styles.radioLabel}>Total Due</Text>
                                            <Text style={styles.radioAmount}>₹{cardDetails.totalDue.toLocaleString()}</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.radioOption}
                                        onPress={() => setSelectedAmount("minimum")}
                                    >
                                        <View style={styles.radio}>
                                            {selectedAmount === "minimum" && <View style={styles.radioInner} />}
                                        </View>
                                        <View style={styles.radioTextContainer}>
                                            <Text style={styles.radioLabel}>Minimum Due</Text>
                                            <Text style={styles.radioAmount}>₹{cardDetails.minimumDue.toLocaleString()}</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.radioOption}
                                        onPress={() => setSelectedAmount("custom")}
                                    >
                                        <View style={styles.radio}>
                                            {selectedAmount === "custom" && <View style={styles.radioInner} />}
                                        </View>
                                        <Text style={styles.radioLabel}>Custom Amount</Text>
                                    </TouchableOpacity>

                                    {selectedAmount === "custom" && (
                                        <View style={styles.customAmountInput}>
                                            <Text style={styles.rupeeSymbol}>₹</Text>
                                            <TextInput
                                                style={styles.customAmountField}
                                                placeholder="Enter amount"
                                                keyboardType="number-pad"
                                                value={customAmount}
                                                onChangeText={setCustomAmount}
                                            />
                                        </View>
                                    )}
                                </View>

                                <View style={styles.paymentMethodCard}>
                                    <Text style={styles.paymentMethodTitle}>Payment Method</Text>

                                    {[
                                        { id: "upi", name: "UPI", icon: "qr-code" },
                                        { id: "debit", name: "Debit Card", icon: "card" },
                                        { id: "netbanking", name: "Net Banking", icon: "business" },
                                        { id: "wallet", name: "Wallet", icon: "wallet" },
                                    ].map((method) => (
                                        <TouchableOpacity
                                            key={method.id}
                                            style={styles.paymentMethodOption}
                                            onPress={() => setSelectedPaymentMethod(method.id)}
                                        >
                                            <View style={styles.paymentMethodLeft}>
                                                <Ionicons name={method.icon as any} size={24} color="#0A4DA3" />
                                                <Text style={styles.paymentMethodName}>{method.name}</Text>
                                            </View>
                                            <View style={styles.radio}>
                                                {selectedPaymentMethod === method.id && <View style={styles.radioInner} />}
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <TouchableOpacity
                                    style={styles.payNowButton}
                                    onPress={handlePayNow}
                                >
                                    <LinearGradient
                                        colors={["#43A047", "#2E7D32"]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.payNowGradient}
                                    >
                                        <Ionicons name="lock-closed" size={20} color="#FFFFFF" />
                                        <Text style={styles.payNowButtonText}>
                                            Pay ₹{selectedAmount === "total" ? cardDetails.totalDue.toLocaleString() :
                                                selectedAmount === "minimum" ? cardDetails.minimumDue.toLocaleString() :
                                                    customAmount || "0"}
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F5F7FA" },
    safeArea: { flex: 1 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    backButton: { padding: 5 },
    headerTextContainer: { flex: 1, alignItems: "center" },
    headerTitle: { fontSize: 18, fontWeight: "bold", color: "#1A1A1A" },
    headerSubtext: { fontSize: 12, color: "#999", marginTop: 2 },
    placeholder: { width: 34 },
    stepIndicator: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
        backgroundColor: "#FFFFFF",
    },
    stepItem: { alignItems: "center" },
    stepCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#E0E0E0",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 6,
    },
    stepCircleActive: { backgroundColor: "#0A4DA3" },
    stepNumber: { fontSize: 16, fontWeight: "600", color: "#999" },
    stepNumberActive: { color: "#FFFFFF" },
    stepLabel: { fontSize: 12, color: "#666" },
    stepLine: { width: 40, height: 2, backgroundColor: "#E0E0E0", marginHorizontal: 8 },
    content: { padding: 20 },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 14,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    searchInput: { flex: 1, fontSize: 16, color: "#1A1A1A", marginLeft: 12 },
    banksList: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 10,
    },
    categoryDivider: {
        backgroundColor: '#F8F9FA',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    categoryTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#666',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    bankListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    bankListItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    bankIconBg: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F7FA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bankIcon: { fontSize: 20 },
    bankNameText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1A1A1A',
    },
    selectedBankCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#E3F2FD",
        padding: 16,
        borderRadius: 14,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#BBDEFB",
    },
    selectedBankLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    selectedBankIcon: { fontSize: 28 },
    selectedBankName: { fontSize: 16, fontWeight: "600", color: "#0A4DA3" },
    changeBankText: { fontSize: 14, fontWeight: "600", color: "#0A4DA3" },
    inputCard: {
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 14,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    inputLabel: { fontSize: 13, fontWeight: "600", color: "#666", marginBottom: 12 },
    textInput: {
        fontSize: 16,
        color: "#1A1A1A",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    errorText: { fontSize: 12, color: "#D32F2F", marginTop: 8 },
    verifyButton: { backgroundColor: "#0A4DA3", paddingVertical: 16, borderRadius: 14, alignItems: "center", marginBottom: 16 },
    verifyButtonDisabled: { backgroundColor: "#E0E0E0" },
    verifyButtonText: { fontSize: 16, fontWeight: "600", color: "#FFFFFF" },
    securityBadge: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 12, backgroundColor: "#E8F5E9", borderRadius: 10 },
    securityText: { fontSize: 13, fontWeight: "600", color: "#2E7D32" },
    verificationStatusContainer: { alignItems: "center", paddingVertical: 60 },
    verifyingText: { fontSize: 16, color: "#666", marginTop: 20 },
    successCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: "#E8F5E9", justifyContent: "center", alignItems: "center", marginBottom: 24 },
    successTitle: { fontSize: 20, fontWeight: "600", color: "#2E7D32" },
    errorCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: "#FFEBEE", justifyContent: "center", alignItems: "center", marginBottom: 24 },
    errorTitle: { fontSize: 20, fontWeight: "600", color: "#D32F2F", marginBottom: 8 },
    errorMessage: { fontSize: 14, color: "#666", marginBottom: 24 },
    retryButton: { backgroundColor: "#0A4DA3", paddingVertical: 12, paddingHorizontal: 40, borderRadius: 14 },
    retryButtonText: { fontSize: 16, fontWeight: "600", color: "#FFFFFF" },
    cardDetailsCard: { backgroundColor: "#E3F2FD", padding: 16, borderRadius: 14, marginBottom: 16, borderWidth: 1, borderColor: "#BBDEFB" },
    cardDetailsTitle: { fontSize: 16, fontWeight: "600", color: "#0A4DA3", marginBottom: 16 },
    detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 8 },
    detailLabel: { fontSize: 14, color: "#666", flex: 1 },
    detailValue: { fontSize: 14, fontWeight: "600", color: "#1A1A1A" },
    billInfoCard: { backgroundColor: "#FFFFFF", padding: 16, borderRadius: 14, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
    billInfoTitle: { fontSize: 16, fontWeight: "600", color: "#1A1A1A", marginBottom: 16 },
    billInfoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
    billInfoLabel: { fontSize: 14, color: "#666" },
    billInfoValue: { fontSize: 14, fontWeight: "600", color: "#1A1A1A" },
    billInfoMinDue: { fontSize: 14, fontWeight: "600", color: "#FF9800" },
    billInfoDueDate: { fontSize: 14, fontWeight: "600", color: "#D32F2F" },
    continueButton: { backgroundColor: "#0A4DA3", paddingVertical: 16, borderRadius: 14, alignItems: "center" },
    continueButtonText: { fontSize: 16, fontWeight: "600", color: "#FFFFFF" },
    amountCard: { backgroundColor: "#FFFFFF", padding: 16, borderRadius: 14, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
    amountCardTitle: { fontSize: 16, fontWeight: "600", color: "#1A1A1A", marginBottom: 16 },
    radioOption: { flexDirection: "row", alignItems: "center", paddingVertical: 12, gap: 12 },
    radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#0A4DA3", justifyContent: "center", alignItems: "center" },
    radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#0A4DA3" },
    radioTextContainer: { flex: 1 },
    radioLabel: { fontSize: 15, color: "#1A1A1A", marginBottom: 4 },
    radioAmount: { fontSize: 18, fontWeight: "600", color: "#0A4DA3" },
    customAmountInput: { flexDirection: "row", alignItems: "center", marginTop: 12, paddingLeft: 32 },
    rupeeSymbol: { fontSize: 18, fontWeight: "600", color: "#666", marginRight: 8 },
    customAmountField: { flex: 1, fontSize: 18, fontWeight: "600", color: "#1A1A1A", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#E0E0E0" },
    paymentMethodCard: { backgroundColor: "#FFFFFF", padding: 16, borderRadius: 14, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
    paymentMethodTitle: { fontSize: 16, fontWeight: "600", color: "#1A1A1A", marginBottom: 16 },
    paymentMethodOption: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
    paymentMethodLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    paymentMethodName: { fontSize: 15, color: "#1A1A1A" },
    payNowButton: { borderRadius: 14, overflow: "hidden", shadowColor: "#2E7D32", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 5 },
    payNowGradient: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16 },
    payNowButtonText: { fontSize: 18, fontWeight: "bold", color: "#FFFFFF" },
});