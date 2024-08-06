import { View, Button, StyleSheet } from "react-native";
import CustomText, { TextSize } from "./core/CustomText";

type QuantityProps = {
    value: number;
    setValue: (newValue: number) => void;
};

export default function Quantity(props: QuantityProps): JSX.Element {
    const { value, setValue } = props;

    return (
        <View
            style={{
                flexDirection: "row",
                gap: 20,
            }}
        >
            <View style={styles.quantityValueChangeButton}>
                <Button
                    title="-"
                    onPress={() => setValue(value - 1)}
                    disabled={value <= 1}
                    testID="decrease-quantity"
                />
            </View>
            <CustomText
                text={`${value}`}
                testId="add-update-item-quantity"
                size={TextSize.Medium}
            />
            <View style={styles.quantityValueChangeButton}>
                <Button
                    title="+"
                    onPress={() => setValue(value + 1)}
                    testID="increase-quantity"
                />
            </View>
        </View>
    );
}

export const styles = StyleSheet.create({
    quantityValueChangeButton: {
        width: 30,
    },
});
