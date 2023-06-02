import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Item } from "../data/Item";
import { getItems } from "../data/utils";
import { pluralize } from "../utils";

interface NumItemsProps {
    listId: string;
}

export default function NumItems(props: NumItemsProps): JSX.Element {
    const [numItems, setNumItems] = useState<number>();

    useEffect(() => {
        const fetchData = async () => {
            let items: Item[] = await getItems(props.listId);
            setNumItems(items.length);
        };

        fetchData();
    }, []);

    return (
        <View>
            {numItems !== undefined ? (
                <Text style={{ fontSize: 15 }}>
                    {numItems} {pluralize(numItems, "Item", "Items")}
                </Text>
            ) : null}
        </View>
    );
}
