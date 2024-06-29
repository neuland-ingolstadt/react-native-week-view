import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import PropTypes from 'prop-types';

import { minutesInDay } from '../utils/dates';
import { minutesInDayToTop } from '../utils/dimensions';
import styles from './NowLine.styles';
import { useVerticalDimensionContext } from '../utils/VerticalDimContext';

const UPDATE_EVERY_MILLISECONDS = 60 * 1000; // 1 minute

const useMinutesNow = (updateEvery = UPDATE_EVERY_MILLISECONDS) => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const intervalCallbackId = setInterval(
      () => setNow(new Date()),
      updateEvery,
    );

    return () => intervalCallbackId && clearInterval(intervalCallbackId);
  }, [setNow, updateEvery]);

  return minutesInDay(now);
};

const NowLine = ({ beginAgendaAt = 0, color = '#e53935', width }) => {
  const { verticalResolution } = useVerticalDimensionContext();
  const minutesNow = useMinutesNow();

  const currentTop = useDerivedValue(() =>
    minutesInDayToTop(minutesNow, verticalResolution, beginAgendaAt),
  );

  const animatedStyle = useAnimatedStyle(() => ({
    top: withTiming(currentTop.value),
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        {
          borderColor: color,
          width,
        },
        animatedStyle,
      ]}
    >
      <View
        style={[
          styles.circle,
          {
            backgroundColor: color,
          },
        ]}
      />
    </Animated.View>
  );
};

export default React.memo(NowLine);
