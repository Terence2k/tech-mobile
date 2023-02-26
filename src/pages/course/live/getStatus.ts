export default function getStatus(detail) {
  const {
    my_membercard_list: myMemberCardList = [],
    join_flag: joinFlag,
    price,
    start_time: startTime,
    record_flag: recordFlag,
    price_type: priceType,
    live_status: liveStatus,
    need_password: needPassword,
  } = detail;

  // 未加入
  if (joinFlag === 'n') {
    if (liveStatus === 'done' && recordFlag === 'n') {
      return { type: 8 };
    }
    // 需要密码
    if (needPassword === 'y') {
      return { type: 7 };
    }
    // 未结束
    if (price === 0 || priceType === 'y') {
      // 免费
      return { type: 5 };
    }
    const myFreeCard = myMemberCardList.find((card) => card.expire_time > Date.now() && card.free_flag === 'y');
    if (myFreeCard) {
      return { type: 6, payload: myFreeCard };
    }

    return {};
  }

  // 已加入
  if (liveStatus === 'wait' && (startTime - 3600000 > Date.now())) {
    // 离开始时间超过一小时
    return { type: 1 };
  }
  // 已结束
  if (liveStatus === 'done' || liveStatus === 'expired') {
    // 结束时间超过一小时
    if (recordFlag === 'y') {
      // 有回看
      return { type: 2 };
    }
    return { type: 3 };
  }
  return { type: 4 };
}
