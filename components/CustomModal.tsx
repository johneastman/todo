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
import { BLACK, LIGHT_BLUE, WHITE } from "../utils";

type CustomButtonProps = {
    testId: string;
    text: string;
    onPress: () => void;
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
            testID={testId}
            onPress={onPress}
            onPressIn={fadeIn}
            onPressOut={fadeOut}
            style={{
                padding: 25,
                borderRightWidth: 1,
                width: "50%",
                alignItems: "center",
                backgroundColor: LIGHT_BLUE,
            }}
        >
            <Animated.View style={{ opacity: animated }}>
                <Text style={{ fontSize: 15 }}>{text}</Text>
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
    return (
        <Modal
            animationType={"slide"}
            visible={props.isVisible}
            transparent={true}
        >
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
                        <Header text={props.title} />
                        {props.children}
                    </View>

                    <View
                        style={{
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            borderTopWidth: 2,
                        }}
                    >
                        <Pressable
                            onPress={props.negativeAction}
                            style={{
                                padding: 25,
                                width: "50%",
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ fontSize: 15 }}>
                                {props.negativeActionText}
                            </Text>
                        </Pressable>
                        <View
                            style={{
                                width: "50%",
                            }}
                        >
                            <View
                                style={{
                                    width: "100%",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                {props.altAction && props.altActionText && (
                                    <Pressable
                                        onPress={props.altAction}
                                        style={{
                                            padding: 25,
                                            width: "50%",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Text style={{ fontSize: 15 }}>
                                            {props.altActionText}
                                        </Text>
                                    </Pressable>
                                )}

                                <Pressable
                                    onPress={props.positiveAction}
                                    style={{
                                        padding: 25,
                                        width: "50%",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text style={{ fontSize: 15 }}>
                                        {props.positiveActionText}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                    {/* <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderWidth: 2,
                        }}
                    >
                        {props.altAction !== undefined &&
                        props.altActionText !== undefined ? (
                            <View>
                                <CustomButton
                                    testId={`custom-modal-${props.altActionText}`}
                                    text={props.altActionText}
                                    onPress={props.altAction}
                                />
                            </View>
                        ) : null}
                        <View
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                gap: 10,
                                justifyContent: "flex-end",
                            }}
                        >
                            {props.negativeActionText !== undefined &&
                                props.negativeAction !== undefined && (
                                    <CustomButton
                                        testId={`custom-modal-${props.negativeActionText}`}
                                        text={props.negativeActionText}
                                        onPress={props.negativeAction}
                                    />
                                )}

                            <CustomButton
                                text={props.positiveActionText}
                                onPress={props.positiveAction}
                                testId={`custom-modal-${props.positiveActionText}`}
                            />
                        </View>
                    </View> */}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        // alignItems: "center",
    },
    modal: {
        width: "90%",
        margin: 20,
        backgroundColor: WHITE,
        borderRadius: 20,
        // padding: 35,
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
