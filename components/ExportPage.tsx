import { useIsFocused, useNavigation } from "@react-navigation/core";
import { useEffect, useState } from "react";
import { Text, Button, ScrollView } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";

import {
    ItemJSON,
    ListJSON,
    getItems,
    getLists,
    itemsToJSON,
    listsToJSON,
} from "../data/utils";
import { List } from "../data/data";
import { ExportPageNavigationProps } from "../types";

interface ExportData {
    lists: ListJSON[];
    items: ExportItem[];
}

interface ExportItem {
    listId: string;
    items: ItemJSON[];
}

export default function ExportPage(): JSX.Element {
    const isFocused = useIsFocused();
    const navigation = useNavigation<ExportPageNavigationProps>();

    const [exportedData, setExportedData] = useState<string>("");

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
        const rawExportData: ExportData = {
            lists: listData,
            items: itemsData,
        };

        setExportedData(JSON.stringify(rawExportData, null, 4));
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
            <Text>{exportedData}</Text>
        </ScrollView>
    );
}
