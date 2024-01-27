import { View, Button, TextInput, Text } from "react-native";
import { STYLES } from "../utils";
import { useState, useEffect } from "react";
import { decode } from "base-64";
import { ImportPageNavigationProps, ListJSON } from "../types";
import { useIsFocused, useNavigation } from "@react-navigation/core";
import { saveListsData } from "../data/utils";
import Error from "./Error";

export default function ImportPage(): JSX.Element {
    const isFocused = useIsFocused();
    const navigation = useNavigation<ImportPageNavigationProps>();

    const [text, setText] = useState<string>("");
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        clearError();

        navigation.setOptions({
            headerRight: () => (
                <View
                    style={{
                        flexDirection: "row",
                        columnGap: 10,
                    }}
                >
                    <Button
                        title="Clear"
                        onPress={() => {
                            setText("");
                            clearError();
                        }}
                    />
                    <Button title="Import" onPress={importData} />
                </View>
            ),
        });
    }, [isFocused, text]);

    const clearError = () => setError(undefined);

    const importData = async (): Promise<void> => {
        // Clear error from previous attempts
        setError(undefined);

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
                <Error error={error} />
            </View>
        </View>
    );
}
