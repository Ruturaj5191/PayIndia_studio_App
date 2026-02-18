import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Bill {
    id: string;
    category: string;
    icon: string;
    iconBg: string;
    iconColor: string;
    provider: string;
    consumerNumber: string;
    lastBill: string;
    dueDate: string;
}

export default function AddAllBillsScreen() {
    const router = useRouter();

    // State Management
    const [currentStep, setCurrentStep] = useState('permission'); // permission, scanning, detected, confirm
    const [isScanning, setIsScanning] = useState(false);
    const [detectedBills, setDetectedBills] = useState<Bill[]>([]);
    const [selectedBills, setSelectedBills] = useState<string[]>([]);

    // Mock detected bills (will come from SMS scanning)
    const mockDetectedBills = [
        {
            id: '1',
            category: 'Electricity',
            icon: 'flash',
            iconBg: '#FFF3E0',
            iconColor: '#FF9800',
            provider: 'TNEB',
            consumerNumber: 'XXXXX567890',
            lastBill: '₹1450',
            dueDate: '25 Feb 2026',
        },
        {
            id: '2',
            category: 'DTH',
            icon: 'tv',
            iconBg: '#F3E5F5',
            iconColor: '#9C27B0',
            provider: 'Tata Play',
            consumerNumber: 'XXXXX234567',
            lastBill: '₹350',
            dueDate: '20 Feb 2026',
        },
        {
            id: '3',
            category: 'Postpaid',
            icon: 'phone-portrait',
            iconBg: '#E3F2FD',
            iconColor: '#2196F3',
            provider: 'Airtel',
            consumerNumber: '9876543210',
            lastBill: '₹799',
            dueDate: '28 Feb 2026',
        },
        {
            id: '4',
            category: 'Broadband',
            icon: 'wifi',
            iconBg: '#E8F5E9',
            iconColor: '#4CAF50',
            provider: 'ACT Fibernet',
            consumerNumber: 'XXXXX789012',
            lastBill: '₹899',
            dueDate: '22 Feb 2026',
        },
    ];

    // Handle SMS Permission
    const handleAllowAccess = () => {
        // In real app, request SMS permission here
        // const granted = await requestSMSPermission();

        setCurrentStep('scanning');
        setIsScanning(true);

        // Simulate SMS scanning
        setTimeout(() => {
            setDetectedBills(mockDetectedBills);
            setSelectedBills(mockDetectedBills.map(b => b.id)); // All selected by default
            setIsScanning(false);
            setCurrentStep('detected');
        }, 3000);
    };

    // Handle Not Now
    const handleNotNow = () => {
        Alert.alert(
            'SMS Access Required',
            'We need SMS access to automatically detect your bills. You can add them manually instead.',
            [
                { text: 'Add Manually', onPress: () => router.back() },
                { text: 'Try Again', style: 'cancel' },
            ]
        );
    };

    // Toggle Bill Selection
    const toggleBillSelection = (billId: string) => {
        if (selectedBills.includes(billId)) {
            setSelectedBills(selectedBills.filter(id => id !== billId));
        } else {
            setSelectedBills([...selectedBills, billId]);
        }
    };

    // Add Selected Bills
    const handleAddBills = () => {
        if (selectedBills.length === 0) {
            Alert.alert('No Bills Selected', 'Please select at least one bill to add');
            return;
        }

        // In real app, save to database
        Alert.alert(
            'Success! 🎉',
            `${selectedBills.length} billers added successfully`,
            [
                {
                    text: 'View My Bills',
                    onPress: () => {
                        // Navigate to My Bills screen
                        router.back();
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        {currentStep === 'permission' && 'Add Bills Automatically'}
                        {currentStep === 'scanning' && 'Scanning Bills'}
                        {currentStep === 'detected' && 'Detected Bills'}
                    </Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Content - Changes based on step */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* STEP 1: Permission Screen */}
                    {currentStep === 'permission' && (
                        <View style={styles.permissionContainer}>
                            <View style={styles.permissionCard}>
                                {/* Icon */}
                                <View style={styles.smsIconContainer}>
                                    <MaterialCommunityIcons name="message-text" size={64} color="#2196F3" />
                                </View>

                                {/* Title */}
                                <Text style={styles.permissionTitle}>SMS Access Required</Text>

                                {/* Description */}
                                <Text style={styles.permissionDescription}>
                                    To detect your bills automatically, we need SMS access.
                                </Text>

                                {/* Benefits */}
                                <View style={styles.benefitsList}>
                                    <View style={styles.benefitItem}>
                                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                                        <Text style={styles.benefitText}>Scan bill-related messages only</Text>
                                    </View>
                                    <View style={styles.benefitItem}>
                                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                                        <Text style={styles.benefitText}>Detect upcoming due dates</Text>
                                    </View>
                                    <View style={styles.benefitItem}>
                                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                                        <Text style={styles.benefitText}>Never miss a payment</Text>
                                    </View>
                                </View>

                                {/* Buttons */}
                                <TouchableOpacity style={styles.allowButton} onPress={handleAllowAccess}>
                                    <Text style={styles.allowButtonText}>Allow Access</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.notNowButton} onPress={handleNotNow}>
                                    <Text style={styles.notNowButtonText}>Not Now</Text>
                                </TouchableOpacity>

                                {/* Security Note */}
                                <View style={styles.securityNote}>
                                    <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
                                    <Text style={styles.securityText}>
                                        We only read bill-related messages. Your data is secure.
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* STEP 2: Scanning Screen */}
                    {currentStep === 'scanning' && (
                        <View style={styles.scanningContainer}>
                            <View style={styles.scanningCard}>
                                {/* Loader */}
                                <View style={styles.loaderContainer}>
                                    <ActivityIndicator size="large" color="#2196F3" />
                                    <View style={styles.scanningIconOverlay}>
                                        <MaterialCommunityIcons name="magnify" size={32} color="#2196F3" />
                                    </View>
                                </View>

                                {/* Text */}
                                <Text style={styles.scanningTitle}>🔍 Scanning your SMS…</Text>
                                <Text style={styles.scanningSubtext}>This may take a few seconds</Text>

                                {/* Progress Animation */}
                                <View style={styles.progressBar}>
                                    <View style={styles.progressFill} />
                                </View>

                                <Text style={styles.scanningHint}>Looking for bill messages</Text>
                            </View>
                        </View>
                    )}

                    {/* STEP 3: Detected Bills List */}
                    {currentStep === 'detected' && (
                        <View style={styles.detectedContainer}>
                            {/* Header */}
                            <View style={styles.detectedHeader}>
                                <Text style={styles.detectedTitle}>We found these bills 🎉</Text>
                                <Text style={styles.detectedSubtext}>
                                    Select the bills you want to add
                                </Text>
                            </View>

                            {/* Bills List */}
                            <View style={styles.billsList}>
                                {detectedBills.map((bill) => (
                                    <TouchableOpacity
                                        key={bill.id}
                                        style={[
                                            styles.billCard,
                                            selectedBills.includes(bill.id) && styles.billCardSelected,
                                        ]}
                                        onPress={() => toggleBillSelection(bill.id)}
                                    >
                                        {/* Left: Icon */}
                                        <View style={[styles.billIcon, { backgroundColor: bill.iconBg }]}>
                                            <Ionicons name={bill.icon as any} size={24} color={bill.iconColor} />
                                        </View>

                                        {/* Center: Details */}
                                        <View style={styles.billDetails}>
                                            <Text style={styles.billCategory}>{bill.category}</Text>
                                            <Text style={styles.billProvider}>{bill.provider}</Text>
                                            <Text style={styles.billConsumer}>ID: {bill.consumerNumber}</Text>
                                            <View style={styles.billMeta}>
                                                <Text style={styles.billAmount}>{bill.lastBill}</Text>
                                                <Text style={styles.billDue}>Due: {bill.dueDate}</Text>
                                            </View>
                                        </View>

                                        {/* Right: Checkbox */}
                                        <View style={styles.checkboxContainer}>
                                            {selectedBills.includes(bill.id) ? (
                                                <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
                                            ) : (
                                                <View style={styles.uncheckedCircle} />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Select All Option */}
                            <TouchableOpacity
                                style={styles.selectAllButton}
                                onPress={() => {
                                    if (selectedBills.length === detectedBills.length) {
                                        setSelectedBills([]);
                                    } else {
                                        setSelectedBills(detectedBills.map(b => b.id));
                                    }
                                }}
                            >
                                <Ionicons
                                    name={selectedBills.length === detectedBills.length ? "checkbox" : "square-outline"}
                                    size={20}
                                    color="#2196F3"
                                />
                                <Text style={styles.selectAllText}>
                                    {selectedBills.length === detectedBills.length ? 'Deselect All' : 'Select All'}
                                </Text>
                            </TouchableOpacity>

                            {/* Bottom Spacing */}
                            <View style={{ height: 100 }} />
                        </View>
                    )}
                </ScrollView>

                {/* Sticky Bottom Button - Show in detected step */}
                {currentStep === 'detected' && (
                    <View style={styles.bottomBar}>
                        <TouchableOpacity
                            style={[
                                styles.addButton,
                                selectedBills.length === 0 && styles.addButtonDisabled,
                            ]}
                            onPress={handleAddBills}
                            disabled={selectedBills.length === 0}
                        >
                            <LinearGradient
                                colors={selectedBills.length > 0 ? ['#4CAF50', '#45A049'] : ['#E0E0E0', '#BDBDBD']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.addButtonGradient}
                            >
                                <Text style={styles.addButtonText}>
                                    Add {selectedBills.length > 0 ? `${selectedBills.length} ` : ''}Selected Bills
                                </Text>
                                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F9FC',
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
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    placeholder: {
        width: 34,
    },

    scrollContent: {
        paddingBottom: 20,
    },

    // Permission Screen
    permissionContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    permissionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    smsIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#E3F2FD',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    permissionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 12,
        textAlign: 'center',
    },
    permissionDescription: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    benefitsList: {
        width: '100%',
        gap: 12,
        marginBottom: 30,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    benefitText: {
        fontSize: 14,
        color: '#666',
    },
    allowButton: {
        width: '100%',
        backgroundColor: '#2196F3',
        paddingVertical: 16,
        borderRadius: 24,
        marginBottom: 12,
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    allowButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    notNowButton: {
        width: '100%',
        backgroundColor: '#F5F5F5',
        paddingVertical: 16,
        borderRadius: 24,
        marginBottom: 20,
    },
    notNowButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        textAlign: 'center',
    },
    securityNote: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    securityText: {
        fontSize: 12,
        color: '#4CAF50',
        flex: 1,
    },

    // Scanning Screen
    scanningContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    scanningCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    loaderContainer: {
        width: 100,
        height: 100,
        position: 'relative',
        marginBottom: 30,
    },
    scanningIconOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanningTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 8,
        textAlign: 'center',
    },
    scanningSubtext: {
        fontSize: 14,
        color: '#999',
        marginBottom: 30,
        textAlign: 'center',
    },
    progressBar: {
        width: '100%',
        height: 6,
        backgroundColor: '#E0E0E0',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 20,
    },
    progressFill: {
        width: '60%',
        height: '100%',
        backgroundColor: '#2196F3',
    },
    scanningHint: {
        fontSize: 13,
        color: '#2196F3',
        fontWeight: '500',
    },

    // Detected Bills Screen
    detectedContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    detectedHeader: {
        marginBottom: 20,
    },
    detectedTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 6,
    },
    detectedSubtext: {
        fontSize: 14,
        color: '#666',
    },
    billsList: {
        gap: 12,
        marginBottom: 15,
    },
    billCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    billCardSelected: {
        borderColor: '#4CAF50',
        backgroundColor: '#F1F8F5',
    },
    billIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    billDetails: {
        flex: 1,
        gap: 3,
    },
    billCategory: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    billProvider: {
        fontSize: 14,
        color: '#666',
    },
    billConsumer: {
        fontSize: 12,
        color: '#999',
    },
    billMeta: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 4,
    },
    billAmount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    billDue: {
        fontSize: 12,
        color: '#FF9800',
    },
    checkboxContainer: {
        padding: 4,
    },
    uncheckedCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#E0E0E0',
    },
    selectAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#F1F8FE',
        borderRadius: 12,
    },
    selectAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2196F3',
    },

    // Bottom Bar
    bottomBar: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 8,
    },
    addButton: {
        borderRadius: 24,
        overflow: 'hidden',
    },
    addButtonDisabled: {
        opacity: 0.6,
    },
    addButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 16,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});