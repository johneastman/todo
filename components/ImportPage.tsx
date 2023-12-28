import { View, Button, TextInput, Text } from "react-native";
import { STYLES } from "../utils";
import { useState, useEffect } from "react";
import { ImportPageNavigationProps } from "../types";
import { useIsFocused, useNavigation } from "@react-navigation/core";
import { ListJSON, decode, saveListsData } from "../data/utils";
import CustomModal from "./CustomModal";

export default function ImportPage(): JSX.Element {
    const isFocused = useIsFocused();
    const navigation = useNavigation<ImportPageNavigationProps>();

    const [text, setText] = useState<string>("");
    const [error, setError] = useState<string | undefined>();

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
    }, [isFocused, text]);

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
            <CustomModal
                title={"Error"}
                isVisible={error !== undefined}
                positiveActionText={"Ok"}
                positiveAction={() => setError(undefined)}
            >
                <Text>{error}</Text>
            </CustomModal>

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
        </View>
    );
}
