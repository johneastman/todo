import { View, Modal, StyleSheet } from "react-native";
import React from "react";
import Header from "./Header";
import CustomError from "./CustomError";
import ModalActionButton from "../ModalActionButton";
import { ModalButton } from "../../types";
import { Color } from "../../utils";

type CustomModalProps = {
    title: string;
    isVisible: boolean;

    positiveAction: ModalButton;
    negativeAction?: ModalButton;
    altAction?: ModalButton;

    error?: string;
    children?: React.ReactNode;
    testId?: string;
};

export default function CustomModal(props: CustomModalProps): JSX.Element {
    const {
        title,
        isVisible,
        positiveAction,
        negativeAction,
        altAction,
        error,
        children,
        testId,
    } = props;

    const isNegativeActionSet = (): boolean => {
        return negativeAction !== undefined;
    };

    const isAlternateActionSet = (): boolean => {
        return altAction !== undefined;
    };

    return (
        <Modal
            animationType={"slide"}
            visible={isVisible}
            transparent={true}
            testID={testId}
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
                        <ModalActionButton action={negativeAction} />

                        <View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <ModalActionButton action={altAction} />

                                <ModalActionButton action={positiveAction} />
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
        backgroundColor: Color.White,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: Color.Black,
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
