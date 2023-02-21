import React from 'react';
import TreeView, { flattenTree } from "react-accessible-treeview";

const data = flattenTree(folder);

export default function TreeViewMenu() {
    const folder = {
        name: "",
        children: [
            {
                name: "src",
                children: [{ name: "index.js" }, { name: "styles.css" }],
            },
            {
                name: "node_modules",
                children: [
                    {
                        name: "react-accessible-treeview",
                        children: [{ name: "index.js" }],
                    },
                    { name: "react", children: [{ name: "index.js" }] },
                ],
            },
            {
                name: ".npmignore",
            },
            {
                name: "package.json",
            },
            {
                name: "webpack.config.js",
            },
        ],
    };

    return (
        <div>
            <div className="directory">
                <TreeView
                    data={data}
                    aria-label="directory tree"
                    nodeRenderer={({
                        element,
                        isBranch,
                        isExpanded,
                        getNodeProps,
                        level,
                    }) => (
                        <div {...getNodeProps()} style={{ paddingLeft: 20 * (level - 1) }}>
                            {isBranch ? (
                                <FolderIcon isOpen={isExpanded} />
                            ) : (
                                <FileIcon filename={element.name} />
                            )}

                            {element.name}
                        </div>
                    )}
                />
            </div>
        </div>
    )
}

const FolderIcon = ({ isOpen }) =>
    isOpen ? (
        // <FaRegFolderOpen color="e8a87c" className="icon" />
        <i className="fas fa-folder-open" />
    ) : (
        // <FaRegFolder color="e8a87c" className="icon" />
        <i className="fas fa-folder-open" />
    );

const FileIcon = ({ filename }) => {
    const extension = filename.slice(filename.lastIndexOf(".") + 1);
    switch (extension) {
        case "js":
            return <DiJavascript color="yellow" className="icon" />;
        case "css":
            return <DiCss3 color="turquoise" className="icon" />;
        case "json":
            return <FaList color="yellow" className="icon" />;
        case "npmignore":
            return <DiNpm color="red" className="icon" />;
        default:
            return null;
    }
};
