import { StyleSheet, TextInput } from "react-native";
import { useEffect, useState } from "react";
import uuid from "react-native-uuid";

import { List } from "../data/List";
import CustomModal from "./CustomModal";

interface ListModalProps {
    isVisible: boolean;
    list: List | undefined;
    title: string;

    positiveActionText: string;
    positiveAction: (List: List) => void;

    negativeActionText: string;
    negativeAction: () => void;
}

export default function ListModal(props: ListModalProps): JSX.Element {
    const [text, onChangeText] = useState<string>("");

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
    }, [props]);

    return (
        <CustomModal
            title={props.title}
            isVisible={props.isVisible}
            positiveActionText={props.positiveActionText}
            positiveAction={() => {
                let id: string = uuid.v4().toString();
                let newList: List = new List(id, text, []);
                props.positiveAction(newList);
            }}
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
