import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
    ActivityIndicator,
    Alert,
    BackHandler,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type ServiceType = 'Mobile' | 'DTH';

export default function UpdateRechargeDetailsScreen() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [serviceType, setServiceType] = useState<ServiceType>('Mobile');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [otp, setOtp] = useState("");
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [requestSuccess, setRequestSuccess] = useState(false);
    const [referenceId, setReferenceId] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        serviceNumber: '', // Mobile or Customer ID
        operator: '',
        registeredMobile: '',

        // Step 2
        correctedNumber: '',
        newOperator: '',
        altContact: '',
        email: '',
        autoRecharge: false,
        newPackage: '',

        declaration: false,
    });

    const [documents, setDocuments] = useState<any>({
        receipt: null,
        aadhaar: null,
    });

    useEffect(() => {
        const backAction = () => {
            if (currentStep > 1 && !requestSuccess) {
                setCurrentStep(currentStep - 1);
                return true;
            }
            router.back();
            return true;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, [currentStep, requestSuccess, router]);

    const handleSendOtp = () => {
        if (formData.registeredMobile.length !== 10) {
            Alert.alert("Invalid Mobile", "Please enter a valid 10-digit mobile number");
            return;
        }
        setIsOtpSent(true);
        Alert.alert("OTP Sent", "A verification code has been sent to " + formData.registeredMobile);
    };

    const handleVerifyOtp = () => {
        if (otp === "1234" || otp.length === 4) {
            setIsOtpVerified(true);
            Alert.alert("Success", "Mobile number verified successfully");
        } else {
            Alert.alert("Error", "Please enter a valid 4-digit OTP (Use 1234)");
        }
    };

    const handleFetchConnectionDetails = () => {
        if (!formData.serviceNumber || !formData.operator || !formData.registeredMobile) {
            Alert.alert("Details Required", "Please fill all fields");
            return;
        }
        if (!isOtpVerified) {
            Alert.alert("Verification Required", "Please verify your mobile number with OTP");
            return;
        }

        setIsFetchingData(true);
        setTimeout(() => {
            setIsFetchingData(false);
            setCurrentStep(2);
        }, 1500);
    };

    const handleSaveAndContinue = () => {
        if (formData.correctedNumber && !documents.aadhaar) {
            Alert.alert("Document Required", "Aadhaar card is required for number correction");
            return;
        }
        setCurrentStep(3);
    };

    const handleSubmitRequest = () => {
        if (!formData.declaration) {
            Alert.alert("Declaration", "Please accept the final declaration");
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            const ref = "REC" + Math.floor(Math.random() * 9000000 + 1000000);
            setReferenceId(ref);
            setIsSubmitting(false);
            setRequestSuccess(true);
        }, 2000);
    };

    const pickDocument = async (docType: string) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ["application/pdf", "image/*"],
                copyToCacheDirectory: true,
            });

            if (result.canceled === false && result.assets) {
                const asset = result.assets[0];
                setDocuments((prev: any) => ({
                    ...prev,
                    [docType]: {
                        name: asset.name,
                        size: asset.size,
                        uri: asset.uri
                    }
                }));
            }
        } catch (error) {
            Alert.alert("Error", "Failed to select document");
        }
    };

    const removeDocument = (docType: string) => {
        setDocuments((prev: any) => ({ ...prev, [docType]: null }));
    };

    if (requestSuccess) {
        return (
            <View style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={[styles.successContainer, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                    <View style={styles.successIconCircle}>
                        <Ionicons name="checkmark-done-circle" size={80} color="#2E7D32" />
                    </View>
                    <Text style={styles.successTitle}>Request Submitted!</Text>
                    <Text style={styles.successSubtitle}>Your recharge details update request has been received</Text>

                    <View style={styles.refCard}>
                        <Text style={styles.refLabel}>Reference Number</Text>
                        <Text style={styles.refValue}>{referenceId}</Text>
                    </View>

                    <View style={styles.infoBox}>
                        <Ionicons name="time-outline" size={20} color="#666" />
                        <Text style={styles.infoBoxText}>Estimated processing time: 24-48 hours</Text>
                    </View>

                    <TouchableOpacity style={styles.returnBtn} onPress={() => router.back()}>
                        <LinearGradient colors={['#0D47A1', '#1565C0']} style={styles.btnGrad}>
                            <Text style={styles.btnText}>Return to Services</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>Update Details</Text>
                        <Text style={styles.headerSubtitle}>Mobile/DTH connection (मोबाईल / डीटीएच माहिती)</Text>
                    </View>
                    <View style={styles.placeholder} />
                </View>

                {/* Step Indicator */}
                <View style={styles.stepContainer}>
                    <View style={styles.progressLine}>
                        <View style={[styles.progressLineActive, { width: `${((currentStep - 1) / 2) * 100}%` }]} />
                    </View>
                    {[1, 2, 3].map((s) => (
                        <View key={s} style={styles.stepItem}>
                            <View style={[styles.stepCircle, currentStep >= s && styles.stepCircleActive]}>
                                {currentStep > s ? (
                                    <Ionicons name="checkmark" size={16} color="#FFF" />
                                ) : (
                                    <Text style={[styles.stepNumber, currentStep >= s && styles.stepNumberActive]}>{s}</Text>
                                )}
                            </View>
                            <Text style={[styles.stepLabel, currentStep >= s && styles.stepLabelActive]}>
                                {s === 1 ? "Verification" : s === 2 ? "Edit Details" : "Review"}
                            </Text>
                        </View>
                    ))}
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Required Documents Info - Step 1 Only */}
                    {currentStep === 1 && (
                        <View style={styles.docsRequiredBox}>
                            <View style={styles.docsHeader}>
                                <Ionicons name="document-text-outline" size={20} color="#0D47A1" />
                                <Text style={styles.docsTitle}>Required Documents:</Text>
                            </View>
                            <View style={styles.docsList}>
                                <Text style={styles.docBullet}>• Mobile Number / Customer ID</Text>
                                <Text style={styles.docBullet}>• Registered Mobile Number</Text>
                                <Text style={styles.docBullet}>• Aadhaar Card (for Correction)</Text>
                            </View>
                        </View>
                    )}

                    {/* Step 1: Verification */}
                    {currentStep === 1 && (
                        <View>
                            <SectionTitle title="Service Verification" icon="shield-checkmark" />

                            <View style={styles.serviceSelectionRow}>
                                <TouchableOpacity
                                    style={[styles.serviceTypeBtn, serviceType === 'Mobile' && styles.serviceTypeBtnActive]}
                                    onPress={() => setServiceType('Mobile')}
                                >
                                    <MaterialCommunityIcons name="cellphone" size={20} color={serviceType === 'Mobile' ? '#FFF' : '#64748B'} />
                                    <Text style={[styles.serviceTypeLabel, serviceType === 'Mobile' && styles.serviceTypeLabelActive]}>Mobile</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.serviceTypeBtn, serviceType === 'DTH' && styles.serviceTypeBtnActive]}
                                    onPress={() => setServiceType('DTH')}
                                >
                                    <MaterialCommunityIcons name="satellite-variant" size={20} color={serviceType === 'DTH' ? '#FFF' : '#64748B'} />
                                    <Text style={[styles.serviceTypeLabel, serviceType === 'DTH' && styles.serviceTypeLabelActive]}>DTH</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.formCard}>
                                <Label text={serviceType === 'Mobile' ? "Mobile Number *" : "Customer ID / VC Number *"} />
                                <Input
                                    value={formData.serviceNumber}
                                    onChangeText={(v: string) => {
                                        const clean = v.replace(/\D/g, '');
                                        setFormData({ ...formData, serviceNumber: serviceType === 'Mobile' ? clean.substring(0, 10) : v });
                                    }}
                                    placeholder={serviceType === 'Mobile' ? "Enter 10-digit number" : "Enter Customer ID"}
                                    icon={serviceType === 'Mobile' ? "phone-portrait-outline" : "card-outline"}
                                    keyboardType={serviceType === 'Mobile' ? "phone-pad" : "default"}
                                    maxLength={serviceType === 'Mobile' ? 10 : undefined}
                                />

                                <Label text={serviceType === 'Mobile' ? "Mobile Operator *" : "DTH Operator *"} />
                                <Input
                                    value={formData.operator}
                                    onChangeText={(v: string) => setFormData({ ...formData, operator: v })}
                                    placeholder={serviceType === 'Mobile' ? "e.g. Jio, Airtel" : "e.g. Tata Play, Dish TV"}
                                    icon="business-outline"
                                />

                                <Label text="Registered Mobile Number *" />
                                <View style={styles.otpInputContainer}>
                                    <View style={{ flex: 1 }}>
                                        <Input
                                            value={formData.registeredMobile}
                                            onChangeText={(v: string) => setFormData({ ...formData, registeredMobile: v.replace(/\D/g, '').substring(0, 10) })}
                                            placeholder="Enter registered mobile"
                                            icon="call-outline"
                                            keyboardType="number-pad"
                                            maxLength={10}
                                            editable={!isOtpVerified}
                                        />
                                    </View>
                                    {!isOtpVerified && (
                                        <TouchableOpacity style={[styles.otpBtn, isOtpSent && styles.otpBtnDisabled]} onPress={handleSendOtp}>
                                            <Text style={styles.otpBtnText}>{isOtpSent ? "Resend" : "Send OTP"}</Text>
                                        </TouchableOpacity>
                                    )}
                                    {isOtpVerified && (
                                        <View style={styles.verifiedBadge}>
                                            <Ionicons name="checkmark-circle" size={24} color="#2E7D32" />
                                        </View>
                                    )}
                                </View>

                                {isOtpSent && !isOtpVerified && (
                                    <View style={{ marginTop: 15 }}>
                                        <Label text="Enter 4-digit OTP *" />
                                        <View style={styles.otpInputContainer}>
                                            <View style={{ flex: 1 }}>
                                                <Input value={otp} onChangeText={setOtp} placeholder="Enter OTP" keyboardType="number-pad" maxLength={4} icon="shield-checkmark-outline" />
                                            </View>
                                            <TouchableOpacity style={styles.verifyBtn} onPress={handleVerifyOtp}>
                                                <Text style={styles.verifyBtnText}>Verify</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </View>

                            <TouchableOpacity style={styles.actionBtn} onPress={handleFetchConnectionDetails}>
                                <LinearGradient colors={['#0D47A1', '#1565C0']} style={styles.btnGrad}>
                                    {isFetchingData ? <ActivityIndicator color="#FFF" /> : (
                                        <>
                                            <Text style={styles.actionBtnText}>Fetch Connection Details</Text>
                                            <Ionicons name="arrow-forward" size={18} color="#FFF" />
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Step 2: Edit Details */}
                    {currentStep === 2 && (
                        <View>
                            <SectionTitle title="Update Information" icon="create" />
                            <View style={styles.formCard}>
                                <Label text={serviceType === 'Mobile' ? "Mobile Number Correction" : "Customer ID Correction"} />
                                <Input
                                    value={formData.correctedNumber}
                                    onChangeText={(v: string) => {
                                        const clean = v.replace(/\D/g, '');
                                        setFormData({ ...formData, correctedNumber: serviceType === 'Mobile' ? clean.substring(0, 10) : v });
                                    }}
                                    placeholder={serviceType === 'Mobile' ? "Enter 10-digit number" : "Enter new ID"}
                                    icon="create-outline"
                                    keyboardType={serviceType === 'Mobile' ? "phone-pad" : "default"}
                                    maxLength={serviceType === 'Mobile' ? 10 : undefined}
                                />

                                <Label text="New Operator Name" />
                                <Input
                                    value={formData.newOperator}
                                    onChangeText={(v: string) => setFormData({ ...formData, newOperator: v })}
                                    placeholder="Enter new operator"
                                    icon="business-outline"
                                />

                                <Label text="Email ID Update" />
                                <Input
                                    value={formData.email}
                                    onChangeText={(v: string) => setFormData({ ...formData, email: v })}
                                    placeholder="Enter new email"
                                    icon="at-outline"
                                    keyboardType="email-address"
                                />

                                {serviceType === 'DTH' && (
                                    <>
                                        <Label text="Package Change Request" />
                                        <Input
                                            value={formData.newPackage}
                                            onChangeText={(v: string) => setFormData({ ...formData, newPackage: v })}
                                            placeholder="Enter new package plan"
                                            icon="list-outline"
                                        />
                                    </>
                                )}
                            </View>

                            {(formData.correctedNumber !== "" || formData.newOperator !== "") && (
                                <View>
                                    <SectionTitle title="Supporting Documents" icon="cloud-upload" />
                                    <View style={styles.formCard}>
                                        {formData.correctedNumber !== "" && (
                                            <DocUploadItem
                                                title="Aadhaar Card"
                                                hint="Required for number correction"
                                                isUploaded={!!documents.aadhaar}
                                                filename={documents.aadhaar?.name}
                                                onUpload={() => pickDocument('aadhaar')}
                                                onRemove={() => removeDocument('aadhaar')}
                                            />
                                        )}
                                        {formData.newOperator !== "" && (
                                            <View style={{ marginTop: 10 }}>
                                                <DocUploadItem
                                                    title="Previous Receipt"
                                                    hint="Required for operator change"
                                                    isUploaded={!!documents.receipt}
                                                    filename={documents.receipt?.name}
                                                    onUpload={() => pickDocument('receipt')}
                                                    onRemove={() => removeDocument('receipt')}
                                                />
                                            </View>
                                        )}
                                    </View>
                                </View>
                            )}

                            <TouchableOpacity style={styles.actionBtn} onPress={handleSaveAndContinue}>
                                <LinearGradient colors={['#2E7D32', '#388E3C']} style={styles.btnGrad}>
                                    <Text style={styles.actionBtnText}>Save & Continue</Text>
                                    <Ionicons name="chevron-forward" size={18} color="#FFF" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Step 3: Review */}
                    {currentStep === 3 && (
                        <View>
                            <SectionTitle title="Review Summary" icon="list-circle" />
                            <View style={styles.summaryCard}>
                                <SummarySection title="Service Type" value={serviceType} onEdit={() => setCurrentStep(1)} />
                                <SummarySection title="Original Number/ID" value={formData.serviceNumber} onEdit={() => setCurrentStep(1)} />
                                <SummarySection title="Current Operator" value={formData.operator} onEdit={() => setCurrentStep(1)} />

                                {formData.correctedNumber && <SummarySection title="Corrected Number/ID" value={formData.correctedNumber} onEdit={() => setCurrentStep(2)} />}
                                {formData.newOperator && <SummarySection title="New Operator" value={formData.newOperator} onEdit={() => setCurrentStep(2)} />}
                                {formData.email && <SummarySection title="Updated Email" value={formData.email} onEdit={() => setCurrentStep(2)} />}
                                {serviceType === 'DTH' && formData.newPackage && <SummarySection title="New Package" value={formData.newPackage} onEdit={() => setCurrentStep(2)} />}

                                <View style={styles.divider} />
                                <Text style={styles.attachedDocsTitle}>Uploaded Documents:</Text>
                                <View style={styles.attachedDocsList}>
                                    {documents.aadhaar && <DocBadge name="Aadhaar Card" />}
                                    {documents.receipt && <DocBadge name="Receipt" />}
                                    {!documents.aadhaar && !documents.receipt && <Text style={{ fontSize: 12, color: '#64748B' }}>No documents uploaded</Text>}
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.declarationRow}
                                onPress={() => setFormData({ ...formData, declaration: !formData.declaration })}
                            >
                                <Ionicons name={formData.declaration ? "checkbox" : "square-outline"} size={22} color={formData.declaration ? "#0D47A1" : "#CCC"} />
                                <Text style={styles.declarationText}>I confirm that the recharge details provided are correct to the best of my knowledge.</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionBtn} onPress={handleSubmitRequest}>
                                <LinearGradient colors={['#0D47A1', '#1565C0']} style={styles.btnGrad}>
                                    {isSubmitting ? <ActivityIndicator color="#FFF" /> : (
                                        <>
                                            <Text style={styles.actionBtnText}>Submit Request</Text>
                                            <Ionicons name="checkmark-circle-outline" size={18} color="#FFF" />
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={{ height: 100 }} />
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

// Sub-components
const SectionTitle = ({ title, icon }: { title: string, icon: any }) => (
    <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
            <Ionicons name={icon} size={18} color="#0D47A1" />
        </View>
        <Text style={styles.sectionTitleText}>{title}</Text>
    </View>
);

const Label = ({ text }: { text: string }) => <Text style={styles.label}>{text}</Text>;

const Input = ({ icon, ...props }: any) => (
    <View style={styles.inputContainer}>
        {icon && <Ionicons name={icon} size={18} color="#94A3B8" style={{ marginRight: 10 }} />}
        <TextInput style={styles.input} placeholderTextColor="#94A3B8" {...props} />
    </View>
);

const DocUploadItem = ({ title, hint, isUploaded, filename, onUpload, onRemove }: any) => (
    <View style={styles.uploadContainer}>
        <TouchableOpacity style={[styles.uploadBox, isUploaded && styles.uploadBoxDone]} onPress={onUpload}>
            <View style={styles.uploadInfo}>
                <Ionicons name={isUploaded ? "checkmark-circle" : "cloud-upload-outline"} size={24} color={isUploaded ? "#2E7D32" : "#0D47A1"} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.uploadTitle} numberOfLines={1}>{isUploaded ? filename : title}</Text>
                    {!isUploaded && <Text style={styles.uploadHint}>{hint}</Text>}
                </View>
            </View>
            <Text style={[styles.uploadActionText, isUploaded && { color: '#2E7D32' }]}>{isUploaded ? "Change" : "Upload"}</Text>
        </TouchableOpacity>
    </View>
);

const DocBadge = ({ name }: { name: string }) => (
    <View style={styles.docBadge}>
        <Ionicons name="checkmark-circle" size={14} color="#2E7D32" />
        <Text style={styles.docBadgeText}>{name}</Text>
    </View>
);

const SummarySection = ({ title, value, onEdit }: any) => (
    <View style={styles.summarySection}>
        <View style={{ flex: 1 }}>
            <Text style={styles.sumLabel}>{title}</Text>
            <Text style={styles.sumValue}>{value || "Not Updated"}</Text>
        </View>
        <TouchableOpacity onPress={onEdit}>
            <Text style={styles.editBtn}>Edit</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8FAFC" },
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    backButton: { padding: 5 },
    headerCenter: { flex: 1, alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
    headerSubtitle: { fontSize: 11, color: '#64748B', marginTop: 2 },
    placeholder: { width: 34 },

    stepContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingVertical: 20,
        backgroundColor: '#FFF',
    },
    progressLine: {
        position: 'absolute',
        top: 36,
        left: 50,
        right: 50,
        height: 2,
        backgroundColor: '#E2E8F0',
    },
    progressLineActive: { height: '100%', backgroundColor: '#0D47A1' },
    stepItem: { alignItems: 'center', zIndex: 1 },
    stepCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFF',
        borderWidth: 2,
        borderColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepCircleActive: { backgroundColor: '#0D47A1', borderColor: '#0D47A1' },
    stepNumber: { fontSize: 13, fontWeight: 'bold', color: '#94A3B8' },
    stepNumberActive: { color: '#FFF' },
    stepLabel: { fontSize: 10, color: '#94A3B8', marginTop: 6, fontWeight: '600' },
    stepLabelActive: { color: '#0D47A1' },

    scrollContent: { padding: 20 },

    docsRequiredBox: {
        backgroundColor: '#EFF6FF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    docsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    docsTitle: { fontSize: 14, fontWeight: 'bold', color: '#1E40AF', marginLeft: 8 },
    docsList: { marginLeft: 28 },
    docBullet: { fontSize: 12, color: '#1E40AF', marginBottom: 4, lineHeight: 18 },

    serviceSelectionRow: { flexDirection: 'row', gap: 12, marginBottom: 20, marginTop: 5 },
    serviceTypeBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        gap: 8,
    },
    serviceTypeBtnActive: { backgroundColor: '#0D47A1', borderColor: '#0D47A1' },
    serviceTypeLabel: { fontSize: 14, fontWeight: '600', color: '#475569' },
    serviceTypeLabelActive: { color: '#FFF' },

    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 10 },
    sectionIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#E0E7FF', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    sectionTitleText: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
    formCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 15, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    label: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8, marginTop: 12 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 15 },
    input: { flex: 1, height: 48, fontSize: 14, color: '#1E293B' },

    otpInputContainer: { flexDirection: 'row', gap: 10, alignItems: 'center' },
    otpBtn: { backgroundColor: '#0D47A1', borderRadius: 8, paddingHorizontal: 15, height: 48, justifyContent: 'center' },
    otpBtnDisabled: { opacity: 0.6 },
    otpBtnText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
    verifyBtn: { backgroundColor: '#2E7D32', borderRadius: 8, paddingHorizontal: 15, height: 48, justifyContent: 'center' },
    verifyBtnText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
    verifiedBadge: { paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center' },

    uploadBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', borderStyle: 'dashed', padding: 12, marginTop: 5 },
    uploadBoxDone: { borderStyle: 'solid', borderColor: '#C8E6C9', backgroundColor: '#F1F8F1' },
    uploadInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    uploadTitle: { fontSize: 13, fontWeight: '600', color: '#1E293B' },
    uploadHint: { fontSize: 11, color: '#64748B', marginTop: 2 },
    uploadActionText: { fontSize: 12, fontWeight: 'bold', color: '#0D47A1' },
    uploadContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 5,
    },

    actionBtn: { width: '100%', borderRadius: 12, overflow: 'hidden', marginTop: 10 },
    btnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, gap: 10 },
    actionBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

    summaryCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    summarySection: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 15 },
    sumLabel: { fontSize: 12, color: '#64748B', marginBottom: 4 },
    sumValue: { fontSize: 14, fontWeight: 'bold', color: '#1E293B' },
    divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 15 },
    attachedDocsTitle: { fontSize: 14, fontWeight: 'bold', color: '#1E293B', marginBottom: 12 },
    attachedDocsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    docBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F1F8F1', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: '#C8E6C9' },
    docBadgeText: { fontSize: 11, color: '#2E7D32', fontWeight: '500' },
    editBtn: { color: '#0D47A1', fontSize: 12, fontWeight: 'bold' },

    declarationRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 25, paddingHorizontal: 5 },
    declarationText: { flex: 1, fontSize: 12, color: '#64748B', lineHeight: 18 },

    successContainer: { padding: 30, alignItems: 'center' },
    successIconCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    successTitle: { fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginBottom: 10 },
    successSubtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 30 },
    refCard: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 20, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
    refLabel: { fontSize: 12, color: '#64748B', marginBottom: 5 },
    refValue: { fontSize: 20, fontWeight: 'bold', color: '#0D47A1' },
    infoBox: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 40 },
    infoBoxText: { fontSize: 13, color: '#64748B' },
    returnBtn: { width: '100%', borderRadius: 12, overflow: 'hidden' },
    btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});
