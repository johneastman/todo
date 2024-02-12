import { View, Button, TextInput, Text } from "react-native";
import { STYLES } from "../utils";
import { useContext, useEffect, useReducer } from "react";
import { decode } from "base-64";
import { ImportPageNavigationProps, ListJSON } from "../types";
import { useNavigation } from "@react-navigation/core";
import { saveListsData } from "../data/utils";
import CustomError from "./CustomError";
import {
    ImportPageState,
    UpdateText,
    importPageReducer,
} from "../data/reducers/importPage.reducer";
import { UpdateError } from "../data/reducers/common";
import { AppContext } from "../contexts/app.context";
import { UpdateLists } from "../data/reducers/app.reducer";
import { jsonToLists } from "../data/mappers";

function getState(): ImportPageState {
    return { text: "" };
}

export default function ImportPage(): JSX.Element {
    const navigation = useNavigation<ImportPageNavigationProps>();

    const { dispatch } = useContext(AppContext);

    const [importPageState, importPageDispatch] = useReducer(
        importPageReducer,
        getState()
    );
    const { text, error } = importPageState;

    const setText = (newText: string) =>
        importPageDispatch(new UpdateText(newText));

    const setError = (newError: string) =>
        importPageDispatch(new UpdateError(newError));

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View
                    style={{
                        flexDirection: "row",
                        columnGap: 10,
                    }}
                >
                    <Button title="Clear" onPress={() => setText("")} />
                    <Button title="Import" onPress={importData} />
                </View>
            ),
        });
    }, [text]);

    const importData = async (): Promise<void> => {
        if (text.length <= 0) {
            setError("No data provided");
            return;
        }

        let importedData: ListJSON[];
        try {
            const decodedData: string = decode(text);
            importedData = JSON.parse(decodedData);
        } catch (e) {
            setError("Unable to parse provided data");
            return;
        }

        // Save lists
        await saveListsData(importedData);

        // Update lists in app state
        dispatch(new UpdateLists(jsonToLists(importedData)));

        // Clear text after importing
        setText("");
    };

    return (
        <View style={{ gap: 10 }}>
            <TextInput
                multiline={true}
                style={[
                    STYLES.input,
                    { height: 180, textAlignVertical: "top" },
                ]}
                value={text}
                onChangeText={setText}
                placeholder="Enter data to import"
            />
            <View style={{ gap: 10, alignItems: "center" }}>
                <CustomError error={error} />
            </View>
        </View>
    );
}
