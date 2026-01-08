import {useState} from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    ActivityIndicator,
} from 'react-native';
import {COLORS} from '../constants/config';
import {useTheme} from '../hooks/useTheme';

interface SearchBarProps {
    onSearch: (query: string) => void;
    isLoading?: boolean;
}

export const SearchBar = ({onSearch, isLoading = false}: SearchBarProps) => {
    const [query, setQuery] = useState('');
    const {colors} = useTheme();

    const handleChange = (text: string) => {
        setQuery(text);
        onSearch(text);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: colors.card,
                        color: colors.text,
                        borderColor: COLORS.primary,
                    },
                ]}
                placeholder="Search a login..."
                placeholderTextColor={colors.textSecondary}
                value={query}
                onChangeText={handleChange}
                autoCapitalize="none"
                autoCorrect={false}
            />
            {isLoading && (
                <View style={styles.loader}>
                    <ActivityIndicator color={COLORS.primary} size="small"/>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        maxWidth: 400,
        position: 'relative',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingRight: 45,
        fontSize: 16,
    },
    loader: {
        position: 'absolute',
        right: 15,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
    },
});
