import { TextInput } from "react-native";
import { useContext, useEffect, useReducer } from "react";
import uuid from "react-native-uuid";

import { List, BOTTOM, CURRENT, TOP, listTypes } from "../data/data";
import CustomModal from "./CustomModal";
import CustomRadioButtons from "./CustomRadioButtons";
import { ListCRUD, ListType, Position, SelectionValue } from "../types";
import { STYLES } from "../utils";
import CustomDropdown from "./CustomDropdown";
import { AppContext } from "../contexts/app.context";
import Error from "./Error";
import {
    AddList,
    UpdateList,
    UpdateModalVisible,
} from "../data/reducers/app.reducer";
import {
    ListModalState,
    Replace,
    UpdateDefaultNewItemPosition,
    UpdateError,
    UpdateListType,
    UpdateName,
    UpdatePosition,
    listModalReducer,
} from "../data/reducers/listModal.reducer";

type ListModalProps = {};

export default function ListModal(props: ListModalProps): JSX.Element {
    const {
        data: {
            lists,
            settings: { defaultListType, defaultListPosition },
            listsState: { isModalVisible, currentIndex },
        },
        dispatch,
    } = useContext(AppContext);

    const currentList: List | undefined = lists[currentIndex];

    const [listModalState, listModalDispatch] = useReducer(listModalReducer, {
        name: currentList?.name ?? "",
        position:
            currentList === undefined ? defaultListPosition : CURRENT.value,
        listType: currentList?.listType ?? defaultListType,
        defaultNewItemPosition:
            currentList?.defaultNewItemPosition ?? BOTTOM.value,
    });

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
        const newState: ListModalState = {
            name: currentList?.name ?? "",
            defaultNewItemPosition:
                currentList?.defaultNewItemPosition ?? BOTTOM.value,
            position:
                currentList === undefined ? defaultListPosition : CURRENT.value,
            listType: currentList?.listType ?? defaultListType,
        };
        listModalDispatch(new Replace(newState));
    }, [props]);

    const closeModal = () => dispatch(new UpdateModalVisible("List", false));

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

        const newList: List = new List(
            currentList?.id ?? uuid.v4().toString(),
            name,
            listType,
            defaultNewItemPosition ?? BOTTOM.value,
            currentList?.items ?? []
        );

        const listParams: ListCRUD = {
            oldPos: currentIndex,
            newPos: position,
            list: newList,
        };

        dispatch(
            currentIndex === -1
                ? new AddList(listParams, isAltAction)
                : new UpdateList(listParams, isAltAction)
        );
    };

    const radioButtonsData: SelectionValue<Position>[] =
        currentList === undefined ? [TOP, BOTTOM] : [TOP, CURRENT, BOTTOM];

    const defaultNewItemPositionData: SelectionValue<Position>[] = [
        TOP,
        BOTTOM,
    ];

    return (
        <CustomModal
            title={currentList === undefined ? "Add a New List" : "Update List"}
            isVisible={isModalVisible}
            positiveActionText={currentList === undefined ? "Add" : "Update"}
            positiveAction={() => submitAction(false)}
            negativeActionText="Cancel"
            negativeAction={closeModal}
            altAction={() => submitAction(true)}
            altActionText="Next"
        >
            <TextInput
                testID="ListModal-list-name"
                defaultValue={name}
                style={STYLES.input}
                onChangeText={setName}
                placeholder="Enter the name of your list"
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
                title={currentList === undefined ? "Add to" : "Move to"}
                data={radioButtonsData}
                selectedValue={position}
                setSelectedValue={setPosition}
            />

            <Error error={error} />
        </CustomModal>
    );
}
