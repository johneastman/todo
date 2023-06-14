import { View, Text, Button } from "react-native";
import { clearData } from "../data/utils";
import { SettingsPageNavigationProp } from "../types";
import { useNavigation } from "@react-navigation/core";

export default function SettingsPage(): JSX.Element {
    let navigation = useNavigation<SettingsPageNavigationProp>();

    return (
        <>
            <View style={{ padding: 10, gap: 10 }}>
                <Text
                    style={{
                        fontWeight: "bold",
                        paddingBottom: 10,
                        fontSize: 20,
                        textAlign: "center",
                    }}
                >
                    Delete All Data
                </Text>
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
