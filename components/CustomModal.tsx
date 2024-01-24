import {
    View,
    Modal,
    StyleSheet,
    Pressable,
    Text,
    Animated,
} from "react-native";
import React from "react";
import Header from "./Header";
import { BLACK, LIGHT_BLUE_BUTTON, WHITE } from "../utils";

type CustomButtonProps = {
    onPress?: () => void;
    text?: string;
    testId?: string;
};

function CustomButton(props: CustomButtonProps): JSX.Element {
    const { testId, text, onPress } = props;

    const animated = new Animated.Value(1);

    const fadeIn = () => {
        Animated.timing(animated, {
            toValue: 0.1,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };
    const fadeOut = () => {
        Animated.timing(animated, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Pressable
            onPress={onPress}
            onPressIn={fadeIn}
            onPressOut={fadeOut}
            style={{
                padding: 25,
                alignItems: "center",
            }}
            testID={testId}
        >
            <Animated.View style={{ opacity: animated }}>
                <Text style={{ fontSize: 15, color: LIGHT_BLUE_BUTTON }}>
                    {text}
                </Text>
            </Animated.View>
        </Pressable>
    );
}

type CustomModalProps = {
    title: string;
    isVisible: boolean;

    positiveActionText: string;
    positiveAction: () => void;

    negativeActionText?: string;
    negativeAction?: () => void;

    altActionText?: string;
    altAction?: () => void;

    children?: React.ReactNode;
};

export default function CustomModal(props: CustomModalProps): JSX.Element {
    const {
        title,
        isVisible,
        positiveAction,
        positiveActionText,
        negativeAction,
        negativeActionText,
        altAction,
        altActionText,
        children,
    } = props;

    const isNegativeActionSet = (): boolean => {
        return negativeAction !== undefined && negativeActionText !== undefined;
    };

    const isAlternateActionSet = (): boolean => {
        return altAction !== undefined && altActionText !== undefined;
    };

    return (
        <Modal animationType={"slide"} visible={isVisible} transparent={true}>
            <View style={styles.centeredView}>
                <View style={styles.modal}>
                    <View
                        style={{
                            alignItems: "center",
                            width: "100%",
                            gap: 10,
                            paddingTop: 35,
                            paddingLeft: 35,
                            paddingRight: 35,
                        }}
                    >
                        <Header text={title} />
                        {children}
                    </View>

                    <View
                        style={{
                            width: "100%",
                            flexDirection: "row",
                            justifyContent:
                                !isNegativeActionSet() &&
                                !isAlternateActionSet()
                                    ? "center"
                                    : "space-between",
                            borderTopWidth: 2,
                        }}
                    >
                        {isNegativeActionSet() && (
                            <CustomButton
                                onPress={negativeAction}
                                text={negativeActionText}
                                testId={`custom-modal-${negativeActionText!}`}
                            />
                        )}
                        <View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                {isAlternateActionSet() && (
                                    <CustomButton
                                        onPress={altAction}
                                        text={altActionText}
                                        testId={`custom-modal-${altActionText!}`}
                                    />
                                )}

                                <CustomButton
                                    onPress={positiveAction}
                                    text={positiveActionText}
                                    testId={`custom-modal-${positiveActionText}`}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
    },
    modal: {
        width: "90%",
        margin: 20,
        backgroundColor: WHITE,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: BLACK,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        gap: 10,
    },
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        width: "100%",
    },
});
