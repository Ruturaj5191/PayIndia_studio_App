import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    BackHandler,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const OCCUPATIONS = ['Farmer', 'Self-employed', 'Private Job', 'Government Job', 'Labour', 'Business', 'Other'];
const PURPOSES = ['Scholarship', 'Government Scheme', 'Education', 'Bank Loan', 'Other'];
const STATES = ['Maharashtra', 'Karnataka', 'Gujarat', 'Tamil Nadu', 'Delhi', 'Other'];

interface DocumentAsset {
    name: string;
    size?: number;
    uri: string;
    [key: string]: any;
}

const DOCS = [
    { id: 'aadhaar', title: 'Aadhaar Card', titleHindi: 'आधार कार्ड', icon: 'card-account-details', color: '#2196F3' },
    { id: 'address', title: 'Address Proof', titleHindi: 'पत्त्याचा पुरावा', icon: 'home-map-marker', color: '#4CAF50' },
    { id: 'ration', title: 'Ration Card', titleHindi: 'रेशन कार्ड', icon: 'book-open-page-variant', color: '#FF9800' },
    { id: 'income', title: 'Income Proof', titleHindi: 'उत्पन्न पुरावा', icon: 'currency-inr', color: '#673AB7' },
    { id: 'declaration', title: 'Self Declaration', titleHindi: 'स्वघोषणा पत्र', icon: 'file-document-edit', color: '#E53935' },
];

export default function IncomeCertificateFormScreen() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [form, setForm] = useState({
        fullName: '', fatherName: '', gender: 'Male', dob: '', aadhaar: '', mobile: '', email: '',
        address: '', village: '', taluka: '', district: '', state: 'Maharashtra', pincode: '',
        occupation: '', income: '', familyIncome: '', purpose: '',
    });
    const [docs, setDocs] = useState<Record<string, DocumentAsset | null>>({});

    // UI states
    const [showOccupationModal, setShowOccupationModal] = useState(false);
    const [showPurposeModal, setShowPurposeModal] = useState(false);
    const [showStateModal, setShowStateModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [appId, setAppId] = useState('');

    const update = (k: string, v: string) => setForm({ ...form, [k]: v });

    // Handle hardware back button
    useEffect(() => {
        const backAction = () => {
            if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
                return true;
            } else {
                router.back();
                return true;
            }
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, [currentStep]);

    const handleDobChange = (t: string) => {
        let c = t.replace(/\D/g, '');
        if (c.length >= 2) c = c.substring(0, 2) + '/' + c.substring(2);
        if (c.length >= 5) c = c.substring(0, 5) + '/' + c.substring(5, 9);
        update('dob', c);
    };

    const handleAadhaarChange = (t: string) => {
        let c = t.replace(/\D/g, '').substring(0, 12);
        let f = c.match(/.{1,4}/g)?.join(' ') || c;
        update('aadhaar', f);
    };

    const handleContinue = () => {
        if (currentStep === 1) {
            if (!form.fullName.trim()) return Alert.alert('Required', 'Enter full name');
            if (!form.fatherName.trim()) return Alert.alert('Required', 'Enter father/husband name');
            if (form.aadhaar.replace(/\s/g, '').length !== 12) return Alert.alert('Invalid', 'Aadhaar must be 12 digits');
            if (form.mobile.length !== 10) return Alert.alert('Invalid', 'Mobile must be 10 digits');
            if (!form.address.trim()) return Alert.alert('Required', 'Enter address');
            if (form.pincode.length !== 6) return Alert.alert('Invalid', 'Pincode must be 6 digits');
            if (!form.occupation) return Alert.alert('Required', 'Select occupation');
            if (!form.income) return Alert.alert('Required', 'Enter annual income');
            if (!form.purpose) return Alert.alert('Required', 'Select purpose');
            setCurrentStep(2);
        } else if (currentStep === 2) {
            const missing = DOCS.filter(d => !docs[d.id]);
            if (missing.length) return Alert.alert('Required', `Please upload remaining documents: ${missing.map(d => d.title).join(', ')}`);
            setCurrentStep(3);
        } else {
            const id = 'INC2026' + Math.random().toString(36).substring(2, 9).toUpperCase();
            setAppId(id);
            setShowSuccess(true);
        }
    };

    const uploadDoc = async (id: string) => {
        try {
            const r = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'image/*'] });
            if (!r.canceled && r.assets?.[0]) {
                const f = r.assets[0];
                if (f.size && f.size > 2 * 1024 * 1024) return Alert.alert('Too Large', 'Max file size is 2MB');
                setDocs({ ...docs, [id]: f });
                Alert.alert('Success', 'Document uploaded successfully');
            }
        } catch (e) {
            Alert.alert('Error', 'Upload failed');
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            router.back();
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Income Certificate</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Step Indicator */}
                <View style={styles.stepIndicator}>
                    <View style={styles.stepItem}>
                        <View style={[styles.stepCircle, currentStep >= 1 && styles.stepCircleActive]}>
                            <Text style={[styles.stepNumber, currentStep >= 1 && styles.stepNumberActive]}>1</Text>
                        </View>
                        <Text style={styles.stepLabelText}>Details</Text>
                    </View>
                    <View style={[styles.stepLine, currentStep >= 2 && styles.stepLineActive]} />
                    <View style={styles.stepItem}>
                        <View style={[styles.stepCircle, currentStep >= 2 && styles.stepCircleActive]}>
                            <Text style={[styles.stepNumber, currentStep >= 2 && styles.stepNumberActive]}>2</Text>
                        </View>
                        <Text style={styles.stepLabelText}>Documents</Text>
                    </View>
                    <View style={[styles.stepLine, currentStep >= 3 && styles.stepLineActive]} />
                    <View style={styles.stepItem}>
                        <View style={[styles.stepCircle, currentStep >= 3 && styles.stepCircleActive]}>
                            <Text style={[styles.stepNumber, currentStep >= 3 && styles.stepNumberActive]}>3</Text>
                        </View>
                        <Text style={styles.stepLabelText}>Review</Text>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* STEP 1: Details */}
                    {currentStep === 1 && (
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Personal Details</Text>
                            <Text style={styles.stepSubtitle}>Fill in mandatory information for certificate</Text>

                            <View style={styles.formSection}>
                                <Text style={styles.formLabel}>Full Name (as per documents) *</Text>
                                <View style={styles.formInput}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter full name"
                                        value={form.fullName}
                                        onChangeText={v => update('fullName', v)}
                                    />
                                </View>
                            </View>

                            <View style={styles.formSection}>
                                <Text style={styles.formLabel}>Father/Husband Name *</Text>
                                <View style={styles.formInput}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter father or husband name"
                                        value={form.fatherName}
                                        onChangeText={v => update('fatherName', v)}
                                    />
                                </View>
                            </View>

                            <View style={styles.formSection}>
                                <Text style={styles.formLabel}>Gender *</Text>
                                <View style={styles.genderButtons}>
                                    {['Male', 'Female', 'Other'].map(g => (
                                        <TouchableOpacity
                                            key={g}
                                            style={[styles.genderButton, form.gender === g && styles.genderButtonActive]}
                                            onPress={() => update('gender', g)}
                                        >
                                            <Text style={[styles.genderButtonText, form.gender === g && styles.genderButtonTextActive]}>{g}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.formRow}>
                                <View style={[styles.formSection, { flex: 1 }]}>
                                    <Text style={styles.formLabel}>Date of Birth *</Text>
                                    <View style={styles.formInput}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="DD/MM/YYYY"
                                            value={form.dob}
                                            onChangeText={handleDobChange}
                                            keyboardType="number-pad"
                                            maxLength={10}
                                        />
                                    </View>
                                </View>
                                <View style={[styles.formSection, { flex: 1 }]}>
                                    <Text style={styles.formLabel}>Mobile Number *</Text>
                                    <View style={styles.formInput}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="10-digit mobile"
                                            value={form.mobile}
                                            onChangeText={v => update('mobile', v.replace(/\D/g, '').substring(0, 10))}
                                            keyboardType="phone-pad"
                                            maxLength={10}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View style={styles.formSection}>
                                <Text style={styles.formLabel}>Aadhaar Number *</Text>
                                <View style={styles.formInput}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="XXXX XXXX XXXX"
                                        value={form.aadhaar}
                                        onChangeText={handleAadhaarChange}
                                        keyboardType="number-pad"
                                        maxLength={14}
                                    />
                                </View>
                            </View>

                            <Text style={styles.subSectionTitle}>Address Details</Text>

                            <View style={styles.formSection}>
                                <Text style={styles.formLabel}>Full Address *</Text>
                                <View style={styles.formInput}>
                                    <TextInput
                                        style={[styles.input, styles.textArea]}
                                        placeholder="Enter complete address"
                                        value={form.address}
                                        onChangeText={v => update('address', v)}
                                        multiline
                                    />
                                </View>
                            </View>

                            <View style={styles.formRow}>
                                <View style={[styles.formSection, { flex: 1 }]}>
                                    <Text style={styles.formLabel}>Village/Area *</Text>
                                    <View style={styles.formInput}>
                                        <TextInput style={styles.input} placeholder="Village" value={form.village} onChangeText={v => update('village', v)} />
                                    </View>
                                </View>
                                <View style={[styles.formSection, { flex: 1 }]}>
                                    <Text style={styles.formLabel}>Pincode *</Text>
                                    <View style={styles.formInput}>
                                        <TextInput style={styles.input} placeholder="6-digit" value={form.pincode} onChangeText={v => update('pincode', v.replace(/\D/g, '').substring(0, 6))} keyboardType="number-pad" maxLength={6} />
                                    </View>
                                </View>
                            </View>

                            <View style={styles.formRow}>
                                <View style={[styles.formSection, { flex: 1 }]}>
                                    <Text style={styles.formLabel}>District *</Text>
                                    <View style={styles.formInput}>
                                        <TextInput style={styles.input} placeholder="District" value={form.district} onChangeText={v => update('district', v)} />
                                    </View>
                                </View>
                                <View style={[styles.formSection, { flex: 1 }]}>
                                    <Text style={styles.formLabel}>State *</Text>
                                    <TouchableOpacity style={styles.formInput} onPress={() => setShowStateModal(true)}>
                                        <Text style={styles.input}>{form.state}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <Text style={styles.subSectionTitle}>Income Details</Text>

                            <View style={styles.formRow}>
                                <View style={[styles.formSection, { flex: 1 }]}>
                                    <Text style={styles.formLabel}>Occupation *</Text>
                                    <TouchableOpacity style={styles.formInput} onPress={() => setShowOccupationModal(true)}>
                                        <Text style={[styles.input, !form.occupation && { color: '#999' }]}>{form.occupation || 'Select'}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.formSection, { flex: 1 }]}>
                                    <Text style={styles.formLabel}>Annual Income *</Text>
                                    <View style={styles.formInput}>
                                        <TextInput style={styles.input} placeholder="Amount" value={form.income} onChangeText={v => update('income', v.replace(/\D/g, ''))} keyboardType="number-pad" />
                                    </View>
                                </View>
                            </View>

                            <View style={styles.formSection}>
                                <Text style={styles.formLabel}>Purpose of Certificate *</Text>
                                <TouchableOpacity style={styles.formInput} onPress={() => setShowPurposeModal(true)}>
                                    <Text style={[styles.input, !form.purpose && { color: '#999' }]}>{form.purpose || 'Select purpose'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* STEP 2: Documents */}
                    {currentStep === 2 && (
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Mandatory Documents</Text>
                            <Text style={styles.stepSubtitle}>Upload proofs to support your application (Max 2MB each)</Text>

                            {DOCS.map(d => (
                                <View key={d.id} style={styles.documentCard}>
                                    <View style={styles.documentHeader}>
                                        <MaterialCommunityIcons name={d.icon as any} size={24} color={d.color} />
                                        <View style={styles.documentInfo}>
                                            <Text style={styles.documentTitle}>{d.title} *</Text>
                                            <Text style={styles.documentSubtitle}>{d.titleHindi}</Text>
                                        </View>
                                    </View>
                                    {docs[d.id] ? (
                                        <View style={styles.uploadedFile}>
                                            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                                            <Text style={styles.uploadedFileName} numberOfLines={1}>{docs[d.id]?.name}</Text>
                                            <TouchableOpacity onPress={() => setDocs({ ...docs, [d.id]: null })}>
                                                <Ionicons name="close-circle" size={20} color="#E53935" />
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <TouchableOpacity style={[styles.uploadButton, { borderColor: d.color + '40' }]} onPress={() => uploadDoc(d.id)}>
                                            <Ionicons name="cloud-upload" size={20} color={d.color} />
                                            <Text style={[styles.uploadButtonText, { color: d.color }]}>Upload Document</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}

                    {/* STEP 3: Review */}
                    {currentStep === 3 && (
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Review & Submit</Text>
                            <Text style={styles.stepSubtitle}>Verify your details before final submission</Text>

                            <View style={styles.reviewCard}>
                                <Text style={styles.reviewCardTitle}>Personal Details</Text>
                                <View style={styles.reviewRow}><Text style={styles.reviewLabel}>Full Name</Text><Text style={styles.reviewValue}>{form.fullName}</Text></View>
                                <View style={styles.reviewRow}><Text style={styles.reviewLabel}>DOB</Text><Text style={styles.reviewValue}>{form.dob}</Text></View>
                                <View style={styles.reviewRow}><Text style={styles.reviewLabel}>Aadhaar</Text><Text style={styles.reviewValue}>{form.aadhaar}</Text></View>
                                <View style={styles.reviewRow}><Text style={styles.reviewLabel}>Mobile</Text><Text style={styles.reviewValue}>+91 {form.mobile}</Text></View>
                            </View>

                            <View style={styles.reviewCard}>
                                <Text style={styles.reviewCardTitle}>Address</Text>
                                <Text style={styles.reviewAddressText}>{form.address}</Text>
                                <Text style={styles.reviewAddressText}>{form.village}, {form.district}, {form.state} - {form.pincode}</Text>
                            </View>

                            <View style={styles.reviewCard}>
                                <Text style={styles.reviewCardTitle}>Income Info</Text>
                                <View style={styles.reviewRow}><Text style={styles.reviewLabel}>Occupation</Text><Text style={styles.reviewValue}>{form.occupation}</Text></View>
                                <View style={styles.reviewRow}><Text style={styles.reviewLabel}>Annual Income</Text><Text style={styles.reviewValue}>₹{form.income}</Text></View>
                                <View style={styles.reviewRow}><Text style={styles.reviewLabel}>Purpose</Text><Text style={styles.reviewValue}>{form.purpose}</Text></View>
                            </View>

                            <View style={styles.reviewCard}>
                                <Text style={styles.reviewCardTitle}>Uploaded Documents</Text>
                                {DOCS.map(d => (
                                    <View key={d.id} style={styles.reviewDocRow}>
                                        <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                                        <Text style={styles.reviewDocText}>{d.title}</Text>
                                    </View>
                                ))}
                            </View>

                            <View style={styles.feeCard}>
                                <Text style={styles.feeLabel}>Service Fee</Text>
                                <Text style={styles.feeValue}>₹50</Text>
                            </View>
                            <Text style={styles.feeNote}>Final certificate will be available in 7-10 working days.</Text>
                        </View>
                    )}

                    <View style={{ height: 100 }} />
                </ScrollView>
            </SafeAreaView>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                    <LinearGradient colors={['#4CAF50', '#45A049']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.continueButtonGradient}>
                        <Text style={styles.continueButtonText}>{currentStep === 3 ? 'Final Submit' : 'Continue'}</Text>
                        <Ionicons name={currentStep === 3 ? 'send' : 'arrow-forward'} size={18} color="#FFF" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Modals */}
            <Modal visible={showOccupationModal} transparent animationType="slide">
                <View style={styles.modalBack}>
                    <View style={styles.modal}>
                        <View style={styles.modalHeaderHandle} />
                        <Text style={styles.modalTitle}>Choose Occupation</Text>
                        <ScrollView>
                            {OCCUPATIONS.map(o => (
                                <TouchableOpacity key={o} style={styles.modalOption} onPress={() => { update('occupation', o); setShowOccupationModal(false); }}>
                                    <Text style={styles.modalOptionText}>{o}</Text>
                                    {form.occupation === o && <Ionicons name="checkmark" size={20} color="#4CAF50" />}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <Modal visible={showPurposeModal} transparent animationType="slide">
                <View style={styles.modalBack}>
                    <View style={styles.modal}>
                        <View style={styles.modalHeaderHandle} />
                        <Text style={styles.modalTitle}>Choose Purpose</Text>
                        <ScrollView>
                            {PURPOSES.map(p => (
                                <TouchableOpacity key={p} style={styles.modalOption} onPress={() => { update('purpose', p); setShowPurposeModal(false); }}>
                                    <Text style={styles.modalOptionText}>{p}</Text>
                                    {form.purpose === p && <Ionicons name="checkmark" size={20} color="#4CAF50" />}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <Modal visible={showStateModal} transparent animationType="slide">
                <View style={styles.modalBack}>
                    <View style={styles.modal}>
                        <View style={styles.modalHeaderHandle} />
                        <Text style={styles.modalTitle}>Choose State</Text>
                        <ScrollView>
                            {STATES.map(st => (
                                <TouchableOpacity key={st} style={styles.modalOption} onPress={() => { update('state', st); setShowStateModal(false); }}>
                                    <Text style={styles.modalOptionText}>{st}</Text>
                                    {form.state === st && <Ionicons name="checkmark" size={20} color="#4CAF50" />}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <Modal visible={showSuccess} transparent animationType="fade">
                <View style={styles.successBack}>
                    <View style={styles.successModal}>
                        <View style={styles.successIconCircle}><Ionicons name="checkmark" size={40} color="#FFF" /></View>
                        <Text style={styles.successModalTitle}>Application Submitted!</Text>
                        <View style={styles.appIdBox}>
                            <Text style={styles.appIdLabel}>Application ID</Text>
                            <Text style={styles.appIdValue}>{appId}</Text>
                        </View>
                        <Text style={styles.successMsgText}>Your application for Income Certificate has been received. You can track status using the ID above.</Text>
                        <TouchableOpacity style={styles.successCloseBtn} onPress={() => { setShowSuccess(false); router.replace('/income-certificate'); }}>
                            <Text style={styles.successCloseBtnText}>Go Back</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    safeArea: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    backButton: { padding: 5 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
    placeholder: { width: 34 },

    // Step indicator
    stepIndicator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, paddingHorizontal: 30, backgroundColor: '#FFFFFF' },
    stepItem: { alignItems: 'center', gap: 6 },
    stepCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center' },
    stepCircleActive: { backgroundColor: '#4CAF50' },
    stepNumber: { fontSize: 16, fontWeight: 'bold', color: '#999' },
    stepNumberActive: { color: '#FFFFFF' },
    stepLabelText: { fontSize: 11, color: '#666', fontWeight: '500' },
    stepLine: { flex: 1, height: 2, backgroundColor: '#E0E0E0', marginHorizontal: 8, marginBottom: 15 },
    stepLineActive: { backgroundColor: '#4CAF50' },

    scrollContent: { paddingBottom: 20 },
    stepContent: { paddingHorizontal: 20, paddingTop: 10 },
    stepTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
    stepSubtitle: { fontSize: 14, color: '#666', marginBottom: 24 },
    subSectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginTop: 10, marginBottom: 20, backgroundColor: '#E8F5E9', padding: 12, borderRadius: 10 },

    formSection: { marginBottom: 20 },
    formLabel: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginBottom: 10 },
    formInput: { backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: '#F0F0F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
    input: { fontSize: 15, color: '#1A1A1A' },
    textArea: { minHeight: 80, textAlignVertical: 'top' },
    formRow: { flexDirection: 'row', gap: 12 },
    genderButtons: { flexDirection: 'row', gap: 10 },
    genderButton: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 2, borderColor: '#F0F0F0', alignItems: 'center', backgroundColor: '#FFFFFF' },
    genderButtonActive: { borderColor: '#4CAF50', backgroundColor: '#F1FBF4' },
    genderButtonText: { fontSize: 14, fontWeight: '600', color: '#666' },
    genderButtonTextActive: { color: '#4CAF50' },

    // Document cards
    documentCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: '#F8F8F8' },
    documentHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 15 },
    documentInfo: { flex: 1 },
    documentTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 2 },
    documentSubtitle: { fontSize: 12, color: '#666' },
    uploadedFile: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#E8F5E9', padding: 12, borderRadius: 10 },
    uploadedFileName: { flex: 1, fontSize: 13, color: '#2E7D32', fontWeight: '500' },
    uploadButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#FFFFFF', paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed' },
    uploadButtonText: { fontSize: 14, fontWeight: '700' },

    // Review styles
    reviewCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: '#F0F0F0' },
    reviewCardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingBottom: 10 },
    reviewRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    reviewLabel: { fontSize: 14, color: '#666' },
    reviewValue: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
    reviewAddressText: { fontSize: 14, color: '#1A1A1A', lineHeight: 22 },
    reviewDocRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    reviewDocText: { fontSize: 14, color: '#1A1A1A', fontWeight: '500' },
    feeCard: { backgroundColor: '#F1F8FE', borderRadius: 16, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
    feeLabel: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
    feeValue: { fontSize: 20, fontWeight: 'bold', color: '#4CAF50' },
    feeNote: { fontSize: 12, color: '#999', marginTop: 15, fontStyle: 'italic', textAlign: 'center' },

    // Bottom bar
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 8,
    },
    continueButton: { borderRadius: 24, overflow: 'hidden' },
    continueButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16 },
    continueButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },

    // Modal styles
    modalBack: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modal: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 25, borderTopRightRadius: 25, maxHeight: '80%', paddingBottom: 40 },
    modalHeaderHandle: { width: 40, height: 5, borderRadius: 2.5, backgroundColor: '#E0E0E0', alignSelf: 'center', marginTop: 12, marginBottom: 20 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', paddingHorizontal: 20, marginBottom: 15 },
    modalOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
    modalOptionText: { fontSize: 15, color: '#1A1A1A', fontWeight: '500' },

    // Success modal
    successBack: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center', padding: 20 },
    successModal: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, alignItems: 'center', width: '100%', maxWidth: 400 },
    successIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#4CAF50', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    successModalTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 20 },
    appIdBox: { backgroundColor: '#F1F8FE', borderRadius: 16, padding: 20, alignItems: 'center', width: '100%', marginBottom: 20 },
    appIdLabel: { fontSize: 12, color: '#4CAF50', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 },
    appIdValue: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50', letterSpacing: 2 },
    successMsgText: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 30 },
    successCloseBtn: { backgroundColor: '#4CAF50', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 12, width: '100%', alignItems: 'center' },
    successCloseBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});