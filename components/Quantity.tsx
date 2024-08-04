import { View, Button, StyleSheet } from "react-native";
import Header from "./core/Header";

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
            <Header text={`${value}`} testID="add-update-item-quantity" />
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
