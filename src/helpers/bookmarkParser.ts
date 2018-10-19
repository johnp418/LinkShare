const R = require("ramda");
const { hash } = require("./util");

// node is a DT element
function _getNodeData(node: any) {
  const data: any = {};

  for (let i = 0; i !== node.childNodes.length; i++) {
    if (node.childNodes[i].tagName === "A") {
      // is bookmark
      data.type = "bookmark";
      data.url = node.childNodes[i].getAttribute("href");
      data.title = node.childNodes[i].textContent;

      const add_date = node.childNodes[i].getAttribute("add_date");
      if (add_date) {
        data.add_date = add_date;
      }

      const icon = node.childNodes[i].getAttribute("icon");
      if (icon) {
        data.icon = icon;
      }
    } else if (node.childNodes[i].tagName === "H3") {
      // is folder
      data.type = "folder";
      data.title = node.childNodes[i].textContent;

      const add_date = node.childNodes[i].getAttribute("add_date");
      const last_modified = node.childNodes[i].getAttribute("last_modified");

      if (add_date) {
        data.add_date = add_date;
      }

      if (last_modified) {
        data.last_modified = last_modified;
      }
      data.ns_root = null;
      if (node.childNodes[i].hasAttribute("personal_toolbar_folder")) {
        data.ns_root = "toolbar";
      }
      if (node.childNodes[i].hasAttribute("unfiled_bookmarks_folder")) {
        data.ns_root = "unsorted";
      }
    } else if (node.childNodes[i].tagName == "DL") {
      // store DL element reference for further processing the child nodes
      data.__dir_dl = node.childNodes[i];
    }
  }

  // if current item is a folder, but we haven't found DL element for it inside the DT element - check if the next sibling is DD
  // and if so check if it has DL element if yes - we just found the DL element for the folder
  if (data.type === "folder" && !data.__dir_dl) {
    if (node.nextSibling && node.nextSibling.tagName === "DD") {
      const dls = node.nextSibling.getElementsByTagName("DL");
      if (dls.length) {
        data.__dir_dl = dls[0];
      }
    }
  }

  return data;
}

function processDir(dir: any, level: number) {
  const children = dir.childNodes;
  const items = [];
  let menuRoot;

  for (let i = 0; i !== children.length; i++) {
    const child = children[i];
    if (!child.tagName) {
      continue;
    }
    if (child.tagName !== "DT") {
      continue;
    }
    const itemData = _getNodeData(child);

    if (itemData.type) {
      if (level === 0 && !itemData.ns_root) {
        // create menu root if need
        if (!menuRoot) {
          menuRoot = {
            title: "Menu",
            children: [],
            ns_root: "menu"
          };
        }
        if (itemData.type === "folder" && itemData.__dir_dl) {
          itemData.children = processDir(itemData.__dir_dl, level + 1);
          delete itemData.__dir_dl;
        }
        // @ts-ignore
        menuRoot.children.push(itemData);
      } else {
        if (itemData.type === "folder" && itemData.__dir_dl) {
          itemData.children = processDir(itemData.__dir_dl, level + 1);
          delete itemData.__dir_dl;
        }
        items.push(itemData);
      }
    }
  }
  if (menuRoot) {
    items.push(menuRoot);
  }
  return items;
}

export const flatten = (bookmarkTreeNodes: any, repositoryId: string) => {
  const repository = {};
  const linkMap = {};
  const rootIds: any = [];

  const flattenR = (parentId: any, treeNode: any) => {
    const {
      type,
      title,
      children,
      url,
      icon,
      add_date: addDate,
      last_modified: lastModified
    } = treeNode;

    const nodeId = hash(type + title + parentId + new Date().toISOString());

    console.log(
      "Current Node Id ",
      nodeId,
      "parentId",
      parentId,
      " Title ",
      title,
      " Type ",
      type
    );

    if (!parentId) {
      rootIds.push(nodeId);
    }

    const base = { type, title, repositoryId, parentId, addDate };

    // Folders are user specific, and bookmarks are universal
    if (type === "bookmark") {
      const noTrailingSlashUrl =
        url[url.length - 1] === "/" ? url.slice(0, url.length - 1) : url;
      const linkId = hash(noTrailingSlashUrl);
      const currNode = { ...base, linkId, id: nodeId, parentId };
      repository[nodeId] = currNode;
      linkMap[linkId] = { id: linkId, url, icon };
      return currNode;
    }
    // For each child, build an object
    const childNodes = R.map((child: any) => flattenR(nodeId, child), children);
    const childKeys = R.map((c: any) => c.id, childNodes);
    // console.log("ChildNodes ", childNodes, " childrenIds ", childKeys);

    const currNode = {
      ...base,
      id: nodeId,
      type: "folder",
      parentId,
      lastModified,
      children: childKeys
    };
    repository[nodeId] = currNode;
    return currNode;
  };
  bookmarkTreeNodes.forEach((node: any) => {
    console.log("Root Node ", node);
    flattenR(null, node);
  });

  // console.log("treeMap ", util.inspect(treeMap, false, null, true));
  return { root: rootIds, repository, link: linkMap };
};

export const parse = (htmlString: any, repoId: string) => {
  const parser = new DOMParser();
  const parsed: any = parser.parseFromString(htmlString, "text/html");
  const dls = parsed.documentElement.getElementsByTagName("DL");

  if (dls.length < 0) {
    throw new Error("File is malformed");
  } else {
    const res = processDir(dls[0], 0);
    return flatten(res, repoId);
  }
};
