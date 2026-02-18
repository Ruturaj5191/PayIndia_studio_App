import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface RechargeItem {
    id: string;
    number: string;
    operator: string;
    amount: string;
    date: string;
    logo: string;
}

interface PlanItem {
    id: string;
    price: string;
    data: string;
    validity: string;
    popular: boolean;
}

export default function MobileRechargeScreen() {
    const router = useRouter();

    // State
    const [mobileNumber, setMobileNumber] = useState('');
    const [operator, setOperator] = useState('');
    const [circle, setCircle] = useState('');

    // Recent recharges - empty by default, will show vertically when data added
    const [recentRecharges] = useState<RechargeItem[]>([]);

    // Operator list for the new section
    const operators = [
        { id: 'jio', name: 'Jio', logo: 'Jio', color: '#005AB5' },
        { id: 'airtel', name: 'Airtel', logo: 'A', color: '#E11900' },
        { id: 'vi', name: 'Vi', logo: 'Vi', color: '#E11900' },
        { id: 'bsnl', name: 'BSNL', logo: 'B', color: '#005AB5' },
        { id: 'mtnl', name: 'MTNL', logo: 'M', color: '#00A651' },
    ];

    // Popular plans - shown when operator detected
    const popularPlans: PlanItem[] = [
        { id: '1', price: '₹299', data: '1.5GB/day', validity: '28 days', popular: true },
        { id: '2', price: '₹399', data: '2GB/day', validity: '28 days', popular: false },
        { id: '3', price: '₹719', data: '1.5GB/day', validity: '84 days', popular: false },
        { id: '4', price: '₹839', data: '2GB/day', validity: '84 days', popular: false },
    ];

    // Handle mobile number input
    const handleMobileNumberChange = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        const limited = cleaned.substring(0, 10);
        setMobileNumber(limited);

        if (limited.length === 10) {
            // Auto-detect and navigate to plans
            const detectedName = detectOperator(limited);
            router.push({
                pathname: '/recharge-plans',
                params: {
                    number: limited,
                    operator: detectedName,
                    circle: 'Maharashtra'
                }
            });
        } else {
            setOperator('');
            setCircle('');
        }
    };

    // Auto-detect operator with more prefixes
    const detectOperator = (number: string) => {
        const p2 = number.substring(0, 2);

        let detected = 'Jio'; // Default for auto-detection from main screen

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

        setOperator(detected);
        setCircle('Maharashtra');
        return detected;
    };

    // Contact picker
    const handleContactPicker = async () => {
        try {
            const { status } = await Contacts.requestPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please allow access to contacts');
                return;
            }

            const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.PhoneNumbers],
            });

            if (data.length > 0) {
                if (data[0]?.phoneNumbers?.[0]?.number) {
                    const phoneNumber = data[0].phoneNumbers[0].number.replace(/\D/g, '').slice(-10);
                    setMobileNumber(phoneNumber);
                    detectOperator(phoneNumber);
                }
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch contacts');
        }
    };

    // Handle operator selection
    const handleSelectOperator = (op: any) => {
        router.push({
            pathname: '/operator-recharge',
            params: { operator: op.name }
        });
    };

    // Quick recharge from recent
    const handleQuickRecharge = (item: RechargeItem) => {
        setMobileNumber(item.number);
        detectOperator(item.number);
    };

    // Select plan
    const handleSelectPlan = (plan: PlanItem) => {
        router.push({
            pathname: '/recharge-plans',
            params: {
                number: mobileNumber,
                operator: operator,
                circle: circle || 'Maharashtra'
            }
        });
    };

    // View all plans
    const handleViewPlans = () => {
        if (mobileNumber.length !== 10) {
            Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number');
            return;
        }
        router.push({
            pathname: '/recharge-plans',
            params: {
                number: mobileNumber,
                operator: operator,
                circle: circle || 'Maharashtra'
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
                    <Text style={styles.headerTitle}>Mobile Recharge</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Premium Banner */}
                    <View style={styles.bannerContainer}>
                        <LinearGradient
                            colors={['#E3F2FD', '#BBDEFB', '#90CAF9']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.premiumBanner}
                        >
                            <View style={styles.bannerIcon}>
                                <MaterialCommunityIcons name="cellphone-check" size={32} color="#1976D2" />
                            </View>
                            <View style={styles.bannerContent}>
                                <Text style={styles.bannerTitle}>⚡ Recharge in 10 Seconds</Text>
                                <Text style={styles.bannerSubtitle}>All operators • Instant confirmation</Text>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Mobile Number Input Card */}
                    <View style={styles.inputCard}>
                        <View style={styles.inputRow}>
                            {/* Flag and Code */}
                            <View style={styles.flagSection}>
                                <Text style={styles.flag}>🇮🇳</Text>
                                <Text style={styles.code}>+91</Text>
                            </View>

                            {/* Divider */}
                            <View style={styles.verticalDivider} />

                            {/* Input */}
                            <TextInput
                                style={styles.phoneInput}
                                placeholder="Enter mobile number"
                                placeholderTextColor="#999"
                                keyboardType="phone-pad"
                                maxLength={10}
                                value={mobileNumber}
                                onChangeText={handleMobileNumberChange}
                            />

                            {/* Contact Button */}
                            <TouchableOpacity style={styles.contactIcon} onPress={handleContactPicker}>
                                <Ionicons name="people" size={20} color="#2196F3" />
                            </TouchableOpacity>
                        </View>

                        {/* Auto-detect display */}
                        {operator && mobileNumber.length === 10 && (
                            <View style={styles.autoDetect}>
                                <MaterialCommunityIcons name="check-circle" size={14} color="#4CAF50" />
                                <Text style={styles.autoDetectText}>{operator} • {circle}</Text>
                            </View>
                        )}
                    </View>

                    {/* Mobile Operators Section */}
                    <View style={styles.operatorsSection}>
                        <Text style={styles.sectionTitle}>Mobile Operators</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.operatorsScroll}
                        >
                            {operators.map((op) => (
                                <TouchableOpacity
                                    key={op.id}
                                    style={styles.operatorItem}
                                    onPress={() => handleSelectOperator(op)}
                                >
                                    <View style={styles.operatorOuterCircle}>
                                        <View style={[styles.operatorInnerCircle, { backgroundColor: op.color }]}>
                                            <Text style={styles.operatorCircleText}>{op.logo}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.operatorName}>{op.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Recent Recharges Section - Always Visible */}
                    <View style={styles.recentsSection}>
                        <Text style={styles.sectionTitle}>Recent Recharges</Text>
                        {recentRecharges.length > 0 ? (
                            <View style={styles.recentsVerticalList}>
                                {recentRecharges.map((item) => (
                                    <View key={item.id} style={styles.recentVerticalItem}>
                                        <View style={styles.operatorLogo}>
                                            <Text style={styles.operatorLogoText}>{item.logo}</Text>
                                        </View>
                                        <View style={styles.recentDetails}>
                                            <Text style={styles.recentNumber}>{item.number}</Text>
                                            <Text style={styles.recentMeta}>{item.operator} • {item.amount} • {item.date}</Text>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.quickRechargeBtn}
                                            onPress={() => handleQuickRecharge(item)}
                                        >
                                            <MaterialCommunityIcons name="reload" size={16} color="#2196F3" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <View style={styles.emptyStateContainer}>
                                <View style={styles.emptyIconCircle}>
                                    <MaterialCommunityIcons name="history" size={30} color="#2196F3" />
                                </View>
                                <Text style={styles.emptyStateTitle}>No recent activity</Text>
                                <Text style={styles.emptyStateSubtext}>Your recent recharges will appear here</Text>
                            </View>
                        )}
                    </View>

                    {/* Popular Plans - Show when operator detected */}
                    {operator && mobileNumber.length === 10 && (
                        <View style={styles.plansSection}>
                            <View style={styles.plansTitleRow}>
                                <Text style={styles.sectionTitle}>Popular Plans for {operator}</Text>
                                <TouchableOpacity onPress={handleViewPlans}>
                                    <Text style={styles.viewAllText}>View All</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.plansGrid}>
                                {popularPlans.map((plan) => (
                                    <TouchableOpacity
                                        key={plan.id}
                                        style={styles.planCard}
                                        onPress={() => handleSelectPlan(plan)}
                                    >
                                        {plan.popular && (
                                            <View style={styles.popularBadge}>
                                                <Text style={styles.popularText}>POPULAR</Text>
                                            </View>
                                        )}
                                        <Text style={styles.planPrice}>{plan.price}</Text>
                                        <Text style={styles.planData}>{plan.data}</Text>
                                        <Text style={styles.planValidity}>{plan.validity}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Bottom Spacing */}
                    <View style={{ height: 100 }} />
                </ScrollView>

                {/* Sticky Bottom Button - Only show when 10 digits entered */}
                {mobileNumber.length === 10 && (
                    <View style={styles.bottomBar}>
                        <TouchableOpacity
                            style={styles.viewPlansButton}
                            onPress={handleViewPlans}
                        >
                            <LinearGradient
                                colors={['#2196F3', '#1976D2']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.buttonGradient}
                            >
                                <Text style={styles.buttonText}>View Plans</Text>
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    placeholder: {
        width: 34,
    },

    scrollContent: {
        paddingBottom: 20,
    },

    // Premium Banner
    bannerContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
    },
    premiumBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12, // Reduced padding
        borderRadius: 20,
        gap: 12,
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    bannerIcon: {
        width: 44, // Reduced size
        height: 44, // Reduced size
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bannerContent: {
        flex: 1,
    },
    bannerTitle: {
        fontSize: 16, // Reduced font size
        fontWeight: 'bold',
        color: '#0D47A1',
        marginBottom: 2,
    },
    bannerSubtitle: {
        fontSize: 12, // Reduced font size
        color: '#1565C0',
        opacity: 0.9,
    },

    // Input Card
    inputCard: {
        marginHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        marginBottom: 20,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    flagSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    flag: {
        fontSize: 24,
    },
    code: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    verticalDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#E0E0E0',
    },
    phoneInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    contactIcon: {
        padding: 6,
        backgroundColor: '#F1F8FE',
        borderRadius: 8,
    },
    autoDetect: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    autoDetectText: {
        fontSize: 13,
        color: '#666',
    },

    // Recent Recharges - Vertical
    recentsSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A1A1A',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    recentsVerticalList: {
        paddingHorizontal: 20,
    },
    recentVerticalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        marginBottom: 10,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
    },
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 35,
        marginHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: '#E3F2FD',
    },
    emptyIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F1F8FE',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    emptyStateTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    emptyStateSubtext: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
        paddingHorizontal: 20,
    },

    // Operators Section
    operatorsSection: {
        marginBottom: 25,
    },
    operatorsScroll: {
        paddingHorizontal: 20,
        gap: 20,
    },
    operatorItem: {
        alignItems: 'center',
        gap: 8,
    },
    operatorOuterCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: '#F0F0F0',
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    operatorInnerCircle: {
        width: 58,
        height: 58,
        borderRadius: 29,
        justifyContent: 'center',
        alignItems: 'center',
    },
    operatorCircleText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    operatorName: {
        fontSize: 13,
        color: '#1A1A1A',
        fontWeight: '500',
    },

    operatorLogo: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F1F8FE',
        alignItems: 'center',
        justifyContent: 'center',
    },
    operatorLogoText: {
        fontSize: 20,
    },
    recentDetails: {
        flex: 1,
    },
    recentNumber: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 3,
    },
    recentMeta: {
        fontSize: 12,
        color: '#999',
    },
    quickRechargeBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#E3F2FD',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Popular Plans
    plansSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    plansTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2196F3',
    },
    plansGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    planCard: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        position: 'relative',
    },
    popularBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#4CAF50',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    popularText: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    planPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2196F3',
        marginBottom: 6,
    },
    planData: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 3,
    },
    planValidity: {
        fontSize: 12,
        color: '#999',
    },

    // Bottom Sticky Button
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
    viewPlansButton: {
        borderRadius: 24,
        overflow: 'hidden',
    },
    viewPlansButtonDisabled: {
        opacity: 0.6,
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});