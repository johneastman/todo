import { useContext, useEffect, useReducer } from "react";
import { List, BOTTOM, CURRENT, TOP, listTypes } from "../data/data";
import CustomModal from "./core/CustomModal";
import CustomRadioButtons from "./core/CustomRadioButtons";
import {
    ListParams,
    ListType,
    ModalButton,
    Position,
    SelectionValue,
} from "../types";
import CustomDropdown from "./core/CustomDropdown";
import { ListsContext } from "../contexts/lists.context";
import { AddList, UpdateList } from "../data/reducers/lists.reducer";
import {
    ListModalState,
    UpdateDefaultNewItemPosition,
    UpdateListType,
    UpdateName,
    UpdatePosition,
    listModalReducer,
} from "../data/reducers/listModal.reducer";
import { UpdateError, Replace } from "../data/reducers/common";
import CustomInput from "./core/CustomInput";
import { SettingsContext } from "../contexts/settings.context";
import { ListsStateContext } from "../contexts/listsState.context";
import {
    AddUpdateModalVisible,
    UpdateCurrentIndex,
} from "../data/reducers/listsState.reducer";
import { getCellModalVisibleAndNextIndex } from "../utils";

function getState(
    list: List | undefined,
    defaultListPosition: Position,
    defaultListType: ListType
): ListModalState {
    return {
        name: list?.name ?? "",
        position: list === undefined ? defaultListPosition : CURRENT.value,
        listType: list?.listType ?? defaultListType,
        defaultNewItemPosition: list?.defaultNewItemPosition ?? BOTTOM.value,
    };
}

type ListModalProps = {};

export default function ListModal(props: ListModalProps): JSX.Element {
    const listsContextData = useContext(ListsContext);
    const {
        data: { lists },
        listsDispatch: dispatch,
    } = listsContextData;

    const listsStateContext = useContext(ListsStateContext);
    const {
        listsState: { isModalVisible, currentIndex, visibleFrom },
        listsStateDispatch,
    } = listsStateContext;

    const settingsContext = useContext(SettingsContext);
    const {
        settings: { defaultListType, defaultListPosition },
    } = settingsContext;

    const currentList: List | undefined = lists[currentIndex];

    const [listModalState, listModalDispatch] = useReducer(
        listModalReducer,
        getState(currentList, defaultListPosition, defaultListType)
    );

    const { name, position, listType, defaultNewItemPosition, error } =
        listModalState;

    /* Every time the add/edit item modal opens, the values for the item's attributes need to be reset based on what
     * was passed in the props. This is necessary because the state will not change every time the modal opens and
     * closes.
     *
     * If the item passed to this modal is "undefined", we know a new item is being added, so the values should be
     * reset. However, if a non-"undefined" item is passed to this modal, the item is being edited, so those values
     * need to be updated to reflect the values in the item.
     */
    useEffect(() => {
        const newState: ListModalState = getState(
            currentList,
            defaultListPosition,
            defaultListType
        );
        listModalDispatch(new Replace(newState));
    }, [props]);

    const isAddingList = (): boolean => currentList === undefined;

    const closeModal = () =>
        listsStateDispatch(new AddUpdateModalVisible(false, "List"));

    const setName = (newName: string) =>
        listModalDispatch(new UpdateName(newName));

    const setPosition = (newPosition: Position) =>
        listModalDispatch(new UpdatePosition(newPosition));

    const setError = (newError?: string) =>
        listModalDispatch(new UpdateError(newError));

    const setListType = (newListType: ListType) =>
        listModalDispatch(new UpdateListType(newListType));

    const setDefaultNewItemPosition = (newDefaultNewItemPosition: Position) =>
        listModalDispatch(
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

        listsStateDispatch(
            new AddUpdateModalVisible(isModalVisible, "List", nextIndex)
        );
    };

    const radioButtonsData: SelectionValue<Position>[] = isAddingList()
        ? [TOP, BOTTOM]
        : [TOP, CURRENT, BOTTOM];

    const defaultNewItemPositionData: SelectionValue<Position>[] = [
        TOP,
        BOTTOM,
    ];

    const positiveAction: ModalButton = {
        text: isAddingList() ? "Add" : "Update",
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

    const modalTitle: string = isAddingList()
        ? "Add a New List"
        : "Update List";

    return visibleFrom === "List" ? (
        <CustomModal
            title={modalTitle}
            isVisible={isModalVisible}
            positiveAction={positiveAction}
            negativeAction={negativeAction}
            altAction={altAction}
            error={error}
        >
            <CustomInput
                testID="ListModal-list-name"
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

            <CustomRadioButtons
                title={isAddingList() ? "Add to" : "Move to"}
                data={radioButtonsData}
                selectedValue={position}
                setSelectedValue={setPosition}
            />
        </CustomModal>
    ) : (
        <CustomModal
            title={modalTitle}
            isVisible={isModalVisible}
            positiveAction={positiveAction}
            negativeAction={negativeAction}
            error={error}
        >
            <CustomInput
                testID="ListModal-list-name"
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
        </CustomModal>
    );
}
