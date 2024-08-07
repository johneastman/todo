import { Button, View, ActivityIndicator } from "react-native";
import { baseURL } from "../env.json";
import { UpdateLists } from "../data/reducers/lists.reducer";
import { UpdateAll as UpdateAllSettings } from "../data/reducers/settings.reducer";
import { useContext, useReducer } from "react";
import { ListsContext } from "../contexts/lists.context";
import {
    CloudManagerState,
    UpdateAll,
    UpdateLoading,
    UpdateMessage,
    cloudManagerReducer,
} from "../data/reducers/cloudManager.reducer";
import { jsonToLists, listsToJSON, settingsToJSON } from "../data/mappers";
import { SettingsContext } from "../contexts/settings.context";
import { AccountContext } from "../contexts/account.context";
import CustomText, { TextSize } from "./core/CustomText";
import {
    CloudData,
    cloudDelete,
    cloudGet,
    CloudMessage,
    cloudSave,
    DataResponse,
} from "../data/utils";
import { Color } from "../utils";

type CloudManagerProps = {};

function getState(): CloudManagerState {
    return { isLoading: false };
}

export default function CloudManager(props: CloudManagerProps): JSX.Element {
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

    const [cloudManagerData, cloudManagerDispatch] = useReducer(
        cloudManagerReducer,
        getState()
    );
    const { message, isLoading } = cloudManagerData;

    if (username === undefined) {
        cloudManagerDispatch(new UpdateMessage("No user provided"));
    }

    const url: string = `${baseURL}/lists/${username}`;

    const getData = async () => {
        cloudManagerDispatch(new UpdateLoading(true));

        const cloudResponse = await cloudGet(url);

        switch (cloudResponse.type) {
            case "message": {
                const { message } = cloudResponse as CloudMessage;
                cloudManagerDispatch(new UpdateMessage(message));
                break;
            }

            case "data": {
                const {
                    data: { listsJSON, settingsJSON },
                } = cloudResponse as CloudData;

                const lists = jsonToLists(listsJSON);
                const settings = settingsToJSON(settingsJSON);

                dispatch(new UpdateLists(lists));
                settingsDispatch(new UpdateAllSettings(settings));

                cloudManagerDispatch(
                    new UpdateMessage("Data retrieved successfully")
                );
                break;
            }

            default:
                throw Error(
                    `Unknown cloud response type: ${cloudResponse.type}`
                );
        }

        cloudManagerDispatch(new UpdateLoading(false));
    };

    const saveData = async () => {
        cloudManagerDispatch(new UpdateLoading(true));

        const body: DataResponse = {
            listsJSON: listsToJSON(lists),
            settingsJSON: settingsToJSON(settings),
        };

        const { message } = await cloudSave(url, body);
        cloudManagerDispatch(new UpdateAll(false, message));
    };

    const deleteData = async () => {
        cloudManagerDispatch(new UpdateLoading(true));
        const { message } = await cloudDelete(url);
        cloudManagerDispatch(new UpdateAll(false, message));
    };

    const buttons: JSX.Element[] = [
        <Button
            title="Delete Data"
            onPress={deleteData}
            disabled={isLoading}
            color={Color.Red}
        />,
        <Button title="Get Data" onPress={getData} disabled={isLoading} />,
        <Button title="Save Data" onPress={saveData} disabled={isLoading} />,
    ];

    return (
        <>
            <View style={{ flexDirection: "row", columnGap: 10 }}>
                {buttons.map((button) => (
                    <View style={{ flex: 1 }}>{button}</View>
                ))}
            </View>

            {!cloudManagerData.isLoading && (
                <CustomText text={message} size={TextSize.Medium} />
            )}

            {cloudManagerData.isLoading && <ActivityIndicator size="large" />}
        </>
    );
}
