export default {
  title: '标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题',
  author: '海绵鲍勃',
  createTime: '2021-01-05',
  viewCount: 1000,
  desc: '描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述',
  // 富文本内容
  articleContent: [
    {
      node: [
        {
          type: 'text',
          attrs: {},
          html: '<strong><span style="color: #548DD4;">左对齐</span></strong>',
          text: '左对齐',
        },
        {
          type: 'text',
          attrs: {
            style: 'text-align: center;',
          },
          html: '居中对齐',
          text: '居中对齐',
        },
        {
          type: 'image_ad',
          subEntry: [
            {
              imageUrl: 'https://qcdn.beautifulreading.com/upload_files/2019/12/18/28a7bb22de769fb6bb3935287b2eb2b4.png',
              width: 1200,
              height: 773,
            },
          ],
        },
      ],
    },
  ],
  // 点赞数
  likeCount: 20,
  // 转发数
  postCount: 15,
};
