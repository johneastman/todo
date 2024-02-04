import { TextInput, Text } from "react-native";
import { useContext, useEffect, useState } from "react";
import uuid from "react-native-uuid";

import { List, BOTTOM, CURRENT, TOP, listTypes } from "../data/data";
import CustomModal from "./CustomModal";
import CustomRadioButtons from "./CustomRadioButtons";
import { ListCRUD, ListType, Position, SelectionValue } from "../types";
import { RED, STYLES } from "../utils";
import CustomDropdown from "./CustomDropdown";
import { AppContext } from "../contexts/app.context";
import Error from "./Error";

type ListModalProps = {
    isVisible: boolean;
    currentListIndex: number;

    positiveAction: (params: ListCRUD, isAltAction: boolean) => void;
    negativeAction: () => void;
};

export default function ListModal(props: ListModalProps): JSX.Element {
    const { isVisible, currentListIndex, positiveAction, negativeAction } =
        props;

    const {
        data: { lists },
    } = useContext(AppContext);
    const currentList: List | undefined = lists[currentListIndex];

    const appContext = useContext(AppContext);
    const {
        data: {
            settings: { defaultListType, defaultListPosition },
        },
    } = appContext;

    const [text, onChangeText] = useState<string>("");
    const [position, setPosition] = useState<Position>(CURRENT.value);
    const [listType, setListType] = useState<ListType>(defaultListType);
    const [defaultNewItemPosition, setDefaultNewItemPosition] =
        useState<Position>(BOTTOM.value);
    const [error, setError] = useState<string | undefined>(undefined);

    /* Every time the add/edit item modal opens, the values for the item's attributes need to be reset based on what
     * was passed in the props. This is necessary because the state will not change every time the modal opens and
     * closes.
     *
     * If the item passed to this modal is "undefined", we know a new item is being added, so the values should be
     * reset. However, if a non-"undefined" item is passed to this modal, the item is being edited, so those values
     * need to be updated to reflect the values in the item.
     */
    useEffect(() => {
        onChangeText(currentList?.name ?? "");
        setDefaultNewItemPosition(
            currentList?.defaultNewItemPosition ?? BOTTOM.value
        );
        setPosition(
            currentList === undefined ? defaultListPosition : CURRENT.value
        );
        setError(undefined);

        // If the user is creating a list, set the list type to the default list type in the settings.
        // Otherwise (if they're editing a list), use the list's provided type.
        setListType(currentList?.listType ?? defaultListType);
    }, [props]);

    // Reset the error if any values change
    useEffect(
        () => setError(undefined),
        [text, position, listType, defaultNewItemPosition]
    );

    const submitAction = (isAltAction: boolean) => {
        if (text.trim().length <= 0) {
            setError("Name must be provided");
            return;
        }

        const newList: List = new List(
            currentList?.id ?? uuid.v4().toString(),
            text,
            listType,
            defaultNewItemPosition ?? BOTTOM.value,
            currentList?.items ?? []
        );

        positiveAction(
            {
                oldPos: currentListIndex,
                newPos: position,
                list: newList,
            },
            isAltAction
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
            isVisible={isVisible}
            positiveActionText={currentList === undefined ? "Add" : "Update"}
            positiveAction={() => submitAction(false)}
            negativeActionText="Cancel"
            negativeAction={negativeAction}
            altAction={() => submitAction(true)}
            altActionText="Next"
        >
            <TextInput
                testID="ListModal-list-name"
                defaultValue={text}
                style={STYLES.input}
                onChangeText={onChangeText}
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
