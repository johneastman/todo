import React, { useContext, useEffect, useReducer } from "react";
import { Item, TOP, CURRENT, BOTTOM, List } from "../data/data";
import CustomModal from "./core/CustomModal";
import Quantity from "./Quantity";
import CustomRadioButtons from "./core/CustomRadioButtons";
import { ItemParams, ModalButton, Position, SelectionValue } from "../types";
import { getListItems, getCellModalVisibleAndNextIndex } from "../utils";
import { ListsContext } from "../contexts/lists.context";
import { AddItem, UpdateItem } from "../data/reducers/lists.reducer";
import {
    ItemModalState,
    UpdateName,
    UpdatePosition,
    UpdateQuantity,
    itemModalReducer,
} from "../data/reducers/itemModal.reducer";
import { UpdateError, Replace, UpdateIsLocked } from "../data/reducers/common";
import CustomSwitch from "./core/CustomSwitch";
import CustomInput from "./core/CustomInput";
import { ItemsStateContext } from "../contexts/itemsState.context";
import { AddUpdateModalVisible } from "../data/reducers/itemsState.reducer";

function getState(
    item: Item | undefined,
    defaultNewItemPosition: Position
): ItemModalState {
    return {
        name: item?.name ?? "",
        quantity: item?.quantity ?? 1,
        position: item === undefined ? defaultNewItemPosition : "current",
        isLocked: item?.isLocked ?? false,
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
        data: { lists },
        listsDispatch: dispatch,
    } = useContext(ListsContext);

    const {
        itemsState: { currentIndex, isModalVisible },
        itemsStateDispatch,
    } = useContext(ItemsStateContext);

    const items: Item[] = getListItems(lists, listIndex);
    const currentItem: Item | undefined = items[currentIndex];

    const [itemModalState, itemModalDispatch] = useReducer(
        itemModalReducer,
        getState(currentItem, defaultNewItemPosition)
    );
    const { name, quantity, position, error, isLocked } = itemModalState;

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

    const setIsLocked = (isLocked: boolean) =>
        itemModalDispatch(new UpdateIsLocked(isLocked));

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
            isLocked
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

        const [isModalVisible, nextIndex] = getCellModalVisibleAndNextIndex(
            currentIndex,
            items.length,
            isAddingItem(),
            isAltAction
        );

        itemsStateDispatch(
            new AddUpdateModalVisible(isModalVisible, nextIndex)
        );
    };

    const closeModal = () =>
        itemsStateDispatch(new AddUpdateModalVisible(false));

    const radioButtonsData: SelectionValue<Position>[] = isAddingItem()
        ? [TOP, BOTTOM]
        : [TOP, CURRENT, BOTTOM];

    const positiveAction: ModalButton = {
        text: isAddingItem() ? "Add" : "Update",
        onPress: () => submitAction(false),
    };

    const negativeAction: ModalButton = {
        text: "Cancel",
        onPress: closeModal,
    };

    const altAction: ModalButton = {
        text: "Next",
        onPress: () => submitAction(true),
    };

    return (
        <CustomModal
            title={isAddingItem() ? "Add a New Item" : "Update Item"}
            isVisible={isModalVisible}
            positiveAction={positiveAction}
            negativeAction={negativeAction}
            altAction={altAction}
            error={error}
        >
            <CustomInput
                testID="ItemModal-item-name"
                value={name}
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
                isSelected={isLocked}
                setIsSelected={setIsLocked}
                testId="ignore-select-all"
            />
        </CustomModal>
    );
}
