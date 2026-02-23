export const PRESETS = {
    DEFAULT_MASK: '********',
    EMAIL_MASK: (email: string) => {
        const [user, domain] = email.split('@');
        if (!domain) return '********';
        return `${user[0]}***@${domain}`;
    },
    CREDIT_CARD_MASK: (cc: string) => `****-****-****-${cc.slice(-4)}`,
};
