import {useColorScheme} from 'react-native';
import {COLORS} from '../constants/config';

export const useTheme = () => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return {
        isDark,
        colors: isDark ? COLORS.dark : COLORS.light,
    };
};
