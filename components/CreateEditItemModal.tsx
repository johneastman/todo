import { useEffect, useState } from "react";
import { Button, Modal, Text, View, TextInput, StyleSheet } from "react-native";
import { Item } from "./ItemCell";

interface ItemModalProps {
    item: Item | undefined;
    index: number;
    isVisible: boolean;
    title: string;

    positiveActionText: string;
    positiveAction: (index: number, item: Item) => void;

    negativeActionText: string;
    negativeAction: () => void;
}

export default function ItemModal(props: ItemModalProps): JSX.Element {
    const [text, onChangeText] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);

    /* Every time the add/edit item modal opens, the values for the item's attributes need to be reset based on what
     * was passed in the props. This is necessary because the state will not change every time the modal opens and
     * closes.
     *
     * If the item passed to this modal is "undefined", we know a new item is being added, so the values should be
     * reset. However, if a non-"undefined" item is passed to this modal, the item is being edited, so those values
     * need to be updated to reflect the values in the item.
     */
    useEffect(() => {
        onChangeText(props.item?.value || "");
        setQuantity(props.item?.quantity || 1);
    }, [props]);

    return (
        <Modal
            animationType={"slide"}
            visible={props.isVisible}
            transparent={true}
        >
            <View style={styles.centeredView}>
                <View style={[styles.modal, { gap: 10 }]}>
                    <Text style={{ fontSize: 20 }}>{props.title}</Text>
                    <TextInput
                        testID="ItemModal-item-name"
                        defaultValue={text}
                        style={styles.input}
                        onChangeText={onChangeText}
                        placeholder="Enter the name of your item"
                    ></TextInput>
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 20,
                        }}
                    >
                        <View style={{ width: 30 }}>
                            <Button
                                title="-"
                                onPress={() => setQuantity(quantity - 1)}
                                disabled={quantity <= 1}
                            />
                        </View>
                        <Text
                            testID="ItemModal-quantity"
                            style={{ fontSize: 20 }}
                        >
                            {quantity}
                        </Text>
                        <View style={{ width: 30 }}>
                            <Button
                                title="+"
                                onPress={() => setQuantity(quantity + 1)}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", gap: 10 }}>
                        <Button
                            title={props.negativeActionText}
                            onPress={props.negativeAction}
                        />
                        <Button
                            title={props.positiveActionText}
                            onPress={() => {
                                let item: Item = new Item(text, quantity);
                                props.positiveAction(props.index, item);
                            }}
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
