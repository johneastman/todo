import { useNavigation } from "@react-navigation/core";
import { useContext, useEffect, useReducer } from "react";
import { View, Text, ScrollView } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { encode } from "base-64";

import { ExportPageNavigationProps, ListJSON } from "../types";
import { GREY } from "../utils";
import Header from "./Header";
import { AppContext } from "../contexts/app.context";
import { listsToJSON } from "../data/mappers";
import {
    ExportPageState,
    UpdateIsDataCopied,
    exportPageReducer,
} from "../data/reducers/exportPage.reducer";
import { List } from "../data/data";

function getState(lists: List[]): ExportPageState {
    const listData: ListJSON[] = listsToJSON(lists);

    return {
        exportedData: encode(JSON.stringify(listData)),
        exportedJSONData: JSON.stringify(listData, null, 4),
        isDataCopied: false,
    };
}

export default function ExportPage(): JSX.Element {
    const navigation = useNavigation<ExportPageNavigationProps>();

    const settingsContext = useContext(AppContext);
    const {
        data: {
            lists,
            settings: { isDeveloperModeEnabled },
        },
    } = settingsContext;

    const [exportPageState, exportPageDispatch] = useReducer(
        exportPageReducer,
        getState(lists)
    );
    const { exportedData, exportedJSONData, isDataCopied } = exportPageState;

    const setIsDataCopied = (areDataCopied: boolean) =>
        exportPageDispatch(new UpdateIsDataCopied(areDataCopied));

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                return (
                    isDataCopied && (
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "bold",
                            }}
                        >
                            Copied!
                        </Text>
                    )
                );
            },
        });

        const timeId = setTimeout(() => {
            setIsDataCopied(false);
        }, 2000);

        return () => {
            clearTimeout(timeId);
        };
    }, [isDataCopied]);

    const onCopyData = (data: string) => {
        Clipboard.setString(data);
        setIsDataCopied(true);
    };

    return (
        <ScrollView>
            <View style={{ padding: 15, gap: 10 }}>
                <Header
                    text={`Below is your encoded data. Select the data to copy it to your clipboard and store it in a safe place.`}
                />
                <Text
                    testID="export-data"
                    onPress={() => onCopyData(exportedData)}
                >
                    {exportedData}
                </Text>
                {/* Show raw JSON when developer mode is enabled. */}
                {isDeveloperModeEnabled && (
                    <>
                        <View
                            style={{
                                borderBottomColor: GREY,
                                borderBottomWidth: 1,
                            }}
                        ></View>
                        <Text
                            testID="export-json-data"
                            onPress={() => onCopyData(exportedJSONData)}
                        >
                            {exportedJSONData}
                        </Text>
                    </>
                )}
            </View>
        </ScrollView>
    );
}
