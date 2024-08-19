import { Button, View, ActivityIndicator } from "react-native";
import { UpdateLists } from "../data/reducers/lists.reducer";
import { UpdateAll as UpdateAllSettings } from "../data/reducers/settings.reducer";
import { useContext, useEffect, useReducer } from "react";
import { ListsContext } from "../contexts/lists.context";
import {
    CloudManagerState,
    UpdateAll,
    UpdateAllUsers,
    UpdateLoading,
    UpdateMessage,
    UpdateCurrentUser,
    cloudManagerReducer,
} from "../data/reducers/cloudManager.reducer";
import { jsonToLists, listsToJSON, settingsToJSON } from "../data/mappers";
import { SettingsContext } from "../contexts/settings.context";
import CustomText, { TextSize } from "./core/CustomText";
import {
    CloudUserData,
    cloudDelete,
    cloudGet,
    CloudMessage,
    cloudSave,
    DataResponse,
    getUsers,
    CloudUsersData,
    Cloud,
} from "../data/utils";
import { Color } from "../utils";
import { MenuOption } from "../types";
import CustomDropdown from "./core/CustomDropdown";

type CloudManagerProps = {};

function getState(): CloudManagerState {
    return {
        isLoading: false,
        currentUser: "",
        allUsers: [],
    };
}

export default function CloudManager(props: CloudManagerProps): JSX.Element {
    const listsContextData = useContext(ListsContext);
    const {
        data: { lists },
        listsDispatch: dispatch,
    } = listsContextData;

    const settingsContext = useContext(SettingsContext);
    const { settings, settingsDispatch } = settingsContext;
    const { isDeveloperModeEnabled } = settings;

    const [cloudManagerData, cloudManagerDispatch] = useReducer(
        cloudManagerReducer,
        getState()
    );
    const { currentUser, allUsers, message, isLoading } = cloudManagerData;

    const updateUsername = (newUsername: string) =>
        cloudManagerDispatch(new UpdateCurrentUser(newUsername));

    const updateMessage = (newMessage: string) =>
        cloudManagerDispatch(new UpdateMessage(newMessage));

    const updateLoading = (loading: boolean) =>
        cloudManagerDispatch(new UpdateLoading(loading));

    const updateAll = (message: string) =>
        cloudManagerDispatch(
            new UpdateAll(currentUser, allUsers, false, message)
        );

    useEffect(() => {
        getUsers().then((usersData) => {
            switch (usersData.type) {
                case "message": {
                    const { message } = usersData as CloudMessage;
                    updateMessage(message);
                    break;
                }

                case "users_data": {
                    const { data } = usersData as CloudUsersData;
                    cloudManagerDispatch(new UpdateAllUsers(data));
                    break;
                }

                default:
                    throw Error(
                        `Invalid cloud response type when retrieving users: ${usersData.type}`
                    );
            }
        });
    }, []);

    const getData = async () => {
        if (currentUser === "") {
            updateMessage("No user provided");
            return;
        }

        updateLoading(true);

        const cloudResponse = await cloudGet(currentUser);

        switch (cloudResponse.type) {
            case "message": {
                const { message } = cloudResponse as CloudMessage;
                updateMessage(message);
                break;
            }

            case "user_data": {
                const {
                    data: { listsJSON, settingsJSON },
                } = cloudResponse as CloudUserData;

                const lists = jsonToLists(listsJSON);
                const settings = settingsToJSON(settingsJSON);

                dispatch(new UpdateLists(lists));
                settingsDispatch(new UpdateAllSettings(settings));

                updateMessage("Data retrieved successfully");
                break;
            }

            default:
                throw Error(
                    `Unknown cloud response type: ${cloudResponse.type}`
                );
        }

        updateLoading(false);
    };

    const saveData = async () => {
        if (currentUser === "") {
            updateMessage("No user provided");
            return;
        }

        updateLoading(true);

        const body: DataResponse = {
            listsJSON: listsToJSON(lists),
            settingsJSON: settingsToJSON(settings),
        };

        const { message } = await cloudSave(currentUser, body);
        updateAll(message);
    };

    const deleteData = async () => {
        if (currentUser === "") {
            updateMessage("No user provided");
            return;
        }

        updateLoading(true);

        const { message } = await cloudDelete(currentUser);
        updateAll(message);
    };

    const cloudButtons: MenuOption[] = [
        {
            text: "Delete Data",
            onPress: deleteData,
            // The user can only delete data stored in the cloud when developer mode is enabled.
            disabled: isLoading || !isDeveloperModeEnabled,
            color: Color.Red,
        },
        {
            text: "Get Data",
            onPress: getData,
            disabled: isLoading,
        },
        {
            text: "Save Data",
            onPress: saveData,
            disabled: isLoading,
        },
    ];

    return (
        <>
            <CustomDropdown
                placeholder="Select user"
                data={allUsers.map((user) => ({ label: user, value: user }))}
                setSelectedValue={updateUsername}
                selectedValue={currentUser}
            />

            <View style={{ flexDirection: "row", columnGap: 10 }}>
                {cloudButtons.map(
                    ({ text, onPress, disabled, color }, index) => (
                        <View key={index} style={{ flex: 1 }}>
                            <Button
                                title={text}
                                onPress={onPress}
                                disabled={disabled}
                                color={color}
                                key={index}
                            />
                        </View>
                    )
                )}
            </View>

            {!cloudManagerData.isLoading && (
                <CustomText text={message} size={TextSize.Medium} />
            )}

            {cloudManagerData.isLoading && <ActivityIndicator size="large" />}
        </>
    );
}
