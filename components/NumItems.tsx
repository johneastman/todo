import { useEffect, useState } from "react";
import { Text } from "react-native";
import { Item } from "../data/Item";
import { getItems } from "../data/utils";
import { pluralize } from "../utils";
import { List } from "../data/List";

interface NumItemsProps {
    list: List;
    styles: {};
}

export default function NumItems(props: NumItemsProps): JSX.Element {
    const { list, styles } = props;

    const [numItems, setNumItems] = useState<number>();

    useEffect(() => {
        const fetchData = async () => {
            let items: Item[] = await getItems(list.id);
            setNumItems(items.length);
        };

        fetchData();
    }, []);

    return (
        <>
            {numItems !== undefined ? (
                <Text style={styles}>
                    {numItems} {pluralize(numItems, "Item", "Items")}
                </Text>
            ) : null}
        </>
    );
}
