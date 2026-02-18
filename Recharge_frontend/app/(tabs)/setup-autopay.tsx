import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    BackHandler,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function SetupAutopayScreen() {
    const router = useRouter();

    // Handle hardware back button
    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                router.push("/autopay");
                return true;
            };

            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                backAction,
            );

            return () => backHandler.remove();
        }, [router]),
    );

    // Step management
    const [currentStep, setCurrentStep] = useState(1);

    // Form data
    const [selectedService, setSelectedService] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [operator, setOperator] = useState("Auto-detect");
    const [circle, setCircle] = useState("Auto-detect");
    const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState("");
    const [frequency, setFrequency] = useState("every28days");
    const [customDate, setCustomDate] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("wallet");

    // Modals
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Services data
    const services = [
        {
            id: "mobile",
            name: "Mobile\nRecharge",
            icon: "phone-portrait-outline",
            color: "#0D47A1",
        },
        { id: "dth", name: "DTH\nRecharge", icon: "tv-outline", color: "#0D47A1" },
        {
            id: "electricity",
            name: "Electricity\nBill",
            icon: "bulb-outline",
            color: "#0D47A1",
        },
        {
            id: "water",
            name: "Water\nBill",
            icon: "water-outline",
            color: "#0D47A1",
        },
        {
            id: "ott",
            name: "OTT\nSubscription",
            icon: "play-circle-outline",
            color: "#0D47A1",
        },
        {
            id: "lpg",
            name: "LPG\nCylinder",
            icon: "flame-outline",
            color: "#0D47A1",
        },
    ];

    // Sample plans
    const plans = [
        { id: 1, amount: 299, validity: "28 Days", data: "1.5GB/day" },
        { id: 2, amount: 399, validity: "56 Days", data: "2GB/day" },
        { id: 3, amount: 599, validity: "84 Days", data: "2.5GB/day" },
    ];

    const handleEnableAutopay = () => {
        setShowConfirmModal(true);
    };

    const confirmSetup = () => {
        setShowConfirmModal(false);
        // Simulate success
        setTimeout(() => {
            setShowSuccessModal(true);
        }, 300);
    };

    const handleViewAutopay = () => {
        setShowSuccessModal(false);
        router.push("/autopay");
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.push("/autopay")}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                    </TouchableOpacity>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>Setup Autopay</Text>
                        <Text style={styles.headerSubtext}>Never miss a payment again</Text>
                    </View>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        {/* Step 1: Select Service */}
                        <View style={styles.stepSection}>
                            <Text style={styles.stepTitle}>Step 1: Select Service</Text>
                            <View style={styles.servicesGrid}>
                                {services.map((service) => (
                                    <TouchableOpacity
                                        key={service.id}
                                        style={[
                                            styles.serviceCard,
                                            selectedService === service.id &&
                                            styles.serviceCardSelected,
                                        ]}
                                        onPress={() => setSelectedService(service.id)}
                                    >
                                        {selectedService === service.id && (
                                            <View style={styles.checkmark}>
                                                <Ionicons
                                                    name="checkmark-circle"
                                                    size={20}
                                                    color="#1E88E5"
                                                />
                                            </View>
                                        )}
                                        <View style={styles.serviceIconCircle}>
                                            <Ionicons
                                                name={service.icon as any}
                                                size={28}
                                                color={service.color}
                                            />
                                        </View>
                                        <Text style={styles.serviceName}>{service.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Step 2: Enter Details (Show if service selected) */}
                        {selectedService && (
                            <View style={styles.stepSection}>
                                <Text style={styles.stepTitle}>Step 2: Enter Details</Text>

                                <View style={styles.inputCard}>
                                    <Text style={styles.inputLabel}>Mobile Number</Text>
                                    <View style={styles.inputRow}>
                                        <Ionicons name="phone-portrait" size={20} color="#666" />
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder="9XXXXXXXXX"
                                            keyboardType="phone-pad"
                                            value={mobileNumber}
                                            onChangeText={setMobileNumber}
                                            maxLength={10}
                                        />
                                    </View>
                                </View>

                                <View style={styles.detailsRow}>
                                    <View style={styles.detailCard}>
                                        <Text style={styles.detailLabel}>Operator</Text>
                                        <Text style={styles.detailValue}>{operator}</Text>
                                    </View>
                                    <View style={styles.detailCard}>
                                        <Text style={styles.detailLabel}>Circle</Text>
                                        <Text style={styles.detailValue}>{circle}</Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Step 3: Select Plan */}
                        {mobileNumber.length === 10 && (
                            <View style={styles.stepSection}>
                                <Text style={styles.stepTitle}>Step 3: Select Plan</Text>

                                {plans.map((plan) => (
                                    <TouchableOpacity
                                        key={plan.id}
                                        style={[
                                            styles.planCard,
                                            selectedPlan === plan.id && styles.planCardSelected,
                                        ]}
                                        onPress={() => setSelectedPlan(plan.id)}
                                    >
                                        <View style={styles.planLeft}>
                                            <Text style={styles.planAmount}>₹{plan.amount}</Text>
                                            <Text style={styles.planDetails}>
                                                {plan.validity} | {plan.data}
                                            </Text>
                                        </View>
                                        {selectedPlan === plan.id && (
                                            <Ionicons
                                                name="checkmark-circle"
                                                size={24}
                                                color="#1E88E5"
                                            />
                                        )}
                                    </TouchableOpacity>
                                ))}

                                <View style={styles.orDivider}>
                                    <View style={styles.dividerLine} />
                                    <Text style={styles.orText}>OR</Text>
                                    <View style={styles.dividerLine} />
                                </View>

                                <View style={styles.customAmountCard}>
                                    <Text style={styles.inputLabel}>Custom Amount</Text>
                                    <View style={styles.inputRow}>
                                        <Text style={styles.rupeeSymbol}>₹</Text>
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder="Enter Amount"
                                            keyboardType="number-pad"
                                            value={customAmount}
                                            onChangeText={setCustomAmount}
                                        />
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Step 4: Set Frequency */}
                        {(selectedPlan || customAmount) && (
                            <View style={styles.stepSection}>
                                <Text style={styles.stepTitle}>Step 4: Set Frequency</Text>

                                <View style={styles.frequencyCard}>
                                    <Text style={styles.frequencyLabel}>Repeat Every:</Text>

                                    <TouchableOpacity
                                        style={styles.frequencyOption}
                                        onPress={() => setFrequency("every28days")}
                                    >
                                        <View style={styles.radio}>
                                            {frequency === "every28days" && (
                                                <View style={styles.radioInner} />
                                            )}
                                        </View>
                                        <Text style={styles.frequencyText}>Every 28 Days</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.frequencyOption}
                                        onPress={() => setFrequency("monthly")}
                                    >
                                        <View style={styles.radio}>
                                            {frequency === "monthly" && (
                                                <View style={styles.radioInner} />
                                            )}
                                        </View>
                                        <Text style={styles.frequencyText}>Monthly</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.frequencyOption}
                                        onPress={() => setFrequency("custom")}
                                    >
                                        <View style={styles.radio}>
                                            {frequency === "custom" && (
                                                <View style={styles.radioInner} />
                                            )}
                                        </View>
                                        <Text style={styles.frequencyText}>Custom Date</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {/* Step 5: Payment Method */}
                        {frequency && (
                            <View style={styles.stepSection}>
                                <Text style={styles.stepTitle}>Step 5: Payment Method</Text>

                                <TouchableOpacity
                                    style={[
                                        styles.paymentCard,
                                        paymentMethod === "wallet" && styles.paymentCardSelected,
                                    ]}
                                    onPress={() => setPaymentMethod("wallet")}
                                >
                                    <View style={styles.paymentLeft}>
                                        <View style={styles.paymentIcon}>
                                            <Ionicons name="wallet" size={24} color="#4CAF50" />
                                        </View>
                                        <View>
                                            <Text style={styles.paymentName}>Wallet Balance</Text>
                                            <Text style={styles.paymentDetail}>₹1,260 available</Text>
                                        </View>
                                    </View>
                                    {paymentMethod === "wallet" && (
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={24}
                                            color="#1E88E5"
                                        />
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.paymentCard,
                                        paymentMethod === "card" && styles.paymentCardSelected,
                                    ]}
                                    onPress={() => setPaymentMethod("card")}
                                >
                                    <View style={styles.paymentLeft}>
                                        <View style={styles.paymentIcon}>
                                            <Ionicons name="card" size={24} color="#2196F3" />
                                        </View>
                                        <View>
                                            <Text style={styles.paymentName}>Debit Card</Text>
                                            <Text style={styles.paymentDetail}>XXXX 4589</Text>
                                        </View>
                                    </View>
                                    {paymentMethod === "card" && (
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={24}
                                            color="#1E88E5"
                                        />
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.addPaymentLink}>
                                    <Ionicons
                                        name="add-circle-outline"
                                        size={18}
                                        color="#1E88E5"
                                    />
                                    <Text style={styles.addPaymentText}>
                                        Add New Payment Method
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Step 6: Summary */}
                        {paymentMethod && (
                            <View style={styles.stepSection}>
                                <Text style={styles.stepTitle}>Step 6: Autopay Summary</Text>

                                <View style={styles.summaryCard}>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Service:</Text>
                                        <Text style={styles.summaryValue}>Mobile Recharge</Text>
                                    </View>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Number:</Text>
                                        <Text style={styles.summaryValue}>{mobileNumber}</Text>
                                    </View>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Amount:</Text>
                                        <Text style={styles.summaryValue}>
                                            ₹
                                            {selectedPlan
                                                ? plans.find((p) => p.id === selectedPlan)?.amount
                                                : customAmount}
                                        </Text>
                                    </View>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Frequency:</Text>
                                        <Text style={styles.summaryValue}>Every 28 Days</Text>
                                    </View>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Start Date:</Text>
                                        <Text style={styles.summaryValue}>15 March 2026</Text>
                                    </View>
                                </View>

                                {/* Info Badges */}
                                <View style={styles.infoBadges}>
                                    <View style={styles.infoBadge}>
                                        <Ionicons name="pause-circle" size={16} color="#4CAF50" />
                                        <Text style={styles.infoBadgeText}>Pause anytime</Text>
                                    </View>
                                    <View style={styles.infoBadge}>
                                        <Ionicons name="gift" size={16} color="#FF9800" />
                                        <Text style={styles.infoBadgeText}>Cashback eligible</Text>
                                    </View>
                                </View>

                                <View style={styles.cashbackInfo}>
                                    <Text style={styles.cashbackText}>
                                        🎁 Get ₹20 cashback on 3 successful autopay cycles
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                </ScrollView>

                {/* Bottom CTA */}
                {paymentMethod && (
                    <View style={styles.bottomCTA}>
                        <TouchableOpacity
                            style={styles.enableButton}
                            onPress={handleEnableAutopay}
                        >
                            <LinearGradient
                                colors={["#66BB6A", "#2E7D32"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.enableGradient}
                            >
                                <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
                                <Text style={styles.enableButtonText}>Enable Autopay</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Confirmation Modal */}
                <Modal
                    visible={showConfirmModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowConfirmModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalIconCircle}>
                                <Ionicons name="shield-checkmark" size={40} color="#2E7D32" />
                            </View>

                            <Text style={styles.modalTitle}>Confirm Autopay Setup?</Text>
                            <Text style={styles.modalMessage}>
                                You authorize automatic payments of ₹
                                {selectedPlan
                                    ? plans.find((p) => p.id === selectedPlan)?.amount
                                    : customAmount}{" "}
                                every 28 days.
                            </Text>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setShowConfirmModal(false)}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.confirmButton}
                                    onPress={confirmSetup}
                                >
                                    <Text style={styles.confirmButtonText}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Success Modal */}
                <Modal
                    visible={showSuccessModal}
                    transparent={true}
                    animationType="fade"
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.successContent}>
                            <View style={styles.successIconCircle}>
                                <Ionicons name="checkmark-circle" size={80} color="#2E7D32" />
                            </View>

                            <Text style={styles.successTitle}>
                                Autopay Enabled Successfully!
                            </Text>
                            <Text style={styles.successMessage}>
                                You will be charged automatically on 15 March 2026
                            </Text>

                            <TouchableOpacity
                                style={styles.viewAutopayButton}
                                onPress={handleViewAutopay}
                            >
                                <Text style={styles.viewAutopayButtonText}>View Autopay</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },
    safeArea: {
        flex: 1,
    },
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
    backButton: {
        padding: 5,
    },
    headerTextContainer: {
        flex: 1,
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1A1A1A",
    },
    headerSubtext: {
        fontSize: 12,
        color: "#999",
        marginTop: 2,
    },
    placeholder: {
        width: 34,
    },

    content: {
        padding: 20,
    },

    // Step Section
    stepSection: {
        marginBottom: 24,
    },

    stepTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 16,
    },

    // Services Grid
    servicesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },

    serviceCard: {
        width: "48%",
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 16,
        alignItems: "center",
        borderWidth: 2,
        borderColor: "transparent",
        position: "relative",
    },

    serviceCardSelected: {
        borderColor: "#1E88E5",
        backgroundColor: "#E3F2FD",
    },

    checkmark: {
        position: "absolute",
        top: 8,
        right: 8,
    },

    serviceIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
        backgroundColor: "#F1F8FE",
        borderWidth: 1,
        borderColor: "#BBDEFB",
    },

    serviceName: {
        fontSize: 12,
        fontWeight: "600",
        color: "#1A1A1A",
        textAlign: "center",
        lineHeight: 16,
    },

    // Input Card
    inputCard: {
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },

    inputLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: "#666",
        marginBottom: 8,
    },

    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    textInput: {
        flex: 1,
        fontSize: 16,
        color: "#1A1A1A",
        paddingVertical: 8,
    },

    rupeeSymbol: {
        fontSize: 18,
        fontWeight: "600",
        color: "#666",
    },

    detailsRow: {
        flexDirection: "row",
        gap: 12,
    },

    detailCard: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        padding: 12,
        borderRadius: 12,
    },

    detailLabel: {
        fontSize: 12,
        color: "#999",
        marginBottom: 4,
    },

    detailValue: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1A1A1A",
    },

    // Plan Cards
    planCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: "transparent",
    },

    planCardSelected: {
        borderColor: "#1E88E5",
        backgroundColor: "#E3F2FD",
    },

    planLeft: {
        flex: 1,
    },

    planAmount: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1A1A1A",
        marginBottom: 4,
    },

    planDetails: {
        fontSize: 14,
        color: "#666",
    },

    orDivider: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 16,
    },

    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#E0E0E0",
    },

    orText: {
        fontSize: 13,
        color: "#999",
        marginHorizontal: 12,
    },

    customAmountCard: {
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 16,
    },

    // Frequency
    frequencyCard: {
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 16,
    },

    frequencyLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 12,
    },

    frequencyOption: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 12,
    },

    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#1E88E5",
        justifyContent: "center",
        alignItems: "center",
    },

    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#1E88E5",
    },

    frequencyText: {
        fontSize: 15,
        color: "#1A1A1A",
    },

    // Payment Cards
    paymentCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: "transparent",
    },

    paymentCardSelected: {
        borderColor: "#1E88E5",
        backgroundColor: "#E3F2FD",
    },

    paymentLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    paymentIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#F5F7FA",
        justifyContent: "center",
        alignItems: "center",
    },

    paymentName: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 4,
    },

    paymentDetail: {
        fontSize: 13,
        color: "#666",
    },

    addPaymentLink: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingVertical: 8,
    },

    addPaymentText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1E88E5",
    },

    // Summary
    summaryCard: {
        backgroundColor: "#F5F7FA",
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
    },

    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    summaryLabel: {
        fontSize: 14,
        color: "#666",
    },

    summaryValue: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1A1A1A",
    },

    infoBadges: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 12,
    },

    infoBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#E8F5E9",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },

    infoBadgeText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#2E7D32",
    },

    cashbackInfo: {
        backgroundColor: "#FFF3E0",
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#FFE0B2",
    },

    cashbackText: {
        fontSize: 13,
        color: "#E65100",
        textAlign: "center",
    },

    // Bottom CTA
    bottomCTA: {
        padding: 20,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#F0F0F0",
    },

    enableButton: {
        borderRadius: 25,
        overflow: "hidden",
        shadowColor: "#2E7D32",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },

    enableGradient: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        paddingVertical: 16,
    },

    enableButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
    },

    // Modals
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },

    modalContent: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 24,
        width: "100%",
        maxWidth: 400,
        alignItems: "center",
    },

    modalIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#E8F5E9",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1A1A1A",
        marginBottom: 8,
        textAlign: "center",
    },

    modalMessage: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        lineHeight: 20,
        marginBottom: 24,
    },

    modalButtons: {
        flexDirection: "row",
        gap: 12,
        width: "100%",
    },

    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: "#F5F5F5",
        alignItems: "center",
    },

    cancelButtonText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#666",
    },

    confirmButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: "#2E7D32",
        alignItems: "center",
    },

    confirmButtonText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#FFFFFF",
    },

    // Success Modal
    successContent: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 32,
        width: "100%",
        maxWidth: 400,
        alignItems: "center",
    },

    successIconCircle: {
        marginBottom: 20,
    },

    successTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#1A1A1A",
        marginBottom: 8,
        textAlign: "center",
    },

    successMessage: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        lineHeight: 20,
        marginBottom: 24,
    },

    viewAutopayButton: {
        backgroundColor: "#2E7D32",
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 25,
    },

    viewAutopayButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
});
