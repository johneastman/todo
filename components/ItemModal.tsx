import React, { useEffect, useState } from "react";
import { TextInput } from "react-native";
import { Item, TOP, CURRENT, BOTTOM, List } from "../data/data";
import CustomModal from "./CustomModal";
import Quantity from "./Quantity";
import CustomRadioButtons from "./CustomRadioButtons";
import {
    ItemCRUD,
    ItemType,
    ListType,
    Position,
    SelectionValue,
} from "../types";
import { STYLES } from "../utils";
import CustomDropdown from "./CustomDropdown";

type ItemModalProps = {
    list: List;
    numLists: number;
    item: Item | undefined;
    index: number;
    isVisible: boolean;
    title: string;
    listType: ListType;

    positiveActionText: string;
    positiveAction: (params: ItemCRUD, isAltAction: boolean) => void;

    negativeActionText: string;
    negativeAction: () => void;
};

export default function ItemModal(props: ItemModalProps): JSX.Element {
    const {
        list,
        numLists,
        item,
        index,
        isVisible,
        title,
        listType,
        positiveActionText,
        positiveAction,
        negativeActionText,
        negativeAction,
    } = props;

    const [text, onChangeText] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);
    const [position, setPosition] = useState<Position>("current");
    const [selectedList, setSelectedList] = useState<List>(list);
    const [itemType, setItemType] = useState<ItemType>("Item");

    /* Every time the add/edit item modal opens, the values for the item's attributes need to be reset based on what
     * was passed in the props. This is necessary because the state will not change every time the modal opens and
     * closes.
     *
     * If the item passed to this modal is "undefined", we know a new item is being added, so the values should be
     * reset. However, if a non-"undefined" item is passed to this modal, the item is being edited, so those values
     * need to be updated to reflect the values in the item.
     */
    useEffect(() => {
        onChangeText(item?.name ?? "");
        setQuantity(item?.quantity ?? 1);
        setPosition(
            item === undefined ? list.defaultNewItemPosition : "current"
        );
        setSelectedList(list);
        setItemType(item?.itemType ?? "Item");
    }, [props]);

    const submitAction = (isAltAction: boolean): void => {
        if (selectedList !== undefined) {
            const itemParams: ItemCRUD = {
                oldPos: index,
                newPos: position,
                listId: selectedList?.id,
                item: new Item(
                    text.trim(),
                    quantity,
                    itemType,
                    item?.isComplete ?? false,
                    item?.isSelected ?? false
                ),
            };

            positiveAction(itemParams, isAltAction);
        }
    };

    const itemTypes: SelectionValue<ItemType>[] = [
        { label: "Item", value: "Item" },
        { label: "Section", value: "Section" },
    ];

    const radioButtonsData: SelectionValue<Position>[] =
        item === undefined ? [TOP, BOTTOM] : [TOP, CURRENT, BOTTOM];

    return (
        <CustomModal
            title={title}
            isVisible={isVisible}
            positiveActionText={positiveActionText}
            positiveAction={() => submitAction(false)}
            negativeActionText={negativeActionText}
            negativeAction={negativeAction}
            altActionText="Next"
            altAction={() => submitAction(true)}
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
        </CustomModal>
    );
}
