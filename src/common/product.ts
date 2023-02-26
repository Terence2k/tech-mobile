const getDefaultMenusByProductDetail = (productDetails, redirect) => {
  const {
    membercard_list: memberCardList = [],
    my_membercard_list: myMemberCardList = [],
    join_flag: joinFlag,
  } = productDetails;
  const productId = productDetails.product_id
    ? productDetails.product_id : productDetails.product.product_id;

  const jumpToOrderPreviewHandler = (mcuId = '') => ({
    type: 'browser/jumpToPage',
    payload: {
      path: '/orderPreview',
      params: {
        product_list: JSON.stringify([{
          productId,
          productDetailId: '',
          num: 1,
        }]),
        mcu_id: mcuId,
        user_ticket_id: '',
        redirect,
      },
    },
  });

  const jumpToMemberCardHandler = (memberCardId = '') => ({
    type: 'browser/jumpToPage',
    payload: {
      path: '/memberCard/detail',
      params: {
        membercard_id: memberCardId,
        redirect,
      },
    },
  });

  // 0 已经拥有
  if (joinFlag === 'y') {
    return [];
  }

  // 1 未拥有 - 付费获取
  // 1.1 正常购买
  if (myMemberCardList.length === 0 && memberCardList.length === 0) {
    return [{
      type: 'default', label: '立即购买', mode: 'blue', handler: jumpToOrderPreviewHandler(),
    }];
  }

  // 1.2 可通过现有会员卡折扣购买
  const myDiscountCard = myMemberCardList.find((card) => card.expire_time > Date.now() && card.free_flag === 'n');
  if (myDiscountCard) {
    return [{
      type: 'membercard', label: `会员享${myDiscountCard.discount}折`, mode: 'custom', background: '#FF9C48', handler: jumpToOrderPreviewHandler(myDiscountCard.mcu_id),
    }, {
      type: 'default', label: '立即购买', mode: 'blue', handler: jumpToOrderPreviewHandler(),
    }];
  }

  // 1.3
  const toBuyDiscountCard = memberCardList.length > 0 ? memberCardList[0] : null;
  if (toBuyDiscountCard) {
    // 1.3.1 正常购买+可获取会员卡然后免费购买  & 1.3.2 正常购买+可获取会员卡然后折扣购买
    return [{
      type: 'membercard',
      label: toBuyDiscountCard.free_flag === 'y' ? '开通会员免费看' : `开通会员享${toBuyDiscountCard.discount}折`,
      mode: 'black',
      handler: jumpToMemberCardHandler(toBuyDiscountCard.membercard_id),
    }, {
      type: 'default', label: '立即购买', mode: 'blue', handler: jumpToOrderPreviewHandler(),
    }];
  }

  // 保底
  return [{
    type: 'default', label: '立即购买', mode: 'blue', handler: jumpToOrderPreviewHandler(),
  }];
};

export default {
  getDefaultMenusByProductDetail,
};
