import { View, Text, Button } from "react-native";
import { clearData, getDeveloperMode, saveDeveloperMode } from "../data/utils";
import { SettingsPageNavigationProp } from "../types";
import { useNavigation } from "@react-navigation/core";
import { STYLES } from "../utils";
import CustomCheckBox from "./CustomCheckBox";
import { useEffect, useState } from "react";

export default function SettingsPage(): JSX.Element {
    let navigation = useNavigation<SettingsPageNavigationProp>();

    const [isDeveloperModeEnabled, setIsDeveloperModeEnabled] =
        useState<boolean>(false);

    useEffect(() => {
        (async () => {
            let developerMode: boolean = await getDeveloperMode();
            setIsDeveloperModeEnabled(developerMode);
        })();
    }, []);

    useEffect(() => {
        (async () => await saveDeveloperMode(isDeveloperModeEnabled))();
    }, [isDeveloperModeEnabled]);

    return (
        <>
            <View style={STYLES.settingsView}>
                <Text style={STYLES.settingsHeader}>Developer Mode</Text>
                <CustomCheckBox
                    isChecked={isDeveloperModeEnabled}
                    label="Developer Mode Enabled"
                    onChecked={(isChecked: boolean) =>
                        setIsDeveloperModeEnabled(isChecked)
                    }
                />
            </View>

            <View style={STYLES.settingsView}>
                <Text style={STYLES.settingsHeader}>Delete All Data</Text>
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
            </View>
        </>
    );
}
