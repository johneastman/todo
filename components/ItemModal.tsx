import React, { useContext, useEffect, useState } from "react";
import { TextInput } from "react-native";
import {
    Item,
    TOP,
    CURRENT,
    BOTTOM,
    List,
    TOP_SECTION,
    BOTTOM_SECTION,
} from "../data/data";
import CustomModal from "./CustomModal";
import Quantity from "./Quantity";
import CustomRadioButtons from "./CustomRadioButtons";
import Error from "./Error";
import { ItemCRUD, ItemType, Position, SelectionValue } from "../types";
import {
    STYLES,
    getTopSectionIndex,
    getBottomSectionIndex,
    getListItems,
} from "../utils";
import CustomDropdown from "./CustomDropdown";
import { AppContext } from "../contexts/app.context";
import {
    AddItem,
    UpdateItem,
    UpdateModalVisible,
} from "../data/reducers/app.reducer";

type ItemModalProps = {
    list: List;
};

export default function ItemModal(props: ItemModalProps): JSX.Element {
    const { list } = props;

    const { id, defaultNewItemPosition, listType } = list;

    const [text, onChangeText] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);
    const [position, setPosition] = useState<Position>("current");
    const [itemType, setItemType] = useState<ItemType>("Item");
    const [error, setError] = useState<string>();

    const {
        data: {
            lists,
            itemsState: {
                currentIndex,
                topIndex: topIndexState,
                isModalVisible,
            },
        },
        dispatch,
    } = useContext(AppContext);
    const items: Item[] = getListItems(lists, id);
    const item: Item | undefined = items[currentIndex];

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
        setItemType(item?.itemType ?? "Item");

        // If the "Add Item" button on a section is pressed, append "_section"
        // to the lists's default new item position.
        const newPosition: Position = `${defaultNewItemPosition}${
            topIndexState > 0 ? "_section" : ""
        }` as Position;
        setPosition(item === undefined ? newPosition : "current");
    }, [props]);

    // Reset the error if any values change
    useEffect(() => setError(undefined), [text, quantity, position, itemType]);

    const submitAction = (isAltAction: boolean): void => {
        const name: string = text.trim();

        if (name.length <= 0) {
            setError("Name must be provided");
            return;
        }

        let validPositions: [Position, number][];
        if (item === undefined) {
            const bottomIndex: number = getBottomSectionIndex(
                topIndexState + 1,
                items
            );

            // Adding an item
            validPositions = [
                ["top", 0],
                ["top_section", topIndexState + 1],
                ["current", currentIndex],
                ["bottom", items.length],
                ["bottom_section", bottomIndex],
            ];
        } else {
            // Editing an item
            const topIndex: number = getTopSectionIndex(currentIndex, items);
            const bottomIndex: number = getBottomSectionIndex(
                currentIndex,
                items
            );

            validPositions = [
                ["top", 0],
                ["top_section", topIndex === 0 ? 0 : topIndex + 1],
                ["current", currentIndex],
                ["bottom", items.length],
                [
                    "bottom_section",
                    bottomIndex === items.length - 1
                        ? items.length
                        : bottomIndex - 1,
                ],
            ];
        }

        const positionIndex = new Map<Position, number>(validPositions);
        const newPos: number = positionIndex.get(position)!;

        const newItem: Item = new Item(
            name,
            quantity,
            itemType,
            item?.isComplete ?? false,
            item?.isSelected ?? false
        );

        const itemParams: ItemCRUD = {
            oldPos: currentIndex,
            newPos: newPos,
            listId: id,
            item: newItem,
        };

        dispatch(
            currentIndex === -1
                ? new AddItem(itemParams, isAltAction)
                : new UpdateItem(itemParams, isAltAction)
        );
    };

    const closeModal = () => dispatch(new UpdateModalVisible("Item", false));

    const itemTypes: SelectionValue<ItemType>[] = [
        { label: "Item", value: "Item" },
        { label: "Section", value: "Section" },
    ];

    /**
     * If the user clicks "Add Item" in the navigation bar, display the "Top of List" and
     * "Bottom of List" options for where to add the new item. If the user clicks an "Add
     * Item" button on a section, display the "Top of Section" and "Bottom of Section"
     * options for where to add the new item.
     *
     * TODO: don't display "Top/Bottom of Section" when editing a section.
     */
    const radioButtonsData: SelectionValue<Position>[] =
        item === undefined
            ? topIndexState > 0
                ? [TOP_SECTION, BOTTOM_SECTION]
                : [TOP, BOTTOM]
            : [TOP, TOP_SECTION, CURRENT, BOTTOM_SECTION, BOTTOM];

    return (
        <CustomModal
            title={currentIndex === -1 ? "Add a New Item" : "Update Item"}
            isVisible={isModalVisible}
            positiveActionText={currentIndex === -1 ? "Add" : "Update"}
            positiveAction={() => submitAction(false)}
            negativeActionText="Cancel"
            negativeAction={closeModal}
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
                setSelectedValue={setItemType}
            />

            {listType === "Shopping" && itemType === "Item" ? (
                <Quantity value={quantity} setValue={setQuantity} />
            ) : null}

            <CustomRadioButtons
                title={currentIndex === -1 ? "Add to" : "Move to"}
                data={radioButtonsData}
                selectedValue={position}
                setSelectedValue={setPosition}
            />

            <Error error={error} />
        </CustomModal>
    );
}
