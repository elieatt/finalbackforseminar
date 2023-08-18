const axios = require('axios');
const url = process.env.Bra2Host;
async function getUserData(id) {
    const body = {
        id: id
    }
    try {
        const response = await axios.post(`${url}/api/findUser`, body);
        if (response.status != 200) {
            throw new Error(`Request failed with status code ${response.status}`);
        }
        //console.log(response.data[0].livestream_id=="0");
        return response.data[0];

    } catch (error) {
       
        console.error(error);
        throw error;

    }
}
async function setLiveStreamId(userId, liveStreamId) {

    const body = {
        livestream_id: liveStreamId,
        user_id: userId
    };

    try {
        const response = await axios.post(`${url}/api/livesStream/store_livestream_field`, body);
        if (response.status == 200) {
            //console.log(true);
            return true;
        }
        throw new Error(`Request failed with status code ${response.status}`);
    } catch (error) {
        console.log(error);
        throw error;
    }
}
module.exports = {
    getUserData,
    setLiveStreamId,
};
