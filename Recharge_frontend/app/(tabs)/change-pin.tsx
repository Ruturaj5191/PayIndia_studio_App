import { Ionicons } from "@expo/vector-icons";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
    Alert,
    Animated,
    BackHandler,
    NativeSyntheticEvent,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TextInputKeyPressEventData,
    TouchableOpacity,
    View,
} from "react-native";

export default function ChangePinScreen() {
    const router = useRouter();

    // PIN States
    const [currentPin, setCurrentPin] = useState<string[]>(["", "", "", ""]);
    const [newPin, setNewPin] = useState<string[]>(["", "", "", ""]);
    const [confirmPin, setConfirmPin] = useState<string[]>(["", "", "", ""]);

    // Refs for auto-focus
    const currentPinRefs = useRef<(TextInput | null)[]>([]);
    const newPinRefs = useRef<(TextInput | null)[]>([]);
    const confirmPinRefs = useRef<(TextInput | null)[]>([]);

    // Shake animation
    const shakeAnim = useRef(new Animated.Value(0)).current;

    // Handle hardware back button
    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                router.push("/security");
                return true;
            };

            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                backAction
            );

            return () => backHandler.remove();
        }, [router])
    );

    const handlePinChange = (
        text: string,
        index: number,
        pinArray: string[],
        setPinArray: React.Dispatch<React.SetStateAction<string[]>>,
        refs: React.MutableRefObject<(TextInput | null)[]>
    ) => {
        if (text.length > 1) return; // Only allow single digit

        const newPinArray = [...pinArray];
        newPinArray[index] = text;
        setPinArray(newPinArray);

        // Auto focus next input
        if (text && index < 3) {
            refs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (
        e: NativeSyntheticEvent<TextInputKeyPressEventData>,
        index: number,
        refs: React.MutableRefObject<(TextInput | null)[]>
    ) => {
        if (e.nativeEvent.key === "Backspace" && index > 0) {
            refs.current[index - 1]?.focus();
        }
    };

    const shakeAnimation = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    const handleUpdatePin = () => {
        // Validation
        const currentPinString = currentPin.join("");
        const newPinString = newPin.join("");
        const confirmPinString = confirmPin.join("");

        if (currentPinString.length !== 4) {
            Alert.alert("Error", "Please enter your current PIN");
            shakeAnimation();
            return;
        }

        if (newPinString.length !== 4) {
            Alert.alert("Error", "Please enter a new PIN");
            shakeAnimation();
            return;
        }

        if (confirmPinString.length !== 4) {
            Alert.alert("Error", "Please confirm your new PIN");
            shakeAnimation();
            return;
        }

        if (newPinString !== confirmPinString) {
            Alert.alert("Error", "New PIN and Confirm PIN do not match");
            shakeAnimation();
            setNewPin(["", "", "", ""]);
            setConfirmPin(["", "", "", ""]);
            newPinRefs.current[0]?.focus();
            return;
        }

        // Simulate PIN update (in real app, call API)
        Alert.alert(
            "Success! ✅",
            "Your PIN has been updated successfully",
            [
                {
                    text: "OK",
                    onPress: () => router.push("/security"),
                },
            ]
        );
    };

    const renderPinInputs = (
        pinArray: string[],
        setPinArray: React.Dispatch<React.SetStateAction<string[]>>,
        refs: React.MutableRefObject<(TextInput | null)[]>,
        label: string
    ) => (
        <View style={styles.pinSection}>
            <View style={styles.pinLabelRow}>
                <Ionicons name="lock-closed" size={20} color="#1976D2" />
                <Text style={styles.pinLabel}>{label}</Text>
            </View>
            <Animated.View style={[styles.pinInputRow, { transform: [{ translateX: shakeAnim }] }]}>
                {[0, 1, 2, 3].map((index) => (
                    <TextInput
                        key={index}
                        ref={(ref: TextInput | null) => {
                            refs.current[index] = ref;
                        }}
                        style={styles.pinInput}
                        value={pinArray[index]}
                        onChangeText={(text) => handlePinChange(text, index, pinArray, setPinArray, refs)}
                        onKeyPress={(e) => handleKeyPress(e, index, refs)}
                        keyboardType="number-pad"
                        maxLength={1}
                        secureTextEntry
                        selectTextOnFocus
                    />
                ))}
            </Animated.View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.push("/security")}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Change PIN</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        {/* Current PIN */}
                        {renderPinInputs(currentPin, setCurrentPin, currentPinRefs, "Enter Current PIN")}

                        {/* New PIN */}
                        {renderPinInputs(newPin, setNewPin, newPinRefs, "Enter New PIN")}

                        {/* Confirm PIN */}
                        {renderPinInputs(confirmPin, setConfirmPin, confirmPinRefs, "Confirm New PIN")}

                        {/* Info */}
                        <View style={styles.infoCard}>
                            <Ionicons name="information-circle" size={20} color="#2196F3" />
                            <Text style={styles.infoText}>
                                Choose a strong 4-digit PIN that you can remember easily
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                {/* Update Button */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.updateButton}
                        onPress={handleUpdatePin}
                    >
                        <Text style={styles.updateButtonText}>Update PIN</Text>
                    </TouchableOpacity>
                </View>
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
        paddingTop: 30,
        paddingBottom: 15,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1A1A1A",
    },
    placeholder: {
        width: 34,
    },

    content: {
        padding: 20,
    },

    pinSection: {
        backgroundColor: "#FFFFFF",
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },

    pinLabelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 16,
    },

    pinLabel: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1A1A1A",
    },

    pinInputRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },

    pinInput: {
        flex: 1,
        height: 60,
        borderWidth: 2,
        borderColor: "#E0E0E0",
        borderRadius: 12,
        textAlign: "center",
        fontSize: 24,
        fontWeight: "bold",
        color: "#1A1A1A",
        backgroundColor: "#F5F7FA",
    },

    infoCard: {
        flexDirection: "row",
        backgroundColor: "#E3F2FD",
        padding: 16,
        borderRadius: 12,
        gap: 12,
        borderWidth: 1,
        borderColor: "#BBDEFB",
        marginTop: 8,
    },

    infoText: {
        flex: 1,
        fontSize: 13,
        color: "#0D47A1",
        lineHeight: 18,
    },

    buttonContainer: {
        padding: 20,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#F0F0F0",
    },

    updateButton: {
        backgroundColor: "#0D47A1",
        paddingVertical: 16,
        borderRadius: 25,
        alignItems: "center",
        shadowColor: "#0D47A1",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },

    updateButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
});