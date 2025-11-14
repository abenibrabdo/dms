import bcrypt from 'bcryptjs';
const SALT_ROUNDS = 12;
export const hashPassword = async (plain) => {
    return bcrypt.hash(plain, SALT_ROUNDS);
};
export const verifyPassword = async (plain, hashed) => {
    return bcrypt.compare(plain, hashed);
};
