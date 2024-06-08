import { Button, View, Text } from "react-native";
import { baseURL } from "../env.json";
import { AppData, UpdateAll, UpdateLists } from "../data/reducers/app.reducer";
import { useContext, useReducer } from "react";
import { AppContext } from "../contexts/app.context";
import {
    DataManagerState,
    UpdateMessage,
    dataManagerReducer,
} from "../data/reducers/dataManager.reducer";
import { jsonToLists, listsToJSON } from "../data/mappers";
import { ListJSON } from "../types";

type DataManagerProps = {};

function getState(): DataManagerState {
    return { message: undefined };
}

export default function DataManager(props: DataManagerProps): JSX.Element {
    const settingsContext = useContext(AppContext);
    const {
        data: { lists },
        dispatch,
    } = settingsContext;

    const [dataManagerData, dataManagerDispatch] = useReducer(
        dataManagerReducer,
        { message: undefined }
    );
    const { message } = dataManagerData;

    const getData = async () => {
        const response = await fetch(`${baseURL}/lists`, {
            method: "GET",
        });

        const responsedata = await response.json();

        if (response.status !== 200) {
            const { message } = responsedata as { message: string };
            dataManagerDispatch(new UpdateMessage(message));
            return;
        }

        const listsJSON: ListJSON[] = responsedata as ListJSON[];
        const lists = jsonToLists(listsJSON);

        dispatch(new UpdateLists(lists));
        dataManagerDispatch(new UpdateMessage("Data retrieved successfully"));
    };

    const saveData = async () => {
        const body: ListJSON[] = listsToJSON(lists);

        const response = await fetch(`${baseURL}/lists`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const responsedata = await response.json();

        const { message } = responsedata as { message: string };
        dataManagerDispatch(new UpdateMessage(message));
    };

    return (
        <>
            <View style={{ flexDirection: "row", columnGap: 10 }}>
                <View style={{ flex: 1 }}>
                    <Button title="Get Data" onPress={getData} />
                </View>

                <View style={{ flex: 1 }}>
                    <Button title="Save Data" onPress={saveData} />
                </View>
            </View>
            <Text style={{ fontSize: 18 }}>{message}</Text>
        </>
    );
}
