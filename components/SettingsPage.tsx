import { Text, Button } from "react-native";
import {
    clearData,
    getDeveloperMode,
    saveDeveloperMode,
    getDefaultListType,
    saveDefaultListType,
} from "../data/utils";
import { ListTypeValues, SettingsPageNavigationProp } from "../types";
import { useNavigation } from "@react-navigation/core";
import CustomCheckBox from "./CustomCheckBox";
import { useEffect, useState } from "react";
import SettingsSection from "./SettingsSection";
import SelectListTypesDropdown from "./SelectListTypesDropdown";

export default function SettingsPage(): JSX.Element {
    let navigation = useNavigation<SettingsPageNavigationProp>();

    const [isDeveloperModeEnabled, setIsDeveloperModeEnabled] =
        useState<boolean>(false);
    const [defaultListType, setDefaultListType] =
        useState<ListTypeValues>("List");

    useEffect(() => {
        (async () => {
            let developerMode: boolean = await getDeveloperMode();
            setIsDeveloperModeEnabled(developerMode);

            let defaultListType: ListTypeValues = await getDefaultListType();
            setDefaultListType(defaultListType);
        })();
    }, []);

    useEffect(() => {
        (async () => await saveDeveloperMode(isDeveloperModeEnabled))();
    }, [isDeveloperModeEnabled]);

    return (
        <>
            <SettingsSection header="Developer Mode">
                <CustomCheckBox
                    isChecked={isDeveloperModeEnabled}
                    label="Developer Mode Enabled"
                    onChecked={(isChecked: boolean) =>
                        setIsDeveloperModeEnabled(isChecked)
                    }
                />
            </SettingsSection>

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

            <SettingsSection header="Default List Type">
                <SelectListTypesDropdown
                    selectedValue={defaultListType}
                    setSelectedValue={async (
                        listType: ListTypeValues
                    ): Promise<void> => {
                        setDefaultListType(listType);
                        await saveDefaultListType(listType);
                    }}
                />
            </SettingsSection>
        </>
    );
}
