import React, { useEffect, useState } from "react";
import { TextInput, StyleSheet } from "react-native";
import { Item, TOP, CURRENT, BOTTOM, OTHER, List } from "../data/data";
import CustomModal from "./CustomModal";
import Quantity from "./Quantity";
import CustomRadioButtons from "./CustomRadioButtons";
import { ListTypeValues, Position, RadioButton } from "../types";
import { Dropdown } from "react-native-element-dropdown";
import { getLists } from "../data/utils";
import { STYLES } from "../utils";

interface ItemModalProps {
    item: Item | undefined;
    index: number;
    isVisible: boolean;
    title: string;
    listType: ListTypeValues;
    listId: string;

    positiveActionText: string;
    positiveAction: (
        oldPos: number,
        newPos: Position,
        listId: string,
        item: Item
    ) => void;

    negativeActionText: string;
    negativeAction: () => void;
}

export default function ItemModal(props: ItemModalProps): JSX.Element {
    const [text, onChangeText] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);
    const [position, setPosition] = useState<Position>("current");
    const [selectedListId, setSelectedListId] = useState<string>("");
    const [lists, setLists] = useState<List[]>([]);

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
        setPosition(props.item === undefined ? "bottom" : "current");
        setSelectedListId(props.listId);

        (async () => {
            let lists = (await getLists()).filter(
                (list) => list.id !== props.listId
            );
            setLists(lists);
        })();
    }, [props]);

    const positiveAction = (): void => {
        props.positiveAction(
            props.index,
            position,
            selectedListId,
            new Item(text, quantity, props.item?.isComplete || false)
        );
    };

    let radioButtonsData: RadioButton[] =
        props.item === undefined
            ? [TOP, BOTTOM]
            : [TOP, CURRENT, BOTTOM].concat(lists.length > 0 ? [OTHER] : []); // Only display the "other" option if there are other lists to move items to.

    return (
        <CustomModal
            title={props.title}
            isVisible={props.isVisible}
            positiveActionText={props.positiveActionText}
            positiveAction={positiveAction}
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

            {props.listType === "Shopping" ? (
                <Quantity value={quantity} setValue={setQuantity} />
            ) : null}

            <CustomRadioButtons
                title={
                    props.item === undefined ? "Add item to" : "Move item to"
                }
                data={radioButtonsData}
                position={position}
                setPosition={setPosition}
            />
            {position === "other" && lists.length > 0 ? (
                /**
                 * Only display dropdown menu if:
                 *   1. There are other lists to move the item to
                 *   2. The user has selected the "other" radio button
                 */
                <Dropdown
                    data={lists}
                    labelField={"name"}
                    valueField={"id"}
                    onChange={(item: List): void => setSelectedListId(item.id)}
                    style={STYLES.dropdown}
                />
            ) : null}
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
