/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import usePrevious from './usePrevious';

// 根据visible参数判断组件是否已经关闭
function useClose(visible, closeTime = 200, onDestroy = () => {}) {
  const [outing, setOuting] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const prevVisible = usePrevious(visible);

  useEffect(() => {
    if (prevVisible && !visible) {
      setOuting(true);
      setTimeout(() => {
        setOuting(false);
        setShouldRender(false);
        onDestroy();
      }, closeTime);
    } else if (!prevVisible && visible) {
      setShouldRender(true);
    }
  }, [visible]);

  return [shouldRender, outing];
}

export default useClose;
