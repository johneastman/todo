import { Button, ScrollView, View } from "react-native";
import { ListType, Position, SettingsPageNavigationProps } from "../../types";
import { useContext, useReducer } from "react";
import SettingsSection from "../SettingsSection";
import { listTypes, newPositions } from "../../data/data";
import {
    UpdateDefaultListPosition,
    UpdateDefaultListType,
    UpdateDeveloperMode,
} from "../../data/reducers/settings.reducer";
import { UpdateAll } from "../../data/reducers/lists.reducer";
import { UpdateAll as UpdateAllSettings } from "../../data/reducers/settings.reducer";
import { ListsContext } from "../../contexts/lists.context";
import CloudManager from "../CloudManager";
import {
    defaultSettingsData,
    SettingsContext,
} from "../../contexts/settings.context";
import DeleteSettingsModal from "../DeleteSettingsModal";
import {
    SettingsState,
    settingsStateReducer,
    UpdateIsDeleteModalVisible,
} from "../../data/reducers/settingsState.reducer";
import CustomSwitch from "../core/CustomSwitch";
import CustomText from "../core/CustomText";
import CustomPicker from "../core/CustomPicker";

function getState(): SettingsState {
    return {
        isDeleteModalVisible: false,
    };
}

export default function SettingsPage({
    navigation,
    route,
}: SettingsPageNavigationProps): JSX.Element {
    const listsContextData = useContext(ListsContext);
    const { listsDispatch: dispatch } = listsContextData;

    const settingsContext = useContext(SettingsContext);
    const {
        settings: {
            isDeveloperModeEnabled,
            defaultListType,
            defaultListPosition,
        },
        settingsDispatch,
    } = settingsContext;

    const [settingsState, settingsStateDispatch] = useReducer(
        settingsStateReducer,
        getState()
    );
    const { isDeleteModalVisible } = settingsState;

    const setDeveloperMode = (isDeveloperModeEnabled: boolean) =>
        settingsDispatch(new UpdateDeveloperMode(isDeveloperModeEnabled));

    const setDefaultListType = (defaultListType: ListType) =>
        settingsDispatch(new UpdateDefaultListType(defaultListType));

    const setDefaultNewListPosition = (defaultNewListPosition: Position) =>
        settingsDispatch(new UpdateDefaultListPosition(defaultNewListPosition));

    const openDeleteSettingsModal = () =>
        settingsStateDispatch(new UpdateIsDeleteModalVisible(true));

    const closeDeleteSettingsModal = () =>
        settingsStateDispatch(new UpdateIsDeleteModalVisible(false));

    const deleteAllData = () => {
        dispatch(new UpdateAll([]));

        settingsDispatch(new UpdateAllSettings(defaultSettingsData));

        closeDeleteSettingsModal();

        navigation.navigate("Lists");
    };

    return (
        <>
            <DeleteSettingsModal
                isVisible={isDeleteModalVisible}
                onDelete={deleteAllData}
                onCancel={closeDeleteSettingsModal}
            />

            <ScrollView>
                <SettingsSection header="Developer Mode">
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <CustomSwitch
                            label="Enabled"
                            isSelected={isDeveloperModeEnabled}
                            setIsSelected={setDeveloperMode}
                        />
                    </View>
                </SettingsSection>

                <SettingsSection header="Default List Type">
                    <CustomPicker
                        data={listTypes}
                        selectedValue={defaultListType}
                        onSelect={setDefaultListType}
                    />
                </SettingsSection>

                <SettingsSection header="Default List Position">
                    <CustomPicker
                        data={newPositions}
                        selectedValue={defaultListPosition}
                        onSelect={setDefaultNewListPosition}
                    />
                </SettingsSection>

                <SettingsSection header="Cloud Management">
                    <CloudManager />
                </SettingsSection>

                {
                    // "Delete All Data" should be the last setting. Add new settings above this section.
                }
                <SettingsSection header="Delete All Data">
                    <CustomText text="This will delete all of your data, including lists and items in those lists. Your settings will be reset to their default values, and you will be logged out of your account." />

                    <CustomText text="After clicking this button, you will be redirected back to the main page." />

                    <CustomText text="Proceed with caution." />

                    <Button
                        title="Delete"
                        color="red"
                        onPress={openDeleteSettingsModal}
                    />
                </SettingsSection>
            </ScrollView>
        </>
    );
}
