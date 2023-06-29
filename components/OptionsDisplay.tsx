import { Button, StyleProp, TextStyle, View } from "react-native";
import { areTestsRunning } from "../utils";
import CustomMenuOption from "./CustomMenuOption";
import CustomMenu from "./CustomMenu";

interface OptionsData {
    text: string;
    action: () => void;
    testID: string;
    textStyle?: StyleProp<TextStyle>;
}

interface OptionsDisplayProps {
    options: OptionsData[];
}

/**
 * Change what is rendered for item/list options based on whether the tests are running or not.
 * This is needed because "react-native-element-dropdown" does not render menu items while
 * jest is running. It's a hacky solution, but to circumvent this issue, buttons are rendered
 * for each action item during jest testing, and the "react-native-element-dropdown" menus
 * are rendered otherwise.
 */
export default function OptionsDisplay(
    props: OptionsDisplayProps
): JSX.Element {
    const { options } = props;

    const testsRunning: boolean = areTestsRunning();

    const optionsViews: JSX.Element[] = options.map((option, index) => {
        const { text, action, testID, textStyle } = option;

        return (
            <View key={`option-#${index}`}>
                {testsRunning ? (
                    <Button testID={testID} title={text} onPress={action} />
                ) : (
                    <CustomMenuOption
                        text={text}
                        onSelect={action}
                        textStyle={textStyle}
                    />
                )}
            </View>
        );
    });

    return testsRunning ? (
        <View>{optionsViews}</View>
    ) : (
        <CustomMenu>{optionsViews}</CustomMenu>
    );
}
