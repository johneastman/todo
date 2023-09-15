import { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";

interface SettingsSectionProps {
    header: string;
    children: ReactNode;
}

export default function SettingsSection(
    props: SettingsSectionProps
): JSX.Element {
    const { header, children } = props;

    return (
        <View style={styles.settingsView}>
            <Text style={styles.settingsHeader}>{header}</Text>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    settingsHeader: {
        fontWeight: "bold",
        paddingBottom: 10,
        fontSize: 20,
        textAlign: "center",
    },
    settingsView: {
        padding: 10,
        gap: 10,
    },
});
