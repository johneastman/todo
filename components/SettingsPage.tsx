import { Text, Button, ScrollView } from "react-native";
import { ListType, Position, SettingsPageNavigationProp } from "../types";
import { useNavigation } from "@react-navigation/core";
import CustomCheckBox from "./core/CustomCheckBox";
import { useContext } from "react";
import SettingsSection from "./SettingsSection";
import CustomDropdown from "./core/CustomDropdown";
import { listTypes, newPositions } from "../data/data";
import {
    UpdateDefaultListPosition,
    UpdateDefaultListType,
    UpdateDeveloperMode,
} from "../data/reducers/settings.reducer";
import { UpdateAll } from "../data/reducers/app.reducer";
import { UpdateAll as UpdateAllSettings } from "../data/reducers/settings.reducer";
import { AppContext } from "../contexts/app.context";
import DataManager from "./DataManager";
import {
    defaultSettingsData,
    SettingsContext,
} from "../contexts/settings.context";

export default function SettingsPage(): JSX.Element {
    const navigation = useNavigation<SettingsPageNavigationProp>();

    const appContext = useContext(AppContext);
    const { dispatch } = appContext;

    const settingsContext = useContext(SettingsContext);
    const {
        settings: {
            isDeveloperModeEnabled,
            defaultListType,
            defaultListPosition,
        },
        settingsDispatch,
    } = settingsContext;

    const setDeveloperMode = (isDeveloperModeEnabled: boolean) =>
        settingsDispatch(new UpdateDeveloperMode(isDeveloperModeEnabled));

    const setDefaultListType = (defaultListType: ListType) =>
        settingsDispatch(new UpdateDefaultListType(defaultListType));

    const setDefaultNewListPosition = (defaultNewListPosition: Position) =>
        settingsDispatch(new UpdateDefaultListPosition(defaultNewListPosition));

    const deleteAllData = () => {
        dispatch(new UpdateAll([]));
        settingsDispatch(new UpdateAllSettings(defaultSettingsData));
        navigation.navigate("Lists");
    };

    return (
        <ScrollView>
            <SettingsSection header="Developer Mode">
                <CustomCheckBox
                    isChecked={isDeveloperModeEnabled}
                    label="Developer Mode Enabled"
                    onChecked={setDeveloperMode}
                />
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
                    This will delete all of your data, including lists and items
                    in those lists. Settings will be reset to their default
                    values.
                </Text>
                <Text>
                    After clicking this button, you will be redirected back to
                    the main page.
                </Text>
                <Text>Proceed with caution.</Text>
                <Button title="Delete" color="red" onPress={deleteAllData} />
            </SettingsSection>
        </ScrollView>
    );
}
