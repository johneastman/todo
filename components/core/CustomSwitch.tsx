import { Switch, View } from "react-native";
import { Color } from "../../utils";
import CustomText from "./CustomText";

type CustomSwitchProps = {
    label?: string;
    isSelected: boolean;
    setIsSelected: (value: boolean) => void;
    testId?: string;
};

export default function CustomSwitch(props: CustomSwitchProps): JSX.Element {
    const { label, isSelected, setIsSelected, testId } = props;

    return (
        <View
            style={{
                flexDirection: "column",
                gap: 15,
                alignItems: "center",
            }}
        >
            {label && <CustomText text={label} />}
            <Switch
                testID={testId}
                value={isSelected}
                onValueChange={setIsSelected}
                trackColor={{ false: "#767577", true: Color.LightBlue }}
                thumbColor={isSelected ? Color.LightBlueButton : "#f4f3f4"}
                style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
            />
        </View>
    );
}
