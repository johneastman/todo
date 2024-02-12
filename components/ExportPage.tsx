import { useIsFocused, useNavigation } from "@react-navigation/core";
import { useContext, useEffect, useReducer } from "react";
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
import {
    ExportData,
    ExportJSONData,
    ExportPageState,
    UpdateIsDataCopied,
    exportPageReducer,
} from "../data/reducers/exportPage.reducer";

function getState(): ExportPageState {
    return {
        exportedData: "",
        exportedJSONData: "",
        isDataCopied: false,
    };
}

export default function ExportPage(): JSX.Element {
    const isFocused = useIsFocused();
    const navigation = useNavigation<ExportPageNavigationProps>();

    const [exportPageState, exportPageDispatch] = useReducer(
        exportPageReducer,
        getState()
    );
    const { exportedData, exportedJSONData, isDataCopied } = exportPageState;

    const settingsContext = useContext(AppContext);
    const {
        data: {
            settings: { isDeveloperModeEnabled },
        },
    } = settingsContext;

    const setExportedData = (data: string) =>
        exportPageDispatch(new ExportData(data));

    const setExportedJSONData = (jsonData: string) =>
        exportPageDispatch(new ExportJSONData(jsonData));

    const setIsDataCopied = (isDataCopied: boolean) =>
        exportPageDispatch(new UpdateIsDataCopied(isDataCopied));

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

        setExportedJSONData(JSON.stringify(listData, null, 4));

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
                    text={`Below is your encoded data. Select the data to copy it to your clipboard and store it in a safe place.`}
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
                        <Text>{exportedJSONData}</Text>
                    </>
                )}
            </View>
        </ScrollView>
    );
}
