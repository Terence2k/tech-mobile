import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { AudioPlayer, VideojsPlayer } from 'components';

import styles from './index.scss';

const parseStyles = (res): { [key: string]: any } => res
  .split(';')
  .filter((style) => style.split(':')[0] && style.split(':')[1])
  .map((style) => [
    style.split(':')[0].trim().replace(/-./g, (c) => c.substr(1).toUpperCase()),
    style.split(':')[1].trim(),
  ])
  .reduce((styleObj, style) => ({
    ...styleObj,
    [style[0]]: style[1],
  }), {});

const Index: React.FC = (props: any) => {
  const { node = [] } = props;

  const parseAttributes = (item: { [key: string]: any }): { [key: string]: any } => {
    const className = classNames(styles.text, {
      [styles[item.tag]]: !!item.tag,
    });
    const style = item.attrs && item.attrs.style ? parseStyles(item.attrs.style) : {};
    const dangerouslySetInnerHTML = { __html: item.html || item.text };

    return { className, style, dangerouslySetInnerHTML };
  };

  return (
    <>
      {
        [...node].map((item, index) => (
          <Fragment key={index.toString()}>
            {
              item.type === 'text' && (
                <div {...parseAttributes(item)} />
              )
            }
            {
              item.type === 'image_ad' && item.subEntry && item.subEntry.length > 0 && (
                <>
                  {
                    item.subEntry.map((image, imageIdx) => (
                      <Fragment key={imageIdx.toString()}>
                        <img style={{ width: '100%', marginTop: '5px' }} src={image.imageUrl} alt="" />
                        {
                          image.caption && (
                            <div className={styles.caption}>{image.caption}</div>
                          )
                        }
                      </Fragment>
                    ))
                  }
                </>
              )
            }
            {
              item.type === 'video' && (
                <VideojsPlayer style={{ marginTop: '5px' }} poster={item.thumbUrl} url={item.videoUrl} />
              )
            }
            {
              item.type === 'audio' && (
                <AudioPlayer url={item.src} durationText={item.duration} />
              )
            }
          </Fragment>
        ))
      }
    </>
  );
};

Index.defaultProps = {
  // html: '',
  node: [],
};

Index.propTypes = {
  // html: PropTypes.string,
  node: PropTypes.arrayOf(PropTypes.object),
};

export function nodeParser(node: any = {}) {
  const ret: any = {
    type: node.type,
    attrs: {},
  };

  if (node.tag) ret.tag = node.tag;
  if (node.attrs) ret.attrs = node.attrs;
  if (node.html) ret.html = node.html;
  if (node.text) ret.text = node.text;
  if (node.sub_entry) {
    ret.subEntry = node.sub_entry.map((entry) => ({
      imageUrl: entry.image_url,
      width: entry.width,
      height: entry.height,
      caption: entry.caption,
    }));
  }
  if (node.thumb_url) ret.thumbUrl = node.thumb_url;
  if (node.video_url) ret.videoUrl = node.video_url;
  if (node.src) ret.src = node.src;
  if (node.duration) ret.duration = node.duration;

  return ret;
}

export default Index;
