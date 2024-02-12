import {
    ExportData,
    ExportJSONData,
    ExportPageState,
    UpdateIsDataCopied,
    exportPageReducer,
} from "../../data/reducers/exportPage.reducer";
import { assertExportPageStateEqual } from "../testUtils";

describe("Export Page Reducer", () => {
    const exportedData: string =
        "W3sibmFtZSI6IkEiLCJsaXN0VHlwZSI6Ikxpc3QiLCJkZWZhdWx0TmV3SXRlbVBvc2l0aW9uIjoiYm90dG9tIiwiaXNTZWxlY3RlZCI6ZmFsc2UsIml0ZW1zIjpbXX0seyJuYW1lIjoiQiIsImxpc3RUeXBlIjoiTGlzdCIsImRlZmF1bHROZXdJdGVtUG9zaXRpb24iOiJib3R0b20iLCJpc1NlbGVjdGVkIjpmYWxzZSwiaXRlbXMiOlt7Im5hbWUiOiIxIiwicXVhbnRpdHkiOjEsImlzQ29tcGxldGUiOmZhbHNlLCJpc1NlbGVjdGVkIjpmYWxzZX1dfSx7Im5hbWUiOiJDIiwibGlzdFR5cGUiOiJMaXN0IiwiZGVmYXVsdE5ld0l0ZW1Qb3NpdGlvbiI6ImJvdHRvbSIsImlzU2VsZWN0ZWQiOmZhbHNlLCJpdGVtcyI6W119XQ==";

    const state: ExportPageState = {
        exportedData: "",
        exportedJSONData: "",
        isDataCopied: false,
    };

    it("updates exported data", () => {
        const newState: ExportPageState = exportPageReducer(
            state,
            new ExportData(exportedData)
        );

        assertExportPageStateEqual(newState, {
            exportedData: exportedData,
            exportedJSONData: "",
            isDataCopied: false,
        });
    });

    it("updates exported JSON data", () => {
        const rawJSON: string = `{
            "lists": [
                {
                    "name": "my list",
                    "type": "Shopping",
                    "defaultNewItemPosition": "bottom",
                    "isSelected": false,
                    "items": [
                        {
                            "value": "celery",
                            "quantity": 2,
                            "isComplete": false,
                            "isSelected": false,
                        },
                        {
                            "value": "hummus",
                            "quantity": 1,
                            "isComplete": false,
                            "isSelected": false,
                        }
                    ]
                }
            ]`;

        const newState: ExportPageState = exportPageReducer(
            state,
            new ExportJSONData(rawJSON)
        );

        assertExportPageStateEqual(newState, {
            exportedData: "",
            exportedJSONData: rawJSON,
            isDataCopied: false,
        });
    });

    it("updates is data copied", () => {
        const newState: ExportPageState = exportPageReducer(
            state,
            new UpdateIsDataCopied(true)
        );

        assertExportPageStateEqual(newState, {
            exportedData: "",
            exportedJSONData: "",
            isDataCopied: true,
        });
    });
});
