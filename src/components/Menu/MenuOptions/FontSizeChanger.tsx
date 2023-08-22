import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';
import { FontSize } from '@type/font-size';

const FontSizeChanger = () => {
  const { t } = useTranslation();
  const fontSize = useStore((state) => state.fontSize);
  const setFontSize = useStore((state) => state.setFontSize);

  const changeFontSize = (fontSize: FontSize) => {
    setFontSize(fontSize);
  };

  useEffect(() => {
    document.documentElement.setAttribute('font-size', fontSize);
  }, [fontSize]);

  return fontSize ? (
    <select
      className='items-center gap-3 btn btn-neutral'
      aria-label='change font size'
      onChange={(e) => changeFontSize(e.target.value as FontSize)}
      value={fontSize}
    >  
      <option value='sm'>Small</option>
      <option value='md'>Medium</option>
      <option value='lg'>Large</option>
    </select>
  ) : (
    <></>
  );
};

export default FontSizeChanger;
