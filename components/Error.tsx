import { Text } from "react-native";
import { RED } from "../utils";

type ErrorProps = {
    error?: string;
};

export default function Error(props: ErrorProps): JSX.Element {
    const { error } = props;
    return <Text style={{ color: RED }}>{error}</Text>;
}
