import { View, Text, Pressable, Image } from "react-native";
import { LIGHT_BLUE } from "../utils";

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
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 6,
                    borderWidth: isChecked ? 0 : 2,
                    borderColor: "black",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isChecked ? LIGHT_BLUE : "transparent",
                }}
            >
                <Image
                    source={require("../assets/check.png")}
                    style={{
                        width: 28,
                        height: 28,
                        opacity: isChecked ? 1 : 0,
                    }}
                />
            </View>
            {/* Only display the label if it is provided. */}
            {label !== undefined ? <Text>{label}</Text> : null}
        </Pressable>
    );
}
