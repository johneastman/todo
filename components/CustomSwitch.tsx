import { Switch, View, Text } from "react-native";
import { LIGHT_BLUE, LIGHT_BLUE_BUTTON } from "../utils";

type CustomSwitchProps = {
    isSelected: boolean;
    setIsSelected: (value: boolean) => void;
    testId?: string;
};

export default function CustomSwitch(props: CustomSwitchProps): JSX.Element {
    const { isSelected, setIsSelected, testId } = props;

    return (
        <View
            style={{
                flexDirection: "column",
                gap: 15,
                alignItems: "center",
            }}
        >
            <Text style={{ fontSize: 15 }}>Ignore Select All</Text>
            <Switch
                testID={testId}
                value={isSelected}
                onValueChange={setIsSelected}
                trackColor={{ false: "#767577", true: LIGHT_BLUE }}
                thumbColor={isSelected ? LIGHT_BLUE_BUTTON : "#f4f3f4"}
                style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
            />
        </View>
    );
}
