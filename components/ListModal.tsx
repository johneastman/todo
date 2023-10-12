import { TextInput } from "react-native";
import { useContext, useEffect, useState } from "react";
import uuid from "react-native-uuid";

import { List, BOTTOM, CURRENT, TOP } from "../data/data";
import CustomModal from "./CustomModal";
import CustomRadioButtons from "./CustomRadioButtons";
import {
    ListTypeValue,
    Position,
    RadioButton,
    SettingsContext,
} from "../types";
import { STYLES } from "../utils";
import SelectListTypesDropdown from "./SelectListTypesDropdown";

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
    const [text, onChangeText] = useState<string>("");
    const [position, setPosition] = useState<Position>("current");
    const settingsContext = useContext(SettingsContext);

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
        setPosition(props.list === undefined ? "bottom" : "current");
    }, [props]);

    const submitAction = () => {
        let oldList: List | undefined = props.list;

        let newList: List = new List(
            oldList === undefined ? uuid.v4().toString() : oldList.id,
            text,
            settingsContext.defaultListType
        );

        props.positiveAction(props.index, position, newList);
    };

    let radioButtonsData: RadioButton<Position>[] =
        props.list === undefined ? [TOP, BOTTOM] : [TOP, CURRENT, BOTTOM];

    return (
        <CustomModal
            title={props.title}
            isVisible={props.isVisible}
            positiveActionText={props.positiveActionText}
            positiveAction={submitAction}
            negativeActionText={props.negativeActionText}
            negativeAction={props.negativeAction}
        >
            <TextInput
                testID="ListModal-list-name"
                defaultValue={text}
                style={STYLES.input}
                onChangeText={onChangeText}
                placeholder="Enter the name of your list"
            />

            <SelectListTypesDropdown
                selectedValue={settingsContext.defaultListType}
                setSelectedValue={(newListType: ListTypeValue) =>
                    settingsContext.updateSettings({
                        isDeveloperModeEnabled:
                            settingsContext.isDeveloperModeEnabled,
                        defaultListType: newListType,
                        updateSettings: settingsContext.updateSettings,
                    })
                }
            />

            <CustomRadioButtons
                title={props.list === undefined ? "Add to" : "Move to"}
                data={radioButtonsData}
                selectedValue={position}
                setSelectedValue={setPosition}
            />
        </CustomModal>
    );
}
