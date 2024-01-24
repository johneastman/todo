import { useIsFocused, useNavigation } from "@react-navigation/core";
import { useContext, useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { encode } from "base-64";

import { getLists } from "../data/utils";
import { List } from "../data/data";
import { ExportPageNavigationProps, ListJSON } from "../types";
import { GREY } from "../utils";
import Header from "./Header";
import { AppContext } from "../contexts/app.context";
import { listsToJSON } from "../data/mappers";

export default function ExportPage(): JSX.Element {
    const isFocused = useIsFocused();
    const navigation = useNavigation<ExportPageNavigationProps>();

    const [exportedData, setExportedData] = useState<string>("");
    const [exportedDataJSON, setExportedDataJSON] = useState<string>("");
    const [isDataCopied, setIsDataCopied] = useState<boolean>(false);

    const settingsContext = useContext(AppContext);
    const {
        data: {
            settings: { isDeveloperModeEnabled },
        },
    } = settingsContext;

    useEffect(() => {
        (async () => await exportData())();

        navigation.setOptions({
            headerRight: () => {
                return (
                    isDataCopied && (
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                            Copied!
                        </Text>
                    )
                );
            },
        });
    }, [isFocused, exportedData, isDataCopied]);

    useEffect(() => {
        const timeId = setTimeout(() => {
            setIsDataCopied(false);
        }, 2000);

        return () => {
            clearTimeout(timeId);
        };
    }, [isDataCopied]);

    const exportData = async (): Promise<void> => {
        const lists: List[] = await getLists();
        const listData: ListJSON[] = listsToJSON(lists);

        setExportedDataJSON(JSON.stringify(listData, null, 4));

        setExportedData(encode(JSON.stringify(listData)));
    };

    const onCopyData = () => {
        Clipboard.setString(exportedData);
        setIsDataCopied(true);
    };

    return (
        <ScrollView>
            <View style={{ padding: 15, gap: 10 }}>
                <Header
                    text={`Below is your encoded data. Select the data and store it in a safe place.`}
                />
                <Text onPress={onCopyData}>{exportedData}</Text>
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
