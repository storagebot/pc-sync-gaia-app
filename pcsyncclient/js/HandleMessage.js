/*------------------------------------------------------------------------------------------------------------
 *File Name: HandleMessage.js
 *Created By: dxue@mozilla.com
 *Description: Distribute the recived data to processing module
 *Modified By:
 *Description:
 *----------------------------------------------------------------------------------------------------------*/

function handleMessage(socket, jsonCmd, sendCallback, recvData) {
  try {
    switch (jsonCmd.type) {
    case CMD_TYPE.app:
      {
        appManagerHelper(socket, jsonCmd, sendCallback, recvData);
        break;
      }
    case CMD_TYPE.contact:
      {
        contactHelper(socket, jsonCmd, sendCallback, recvData);
        break;
      }
    case CMD_TYPE.deviceInfo:
      {
        deviceInfoHelper(socket, jsonCmd, sendCallback, recvData);
        break;
      }
    case CMD_TYPE.music:
      {
        musicHelper(socket, jsonCmd, sendCallback, recvData);
        break;
      }
    case CMD_TYPE.picture:
      {
        pictureHelper(socket, jsonCmd, sendCallback, recvData);
        break;
      }
    case CMD_TYPE.sms:
      {
        smsHelper(socket, jsonCmd, sendCallback, recvData);
        break;
      }
    case CMD_TYPE.video:
      {
        videoHelper(socket, jsonCmd, sendCallback, recvData);
        break;
      }
    case CMD_TYPE.file:
      {
        fileHelper(socket, jsonCmd, sendCallback, recvData);
        break;
      }
    case CMD_TYPE.listen:
      {
        listenHelper(socket, jsonCmd, sendCallback, recvData);
        break;
      }
    default:
      {
        console.log('HandleMessage.js undefined type :' + jsonCmd.type);
        jsonCmd.result = RS_ERROR.TYPE_UNDEFINED;
        sendCallback(socket, jsonCmd, null);
        break;
      }
    }
  } catch (e) {
    console.log('HandleMessage.js handleMessage failed: ' + e);
    jsonCmd.result = RS_ERROR.UNKNOWEN;
    sendCallback(socket, jsonCmd, null);
  }
}

function multiReplyFinish(socket, type, jsonCmd, sendCallback) {
  var finishMessage = {
    type: type,
    callbackID: 'enumerate-done',
    detail: null
  };
  console.log('HandleMessage.js multiReplyFinish enumerate-done!!!!!!!!!!!!!!!!!');
  jsonCmd.result = RS_OK;
  var finishData = JSON.stringify(finishMessage);
  sendCallback(socket, jsonCmd, finishData);
}