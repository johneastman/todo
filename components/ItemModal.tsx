import React, { useReducer } from "react";
import { TextInput } from "react-native";
import { Item, TOP, CURRENT, BOTTOM, List, Section } from "../data/data";
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
    UpdateSectionIndex,
    UpdateText,
    UpdateType,
    itemModalReducer,
} from "../data/reducers/itemModalReducer";

interface ItemModalProps {
    list: List;
    sections: Section[];
    item?: Item;
    itemIndex: number;
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
        sections,
        item,
        itemIndex,
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
        oldPosition: itemIndex,
        newPosition:
            item === undefined ? list.defaultNewItemPosition : "current",
        type: "Item",
        sectionIndex: sections.findIndex((section) => section.isPrimary),
    });

    const {
        name,
        quantity,
        newPosition,
        type,
        sectionIndex: selectedSectionIndex,
    } = state;

    const onChangeText = (text: string) =>
        itemModalDispatch(new UpdateText(text));

    const setQuantity = (newQuantity: number) =>
        itemModalDispatch(new UpdateQuantity(newQuantity));

    const setItemType = (newItemType: ItemType) =>
        itemModalDispatch(new UpdateType(newItemType));

    const setPosition = (newPosition: Position) =>
        itemModalDispatch(new UpdatePosition(newPosition));

    const setSectionIndex = (newIndex: number) =>
        itemModalDispatch(new UpdateSectionIndex(newIndex));

    const submitAction = (): void => {
        const itemParams: ItemCRUD = {
            name: name,
            quantity: quantity,
            isComplete: item?.isComplete || false,
            oldPosition: itemIndex,
            newPosition: newPosition,
            type: type,
            sectionIndex: selectedSectionIndex,
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

    const sectionIndices: SelectionValue<number>[] = sections.map(
        (section, index) => {
            return { label: section.name, value: index };
        }
    );

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

            {type === "Item" && (
                // Only display the section dropdown when adding or updating an item.
                <CustomDropdown
                    selectedValue={selectedSectionIndex}
                    data={sectionIndices}
                    setSelectedValue={setSectionIndex}
                />
            )}

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
