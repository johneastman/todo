type ExportPageActionType =
    | "EXPORT_DATA"
    | "EXPORT_JSON_DATA"
    | "UPDATE_IS_DATA_COPIED";

interface ExportPageAction {
    type: ExportPageActionType;
}

export type ExportPageState = {
    exportedData: string;
    exportedJSONData: string;
    isDataCopied: boolean;
};

export class ExportData implements ExportPageAction {
    type: ExportPageActionType = "EXPORT_DATA";
    newData: string;
    constructor(newData: string) {
        this.newData = newData;
    }
}

export class ExportJSONData implements ExportPageAction {
    type: ExportPageActionType = "EXPORT_JSON_DATA";
    newJSONData: string;
    constructor(newJSONData: string) {
        this.newJSONData = newJSONData;
    }
}

export class UpdateIsDataCopied implements ExportPageAction {
    type: ExportPageActionType = "UPDATE_IS_DATA_COPIED";
    newIsDataCopied: boolean;
    constructor(newIsDataCopied: boolean) {
        this.newIsDataCopied = newIsDataCopied;
    }
}

export function exportPageReducer(
    prevState: ExportPageState,
    action: ExportPageAction
): ExportPageState {
    const { exportedData, exportedJSONData, isDataCopied } = prevState;

    switch (action.type) {
        case "EXPORT_DATA": {
            const { newData } = action as ExportData;
            return {
                exportedData: newData,
                exportedJSONData: exportedJSONData,
                isDataCopied: isDataCopied,
            };
        }

        case "EXPORT_JSON_DATA": {
            const { newJSONData } = action as ExportJSONData;
            return {
                exportedData: exportedData,
                exportedJSONData: newJSONData,
                isDataCopied: isDataCopied,
            };
        }

        case "UPDATE_IS_DATA_COPIED": {
            const { newIsDataCopied } = action as UpdateIsDataCopied;
            return {
                exportedData: exportedData,
                exportedJSONData: exportedJSONData,
                isDataCopied: newIsDataCopied,
            };
        }

        default: {
            throw Error(
                `Unknown action for export page reducer: ${action.type}`
            );
        }
    }
}
