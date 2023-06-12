import React, { useEffect, useState } from "react";
import { Button, Text, View, TextInput, StyleSheet } from "react-native";
import { Item } from "../data/Item";
import CustomModal from "./CustomModal";
import Quantity from "./Quantity";

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
        <CustomModal
            title={props.title}
            isVisible={props.isVisible}
            positiveActionText={props.positiveActionText}
            positiveAction={() =>
                props.positiveAction(props.index, new Item(text, quantity))
            }
            negativeActionText={props.negativeActionText}
            negativeAction={props.negativeAction}
        >
            <TextInput
                testID="ItemModal-item-name"
                defaultValue={text}
                style={styles.input}
                onChangeText={onChangeText}
                placeholder="Enter the name of your item"
            ></TextInput>

            <Quantity value={quantity} setValue={setQuantity} />
        </CustomModal>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        width: "100%",
    },
});
