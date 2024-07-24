import { View, Text, Pressable } from "react-native";
import { SelectionValue } from "../../types";
import { Color } from "../../utils";
import CustomFlatList from "../CustomFlatList";

type RadioButtonsProps<T> = {
    title?: string;
    data: SelectionValue<T>[];
    selectedValue?: T;
    setSelectedValue: (newValue: T) => void;
    testId?: string;
};

export default function CustomRadioButtons<T>(
    props: RadioButtonsProps<T>
): JSX.Element {
    const { title, data, selectedValue, setSelectedValue, testId } = props;

    const value: SelectionValue<T> | undefined = data.find(
        (d) => d.value === selectedValue
    );

    const renderRadioButton = (
        radioButtonData: SelectionValue<T>,
        index: number
    ): JSX.Element => {
        const pressableTestId: string = `${testId ?? title ?? "radio-button"}-${
            radioButtonData.label
        }`;

        return (
            <RadioButtonView
                isSelected={radioButtonData === value}
                text={radioButtonData.label}
                onSelect={() => {
                    setSelectedValue(radioButtonData.value);
                }}
                testId={pressableTestId}
            />
        );
    };

    return (
        <View testID={testId} style={{ gap: 10, alignItems: "center" }}>
            <View>
                {title !== undefined && (
                    <Text style={{ fontSize: 18 }}>{title}</Text>
                )}
            </View>

            <CustomFlatList
                data={data}
                renderElement={renderRadioButton}
                contentContainerStyle={{ gap: 10 }}
            />
        </View>
    );
}

type RadioButtonProps = {
    isSelected: boolean;
    text: string;
    onSelect: () => void;
    testId?: string;
};

function RadioButtonView(props: RadioButtonProps): JSX.Element {
    const { isSelected, text, onSelect, testId } = props;

    return (
        <Pressable
            style={{ flexDirection: "row", gap: 10 }}
            onPress={onSelect}
            testID={testId}
        >
            <View
                testID={`${text}-${isSelected ? "selected" : "not-selected"}`}
                style={{
                    height: 24,
                    width: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: Color.Black,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {isSelected && (
                    <View
                        style={{
                            height: 12,
                            width: 12,
                            borderRadius: 6,
                            backgroundColor: Color.Black,
                        }}
                    />
                )}
            </View>
            <Text>{text}</Text>
        </Pressable>
    );
}
