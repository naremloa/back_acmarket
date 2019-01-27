import { outputSuccess } from '../utils/outputFormat';
import { userFindOne } from '../models/login';
import { routerFind } from '../models/router';
import {
  idFindOne,
} from '../models/role';

const expandRouter = (routerTree) => {
  const expandArr = [];
  function recursiveRouterTree(node) {
    node.forEach((item) => {
      const {
        dataKey, id, name, rootId, childNode, apiRoot,
      } = item;
      expandArr.push({
        dataKey, id, name, rootId, apiRoot,
      });
      if (childNode.length) recursiveRouterTree(childNode);
    });
  }
  recursiveRouterTree(routerTree);
  return expandArr;
};

const getRouterAboutAll = async () => {
  const routerAll = await routerFind({});
  return routerAll;
};

const getRouterAboutRole = async (routerGroup = null) => {
  const routerExpandAll = expandRouter(await getRouterAboutAll());
  const routerAboutRole = [];
  if (!routerGroup) return routerExpandAll;
  routerExpandAll.forEach((router) => {
    if (routerGroup.includes(router.id)) routerAboutRole.push(router);
  });
  return routerAboutRole;
};

const getRouter = async (req, res) => {
  const { session: { userInfo } } = req;
  const { role: { routerGroup } } = await userFindOne({ account: userInfo.account });
  const list = await getRouterAboutRole(routerGroup);
  res.send(outputSuccess(list));
};

const getRouterRoleList = async (req, res) => {
  const { query: { id: queryId } } = req;
  const { routerGroup } = await idFindOne(queryId);
  const routerAll = await getRouterAboutAll();

  function recursiveRouterTree({
    id, name, rootId, childNode,
  }) {
    let checked = false;
    if (routerGroup.includes(id)) checked = true;
    if (childNode.length) childNode = childNode.map(recursiveRouterTree);
    return {
      id, name, rootId, checked, childNode,
    };
  }
  const result = routerAll.map(recursiveRouterTree);
  return res.send(outputSuccess(result));
};

const getRouterAll = async (req, res) => {
  const routerAll = await getRouterAboutAll();
  function recursiveRouterTree({
    id, name, rootId, childNode,
  }) {
    if (childNode.length) childNode = childNode.map(recursiveRouterTree);
    return {
      id, name, rootId, childNode,
    };
  }
  const result = routerAll.map(recursiveRouterTree);
  return res.send(outputSuccess(result));
};

export {
  expandRouter,
  routerFind,
  getRouterAboutRole,
  getRouter,
  getRouterRoleList,
  getRouterAll,
};
