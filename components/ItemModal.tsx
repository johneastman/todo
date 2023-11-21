import React, { useContext, useEffect, useState } from "react";
import { TextInput, StyleSheet } from "react-native";
import { Item, TOP, CURRENT, BOTTOM, OTHER, List } from "../data/data";
import CustomModal from "./CustomModal";
import Quantity from "./Quantity";
import CustomRadioButtons from "./CustomRadioButtons";
import { ListContext, ListTypeValue, Position, SelectionValue } from "../types";
import { getNumLists } from "../data/utils";
import { STYLES } from "../utils";
import SelectListsDropdown from "./SelectList";

interface ItemModalProps {
    item: Item | undefined;
    index: number;
    isVisible: boolean;
    title: string;
    listType: ListTypeValue;

    positiveActionText: string;
    positiveAction: (
        oldPos: number,
        newPos: Position,
        listId: string,
        item: Item
    ) => void;

    negativeActionText: string;
    negativeAction: () => void;

    altActionText: string;
    altAction: () => void;
}

export default function ItemModal(props: ItemModalProps): JSX.Element {
    const [text, onChangeText] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);
    const [position, setPosition] = useState<Position>("current");
    const [selectedList, setSelectedList] = useState<List | undefined>();
    const [numLists, setNumLists] = useState<number>(0);

    const list: List = useContext(ListContext);

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
        setPosition(
            props.item === undefined ? list.defaultNewItemPosition : "current"
        );
        setSelectedList(list);

        (async () => {
            let numLists = await getNumLists();
            setNumLists(numLists);
        })();
    }, [props]);

    const submitAction = (): void => {
        if (selectedList !== undefined) {
            props.positiveAction(
                props.index,
                position,
                selectedList?.id,
                new Item(text.trim(), quantity, props.item?.isComplete || false)
            );
        }
    };

    let radioButtonsData: SelectionValue<Position>[] =
        props.item === undefined
            ? [TOP, BOTTOM]
            : [TOP, CURRENT, BOTTOM].concat(numLists > 0 ? [OTHER] : []); // Only display the "other" option if there are other lists to move items to.

    return (
        <CustomModal
            title={props.title}
            isVisible={props.isVisible}
            positiveActionText={props.positiveActionText}
            positiveAction={submitAction}
            negativeActionText={props.negativeActionText}
            negativeAction={props.negativeAction}
            altActionText={props.altActionText}
            altAction={() => {
                // Perform positive action
                submitAction();

                // Perform alternate action
                props.altAction();
            }}
        >
            <TextInput
                testID="ItemModal-item-name"
                defaultValue={text}
                style={STYLES.input}
                onChangeText={onChangeText}
                placeholder="Enter the name of your item"
            ></TextInput>

            {props.listType === "Shopping" ? (
                <Quantity value={quantity} setValue={setQuantity} />
            ) : null}

            <CustomRadioButtons
                title={props.item === undefined ? "Add to" : "Move to"}
                data={radioButtonsData}
                selectedValue={position}
                setSelectedValue={(newValue: SelectionValue<Position>) =>
                    setPosition(newValue.value)
                }
            />

            {position === "other" && numLists > 0 ? (
                /**
                 * Only display dropdown menu if:
                 *   1. There are other lists to move the item to
                 *   2. The user has selected the "other" radio button
                 */
                <SelectListsDropdown
                    currentList={list}
                    selectedList={selectedList}
                    setSelectedList={setSelectedList}
                />
            ) : null}
        </CustomModal>
    );
}
