import { useIsFocused, useNavigation } from "@react-navigation/core";
import { useContext, useEffect, useState } from "react";
import { View, Text, Button, ScrollView } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { encode } from "base-64";

import {
    ListJSON,
    getItems,
    getLists,
    itemsToJSON,
    listsToJSON,
} from "../data/utils";
import { ExportData, ExportItem, List } from "../data/data";
import { ExportPageNavigationProps, Settings, SettingsContext } from "../types";
import { GREY } from "../utils";
import Header from "./Header";

export default function ExportPage(): JSX.Element {
    const isFocused = useIsFocused();
    const navigation = useNavigation<ExportPageNavigationProps>();

    const [exportedData, setExportedData] = useState<string>("");
    const [exportedDataJSON, setExportedDataJSON] = useState<string>("");

    const settingsContext: Settings = useContext(SettingsContext);

    const exportData = async (): Promise<void> => {
        // Lists
        const lists: List[] = await getLists();
        const listData: ListJSON[] = listsToJSON(lists);

        // Items
        const itemsData: ExportItem[] = await Promise.all(
            lists.map(async (list) => {
                return {
                    listId: list.id,
                    items: itemsToJSON(await getItems(list.id)),
                };
            })
        );

        // Combine data for exporting
        const exportedData: ExportData = {
            lists: listData,
            items: itemsData,
        };

        setExportedDataJSON(JSON.stringify(exportedData, null, 4));

        setExportedData(encode(JSON.stringify(exportedData)));
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
                {settingsContext.isDeveloperModeEnabled && (
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
