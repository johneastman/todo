import { Button, View, ActivityIndicator } from "react-native";
import { baseURL } from "../env.json";
import { UpdateLists } from "../data/reducers/lists.reducer";
import { UpdateAll as UpdateAllSettings } from "../data/reducers/settings.reducer";
import { useContext, useReducer } from "react";
import { ListsContext } from "../contexts/lists.context";
import {
    DataManagerState,
    UpdateAll,
    UpdateLoading,
    UpdateMessage,
    dataManagerReducer,
} from "../data/reducers/dataManager.reducer";
import { jsonToLists, listsToJSON, settingsToJSON } from "../data/mappers";
import { ExportedData } from "../types";
import { SettingsContext } from "../contexts/settings.context";
import { AccountContext } from "../contexts/account.context";
import CustomText, { TextSize } from "./core/CustomText";

type DataManagerProps = {};

function getState(): DataManagerState {
    return { isLoading: false };
}

export default function DataManager(props: DataManagerProps): JSX.Element {
    const listsContextData = useContext(ListsContext);
    const {
        data: { lists },
        listsDispatch: dispatch,
    } = listsContextData;

    const accountContext = useContext(AccountContext);
    const {
        account: { username },
    } = accountContext;

    const settingsContext = useContext(SettingsContext);
    const { settings, settingsDispatch } = settingsContext;

    const [dataManagerData, dataManagerDispatch] = useReducer(
        dataManagerReducer,
        getState()
    );
    const { message, isLoading } = dataManagerData;

    const url: string = `${baseURL}/lists/${username}`;

    const getData = async () => {
        dataManagerDispatch(new UpdateLoading(true));

        try {
            const response = await fetch(url, {
                method: "GET",
            });

            const responsedata = await response.json();

            if (response.status !== 200) {
                const { message } = responsedata as { message: string };
                dataManagerDispatch(new UpdateMessage(message));
                return;
            }

            const { listsJSON, settingsJSON } = responsedata as ExportedData;
            const lists = jsonToLists(listsJSON);
            const settings = settingsToJSON(settingsJSON);

            dispatch(new UpdateLists(lists));
            settingsDispatch(new UpdateAllSettings(settings));

            dataManagerDispatch(
                new UpdateAll(false, "Data retrieved successfully")
            );
        } catch (error) {
            console.error(error);
            dataManagerDispatch(
                new UpdateAll(false, "Failed to retrieve data")
            );
        }
    };

    const saveData = async () => {
        dataManagerDispatch(new UpdateLoading(true));

        const body: ExportedData = {
            listsJSON: listsToJSON(lists),
            settingsJSON: settingsToJSON(settings),
        };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const responsedata = await response.json();

        const { message } = responsedata as { message: string };
        dataManagerDispatch(new UpdateAll(false, message));
    };

    return (
        <>
            <View style={{ flexDirection: "row", columnGap: 10 }}>
                <View style={{ flex: 1 }}>
                    <Button
                        title="Get Data"
                        onPress={getData}
                        disabled={isLoading}
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <Button
                        title="Save Data"
                        onPress={saveData}
                        disabled={isLoading}
                    />
                </View>
            </View>
            {!dataManagerData.isLoading && (
                <CustomText text={message} size={TextSize.Medium} />
            )}
            {dataManagerData.isLoading && <ActivityIndicator size="large" />}
        </>
    );
}
