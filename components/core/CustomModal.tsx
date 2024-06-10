import { View, Modal, StyleSheet } from "react-native";
import React from "react";
import Header from "../Header";
import { BLACK, WHITE } from "../../utils";
import CustomError from "./CustomError";
import ModalActionButton from "../ModalActionButton";

type CustomModalProps = {
    title: string;
    isVisible: boolean;

    positiveActionText: string;
    positiveAction: () => void;

    negativeActionText?: string;
    negativeAction?: () => void;

    altActionText?: string;
    altAction?: () => void;

    error?: string;
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
        error,
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
                        <CustomError error={error} />
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
                            borderTopWidth: 1,
                        }}
                    >
                        {isNegativeActionSet() && (
                            <ModalActionButton
                                onPress={negativeAction!}
                                text={negativeActionText!}
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
                                    <ModalActionButton
                                        onPress={altAction!}
                                        text={altActionText!}
                                        testId={`custom-modal-${altActionText!}`}
                                    />
                                )}

                                <ModalActionButton
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
