import { Text, Button } from "react-native";
import { clearData } from "../data/utils";
import {
    ListTypeValue,
    SettingsContext,
    SettingsPageNavigationProp,
} from "../types";
import { useNavigation } from "@react-navigation/core";
import CustomCheckBox from "./CustomCheckBox";
import { useContext } from "react";
import SettingsSection from "./SettingsSection";
import SelectListTypesDropdown from "./SelectListTypesDropdown";

export default function SettingsPage(): JSX.Element {
    let navigation = useNavigation<SettingsPageNavigationProp>();
    const settingsContext = useContext(SettingsContext);

    return (
        <>
            <SettingsSection header="Developer Mode">
                <CustomCheckBox
                    isChecked={settingsContext.isDeveloperModeEnabled}
                    label="Developer Mode Enabled"
                    onChecked={(isChecked: boolean) =>
                        settingsContext.updateSettings({
                            isDeveloperModeEnabled: isChecked,
                            defaultListType: settingsContext.defaultListType,
                            updateSettings: settingsContext.updateSettings,
                        })
                    }
                />
            </SettingsSection>

            <SettingsSection header="Default List Type">
                <SelectListTypesDropdown
                    selectedValue={settingsContext.defaultListType}
                    setSelectedValue={(listType: ListTypeValue): void =>
                        settingsContext.updateSettings({
                            isDeveloperModeEnabled:
                                settingsContext.isDeveloperModeEnabled,
                            defaultListType: listType,
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
        </>
    );
}
