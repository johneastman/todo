import { View, Modal, Button, StyleSheet } from "react-native";
import React from "react";
import Header from "./Header";
import { BLACK, WHITE } from "../utils";

interface CustomModalInterface {
    title: string;
    isVisible: boolean;

    positiveActionText: string;
    positiveAction: () => void;

    negativeActionText?: string;
    negativeAction?: () => void;

    altActionText?: string;
    altAction?: () => void;

    children?: React.ReactNode;
}

export default function CustomModal(props: CustomModalInterface): JSX.Element {
    return (
        <Modal
            animationType={"slide"}
            visible={props.isVisible}
            transparent={true}
        >
            <View style={styles.centeredView}>
                <View style={[styles.modal, { gap: 10 }]}>
                    <Header text={props.title} />
                    {props.children}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        {props.altAction !== undefined &&
                        props.altActionText !== undefined ? (
                            <View>
                                <Button
                                    testID={`custom-modal-${props.altActionText}`}
                                    title={props.altActionText}
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
                                    <Button
                                        testID={`custom-modal-${props.negativeActionText}`}
                                        title={props.negativeActionText}
                                        onPress={props.negativeAction}
                                    />
                                )}

                            <Button
                                testID={`custom-modal-${props.positiveActionText}`}
                                title={props.positiveActionText}
                                onPress={props.positiveAction}
                            />
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
        alignItems: "center",
    },
    modal: {
        width: "90%",
        margin: 20,
        backgroundColor: WHITE,
        borderRadius: 20,
        padding: 35,
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
    },
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        width: "100%",
    },
});
