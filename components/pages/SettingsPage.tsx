import { Text, Button, ScrollView, View } from "react-native";
import { ListType, Position, SettingsPageNavigationProps } from "../../types";
import { useNavigation } from "@react-navigation/core";
import CustomCheckBox from "../core/CustomCheckBox";
import { useContext, useReducer } from "react";
import SettingsSection from "../SettingsSection";
import CustomDropdown from "../core/CustomDropdown";
import { listTypes, newPositions } from "../../data/data";
import {
    UpdateDefaultListPosition,
    UpdateDefaultListType,
    UpdateDeveloperMode,
} from "../../data/reducers/settings.reducer";
import { UpdateAll } from "../../data/reducers/lists.reducer";
import { UpdateAll as UpdateAllSettings } from "../../data/reducers/settings.reducer";
import { ListsContext } from "../../contexts/lists.context";
import DataManager from "../DataManager";
import {
    defaultSettingsData,
    SettingsContext,
} from "../../contexts/settings.context";
import { AccountContext } from "../../contexts/account.context";
import { DeleteAccount } from "../../data/reducers/account.reducer";
import DeleteSettingsModal from "../DeleteSettingsModal";
import {
    SettingsState,
    settingsStateReducer,
    UpdateIsDeleteModalVisible,
} from "../../data/reducers/settingsState.reducer";
import CustomSwitch from "../core/CustomSwitch";

function getState(): SettingsState {
    return {
        isDeleteModalVisible: false,
    };
}

export default function SettingsPage(): JSX.Element {
    const navigation = useNavigation<SettingsPageNavigationProps>();

    const listsContextData = useContext(ListsContext);
    const { listsDispatch: dispatch } = listsContextData;

    const accountContext = useContext(AccountContext);
    const { accountDispatch } = accountContext;

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

        accountDispatch(new DeleteAccount());

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
                    <CustomDropdown
                        data={listTypes}
                        selectedValue={defaultListType}
                        setSelectedValue={setDefaultListType}
                    />
                </SettingsSection>

                <SettingsSection header="Default List Position">
                    <CustomDropdown
                        data={newPositions}
                        selectedValue={defaultListPosition}
                        setSelectedValue={setDefaultNewListPosition}
                    />
                </SettingsSection>

                <SettingsSection header="Data Management">
                    <DataManager />
                </SettingsSection>

                {
                    // "Delete All Data" should be the last setting. Add new settings above this section.
                }
                <SettingsSection header="Delete All Data">
                    <Text>
                        This will delete all of your data, including lists and
                        items in those lists. Your settings will be reset to
                        their default values, and you will be logged out of your
                        account.
                    </Text>
                    <Text>
                        After clicking this button, you will be redirected back
                        to the main page.
                    </Text>
                    <Text>Proceed with caution.</Text>
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
