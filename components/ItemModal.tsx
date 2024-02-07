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

type ItemModalProps = {
    list: List;
    currentItemIndex: number;
    isVisible: boolean;
    title: string;

    positiveActionText: string;
    positiveAction: (params: ItemCRUD, isAltAction: boolean) => void;

    negativeActionText: string;
    negativeAction: () => void;
};

export default function ItemModal(props: ItemModalProps): JSX.Element {
    const {
        list,
        currentItemIndex,
        isVisible,
        title,
        positiveActionText,
        positiveAction,
        negativeActionText,
        negativeAction,
    } = props;

    const { id, defaultNewItemPosition, listType } = list;

    const [text, onChangeText] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);
    const [position, setPosition] = useState<Position>("current");
    const [itemType, setItemType] = useState<ItemType>("Item");
    const [error, setError] = useState<string>();

    const {
        data: {
            lists,
            itemsState: { topIndex },
        },
    } = useContext(AppContext);
    const items: Item[] = getListItems(lists, id);
    const item: Item | undefined = items[currentItemIndex];

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
            ["current", currentItemIndex],
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
            oldPos: currentItemIndex,
            newPos: newPos,
            listId: id,
            item: newItem,
        };

        positiveAction(itemParams, isAltAction);
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

            <Error error={error} />
        </CustomModal>
    );
}
