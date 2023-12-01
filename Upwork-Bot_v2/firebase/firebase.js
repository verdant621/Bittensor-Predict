import firebase from 'firebase-admin';
import { promises as fs } from 'fs';

const rawData = await fs.readFile('./firebase/service-acount.json');
const serviceAccount = JSON.parse(rawData);

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`,
});

const db = firebase.database();
const accountRef = db.ref('accounts');
const jobRef = db.ref('jobs');

export async function saveAccount(data) {
    /**
     * email: string
     * name: string
     * status: string
     * token: string
     * type: string
     */
    try {
        data['createdAt'] = firebase.database.ServerValue.TIMESTAMP;
        await accountRef.push(data);
    } catch (error) {
        console.log(error);
    }
}

export async function getAvailableEmail() {
    let id, email;

    try {
        const _snapshot = await accountRef.orderByChild('status').equalTo('active').limitToFirst(1).once('value');
        const snapshot = await _snapshot.val();

        id = Object.keys(snapshot)[0];
        email = snapshot[id]['email'];
    } catch (error) { }

    return { id, email };
}

export async function getAccounts(status) {
    let accounts = [];

    try {
        const _snapshot = await accountRef.orderByChild('status').equalTo(status).once('value');
        const snapshot = await _snapshot.val();

        const accountIds = Object.keys(snapshot);

        for (const accountId of accountIds) {
            accounts.push({
                id: accountId,
                data: snapshot[accountId]
            })
        }
    } catch (error) { }

    return accounts;
}

export async function getRemainedEmail() {
    try {
        const _snapshot = await accountRef.orderByChild('status').equalTo('active').once('value');
        const snapshot = await _snapshot.val();

        return Object.keys(snapshot).length;
    } catch (error) {
        console.log(error);
        return -1;
    }
}

export async function updateStatus(id, status) {
    try {
        const documentRef = db.ref(`accounts/${id}`);

        await documentRef.update({ status });
    } catch (error) {
        console.log(error);
    }
}

export async function removeAccount(id) {
    try {
        const documentRef = db.ref(`accounts/${id}`);

        await documentRef.remove();
    } catch (error) {
        console.log(error);
    }
}

export async function updateAccount(id, data) {
    try {
        const documentRef = db.ref(`accounts/${id}`);

        await documentRef.update({ ...data });
    } catch (error) {
        console.log(error);
    }
}

export async function saveJob(email, job) {
    /**
     * title: string
     * link: string
     * description: string
     * email: string
     * connect: number
     * createdAt: timestamp
     */
    const data = { email, ...job };
    try {
        data['createdAt'] = firebase.database.ServerValue.TIMESTAMP;
        await jobRef.push(data);
    } catch (error) {
        console.log(error);
    }
}

export async function findJob(link) {
    try {
        const _snapshot = await jobRef.orderByChild('link').equalTo(link).limitToFirst(1).once('value');
        const snapshot = await _snapshot.val();

        if (snapshot) return true;
        else return false;
    } catch (error) {
        console.log(error);
    }

    return false;
}