import React, { useContext, useEffect, useState } from "react";
import { TextInput } from "react-native";
import { Item, TOP, CURRENT, BOTTOM, OTHER, List } from "../data/data";
import CustomModal from "./CustomModal";
import Quantity from "./Quantity";
import CustomRadioButtons from "./CustomRadioButtons";
import {
    ItemCRUD,
    ItemType,
    ListTypeValue,
    Position,
    SelectionValue,
} from "../types";
import { getNumLists } from "../data/utils";
import { STYLES } from "../utils";
import SelectListsDropdown from "./SelectList";
import CustomDropdown from "./CustomDropdown";

interface ItemModalProps {
    list: List;
    item: Item | undefined;
    index: number;
    isVisible: boolean;
    title: string;
    listType: ListTypeValue;

    positiveActionText: string;
    positiveAction: (params: ItemCRUD) => void;

    negativeActionText: string;
    negativeAction: () => void;

    altActionText: string;
    altAction: () => void;
}

export default function ItemModal(props: ItemModalProps): JSX.Element {
    const {
        list,
        item,
        index,
        isVisible,
        title,
        listType,
        positiveActionText,
        positiveAction,
        negativeActionText,
        negativeAction,
        altActionText,
        altAction,
    } = props;

    const [text, onChangeText] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);
    const [position, setPosition] = useState<Position>("current");
    const [selectedList, setSelectedList] = useState<List | undefined>();
    const [itemType, setItemType] = useState<ItemType>("Item");

    const [numLists, setNumLists] = useState<number>(0);

    /* Every time the add/edit item modal opens, the values for the item's attributes need to be reset based on what
     * was passed in the props. This is necessary because the state will not change every time the modal opens and
     * closes.
     *
     * If the item passed to this modal is "undefined", we know a new item is being added, so the values should be
     * reset. However, if a non-"undefined" item is passed to this modal, the item is being edited, so those values
     * need to be updated to reflect the values in the item.
     */
    useEffect(() => {
        onChangeText(item?.name || "");
        setQuantity(item?.quantity || 1);
        setPosition(
            item === undefined ? list.defaultNewItemPosition : "current"
        );
        setSelectedList(list);
        setItemType(item?.itemType ?? "Item");

        (async () => {
            let numLists = await getNumLists();
            setNumLists(numLists);
        })();
    }, [props]);

    const submitAction = (): void => {
        if (selectedList !== undefined) {
            const itemParams: ItemCRUD = {
                oldPos: index,
                newPos: position,
                listId: selectedList?.id,
                item: new Item(
                    text.trim(),
                    quantity,
                    itemType,
                    item?.isComplete || false
                ),
            };

            positiveAction(itemParams);
        }
    };

    const itemTypes: SelectionValue<ItemType>[] = [
        { label: "Item", value: "Item" },
        { label: "Section", value: "Section" },
    ];

    const radioButtonsData: SelectionValue<Position>[] =
        item === undefined
            ? [TOP, BOTTOM]
            : [TOP, CURRENT, BOTTOM].concat(numLists > 0 ? [OTHER] : []); // Only display the "other" option if there are other lists to move items to.

    return (
        <CustomModal
            title={title}
            isVisible={isVisible}
            positiveActionText={positiveActionText}
            positiveAction={submitAction}
            negativeActionText={negativeActionText}
            negativeAction={negativeAction}
            altActionText={altActionText}
            altAction={() => {
                // Perform positive action
                submitAction();

                // Perform alternate action
                altAction();
            }}
        >
            <TextInput
                testID="ItemModal-item-name"
                defaultValue={text}
                style={STYLES.input}
                onChangeText={onChangeText}
                placeholder="Enter the name of your item"
            />

            <CustomDropdown
                selectedValue={itemType}
                data={itemTypes}
                setSelectedValue={(newItemType: ItemType) =>
                    setItemType(newItemType)
                }
            />

            {listType === "Shopping" && itemType === "Item" ? (
                <Quantity value={quantity} setValue={setQuantity} />
            ) : null}

            <CustomRadioButtons
                title={item === undefined ? "Add to" : "Move to"}
                data={radioButtonsData}
                selectedValue={position}
                setSelectedValue={(newValue: Position) => setPosition(newValue)}
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
