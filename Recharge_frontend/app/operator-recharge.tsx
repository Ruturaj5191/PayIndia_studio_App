import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const OPERATOR_DATA: Record<string, { name: string; color: string; bgColor: string }> = {
    'Jio': { name: 'Jio', color: '#005AB5', bgColor: '#E3F2FD' },
    'Airtel': { name: 'Airtel', color: '#E11900', bgColor: '#FFEBEE' },
    'Vi': { name: 'Vi', color: '#E11900', bgColor: '#FFEBEE' },
    'BSNL': { name: 'BSNL', color: '#005AB5', bgColor: '#E3F2FD' },
    'MTNL': { name: 'MTNL', color: '#00A651', bgColor: '#E8F5E9' },
};

export default function OperatorRechargeScreen() {
    const router = useRouter();
    const { operator } = useLocalSearchParams<{ operator: string }>();
    const currentOperator = OPERATOR_DATA[operator || 'Jio'] || OPERATOR_DATA['Jio'];

    const [mobileNumber, setMobileNumber] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState<'match' | 'mismatch'>('match');
    const [detectedOp, setDetectedOp] = useState('');

    useEffect(() => {
        setIsValid(mobileNumber.length === 10);
    }, [mobileNumber]);

    const handleNumberChange = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        setMobileNumber(cleaned.substring(0, 10));
    };

    const runDetection = () => {
        // Broadened detection logic for common Indian prefixes
        const p2 = mobileNumber.substring(0, 2);
        let detected = currentOperator.name; // Default to current operator to avoid false mismatch

        const airtelPrefixes = ['98', '99', '97', '96', '95', '81', '80', '70'];
        const viPrefixes = ['91', '90', '88', '87', '77', '78'];
        const jioPrefixes = ['60', '70', '78', '88', '99', '93', '92'];
        const bsnlPrefixes = ['94', '73', '61'];
        const mtnlPrefixes = ['72', '86', '89'];

        if (airtelPrefixes.includes(p2)) detected = 'Airtel';
        else if (viPrefixes.includes(p2)) detected = 'Vi';
        else if (jioPrefixes.includes(p2)) detected = 'Jio';
        else if (bsnlPrefixes.includes(p2)) detected = 'BSNL';
        else if (mtnlPrefixes.includes(p2)) detected = 'MTNL';

        setDetectedOp(detected);

        if (detected.toLowerCase() === currentOperator.name.toLowerCase()) {
            setPopupType('match');
        } else {
            setPopupType('mismatch');
        }
        setShowPopup(true);
    };

    const handleContinue = () => {
        if (isValid) {
            runDetection();
        }
    };

    const handleSwitch = () => {
        setShowPopup(false);
        router.replace({
            pathname: '/operator-recharge',
            params: { operator: detectedOp }
        });
    };

    const goToPlans = () => {
        setShowPopup(false);
        router.push({
            pathname: '/recharge-plans',
            params: {
                number: mobileNumber,
                operator: detectedOp,
                circle: 'Maharashtra'
            }
        });
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
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>{currentOperator.name} Recharge</Text>
                        <Text style={styles.headerSubtitle}>Recharge your {currentOperator.name} prepaid number instantly</Text>
                    </View>
                    <View style={styles.placeholder} />
                </View>

                <View style={styles.content}>
                    {/* Top Input Card */}
                    <View style={styles.inputCard}>
                        <View style={styles.inputRow}>
                            <View style={styles.flagAndCode}>
                                <Text style={styles.flagText}>🇮🇳</Text>
                                <Text style={styles.codeText}>+91</Text>
                                <View style={styles.verticalDivider} />
                            </View>
                            <TextInput
                                style={styles.phoneInput}
                                placeholder="Enter mobile number"
                                placeholderTextColor="#999"
                                keyboardType="phone-pad"
                                maxLength={10}
                                value={mobileNumber}
                                onChangeText={handleNumberChange}
                                autoFocus
                            />
                        </View>
                        <Text style={styles.helperText}>Enter 10-digit mobile number</Text>
                    </View>

                    {/* Action Button */}
                    <TouchableOpacity
                        style={[styles.continueButton, !isValid && styles.disabledButton]}
                        onPress={handleContinue}
                        disabled={!isValid}
                    >
                        <LinearGradient
                            colors={isValid ? ['#2196F3', '#1976D2'] : ['#E0E0E0', '#BDBDBD']}
                            style={styles.buttonGradient}
                        >
                            <Text style={styles.continueText}>Continue</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Popups */}
                <Modal
                    visible={showPopup}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowPopup(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            {popupType === 'match' ? (
                                <>
                                    <View style={styles.iconCircleSuccess}>
                                        <Ionicons name="checkmark" size={40} color="#FFFFFF" />
                                    </View>
                                    <Text style={styles.modalTitle}>Match Found</Text>
                                    <Text style={styles.modalSubtitle}>Number belongs to {detectedOp}</Text>
                                    <TouchableOpacity style={styles.primaryModalButton} onPress={goToPlans}>
                                        <Text style={styles.primaryModalButtonText}>Continue to Plans</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <View style={styles.iconCircleWarning}>
                                        <Ionicons name="warning" size={40} color="#FFFFFF" />
                                    </View>
                                    <Text style={styles.modalTitle}>Operator Mismatch</Text>
                                    <Text style={styles.modalSubtitle}>This number belongs to {detectedOp}.</Text>
                                    <View style={styles.modalButtonRow}>
                                        <TouchableOpacity style={styles.secondaryModalButton} onPress={() => setShowPopup(false)}>
                                            <Text style={styles.secondaryModalButtonText}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.primaryModalButton, { flex: 1, backgroundColor: '#2196F3' }]} onPress={handleSwitch}>
                                            <Text style={styles.primaryModalButtonText}>Switch to {detectedOp}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
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
        backgroundColor: '#F6F9FC',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
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
        marginLeft: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    placeholder: {
        width: 34,
    },
    content: {
        padding: 20,
    },
    inputCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        marginBottom: 30,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingBottom: 12,
    },
    flagAndCode: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    flagText: {
        fontSize: 24,
    },
    codeText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    verticalDivider: {
        width: 1,
        height: 24,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 12,
    },
    phoneInput: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    helperText: {
        fontSize: 12,
        color: '#999',
        marginTop: 12,
    },
    continueButton: {
        borderRadius: 28,
        overflow: 'hidden',
        height: 56,
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    disabledButton: {
        opacity: 0.7,
        elevation: 0,
    },
    buttonGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    continueText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 30,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    iconCircleSuccess: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconCircleWarning: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#FF5252',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    primaryModalButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 25,
        height: 50,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryModalButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalButtonRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    secondaryModalButton: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 25,
    },
    secondaryModalButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
});
