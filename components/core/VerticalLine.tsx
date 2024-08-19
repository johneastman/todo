import { View } from "react-native";

type VerticalLineProps = {
    height?: number | string | undefined;
};

export default function VerticalLine(props: VerticalLineProps): JSX.Element {
    const { height } = props;
    return (
        <View
            style={{
                height: height,
                width: 2,
                backgroundColor: "#ccc",
            }}
        />
    );
}
