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
    Modal,
    FlatList,
} from "react-native";

export default function UpdateWaterDetailsScreen() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [otp, setOtp] = useState("");
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [requestSuccess, setRequestSuccess] = useState(false);
    const [referenceId, setReferenceId] = useState("");
    const [showWardModal, setShowWardModal] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);

    const wardOptions = [
        "Ward A - Central",
        "Ward B - West",
        "Ward C - East",
        "Ward D - South",
        "Ward E - North",
        "Suburban Area 1",
        "Suburban Area 2"
    ];

    const requestOptions = [
        "Meter Replacement",
        "Category Change",
        "Temporary Disconnection",
        "Permanent Disconnection",
        "Name Change",
        "Address Correction"
    ];

    // Form State
    const [formData, setFormData] = useState({
        consumerNumber: "",
        mobileNumber: "",
        email: "",
        wardArea: "",
        address: {
            houseNo: "",
            street: "",
            area: "",
            city: "",
            pincode: "",
        },
        nameCorrection: {
            currentName: "Rajesh S. Patil", // Mocked initial data
            correctedName: "",
            reason: "",
        },
        connectionUpdate: {
            requestType: "", // Meter Replacement, Category Change, Temporary Disconnection, Permanent Disconnection
            category: "Residential", // Current category
            newCategory: "",
        },
        declaration: false,
    });

    const [documents, setDocuments] = useState<any>({
        previousBill: null,
        identityProof: null,
        addressProof: null,
        propertyProof: null,
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
        if (formData.mobileNumber.length !== 10) {
            Alert.alert("Invalid Mobile", "Please enter a valid 10-digit mobile number");
            return;
        }
        setIsOtpSent(true);
        Alert.alert("OTP Sent", "A verification code has been sent to " + formData.mobileNumber);
    };

    const handleVerifyOtp = () => {
        if (otp === "123456" || otp.length === 6) {
            setIsOtpVerified(true);
            Alert.alert("Success", "Mobile number verified successfully");
        } else {
            Alert.alert("Error", "Please enter a valid 6-digit OTP");
        }
    };

    const handleFetchConnectionDetails = () => {
        if (!formData.consumerNumber || !formData.mobileNumber || !documents.previousBill) {
            Alert.alert("Details Required", "Please fill all fields and upload previous water bill");
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
        // Step 2 validation logic
        if (formData.nameCorrection.correctedName && !documents.identityProof) {
            Alert.alert("Document Required", "Identity proof is required for name correction");
            return;
        }
        if (formData.connectionUpdate.requestType === "Category Change" && !documents.propertyProof) {
            Alert.alert("Document Required", "Property proof is required for category change");
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
            const ref = "WTR" + Math.floor(Math.random() * 9000000 + 1000000);
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
                if (asset.size && asset.size > 5 * 1024 * 1024) {
                    Alert.alert("File Too Large", "File size must be below 5MB");
                    return;
                }
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
                    <Text style={styles.successSubtitle}>Your water details update request has been received</Text>

                    <View style={styles.refCard}>
                        <Text style={styles.refLabel}>Reference Number</Text>
                        <Text style={styles.refValue}>{referenceId}</Text>
                    </View>

                    <View style={styles.infoBox}>
                        <Ionicons name="time-outline" size={20} color="#666" />
                        <Text style={styles.infoBoxText}>Processing normally takes 5-7 working days</Text>
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
                        <Text style={styles.headerSubtitle}>Water Bill Update (पाणी बिल)</Text>
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
                                <Text style={styles.docBullet}>• Consumer Number / Connection ID</Text>
                                <Text style={styles.docBullet}>• Previous Water Bill Copy</Text>
                                <Text style={styles.docBullet}>• Registered Mobile Number</Text>
                            </View>
                        </View>
                    )}

                    {/* Step 1: Verification */}
                    {currentStep === 1 && (
                        <View>
                            <SectionTitle title="Connection Verification" icon="shield-checkmark" />
                            <View style={styles.formCard}>
                                <Label text="Consumer Number / Connection ID *" />
                                <Input
                                    value={formData.consumerNumber}
                                    onChangeText={(v: string) => setFormData({ ...formData, consumerNumber: v })}
                                    placeholder="Enter Connection ID"
                                    icon="barcode-outline"
                                />

                                <Label text="Registered Mobile Number *" />
                                <View style={styles.otpInputContainer}>
                                    <View style={{ flex: 1 }}>
                                        <Input
                                            value={formData.mobileNumber}
                                            onChangeText={(v: string) => setFormData({ ...formData, mobileNumber: v.replace(/\D/g, '').substring(0, 10) })}
                                            placeholder="Enter Mobile Number"
                                            icon="phone-portrait-outline"
                                            keyboardType="number-pad"
                                            maxLength={10}
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
                                        <Label text="Enter 6-digit OTP *" />
                                        <View style={styles.otpInputContainer}>
                                            <View style={{ flex: 1 }}>
                                                <Input value={otp} onChangeText={setOtp} placeholder="Enter OTP" keyboardType="number-pad" maxLength={6} icon="shield-checkmark-outline" />
                                            </View>
                                            <TouchableOpacity style={styles.verifyBtn} onPress={handleVerifyOtp}>
                                                <Text style={styles.verifyBtnText}>Verify</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}

                                <Label text="Ward / Area *" />
                                <TouchableOpacity
                                    style={styles.dropdownTrigger}
                                    onPress={() => setShowWardModal(true)}
                                >
                                    <Text style={[styles.dropdownText, !formData.wardArea && { color: '#94A3B8' }]}>
                                        {formData.wardArea || "Select Ward / Area"}
                                    </Text>
                                    <Ionicons name="chevron-down" size={18} color="#666" />
                                </TouchableOpacity>

                                <View style={{ marginTop: 20 }}>
                                    <Label text="Upload Previous Water Bill *" />
                                    <DocUploadItem
                                        title="Water Bill Copy"
                                        hint="PDF / JPG / PNG (Max 5MB)"
                                        isUploaded={!!documents.previousBill}
                                        filename={documents.previousBill?.name}
                                        onUpload={() => pickDocument('previousBill')}
                                        onRemove={() => removeDocument('previousBill')}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity style={styles.actionBtn} onPress={handleFetchConnectionDetails}>
                                <LinearGradient colors={['#0D47A1', '#1565C0']} style={styles.btnGrad}>
                                    {isFetchingData ? <ActivityIndicator color="#FFF" /> : (
                                        <>
                                            <Text style={styles.actionBtnText}>Fetch Consumer Details</Text>
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
                            <SectionTitle title="1. Contact Information" icon="mail" />
                            <View style={styles.formCard}>
                                <Label text="Mobile Number (Editable)" />
                                <Input
                                    value={formData.mobileNumber}
                                    onChangeText={(v: string) => setFormData({ ...formData, mobileNumber: v })}
                                    placeholder="Mobile Number"
                                    icon="call-outline"
                                />
                                <Label text="Email ID (Editable)" />
                                <Input
                                    value={formData.email}
                                    onChangeText={(v: string) => setFormData({ ...formData, email: v })}
                                    placeholder="Enter Email ID"
                                    icon="at-outline"
                                />
                            </View>

                            <SectionTitle title="2. Billing Address" icon="location" />
                            <View style={styles.formCard}>
                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                    <View style={{ flex: 1 }}>
                                        <Label text="Flat / House No" />
                                        <Input value={formData.address.houseNo} onChangeText={(v: string) => setFormData({ ...formData, address: { ...formData.address, houseNo: v } })} placeholder="No." />
                                    </View>
                                    <View style={{ flex: 2 }}>
                                        <Label text="Street" />
                                        <Input value={formData.address.street} onChangeText={(v: string) => setFormData({ ...formData, address: { ...formData.address, street: v } })} placeholder="Street Name" />
                                    </View>
                                </View>
                                <Label text="Area" />
                                <Input value={formData.address.area} onChangeText={(v: string) => setFormData({ ...formData, address: { ...formData.address, area: v } })} placeholder="Area / Colony" />
                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                    <View style={{ flex: 1 }}>
                                        <Label text="City" />
                                        <Input value={formData.address.city} onChangeText={(v: string) => setFormData({ ...formData, address: { ...formData.address, city: v } })} placeholder="City" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Label text="Pincode" />
                                        <Input value={formData.address.pincode} onChangeText={(v: string) => setFormData({ ...formData, address: { ...formData.address, pincode: v } })} placeholder="Pincode" keyboardType="number-pad" maxLength={6} />
                                    </View>
                                </View>

                                {(formData.address.houseNo || formData.address.street) && (
                                    <View style={{ marginTop: 10 }}>
                                        <Label text="Address Proof (If changed)" />
                                        <DocUploadItem
                                            title="Address Proof"
                                            hint="Water / Tax Receipt / Ration Card"
                                            isUploaded={!!documents.addressProof}
                                            filename={documents.addressProof?.name}
                                            onUpload={() => pickDocument('addressProof')}
                                            onRemove={() => removeDocument('addressProof')}
                                        />
                                    </View>
                                )}
                            </View>

                            <SectionTitle title="3. Consumer Name Correction" icon="person" />
                            <View style={styles.formCard}>
                                <Label text="Current Name (Read Only)" />
                                <View style={styles.readOnlyBox}>
                                    <Text style={styles.readOnlyText}>{formData.nameCorrection.currentName}</Text>
                                </View>

                                <Label text="Corrected Name" />
                                <Input value={formData.nameCorrection.correctedName} onChangeText={(v: string) => setFormData({ ...formData, nameCorrection: { ...formData.nameCorrection, correctedName: v } })} placeholder="Enter Name as per Aadhaar" icon="create-outline" />

                                <Label text="Reason for Correction" />
                                <Input value={formData.nameCorrection.reason} onChangeText={(v: string) => setFormData({ ...formData, nameCorrection: { ...formData.nameCorrection, reason: v } })} placeholder="Reason (e.g. Spelling mistake)" multiline numberOfLines={2} />

                                {formData.nameCorrection.correctedName !== "" && (
                                    <View style={{ marginTop: 10 }}>
                                        <Label text="Identity Proof (Aadhaar Card) *" />
                                        <DocUploadItem
                                            title="Identity Proof"
                                            hint="Aadhaar / PAN / Passport"
                                            isUploaded={!!documents.identityProof}
                                            filename={documents.identityProof?.name}
                                            onUpload={() => pickDocument('identityProof')}
                                            onRemove={() => removeDocument('identityProof')}
                                        />
                                    </View>
                                )}
                            </View>

                            <SectionTitle title="4. Connection Update Options" icon="water" />
                            <View style={styles.formCard}>
                                <Label text="Request Type" />
                                <TouchableOpacity
                                    style={styles.dropdownTrigger}
                                    onPress={() => setShowRequestModal(true)}
                                >
                                    <Text style={[styles.dropdownText, !formData.connectionUpdate.requestType && { color: '#94A3B8' }]}>
                                        {formData.connectionUpdate.requestType || "Select Update Type"}
                                    </Text>
                                    <Ionicons name="chevron-down" size={20} color="#666" />
                                </TouchableOpacity>

                                {formData.connectionUpdate.requestType === "Category Change" && (
                                    <View style={{ marginTop: 15 }}>
                                        <Label text="Property Proof / Trade License *" />
                                        <DocUploadItem
                                            title="Property Proof"
                                            hint="Tax Receipt / Trade License"
                                            isUploaded={!!documents.propertyProof}
                                            filename={documents.propertyProof?.name}
                                            onUpload={() => pickDocument('propertyProof')}
                                            onRemove={() => removeDocument('propertyProof')}
                                        />
                                    </View>
                                )}
                            </View>

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
                            <SectionTitle title="Review Your Application" icon="list-circle" />
                            <View style={styles.summaryCard}>
                                <SummarySection title="Consumer ID" value={formData.consumerNumber} onEdit={() => setCurrentStep(1)} />
                                <SummarySection title="Updated Mobile" value={formData.mobileNumber} onEdit={() => setCurrentStep(2)} />
                                <SummarySection title="Updated Address" value={formData.address.houseNo ? `${formData.address.houseNo}, ${formData.address.street}, ${formData.address.city}` : "No Change"} onEdit={() => setCurrentStep(2)} />
                                <SummarySection title="Name Correction" value={formData.nameCorrection.correctedName || "No Change"} onEdit={() => setCurrentStep(2)} />
                                <SummarySection title="Update Type" value={formData.connectionUpdate.requestType || "Profile Only"} onEdit={() => setCurrentStep(2)} />

                                <View style={styles.divider} />
                                <Text style={styles.attachedDocsTitle}>Uploaded Documents:</Text>
                                <View style={styles.attachedDocsList}>
                                    {documents.previousBill && <DocBadge name="Previous Water Bill" />}
                                    {documents.identityProof && <DocBadge name="Identity Proof" />}
                                    {documents.addressProof && <DocBadge name="Address Proof" />}
                                    {documents.propertyProof && <DocBadge name="Property Proof" />}
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.declarationRow}
                                onPress={() => setFormData({ ...formData, declaration: !formData.declaration })}
                            >
                                <Ionicons name={formData.declaration ? "checkbox" : "square-outline"} size={22} color={formData.declaration ? "#0D47A1" : "#CCC"} />
                                <Text style={styles.declarationText}>I confirm that the above information is correct and understand that incorrect details may lead to rejection.</Text>
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

                {/* Ward Modal */}
                <Modal
                    visible={showWardModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowWardModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Select Ward / Area</Text>
                                <TouchableOpacity onPress={() => setShowWardModal(false)}>
                                    <Ionicons name="close" size={24} color="#64748B" />
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={wardOptions}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.optionItem}
                                        onPress={() => {
                                            setFormData({ ...formData, wardArea: item });
                                            setShowWardModal(false);
                                        }}
                                    >
                                        <Text style={[styles.optionText, formData.wardArea === item && styles.optionTextActive]}>
                                            {item}
                                        </Text>
                                        {formData.wardArea === item && (
                                            <Ionicons name="checkmark" size={20} color="#0D47A1" />
                                        )}
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </Modal>

                {/* Request Type Modal */}
                <Modal
                    visible={showRequestModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowRequestModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Select Request Type</Text>
                                <TouchableOpacity onPress={() => setShowRequestModal(false)}>
                                    <Ionicons name="close" size={24} color="#64748B" />
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={requestOptions}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.optionItem}
                                        onPress={() => {
                                            setFormData({ ...formData, connectionUpdate: { ...formData.connectionUpdate, requestType: item } });
                                            setShowRequestModal(false);
                                        }}
                                    >
                                        <Text style={[styles.optionText, formData.connectionUpdate.requestType === item && styles.optionTextActive]}>
                                            {item}
                                        </Text>
                                        {formData.connectionUpdate.requestType === item && (
                                            <Ionicons name="checkmark" size={20} color="#0D47A1" />
                                        )}
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </Modal>
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
            <Text style={styles.sumValue}>{value}</Text>
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

    // Stepper
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

    // Required Docs
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

    // Form
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 10 },
    sectionIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#E0E7FF', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    sectionTitleText: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
    formCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 15, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    label: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8, marginTop: 12 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 15 },
    input: { flex: 1, height: 48, fontSize: 14, color: '#1E293B' },

    // OTP
    otpInputContainer: { flexDirection: 'row', gap: 10, alignItems: 'center' },
    otpBtn: { backgroundColor: '#0D47A1', borderRadius: 8, paddingHorizontal: 15, height: 48, justifyContent: 'center' },
    otpBtnDisabled: { opacity: 0.6 },
    otpBtnText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
    verifyBtn: { backgroundColor: '#2E7D32', borderRadius: 8, paddingHorizontal: 15, height: 48, justifyContent: 'center' },
    verifyBtnText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
    verifiedBadge: { width: 48, height: 48, justifyContent: 'center', alignItems: 'center' },

    // Dropdown
    dropdownTrigger: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 15, height: 48 },
    dropdownText: { fontSize: 14, color: '#1E293B' },
    dropdownInput: { flex: 1, height: 48, fontSize: 14, color: '#1E293B' },

    // Uploads
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

    // Step 2 Specials
    readOnlyBox: { backgroundColor: '#F1F5F9', borderRadius: 10, height: 48, justifyContent: 'center', paddingHorizontal: 15 },
    readOnlyText: { fontSize: 14, color: '#64748B', fontWeight: '500' },

    // Buttons
    actionBtn: { width: '100%', borderRadius: 12, overflow: 'hidden', marginTop: 10 },
    btnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, gap: 10 },
    actionBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

    // Step 3 Review
    summaryCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    summarySection: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 15 },
    sumLabel: { fontSize: 12, color: '#64748B', marginBottom: 4 },
    sumValue: { fontSize: 14, fontWeight: 'bold', color: '#1E293B' },
    editBtn: { color: '#0D47A1', fontSize: 12, fontWeight: 'bold' },
    divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 10 },
    attachedDocsTitle: { fontSize: 13, fontWeight: 'bold', color: '#1E293B', marginBottom: 8 },
    attachedDocsList: { gap: 8 },
    docBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F1F8F1', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, alignSelf: 'flex-start' },
    docBadgeText: { fontSize: 11, color: '#2E7D32', fontWeight: '600' },
    declarationRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 5, marginBottom: 20 },
    declarationText: { flex: 1, fontSize: 12, color: '#475569', lineHeight: 18 },

    // Success Screen
    successContainer: { padding: 30, alignItems: 'center' },
    successIconCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
    successTitle: { fontSize: 24, fontWeight: 'bold', color: '#1B5E20', marginBottom: 10 },
    successSubtitle: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },
    refCard: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 20, width: '100%', alignItems: 'center', marginTop: 30, borderWidth: 1, borderColor: '#E2E8F0' },
    refLabel: { fontSize: 12, color: '#64748B', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
    refValue: { fontSize: 28, fontWeight: 'bold', color: '#0D47A1', letterSpacing: 2 },
    infoBox: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20 },
    infoBoxText: { fontSize: 12, color: '#666' },
    returnBtn: { width: '100%', borderRadius: 12, overflow: 'hidden', marginTop: 40 },
    btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40, maxHeight: '70%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
    optionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 25, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
    optionText: { fontSize: 15, color: '#475569' },
    optionTextActive: { color: '#0D47A1', fontWeight: 'bold' }
});
