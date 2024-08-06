import { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import CustomText, { TextSize } from "./core/CustomText";

type SettingsSectionProps = {
    header: string;
    children: ReactNode;
};

export default function SettingsSection(
    props: SettingsSectionProps
): JSX.Element {
    const { header, children } = props;

    return (
        <View style={styles.settingsView}>
            <CustomText
                text={header}
                style={styles.settingsHeader}
                size={TextSize.Medium}
            />
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
