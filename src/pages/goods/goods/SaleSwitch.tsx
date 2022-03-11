import React from 'react';
import { useState } from 'react';
import { Image, Switch } from 'antd';
function SaleSwitch() {
  return <div>SaleSwitch</div>;
}

export default (props: any) => {
  const { defaultChecked, row, onChange } = props;
  const [checked, setChecked] = useState(defaultChecked);
  const handleClick = () => {
    if (!checked) {
      if (confirm('是否要下架该商品?')) {
        setChecked(true);
      }
    } else {
      if (confirm('是否要上架该商品?')) {
        setChecked(false);
      }
    }
  };

  return (
    <Switch
      checkedChildren="上架"
      unCheckedChildren="下架"
      onClick={handleClick}
      checked={checked}
      onChange={onChange}
    />
  );
};
