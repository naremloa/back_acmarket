import { outputSuccess, outputError } from '../utils/outputFormat';
import {
  roomFind,
  subRoomCount,
  roomFindById,
  roomFindByIdAndUpdate,
} from '../models/room';

const createRoomSchema = ({
  name,
  intro = '',
  regulation = '',
  refund = '',
  lowNormalPrice = 0,
  lowHolidayPrice = 0,
  peakNormalPrice = 0,
  peakHolidayPrice = 0,
}, update = false) => {
  const mainPart = {
    name,
    content: { intro, regulation, refund },
    price: {
      lowSeasonWeekday: lowNormalPrice,
      lowSeasonWeekend: lowHolidayPrice,
      peakSeasonWeekday: peakNormalPrice,
      peakSeasonWeekend: peakHolidayPrice,
    },
  };
  if (update) return mainPart;
  return { ...mainPart, roomList: [] };
};

const createSubRoomSchema = ({
  id,
  name,
  picList,
}) => ({
  id,
  name,
  picList,
});

const getRoomAboutAll = async () => {
  const roomAll = await roomFind({});
  return roomAll;
};

const getSubRoomAboutAll = async () => {
  const roomAll = await getRoomAboutAll();
  const subRoomAll = [];
  roomAll.forEach(({ _id: cid, name, roomList }) => {
    roomList.forEach(({ _id: subCid, name: subName }) => {
      subRoomAll.push({
        subCid, subName, cid, name,
      });
    });
  });
  return subRoomAll;
};

/**
 * {
 *    5c5ed89dd6b4f80dbe3c1281: {
 *      max: 5,
 *      name: '超值多人房'
 *      price: {
 *        lowSeasonWeekday: 2000,
 *        lowSeasonWeekend: 2000,
 *        peakSeasonWeekday: 2000,
 *        peakSeasonWeekend: 2000,
 *      },
 *    }
 * }
 */
const getRoomAllMaxLengthAndPriceInfo = async () => {
  const roomAll = await getRoomAboutAll();
  const result = roomAll
    .reduce((acc, {
      _id, roomList, price, name,
    }) => ({
      ...acc,
      [_id.toString()]: {
        max: roomList.length,
        price,
        name,
      },
    }), {});
  return result;
};

const getRoomAll = async (req, res) => {
  const roomAll = await getRoomAboutAll();
  const result = [];
  roomAll.forEach((i) => {
    const {
      _id, name, price, roomList, allowing,
    } = i;
    // const formatRoomList = roomList.map(rI => ({
    //   type: _id,
    //   typeName: name,
    //   ...rI,
    // }));
    // result.push(...formatRoomList);
    result.push({
      roomCid: _id, roomName: name, subRoomList: roomList, price, allowing,
    });
  });
  return res.send(outputSuccess(result));
};

const getRoomOption = async (req, res) => {
  const roomAll = await getRoomAboutAll();
  const result = roomAll
    .map(({ _id, name, roomList }) => ({
      cid: _id,
      name,
      child: roomList.map(({ _id: subCid, name: subName }) => ({ cid: subCid, subName })),
    }));
  return res.send(outputSuccess(result));
};

const addSubRoom = async (req, res) => {
  const {
    body: {
      cid, name, picList = [],
    },
  } = req;
  const room = await roomFindById(cid);
  if (!room) return res.send(outputError('不存在該房型'));
  const newId = room.roomList.length;
  const newSubRoom = createSubRoomSchema({ id: newId, name, picList });
  const updateObj = {
    ...room,
    roomList: [...room.roomList, newSubRoom],
  };
  const result = await roomFindByIdAndUpdate(cid, updateObj);
  return res.send(outputSuccess({}, '新增成功'));
};

const updateSubRoom = async (req, res) => {
  const {
    body: {
      cid, id, name, picList = [],
    },
  } = req;
  const room = await roomFindById(cid);
  if (!room) return res.send(outputError('不存在該房型'));
  const subRoomList = room.roomList;
  const subRoomIndex = subRoomList.findIndex(i => i.id === Number(id));
  const oldSubRoom = subRoomList[subRoomIndex];
  if (subRoomIndex === -1) return res.send(outputError('不存在該房間'));
  subRoomList.splice(subRoomIndex, 1, createSubRoomSchema({
    id: oldSubRoom.id, name, picList,
  }));
  const updateObj = { ...room, roomList: subRoomList };
  const result = await roomFindByIdAndUpdate(cid, updateObj);
  return res.send(outputSuccess({}, '修改成功'));
};

const updateRoom = async (req, res) => {
  const {
    body: {
      cid, name, intro, regulation, refund,
      lowNormalPrice = 0,
      lowHolidayPrice = 0,
      peakNormalPrice = 0,
      peakHolidayPrice = 0,
    },
  } = req;
  const room = await roomFindById(cid);
  if (!room) return res.send(outputError('不存在該房型'));
  const updatePart = createRoomSchema({
    name,
    intro,
    regulation,
    refund,
    lowNormalPrice,
    lowHolidayPrice,
    peakNormalPrice,
    peakHolidayPrice,
  }, true);
  const updateObj = { ...room, ...updatePart };
  const result = await roomFindByIdAndUpdate(cid, updateObj);
  return res.send(outputSuccess({}, '修改成功'));
};

const getRoomDetail = async (req, res) => {
  const {
    body: {
      cid, id,
    },
  } = req;
  const room = await roomFindById(cid);
  if (!room) return res.send(outputError('不存在該房型'));
  const subRoom = room.roomList.find(i => i.id === Number(id));
  if (!subRoom) return res.send(outputError('不存在該房間'));
  const detail = {
    roomName: room.name,
    roomContent: room.content,
    subRoomName: subRoom.name,
    subRoomPicList: subRoom.picList,
  };
  return res.send(outputSuccess(detail, '查詢成功'));
};

const toggleAllowingRoom = async (req, res) => {
  const {
    body: { cid, status },
  } = req;
  const room = await roomFindById(cid);
  if (!room) return res.send(outputError('不存在該房型'));
  const updateObj = { allowing: !!status };
  const result = await roomFindByIdAndUpdate(cid, updateObj);
  return res.send(outputSuccess({}, `${status ? '開啟' : '關閉'}成功`));
};

const checkNotAllowingRooms = async () => {
  const room = await roomFind({ allowing: false });
  if (room.length) return true;
  return false;
};

export {
  getRoomAll,
  addSubRoom,
  updateSubRoom,
  updateRoom,
  getRoomDetail,
  getRoomAllMaxLengthAndPriceInfo,
  getRoomOption,
  getSubRoomAboutAll,
  toggleAllowingRoom,
  checkNotAllowingRooms,
};
