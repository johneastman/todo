import { Text, Button, ScrollView } from "react-native";
import { clearData } from "../data/utils";
import { ListTypeValue, Position, SettingsPageNavigationProp } from "../types";
import { useNavigation } from "@react-navigation/core";
import CustomCheckBox from "./CustomCheckBox";
import { useContext } from "react";
import SettingsSection from "./SettingsSection";
import CustomDropdown from "./CustomDropdown";
import { listTypes, newPositions } from "../data/data";
import {
    SettingsContext,
    UpdateDefaultListPosition,
    UpdateDefaultListType,
    UpdateDeveloperMode,
} from "../data/reducers/settingsReducer";

export default function SettingsPage(): JSX.Element {
    let navigation = useNavigation<SettingsPageNavigationProp>();
    const settingsContext = useContext(SettingsContext);

    const {
        settingsDispatch,
        settings: {
            isDeveloperModeEnabled,
            defaultListPosition,
            defaultListType,
        },
    } = settingsContext;

    return (
        <ScrollView>
            <SettingsSection header="Developer Mode">
                <CustomCheckBox
                    isChecked={isDeveloperModeEnabled}
                    label="Developer Mode Enabled"
                    onChecked={(isChecked: boolean) =>
                        settingsDispatch(new UpdateDeveloperMode(isChecked))
                    }
                />
            </SettingsSection>

            <SettingsSection header="Default List Type">
                <CustomDropdown
                    data={listTypes}
                    selectedValue={defaultListType}
                    setSelectedValue={(listType: ListTypeValue): void =>
                        settingsDispatch(new UpdateDefaultListType(listType))
                    }
                />
            </SettingsSection>

            <SettingsSection header="Default List Position">
                <CustomDropdown
                    data={newPositions}
                    selectedValue={defaultListPosition}
                    setSelectedValue={(
                        newDefaultListPosition: Position
                    ): void =>
                        settingsDispatch(
                            new UpdateDefaultListPosition(
                                newDefaultListPosition
                            )
                        )
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
