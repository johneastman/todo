import { View, Text, Pressable } from "react-native";
import { SelectionValue } from "../../types";
import { Color } from "../../utils";

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

    const value: SelectionValue<T> | undefined = data.filter(
        (d) => d.value === selectedValue
    )[0];

    return (
        <View style={{ gap: 10 }} testID={testId}>
            <View style={{ alignItems: "center" }}>
                {title !== undefined && (
                    <Text style={{ fontSize: 18 }}>{title}</Text>
                )}
            </View>

            {data.map((d: SelectionValue<T>, index: number): JSX.Element => {
                const pressableTestId: string = `${
                    testId ?? title ?? "radio-button"
                }-${d.label}`;

                return (
                    <Pressable
                        onPress={() => {
                            setSelectedValue(d.value);
                        }}
                        key={index}
                        style={{ flexDirection: "row", gap: 10 }}
                        testID={pressableTestId}
                    >
                        <RadioButtonView
                            isSelected={d === value}
                            text={d.label}
                        />
                    </Pressable>
                );
            })}
        </View>
    );
}

type RadioButtonProps = {
    isSelected: boolean;
    text: string;
};

function RadioButtonView(props: RadioButtonProps): JSX.Element {
    const { isSelected, text } = props;

    return (
        <>
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
                {isSelected ? (
                    <View
                        style={{
                            height: 12,
                            width: 12,
                            borderRadius: 6,
                            backgroundColor: Color.Black,
                        }}
                    />
                ) : null}
            </View>
            <Text>{text}</Text>
        </>
    );
}
