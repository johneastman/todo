import { View, Text, TextInput, Modal, Button, StyleSheet } from "react-native";
import React from "react";

interface CustomModalInterface {
    title: string;
    isVisible: boolean;

    positiveActionText: string;
    positiveAction: () => void;

    negativeActionText: string;
    negativeAction: () => void;

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
                    <Text style={{ fontSize: 20 }}>{props.title}</Text>
                    {props.children}
                    <View style={{ flexDirection: "row", gap: 10 }}>
                        <Button
                            title={props.negativeActionText}
                            onPress={props.negativeAction}
                        />
                        <Button
                            title={props.positiveActionText}
                            onPress={props.positiveAction}
                        />
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
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
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
