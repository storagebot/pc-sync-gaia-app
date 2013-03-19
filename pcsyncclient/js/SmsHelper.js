/*------------------------------------------------------------------------------------------------------------
 *File Name: SmsHelper.js
 *Created By: dxue@mozilla.com
 *Description: Manage Sms
 *Modified By:
 *Description:
 *----------------------------------------------------------------------------------------------------------*/

function smsHelper(jsonCmd, sendCallback, sendList, recvList) {
  try {
    switch (jsonCmd.command) {
    case "deleteMessage":
      {
        deleteMessage(jsonCmd, sendCallback);
        break;
      }
    case "getAllMessages":
      {
        getAllMessages(jsonCmd, sendCallback, sendList);
        break;
      }
    case "getMessage":
      {
        getMessage(jsonCmd, sendCallback);
        break;
      }
    case "listenMessage":
      {
        listenMessage(jsonCmd, sendCallback);
        break;
      }
    case "markReadMessage":
      {
        markReadMessage(jsonCmd, sendCallback);
        break;
      }
    case "sendMessage":
      {
        sendMessage(jsonCmd, sendCallback);
        break;
      }
    default:
      {
        debug('SmsHelper.js undefined command :' + jsonCmd.command);
        jsonCmd.result = RS_ERROR.COMMAND_UNDEFINED;
        jsonCmd.exdatalength = 0;
        jsonCmd.data = '';
        sendCallback(jsonCmd);
        break;
      }
    }
  } catch (e) {
    debug('SmsHelper.js smsHelper failed: ' + e);
    jsonCmd.result = RS_ERROR.UNKNOWEN;
    jsonCmd.exdatalength = 0;
    jsonCmd.data = '';
    sendCallback(jsonCmd);
  }
}

function deleteMessage(jsonCmd, sendCallback) {
  try {
    var message = JSON.parse(jsonCmd.data);
    var request = window.navigator.mozSms.delete(message);
    request.onsuccess = function(event) {
      if (event.target.result) {
        jsonCmd.result = RS_OK;
        jsonCmd.exdatalength = 0;
        jsonCmd.data = '';
        sendCallback(jsonCmd);
      } else {
        jsonCmd.result = RS_ERROR.SMS_MESSAGE_NOTFOUND;
        jsonCmd.exdatalength = 0;
        jsonCmd.data = '';
        sendCallback(jsonCmd);
      }
    };
    request.onerror = function(event) {
      jsonCmd.result = RS_ERROR.SMS_DELETEMESSAGE;
      jsonCmd.exdatalength = 0;
      jsonCmd.data = '';
      sendCallback(jsonCmd);
    };
  } catch (e) {
    debug('SmsHelper.js deleteMessage failed: ' + e);
    jsonCmd.result = RS_ERROR.UNKNOWEN;
    jsonCmd.exdatalength = 0;
    jsonCmd.data = '';
    sendCallback(jsonCmd);
  }
}

function getMessage(jsonCmd, sendCallback) {
  try {
    var request = window.navigator.mozSms.getMessage(jsonCmd.data);
    request.onsuccess = function(event) {
      var smsMessage = {
        'id': event.target.result.id,
        'delivery': event.target.result.delivery,
        'sender': event.target.result.sender,
        'receiver': event.target.result.receiver,
        'body': event.target.result.body,
        'timestamp': event.target.result.timestamp,
        'read': event.target.result.read
      };
      jsonCmd.result = RS_OK;
      jsonCmd.data = JSON.stringify(smsMessage);
      jsonCmd.exdatalength = 0;
      sendCallback(jsonCmd);
    };
    request.onerror = function(event) {
      jsonCmd.result = RS_ERROR.SMS_GETMESSAGE;
      jsonCmd.exdatalength = 0;
      jsonCmd.data = '';
      sendCallback(jsonCmd);
    };
  } catch (e) {
    debug('SmsHelper.js getMessage failed: ' + e);
    jsonCmd.result = RS_ERROR.UNKNOWEN;
    jsonCmd.exdatalength = 0;
    jsonCmd.data = '';
    sendCallback(jsonCmd);
  }
}

function getAllMessages(jsonCmd, sendCallback, sendList) {
  try {
    var filter = new MozSmsFilter();
    var messages = [];
    var request = window.navigator.mozSms.getMessages(filter, false);
    request.onsuccess = function(event) {
      var cursor = request.result;
      if (cursor.message) {
        var smsMessage = {
          'id': cursor.message.id,
          'delivery': cursor.message.delivery,
          'sender': cursor.message.sender,
          'receiver': cursor.message.receiver,
          'body': cursor.message.body,
          'timestamp': cursor.message.timestamp,
          'read': cursor.message.read
        };
        messages.push(smsMessage);
        cursor.
        continue ();
      } else {
        jsonCmd.result = RS_OK;
        jsonCmd.data = JSON.stringify(messages);
        jsonCmd.exdatalength = 0;
        sendCallback(jsonCmd);
      }
    };
    request.onerror = function(event) {
      jsonCmd.result = RS_ERROR.SMS_GETALLMESSAGES;
      jsonCmd.exdatalength = 0;
      jsonCmd.data = '';
      sendCallback(jsonCmd);
    };
  } catch (e) {
    debug('SmsHelper.js getAllMessages failed: ' + e);
    jsonCmd.result = RS_ERROR.UNKNOWEN;
    jsonCmd.exdatalength = 0;
    jsonCmd.data = '';
    sendCallback(jsonCmd);
  }
}

function listenMessage(jsonCmd, sendCallback) {
  try {
    window.navigator.mozSms.onreceived = function(event) {
      var smsMessage = {
        'id': event.message.id,
        'delivery': event.message.delivery,
        'sender': event.message.sender,
        'receiver': event.message.receiver,
        'body': event.message.body,
        'timestamp': event.message.timestamp,
        'read': event.message.read
      };
      jsonCmd.result = RS_OK;
      jsonCmd.exdatalength = 0;
      jsonCmd.data = JSON.stringify(smsMessage);
      sendCallback(jsonCmd);
    };
  } catch (e) {
    debug('SmsHelper.js listenMessage failed: ' + e);
    jsonCmd.result = RS_ERROR.UNKNOWEN;
    jsonCmd.exdatalength = 0;
    jsonCmd.data = '';
    sendCallback(jsonCmd);
  }
}

function markReadMessage(jsonCmd, sendCallback) {
  try {
    var message = JSON.parse(jsonCmd.data);
    var request = window.navigator.mozSms.markMessageRead(message.id, message.readbool);
    request.onsuccess = function(event) {
      jsonCmd.result = RS_OK;
      jsonCmd.exdatalength = 0;
      jsonCmd.data = '';
      sendCallback(jsonCmd);
    };
    request.onerror = function(event) {
      jsonCmd.result = RS_ERROR.SMS_MARDREAD;
      jsonCmd.exdatalength = 0;
      jsonCmd.data = '';
      sendCallback(jsonCmd);
    };
  } catch (e) {
    debug('SmsHelper.js markReadMessage failed: ' + e);
    jsonCmd.result = RS_ERROR.UNKNOWEN;
    jsonCmd.exdatalength = 0;
    jsonCmd.data = '';
    sendCallback(jsonCmd);
  }
}

function sendMessage(jsonCmd, sendCallback) {
  try {
    var message = JSON.parse(jsonCmd.data);
    var request = window.navigator.mozSms.send(message.id, message.message);
    request.onsuccess = function(event) {
      if (event.target.result) {
        var smsMessage = {
          'id': event.target.result.id,
          'delivery': event.target.result.delivery,
          'sender': event.target.result.sender,
          'receiver': event.target.result.receiver,
          'body': event.target.result.body,
          'timestamp': event.target.result.timestamp,
          'read': event.target.result.read
        };
        jsonCmd.result = RS_OK;
        jsonCmd.data = JSON.stringify(smsMessage);
        jsonCmd.exdatalength = 0;
        sendCallback(jsonCmd);
      } else {
        jsonCmd.result = RS_ERROR.SMS_SENDMESSAGE;
        jsonCmd.exdatalength = 0;
        jsonCmd.data = '';
        sendCallback(jsonCmd);
      }
    };
    request.onerror = function(event) {
      jsonCmd.result = RS_ERROR.SMS_SENDMESSAGE;
      jsonCmd.exdatalength = 0;
      jsonCmd.data = '';
      sendCallback(jsonCmd);
    };
  } catch (e) {
    debug('SmsHelper.js sendMessage failed: ' + e);
    jsonCmd.result = RS_ERROR.UNKNOWEN;
    jsonCmd.exdatalength = 0;
    jsonCmd.data = '';
    sendCallback(jsonCmd);
  }
}