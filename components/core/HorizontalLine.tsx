import { View } from "react-native";

export default function HorizontalLine(): JSX.Element {
    return (
        <View
            style={{
                flex: 1,
                marginVertical: 5,
                borderBottomWidth: 2,
                borderBottomColor: "#ccc",
            }}
        />
    );
}
