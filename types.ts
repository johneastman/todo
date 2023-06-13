import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type AppStackNavigatorParamList = {
    Lists: undefined;
    Items: {
        listName: string;
        listId: string;
    };
    Settings: undefined;
};

export type ListPageNavigationProp = NativeStackNavigationProp<
    AppStackNavigatorParamList,
    "Lists"
>;

export type ItemPageNavigationProp = NativeStackScreenProps<
    AppStackNavigatorParamList,
    "Items"
>;

// Radio Buttons
export type Position = "top" | "current" | "bottom";

export type RadioButton = {
    displayValue: string;
    position: Position;
}