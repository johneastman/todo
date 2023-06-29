import { StyleSheet, TextInput } from "react-native";
import { useEffect, useState } from "react";
import uuid from "react-native-uuid";

import { List, listTypes, BOTTOM, CURRENT, TOP } from "../data/data";
import CustomModal from "./CustomModal";
import CustomRadioButtons from "./CustomRadioButtons";
import { ListType, ListTypeValues, Position, RadioButton } from "../types";
import { Dropdown } from "react-native-element-dropdown";
import { STYLES } from "../utils";

interface ListModalProps {
    isVisible: boolean;
    list: List | undefined;
    index: number;
    title: string;

    positiveActionText: string;
    positiveAction: (oldPos: number, newPos: Position, list: List) => void;

    negativeActionText: string;
    negativeAction: () => void;
}

export default function ListModal(props: ListModalProps): JSX.Element {
    const defaultListType: ListTypeValues = "List";

    const [text, onChangeText] = useState<string>("");
    const [position, setPosition] = useState<Position>("current");
    const [listType, setListType] = useState<ListTypeValues>(defaultListType);

    /* Every time the add/edit item modal opens, the values for the item's attributes need to be reset based on what
     * was passed in the props. This is necessary because the state will not change every time the modal opens and
     * closes.
     *
     * If the item passed to this modal is "undefined", we know a new item is being added, so the values should be
     * reset. However, if a non-"undefined" item is passed to this modal, the item is being edited, so those values
     * need to be updated to reflect the values in the item.
     */
    useEffect(() => {
        onChangeText(props.list?.name || "");
        setListType(props.list?.type || defaultListType);

        setPosition(props.list === undefined ? "bottom" : "current");
    }, [props]);

    const positiveAction = () => {
        let oldList: List | undefined = props.list;

        let newList: List = new List(
            oldList === undefined ? uuid.v4().toString() : oldList.id,
            text,
            listType
        );

        props.positiveAction(props.index, position, newList);
    };

    let radioButtonsData: RadioButton[] =
        props.list === undefined ? [TOP, BOTTOM] : [TOP, CURRENT, BOTTOM];

    return (
        <CustomModal
            title={props.title}
            isVisible={props.isVisible}
            positiveActionText={props.positiveActionText}
            positiveAction={positiveAction}
            negativeActionText={props.negativeActionText}
            negativeAction={props.negativeAction}
        >
            <TextInput
                testID="ListModal-list-name"
                defaultValue={text}
                style={styles.input}
                onChangeText={onChangeText}
                placeholder="Enter the name of your list"
            />
            <Dropdown
                testID="ListModal-list-type"
                style={STYLES.dropdown}
                data={listTypes}
                labelField={"label"}
                valueField={"value"}
                onChange={(listType: ListType): void => {
                    setListType(listType.value);
                }}
                value={listType}
            />
            <CustomRadioButtons
                title={props.list === undefined ? "Add to" : "Move to"}
                data={radioButtonsData}
                position={position}
                setPosition={setPosition}
            />
        </CustomModal>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        width: "100%",
    },
});
