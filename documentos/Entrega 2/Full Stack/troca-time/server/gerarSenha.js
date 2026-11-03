import bcrypt from 'bcrypt';

const senha = 'Admin@123';
const hash = await bcrypt.hash(senha, 10);

console.log(hash);