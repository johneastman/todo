import React, { useContext, useEffect, useReducer, useState } from "react";
import { TextInput } from "react-native";
import { Item, TOP, CURRENT, BOTTOM, List } from "../data/data";
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
import { STYLES } from "../utils";
import CustomDropdown from "./CustomDropdown";
import {
    UpdatePosition,
    UpdateQuantity,
    UpdateText,
    UpdateType,
    itemModalReducer,
} from "../data/reducers/itemModalReducer";

interface ItemModalProps {
    list: List;
    item?: Item;
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

    const [state, itemModalDispatch] = useReducer(itemModalReducer, {
        name: item?.name ?? "",
        quantity: item?.quantity ?? 1,
        isComplete: item?.isComplete ?? false,
        oldPosition: index,
        newPosition:
            item === undefined ? list.defaultNewItemPosition : "current",
        type: "Item",
    });

    const { name, quantity, newPosition, type } = state;

    const onChangeText = (text: string) =>
        itemModalDispatch(new UpdateText(text));

    const setQuantity = (newQuantity: number) =>
        itemModalDispatch(new UpdateQuantity(newQuantity));

    const setItemType = (newItemType: ItemType) =>
        itemModalDispatch(new UpdateType(newItemType));

    const setPosition = (newPosition: Position) =>
        itemModalDispatch(new UpdatePosition(newPosition));

    const submitAction = (): void => {
        const itemParams: ItemCRUD = {
            name: name,
            quantity: quantity,
            isComplete: item?.isComplete || false,
            oldPosition: index,
            newPosition: newPosition,
            type: type,
        };

        positiveAction(itemParams);
    };

    const submitAltAction = () => {
        // Perform positive action
        submitAction();

        // Perform alternate action
        altAction();
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
            positiveAction={submitAction}
            negativeActionText={negativeActionText}
            negativeAction={negativeAction}
            altActionText={altActionText}
            altAction={submitAltAction}
        >
            <TextInput
                testID="ItemModal-item-name"
                defaultValue={name}
                style={STYLES.input}
                onChangeText={onChangeText}
                placeholder="Enter the name of your item"
            />

            <CustomDropdown
                selectedValue={type}
                data={itemTypes}
                setSelectedValue={setItemType}
            />

            {listType === "Shopping" && type == "Item" && (
                <Quantity value={quantity} setValue={setQuantity} />
            )}

            <CustomRadioButtons
                title={item === undefined ? "Add to" : "Move to"}
                data={radioButtonsData}
                selectedValue={newPosition}
                setSelectedValue={setPosition}
            />
        </CustomModal>
    );
}
