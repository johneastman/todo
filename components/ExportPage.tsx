import { useIsFocused, useNavigation } from "@react-navigation/core";
import { useContext, useEffect, useState } from "react";
import { View, Text, Button, ScrollView } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { encode } from "base-64";

import { getLists, listsToJSON } from "../data/utils";
import { List } from "../data/data";
import { ExportPageNavigationProps, ListJSON, Settings } from "../types";
import { GREY } from "../utils";
import Header from "./Header";
import { SettingsContext } from "../data/reducers/settings.reducer";

export default function ExportPage(): JSX.Element {
    const isFocused = useIsFocused();
    const navigation = useNavigation<ExportPageNavigationProps>();

    const [exportedData, setExportedData] = useState<string>("");
    const [exportedDataJSON, setExportedDataJSON] = useState<string>("");

    const settingsContext = useContext(SettingsContext);
    const {
        settings: { isDeveloperModeEnabled },
    } = settingsContext;

    const exportData = async (): Promise<void> => {
        const lists: List[] = await getLists();
        const listData: ListJSON[] = listsToJSON(lists);

        setExportedDataJSON(JSON.stringify(listData, null, 4));

        setExportedData(encode(JSON.stringify(listData)));
    };

    useEffect(() => {
        (async () => await exportData())();

        navigation.setOptions({
            headerRight: () => (
                <Button
                    title="Copy Data"
                    onPress={() => Clipboard.setString(exportedData)}
                />
            ),
        });
    }, [isFocused, exportedData]);

    return (
        <ScrollView>
            <View style={{ padding: 15, gap: 10 }}>
                <Header
                    text={`Below is your encoded data. Press "Copy Data" and store it in a safe place.`}
                />
                <Text>{exportedData}</Text>
                {/* Show raw JSON when developer mode is enabled. */}
                {isDeveloperModeEnabled && (
                    <>
                        <View
                            style={{
                                borderBottomColor: GREY,
                                borderBottomWidth: 1,
                            }}
                        ></View>
                        <Text>{exportedDataJSON}</Text>
                    </>
                )}
            </View>
        </ScrollView>
    );
}
