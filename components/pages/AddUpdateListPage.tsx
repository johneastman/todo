import { useContext, useEffect, useReducer } from "react";
import { BOTTOM, CURRENT, List, listTypes, TOP } from "../../data/data";
import {
    addUpdateListReducer,
    AddUpdateListState,
    UpdateDefaultNewItemPosition,
    UpdateListType,
    UpdateName,
    UpdatePosition,
} from "../../data/reducers/addUpdateList.reducer";
import {
    AddUpdateListPageNavigationProps,
    ListParams,
    ListType,
    ModalButton,
    Position,
    SelectionValue,
} from "../../types";
import { ListsStateContext } from "../../contexts/listsState.context";
import { ListsContext } from "../../contexts/lists.context";
import { SettingsContext } from "../../contexts/settings.context";
import { Replace, UpdateError } from "../../data/reducers/common";
import { AddList, UpdateList } from "../../data/reducers/lists.reducer";
import {
    getCellModalVisibleAndNextIndex,
    navigationTitleOptions,
} from "../../utils";
import CustomModal from "../core/CustomModal";
import CustomInput from "../core/CustomInput";
import CustomDropdown from "../core/CustomDropdown";
import CustomRadioButtons from "../core/CustomRadioButtons";
import PageContainer from "../PageContainer";
import { View } from "react-native";
import CustomButton from "../core/CustomButton";
import { AddUpdateItemState } from "../../data/reducers/addUpdateItem.reducer";
import CustomError from "../core/CustomError";
import AddUpdateContainer from "../AddUpdateContainer";

function getState(
    currentIndex: number,
    list: List | undefined,
    defaultListPosition: Position,
    defaultListType: ListType
): AddUpdateListState {
    return {
        currentIndex: currentIndex,
        name: list?.name ?? "",
        position: list === undefined ? defaultListPosition : CURRENT.value,
        listType: list?.listType ?? defaultListType,
        defaultNewItemPosition: list?.defaultNewItemPosition ?? BOTTOM.value,
    };
}

export default function AddUpdateListPage({
    route,
    navigation,
}: AddUpdateListPageNavigationProps): JSX.Element {
    const { listIndex, currentList, visibleFrom } = route.params;

    const listsContextData = useContext(ListsContext);
    const {
        data: { lists },
        listsDispatch: dispatch,
    } = listsContextData;

    const settingsContext = useContext(SettingsContext);
    const {
        settings: { defaultListType, defaultListPosition },
    } = settingsContext;

    const [addUpdateListState, addUpdateListDispatch] = useReducer(
        addUpdateListReducer,
        getState(listIndex, currentList, defaultListPosition, defaultListType)
    );

    const {
        name,
        position,
        listType,
        defaultNewItemPosition,
        error,
        currentIndex,
    } = addUpdateListState;

    /* Every time the add/edit item modal opens, the values for the item's attributes need to be reset based on what
     * was passed in the props. This is necessary because the state will not change every time the modal opens and
     * closes.
     *
     * If the item passed to this modal is "undefined", we know a new item is being added, so the values should be
     * reset. However, if a non-"undefined" item is passed to this modal, the item is being edited, so those values
     * need to be updated to reflect the values in the item.
     */
    useEffect(() => {
        navigation.setOptions({
            ...navigationTitleOptions(
                isAddingList() ? "Add List" : "Edit List"
            ),
            headerRight: () => (
                <View style={{ flexDirection: "row", gap: 10 }}>
                    {visibleFrom === "List" && (
                        <CustomButton
                            text="Next"
                            onPress={() => submitAction(true)}
                            testId="add-update-list-next"
                        />
                    )}

                    <CustomButton
                        text={isAddingList() ? "Create" : "Update"}
                        onPress={() => submitAction(false)}
                        testId={
                            isAddingList()
                                ? "add-update-list-create"
                                : "add-update-list-update"
                        }
                    />
                </View>
            ),
        });
    }, [addUpdateListState]);

    const isAddingList = (): boolean => currentList === undefined;

    const setName = (newName: string) =>
        addUpdateListDispatch(new UpdateName(newName));

    const setPosition = (newPosition: Position) =>
        addUpdateListDispatch(new UpdatePosition(newPosition));

    const setError = (newError?: string) =>
        addUpdateListDispatch(new UpdateError(newError));

    const setListType = (newListType: ListType) =>
        addUpdateListDispatch(new UpdateListType(newListType));

    const setDefaultNewItemPosition = (newDefaultNewItemPosition: Position) =>
        addUpdateListDispatch(
            new UpdateDefaultNewItemPosition(newDefaultNewItemPosition)
        );

    const submitAction = (isAltAction: boolean) => {
        if (name.trim().length <= 0) {
            setError("Name must be provided");
            return;
        }

        const positionIndex = new Map<Position, number>([
            ["top", 0],
            ["current", currentIndex],
            ["bottom", lists.length],
        ]);

        // "Position" object only contains "top", "current", and "bottom", so the
        // exclamation point can be used after "get".
        const newPos: number = positionIndex.get(position)!;

        const newList: List = new List(
            name,
            listType,
            defaultNewItemPosition ?? BOTTOM.value,
            currentList?.items ?? []
        );

        const listParams: ListParams = {
            oldPos: currentIndex,
            newPos: newPos,
            list: newList,
        };

        dispatch(
            currentIndex === -1
                ? new AddList(listParams)
                : new UpdateList(listParams)
        );

        const [isModalVisible, nextIndex] = getCellModalVisibleAndNextIndex(
            currentIndex,
            lists.length,
            isAddingList(),
            isAltAction
        );

        if (isModalVisible) {
            const newState: AddUpdateListState = getState(
                nextIndex,
                lists[nextIndex],
                defaultListPosition,
                defaultListType
            );
            addUpdateListDispatch(new Replace(newState));
        } else {
            switch (visibleFrom) {
                case "List": {
                    navigation.navigate("Lists");
                    break;
                }
                case "Item": {
                    navigation.navigate("Items", { listIndex: listIndex });
                }
            }
        }
    };

    const radioButtonsData: SelectionValue<Position>[] = isAddingList()
        ? [TOP, BOTTOM]
        : [TOP, CURRENT, BOTTOM];

    const defaultNewItemPositionData: SelectionValue<Position>[] = [
        TOP,
        BOTTOM,
    ];

    const visibleFromList: boolean = visibleFrom === "List";

    return (
        <AddUpdateContainer>
            <CustomInput
                value={name}
                onChangeText={setName}
                placeholder="Enter the name of your list"
                autoFocus={isAddingList()}
            />

            <CustomDropdown
                placeholder="Select list type"
                data={listTypes}
                selectedValue={listType}
                setSelectedValue={setListType}
            />

            <CustomDropdown
                placeholder="Select new items default position"
                data={defaultNewItemPositionData}
                selectedValue={defaultNewItemPosition}
                setSelectedValue={setDefaultNewItemPosition}
            />

            {visibleFromList && (
                <CustomRadioButtons
                    title={isAddingList() ? "Add to" : "Move to"}
                    data={radioButtonsData}
                    selectedValue={position}
                    setSelectedValue={setPosition}
                    testId="list-modal-position"
                />
            )}

            <CustomError error={error} />
        </AddUpdateContainer>
    );
}
