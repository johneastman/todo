import React, { useContext, useEffect, useReducer } from "react";
import { TextInput } from "react-native";
import { Item, TOP, CURRENT, BOTTOM, List } from "../data/data";
import CustomModal from "./CustomModal";
import Quantity from "./Quantity";
import CustomRadioButtons from "./CustomRadioButtons";
import { ItemParams, Position, SelectionValue } from "../types";
import { STYLES, getListItems } from "../utils";
import { AppContext } from "../contexts/app.context";
import {
    AddItem,
    UpdateItem,
    UpdateModalVisible,
} from "../data/reducers/app.reducer";
import {
    ItemModalState,
    UpdateName,
    UpdatePosition,
    UpdateQuantity,
    itemModalReducer,
} from "../data/reducers/itemModal.reducer";
import { UpdateError, Replace, UpdateSelectAll } from "../data/reducers/common";
import CustomSwitch from "./CustomSwitch";

function getState(
    item: Item | undefined,
    defaultNewItemPosition: Position
): ItemModalState {
    return {
        name: item?.name ?? "",
        quantity: item?.quantity ?? 1,
        position: item === undefined ? defaultNewItemPosition : "current",
        ignoreSelectAll: item?.ignoreSelectAll ?? false,
    };
}

type ItemModalProps = {
    list: List;
    listIndex: number;
};

export default function ItemModal(props: ItemModalProps): JSX.Element {
    const { list, listIndex } = props;

    const { defaultNewItemPosition, listType } = list;

    const {
        data: {
            lists,
            itemsState: { currentIndex, isModalVisible },
        },
        dispatch,
    } = useContext(AppContext);
    const items: Item[] = getListItems(lists, listIndex);
    const currentItem: Item | undefined = items[currentIndex];

    const [itemModalState, itemModalDispatch] = useReducer(
        itemModalReducer,
        getState(currentItem, defaultNewItemPosition)
    );
    const { name, quantity, position, error, ignoreSelectAll } = itemModalState;

    /* Every time the add/edit item modal opens, the values for the item's attributes need to be reset based on what
     * was passed in the props. This is necessary because the state will not change every time the modal opens and
     * closes.
     *
     * If the item passed to this modal is "undefined", we know a new item is being added, so the values should be
     * reset. However, if a non-"undefined" item is passed to this modal, the item is being edited, so those values
     * need to be updated to reflect the values in the item.
     */
    useEffect(() => {
        const newState: ItemModalState = getState(
            currentItem,
            defaultNewItemPosition
        );
        itemModalDispatch(new Replace(newState));
    }, [props]);

    const isAddingItem = (): boolean => currentItem === undefined;

    const setQuantity = (newQuantity: number) =>
        itemModalDispatch(new UpdateQuantity(newQuantity));

    const setPosition = (newPosition: Position) =>
        itemModalDispatch(new UpdatePosition(newPosition));

    const setName = (newName: string) =>
        itemModalDispatch(new UpdateName(newName));

    const setIgnoreSelectAll = (newIgnoreSelectAll: boolean) =>
        itemModalDispatch(new UpdateSelectAll(newIgnoreSelectAll));

    const submitAction = (isAltAction: boolean): void => {
        if (name.trim().length <= 0) {
            itemModalDispatch(new UpdateError("Name must be provided"));
            return;
        }

        const positionIndex = new Map<Position, number>([
            ["top", 0],
            ["current", currentIndex],
            ["bottom", items.length],
        ]);

        // "Position" object only contains "top", "current", and "bottom", so the
        // exclamation point can be used after "get".
        const newPos: number = positionIndex.get(position)!;

        const newItem: Item = new Item(
            name,
            quantity,
            currentItem?.isComplete ?? false,
            false,
            ignoreSelectAll
        );

        const itemParams: ItemParams = {
            oldPos: currentIndex,
            newPos: newPos,
            listIndex: listIndex,
            item: newItem,
        };

        dispatch(
            isAddingItem()
                ? new AddItem(itemParams, isAltAction)
                : new UpdateItem(itemParams, isAltAction)
        );
    };

    const closeModal = () => dispatch(new UpdateModalVisible("Item", false));

    const radioButtonsData: SelectionValue<Position>[] = isAddingItem()
        ? [TOP, BOTTOM]
        : [TOP, CURRENT, BOTTOM];

    return (
        <CustomModal
            title={isAddingItem() ? "Add a New Item" : "Update Item"}
            isVisible={isModalVisible}
            positiveActionText={isAddingItem() ? "Add" : "Update"}
            positiveAction={() => submitAction(false)}
            negativeActionText="Cancel"
            negativeAction={closeModal}
            altActionText="Next"
            altAction={() => submitAction(true)}
            error={error}
        >
            <TextInput
                testID="ItemModal-item-name"
                defaultValue={name}
                style={STYLES.input}
                onChangeText={setName}
                placeholder="Enter the name of your item"
                autoFocus={isAddingItem()}
            />

            {listType === "Shopping" && (
                <Quantity value={quantity} setValue={setQuantity} />
            )}

            <CustomRadioButtons
                title={isAddingItem() ? "Add to" : "Move to"}
                data={radioButtonsData}
                selectedValue={position}
                setSelectedValue={setPosition}
            />

            <CustomSwitch
                isSelected={ignoreSelectAll}
                setIsSelected={setIgnoreSelectAll}
                testId="ignore-select-all"
            />
        </CustomModal>
    );
}
