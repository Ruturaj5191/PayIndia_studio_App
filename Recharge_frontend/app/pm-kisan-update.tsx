import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    BackHandler,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface DocumentType {
    name: string;
    uri: string;
}

export default function PMKisanUpdateScreen() {
    const router = useRouter();

    // State
    const [step, setStep] = useState(1); // 1: OTP, 2: Edit, 3: Success
    const [mobileNumber, setMobileNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [selectedFields, setSelectedFields] = useState<string[]>([]);
    const [documents, setDocuments] = useState<{ [key: string]: DocumentType | null }>({
        aadhaar: null,
        bank: null,
        land: null,
        mobile: null,
    });

    const updateOptions = [
        { id: "mobile", title: "Mobile Number Update", icon: "phone-settings-outline", color: "#2196F3" },
        { id: "aadhaar", title: "Aadhaar Correction", icon: "card-account-details-outline", color: "#2E7D32" },
        { id: "bank", title: "Bank Account Change", icon: "bank-outline", color: "#E65100" },
        { id: "land", title: "Land Record Update", icon: "map-marker-distance", color: "#455A64" },
    ];

    useEffect(() => {
        const backAction = () => {
            if (step === 2) {
                setStep(1);
                return true;
            }
            router.back();
            return true;
        };
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, [step]);

    const handleSendOtp = () => {
        if (mobileNumber.length !== 10) {
            Alert.alert("Invalid Mobile", "Please enter a valid 10-digit mobile number");
            return;
        }
        setIsOtpSent(true);
        Alert.alert("OTP Sent", "A verification code has been sent to your registered mobile number.");
    };

    const handleVerifyOtp = () => {
        if (otp.length !== 6) {
            Alert.alert("Invalid OTP", "Please enter the 6-digit verification code");
            return;
        }
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            setStep(2);
        }, 1500);
    };

    const toggleField = (id: string) => {
        if (selectedFields.includes(id)) {
            setSelectedFields(selectedFields.filter(f => f !== id));
        } else {
            setSelectedFields([...selectedFields, id]);
        }
    };

    const pickDocument = async (field: string) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: ["application/pdf", "image/*"] });
            if (result.canceled === false && result.assets) {
                setDocuments(prev => ({ ...prev, [field]: { name: result.assets[0].name, uri: result.assets[0].uri } }));
            }
        } catch (e) {
            Alert.alert("Error", "Failed to upload document");
        }
    };

    const handleSubmit = () => {
        if (selectedFields.length === 0) {
            Alert.alert("Select Fields", "Please select at least one field to update");
            return;
        }
        // Basic check for uploads
        for (const field of selectedFields) {
            if (!documents[field]) {
                Alert.alert("Missing Document", `Please upload supporting document for ${field.charAt(0).toUpperCase() + field.slice(1)} update`);
                return;
            }
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setStep(3);
        }, 2000);
    };

    if (step === 3) {
        return (
            <View style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <SafeAreaView style={styles.successContainer}>
                    <View style={styles.successIconCircle}>
                        <Ionicons name="checkmark-done-circle" size={80} color="#2E7D32" />
                    </View>
                    <Text style={styles.successTitle}>Update Requested!</Text>
                    <Text style={styles.successSubtitle}>Your request for PM-KISAN details update has been submitted successfully.</Text>

                    <View style={styles.idCard}>
                        <Text style={styles.idLabel}>Request ID</Text>
                        <Text style={styles.idValue}>UPK-{Math.random().toString(36).substr(2, 6).toUpperCase()}</Text>
                    </View>

                    <TouchableOpacity style={styles.mainBtn} onPress={() => router.back()}>
                        <LinearGradient colors={['#1565C0', '#0D47A1']} style={styles.btnGrad}>
                            <Text style={styles.mainBtnText}>Back to Services</Text>
                            <Ionicons name="home-outline" size={18} color="#FFF" />
                        </LinearGradient>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => step === 2 ? setStep(1) : router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>Update Details</Text>
                        <Text style={styles.headerSubtitle}>PM-KISAN Samman Nidhi</Text>
                    </View>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {step === 1 ? (
                        <View style={styles.stepWrapper}>
                            <View style={styles.instructionCard}>
                                <Ionicons name="shield-checkmark" size={24} color="#1565C0" />
                                <Text style={styles.instructionText}>For security, we need to verify your identity via OTP before you can update farmer details.</Text>
                            </View>

                            <View style={styles.formCard}>
                                <Text style={styles.label}>Mobile Number *</Text>
                                <View style={styles.otpInputRow}>
                                    <View style={{ flex: 1 }}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter registered mobile"
                                            keyboardType="number-pad"
                                            maxLength={10}
                                            value={mobileNumber}
                                            onChangeText={setMobileNumber}
                                            editable={!isOtpSent}
                                        />
                                    </View>
                                    <TouchableOpacity style={[styles.inlineOtpBtn, isOtpSent && styles.inlineOtpBtnDisabled]} onPress={handleSendOtp}>
                                        <Text style={styles.inlineOtpBtnText}>{isOtpSent ? "Resend" : "Send OTP"}</Text>
                                    </TouchableOpacity>
                                </View>

                                {isOtpSent && (
                                    <View style={{ marginTop: 20 }}>
                                        <Text style={styles.label}>Enter 6-digit OTP *</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="X X X X X X"
                                            keyboardType="number-pad"
                                            maxLength={6}
                                            value={otp}
                                            onChangeText={setOtp}
                                        />
                                        <TouchableOpacity style={styles.verifyBtn} onPress={handleVerifyOtp} disabled={isVerifying}>
                                            <LinearGradient colors={["#2E7D32", "#1B5E20"]} style={styles.btnContent}>
                                                {isVerifying ? <ActivityIndicator color="#FFF" /> : (
                                                    <><Text style={styles.btnLabel}>Verify & Continue</Text><Ionicons name="arrow-forward" size={18} color="#FFF" /></>
                                                )}
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </View>
                    ) : (
                        <View style={styles.stepWrapper}>
                            <Text style={styles.sectionTitle}>Select fields to update:</Text>
                            <View style={styles.optionsGrid}>
                                {updateOptions.map((opt) => (
                                    <TouchableOpacity
                                        key={opt.id}
                                        style={[styles.optCard, selectedFields.includes(opt.id) && styles.optCardActive]}
                                        onPress={() => toggleField(opt.id)}
                                    >
                                        <View style={[styles.optIconCircle, { backgroundColor: opt.color + "15" }]}>
                                            <MaterialCommunityIcons name={opt.icon as any} size={24} color={opt.color} />
                                        </View>
                                        <Text style={styles.optTitle}>{opt.title}</Text>
                                        <Ionicons name={selectedFields.includes(opt.id) ? "checkbox" : "square-outline"} size={22} color={selectedFields.includes(opt.id) ? "#1565C0" : "#CBD5E1"} />
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {selectedFields.length > 0 && (
                                <View style={{ marginTop: 20 }}>
                                    <Text style={styles.sectionTitle}>Upload Supporting Documents:</Text>
                                    <View style={styles.uploadList}>
                                        {selectedFields.map(f => (
                                            <TouchableOpacity key={f} style={[styles.uploadItem, documents[f] && styles.uploadItemActive]} onPress={() => pickDocument(f)}>
                                                <Ionicons name={documents[f] ? "checkmark-circle" : "document-attach-outline"} size={24} color={documents[f] ? "#2E7D32" : "#1565C0"} />
                                                <Text style={styles.uploadItemText}>{documents[f] ? documents[f]?.name : `Upload for ${f.charAt(0).toUpperCase() + f.slice(1)} Update`}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isSubmitting}>
                                        <LinearGradient colors={["#1565C0", "#0D47A1"]} style={styles.btnContent}>
                                            {isSubmitting ? <ActivityIndicator color="#FFF" /> : (
                                                <><Text style={styles.btnLabel}>Submit Update Request</Text><Ionicons name="cloud-upload-outline" size={18} color="#FFF" /></>
                                            )}
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8FAFC" },
    safeArea: { flex: 1 },
    header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20, backgroundColor: "#FFF" },
    backButton: { padding: 4 },
    headerCenter: { flex: 1, alignItems: "center" },
    headerTitle: { fontSize: 17, fontWeight: "800", color: "#1E293B" },
    headerSubtitle: { fontSize: 11, color: "#64748B", marginTop: 2 },
    scrollContent: { padding: 20 },
    stepWrapper: { gap: 15 },

    instructionCard: { flexDirection: "row", gap: 12, backgroundColor: "#E3F2FD", padding: 16, borderRadius: 16, alignItems: "center" },
    instructionText: { flex: 1, fontSize: 13, color: "#1565C0", fontWeight: "600", lineHeight: 20 },

    formCard: { backgroundColor: "#FFF", borderRadius: 20, padding: 20, elevation: 2, shadowColor: "#64748B", shadowOpacity: 0.1, shadowRadius: 10 },
    label: { fontSize: 13, fontWeight: "700", color: "#475569", marginBottom: 8 },
    input: { backgroundColor: "#F8FAFC", borderRadius: 12, padding: 14, fontSize: 16, color: "#1E293B", borderWidth: 1, borderColor: "#E2E8F0" },
    otpInputRow: { flexDirection: "row", gap: 10 },
    inlineOtpBtn: { backgroundColor: "#F1F5F9", paddingHorizontal: 15, borderRadius: 12, justifyContent: "center", borderWidth: 1, borderColor: "#E2E8F0" },
    inlineOtpBtnDisabled: { opacity: 0.6 },
    inlineOtpBtnText: { color: "#1565C0", fontWeight: "700", fontSize: 12 },

    verifyBtn: { marginTop: 20, borderRadius: 16, overflow: "hidden" },
    submitBtn: { marginTop: 30, borderRadius: 16, overflow: "hidden" },
    btnContent: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 16, gap: 8 },
    btnLabel: { fontSize: 16, fontWeight: "800", color: "#FFF" },

    sectionTitle: { fontSize: 16, fontWeight: "800", color: "#1E293B", marginBottom: 10 },
    optionsGrid: { gap: 12 },
    optCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", padding: 16, borderRadius: 16, gap: 16, borderWidth: 1, borderColor: "#F1F5F9" },
    optCardActive: { borderColor: "#1565C0", backgroundColor: "#F1F8FE" },
    optIconCircle: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    optTitle: { flex: 1, fontSize: 14, fontWeight: "700", color: "#1E293B" },

    uploadList: { gap: 10 },
    uploadItem: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#F8FAFC", borderRadius: 12, padding: 16, borderWidth: 1, borderStyle: "dashed", borderColor: "#CBD5E1" },
    uploadItemActive: { backgroundColor: "#F0FDF4", borderColor: "#2E7D32", borderStyle: "solid" },
    uploadItemText: { flex: 1, fontSize: 13, color: "#64748B", fontWeight: "600" },

    successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30, backgroundColor: '#FFF' },
    successIconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F1F8E9', alignItems: 'center', justifyContent: 'center', marginBottom: 25 },
    successTitle: { fontSize: 24, fontWeight: '800', color: '#1E293B', marginBottom: 10 },
    successSubtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 35, lineHeight: 22 },
    idCard: { backgroundColor: '#F8FAFC', borderRadius: 20, padding: 25, width: '100%', alignItems: 'center', marginBottom: 35, borderWidth: 1, borderColor: "#E2E8F0" },
    idLabel: { fontSize: 12, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, fontWeight: "700" },
    idValue: { fontSize: 28, fontWeight: '900', color: '#1565C0' },
    mainBtn: { width: '100%', borderRadius: 16, overflow: 'hidden' },
    mainBtnText: { fontSize: 16, fontWeight: '800', color: '#FFF' },
    btnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, gap: 12 },
});
