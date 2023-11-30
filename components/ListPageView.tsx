import { useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import { ListPageNavigationProp } from "../types";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

interface ListPageViewProps<T> {
    menuOptions: Partial<NativeStackNavigationOptions>;
    items: T[];

    children?: React.ReactNode;
}

export default function ListPageView<T>(
    props: ListPageViewProps<T>
): JSX.Element {
    const { menuOptions, items, children } = props;

    let navigation = useNavigation<ListPageNavigationProp>();

    useEffect(() => {
        navigation.setOptions(menuOptions);
    }, [navigation, items]);

    return <>{children}</>;
}
