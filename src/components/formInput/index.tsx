import React, { FC } from 'react';

import styles from './index.scss';

interface IProps {
  value: string,
  maxLength: number,
  onValChange: (e) => {},
  inputStyle: any,
}

const FormInput: FC<IProps> = (props: IProps) => {
  const { value, maxLength = -1, onValChange, inputStyle = {} } = props;

  function valChange(e) {
    e.persist()
    onValChange(e.target.value)
    return e
  }
  return (
    <div className={styles.inputCon} style={inputStyle}>
      <input type="text" className={styles.formInput} value={value} onChange={valChange} />
      { maxLength > 0 && <div className={styles.maxLength}>
        <p>{value.length}/{maxLength}</p>
      </div>}
    </div>
  )
}

export default FormInput