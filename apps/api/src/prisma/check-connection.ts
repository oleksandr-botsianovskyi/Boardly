import { db } from './db.js';

export default async function check_connection() {
  try {
    const result = await db.connect();
    console.log(result);

    console.log('Success');
  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
  }
}
