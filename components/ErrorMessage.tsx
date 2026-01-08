import {StyleSheet, Text, View, Pressable} from 'react-native';
import {COLORS} from '../constants/config';

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
}

export const ErrorMessage = ({message, onRetry}: ErrorMessageProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.message}>{message}</Text>
            {onRetry && (
                <Pressable
                    style={({pressed}) => [
                        styles.retryButton,
                        pressed && styles.retryButtonPressed,
                    ]}
                    onPress={onRetry}
                >
                    <Text style={styles.retryText}>Retry</Text>
                </Pressable>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: `${COLORS.error}15`,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.error,
        alignItems: 'center',
        gap: 10,
    },
    message: {
        color: COLORS.error,
        fontSize: 14,
        textAlign: 'center',
    },
    retryButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        backgroundColor: COLORS.error,
        borderRadius: 6,
    },
    retryButtonPressed: {
        opacity: 0.8,
    },
    retryText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
});
