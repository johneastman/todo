import { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from "./Header";

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
            <Header text={header} style={styles.settingsHeader} />
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    settingsHeader: {
        fontWeight: "bold",
        paddingBottom: 10,
        textAlign: "center",
    },
    settingsView: {
        padding: 10,
        gap: 10,
    },
});
