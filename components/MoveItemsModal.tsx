import { useEffect, useState } from "react";
import { COPY, Item, List, MOVE } from "../data/data";
import CustomModal from "./CustomModal";
import CustomRadioButtons from "./CustomRadioButtons";
import { MoveItemAction, SelectionValue } from "../types";
import CustomDropdown from "./CustomDropdown";
import { getItems, saveItems } from "../data/utils";
import { areCellsSelected } from "../utils";

interface MoveItemsModalProps {
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
    currentList: List;
    otherLists: List[];

    setItems: (items: Item[]) => void;
}

export default function MoveItemsModal(
    props: MoveItemsModalProps
): JSX.Element {
    const { isVisible, setIsVisible, currentList, otherLists, setItems } =
        props;

    // Data
    const actions: SelectionValue<MoveItemAction>[] = [COPY, MOVE];

    const sourceLists: List[] = [currentList].concat(otherLists);
    const labeledSourceLists: SelectionValue<List>[] = sourceLists.map(
        (l: List): SelectionValue<List> => ({
            label: l.id === currentList.id ? "Current List" : l.name,
            value: l,
        })
    );

    const labeledDestinationLists: SelectionValue<List>[] = otherLists.map(
        (l: List): SelectionValue<List> => ({
            label: l.name,
            value: l,
        })
    );

    // States
    const [action, setAction] = useState<MoveItemAction>("copy");
    const [source, setSource] = useState<List>(currentList);
    const [destination, setDestination] = useState<List>();

    // Effects
    useEffect(() => {
        // Reset values every time modal opens
        setAction("copy");
        setSource(currentList);
    }, [props]);

    const positiveAction = async () => {
        // Get source items
        const sourceItems: Item[] = await getItems(source.id);

        // Get destination items
        const destinationId: string = destination?.id ?? currentList.id;
        const destinationItems: Item[] = await getItems(destinationId);

        /**
         * 1. If the source list is the current list AND items in the current list are selected, only copy
         *    selected items into the destination list.
         * 2. Otherwise, copy ALL items into the destination list.
         * 3. De-select all items
         */
        const newItems: Item[] = destinationItems
            .concat(
                source.id === currentList.id && areCellsSelected(sourceItems)
                    ? sourceItems.filter((i) => i.isSelected)
                    : sourceItems
            )
            .map((i) => i.setIsSelected(false));

        if (action === "copy") {
            if (destinationId === currentList.id) {
                // If the destination is the current list, set the new items to the current list
                setItems(newItems);
            } else {
                // If the destination list is NOT the current list, set the new items to the other list
                setItems(sourceItems.map((i) => i.setIsSelected(false)));
                await saveItems(destinationId, newItems);
            }
        } else {
            // action === "move"
            const itemsToKeep: Item[] = areCellsSelected(sourceItems)
                ? sourceItems.filter((i) => !i.isSelected)
                : [];

            if (destinationId === currentList.id) {
                // If the destination is the current list:
                //     1. Set the new items to the current list
                //     2. Empty source list
                setItems(newItems);
                await saveItems(source.id, []);
            } else {
                // If the destination list is NOT the current list:
                //     1. Set the new items to the other list
                //     2. Empty current list OR set it to all non-selected items (based on whether items are
                //        selected or not).
                setItems(itemsToKeep);
                await saveItems(destinationId, newItems);
            }
        }

        // Dismiss the modal
        setIsVisible(false);
    };

    const negativeAction = () => {
        setIsVisible(false);
    };

    return (
        <CustomModal
            title={`Select list to ${action} items from into this list`}
            isVisible={isVisible}
            positiveActionText={action}
            positiveAction={positiveAction}
            negativeActionText={"Cancel"}
            negativeAction={negativeAction}
        >
            <CustomRadioButtons
                data={actions}
                setSelectedValue={function (newValue: MoveItemAction): void {
                    setAction(newValue);
                }}
                selectedValue={action}
            />

            <CustomDropdown
                placeholder="Select source list"
                data={labeledSourceLists}
                setSelectedValue={(newList: List) => setSource(newList)}
                selectedValue={source}
            />

            {/* If the source list is NOT the current list, the destination is the current list */}
            {source.id === currentList.id && (
                <CustomDropdown
                    placeholder="Select destination list"
                    data={labeledDestinationLists}
                    setSelectedValue={(newList: List) =>
                        setDestination(newList)
                    }
                    selectedValue={destination}
                />
            )}
        </CustomModal>
    );
}
