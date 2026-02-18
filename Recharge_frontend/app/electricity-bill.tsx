import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Animated,
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

interface BillDetails {
    consumerName: string;
    billNumber: string;
    billingPeriod: string;
    dueDate: string;
    amount: number;
    boardName: string;
}

export default function ElectricityBillScreen() {
    const router = useRouter();

    // Dynamic back navigation handling
    const handleBack = () => {
        router.back();
        return true;
    };

    useFocusEffect(
        React.useCallback(() => {
            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                handleBack
            );

            return () => backHandler.remove();
        }, [router])
    );

    // Form states
    const [selectedState, setSelectedState] = useState("");
    const [selectedBoard, setSelectedBoard] = useState("");
    const [consumerNumber, setConsumerNumber] = useState("");
    const [showStateModal, setShowStateModal] = useState(false);
    const [showBoardModal, setShowBoardModal] = useState(false);
    const [stateSearchQuery, setStateSearchQuery] = useState("");
    const [boardSearchQuery, setBoardSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [billDetails, setBillDetails] = useState<BillDetails | null>(null);
    const [fetchError, setFetchError] = useState("");
    const [consumerNumberError, setConsumerNumberError] = useState("");

    // Animation
    const slideAnim = React.useRef(new Animated.Value(50)).current;
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    // Sample data (will be replaced by API)
    const states = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
        "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
        "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
        "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir"
    ];

    const boardsByState: { [key: string]: string[] } = {
        "Maharashtra": ["MSEDCL (Maharashtra State Electricity Distribution Co. Ltd.)", "Tata Power - Mumbai", "Adani Electricity - Mumbai"],
        "Delhi": ["BSES Rajdhani", "BSES Yamuna", "Tata Power Delhi", "NDMC"],
        "Karnataka": ["BESCOM (Bangalore)", "MESCOM (Mangalore)", "HESCOM (Hubli)", "GESCOM (Gulbarga)", "CHESCOM (Chamundeshwari)"],
        "Tamil Nadu": ["TNEB (Tamil Nadu Electricity Board)", "Tangedco"],
        "Gujarat": ["DGVCL (Dakshin Gujarat)", "MGVCL (Madhya Gujarat)", "PGVCL (Paschim Gujarat)", "UGVCL (Uttar Gujarat)", "Torrent Power - Ahmedabad"],
        "Uttar Pradesh": ["DVVNL (Dakshinanchal)", "MVVNL (Madhyanchal)", "PVVNL (Paschimanchal)", "PUVVNL (Purvanchal)"],
    };

    const filteredStates = states.filter(state =>
        state.toLowerCase().includes(stateSearchQuery.toLowerCase())
    );

    const boardsForSelectedState = selectedState ? (boardsByState[selectedState] || []) : [];
    const filteredBoards = boardsForSelectedState.filter(board =>
        board.toLowerCase().includes(boardSearchQuery.toLowerCase())
    );

    const handleStateSelect = (state: string) => {
        setSelectedState(state);
        setSelectedBoard(""); // Reset board when state changes
        setShowStateModal(false);
        setStateSearchQuery("");
    };

    const handleBoardSelect = (board: string) => {
        setSelectedBoard(board);
        setShowBoardModal(false);
        setBoardSearchQuery("");
    };

    const validateConsumerNumber = () => {
        if (consumerNumber.trim().length === 0) {
            setConsumerNumberError("Consumer number is required");
            return false;
        }
        if (consumerNumber.trim().length < 5) {
            setConsumerNumberError("Consumer number must be at least 5 characters");
            return false;
        }
        setConsumerNumberError("");
        return true;
    };

    const handleFetchBill = async () => {
        if (!validateConsumerNumber()) return;

        setIsLoading(true);
        setFetchError("");

        // Simulate API call (replace with actual API later)
        setTimeout(() => {
            // Sample response - replace with actual API response
            const mockBillData = {
                consumerName: "John Doe",
                billNumber: "MB123456789",
                billingPeriod: "01 Jan 2026 - 31 Jan 2026",
                dueDate: "15 Feb 2026",
                amount: 2450,
                boardName: selectedBoard.split("(")[0].trim(),
            };

            setBillDetails(mockBillData);
            setIsLoading(false);

            // Animate bill card appearance
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start();
        }, 2000);
    };

    const handlePayNow = () => {
        if (!billDetails) return;
        // Navigate to payment screen with bill details
        // Note: "/payment" needs to be implemented or replaced with an existing route
        router.push({
            pathname: "/wallet" as any,
            params: {
                amount: billDetails.amount.toString(),
                billType: "electricity",
                consumerName: billDetails.consumerName,
                billNumber: billDetails.billNumber,
            },
        });
    };

    const isFormValid = selectedState && selectedBoard && consumerNumber.trim().length > 0;

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleBack}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                    </TouchableOpacity>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>Electricity Bill</Text>
                        <Text style={styles.headerSubtext}>
                            Pay any electricity board across India
                        </Text>
                    </View>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        {/* Electricity Banner */}
                        <LinearGradient
                            colors={["#E3F2FD", "#BBDEFB"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.banner}
                        >
                            <View style={styles.bannerIconCircle}>
                                <Ionicons name="flash" size={28} color="#1976D2" />
                            </View>
                            <View style={styles.bannerTextContainer}>
                                <Text style={styles.bannerTitle}>
                                    Instant Electricity Bill Payment
                                </Text>
                                <View style={styles.bannerFeatures}>
                                    <View style={styles.featureItem}>
                                        <Ionicons name="shield-checkmark" size={14} color="#1976D2" />
                                        <Text style={styles.featureText}>Secure</Text>
                                    </View>
                                    <View style={styles.featureDot} />
                                    <View style={styles.featureItem}>
                                        <Ionicons name="location" size={14} color="#1976D2" />
                                        <Text style={styles.featureText}>PAN India</Text>
                                    </View>
                                    <View style={styles.featureDot} />
                                    <View style={styles.featureItem}>
                                        <Ionicons name="checkmark-circle" size={14} color="#1976D2" />
                                        <Text style={styles.featureText}>Instant Confirmation</Text>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>

                        {/* Select State */}
                        <View style={styles.inputCard}>
                            <Text style={styles.inputLabel}>State</Text>
                            <TouchableOpacity
                                style={styles.selectField}
                                onPress={() => setShowStateModal(true)}
                            >
                                <Text style={[styles.selectText, !selectedState && styles.placeholderText]}>
                                    {selectedState || "Select State"}
                                </Text>
                                <Ionicons name="chevron-down" size={20} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {/* Select Board */}
                        <View style={[styles.inputCard, !selectedState && styles.disabledCard]}>
                            <Text style={styles.inputLabel}>Electricity Board</Text>
                            <TouchableOpacity
                                style={styles.selectField}
                                onPress={() => selectedState && setShowBoardModal(true)}
                                disabled={!selectedState}
                            >
                                <Text style={[styles.selectText, !selectedBoard && styles.placeholderText]}>
                                    {selectedBoard || "Select Board"}
                                </Text>
                                <Ionicons name="chevron-down" size={20} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {/* Consumer Number Input */}
                        <View style={styles.inputCard}>
                            <Text style={styles.inputLabel}>Consumer Number / CA Number</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter Consumer Number"
                                value={consumerNumber}
                                onChangeText={(text) => {
                                    setConsumerNumber(text);
                                    setConsumerNumberError("");
                                }}
                                onBlur={validateConsumerNumber}
                            />
                            <Text style={styles.helperText}>
                                Enter number as per your electricity bill
                            </Text>
                            {consumerNumberError ? (
                                <Text style={styles.errorText}>{consumerNumberError}</Text>
                            ) : null}
                        </View>

                        {/* Fetch Bill Button */}
                        <TouchableOpacity
                            style={[styles.fetchButton, !isFormValid && styles.fetchButtonDisabled]}
                            onPress={handleFetchBill}
                            disabled={!isFormValid || isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.fetchButtonText}>Fetch Bill</Text>
                            )}
                        </TouchableOpacity>

                        {/* Bill Details Card (After Fetch) */}
                        {billDetails && (
                            <Animated.View
                                style={[
                                    styles.billDetailsCard,
                                    {
                                        opacity: fadeAnim,
                                        transform: [{ translateY: slideAnim }],
                                    },
                                ]}
                            >
                                <View style={styles.billHeader}>
                                    <View style={styles.billIconCircle}>
                                        <Ionicons name="flash" size={24} color="#4CAF50" />
                                    </View>
                                    <Text style={styles.billBoardName}>{billDetails.boardName}</Text>
                                </View>

                                <View style={styles.billRow}>
                                    <Text style={styles.billLabel}>Consumer Name</Text>
                                    <Text style={styles.billValue}>{billDetails.consumerName}</Text>
                                </View>

                                <View style={styles.billRow}>
                                    <Text style={styles.billLabel}>Bill Number</Text>
                                    <Text style={styles.billValue}>{billDetails.billNumber}</Text>
                                </View>

                                <View style={styles.billRow}>
                                    <Text style={styles.billLabel}>Billing Period</Text>
                                    <Text style={styles.billValue}>{billDetails.billingPeriod}</Text>
                                </View>

                                <View style={styles.billRow}>
                                    <Text style={styles.billLabel}>Due Date</Text>
                                    <Text style={[styles.billValue, styles.dueDateValue]}>
                                        {billDetails.dueDate}
                                    </Text>
                                </View>

                                <View style={styles.amountSection}>
                                    <Text style={styles.amountLabel}>Amount Payable</Text>
                                    <Text style={styles.amountValue}>₹{billDetails.amount}</Text>
                                </View>
                            </Animated.View>
                        )}

                        {/* Error Card */}
                        {fetchError && (
                            <View style={styles.errorCard}>
                                <Ionicons name="alert-circle" size={40} color="#E53935" />
                                <Text style={styles.errorCardText}>{fetchError}</Text>
                            </View>
                        )}

                        {/* Pay Now Button */}
                        {billDetails && (
                            <TouchableOpacity
                                style={styles.payButton}
                                onPress={handlePayNow}
                            >
                                <LinearGradient
                                    colors={["#66BB6A", "#4CAF50"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.payGradient}
                                >
                                    <Text style={styles.payButtonText}>Pay ₹{billDetails.amount}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>

                {/* State Selection Modal */}
                <Modal
                    visible={showStateModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowStateModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Select State</Text>
                                <TouchableOpacity onPress={() => setShowStateModal(false)}>
                                    <Ionicons name="close" size={24} color="#666" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.searchContainer}>
                                <Ionicons name="search" size={20} color="#666" />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search state..."
                                    value={stateSearchQuery}
                                    onChangeText={setStateSearchQuery}
                                />
                            </View>

                            <ScrollView style={styles.optionsList}>
                                {filteredStates.map((state, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.optionItem}
                                        onPress={() => handleStateSelect(state)}
                                    >
                                        <Text style={styles.optionText}>{state}</Text>
                                        {selectedState === state && (
                                            <Ionicons name="checkmark-circle" size={20} color="#2196F3" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                {/* Board Selection Modal */}
                <Modal
                    visible={showBoardModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowBoardModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Select Electricity Board</Text>
                                <TouchableOpacity onPress={() => setShowBoardModal(false)}>
                                    <Ionicons name="close" size={24} color="#666" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.searchContainer}>
                                <Ionicons name="search" size={20} color="#666" />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search board..."
                                    value={boardSearchQuery}
                                    onChangeText={setBoardSearchQuery}
                                />
                            </View>

                            <ScrollView style={styles.optionsList}>
                                {filteredBoards.map((board, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.optionItem}
                                        onPress={() => handleBoardSelect(board)}
                                    >
                                        <Text style={styles.optionText}>{board}</Text>
                                        {selectedBoard === board && (
                                            <Ionicons name="checkmark-circle" size={20} color="#2196F3" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
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
        backgroundColor: "#F6F9FC",
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

    // Banner
    banner: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 24,
        marginBottom: 20,
        shadowColor: "#2196F3",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },

    bannerIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    bannerTextContainer: {
        flex: 1,
    },

    bannerTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1976D2",
        marginBottom: 6,
    },

    bannerFeatures: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
    },

    featureItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },

    featureText: {
        fontSize: 11,
        color: "#1976D2",
    },

    featureDot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: "#1976D2",
        marginHorizontal: 6,
    },

    // Input Cards
    inputCard: {
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },

    disabledCard: {
        opacity: 0.5,
    },

    inputLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: "#666",
        marginBottom: 12,
    },

    selectField: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },

    selectText: {
        fontSize: 16,
        color: "#1A1A1A",
    },

    placeholderText: {
        color: "#999",
    },

    textInput: {
        fontSize: 16,
        color: "#1A1A1A",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },

    helperText: {
        fontSize: 12,
        color: "#999",
        marginTop: 8,
    },

    errorText: {
        fontSize: 12,
        color: "#E53935",
        marginTop: 4,
    },

    // Fetch Button
    fetchButton: {
        backgroundColor: "#2196F3",
        paddingVertical: 16,
        borderRadius: 24,
        alignItems: "center",
        marginBottom: 20,
        shadowColor: "#2196F3",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },

    fetchButtonDisabled: {
        backgroundColor: "#E0E0E0",
        shadowOpacity: 0,
    },

    fetchButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
    },

    // Bill Details Card
    billDetailsCard: {
        backgroundColor: "#F1F8FE",
        padding: 20,
        borderRadius: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#BBDEFB",
    },

    billHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#BBDEFB",
    },

    billIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#E8F5E9",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    billBoardName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1A1A1A",
        flex: 1,
    },

    billRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    billLabel: {
        fontSize: 14,
        color: "#666",
    },

    billValue: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1A1A1A",
    },

    dueDateValue: {
        color: "#FF9800",
    },

    amountSection: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: "#BBDEFB",
        alignItems: "center",
    },

    amountLabel: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
    },

    amountValue: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#4CAF50",
    },

    // Error Card
    errorCard: {
        backgroundColor: "#FFEBEE",
        padding: 24,
        borderRadius: 20,
        alignItems: "center",
        marginBottom: 20,
    },

    errorCardText: {
        fontSize: 14,
        color: "#E53935",
        textAlign: "center",
        marginTop: 12,
    },

    // Pay Button
    payButton: {
        borderRadius: 24,
        overflow: "hidden",
        shadowColor: "#4CAF50",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },

    payGradient: {
        paddingVertical: 16,
        alignItems: "center",
    },

    payButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },

    modalContent: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 20,
        maxHeight: "80%",
    },

    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 16,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1A1A1A",
    },

    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F6F9FC",
        marginHorizontal: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 16,
    },

    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#1A1A1A",
        marginLeft: 12,
    },

    optionsList: {
        maxHeight: 400,
    },

    optionItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },

    optionText: {
        fontSize: 15,
        color: "#1A1A1A",
        flex: 1,
    },
});