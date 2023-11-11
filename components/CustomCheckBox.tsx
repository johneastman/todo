import { View, Text, Pressable } from "react-native";
import { LIGHT_BLUE, STYLES } from "../utils";

interface CustomCheckBoxProps {
    label?: string;
    testID?: string;
    isChecked: boolean;
    onChecked: (isChecked: boolean) => void;
}

export default function CustomCheckBox(
    props: CustomCheckBoxProps
): JSX.Element {
    const { label, testID, isChecked, onChecked } = props;

    return (
        <Pressable
            onPress={() => onChecked(!isChecked)}
            style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            testID={testID}
        >
            <View
                style={[
                    STYLES.customCheckBox,
                    {
                        borderWidth: 2,
                        borderColor: "black",
                        alignItems: "center",
                        justifyContent: "center",
                    },
                ]}
            >
                {isChecked ? (
                    <View
                        style={[
                            STYLES.customCheckBox,
                            {
                                backgroundColor: LIGHT_BLUE,
                            },
                        ]}
                    />
                ) : null}
            </View>
            {/* Only display the label if it is provided. */}
            {label !== undefined ? <Text>{label}</Text> : null}
        </Pressable>
    );
}
