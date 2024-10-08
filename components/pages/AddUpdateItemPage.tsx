import { useContext, useEffect, useReducer } from "react";
import { View } from "react-native";
import {
    AddUpdateItemPageNavigationProps,
    ItemParams,
    Position,
    SelectionValue,
} from "../../types";
import CustomInput from "../core/CustomInput";
import { BOTTOM, CURRENT, Item, ItemFlags, TOP } from "../../data/data";
import {
    getCellModalVisibleAndNextIndex,
    getList,
    navigationTitleOptions,
} from "../../utils";
import {
    addUpdateItemReducer,
    AddUpdateItemState,
    UpdateName,
    UpdatePosition,
    UpdateQuantity,
    UpdateNotes,
} from "../../data/reducers/addUpdateItem.reducer";
import { ListsContext } from "../../contexts/lists.context";
import CustomSwitch from "../core/CustomSwitch";
import Quantity from "../Quantity";
import CustomRadioButtons from "../core/CustomRadioButtons";
import {
    Replace,
    UpdateError,
    UpdateIsLocked,
} from "../../data/reducers/common";
import PageContainer from "../PageContainer";
import { AddItem, UpdateItem } from "../../data/reducers/lists.reducer";
import CustomButton from "../core/CustomButton";
import CustomError from "../core/CustomError";
import AddUpdateContainer from "../AddUpdateContainer";

function getState(
    currentIndex: number,
    item: Item | undefined,
    defaultNewItemPosition: Position
): AddUpdateItemState {
    return {
        name: item?.name ?? "",
        notes: item?.notes ?? "",
        quantity: item?.quantity ?? 1,
        position: item === undefined ? defaultNewItemPosition : "current",
        isLocked: item?.isLocked ?? false,
        currentIndex: currentIndex,
    };
}

export default function AddUpdateItemPage({
    route,
    navigation,
}: AddUpdateItemPageNavigationProps): JSX.Element {
    const { listIndex, itemIndex, currentItem } = route.params;

    const {
        data: { lists },
        listsDispatch,
    } = useContext(ListsContext);

    const {
        defaultNewItemPosition,
        listType,
        items: listItems,
    } = getList(lists, listIndex);

    const [addUpdateItemState, addUpdateItemDispatch] = useReducer(
        addUpdateItemReducer,
        getState(itemIndex, currentItem, defaultNewItemPosition)
    );
    const { name, notes, quantity, position, error, isLocked, currentIndex } =
        addUpdateItemState;

    const isAddingItem = (): boolean => currentItem === undefined;

    const radioButtonsData: SelectionValue<Position>[] = isAddingItem()
        ? [TOP, BOTTOM]
        : [TOP, CURRENT, BOTTOM];

    useEffect(() => {
        navigation.setOptions({
            ...navigationTitleOptions(
                isAddingItem() ? "Add Item" : "Edit Item"
            ),
            headerRight: () => (
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <CustomButton
                        text="Next"
                        onPress={() => submitAction(true)}
                        testId="add-update-item-next"
                    />

                    <CustomButton
                        text={isAddingItem() ? "Create" : "Update"}
                        onPress={() => submitAction(false)}
                        testId={
                            isAddingItem()
                                ? "add-update-item-create"
                                : "add-update-item-update"
                        }
                    />
                </View>
            ),
        });
    }, [addUpdateItemState]);

    const submitAction = (isAltAction: boolean): void => {
        if (name.trim().length <= 0) {
            addUpdateItemDispatch(new UpdateError("Name must be provided"));
            return;
        }

        const positionIndex = new Map<Position, number>([
            ["top", 0],
            ["current", currentIndex],
            ["bottom", listItems.length - (isAddingItem() ? 0 : 1)],
        ]);

        // "Position" object only contains "top", "current", and "bottom", so the
        // exclamation point can be used after "get".
        const newPos: number = positionIndex.get(position)!;

        const flags: ItemFlags = {
            isComplete: currentItem?.isComplete ?? false,
            isSelected: false,
            isLocked: isLocked,
        };

        const newItem: Item = new Item(name, notes, quantity, flags);

        const itemParams: ItemParams = {
            oldPos: currentIndex,
            newPos: newPos,
            listIndex: listIndex,
            item: newItem,
        };

        listsDispatch(
            isAddingItem()
                ? new AddItem(itemParams)
                : new UpdateItem(itemParams)
        );

        /**
         * If the user is editing an item and presses the alternate action, move
         * to the next item in the list. If the user is editing the last item and
         * invokes the alternate action, navigate back to the items view.
         */
        const [isModalVisible, nextIndex] = getCellModalVisibleAndNextIndex(
            currentIndex,
            listItems.length,
            isAddingItem(),
            isAltAction
        );

        if (isModalVisible) {
            const newState: AddUpdateItemState = getState(
                nextIndex,
                listItems[nextIndex],
                defaultNewItemPosition
            );
            addUpdateItemDispatch(new Replace(newState));
        } else {
            navigation.navigate("Items", { listIndex: listIndex });
        }
    };

    const setName = (newName: string) =>
        addUpdateItemDispatch(new UpdateName(newName));

    const setNotes = (newNotes: string) =>
        addUpdateItemDispatch(new UpdateNotes(newNotes));

    const setQuantity = (newQuantity: number) =>
        addUpdateItemDispatch(new UpdateQuantity(newQuantity));

    const setPosition = (newPosition: Position) =>
        addUpdateItemDispatch(new UpdatePosition(newPosition));

    const setIsLocked = (isLocked: boolean) =>
        addUpdateItemDispatch(new UpdateIsLocked(isLocked));

    return (
        <AddUpdateContainer>
            <CustomInput
                testID="add-update-item-name"
                value={name}
                onChangeText={setName}
                placeholder="Enter the name of your item"
                autoFocus={isAddingItem()}
            />

            <CustomInput
                testID="add-update-item-notes"
                placeholder="Enter notes about your item (optional)"
                value={notes}
                onChangeText={setNotes}
                style={{ height: 120, textAlignVertical: "top" }}
                multiline={true}
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
                label="Lock"
                isSelected={isLocked}
                setIsSelected={setIsLocked}
                testId="ignore-select-all"
            />

            <CustomError error={error} />
        </AddUpdateContainer>
    );
}
