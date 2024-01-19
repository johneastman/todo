import { Text, Button, ScrollView } from "react-native";
import { clearData } from "../data/utils";
import {
    ListType,
    Position,
    SettingsContext,
    SettingsPageNavigationProp,
} from "../types";
import { useNavigation } from "@react-navigation/core";
import CustomCheckBox from "./CustomCheckBox";
import { useContext } from "react";
import SettingsSection from "./SettingsSection";
import CustomDropdown from "./CustomDropdown";
import { listTypes, newPositions } from "../data/data";

export default function SettingsPage(): JSX.Element {
    let navigation = useNavigation<SettingsPageNavigationProp>();
    const settingsContext = useContext(SettingsContext);

    return (
        <ScrollView>
            <SettingsSection header="Developer Mode">
                <CustomCheckBox
                    isChecked={settingsContext.isDeveloperModeEnabled}
                    label="Developer Mode Enabled"
                    onChecked={(isChecked: boolean) =>
                        settingsContext.updateSettings({
                            isDeveloperModeEnabled: isChecked,
                            defaultListType: settingsContext.defaultListType,
                            defaultListPosition:
                                settingsContext.defaultListPosition,
                            updateSettings: settingsContext.updateSettings,
                        })
                    }
                />
            </SettingsSection>

            <SettingsSection header="Default List Type">
                <CustomDropdown
                    data={listTypes}
                    selectedValue={settingsContext.defaultListType}
                    setSelectedValue={(listType: ListType): void =>
                        settingsContext.updateSettings({
                            isDeveloperModeEnabled:
                                settingsContext.isDeveloperModeEnabled,
                            defaultListType: listType,
                            defaultListPosition:
                                settingsContext.defaultListPosition,
                            updateSettings: settingsContext.updateSettings,
                        })
                    }
                />
            </SettingsSection>

            <SettingsSection header="Default List Position">
                <CustomDropdown
                    data={newPositions}
                    selectedValue={settingsContext.defaultListPosition}
                    setSelectedValue={(
                        newDefaultListPosition: Position
                    ): void =>
                        settingsContext.updateSettings({
                            isDeveloperModeEnabled:
                                settingsContext.isDeveloperModeEnabled,
                            defaultListType: settingsContext.defaultListType,
                            defaultListPosition: newDefaultListPosition,
                            updateSettings: settingsContext.updateSettings,
                        })
                    }
                />
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
                <Button
                    title="Delete"
                    color="red"
                    onPress={() => {
                        clearData();
                        navigation.navigate("Lists");
                    }}
                ></Button>
            </SettingsSection>
        </ScrollView>
    );
}
