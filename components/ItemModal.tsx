import React, { useContext, useEffect, useState } from "react";
import { TextInput } from "react-native";
import { Item, TOP, CURRENT, BOTTOM, List } from "../data/data";
import CustomModal from "./CustomModal";
import Quantity from "./Quantity";
import CustomRadioButtons from "./CustomRadioButtons";
import Error from "./Error";
import { ItemCRUD, ItemType, Position, SelectionValue } from "../types";
import { STYLES, getBottomIndex, getListItems } from "../utils";
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
            itemsState: { currentIndex, topIndex, isModalVisible },
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
        setPosition(item === undefined ? defaultNewItemPosition : "current");
        setItemType(item?.itemType ?? "Item");
    }, [props]);

    // Reset the error if any values change
    useEffect(() => setError(undefined), [text, quantity, position, itemType]);

    const submitAction = (isAltAction: boolean): void => {
        const name: string = text.trim();

        if (name.length <= 0) {
            setError("Name must be provided");
            return;
        }

        const bottomIndex: number = getBottomIndex(topIndex, items);

        const positionIndex = new Map<Position, number>([
            ["top", topIndex],
            ["current", currentIndex],
            ["bottom", bottomIndex],
        ]);
        // "Position" object only contains "top", "current", and "bottom", so the
        // exclamation point can be used after "get".
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

    const radioButtonsData: SelectionValue<Position>[] =
        item === undefined ? [TOP, BOTTOM] : [TOP, CURRENT, BOTTOM];

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
