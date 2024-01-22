import { TextInput } from "react-native";
import { useContext, useEffect, useState } from "react";
import uuid from "react-native-uuid";

import { List, BOTTOM, CURRENT, TOP, listTypes } from "../data/data";
import CustomModal from "./CustomModal";
import CustomRadioButtons from "./CustomRadioButtons";
import { ListCRUD, ListType, Position, SelectionValue } from "../types";
import { STYLES } from "../utils";
import CustomDropdown from "./CustomDropdown";
import { AppContext } from "../contexts/app.context";

interface ListModalProps {
    isVisible: boolean;
    list: List | undefined;
    currentListIndex: number;

    positiveAction: (params: ListCRUD) => void;
    negativeAction: () => void;
    altAction: () => void;
}

export default function ListModal(props: ListModalProps): JSX.Element {
    const {
        isVisible,
        list,
        currentListIndex,
        positiveAction,
        negativeAction,
        altAction,
    } = props;

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

    /* Every time the add/edit item modal opens, the values for the item's attributes need to be reset based on what
     * was passed in the props. This is necessary because the state will not change every time the modal opens and
     * closes.
     *
     * If the item passed to this modal is "undefined", we know a new item is being added, so the values should be
     * reset. However, if a non-"undefined" item is passed to this modal, the item is being edited, so those values
     * need to be updated to reflect the values in the item.
     */
    useEffect(() => {
        onChangeText(list?.name ?? "");
        setDefaultNewItemPosition(list?.defaultNewItemPosition ?? BOTTOM.value);
        setPosition(list === undefined ? defaultListPosition : CURRENT.value);

        // If the user is creating a list, set the list type to the default list type in the settings.
        // Otherwise (if they're editing a list), use the list's provided type.
        setListType(list?.listType ?? defaultListType);
    }, [props]);

    const submitAction = () => {
        let newList: List = new List(
            list === undefined ? uuid.v4().toString() : list.id,
            text,
            listType,
            defaultNewItemPosition || BOTTOM.value,
            list?.items ?? []
        );

        positiveAction({
            oldPos: currentListIndex,
            newPos: position,
            list: newList,
        });
    };

    let radioButtonsData: SelectionValue<Position>[] =
        list === undefined ? [TOP, BOTTOM] : [TOP, CURRENT, BOTTOM];

    const defaultNewItemPositionData: SelectionValue<Position>[] = [
        TOP,
        BOTTOM,
    ];

    return (
        <CustomModal
            title={list === undefined ? "Add a New List" : "Update List"}
            isVisible={isVisible}
            positiveActionText={list === undefined ? "Add" : "Update"}
            positiveAction={submitAction}
            negativeActionText="Cancel"
            negativeAction={negativeAction}
            altAction={() => {
                // Perform submit action
                submitAction();

                // Perform alternate action
                altAction();
            }}
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
                title={list === undefined ? "Add to" : "Move to"}
                data={radioButtonsData}
                selectedValue={position}
                setSelectedValue={setPosition}
            />
        </CustomModal>
    );
}
