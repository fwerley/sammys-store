import React, { useCallback, useState, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";

export default function DraftEditor({ setDescription, value }) {

    const [content, setContent] = useState(value);
    const [logs, setLogs] = useState([]);


    const appendLog = useCallback(
        (message) => {
            console.log("logs = ", logs);
            const newLogs = [...logs, message];
            setLogs(newLogs);
        },
        [logs, setLogs]
    );

    const config = useMemo(
        () => ({
            readonly: false,
            enableDragAndDropFileToEditor: true,
            "uploader": {
                "insertImageAsBase64URI": true
            }
        }),
        []
    );

    // const onChange = useCallback(
    //     (newContent) => {
    //         appendLog(`onChange triggered with ${newContent}`);
    //     },
    //     [appendLog]
    // );

    const onChange = (newContent) => {        
        setContent(newContent)
        setDescription(newContent);
    }

    const onBlur = useCallback(
        (newContent) => {
            appendLog(`onBlur triggered with ${newContent}`);
            setContent(newContent);
        },
        [appendLog, setContent]
    );

    return (
        <div>
            <JoditEditor
                value={content}
                config={config}
                tabIndex={1}
                // onBlur={onBlur}
                onChange={onChange}
            />
        </div>
    );
}
