import React from 'react';
import TreeView, { flattenTree } from "react-accessible-treeview";

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
const data = flattenTree(folder);

export default function TreeViewMenu() {
   
    return (
        <div>
            <div className="directory my-2">
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
        <i className="fas fa-chevron-down text-primary" >&ensp;</i>
    ) : (
        // <FaRegFolder color="e8a87c" className="icon" />
        <i className="fas fa-chevron-right text-primary" >&ensp;</i>
    );

const FileIcon = ({ filename }) => {
    const extension = filename.slice(filename.lastIndexOf(".") + 1);
    switch (extension) {
        case "js":
            return <i class="fab fa-js text-primary">&ensp;</i>//<DiJavascript color="yellow" className="icon" />;
        case "css":
            return <i class="fab fa-css3 text-primary">&ensp;</i>//<DiCss3 color="turquoise" className="icon" />;
        case "json":
            return <i class="fab fa-npm text-primary">&ensp;</i>//<FaList color="yellow" className="icon" />;
        case "npmignore":
            return <i class="fab fa-npm text-primary">&ensp;</i>//<DiNpm color="red" className="icon" />;
        default:
            return null;
    }
};
